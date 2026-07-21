import { useEffect, useRef, useState } from "react";
import "./App.css";
import { api } from "./services/api";
import Hero from "./components/Hero";
import Marketplace from "./components/Marketplace";
import CustomerDashboard from "./components/CustomerDashboard";
import ProviderDashboard from "./components/ProviderDashboard";
import MatchedProviders from "./components/MatchedProviders";
import MessagePanel from "./components/MessagePanel";
import ReviewPanel from "./components/ReviewPanel";
import ProviderProfilePanel from "./components/ProviderProfilePanel";
import ProviderDirectoryPanel from "./components/ProviderDirectoryPanel";
import ProviderTrustSummary from "./components/ProviderTrustSummary";
import { getProviderTrustSummary } from "./utils/providerTrust";
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

const normalize = (value) => String(value || "").toLowerCase().trim();

function getProviderDirectoryScore(provider, searchCategory, searchLocation) {
  const service = normalize(provider.skill_category);
  const city = normalize(provider.city);
  const serviceArea = normalize(provider.service_area);
  const search = normalize(searchCategory);
  const area = normalize(searchLocation);
  let score = 0;

  if (provider.approval_status === "approved") score += 30;
  if (search && service === search) score += 30;
  if (search && service.includes(search)) score += 15;
  if (area && (city.includes(area) || serviceArea.includes(area))) score += 20;
  score += Number(provider.trust_score || 0) * 0.15;
  score += Number(provider.rating || 0) * 3;
  score += Math.min(Number(provider.completed_tasks || 0), 40) * 0.4;
  score -= Math.min(Number(provider.response_time_minutes || 0), 120) * 0.05;

  return score;
}

