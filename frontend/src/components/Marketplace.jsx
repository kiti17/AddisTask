export default function Marketplace({
  loadTasks,
  searchCategory,
  setSearchCategory,
  filteredTasks,
  loadMatches,
  applyToTask,
  loadApplications,
  completeTask,
}) {
  return (
    <section className="card wide">
      <div className="section-header">
        <div>
          <h2>Marketplace</h2>
          <p className="muted">
            Browse tasks and find matching providers.
          </p>
        </div>

        <button onClick={loadTasks}>
          Load Tasks
        </button>
      </div>

      <input
        placeholder="Filter by category..."
        value={searchCategory}
        onChange={(e) => setSearchCategory(e.target.value)}
      />

      <div className="list">
        {filteredTasks.map((t) => (
          <div className="row" key={t.id}>
            <div>
              <strong>{t.title}</strong>

              <p>
                {t.location} • {t.category} •{" "}
                <span className={`status ${t.status}`}>
                  Status: {t.status}
                </span>
              </p>
            </div>

            <div className="actions">
              <button onClick={() => loadMatches(t.id)}>
                Smart Match
              </button>

              <button onClick={() => applyToTask(t.id)}>
                Apply
              </button>

              <button onClick={() => loadApplications(t.id)}>
                Applications
              </button>

              {t.status?.toLowerCase().trim() === "assigned" && (
                <button onClick={() => completeTask(t.id)}>
                  Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}