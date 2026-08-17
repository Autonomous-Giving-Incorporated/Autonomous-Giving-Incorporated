/**
 * Representative public documents that match the published Fund-Intel
 * public-campaign schema and the Impact Relay public-impact shape.
 * Used by validators and selection tests. Not shown in the UI unless
 * selection accepts them.
 */

export const validPublicCampaign = {
  version: "1.0.0",
  updatedAt: "2026-08-14",
  authority: "advisory_only" as const,
  campaign: {
    minimumTarget: 0,
    stretchTarget: 0,
    currency: "USD" as const,
    minimumCaseState: "not_public",
    stretchCaseState: "not_public",
  },
  registry: {
    normalizedMemberIds: 0,
    bayAreaRecords: 0,
    organizerLabels: 0,
    privateRelayOccurrences: 0,
    highEngagementRecords: 0,
    outreachReadyRecords: 0,
    qualification: "tenant_data_authenticated_only",
  },
  execution: {
    state: "blocked" as const,
    reason: "consent unresolved",
  },
  gates: [
    {
      id: "tenant_auth",
      label: "Tenant auth required",
      state: "blocked" as const,
    },
  ],
  allocations: [
    {
      allocationId: "alloc_community_hardware",
      fundName: "Community Hardware Fund",
      status: "approved" as const,
    },
  ],
  privacy: {
    classification: "public_aggregate_only" as const,
    piiAllowed: false as const,
    rawRegistryAllowed: false as const,
    donorHistoryAllowed: false as const,
    privateNotesAllowed: false as const,
  },
};

export const validPublicImpact = {
  version: "1.0.0",
  updatedAt: "2026-08-14",
  source: "public_shell",
  authority: "public_aggregate_only" as const,
  privacy: {
    classification: "public_aggregate_only" as const,
    piiAllowed: false as const,
    donorNamesAllowed: false as const,
    individualDonorAttributionAllowed: false as const,
    operatorIdentityAllowed: false as const,
  },
  summary: {
    outcomeCount: 1,
    totalParticipantsPublic: 25,
  },
  outcomes: [
    {
      publicId: "imp_001",
      impactEventId: "evt_workshop_001",
      organizationName: "Community AI Lab",
      programName: "Neighborhood AI learning lab",
      allocationId: "alloc_community_hardware",
      allocationName: "Community Hardware Fund",
      eventType: "CLASS_HELD",
      eventDate: "2026-08-12",
      participantsPublic: 25,
      evidenceState: "VERIFIED",
      attributionMethod: "aggregate_attendance",
      receiptHash: "sha256:public-safe-placeholder",
      createdAt: "2026-08-12T16:00:00.000Z",
    },
  ],
};
