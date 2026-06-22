export default function Marketplace({
  loadTasks,
  searchCategory,
  setSearchCategory,
  searchLocation,
  setSearchLocation,
  maxBudget,
  setMaxBudget,
  addisAreas,
  filteredTasks,
  loadMatches,
  applyToTask,
  loadApplications,
  completeTask,
}) {
  const getTaskDetails = (description = "") => {
    const lines = description.split("\n").map((line) => line.trim()).filter(Boolean);
    const detailMap = {};

    lines.forEach((line) => {
      const separatorIndex = line.indexOf(":");

      if (separatorIndex > -1) {
        const key = line.slice(0, separatorIndex).toLowerCase();
        const value = line.slice(separatorIndex + 1).trim();
        detailMap[key] = value;
      }
    });

    const summary = lines.filter((line) => !line.includes(":")).join(" ");

    return {
      summary,
      urgency: detailMap.urgency,
      preferredDate: detailMap["preferred date"],
      timeWindow: detailMap["time window"],
      accessNotes: detailMap["access notes"],
    };
  };

  return (
    <section className="card wide">
      <div className="section-header">
        <div>
          <h2>Marketplace</h2>
          <p className="muted">
            Browse open tasks, apply as a provider, or compare applicants as a customer.
          </p>
        </div>

        <button onClick={loadTasks}>Refresh</button>
      </div>

      <div className="filter-grid">
        <input
          placeholder="Filter by category..."
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        />

        <select
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        >
          <option value="">All areas</option>
          {addisAreas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>

        <input
          placeholder="Max budget"
          type="number"
          min="0"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
        />

        <button
          className="secondary-btn inline"
          onClick={() => {
            setSearchCategory("");
            setSearchLocation("");
            setMaxBudget("");
          }}
        >
          Reset Filters
        </button>
      </div>

      <div className="list">
        {filteredTasks.length === 0 && (
          <div className="empty-state">
            No active tasks match this category yet.
          </div>
        )}

        {filteredTasks.map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            details={getTaskDetails(t.description)}
            loadMatches={loadMatches}
            applyToTask={applyToTask}
            loadApplications={loadApplications}
            completeTask={completeTask}
          />
        ))}
      </div>
    </section>
  );
}

function TaskRow({
  task,
  details,
  loadMatches,
  applyToTask,
  loadApplications,
  completeTask,
}) {
  const currentStatus = task.status?.toLowerCase().trim();
  const lifecycleSteps = ["open", "assigned", "completed"];
  const currentStepIndex = Math.max(lifecycleSteps.indexOf(currentStatus), 0);

  return (
    <div className="row">
      <div className="task-summary">
        <strong>{task.title}</strong>

        <p>
          {task.location} | {task.category} |{" "}
          <span className={`status ${task.status}`}>
            Status: {task.status}
          </span>
        </p>

        {details.summary && (
          <p className="task-description">{details.summary}</p>
        )}

        <div className="detail-pills">
          {task.budget ? (
            <span className="budget-pill">Budget: {task.budget} birr</span>
          ) : (
            <span className="budget-pill muted-pill">Budget open</span>
          )}

          {details.urgency && (
            <span className="budget-pill neutral-pill">Urgency: {details.urgency}</span>
          )}

          {details.preferredDate && (
            <span className="budget-pill neutral-pill">
              Date: {details.preferredDate}
            </span>
          )}

          {details.timeWindow && (
            <span className="budget-pill neutral-pill">
              Time: {details.timeWindow}
            </span>
          )}
        </div>

        {details.accessNotes && (
          <p className="task-description">Access notes: {details.accessNotes}</p>
        )}

        <div className="task-lifecycle" aria-label={`Task status is ${task.status}`}>
          {lifecycleSteps.map((step, index) => (
            <span
              className={[
                "lifecycle-step",
                index <= currentStepIndex ? "complete" : "",
                step === currentStatus ? "current" : "",
              ].filter(Boolean).join(" ")}
              key={step}
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      <div className="actions">
        <button onClick={() => loadMatches(task.id)}>Smart Match</button>

        <button onClick={() => applyToTask(task.id)}>Apply</button>

        <button onClick={() => loadApplications(task.id)}>Applications</button>

        {task.status?.toLowerCase().trim() === "assigned" && (
          <button onClick={() => completeTask(task.id)}>Complete</button>
        )}
      </div>
    </div>
  );
}
