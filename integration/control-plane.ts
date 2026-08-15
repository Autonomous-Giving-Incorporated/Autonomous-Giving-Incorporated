export const AUTH_AUDIENCES = ["fund-intel", "impact-relay"] as const;
export type AuthAudience = (typeof AUTH_AUDIENCES)[number];

export const APPROVAL_MODES = ["single", "dual"] as const;
export type ApprovalMode = (typeof APPROVAL_MODES)[number];

export type TenantProjectContext = {
  client_id: string;
  tenant_id: string;
  project_id?: string;
  scope: "tenant" | "project";
};

export type AuthContext = TenantProjectContext & {
  issuer: string;
  subject: string;
  tokenId: string;
  audience: AuthAudience;
  roles: string[];
  capabilities: string[];
  issuedAt: string;
  expiresAt: string;
};

export type RouteIntent = TenantProjectContext & {
  intentId: string;
  audience: AuthAudience;
  action: string;
  requestedAt: string;
  expiresAt: string;
};

const nonEmpty = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isAudience = (value: unknown): value is AuthAudience =>
  typeof value === "string" && AUTH_AUDIENCES.includes(value as AuthAudience);

const isIsoDate = (value: unknown): value is string =>
  nonEmpty(value) && Number.isFinite(Date.parse(value));

function validateTenantProjectContext(
  value: unknown,
): TenantProjectContext | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  const scope = candidate.scope;

  if (
    !nonEmpty(candidate.client_id) ||
    !nonEmpty(candidate.tenant_id) ||
    candidate.client_id !== candidate.tenant_id ||
    (scope !== "tenant" && scope !== "project")
  ) {
    return null;
  }

  if (scope === "project" && !nonEmpty(candidate.project_id)) return null;
  if (candidate.project_id !== undefined && !nonEmpty(candidate.project_id)) {
    return null;
  }

  return {
    client_id: candidate.client_id,
    tenant_id: candidate.tenant_id,
    ...(candidate.project_id ? { project_id: candidate.project_id } : {}),
    scope,
  };
}

export function parseTenantProjectContext(
  value: unknown,
): TenantProjectContext | null {
  return validateTenantProjectContext(value);
}

export function parseAuthContext(
  value: unknown,
  now = Date.now(),
): AuthContext | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  const context = validateTenantProjectContext(candidate);
  if (
    !context ||
    !nonEmpty(candidate.issuer) ||
    !nonEmpty(candidate.subject) ||
    !nonEmpty(candidate.tokenId) ||
    !isAudience(candidate.audience) ||
    !Array.isArray(candidate.roles) ||
    !candidate.roles.every(nonEmpty) ||
    !Array.isArray(candidate.capabilities) ||
    !candidate.capabilities.every(nonEmpty) ||
    !isIsoDate(candidate.issuedAt) ||
    !isIsoDate(candidate.expiresAt)
  ) {
    return null;
  }

  const issuedAt = Date.parse(candidate.issuedAt);
  const expiresAt = Date.parse(candidate.expiresAt);
  if (issuedAt > now || expiresAt <= now || expiresAt <= issuedAt) return null;

  return {
    ...context,
    issuer: candidate.issuer,
    subject: candidate.subject,
    tokenId: candidate.tokenId,
    audience: candidate.audience,
    roles: [...candidate.roles],
    capabilities: [...candidate.capabilities],
    issuedAt: candidate.issuedAt,
    expiresAt: candidate.expiresAt,
  };
}

export function createRouteIntent(
  context: TenantProjectContext,
  audience: AuthAudience,
  action: string,
  now = Date.now(),
  ttlMs = 5 * 60 * 1000,
): RouteIntent | null {
  const validated = validateTenantProjectContext(context);
  if (!validated || !nonEmpty(action) || !isAudience(audience)) return null;

  const requestedAt = new Date(now).toISOString();
  const expiresAt = new Date(now + ttlMs).toISOString();
  return {
    ...validated,
    intentId: `intent_${now.toString(36)}`,
    audience,
    action,
    requestedAt,
    expiresAt,
  };
}

export function hasCapability(
  context: AuthContext | null,
  capability: string,
): boolean {
  return Boolean(
    context && nonEmpty(capability) && context.capabilities.includes(capability),
  );
}
