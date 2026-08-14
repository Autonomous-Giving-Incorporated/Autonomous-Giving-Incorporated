/**
 * Suite path routing for the AGI static host.
 *
 * Mirrors vercel.json redirects/rewrites so `/portfolio-signals/` and
 * `/impact-relay/` keep working on Cloudflare without merging those
 * product repos. This is edge routing, not an AGI backend.
 */

export const PORTFOLIO_SIGNALS_ORIGIN = "https://fund-intel-ten.vercel.app";
export const IMPACT_RELAY_ORIGIN = "https://impact-relay.vercel.app";

const PORTFOLIO_SIGNALS_HTML_PAGES: Record<string, string> = {
  "": "/index.html",
  "/": "/index.html",
  "/workspace": "/workspace.html",
  "/workspace/": "/workspace.html",
  "/workspace.html": "/workspace.html",
  "/sponsors": "/sponsors.html",
  "/sponsors/": "/sponsors.html",
  "/grants": "/grants.html",
  "/grants/": "/grants.html",
  "/members": "/members.html",
  "/members/": "/members.html",
  "/donor-impact": "/donor-impact.html",
  "/donor-impact/": "/donor-impact.html",
  "/finance-impact": "/finance-impact.html",
  "/finance-impact/": "/finance-impact.html",
  "/import-review": "/import-review.html",
  "/import-review/": "/import-review.html",
};

export type SuiteRoute =
  | { kind: "redirect"; status: 301; pathname: string }
  | { kind: "proxy"; origin: string; pathname: string }
  | { kind: "pass" };

export function matchSuiteRoute(pathname: string): SuiteRoute {
  if (pathname === "/fund-intel" || pathname.startsWith("/fund-intel/")) {
    return {
      kind: "redirect",
      status: 301,
      pathname: `/portfolio-signals${pathname.slice("/fund-intel".length)}`,
    };
  }

  if (
    pathname === "/workspace" ||
    pathname === "/workspace/" ||
    pathname === "/workspace.html"
  ) {
    return {
      kind: "proxy",
      origin: PORTFOLIO_SIGNALS_ORIGIN,
      pathname: "/workspace.html",
    };
  }

  if (
    pathname === "/portfolio-signals" ||
    pathname.startsWith("/portfolio-signals/")
  ) {
    const rest = pathname.slice("/portfolio-signals".length);
    return {
      kind: "proxy",
      origin: PORTFOLIO_SIGNALS_ORIGIN,
      pathname: PORTFOLIO_SIGNALS_HTML_PAGES[rest] ?? rest,
    };
  }

  if (pathname === "/impact-relay" || pathname.startsWith("/impact-relay/")) {
    const rest = pathname.slice("/impact-relay".length);
    return {
      kind: "proxy",
      origin: IMPACT_RELAY_ORIGIN,
      pathname: rest === "" || rest === "/" ? "/index.html" : rest,
    };
  }

  return { kind: "pass" };
}

export function rewriteUpstreamLocation(
  location: string,
  requestOrigin: string,
  upstreamOrigin: string,
  prefix: string,
): string {
  if (location.startsWith(upstreamOrigin)) {
    const rest = location.slice(upstreamOrigin.length);
    return `${requestOrigin}${prefix}${rest.startsWith("/") ? rest : `/${rest}`}`;
  }

  if (location.startsWith("/")) {
    return `${requestOrigin}${prefix}${location}`;
  }

  return location;
}

export function suitePrefixForOrigin(origin: string): string {
  if (origin === PORTFOLIO_SIGNALS_ORIGIN) {
    return "/portfolio-signals";
  }
  if (origin === IMPACT_RELAY_ORIGIN) {
    return "/impact-relay";
  }
  return "";
}
