import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { suiteGateway } from "./suite-gateway.ts";

const securityHeaders = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "DENY",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "content-security-policy":
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
};

function assertSecurityHeaders(response: Response): void {
  for (const [name, value] of Object.entries(securityHeaders)) {
    assert.equal(response.headers.get(name), value, `${name} is present`);
  }
}

describe("suiteGateway", () => {
  it("rejects non-read methods for proxied suite paths without contacting the upstream", async () => {
    const originalFetch = globalThis.fetch;
    let upstreamCalls = 0;
    globalThis.fetch = async () => {
      upstreamCalls += 1;
      return new Response("unexpected upstream request");
    };

    try {
      const response = await suiteGateway.fetch(
        new Request("https://autogive.app/portfolio-signals/", {
          method: "POST",
          body: "must not be forwarded",
        }),
        { ASSETS: { fetch: async () => new Response("unexpected asset request") } },
      );

      assert.equal(response.status, 405);
      assert.equal(response.headers.get("allow"), "GET, HEAD");
      assertSecurityHeaders(response);
      assert.equal(upstreamCalls, 0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("forwards only approved request headers and rewrites upstream redirects", async () => {
    const originalFetch = globalThis.fetch;
    let upstreamRequest: Request | undefined;
    globalThis.fetch = async (input) => {
      upstreamRequest = input instanceof Request ? input : new Request(input);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "https://fund-intel-ten.vercel.app/sponsors.html",
          "X-Upstream": "observed",
        },
      });
    };

    try {
      const response = await suiteGateway.fetch(
        new Request("https://autogive.app/portfolio-signals/sponsors?view=all", {
          headers: {
            Accept: "text/html",
            "Accept-Language": "en-US",
            Authorization: "must-not-forward",
            Cookie: "must-not-forward",
            "X-Forwarded-For": "must-not-forward",
          },
        }),
        { ASSETS: { fetch: async () => new Response("unexpected asset request") } },
      );

      assert.ok(upstreamRequest);
      assert.equal(
        upstreamRequest.url,
        "https://fund-intel-ten.vercel.app/sponsors.html?view=all",
      );
      assert.equal(upstreamRequest.headers.get("accept"), "text/html");
      assert.equal(upstreamRequest.headers.get("accept-language"), "en-US");
      assert.equal(upstreamRequest.headers.get("authorization"), null);
      assert.equal(upstreamRequest.headers.get("cookie"), null);
      assert.equal(upstreamRequest.headers.get("x-forwarded-for"), null);
      assert.equal(response.status, 302);
      assert.equal(
        response.headers.get("location"),
        "https://autogive.app/portfolio-signals/sponsors.html",
      );
      assert.equal(response.headers.get("x-upstream"), "observed");
      assertSecurityHeaders(response);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
