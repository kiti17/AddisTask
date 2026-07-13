export default function MessagePanel({
  messageEligibleTasks,
  messageTaskId,
  onSelectTask,
  loadMessages,
  taskMessages,
  messageBody,
  setMessageBody,
  sendMessage,
}) {
  return (
    <section className="card wide">
      <div className="section-header">
        <div>
          <h2>Messages</h2>
          <p className="muted">
            Once a provider is accepted, the customer and provider can coordinate
            timing, access, and job details.
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
              onChange={(event) => onSelectTask(event.target.value)}
            >
              <option value="">Select assigned task</option>
              {messageEligibleTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>

            <button onClick={() => loadMessages()}>Load Messages</button>
          </div>

          <div className="message-list">
            {taskMessages.length === 0 && (
              <div className="empty-state">
                No messages loaded for this task yet.
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

          <button onClick={sendMessage}>Send Message</button>
        </div>
      )}
    </section>
  );
}
