import { ArrowDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import { DonationDemo } from "@/components/donation-demo";
import { Navbar } from "@/components/navbar";
import { PublicSignals } from "@/components/public-signals";
import { formatDiagnosticLine } from "@/integration/diagnostics";
import { getPublicSignals } from "@/integration/public-sources";

const lifecycle = [
  ["01", "Need · 25 laptops", "stated"],
  ["02", "Human approval", "approved"],
  ["03", "Allocation · $2,500", "assigned"],
  ["04", "Community AI Lab verified", "verified"],
];

const system = [
  [
    "01",
    "Portfolio Signals",
    "Finds high-impact opportunities and documents allocation rationale.",
    "advisory",
  ],
  [
    "02",
    "Autonomously Giving Inc.",
    "Makes the contribution journey legible to the people who funded it.",
    "experience",
  ],
  [
    "03",
    "Impact Relay",
    "Preserves approved use, evidence, and verified program outcomes.",
    "evidence",
  ],
];

const products = [
  {
    id: "portfolio-signals",
    name: "Portfolio Signals",
    sub: "Decision intelligence",
    copy: "A demonstration of the decision layer—where high-impact opportunities, allocation strategies, and the reasoning behind them come into focus.",
    points: [
      "Identify high-impact funding opportunities",
      "Recommend allocation strategies",
      "Explain why a decision is appropriate",
    ],
  },
  {
    id: "impact-relay",
    name: "Impact Relay",
    sub: "Execution transparency",
    copy: "A demonstration of the transparency layer—where approved use, supporting evidence, and verified impact remain connected.",
    points: [
      "Track approved use of funds",
      "Attach evidence and verification",
      "Notify donors when impact occurs",
    ],
  },
];

export default async function Home() {
  const signals = await getPublicSignals();

  // Build-time only: privacy-safe selection summary for CI logs.
  console.info(formatDiagnosticLine(signals));

  return (
    <>
      <Navbar />
      <main id="top">
        <section className="hero page-shell" aria-labelledby="hero-heading">
          <div className="hero-content">
            <div className="hero-copy-block">
              <p className="kicker">Autonomously Giving Incorporated</p>
              <h1 id="hero-heading" className="hero-title">
                Giving should not end <span>with a receipt.</span>
              </h1>
              <p className="hero-copy">
                Follow a contribution from funding intent to verified community
                impact—with the evidence needed to understand what happened next.
              </p>
              <div className="hero-actions">
                <a className="button button-primary focus-ring" href="#demo">
                  Experience the proof <ArrowDown aria-hidden="true" size={16} />
                </a>
                <a className="button button-quiet focus-ring" href="#platform">
                  Inspect the system <ArrowRight aria-hidden="true" size={16} />
                </a>
              </div>
            </div>
            <aside
              className="hero-instrument"
              aria-label="Example contribution lifecycle"
            >
              <div className="instrument-head">
                <strong>$2,500</strong>
                <span>Evidence chain 04/04</span>
              </div>
              {lifecycle.map(([index, label, state]) => (
                <div className="instrument-row" key={index}>
                  <span className="instrument-index">{index}</span>
                  <span>{label}</span>
                  <span className="instrument-state">{state}</span>
                </div>
              ))}
            </aside>
          </div>
          <div className="hero-visual">
            <Image
              className="hero-visual-image"
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/autogive-hero-v2.jpg`}
              alt="Autonomously Giving Incorporated — evidence from funding to impact"
              width={1168}
              height={784}
              priority
              sizes="(max-width: 900px) 100vw, min(36rem, 42vw)"
            />
            <div className="hero-visual-fade" aria-hidden="true" />
          </div>
        </section>

        <section className="section">
          <div className="page-shell trust-layout">
            <div>
              <h2 className="section-heading">
                A receipt confirms arrival. It does not explain what happened
                next.
              </h2>
            </div>
            <div className="comparison">
              <article className="comparison-row">
                <h3>Traditional giving</h3>
                <div className="comparison-flow">
                  <strong>Donate</strong>
                  <span className="flow-separator">→</span>
                  <span>Thank-you email</span>
                  <span className="flow-separator">→</span>
                  <span>Silence</span>
                </div>
              </article>
              <article className="comparison-row">
                <h3>With AGI</h3>
                <div className="comparison-flow">
                  {[
                    "Donate",
                    "Allocate",
                    "Purchase",
                    "Verify",
                    "Impact",
                    "Notify",
                  ].map((item, index) => (
                    <span key={item}>
                      <strong>{item}</strong>
                      {index < 5 ? (
                        <span className="flow-separator"> → </span>
                      ) : null}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="platform">
          <div className="page-shell">
            <p className="kicker">Trust infrastructure</p>
            <h2 className="section-heading">
              Three layers. One inspectable story.
            </h2>
            <p className="section-copy">
              The platform connects decision rationale, donor experience, and
              outcome evidence without pretending they are the same record.
            </p>
            <div className="system-map">
              {system.map(([index, name, copy, state]) => (
                <article className="system-row" key={name}>
                  <span className="system-row-number">{index}</span>
                  <h3>{name}</h3>
                  <p>{copy}</p>
                  <span className="system-row-state">{state}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <PublicSignals signals={signals} />
        <DonationDemo />

        <section className="section">
          <div className="page-shell">
            <h2 className="section-heading">
              Decision quality before funding. Accountability after it.
            </h2>
            {products.map(({ id, name, sub, copy, points }) => (
              <article className="product-row" id={id} key={id}>
                <div>
                  <h3 className="product-name">{name}</h3>
                  <p className="product-sub">{sub}</p>
                </div>
                <div>
                  <p className="product-copy">{copy}</p>
                  <ul className="product-points">
                    {points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="page-shell contract-block">
            <div>
              <h2 className="section-heading">
                Deterministic now. Ready for live evidence later.
              </h2>
            </div>
            <pre className="contract-code" aria-label="Platform data flow">
              <code>{`static scenario
  → Portfolio Signals recommendation
  → approved allocation
  → Impact Relay evidence event
  → AGI donor notification`}</code>
            </pre>
          </div>
        </section>

        <section className="section" id="about">
          <div className="page-shell about-strip">
            <h2 className="section-heading">
              Transparency is a product promise.
            </h2>
            <p>
              Autonomously Giving Incorporated is the public flagship for a more
              legible form of philanthropy: Portfolio Signals informs decisions, AGI
              makes their journey understandable, and Impact Relay preserves
              what was verified after resources moved.
            </p>
          </div>
        </section>
      </main>

      <footer className="statement-footer" id="contact">
        <div className="page-shell">
          <p className="statement">Ready to make giving visible?</p>
          <a
            className="statement-link focus-ring"
            href="mailto:hello@autogive.app?subject=Request%20a%20demo"
          >
            Request a demo <ArrowRight aria-hidden="true" size={18} />
          </a>
          <div className="footer-meta">
            <span>Autonomously Giving Incorporated · autogive.app</span>
            <nav className="footer-legal" aria-label="Brand and legal">
              <span className="footer-builder">Software by Zero State</span>
              <a href="https://autogive.app/brand#tokens">Tokens</a>
              <a href="https://autogive.app/brand#logo">Logo use</a>
              <a href="https://autogive.app/legal">Legal</a>
              <a href="https://autogive.app/legal/privacy">Privacy</a>
              <a href="https://autogive.app/legal/terms">Terms</a>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
