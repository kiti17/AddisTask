import { useEffect, useState } from "react";
import "./App.css";
import { api } from "./services/api";
import Hero from "./components/Hero";
import Marketplace from "./components/Marketplace";
import MatchedProviders from "./components/MatchedProviders";
import serviceCleaning from "./assets/service-cleaning.jpg";
import servicePlumbing from "./assets/service-plumbing.jpg";
import serviceElectrical from "./assets/service-electrical.jpg";
import serviceMoving from "./assets/service-moving.jpg";
import serviceDelivery from "./assets/service-delivery.jpg";
import serviceHomeRepair from "./assets/service-home-repair.jpg";

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

const featuredServiceCards = [
  {
    name: "Cleaning",
    image: serviceCleaning,
    description: "Apartment cleaning, move-out cleaning, and regular home care.",
  },
  {
    name: "Plumbing",
    image: servicePlumbing,
    description: "Leaks, sinks, bathroom fixtures, and small pipe repairs.",
  },
  {
    name: "Electrical",
    image: serviceElectrical,
    description: "Lighting, outlets, switches, and basic electrical fixes.",
  },
  {
    name: "Moving",
    image: serviceMoving,
    description: "Furniture moving, loading, unloading, and local moves.",
  },
  {
    name: "Delivery",
    image: serviceDelivery,
    description: "Local package, document, and errand delivery across the city.",
  },
  {
    name: "Home Repair",
    image: serviceHomeRepair,
    description: "Cabinets, doors, mounting, and everyday home fixes.",
  },
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
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [homeFocus, setHomeFocus] = useState("customer");

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
  const [providerBio, setProviderBio] = useState("");
  const [providerExperienceYears, setProviderExperienceYears] = useState("");
  const [providerServiceArea, setProviderServiceArea] = useState("");
  const [providerAvailability, setProviderAvailability] = useState("");
  const [providerContactPhone, setProviderContactPhone] = useState("");

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
  const [selectedProviderProfile, setSelectedProviderProfile] = useState(null);
  const [selectedProviderReviews, setSelectedProviderReviews] = useState([]);
  const [verificationQueue, setVerificationQueue] = useState([]);
  const [providerApprovalNotes, setProviderApprovalNotes] = useState({});
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
    if (!err.response) {
      return "Cannot reach the backend server. Make sure the backend is running on http://127.0.0.1:8000.";
    }

    const detail = err.response?.data?.detail;
    const friendlyMessages = {
      "Only the task owner can complete this task":
        "Only the customer who posted this task can mark it completed.",
      "Only assigned tasks can be completed":
        "This task must be assigned to a provider before it can be completed.",
      "Only the task owner can update payment status":
        "Only the customer who posted this task can update payment status.",
      "Payment status must be unpaid, cash_agreed, paid, or disputed":
        "Choose a valid payment status: unpaid, cash agreed, paid, or disputed.",
      "Only the task owner can update application status":
        "Only the customer who posted this task can accept or reject applications.",
      "Only the task owner can view applications for this task":
        "Only the customer who posted this task can view provider applications.",
      "Only open tasks can accept a provider":
        "This task is no longer open, so another provider cannot be accepted.",
      "Providers can only apply to open tasks":
        "This task is no longer open for new provider applications.",
      "Provider skill does not match this task category":
        "Your provider profile service does not match this task category.",
      "You already applied to this task":
        "You already applied to this task.",
      "You cannot apply to your own task":
        "You cannot apply to your own task. Switch to Customer Mode to review applications.",
      "Your provider profile must be approved before you can apply to tasks":
        "Your provider profile must be approved before you can apply to tasks.",
      "You must create a provider profile before applying to tasks":
        "Create a provider profile before applying to tasks.",
      "Create a provider profile before viewing applications":
        "Create a provider profile before viewing provider activity.",
      "Messages are available after a provider is accepted":
        "Messages become available after the customer accepts a provider.",
      "Only the task customer and accepted provider can use messages":
        "Only the task customer and accepted provider can use messages for this task.",
      "Only completed tasks can be reviewed":
        "You can review a provider only after the task is completed.",
      "Only the task owner can review this provider":
        "Only the customer who posted this task can review the provider.",
      "This task already has a review":
        "This task already has a review.",
      "No accepted provider found for this task":
        "Accept a provider before leaving a review.",
      "Provider profile already exists for this user":
        "You already have a provider profile. Use Update Provider Profile instead.",
      "Invalid credentials":
        "The phone number or password is incorrect.",
      "Phone already registered":
        "This phone number is already registered. Please log in instead.",
    };

    if (Array.isArray(detail)) {
      return detail.map((item) => item.msg).join("\n");
    }

    return friendlyMessages[detail] || detail || fallback;
  };

  const applyLoginSession = (data) => {
    sessionStorage.setItem("token", data.access_token);
    sessionStorage.setItem("currentUser", data.full_name || data.phone);
    sessionStorage.setItem("currentUserId", String(data.user_id || 0));
    const nextRole = data.role || "customer";
    const nextMode = nextRole === "admin" ? "admin" : "customer";

    sessionStorage.setItem("currentUserRole", nextRole);
    sessionStorage.setItem("activeMode", nextMode);

    setToken(data.access_token);
    setCurrentUser(data.full_name || data.phone);
    setCurrentUserId(Number(data.user_id || 0));
    setCurrentUserRole(nextRole);
    setActiveMode(nextMode);

    setFullName("");
    setPhone("");
    setPassword("");
    setIsAccountModalOpen(false);
    setView(nextMode === "admin" ? "marketplace" : "home");
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
      const cleanPhone = phone.trim();

      await api.post("/api/auth/register", {
        full_name: fullName.trim(),
        phone: cleanPhone,
        password,
      });

      const loginResponse = await api.post("/api/auth/login", {
        phone: cleanPhone,
        password,
      });

      applyLoginSession(loginResponse.data);
      alert("Registration successful. You are logged in.");
    } catch (err) {
      alert(getErrorMessage(err, "Registration failed"));
    }
  };

  const login = async () => {
    try {
      if (!phone.trim()) return alert("Enter your phone number.");
      if (password.length < 6) return alert("Password must be at least 6 characters.");
      const cleanPhone = phone.trim();

      const res = await api.post("/api/auth/login", {
        phone: cleanPhone,
        password,
      });

      applyLoginSession(res.data);
      alert("Logged in successfully");
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
      alert(getErrorMessage(err, "Failed to load tasks"));
    }
  };

  const loadProviders = async () => {
    try {
      const res = await api.get("/api/providers/");
      setProviders(res.data);
    } catch (err) {
      alert(getErrorMessage(err, "Failed to load providers"));
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

      const adminNotes = providerApprovalNotes[providerId]?.trim() || "";

      if (status === "rejected" && !adminNotes) {
        return alert("Add a short reason before rejecting this provider.");
      }

      await api.patch(
        `/api/providers/${providerId}/approval`,
        {
          status,
          admin_notes: adminNotes || null,
        },
        authHeader
      );

      setProviderApprovalNotes((current) => {
        const next = { ...current };
        delete next[providerId];
        return next;
      });
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

  const openProviderProfile = async (provider) => {
    const providerId = provider.id || provider.provider_id;
    const fullProvider = providers.find((item) => item.id === providerId);

    setSelectedProviderProfile({
      ...(fullProvider || {}),
      ...provider,
      id: providerId,
    });

    if (!providerId || providerId < 0) {
      setSelectedProviderReviews([]);
      return;
    }

    try {
      const res = await api.get(`/api/reviews/provider/${providerId}`);
      setSelectedProviderReviews(res.data);
    } catch {
      setSelectedProviderReviews([]);
    }
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
      setSearchCategory(taskCategory);
      setSearchLocation(taskLocation);

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
      alert(getErrorMessage(err, "Task creation failed"));
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

      const providerPayload = {
        business_name: providerName,
        skill_category: providerCategory,
        city: providerCity,
        bio: providerBio || null,
        experience_years: providerExperienceYears ? Number(providerExperienceYears) : 0,
        service_area: providerServiceArea || providerCity,
        availability: providerAvailability || null,
        contact_phone: providerContactPhone || phone || null,
      };

      if (myProviderProfile) {
        await api.patch("/api/providers/me", providerPayload, authHeader);
      } else {
        await api.post("/api/providers/", providerPayload, authHeader);
      }

      alert("Provider profile submitted for approval. Apply after the profile is approved.");

      setProviderName("");
      setProviderBio("");
      setProviderExperienceYears("");
      setProviderServiceArea("");
      setProviderAvailability("");
      setProviderContactPhone("");

      await loadTasks();
      await loadProviders();
      await loadMyProviderProfile();
      setView("marketplace");
    } catch (err) {
      alert(getErrorMessage(err, "Provider creation failed"));
    }
  };

  const loadProviderProfileIntoForm = async () => {
    try {
      let profile = myProviderProfile;

      if (!profile) {
        const res = await api.get("/api/providers/me", authHeader);
        profile = res.data;
        setMyProviderProfile(profile);
      }

      setProviderName(profile.business_name || "");
      setProviderCategory(profile.skill_category || serviceCategories[0]);
      setProviderCity(profile.city || addisAreas[0]);
      setProviderBio(profile.bio || "");
      setProviderExperienceYears(String(profile.experience_years || 0));
      setProviderServiceArea(profile.service_area || "");
      setProviderAvailability(profile.availability || "");
      setProviderContactPhone(profile.contact_phone || "");
      setView("provider");
    } catch (err) {
      alert(getErrorMessage(err, "Failed to load provider profile"));
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
      alert(getErrorMessage(err, "Failed to load matches"));
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
      alert(getErrorMessage(err, "Apply failed"));
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
      alert(getErrorMessage(err, "Application update failed"));
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
      alert(getErrorMessage(err, "Complete task failed"));
    }
  };

  const updateTaskPaymentStatus = async (taskId, paymentStatus) => {
    try {
      if (taskId < 0) {
        setTasks((current) =>
          current.map((task) =>
            task.id === taskId ? { ...task, payment_status: paymentStatus } : task
          )
        );
        return alert("Demo payment status updated.");
      }

      if (!token) {
        setView("account");
        return alert("Login first to update payment status.");
      }

      await api.patch(
        `/api/tasks/${taskId}/payment-status`,
        { payment_status: paymentStatus },
        authHeader
      );

      await loadTasks();
    } catch (err) {
      alert(getErrorMessage(err, "Payment status update failed"));
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
      alert(getErrorMessage(err, "Review failed"));
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
      alert(getErrorMessage(err, "Failed to load messages"));
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
      alert(getErrorMessage(err, "Message failed"));
    }
  };

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
  const myPostedTasks = tasks.filter((task) => task.customer_id === currentUserId);
  const myOpenTasks = myPostedTasks.filter((task) => task.status === "open");
  const customerPaymentSummary = myPostedTasks.reduce(
    (summary, task) => {
      const status = task.payment_status || "unpaid";
      return {
        ...summary,
        [status]: (summary[status] || 0) + 1,
      };
    },
    { unpaid: 0, cash_agreed: 0, paid: 0, disputed: 0 }
  );
  const selectedGuidance = serviceGuidance[taskCategory] || serviceGuidance.Cleaning;
  const taskBudgetValue = Number(taskBudget || 0);
  const estimatedServiceFee = Math.round(taskBudgetValue * PLATFORM_FEE_RATE);
  const estimatedCustomerTotal = taskBudgetValue + estimatedServiceFee;
  const filteredProviders = providers.filter((provider) => {
    const service = provider.skill_category?.toLowerCase().trim() || "";
    const businessName = provider.business_name?.toLowerCase().trim() || "";
    const bio = provider.bio?.toLowerCase().trim() || "";
    const serviceArea = provider.service_area?.toLowerCase().trim() || "";
    const city = provider.city?.toLowerCase().trim() || "";
    const search = searchCategory.toLowerCase().trim();
    const area = searchLocation.toLowerCase().trim();
    const matchesSearch = [service, businessName, bio, serviceArea].some((value) =>
      value.includes(search)
    );

    return matchesSearch && city.includes(area);
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
  const acceptedProviderTaskIds = new Set(
    acceptedProviderApplications.map((application) => Number(application.task_id))
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
  const messageEligibleTasks = activeAssignedTasks.filter((task) => {
    if (activeMode === "customer") {
      return task.customer_id === currentUserId;
    }

    if (activeMode === "provider") {
      return acceptedProviderTaskIds.has(Number(task.id));
    }

    return false;
  });
  const customerReviewTasks = completedTasks.filter(
    (task) => task.customer_id === currentUserId
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
  const accountForm = (
    <>
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
    </>
  );

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
        openAccountModal={() => setIsAccountModalOpen(true)}
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

      {isAccountModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setIsAccountModalOpen(false)}
        >
          <section
            className="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setIsAccountModalOpen(false)}
              aria-label="Close account dialog"
            >
              Close
            </button>

            <div id="account-modal-title">
              {accountForm}
            </div>
          </section>
        </div>
      )}

      {view === "home" && (
        <>
          <section className="guided-home">
            <div className="section-header">
              <div>
                <span className="eyebrow">Choose what you need</span>
                <h2>Start with one path</h2>
                <p className="muted">
                  Select a button below and only the related information will show.
                </p>
              </div>
            </div>

            <div className="home-focus-tabs" aria-label="Choose homepage information">
              <button
                className={homeFocus === "customer" ? "active" : ""}
                onClick={() => setHomeFocus("customer")}
              >
                Customer
              </button>
              <button
                className={homeFocus === "provider" ? "active" : ""}
                onClick={() => setHomeFocus("provider")}
              >
                Provider
              </button>
              <button
                className={homeFocus === "services" ? "active" : ""}
                onClick={() => setHomeFocus("services")}
              >
                Services
              </button>
              <button
                className={homeFocus === "status" ? "active" : ""}
                onClick={() => setHomeFocus("status")}
              >
                Marketplace Status
              </button>
              {isAdmin && (
                <button
                  className={homeFocus === "admin" ? "active" : ""}
                  onClick={() => setHomeFocus("admin")}
                >
                  Admin
                </button>
              )}
            </div>

            {homeFocus === "customer" && (
              <div className="home-focus-panel">
                <div>
                  <h3>Need help with a task?</h3>
                  <p>
                    Post the job, compare interested providers, then choose who
                    should do the work.
                  </p>
                  <div className="how-step-grid">
                    <div className="how-step-card">
                      <span>01</span>
                      <strong>Describe</strong>
                    </div>
                    <div className="how-step-card">
                      <span>02</span>
                      <strong>Compare</strong>
                    </div>
                    <div className="how-step-card">
                      <span>03</span>
                      <strong>Book</strong>
                    </div>
                  </div>
                </div>

                <div className="home-focus-action">
                  <button
                    onClick={() => {
                      changeActiveMode("customer");
                      setView("customer");
                    }}
                  >
                    Post a Task
                  </button>
                </div>
              </div>
            )}

            {homeFocus === "provider" && (
              <div className="home-focus-panel">
                <div>
                  <h3>Want to offer services?</h3>
                  <p>
                    Create a provider profile, wait for admin approval, then apply
                    to jobs that match your service and area.
                  </p>
                  <div className="how-step-grid">
                    <div className="how-step-card">
                      <span>01</span>
                      <strong>Profile</strong>
                    </div>
                    <div className="how-step-card">
                      <span>02</span>
                      <strong>Approval</strong>
                    </div>
                    <div className="how-step-card">
                      <span>03</span>
                      <strong>Apply</strong>
                    </div>
                  </div>
                </div>

                <div className="home-focus-action">
                  <button
                    onClick={() => {
                      changeActiveMode("provider");
                      setView("provider");
                    }}
                  >
                    Become a Provider
                  </button>
                </div>
              </div>
            )}

            {homeFocus === "services" && (
              <div className="home-focus-panel single">
                <div>
                  <h3>Browse by service</h3>
                  <p>Pick one service category to view matching marketplace activity.</p>
                  <div className="service-showcase-grid">
                    {featuredServiceCards.map((service) => (
                      <button
                        key={service.name}
                        className="service-showcase-card"
                        onClick={() => {
                          setTaskCategory(service.name);
                          setProviderCategory(service.name);
                          setSearchCategory(service.name);
                          setView("marketplace");
                        }}
                      >
                        <img src={service.image} alt={`${service.name} service`} />
                        <span>{service.name}</span>
                        <p>{service.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {homeFocus === "status" && (
              <div className="home-focus-panel single">
                <div>
                  <div className="section-header compact">
                    <div>
                      <h3>Marketplace snapshot</h3>
                      <p className="muted">Live activity from the current AddisTask marketplace.</p>
                    </div>
                    <button onClick={refreshMarketplace}>Refresh Snapshot</button>
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
                </div>
              </div>
            )}

            {homeFocus === "admin" && isAdmin && (
              <div className="home-focus-panel">
                <div>
                  <h3>Admin review area</h3>
                  <p>
                    Approve providers, review marketplace supply, and monitor open
                    customer demand.
                  </p>
                  <div className="dashboard-grid compact">
                    <div>
                      <span>Waiting approval</span>
                      <strong>{pendingProviders.length}</strong>
                    </div>
                    <div>
                      <span>Approved providers</span>
                      <strong>{approvedProviders.length}</strong>
                    </div>
                  </div>
                </div>

                <div className="home-focus-action">
                  <button
                    onClick={() => {
                      setSearchCategory("");
                      changeActiveMode("admin");
                      setView("marketplace");
                    }}
                  >
                    Open Admin Dashboard
                  </button>
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {view === "account" && (
        <section className="card narrow">
          {accountForm}
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
            <h2>{myProviderProfile ? "Update Provider Profile" : "Become a Provider"}</h2>
            <p className="muted">
              {myProviderProfile
                ? "Edit your provider details and resubmit them for admin review."
                : "Create a profile customers can trust before booking."}
            </p>
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

          <label className="field-label">
            Provider bio
            <textarea
              className="compact-textarea"
              placeholder="Briefly describe your experience, tools, and the type of customers you serve."
              value={providerBio}
              onChange={(e) => setProviderBio(e.target.value)}
            />
          </label>

          <div className="form-grid">
            <label className="field-label">
              Years of experience
              <input
                type="number"
                min="0"
                placeholder="e.g. 3"
                value={providerExperienceYears}
                onChange={(e) => setProviderExperienceYears(e.target.value)}
              />
            </label>

            <label className="field-label">
              Contact phone
              <input
                placeholder="Phone customers/admin can verify"
                value={providerContactPhone}
                onChange={(e) => setProviderContactPhone(e.target.value)}
              />
            </label>
          </div>

          <div className="form-grid">
            <label className="field-label">
              Service areas
              <input
                placeholder="e.g. Bole, CMC, Megenagna"
                value={providerServiceArea}
                onChange={(e) => setProviderServiceArea(e.target.value)}
              />
            </label>

            <label className="field-label">
              Availability
              <input
                placeholder="e.g. Weekdays, weekends, evenings"
                value={providerAvailability}
                onChange={(e) => setProviderAvailability(e.target.value)}
              />
            </label>
          </div>

          <div className="provider-note">
            <strong>Approval required</strong>
            <p>After submitting, an admin must approve the provider profile before it can apply to customer tasks.</p>
          </div>

          <div className="form-actions">
            <button onClick={createProvider}>
              {myProviderProfile ? "Resubmit Provider Profile" : "Create Provider Profile"}
            </button>

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
                <h2>
                  {activeMode === "admin" ? "Marketplace Operations" : "Today on AddisTask"}
                </h2>
                <p className="muted">
                  {activeMode === "admin"
                    ? "Live operating view for tasks, providers, completion, and demand."
                    : activeMode === "customer"
                      ? "Track your posted tasks, provider applications, and payment progress."
                      : "Track your approval status, applications, and accepted work."}
                </p>
              </div>

              <div className="toolbar-actions">
                <button onClick={refreshMarketplace}>Refresh</button>
                {activeMode === "customer" && (
                  <button
                    className="secondary-btn inline"
                    onClick={() => {
                      changeActiveMode("customer");
                      setView("customer");
                    }}
                  >
                    Post Task
                  </button>
                )}
                {activeMode === "provider" && (
                  <button
                    className="secondary-btn inline"
                    onClick={() => {
                      changeActiveMode("provider");
                      setView("provider");
                    }}
                  >
                    Provider Profile
                  </button>
                )}
                {activeMode === "admin" && (
                  <>
                    <button className="secondary-btn inline" onClick={loadDemoData}>
                      Load Demo Data
                    </button>
                    <button className="secondary-btn inline" onClick={clearDemoData}>
                      Clear Demo
                    </button>
                  </>
                )}
              </div>
            </div>

            {activeMode === "customer" && (
              <div className="dashboard-grid">
                <div>
                  <span>My open tasks</span>
                  <strong>{myOpenTasks.length}</strong>
                </div>
                <div>
                  <span>Applications waiting</span>
                  <strong>{pendingCustomerApplications.length}</strong>
                </div>
                <div>
                  <span>Assigned tasks</span>
                  <strong>{myAssignedTasks.length}</strong>
                </div>
                <div>
                  <span>Unpaid tasks</span>
                  <strong>{customerPaymentSummary.unpaid}</strong>
                </div>
              </div>
            )}

            {activeMode === "provider" && (
              <div className="dashboard-grid">
                <div>
                  <span>Approval</span>
                  <strong>{myProviderApprovalStatus}</strong>
                </div>
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
              </div>
            )}

            {activeMode === "admin" && (
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
            )}

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

            {activeMode === "admin" && (
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
            )}
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
                <div className="admin-review-card" key={provider.id}>
                  <div className="admin-review-header">
                    <div>
                      <span className="eyebrow">Provider application</span>
                      <h3>{provider.business_name}</h3>
                      <p>{provider.skill_category} | {provider.city}</p>
                    </div>

                    <span className={`verification-pill ${provider.approval_status || "pending"}`}>
                      {provider.approval_status || "pending"}
                    </span>
                  </div>

                  {provider.bio && (
                    <p className="provider-bio">{provider.bio}</p>
                  )}

                  <div className="admin-review-grid">
                    <div>
                      <span>Experience</span>
                      <strong>{provider.experience_years || 0} years</strong>
                    </div>
                    <div>
                      <span>Service areas</span>
                      <strong>{provider.service_area || provider.city}</strong>
                    </div>
                    <div>
                      <span>Availability</span>
                      <strong>{provider.availability || "Not provided"}</strong>
                    </div>
                    <div>
                      <span>Contact phone</span>
                      <strong>{provider.contact_phone || "Not provided"}</strong>
                    </div>
                    <div>
                      <span>ID status</span>
                      <strong>{provider.id_verification_status || "not_submitted"}</strong>
                    </div>
                    <div>
                      <span>Marketplace history</span>
                      <strong>{provider.completed_tasks || 0} jobs | {provider.rating || 4.5} rating</strong>
                    </div>
                  </div>

                  <div className="admin-review-actions">
                    <div>
                      <strong>Review decision</strong>
                      <p>Approve only when the profile has enough trust information for customers.</p>
                    </div>

                    <label className="admin-notes-field">
                      Review note
                      <textarea
                        className="compact-textarea"
                        placeholder="Required when rejecting. Optional approval note."
                        value={providerApprovalNotes[provider.id] || ""}
                        onChange={(e) =>
                          setProviderApprovalNotes((current) => ({
                            ...current,
                            [provider.id]: e.target.value,
                          }))
                        }
                      />
                    </label>

                    <div className="actions">
                      <button onClick={() => updateProviderApproval(provider.id, "approved")}>
                        Approve Provider
                      </button>
                      <button
                        className="secondary-btn inline"
                        onClick={() => updateProviderApproval(provider.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
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
            serviceCategories={serviceCategories}
            tasks={tasks}
            loadMatches={loadMatches}
            applyToTask={applyToTask}
            loadApplications={loadApplications}
            completeTask={completeTask}
            updateTaskPaymentStatus={updateTaskPaymentStatus}
            activeMode={activeMode}
            currentUserId={currentUserId}
            providerApprovalStatus={myProviderApprovalStatus}
          />

          {activeMode === "customer" && (
            <section className="card wide customer-next-steps-card">
              <div className="section-header">
                <div>
                  <h2>Customer Next Steps</h2>
                  <p className="muted">
                    Focus on the work that needs your attention first.
                  </p>
                </div>
              </div>

              <div className="next-step-grid">
                <div>
                  <span>{pendingCustomerApplications.length}</span>
                  <strong>Review applications</strong>
                  <p>Accept the best provider for your posted tasks.</p>
                </div>
                <div>
                  <span>{myAssignedTasks.length}</span>
                  <strong>Coordinate assigned work</strong>
                  <p>Use messages and complete the task after the work is done.</p>
                </div>
                <div>
                  <span>{customerPaymentSummary.unpaid + customerPaymentSummary.cash_agreed}</span>
                  <strong>Track payment</strong>
                  <p>Update unpaid or cash-agreed jobs as the work progresses.</p>
                </div>
                <div>
                  <span>{customerReviewTasks.length}</span>
                  <strong>Leave reviews</strong>
                  <p>Review completed jobs to build provider trust.</p>
                </div>
              </div>
            </section>
          )}

          {activeMode === "customer" && (
            <section className="card wide payment-summary-card">
              <div className="section-header">
                <div>
                  <h2>Payment Summary</h2>
                  <p className="muted">
                    A quick view of payment progress for your posted tasks.
                  </p>
                </div>
              </div>

              <div className="activity-summary payment-summary-grid">
                <div>
                  <span>Unpaid</span>
                  <strong>{customerPaymentSummary.unpaid}</strong>
                </div>
                <div>
                  <span>Cash agreed</span>
                  <strong>{customerPaymentSummary.cash_agreed}</strong>
                </div>
                <div>
                  <span>Paid</span>
                  <strong>{customerPaymentSummary.paid}</strong>
                </div>
                <div>
                  <span>Disputed</span>
                  <strong>{customerPaymentSummary.disputed}</strong>
                </div>
              </div>
            </section>
          )}

          {activeMode === "customer" && (
            <section className="card wide task-history-card">
              <div className="section-header">
                <div>
                  <h2>My Task History</h2>
                  <p className="muted">
                    Follow your posted work from new request to assigned job and completion.
                  </p>
                </div>
              </div>

              <div className="task-history-grid">
                <div>
                  <h3>Open</h3>
                  {myOpenTasks.length === 0 ? (
                    <p className="muted">No open posted tasks.</p>
                  ) : (
                    myOpenTasks.slice(0, 4).map((task) => (
                      <article className="mini-task-card" key={task.id}>
                        <strong>{task.title}</strong>
                        <span>{task.category} | {task.budget || 0} birr</span>
                        <small>{task.location || "Addis Ababa"}</small>
                      </article>
                    ))
                  )}
                </div>

                <div>
                  <h3>Assigned</h3>
                  {myAssignedTasks.length === 0 ? (
                    <p className="muted">No assigned tasks right now.</p>
                  ) : (
                    myAssignedTasks.slice(0, 4).map((task) => (
                      <article className="mini-task-card" key={task.id}>
                        <strong>{task.title}</strong>
                        <span>{task.category} | {task.budget || 0} birr</span>
                        <small>Payment: {(task.payment_status || "unpaid").replace("_", " ")}</small>
                      </article>
                    ))
                  )}
                </div>

                <div>
                  <h3>Completed</h3>
                  {myCompletedTasks.length === 0 ? (
                    <p className="muted">No completed tasks yet.</p>
                  ) : (
                    myCompletedTasks.slice(0, 4).map((task) => (
                      <article className="mini-task-card" key={task.id}>
                        <strong>{task.title}</strong>
                        <span>{task.category} | {task.budget || 0} birr</span>
                        <small>Payment: {(task.payment_status || "unpaid").replace("_", " ")}</small>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </section>
          )}

          <MatchedProviders
            selectedTask={selectedTask}
            matches={matches}
            openProviderProfile={openProviderProfile}
          />

          {selectedProviderProfile && (
            <section className="card wide provider-profile-panel">
              <div className="section-header">
                <div>
                  <span className="eyebrow">Provider profile</span>
                  <h2>{selectedProviderProfile.business_name}</h2>
                  <p className="muted">
                    {selectedProviderProfile.skill_category} | {selectedProviderProfile.city}
                  </p>
                </div>

                <button
                  className="secondary-btn inline"
                  onClick={() => {
                    setSelectedProviderProfile(null);
                    setSelectedProviderReviews([]);
                  }}
                >
                  Close Profile
                </button>
              </div>

              {selectedProviderProfile.bio && (
                <p className="provider-profile-bio">{selectedProviderProfile.bio}</p>
              )}

              <div className="provider-profile-grid">
                <div>
                  <span>Rating</span>
                  <strong>{selectedProviderProfile.rating || 4.5}</strong>
                </div>
                <div>
                  <span>Completed jobs</span>
                  <strong>{selectedProviderProfile.completed_tasks || 0}</strong>
                </div>
                <div>
                  <span>Experience</span>
                  <strong>{selectedProviderProfile.experience_years || 0} years</strong>
                </div>
                <div>
                  <span>Response time</span>
                  <strong>{selectedProviderProfile.response_time_minutes || 30} min</strong>
                </div>
                <div>
                  <span>Service areas</span>
                  <strong>{selectedProviderProfile.service_area || selectedProviderProfile.city || "Not provided"}</strong>
                </div>
                <div>
                  <span>Availability</span>
                  <strong>{selectedProviderProfile.availability || "Not provided"}</strong>
                </div>
                <div>
                  <span>ID status</span>
                  <strong>{selectedProviderProfile.id_verification_status || "not_submitted"}</strong>
                </div>
                <div>
                  <span>Approval</span>
                  <strong>{selectedProviderProfile.approval_status || "pending"}</strong>
                </div>
              </div>

              <div className="profile-actions">
                <button onClick={() => saveProvider(selectedProviderProfile)}>
                  Save Provider
                </button>
                {selectedProviderProfile.contact_phone && (
                  <span>Contact phone: {selectedProviderProfile.contact_phone}</span>
                )}
              </div>

              <div className="provider-reviews">
                <div className="section-header compact">
                  <div>
                    <h3>Customer reviews</h3>
                    <p className="muted">
                      Reviews from completed AddisTask jobs help customers compare providers.
                    </p>
                  </div>
                </div>

                {selectedProviderReviews.length === 0 && (
                  <div className="empty-state">
                    No customer reviews yet.
                  </div>
                )}

                {selectedProviderReviews.map((review) => (
                  <div className="review-card" key={review.id}>
                    <div>
                      <strong>{review.rating}/5</strong>
                      {review.created_at && (
                        <span>
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p>{review.comment || "No written comment."}</p>
                    {review.status_note && (
                      <small>{review.status_note}</small>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

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
                          className="secondary-btn inline"
                          onClick={() => openProviderProfile(a)}
                        >
                          View Profile
                        </button>
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
                      <>
                        <button
                          className="secondary-btn inline"
                          onClick={() => openProviderProfile(a)}
                        >
                          View Profile
                        </button>
                        <span className={`status-pill ${a.status}`}>{a.status}</span>
                      </>
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

            {myProviderProfile?.approval_status === "rejected" && (
              <div className="empty-state attention-state">
                Your provider profile needs changes before approval.
                {myProviderProfile.admin_notes && (
                  <span className="provider-admin-note">
                    Admin note: {myProviderProfile.admin_notes}
                  </span>
                )}
                <button className="secondary-btn inline" onClick={loadProviderProfileIntoForm}>
                  Edit and Resubmit
                </button>
              </div>
            )}
          </section>
          )}

          {(activeMode === "customer" || activeMode === "provider") && (
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
                    onClick={() => {
                      setSearchCategory("");
                      setSearchLocation("");
                    }}
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
                <div className="provider-card" key={provider.id}>
                  <div>
                    <strong>{provider.business_name}</strong>
                    <p>{provider.skill_category} | {provider.city}</p>
                  </div>

                  <div className="trust-list compact">
                    <span>Rating: {provider.rating || 4.5}</span>
                    <span>Completed: {provider.completed_tasks || 0}</span>
                    <span>Response: {provider.response_time_minutes || 30} min</span>
                    <span>Experience: {provider.experience_years || 0} yrs</span>
                  </div>

                  {provider.bio && (
                    <p className="provider-bio">{provider.bio}</p>
                  )}

                  <div className="trust-list compact">
                    {provider.service_area && <span>Areas: {provider.service_area}</span>}
                    {provider.availability && <span>Available: {provider.availability}</span>}
                    <span>ID: {provider.id_verification_status || "not_submitted"}</span>
                  </div>

                  <span className={`verification-pill ${provider.approval_status || "pending"}`}>
                    {provider.approval_status || "pending"}
                  </span>

                  <button
                    className="secondary-btn inline"
                    onClick={() => openProviderProfile(provider)}
                  >
                    View Profile
                  </button>

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
                    <span>Experience: {provider.experience_years || 0} yrs</span>
                    <span>Status: {provider.approval_status || "pending"}</span>
                  </div>

                  <button
                    className="secondary-btn inline"
                    onClick={() => openProviderProfile(provider)}
                  >
                    View Profile
                  </button>

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
                      <span>
                        Payment: {(application.task_payment_status || "unpaid").replace("_", " ")}
                      </span>
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

            {messageEligibleTasks.length === 0 ? (
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
                    {messageEligibleTasks.map((task) => (
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

            {customerReviewTasks.length === 0 ? (
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
                  {customerReviewTasks.map((task) => (
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
