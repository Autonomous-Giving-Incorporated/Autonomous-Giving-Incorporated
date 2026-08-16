import type { Metadata } from "next";
import Link from "next/link";
import { absoluteSiteUrl } from "@/site";

export const metadata: Metadata = {
  title: "AGI sign in",
  description: "Sign in to the AGI control plane.",
  alternates: { canonical: absoluteSiteUrl("/login") },
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="control-plane-page">
      <div className="page-shell control-plane-shell control-plane-login">
        <p className="kicker">AGI authentication</p>
        <h1 className="section-heading">Sign in through AGI.</h1>
        <p className="section-copy">
          AGI owns the application session and authorization boundary. Supabase Auth
          provides identity; AGI decides which tenant, project, and capability routes
          the signed-in operator may access.
        </p>

        <section className="control-plane-login-card" aria-labelledby="login-status">
          <p className="kicker">Integration state</p>
          <h2 id="login-status">Sign-in is parked. Production login is not enabled.</h2>
          <p>
            Login, Phase 2 workspace completion, SPEC-028 runtime, and director JWT
            acceptance are parked (2026-08-16 PT). Do not enter credentials on this
            page. This static export does not authenticate.
          </p>
          <div className="control-plane-actions">
            <Link className="button button-primary focus-ring" href="/admin">
              View control-plane shell
            </Link>
            <Link className="button button-quiet focus-ring" href="/">
              Return to public workbench
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
