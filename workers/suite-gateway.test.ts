import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  suiteGateway,
  CONTENT_SECURITY_POLICY,
  SUITE_CONTENT_SECURITY_POLICY,
} from "./suite-gateway.ts";

const marketingSecurityHeaders = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "DENY",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "content-security-policy": CONTENT_SECURITY_POLICY,
};

function assertMarketingSecurityHeaders(response: Response): void {
  for (const [name, value] of Object.entries(marketingSecurityHeaders)) {
    assert.equal(response.headers.get(name), value, `${name} is present`);
  }
}

function assertSharedSecurityHeaders(response: Response): void {
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(
    response.headers.get("referrer-policy"),
    "strict-origin-when-cross-origin",
  );
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(
    response.headers.get("permissions-policy"),
    "camera=(), microphone=(), geolocation=()",
  );
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
      assertMarketingSecurityHeaders(response);
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
      assertSharedSecurityHeaders(response);
      assert.equal(
        response.headers.get("content-security-policy"),
        SUITE_CONTENT_SECURITY_POLICY,
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("applies security headers to static asset responses", async () => {
    const response = await suiteGateway.fetch(
      new Request("https://autogive.app/"),
      {
        ASSETS: {
          fetch: async () =>
            new Response("<html></html>", {
              headers: { "content-type": "text/html" },
            }),
        },
      },
    );
    assert.equal(response.status, 200);
    assertMarketingSecurityHeaders(response);
  });

  it("redirects /workspace to Portfolio Signals and keeps the query string", async () => {
    const originalFetch = globalThis.fetch;
    let upstreamCalls = 0;
    globalThis.fetch = async () => {
      upstreamCalls += 1;
      return new Response("unexpected upstream request");
    };

    try {
      const response = await suiteGateway.fetch(
        new Request(
          "https://autogive.app/workspace?code=pkce-test&token_hash=otp-test",
        ),
        { ASSETS: { fetch: async () => new Response("unexpected asset request") } },
      );

      assert.equal(response.status, 301);
      assert.equal(
        response.headers.get("location"),
        "https://autogive.app/portfolio-signals/workspace.html?code=pkce-test&token_hash=otp-test",
      );
      assertMarketingSecurityHeaders(response);
      assert.equal(upstreamCalls, 0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("applies a suite CSP to proxied HTML when the upstream omits CSP", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response("<html></html>", {
        status: 200,
        headers: { "content-type": "text/html" },
      });

    try {
      const response = await suiteGateway.fetch(
        new Request("https://autogive.app/portfolio-signals/workspace.html"),
        { ASSETS: { fetch: async () => new Response("unexpected asset request") } },
      );

      assert.equal(response.status, 200);
      assertSharedSecurityHeaders(response);
      assert.equal(
        response.headers.get("content-security-policy"),
        SUITE_CONTENT_SECURITY_POLICY,
      );
      assert.match(SUITE_CONTENT_SECURITY_POLICY, /cdn\.jsdelivr\.net/);
      assert.match(
        SUITE_CONTENT_SECURITY_POLICY,
        /utdioxwiskzatwoejgiu\.supabase\.co/,
      );
      assert.notEqual(SUITE_CONTENT_SECURITY_POLICY, CONTENT_SECURITY_POLICY);
      assert.doesNotMatch(CONTENT_SECURITY_POLICY, /cdn\.jsdelivr\.net/);
      assert.doesNotMatch(
        CONTENT_SECURITY_POLICY,
        /utdioxwiskzatwoejgiu\.supabase\.co/,
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("passes through an upstream suite CSP instead of replacing it", async () => {
    const originalFetch = globalThis.fetch;
    const upstreamCsp =
      "default-src 'self'; script-src https://cdn.jsdelivr.net; connect-src https://utdioxwiskzatwoejgiu.supabase.co";
    globalThis.fetch = async () =>
      new Response("<html></html>", {
        status: 200,
        headers: { "Content-Security-Policy": upstreamCsp },
      });

    try {
      const response = await suiteGateway.fetch(
        new Request("https://autogive.app/portfolio-signals/workspace.html"),
        { ASSETS: { fetch: async () => new Response("unexpected asset request") } },
      );

      assert.equal(response.status, 200);
      assert.equal(response.headers.get("content-security-policy"), upstreamCsp);
      assertSharedSecurityHeaders(response);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
