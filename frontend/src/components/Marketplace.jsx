export default function Marketplace({
  loadTasks,
  searchCategory,
  setSearchCategory,
  searchLocation,
  setSearchLocation,
  maxBudget,
  setMaxBudget,
  addisAreas,
  serviceCategories,
  tasks,
  loadMatches,
  applyToTask,
  loadApplications,
  completeTask,
  updateTaskPaymentStatus,
  activeMode,
  currentUserId,
  providerApprovalStatus,
  providerApplications = [],
}) {
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

    if (dateA !== dateB) return dateB - dateA;
    return (b.id || 0) - (a.id || 0);
  });
  const myPostedTasks = sortedTasks.filter(
    (task) => currentUserId && task.customer_id === currentUserId
  );
  const otherTasks = sortedTasks.filter(
    (task) => !currentUserId || task.customer_id !== currentUserId
  );
  const shouldSplitCustomerTasks = activeMode === "customer" && currentUserId;
  const workflowSteps = [
    "Posted",
    "Provider applied",
    "Customer accepted",
    "Work completed",
    "Reviewed",
  ];

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
        <label className="field-label">
          Service
          <input
            placeholder="Cleaning, plumbing, delivery..."
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          />
        </label>

        <label className="field-label">
          Area
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
        </label>

        <label className="field-label">
          Max budget
          <input
            placeholder="Birr"
            type="number"
            min="0"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
          />
        </label>

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

      <div className="service-catalog-strip" aria-label="Services available on AddisTask">
        <span>Services available</span>
        <div>
          {serviceCategories.map((service) => (
            <button
              key={service}
              type="button"
              onClick={() => setSearchCategory(service)}
            >
              {service}
            </button>
          ))}
        </div>
      </div>

      <div className="workflow-guide" aria-label="Task workflow">
        {workflowSteps.map((step, index) => (
          <div className="workflow-step" key={step}>
            <span>{index + 1}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>

      {shouldSplitCustomerTasks ? (
        <>
          <div className="task-list-heading">
            <div>
              <h3>My Posted Tasks</h3>
              <p>Tasks you created appear here first, newest on top.</p>
            </div>
          </div>

          <div className="list">
            {myPostedTasks.length === 0 && (
              <div className="empty-state">
                You have not posted any tasks yet.
              </div>
            )}

            {myPostedTasks.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                details={getTaskDetails(t.description)}
                loadMatches={loadMatches}
                applyToTask={applyToTask}
                loadApplications={loadApplications}
                completeTask={completeTask}
                updateTaskPaymentStatus={updateTaskPaymentStatus}
                activeMode={activeMode}
                currentUserId={currentUserId}
                providerApprovalStatus={providerApprovalStatus}
                providerApplications={providerApplications}
              />
            ))}
          </div>

          <div className="task-list-heading secondary">
            <div>
              <h3>Other Customer Tasks</h3>
              <p>These are tasks posted by other customers.</p>
            </div>
          </div>

          <div className="list">
            {otherTasks.length === 0 && (
              <div className="empty-state">
                No other customer tasks are posted yet.
              </div>
            )}

            {otherTasks.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                details={getTaskDetails(t.description)}
                loadMatches={loadMatches}
                applyToTask={applyToTask}
                loadApplications={loadApplications}
                completeTask={completeTask}
                updateTaskPaymentStatus={updateTaskPaymentStatus}
                activeMode={activeMode}
                currentUserId={currentUserId}
                providerApprovalStatus={providerApprovalStatus}
                providerApplications={providerApplications}
              />
            ))}
          </div>
        </>
      ) : (
      <div className="list">
        {sortedTasks.length === 0 && (
          <div className="empty-state">
            No tasks have been posted yet.
          </div>
        )}

        {sortedTasks.map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            details={getTaskDetails(t.description)}
            loadMatches={loadMatches}
            applyToTask={applyToTask}
            loadApplications={loadApplications}
            completeTask={completeTask}
            updateTaskPaymentStatus={updateTaskPaymentStatus}
            activeMode={activeMode}
            currentUserId={currentUserId}
            providerApprovalStatus={providerApprovalStatus}
            providerApplications={providerApplications}
          />
        ))}
      </div>
      )}
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
  updateTaskPaymentStatus,
  activeMode,
  currentUserId,
  providerApprovalStatus,
  providerApplications,
}) {
  const currentStatus = task.status?.toLowerCase().trim();
  const lifecycleSteps = ["open", "assigned", "completed"];
  const currentStepIndex = Math.max(lifecycleSteps.indexOf(currentStatus), 0);
  const isOwnTask = Boolean(currentUserId && task.customer_id === currentUserId);
  const isCustomer = activeMode === "customer";
  const isProvider = activeMode === "provider";
  const isApprovedProvider = providerApprovalStatus === "approved";
  const providerApplication = providerApplications?.find(
    (application) => Number(application.task_id) === Number(task.id)
  );
  const providerApplicationStatus = providerApplication?.status?.toLowerCase().trim();
  const statusLabel = {
    open: "Open for applications",
    assigned: "Provider accepted",
    completed: "Completed",
  }[currentStatus] || task.status;
  const paymentStatus = task.payment_status || "unpaid";
  const paymentLabel = {
    unpaid: "Payment: unpaid",
    cash_agreed: "Payment: cash agreed",
    paid: "Payment: paid",
    disputed: "Payment: disputed",
  }[paymentStatus] || "Payment: unpaid";
  const roleLabel = isOwnTask
    ? "Your task"
    : isProvider
      ? "Available task"
      : "Other customer task";
  const nextStep = getNextStep({
    activeMode,
    currentStatus,
    isOwnTask,
    isApprovedProvider,
    providerApplicationStatus,
  });

  return (
    <div className="row task-row">
      <div className="task-summary">
        <div className="task-heading">
          <div>
            <span className="task-label">{task.category}</span>
            <strong>{task.title}</strong>
          </div>
          <div className="task-badges">
            <span className={`status-pill ${currentStatus || "pending"}`}>
              {statusLabel}
            </span>
            <span className="status-pill neutral">{roleLabel}</span>
            <span className={`payment-pill ${paymentStatus}`}>
              {paymentLabel}
            </span>
          </div>
        </div>

        <p className="task-meta-line">
          {task.location}
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

        <div className="next-step">
          <span>Next step</span>
          <strong>{nextStep}</strong>
        </div>

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

      <div className="actions task-actions">
        {isCustomer && isOwnTask && (
          <>
            <span className="action-help">Customer actions</span>
            <button onClick={() => loadMatches(task.id)}>Smart Match</button>

            <button onClick={() => loadApplications(task)}>Applications</button>

            {task.status?.toLowerCase().trim() === "assigned" && (
              <button onClick={() => completeTask(task.id)}>Complete</button>
            )}

            <span className="action-help">Payment</span>
            <button
              className="secondary-btn inline"
              onClick={() => updateTaskPaymentStatus(task.id, "cash_agreed")}
            >
              Cash Agreed
            </button>
            <button
              className="secondary-btn inline"
              onClick={() => updateTaskPaymentStatus(task.id, "paid")}
            >
              Mark Paid
            </button>
            <button
              className="secondary-btn inline"
              onClick={() => updateTaskPaymentStatus(task.id, "disputed")}
            >
              Disputed
            </button>
          </>
        )}

        {isCustomer && !isOwnTask && (
          <span className="status-pill pending">Posted by another customer</span>
        )}

        {isProvider && (
          <>
            {isOwnTask && (
              <span className="status-pill pending">Your task</span>
            )}

            {!isOwnTask && providerApplicationStatus === "pending" && (
              <span className="status-pill pending">Applied</span>
            )}

            {!isOwnTask && providerApplicationStatus === "accepted" && (
              <span className="status-pill assigned">Accepted</span>
            )}

            {!isOwnTask && providerApplicationStatus === "rejected" && (
              <span className="status-pill rejected">Rejected</span>
            )}

            {!isOwnTask && !providerApplicationStatus && currentStatus === "open" && isApprovedProvider && (
              <button onClick={() => applyToTask(task)}>Apply</button>
            )}

            {!isOwnTask && !providerApplicationStatus && currentStatus === "open" && !isApprovedProvider && (
              <span className="status-pill pending">Approval required</span>
            )}

            {!isOwnTask && !providerApplicationStatus && currentStatus !== "open" && (
              <span className="status-pill rejected">Not open</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function getNextStep({
  activeMode,
  currentStatus,
  isOwnTask,
  isApprovedProvider,
  providerApplicationStatus,
}) {
  if (activeMode === "customer") {
    if (!isOwnTask) return "Switch to Provider Mode if you want to apply.";
    if (currentStatus === "open") return "Open Applications to review provider requests.";
    if (currentStatus === "assigned") return "Coordinate with the provider, then mark complete.";
    if (currentStatus === "completed") return "Leave a review for the provider.";
  }

  if (activeMode === "provider") {
    if (isOwnTask) return "This is your customer task. Switch to Customer Mode to manage it.";
    if (!isApprovedProvider) return "Get provider approval before applying.";
    if (providerApplicationStatus === "pending") {
      return "Your application is waiting for customer review.";
    }
    if (providerApplicationStatus === "accepted") {
      if (currentStatus === "completed") {
        return "This task is completed. Check payment status and customer review.";
      }
      return "Customer accepted you for this task. Coordinate details and complete the work.";
    }
    if (providerApplicationStatus === "rejected") {
      return "Customer chose another provider for this task.";
    }
    if (currentStatus === "open") return "Apply if the task matches your service.";
    if (currentStatus === "assigned") return "This task already has an accepted provider.";
    if (currentStatus === "completed") return "This task is already completed.";
  }

  return "Refresh the marketplace to see the latest task state.";
}
