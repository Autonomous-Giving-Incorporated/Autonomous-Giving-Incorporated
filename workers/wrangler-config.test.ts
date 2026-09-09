import assert from "node:assert/strict";
import test from "node:test";
import { experimental_readRawConfig } from "wrangler";

test("gateway opts into public Worker-to-Worker fetch without changing routing authority", () => {
  // Parse real JSONC with the same installed Wrangler used to deploy, not regex.
  const { rawConfig: config } = experimental_readRawConfig({
    config: "wrangler.jsonc",
  });
  assert.deepEqual(config.compatibility_flags, [
    "global_fetch_strictly_public",
  ]);
  assert.equal(config.compatibility_date, "2026-08-13");
  assert.equal(config.main, "workers/index.ts");
  assert.equal(config.workers_dev, true);
  assert.equal(
    config.routes,
    undefined,
    "do not change dashboard-managed DNS/routes",
  );
  assert.equal(config.services, undefined, "no new private service authority");
  assert.equal(
    config.vars,
    undefined,
    "origin pins remain deployment-controlled",
  );
  assert.deepEqual(config.assets?.run_worker_first, [
    "/api",
    "/api/*",
    "/portfolio-signals",
    "/portfolio-signals/*",
    "/impact-relay",
    "/impact-relay/*",
    "/fund-intel",
    "/fund-intel/*",
    "/workspace",
    "/workspace/",
    "/workspace.html",
  ]);
});
