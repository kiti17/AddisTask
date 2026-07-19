export default function MessagePanel({
  messageEligibleTasks,
  messageTaskId,
  onSelectTask,
  loadMessages,
  taskMessages,
  messagesLoading,
  messageBody,
  setMessageBody,
  sendMessage,
  isMessagesModalOpen,
  closeMessagesModal,
}) {
  if (!isMessagesModalOpen) {
    return null;
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={closeMessagesModal}
    >
      <section
        className="modal-panel workflow-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="messages-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={closeMessagesModal}
          aria-label="Close messages window"
        >
          Close
        </button>

        <div className="section-header workflow-modal-header">
          <div>
            <span className="eyebrow">Assigned work</span>
            <h2 id="messages-modal-title">Messages</h2>
            <p className="muted">
              Coordinate timing, access, materials, and arrival details for the
              selected assigned task.
            </p>
          </div>
        </div>

        {messageEligibleTasks.length === 0 ? (
          <div className="empty-state">
            Assigned tasks will appear here after a customer accepts a provider.
          </div>
        ) : (
          <div className="message-panel">
            <div className="message-controls">
              <select
                value={messageTaskId}
                onChange={(event) => {
                  onSelectTask(event.target.value);
                  if (event.target.value) {
                    loadMessages(event.target.value);
                  }
                }}
              >
                <option value="">Select assigned task</option>
                {messageEligibleTasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>

              <button onClick={() => loadMessages()}>
                {messagesLoading ? "Loading..." : "Refresh"}
              </button>
            </div>

            <div className="message-list workflow-message-list">
              {messagesLoading && (
                <div className="empty-state">
                  Loading messages...
                </div>
              )}

              {!messagesLoading && taskMessages.length === 0 && (
                <div className="empty-state">
                  No messages for this task yet.
                </div>
              )}

              {taskMessages.map((message) => (
                <div className="message-bubble" key={message.id}>
                  <span>
                    Sender #{message.sender_id} to #{message.recipient_id}
                  </span>
                  <p>{message.body}</p>
                </div>
              ))}
            </div>

            <textarea
              placeholder="Write timing, access, materials, or arrival details."
              value={messageBody}
              onChange={(event) => setMessageBody(event.target.value)}
            />

            <div className="workflow-modal-actions">
              <button onClick={sendMessage}>Send Message</button>
              <button
                className="secondary-btn inline"
                onClick={closeMessagesModal}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
