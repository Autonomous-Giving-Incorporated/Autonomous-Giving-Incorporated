import { communityHardwareFixture } from "./fixtures.ts";
import {
  assessFreshness,
  isHardStale,
  isSoftStale,
  type FreshnessAssessment,
} from "./freshness.ts";
import {
  validatePublicCampaign,
  validatePublicImpact,
  type ValidationFailure,
} from "./validate-public.ts";

export const FUND_INTEL_PUBLIC_URL =
  "https://raw.githubusercontent.com/scrimshawlife-ctrl/Fund-Intel/main/data/public-campaign.json";
export const IMPACT_RELAY_PUBLIC_URL =
  "https://raw.githubusercontent.com/scrimshawlife-ctrl/Impact-Relay/main/data/public-impact.json";

/** Explicit source states for the public projection seam. */
export type SignalSourceState =
  | "live"
  | "stale"
  | "fallback"
  | "malformed"
  | "policy_rejected";

export type PublicSignals = {
  source: SignalSourceState;
  /** Machine-safe reason code. Safe for UI and build logs. Never a payload. */
  reason?: string;
  fundIntel: {
    updatedAt: string;
    executionState: string;
    allocationId: string | null;
    freshness: FreshnessAssessment;
  };
  impactRelay: {
    updatedAt: string;
    organizationName: string;
    programName: string;
    allocationName: string;
    allocationId: string | null;
    participants: number;
    verified: boolean;
    freshness: FreshnessAssessment;
  };
};

export type SourceFetchResult =
  | { kind: "ok"; body: unknown }
  | { kind: "http"; status: number }
  | { kind: "network" }
  | { kind: "parse" };

export type GetPublicSignalsOptions = {
  nowMs?: number;
  fetchImpl?: typeof fetch;
};

const fallbackBase = {
  fundIntel: {
    updatedAt: communityHardwareFixture.decision.publishedAt,
    executionState: communityHardwareFixture.decision.status,
    allocationId: communityHardwareFixture.decision.allocationId,
  },
  impactRelay: {
    updatedAt:
      communityHardwareFixture.events.at(-1)?.occurredAt ??
      communityHardwareFixture.decision.publishedAt,
    organizationName: "Hacker Dojo",
    programName: "Intro to Robotics",
    allocationName: communityHardwareFixture.decision.fundName,
    allocationId: communityHardwareFixture.decision.allocationId,
    participants: 18,
    verified: true,
  },
} as const;

function buildFallback(
  source: Extract<
    SignalSourceState,
    "fallback" | "malformed" | "policy_rejected"
  >,
  reason: string,
  nowMs: number,
): PublicSignals {
  return {
    source,
    reason,
    fundIntel: {
      ...fallbackBase.fundIntel,
      freshness: assessFreshness(fallbackBase.fundIntel.updatedAt, nowMs),
    },
    impactRelay: {
      ...fallbackBase.impactRelay,
      freshness: assessFreshness(fallbackBase.impactRelay.updatedAt, nowMs),
    },
  };
}

function failureToFallback(
  failure: ValidationFailure,
  nowMs: number,
): PublicSignals {
  return buildFallback(failure.kind, failure.reason, nowMs);
}

/**
 * Pure selection: map fetched documents onto an explicit source state.
 * The deterministic fixture is the only fallback content.
 */
export function selectPublicSignals(
  campaign: SourceFetchResult,
  impact: SourceFetchResult,
  nowMs: number,
): PublicSignals {
  if (campaign.kind === "network" || impact.kind === "network") {
    return buildFallback("fallback", "network_failure", nowMs);
  }

  if (campaign.kind === "http" || impact.kind === "http") {
    const campaignStatus = campaign.kind === "http" ? campaign.status : 200;
    const impactStatus = impact.kind === "http" ? impact.status : 200;
    return buildFallback(
      "fallback",
      `http_non_2xx campaign=${campaignStatus} impact=${impactStatus}`,
      nowMs,
    );
  }

  if (campaign.kind === "parse" || impact.kind === "parse") {
    return buildFallback("malformed", "json_parse_failure", nowMs);
  }

  const validatedCampaign = validatePublicCampaign(campaign.body);
  if ("kind" in validatedCampaign) {
    return failureToFallback(validatedCampaign, nowMs);
  }

  const validatedImpact = validatePublicImpact(impact.body);
  if ("kind" in validatedImpact) {
    return failureToFallback(validatedImpact, nowMs);
  }

  const fundFreshness = assessFreshness(validatedCampaign.updatedAt, nowMs);
  const impactFreshness = assessFreshness(validatedImpact.updatedAt, nowMs);

  if (isHardStale(fundFreshness.label) || isHardStale(impactFreshness.label)) {
    return buildFallback("fallback", "hard_stale", nowMs);
  }

  const delayed =
    isSoftStale(fundFreshness.label) || isSoftStale(impactFreshness.label);

  return {
    source: delayed ? "stale" : "live",
    reason: delayed ? "soft_stale" : undefined,
    fundIntel: {
      updatedAt: validatedCampaign.updatedAt,
      executionState: validatedCampaign.execution.state,
      allocationId: validatedCampaign.allocations[0]?.allocationId ?? null,
      freshness: fundFreshness,
    },
    impactRelay: {
      updatedAt: validatedImpact.updatedAt,
      organizationName: validatedImpact.outcome.organizationName,
      programName: validatedImpact.outcome.programName,
      allocationName: validatedImpact.outcome.allocationName,
      allocationId: validatedImpact.outcome.allocationId,
      participants: validatedImpact.outcome.participantsPublic,
      verified: true,
      freshness: impactFreshness,
    },
  };
}

async function fetchDocument(
  url: string,
  fetchImpl: typeof fetch,
): Promise<SourceFetchResult> {
  let response: Response;
  try {
    response = await fetchImpl(url, { cache: "force-cache" });
  } catch {
    return { kind: "network" };
  }

  if (!response.ok) {
    return { kind: "http", status: response.status };
  }

  try {
    return { kind: "ok", body: await response.json() };
  } catch {
    return { kind: "parse" };
  }
}

export async function getPublicSignals(
  options: GetPublicSignalsOptions = {},
): Promise<PublicSignals> {
  const nowMs = options.nowMs ?? Date.now();
  const fetchImpl = options.fetchImpl ?? fetch;

  try {
    const [campaign, impact] = await Promise.all([
      fetchDocument(FUND_INTEL_PUBLIC_URL, fetchImpl),
      fetchDocument(IMPACT_RELAY_PUBLIC_URL, fetchImpl),
    ]);
    return selectPublicSignals(campaign, impact, nowMs);
  } catch {
    return buildFallback("fallback", "network_failure", nowMs);
  }
}
