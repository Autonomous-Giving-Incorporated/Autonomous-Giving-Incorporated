"use client";

import { Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { scenario } from "@/demo/scenario";

const steps = [
  "Donation received",
  "Assigned to Community Hardware Fund",
  "Raspberry Pi kits selected",
  "Purchase approved",
  "Receipt attached",
  "Equipment delivered",
  "Intro to Robotics workshop held",
  "Attendance verified: 18 students",
  "Donor notification delivered",
];

const provenance = [
  "Notification",
  "Workshop verified",
  "Attendance evidence",
  "Equipment used",
  "Receipt approved",
  "Fund allocation",
  "Donation",
];

export function DonationDemo() {
  const [step, setStep] = useState(-1);
  const [showProvenance, setShowProvenance] = useState(false);
  const running = step >= 0 && step < steps.length - 1;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(
      () => setStep((current) => current + 1),
      3500,
    );
    return () => window.clearTimeout(timer);
  }, [step, running]);

  function start() {
    setShowProvenance(false);
    setStep(0);
  }

  function reset() {
    setShowProvenance(false);
    setStep(-1);
  }

  return (
    <section className="demo-section" id="demo">
      <div className="page-shell">
        <div className="demo-intro">
          <div>
            <p className="kicker">Proof timeline</p>
            <h2 className="section-heading">
              One contribution. A visible chain of evidence.
            </h2>
          </div>
          <p className="section-copy">
            A deterministic representation of allocation-backed transparency—not
            a live payment or one-to-one attribution system.
          </p>
        </div>

        <div className="demo-workbench">
          <div className="timeline">
            <p className="demo-label">
              Donation lifecycle · ${scenario.donation.amount}
            </p>
            <ol
              className="timeline-list"
              aria-live="polite"
              aria-label="Donation lifecycle status"
            >
              {steps.map((title, index) => {
                const done = index <= step;
                return (
                  <li
                    className={`timeline-item${done ? " is-done" : ""}`}
                    key={title}
                  >
                    <span className="timeline-index" aria-hidden="true">
                      {done ? "✓" : String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{title}</span>
                  </li>
                );
              })}
            </ol>
            <div className="demo-actions">
              {step < 0 ? (
                <button
                  className="button button-primary focus-ring"
                  type="button"
                  onClick={start}
                >
                  <Play aria-hidden="true" fill="currentColor" size={15} />{" "}
                  Donate $250
                </button>
              ) : (
                <button
                  className="button button-quiet focus-ring"
                  type="button"
                  onClick={reset}
                >
                  <RotateCcw aria-hidden="true" size={15} /> Reset demo
                </button>
              )}
              {step === steps.length - 1 ? (
                <button
                  className="text-button focus-ring"
                  type="button"
                  onClick={() => setShowProvenance((current) => !current)}
                  aria-expanded={showProvenance}
                >
                  {showProvenance
                    ? "Return to evidence"
                    : "Why was I notified?"}
                </button>
              ) : null}
            </div>
          </div>

          <div className="ledger">
            <p className="demo-label">Evidence ledger</p>
            {step < 0 ? (
              <div className="ledger-idle">
                <p className="ledger-amount">$250</p>
                <p>Ready to become visible impact.</p>
              </div>
            ) : showProvenance ? (
              <ol className="provenance" aria-label="Notification provenance">
                {provenance.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <div className="evidence-list">
                {step >= 1 ? (
                  <Evidence
                    title="Fund allocation"
                    value={scenario.allocation.name}
                  />
                ) : null}
                {step >= 4 ? (
                  <Evidence
                    title="Approved receipt"
                    value={`${scenario.purchase.item} · ${scenario.purchase.vendor}`}
                  />
                ) : null}
                {step >= 6 ? (
                  <Evidence
                    title="Program event"
                    value={`${scenario.program.name} at ${scenario.organization.name}`}
                  />
                ) : null}
                {step >= 7 ? (
                  <Evidence
                    title="Verified attendance"
                    value={`${scenario.impact.attendees} students`}
                  />
                ) : null}
                {step >= 8 ? (
                  <div className="notification-row">
                    <p className="evidence-title">Notification delivered</p>
                    <strong>{scenario.notification.title}</strong>
                    <p>{scenario.notification.message}</p>
                  </div>
                ) : null}
                {step === 0 ? (
                  <div className="ledger-idle">
                    <p>Evidence appears as the story advances.</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Evidence({ title, value }: { title: string; value: string }) {
  return (
    <div className="evidence-row">
      <span className="evidence-title">{title}</span>
      <span className="evidence-value">{value}</span>
      <span className="evidence-state">Verified</span>
    </div>
  );
}
