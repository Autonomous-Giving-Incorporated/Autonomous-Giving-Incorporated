import { forwardIrApi, type IrApiEnv } from "./ir-api.ts";
import {
  matchSuiteRoute,
  rewriteUpstreamLocation,
  suitePrefixForOrigin,
} from "./suite-routes.ts";

/** Shared with Vercel and Pages `_headers`. Next hydration needs script/style unsafe-inline. Fonts are self-hosted via next/font. */
export const CONTENT_SECURITY_POLICY =
  "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'";

/**
 * CSP for proxied Portfolio Signals and Impact Relay HTML when the upstream
 * response does not send one. Allows the existing Portfolio Signals
 * supabase-js module on jsDelivr and the platform Supabase project.
 * Do not apply this policy to the AGI marketing export.
 */
export const SUITE_CONTENT_SECURITY_POLICY =
  "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https://utdioxwiskzatwoejgiu.supabase.co; connect-src 'self' https://utdioxwiskzatwoejgiu.supabase.co wss://utdioxwiskzatwoejgiu.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": CONTENT_SECURITY_POLICY,
};

const SAFE_UPSTREAM_HEADERS = [
  "accept",
  "accept-language",
  "cache-control",
  "if-modified-since",
  "if-none-match",
  "range",
  "user-agent",
] as const;

function withSecurityHeaders(
  response: Response,
  options?: { contentSecurityPolicy?: string },
): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    if (key === "Content-Security-Policy") {
      headers.set(key, options?.contentSecurityPolicy ?? value);
      continue;
    }
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
  const headers = new Headers();
  for (const header of SAFE_UPSTREAM_HEADERS) {
    const value = request.headers.get(header);
    if (value) headers.set(header, value);
  }

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

  const upstreamCsp = responseHeaders.get("Content-Security-Policy");
  return withSecurityHeaders(
    new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    }),
    {
      contentSecurityPolicy: upstreamCsp ?? SUITE_CONTENT_SECURITY_POLICY,
    },
  );
}

type AssetFetcher = {
  fetch: (input: Request) => Promise<Response>;
};

export const suiteGateway = {
  async fetch(
    request: Request,
    env: { ASSETS: AssetFetcher } & IrApiEnv,
  ): Promise<Response> {
    const url = new URL(request.url);
    const route = matchSuiteRoute(url.pathname);
    if (route.kind === "ir-api") {
      return withSecurityHeaders(await forwardIrApi(request, env));
    }
    if (route.kind === "deny-api") {
      return withSecurityHeaders(
        Response.json(
          { error: "not_found" },
          {
            status: 404,
            headers: { "cache-control": "no-store" },
          },
        ),
      );
    }

    if (route.kind === "redirect") {
      const location = new URL(route.pathname + url.search, url.origin);
      return withSecurityHeaders(
        Response.redirect(location.toString(), route.status),
      );
    }

    if (route.kind === "proxy") {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return withSecurityHeaders(
          new Response("Method Not Allowed", {
            status: 405,
            headers: { Allow: "GET, HEAD" },
          }),
        );
      }
      return proxySuite(request, route.origin, route.pathname);
    }

    return withSecurityHeaders(await env.ASSETS.fetch(request));
  },
};

export default suiteGateway;