function isProviderCustomerVisible(provider) {
  return provider.approval_status === "approved" && provider.trust_ready === true;
}

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
  const activeViewRef = useRef(null);
  const [view, setView] = useState("home");
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [homeFocus, setHomeFocus] = useState("customer");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

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
  const [providerFormProfileId, setProviderFormProfileId] = useState(null);

  const [selectedTask, setSelectedTask] = useState(null);
  const [matches, setMatches] = useState([]);
  const [isMatchesModalOpen, setIsMatchesModalOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [applicationsTask, setApplicationsTask] = useState(null);
  const [applicationsError, setApplicationsError] = useState("");
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
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
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [adminDataHealth, setAdminDataHealth] = useState(null);
  const [adminDataStatus, setAdminDataStatus] = useState("");
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [adminAuditLog, setAdminAuditLog] = useState([]);

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  const isAdmin = currentUserRole === "admin";

  useEffect(() => {
    if (view === "home" || isAccountModalOpen) return undefined;

    const scrollTimer = window.setTimeout(() => {
      activeViewRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      activeViewRef.current?.focus({ preventScroll: true });
    }, 50);

    return () => window.clearTimeout(scrollTimer);
  }, [view, activeMode, isAccountModalOpen]);

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
      "Provider profile needs trust details before approval":
        "Complete the provider trust checklist before approval.",
      "Admin note is required when rejecting provider profile":
        "Add a short reason before rejecting this provider.",
      "Invalid credentials":
        "The phone number or password is incorrect.",
      "Phone already registered":
        "This phone number is already registered. Please log in instead.",
      "Current password is incorrect":
        "The current password is incorrect.",
      "New password must be different":
        "Choose a new password that is different from your current password.",
      "Too many failed login attempts. Try again later.":
        "Too many failed login attempts. Please wait and try again later.",
      "Admin access required":
        "Admin access is required for this action.",
      "Task not found":
        "This task could not be found. Refresh the marketplace and try again.",
      "Task is already archived":
        "This task is already archived.",
      "Only archived tasks can be restored":
        "Only hidden tasks can be restored.",
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
    setCurrentPassword("");
    setNewPassword("");
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

  const changePassword = async () => {
    try {
      if (!token) {
        setView("account");
        return alert("Login first to update your password.");
      }

      if (currentPassword.length < 6) {
        return alert("Current password must be at least 6 characters.");
      }

      if (newPassword.length < 6) {
        return alert("New password must be at least 6 characters.");
      }

      await api.patch(
        "/api/auth/password",
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        authHeader
      );

      setCurrentPassword("");
      setNewPassword("");
      alert("Password updated successfully.");
    } catch (err) {
      alert(getErrorMessage(err, "Password update failed"));
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
    setCurrentPassword("");
    setNewPassword("");
    setView("home");
    setApplications([]);
    setApplicationsTask(null);
    setApplicationsError("");
    setApplicationsLoading(false);
    setIsApplicationsModalOpen(false);
    setMessagesLoading(false);
    setIsMessagesModalOpen(false);
    setIsReviewModalOpen(false);
    setIsMatchesModalOpen(false);

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
        loadAdminDataHealth({ silent: true }),
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

  const updateProviderApproval = async (providerOrId, status) => {
    try {
      const provider =
        typeof providerOrId === "object"
          ? providerOrId
          : verificationQueue.find((item) => Number(item.id) === Number(providerOrId)) ||
            providers.find((item) => Number(item.id) === Number(providerOrId));
      const providerId = provider?.id || providerOrId;

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

      if (status === "approved" && provider) {
        const trust = getProviderTrustSummary(provider);

        if (!trust.ready) {
          return alert(
            `This provider cannot be approved yet. Complete these items first:\n- ${trust.missing.join("\n- ")}`
          );
        }
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

  const getProviderReminderMessage = (provider) => {
    const missingItems = provider.missing_trust_requirements?.length
      ? provider.missing_trust_requirements.join(", ")
      : "the missing provider profile details";
    const providerName = provider.business_name || "there";

    return [
      `Hi ${providerName}, your AddisTask provider profile needs a little more detail before approval.`,
      `Please update: ${missingItems}.`,
      "Open Provider Mode, choose Fix Missing Details, make the changes, and resubmit for admin review.",
      "Thank you.",
    ].join(" ");
  };

  const copyProviderReminder = async (provider) => {
    const reminder = getProviderReminderMessage(provider);
    const recordReminder = async () => {
      const res = await api.post(
        `/api/admin/providers/${provider.id}/reminder`,
        { message: reminder },
        authHeader
      );

      setAdminAuditLog((current) => [res.data, ...current].slice(0, 8));
    };

    try {
      if (!navigator.clipboard?.writeText) {
        window.prompt("Copy this provider reminder", reminder);
        await recordReminder();
        return;
      }

      await navigator.clipboard.writeText(reminder);
      await recordReminder();
      alert("Provider reminder copied and recorded in Admin history.");
    } catch {
      window.prompt("Copy this provider reminder", reminder);
      try {
        await recordReminder();
      } catch {
        alert("Reminder text is ready, but it could not be recorded in Admin history.");
      }
    }
  };

  const loadAdminDataHealth = async ({ silent = false } = {}) => {
    try {
      if (!token) {
        if (silent) return null;
        setView("account");
        return alert("Login first to view admin data controls.");
      }

      if (!isAdmin) {
        if (silent) return null;
        return alert("Admin access is required to view data controls.");
      }

      const [healthResponse, archivedResponse, auditResponse] = await Promise.all([
        api.get("/api/admin/data-health", authHeader),
        api.get("/api/admin/tasks/archived", authHeader),
        api.get("/api/admin/audit-log?limit=8", authHeader),
      ]);
      setAdminDataHealth(healthResponse.data);
      setArchivedTasks(archivedResponse.data);
      setAdminAuditLog(auditResponse.data);
      setAdminDataStatus(`Last scanned ${getRefreshTime()}`);
      return healthResponse.data;
    } catch (err) {
      if (silent) return null;
      alert(getErrorMessage(err, "Failed to load admin data health"));
      return null;
    }
  };

  const archiveTask = async (task) => {
    try {
      if (!token) {
        setView("account");
        return alert("Login first to manage marketplace records.");
      }

      if (!isAdmin) {
        return alert("Admin access is required to hide marketplace records.");
      }

      const confirmed = window.confirm(
        `Hide "${task.title}" from the public marketplace? You can restore it from Data Management.`
      );

      if (!confirmed) return;

      await api.patch(
        `/api/admin/tasks/${task.id}/archive`,
        { reason: "Archived from admin marketplace" },
        authHeader
      );

      await Promise.all([
        loadTasks(),
        loadAdminDataHealth({ silent: true }),
      ]);
      setMarketplaceSyncedAt(getRefreshTime());
      alert("Task hidden from the public marketplace.");
    } catch (err) {
      alert(getErrorMessage(err, "Failed to hide task"));
    }
  };

  const restoreArchivedTask = async (taskId) => {
    try {
      if (!token) {
        setView("account");
        return alert("Login first to restore marketplace records.");
      }

      if (!isAdmin) {
        return alert("Admin access is required to restore marketplace records.");
      }

      await api.patch(`/api/admin/tasks/${taskId}/restore`, {}, authHeader);
      await Promise.all([
        loadTasks(),
        loadAdminDataHealth({ silent: true }),
      ]);
      setMarketplaceSyncedAt(getRefreshTime());
      alert("Task restored to the public marketplace.");
    } catch (err) {
      alert(getErrorMessage(err, "Failed to restore task"));
    }
  };

  const cleanupWorkflowTestData = async () => {
    try {
      if (!token) {
        setView("account");
        return alert("Login first to clean workflow test data.");
      }

      if (!isAdmin) {
        return alert("Admin access is required to clean workflow test data.");
      }

      const confirmed = window.confirm(
        "Clean only known workflow-test records? Real customer tasks and provider profiles are not included in this cleanup."
      );

      if (!confirmed) return;

      const res = await api.post("/api/admin/cleanup-workflow-tests", {}, authHeader);
      setAdminDataHealth({
        summary: res.data.summary,
        workflow_test_candidates: res.data.workflow_test_candidates,
      });

      const deletedTotal = Object.values(res.data.deleted || {}).reduce(
        (sum, count) => sum + Number(count || 0),
        0
      );

      setAdminDataStatus(`Cleanup completed ${getRefreshTime()}`);
      alert(`Workflow test cleanup complete. Removed ${deletedTotal} record${deletedTotal === 1 ? "" : "s"}.`);

      await Promise.all([
        loadTasks(),
        loadProviders(),
        loadVerificationQueue({ silent: true }),
        loadAdminDataHealth({ silent: true }),
      ]);
      setMarketplaceSyncedAt(getRefreshTime());
    } catch (err) {
      alert(getErrorMessage(err, "Workflow test cleanup failed"));
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
    setApplicationsLoading(false);
    setIsApplicationsModalOpen(false);
    setMessagesLoading(false);
    setIsMessagesModalOpen(false);
    setIsReviewModalOpen(false);
    setIsMatchesModalOpen(false);

    if (mode === "admin" && isAdmin) {
      setView("marketplace");
      Promise.all([
        loadTasks(),
        loadProviders(),
        loadVerificationQueue({ silent: true }),
        loadAdminDataHealth({ silent: true }),
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
    setApplicationsLoading(false);
    setIsApplicationsModalOpen(false);
    setCustomerApplications([]);
    setProviderApplications([]);
    setProviderActivityLoadedAt("");
    setMyProviderProfile(null);
    setVerificationQueue([]);
    setTaskMessages([]);
    setSelectedTask(null);
    setIsMatchesModalOpen(false);
    setMessagesLoading(false);
    setIsMessagesModalOpen(false);
    setIsReviewModalOpen(false);
    alert("Demo marketplace data loaded.");
  };

  const clearDemoData = () => {
    setTasks((current) => current.filter((task) => task.id > 0));
    setProviders((current) => current.filter((provider) => provider.id > 0));
    setMatches([]);
    setApplications([]);
    setApplicationsTask(null);
    setApplicationsError("");
    setApplicationsLoading(false);
    setIsApplicationsModalOpen(false);
    setCustomerApplications([]);
    setProviderApplications([]);
    setProviderActivityLoadedAt("");
    setMyProviderProfile(null);
    setVerificationQueue([]);
    setTaskMessages([]);
    setSelectedTask(null);
    setIsMatchesModalOpen(false);
    setMessagesLoading(false);
    setIsMessagesModalOpen(false);
    setIsReviewModalOpen(false);
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

  const closeApplicationsModal = () => {
    setIsApplicationsModalOpen(false);
  };

  const openProviderProfileFromApplications = (provider) => {
    setIsApplicationsModalOpen(false);
    openProviderProfile(provider);
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

  const resetProviderForm = () => {
    setProviderName("");
    setProviderCategory(serviceCategories[0]);
    setProviderCity(addisAreas[0]);
    setProviderBio("");
    setProviderExperienceYears("");
    setProviderServiceArea("");
    setProviderAvailability("");
    setProviderContactPhone("");
    setProviderFormProfileId(null);
  };

  const fillProviderFormFromProfile = (profile) => {
    setProviderName(profile.business_name || "");
    setProviderCategory(profile.skill_category || serviceCategories[0]);
    setProviderCity(profile.city || addisAreas[0]);
    setProviderBio(profile.bio || "");
    setProviderExperienceYears(
      Number.isFinite(Number(profile.experience_years))
        ? String(profile.experience_years)
        : ""
    );
    setProviderServiceArea(profile.service_area || "");
    setProviderAvailability(profile.availability || "");
    setProviderContactPhone(profile.contact_phone || "");
    setProviderFormProfileId(profile.id || null);
  };

  const openProviderProfileForm = async () => {
    changeActiveMode("provider");

    if (!token) {
      setView("provider");
      return;
    }

    if (myProviderProfile) {
      fillProviderFormFromProfile(myProviderProfile);
      setView("provider");
      return;
    }

    try {
      const res = await api.get("/api/providers/me", authHeader);
      setMyProviderProfile(res.data);
      fillProviderFormFromProfile(res.data);
    } catch {
      resetProviderForm();
    }

    setView("provider");
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

      const isUpdatingProvider = Boolean(myProviderProfile);
      const formLoadedFromCurrentProfile =
        isUpdatingProvider && providerFormProfileId === myProviderProfile.id;
      const useExistingSelectValues = isUpdatingProvider && !formLoadedFromCurrentProfile;
      const providerNameValue = providerName.trim() || myProviderProfile?.business_name || "";
      const providerCategoryValue = useExistingSelectValues
        ? myProviderProfile.skill_category
        : providerCategory;
      const providerCityValue = useExistingSelectValues
        ? myProviderProfile.city
        : providerCity;
      const providerBioValue = providerBio.trim() || myProviderProfile?.bio || null;
      const providerServiceAreaValue =
        providerServiceArea.trim() ||
        myProviderProfile?.service_area ||
        providerCityValue;
      const providerAvailabilityValue =
        providerAvailability.trim() || myProviderProfile?.availability || null;
      const providerContactPhoneValue =
        providerContactPhone.trim() || myProviderProfile?.contact_phone || phone || null;
      const providerExperienceYearsValue =
        providerExperienceYears !== ""
          ? Number(providerExperienceYears)
          : Number(myProviderProfile?.experience_years || 0);

      const providerPayload = {
        business_name: providerNameValue,
        skill_category: providerCategoryValue,
        city: providerCityValue,
        bio: providerBioValue,
        experience_years: Number.isFinite(providerExperienceYearsValue)
          ? Math.max(providerExperienceYearsValue, 0)
          : 0,
        service_area: providerServiceAreaValue,
        availability: providerAvailabilityValue,
        contact_phone: providerContactPhoneValue,
      };

      if (myProviderProfile) {
        await api.patch("/api/providers/me", providerPayload, authHeader);
      } else {
        await api.post("/api/providers/", providerPayload, authHeader);
      }

      alert(
        myProviderProfile
          ? "Provider profile updated and resubmitted for approval."
          : "Provider profile submitted for approval. Apply after the profile is approved."
      );

      if (!myProviderProfile) {
        resetProviderForm();
      }

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
      if (!token) {
        setIsAccountModalOpen(true);
        return alert("Login first to edit your provider profile.");
      }

      let profile = myProviderProfile;

      if (!profile) {
        const res = await api.get("/api/providers/me", authHeader);
        profile = res.data;
        setMyProviderProfile(profile);
      }

      changeActiveMode("provider");
      fillProviderFormFromProfile(profile);
      setView("provider");
    } catch (err) {
      alert(getErrorMessage(err, "Failed to load provider profile"));
    }
  };

  const loadMatches = async (taskId) => {
    try {
      setSelectedTask(taskId);
      setMatches([]);
      setIsMatchesModalOpen(true);

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
          const [
            queueResponse,
            dataHealthResponse,
            archivedResponse,
            auditResponse,
          ] = await Promise.all([
            api.get("/api/providers/verification-queue", requestConfig),
            api.get("/api/admin/data-health", requestConfig),
            api.get("/api/admin/tasks/archived", requestConfig),
            api.get("/api/admin/audit-log?limit=8", requestConfig),
          ]);
          setVerificationQueue(queueResponse.data);
          setAdminDataHealth(dataHealthResponse.data);
          setArchivedTasks(archivedResponse.data);
          setAdminAuditLog(auditResponse.data);
          setAdminDataStatus(`Last scanned ${getRefreshTime()}`);
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
    const numericTaskId = Number(taskId);
    const taskForReview =
      typeof taskOrId === "object"
        ? taskOrId
        : tasks.find((task) => Number(task.id) === numericTaskId) || null;

    if (numericTaskId >= 0 && !token) {
      setView("account");
      return alert("Login first to review task applications.");
    }

    if (numericTaskId >= 0 && activeMode !== "customer") {
      return alert("Switch to Customer Mode to review applications.");
    }

    setApplicationsError("");
    setApplications([]);
    setApplicationsTask(taskForReview);
    setApplicationsLoading(true);
    setIsApplicationsModalOpen(true);

    try {
      if (numericTaskId < 0) {
        const task = demoTasks.find((item) => item.id === numericTaskId);
        const applicant = demoProviders.find(
          (provider) => provider.skill_category === task?.category
        );

        setApplications(
          applicant
            ? [
                {
                  application_id: -401,
                  task_id: numericTaskId,
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
    } finally {
      setApplicationsLoading(false);
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
      setIsReviewModalOpen(false);
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

      setMessagesLoading(true);
      const res = await api.get(`/api/messages/task/${taskId}`, authHeader);
      setTaskMessages(res.data);
      setMessageTaskId(String(taskId));
    } catch (err) {
      alert(getErrorMessage(err, "Failed to load messages"));
    } finally {
      setMessagesLoading(false);
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
    const matchesArea = [city, serviceArea].some((value) => value.includes(area));

    return isProviderCustomerVisible(provider) && matchesSearch && matchesArea;
  }).sort((left, right) =>
    getProviderDirectoryScore(right, searchCategory, searchLocation) -
    getProviderDirectoryScore(left, searchCategory, searchLocation)
  );
  const approvedProviders = providers.filter(
    (provider) => provider.approval_status === "approved"
  );
  const customerVisibleProviders = providers.filter(isProviderCustomerVisible);
  const pendingProviders = providers.filter(
    (provider) => provider.approval_status === "pending"
  );
  const myProviderApprovalStatus = myProviderProfile?.approval_status || "not submitted";
  const providerMissingTrustItems = myProviderProfile?.missing_trust_requirements || [];
  const providerNeedsTrustDetails = Boolean(
    myProviderProfile && myProviderProfile.trust_ready === false
  );
  const providerApprovalGuidance = (() => {
    if (!myProviderProfile) {
      return {
        count: 1,
        title: "Create provider profile",
        text: "Create a provider profile before applying to customer tasks.",
        action: "Create Profile",
        heading: "Create your provider profile",
        detail: "Add your service, area, experience, availability, and contact details for admin review.",
        tone: "attention",
      };
    }

    if (myProviderApprovalStatus === "approved") {
      return {
        count: 0,
        title: "Provider approved",
        text: "Your provider profile is approved. You can now apply to matching tasks.",
        action: "Browse Tasks",
        heading: "Approved and ready",
        detail: "You can now apply to matching open tasks and track customer decisions in Provider Activity.",
        tone: "success",
      };
    }

    if (myProviderApprovalStatus === "rejected") {
      return {
        count: 1,
        title: "Provider changes needed",
        text: myProviderProfile.admin_notes
          ? `Admin note: ${myProviderProfile.admin_notes}`
          : "Update your provider profile and resubmit it for admin review.",
        action: "Edit Profile",
        heading: "Changes requested",
        detail: myProviderProfile.admin_notes
          ? `Admin note: ${myProviderProfile.admin_notes}`
          : "Update the requested profile details, then resubmit for approval.",
        tone: "attention",
      };
    }

    if (providerNeedsTrustDetails) {
      const missingSummary = providerMissingTrustItems.length
        ? `Missing: ${providerMissingTrustItems.join(", ")}.`
        : "Some trust details are still missing.";

      return {
        count: 1,
        title: "Missing approval details",
        text: `${missingSummary} Fix these details and resubmit for review.`,
        action: "Fix Details",
        heading: "Missing details before approval",
        detail: `${missingSummary} Your saved information will stay in the form when you edit.`,
        tone: "attention",
      };
    }

    return {
      count: 1,
      title: "Ready for admin review",
      text: "Your profile is complete and waiting for admin approval.",
      action: "Check Status",
      heading: "Profile resubmitted",
      detail: "Your profile has the required trust details and is waiting for admin review.",
      tone: "ready",
    };
  })();
  const providerQueueSource = verificationQueue.length ? verificationQueue : pendingProviders;
  const providerQueueReadyCount = providerQueueSource.filter(
    (provider) => provider.trust_ready === true
  ).length;
  const providerQueueNeedsDetailsCount = providerQueueSource.filter(
    (provider) => provider.trust_ready === false
  ).length;
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
  const closeMessagesModal = () => {
    setIsMessagesModalOpen(false);
  };
  const openMessagesModal = (taskId = "") => {
    if (!token) {
      setView("account");
      return alert("Login first to view task messages.");
    }

    const selectedTaskId =
      taskId || messageTaskId || messageEligibleTasks[0]?.id || "";

    setIsMessagesModalOpen(true);

    if (selectedTaskId) {
      setMessageTaskId(String(selectedTaskId));
      setTaskMessages([]);
      loadMessages(selectedTaskId);
    }
  };
  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
  };
  const openReviewModal = (taskId = "") => {
    if (!token) {
      setView("account");
      return alert("Login first to review a completed task.");
    }

    const selectedTaskId =
      taskId || reviewTaskId || customerReviewTasks[0]?.id || "";

    if (selectedTaskId) {
      setReviewTaskId(String(selectedTaskId));
    }

    setIsReviewModalOpen(true);
  };
  const providerServiceAreas = [
    myProviderProfile?.city,
    ...(myProviderProfile?.service_area || "")
      .split(",")
      .map((area) => area.trim())
  ]
    .filter(Boolean)
    .map((area) => area.toLowerCase());
  const providerTrustDraft = {
    bio: providerBio,
    experience_years: providerExperienceYears ? Number(providerExperienceYears) : 0,
    service_area: providerServiceArea || providerCity,
    availability: providerAvailability,
    contact_phone: providerContactPhone,
    id_verification_status: providerContactPhone.trim() ? "submitted" : "not_submitted",
  };
  const providerMatchingOpenTasks = myProviderProfile
    ? tasks.filter((task) => {
        const taskCategory = task.category?.toLowerCase() || "";
        const taskLocation = task.location?.toLowerCase() || "";
        const profileCategory = myProviderProfile.skill_category?.toLowerCase() || "";
        const serviceMatches = taskCategory === profileCategory;
        const locationMatches =
          providerServiceAreas.length === 0 ||
          providerServiceAreas.some((area) => taskLocation.includes(area) || area.includes(taskLocation));

        return task.status === "open" && serviceMatches && locationMatches;
      })
    : [];
  const providerActionableOpenTasks =
    myProviderApprovalStatus === "approved" ? providerMatchingOpenTasks : [];
  const selectedMatchTask = tasks.find(
    (task) => Number(task.id) === Number(selectedTask)
  ) || demoTasks.find((task) => Number(task.id) === Number(selectedTask));
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
      action: "Open Messages",
    },
    {
      id: "customer-reviews",
      count: myCompletedTasks.length,
      title: "Reviews ready",
      text: myCompletedTasks.length
        ? "Submit reviews for completed jobs to improve trust."
        : "No completed tasks waiting for review.",
      action: "Leave Review",
    },
  ];
  const providerNotifications = [
    {
      id: "provider-approval",
      count: providerApprovalGuidance.count,
      title: providerApprovalGuidance.title,
      text: providerApprovalGuidance.text,
      action: providerApprovalGuidance.action,
    },
    {
      id: "provider-accepted",
      count: acceptedProviderApplications.length,
      title: "Accepted applications",
      text: acceptedProviderApplications.length
        ? "Customers accepted one or more of your applications."
        : "No accepted applications yet.",
      action: "Open Messages",
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
      count: providerQueueSource.length,
      attentionCount: providerQueueSource.length,
      title: "Providers waiting",
      text: providerQueueSource.length
        ? `${providerQueueReadyCount} ready to approve, ${providerQueueNeedsDetailsCount} need provider updates.`
        : "No provider profiles are waiting for approval.",
      action: "Load Queue",
    },
    {
      id: "admin-supply",
      count: approvedProviders.length,
      attentionCount: 0,
      title: "Approved supply",
      text: approvedProviders.length
        ? "Approved providers are visible and eligible for customer tasks."
        : "No approved providers yet.",
      action: "Refresh Providers",
    },
    {
      id: "admin-open-tasks",
      count: openTasks,
      attentionCount: openTasks,
      title: "Open customer requests",
      text: openTasks
        ? "These customer tasks still need provider applications."
        : "No open customer requests right now.",
      action: "Refresh Tasks",
    },
  ];
  const manualPilotMessages = [
    {
      id: "provider-invites",
      status: customerVisibleProviders.length >= 2 ? "ready" : "send",
      title: "Provider invitations",
      detail: customerVisibleProviders.length >= 2
        ? `${customerVisibleProviders.length} trust-ready providers are visible.`
        : "Use the provider invitation template to prepare 2 to 5 trusted providers.",
      actionLabel: "Refresh Providers",
      action: loadProviders,
    },
    {
      id: "provider-reminders",
      status: pendingProviders.length ? "send" : "ready",
      title: "Provider profile reminders",
      detail: pendingProviders.length
        ? `${pendingProviders.length} provider profile${pendingProviders.length === 1 ? "" : "s"} waiting for review or follow-up.`
        : "No provider approval reminders needed right now.",
      actionLabel: pendingProviders.length ? "Load Queue" : "",
      action: pendingProviders.length ? loadVerificationQueue : null,
    },
    {
      id: "customer-invites",
      status: openTasks ? "ready" : "send",
      title: "Customer invitations",
      detail: openTasks
        ? `${openTasks} open customer request${openTasks === 1 ? "" : "s"} available for pilot testing.`
        : "Use the customer invitation template to get one realistic task posted.",
      actionLabel: "Refresh Tasks",
      action: refreshMarketplace,
    },
    {
      id: "feedback",
      status: completedTasks.length ? "send" : "watch",
      title: "After-test feedback",
      detail: completedTasks.length
        ? `Use the feedback template for ${completedTasks.length} completed task${completedTasks.length === 1 ? "" : "s"}.`
        : "Send feedback questions after the first completed pilot task.",
    },
    {
      id: "password-help",
      status: "watch",
      title: "Password help",
      detail: "If a pilot user forgets a password, verify them directly and never ask for passwords in group messages.",
    },
  ];
  const activeNotifications =
    activeMode === "admin"
      ? adminNotifications
      : activeMode === "customer"
        ? customerNotifications
        : providerNotifications;
  const getNotificationAttentionCount = (notification) =>
    notification.attentionCount ?? notification.count;
  const activeNotificationCount = activeNotifications.reduce(
    (sum, notification) => sum + getNotificationAttentionCount(notification),
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
      ? "Admin action items for provider approval and open demand. Supply stays visible as information."
      : activeMode === "customer"
        ? "Customer alerts for applications, assigned work, and reviews."
        : "Provider alerts for approval, applications, and accepted work.";
  const globalNotificationCount =
    activeMode === "admin"
      ? activeNotificationCount
      : activeMode === "customer"
        ? pendingCustomerApplications.length + myAssignedTasks.length + myCompletedTasks.length
        : providerApprovalGuidance.count +
          acceptedProviderApplications.length +
          pendingProviderApplications.length;
  const globalNotificationText =
    activeMode === "admin"
      ? globalNotificationCount
        ? `${globalNotificationCount} admin action${globalNotificationCount === 1 ? "" : "s"} waiting`
        : "No admin actions waiting"
      : activeMode === "customer"
        ? globalNotificationCount
          ? `${globalNotificationCount} customer action${globalNotificationCount === 1 ? "" : "s"} waiting`
          : "No customer actions waiting"
        : globalNotificationCount
          ? `${globalNotificationCount} provider update${globalNotificationCount === 1 ? "" : "s"} waiting`
          : "No provider updates waiting";
  const activeViewTitle = {
    account: "Account",
    customer: "Post a Task",
    provider: myProviderProfile ? "Update Provider Profile" : "Become a Provider",
    marketplace:
      activeMode === "admin"
        ? "Marketplace Operations"
        : activeMode === "provider"
          ? "Provider Workspace"
          : "Customer Workspace",
  }[view] || "AddisTask";
  const activeViewDescription = {
    account: "Sign in or create an account.",
    customer: "Create a customer task for local providers.",
    provider: "Create or update the profile customers will review.",
    marketplace:
      activeMode === "admin"
        ? "Review marketplace activity and admin controls."
        : activeMode === "provider"
          ? "Track approval, matching tasks, and applications."
          : "Track posted tasks, applications, and provider choices.",
  }[view] || "";
  const adminSummary = adminDataHealth?.summary || {};
  const workflowCandidates = adminDataHealth?.workflow_test_candidates || {};
  const workflowCandidateTotal = Object.values(workflowCandidates).reduce(
    (sum, count) => sum + Number(count || 0),
    0
  );
  const visibleMarketplaceTasks = [...tasks]
    .filter((task) => task.status !== "archived")
    .sort((left, right) => {
      const leftDate = left.created_at ? new Date(left.created_at).getTime() : 0;
      const rightDate = right.created_at ? new Date(right.created_at).getTime() : 0;

      if (leftDate !== rightDate) return rightDate - leftDate;
      return (right.id || 0) - (left.id || 0);
    });
  const visibleTaskReviewSummary = visibleMarketplaceTasks.reduce(
    (summary, task) => {
      const status = task.status || "open";
      return {
        ...summary,
        [status]: (summary[status] || 0) + 1,
      };
    },
    { open: 0, assigned: 0, completed: 0 }
  );
  const getTaskReviewHint = (task) => {
    const combinedText = `${task.title || ""} ${task.description || ""}`.toLowerCase();

    if (
      combinedText.includes("test") ||
      combinedText.includes("demo") ||
      combinedText.includes("temporary")
    ) {
      return "Looks like sample or test data";
    }

    if (task.status === "completed") {
      return "Completed record; hide before pilot if it is not real";
    }

    if (task.status === "assigned") {
      return "Assigned record; keep only if this is a real active job";
    }

    return "Visible open request";
  };
  const firstAdminSetupChecklist = [
    {
      id: "owner-session",
      title: "Owner account signed in",
      detail: isAdmin
        ? `${currentUser || "Owner"} is signed in with admin access.`
        : "Sign in with the owner account before preparing the pilot.",
      status: isAdmin ? "ready" : "attention",
      statusLabel: isAdmin ? "Ready" : "Needs login",
    },
    {
      id: "account-panel",
      title: "Account access checked",
      detail: "Open Account from your name in the top bar and confirm Update Password is available.",
      status: "todo",
      statusLabel: "Check once",
      actionLabel: "Open Account",
      action: () => setIsAccountModalOpen(true),
    },
    {
      id: "admin-controls",
      title: "Admin controls visible",
      detail: "Confirm Marketplace Operations, Data Management, Provider Approval Queue, and archive controls are visible only in Admin Mode.",
      status: isAdmin ? "ready" : "attention",
      statusLabel: isAdmin ? "Visible" : "Needs admin",
    },
    {
      id: "data-scan",
      title: "Data scan completed",
      detail: adminDataHealth
        ? `Latest scan found ${adminSummary.tasks ?? 0} task records and ${adminSummary.archived_tasks ?? 0} hidden tasks.`
        : "Run Scan Data before inviting pilot users.",
      status: adminDataHealth ? "ready" : "attention",
      statusLabel: adminDataHealth ? "Scanned" : "Needs scan",
      actionLabel: "Scan Data",
      action: () => loadAdminDataHealth(),
    },
    {
      id: "provider-queue",
      title: "Provider queue reviewed",
      detail: pendingProviders.length
        ? `${pendingProviders.length} provider profile${pendingProviders.length === 1 ? "" : "s"} waiting for approval review.`
        : "No provider profiles are waiting right now.",
      status: pendingProviders.length ? "attention" : "ready",
      statusLabel: pendingProviders.length ? "Review" : "Clear",
      actionLabel: pendingProviders.length ? "Load Queue" : "Refresh Providers",
      action: pendingProviders.length ? loadVerificationQueue : loadProviders,
    },
    {
      id: "owner-docs",
      title: "Owner notes ready",
      detail: "Use FIRST_ADMIN_SETUP, PILOT_LAUNCH_CHECKLIST, and PILOT_COMMUNICATION_TEMPLATES while preparing the pilot.",
      status: "ready",
      statusLabel: "Ready",
    },
  ];
  const firstAdminReadyCount = firstAdminSetupChecklist.filter(
    (item) => item.status === "ready"
  ).length;
  const pilotLaunchChecklist = [
    {
      id: "admin-access",
      title: "Admin account ready",
      detail: isAdmin
        ? `${currentUser || "Admin"} is signed in with admin tools enabled.`
        : "Sign in with the owner admin account before the pilot.",
      status: isAdmin ? "ready" : "attention",
      statusLabel: isAdmin ? "Ready" : "Needs admin",
    },
    {
      id: "account-safety",
      title: "Account safety basics",
      detail: "Logged-in users can update passwords, and repeated failed logins are temporarily limited.",
      status: "ready",
      statusLabel: "Ready",
    },
    {
      id: "provider-supply",
      title: "Trusted provider supply",
      detail: customerVisibleProviders.length
        ? `${customerVisibleProviders.length} approved trust-ready provider${customerVisibleProviders.length === 1 ? "" : "s"} visible to customers.`
        : pendingProviders.length
          ? `${pendingProviders.length} provider profile${pendingProviders.length === 1 ? "" : "s"} waiting for approval.`
          : "Approve at least one trust-ready provider before inviting customers.",
      status: customerVisibleProviders.length ? "ready" : "attention",
      statusLabel: customerVisibleProviders.length ? "Ready" : "Needs provider",
      actionLabel: pendingProviders.length ? "Load Queue" : "Refresh Providers",
      action: pendingProviders.length ? loadVerificationQueue : loadProviders,
    },
    {
      id: "marketplace-cleanup",
      title: "Marketplace records reviewed",
      detail: adminDataHealth
        ? `${visibleMarketplaceTasks.length} visible task${visibleMarketplaceTasks.length === 1 ? "" : "s"} and ${archivedTasks.length} hidden task${archivedTasks.length === 1 ? "" : "s"} after the latest scan.`
        : "Scan Data, then hide old demos or duplicate records before showing the app.",
      status: adminDataHealth ? "ready" : "attention",
      statusLabel: adminDataHealth ? "Reviewed" : "Needs scan",
      actionLabel: "Scan Data",
      action: () => loadAdminDataHealth(),
    },
    {
      id: "customer-demand",
      title: "Customer task ready",
      detail: openTasks
        ? `${openTasks} open customer request${openTasks === 1 ? "" : "s"} ready for providers to review.`
        : "Create one realistic customer task so providers can test the full flow.",
      status: openTasks ? "ready" : "attention",
      statusLabel: openTasks ? "Ready" : "Needs task",
      actionLabel: "Refresh Tasks",
      action: refreshMarketplace,
    },
    {
      id: "pilot-script",
      title: "Pilot script prepared",
      detail: "Run one customer, one provider, and one admin through the same steps.",
      status: "ready",
      statusLabel: "Ready",
    },
    {
      id: "observation-notes",
      title: "Observation notes",
      detail: "During the pilot, write down where users hesitate, scroll, or ask for help.",
      status: "todo",
      statusLabel: "Pilot day",
    },
  ];
  const pilotLaunchReadyCount = pilotLaunchChecklist.filter(
    (item) => item.status === "ready"
  ).length;
  const pilotRunChecklist = [
    {
      id: "pilot-task",
      title: "Customer task posted",
      detail: openTasks
        ? `${openTasks} open customer request${openTasks === 1 ? "" : "s"} ready for the pilot run.`
        : "Post one realistic customer task before asking a provider to apply.",
      status: openTasks ? "ready" : "attention",
      statusLabel: openTasks ? "Ready" : "Needs task",
      actionLabel: "Refresh Tasks",
      action: refreshMarketplace,
    },
    {
      id: "pilot-provider",
      title: "Trust-ready provider available",
      detail: customerVisibleProviders.length
        ? `${customerVisibleProviders.length} approved trust-ready provider${customerVisibleProviders.length === 1 ? "" : "s"} visible to customers.`
        : "Approve one trust-ready provider before running the customer/provider flow.",
      status: customerVisibleProviders.length ? "ready" : "attention",
      statusLabel: customerVisibleProviders.length ? "Ready" : "Needs provider",
      actionLabel: customerVisibleProviders.length ? "Refresh Providers" : "Load Queue",
      action: customerVisibleProviders.length ? loadProviders : loadVerificationQueue,
    },
    {
      id: "pilot-application",
      title: "Provider application recorded",
      detail: adminDataHealth
        ? `${adminSummary.applications ?? 0} provider application${Number(adminSummary.applications || 0) === 1 ? "" : "s"} recorded.`
        : "Scan Data after the provider applies to confirm application activity.",
      status: Number(adminSummary.applications || 0) > 0 ? "ready" : "todo",
      statusLabel: Number(adminSummary.applications || 0) > 0 ? "Seen" : "Watch",
      actionLabel: "Scan Data",
      action: () => loadAdminDataHealth(),
    },
    {
      id: "pilot-acceptance",
      title: "Customer accepted provider",
      detail: assignedTasks || completedTasks.length
        ? `${assignedTasks} assigned and ${completedTasks.length} completed task${completedTasks.length === 1 ? "" : "s"} found.`
        : "After a provider applies, the customer should accept one provider from Manage Task.",
      status: assignedTasks || completedTasks.length ? "ready" : "todo",
      statusLabel: assignedTasks || completedTasks.length ? "Done" : "Watch",
      actionLabel: "Refresh Tasks",
      action: refreshMarketplace,
    },
    {
      id: "pilot-messages",
      title: "Messages tested",
      detail: adminDataHealth
        ? `${adminSummary.messages ?? 0} task message${Number(adminSummary.messages || 0) === 1 ? "" : "s"} recorded.`
        : "Scan Data after customer and provider check Messages.",
      status: Number(adminSummary.messages || 0) > 0 ? "ready" : "todo",
      statusLabel: Number(adminSummary.messages || 0) > 0 ? "Seen" : "Watch",
      actionLabel: "Scan Data",
      action: () => loadAdminDataHealth(),
    },
    {
      id: "pilot-review",
      title: "Completion and review",
      detail: adminDataHealth
        ? `${completedTasks.length} completed task${completedTasks.length === 1 ? "" : "s"} and ${adminSummary.reviews ?? 0} review${Number(adminSummary.reviews || 0) === 1 ? "" : "s"} recorded.`
        : "Scan Data after the customer completes the task and leaves a review.",
      status: completedTasks.length && Number(adminSummary.reviews || 0) > 0 ? "ready" : "todo",
      statusLabel: completedTasks.length && Number(adminSummary.reviews || 0) > 0 ? "Done" : "Watch",
      actionLabel: "Scan Data",
      action: () => loadAdminDataHealth(),
    },
  ];
  const pilotRunReadyCount = pilotRunChecklist.filter(
    (item) => item.status === "ready"
  ).length;
  const formatAdminAction = (action = "") => {
    const labels = {
      archive_task: "Task hidden",
      restore_task: "Task restored",
      remind_provider: "Provider reminded",
      approved_provider: "Provider approved",
      rejected_provider: "Provider rejected",
      pending_provider: "Provider reset to pending",
    };

    return labels[action] || action.replaceAll("_", " ");
  };
  const formatAdminAuditDetail = (log) => {
    const details = log.details || {};

    if (log.entity_type === "provider") {
      const providerName = details.business_name || `Provider #${log.entity_id}`;
      const note = details.admin_notes ? `Note: ${details.admin_notes}` : "";
      const missing = details.missing_trust_requirements?.length
        ? `Missing: ${details.missing_trust_requirements.join(", ")}`
        : "";

      return [providerName, note, missing].filter(Boolean).join(" | ");
    }

    if (log.entity_type === "task") {
      const title = details.title || `Task #${log.entity_id}`;
      const reason = details.reason ? `Reason: ${details.reason}` : "";

      return [title, reason].filter(Boolean).join(" | ");
    }

    return `${log.entity_type} #${log.entity_id}`;
  };
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

    if (activeMode === "customer" && notificationId === "customer-applications") {
      const firstPendingApplication = pendingCustomerApplications[0];

      if (firstPendingApplication?.task_id) {
        const taskForReview =
          tasks.find((task) => Number(task.id) === Number(firstPendingApplication.task_id)) ||
          {
            id: firstPendingApplication.task_id,
            title: firstPendingApplication.task_title || "Selected task",
          };

        loadApplications(taskForReview);
        return;
      }

      loadCustomerApplications();
      return;
    }

    if (activeMode === "customer" && notificationId === "customer-assigned") {
      openMessagesModal(myAssignedTasks[0]?.id || "");
      return;
    }

    if (activeMode === "customer" && notificationId === "customer-reviews") {
      openReviewModal(customerReviewTasks[0]?.id || "");
      return;
    }

    if (activeMode === "provider" && notificationId === "provider-accepted") {
      openMessagesModal(acceptedProviderApplications[0]?.task_id || "");
      return;
    }

    if (activeMode === "provider" && notificationId === "provider-approval") {
      if (!myProviderProfile) {
        openProviderProfileForm();
        return;
      }

      if (
        myProviderApprovalStatus === "rejected" ||
        myProviderProfile.trust_ready === false
      ) {
        loadProviderProfileIntoForm();
        return;
      }

      setView("marketplace");
      loadMyProviderProfile({ silent: true });
      return;
    }

    if (activeMode === "provider" && notificationId === "provider-pending") {
      loadProviderApplications();
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
        <p className="muted">
          {token
            ? "Manage your account access."
            : "Sign in to post tasks, offer services, or manage approvals."}
        </p>
      </div>

      {!token ? (
        <>
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

          <div className="button-row">
            <button onClick={login}>Login</button>
            <button className="secondary-btn inline" onClick={register}>
              Register
            </button>
          </div>

          <div className="account-help-note">
            <strong>Forgot your password?</strong>
            <p>
              During the pilot, contact the AddisTask owner directly. Verified
              SMS or email reset will be added before a wider launch.
            </p>
          </div>
        </>
      ) : (
        <div className="account-security-panel">
          <div className="account-session-card">
            <span>Signed in</span>
            <strong>{currentUser}</strong>
            <small>{currentUserRole}</small>
          </div>

          <div className="password-change-card">
            <strong>Update password</strong>
            <label className="field-label">
              Current password
              <input
                placeholder="Current password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </label>

            <label className="field-label">
              New password
              <input
                placeholder="At least 6 characters"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>

            <button onClick={changePassword}>Update Password</button>
          </div>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
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
        openProviderProfileForm={openProviderProfileForm}
        showHero={view === "home"}
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
        <div
          className="active-workspace"
          ref={activeViewRef}
          tabIndex="-1"
        >
          <div>
            <span className="eyebrow">Now viewing</span>
            <strong>{activeViewTitle}</strong>
            {activeViewDescription && <p>{activeViewDescription}</p>}
          </div>

          <button className="back-btn" onClick={() => setView("home")}>
            Back Home
          </button>
        </div>
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
                    onClick={openProviderProfileForm}
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

          {myProviderProfile && (
            <div className="provider-edit-note">
              <strong>
                {myProviderProfile.trust_ready === false
                  ? "Fix only the missing approval details"
                  : "Edit only what changed"}
              </strong>
              <p>
                Your saved profile details are loaded here. Change the field you
                need, then resubmit without retyping the whole profile.
              </p>
              {myProviderProfile.trust_ready === false && (
                <div className="trust-list compact">
                  {(myProviderProfile.missing_trust_requirements || []).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              )}
            </div>
          )}

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

          <ProviderTrustSummary provider={providerTrustDraft} />

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
              {activeNotifications.map((notification) => {
                const attentionCount = getNotificationAttentionCount(notification);

                return (
                  <div className="notification-card" key={notification.id}>
                    <span className={attentionCount ? "notification-count active" : "notification-count"}>
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
                );
              })}
            </div>

            {activeMode === "admin" && (
              <div className="owner-setup-panel">
                <div className="pilot-launch-header">
                  <div>
                    <span className="eyebrow">Owner setup</span>
                    <strong>First admin checklist</strong>
                    <p>
                      Confirm the owner account and admin controls before inviting pilot users.
                    </p>
                  </div>
                  <span className="pilot-launch-score">
                    {firstAdminReadyCount}/{firstAdminSetupChecklist.length} ready
                  </span>
                </div>

                <div className="pilot-launch-list">
                  {firstAdminSetupChecklist.map((item) => (
                    <div className={`pilot-launch-item ${item.status}`} key={item.id}>
                      <span className={`pilot-status-dot ${item.status}`} />
                      <div>
                        <div className="pilot-launch-item-header">
                          <strong>{item.title}</strong>
                          <span>{item.statusLabel}</span>
                        </div>
                        <p>{item.detail}</p>
                      </div>
                      {item.action && (
                        <button
                          className="secondary-btn inline"
                          onClick={item.action}
                        >
                          {item.actionLabel}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeMode === "admin" && (
              <div className="pilot-launch-panel">
                <div className="pilot-launch-header">
                  <div>
                    <span className="eyebrow">Pilot readiness</span>
                    <strong>Launch checklist</strong>
                    <p>
                      Quick owner review before inviting real customers and providers.
                    </p>
                  </div>
                  <span className="pilot-launch-score">
                    {pilotLaunchReadyCount}/{pilotLaunchChecklist.length} ready
                  </span>
                </div>

                <div className="pilot-launch-list">
                  {pilotLaunchChecklist.map((item) => (
                    <div className={`pilot-launch-item ${item.status}`} key={item.id}>
                      <span className={`pilot-status-dot ${item.status}`} />
                      <div>
                        <div className="pilot-launch-item-header">
                          <strong>{item.title}</strong>
                          <span>{item.statusLabel}</span>
                        </div>
                        <p>{item.detail}</p>
                      </div>
                      {item.action && (
                        <button
                          className="secondary-btn inline"
                          onClick={item.action}
                        >
                          {item.actionLabel}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeMode === "admin" && (
              <div className="manual-message-panel">
                <div className="pilot-launch-header">
                  <div>
                    <span className="eyebrow">Manual outreach</span>
                    <strong>Pilot messages to watch</strong>
                    <p>
                      Use the prepared templates while SMS/email automation is not active.
                    </p>
                  </div>
                </div>

                <div className="manual-message-list">
                  {manualPilotMessages.map((message) => (
                    <div className={`manual-message-card ${message.status}`} key={message.id}>
                      <span>{message.status === "send" ? "Send now" : message.status}</span>
                      <div>
                        <strong>{message.title}</strong>
                        <p>{message.detail}</p>
                      </div>
                      {message.action && (
                        <button
                          className="secondary-btn inline"
                          onClick={message.action}
                        >
                          {message.actionLabel}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeMode === "admin" && (
              <div className="pilot-run-panel">
                <div className="pilot-launch-header">
                  <div>
                    <span className="eyebrow">Pilot run</span>
                    <strong>Controlled test flow</strong>
                    <p>
                      Track one customer/provider transaction from posted task to review.
                    </p>
                  </div>
                  <span className="pilot-launch-score">
                    {pilotRunReadyCount}/{pilotRunChecklist.length} done
                  </span>
                </div>

                <div className="pilot-launch-list">
                  {pilotRunChecklist.map((item) => (
                    <div className={`pilot-launch-item ${item.status}`} key={item.id}>
                      <span className={`pilot-status-dot ${item.status}`} />
                      <div>
                        <div className="pilot-launch-item-header">
                          <strong>{item.title}</strong>
                          <span>{item.statusLabel}</span>
                        </div>
                        <p>{item.detail}</p>
                      </div>
                      {item.action && (
                        <button
                          className="secondary-btn inline"
                          onClick={item.action}
                        >
                          {item.actionLabel}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
          <section className="card wide admin-data-card">
            <div className="section-header">
              <div>
                <h2>Data Management</h2>
                <p className="muted">
                  Scan records, clean known workflow-test data, and manage hidden tasks.
                </p>
              </div>

              <div className="toolbar-actions">
                <button onClick={() => loadAdminDataHealth()}>
                  Scan Data
                </button>
                <button
                  className="secondary-btn inline"
                  disabled={!adminDataHealth || workflowCandidateTotal === 0}
                  onClick={cleanupWorkflowTestData}
                >
                  Clean Workflow Tests
                </button>
              </div>
            </div>

            <div className="activity-summary data-health-grid">
              <div>
                <span>Users</span>
                <strong>{adminSummary.users ?? "-"}</strong>
              </div>
              <div>
                <span>Tasks</span>
                <strong>{adminSummary.tasks ?? "-"}</strong>
              </div>
              <div>
                <span>Hidden tasks</span>
                <strong>{adminSummary.archived_tasks ?? "-"}</strong>
              </div>
              <div>
                <span>Providers</span>
                <strong>{adminSummary.providers ?? "-"}</strong>
              </div>
              <div>
                <span>Applications</span>
                <strong>{adminSummary.applications ?? "-"}</strong>
              </div>
              <div>
                <span>Messages</span>
                <strong>{adminSummary.messages ?? "-"}</strong>
              </div>
              <div>
                <span>Reviews</span>
                <strong>{adminSummary.reviews ?? "-"}</strong>
              </div>
            </div>

            <div className="data-cleanup-panel">
              <div>
                <strong>Workflow-test cleanup candidates</strong>
                <p>
                  This cleanup targets only known automated workflow-test records,
                  not real customer tasks or provider profiles.
                </p>
                {adminDataStatus && <span>{adminDataStatus}</span>}
              </div>

              <div className="cleanup-count-grid">
                <div>
                  <span>Users</span>
                  <strong>{workflowCandidates.users ?? "-"}</strong>
                </div>
                <div>
                  <span>Tasks</span>
                  <strong>{workflowCandidates.tasks ?? "-"}</strong>
                </div>
                <div>
                  <span>Providers</span>
                  <strong>{workflowCandidates.providers ?? "-"}</strong>
                </div>
                <div>
                  <span>Linked records</span>
                  <strong>
                    {adminDataHealth
                      ? Number(workflowCandidates.applications || 0) +
                        Number(workflowCandidates.messages || 0) +
                        Number(workflowCandidates.reviews || 0)
                      : "-"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="data-cleanup-panel archive-control-panel active-task-review-panel">
              <div>
                <strong>Pilot cleanup review</strong>
                <p>
                  Review the tasks that are still visible in the marketplace.
                  Hide old demos, duplicates, or records you do not want pilot
                  users to see.
                </p>
                <button
                  className="secondary-btn inline"
                  onClick={refreshMarketplace}
                >
                  Refresh Visible Tasks
                </button>
              </div>

              <div className="active-task-review">
                <div className="cleanup-count-grid active-task-counts">
                  <div>
                    <span>Open</span>
                    <strong>{visibleTaskReviewSummary.open || 0}</strong>
                  </div>
                  <div>
                    <span>Assigned</span>
                    <strong>{visibleTaskReviewSummary.assigned || 0}</strong>
                  </div>
                  <div>
                    <span>Completed</span>
                    <strong>{visibleTaskReviewSummary.completed || 0}</strong>
                  </div>
                  <div>
                    <span>Visible total</span>
                    <strong>{visibleMarketplaceTasks.length}</strong>
                  </div>
                </div>

                <div className="archive-list review-task-list">
                  {visibleMarketplaceTasks.length === 0 && (
                    <div className="empty-state compact-empty">
                      No visible marketplace tasks right now.
                    </div>
                  )}

                  {visibleMarketplaceTasks.map((task) => (
                    <div className="archive-task-row review-task-row" key={task.id}>
                      <div>
                        <strong>{task.title}</strong>
                        <span>
                          {task.category} | {task.location} | {task.status || "open"}
                        </span>
                        <p>{getTaskReviewHint(task)}</p>
                      </div>
                      <button
                        className="secondary-btn inline danger-btn"
                        onClick={() => archiveTask(task)}
                      >
                        Hide
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="data-cleanup-panel archive-control-panel">
              <div>
                <strong>Hidden marketplace tasks</strong>
                <p>
                  Archive old, duplicate, or unsafe tasks without deleting their
                  history. Hidden tasks are not shown to customers or providers.
                </p>
                <button
                  className="secondary-btn inline"
                  onClick={() => loadAdminDataHealth()}
                >
                  Refresh Hidden Tasks
                </button>
              </div>

              <div className="archive-list">
                {archivedTasks.length === 0 && (
                  <div className="empty-state compact-empty">
                    No hidden tasks right now.
                  </div>
                )}

                {archivedTasks.map((task) => (
                  <div className="archive-task-row" key={task.id}>
                    <div>
                      <strong>{task.title}</strong>
                      <span>{task.category} | {task.location}</span>
                      <p>{task.archive_reason}</p>
                    </div>
                    <button
                      className="secondary-btn inline"
                      onClick={() => restoreArchivedTask(task.id)}
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-audit-panel">
              <div>
                <strong>Admin history</strong>
                <p>Recent marketplace management actions.</p>
              </div>

              <div className="audit-log-list">
                {adminAuditLog.length === 0 && (
                  <div className="empty-state compact-empty">
                    No admin actions recorded yet.
                  </div>
                )}

                {adminAuditLog.map((log) => (
                  <div className="audit-log-row" key={log.id}>
                    <div>
                      <strong>{formatAdminAction(log.action)}</strong>
                      <span>{formatAdminAuditDetail(log)}</span>
                    </div>
                    <small>
                      {log.created_at
                        ? new Date(log.created_at).toLocaleString()
                        : "Just now"}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </section>
          )}

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
                <strong>{providerQueueSource.length}</strong>
              </div>
              <div>
                <span>Ready to approve</span>
                <strong>{providerQueueReadyCount}</strong>
              </div>
              <div>
                <span>Need updates</span>
                <strong>{providerQueueNeedsDetailsCount}</strong>
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

                  <div className={`admin-readiness-banner ${provider.trust_ready ? "ready" : "attention"}`}>
                    <strong>
                      {provider.trust_ready ? "Ready for approval decision" : "Needs provider update"}
                    </strong>
                    <p>
                      {provider.trust_ready
                        ? "This profile has the required trust details. Approve it if the service looks legitimate."
                        : "Ask the provider to complete the missing items before approval."}
                    </p>
                  </div>

                  <ProviderTrustSummary provider={provider} />

                  {provider.trust_ready === false && (
                    <div className="provider-reminder-panel">
                      <div>
                        <strong>Provider reminder</strong>
                        <p>{getProviderReminderMessage(provider)}</p>
                      </div>
                      <button
                        className="secondary-btn inline"
                        onClick={() => copyProviderReminder(provider)}
                      >
                        Copy Reminder
                      </button>
                    </div>
                  )}

                  <div className="admin-review-grid">
                    <div>
                      <span>Trust readiness</span>
                      <strong>{provider.trust_score ?? 0}%</strong>
                    </div>
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
                      <p>
                        {provider.trust_ready === false
                          ? "Complete the trust checklist before approval."
                          : "Approve only when the profile has enough trust information for customers."}
                      </p>
                      {provider.trust_ready === false && (
                        <ul className="missing-trust-list">
                          {(provider.missing_trust_requirements || []).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
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
                      <button
                        className={provider.trust_ready === false ? "secondary-btn inline attention-btn" : ""}
                        onClick={() => updateProviderApproval(provider, "approved")}
                      >
                        Approve Provider
                      </button>
                      <button
                        className="secondary-btn inline"
                        onClick={() => updateProviderApproval(provider, "rejected")}
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

          {activeMode === "customer" && (
            <CustomerDashboard
              pendingCustomerApplications={pendingCustomerApplications}
              myAssignedTasks={myAssignedTasks}
              customerPaymentSummary={customerPaymentSummary}
              customerReviewTasks={customerReviewTasks}
              myOpenTasks={myOpenTasks}
              myCompletedTasks={myCompletedTasks}
              applicationsTask={applicationsTask}
              applications={applications}
              applicationsError={applicationsError}
              applicationsLoading={applicationsLoading}
              isApplicationsModalOpen={isApplicationsModalOpen}
              closeApplicationsModal={closeApplicationsModal}
              openProviderProfile={openProviderProfileFromApplications}
              updateApplicationStatus={updateApplicationStatus}
              openApplicationsWindow={() => runNotificationAction("customer-applications")}
              openMessagesWindow={() => runNotificationAction("customer-assigned")}
              openReviewWindow={() => runNotificationAction("customer-reviews")}
            />
          )}

          {activeMode === "provider" && (
            <ProviderDashboard
              myProviderApprovalStatus={myProviderApprovalStatus}
              providerActionableOpenTasks={providerActionableOpenTasks}
              pendingProviderApplications={pendingProviderApplications}
              acceptedProviderApplications={acceptedProviderApplications}
              rejectedProviderApplications={rejectedProviderApplications}
              myProviderProfile={myProviderProfile}
              providerApprovalGuidance={providerApprovalGuidance}
              approvedProviders={approvedProviders}
              pendingProviders={pendingProviders}
              loadMyProviderProfile={loadMyProviderProfile}
              openProviderProfileForm={openProviderProfileForm}
              loadProviderProfileIntoForm={loadProviderProfileIntoForm}
              loadProviderApplications={loadProviderApplications}
              providerActivityLoadedAt={providerActivityLoadedAt}
              providerApplications={providerApplications}
              getProviderApplicationNotice={getProviderApplicationNotice}
              applyToTask={applyToTask}
              openProviderMessages={() => runNotificationAction("provider-accepted")}
            />
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
            customerApplications={customerApplications}
            customerReviewTasks={customerReviewTasks}
            openMessagesModal={openMessagesModal}
            openReviewModal={openReviewModal}
            activeMode={activeMode}
            currentUserId={currentUserId}
            providerApprovalStatus={myProviderApprovalStatus}
            providerApplications={providerApplications}
            archiveTask={isAdmin ? archiveTask : null}
          />

          <MatchedProviders
            selectedTask={selectedTask}
            selectedTaskInfo={selectedMatchTask}
            matches={matches}
            openProviderProfile={openProviderProfile}
            saveProvider={saveProvider}
            savedProviderIds={savedProviders.map((provider) => Number(provider.id))}
            isOpen={isMatchesModalOpen}
            onClose={() => setIsMatchesModalOpen(false)}
          />

          {selectedProviderProfile && (
            <ProviderProfilePanel
              provider={selectedProviderProfile}
              reviews={selectedProviderReviews}
              onClose={() => {
                setSelectedProviderProfile(null);
                setSelectedProviderReviews([]);
              }}
              saveProvider={saveProvider}
            />
          )}

          {activeMode === "customer" && (
            <ProviderDirectoryPanel
              searchCategory={searchCategory}
              searchLocation={searchLocation}
              totalProviderCount={providers.length}
              customerVisibleProviderCount={customerVisibleProviders.length}
              loadProviders={loadProviders}
              clearProviderFilters={() => {
                setSearchCategory("");
                setSearchLocation("");
              }}
              filteredProviders={filteredProviders}
              savedProviders={savedProviders}
              openProviderProfile={openProviderProfile}
              saveProvider={saveProvider}
              removeSavedProvider={removeSavedProvider}
            />
          )}

          {(activeMode === "customer" || activeMode === "provider") && (
            <MessagePanel
              messageEligibleTasks={messageEligibleTasks}
              messageTaskId={messageTaskId}
              onSelectTask={(taskId) => {
                setMessageTaskId(taskId);
                setTaskMessages([]);
              }}
              loadMessages={loadMessages}
              taskMessages={taskMessages}
              messagesLoading={messagesLoading}
              messageBody={messageBody}
              setMessageBody={setMessageBody}
              sendMessage={sendMessage}
              isMessagesModalOpen={isMessagesModalOpen}
              closeMessagesModal={closeMessagesModal}
            />
          )}

          {activeMode === "customer" && (
            <ReviewPanel
              customerReviewTasks={customerReviewTasks}
              reviewTaskId={reviewTaskId}
              setReviewTaskId={setReviewTaskId}
              reviewRating={reviewRating}
              setReviewRating={setReviewRating}
              reviewComment={reviewComment}
              setReviewComment={setReviewComment}
              submitReview={submitReview}
              isReviewModalOpen={isReviewModalOpen}
              closeReviewModal={closeReviewModal}
            />
          )}
        </>
      )}
    </div>
  );
}
