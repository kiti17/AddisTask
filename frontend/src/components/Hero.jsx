import { useState } from "react";

import heroImage from "../assets/hero-service-marketplace.jpg";
import logoMark from "../assets/addistask-logo-mark.png";

export default function Hero({
  token,
  currentUser,
  logout,
  setView,
  setActiveMode,
  currentUserRole,
  notificationCount,
  setSearchCategory,
  openAccountModal,
  openProviderProfileForm,
  showHero = true,
}) {
  const [heroSearch, setHeroSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const serviceSuggestions = [
    "Cleaning",
    "Plumbing",
    "Electrical",
    "Moving",
    "Delivery",
    "Home Repair",
    "Painting",
  ];

  const searchServices = (event) => {
    event.preventDefault();
    setSearchCategory(heroSearch.trim());
    setShowSuggestions(false);
    setView("marketplace");
  };

  const chooseSuggestion = (service) => {
    setHeroSearch(service);
    setSearchCategory(service);
    setShowSuggestions(false);
    setView("marketplace");
  };

  return (
    <>
      <nav className="site-topbar" aria-label="Main navigation">
        <button
          className="site-brand"
          onClick={() => setView("home")}
          aria-label="Go to AddisTask home"
        >
          <img src={logoMark} alt="" />
          <strong>
            <span>Addis</span>
            <span>Task</span>
          </strong>
        </button>

        <div className="site-nav-actions">
          <button
            className="nav-link"
            onClick={() => {
              setSearchCategory("");
              setView("marketplace");
            }}
          >
            Services
          </button>
          <button
            className="nav-link"
            onClick={() => {
              setSearchCategory("");
              setView("marketplace");
            }}
          >
            Browse Jobs
          </button>

          {token ? (
            <>
              <button
                className={notificationCount ? "nav-link alert-link active" : "nav-link alert-link"}
                onClick={() => setView("marketplace")}
              >
                Alerts {notificationCount ? `(${notificationCount})` : ""}
              </button>
              <button className="topbar-user" onClick={openAccountModal}>
                {currentUser || "User"}
              </button>
              {currentUserRole === "admin" && (
                <button
                  className="nav-link"
                  onClick={() => {
                    setActiveMode("admin");
                    setView("marketplace");
                  }}
                >
                  Admin
                </button>
              )}
              <button className="nav-link" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <button className="nav-link" onClick={openAccountModal}>
              Sign up / Log in
            </button>
          )}

          <button
            className="topbar-provider-btn"
            onClick={() => {
              if (openProviderProfileForm) {
                openProviderProfileForm();
                return;
              }
              setActiveMode("provider");
              setView("provider");
            }}
          >
            Become a Provider
          </button>
        </div>
      </nav>

      {showHero && (
        <header className="hero">
          <div className="hero-copy">
            <h1>Get help with tasks in Addis Ababa.</h1>
            <p>
              Search for cleaning, repairs, moving, delivery, and other local services.
            </p>

            <div className="hero-search-wrap">
              <form
                className="hero-search"
                onSubmit={searchServices}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => window.setTimeout(() => setShowSuggestions(false), 120)}
              >
                <input
                  value={heroSearch}
                  onChange={(event) => {
                    setHeroSearch(event.target.value);
                    setShowSuggestions(true);
                  }}
                  onClick={() => setShowSuggestions(true)}
                  placeholder="What do you need help with?"
                  aria-label="Search services"
                  aria-expanded={showSuggestions}
                  aria-controls="hero-service-suggestions"
                />
                <button type="submit" aria-label="Search services">
                  Search
                </button>
              </form>

              {showSuggestions && (
                <div className="hero-suggestions" id="hero-service-suggestions">
                  {serviceSuggestions.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        chooseSuggestion(service);
                      }}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hero-service-chips" aria-label="Available services">
              {serviceSuggestions.map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => chooseSuggestion(service)}
                >
                  {service}
                </button>
              ))}
            </div>

            <div className="hero-actions">
              <button
                className="primary-action"
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
                  if (openProviderProfileForm) {
                    openProviderProfileForm();
                    return;
                  }
                  setActiveMode("provider");
                  setView("provider");
                }}
              >
                Become a Provider
              </button>
            </div>
          </div>

          <div className="hero-image-panel">
            <img
              src={heroImage}
              alt="A local service provider arriving to help a customer at home"
            />
          </div>
        </header>
      )}
    </>
  );
}
