import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CANONICAL_DEMO_STAGES, scenario } from "../demo/scenario.ts";

describe("canonical SPEC-011 demo", () => {
  it("is Community AI Lab with 25 laptops and 2500 USD", () => {
    assert.equal(scenario.id, "community-ai-lab");
    assert.equal(scenario.organization.name, "Community AI Lab");
    assert.equal(scenario.need.quantity, 25);
    assert.equal(scenario.need.item, "laptops");
    assert.match(scenario.need.summary, /25 laptops/);
    assert.equal(scenario.donation.amount, 2500);
    assert.equal(scenario.donation.currency, "USD");
    assert.equal(
      scenario.allocation.allocationId,
      "c6c2e191-3000-4000-8000-000000000001",
    );
    assert.equal(scenario.impact.attendees, 25);
    assert.equal(scenario.purchase.amount, 2500);
  });

  it("keeps the required lifecycle order", () => {
    assert.deepEqual([...CANONICAL_DEMO_STAGES], [
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
    ]);
  });

  it("records the money boundary and omits donor identity", () => {
    assert.equal(scenario.money.agiProcessedDonation, false);
    assert.equal(scenario.money.stripeDonation, false);
    assert.equal(scenario.money.contactableDonor, false);
    assert.equal(scenario.money.impactNoticeIssued, false);
    assert.equal(scenario.money.giftTracked, true);
    assert.equal("donor" in scenario, false);
    assert.notEqual(scenario.organization.name, "Hacker Dojo");
    assert.notEqual(scenario.donation.amount, 250);
  });
});
