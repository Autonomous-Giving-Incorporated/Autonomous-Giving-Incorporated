import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";
import { absoluteSiteUrl } from "@/site";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Legal notices, product disclaimers, privacy, and terms for Autonomously Giving Incorporated and the AGI suite.",
  alternates: { canonical: absoluteSiteUrl("/legal") },
};

export default function LegalHubPage() {
  return (
    <LegalShell title="Legal notices">
      <p>
        These pages describe how <strong>Autonomously Giving Incorporated (AGI)</strong>{" "}
        and the public suite products — <strong>Portfolio Signals</strong>, this{" "}
        <strong>AGI</strong> workbench, and <strong>Impact Relay</strong> public
        surfaces — are intended to be used. They are product and privacy notices for
        operators, directors, and visitors. They are not a substitute for advice from
        your counsel, accountant, or compliance officer.
      </p>

      <h2>Documents</h2>
      <ul>
        <li>
          <a href="/legal/privacy">Privacy notice</a> — what we process, what stays
          off public pages, and how to contact us about personal data.
        </li>
        <li>
          <a href="/legal/terms">Terms of use</a> — acceptable use, account security,
          disclaimers, and limits of the service.
        </li>
      </ul>

      <h2>What this suite is</h2>
      <ul>
        <li>
          <strong>Decision and evidence software</strong> for nonprofit operators and
          directors — campaign intelligence, allocation workflows, and public
          aggregate impact storytelling.
        </li>
        <li>
          Multi-tenant SaaS on shared infrastructure (for example platform Supabase
          and Vercel hosting), with tenant isolation enforced by product design and
          access controls.
        </li>
      </ul>

      <h2>What this suite is not</h2>
      <ul>
        <li>
          <strong>Not a bank, money transmitter, escrow, or payment processor.</strong>{" "}
          Donations and payment instruments are handled by third parties you choose
          (for example every.org or your payment provider). AGI does not hold donor
          funds.
        </li>
        <li>
          <strong>Not legal, tax, investment, or accounting advice.</strong>{" "}
          Outputs are advisory decision-support materials for humans who remain
          accountable for nonprofit, campaign, and fiduciary decisions.
        </li>
        <li>
          <strong>Not authorization to solicit or contact people.</strong> Historical
          membership, attendance, or donor lists do not by themselves establish consent
          or outreach authority. Production CRM import and outreach remain
          leadership-gated in product policy.
        </li>
        <li>
          <strong>Not a public CRM.</strong> Public suite pages and GitHub/static
          portals are limited to privacy-safe aggregates. Person-level campaign
          records, if any, belong only in authenticated systems under explicit
          controls.
        </li>
      </ul>

      <h2>Product-specific notes</h2>
      <h3>Portfolio Signals</h3>
      <p>
        Public director shell and authenticated workspace for campaign decisions,
        client configuration, and (when enabled) governed import quarantine and
        document onboarding. Status badges such as “Execution blocked” and “outreach
        not granted” are intentional product gates, not marketing copy alone.
      </p>
      <h3>Impact Relay (public)</h3>
      <p>
        Public aggregates of progress, use-of-funds framing, and digests. Not a
        substitute for audited financial statements or Form 990 filings.
      </p>
      <h3>Allocation middleware pilot</h3>
      <p>
        Human-in-the-loop pots → allocate → proof → packet tooling. Live donation
        platform webhooks and production money movement remain operator-configured and
        separately authorized.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy and legal requests:{" "}
        <a href="mailto:legal@autogive.app">legal@autogive.app</a>
        <br />
        Product / demos:{" "}
        <a href="mailto:hello@autogive.app">hello@autogive.app</a>
      </p>
      <p className="legal-note">
        Effective 2026-08-08. We may update these notices; the effective date above
        (and on each page) will change when material revisions ship.
      </p>
    </LegalShell>
  );
}
