import type { Metadata } from "next";
import Link from "next/link";
import { absoluteSiteUrl } from "@/site";
import tenantFixture from "@/integration/fixtures/hacker-dojo-tenant.json";

export const metadata: Metadata = {
  title: "Admin control plane",
  description:
    "AGI authentication and routing surface for authorized tenant and project work.",
  alternates: { canonical: absoluteSiteUrl("/admin") },
  robots: { index: false, follow: false },
};

const routes = [
  ["Portfolio Signals", "Decision intelligence and allocation workflow", "/portfolio-signals/"],
  ["Impact Relay", "Evidence, verification, and impact projection", "/impact-relay/"],
] as const;

const formatAmount = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

export default function AdminPage() {
  return (
    <main className="control-plane-page">
      <div className="page-shell control-plane-shell">
        <p className="kicker">AGI control plane</p>
        <h1 className="section-heading">One secure route into the suite.</h1>
        <p className="section-copy">
          AGI authenticates the operator, establishes tenant and project context,
          then routes authorized work to the capability that owns it.
        </p>

        <div className="control-plane-status" role="status">
          <span className="control-plane-status-dot" aria-hidden="true" />
          <div>
            <strong>Control-plane runtime is parked</strong>
            <p>
              This static export is a labeled shell. Production sign-in, SPEC-028
              runtime, and director JWT acceptance are parked (2026-08-16 PT). Do
              not enter credentials here. Hacker Dojo projects below are a
              non-canonical integration fixture, not the SPEC-011 demo.
            </p>
          </div>
        </div>

        <section className="control-plane-grid" aria-label="Control-plane responsibilities">
          <article className="control-plane-card">
            <p className="kicker">01 · Identity</p>
            <h2>AGI owns access.</h2>
            <p>Supabase Auth supplies identity. AGI evaluates roles, capabilities, and tenant policy.</p>
          </article>
          <article className="control-plane-card">
            <p className="kicker">02 · Context</p>
            <h2>Projects stay scoped.</h2>
            <p>Hacker Dojo projects carry stable tenant and project identifiers across the suite.</p>
          </article>
          <article className="control-plane-card">
            <p className="kicker">03 · Routing</p>
            <h2>Capabilities keep ownership.</h2>
            <p>Fund-Intel owns decisions and allocations. Impact Relay owns evidence and verification.</p>
          </article>
        </section>

        <section className="control-plane-projects" aria-labelledby="tenant-projects">
          <div>
            <p className="kicker">Tenant workspace · {tenantFixture.tenant_id}</p>
            <h2 id="tenant-projects" className="section-heading">
              {tenantFixture.name} projects ready for delegation.
            </h2>
            <p className="section-copy">
              AGI keeps the tenant boundary stable while each project remains an
              individually allocatable and impact-trackable unit.
            </p>
          </div>
          <div className="control-plane-project-list">
            {tenantFixture.projects.map((project) => (
              <article className="control-plane-project" key={project.project_id}>
                <div className="control-plane-project-header">
                  <div>
                    <p className="kicker">{project.project_id}</p>
                    <h3>{project.name}</h3>
                  </div>
                  <strong>{formatAmount(project.requested_amount, project.currency)}</strong>
                </div>
                <p>{project.need}</p>
                <dl className="control-plane-project-status">
                  <div>
                    <dt>Recommendation</dt>
                    <dd>{project.recommendation_status}</dd>
                  </div>
                  <div>
                    <dt>Allocation</dt>
                    <dd>{project.allocation_status}</dd>
                  </div>
                  <div>
                    <dt>Impact delegation</dt>
                    <dd>{project.delegation_status}</dd>
                  </div>
                </dl>
                <div className="control-plane-project-actions">
                  <Link
                    className="button button-quiet focus-ring"
                    href={`/portfolio-signals/?tenant_id=${tenantFixture.tenant_id}&project_id=${project.project_id}`}
                  >
                    Allocation view
                  </Link>
                  <Link
                    className="button button-quiet focus-ring"
                    href={`/impact-relay/?tenant_id=${tenantFixture.tenant_id}&project_id=${project.project_id}`}
                  >
                    Impact view
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="control-plane-routes" aria-labelledby="capability-routes">
          <p className="kicker">Capability routes</p>
          <h2 id="capability-routes" className="section-heading">
            Continue to the system that owns the work.
          </h2>
          <div className="control-plane-route-list">
            {routes.map(([name, description, href]) => (
              <Link className="control-plane-route" href={href} key={href}>
                <span>
                  <strong>{name}</strong>
                  <small>{description}</small>
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="control-plane-actions">
          <Link className="button button-primary focus-ring" href="/login">
            Go to AGI sign in
          </Link>
          <Link className="button button-quiet focus-ring" href="/">
            Return to public workbench
          </Link>
        </div>
      </div>
    </main>
  );
}
