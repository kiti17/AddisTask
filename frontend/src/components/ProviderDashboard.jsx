export default function ProviderDashboard({
  myProviderApprovalStatus,
  providerActionableOpenTasks,
  pendingProviderApplications,
  acceptedProviderApplications,
  rejectedProviderApplications,
  myProviderProfile,
  approvedProviders,
  pendingProviders,
  loadMyProviderProfile,
  openProviderProfileForm,
  loadProviderProfileIntoForm,
  loadProviderApplications,
  providerActivityLoadedAt,
  providerApplications,
  getProviderApplicationNotice,
}) {
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

        <div className="next-step-grid">
          <div>
            <span>{myProviderApprovalStatus === "approved" ? "OK" : "!"}</span>
            <strong>Approval status</strong>
            <p>
              {myProviderApprovalStatus === "approved"
                ? "Your profile is approved and ready for applications."
                : `Current status: ${myProviderApprovalStatus}.`}
            </p>
          </div>
          <div>
            <span>{providerActionableOpenTasks.length}</span>
            <strong>Matching open tasks</strong>
            <p>
              {myProviderApprovalStatus === "approved"
                ? "Open jobs that match your approved service and area."
                : "Matching tasks become available after approval."}
            </p>
          </div>
          <div>
            <span>{pendingProviderApplications.length}</span>
            <strong>Pending applications</strong>
            <p>Jobs waiting for the customer to accept or reject.</p>
          </div>
          <div>
            <span>{acceptedProviderApplications.length}</span>
            <strong>Accepted work</strong>
            <p>Customer-approved jobs to coordinate and complete.</p>
          </div>
        </div>
      </section>

      <section className="card wide">
        <div className="section-header">
          <div>
            <h2>Provider Verification</h2>
            <p className="muted">
              Providers must be approved before they can apply to customer tasks.
            </p>
          </div>

          <button onClick={loadMyProviderProfile}>Check My Status</button>
        </div>

        <div className="activity-summary">
          <div>
            <span>My profile</span>
            <strong>{myProviderProfile ? myProviderProfile.business_name : "Not loaded"}</strong>
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
            Your provider profile is waiting for platform approval. After approval,
            the Apply button will be available for open tasks.
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
      </section>

      <section className="card wide">
        <div className="section-header">
          <div>
            <h2>Provider Activity</h2>
            <p className="muted">
              Providers can check whether their task applications are pending,
              accepted, or rejected.
            </p>
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

        <div className="list">
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
      </section>
    </>
  );
}
