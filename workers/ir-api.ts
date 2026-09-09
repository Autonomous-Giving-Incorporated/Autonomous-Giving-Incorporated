/** Routing only: FI + existing Supabase validate the unchanged human bearer. */
export type IrApiEnv = {
  FI_WORKER_ORIGIN?: string;
  FI_WORKER_ALLOWED_ORIGIN?: string;
};

function error(status: number, code: string, headers = {}): Response {
  return Response.json(
    { error: code },
    {
      status,
      headers: { ...headers, "cache-control": "no-store" },
    },
  );
}

export async function forwardIrApi(
  request: Request,
  env: IrApiEnv,
): Promise<Response> {
  const url = new URL(request.url);
  if (request.url.includes("?")) return error(400, "query_not_allowed");
  if (!["GET", "POST"].includes(request.method)) {
    return error(405, "method_not_allowed", { Allow: "GET, POST" });
  }
  const authorization = request.headers.get("authorization");
  // Syntax/size only, NOT JWT verification or tenant authorization.
  if (
    !authorization ||
    authorization.length > 8192 ||
    !/^Bearer [^\s,]+$/i.test(authorization)
  ) {
    return error(401, "authentication_required");
  }
  const requestOrigin = request.headers.get("origin");
  // FI currently has no cross-origin IR API contract or preflight handler.
  // Preserve a same-origin browser Origin verbatim, never replace with FI's host.
  if (requestOrigin !== null && requestOrigin !== url.origin)
    return error(403, "origin_not_allowed");
  const origin = env.FI_WORKER_ORIGIN;
  if (
    !origin ||
    origin !== env.FI_WORKER_ALLOWED_ORIGIN ||
    !/^https:\/\/portfolio-signals\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.workers\.dev$/.test(
      origin,
    ) ||
    origin === url.origin
  ) {
    return error(503, "ir_upstream_unavailable");
  }
  if (request.headers.has("content-encoding"))
    return error(415, "content_encoding_not_allowed");
  let body: Uint8Array<ArrayBuffer> | undefined;
  if (request.method === "POST") {
    const reader = request.body?.getReader();
    if (!reader) return error(400, "invalid_request");
    const chunks: Uint8Array[] = [];
    let size = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("body_timeout")), 10000);
    });
    try {
      while (true) {
        const { value, done } = await Promise.race([reader.read(), timeout]);
        if (done) break;
        size += value.byteLength;
        if (size > 1024) {
          void reader.cancel().catch(() => {});
          return error(413, "payload_too_large");
        }
        chunks.push(value);
      }
      if (size === 0) return error(400, "invalid_request");
      body = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        body.set(chunk, offset);
        offset += chunk.byteLength;
      }
    } catch {
      void reader.cancel().catch(() => {});
      return error(400, "invalid_request");
    } finally {
      clearTimeout(timer);
    }
  }
  const headers = new Headers();
  for (const name of ["authorization", "content-type", "accept", "origin"]) {
    const value = request.headers.get(name);
    if (value !== null) headers.set(name, value);
  }
  headers.set("cache-control", "no-store");
  try {
    // Buffered <=1KiB body; no redirects, retries, cookies or service credential.
    const upstream = await fetch(
      new Request(origin + url.pathname, {
        method: request.method,
        headers,
        body,
        redirect: "manual",
        signal: AbortSignal.timeout(30000),
      }),
    );
    if (upstream.status >= 300 && upstream.status < 400) {
      void upstream.body?.cancel().catch(() => {});
      return error(502, "ir_upstream_redirect");
    }
    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.set("cache-control", "no-store");
    responseHeaders.delete("set-cookie");
    responseHeaders.delete("location");
    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return error(503, "ir_upstream_unavailable");
  }
}
