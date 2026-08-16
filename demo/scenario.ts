export type DemoScenario = {
  id: "community-ai-lab";
  organization: { name: "Community AI Lab"; location: string };
  need: { summary: string; quantity: 25; item: "laptops" };
  donation: { amount: 2500; currency: "USD" };
  allocation: {
    name: string;
    allocationId: "c6c2e191-3000-4000-8000-000000000001";
  };
  purchase: { item: string; vendor: string; amount: 2500 };
  program: { name: string };
  impact: { attendees: 25; status: "verified" };
  notification: {
    title: string;
    message: string;
    status: "delivered";
  };
  money: {
    giftTracked: true;
    agiProcessedDonation: false;
    stripeDonation: false;
    contactableDonor: false;
    impactNoticeIssued: false;
  };
};

export const CANONICAL_DEMO_STAGES = [
  "Need",
  "Fund Intel Recommendation",
  "Human Approval",
  "Allocation",
  "Purchase",
  "Evidence",
  "Receipt",
  "Verification",
  "Impact",
  "Notification",
] as const;

/** Canonical SPEC-011 public replay. Hacker Dojo is not this fixture. */
export const scenario: DemoScenario = {
  id: "community-ai-lab",
  organization: { name: "Community AI Lab", location: "Neighborhood learning lab" },
  need: {
    summary: "25 laptops for a neighborhood AI learning lab",
    quantity: 25,
    item: "laptops",
  },
  donation: { amount: 2500, currency: "USD" },
  allocation: {
    name: "Community AI Lab equipment",
    allocationId: "c6c2e191-3000-4000-8000-000000000001",
  },
  purchase: { item: "25 laptops", vendor: "Community hardware supplier", amount: 2500 },
  program: { name: "Neighborhood AI learning lab" },
  impact: { attendees: 25, status: "verified" },
  notification: {
    title: "Impact is verified",
    message: "25 laptops reached the Community AI Lab neighborhood learning lab.",
    status: "delivered",
  },
  money: {
    giftTracked: true,
    agiProcessedDonation: false,
    stripeDonation: false,
    contactableDonor: false,
    impactNoticeIssued: false,
  },
};
