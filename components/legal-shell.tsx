import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

const nav = [
  ["Legal hub", "/legal"],
  ["Privacy", "/legal/privacy"],
  ["Terms of use", "/legal/terms"],
  ["Home", "/"],
] as const;

export function LegalShell({
  title,
  kicker = "Governance",
  children,
}: {
  title: string;
  kicker?: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="legal-topbar">
        <div className="page-shell legal-topbar-inner">
          <Link className="brand focus-ring" href="/" aria-label="AGI home">
            <Image
              className="brand-symbol"
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/agi-wordmark.png`}
              alt="Autonomously Giving Incorporated"
              width={1200}
              height={290}
            />
          </Link>
          <nav className="legal-nav" aria-label="Legal sections">
            {nav.map(([label, href]) => (
              <Link className="focus-ring" href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="page-shell legal-main">
        <p className="kicker">{kicker}</p>
        <h1 className="section-heading">{title}</h1>
        <p className="legal-meta">
          Effective date: 2026-08-08 · Autonomously Giving Incorporated ·{" "}
          <a className="focus-ring" href="mailto:legal@autogive.app">
            legal@autogive.app
          </a>
        </p>
        <div className="legal-prose">{children}</div>
      </main>

      <footer className="legal-footer">
        <div className="page-shell legal-footer-inner">
          <span>Software by Zero State</span>
          <nav className="footer-legal" aria-label="Brand and legal">
            <Link href="/brand#tokens">Tokens</Link>
            <Link href="/brand#logo">Logo use</Link>
            <Link href="/legal">Legal</Link>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/terms">Terms</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
