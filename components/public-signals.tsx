import type { PublicSignals } from "@/integration/public-sources";
import {
  SOURCE_STATUS_DESCRIPTION,
  SOURCE_STATUS_LABEL,
  freshnessSpokenLabel,
  freshnessVisualLabel,
  publicReasonCopy,
} from "@/integration/signal-copy";

export function PublicSignals({ signals }: { signals: PublicSignals }) {
  const statusLabel = SOURCE_STATUS_LABEL[signals.source];
  const statusDescription = SOURCE_STATUS_DESCRIPTION[signals.source];
  const reasonCopy = publicReasonCopy(signals.reason);
  const fundFreshness = freshnessVisualLabel(signals.fundIntel.freshness);
  const impactFreshness = freshnessVisualLabel(signals.impactRelay.freshness);
  const usesFixture =
    signals.source === "fallback" ||
    signals.source === "malformed" ||
    signals.source === "policy_rejected";

  return (
    <section className="signals section" id="signals" aria-labelledby="signals-heading">
      <div className="page-shell">
        <div className="signals-head">
          <div>
            <p className="kicker">Published public signals</p>
            <h2 className="section-heading" id="signals-heading">
              Evidence without donor data.
            </h2>
          </div>
          <span
            className="status-chip"
            data-state={signals.source}
            aria-hidden="true"
          >
            <span className="status-dot" />
            {statusLabel}
          </span>
        </div>

        <p className="signal-status" role="status" aria-live="polite">
          <span className="sr-only">{statusLabel}. </span>
          {statusDescription}
          {reasonCopy ? ` ${reasonCopy}` : ""}
        </p>

        <div className="signal-table" aria-label="Public evidence signals">
          <article className="signal-row">
            <p className="signal-source">Portfolio Signals</p>
            <p className="signal-value">
              Execution: {signals.fundIntel.executionState}
            </p>
            <p className="signal-detail">
              Advisory only. No campaign or donor record is inferred.
              {signals.fundIntel.allocationId
                ? ` Joined by ${signals.fundIntel.allocationId}.`
                : ""}
              {usesFixture
                ? " Values come from the bundled deterministic fixture."
                : ""}
              {fundFreshness ? ` ${fundFreshness}.` : ""}
            </p>
            <p className="sr-only">
              {freshnessSpokenLabel(signals.fundIntel.freshness)}
            </p>
            <time
              className="signal-date"
              dateTime={signals.fundIntel.updatedAt}
            >
              {signals.fundIntel.updatedAt}
            </time>
          </article>
          <article className="signal-row">
            <p className="signal-source">Impact Relay</p>
            <p className="signal-value">
              {signals.impactRelay.participants} participants verified
            </p>
            <p className="signal-detail">
              {signals.impactRelay.programName} ·{" "}
              {signals.impactRelay.organizationName} ·{" "}
              {signals.impactRelay.allocationName}
              {signals.impactRelay.allocationId
                ? ` · joined by ${signals.impactRelay.allocationId}`
                : ""}
              {usesFixture
                ? ". Values come from the bundled deterministic fixture."
                : "."}
              {impactFreshness ? ` ${impactFreshness}.` : ""}
              {signals.impactRelay.verified
                ? " Verified is a source-system state, not donor attribution."
                : ""}
            </p>
            <p className="sr-only">
              {freshnessSpokenLabel(signals.impactRelay.freshness)}
            </p>
            <time
              className="signal-date"
              dateTime={signals.impactRelay.updatedAt}
            >
              {signals.impactRelay.updatedAt}
            </time>
          </article>
        </div>
      </div>
    </section>
  );
}
