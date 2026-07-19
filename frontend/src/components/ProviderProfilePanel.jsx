import ProviderTrustSummary from "./ProviderTrustSummary";

export default function ProviderProfilePanel({
  provider,
  reviews,
  onClose,
  saveProvider,
}) {
  if (!provider) return null;

  return (
    <section className="card wide provider-profile-panel">
      <div className="section-header">
        <div>
          <span className="eyebrow">Provider profile</span>
          <h2>{provider.business_name}</h2>
          <p className="muted">
            {provider.skill_category} | {provider.city}
          </p>
        </div>

        <button className="secondary-btn inline" onClick={onClose}>
          Close Profile
        </button>
      </div>

      {provider.bio && (
        <p className="provider-profile-bio">{provider.bio}</p>
      )}

      <ProviderTrustSummary provider={provider} />

      <div className="provider-profile-grid">
        <div>
          <span>Rating</span>
          <strong>{provider.rating || 4.5}</strong>
        </div>
        <div>
          <span>Completed jobs</span>
          <strong>{provider.completed_tasks || 0}</strong>
        </div>
        <div>
          <span>Experience</span>
          <strong>{provider.experience_years || 0} years</strong>
        </div>
        <div>
          <span>Response time</span>
          <strong>{provider.response_time_minutes || 30} min</strong>
        </div>
        <div>
          <span>Service areas</span>
          <strong>{provider.service_area || provider.city || "Not provided"}</strong>
        </div>
        <div>
          <span>Availability</span>
          <strong>{provider.availability || "Not provided"}</strong>
        </div>
        <div>
          <span>ID status</span>
          <strong>{provider.id_verification_status || "not_submitted"}</strong>
        </div>
        <div>
          <span>Approval</span>
          <strong>{provider.approval_status || "pending"}</strong>
        </div>
      </div>

      <div className="profile-actions">
        <button onClick={() => saveProvider(provider)}>
          Save Provider
        </button>
        {provider.contact_phone && (
          <span>Contact phone: {provider.contact_phone}</span>
        )}
      </div>

      <div className="provider-reviews">
        <div className="section-header compact">
          <div>
            <h3>Customer reviews</h3>
            <p className="muted">
              Reviews from completed AddisTask jobs help customers compare providers.
            </p>
          </div>
        </div>

        {reviews.length === 0 && (
          <div className="empty-state">
            No customer reviews yet.
          </div>
        )}

        {reviews.map((review) => (
          <div className="review-card" key={review.id}>
            <div>
              <strong>{review.rating}/5</strong>
              {review.created_at && (
                <span>
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
            <p>{review.comment || "No written comment."}</p>
            {review.status_note && (
              <small>{review.status_note}</small>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
