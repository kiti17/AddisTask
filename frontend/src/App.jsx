import { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

export default function App() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");

  const [providerName, setProviderName] = useState("");

  const [selectedTask, setSelectedTask] = useState(null);
  const [matches, setMatches] = useState([]);
  const [applications, setApplications] = useState([]);

  const login = async () => {
    const res = await axios.post(`${API}/api/auth/login`, {
      phone,
      password,
    });
    setToken(res.data.access_token);
    alert("Logged in");
  };

  const createTask = async () => {
    await axios.post(
      `${API}/api/tasks/`,
      {
        title: taskTitle,
        description: "Test",
        category: "Plumbing",
        location: "Addis Ababa",
        budget: 50,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Task created");
  };

  const loadTasks = async () => {
    const res = await axios.get(`${API}/api/tasks/`);
    setTasks(res.data);
  };

  const createProvider = async () => {
    await axios.post(
      `${API}/api/providers/`,
      {
        business_name: providerName,
        skill_category: "Plumbing",
        city: "Addis Ababa",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Provider created");
  };

  const loadMatches = async (taskId) => {
    setSelectedTask(taskId);
    const res = await axios.get(`${API}/api/providers/match/${taskId}`);
    setMatches(res.data);
  };

  const applyToTask = async (taskId) => {
    await axios.post(
      `${API}/api/applications/`,
      { task_id: taskId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Applied!");
  };

  const loadApplications = async (taskId) => {
    const res = await axios.get(`${API}/api/applications/task/${taskId}`);
    setApplications(res.data);
  };

  const acceptApplication = async (id) => {
    await axios.patch(
      `${API}/api/applications/${id}/status?status=accepted`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Accepted!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AddisTask</h1>

      <h2>Login</h2>
      <input placeholder="Phone" onChange={(e) => setPhone(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>

      <h2>Create Task</h2>
      <input placeholder="Task title" onChange={(e) => setTaskTitle(e.target.value)} />
      <button onClick={createTask}>Create Task</button>

      <h2>Create Provider</h2>
      <input placeholder="Business name" onChange={(e) => setProviderName(e.target.value)} />
      <button onClick={createProvider}>Create Provider</button>

      <h2>Tasks</h2>
      <button onClick={loadTasks}>Load Tasks</button>

      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.title} ({t.status})
            <button onClick={() => loadMatches(t.id)}>Match</button>
            <button onClick={() => applyToTask(t.id)}>Apply</button>
            <button onClick={() => loadApplications(t.id)}>Applications</button>
          </li>
        ))}
      </ul>

      {selectedTask && (
        <>
          <h2>Matched Providers</h2>
          <ul>
            {matches.map((m) => (
              <li key={m.provider_id}>
                {m.business_name} - score: {m.match_score}
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>Applications</h2>
      <ul>
        {applications.map((a) => (
          <li key={a.application_id}>
            {a.business_name} ({a.status})
            <button onClick={() => acceptApplication(a.application_id)}>Accept</button>
          </li>
        ))}
      </ul>
    </div>
  );
}