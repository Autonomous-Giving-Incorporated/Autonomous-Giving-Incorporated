import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  IMPACT_RELAY_ORIGIN,
  matchSuiteRoute,
  PORTFOLIO_SIGNALS_ORIGIN,
  rewriteUpstreamLocation,
} from "./suite-routes.ts";

describe("matchSuiteRoute", () => {
  it("proxies trailing-slash and bare suite prefixes to index.html", () => {
    assert.deepEqual(matchSuiteRoute("/portfolio-signals/"), {
      kind: "proxy",
      origin: PORTFOLIO_SIGNALS_ORIGIN,
      pathname: "/index.html",
    });
    assert.deepEqual(matchSuiteRoute("/portfolio-signals"), {
      kind: "proxy",
      origin: PORTFOLIO_SIGNALS_ORIGIN,
      pathname: "/index.html",
    });
    assert.deepEqual(matchSuiteRoute("/impact-relay/"), {
      kind: "proxy",
      origin: IMPACT_RELAY_ORIGIN,
      pathname: "/index.html",
    });
    assert.deepEqual(matchSuiteRoute("/impact-relay"), {
      kind: "proxy",
      origin: IMPACT_RELAY_ORIGIN,
      pathname: "/index.html",
    });
  });

  it("maps extensionless Portfolio Signals pages to .html", () => {
    assert.deepEqual(matchSuiteRoute("/portfolio-signals/workspace"), {
      kind: "proxy",
      origin: PORTFOLIO_SIGNALS_ORIGIN,
      pathname: "/workspace.html",
    });
    assert.deepEqual(matchSuiteRoute("/portfolio-signals/sponsors"), {
      kind: "proxy",
      origin: PORTFOLIO_SIGNALS_ORIGIN,
      pathname: "/sponsors.html",
    });
    assert.deepEqual(matchSuiteRoute("/workspace"), {
      kind: "proxy",
      origin: PORTFOLIO_SIGNALS_ORIGIN,
      pathname: "/workspace.html",
    });
  });

  it("passes nested public assets through unchanged", () => {
    assert.deepEqual(
      matchSuiteRoute("/portfolio-signals/data/public-campaign.json"),
      {
        kind: "proxy",
        origin: PORTFOLIO_SIGNALS_ORIGIN,
        pathname: "/data/public-campaign.json",
      },
    );
    assert.deepEqual(
      matchSuiteRoute("/impact-relay/data/public-impact.json"),
      {
        kind: "proxy",
        origin: IMPACT_RELAY_ORIGIN,
        pathname: "/data/public-impact.json",
      },
    );
  });

  it("redirects legacy /fund-intel paths", () => {
    assert.deepEqual(matchSuiteRoute("/fund-intel"), {
      kind: "redirect",
      status: 301,
      pathname: "/portfolio-signals",
    });
    assert.deepEqual(matchSuiteRoute("/fund-intel/workspace"), {
      kind: "redirect",
      status: 301,
      pathname: "/portfolio-signals/workspace",
    });
  });

  it("leaves AGI static paths to assets", () => {
    assert.deepEqual(matchSuiteRoute("/"), { kind: "pass" });
    assert.deepEqual(matchSuiteRoute("/legal"), { kind: "pass" });
    assert.deepEqual(matchSuiteRoute("/robots.txt"), { kind: "pass" });
  });
});

describe("rewriteUpstreamLocation", () => {
  it("keeps suite visitors on autogive.app when upstream redirects", () => {
    assert.equal(
      rewriteUpstreamLocation(
        "https://fund-intel-ten.vercel.app/sponsors.html",
        "https://autogive.app",
        PORTFOLIO_SIGNALS_ORIGIN,
        "/portfolio-signals",
      ),
      "https://autogive.app/portfolio-signals/sponsors.html",
    );
    assert.equal(
      rewriteUpstreamLocation(
        "/index.html",
        "https://autogive.app",
        IMPACT_RELAY_ORIGIN,
        "/impact-relay",
      ),
      "https://autogive.app/impact-relay/index.html",
    );
  });
});
