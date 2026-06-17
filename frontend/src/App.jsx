import { useState } from "react";
import "./App.css";
import { api } from "./services/api";
import Hero from "./components/Hero";
import Marketplace from "./components/Marketplace";

export default function App() {
  const [view, setView] = useState("home");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");


  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [taskLocation, setTaskLocation] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const [providerName, setProviderName] = useState("");
  const [providerCategory, setProviderCategory] = useState("");
  const [providerCity, setProviderCity] = useState("");

  const [selectedTask, setSelectedTask] = useState(null);
  const [matches, setMatches] = useState([]);
  const [applications, setApplications] = useState([]);

  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const [currentUser, setCurrentUser] = useState(
  localStorage.getItem("currentUser") || ""
  );

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const register = async () => {
    try {
      await api.post("/api/auth/register", {
        full_name: fullName,
        phone: phone,
        password: password,
      });

      alert("Registration successful. You can now login.");
    } catch (err) {
      console.error("Register error:", err.response?.data);
      alert(JSON.stringify(err.response?.data?.detail || "Registration failed"));
    }
  };

  const login = async () => {
    try {
      const res = await api.post("/api/auth/login", {
        phone: phone,
        password: password,
      });

      localStorage.setItem("token", res.data.access_token);
      setToken(res.data.access_token);

      setCurrentUser(fullName || phone);
      localStorage.setItem("currentUser", fullName || phone);

      setFullName("");
      setPhone("");
      setPassword("");

      alert("Logged in successfully");
      setView("home");
    } catch (err) {
      console.error("Login error:", err.response?.data);
      alert(JSON.stringify(err.response?.data?.detail || "Login failed"));
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    alert("Logged out");
    setView("home");
  };

  const createTask = async () => {
    try {
      if (!token) return alert("Login first");

      await api.post(
        "/api/tasks/",
        {
          title: taskTitle,
          description: "Customer task",
          category: taskCategory,
          location: taskLocation,
          budget: 50,
        },
        authHeader
      );

      alert("Task created");
      setTaskTitle("");
      setTaskCategory("");
      setTaskLocation("");
      loadTasks();
    } catch (err) {
      alert(err.response?.data?.detail || "Task creation failed");
    }
  };

  const createProvider = async () => {
    try {
      if (!token) return alert("Login first");

      await api.post(
        `${API}/api/providers/`,
        {
          business_name: providerName,
          skill_category: providerCategory,
          city: providerCity,
        },
        authHeader
      );

      alert("Provider profile created");
      setProviderName("");
      setProviderCategory("");
      setProviderCity("");
    } catch (err) {
      alert(err.response?.data?.detail || "Provider creation failed");
    }
  };

  const loadTasks = async () => {
    try {
      const res = await api.get("/api/tasks/");
      setTasks(res.data);
    } catch {
      alert("Failed to load tasks");
    }
  };

  const loadMatches = async (taskId) => {
    try {
      setSelectedTask(taskId);
      const res = await api.get(`${API}/api/providers/match/${taskId}`);
      setMatches(res.data);
    } catch {
      alert("Failed to load matches");
    }
  };

  const applyToTask = async (taskId) => {
    try {
      if (!token) return alert("Login first");

      await api.post(
        `${API}/api/applications/`,
        { task_id: taskId },
        authHeader
      );

      alert("Applied to task");
    } catch (err) {
      alert(err.response?.data?.detail || "Apply failed");
    }
  };

  const loadApplications = async (taskId) => {
    try {
      const res = await api.get(`${API}/api/applications/task/${taskId}`);
      setApplications(res.data);
    } catch {
      alert("Failed to load applications");
    }
  };

  const acceptApplication = async (id) => {
    try {
      if (!token) return alert("Login first");

      await api.patch(
        `${API}/api/applications/${id}/status?status=accepted`,
        {},
        authHeader
      );

      alert("Accepted");
      loadTasks();
    } catch (err) {
      alert(err.response?.data?.detail || "Accept failed");
    }
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.status?.toLowerCase().trim() !== "completed" &&
      t.category?.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const completeTask = async (taskId) => {
    try {
      if (!token) return alert("Login first");

      await api.patch(
        `${API}/api/tasks/${taskId}/complete`,
        {},
        authHeader
      );

      alert("Task completed");

      setSelectedTask(null);
      setMatches([]);
      setApplications([]);

      await loadTasks();
    } catch (err) {
      alert(err.response?.data?.detail || "Complete task failed");
    }
  };

  return (
    <div className="page">
      <Hero
        token={token}
        currentUser={currentUser}
        logout={logout}
        setView={setView}
      />

      {view !== "home" && (
        <button className="back-btn" onClick={() => setView("home")}>
          ← Back Home
        </button>
      )}

      {view === "home" && (
        <>
          <section className="landing">
            <h2>What do you need today?</h2>
            <p>Choose how you want to use AddisTask.</p>

            <div className="choice-grid">
              <button className="choice-card" onClick={() => setView("customer")}>
                <span>🧹</span>
                <strong>I need help with a task</strong>
                <small>Post cleaning, plumbing, moving, repair, and more.</small>
              </button>

              <button className="choice-card" onClick={() => setView("provider")}>
                <span>🛠️</span>
                <strong>I want to work as a provider</strong>
                <small>Create your profile and apply to matching tasks.</small>
              </button>

              <button className="choice-card" onClick={() => setView("marketplace")}>
                <span>🔎</span>
                <strong>Browse marketplace</strong>
                <small>View available tasks and provider matches.</small>
              </button>
            </div>
          </section>

          <section className="categories">
            <h2>Popular Services</h2>
            <div className="category-grid">
              {["Cleaning", "Plumbing", "Electrical", "Moving", "Delivery", "Home Repair"].map(
                (service) => (
                  <button
                    key={service}
                    className="service-card"
                    onClick={() => {
                      setTaskCategory(service);
                      setProviderCategory(service);
                      setSearchCategory(service);
                      setView("marketplace");
                      loadTasks();
                    }}
                  >
                    {service}
                  </button>
                )
              )}
            </div>
          </section>
        </>
      )}

      {view === "account" && (
        <section className="card narrow">
          <h2>Account</h2>

          <input
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!token ? (
            <div className="button-row">
              <button onClick={login}>Login</button>
              <button onClick={register}>Register</button>
            </div>
          ) : (
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          )}
        </section>
      )}

      {view === "customer" && (
        <section className="card narrow">
          <h2>Post a Task</h2>
          <p className="muted">Tell providers what kind of help you need.</p>

          <input
            placeholder="Task title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <input
            placeholder="Category e.g. Cleaning"
            value={taskCategory}
            onChange={(e) => setTaskCategory(e.target.value)}
          />

          <input
            placeholder="Location e.g. Addis Ababa"
            value={taskLocation}
            onChange={(e) => setTaskLocation(e.target.value)}
          />

          <button onClick={createTask}>Create Task</button>

          <button className="secondary-btn" onClick={() => setView("marketplace")}>
            View Marketplace
          </button>
        </section>
      )}

      {view === "provider" && (
        <section className="card narrow">
          <h2>Become a Provider</h2>
          <p className="muted">Create your provider profile and apply to tasks.</p>

          <input
            placeholder="Business name"
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
          />

          <input
            placeholder="Skill category e.g. Cleaning"
            value={providerCategory}
            onChange={(e) => setProviderCategory(e.target.value)}
          />

          <input
            placeholder="City e.g. Addis Ababa"
            value={providerCity}
            onChange={(e) => setProviderCity(e.target.value)}
          />

          <button onClick={createProvider}>Create Provider Profile</button>

          <button className="secondary-btn" onClick={() => setView("marketplace")}>
            Browse Tasks
          </button>
        </section>
      )}

      {view === "marketplace" && (
        <>
          <Marketplace
            loadTasks={loadTasks}
            searchCategory={searchCategory}
            setSearchCategory={setSearchCategory}
            filteredTasks={filteredTasks}
            loadMatches={loadMatches}
            applyToTask={applyToTask}
            loadApplications={loadApplications}
            completeTask={completeTask}
          />

          {selectedTask && (
            <section className="card wide">
              <h2>Matched Providers for Task #{selectedTask}</h2>

              <div className="list">
                {matches.map((m) => (
                  <div className="row" key={m.provider_id}>
                    <div>
                      <strong>{m.business_name}</strong>
                      <p>{m.skill_category} • {m.city}</p>
                      <p>⭐ Rating: {m.rating || 4.5}</p>
                      <p>✔ Completed Tasks: {m.completed_tasks || 0}</p>
                      <p>⏱ Response Time: {m.response_time_minutes || 30} min</p>
                    </div>

                    <span className="score">Score: {m.match_score}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="card wide">
            <h2>Applications</h2>

            <div className="list">
              {applications.map((a) => (
                <div className="row" key={a.application_id}>
                  <div>
                    <strong>{a.business_name}</strong>
                    <p>
                      {a.skill_category} • {a.city} • Status: {a.status}
                    </p>
                  </div>

                  <button onClick={() => acceptApplication(a.application_id)}>
                    Accept
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}