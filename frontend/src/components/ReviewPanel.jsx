export default function ReviewPanel({
  customerReviewTasks,
  reviewTaskId,
  setReviewTaskId,
  reviewRating,
  setReviewRating,
  reviewComment,
  setReviewComment,
  submitReview,
}) {
  return (
    <section className="card wide">
      <div className="section-header">
        <div>
          <h2>Reviews</h2>
          <p className="muted">
            After completion, customers can rate the provider and strengthen
            the trust score used in future matching.
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

          <button onClick={submitReview}>Submit Review</button>
        </div>
      )}
    </section>
  );
}
