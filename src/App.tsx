import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { usePageTitle } from "@/hooks/usePageTitle";
import type { Role } from "@/types";
import { PRIYA_SHARMA, ANJALI_MEHTA, ROHAN_DESAI } from "@/data/mockData";

import Navbar from "@/components/layout/Navbar";
import MegaMenu from "@/components/layout/MegaMenu";
import ConsentModal from "@/components/shared/ConsentModal";
import OrientationModal from "@/components/shared/OrientationModal";
import Chatbot from "@/components/shared/Chatbot";
import FeedbackModal from "@/components/shared/FeedbackModal";
import SupportModal from "@/components/shared/SupportModal";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

import HomeView from "@/views/HomeView";
import LoginView from "@/views/LoginView";
import RegisterRoleView from "@/views/RegisterRoleView";
import RegisterFormView from "@/views/RegisterFormView";
import OtpChannelView from "@/views/OtpChannelView";
import OtpView from "@/views/OtpView";
import ForgotPasswordView from "@/views/ForgotPasswordView";
import DashboardView from "@/views/DashboardView";
import NGODashboardView from "@/views/NGODashboardView";
import CreateProjectView from "@/views/CreateProjectView";
import ActiveProjectManagementView from "@/views/ActiveProjectManagementView";
import ProjectFeedbackView from "@/views/ProjectFeedbackView";
import ProfileView from "@/views/ProfileView";
import TVWHubView from "@/views/TVWHubView";
import TVWVibeView from "@/views/TVWVibeView";
import ProEngageView from "@/views/ProEngageView";
import DisasterResponseView from "@/views/DisasterResponseView";
import DRPrototypeView from "@/views/DRPrototypeView";
import DRAvailabilityForm from "@/views/DRAvailabilityForm";
import DRConfirmationView from "@/views/DRConfirmationView";
import SPOCDashboardView from "@/views/SPOCDashboardView";
import AdminDashboardView from "@/views/AdminDashboardView";
import NotFound from "@/pages/NotFound";

