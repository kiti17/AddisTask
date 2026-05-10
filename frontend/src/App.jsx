import { useState } from "react";
import axios from "axios";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function App() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [taskLocation, setTaskLocation] = useState("");

  const [providerName, setProviderName] = useState("");
  const [providerCategory, setProviderCategory] = useState("");
  const [providerCity, setProviderCity] = useState("");

  const [selectedTask, setSelectedTask] = useState(null);
  const [matches, setMatches] = useState([]);
  const [applications, setApplications] = useState([]);

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

const login = async () => {
  
  try {
    console.log("Trying login with:", phone, password);
    console.log("API URL:", API);

    const res = await axios.post(`${API}/api/auth/login`, {
      phone,
      password,
    });

    console.log("Login response:", res.data);
    setToken(res.data.access_token);
    alert("Logged in successfully");
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    alert(err.response?.data?.detail || "Login failed");
  }
};

  const createTask = async () => {
    try {
      if (!token) return alert("Login first");
      await axios.post(
        `${API}/api/tasks/`,
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
      loadTasks();
    } catch (err) {
      alert(err.response?.data?.detail || "Task creation failed");
    }
  };

  const loadTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks/`);
      setTasks(res.data);
    } catch {
      alert("Failed to load tasks");
    }
  };

  const createProvider = async () => {
    try {
      if (!token) return alert("Login first");
      await axios.post(
        `${API}/api/providers/`,
        {
          business_name: providerName,
          skill_category: providerCategory,
          city: providerCity,
        },
        authHeader
      );
      alert("Provider created");
    } catch (err) {
      alert(err.response?.data?.detail || "Provider creation failed");
    }
  };

  const loadMatches = async (taskId) => {
    try {
      setSelectedTask(taskId);
      const res = await axios.get(`${API}/api/providers/match/${taskId}`);
      setMatches(res.data);
    } catch {
      alert("Failed to load matches");
    }
  };

  const applyToTask = async (taskId) => {
    try {
      if (!token) return alert("Login first");
      await axios.post(`${API}/api/applications/`, { task_id: taskId }, authHeader);
      alert("Applied to task");
    } catch (err) {
      alert(err.response?.data?.detail || "Apply failed");
    }
  };

  const loadApplications = async (taskId) => {
    try {
      const res = await axios.get(`${API}/api/applications/task/${taskId}`);
      setApplications(res.data);
    } catch {
      alert("Failed to load applications");
    }
  };

  const acceptApplication = async (id) => {
    try {
      if (!token) return alert("Login first");
      await axios.patch(
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

  return (
    <div className="page">
      <header className="hero">
        <div>
          <h1>AddisTask</h1>
          <p>Smart local service marketplace for Addis Ababa</p>
        </div>
        <span className={token ? "badge online" : "badge"}>
          {token ? "Logged in" : "Not logged in"}
        </span>
      </header>

      <main className="grid">
        <section className="card">
          <h2>Login</h2>
          <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
        </section>

        <section className="card">
          <h2>Create Task</h2>
          <input placeholder="Task title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
          <input placeholder="Category e.g. Cleaning" value={taskCategory} onChange={(e) => setTaskCategory(e.target.value)} />
          <input placeholder="Location e.g. Addis Ababa" value={taskLocation} onChange={(e) => setTaskLocation(e.target.value)} />
          <button onClick={createTask}>Create Task</button>
        </section>

        <section className="card">
          <h2>Create Provider</h2>
          <input placeholder="Business name" value={providerName} onChange={(e) => setProviderName(e.target.value)} />
          <input placeholder="Skill category e.g. Cleaning" value={providerCategory} onChange={(e) => setProviderCategory(e.target.value)} />
          <input placeholder="City e.g. Addis Ababa" value={providerCity} onChange={(e) => setProviderCity(e.target.value)} />
          <button onClick={createProvider}>Create Provider</button>
        </section>
      </main>

      <section className="card wide">
        <div className="section-header">
          <h2>Tasks</h2>
          <button onClick={loadTasks}>Load Tasks</button>
        </div>

        <div className="list">
          {tasks.map((t) => (
            <div className="row" key={t.id}>
              <div>
                <strong>{t.title}</strong>
                <p>{t.location} • {t.category} • Status: {t.status}</p>
              </div>
              <div className="actions">
                <button onClick={() => loadMatches(t.id)}>Smart Match</button>
                <button onClick={() => applyToTask(t.id)}>Apply</button>
                <button onClick={() => loadApplications(t.id)}>Applications</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedTask && (
        <section className="card wide">
          <h2>Matched Providers for Task #{selectedTask}</h2>
          <div className="list">
            {matches.map((m) => (
              <div className="row" key={m.provider_id}>
                <div>
                  <strong>{m.business_name}</strong>
                  <p>{m.skill_category} • {m.city}</p>
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
                <p>{a.skill_category} • {a.city} • Status: {a.status}</p>
              </div>
              <button onClick={() => acceptApplication(a.application_id)}>Accept</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}