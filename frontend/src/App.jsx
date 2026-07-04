import { useEffect, useState } from "react";
import "./App.css";
import { api } from "./services/api";
import Hero from "./components/Hero";
import Marketplace from "./components/Marketplace";
import MatchedProviders from "./components/MatchedProviders";
import serviceMosaic from "./assets/service-mosaic.jpg";

const serviceCategories = [
  "Cleaning",
  "Plumbing",
  "Electrical",
  "Moving",
  "Delivery",
  "Home Repair",
  "Appliance Repair",
  "Painting",
];

const PLATFORM_FEE_RATE = 0.1;

const addisAreas = [
  "Addis Ababa",
  "Bole",
  "Kazanchis",
  "Piassa",
  "Megenagna",
  "CMC",
  "Sar Bet",
  "Mexico",
];

const serviceGuidance = {
  Cleaning: {
    budget: "800-2,500 birr",
    title: "Deep clean a two-bedroom apartment",
    checklist: ["Number of rooms", "Supplies needed", "Preferred arrival time"],
  },
  Plumbing: {
    budget: "1,000-4,000 birr",
    title: "Fix leaking bathroom sink",
    checklist: ["Leak location", "Photos or part details", "Water access notes"],
  },
  Electrical: {
    budget: "1,200-5,000 birr",
    title: "Repair faulty wall outlet",
    checklist: ["Problem area", "Power issue details", "Safety concerns"],
  },
  Moving: {
    budget: "2,000-8,000 birr",
    title: "Move furniture from Bole to CMC",
    checklist: ["Pickup and dropoff floors", "Large items", "Vehicle needed"],
  },
  Delivery: {
    budget: "300-1,500 birr",
    title: "Deliver package from Piassa to Bole",
    checklist: ["Pickup contact", "Dropoff contact", "Package size"],
  },
  "Home Repair": {
    budget: "1,000-6,000 birr",
    title: "Repair broken cabinet door",
    checklist: ["Repair type", "Tools or parts needed", "Photos if available"],
  },
  "Appliance Repair": {
    budget: "1,500-7,000 birr",
    title: "Repair washing machine drainage issue",
    checklist: ["Appliance brand", "Error symptoms", "Access to power and water"],
  },
  Painting: {
    budget: "2,000-10,000 birr",
    title: "Paint one bedroom wall",
    checklist: ["Wall size", "Paint provided or needed", "Surface condition"],
  },
};

const demoTasks = [
  {
    id: -101,
    title: "Deep clean apartment before family visit",
    description:
      "Two-bedroom apartment needs kitchen, bathroom, and floor cleaning.\nUrgency: This week\nPreferred date: 2026-06-24\nTime window: Morning\nAccess notes: Call before arrival; cleaning supplies preferred.",
    category: "Cleaning",
    location: "Bole",
    budget: 1800,
    status: "open",
  },
  {
    id: -102,
    title: "Fix leaking kitchen sink",
    description:
      "Leak under the kitchen sink after water runs for a few minutes.\nUrgency: Tomorrow\nPreferred date: 2026-06-22\nTime window: Afternoon\nAccess notes: Bring basic pipe fittings if available.",
    category: "Plumbing",
    location: "Megenagna",
    budget: 2500,
    status: "assigned",
  },
  {
    id: -103,
    title: "Move sofa and bed frame to CMC",
    description:
      "Need help moving large furniture from a first-floor apartment.\nUrgency: This week\nPreferred date: 2026-06-25\nTime window: Weekend\nAccess notes: Vehicle needed; destination has elevator.",
    category: "Moving",
    location: "CMC",
    budget: 5500,
    status: "open",
  },
  {
    id: -104,
    title: "Repair faulty bedroom outlet",
    description:
      "Outlet sparks when plugging in charger.\nUrgency: Today\nPreferred date: 2026-06-21\nTime window: Evening\nAccess notes: Customer will turn off power before provider arrives.",
    category: "Electrical",
    location: "Kazanchis",
    budget: 3000,
    status: "completed",
  },
  {
    id: -105,
    title: "Deliver documents from Piassa to Mexico",
    description:
      "Small envelope delivery for office documents.\nUrgency: Today\nPreferred date: 2026-06-21\nTime window: Afternoon\nAccess notes: Pickup contact is at reception desk.",
    category: "Delivery",
    location: "Piassa",
    budget: 600,
    status: "open",
  },
];

const demoProviders = [
  {
    id: -201,
    user_id: -301,
    business_name: "Bole Bright Cleaning",
    skill_category: "Cleaning",
    city: "Bole",
    rating: 4.8,
    completed_tasks: 42,
    response_time_minutes: 18,
  },
  {
    id: -202,
    user_id: -302,
    business_name: "Megenagna Pipe Works",
    skill_category: "Plumbing",
    city: "Megenagna",
    rating: 4.6,
    completed_tasks: 35,
    response_time_minutes: 25,
  },
  {
    id: -203,
    user_id: -303,
    business_name: "Addis Move Team",
    skill_category: "Moving",
    city: "CMC",
    rating: 4.7,
    completed_tasks: 58,
    response_time_minutes: 30,
  },
  {
    id: -204,
    user_id: -304,
    business_name: "Kazanchis Electric Care",
    skill_category: "Electrical",
    city: "Kazanchis",
    rating: 4.9,
    completed_tasks: 64,
    response_time_minutes: 20,
  },
  {
    id: -205,
    user_id: -305,
    business_name: "Fast Addis Delivery",
    skill_category: "Delivery",
    city: "Piassa",
    rating: 4.5,
    completed_tasks: 87,
    response_time_minutes: 15,
  },
];

