import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  createRouteIntent,
  hasCapability,
  parseAuthContext,
  parseTenantProjectContext,
} from "./control-plane.ts";
import tenantFixture from "./fixtures/hacker-dojo-tenant.json" with { type: "json" };

const NOW = Date.parse("2026-08-15T16:00:00.000Z");

const context = {
  client_id: "hacker-dojo",
  tenant_id: "hacker-dojo",
  project_id: "project-robotics",
  scope: "project" as const,
};

const auth = {
  ...context,
  issuer: "https://autogive.app",
  subject: "synthetic-user",
  tokenId: "token-1",
  audience: "fund-intel" as const,
  roles: ["tenant_director"],
  capabilities: ["project:read", "allocation:approve"],
  issuedAt: "2026-08-15T15:59:00.000Z",
  expiresAt: "2026-08-15T16:05:00.000Z",
};

describe("tenant/project context", () => {
  it("accepts a matching project-scoped context", () => {
    assert.deepEqual(parseTenantProjectContext(context), context);
  });

  it("rejects mismatched client and tenant identifiers", () => {
    assert.equal(
      parseTenantProjectContext({ ...context, tenant_id: "other-tenant" }),
      null,
    );
  });

  it("rejects a project scope without a project identifier", () => {
    assert.equal(
      parseTenantProjectContext({
        client_id: "hacker-dojo",
        tenant_id: "hacker-dojo",
        scope: "project",
      }),
      null,
    );
  });
});

describe("AGI auth context", () => {
  it("accepts a live, correctly scoped context", () => {
    const parsed = parseAuthContext(auth, NOW);
    assert.ok(parsed);
    assert.equal(hasCapability(parsed, "allocation:approve"), true);
    assert.equal(hasCapability(parsed, "allocation:execute"), false);
  });

  it("rejects expired or future-issued contexts", () => {
    assert.equal(
      parseAuthContext({ ...auth, expiresAt: "2026-08-15T15:59:59.000Z" }, NOW),
      null,
    );
    assert.equal(
      parseAuthContext({ ...auth, issuedAt: "2026-08-15T16:01:00.000Z" }, NOW),
      null,
    );
  });

  it("rejects an unsupported audience", () => {
    assert.equal(parseAuthContext({ ...auth, audience: "unknown" }, NOW), null);
  });
});

describe("route intents", () => {
  it("creates a short-lived server-side handoff intent", () => {
    const intent = createRouteIntent(
      context,
      "fund-intel",
      "project.review",
      NOW,
    );
    assert.ok(intent);
    assert.equal(intent.client_id, "hacker-dojo");
    assert.equal(intent.tenant_id, "hacker-dojo");
    assert.equal(intent.audience, "fund-intel");
    assert.equal(intent.action, "project.review");
    assert.equal(Date.parse(intent.expiresAt) - NOW, 5 * 60 * 1000);
  });

  it("fails closed for an empty action", () => {
    assert.equal(createRouteIntent(context, "fund-intel", "", NOW), null);
  });

  it("keeps Hacker Dojo as a non-canonical integration fixture", () => {
    const adminCopy = readFileSync(
      new URL("../app/admin/page.tsx", import.meta.url),
      "utf8",
    );
    assert.match(adminCopy, /Non-canonical integration fixture \(not SPEC-011\)/);
    assert.equal(tenantFixture.client_id, tenantFixture.tenant_id);
    assert.ok(tenantFixture.projects.length >= 3);
    assert.equal(
      new Set(tenantFixture.projects.map((project) => project.project_id)).size,
      3,
    );
    assert.ok(tenantFixture.projects.every((project) => project.allocation_status));
    assert.ok(tenantFixture.projects.every((project) => project.delegation_status));
  });
});
