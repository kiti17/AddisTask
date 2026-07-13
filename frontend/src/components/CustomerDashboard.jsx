export default function CustomerDashboard({
  pendingCustomerApplications,
  myAssignedTasks,
  customerPaymentSummary,
  customerReviewTasks,
  myOpenTasks,
  myCompletedTasks,
  applicationsTask,
  applications,
  applicationsError,
  openProviderProfile,
  updateApplicationStatus,
}) {
  return (
    <>
      <section className="card wide customer-next-steps-card">
        <div className="section-header">
          <div>
            <h2>Customer Next Steps</h2>
            <p className="muted">
              Focus on the work that needs your attention first.
            </p>
          </div>
        </div>

        <div className="next-step-grid">
          <div>
            <span>{pendingCustomerApplications.length}</span>
            <strong>Review applications</strong>
            <p>Accept the best provider for your posted tasks.</p>
          </div>
          <div>
            <span>{myAssignedTasks.length}</span>
            <strong>Coordinate assigned work</strong>
            <p>Use messages and complete the task after the work is done.</p>
          </div>
          <div>
            <span>{customerPaymentSummary.unpaid + customerPaymentSummary.cash_agreed}</span>
            <strong>Track payment</strong>
            <p>Update unpaid or cash-agreed jobs as the work progresses.</p>
          </div>
          <div>
            <span>{customerReviewTasks.length}</span>
            <strong>Leave reviews</strong>
            <p>Review completed jobs to build provider trust.</p>
          </div>
        </div>
      </section>

      <section className="card wide payment-summary-card">
        <div className="section-header">
          <div>
            <h2>Payment Summary</h2>
            <p className="muted">
              A quick view of payment progress for your posted tasks.
            </p>
          </div>
        </div>

        <div className="activity-summary payment-summary-grid">
          <div>
            <span>Unpaid</span>
            <strong>{customerPaymentSummary.unpaid}</strong>
          </div>
          <div>
            <span>Cash agreed</span>
            <strong>{customerPaymentSummary.cash_agreed}</strong>
          </div>
          <div>
            <span>Paid</span>
            <strong>{customerPaymentSummary.paid}</strong>
          </div>
          <div>
            <span>Disputed</span>
            <strong>{customerPaymentSummary.disputed}</strong>
          </div>
        </div>
      </section>

      <section className="card wide task-history-card">
        <div className="section-header">
          <div>
            <h2>My Task History</h2>
            <p className="muted">
              Follow your posted work from new request to assigned job and completion.
            </p>
          </div>
        </div>

        <div className="task-history-grid">
          <div>
            <h3>Open</h3>
            {myOpenTasks.length === 0 ? (
              <p className="muted">No open posted tasks.</p>
            ) : (
              myOpenTasks.slice(0, 4).map((task) => (
                <article className="mini-task-card" key={task.id}>
                  <strong>{task.title}</strong>
                  <span>{task.category} | {task.budget || 0} birr</span>
                  <small>{task.location || "Addis Ababa"}</small>
                </article>
              ))
            )}
          </div>

          <div>
            <h3>Assigned</h3>
            {myAssignedTasks.length === 0 ? (
              <p className="muted">No assigned tasks right now.</p>
            ) : (
              myAssignedTasks.slice(0, 4).map((task) => (
                <article className="mini-task-card" key={task.id}>
                  <strong>{task.title}</strong>
                  <span>{task.category} | {task.budget || 0} birr</span>
                  <small>Payment: {(task.payment_status || "unpaid").replace("_", " ")}</small>
                </article>
              ))
            )}
          </div>

          <div>
            <h3>Completed</h3>
            {myCompletedTasks.length === 0 ? (
              <p className="muted">No completed tasks yet.</p>
            ) : (
              myCompletedTasks.slice(0, 4).map((task) => (
                <article className="mini-task-card" key={task.id}>
                  <strong>{task.title}</strong>
                  <span>{task.category} | {task.budget || 0} birr</span>
                  <small>Payment: {(task.payment_status || "unpaid").replace("_", " ")}</small>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="card wide customer-review-card">
        <div className="section-header">
          <div>
            <h2>Customer Application Review</h2>
            <p className="muted">
              After a provider applies, the customer who posted the task can
              accept or reject the application here.
            </p>
          </div>
        </div>

        {applicationsTask && (
          <div className="review-context">
            <span>Reviewing task</span>
            <strong>{applicationsTask.title}</strong>
            <p>
              {applications.length
                ? `${applications.length} provider application${
                    applications.length === 1 ? "" : "s"
                  } loaded`
                : "No provider applications loaded yet"}
            </p>
          </div>
        )}

        {applicationsError && (
          <div className="empty-state attention-state">
            {applicationsError}
          </div>
        )}

        <div className="list">
          {applications.length === 0 && !applicationsError && (
            <div className="empty-state">
              Click Applications on a task while logged in as the customer who
              posted it. If a provider already applied, the request will appear
              here with Accept and Reject buttons.
            </div>
          )}

          {applications.map((application) => (
            <div className="row" key={application.application_id}>
              <div>
                <strong>{application.business_name}</strong>
                <p>
                  {application.skill_category} | {application.city} | Status: {application.status}
                </p>
                <div className="trust-list compact">
                  <span>Rating: {application.rating || 4.5}</span>
                  <span>Completed: {application.completed_tasks || 0}</span>
                  <span>Response: {application.response_time_minutes || 30} min</span>
                </div>
              </div>

              <div className="actions">
                {application.status === "pending" && (
                  <>
                    <button
                      className="secondary-btn inline"
                      onClick={() => openProviderProfile(application)}
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() =>
                        updateApplicationStatus(application.application_id, "accepted")
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="secondary-btn inline"
                      onClick={() =>
                        updateApplicationStatus(application.application_id, "rejected")
                      }
                    >
                      Reject
                    </button>
                  </>
                )}

                {application.status !== "pending" && (
                  <>
                    <button
                      className="secondary-btn inline"
                      onClick={() => openProviderProfile(application)}
                    >
                      View Profile
                    </button>
                    <span className={`status-pill ${application.status}`}>{application.status}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