export default function App() {
  const [view, setView] = useState("home");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [currentUser, setCurrentUser] = useState(
    sessionStorage.getItem("currentUser") || ""
  );
  const [currentUserId, setCurrentUserId] = useState(
    Number(sessionStorage.getItem("currentUserId") || 0)
  );
  const [currentUserRole, setCurrentUserRole] = useState(
    sessionStorage.getItem("currentUserRole") || "customer"
  );
  const [activeMode, setActiveMode] = useState(
    sessionStorage.getItem("activeMode") || "customer"
  );

  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskCategory, setTaskCategory] = useState(serviceCategories[0]);
  const [taskLocation, setTaskLocation] = useState(addisAreas[0]);
  const [taskBudget, setTaskBudget] = useState("");
  const [taskUrgency, setTaskUrgency] = useState("Flexible");
  const [taskDate, setTaskDate] = useState("");
  const [taskTimeWindow, setTaskTimeWindow] = useState("Any time");
  const [taskAccessNotes, setTaskAccessNotes] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  const [providerName, setProviderName] = useState("");
  const [providerCategory, setProviderCategory] = useState(serviceCategories[0]);
  const [providerCity, setProviderCity] = useState(addisAreas[0]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [matches, setMatches] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationsTask, setApplicationsTask] = useState(null);
  const [applicationsError, setApplicationsError] = useState("");
  const [customerApplications, setCustomerApplications] = useState([]);
  const [providerApplications, setProviderApplications] = useState([]);
  const [providerActivityLoadedAt, setProviderActivityLoadedAt] = useState("");
  const [providers, setProviders] = useState([]);
  const [myProviderProfile, setMyProviderProfile] = useState(null);
  const [verificationQueue, setVerificationQueue] = useState([]);
  const [marketplaceSyncedAt, setMarketplaceSyncedAt] = useState("");
  const [savedProviders, setSavedProviders] = useState([]);
  const [reviewTaskId, setReviewTaskId] = useState("");
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewComment, setReviewComment] = useState("");
  const [messageTaskId, setMessageTaskId] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [taskMessages, setTaskMessages] = useState([]);

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  const isAdmin = currentUserRole === "admin";

  const getErrorMessage = (err, fallback) => {
    const detail = err.response?.data?.detail;

    if (Array.isArray(detail)) {
      return detail.map((item) => item.msg).join("\n");
    }

    return detail || fallback;
  };

  const getRefreshTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    const loadCurrentSessionUser = async () => {
      if (!token) return;

      try {
        const res = await api.get(
          "/api/auth/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        sessionStorage.setItem("currentUser", res.data.full_name || res.data.phone);
        sessionStorage.setItem("currentUserId", String(res.data.user_id || 0));
        sessionStorage.setItem("currentUserRole", res.data.role || "customer");
        setCurrentUser(res.data.full_name || res.data.phone);
        setCurrentUserId(Number(res.data.user_id || 0));
        setCurrentUserRole(res.data.role || "customer");
      } catch {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUserId");
        sessionStorage.removeItem("currentUserRole");
        setToken("");
        setCurrentUser("");
        setCurrentUserId(0);
        setCurrentUserRole("customer");
      }
    };

    loadCurrentSessionUser();
  }, [token]);

  const register = async () => {
    try {
      if (!fullName.trim()) return alert("Enter your full name.");
      if (!phone.trim()) return alert("Enter your phone number.");
      if (password.length < 6) return alert("Password must be at least 6 characters.");

      await api.post("/api/auth/register", {
        full_name: fullName,
        phone,
        password,
      });

      alert("Registration successful. You can now login.");
    } catch (err) {
      alert(getErrorMessage(err, "Registration failed"));
    }
  };

  const login = async () => {
    try {
      if (!phone.trim()) return alert("Enter your phone number.");
      if (password.length < 6) return alert("Password must be at least 6 characters.");

      const res = await api.post("/api/auth/login", {
        phone,
        password,
      });

      sessionStorage.setItem("token", res.data.access_token);
      sessionStorage.setItem("currentUser", res.data.full_name || fullName || phone);
      sessionStorage.setItem("currentUserId", String(res.data.user_id || 0));
      const nextRole = res.data.role || "customer";
      const nextMode = nextRole === "admin" ? "admin" : "customer";

      sessionStorage.setItem("currentUserRole", nextRole);
      sessionStorage.setItem("activeMode", nextMode);

      setToken(res.data.access_token);
      setCurrentUser(res.data.full_name || fullName || phone);
      setCurrentUserId(Number(res.data.user_id || 0));
      setCurrentUserRole(nextRole);
      setActiveMode(nextMode);

      setFullName("");
      setPhone("");
      setPassword("");

      alert("Logged in successfully");
      setView(nextMode === "admin" ? "marketplace" : "home");
    } catch (err) {
      alert(getErrorMessage(err, "Login failed"));
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUserId");
    sessionStorage.removeItem("currentUserRole");
    sessionStorage.removeItem("activeMode");

    setToken("");
    setCurrentUser("");
    setCurrentUserId(0);
    setCurrentUserRole("customer");
    setActiveMode("customer");
    setView("home");

    alert("Logged out");
  };

  const loadTasks = async () => {
    try {
      const res = await api.get("/api/tasks/");
      setTasks(res.data);
    } catch (err) {
      alert(JSON.stringify(err.response?.data?.detail || "Failed to load tasks"));
    }
  };

  const loadProviders = async () => {
    try {
      const res = await api.get("/api/providers/");
      setProviders(res.data);
    } catch (err) {
      alert(JSON.stringify(err.response?.data?.detail || "Failed to load providers"));
    }
  };

  const loadMyProviderProfile = async ({ silent = false } = {}) => {
    try {
      if (!token) {
        if (silent) return;
        setView("account");
        return alert("Login first to view provider verification status.");
      }

      const res = await api.get("/api/providers/me", authHeader);
      setMyProviderProfile(res.data);
    } catch (err) {
      setMyProviderProfile(null);
      if (silent) return;
      alert(getErrorMessage(err, "No provider profile found yet"));
    }
  };

  const loadVerificationQueue = async ({ silent = false } = {}) => {
    try {
      if (!token) {
        if (silent) return;
        setView("account");
        return alert("Login first to review provider verification.");
      }

      if (!isAdmin) {
        setVerificationQueue([]);
        if (silent) return;
        return alert("Admin access is required to review provider verification.");
      }

      const res = await api.get("/api/providers/verification-queue", authHeader);
      setVerificationQueue(res.data);
    } catch (err) {
      if (silent) return;
      alert(getErrorMessage(err, "Failed to load verification queue"));
    }
  };

  const loadCustomerApplications = async ({ silent = false } = {}) => {
    try {
      if (!token) {
        if (silent) return;
        setView("account");
        return alert("Login first to view customer notifications.");
      }

      const res = await api.get("/api/applications/customer/me", authHeader);
      setCustomerApplications(res.data);
    } catch (err) {
      if (silent) return;
      alert(getErrorMessage(err, "Failed to load customer notifications"));
    }
  };

  const refreshNotifications = async () => {
    if (!token) {
      setView("account");
      return alert("Login first to refresh notifications.");
    }

    if (activeMode === "customer") {
      await loadCustomerApplications();
      setMarketplaceSyncedAt(getRefreshTime());
      return;
    }

    if (activeMode === "admin") {
      await Promise.all([
        loadTasks(),
        loadProviders(),
        loadVerificationQueue(),
      ]);
      setMarketplaceSyncedAt(getRefreshTime());
      return;
    }

    await Promise.all([
      loadProviderApplications(),
      loadMyProviderProfile(),
    ]);
    setMarketplaceSyncedAt(getRefreshTime());
  };

  const updateProviderApproval = async (providerId, status) => {
    try {
      if (!token) {
        setView("account");
        return alert("Login first to update provider approval.");
      }

      if (!isAdmin) {
        return alert("Admin access is required to approve or reject providers.");
      }

      await api.patch(
        `/api/providers/${providerId}/approval?status=${status}`,
        {},
        authHeader
      );

      alert(`Provider marked ${status}.`);
      await Promise.all([loadProviders(), loadVerificationQueue()]);

      if (myProviderProfile?.id === providerId) {
        await loadMyProviderProfile();
      }
    } catch (err) {
      alert(getErrorMessage(err, "Provider approval update failed"));
    }
  };

  const refreshMarketplace = async () => {
    await Promise.all([loadTasks(), loadProviders()]);
    setMarketplaceSyncedAt(getRefreshTime());
  };

  const changeActiveMode = (mode) => {
    sessionStorage.setItem("activeMode", mode);
    setActiveMode(mode);
    setApplicationsError("");

    if (mode === "admin" && isAdmin) {
      setView("marketplace");
      Promise.all([
        loadTasks(),
        loadProviders(),
        loadVerificationQueue({ silent: true }),
      ]).then(() => setMarketplaceSyncedAt(getRefreshTime()));
    }
  };

  const loadDemoData = () => {
    setTasks(demoTasks);
    setProviders(demoProviders);
    setSearchCategory("");
    setSearchLocation("");
    setMaxBudget("");
    setMatches([]);
    setApplications([]);
    setApplicationsTask(null);
    setApplicationsError("");
    setCustomerApplications([]);
    setProviderApplications([]);
    setProviderActivityLoadedAt("");
    setMyProviderProfile(null);
    setVerificationQueue([]);
    setTaskMessages([]);
    setSelectedTask(null);
    alert("Demo marketplace data loaded.");
  };

  const clearDemoData = () => {
    setTasks((current) => current.filter((task) => task.id > 0));
    setProviders((current) => current.filter((provider) => provider.id > 0));
    setMatches([]);
    setApplications([]);
    setApplicationsTask(null);
    setApplicationsError("");
    setCustomerApplications([]);
    setProviderApplications([]);
    setProviderActivityLoadedAt("");
    setMyProviderProfile(null);
    setVerificationQueue([]);
    setTaskMessages([]);
    setSelectedTask(null);
    alert("Demo data cleared from this browser session.");
  };

  const saveProvider = (provider) => {
    setSavedProviders((current) => {
      if (current.some((savedProvider) => savedProvider.id === provider.id)) {
        return current;
      }

      return [...current, provider];
    });
  };

  const removeSavedProvider = (providerId) => {
    setSavedProviders((current) =>
      current.filter((provider) => provider.id !== providerId)
    );
  };

  const createTask = async () => {
    try {
      if (!token) {
        setView("account");
        return alert("Login first so providers know who posted the task.");
      }

      if (activeMode !== "customer") {
        return alert("Switch to Customer Mode before posting a task.");
      }

      await api.post(
        "/api/tasks/",
        {
          title: taskTitle,
          description: [
            taskDescription || "Customer task",
            `Urgency: ${taskUrgency}`,
            `Preferred date: ${taskDate || "Flexible"}`,
            `Time window: ${taskTimeWindow}`,
            taskAccessNotes ? `Access notes: ${taskAccessNotes}` : "",
          ].filter(Boolean).join("\n"),
          category: taskCategory,
          location: taskLocation,
          budget: taskBudget ? Number(taskBudget) : null,
        },
        authHeader
      );

      alert("Task posted. Providers can now apply.");

      setTaskTitle("");
      setTaskDescription("");
      setTaskBudget("");
      setTaskUrgency("Flexible");
      setTaskDate("");
      setTaskTimeWindow("Any time");
      setTaskAccessNotes("");

      await loadTasks();
      await loadCustomerApplications();
      setView("marketplace");
    } catch (err) {
      alert(JSON.stringify(err.response?.data?.detail || "Task creation failed"));
    }
  };

  const createProvider = async () => {
    try {
      if (!token) {
        setView("account");
        return alert("Login first to create a provider profile.");
      }

      if (activeMode !== "provider") {
        return alert("Switch to Provider Mode before creating a provider profile.");
      }

      await api.post(
        "/api/providers/",
        {
          business_name: providerName,
          skill_category: providerCategory,
          city: providerCity,
        },
        authHeader
      );

      alert("Provider profile submitted for approval. Apply after the profile is approved.");

      setProviderName("");

      await loadTasks();
      await loadProviders();
      await loadMyProviderProfile();
      setView("marketplace");
    } catch (err) {
      alert(JSON.stringify(err.response?.data?.detail || "Provider creation failed"));
    }
  };

  const loadMatches = async (taskId) => {
    try {
      setSelectedTask(taskId);

      if (taskId < 0) {
        const task = demoTasks.find((item) => item.id === taskId);
        const demoMatches = demoProviders
          .filter(
            (provider) =>
              provider.skill_category === task?.category &&
              provider.city === task?.location
          )
          .map((provider) => ({
            provider_id: provider.id,
            business_name: provider.business_name,
            skill_category: provider.skill_category,
            city: provider.city,
            rating: provider.rating,
            completed_tasks: provider.completed_tasks,
            response_time_minutes: provider.response_time_minutes,
            match_score: 95,
          }));

        setMatches(demoMatches);
        return;
      }

      const res = await api.get(`/api/providers/match/${taskId}`);
      setMatches(res.data);
    } catch (err) {
      alert(JSON.stringify(err.response?.data?.detail || "Failed to load matches"));
    }
  };

  const applyToTask = async (taskOrId) => {
    const task = typeof taskOrId === "object"
      ? taskOrId
      : tasks.find((item) => item.id === taskOrId);
    const taskId = typeof taskOrId === "object" ? taskOrId.id : taskOrId;

    try {
      if (activeMode !== "provider") {
        return alert("Switch to Provider Mode before applying to tasks.");
      }

      if (taskId < 0) {
        const demoTask = task || demoTasks.find((item) => item.id === taskId);

        if (demoTask) {
          setProviderApplications((current) => [
            {
              application_id: -401,
              task_id: demoTask.id,
              status: demoTask.status === "assigned" ? "accepted" : "pending",
              task_title: demoTask.title,
              task_category: demoTask.category,
              task_location: demoTask.location,
              task_budget: demoTask.budget,
              task_status: demoTask.status,
            },
            ...current.filter((application) => application.task_id !== demoTask.id),
          ]);
          setProviderActivityLoadedAt(new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }));
        }

        return alert("Demo application added to Provider Activity.");
      }

      if (!token) {
        setView("account");
        return alert("Login first to apply as a provider.");
      }

      if (task?.customer_id === currentUserId) {
        return alert("You cannot apply to your own task. Switch to Customer Mode to review applications.");
      }

      if (!myProviderProfile) {
        await loadMyProviderProfile();
        return alert("Provider profile status loaded. Apply again after confirming it is approved.");
      }

      if (myProviderProfile.approval_status !== "approved") {
        return alert("Your provider profile must be approved before you can apply to tasks.");
      }

      await api.post("/api/applications/", { task_id: taskId }, authHeader);

      alert("Application sent to the customer.");
      await loadProviderApplications();
    } catch (err) {
      alert(JSON.stringify(err.response?.data?.detail || "Apply failed"));
    }
  };

  const loadProviderApplications = async ({ silent = false } = {}) => {
    try {
      if (!token) {
        if (silent) return;
        setView("account");
        return alert("Login first to view provider activity.");
      }

      if (activeMode !== "provider") {
        if (silent) return;
        return alert("Switch to Provider Mode to view provider activity.");
      }

      const res = await api.get("/api/applications/provider/me", authHeader);
      setProviderApplications(res.data);
      setProviderActivityLoadedAt(getRefreshTime());
    } catch (err) {
      if (silent) return;
      alert(getErrorMessage(err, "Failed to load provider activity"));
    }
  };

  useEffect(() => {
    if (!token) return undefined;

    const loadMarketplaceContext = async () => {
      const requestConfig = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        const [tasksResponse, providersResponse] = await Promise.all([
          api.get("/api/tasks/"),
          api.get("/api/providers/"),
        ]);

        setTasks(tasksResponse.data);
        setProviders(providersResponse.data);

        if (activeMode === "customer") {
          const applicationsResponse = await api.get(
            "/api/applications/customer/me",
            requestConfig
          );
          setCustomerApplications(applicationsResponse.data);
        }

        if (activeMode === "provider") {
          const [profileResult, applicationsResult] = await Promise.allSettled([
            api.get("/api/providers/me", requestConfig),
            api.get("/api/applications/provider/me", requestConfig),
          ]);

          if (profileResult.status === "fulfilled") {
            setMyProviderProfile(profileResult.value.data);
          } else {
            setMyProviderProfile(null);
          }

          if (applicationsResult.status === "fulfilled") {
            setProviderApplications(applicationsResult.value.data);
            setProviderActivityLoadedAt(getRefreshTime());
          }
        }

        if (activeMode === "admin" && isAdmin) {
          const queueResponse = await api.get(
            "/api/providers/verification-queue",
            requestConfig
          );
          setVerificationQueue(queueResponse.data);
        }

        setMarketplaceSyncedAt(getRefreshTime());
      } catch {
        // Background refresh stays quiet so users are not interrupted while working.
      }
    };

    loadMarketplaceContext();
    const intervalId = window.setInterval(loadMarketplaceContext, 30000);

    return () => window.clearInterval(intervalId);
  }, [token, activeMode, isAdmin]);

  const loadApplications = async (taskOrId) => {
    const taskId = typeof taskOrId === "object" ? taskOrId.id : taskOrId;

    try {
      setApplicationsError("");
      setApplicationsTask(
        typeof taskOrId === "object"
          ? taskOrId
          : tasks.find((task) => task.id === taskId) || null
      );

      if (taskId < 0) {
        const task = demoTasks.find((item) => item.id === taskId);
        const applicant = demoProviders.find(
          (provider) => provider.skill_category === task?.category
        );

        setApplications(
          applicant
            ? [
                {
                  application_id: -401,
                  task_id: taskId,
                  status: task?.status === "assigned" ? "accepted" : "pending",
                  provider_id: applicant.id,
                  business_name: applicant.business_name,
                  skill_category: applicant.skill_category,
                  city: applicant.city,
                  rating: applicant.rating,
                  completed_tasks: applicant.completed_tasks,
                  response_time_minutes: applicant.response_time_minutes,
                },
              ]
            : []
        );
        return;
      }

      if (!token) {
        setView("account");
        return alert("Login first to review task applications.");
      }

      if (activeMode !== "customer") {
        return alert("Switch to Customer Mode to review applications.");
      }

      const res = await api.get(`/api/applications/task/${taskId}`, authHeader);
      setApplications(res.data);
      await loadCustomerApplications();
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to load applications. Make sure you are logged in as the customer who posted this task."
      );
      setApplications([]);
      setApplicationsError(message);
      alert(message);
    }
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      if (id < 0) {
        setApplications((current) =>
          current.map((application) =>
            application.application_id === id ? { ...application, status } : application
          )
        );
        setProviderApplications((current) =>
          current.map((application) =>
            application.application_id === id
              ? { ...application, status, task_status: status === "accepted" ? "assigned" : application.task_status }
              : application
          )
        );
        return alert(`Demo application marked ${status}.`);
      }

      if (!token) {
        setView("account");
        return alert("Login first to update an application.");
      }

      await api.patch(
        `/api/applications/${id}/status?status=${status}`,
        {},
        authHeader
      );

      alert(
        status === "accepted"
          ? "Provider accepted. The task is now assigned."
          : "Application rejected."
      );

      setApplications((current) =>
        current.map((application) =>
          application.application_id === id
            ? { ...application, status }
            : status === "accepted" && application.status === "pending"
              ? { ...application, status: "rejected" }
              : application
        )
      );
      await loadTasks();
      await loadCustomerApplications();
    } catch (err) {
      alert(JSON.stringify(err.response?.data?.detail || "Application update failed"));
    }
  };

  const completeTask = async (taskId) => {
    try {
      if (taskId < 0) {
        setTasks((current) =>
          current.map((task) =>
            task.id === taskId ? { ...task, status: "completed" } : task
          )
        );
        return alert("Demo task completed.");
      }

      if (!token) {
        setView("account");
        return alert("Login first to complete the task.");
      }

      await api.patch(`/api/tasks/${taskId}/complete`, {}, authHeader);

      alert("Task completed.");

      setSelectedTask(null);
      setMatches([]);
      setApplications([]);
      setApplicationsTask(null);

      await loadTasks();
      await loadCustomerApplications();
    } catch (err) {
      alert(JSON.stringify(err.response?.data?.detail || "Complete task failed"));
    }
  };

  const submitReview = async () => {
    try {
      if (!token) {
        setView("account");
        return alert("Login first to review a completed task.");
      }

      if (!reviewTaskId) {
        return alert("Choose a completed task to review.");
      }

      await api.post(
        "/api/reviews/",
        {
          task_id: Number(reviewTaskId),
          rating: Number(reviewRating),
          comment: reviewComment,
          status_note: "Customer confirmed the job was completed",
        },
        authHeader
      );

      alert("Review submitted. Provider rating updated.");

      setReviewTaskId("");
      setReviewRating("5");
      setReviewComment("");
      await loadTasks();
    } catch (err) {
      alert(JSON.stringify(err.response?.data?.detail || "Review failed"));
    }
  };

  const loadMessages = async (taskId = messageTaskId) => {
    try {
      if (!token) {
        setView("account");
        return alert("Login first to view task messages.");
      }

      if (!taskId) {
        return alert("Choose an assigned task first.");
      }

      const res = await api.get(`/api/messages/task/${taskId}`, authHeader);
      setTaskMessages(res.data);
      setMessageTaskId(String(taskId));
    } catch (err) {
      alert(JSON.stringify(err.response?.data?.detail || "Failed to load messages"));
    }
  };

  const sendMessage = async () => {
    try {
      if (!token) {
        setView("account");
        return alert("Login first to send task messages.");
      }

      if (!messageTaskId) {
        return alert("Choose an assigned task first.");
      }

      if (!messageBody.trim()) {
        return alert("Write a message before sending.");
      }

      await api.post(
        `/api/messages/task/${messageTaskId}`,
        { body: messageBody },
        authHeader
      );

      setMessageBody("");
      await loadMessages(messageTaskId);
    } catch (err) {
      alert(JSON.stringify(err.response?.data?.detail || "Message failed"));
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const status = t.status?.toLowerCase().trim();
    const category = t.category?.toLowerCase().trim() || "";
    const location = t.location?.toLowerCase().trim() || "";
    const search = searchCategory.toLowerCase().trim();
    const area = searchLocation.toLowerCase().trim();
    const taskBudgetValue = Number(t.budget || 0);
    const maxBudgetValue = Number(maxBudget || 0);

    return (
      status !== "completed" &&
      category.includes(search) &&
      location.includes(area) &&
      (!maxBudgetValue || (taskBudgetValue && taskBudgetValue <= maxBudgetValue))
    );
  });

  const openTasks = tasks.filter((t) => t.status === "open").length;
  const assignedTasks = tasks.filter((t) => t.status === "assigned").length;
  const completedTasks = tasks.filter((t) => t.status === "completed");
  const activeAssignedTasks = tasks.filter((t) => t.status === "assigned");
  const myAssignedTasks = tasks.filter(
    (task) => task.customer_id === currentUserId && task.status === "assigned"
  );
  const myCompletedTasks = tasks.filter(
    (task) => task.customer_id === currentUserId && task.status === "completed"
  );
  const selectedGuidance = serviceGuidance[taskCategory] || serviceGuidance.Cleaning;
  const taskBudgetValue = Number(taskBudget || 0);
  const estimatedServiceFee = Math.round(taskBudgetValue * PLATFORM_FEE_RATE);
  const estimatedCustomerTotal = taskBudgetValue + estimatedServiceFee;
  const filteredProviders = providers.filter((provider) => {
    const service = provider.skill_category?.toLowerCase().trim() || "";
    const city = provider.city?.toLowerCase().trim() || "";
    const search = searchCategory.toLowerCase().trim();
    const area = searchLocation.toLowerCase().trim();

    return service.includes(search) && city.includes(area);
  });
  const approvedProviders = providers.filter(
    (provider) => provider.approval_status === "approved"
  );
  const pendingProviders = providers.filter(
    (provider) => provider.approval_status === "pending"
  );
  const myProviderApprovalStatus = myProviderProfile?.approval_status || "not submitted";
  const acceptedProviderApplications = providerApplications.filter(
    (application) => application.status === "accepted"
  );
  const pendingProviderApplications = providerApplications.filter(
    (application) => application.status === "pending"
  );
  const rejectedProviderApplications = providerApplications.filter(
    (application) => application.status === "rejected"
  );
  const pendingCustomerApplications = customerApplications.filter(
    (application) => application.status === "pending"
  );
  const customerNotifications = [
    {
      id: "customer-applications",
      count: pendingCustomerApplications.length,
      title: "Applications waiting",
      text: pendingCustomerApplications.length
        ? "Review provider applications and accept the best fit."
        : "No provider applications waiting right now.",
      action: "Review Applications",
    },
    {
      id: "customer-assigned",
      count: myAssignedTasks.length,
      title: "Assigned tasks",
      text: myAssignedTasks.length
        ? "Coordinate with accepted providers and complete finished work."
        : "No assigned tasks waiting for completion.",
      action: "View Tasks",
    },
    {
      id: "customer-reviews",
      count: myCompletedTasks.length,
      title: "Reviews ready",
      text: myCompletedTasks.length
        ? "Submit reviews for completed jobs to improve trust."
        : "No completed tasks waiting for review.",
      action: "Review Jobs",
    },
  ];
  const providerNotifications = [
    {
      id: "provider-approval",
      count: myProviderApprovalStatus === "approved" ? 0 : 1,
      title: "Provider approval",
      text:
        myProviderApprovalStatus === "approved"
          ? "Your provider profile is approved and ready for applications."
          : `Current status: ${myProviderApprovalStatus}. Approval is required before applying.`,
      action: "Check Status",
    },
    {
      id: "provider-accepted",
      count: acceptedProviderApplications.length,
      title: "Accepted applications",
      text: acceptedProviderApplications.length
        ? "Customers accepted one or more of your applications."
        : "No accepted applications yet.",
      action: "View Activity",
    },
    {
      id: "provider-pending",
      count: pendingProviderApplications.length,
      title: "Pending applications",
      text: pendingProviderApplications.length
        ? "These applications are still waiting for customer review."
        : "No pending applications right now.",
      action: "View Activity",
    },
  ];
  const adminNotifications = [
    {
      id: "admin-verification",
      count: pendingProviders.length,
      title: "Providers waiting",
      text: pendingProviders.length
        ? "Review new provider profiles before they can apply to customer tasks."
        : "No provider profiles are waiting for approval.",
      action: "Load Queue",
    },
    {
      id: "admin-supply",
      count: approvedProviders.length,
      title: "Approved supply",
      text: approvedProviders.length
        ? "Approved providers are visible and eligible for customer tasks."
        : "No approved providers yet.",
      action: "Refresh Providers",
    },
    {
      id: "admin-open-tasks",
      count: openTasks,
      title: "Open customer requests",
      text: openTasks
        ? "These customer tasks still need provider applications."
        : "No open customer requests right now.",
      action: "Refresh Tasks",
    },
  ];
  const activeNotifications =
    activeMode === "admin"
      ? adminNotifications
      : activeMode === "customer"
        ? customerNotifications
        : providerNotifications;
  const activeNotificationCount = activeNotifications.reduce(
    (sum, notification) => sum + notification.count,
    0
  );
  const activeModeLabel =
    activeMode === "admin"
      ? "Admin Mode"
      : activeMode === "customer"
        ? "Customer Mode"
        : "Provider Mode";
  const notificationDescription =
    activeMode === "admin"
      ? "Admin alerts for provider approval, marketplace supply, and open demand."
      : activeMode === "customer"
        ? "Customer alerts for applications, assigned work, and reviews."
        : "Provider alerts for approval, applications, and accepted work.";
  const globalNotificationCount =
    activeMode === "admin"
      ? pendingProviders.length
      : activeMode === "customer"
        ? pendingCustomerApplications.length + myAssignedTasks.length + myCompletedTasks.length
        : (myProviderApprovalStatus === "approved" ? 0 : 1) +
          acceptedProviderApplications.length +
          pendingProviderApplications.length;
  const globalNotificationText =
    activeMode === "admin"
      ? pendingProviders.length
        ? `${pendingProviders.length} provider profile${pendingProviders.length === 1 ? "" : "s"} waiting approval`
        : "No provider approvals waiting"
      : activeMode === "customer"
        ? globalNotificationCount
          ? `${globalNotificationCount} customer action${globalNotificationCount === 1 ? "" : "s"} waiting`
          : "No customer actions waiting"
        : globalNotificationCount
          ? `${globalNotificationCount} provider update${globalNotificationCount === 1 ? "" : "s"} waiting`
          : "No provider updates waiting";
  const runNotificationAction = (notificationId) => {
    if (notificationId === "admin-verification") {
      loadVerificationQueue();
      return;
    }

    if (notificationId === "admin-supply") {
      loadProviders();
      return;
    }

    if (notificationId === "admin-open-tasks") {
      loadTasks();
      return;
    }

    if (activeMode === "customer") {
      loadCustomerApplications();
      return;
    }

    refreshNotifications();
  };
  const getProviderApplicationNotice = (status) => {
    if (status === "accepted") {
      return "Customer accepted your application. The task is assigned to you.";
    }

    if (status === "rejected") {
      return "Customer did not select this application.";
    }

    return "Waiting for the customer to review your application.";
  };
  const marketplaceCompletionRate = tasks.length
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;
  const averageProviderRating = providers.length
    ? (
        providers.reduce((sum, provider) => sum + Number(provider.rating || 0), 0) /
        providers.length
      ).toFixed(1)
    : "0.0";
  const topDemandCategory = serviceCategories
    .map((service) => ({
      service,
      count: tasks.filter((task) => task.category === service).length,
    }))
    .sort((a, b) => b.count - a.count)[0];
  const completedTaskVolume = completedTasks.reduce(
    (sum, task) => sum + Number(task.budget || 0),
    0
  );
  const estimatedMarketplaceRevenue = Math.round(
    completedTaskVolume * PLATFORM_FEE_RATE
  );
  const categoryInsights = serviceCategories.map((service) => {
    const demand = tasks.filter((task) => task.category === service).length;
    const supply = providers.filter(
      (provider) => provider.skill_category === service
    ).length;
    const gap = demand - supply;

    return {
      service,
      demand,
      supply,
      status:
        gap > 0
          ? "Need providers"
          : supply > demand
            ? "Need demand"
            : demand === 0 && supply === 0
              ? "No activity"
              : "Balanced",
    };
  });

  return (
    <div className="page">
      <Hero
        token={token}
        currentUser={currentUser}
        logout={logout}
        setView={setView}
        activeMode={activeMode}
        setActiveMode={changeActiveMode}
        currentUserRole={currentUserRole}
        notificationCount={globalNotificationCount}
        notificationText={globalNotificationText}
        notificationUpdatedAt={marketplaceSyncedAt}
        setSearchCategory={setSearchCategory}
      />

      {token && (
        <section className="mode-panel">
          <div>
            <span className="mode-label">Active mode</span>
            <strong>{activeModeLabel}</strong>
            {isAdmin && <p className="admin-note">Admin tools enabled</p>}
          </div>

          <div className="mode-toggle" aria-label="Choose active marketplace mode">
            <button
              className={activeMode === "customer" ? "active" : ""}
              onClick={() => changeActiveMode("customer")}
            >
              Customer
            </button>
            <button
              className={activeMode === "provider" ? "active" : ""}
              onClick={() => changeActiveMode("provider")}
            >
              Provider
            </button>
            {isAdmin && (
              <button
                className={activeMode === "admin" ? "active" : ""}
                onClick={() => changeActiveMode("admin")}
              >
                Admin
              </button>
            )}
          </div>
        </section>
      )}

      {view !== "home" && (
        <button className="back-btn" onClick={() => setView("home")}>
          Back Home
        </button>
      )}

      {view === "home" && (
        <>
          <section className="problem-panel">
            <div>
              <p className="eyebrow">How it works</p>
              <h2>Post the task, choose a provider, and track the work.</h2>
              <p>
                AddisTask gives customers a clearer way to request help, compare
                interested providers, and keep each job moving from open to completed.
              </p>
            </div>

            <div className="metric-grid">
              <div>
                <strong>1</strong>
                <span>Describe the task</span>
              </div>
              <div>
                <strong>2</strong>
                <span>Review applications</span>
              </div>
              <div>
                <strong>3</strong>
                <span>Complete and review</span>
              </div>
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="section-header">
              <div>
                <h2>Marketplace at a Glance</h2>
                <p className="muted">
                  Live activity from the current AddisTask marketplace.
                </p>
              </div>

              <div className="toolbar-actions">
                <button onClick={refreshMarketplace}>Refresh Snapshot</button>
              </div>
            </div>

            <div className="dashboard-grid">
              <div>
                <span>Open requests</span>
                <strong>{openTasks}</strong>
              </div>
              <div>
                <span>Total providers</span>
                <strong>{providers.length}</strong>
              </div>
              <div>
                <span>Completed jobs</span>
                <strong>{completedTasks.length}</strong>
              </div>
              <div>
                <span>Completion rate</span>
                <strong>{marketplaceCompletionRate}%</strong>
              </div>
              <div>
                <span>Avg. provider rating</span>
                <strong>{averageProviderRating}</strong>
              </div>
              <div>
                <span>Top demand</span>
                <strong>{topDemandCategory?.count ? topDemandCategory.service : "None yet"}</strong>
              </div>
            </div>
          </section>

          <section className="landing">
            <div className="section-title">
              <h2>Choose Your Next Step</h2>
              <p>Start as a customer, provider, or marketplace operator.</p>
            </div>

            <div className="choice-grid">
              <button
                className="choice-card"
                onClick={() => {
                  changeActiveMode("customer");
                  setView("customer");
                }}
              >
                <span className="choice-icon">01</span>
                <strong>Post a task</strong>
                <small>Describe the job, area, budget, and urgency.</small>
              </button>

              <button
                className="choice-card"
                onClick={() => {
                  changeActiveMode("provider");
                  setView("provider");
                }}
              >
                <span className="choice-icon">02</span>
                <strong>Offer services</strong>
                <small>Create a provider profile and apply to matching work.</small>
              </button>

              <button
                className="choice-card"
                onClick={() => {
                  setSearchCategory("");
                  setView("marketplace");
                }}
              >
                <span className="choice-icon">03</span>
                <strong>Browse jobs</strong>
                <small>Review tasks, match providers, and manage applications.</small>
              </button>

              {isAdmin && (
                <button
                  className="choice-card admin-choice"
                  onClick={() => {
                    setSearchCategory("");
                    changeActiveMode("admin");
                    setView("marketplace");
                  }}
                >
                  <span className="choice-icon">04</span>
                  <strong>Admin dashboard</strong>
                  <small>Approve providers and monitor marketplace supply.</small>
                </button>
              )}
            </div>
          </section>

          <section className="categories">
            <div className="section-title">
              <h2>Popular AddisTask services</h2>
              <p>Pick a service to see active marketplace demand.</p>
            </div>

            <img
              className="service-mosaic"
              src={serviceMosaic}
              alt="Local providers helping with cleaning, repairs, moving, and delivery"
            />

            <div className="category-grid">
              {serviceCategories.map((service) => (
                <button
                  key={service}
                  className="service-card"
                  onClick={() => {
                    setTaskCategory(service);
                    setProviderCategory(service);
                    setSearchCategory(service);
                    setView("marketplace");
                  }}
                >
                  {service}
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {view === "account" && (
        <section className="card narrow">
          <div className="form-heading">
            <span className="eyebrow">Secure access</span>
            <h2>Account</h2>
            <p className="muted">Sign in to post tasks, offer services, or manage approvals.</p>
          </div>

          <label className="field-label">
            Full name
            <input
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>

          <label className="field-label">
            Phone number
            <input
              placeholder="09..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>

          <label className="field-label">
            Password
            <input
              placeholder="At least 6 characters"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {!token ? (
            <div className="button-row">
              <button onClick={login}>Login</button>
              <button className="secondary-btn inline" onClick={register}>
                Register
              </button>
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
          <div className="form-heading">
            <span className="eyebrow">Customer request</span>
            <h2>Post a Task</h2>
            <p className="muted">Give providers enough detail to understand the work and respond confidently.</p>
          </div>

          <label className="field-label">
            Task title
            <input
              placeholder="e.g. Deep clean a two-bedroom apartment"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </label>

          <label className="field-label">
            Description
            <textarea
              placeholder="Describe the work, access details, tools needed, or timing."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </label>

          <div className="form-grid">
            <label className="field-label">
              Service
              <select
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value)}
              >
                {serviceCategories.map((service) => (
                  <option key={service}>{service}</option>
                ))}
              </select>
            </label>

            <label className="field-label">
              Area
              <select
                value={taskLocation}
                onChange={(e) => setTaskLocation(e.target.value)}
              >
                {addisAreas.map((area) => (
                  <option key={area}>{area}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="guidance-panel">
            <div>
              <span className="guidance-label">Suggested budget</span>
              <strong>{selectedGuidance.budget}</strong>
            </div>

            <div>
              <span className="guidance-label">Example title</span>
              <button
                className="text-action"
                onClick={() => setTaskTitle(selectedGuidance.title)}
              >
                Use example
              </button>
            </div>

            <div className="guidance-list">
              {selectedGuidance.checklist.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="form-grid">
            <label className="field-label">
              Budget in birr
              <input
                placeholder="e.g. 1800"
                type="number"
                min="0"
                value={taskBudget}
                onChange={(e) => setTaskBudget(e.target.value)}
              />
            </label>

            <label className="field-label">
              Urgency
              <select
                value={taskUrgency}
                onChange={(e) => setTaskUrgency(e.target.value)}
              >
                <option>Flexible</option>
                <option>This week</option>
                <option>Tomorrow</option>
                <option>Today</option>
              </select>
            </label>
          </div>

          <div className="fee-estimate">
            <div>
              <span>Provider budget</span>
              <strong>{taskBudgetValue || 0} birr</strong>
            </div>
            <div>
              <span>Estimated service fee</span>
              <strong>{estimatedServiceFee} birr</strong>
            </div>
            <div>
              <span>Estimated customer total</span>
              <strong>{estimatedCustomerTotal || 0} birr</strong>
            </div>
          </div>

          <div className="form-grid">
            <label className="field-label">
              Preferred date
              <input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
              />
            </label>

            <label className="field-label">
              Time window
              <select
                value={taskTimeWindow}
                onChange={(e) => setTaskTimeWindow(e.target.value)}
              >
                <option>Any time</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
                <option>Weekend</option>
              </select>
            </label>
          </div>

          <label className="field-label">
            Access notes
            <textarea
              className="compact-textarea"
              placeholder="e.g. call before arrival, bring ladder, parking instructions."
              value={taskAccessNotes}
              onChange={(e) => setTaskAccessNotes(e.target.value)}
            />
          </label>

          <div className="form-actions">
            <button onClick={createTask}>Post Task</button>

            <button
              className="secondary-btn inline"
              onClick={() => {
                setSearchCategory("");
                setView("marketplace");
              }}
            >
              View Marketplace
            </button>
          </div>
        </section>
      )}

      {view === "provider" && (
        <section className="card narrow">
          <div className="form-heading">
            <span className="eyebrow">Provider onboarding</span>
            <h2>Become a Provider</h2>
            <p className="muted">Create a profile customers can trust before booking.</p>
          </div>

          <label className="field-label">
            Business or provider name
            <input
              placeholder="e.g. Bole Bright Cleaning"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
            />
          </label>

          <div className="form-grid">
            <label className="field-label">
              Primary service
              <select
                value={providerCategory}
                onChange={(e) => setProviderCategory(e.target.value)}
              >
                {serviceCategories.map((service) => (
                  <option key={service}>{service}</option>
                ))}
              </select>
            </label>

            <label className="field-label">
              Main service area
              <select
                value={providerCity}
                onChange={(e) => setProviderCity(e.target.value)}
              >
                {addisAreas.map((area) => (
                  <option key={area}>{area}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="provider-note">
            <strong>Approval required</strong>
            <p>After submitting, an admin must approve the provider profile before it can apply to customer tasks.</p>
          </div>

          <div className="form-actions">
            <button onClick={createProvider}>Create Provider Profile</button>

            <button
              className="secondary-btn inline"
              onClick={() => {
                setSearchCategory("");
                setView("marketplace");
              }}
            >
              Browse Tasks
            </button>
          </div>
        </section>
      )}

      {view === "marketplace" && (
        <>
          <section className="dashboard-panel">
            <div className="section-header">
              <div>
                <h2>Marketplace Operations</h2>
                <p className="muted">
                  Live operating view for tasks, providers, completion, and demand.
                </p>
              </div>

              <div className="toolbar-actions">
                <button onClick={refreshMarketplace}>Refresh All</button>
                <button className="secondary-btn inline" onClick={loadDemoData}>
                  Load Demo Data
                </button>
                <button className="secondary-btn inline" onClick={clearDemoData}>
                  Clear Demo
                </button>
              </div>
            </div>

            <div className="dashboard-grid">
              <div>
                <span>Open requests</span>
                <strong>{openTasks}</strong>
              </div>
              <div>
                <span>Assigned jobs</span>
                <strong>{assignedTasks}</strong>
              </div>
              <div>
                <span>Completed jobs</span>
                <strong>{completedTasks.length}</strong>
              </div>
              <div>
                <span>Provider supply</span>
                <strong>{approvedProviders.length}/{providers.length}</strong>
              </div>
              <div>
                <span>Pending verification</span>
                <strong>{pendingProviders.length}</strong>
              </div>
              <div>
                <span>Avg. rating</span>
                <strong>{averageProviderRating}</strong>
              </div>
              <div>
                <span>Est. platform revenue</span>
                <strong>{estimatedMarketplaceRevenue} birr</strong>
              </div>
            </div>

            <div className="notification-center">
              <div>
                <span className="notification-label">Notification Center</span>
                <strong>{activeNotificationCount} item{activeNotificationCount === 1 ? "" : "s"} need attention</strong>
                <p>{notificationDescription}</p>
              </div>

              <div className="notification-actions">
                <button onClick={refreshNotifications}>Refresh Alerts</button>
                {marketplaceSyncedAt && (
                  <span className="sync-note">Updated {marketplaceSyncedAt}</span>
                )}
                <span className="notification-badge">{activeNotificationCount}</span>
              </div>
            </div>

            <div className="notification-grid">
              {activeNotifications.map((notification) => (
                <div className="notification-card" key={notification.id}>
                  <span className={notification.count ? "notification-count active" : "notification-count"}>
                    {notification.count}
                  </span>
                  <div>
                    <strong>{notification.title}</strong>
                    <p>{notification.text}</p>
                  </div>
                  <button
                    className="secondary-btn inline"
                    onClick={() => runNotificationAction(notification.id)}
                  >
                    {notification.action}
                  </button>
                </div>
              ))}
            </div>

            <div className="category-insights">
              {categoryInsights.map((item) => (
                <div className="insight-row" key={item.service}>
                  <strong>{item.service}</strong>
                  <span>Demand: {item.demand}</span>
                  <span>Supply: {item.supply}</span>
                  <em>{item.status}</em>
                </div>
              ))}
            </div>
          </section>

          {activeMode === "admin" && isAdmin && (
          <section className="card wide admin-queue-card">
            <div className="section-header">
              <div>
                <h2>Provider Approval Queue</h2>
                <p className="muted">
                  Review provider profiles before they can apply for customer tasks.
                </p>
              </div>

              <div className="toolbar-actions">
                <button onClick={loadVerificationQueue}>Load Queue</button>
                <button className="secondary-btn inline" onClick={loadProviders}>
                  Refresh Providers
                </button>
              </div>
            </div>

            <div className="activity-summary">
              <div>
                <span>Waiting approval</span>
                <strong>{pendingProviders.length}</strong>
              </div>
              <div>
                <span>Approved</span>
                <strong>{approvedProviders.length}</strong>
              </div>
              <div>
                <span>Total providers</span>
                <strong>{providers.length}</strong>
              </div>
              <div>
                <span>Open tasks</span>
                <strong>{openTasks}</strong>
              </div>
            </div>

            <div className="list">
              {verificationQueue.length === 0 && (
                <div className="empty-state">
                  Click Load Queue to review provider profiles waiting for approval.
                </div>
              )}

              {verificationQueue.map((provider) => (
                <div className="row admin-review-row" key={provider.id}>
                  <div>
                    <strong>{provider.business_name}</strong>
                    <p>{provider.skill_category} | {provider.city}</p>
                    <div className="trust-list compact">
                      <span>Rating: {provider.rating || 4.5}</span>
                      <span>Completed: {provider.completed_tasks || 0}</span>
                      <span>Status: {provider.approval_status}</span>
                    </div>
                  </div>

                  <div className="actions">
                    <button onClick={() => updateProviderApproval(provider.id, "approved")}>
                      Approve
                    </button>
                    <button
                      className="secondary-btn inline"
                      onClick={() => updateProviderApproval(provider.id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
          )}

          <Marketplace
            loadTasks={loadTasks}
            searchCategory={searchCategory}
            setSearchCategory={setSearchCategory}
            searchLocation={searchLocation}
            setSearchLocation={setSearchLocation}
            maxBudget={maxBudget}
            setMaxBudget={setMaxBudget}
            addisAreas={addisAreas}
            filteredTasks={filteredTasks}
            loadMatches={loadMatches}
            applyToTask={applyToTask}
            loadApplications={loadApplications}
            completeTask={completeTask}
            activeMode={activeMode}
            currentUserId={currentUserId}
            providerApprovalStatus={myProviderApprovalStatus}
          />

          <MatchedProviders selectedTask={selectedTask} matches={matches} />

          {activeMode === "customer" && (
          <section className="card wide customer-review-card">
            <div className="section-header">
              <div>
                <h2>Customer Application Review</h2>
                <p className="muted">
                  After a provider applies, the customer who posted the task can
                  accept or reject the application here.
                </p>
              </div>
            </div>

            {applicationsTask && (
              <div className="review-context">
                <span>Reviewing task</span>
                <strong>{applicationsTask.title}</strong>
                <p>
                  {applications.length
                    ? `${applications.length} provider application${
                        applications.length === 1 ? "" : "s"
                      } loaded`
                    : "No provider applications loaded yet"}
                </p>
              </div>
            )}

            {applicationsError && (
              <div className="empty-state attention-state">
                {applicationsError}
              </div>
            )}

            <div className="list">
              {applications.length === 0 && !applicationsError && (
                <div className="empty-state">
                  Click Applications on a task while logged in as the customer who
                  posted it. If a provider already applied, the request will appear
                  here with Accept and Reject buttons.
                </div>
              )}

              {applications.map((a) => (
                <div className="row" key={a.application_id}>
                  <div>
                    <strong>{a.business_name}</strong>
                    <p>
                      {a.skill_category} | {a.city} | Status: {a.status}
                    </p>
                    <div className="trust-list compact">
                      <span>Rating: {a.rating || 4.5}</span>
                      <span>Completed: {a.completed_tasks || 0}</span>
                      <span>Response: {a.response_time_minutes || 30} min</span>
                    </div>
                  </div>

                  <div className="actions">
                    {a.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateApplicationStatus(a.application_id, "accepted")
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="secondary-btn inline"
                          onClick={() =>
                            updateApplicationStatus(a.application_id, "rejected")
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {a.status !== "pending" && (
                      <span className={`status-pill ${a.status}`}>{a.status}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
          )}

          {activeMode === "provider" && (
          <section className="card wide">
            <div className="section-header">
              <div>
                <h2>Provider Verification</h2>
                <p className="muted">
                  Providers must be approved before they can apply to customer tasks.
                </p>
              </div>

              <button onClick={loadMyProviderProfile}>Check My Status</button>
            </div>

            <div className="activity-summary">
              <div>
                <span>My profile</span>
                <strong>{myProviderProfile ? myProviderProfile.business_name : "Not loaded"}</strong>
              </div>
              <div>
                <span>Approval status</span>
                <strong>{myProviderApprovalStatus}</strong>
              </div>
              <div>
                <span>Approved supply</span>
                <strong>{approvedProviders.length}</strong>
              </div>
              <div>
                <span>Pending review</span>
                <strong>{pendingProviders.length}</strong>
              </div>
            </div>

            {myProviderProfile?.approval_status === "pending" && (
              <div className="empty-state attention-state">
                Your provider profile is waiting for platform approval. After approval,
                the Apply button will be available for open tasks.
              </div>
            )}
          </section>
          )}

          {activeMode === "provider" && (
          <section className="card wide">
            <div className="section-header">
              <div>
                <h2>Provider Directory</h2>
                <p className="muted">
                  Browse trusted local providers by service, rating, completed jobs,
                  and response time.
                </p>
              </div>

              <button onClick={loadProviders}>Load Providers</button>
            </div>

            <div className="provider-grid">
              {filteredProviders.length === 0 && (
                <div className="empty-state">
                  Load providers or choose another service category.
                </div>
              )}

              {filteredProviders.map((provider) => (
                <div className="provider-card" key={provider.id}>
                  <div>
                    <strong>{provider.business_name}</strong>
                    <p>{provider.skill_category} | {provider.city}</p>
                  </div>

                  <div className="trust-list compact">
                    <span>Rating: {provider.rating || 4.5}</span>
                    <span>Completed: {provider.completed_tasks || 0}</span>
                    <span>Response: {provider.response_time_minutes || 30} min</span>
                  </div>

                  <span className={`verification-pill ${provider.approval_status || "pending"}`}>
                    {provider.approval_status || "pending"}
                  </span>

                  <button
                    className="secondary-btn inline"
                    onClick={() => saveProvider(provider)}
                  >
                    Save Provider
                  </button>
                </div>
              ))}
            </div>
          </section>
          )}

          {(activeMode === "customer" || activeMode === "provider") && (
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
              {savedProviders.length === 0 && (
                <div className="empty-state">
                  Save providers from the directory to compare them here.
                </div>
              )}

              {savedProviders.map((provider) => (
                <div className="provider-card saved-provider" key={provider.id}>
                  <div>
                    <strong>{provider.business_name}</strong>
                    <p>{provider.skill_category} | {provider.city}</p>
                  </div>

                  <div className="trust-list compact">
                    <span>Rating: {provider.rating || 4.5}</span>
                    <span>Completed: {provider.completed_tasks || 0}</span>
                    <span>Response: {provider.response_time_minutes || 30} min</span>
                    <span>Status: {provider.approval_status || "pending"}</span>
                  </div>

                  <button
                    className="secondary-btn inline"
                    onClick={() => removeSavedProvider(provider.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>
          )}

          {activeMode === "provider" && (
          <section className="card wide">
            <div className="section-header">
              <div>
                <h2>Provider Activity</h2>
                <p className="muted">
                  Providers can check whether their task applications are pending,
                  accepted, or rejected.
                </p>
              </div>

              <button onClick={loadProviderApplications}>Load My Activity</button>
            </div>

            <div className="activity-summary">
              <div>
                <span>Accepted</span>
                <strong>{acceptedProviderApplications.length}</strong>
              </div>
              <div>
                <span>Pending</span>
                <strong>{pendingProviderApplications.length}</strong>
              </div>
              <div>
                <span>Rejected</span>
                <strong>{rejectedProviderApplications.length}</strong>
              </div>
              <div>
                <span>Last checked</span>
                <strong>{providerActivityLoadedAt || "Not yet"}</strong>
              </div>
            </div>

            <div className="list">
              {providerApplications.length === 0 && (
                <div className="empty-state">
                  Apply to a task, then load provider activity to see status updates.
                </div>
              )}

              {providerApplications.map((application) => (
                <div className="row" key={application.application_id}>
                  <div>
                    <strong>{application.task_title || "Task application"}</strong>
                    <p>
                      {application.task_category || "Service"} |{" "}
                      {application.task_location || "Addis Ababa"} |{" "}
                      {application.task_budget || 0} birr
                    </p>
                    <div className="trust-list compact">
                      <span>Task: {application.task_status || "open"}</span>
                      <span>Application ID: {application.application_id}</span>
                    </div>
                    <p className="application-notice">
                      {getProviderApplicationNotice(application.status)}
                    </p>
                  </div>

                  <span className={`status-pill ${application.status}`}>
                    {application.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
          )}

          {(activeMode === "customer" || activeMode === "provider") && (
          <section className="card wide">
            <div className="section-header">
              <div>
                <h2>Messages</h2>
                <p className="muted">
                  Once a provider is accepted, the customer and provider can coordinate
                  timing, access, and job details.
                </p>
              </div>
            </div>

            {activeAssignedTasks.length === 0 ? (
              <div className="empty-state">
                Assigned tasks will appear here after a customer accepts a provider.
              </div>
            ) : (
              <div className="message-panel">
                <div className="message-controls">
                  <select
                    value={messageTaskId}
                    onChange={(e) => {
                      setMessageTaskId(e.target.value);
                      setTaskMessages([]);
                    }}
                  >
                    <option value="">Select assigned task</option>
                    {activeAssignedTasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.title}
                      </option>
                    ))}
                  </select>

                  <button onClick={() => loadMessages()}>Load Messages</button>
                </div>

                <div className="message-list">
                  {taskMessages.length === 0 && (
                    <div className="empty-state">
                      No messages loaded for this task yet.
                    </div>
                  )}

                  {taskMessages.map((message) => (
                    <div className="message-bubble" key={message.id}>
                      <span>
                        Sender #{message.sender_id} to #{message.recipient_id}
                      </span>
                      <p>{message.body}</p>
                    </div>
                  ))}
                </div>

                <textarea
                  placeholder="Write timing, access, materials, or arrival details."
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                />

                <button onClick={sendMessage}>Send Message</button>
              </div>
            )}
          </section>
          )}

          {activeMode === "customer" && (
          <section className="card wide">
            <div className="section-header">
              <div>
                <h2>Reviews</h2>
                <p className="muted">
                  After completion, customers can rate the provider and strengthen
                  the trust score used in future matching.
                </p>
              </div>
            </div>

            {completedTasks.length === 0 ? (
              <div className="empty-state">
                Completed tasks will appear here for customer review.
              </div>
            ) : (
              <div className="review-grid">
                <select
                  value={reviewTaskId}
                  onChange={(e) => setReviewTaskId(e.target.value)}
                >
                  <option value="">Select completed task</option>
                  {completedTasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
                </select>

                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Fair</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Not acceptable</option>
                </select>

                <textarea
                  placeholder="What should future customers know about this provider?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />

                <button onClick={submitReview}>Submit Review</button>
              </div>
            )}
          </section>
          )}
        </>
      )}
    </div>
  );
}
