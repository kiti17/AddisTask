import { getProviderTrustSummary, getTrustPillClass } from "../utils/providerTrust";

export default function ProviderTrustSummary({ provider, compact = false }) {
  const trust = getProviderTrustSummary(provider);

  return (
    <div className={`provider-trust-summary${compact ? " compact" : ""}`}>
      <div className="trust-score-line">
        <span className={`trust-score-pill ${getTrustPillClass(trust.score)}`}>
          {trust.score}% trust ready
        </span>
        <strong>{trust.level}</strong>
      </div>

      {!compact && (
        <div className="trust-checklist">
          {trust.requirements.map((requirement) => (
            <div
              className={requirement.complete ? "complete" : "missing"}
              key={requirement.key}
            >
              <span>{requirement.complete ? "Done" : "Needed"}</span>
              <strong>{requirement.label}</strong>
              <p>{requirement.detail}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
