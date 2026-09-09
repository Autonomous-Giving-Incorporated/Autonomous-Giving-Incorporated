// Local workerd acceptance. All outbound traffic terminates at a fixture.
// Uses only Wrangler's already-installed Miniflare dependency; no live writes.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Miniflare, Response, convertV4MiniflareOptions } from "miniflare";
import { experimental_readRawConfig } from "wrangler";

const directory = await mkdtemp(join(tmpdir(), "agi-ir-worker-"));
const origin = "https://portfolio-signals.test-account.workers.dev";
const authorization = "Bearer synthetic.human.signature";
const config = await readFile("wrangler.jsonc", "utf8");
const { rawConfig } = experimental_readRawConfig({ config: "wrangler.jsonc" });
assert.deepEqual(rawConfig.compatibility_flags, [
  "global_fetch_strictly_public",
]);
assert.match(config, /"run_worker_first"\s*:\s*\[[\s\S]*?"\/api"/);
assert.match(config, /"run_worker_first"\s*:\s*\[[\s\S]*?"\/api\/\*"/);
let mf;
try {
  const dryRun = spawnSync(
    process.execPath,
    [
      "node_modules/wrangler/bin/wrangler.js",
      "deploy",
      "--dry-run",
      "--outdir",
      directory,
    ],
    {
      stdio: "inherit",
      env: { ...process.env, WRANGLER_SEND_METRICS: "false" },
    },
  );
  assert.equal(dryRun.status, 0, "Wrangler dry-run must succeed");
  let calls = [];
  let upstreamStatus = 200;
  let assets = 0;
  const options = {
    modules: true,
    modulesRoot: directory,
    scriptPath: join(directory, "index.js"),
    compatibilityDate: rawConfig.compatibility_date,
    compatibilityFlags: rawConfig.compatibility_flags,
    bindings: { FI_WORKER_ORIGIN: origin, FI_WORKER_ALLOWED_ORIGIN: origin },
    serviceBindings: {
      ASSETS: () => {
        assets++;
        return new Response("asset fixture");
      },
    },
    outboundService: async (request) => {
      calls.push({
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers),
        body: await request.text(),
      });
      return Response.json(
        { fixture: true },
        {
          status: upstreamStatus,
          headers:
            upstreamStatus === 307 ? { location: "https://evil.test/" } : {},
        },
      );
    },
  };
  mf = new Miniflare(convertV4MiniflareOptions(options));
  await mf.ready;
  for (const resource of ["provisioning", "workspaces"]) {
    for (const method of ["GET", "POST"]) {
      const path = `/api/ir/${resource}/org_local`;
      const body = '{"operation_id":"00000000-0000-0000-0000-000000000001"}';
      const response = await mf.dispatchFetch(`https://autogive.app${path}`, {
        method,
        headers: {
          authorization,
          origin: "https://autogive.app",
          cookie: "private=1",
          "content-type": "application/json",
        },
        ...(method === "POST" ? { body } : {}),
      });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.equal(calls.at(-1).url, origin + path);
      assert.equal(calls.at(-1).headers.authorization, authorization);
      assert.equal(calls.at(-1).headers.origin, "https://autogive.app");
      assert.equal(calls.at(-1).headers.cookie, undefined);
      assert.equal(calls.at(-1).body, method === "POST" ? body : "");
    }
  }
  assert.equal(calls.length, 4);
  assert.equal(assets, 0);
  calls = [];
  for (const [path, init, expected] of [
    ["/api/unknown", {}, 404],
    ["/api/ir/workspaces/org_local", {}, 401],
    ["/api/ir/workspaces/org_local?x=1", { headers: { authorization } }, 400],
    ["/api/ir/workspaces/org_local", { method: "OPTIONS" }, 405],
    [
      "/api/ir/workspaces/org_local",
      { method: "POST", headers: { authorization }, body: "a".repeat(1025) },
      413,
    ],
    [
      "/api/ir/workspaces/org_local",
      {
        method: "POST",
        headers: { authorization, origin: "https://evil.test" },
        body: "{}",
      },
      403,
    ],
    [
      "/impact-relay/api/ir/workspaces/org_local",
      { headers: { authorization } },
      404,
    ],
    ["/portfolio-signals/", { method: "POST", body: "must not forward" }, 405],
  ]) {
    assert.equal(
      (await mf.dispatchFetch(`https://autogive.app${path}`, init)).status,
      expected,
      path,
    );
  }
  assert.equal(calls.length, 0);
  assert.equal(assets, 0);
  upstreamStatus = 307;
  const redirected = await mf.dispatchFetch(
    "https://autogive.app/api/ir/workspaces/org_local",
    { headers: { authorization } },
  );
  assert.equal(redirected.status, 502);
  assert.equal(redirected.headers.get("location"), null);
  assert.equal(calls.length, 1, "no redirect follow");
  upstreamStatus = 200;
  const publicResponse = await mf.dispatchFetch(
    "https://autogive.app/portfolio-signals/data/public-campaign.json",
    { headers: { authorization, cookie: "private=1" } },
  );
  assert.equal(publicResponse.status, 200);
  assert.equal(calls.at(-1).headers.authorization, undefined);
  assert.equal(
    calls.at(-1).url,
    "https://fund-intel-ten.vercel.app/data/public-campaign.json",
  );
  assert.equal(
    await (await mf.dispatchFetch("https://autogive.app/legal/")).text(),
    "asset fixture",
  );
  assert.equal(assets, 1);
  // Exercise the deployed config on the second entry host too. outboundService
  // isolates traffic; local workerd cannot reproduce Cloudflare's zone router.
  const gateway = "https://agi-public.test-account.workers.dev";
  calls = [];
  for (const resource of ["provisioning", "workspaces"]) {
    for (const method of ["GET", "POST"]) {
      const path = `/api/ir/${resource}/org_local`;
      const response = await mf.dispatchFetch(gateway + path, {
        method,
        headers: { authorization, origin: gateway, cookie: "private=1" },
        ...(method === "POST" ? { body: "{}" } : {}),
      });
      assert.equal(response.status, 200);
      assert.equal(calls.at(-1).url, origin + path);
      assert.equal(calls.at(-1).headers.origin, gateway);
      assert.equal(calls.at(-1).headers.authorization, authorization);
      assert.equal(calls.at(-1).headers.cookie, undefined);
    }
  }
  assert.equal(calls.length, 4);
  calls = [];
  for (const bindings of [
    { FI_WORKER_ORIGIN: origin, FI_WORKER_ALLOWED_ORIGIN: "https://evil.test" },
    { FI_WORKER_ORIGIN: gateway, FI_WORKER_ALLOWED_ORIGIN: gateway },
    {
      FI_WORKER_ORIGIN: "https://evil.test",
      FI_WORKER_ALLOWED_ORIGIN: "https://evil.test",
    },
  ]) {
    await mf.setOptions(convertV4MiniflareOptions({ ...options, bindings }));
    const denied = await mf.dispatchFetch(
      gateway + "/api/ir/workspaces/org_local",
      {
        headers: { authorization },
      },
    );
    assert.equal(denied.status, 503);
  }
  assert.equal(
    calls.length,
    0,
    "public fetch never bypasses origin pin/self-target guards",
  );
  await mf.setOptions(convertV4MiniflareOptions({ ...options, bindings: {} }));
  const unavailable = await mf.dispatchFetch(
    "https://autogive.app/api/ir/workspaces/org_local",
    { headers: { authorization } },
  );
  assert.equal(unavailable.status, 503);
  assert.equal(assets, 1);
  console.log(
    "Local workerd acceptance passed: exact GET/POST/JWT, denials, body bound, redirect containment, static isolation, missing config. Fixtures only; no live auth/database evidence.",
  );
} finally {
  await mf?.dispose();
  await rm(directory, { recursive: true, force: true });
}
