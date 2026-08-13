import {
  matchSuiteRoute,
  rewriteUpstreamLocation,
  suitePrefixForOrigin,
} from "./suite-routes";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function proxySuite(
  request: Request,
  origin: string,
  pathname: string,
): Promise<Response> {
  const incoming = new URL(request.url);
  const target = new URL(pathname + incoming.search, origin);
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("cf-connecting-ip");
  headers.delete("cf-ipcountry");
  headers.delete("cf-ray");
  headers.delete("cf-visitor");
  headers.delete("x-forwarded-host");

  const upstream = await fetch(
    new Request(target, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : request.body,
      redirect: "manual",
    }),
  );

  const responseHeaders = new Headers(upstream.headers);
  const location = responseHeaders.get("Location");
  if (location) {
    responseHeaders.set(
      "Location",
      rewriteUpstreamLocation(
        location,
        incoming.origin,
        origin,
        suitePrefixForOrigin(origin),
      ),
    );
  }

  return withSecurityHeaders(
    new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    }),
  );
}

type AssetFetcher = {
  fetch: (input: Request) => Promise<Response>;
};

const suiteGateway = {
  async fetch(
    request: Request,
    env: { ASSETS: AssetFetcher },
  ): Promise<Response> {
    const url = new URL(request.url);
    const route = matchSuiteRoute(url.pathname);

    if (route.kind === "redirect") {
      const location = new URL(route.pathname + url.search, url.origin);
      return withSecurityHeaders(
        Response.redirect(location.toString(), route.status),
      );
    }

    if (route.kind === "proxy") {
      return proxySuite(request, route.origin, route.pathname);
    }

    return env.ASSETS.fetch(request);
  },
};

export default suiteGateway;
