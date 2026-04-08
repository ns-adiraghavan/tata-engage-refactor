import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, User, Users, Briefcase, ShieldCheck, Lock, Eye, CheckCircle2, Search, ExternalLink, Calendar, MapPin, Clock, Award, Info, Filter, CalendarDays, LayoutGrid, Send, FileText, Check, ChevronDown, Sparkles, MessageSquare, ArrowRight, Plus, Edit2, Save, Copy, Pause, History, AlertTriangle, Activity, Download, Upload, Trophy, Share2, File, Archive } from "lucide-react";
import type { View, Role } from "@/types";
import { ROHAN_DESAI, ANJALI_GUPTA_REGIONAL, SPOC_DIRECTORY, PENDING_APPROVALS_DATA, TCS_TVW_EVENTS, PROENGAGE_PIPELINE, AT_RISK_VOLUNTEERS, OPEN_PROENGAGE_PROJECTS, COMPANY_LEADERBOARD, VOLUNTEER_CERTIFICATES, FEEDBACK_MONITOR_DATA, COMMUNITY_TESTIMONIALS } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";
import { IS_PE_SEASON } from "@/data/mockData";
import RoleToggle from "@/components/shared/RoleToggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SPOCDashboardView = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { isOrientationDismissed, setIsOrientationDismissed, setShowOrientationModal, setShowToast, setToastMessage, formData, drResponses } = useAppContext();
  
  // Regional vs Corporate SPOC — derived from logged-in user role
  const isRegionalSPOC = user?.role === "regional_spoc";
  const spoc = isRegionalSPOC ? ANJALI_GUPTA_REGIONAL : ROHAN_DESAI;
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [spocs, setSpocs] = useState(SPOC_DIRECTORY);
  const [approvals, setApprovals] = useState(PENDING_APPROVALS_DATA);
  const [tvwEvents, setTvwEvents] = useState(TCS_TVW_EVENTS);
  
  // Directory State
  const [directorySearch, setDirectorySearch] = useState("");
  const [directoryFilter, setDirectoryFilter] = useState("All");
  const [showAddSpoc, setShowAddSpoc] = useState(false);
  const [editingSpoc, setEditingSpoc] = useState<any>(null);
  const [deactivatingSpoc, setDeactivatingSpoc] = useState<any>(null);

  // Approvals State
  const [approvalTab, setApprovalTab] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [rejectingApproval, setRejectingApproval] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // TVW State
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showVibeModal, setShowVibeModal] = useState<any>(null);
  const [expandedHoursLog, setExpandedHoursLog] = useState<number | null>(null);
  const [tvwFilters, setTvwFilters] = useState({ region: "All", status: "All" });
  const [vibeForm, setVibeForm] = useState({ caption: "", location: "", impact: "" });

  // ProEngage State
  const [proEngageEdition, setProEngageEdition] = useState<"2025" | "All Time">("2025");
  const [proEngageSearch, setProEngageSearch] = useState("");
  const [selectedProEngageVolunteer, setSelectedProEngageVolunteer] = useState<any>(null);
  const [atRiskList, setAtRiskList] = useState(AT_RISK_VOLUNTEERS);
  

  // Reports & Certificates State
  const [reportsTab, setReportsTab] = useState<"Leaderboard" | "Certificates" | "Feedback">("Leaderboard");
  const [feedbackReminders, setFeedbackReminders] = useState(FEEDBACK_MONITOR_DATA);
  const [showCertificatePreview, setShowCertificatePreview] = useState<any>(null);

  const sectionIds: Record<string, string> = {
    "Dashboard": "spoc-section-dashboard",
    "ProEngage Oversight": "spoc-section-proengage",
    "TVW Management": "spoc-section-tvw",
    "SPOC Directory": "spoc-section-directory",
    "Verification": "spoc-section-verification",
    "Reports & Certificates": "spoc-section-reports",
    "Campaign Kit": "spoc-section-campaign-kit",
  };

  const allNavItems = [
    { name: "Dashboard", icon: LayoutGrid },
    { name: "TVW Management", icon: CalendarDays },
    { name: "ProEngage Oversight", icon: Briefcase, corporateOnly: true },
    { name: "SPOC Directory", icon: Users, corporateOnly: true },
    { name: "Verification", icon: ShieldCheck, badge: approvals.filter(a => a.status === "Pending").length },
    { name: "Reports & Certificates", icon: FileText },
    { name: "Campaign Kit", icon: Download }
  ];

  const navItems = isRegionalSPOC 
    ? allNavItems.filter(item => !item.corporateOnly) 
    : allNavItems;

  const handleNavClick = (name: string) => {
    setActiveNav(name);
    const id = sectionIds[name];
    if (id) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };


  const handleApprove = (id: number) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: "Approved" } : a));
    setToastMessage("Welcome email sent to volunteer!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReject = () => {
    if (!rejectingApproval || !rejectionReason) return;
    setApprovals(prev => prev.map(a => a.id === rejectingApproval.id ? { ...a, status: "Rejected", rejectionReason } : a));
    setRejectingApproval(null);
    setRejectionReason("");
  };

  const handleUpdateHours = (eventId: number, volunteerId: number, newHours: number) => {
    setTvwEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          volunteers: event.volunteers.map(v => v.id === volunteerId ? { ...v, hours: newHours, confirmed: true } : v)
        };
      }
      return event;
    }));
    const volunteer = tvwEvents.find(e => e.id === eventId)?.volunteers.find(v => v.id === volunteerId);
    setToastMessage(`Hours updated for ${volunteer?.name}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newEvent = {
      id: tvwEvents.length + 1,
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      mode: formData.get("mode") as string,
      venue: formData.get("venue") as string,
      capacity: `0/${formData.get("capacity")}`,
      status: "Upcoming",
      region: "West India",
      volunteeringHours: Number(formData.get("hours")),
      openToAll: formData.get("openToAll") === "on",
      createdBy: `${spoc.firstName} ${spoc.lastName}`,
      volunteers: [] as any[]
    } as any;
    setTvwEvents([newEvent, ...tvwEvents]);
    setShowCreateEvent(false);
    setToastMessage("Event posted to TVW Calendar. Live within 5 minutes.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleVibeSubmit = () => {
    if (!showVibeModal) return;
    setTvwEvents(prev => prev.map(e => e.id === showVibeModal.id ? { ...e, vibeStatus: "Pending Admin Review" } : e));
    setShowVibeModal(null);
    setVibeForm({ caption: "", location: "", impact: "" });
    setToastMessage("Vibe update submitted for admin review!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSendNudge = (id: number) => {
    setAtRiskList(prev => prev.map(v => v.id === id ? { ...v, nudged: true } : v));
    setToastMessage("Nudge sent to volunteer and logged in activity trail.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // ─── ProEngage Oversight Panel ────────────────────────────────────────
  const ProEngageOversightPanel = () => {
    const [peProject, setPeProject] = useState<any | null>(null);
    const filteredPipeline = PROENGAGE_PIPELINE.filter(v => 
      v.name.toLowerCase().includes(proEngageSearch.toLowerCase()) ||
      v.project.toLowerCase().includes(proEngageSearch.toLowerCase()) ||
      v.ngo.toLowerCase().includes(proEngageSearch.toLowerCase())
    );

    const stats = proEngageEdition === "2025" ? {
      applicants: 124,
      matched: 86,
      active: 42,
      completed: 12,
      paused: 8,
      dropped: 4,
      rejected: 15,
      drParticipants: drResponses.length
    } : {
      applicants: 1540,
      matched: 1120,
      active: 42,
      completed: 980,
      paused: 15,
      dropped: 45,
      rejected: 120,
      drParticipants: drResponses.length + 150
    };

    return (
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pipeline</p>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">ProEngage Oversight</h2>
            <p className="text-slate-500 font-medium">
              {spoc.tier === "Corporate SPOC" 
                ? "Monitoring volunteer pipeline across all Tata subsidiaries." 
                : "Monitoring TCS's volunteer pipeline across Tata ProEngage."}
            </p>
          </div>
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl shadow-inner">
            {["2025", "All Time"].map((edition) => (
              <button 
                key={edition}
                onClick={() => setProEngageEdition(edition as any)}
                className={`px-8 py-3 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer ${
                  proEngageEdition === edition ? "bg-white text-tata-blue shadow-lg shadow-blue-900/5" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {edition === "2025" ? "Current Edition" : "All Time"}
              </button>
            ))}
          </div>
        </div>

        {/* AI Risk Flags removed — risk indicators shown inline on pipeline table rows */}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-6">
          {[
            { label: "Applicants", value: stats.applicants, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Matched", value: stats.matched, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Active", value: stats.active, color: "text-green-600", bg: "bg-green-50" },
            { label: "Completed", value: stats.completed, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Paused", value: stats.paused, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Dropped", value: stats.dropped, color: "text-red-600", bg: "bg-red-50" },
            { label: "Rejected", value: stats.rejected, color: "text-slate-600", bg: "bg-slate-50" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-8 rounded-3xl border border-slate-100 text-center shadow-sm hover:shadow-lg transition-all group">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-4 group-hover:text-tata-blue transition-colors">{stat.label}</p>
              <p className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ProEngage Drill-down */}
        {!peProject && (
          <>
            <div className="mt-8">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Projects this edition</p>
              <div className="space-y-3">
                {OPEN_PROENGAGE_PROJECTS.map((proj: any) => (
                  <button
                    key={proj.id}
                    onClick={() => setPeProject(proj)}
                    className="w-full flex items-center justify-between p-5 bg-white border border-zinc-100 rounded-2xl hover:border-tata-cyan hover:shadow-sm transition-all cursor-pointer text-left group"
                  >
                    <div>
                      <p className="font-semibold text-zinc-900 text-sm">{proj.title}</p>
                      <p className="text-xs text-zinc-400 mt-1">{proj.ngo} · {proj.applicantCount ?? 0} applicants</p>
                    </div>
                    <ChevronRight size={16} className="text-zinc-300 group-hover:text-tata-cyan" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {peProject && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setPeProject(null)} className="text-xs text-zinc-400 hover:text-zinc-700 cursor-pointer font-medium">ProEngage Oversight</button>
              <span className="text-zinc-300 text-xs">›</span>
              <span className="text-xs font-medium text-zinc-800">{peProject.title}</span>
            </div>

            {/* Volunteer pipeline table */}
            <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50">
                    {["Name", "Email", "Company", "Project", "Contact", "Status", "Hours", "Match %", "Nudge", "Cert", "Feedback"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PROENGAGE_PIPELINE.map((v: any) => (
                    <tr key={v.id} className="border-b border-zinc-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 font-medium text-zinc-900 whitespace-nowrap">{v.name}</td>
                      <td className="px-4 py-4 text-xs text-zinc-500">{v.email}</td>
                      <td className="px-4 py-4 text-xs text-zinc-500">{v.company}</td>
                      <td className="px-4 py-4 text-xs text-zinc-700 font-medium">{v.project}</td>
                      <td className="px-4 py-4 text-xs text-zinc-500">{v.contact ?? "—"}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          v.status === "Active" ? "bg-green-50 text-green-700" :
                          v.status === "Matched" ? "bg-blue-50 text-blue-700" :
                          v.status === "Dropped" ? "bg-red-50 text-red-600" :
                          v.status === "Completed" ? "bg-purple-50 text-purple-700" :
                          "bg-zinc-100 text-zinc-500"
                        }`}>{v.status}</span>
                      </td>
                      <td className="px-4 py-4 text-xs text-zinc-500">
                        {v.isCurrentEdition
                          ? <span className="text-zinc-400 italic">~{v.estimatedHours ?? 40}h est.</span>
                          : <span className="font-semibold text-zinc-700">{v.hours ?? 120}h</span>
                        }
                      </td>
                      <td className="px-4 py-4 text-xs text-zinc-500">
                        {v.status === "Active" ? `${v.match ?? 0}%` : "—"}
                      </td>
                      <td className="px-4 py-4">
                        {v.status === "Active" && (
                          <button
                            onClick={() => {
                              setAtRiskList(prev => prev.map(r => r.id === v.id ? { ...r, nudged: true } : r));
                              setToastMessage(`Nudge sent to ${v.name}`);
                              setShowToast(true);
                              setTimeout(() => setShowToast(false), 3000);
                            }}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                              atRiskList.find(r => r.id === v.id)?.nudged
                                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                            }`}
                            disabled={atRiskList.find(r => r.id === v.id)?.nudged}
                          >
                            {atRiskList.find(r => r.id === v.id)?.nudged ? "Nudged ✓" : "Nudge"}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {!v.isCurrentEdition && (
                          <button
                            onClick={() => {
                              setToastMessage("Certificate downloaded");
                              setShowToast(true);
                              setTimeout(() => setShowToast(false), 3000);
                            }}
                            className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-tata-blue hover:text-white transition-all cursor-pointer"
                            title="Download Certificate"
                          >
                            <Download size={14} />
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {!v.isCurrentEdition && (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            v.feedbackStatus === "submitted" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {v.feedbackStatus === "submitted" ? "✓" : "Pending"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Share with Employees */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-12 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-tata-blue/5 rounded-full blur-3xl" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12 relative z-10">
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Share with Employees</h3>
              <p className="text-slate-500 font-medium">
                {spoc.tier === "Corporate SPOC" 
                  ? "Promote open ProEngage projects across all Tata subsidiaries." 
                  : "Promote open ProEngage projects to TCS employees."}
              </p>
            </div>
            <div className="flex gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => {
                        if (!IS_PE_SEASON) return;
                        setToastMessage("Project list link copied to clipboard!");
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                      disabled={!IS_PE_SEASON}
                      className={`group px-8 py-4 border rounded-2xl font-bold text-sm flex items-center gap-3 transition-all shadow-sm ${
                        IS_PE_SEASON 
                          ? "bg-white border-slate-200 text-slate-700 hover:border-tata-blue hover:text-tata-blue cursor-pointer" 
                          : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                      }`}
                    >
                      <Copy size={18} className="group-hover:scale-110 transition-transform" /> Copy Link
                    </button>
                  </TooltipTrigger>
                  {!IS_PE_SEASON && (
                    <TooltipContent>
                      <p>Available during active ProEngage editions only</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => {
                        if (!IS_PE_SEASON) return;
                        setToastMessage("Downloading project list as PDF...");
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                      disabled={!IS_PE_SEASON}
                      className={`group px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 transition-all ${
                        IS_PE_SEASON 
                          ? "bg-zinc-900 text-white hover:bg-tata-blue shadow-xl shadow-zinc-900/10 cursor-pointer active:scale-95" 
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <Download size={18} className="group-hover:-translate-y-1 transition-transform" /> Download as PDF
                    </button>
                  </TooltipTrigger>
                  {!IS_PE_SEASON && (
                    <TooltipContent>
                      <p>Available during active ProEngage editions only</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {OPEN_PROENGAGE_PROJECTS.map((project) => (
              <div key={project.id} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-tata-blue mb-6 group-hover:bg-tata-blue group-hover:text-white transition-all">
                  <Briefcase size={20} />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2 tracking-tight leading-tight">{project.title}</h4>
                <p className="text-xs font-bold text-tata-cyan mb-6 uppercase tracking-widest">{project.ngo}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.skills.map(skill => (
                    <span key={skill} className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg uppercase tracking-tight">
                      {skill}
                    </span>
                  ))}
                </div>
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group/link text-xs font-semibold text-slate-900 flex items-center gap-2 hover:text-tata-blue transition-colors uppercase tracking-widest"
                >
                  Direct Apply Link <ExternalLink size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                </a>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-tata-blue text-white flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Info size={20} />
            </div>
            <p className="text-xs text-tata-blue font-bold leading-relaxed">
              Regional SPOC view would be filtered by geography. As Corporate SPOC, you are seeing all TCS projects across all regions.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const handleSendFeedbackReminder = (id: number) => {
    setFeedbackReminders(prev => prev.map(v => v.id === id ? { ...v, reminders: [...v.reminders, "Manual reminder sent"] } : v));
    setToastMessage("Manual reminder sent to volunteer.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // ─── Reports & Certificates Panel ────────────────────────────────────
  const ReportsAndCertificatesPanel = () => {
    const [isDownloadingAll, setIsDownloadingAll] = useState(false);

    const handleDownloadAll = () => {
      setIsDownloadingAll(true);
      setToastMessage("Preparing 14 certificates... Download ready.");
      setTimeout(() => {
        setIsDownloadingAll(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }, 2000);
    };

    return (
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Analytics</p>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Reports & Recognition</h2>
            <p className="text-slate-500 font-medium">{isRegionalSPOC ? "Manage certificates for your region." : "Track company performance, manage certificates, and monitor feedback."}</p>
          </div>
          {!isRegionalSPOC && (
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl shadow-inner">
            {[
              { id: "Leaderboard", label: "Leaderboard", icon: Trophy },
              { id: "Certificates", label: "Certificates", icon: Award },
              { id: "Feedback", label: "Feedback", icon: MessageSquare }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setReportsTab(tab.id as any)}
                className={`px-8 py-3 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 ${
                  reportsTab === tab.id ? "bg-white text-tata-blue shadow-lg shadow-blue-900/5" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
          )}
        </div>

        {(!isRegionalSPOC && reportsTab === "Leaderboard") && (
          <div className="space-y-10">
            <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100 inline-flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-tata-cyan" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {spoc.tier === "Corporate SPOC" ? "Group-wide view — all Tata subsidiaries" : "TCS only"}
              </span>
            </div>
            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-tata-blue text-white flex items-center justify-center shadow-lg shadow-blue-900/20">
                  <Info size={20} />
                </div>
                <p className="text-xs text-tata-blue font-bold leading-relaxed">
                  Leaderboard is live during the active edition. Rankings freeze at edition close.
                </p>
              </div>
              <button 
                onClick={() => {
                  setToastMessage("Generating shareable leaderboard image...");
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 3000);
                }}
                className="group px-6 py-3 bg-white border border-blue-100 text-tata-blue rounded-lg text-xs font-semibold uppercase tracking-widest flex items-center gap-2 hover:bg-tata-blue hover:text-white transition-all cursor-pointer"
              >
                <Share2 size={14} className="group-hover:scale-110 transition-transform" /> Share Leaderboard
              </button>
            </div>

            <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Top 10 Tata Companies (Edition 2025)</h3>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  <Activity size={14} /> Live Trend
                </div>
              </div>
              <div className="space-y-8">
                {COMPANY_LEADERBOARD.map((company) => (
                  <div key={company.rank} className="flex items-center gap-8 group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-semibold text-sm transition-all ${
                      company.name === "TCS" ? "bg-tata-blue text-white shadow-lg shadow-blue-900/20 scale-110" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                    }`}>
                      {company.rank}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-end mb-3">
                        <span className={`font-semibold tracking-tight ${company.name === "TCS" ? "text-tata-blue text-lg" : "text-slate-700"}`}>
                          {company.name} {company.name === "TCS" && <span className="text-xs font-semibold uppercase tracking-widest ml-2 opacity-60">(You)</span>}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">{company.matched.toLocaleString()} <span className="text-xs text-slate-400 uppercase ml-1">Matched</span></span>
                      </div>
                      <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(company.matched / COMPANY_LEADERBOARD[0].matched) * 100}%` }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: company.rank * 0.1 }}
                          className={`h-full rounded-full ${company.name === "TCS" ? "bg-gradient-to-r from-tata-blue to-tata-cyan shadow-[0_0_15px_rgba(0,53,128,0.3)]" : "bg-slate-300"}`}
                        />
                      </div>
                    </div>
                    <div className="w-32 h-12 flex items-end opacity-40 group-hover:opacity-100 transition-opacity">
                      <svg viewBox="0 0 100 40" className="w-full h-full">
                        <motion.path 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, delay: company.rank * 0.1 }}
                          d={`M ${company.trend.map((v, i) => `${i * 20},${40 - (v / 120) * 40}`).join(" L ")}`}
                          fill="none"
                          stroke={company.name === "TCS" ? "#003366" : "#cbd5e1"}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(isRegionalSPOC || reportsTab === "Certificates") && (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Volunteer Certificates</h3>
                <p className="text-sm text-slate-500 font-medium">Bulk download and preview generated certificates</p>
              </div>
              <button 
                onClick={handleDownloadAll}
                disabled={isDownloadingAll}
                className="group px-8 py-4 bg-zinc-900 text-white rounded-2xl font-semibold text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-tata-blue transition-all shadow-xl shadow-zinc-900/10 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isDownloadingAll ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
                )}
                Download All as ZIP
              </button>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                    <th className="pb-6 px-6">Volunteer</th>
                    <th className="pb-6 px-6">Project Details</th>
                    <th className="pb-6 px-6">Completion</th>
                    <th className="pb-6 px-6">Status</th>
                    <th className="pb-6 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {VOLUNTEER_CERTIFICATES.map((cert) => (
                    <tr key={cert.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="py-6 px-6">
                        <div className="font-semibold text-slate-900 tracking-tight">{cert.name}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Volunteer ID: #{cert.id + 1000}</div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="text-sm font-bold text-slate-700">{cert.project}</div>
                        <div className="text-xs font-semibold text-tata-blue uppercase tracking-widest mt-1">{cert.ngo}</div>
                      </td>
                      <td className="py-6 px-6 text-sm font-medium text-slate-500">{cert.date}</td>
                      <td className="py-6 px-6">
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm border ${
                          cert.status === "Generated" ? "bg-green-50 text-green-700 border-green-100" :
                          cert.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-100" :
                          "bg-blue-50 text-blue-700 border-blue-100"
                        }`}>
                          {cert.status}
                        </span>
                      </td>
                      <td className="py-6 px-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => setShowCertificatePreview(cert)}
                            className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 hover:bg-tata-blue hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm"
                            title="Preview Certificate"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-30"
                            title="Download PDF"
                            disabled={cert.status !== "Generated"}
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(!isRegionalSPOC && reportsTab === "Feedback") && (
          <div className="space-y-10">
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Feedback Monitor</h3>
                  <p className="text-sm text-slate-500 font-medium">Volunteers with overdue project feedback</p>
                </div>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                    <th className="pb-6 px-6">Volunteer</th>
                    <th className="pb-6 px-6">Project</th>
                    <th className="pb-6 px-6">Due Date</th>
                    <th className="pb-6 px-6">Days Overdue</th>
                    <th className="pb-6 px-6">Reminders Sent</th>
                    <th className="pb-6 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {feedbackReminders.map((v) => (
                    <tr key={v.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="py-6 px-6 font-semibold text-slate-900 tracking-tight">{v.name}</td>
                      <td className="py-6 px-6 text-sm font-bold text-slate-600">{v.project}</td>
                      <td className="py-6 px-6 text-sm font-medium text-slate-500">{v.dueDate}</td>
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle size={14} />
                          <span className="text-sm font-semibold">{v.daysOverdue} days</span>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex flex-wrap gap-2">
                          {v.reminders.map((r, i) => (
                            <span key={i} className="text-xs font-semibold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-2xl uppercase tracking-tight border border-slate-200/50">
                              {r}
                            </span>
                          ))}
                          {v.reminders.length === 0 && <span className="text-xs text-slate-300 font-bold uppercase tracking-widest italic">None sent</span>}
                        </div>
                      </td>
                      <td className="py-6 px-6 text-right">
                        <button 
                          onClick={() => handleSendFeedbackReminder(v.id)}
                          className="px-5 py-2.5 bg-tata-blue/5 text-tata-blue rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-tata-blue hover:text-white transition-all cursor-pointer border border-tata-blue/10"
                        >
                          Send Nudge
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-10 bg-emerald-50 rounded-3xl border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <CheckCircle2 size={120} className="text-emerald-600" />
              </div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">Feedback Summary</h4>
                  <p className="text-sm text-slate-500 font-medium">86 of 110 volunteers have submitted feedback (78%)</p>
                </div>
              </div>
              <div className="flex-1 max-w-md w-full relative z-10">
                <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase mb-3 tracking-widest">
                  <span>Progress to Target (90%)</span>
                  <span>78%</span>
                </div>
                <div className="h-4 bg-white rounded-full overflow-hidden border border-emerald-100 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── Campaign Kit ────────────────────────────────────────────────────
  const campaignKitItems = [
    { title: "TVW 2025 Poster Pack", type: "PDF", description: "Print-ready A3 posters for office noticeboards", icon: FileText, program: "TVW", edition: "2025" },
    { title: "ProEngage Volunteer Recruitment Email", type: "DOCX", description: "Template email to send to your company's employees", icon: File, program: "ProEngage", edition: "2025" },
    { title: "TVW Social Media Kit", type: "ZIP", description: "LinkedIn and WhatsApp graphics with 'Be The Change' theme", icon: Archive, program: "TVW", edition: "2025" },
    { title: "SPOC Orientation Handbook", type: "PDF", description: "Your guide to TVW and ProEngage coordination", icon: FileText, program: "TVW", edition: "2024" },
    { title: "ProEngage Project List — April 2025", type: "PDF", description: "Shareable list of all open projects with apply links", icon: FileText, program: "ProEngage", edition: "2025" },
    { title: "Volunteering Policy Reference", type: "PDF", description: "Tata Group volunteering policy and leave entitlements", icon: FileText, program: "DR", edition: "2024" },
  ];

  const CampaignKitPanel = () => {
    const [ckProgram, setCkProgram] = useState("All");
    const [ckEdition, setCkEdition] = useState("All");
    const [ckProject, setCkProject] = useState("All");

    const filteredKit = campaignKitItems.filter(item => {
      if (ckProgram !== "All" && item.program !== ckProgram) return false;
      if (ckEdition !== "All" && item.edition !== ckEdition) return false;
      return true;
    });

    return (
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Resources</p>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Campaign Kit</h2>
            <p className="text-slate-500 font-medium">Downloadable collateral to promote volunteering across your company.</p>
          </div>
          <button
            onClick={() => {
              setToastMessage("Preparing ZIP download...");
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-tata-blue transition-all cursor-pointer shrink-0"
          >
            <Download size={16} />
            Bulk Download All
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <select value={ckProgram} onChange={e => setCkProgram(e.target.value)} className="form-input !w-auto min-w-[160px]">
            <option value="All">All Programs</option>
            <option value="TVW">TVW</option>
            <option value="ProEngage">ProEngage</option>
            <option value="DR">Disaster Response</option>
          </select>
          <select value={ckEdition} onChange={e => setCkEdition(e.target.value)} className="form-input !w-auto min-w-[140px]">
            <option value="All">All Editions</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
          <select value={ckProject} onChange={e => setCkProject(e.target.value)} className="form-input !w-auto min-w-[180px]">
            <option value="All">All Projects</option>
            <option>Clean Water Initiative</option>
            <option>Digital Literacy Drive</option>
            <option>Rural Health Camp</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredKit.map((item) => (
            <div key={item.title} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-tata-blue/5 group-hover:text-tata-blue transition-colors shrink-0">
                  <item.icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-bold text-slate-900 tracking-tight">{item.title}</h4>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      item.type === "PDF" ? "bg-red-50 text-red-600" :
                      item.type === "DOCX" ? "bg-blue-50 text-blue-600" :
                      "bg-amber-50 text-amber-600"
                    }`}>{item.type}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{item.program}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-5">{item.description}</p>
                  <button
                    onClick={() => {
                      setToastMessage(`${item.title}.${item.type.toLowerCase()} downloaded`);
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 3000);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-tata-blue transition-all cursor-pointer"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredKit.length === 0 && (
            <div className="col-span-2 text-center py-16 text-slate-400">
              <p className="text-sm font-medium">No items match the selected filters.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── SPOC Directory Panel ────────────────────────────────────────────
  const SPOCDirectoryPanel = () => {
    const filteredSpocs = spocs.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(directorySearch.toLowerCase()) ||
        s.email.toLowerCase().includes(directorySearch.toLowerCase()) ||
        s.company.toLowerCase().includes(directorySearch.toLowerCase());
      const matchesFilter = directoryFilter === "All" || s.role.includes(directoryFilter);
      return matchesSearch && matchesFilter;
    });

    return (
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">People</p>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">SPOC Directory</h2>
            <p className="text-slate-500 font-medium">
              {spoc.tier === "Corporate SPOC" 
                ? "View and manage SPOCs across all Tata Group companies." 
                : "View SPOCs in your region and manage your regional team."}
            </p>
          </div>
          <button onClick={() => setShowAddSpoc(true)} className="group px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold text-sm flex items-center gap-3 hover:bg-tata-blue transition-all shadow-xl shadow-zinc-900/10 cursor-pointer active:scale-95">
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Add New SPOC
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="relative flex-1 min-w-[300px] group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-tata-blue transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, company, or email..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-tata-blue/10 outline-none text-sm font-medium transition-all"
              value={directorySearch}
              onChange={(e) => setDirectorySearch(e.target.value)}
            />
          </div>
          <div className="h-10 w-px bg-slate-100 hidden md:block" />
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select 
              className="bg-slate-50 border-none text-sm font-semibold text-slate-700 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-tata-blue/20 outline-none cursor-pointer uppercase tracking-widest"
              value={directoryFilter}
              onChange={(e) => setDirectoryFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Corporate">Corporate SPOC</option>
              <option value="Regional">Regional SPOC</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                  <th className="pb-6 px-6">SPOC Profile</th>
                  <th className="pb-6 px-6">Role</th>
                  <th className="pb-6 px-6">Company</th>
                  <th className="pb-6 px-6">Geography</th>
                  <th className="pb-6 px-6">Status</th>
                  <th className="pb-6 px-6">Last Active</th>
                  <th className="pb-6 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredSpocs.map((s) => {
                  const isOwnCompany = s.company === spoc.company;
                  const isRegional = s.role === "Regional SPOC";
                  const canEdit = isOwnCompany && isRegional;

                  return (
                    <tr key={s.id} className={`group transition-all ${!isOwnCompany ? "opacity-40 grayscale hover:grayscale-0 hover:opacity-100" : "hover:bg-slate-50/50"}`}>
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-semibold text-lg shadow-sm transition-all ${
                            isOwnCompany ? "bg-tata-blue text-white" : "bg-slate-100 text-slate-400"
                          }`}>
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 tracking-tight text-base">{s.name}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm border ${
                          s.role === "Corporate SPOC" ? "bg-tata-blue/5 text-tata-blue border-tata-blue/10" : "bg-tata-cyan/5 text-tata-cyan border-tata-cyan/10"
                        }`}>
                          {s.role}
                        </span>
                      </td>
                      <td className="py-6 px-6 text-sm font-semibold text-slate-700 tracking-tight">{s.company}</td>
                      <td className="py-6 px-6 text-sm font-medium text-slate-500">{s.geography}</td>
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${s.status === "Active" ? "bg-green-500 animate-pulse" : "bg-slate-300"}`} />
                          <span className="text-xs font-semibold text-slate-900 uppercase tracking-tight">{s.status}</span>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">{s.lastActive}</td>
                      <td className="py-6 px-6 text-right">
                        {canEdit ? (
                          <div className="flex justify-end gap-3">
                            <button onClick={() => setEditingSpoc(s)} className="w-10 h-10 rounded-lg bg-slate-50 text-slate-400 hover:bg-tata-blue hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm">
                              <Edit2 size={18} />
                            </button>
                            <button onClick={() => setDeactivatingSpoc(s)} className="w-10 h-10 rounded-lg bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm">
                              <Pause size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="relative group/tooltip inline-block">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-200 flex items-center justify-center cursor-help">
                              <Lock size={18} />
                            </div>
                            <div className="absolute bottom-full right-0 mb-3 hidden group-hover/tooltip:block w-56 p-4 bg-zinc-900 text-white text-xs font-bold rounded-2xl shadow-2xl z-20 leading-relaxed uppercase tracking-widest">
                              <div className="flex items-center gap-2 mb-1 text-tata-cyan">
                                <ShieldCheck size={12} /> Access Restricted
                              </div>
                              View only — outside your company scope
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ─── Verification Panel ──────────────────────────────────────────────
  const PendingApprovalsPanel = () => {
    const filteredApprovals = approvals.filter(a => a.status === approvalTab);

    return (
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Queue</p>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Verification</h2>
            <p className="text-slate-500 font-medium">Review and approve volunteers who registered via personal email.</p>
            <div className="mt-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 inline-flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-tata-cyan" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {spoc.tier === "Corporate SPOC" ? "Showing approvals from: All group companies" : "Showing approvals from: West India"}
              </span>
            </div>
          </div>
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl shadow-inner">
            {["Pending", "Approved", "Rejected"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setApprovalTab(tab as any)}
                className={`px-8 py-3 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-3 ${
                  approvalTab === tab ? "bg-white text-tata-blue shadow-lg shadow-blue-900/5" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
                {tab === "Pending" && approvals.filter(a => a.status === "Pending").length > 0 && (
                  <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow-sm">
                    {approvals.filter(a => a.status === "Pending").length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filteredApprovals.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle2 size={40} className="text-slate-300 mb-4" />
            <h4 className="text-[15px] font-medium text-slate-700 mb-1">All caught up</h4>
            <p className="text-[13px] text-muted-foreground">No registrations pending your approval.</p>
          </div>
        ) : (
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                  <th className="pb-6 px-6">Volunteer Profile</th>
                  <th className="pb-6 px-6">Type</th>
                  <th className="pb-6 px-6">Registered Date</th>
                  <th className="pb-6 px-6">Verification Documents</th>
                  {approvalTab === "Rejected" && <th className="pb-6 px-6">Rejection Reason</th>}
                  <th className="pb-6 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredApprovals.map((a) => (
                  <tr key={a.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-semibold text-lg text-slate-400 group-hover:bg-tata-blue group-hover:text-white transition-all shadow-sm">
                          {a.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 tracking-tight text-base">{a.name}</div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{a.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm border ${
                        a.type === "Retiree" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-blue-50 text-blue-700 border-blue-100"
                      }`}>
                        {a.type}
                      </span>
                    </td>
                    <td className="py-6 px-6 text-sm font-medium text-slate-500">{a.registeredDate}</td>
                    <td className="py-6 px-6">
                      <button 
                        onClick={() => setSelectedApproval(a)}
                        className="group/btn px-4 py-2 bg-slate-50 text-tata-blue rounded-2xl text-xs font-semibold uppercase tracking-widest hover:bg-tata-blue hover:text-white transition-all flex items-center gap-2 cursor-pointer border border-tata-blue/10 shadow-sm"
                      >
                        <FileText size={14} className="group-hover/btn:scale-110 transition-transform" /> View Docs
                      </button>
                    </td>
                    {approvalTab === "Rejected" && (
                      <td className="py-6 px-6">
                        <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                          <p className="text-xs text-red-600 font-bold uppercase tracking-tight italic leading-relaxed">{a.rejectionReason}</p>
                        </div>
                      </td>
                    )}
                    <td className="py-6 px-6 text-right">
                      {a.status === "Pending" ? (
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => handleApprove(a.id)}
                            className="w-12 h-12 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-2xl transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-90"
                            title="Approve Volunteer"
                          >
                            <Check size={20} />
                          </button>
                          <button 
                            onClick={() => setRejectingApproval(a)}
                            className="w-12 h-12 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-2xl transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-90"
                            title="Reject Registration"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold uppercase tracking-widest border shadow-sm ${
                          a.status === "Approved" ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                        }`}>
                          {a.status === "Approved" ? <CheckCircle2 size={14} /> : <X size={14} />}
                          {a.status}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    );
  };

  // ─── TVW Management Panel ────────────────────────────────────────────
  const isTVWActive = false; // Mock: set to false for post-TVW demo

  const TVWManagementPanel = () => {
    const filteredEvents = tvwEvents.filter(e => {
      const matchesRegion = tvwFilters.region === "All" || e.region === tvwFilters.region;
      const matchesStatus = tvwFilters.status === "All" || e.status === tvwFilters.status;
      return matchesRegion && matchesStatus;
    });

    return (
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Events</p>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">TVW Management</h2>
            <p className="text-slate-500 font-medium">Manage TCS's participation in Tata Volunteering Week.</p>
          </div>
          {isTVWActive && (
            <button onClick={() => setShowCreateEvent(true)} className="group px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold text-sm flex items-center gap-3 hover:bg-tata-blue transition-all shadow-xl shadow-zinc-900/10 cursor-pointer active:scale-95">
              <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Create New Event
            </button>
          )}
        </div>

        {/* Post-TVW Banner */}
        {!isTVWActive && (
          <div className="flex items-center gap-4 p-5 bg-amber-50 rounded-2xl border border-amber-100">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Lock size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-800">TVW 2025 has closed</p>
              <p className="text-xs text-amber-600">Events are now read-only. You can still submit Vibe updates for completed events.</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <Filter size={16} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Filters</span>
          </div>
          <div className="h-6 w-px bg-slate-100 mx-2 hidden md:block" />
          <select 
            className="bg-slate-50 border-none text-sm font-bold text-slate-700 px-4 py-2 rounded-lg focus:ring-2 focus:ring-tata-blue/20 outline-none cursor-pointer"
            value={tvwFilters.region}
            onChange={(e) => setTvwFilters({ ...tvwFilters, region: e.target.value })}
          >
            <option value="All">All Regions</option>
            <option>West India</option>
            <option>North India</option>
            <option>South India</option>
            <option>East India</option>
            <option>Global</option>
          </select>
          <select 
            className="bg-slate-50 border-none text-sm font-bold text-slate-700 px-4 py-2 rounded-lg focus:ring-2 focus:ring-tata-blue/20 outline-none cursor-pointer"
            value={tvwFilters.status}
            onChange={(e) => setTvwFilters({ ...tvwFilters, status: e.target.value })}
          >
            <option value="All">All Status</option>
            <option>Upcoming</option>
            <option>Live</option>
            <option>Completed</option>
          </select>
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg text-xs font-bold text-slate-500 border border-transparent hover:border-slate-200 transition-all cursor-default">
            <Calendar size={14} />
            Date Range: Apr 1 - Apr 30
          </div>
        </div>

        {/* Event Grid — split by ownership */}
        {isRegionalSPOC ? (
          <>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">My Region Opportunities</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {filteredEvents.map((event: any) => (
        <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">My Opportunities</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mb-12">
              {filteredEvents.filter((e: any) => e.createdBy === `${spoc.firstName} ${spoc.lastName}`).map((event: any) => (
        <EventCard key={event.id} event={event} />
              ))}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Regional Opportunities</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {filteredEvents.filter((e: any) => e.createdBy !== `${spoc.firstName} ${spoc.lastName}`).map((event: any) => (
        <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const EventCard = ({ event }: { event: any }) => {
    const isCorporateCreated = event.createdBy === `${ROHAN_DESAI.firstName} ${ROHAN_DESAI.lastName}`;
    return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-2">{event.title}</h4>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-tata-blue uppercase tracking-widest">{event.type}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border ${
                        isCorporateCreated ? "bg-tata-blue/10 text-tata-blue border-tata-blue/20" : "bg-tata-cyan/10 text-tata-blue border-tata-cyan/20"
                      }`}>
                        {isCorporateCreated ? "Corporate" : "Regional"}
                      </span>
                      {event.vibeStatus && (
                        <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full uppercase tracking-widest border border-purple-100">
                          {event.vibeStatus}
                        </span>
                      )}
                      {!isTVWActive && (
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-widest">
                          Read-only
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">Created by: {event.createdBy}</span>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap shadow-sm border ${
                    event.status === "Upcoming" ? "bg-blue-50 text-blue-700 border-blue-100" :
                    event.status === "Live" ? "bg-green-50 text-green-700 border-green-100" :
                    "bg-slate-50 text-slate-500 border-slate-100"
                  }`}>
                    {event.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                      <CalendarDays size={14} className="text-slate-400" />
                    </div>
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                      <Clock size={14} className="text-slate-400" />
                    </div>
                    <span className="font-medium">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                      <MapPin size={14} className="text-slate-400" />
                    </div>
                    <span className="font-medium">{event.mode}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                      <Clock size={14} className="text-slate-400" />
                    </div>
                    <span className="font-medium">{event.volunteeringHours}h</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Capacity</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-900">{event.capacity}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(parseInt(event.capacity.split("/")[0]) / parseInt(event.capacity.split("/")[1])) * 100}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full rounded-full ${
                        parseInt(event.capacity.split("/")[0]) >= parseInt(event.capacity.split("/")[1]) 
                          ? "bg-red-500" 
                          : "bg-gradient-to-r from-tata-blue to-tata-cyan"
                      }`} 
                    />
                  </div>
                </div>

                {event.status === "Completed" && !event.vibeStatus && (
                  <button 
                    onClick={() => setShowVibeModal(event)}
                    className="w-full py-4 bg-tata-cyan text-white rounded-2xl text-xs font-semibold uppercase tracking-widest hover:bg-tata-blue transition-all shadow-lg shadow-tata-cyan/20 cursor-pointer active:scale-95"
                  >
                    Submit to TVW Vibe
                  </button>
                )}
              </div>

              {/* Hours Log Section */}
              <div className="bg-slate-50/50 border-t border-slate-100">
                <button 
                  onClick={() => setExpandedHoursLog(expandedHoursLog === event.id ? null : event.id)}
                  className="w-full p-6 flex items-center justify-between text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-all cursor-pointer group/btn"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover/btn:text-tata-blue transition-colors shadow-sm">
                      <Clock size={16} />
                    </div>
                    Volunteering Hours Log
                  </div>
                  <div className={`p-1.5 rounded-lg bg-white shadow-sm transition-transform ${expandedHoursLog === event.id ? "rotate-180" : ""}`}>
                    <ChevronDown size={16} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {expandedHoursLog === event.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-8 pt-0 space-y-4">
                        {event.volunteers.length > 0 ? (
                          event.volunteers.map((v) => (
                            <div key={v.id} className="flex items-center justify-between bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm hover:border-tata-blue/20 transition-all">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-slate-400">
                                  {v.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{v.name}</p>
                                  <p className="text-xs text-slate-400 font-medium">{v.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                {isTVWActive ? (
                                  <>
                                    <div className="relative">
                                      <input 
                                        type="number" 
                                        className="w-20 pl-3 pr-8 py-2 text-xs font-bold border border-slate-200 rounded-2xl focus:ring-2 focus:ring-tata-blue/10 outline-none"
                                        defaultValue={v.hours || event.volunteeringHours}
                                        onBlur={(e) => handleUpdateHours(event.id, v.id, Number(e.target.value))}
                                      />
                                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">h</span>
                                    </div>
                                    {v.confirmed ? (
                                      <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                                        <Check size={16} />
                                      </div>
                                    ) : (
                                      <button 
                                        onClick={() => handleUpdateHours(event.id, v.id, event.volunteeringHours)}
                                        className="px-4 py-2 bg-tata-blue text-white rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-blue-900 transition-all cursor-pointer"
                                      >
                                        Confirm
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-700">{v.hours || event.volunteeringHours}h</span>
                                    {v.confirmed && (
                                      <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                                        <Check size={16} />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200">
                            <Users size={32} className="mx-auto text-slate-200 mb-3" />
                            <p className="text-xs text-slate-400 font-medium italic">No volunteers registered yet.</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
    );
  };

  // ─── Pending count for sidebar preview ────────────────────────────────
  const pendingApprovals = approvals.filter(a => a.status === "Pending");

  return (
    <div className="min-h-screen pt-20 bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-slate-100 hidden lg:flex flex-col p-4 fixed h-[calc(100vh-80px)] top-20 z-20">
        <div className="mb-4">
          <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-tata-blue flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {spoc.firstName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{spoc.firstName} {spoc.lastName}</p>
              <span className="text-[10px] font-bold text-tata-blue uppercase tracking-widest">{spoc.tier}</span>
            </div>
          </div>
        </div>
        {(user?.role?.includes("spoc") || user?.role === "corporate_spoc") && (
          <div className="mb-4">
            <RoleToggle activeView="spoc" className="!bg-slate-100 !border-slate-200 w-full justify-center" />
          </div>
        )}

        <div className="space-y-0.5 flex-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.3em] mb-2 px-2">Main Menu</p>
          {navItems.map((item) => (
            <button 
              key={item.name}
              onClick={() => handleNavClick(item.name)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer group ${
                activeNav === item.name 
                  ? "text-tata-blue bg-blue-50 border-l-2 border-tata-blue" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent"
              }`}
            >
              <item.icon size={16} className="flex-shrink-0" />
              <span className="truncate">{item.name}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-auto text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold bg-red-500 text-white flex-shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100">
          <button className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer">
            Contact TSG Admin
          </button>
        </div>
      </aside>

      {/* Main Content — single scroll */}
      <main id="spoc-main-content" className="flex-1 lg:ml-56 p-8 md:p-16">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* ── Welcome / Header ────────────────────────────────────── */}
          <section id="spoc-section-dashboard">
            {/* Orientation Banner */}
            {!isOrientationDismissed && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-gradient-to-br from-tata-blue via-blue-900 to-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden group mb-12"
              >
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Sparkles size={160} />
                </div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-tata-cyan/10 rounded-full blur-3xl" />
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                        <Award className="text-tata-cyan" size={20} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-tata-cyan">Onboarding Progress</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">Complete your SPOC Orientation to unlock all features</h3>
                    <div className="max-w-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-white/60">Module 2 of 5</span>
                        <span className="text-xs font-bold text-tata-cyan">40%</span>
                      </div>
                      <div className="h-2.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "40%" }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-tata-cyan to-blue-400 rounded-full shadow-[0_0_15px_rgba(0,180,216,0.5)]" 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <button onClick={() => setIsOrientationDismissed(true)} className="text-sm font-bold text-white/40 hover:text-white transition-colors cursor-pointer">Maybe Later</button>
                    <button onClick={() => setShowOrientationModal(true)} className="bg-white text-tata-blue py-4 px-10 rounded-2xl font-bold text-sm hover:bg-tata-cyan hover:text-white transition-all shadow-lg hover:shadow-tata-cyan/20 cursor-pointer active:scale-95">
                      Resume Orientation
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Welcome */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-tata-cyan animate-pulse" />
                  <span className="text-xs font-semibold text-tata-blue uppercase tracking-[0.3em]">
                    {spoc.tier} Dashboard
                  </span>
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tight">Welcome, {spoc.firstName}</h1>
                <p className="text-lg text-slate-500 font-medium">{spoc.company} • {spoc.designation}</p>
              </div>
              <div className="flex gap-4">
                <button className="group px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm flex items-center gap-3 hover:border-tata-blue hover:text-tata-blue transition-all shadow-sm cursor-pointer">
                  <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" /> Export Reports
                </button>
                <button onClick={() => setShowCreateEvent(true)} className="group px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold text-sm flex items-center gap-3 hover:bg-tata-blue transition-all shadow-xl shadow-zinc-900/10 cursor-pointer active:scale-95">
                  <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Post TVW Event
                </button>
              </div>
            </div>

            {/* ── KPI Stat Tiles (4-col) ──────────────────────────────── */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${isRegionalSPOC ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-8 mb-12`}>
              {(isRegionalSPOC ? [
                { label: "TVW Events", value: spoc.stats.tvwEvents, sub: "In my geography", icon: CalendarDays, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
                { label: "Volunteers at Location", value: spoc.stats.totalVolunteers, sub: (spoc as any).geography || "My region", icon: Users, color: "text-tata-blue", bg: "bg-blue-50", border: "border-blue-100" },
                { label: "Open Opportunities", value: OPEN_PROENGAGE_PROJECTS.length, sub: "Available now", icon: Sparkles, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
              ] : [
                { label: "ProEngagers This Edition", value: spoc.stats.activeProEngage, sub: "Current edition", icon: Briefcase, color: "text-tata-blue", bg: "bg-blue-50", border: "border-blue-100" },
                { label: "Hours Added", value: "1,240", sub: "Volunteer + NGO reported", icon: Clock, color: "text-tata-cyan", bg: "bg-cyan-50", border: "border-cyan-100" },
                { label: "My Total SPOCs", value: SPOC_DIRECTORY.length, sub: "Across my company", icon: Users, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
                { label: "Company Opportunities", value: OPEN_PROENGAGE_PROJECTS.length, sub: "Open right now", icon: Sparkles, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
              ]).map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-8 rounded-3xl bg-white border ${stat.border} shadow-sm hover:shadow-xl transition-all group relative overflow-hidden`}
                >
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-6 right-6 text-slate-200">
                    <stat.icon size={24} />
                  </div>
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                    <stat.icon size={28} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h4>
                      <span className="text-xs font-bold text-slate-400 uppercase">{stat.sub}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── Quick Actions Strip ─────────────────────────────────── */}
            <div className="flex gap-4 mb-12">
              {(isRegionalSPOC ? [
                { label: "Download campaign kit", icon: Download, target: "spoc-section-campaign-kit" },
                { label: "Post TVW event", icon: CalendarDays, target: "spoc-section-tvw" },
              ] : [
                { label: "Download campaign kit", icon: Download, target: "spoc-section-campaign-kit" },
                { label: "Share project list", icon: Share2, target: "spoc-section-proengage" },
                { label: "View leaderboard", icon: Trophy, target: "spoc-section-reports" },
              ]).map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    document.getElementById(action.target)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:border-tata-blue hover:text-tata-blue transition-all cursor-pointer"
                >
                  <action.icon size={18} />
                  {action.label}
                </button>
              ))}
            </div>
          </section>

          {/* ── Main Grid ─────────────────────────────── */}
          <div className={`grid grid-cols-1 ${isRegionalSPOC ? "" : "lg:grid-cols-3"} gap-10`}>
            {/* Left col — main sections */}
            <div className={`${isRegionalSPOC ? "" : "lg:col-span-2"} space-y-12`}>
              {/* ProEngage Oversight (Corporate only) */}
              {!isRegionalSPOC && (
                <section id="spoc-section-proengage" className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:p-8">
                  <ProEngageOversightPanel />
                </section>
              )}

              {/* TVW Management */}
              <section id="spoc-section-tvw" className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:p-8">
                <TVWManagementPanel />
              </section>

              {/* SPOC Directory (Corporate only) */}
              {!isRegionalSPOC && (
                <section id="spoc-section-directory" className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:p-8">
                  <SPOCDirectoryPanel />
                </section>
              )}
            </div>

            {/* Right col — sidebar previews (Corporate only) */}
            {!isRegionalSPOC && (
            <div className="space-y-10">
              {/* Verification Queue Preview */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:p-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Queue</p>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Verification</h3>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">{pendingApprovals.length}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Pending</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  {pendingApprovals.slice(0, 3).map((a) => (
                    <div key={a.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                        {a.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{a.name}</p>
                        <p className="text-xs text-slate-400">{a.type} · {a.registeredDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => document.getElementById("spoc-section-verification")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-xs font-bold text-tata-blue uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
                >
                  View all <ArrowRight size={14} />
                </button>
              </div>

              {/* Leaderboard Preview (PE only, Corporate only) */}
              {IS_PE_SEASON && !isRegionalSPOC && (
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:p-8">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Rankings</p>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Leaderboard</h3>
                  <div className="space-y-4 mb-6">
                    {COMPANY_LEADERBOARD.slice(0, 3).map((company) => (
                      <div key={company.rank} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                          company.name === "TCS" ? "bg-tata-blue text-white" : "bg-slate-50 text-slate-400"
                        }`}>
                          {company.rank}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${company.name === "TCS" ? "text-tata-blue" : "text-slate-700"}`}>
                            {company.name} {company.name === "TCS" && <span className="text-xs opacity-50">(You)</span>}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-500">{company.matched}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => document.getElementById("spoc-section-reports")?.scrollIntoView({ behavior: "smooth" })}
                    className="text-xs font-bold text-tata-blue uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
                  >
                    View full <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* Campaign Kit Shortcuts */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:p-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Resources</p>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Campaign Kit</h3>
                <div className="space-y-3 mb-6">
                  {campaignKitItems.slice(0, 3).map((item) => (
                    <button
                      key={item.title}
                      onClick={() => {
                        setToastMessage(`${item.title}.${item.type.toLowerCase()} downloaded`);
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-tata-blue/20 transition-all cursor-pointer text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-tata-blue transition-colors shrink-0">
                        <item.icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{item.title}</p>
                        <p className="text-xs text-slate-400">{item.type}</p>
                      </div>
                      <Download size={14} className="text-slate-300 group-hover:text-tata-blue shrink-0" />
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => document.getElementById("spoc-section-campaign-kit")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-xs font-bold text-tata-blue uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
                >
                  View all <ArrowRight size={14} />
                </button>
              </div>
            </div>
            )}
          </div>

          {/* ── Full-width sections below the grid ───────────────────── */}

          {/* Verification (full) */}
          <section id="spoc-section-verification" className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:p-8">
            <PendingApprovalsPanel />
          </section>

          {/* Reports & Certificates (full-width) */}
          <section id="spoc-section-reports" className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:p-8">
            <ReportsAndCertificatesPanel />
          </section>

          {/* Campaign Kit (full-width) */}
          <section id="spoc-section-campaign-kit" className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:p-8">
            <CampaignKitPanel />
          </section>

        </div>
      </main>

      {/* Modals & Drawers */}
      <AnimatePresence>
        {/* ProEngage Volunteer Profile Drawer (Read-only) */}
        {selectedProEngageVolunteer && (
          <div className="fixed inset-0 z-[300] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
              onClick={() => setSelectedProEngageVolunteer(null)}
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold text-slate-800">Volunteer Profile</h3>
                <button onClick={() => setSelectedProEngageVolunteer(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-10 space-y-10">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-3xl bg-tata-blue text-white flex items-center justify-center text-3xl font-bold">
                    {selectedProEngageVolunteer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-slate-800">{selectedProEngageVolunteer.name}</h4>
                    <p className="text-slate-500">{selectedProEngageVolunteer.email}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-lg uppercase tracking-widest">TCS Employee</span>
                      <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg uppercase tracking-widest">Match: {selectedProEngageVolunteer.match}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Status</p>
                    <p className="text-sm font-bold text-slate-800">{selectedProEngageVolunteer.status}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last Updated</p>
                    <p className="text-sm font-bold text-slate-800">{selectedProEngageVolunteer.lastUpdated}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="font-bold text-slate-800 flex items-center gap-2">
                    <Award size={18} className="text-tata-blue" /> Skills & Expertise
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedProEngageVolunteer.skills?.map((skill: string) => (
                      <span key={skill} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold border border-slate-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="font-bold text-slate-800 flex items-center gap-2">
                    <Briefcase size={18} className="text-tata-blue" /> Professional Background
                  </h5>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    {selectedProEngageVolunteer.experience} experience in their respective field at Tata Group.
                  </p>
                </div>

                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-center gap-4">
                  <Info size={24} className="text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800 font-medium leading-relaxed">
                    This is a <strong>read-only</strong> view for Corporate SPOC oversight. Project-specific approvals are managed by the respective NGO.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Create TVW Event Modal */}
        {showCreateEvent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
              onClick={() => setShowCreateEvent(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Create Opportunity</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleCreateEvent}>
                <div className="md:col-span-2">
                  <label className="form-label">Event Title*</label>
                  <input name="title" type="text" required placeholder="e.g. Beach Clean-up Drive" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Event Type*</label>
                  <select name="type" required className="form-input">
                    <option value="">Select Type</option>
                    <option>Tree Plantation</option>
                    <option>Beach Clean-up</option>
                    <option>Teaching</option>
                    <option>Health Camp</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Date & Time*</label>
                  <div className="flex gap-2">
                    <input name="date" type="date" required className="form-input" />
                    <input name="time" type="time" required className="form-input" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Mode*</label>
                  <select name="mode" required className="form-input">
                    <option>In-Person</option>
                    <option>Virtual</option>
                    <option>Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Venue / Link*</label>
                  <input name="venue" type="text" required placeholder="Location or Meeting Link" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Max Capacity*</label>
                  <input name="capacity" type="number" required placeholder="e.g. 50" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Volunteering Hours*</label>
                  <input name="hours" type="number" required placeholder="e.g. 4" className="form-input" />
                </div>
                <div className="md:col-span-2 flex items-center gap-3">
                  <input name="openToAll" type="checkbox" id="openToAll" className="w-5 h-5 rounded border-slate-300 text-tata-blue focus:ring-tata-blue" />
                  <label htmlFor="openToAll" className="text-sm font-medium text-slate-700">Open to all Tata Group companies</label>
                </div>
                <div className="md:col-span-2 flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowCreateEvent(false)} className="flex-1 btn-outline cursor-pointer">Cancel</button>
                  <button type="submit" className="flex-1 btn-black cursor-pointer">Post Event</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* TVW Vibe Modal */}
        {showVibeModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
              onClick={() => setShowVibeModal(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Submit to TVW Vibe</h3>
              <p className="text-sm text-slate-500 mb-8">{showVibeModal.title}</p>
              
              <div className="space-y-5">
                {/* Submit on behalf of — Corporate SPOC only */}
                {!isRegionalSPOC && (
                  <div>
                    <label className="form-label">Submit on behalf of</label>
                    <select className="form-input">
                      <option value="">Myself (Corporate SPOC)</option>
                      {SPOC_DIRECTORY.filter(s => s.role === "Regional SPOC").map(s => (
                        <option key={s.id} value={s.id}>{s.name} — {s.geography}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center hover:border-tata-blue transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:text-tata-blue group-hover:bg-tata-blue/5 transition-all">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Drag & drop photos here</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                </div>

                <div>
                  <label className="form-label">Caption</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="A short, catchy headline"
                    value={vibeForm.caption}
                    onChange={(e) => setVibeForm({ ...vibeForm, caption: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Location</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Mumbai, Maharashtra"
                      value={vibeForm.location}
                      onChange={(e) => setVibeForm({ ...vibeForm, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">NGO Partner</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Teach For India"
                    />
                  </div>
                  <div>
                    <label className="form-label">Number of Volunteers</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="e.g. 25"
                    />
                  </div>
                  <div>
                    <label className="form-label">Activity Type</label>
                    <select className="form-input">
                      <option value="">Select type</option>
                      <option>Education</option>
                      <option>Environment</option>
                      <option>Health</option>
                      <option>Skilling</option>
                      <option>Community Development</option>
                      <option>Disaster Relief</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Impact Statement</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. 50 students taught"
                    value={vibeForm.impact}
                    onChange={(e) => setVibeForm({ ...vibeForm, impact: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-input min-h-[100px]" 
                    placeholder="Describe the event, activities, and outcomes..."
                  />
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <strong>Note:</strong> Admin will review and select Top 10 stories. You'll see a preview before it goes live.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setShowVibeModal(null)} className="flex-1 btn-outline cursor-pointer">Cancel</button>
                  <button 
                    onClick={handleVibeSubmit}
                    disabled={!vibeForm.caption || !vibeForm.impact}
                    className="flex-1 btn-black disabled:opacity-50 cursor-pointer"
                  >
                    Submit Update
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add/Edit SPOC Modal */}
        {(showAddSpoc || editingSpoc) && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
              onClick={() => { setShowAddSpoc(false); setEditingSpoc(null); }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                {editingSpoc ? "Edit Regional SPOC" : "Add Regional SPOC"}
              </h3>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Email*</label>
                    <input type="email" placeholder="name@tata.com" className="form-input" defaultValue={editingSpoc?.email} />
                  </div>
                  <div>
                    <label className="form-label">SPOC Name*</label>
                    <input type="text" placeholder="Full name" className="form-input" defaultValue={editingSpoc?.name} />
                  </div>
                  <div>
                    <label className="form-label">Entity Name*</label>
                    <input type="text" placeholder="e.g. Tata Consultancy Services" className="form-input" defaultValue="" />
                  </div>
                  <div>
                    <label className="form-label">Company Name*</label>
                    <input type="text" placeholder="e.g. TCS" className="form-input" defaultValue={editingSpoc?.company} />
                  </div>
                  <div>
                    <label className="form-label">City*</label>
                    <input type="text" placeholder="e.g. Mumbai" className="form-input" defaultValue="" />
                  </div>
                  <div>
                    <label className="form-label">Country*</label>
                    <input type="text" placeholder="e.g. India" className="form-input" defaultValue="" />
                  </div>
                  <div>
                    <label className="form-label">Contact No*</label>
                    <input type="tel" placeholder="+91 XXXXX XXXXX" className="form-input" defaultValue="" />
                  </div>
                  <div>
                    <label className="form-label">Designation*</label>
                    <input type="text" placeholder="e.g. Regional Manager" className="form-input" defaultValue="" />
                  </div>
                  <div>
                    <label className="form-label">Function</label>
                    <select className="form-input" defaultValue="">
                      <option value="">Select Function</option>
                      <option>HR</option>
                      <option>CSR</option>
                      <option>Operations</option>
                      <option>IT</option>
                      <option>Finance</option>
                      <option>Marketing</option>
                      <option>Administration</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Gender</label>
                    <select className="form-input" defaultValue="">
                      <option value="">Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Non-binary</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Geography*</label>
                  <select className="form-input" defaultValue={editingSpoc?.geography || ""}>
                    <option value="">Select Geography</option>
                    <option>North India</option>
                    <option>South India</option>
                    <option>East India</option>
                    <option>West India</option>
                    <option>UK & Europe</option>
                    <option>North America</option>
                  </select>
                </div>
                <p className="text-xs text-slate-400 italic leading-relaxed">Only registered Tata employees can be added as SPOCs. Family members and retired employees are not eligible.</p>
                <div className="pt-2 flex gap-4">
                  <button type="button" onClick={() => { setShowAddSpoc(false); setEditingSpoc(null); }} className="flex-1 btn-outline cursor-pointer">Cancel</button>
                  <button type="button" onClick={() => { setShowAddSpoc(false); setEditingSpoc(null); }} className="flex-1 btn-black cursor-pointer">
                    {editingSpoc ? "Save Changes" : "Assign Role"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Deactivate SPOC Modal */}
        {deactivatingSpoc && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
              onClick={() => setDeactivatingSpoc(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Deactivate SPOC?</h3>
              <p className="text-slate-500 mb-8">
                Are you sure you want to deactivate <strong>{deactivatingSpoc.name}</strong>? They will lose access to the SPOC Corner immediately.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setDeactivatingSpoc(null)} className="flex-1 btn-outline cursor-pointer">Cancel</button>
                <button onClick={() => setDeactivatingSpoc(null)} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-all cursor-pointer">Deactivate</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Reject Approval Modal */}
        {rejectingApproval && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
              onClick={() => setRejectingApproval(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-10"
            >
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Reject Application</h3>
              <div className="space-y-6">
                <div>
                  <label className="form-label">Reason for Rejection*</label>
                  <textarea 
                    className="form-input min-h-[120px]" 
                    placeholder="e.g. Document unclear, Invalid employee ID..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setRejectingApproval(null)} className="flex-1 btn-outline cursor-pointer">Cancel</button>
                  <button 
                    onClick={handleReject}
                    disabled={!rejectionReason}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Confirm Reject
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Document Drawer */}
        {selectedApproval && (
          <div className="fixed inset-0 z-[200] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
              onClick={() => setSelectedApproval(null)}
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">Verification Details</h3>
                <button onClick={() => setSelectedApproval(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="space-y-4">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Volunteer Profile</p>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-500">Full Name</span>
                        <span className="text-xs font-bold text-slate-800">{selectedApproval.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-500">Type</span>
                        <span className="text-xs font-bold text-slate-800">{selectedApproval.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-500">Email</span>
                        <span className="text-xs font-bold text-slate-800">{selectedApproval.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-500">Company</span>
                        <span className="text-xs font-bold text-slate-800">{selectedApproval.company}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Submitted Documents</p>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200">
                      <div className="w-12 h-12 bg-tata-blue/5 text-tata-blue rounded-lg flex items-center justify-center">
                        <FileText size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-800">{selectedApproval.documents}</p>
                        <p className="text-xs text-slate-400">Uploaded on {selectedApproval.registeredDate}</p>
                      </div>
                      <button className="p-2 hover:bg-slate-50 rounded-lg text-tata-blue cursor-pointer">
                        <Download size={16} />
                      </button>
                    </div>
                    <div className="mt-6 aspect-[3/4] bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 italic text-xs">
                      Document Preview Placeholder
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4">
                {selectedApproval.status === "Pending" ? (
                  <>
                    <button 
                      onClick={() => { handleApprove(selectedApproval.id); setSelectedApproval(null); }}
                      className="flex-1 btn-black py-4 cursor-pointer"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => { setRejectingApproval(selectedApproval); setSelectedApproval(null); }}
                      className="flex-1 btn-outline py-4 bg-white cursor-pointer"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <div className={`w-full py-4 rounded-lg text-center font-bold uppercase tracking-widest ${
                    selectedApproval.status === "Approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {selectedApproval.status}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Certificate Preview Modal */}
        {showCertificatePreview && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/80 backdrop-blur-md"
              onClick={() => setShowCertificatePreview(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              <div className="flex-1 p-12 bg-white flex flex-col items-center text-center border-r border-slate-100">
                <div className="w-24 h-24 mb-8">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/1200px-Tata_logo.svg.png" alt="Tata Logo" className="w-full h-full object-contain" />
                </div>
                <h2 className="text-3xl font-serif italic text-slate-800 mb-2">Certificate of Appreciation</h2>
                <p className="text-slate-500 uppercase tracking-[0.3em] text-xs font-bold mb-12">This is presented to</p>
                <h3 className="text-4xl font-bold text-tata-blue mb-4">{showCertificatePreview.name}</h3>
                <div className="w-32 h-0.5 bg-tata-cyan mb-8" />
                <p className="text-slate-600 leading-relaxed max-w-md mb-12">
                  For their exceptional contribution to the <span className="font-bold text-slate-800">{showCertificatePreview.project}</span> project 
                  in collaboration with <span className="font-bold text-slate-800">{showCertificatePreview.ngo}</span> during the 
                  Tata ProEngage Edition 2025.
                </p>
                <div className="grid grid-cols-2 gap-20 w-full max-w-sm">
                  <div className="text-center">
                    <div className="h-px bg-slate-200 mb-4" />
                    <p className="text-xs font-bold text-slate-400 uppercase">Program Head</p>
                    <p className="text-xs font-bold text-slate-800">Tata Sustainability Group</p>
                  </div>
                  <div className="text-center">
                    <div className="h-px bg-slate-200 mb-4" />
                    <p className="text-xs font-bold text-slate-400 uppercase">Date</p>
                    <p className="text-xs font-bold text-slate-800">{showCertificatePreview.date}</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-80 bg-slate-50 p-10 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 mb-6">Certificate Details</h4>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">ID</p>
                      <p className="text-sm font-mono text-slate-600">TP-2025-{showCertificatePreview.id.toString().padStart(4, "0")}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-lg uppercase">Verified</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <button className="w-full py-4 bg-tata-blue text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-900 transition-all cursor-pointer">
                    <Download size={18} /> Download PDF
                  </button>
                  <button 
                    onClick={() => setShowCertificatePreview(null)}
                    className="w-full py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SPOCDashboardView;
