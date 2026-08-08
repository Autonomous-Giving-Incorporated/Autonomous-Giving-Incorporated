import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";
import { absoluteSiteUrl } from "@/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "Terms of use for Autonomously Giving Incorporated suite products including Portfolio Signals and public Impact Relay surfaces.",
  alternates: { canonical: absoluteSiteUrl("/legal/terms") },
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of use" kicker="Terms">
      <p>
        These Terms govern access to and use of <strong>autogive.app</strong> and
        the AGI suite products made available by{" "}
        <strong>Autonomously Giving Incorporated</strong> (“AGI”, “we”), including
        Portfolio Signals, the AGI public workbench, and Impact Relay public
        surfaces (together, the “Services”). By using the Services you agree to
        these Terms. If you use the Services on behalf of an organization, you
        represent that you have authority to bind that organization.
      </p>

      <h2>1. The Services</h2>
      <p>
        The Services provide software for nonprofit operators and directors to
        support campaign decision-making, configuration, evidence workflows, and
        privacy-safe public storytelling. Features may be labeled pilot,
        experimental, blocked, or operator-gated; those labels are part of the
        product’s control model.
      </p>

      <h2>2. Accounts and security</h2>
      <ul>
        <li>
          You must provide accurate account information and keep credentials
          confidential.
        </li>
        <li>
          Privileged roles may require multi-factor authentication (MFA). You must
          not attempt to bypass MFA, row-level security, or other access controls.
        </li>
        <li>
          You are responsible for activity under your accounts and for promptly
          notifying us of suspected unauthorized access.
        </li>
      </ul>

      <h2>3. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          Upload unlawful content, or content you lack rights or lawful basis to
          process (including personal data without an appropriate basis).
        </li>
        <li>
          Use the Services to conduct outreach, solicitation, or messaging without
          a lawful basis and without your organization’s authorization — the
          product does not grant outreach authority by default.
        </li>
        <li>
          Attempt to access another tenant’s data, probe security controls without
          authorization, reverse engineer except as allowed by law, or disrupt the
          Services.
        </li>
        <li>
          Misrepresent aggregates, impact claims, or partner relationships on
          public surfaces.
        </li>
        <li>
          Place prohibited personal data into public repositories, public pages, or
          other surfaces that the product designates as public-only.
        </li>
      </ul>

      <h2>4. Customer data and documents</h2>
      <p>
        Content you or your organization submit to authenticated systems (“Customer
        Data”) remains subject to your organization’s policies. You grant AGI a
        limited license to host, process, and display Customer Data solely to
        provide and secure the Services. Private document packs and import
        quarantine features, when enabled, store materials for operational use under
        access controls; they do not by themselves authorize production CRM import
        or public disclosure.
      </p>

      <h2>5. Third-party services</h2>
      <p>
        The Services may integrate with third parties (for example donation
        platforms, identity providers, or cloud hosts). Your use of those services
        is governed by their terms and privacy policies. AGI is not responsible for
        third-party services and does not process card payments or hold donor funds.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        AGI and its licensors own the Services, branding, and documentation
        (excluding Customer Data and third-party marks). You may not copy or create
        derivative works of the Services except as allowed by a written agreement or
        open-source licenses that apply to specific components.
      </p>

      <h2>7. Disclaimers</h2>
      <p>
        THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT
        PERMITTED BY LAW, AGI DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, OR
        STATUTORY, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
        NON-INFRINGEMENT.
      </p>
      <p>
        Without limiting the foregoing: the Services do not constitute legal, tax,
        accounting, investment, or fundraising-compliance advice; outputs are
        decision-support materials for human review; public pages may show
        illustrative or reference-tenant data; and pilot or blocked features may be
        incomplete.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, AGI AND ITS SUPPLIERS WILL NOT BE
        LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
        DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL, ARISING FROM
        USE OF THE SERVICES. AGI’S TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE
        SERVICES WILL NOT EXCEED THE GREATER OF (A) AMOUNTS YOU PAID TO AGI FOR THE
        SERVICES IN THE TWELVE MONTHS BEFORE THE CLAIM OR (B) ONE HUNDRED U.S.
        DOLLARS (US $100) IF YOU HAVE NOT PAID FEES.
      </p>
      <p>
        Some jurisdictions do not allow certain limitations; in those cases, limits
        apply to the fullest extent permitted.
      </p>

      <h2>9. Indemnity</h2>
      <p>
        You will defend and indemnify AGI against claims arising from your Customer
        Data, your misuse of the Services, or your violation of these Terms or
        applicable law, except to the extent caused by AGI’s willful misconduct.
      </p>

      <h2>10. Suspension and termination</h2>
      <p>
        We may suspend or terminate access for violations of these Terms, risk to
        the Services or other tenants, non-payment (if applicable), or legal
        requirements. You may stop using the Services at any time. Provisions that
        by nature should survive (including IP, disclaimers, liability limits, and
        indemnity) survive termination.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may modify the Services and these Terms. Material changes to Terms will
        be indicated by updating the effective date on this page. Continued use
        after the effective date constitutes acceptance of the revised Terms.
      </p>

      <h2>12. General</h2>
      <p>
        These Terms are the entire agreement for the Services described, unless a
        separate written agreement with AGI applies. If a provision is
        unenforceable, the remainder stays in effect. Failure to enforce a
        provision is not a waiver. You may not assign these Terms without our
        consent; we may assign them in connection with a reorganization or sale.
      </p>
      <p>
        Governing law and venue will be determined by a written order form or
        enterprise agreement if one exists; otherwise, disputes will be resolved in
        accordance with the laws applicable to AGI’s principal place of business,
        without regard to conflict-of-law rules, except where mandatory consumer
        protections apply.
      </p>

      <h2>13. Contact</h2>
      <p>
        <a href="mailto:legal@autogive.app">legal@autogive.app</a> ·{" "}
        <a href="https://autogive.app/legal">https://autogive.app/legal</a>
      </p>
    </LegalShell>
  );
}
