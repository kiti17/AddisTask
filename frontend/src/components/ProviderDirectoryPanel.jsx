function ProviderCard({
  provider,
  openProviderProfile,
  saveProvider,
  removeSavedProvider,
  isSaved = false,
}) {
  return (
    <div className={`provider-card${isSaved ? " saved-provider" : ""}`} key={provider.id}>
      <div>
        <strong>{provider.business_name}</strong>
        <p>{provider.skill_category} | {provider.city}</p>
      </div>

      <div className="trust-list compact">
        <span>Rating: {provider.rating || 4.5}</span>
        <span>Completed: {provider.completed_tasks || 0}</span>
        <span>Response: {provider.response_time_minutes || 30} min</span>
        <span>Experience: {provider.experience_years || 0} yrs</span>
        {isSaved && <span>Status: {provider.approval_status || "pending"}</span>}
      </div>

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

        <div className="provider-grid">
          {filteredProviders.length === 0 && (
            <div className="empty-state">
              No providers match the selected service and area yet.
            </div>
          )}

          {filteredProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              openProviderProfile={openProviderProfile}
              saveProvider={saveProvider}
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
                isSaved
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
