export default function MatchedProviders({
  selectedTask,
  matches,
}) {
  if (!selectedTask) return null;

  return (
    <section className="card wide">
      <h2>
        Matched Providers for Task #{selectedTask}
      </h2>

      <div className="list">
        {matches.map((m) => (
          <div className="row" key={m.provider_id}>
            <div>
              <strong>{m.business_name}</strong>

              <p>
                {m.skill_category} • {m.city}
              </p>

              <p>
                ⭐ Rating: {m.rating || 4.5}
              </p>

              <p>
                ✔ Completed Tasks: {m.completed_tasks || 0}
              </p>

              <p>
                ⏱ Response Time: {m.response_time_minutes || 30} min
              </p>
            </div>

            <span className="score">
              Score: {m.match_score}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}