export default function ReviewPanel({
  customerReviewTasks,
  reviewTaskId,
  setReviewTaskId,
  reviewRating,
  setReviewRating,
  reviewComment,
  setReviewComment,
  submitReview,
  isReviewModalOpen,
  closeReviewModal,
}) {
  if (!isReviewModalOpen) {
    return null;
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={closeReviewModal}
    >
      <section
        className="modal-panel workflow-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reviews-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={closeReviewModal}
          aria-label="Close reviews window"
        >
          Close
        </button>

        <div className="section-header workflow-modal-header">
          <div>
            <span className="eyebrow">Completed work</span>
            <h2 id="reviews-modal-title">Leave a Review</h2>
            <p className="muted">
              Rate completed work so future customers can compare providers
              with more confidence.
            </p>
          </div>
        </div>

        {customerReviewTasks.length === 0 ? (
          <div className="empty-state">
            Completed tasks will appear here for customer review.
          </div>
        ) : (
          <div className="review-grid">
            <select
              value={reviewTaskId}
              onChange={(event) => setReviewTaskId(event.target.value)}
            >
              <option value="">Select completed task</option>
              {customerReviewTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>

            <select
              value={reviewRating}
              onChange={(event) => setReviewRating(event.target.value)}
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Fair</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Not acceptable</option>
            </select>

            <textarea
              placeholder="What should future customers know about this provider?"
              value={reviewComment}
              onChange={(event) => setReviewComment(event.target.value)}
            />

            <div className="workflow-modal-actions">
              <button onClick={submitReview}>Submit Review</button>
              <button
                className="secondary-btn inline"
                onClick={closeReviewModal}
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
