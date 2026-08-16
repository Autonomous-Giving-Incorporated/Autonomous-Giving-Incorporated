export type DemoScenario = {
  organization: { name: string; location: string };
  donation: { amount: number; currency: "USD" };
  allocation: { name: string };
  purchase: { item: string; vendor: string; amount: number };
  program: { name: string };
  impact: { attendees: number; status: "verified" };
  notification: { title: string; message: string; status: "delivered" };
};

/** Public replay fixture. Not the canonical SPEC-011 Community AI Lab demo until E2. */
export const scenario: DemoScenario = {
  organization: { name: "Hacker Dojo", location: "Mountain View, CA" },
  donation: { amount: 250, currency: "USD" },
  allocation: { name: "Community Hardware Fund" },
  purchase: { item: "Raspberry Pi Kits", vendor: "Pi Supply", amount: 250 },
  program: { name: "Intro to Robotics" },
  impact: { attendees: 18, status: "verified" },
  notification: {
    title: "Your impact is verified",
    message: "18 students attended Intro to Robotics.",
    status: "delivered",
  },
};