export default function App() {
  const { user, setUser, isLoggedIn, setIsLoggedIn, handleLogout: authLogout } = useAuth();
  const navigate = useAppNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [isOrientationDismissed, setIsOrientationDismissed] = useState(false);
  const [showOrientationModal, setShowOrientationModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [appliedProjects, setAppliedProjects] = useState<number[]>([]);
  const [likedProjects, setLikedProjects] = useState<number[]>([]);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [otpChannel, setOtpChannel] = useState<"phone" | "email">("email");
  const [projectStatus, setProjectStatus] = useState<"matched" | "active" | "completed">("matched");
  const [showPulseCheck, setShowPulseCheck] = useState(true);
  const [pulseCheckSubmitted, setPulseCheckSubmitted] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [referralCount, setReferralCount] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDRActive, setIsDRActive] = useState(false);
  const [drResponses, setDrResponses] = useState<any[]>([]);
  const [hasSubmittedAvailability, setHasSubmittedAvailability] = useState(false);
  const [drDeploymentLog, setDrDeploymentLog] = useState<any[]>([]);
  const [isDRClosed, setIsDRClosed] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: "bot", text: "Hi! I'm your Tata Engage assistant. Ask me anything about programmes, applications, or deadlines." }
  ]);
  const [clonedProject, setClonedProject] = useState<any>(null);
  const [activeProject, setActiveProject] = useState<any>(null);
  const [supportHistory, setSupportHistory] = useState<any[]>([]);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportSubject, setSupportSubject] = useState("");
  const [ngoData, setNgoData] = useState(ANJALI_MEHTA);
  const [adminActiveTab, setAdminActiveTab] = useState("Dashboard");
  const [auditLogs, setAuditLogs] = useState<any[]>([
    { id: 1, timestamp: new Date().toISOString(), action: "User Login", user: "Vikram Nair", details: "Admin session started" }
  ]);

  const addAuditLog = (action: string, details: string) => {
    const newLog = {
      id: auditLogs.length + 1,
      timestamp: new Date().toISOString(),
      action,
      user: "Vikram Nair",
      details
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setFormStep(1);
    navigate("register-form");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === "corporate_spoc") {
      triggerToast("SPOC roles are assigned by TSG Admin. Your request has been submitted for review.");
      return;
    }
    setIsConsentOpen(true);
  };

  const handleConsentAccept = () => {
    setIsConsentOpen(false);
    if (selectedRole === "tata_employee" && formData.email?.endsWith("@tata.com")) {
      setIsLoggedIn(true);
      setUser(PRIYA_SHARMA);
      navigate("dashboard");
      triggerToast("Login Successful! Welcome back, Priya.");
    } else if (selectedRole === "ngo") {
      setIsLoggedIn(true);
      setUser(ANJALI_MEHTA);
      navigate("ngo-dashboard");
      triggerToast("Login Successful! Welcome, Anjali Mehta.");
    } else if (selectedRole === "corporate_spoc") {
      setIsLoggedIn(true);
      setUser(ROHAN_DESAI);
      navigate("spoc-dashboard");
      triggerToast("Login Successful! Welcome back, Rohan.");
    } else {
      navigate("otp-channel");
    }
  };

  const handleOtpChannelSelect = () => { navigate("otp"); };
  const handleOtpVerify = () => { setIsLoggedIn(true); setUser(PRIYA_SHARMA); navigate("dashboard"); triggerToast("Registration Successful! Welcome to Tata Engage."); };

  const onLogout = () => {
    authLogout();
    navigate("home");
    triggerToast("Logged out successfully.");
  };

  const ctx = {
    selectedRole, setSelectedRole,
    isMenuOpen, setIsMenuOpen, isConsentOpen, setIsConsentOpen,
    isOrientationDismissed, setIsOrientationDismissed,
    showOrientationModal, setShowOrientationModal,
    otp, setOtp, showToast, setShowToast, toastMessage, setToastMessage,
    registeredEvents, setRegisteredEvents, appliedProjects, setAppliedProjects,
    likedProjects, setLikedProjects, formStep, setFormStep,
    formData, setFormData, otpChannel, setOtpChannel,
    projectStatus, setProjectStatus, showPulseCheck, setShowPulseCheck,
    pulseCheckSubmitted, setPulseCheckSubmitted,
    showFeedbackForm, setShowFeedbackForm, feedbackSubmitted, setFeedbackSubmitted,
    referralCount, setReferralCount, isChatOpen, setIsChatOpen,
    isDRActive, setIsDRActive, drResponses, setDrResponses,
    hasSubmittedAvailability, setHasSubmittedAvailability,
    drDeploymentLog, setDrDeploymentLog, isDRClosed, setIsDRClosed,
    chatMessages, setChatMessages, clonedProject, setClonedProject,
    activeProject, setActiveProject, supportHistory, setSupportHistory,
    showSupportModal, setShowSupportModal, supportSubject, setSupportSubject,
    ngoData, setNgoData, adminActiveTab, setAdminActiveTab,
    auditLogs, setAuditLogs,
    addAuditLog, triggerToast,
    handleRoleSelect, handleFormSubmit, handleConsentAccept,
    handleOtpChannelSelect, handleOtpVerify,
  };

  return (
    <AppContext.Provider value={ctx}>
      <div className="relative min-h-screen">
        <Navbar
          onNavigate={navigate}
          isLoggedIn={isLoggedIn}
          onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
          user={user}
        />
        <MegaMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          isLoggedIn={isLoggedIn}
          onNavigate={navigate}
          onLogout={onLogout}
          user={user}
        />
        <ConsentModal
          isOpen={isConsentOpen}
          onAccept={handleConsentAccept}
          onCancel={() => setIsConsentOpen(false)}
        />

        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Routes location={location}>
                <Route path="/" element={<HomeView />} />
                <Route path="/login" element={<LoginView />} />
                <Route path="/register" element={<RegisterRoleView />} />
                <Route path="/register/form" element={<RegisterFormView />} />
                <Route path="/otp/channel" element={<OtpChannelView />} />
                <Route path="/otp/verify" element={<OtpView />} />
                <Route path="/forgot-password" element={<ForgotPasswordView />} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} />
                <Route path="/ngo/dashboard" element={<ProtectedRoute><NGODashboardView /></ProtectedRoute>} />
                <Route path="/projects/create" element={<ProtectedRoute><CreateProjectView /></ProtectedRoute>} />
                <Route path="/projects/active" element={<ProtectedRoute><ActiveProjectManagementView project={activeProject} /></ProtectedRoute>} />
                <Route path="/projects/feedback" element={<ProtectedRoute><ProjectFeedbackView project={activeProject} /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />
                <Route path="/tvw" element={<ProtectedRoute><TVWHubView /></ProtectedRoute>} />
                <Route path="/tvw/vibe" element={<TVWVibeView />} />
                <Route path="/proengage" element={<ProtectedRoute><ProEngageView /></ProtectedRoute>} />
                <Route path="/disaster-response" element={<DisasterResponseView />} />
                <Route path="/disaster-response/prototype" element={<ProtectedRoute><DRPrototypeView /></ProtectedRoute>} />
                <Route path="/disaster-response/availability" element={<ProtectedRoute><DRAvailabilityForm /></ProtectedRoute>} />
                <Route path="/disaster-response/confirmation" element={<ProtectedRoute><DRConfirmationView /></ProtectedRoute>} />
                <Route path="/spoc/dashboard" element={<ProtectedRoute><SPOCDashboardView /></ProtectedRoute>} />
                <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardView /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>

        {isLoggedIn && <Chatbot />}
        {showOrientationModal && <OrientationModal />}
        <FeedbackModal />
        <SupportModal />

        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-zinc-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md"
            >
              <CheckCircle2 size={24} className="text-tata-cyan" />
              <span className="font-bold">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
}
