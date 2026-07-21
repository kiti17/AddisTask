import { useMemo, useState } from "react";

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
  applicationsLoading,
  isApplicationsModalOpen,
  closeApplicationsModal,
  openProviderProfile,
  updateApplicationStatus,
  openApplicationsWindow,
  openMessagesWindow,
  openReviewWindow,
}) {
  const handleCloseApplications = closeApplicationsModal || (() => {});
  const [activePanel, setActivePanel] = useState("applications");
  const pendingApplicationTasks = useMemo(() => {
    const taskMap = new Map();

    pendingCustomerApplications.forEach((application) => {
      const taskId = application.task_id || "unknown";
      const existing = taskMap.get(taskId) || {
        id: taskId,
        title: application.task_title || "Posted task",
        providerCount: 0,
        providers: [],
      };

      existing.providerCount += 1;
      existing.providers.push(application.business_name || "Provider");
      taskMap.set(taskId, existing);
    });

    return Array.from(taskMap.values());
  }, [pendingCustomerApplications]);

  const activeWorkCount = myAssignedTasks.length + customerReviewTasks.length;
  const paymentActionCount =
    customerPaymentSummary.unpaid + customerPaymentSummary.cash_agreed;
  const panelTabs = [
    { id: "applications", label: "Applications", count: pendingCustomerApplications.length },
    { id: "work", label: "Active Work", count: activeWorkCount },
    { id: "payments", label: "Payments", count: paymentActionCount },
    { id: "history", label: "History", count: myOpenTasks.length + myAssignedTasks.length + myCompletedTasks.length },
  ];
  const openApplications = () => {
    setActivePanel("applications");
    openApplicationsWindow?.();
  };
  const openMessages = () => {
    setActivePanel("work");
    openMessagesWindow?.();
  };
  const openReview = () => {
    setActivePanel("work");
    openReviewWindow?.();
  };

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

        <div className="next-step-grid actionable">
          <button
            type="button"
            className={activePanel === "applications" ? "next-step-tile active" : "next-step-tile"}
            onClick={openApplications}
          >
            <span>{pendingCustomerApplications.length}</span>
            <strong>Review applications</strong>
            <p>Accept the best provider for your posted tasks.</p>
          </button>
          <button
            type="button"
            className={activePanel === "work" ? "next-step-tile active" : "next-step-tile"}
            onClick={openMessages}
          >
            <span>{myAssignedTasks.length}</span>
            <strong>Coordinate assigned work</strong>
            <p>Use messages and complete the task after the work is done.</p>
          </button>
          <button
            type="button"
            className={activePanel === "payments" ? "next-step-tile active" : "next-step-tile"}
            onClick={() => setActivePanel("payments")}
          >
            <span>{paymentActionCount}</span>
            <strong>Track payment</strong>
            <p>Update unpaid or cash-agreed jobs as the work progresses.</p>
          </button>
          <button
            type="button"
            className={activePanel === "work" ? "next-step-tile active" : "next-step-tile"}
            onClick={openReview}
          >
            <span>{customerReviewTasks.length}</span>
            <strong>Leave reviews</strong>
            <p>Review completed jobs to build provider trust.</p>
          </button>
        </div>
      </section>

      <section className="card wide focused-dashboard-panel">
        <div className="section-header">
          <div>
            <h2>Customer Workspace</h2>
            <p className="muted">
              Choose one area and handle only that work.
            </p>
          </div>
        </div>

        <div className="dashboard-tabs" role="tablist" aria-label="Customer workspace sections">
          {panelTabs.map((tab) => (
            <button
              type="button"
              className={activePanel === tab.id ? "active" : ""}
              key={tab.id}
              onClick={() => setActivePanel(tab.id)}
            >
              {tab.label}
              <span>{tab.count}</span>
            </button>
          ))}
        </div>

        {activePanel === "applications" && (
          <div className="focus-panel-content">
            <div className="dashboard-panel-header">
              <div>
                <strong>Applications waiting</strong>
                <p>Open the review window when providers apply to your posted tasks.</p>
              </div>
              <button onClick={openApplications}>Review Applications</button>
            </div>

            <div className="compact-work-list">
              {pendingApplicationTasks.length === 0 && (
                <div className="empty-state compact-empty">
                  No provider applications are waiting right now.
                </div>
              )}

              {pendingApplicationTasks.map((task) => (
                <div className="work-row" key={task.id}>
                  <div>
                    <strong>{task.title}</strong>
                    <span>
                      {task.providerCount} provider{task.providerCount === 1 ? "" : "s"} waiting
                    </span>
                    <p>{task.providers.slice(0, 3).join(", ")}</p>
                  </div>
                  <button className="secondary-btn inline" onClick={openApplications}>
                    Open
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePanel === "work" && (
          <div className="focus-panel-content">
            <div className="dashboard-panel-header">
              <div>
                <strong>Assigned work and reviews</strong>
                <p>Coordinate active work, then review completed jobs.</p>
              </div>
              <div className="toolbar-actions">
                <button className="secondary-btn inline" onClick={openMessages}>
                  Messages
                </button>
                <button className="secondary-btn inline" onClick={openReview}>
                  Leave Review
                </button>
              </div>
            </div>

            <div className="compact-work-list">
              {activeWorkCount === 0 && (
                <div className="empty-state compact-empty">
                  No assigned or review-ready work right now.
                </div>
              )}

              {myAssignedTasks.map((task) => (
                <div className="work-row" key={`assigned-${task.id}`}>
                  <div>
                    <strong>{task.title}</strong>
                    <span>{task.category} | {task.budget || 0} birr</span>
                    <p>Assigned task. Coordinate details with the provider.</p>
                  </div>
                  <button className="secondary-btn inline" onClick={openMessages}>
                    Message
                  </button>
                </div>
              ))}

              {customerReviewTasks.map((task) => (
                <div className="work-row" key={`review-${task.id}`}>
                  <div>
                    <strong>{task.title}</strong>
                    <span>{task.category} | {task.budget || 0} birr</span>
                    <p>Completed task. Add a review for provider trust.</p>
                  </div>
                  <button className="secondary-btn inline" onClick={openReview}>
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePanel === "payments" && (
          <div className="focus-panel-content">
            <div className="dashboard-panel-header">
              <div>
                <strong>Payment Summary</strong>
                <p>A quick view of payment progress for your posted tasks.</p>
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
          </div>
        )}

        {activePanel === "history" && (
          <div className="focus-panel-content task-history-card">
            <div className="dashboard-panel-header">
              <div>
                <strong>My Task History</strong>
                <p>Follow your posted work from new request to assigned job and completion.</p>
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
          </div>
        )}
      </section>

      {isApplicationsModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={handleCloseApplications}
        >
          <section
            className="modal-panel application-review-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-review-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={handleCloseApplications}
              aria-label="Close application review window"
            >
              Close
            </button>

            <div className="section-header application-review-header">
              <div>
                <span className="eyebrow">Applications</span>
                <h2 id="application-review-title">Review Provider Applications</h2>
                <p className="muted">
                  See who applied and accept or reject the provider without
                  leaving your task list.
                </p>
              </div>
            </div>

            {applicationsTask && (
              <div className="review-context">
                <span>Reviewing task</span>
                <strong>{applicationsTask.title}</strong>
                <p>
                  {applicationsLoading
                    ? "Loading provider applications..."
                    : applications.length
                      ? `${applications.length} provider application${
                          applications.length === 1 ? "" : "s"
                        } loaded`
                      : "No provider applications loaded yet"}
                </p>
              </div>
            )}

            {applicationsLoading && (
              <div className="empty-state">
                Loading applications...
              </div>
            )}

            {applicationsError && (
              <div className="empty-state attention-state">
                {applicationsError}
              </div>
            )}

            <div className="list application-review-list">
              {!applicationsLoading && applications.length === 0 && !applicationsError && (
                <div className="empty-state">
                  No provider has applied to this task yet. When a provider
                  applies, you will see Accept and Reject buttons here.
                </div>
              )}

              {applications.map((application) => (
                <div
                  className="row application-review-row"
                  key={application.application_id}
                >
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

                  <div className="actions application-review-actions">
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
        </div>
      )}
    </>
  );
}
