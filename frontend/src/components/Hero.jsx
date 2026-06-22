export default function Hero({
  token,
  currentUser,
  logout,
  setView,
}) {
  return (
    <header className="hero">
      <div className="hero-copy">
        <p className="eyebrow light">TaskRabbit-inspired service booking for Addis Ababa</p>
        <h1>AddisTask</h1>
        <p>
          Post local tasks, match with trusted providers, and move work from
          request to completion in one simple marketplace.
        </p>

        <div className="hero-actions">
          <button onClick={() => setView("customer")}>Post a Task</button>
          <button className="secondary-btn hero-secondary" onClick={() => setView("marketplace")}>
            Browse Marketplace
          </button>
        </div>
      </div>

      <div className="top-actions">
        {token ? (
          <div className="user-info">
            <span>
              Logged in as: {currentUser || "User"}
            </span>

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
