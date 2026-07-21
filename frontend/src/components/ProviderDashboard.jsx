import { useState } from "react";
import ProviderTrustSummary from "./ProviderTrustSummary";

export default function ProviderDashboard({
  myProviderApprovalStatus,
  providerActionableOpenTasks,
  pendingProviderApplications,
  acceptedProviderApplications,
  rejectedProviderApplications,
  myProviderProfile,
  providerApprovalGuidance,
  approvedProviders,
  pendingProviders,
  loadMyProviderProfile,
  openProviderProfileForm,
  loadProviderProfileIntoForm,
  loadProviderApplications,
  providerActivityLoadedAt,
  providerApplications,
  getProviderApplicationNotice,
  applyToTask,
  openProviderMessages,
}) {
  const [activePanel, setActivePanel] = useState("verification");
  const appliedTaskIds = new Set(
    providerApplications.map((application) => Number(application.task_id))
  );
  const availableMatchingTasks = providerActionableOpenTasks.filter(
    (task) => !appliedTaskIds.has(Number(task.id))
  );
  const panelTabs = [
    { id: "verification", label: "Verification", count: myProviderApprovalStatus === "approved" ? 0 : 1 },
    { id: "opportunities", label: "Matching Tasks", count: availableMatchingTasks.length },
    { id: "activity", label: "Activity", count: providerApplications.length },
  ];
  const openVerificationAction = () => {
    setActivePanel("verification");

    if (!myProviderProfile) {
      openProviderProfileForm();
      return;
    }

    if (
      myProviderApprovalStatus === "rejected" ||
      myProviderProfile.trust_ready === false
    ) {
      loadProviderProfileIntoForm();
      return;
    }

    loadMyProviderProfile();
  };
  const openActivity = () => {
    setActivePanel("activity");
    loadProviderApplications();
  };
  const openAcceptedWork = () => {
    setActivePanel("activity");
    openProviderMessages?.();
  };

  return (
    <>
      <section className="card wide provider-next-steps-card">
        <div className="section-header">
          <div>
            <h2>Provider Next Steps</h2>
            <p className="muted">
              See what needs attention before applying or coordinating work.
            </p>
          </div>
        </div>

        <div className="next-step-grid actionable">
          <button
            type="button"
            className={activePanel === "verification" ? "next-step-tile active" : "next-step-tile"}
            onClick={openVerificationAction}
          >
            <span>{myProviderApprovalStatus === "approved" ? "OK" : "!"}</span>
            <strong>Approval status</strong>
            <p>{providerApprovalGuidance.detail}</p>
          </button>
          <button
            type="button"
            className={activePanel === "opportunities" ? "next-step-tile active" : "next-step-tile"}
            onClick={() => setActivePanel("opportunities")}
          >
            <span>{availableMatchingTasks.length}</span>
            <strong>Matching open tasks</strong>
            <p>
              {myProviderApprovalStatus === "approved"
                ? "Open jobs that match your approved service and area."
                : "Matching tasks become available after approval."}
            </p>
          </button>
          <button
            type="button"
            className={activePanel === "activity" ? "next-step-tile active" : "next-step-tile"}
            onClick={openActivity}
          >
            <span>{pendingProviderApplications.length}</span>
            <strong>Pending applications</strong>
            <p>Jobs waiting for the customer to accept or reject.</p>
          </button>
          <button
            type="button"
            className={activePanel === "activity" ? "next-step-tile active" : "next-step-tile"}
            onClick={openAcceptedWork}
          >
            <span>{acceptedProviderApplications.length}</span>
            <strong>Accepted work</strong>
            <p>Customer-approved jobs to coordinate and complete.</p>
          </button>
        </div>
      </section>

      <section className="card wide focused-dashboard-panel">
        <div className="section-header">
          <div>
            <h2>Provider Workspace</h2>
            <p className="muted">
              Choose one area and handle only that provider work.
            </p>
          </div>
        </div>

        <div className="dashboard-tabs" role="tablist" aria-label="Provider workspace sections">
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

        {activePanel === "verification" && (
          <div className="focus-panel-content">
            <div className="dashboard-panel-header">
              <div>
                <strong>Provider Verification</strong>
                <p>Providers must be approved before they can apply to customer tasks.</p>
              </div>

              <div className="toolbar-actions">
                <button onClick={loadMyProviderProfile}>Check My Status</button>
                {myProviderProfile && (
                  <button className="secondary-btn inline" onClick={loadProviderProfileIntoForm}>
                    {myProviderProfile.trust_ready === false ? "Fix Missing Details" : "Edit Profile"}
                  </button>
                )}
              </div>
            </div>

            <div className="activity-summary">
              <div>
                <span>My profile</span>
                <strong>{myProviderProfile ? myProviderProfile.business_name : "Not loaded"}</strong>
              </div>
              <div>
                <span>Trust readiness</span>
                <strong>{myProviderProfile ? `${myProviderProfile.trust_score ?? 0}%` : "Not loaded"}</strong>
              </div>
              <div>
                <span>Approval status</span>
                <strong>{myProviderApprovalStatus}</strong>
              </div>
              <div>
                <span>Approved supply</span>
                <strong>{approvedProviders.length}</strong>
              </div>
              <div>
                <span>Pending review</span>
                <strong>{pendingProviders.length}</strong>
              </div>
            </div>

            {myProviderProfile && providerApprovalGuidance && (
              <div className={`provider-status-message ${providerApprovalGuidance.tone}`}>
                <strong>{providerApprovalGuidance.heading}</strong>
                <p>{providerApprovalGuidance.detail}</p>
                {myProviderProfile.trust_ready === false && (
                  <button className="secondary-btn inline" onClick={loadProviderProfileIntoForm}>
                    Fix Missing Details
                  </button>
                )}
              </div>
            )}

            {myProviderProfile && (
              <ProviderTrustSummary provider={myProviderProfile} />
            )}

            {!myProviderProfile && (
              <div className="empty-state attention-state">
                Create a provider profile first. After admin approval, you can apply
                to matching customer tasks.
                <button className="secondary-btn inline" onClick={openProviderProfileForm}>
                  Create Provider Profile
                </button>
              </div>
            )}

            {myProviderProfile?.approval_status === "pending" && (
              <div className="empty-state attention-state">
                {myProviderProfile.trust_ready === false
                  ? "Your provider profile needs the missing details above before approval."
                  : "Your provider profile is waiting for platform approval. After approval, the Apply button will be available for open tasks."}
                <button className="secondary-btn inline" onClick={loadProviderProfileIntoForm}>
                  {myProviderProfile.trust_ready === false ? "Fix Missing Details" : "Edit Profile"}
                </button>
              </div>
            )}

            {myProviderProfile?.approval_status === "approved" && (
              <div className="empty-state success-state">
                Your provider profile is approved. Apply to matching open tasks and
                check Provider Activity for customer decisions.
              </div>
            )}

            {myProviderProfile?.approval_status === "rejected" && (
              <div className="empty-state attention-state">
                Your provider profile needs changes before approval.
                {myProviderProfile.admin_notes && (
                  <span className="provider-admin-note">
                    Admin note: {myProviderProfile.admin_notes}
                  </span>
                )}
                <button className="secondary-btn inline" onClick={loadProviderProfileIntoForm}>
                  Edit and Resubmit
                </button>
              </div>
            )}
          </div>
        )}

        {activePanel === "opportunities" && (
          <div className="focus-panel-content">
            <div className="dashboard-panel-header">
              <div>
                <strong>Matching open tasks</strong>
                <p>Apply directly to tasks that match your approved service and area.</p>
              </div>
            </div>

            <div className="compact-work-list">
              {myProviderApprovalStatus !== "approved" && (
                <div className="empty-state attention-state">
                  Provider approval is required before applying to customer tasks.
                </div>
              )}

              {myProviderApprovalStatus === "approved" && availableMatchingTasks.length === 0 && (
                <div className="empty-state compact-empty">
                  No matching open tasks are available right now.
                </div>
              )}

              {availableMatchingTasks.slice(0, 6).map((task) => (
                <div className="work-row" key={task.id}>
                  <div>
                    <strong>{task.title}</strong>
                    <span>{task.category} | {task.budget || 0} birr</span>
                    <p>{task.location || "Addis Ababa"}</p>
                  </div>
                  <button onClick={() => applyToTask?.(task)}>
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePanel === "activity" && (
          <div className="focus-panel-content">
            <div className="dashboard-panel-header">
              <div>
                <strong>Provider Activity</strong>
                <p>Check whether task applications are pending, accepted, or rejected.</p>
              </div>

              <button onClick={loadProviderApplications}>Load My Activity</button>
            </div>

            <div className="activity-summary">
              <div>
                <span>Accepted</span>
                <strong>{acceptedProviderApplications.length}</strong>
              </div>
              <div>
                <span>Pending</span>
                <strong>{pendingProviderApplications.length}</strong>
              </div>
              <div>
                <span>Rejected</span>
                <strong>{rejectedProviderApplications.length}</strong>
              </div>
              <div>
                <span>Last checked</span>
                <strong>{providerActivityLoadedAt || "Not yet"}</strong>
              </div>
            </div>

            <div className="list compact-activity-list">
              {providerApplications.length === 0 && (
                <div className="empty-state">
                  Apply to a task, then load provider activity to see status updates.
                </div>
              )}

              {providerApplications.map((application) => (
                <div className="row" key={application.application_id}>
                  <div>
                    <strong>{application.task_title || "Task application"}</strong>
                    <p>
                      {application.task_category || "Service"} |{" "}
                      {application.task_location || "Addis Ababa"} |{" "}
                      {application.task_budget || 0} birr
                    </p>
                    <div className="trust-list compact">
                      <span>Task: {application.task_status || "open"}</span>
                      <span>
                        Payment: {(application.task_payment_status || "unpaid").replace("_", " ")}
                      </span>
                      <span>Application ID: {application.application_id}</span>
                    </div>
                    <p className="application-notice">
                      {getProviderApplicationNotice(application.status)}
                    </p>
                  </div>

                  <span className={`status-pill ${application.status}`}>
                    {application.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
