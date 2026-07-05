export default function MatchedProviders({
  selectedTask,
  matches,
  openProviderProfile,
}) {
  if (!selectedTask) return null;

  return (
    <section className="card wide">
      <div className="section-header">
        <div>
          <h2>Smart Matches</h2>
          <p className="muted">
            Ranked providers for task #{selectedTask} using skill, location, rating,
            completed work, and response time.
          </p>
        </div>
      </div>

      <div className="list">
        {matches.length === 0 && (
          <div className="empty-state">
            No exact provider matches yet. Add providers in the same category and area.
          </div>
        )}

        {matches.map((m) => (
          <div className="row provider-row" key={m.provider_id}>
            <div>
              <strong>{m.business_name}</strong>

              <p>{m.skill_category} | {m.city}</p>

              <div className="trust-list compact">
                <span>Rating: {m.rating || 4.5}</span>
                <span>Completed: {m.completed_tasks || 0}</span>
                <span>Response: {m.response_time_minutes || 30} min</span>
              </div>
            </div>

            <div className="actions">
              <span className="score">Score: {m.match_score}</span>
              <button
                className="secondary-btn inline"
                onClick={() => openProviderProfile(m)}
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
