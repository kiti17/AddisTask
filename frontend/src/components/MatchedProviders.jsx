import ProviderTrustSummary from "./ProviderTrustSummary";

export default function MatchedProviders({
  selectedTask,
  selectedTaskInfo,
  matches,
  openProviderProfile,
  saveProvider,
  savedProviderIds = [],
  isOpen,
  onClose,
}) {
  if (!selectedTask || !isOpen) return null;

  const openProfile = (provider) => {
    onClose();
    openProviderProfile(provider);
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="modal-panel smart-match-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="smart-match-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close smart matches"
        >
          Close
        </button>

        <div className="section-header smart-match-header">
          <div>
            <span className="eyebrow">Smart match</span>
            <h2 id="smart-match-title">Recommended Providers</h2>
            <p className="muted">
              {selectedTaskInfo
                ? `${selectedTaskInfo.title} | ${selectedTaskInfo.category} in ${selectedTaskInfo.location}`
                : `Task #${selectedTask}`}
            </p>
          </div>

          <span className="match-count-pill">
            {matches.length} match{matches.length === 1 ? "" : "es"}
          </span>
        </div>

        <div className="smart-match-list">
          {matches.length === 0 && (
            <div className="empty-state">
              No exact approved provider matches yet for this service and area.
            </div>
          )}

          {matches.map((provider, index) => {
            const reasons = getMatchReasons(provider, selectedTaskInfo);
            const isSaved = savedProviderIds.includes(Number(provider.provider_id));

            return (
              <div className="smart-match-card" key={provider.provider_id}>
                <div className="smart-match-rank">
                  <span>#{index + 1}</span>
                </div>

                <div className="smart-match-main">
                  <div className="smart-match-title">
                    <div>
                      <strong>{provider.business_name}</strong>
                      <p>{provider.skill_category} | {provider.city}</p>
                    </div>
                    <span className="score">Score: {provider.match_score}</span>
                  </div>

                  <div className="trust-list compact">
                    <span>Rating: {provider.rating || 4.5}</span>
                    <span>Completed: {provider.completed_tasks || 0}</span>
                    <span>Response: {provider.response_time_minutes || 30} min</span>
                    {provider.experience_years > 0 && (
                      <span>Experience: {provider.experience_years} yrs</span>
                    )}
                  </div>

                  <ProviderTrustSummary provider={provider} compact />

                  <div className="fit-reason-list">
                    {reasons.map((reason) => (
                      <span key={reason}>{reason}</span>
                    ))}
                  </div>

                  <div className="actions smart-match-actions">
                    <button
                      className="secondary-btn inline"
                      onClick={() => openProfile(provider)}
                    >
                      View Profile
                    </button>

                    <button
                      className="secondary-btn inline"
                      disabled={isSaved}
                      onClick={() => saveProvider(provider)}
                    >
                      {isSaved ? "Saved" : "Save Provider"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function getMatchReasons(provider, task) {
  const reasons = [];

  if (provider.category_match || sameText(provider.skill_category, task?.category)) {
    reasons.push("Same service");
  }

  if (provider.city_match || sameText(provider.city, task?.location)) {
    reasons.push("Same area");
  }

  if (Number(provider.response_time_minutes || 0) <= 30) {
    reasons.push("Fast response");
  }

  if (Number(provider.rating || 0) >= 4.5) {
    reasons.push("Strong rating");
  }

  if (Number(provider.completed_tasks || 0) > 0) {
    reasons.push(`${provider.completed_tasks} completed jobs`);
  }

  return reasons.slice(0, 4);
}

function sameText(left, right) {
  return normalize(left) && normalize(left) === normalize(right);
}

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}
