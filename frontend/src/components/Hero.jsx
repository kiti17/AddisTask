export default function Hero({
  token,
  currentUser,
  logout,
  setView,
  activeMode,
  setActiveMode,
  currentUserRole,
  notificationCount,
  notificationText,
  notificationUpdatedAt,
  setSearchCategory,
}) {
  const featuredServices = [
    "Cleaning",
    "Plumbing",
    "Moving",
    "Delivery",
    "Electrical",
    "Home Repair",
  ];
  const activeModeLabel =
    activeMode === "admin"
      ? "Admin"
      : activeMode === "provider"
        ? "Provider"
        : "Customer";

  const switchMode = () => {
    if (currentUserRole === "admin" && activeMode !== "admin") {
      setActiveMode("admin");
      setView("marketplace");
      return;
    }

    setActiveMode(activeMode === "provider" ? "customer" : "provider");
  };

  return (
    <header className="hero">
      <div className="hero-copy">
        <p className="eyebrow light">Trusted local services for Addis Ababa</p>
        <h1>Book trusted help for everyday tasks.</h1>
        <p>
          AddisTask connects customers with approved local providers for cleaning,
          repairs, moving, delivery, and home support.
        </p>

        <div className="hero-service-panel" aria-label="Popular services">
          <span>What do you need help with?</span>
          <div className="hero-service-grid">
            {featuredServices.map((service) => (
              <button
                className="hero-service"
                key={service}
                onClick={() => {
                  setSearchCategory(service);
                  setView("marketplace");
                }}
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-actions">
          <button
            onClick={() => {
              setActiveMode("customer");
              setView("customer");
            }}
          >
            Post a Task
          </button>
          <button
            className="secondary-btn hero-secondary"
            onClick={() => {
              setActiveMode("provider");
              setView("provider");
            }}
          >
            Become a Provider
          </button>
        </div>

        <div className="hero-trust-strip">
          <span>Admin-approved providers</span>
          <span>Task status tracking</span>
          <span>Local Addis Ababa areas</span>
        </div>
      </div>

      <div className="top-actions">
        {token ? (
          <div className="user-info">
            <div className="user-meta">
              <span>
                Logged in as: {currentUser || "User"}
              </span>
              <span>
                Acting as: {activeModeLabel}
              </span>
              {currentUserRole === "admin" && (
                <span className="admin-pill">Admin</span>
              )}
            </div>

            <button
              className={notificationCount ? "global-alert active" : "global-alert"}
              onClick={() => setView("marketplace")}
            >
              <span>{notificationCount}</span>
              <strong>{notificationText}</strong>
              {notificationUpdatedAt && <small>Updated {notificationUpdatedAt}</small>}
            </button>

            <button
              className="secondary-btn hero-secondary"
              onClick={switchMode}
            >
              Switch Mode
            </button>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => setView("account")}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}
