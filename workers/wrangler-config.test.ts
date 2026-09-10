import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

test("gateway deployment receipt preserves evidence and authority boundaries", () => {
  const cloudflare = readFileSync("docs/CLOUDFLARE.md", "utf8");
  const releases = readFileSync("docs/RELEASES.md", "utf8");
  const receipt = JSON.parse(
    readFileSync(
      "docs/evidence/2026-09-09-ir-gateway-deployment.json",
      "utf8",
    ),
  );

  assert.equal(receipt.schema_version, "agi.gateway.deployment-receipt.v1");
  assert.equal(
    receipt.gateway_change.source_sha,
    "ecbae3dd6736d050460b221350f0112acb63436a",
  );
  assert.equal(
    receipt.gateway_change.worker_version_id,
    "bec941b1-f0c8-4091-87fc-a7845a34a0a7",
  );
  assert.equal(
    receipt.verification_deployment.source_sha,
    "d70df85ab8a744e7a649ff8a717c989774f4490b",
  );
  assert.equal(
    receipt.verification_deployment.worker_version_id,
    "279af32a-85e3-4bc6-941c-5ccde0b4820c",
  );
  assert.deepEqual(receipt.verification_deployment.compatibility_flags_in_source, [
    "global_fetch_strictly_public",
  ]);
  assert.equal(
    receipt.verification_deployment.deployment_log_enumerated_compatibility_flags,
    false,
  );
  assert.equal(receipt.worker.origin, receipt.worker.allowed_origin);
  assert.deepEqual(receipt.verification.hosts, [
    "https://autogive.app",
    "https://agi-public.zer0state-noema.workers.dev",
  ]);
  assert.deepEqual(receipt.verification.resources, [
    "provisioning",
    "workspaces",
  ]);
  assert.deepEqual(receipt.verification.denial_matrix, {
    checks: 20,
    completed_at: "2026-09-10T00:27:06.316899Z",
    failures: 0,
    method: "GET",
    real_token_used: false,
    started_at: "2026-09-10T00:26:24.385985Z",
  });
  assert.equal(receipt.verification.observations.length, 20);
  const expectedCases = {
    no_auth: [401, "authentication_required"],
    invalid_no_origin: [401, "authentication_failed"],
    invalid_same_origin: [401, "authentication_failed"],
    invalid_spoofed_forward: [401, "authentication_failed"],
    invalid_foreign_origin: [403, "origin_not_allowed"],
  } as const;
  const observationKeys = new Set<string>();
  const rayIds = new Set<string>();
  const timestamps = new Set<string>();
  let previousObservedAt = "";
  for (const observation of receipt.verification.observations) {
    assert.match(
      observation.observed_at,
      /^2026-09-10T00:2[67]:\d{2}\.\d{6}Z$/,
    );
    assert.ok(
      observation.observed_at >= receipt.verification.denial_matrix.started_at &&
        observation.observed_at <= receipt.verification.denial_matrix.completed_at,
    );
    assert.ok(observation.observed_at > previousObservedAt);
    previousObservedAt = observation.observed_at;
    timestamps.add(observation.observed_at);
    assert.ok(receipt.verification.hosts.includes(observation.host));
    assert.ok(receipt.verification.resources.includes(observation.resource));
    assert.deepEqual(
      [observation.status, observation.error],
      expectedCases[observation.case as keyof typeof expectedCases],
    );
    assert.equal(observation.content_type, "application/json");
    assert.equal(observation.cache_control, "no-store");
    assert.equal(observation.location_present, false);
    assert.equal(observation.set_cookie_present, false);
    observationKeys.add(
      `${observation.host}|${observation.resource}|${observation.case}`,
    );
    assert.match(observation.cf_ray, /^[a-f0-9]{16}-[A-Z]{3}$/);
    rayIds.add(observation.cf_ray);
  }
  const expectedObservationKeys = new Set(
    receipt.verification.hosts.flatMap((host: string) =>
      receipt.verification.resources.flatMap((resource: string) =>
        Object.keys(expectedCases).map(
          (caseName) => `${host}|${resource}|${caseName}`,
        ),
      ),
    ),
  );
  assert.deepEqual(
    observationKeys,
    expectedObservationKeys,
    "the receipt covers the exact host/resource/case Cartesian matrix",
  );
  assert.equal(rayIds.size, 20, "every observation retains a unique CF-Ray id");
  assert.equal(timestamps.size, 20, "every observation retains a unique timestamp");
  assert.equal(
    receipt.verification.observations[0].observed_at,
    receipt.verification.denial_matrix.started_at,
  );
  assert.equal(
    receipt.verification.observations.at(-1).observed_at,
    receipt.verification.denial_matrix.completed_at,
  );
  assert.deepEqual(receipt.verification.public_smoke, {
    aggregate_authority_checks_per_host: 2,
    checks_per_host: 14,
    completed_at: "2026-09-10T00:39:25Z",
    content_checks_per_host: 1,
    failures: 0,
    host_runs: [
      {
        completed_at: "2026-09-10T00:39:23Z",
        host: "https://autogive.app",
        started_at: "2026-09-10T00:39:21Z",
      },
      {
        completed_at: "2026-09-10T00:39:25Z",
        host: "https://agi-public.zer0state-noema.workers.dev",
        started_at: "2026-09-10T00:39:23Z",
      },
    ],
    hosts: 2,
    post_rejection_checks_per_host: 1,
    security_header_checks_per_host: 3,
    started_at: "2026-09-10T00:39:21Z",
    status_gets_per_host: 7,
  });

  assert.match(receipt.gateway_change.ci_run, /actions\/runs\/34323274259$/);
  assert.match(
    receipt.gateway_change.deployment_run,
    /actions\/runs\/34323354140$/,
  );
  assert.match(
    receipt.verification_deployment.deployment_run,
    /actions\/runs\/34420466302$/,
  );
  assert.match(receipt.receipt_created_at, /^2026-09-10T/);
  assert.ok(
    receipt.receipt_created_at >= receipt.verification.public_smoke.completed_at,
  );
  assert.equal(
    receipt.verification.denial_matrix.started_at,
    "2026-09-10T00:26:24.385985Z",
  );
  assert.equal(
    receipt.verification.denial_matrix.completed_at,
    "2026-09-10T00:27:06.316899Z",
  );
  assert.deepEqual(receipt.authority, {
    hosted_migrations_verified: false,
    operational: false,
    post_used: false,
    tenant_activation_verified: false,
    valid_jwt_verified: false,
  });
  assert.doesNotMatch(
    cloudflare,
    /Authenticated IR API routing \(held pending review and operator configuration\)/,
  );
  for (const document of [cloudflare, releases]) {
    assert.match(document, /evidence\/2026-09-09-ir-gateway-deployment\.json/);
  }
  assert.match(
    cloudflare,
    /does not verify a valid JWT, MFA, tenant isolation, workspace\s+initialization, hosted schema state, POST effects, financial operations, or\s+`operational: true`/,
  );
  assert.match(
    releases,
    /No real token, POST, hosted migration, tenant activation, financial operation, or operational-readiness claim was used or established/,
  );
});
