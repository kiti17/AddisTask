export default function Hero({
  token,
  currentUser,
  logout,
  setView,
}) {
  return (
    <header className="hero">
      <div>
        <h1>AddisTask</h1>
        <p>Find trusted local help in Addis Ababa</p>
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
            Login / Register
          </button>
        )}
      </div>
    </header>
  );
}