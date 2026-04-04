import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import type { View, Role } from "@/types";
import { PRIYA_SHARMA, ANJALI_MEHTA, ROHAN_DESAI } from "@/data/mockData";

import Navbar from "@/components/layout/Navbar";
import MegaMenu from "@/components/layout/MegaMenu";
import ConsentModal from "@/components/shared/ConsentModal";
import OrientationModal from "@/components/shared/OrientationModal";
import Chatbot from "@/components/shared/Chatbot";
import FeedbackModal from "@/components/shared/FeedbackModal";
import SupportModal from "@/components/shared/SupportModal";

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

export default function App() {
  const [view, setView] = useState<View>("home");
  const [prevView, setPrevView] = useState<View>("home");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(PRIYA_SHARMA);
  const userRole = user.role;
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
    { role: "bot", text: "Hi Priya! I'm your Tata Engage assistant. Ask me anything about programmes, applications, or deadlines." }
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

  const navigate = (newView: View) => {
    setPrevView(view);
    setView(newView);
    if (newView === "register-role") setFormStep(1);
    window.scrollTo(0, 0);
  };

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
  const handleOtpVerify = () => { setIsLoggedIn(true); navigate("dashboard"); triggerToast("Registration Successful! Welcome to Tata Engage."); };
  const handleLogout = () => { setIsLoggedIn(false); setUser(PRIYA_SHARMA); navigate("home"); triggerToast("Logged out successfully."); };

  const ctx = {
    view, setView, prevView, setPrevView, selectedRole, setSelectedRole,
    isMenuOpen, setIsMenuOpen, isConsentOpen, setIsConsentOpen,
    isLoggedIn, setIsLoggedIn, user, setUser, userRole,
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
    navigate, addAuditLog, triggerToast,
    handleRoleSelect, handleFormSubmit, handleConsentAccept,
    handleOtpChannelSelect, handleOtpVerify, handleLogout,
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
          onLogout={handleLogout}
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
              key={view}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {view === "home" && <HomeView />}
              {view === "login" && <LoginView />}
              {view === "register-role" && <RegisterRoleView />}
              {view === "register-form" && <RegisterFormView />}
              {view === "otp-channel" && <OtpChannelView />}
              {view === "otp" && <OtpView />}
              {view === "forgot-password" && <ForgotPasswordView />}
              {view === "dashboard" && <DashboardView />}
              {view === "ngo-dashboard" && <NGODashboardView />}
              {view === "create-project" && <CreateProjectView />}
              {view === "active-project-management" && <ActiveProjectManagementView project={activeProject} />}
              {view === "project-feedback" && <ProjectFeedbackView project={activeProject} />}
              {view === "profile" && <ProfileView />}
              {view === "tvw" && <TVWHubView />}
              {view === "tvw-vibe" && <TVWVibeView />}
              {view === "proengage" && <ProEngageView />}
              {view === "disaster-response" && <DisasterResponseView />}
              {view === "dr-prototype" && <DRPrototypeView />}
              {view === "dr-availability-form" && <DRAvailabilityForm />}
              {view === "dr-confirmation" && <DRConfirmationView />}
              {view === "spoc-dashboard" && <SPOCDashboardView />}
              {view === "admin-dashboard" && <AdminDashboardView />}
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
