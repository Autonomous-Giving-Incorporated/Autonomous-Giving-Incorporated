import type { Metadata } from "next";
import { LegalShell } from "@/components/legal-shell";
import { absoluteSiteUrl } from "@/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "Privacy notice for Autonomously Giving Incorporated and the AGI suite (Portfolio Signals, Impact Relay public surfaces).",
  alternates: { canonical: absoluteSiteUrl("/legal/privacy") },
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy notice" kicker="Privacy">
      <p>
        This notice explains how <strong>Autonomously Giving Incorporated</strong>{" "}
        (“AGI”, “we”) handles information in connection with{" "}
        <strong>autogive.app</strong>, Portfolio Signals, Impact Relay public
        surfaces, and related operator tooling. It is written for a multi-tenant
        nonprofit software product that separates <em>public aggregates</em> from{" "}
        <em>authenticated campaign operations</em>.
      </p>

      <h2>1. Roles</h2>
      <ul>
        <li>
          <strong>Visitors</strong> to public pages (marketing, public director
          shells, public impact aggregates).
        </li>
        <li>
          <strong>Operators and directors</strong> who authenticate to Portfolio
          Signals workspace (and related authenticated tools) on behalf of a client
          nonprofit / tenant.
        </li>
        <li>
          <strong>Client organizations (tenants)</strong> that configure their
          workspace. For campaign and constituent data the client uploads or
          creates, the client typically acts as the organization responsible for
          that data; AGI provides the platform.
        </li>
      </ul>

      <h2>2. Information we process</h2>
      <h3>2.1 Public / marketing surfaces</h3>
      <ul>
        <li>
          Standard web logs and security telemetry (IP address, user agent, request
          path, timestamps) from hosting providers (for example Vercel).
        </li>
        <li>
          Contact details you voluntarily send (for example demo requests to{" "}
          <a href="mailto:hello@autogive.app">hello@autogive.app</a>).
        </li>
        <li>
          Public aggregate campaign or impact JSON used to render privacy-safe
          pages — not raw member or donor registries.
        </li>
      </ul>
      <h3>2.2 Authenticated workspace</h3>
      <ul>
        <li>
          Account identifiers and authentication data via our identity provider
          (for example Supabase Auth): email, session tokens, MFA enrollment
          status flags, profile role.
        </li>
        <li>
          Tenant membership (which clients you may access) and platform admin
          appointments where applicable.
        </li>
        <li>
          Client configuration (public brand/content drafts and published
          versions), operational records the client chooses to store (for example
          pipeline notes, import quarantine metadata, onboarding documents in
          private storage), and audit events of privileged actions.
        </li>
      </ul>
      <h3>2.3 What we do not put on public pages or in git</h3>
      <p>
        Public suite pages and public source repositories must not contain raw
        member lists, personal emails/phones/addresses, donation histories tied to
        individuals, attendance-level PII, private notes, consent/suppression
        state, or private campaign documents. Those classes of data, when
        processed at all, belong only in authenticated systems with access control
        and (where applicable) private storage.
      </p>

      <h2>3. Purposes</h2>
      <ul>
        <li>Operate and secure the suite (auth, MFA gates, abuse prevention).</li>
        <li>Provide multi-tenant workspaces and product features you enable.</li>
        <li>Show privacy-safe public storytelling and aggregates.</li>
        <li>Respond to support, demo, and legal requests.</li>
        <li>Improve reliability and document product status for operators.</li>
      </ul>

      <h2>4. Legal bases (where applicable)</h2>
      <p>
        Depending on jurisdiction, processing may rely on: performance of a
        contract with your organization; legitimate interests in securing and
        operating the service; consent where you provide it (for example marketing
        email); and legal obligations when they apply. Clients remain responsible
        for lawful bases for any constituent or donor data they load into their
        tenant.
      </p>

      <h2>5. Sharing</h2>
      <ul>
        <li>
          <strong>Processors / subprocessors</strong> that host or deliver the
          service (for example cloud hosting, database/auth, email delivery for
          magic links). They process data on instructions and under agreements
          appropriate to the service.
        </li>
        <li>
          <strong>Donation platforms</strong> (for example every.org) if you
          connect them — those services have their own privacy policies; AGI does
          not control their processing of donor payment data.
        </li>
        <li>
          <strong>Legal demands</strong> when required by law, or to protect
          rights, safety, and the integrity of the service.
        </li>
      </ul>
      <p>We do not sell personal information.</p>

      <h2>6. Retention</h2>
      <p>
        We retain account, audit, and tenant operational data for as long as needed
        to provide the service, meet security and accountability needs, and comply
        with law. Clients should apply their own retention and legal-hold policies
        to campaign records and private documents. See also Portfolio Signals
        operator docs on retention and legal hold where published.
      </p>

      <h2>7. Security</h2>
      <p>
        We use industry-standard controls appropriate to a multi-tenant SaaS
        product: TLS in transit, access control and row-level security patterns for
        tenant data, MFA enforcement for privileged roles, private storage for
        restricted documents, and audit logging of sensitive actions. No method of
        transmission or storage is 100% secure; report suspected incidents to{" "}
        <a href="mailto:legal@autogive.app">legal@autogive.app</a>.
      </p>

      <h2>8. Your choices and rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, delete,
        or export personal data, or to object to or restrict certain processing.
        Operators can often update profile and membership data in-product; for
        other requests contact{" "}
        <a href="mailto:legal@autogive.app">legal@autogive.app</a>. We may need to
        verify the request and may direct constituent-level requests to the client
        organization that controls that tenant’s campaign data.
      </p>
      <p>
        If you are a California resident, you may have additional rights under the
        CCPA/CPRA (for example to know, delete, and correct personal information,
        and to non-discrimination for exercising rights). We do not sell or share
        personal information for cross-context behavioral advertising as those
        terms are commonly defined.
      </p>

      <h2>9. Children</h2>
      <p>
        The service is directed to organizational users and adults acting for
        nonprofits. It is not directed to children under 13 (or the age of digital
        consent in your jurisdiction).
      </p>

      <h2>10. International transfers</h2>
      <p>
        Infrastructure may be located in the United States or other regions used by
        our providers. Where required, we rely on appropriate transfer mechanisms
        offered by those providers.
      </p>

      <h2>11. Changes</h2>
      <p>
        We will update this notice when practices change materially and revise the
        effective date. Continued use after an update constitutes notice of the
        revised practices for the product surfaces described.
      </p>

      <h2>12. Contact</h2>
      <p>
        Autonomously Giving Incorporated
        <br />
        Privacy: <a href="mailto:legal@autogive.app">legal@autogive.app</a>
        <br />
        Web: <a href="https://autogive.app">https://autogive.app</a>
      </p>
    </LegalShell>
  );
}
