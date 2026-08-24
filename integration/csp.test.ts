import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  CONTENT_SECURITY_POLICY,
  SUITE_CONTENT_SECURITY_POLICY,
} from "../workers/suite-gateway.ts";

const ROOT = new URL("../", import.meta.url);

describe("Content-Security-Policy", () => {
  it("is identical on Worker, Vercel, and Pages headers", () => {
    const headersFile = readFileSync(new URL("public/_headers", ROOT), "utf8");
    const vercel = JSON.parse(
      readFileSync(new URL("vercel.json", ROOT), "utf8"),
    ) as {
      headers: Array<{
        source: string;
        headers: Array<{ key: string; value: string }>;
      }>;
    };
    const vercelCsp = vercel.headers
      .flatMap((entry) => entry.headers)
      .find((header) => header.key === "Content-Security-Policy")?.value;
    const pagesCsp = headersFile
      .split("\n")
      .find((line) => line.includes("Content-Security-Policy:"))
      ?.replace(/^\s*Content-Security-Policy:\s*/, "");

    assert.equal(vercelCsp, CONTENT_SECURITY_POLICY);
    assert.equal(pagesCsp, CONTENT_SECURITY_POLICY);
    assert.match(CONTENT_SECURITY_POLICY, /default-src 'self'/);
    assert.doesNotMatch(CONTENT_SECURITY_POLICY, /fonts\.googleapis\.com/);
    assert.doesNotMatch(CONTENT_SECURITY_POLICY, /fonts\.gstatic\.com/);
    assert.doesNotMatch(CONTENT_SECURITY_POLICY, /cdn\.jsdelivr\.net/);
  });

  it("sets a suite CSP on Vercel Portfolio Signals and Impact Relay paths", () => {
    const vercel = JSON.parse(
      readFileSync(new URL("vercel.json", ROOT), "utf8"),
    ) as {
      headers: Array<{
        source: string;
        headers: Array<{ key: string; value: string }>;
      }>;
    };
    const suiteSources = [
      "/portfolio-signals/:path*",
      "/impact-relay/:path*",
    ];
    for (const source of suiteSources) {
      const entry = vercel.headers.find((header) => header.source === source);
      const csp = entry?.headers.find(
        (header) => header.key === "Content-Security-Policy",
      )?.value;
      assert.equal(csp, SUITE_CONTENT_SECURITY_POLICY, source);
    }
    assert.match(SUITE_CONTENT_SECURITY_POLICY, /cdn\.jsdelivr\.net/);
    assert.match(
      SUITE_CONTENT_SECURITY_POLICY,
      /utdioxwiskzatwoejgiu\.supabase\.co/,
    );
  });
});
