import { INTEGRATION_CONTRACT_VERSION, type PublicImpactNarrative } from "./contracts.ts";
/** Deterministic, non-production fixture for contract review and UI development. */
export const communityHardwareFixture: PublicImpactNarrative = {
  decision: {
    schemaVersion: INTEGRATION_CONTRACT_VERSION,
    allocationId: "alloc_community_hardware",
    fundName: "Community Hardware Fund",
    rationale:
      "Hands-on computing equipment enables an accessible introductory robotics workshop.",
    status: "approved",
    publishedAt: "2026-08-02T16:00:00.000Z",
  },
  events: [
    {
      schemaVersion: INTEGRATION_CONTRACT_VERSION,
      allocationId: "alloc_community_hardware",
      eventId: "evt_001",
      type: "purchase_approved",
      occurredAt: "2026-08-03T16:00:00.000Z",
      verificationStatus: "verified",
      evidenceReference: "purchase-approval-001",
    },
    {
      schemaVersion: INTEGRATION_CONTRACT_VERSION,
      allocationId: "alloc_community_hardware",
      eventId: "evt_002",
      type: "receipt_attached",
      occurredAt: "2026-08-04T16:00:00.000Z",
      verificationStatus: "verified",
      evidenceReference: "receipt-record-001",
    },
    {
      schemaVersion: INTEGRATION_CONTRACT_VERSION,
      allocationId: "alloc_community_hardware",
      eventId: "evt_003",
      type: "attendance_verified",
      occurredAt: "2026-08-12T16:00:00.000Z",
      verificationStatus: "verified",
      evidenceReference: "attendance-record-001",
    },
  ],
};
