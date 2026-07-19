import ProviderTrustSummary from "./ProviderTrustSummary";

function ProviderCard({
  provider,
  openProviderProfile,
  saveProvider,
  removeSavedProvider,
  searchCategory,
  searchLocation,
  isTopPick = false,
  isSaved = false,
}) {
  const comparison = getProviderComparison(provider, searchCategory, searchLocation);

  return (
    <div className={`provider-card${isSaved ? " saved-provider" : ""}`} key={provider.id}>
      <div className="provider-card-header">
        <div>
          <strong>{provider.business_name}</strong>
          <p>{provider.skill_category} | {provider.city}</p>
        </div>

        {!isSaved && (
          <span className={`provider-fit-pill${isTopPick ? " top" : ""}`}>
            {isTopPick ? "Best fit" : `${comparison.score}% fit`}
          </span>
        )}
      </div>

      <div className="trust-list compact">
        <span>Rating: {provider.rating || 4.5}</span>
        <span>Completed: {provider.completed_tasks || 0}</span>
        <span>Response: {provider.response_time_minutes || 30} min</span>
        <span>Experience: {provider.experience_years || 0} yrs</span>
        {isSaved && <span>Status: {provider.approval_status || "pending"}</span>}
      </div>

      <ProviderTrustSummary provider={provider} compact />

      {!isSaved && provider.bio && (
        <p className="provider-bio">{provider.bio}</p>
      )}

      {!isSaved && (
        <div className="trust-list compact">
          {provider.service_area && <span>Areas: {provider.service_area}</span>}
          {provider.availability && <span>Available: {provider.availability}</span>}
          <span>ID: {provider.id_verification_status || "not_submitted"}</span>
        </div>
      )}

      {!isSaved && comparison.reasons.length > 0 && (
        <div className="fit-reason-list">
          {comparison.reasons.map((reason) => (
            <span key={reason}>{reason}</span>
          ))}
        </div>
      )}

      {!isSaved && (
        <span className={`verification-pill ${provider.approval_status || "pending"}`}>
          {provider.approval_status || "pending"}
        </span>
      )}

      <button
        className="secondary-btn inline"
        onClick={() => openProviderProfile(provider)}
      >
        View Profile
      </button>

      {isSaved ? (
        <button
          className="secondary-btn inline"
          onClick={() => removeSavedProvider(provider.id)}
        >
          Remove
        </button>
      ) : (
        <button
          className="secondary-btn inline"
          onClick={() => saveProvider(provider)}
        >
          Save Provider
        </button>
      )}
    </div>
  );
}

export default function ProviderDirectoryPanel({
  searchCategory,
  searchLocation,
  totalProviderCount = 0,
  customerVisibleProviderCount = 0,
  loadProviders,
  clearProviderFilters,
  filteredProviders,
  savedProviders,
  openProviderProfile,
  saveProvider,
  removeSavedProvider,
}) {
  return (
    <>
      <section className="card wide">
        <div className="section-header">
          <div>
            <h2>Provider Directory</h2>
            <p className="muted">
              {searchCategory || searchLocation
                ? `Showing providers related to ${searchCategory || "all services"} in ${searchLocation || "all areas"}.`
                : "Browse trusted local providers by service, rating, completed jobs, and response time."}
            </p>
          </div>

          <div className="toolbar-actions">
            <button onClick={loadProviders}>Load Providers</button>
            {(searchCategory || searchLocation) && (
              <button
                className="secondary-btn inline"
                onClick={clearProviderFilters}
              >
                Show All Providers
              </button>
            )}
          </div>
        </div>

        <div className="provider-directory-summary">
          <span>{filteredProviders.length} shown</span>
          <span>{customerVisibleProviderCount} customer-visible</span>
          {totalProviderCount > customerVisibleProviderCount && (
            <span>{totalProviderCount - customerVisibleProviderCount} hidden for trust review</span>
          )}
        </div>

        <div className="provider-grid">
          {filteredProviders.length === 0 && (
            <div className="empty-state">
              No providers match the selected service and area yet.
            </div>
          )}

          {filteredProviders.map((provider, index) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              openProviderProfile={openProviderProfile}
              saveProvider={saveProvider}
              searchCategory={searchCategory}
              searchLocation={searchLocation}
              isTopPick={Boolean(searchCategory || searchLocation) && index === 0}
            />
          ))}
        </div>
      </section>

      {savedProviders.length > 0 && (
        <section className="card wide">
          <div className="section-header">
            <div>
              <h2>Saved Providers</h2>
              <p className="muted">
                Shortlist providers while comparing services, ratings, and response
                times.
              </p>
            </div>
          </div>

          <div className="provider-grid">
            {savedProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                openProviderProfile={openProviderProfile}
                removeSavedProvider={removeSavedProvider}
                searchCategory={searchCategory}
                searchLocation={searchLocation}
                isSaved
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function getProviderComparison(provider, searchCategory, searchLocation) {
  const service = normalize(provider.skill_category);
  const city = normalize(provider.city);
  const serviceArea = normalize(provider.service_area);
  const search = normalize(searchCategory);
  const area = normalize(searchLocation);
  const reasons = [];
  let score = 35;

  if (provider.approval_status === "approved") {
    score += 15;
    reasons.push("Approved");
  }

  if (search && service === search) {
    score += 25;
    reasons.push("Matches service");
  } else if (search && service.includes(search)) {
    score += 14;
    reasons.push("Related service");
  }

  if (area && (city.includes(area) || serviceArea.includes(area))) {
    score += 18;
    reasons.push("Serves selected area");
  }

  if (Number(provider.rating || 0) >= 4.5) {
    score += 8;
    reasons.push("Strong rating");
  }

  if (Number(provider.completed_tasks || 0) > 0) {
    score += 7;
    reasons.push("Has completed jobs");
  }

  if (Number(provider.response_time_minutes || 0) <= 30) {
    score += 7;
    reasons.push("Fast response");
  }

  return {
    score: Math.min(100, score),
    reasons: reasons.slice(0, 4),
  };
}

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}
