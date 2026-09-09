import assert from "node:assert/strict";
import { it } from "node:test";
import { suiteGateway } from "./suite-gateway.ts";

const ASSETS = { fetch: async () => new Response("static fallback") };
const path = "/api/ir/workspaces/org_test";
const env = {
  ASSETS,
  FI_WORKER_ORIGIN: "https://portfolio-signals.test-account.workers.dev",
  FI_WORKER_ALLOWED_ORIGIN:
    "https://portfolio-signals.test-account.workers.dev",
};
const jwt = "Bearer human.jwt.signature";
it("rejects stalled and broken streams without reaching upstream", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  for (const broken of [false, true]) {
    let cancelled = false;
    const body = new ReadableStream({
      start(controller) {
        if (broken) controller.error(new Error("private stream detail"));
      },
      cancel() {
        cancelled = true;
      },
    });
    const init = {
      method: "POST",
      body,
      duplex: "half",
      headers: { authorization: jwt },
    };
    const pending = suiteGateway.fetch(
      new Request(`https://autogive.app${path}`, init as RequestInit),
      env,
    );
    t.mock.timers.tick(10001);
    const response = await pending;
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: "invalid_request" });
    if (!broken) assert.equal(cancelled, true);
  }
});
it("validates the origin shape even when the two settings agree", async () => {
  for (const origin of [
    "http://portfolio-signals.test-account.workers.dev",
    env.FI_WORKER_ORIGIN + "/",
    env.FI_WORKER_ORIGIN + "?q=1",
    env.FI_WORKER_ORIGIN + "#f",
    env.FI_WORKER_ORIGIN + ":443",
    "https://user@portfolio-signals.test-account.workers.dev",
    "https://fund-intel-ten.vercel.app",
    "https://127.0.0.1",
    "https://portfolio-signals.test-account.workers.dev.evil.test",
  ]) {
    const response = await suiteGateway.fetch(
      new Request(`https://autogive.app${path}`, {
        headers: { authorization: jwt },
      }),
      { ...env, FI_WORKER_ORIGIN: origin, FI_WORKER_ALLOWED_ORIGIN: origin },
    );
    assert.equal(response.status, 503, origin);
  }
});
it("rejects invalid API routes, methods, queries, origins and oversized bodies without any fetch", async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return Response.json({});
  };
  try {
    const cases: [string, RequestInit, number][] = [
      ["/api", {}, 404],
      ["/api/unknown", {}, 404],
      ["/portfolio-signals/api/ir/workspaces/org_test", {}, 404],
      ["/impact-relay/api/ir/workspaces/org_test", {}, 404],
      ["/fund-intel/api/ir/workspaces/org_test", {}, 404],
      ...[
        "/api/ir/workspaces",
        path + "/",
        path + "/extra",
        path.replace("org_test", "org_BAD"),
        path.replace("org_test", "org_"),
        path.replace("org_test", "org_" + "a".repeat(125)),
        path.replace("org_test", "%6frg_test"),
        path.replace("org_test", "org_a%2Fb"),
      ].map((p) => [p, {}, 404] as [string, RequestInit, number]),
      ...["?a=1", "?client_id=org_other", "?url=https://evil.test", "?"].map(
        (q) => [path + q, {}, 400] as [string, RequestInit, number],
      ),
      ...["HEAD", "PUT", "PATCH", "DELETE", "OPTIONS"].map(
        (method) => [path, { method }, 405] as [string, RequestInit, number],
      ),
      [path, { headers: {} }, 401],
      [path, { headers: { authorization: "Basic abc" } }, 401],
      [
        path,
        { headers: { authorization: jwt, origin: "https://evil.test" } },
        403,
      ],
      [path, { headers: { authorization: jwt, origin: "null" } }, 403],
      [path, { method: "POST", body: "a".repeat(1025) }, 413],
      [path, { method: "POST", body: "é".repeat(513) }, 413],
      [path, { method: "POST" }, 400],
      [
        path,
        {
          method: "POST",
          body: "{}",
          headers: { authorization: jwt, "content-encoding": "gzip" },
        },
        415,
      ],
    ];
    for (const [p, init, status] of cases) {
      const response = await suiteGateway.fetch(
        new Request(`https://autogive.app${p}`, {
          headers: { authorization: jwt },
          ...init,
        }),
        env,
      );
      assert.equal(response.status, status, `${init.method || "GET"} ${p}`);
      assert.equal(response.headers.get("cache-control"), "no-store");
    }
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = original;
  }
});
it("blocks redirects and sanitizes network failures without retrying POST", async () => {
  const original = globalThis.fetch;
  try {
    for (const status of [301, 302, 303, 307, 308]) {
      globalThis.fetch = async () =>
        new Response(null, {
          status,
          headers: { location: "https://evil.test" },
        });
      const response = await suiteGateway.fetch(
        new Request(`https://autogive.app${path}`, {
          headers: { authorization: jwt },
        }),
        env,
      );
      assert.equal(response.status, 502);
      assert.equal(response.headers.get("location"), null);
    }
    let calls = 0;
    globalThis.fetch = async () => {
      calls++;
      throw new Error("secret upstream details");
    };
    const response = await suiteGateway.fetch(
      new Request(`https://autogive.app${path}`, {
        method: "POST",
        body: "{}",
        headers: { authorization: jwt },
      }),
      env,
    );
    assert.equal(response.status, 503);
    assert.equal(calls, 1);
    assert.deepEqual(await response.json(), {
      error: "ir_upstream_unavailable",
    });
  } finally {
    globalThis.fetch = original;
  }
});
it("forwards exact GET and POST requests only to the configured trusted FI Worker", async () => {
  const original = globalThis.fetch;
  const calls: Request[] = [];
  globalThis.fetch = async (input) => {
    calls.push(input as Request);
    return Response.json(
      { workspace: null },
      { headers: { "cache-control": "public", "set-cookie": "forbidden=1" } },
    );
  };
  try {
    for (const resource of ["provisioning", "workspaces"])
      for (const method of ["GET", "POST"]) {
        const body = '{"operation_id":"00000000-0000-0000-0000-000000000001"}';
        const response = await suiteGateway.fetch(
          new Request(`https://autogive.app/api/ir/${resource}/org_test`, {
            method,
            headers: {
              authorization: jwt,
              origin: "https://autogive.app",
              "content-type": "application/json",
              cookie: "private=1",
              apikey: "forbidden",
              "x-forwarded-host": "evil.test",
            },
            ...(method === "POST" ? { body } : {}),
          }),
          env,
        );
        assert.equal(response.status, 200);
        const sent = calls.at(-1)!;
        assert.equal(
          sent.url,
          `${env.FI_WORKER_ORIGIN}/api/ir/${resource}/org_test`,
        );
        assert.equal(sent.method, method);
        assert.equal(sent.headers.get("authorization"), jwt);
        assert.equal(sent.headers.get("origin"), "https://autogive.app");
        for (const header of ["cookie", "apikey", "x-forwarded-host"])
          assert.equal(sent.headers.get(header), null);
        assert.equal(sent.redirect, "manual");
        if (method === "POST") assert.equal(await sent.text(), body);
        assert.equal(response.headers.get("cache-control"), "no-store");
        assert.equal(response.headers.get("set-cookie"), null);
        assert.equal(response.headers.get("access-control-allow-origin"), null);
      }
  } finally {
    globalThis.fetch = original;
  }
});
it("pins credentials to an exact HTTPS FI Worker origin, never a static host or redirect target", async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return Response.json({});
  };
  try {
    for (const origin of [
      "",
      "http://portfolio-signals.test-account.workers.dev",
      env.FI_WORKER_ORIGIN + "/",
      env.FI_WORKER_ORIGIN + "/api",
      env.FI_WORKER_ORIGIN + "?x=1",
      env.FI_WORKER_ORIGIN + "#x",
      env.FI_WORKER_ORIGIN + ":444",
      env.FI_WORKER_ORIGIN + ".evil.test",
      "https://user:pass@portfolio-signals.test-account.workers.dev",
      "https://fund-intel-ten.vercel.app",
      "https://impact-relay.vercel.app",
      "https://autogive.app",
      "https://agi-public.test-account.workers.dev",
      "https://127.0.0.1",
      "https://[::1]",
      "https://portfolio-signals.evil.workers.dev",
    ]) {
      const response = await suiteGateway.fetch(
        new Request(`https://autogive.app${path}`, {
          headers: { authorization: jwt },
        }),
        { ...env, FI_WORKER_ORIGIN: origin },
      );
      assert.equal(response.status, 503, origin);
    }
    const missingPin = await suiteGateway.fetch(
      new Request(`https://autogive.app${path}`, {
        headers: { authorization: jwt },
      }),
      { ...env, FI_WORKER_ALLOWED_ORIGIN: undefined },
    );
    assert.equal(missingPin.status, 503);
    const loop = await suiteGateway.fetch(
      new Request(`${env.FI_WORKER_ORIGIN}${path}`, {
        headers: { authorization: jwt },
      }),
      env,
    );
    assert.equal(loop.status, 503);
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = original;
  }
});
it("preserves FI denial/conflict responses and exact boundary payloads", async () => {
  const original = globalThis.fetch;
  try {
    for (const status of [200, 400, 401, 403, 409, 503]) {
      globalThis.fetch = async (input) => {
        const sent = input as Request;
        assert.equal((await sent.arrayBuffer()).byteLength, 1024);
        assert.equal(sent.headers.get("origin"), null);
        return Response.json({ error: "fi_result" }, { status });
      };
      const response = await suiteGateway.fetch(
        new Request(
          `https://autogive.app/api/ir/provisioning/org_${"a".repeat(124)}`,
          {
            method: "POST",
            body: "x".repeat(1024),
            headers: { authorization: jwt },
          },
        ),
        env,
      );
      assert.equal(response.status, status);
      assert.deepEqual(await response.json(), { error: "fi_result" });
    }
  } finally {
    globalThis.fetch = original;
  }
});
it("bounds streamed bodies regardless of Content-Length and cancels overflow", async () => {
  let cancelled = false;
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(512));
      controller.enqueue(new Uint8Array(513));
    },
    cancel() {
      cancelled = true;
    },
  });
  const init = {
    method: "POST",
    body,
    duplex: "half",
    headers: { authorization: jwt, "content-length": "1" },
  };
  const response = await suiteGateway.fetch(
    new Request(`https://autogive.app${path}`, init as RequestInit),
    env,
  );
  assert.equal(response.status, 413);
  assert.equal(cancelled, true);
});
it("fails closed without FI routing config instead of serving static assets", async () => {
  const response = await suiteGateway.fetch(
    new Request(`https://autogive.app${path}`, {
      headers: { authorization: "Bearer human.jwt.signature" },
    }),
    { ASSETS },
  );
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: "ir_upstream_unavailable" });
});
