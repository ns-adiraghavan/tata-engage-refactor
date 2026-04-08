import Drawer from "@/components/layout/Drawer";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, User, Users, Mail, Search, MapPin, Clock, Check, Sparkles, MessageSquare, ArrowRight, Star, Plus, Edit2, Trash2, Copy, AlertTriangle, Download, Inbox, CheckCircle2, LayoutGrid, Activity, ShieldAlert, FileText } from "lucide-react";
import type { View } from "@/types";
import { MOCK_APPLICANTS, ANJALI_MEHTA } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useLocation } from "react-router-dom";

const NGODashboardView = () => {
  const { setClonedProject, setActiveProject, ngoData, triggerToast } = useAppContext();
  const navigate = useAppNavigate();
  const location = useLocation();
  
  const [applicationTab, setApplicationTab] = useState<"shortlist" | "all">("shortlist");
  const [coordinators, setCoordinators] = useState(ngoData.coordinators);
  const [showAddCoordinator, setShowAddCoordinator] = useState(false);
  const [newCoordinator, setNewCoordinator] = useState({ name: "", email: "", role: "Coordinator" });
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [dismissedReminders, setDismissedReminders] = useState<number[]>([]);
  const [drillEdition, setDrillEdition] = useState<string | null>(null);
  const [drillProject, setDrillProject] = useState<any | null>(null);

  const [activeNav, setActiveNav] = useState("Dashboard");
  const [grievanceForm, setGrievanceForm] = useState({ category: "", description: "", projectId: "" });
  const [submittedGrievances, setSubmittedGrievances] = useState<any[]>([]);
  const [selectedPartnerNGO, setSelectedPartnerNGO] = useState<any>(null);

  const feedbackDueProjects = ngoData.projects.filter(p => {
    if (p.status !== "Active" || !p.endDate) return false;
    const end = new Date(p.endDate);
    const now = new Date();
    const diff = (end.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diff <= 3 && diff >= -1;
  });

  // Application Management State
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSkill, setFilterSkill] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [selectedApplicants, setSelectedApplicants] = useState<number[]>([]);
  const [auditLog, setAuditLog] = useState<{ id: number, action: string, volunteer: string, date: string }[]>([]);

  const navItems = [
    { name: "Dashboard", icon: LayoutGrid, sectionId: "ngo-section-dashboard" },
    { name: "M&E Tracker", icon: Activity, sectionId: "ngo-section-me" },
    { name: "Feedback Module", icon: MessageSquare, sectionId: "ngo-section-feedback",
      badge: ngoData.projects?.filter((p: any) => p.status === "Active").length ?? 0 },
    { name: "Grievance Redressal", icon: ShieldAlert, sectionId: "ngo-section-grievance" },
    { name: "Reports", icon: FileText, sectionId: "ngo-section-reports" },
    { name: "Partner NGOs", icon: Users, sectionId: "ngo-section-partner-ngos" },
  ];

  const handleCloneSelect = (project: any) => {
    const fullProjectData = {
      title: project.title,
      skillArea: "Education",
      mode: "Hybrid",
      duration: "3 months",
      volunteers: project.volunteers || 5,
      location: "Mumbai",
      brief: "This project aims to provide quality education and support to underprivileged children in urban areas. Volunteers will assist in teaching basic literacy and numeracy skills.",
      outcomes: project.status === "Closed" ? "Successfully reached 500+ children with improved literacy scores." : "",
      isClone: true,
      sourceTitle: project.title
    };
    setClonedProject(fullProjectData);
    setShowCloneModal(false);
    navigate("create-project");
  };

  const handleAddCoordinator = (e: React.FormEvent) => {
    e.preventDefault();
    setCoordinators([...coordinators, { id: Date.now(), ...newCoordinator }]);
    setNewCoordinator({ name: "", email: "", role: "Coordinator" });
    setShowAddCoordinator(false);
    triggerToast("Coordinator added successfully!");
  };

  const handleDeleteCoordinator = (id: number) => {
    setCoordinators(coordinators.filter(c => c.id !== id));
    triggerToast("Coordinator removed.");
  };

  const handleAccept = (id: number) => {
    const applicant = applicants.find(a => a.id === id);
    if (!applicant) return;

    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "Matched" } : a));
    setAuditLog(prev => [{
      id: Date.now(),
      action: "Accepted",
      volunteer: applicant.name,
      date: new Date().toLocaleString()
    }, ...prev]);
    
    triggerToast(`Accepted ${applicant.name}. Notification email sent.`);
    
    const matchedCount = applicants.filter(a => a.status === "Matched").length + 1;
    if (matchedCount >= 5) {
      setApplicants(prev => prev.map(a => a.status === "Pending" ? { ...a, status: "Fulfilled" } : a));
      triggerToast("Project requirement met. Remaining applications marked as Fulfilled.");
    }
  };

  const handleReject = (id: number) => {
    const applicant = applicants.find(a => a.id === id);
    if (!applicant) return;

    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "Rejected" } : a));
    setAuditLog(prev => [{
      id: Date.now(),
      action: "Rejected",
      volunteer: applicant.name,
      date: new Date().toLocaleString()
    }, ...prev]);
    
    triggerToast(`${applicant.name} rejected. They can still apply to other projects.`);
  };

  const handleBulkAccept = () => {
    const selectedNames = applicants.filter(a => selectedApplicants.includes(a.id)).map(a => a.name);
    setApplicants(prev => prev.map(a => selectedApplicants.includes(a.id) ? { ...a, status: "Matched" } : a));
    
    const newLogs = selectedApplicants.map(id => ({
      id: Math.random(),
      action: "Accepted (Bulk)",
      volunteer: applicants.find(a => a.id === id)?.name || "Unknown",
      date: new Date().toLocaleString()
    }));
    
    setAuditLog(prev => [...newLogs, ...prev]);
    setSelectedApplicants([]);
    triggerToast(`Bulk accepted ${selectedApplicants.length} volunteers.`);
  };

  const filteredApplicants = applicants.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSkill = filterSkill === "" || a.skills.includes(filterSkill);
    const matchesCity = filterCity === "" || a.city === filterCity;
    return matchesSearch && matchesSkill && matchesCity;
  });

  const shortlistedApplicants = [...applicants]
    .filter(a => a.status === "Pending")
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return (
    <div className="min-h-screen pt-20 bg-[#F8FAFC] flex">

      {/* Left Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col p-6 fixed h-[calc(100vh-80px)] top-20 z-20">
        {/* NGO identity card */}
        <div className="mb-6">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {ngoData.organization?.charAt(0) ?? "N"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{ngoData.organization}</p>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                {ngoData.tier ?? "Partner NGO"}
              </p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div className="space-y-1 flex-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.3em] mb-3 px-3">Navigation</p>
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveNav(item.name);
                document.getElementById(item.sectionId)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all cursor-pointer group ${
                activeNav === item.name
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${
                activeNav === item.name ? "bg-white/20" : "bg-slate-100 group-hover:bg-white"
              }`}>
                <item.icon size={16} />
              </div>
              {item.name}
              {item.badge && item.badge > 0 && (
                <span className={`ml-auto text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold ${
                  activeNav === item.name ? "bg-white/20 text-white" : "bg-red-500 text-white"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Support card at bottom */}
        <div className="pt-6 mt-6 border-t border-slate-100">
          <div className="p-5 bg-gradient-to-br from-slate-900 to-zinc-800 rounded-2xl text-white relative overflow-hidden">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Support</p>
            <p className="text-xs text-white/60 mb-3 leading-relaxed">Questions about your account or projects?</p>
            <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all cursor-pointer border border-white/10">
              Contact TSG Admin
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-6 md:p-12">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* ═══ SECTION: Dashboard ═══ */}
          <section id="ngo-section-dashboard">
            {/* Feedback Reminders */}
            <AnimatePresence>
              {feedbackDueProjects.map(project => {
                const daysLeft = Math.ceil((new Date(project.endDate!).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                return !dismissedReminders.includes(project.id) && (
                  <motion.div 
                    key={project.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mb-4 p-6 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative z-10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                        <Clock size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-900">Feedback due {daysLeft <= 0 ? 'today' : `in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`}</h4>
                        <p className="text-sm text-amber-700 opacity-80">Please complete the volunteer assessments for <span className="font-bold">"{project.title}"</span> to trigger certificate generation.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setDismissedReminders([...dismissedReminders, project.id])} className="text-xs font-bold text-amber-600 hover:underline cursor-pointer">Dismiss</button>
                      <button 
                        onClick={() => {
                          setActiveProject(project);
                          navigate("project-feedback");
                        }}
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-amber-700 transition-all cursor-pointer"
                      >
                        Complete Feedback
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* AI Risk Flag Alert */}
            <AnimatePresence>
              {ANJALI_MEHTA.projects.some(p => p.status === "Active") && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-red-800 tracking-tight">⚠️ Project health flagged – review recommended</h4>
                      <p className="text-xs text-red-600 opacity-80">One or more active projects require immediate attention.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const activeProj = ANJALI_MEHTA.projects.find(p => p.status === "Active");
                      if (activeProj) {
                        setActiveProject(activeProj);
                        navigate("active-project-management");
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all cursor-pointer"
                  >
                    Review Now
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stat Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
              {[
                { label: "Active Projects", value: ANJALI_MEHTA.projects.filter(p => p.status === "Active").length, sub: "This edition", icon: Sparkles, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                { label: "Volunteers Matched", value: ANJALI_MEHTA.projects.filter(p => p.status === "Active" || p.status === "Closed").reduce((sum, p) => sum + p.volunteers, 0), sub: "All active projects", icon: Users, color: "text-tata-blue", bg: "bg-blue-50", border: "border-blue-100" },
                { label: "Pending Applications", value: ANJALI_MEHTA.pendingApplications, sub: "Awaiting review", icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
              ].map((stat, i) => (
                <div key={i} className={`p-8 rounded-3xl bg-white border ${stat.border} shadow-sm hover:shadow-sm transition-all group relative overflow-hidden`}>
                  <div className="absolute top-6 right-6 text-slate-200"><stat.icon size={24} /></div>
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon size={28} />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h4>
                  <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">{stat.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Project Management Panel */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Projects</p>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Project Management</h3>
                    </div>
                    {ngoData.pendingApplications > 0 && (
                      <span className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                        <span className="w-4 h-4 bg-red-500 text-white flex items-center justify-center rounded-full text-[10px]">{ngoData.pendingApplications}</span>
                        Pending applications
                      </span>
                    )}
                  </div>
                  <>
                  <AnimatePresence mode="wait">
                    {/* ─── LEVEL 1: Edition list ─── */}
                    {!drillEdition && (
                      <motion.div key="editions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="flex items-center gap-2 mb-6">
                          <span className="text-xs font-medium text-zinc-800">Editions</span>
                        </div>
                        <div className="space-y-3">
                          {[
                            { id: "pe-2025", label: "ProEngage · April 2025", status: "Active", projects: ngoData.projects },
                            { id: "pe-2024", label: "ProEngage · October 2024", status: "Closed", projects: [] },
                          ].map((edition) => (
                            <button
                              key={edition.id}
                              onClick={() => setDrillEdition(edition.id)}
                              className="w-full flex items-center justify-between p-5 bg-white border border-zinc-100 rounded-2xl hover:border-tata-cyan hover:shadow-sm transition-all cursor-pointer text-left group"
                            >
                              <div>
                                <p className="font-semibold text-zinc-900 text-sm">{edition.label}</p>
                                <p className="text-xs text-zinc-400 mt-1">{edition.projects?.length ?? 0} projects</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${edition.status === "Active" ? "bg-green-50 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                                  {edition.status}
                                </span>
                                <ChevronRight size={16} className="text-zinc-300 group-hover:text-tata-cyan transition-colors" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* ─── LEVEL 2: Project list within edition ─── */}
                    {drillEdition && !drillProject && (
                      <motion.div key="projects" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="flex items-center gap-2 mb-6">
                          <button onClick={() => setDrillEdition(null)} className="text-xs font-medium text-zinc-400 hover:text-zinc-700 cursor-pointer">Editions</button>
                          <span className="text-zinc-300 text-xs">›</span>
                          <span className="text-xs font-medium text-zinc-800">{drillEdition === "pe-2025" ? "ProEngage · April 2025" : "ProEngage · October 2024"}</span>
                        </div>
                        <div className="flex gap-3 mb-5">
                          <div className="relative flex-1">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input placeholder="Search projects..." className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tata-blue/10" />
                          </div>
                          <select className="text-sm border border-zinc-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-tata-blue/10">
                            <option>All companies</option>
                            <option>TCS</option>
                            <option>Tata Steel</option>
                            <option>Tata Motors</option>
                          </select>
                        </div>
                        <div className="space-y-3">
                          {(ngoData.projects ?? []).map((project: any) => (
                            <button
                              key={project.id}
                              onClick={() => setDrillProject(project)}
                              className="w-full flex items-center justify-between p-5 bg-white border border-zinc-100 rounded-2xl hover:border-tata-cyan hover:shadow-sm transition-all cursor-pointer text-left group"
                            >
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${project.status === "Active" ? "bg-green-50 text-green-700" : project.status === "Under Review" ? "bg-amber-50 text-amber-700" : "bg-zinc-100 text-zinc-500"}`}>
                                    {project.status}
                                  </span>
                                </div>
                                <p className="font-semibold text-zinc-900 text-sm">{project.title}</p>
                                <p className="text-xs text-zinc-400 mt-1">{project.volunteersMatched ?? project.volunteers ?? 0} volunteers · {project.applicantCount ?? project.applications ?? 0} applications</p>
                              </div>
                              <ChevronRight size={16} className="text-zinc-300 group-hover:text-tata-cyan transition-colors" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* ─── LEVEL 3: Volunteer list within project ─── */}
                    {drillProject && (
                      <motion.div key="volunteers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="flex items-center gap-2 mb-6">
                          <button onClick={() => { setDrillEdition(null); setDrillProject(null); }} className="text-xs font-medium text-zinc-400 hover:text-zinc-700 cursor-pointer">Editions</button>
                          <span className="text-zinc-300 text-xs">›</span>
                          <button onClick={() => setDrillProject(null)} className="text-xs font-medium text-zinc-400 hover:text-zinc-700 cursor-pointer">{drillEdition === "pe-2025" ? "ProEngage · April 2025" : "ProEngage · October 2024"}</button>
                          <span className="text-zinc-300 text-xs">›</span>
                          <span className="text-xs font-medium text-zinc-800">{drillProject.title}</span>
                        </div>
                        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-zinc-100 bg-zinc-50">
                                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Volunteer</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Status</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Feedback</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Hours</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(Array.isArray(drillProject.volunteers) ? drillProject.volunteers : [
                                { name: "Priya Sharma", status: "Active", feedbackDone: false, hours: null },
                                { name: "Amit Verma", status: "Matched", feedbackDone: false, hours: null },
                              ]).map((v: any, i: number) => (
                                <tr key={i} className="border-b border-zinc-50 hover:bg-slate-50 transition-colors">
                                  <td className="px-5 py-4 font-medium text-zinc-900">{v.name}</td>
                                  <td className="px-5 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${v.status === "Active" ? "bg-green-50 text-green-700" : v.status === "Matched" ? "bg-blue-50 text-blue-700" : "bg-zinc-100 text-zinc-500"}`}>
                                      {v.status}
                                    </span>
                                  </td>
                                  <td className="px-5 py-4">
                                    {v.feedbackDone
                                      ? <span className="text-xs text-green-600 font-semibold flex items-center gap-1"><CheckCircle2 size={12} /> Submitted</span>
                                      : <button onClick={() => { setActiveProject(drillProject); navigate("project-feedback"); }} className="text-xs font-semibold text-tata-blue hover:underline cursor-pointer">Give Feedback</button>
                                    }
                                  </td>
                                  <td className="px-5 py-4 text-xs text-zinc-500">{v.hours ?? "—"}</td>
                                  <td className="px-5 py-4">
                                    <button onClick={() => { setActiveProject(drillProject); navigate("active-project-management"); }} className="text-xs font-semibold text-zinc-400 hover:text-zinc-700 cursor-pointer">View</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {(drillProject.status === "Closed" || drillProject.status === "Closed – Certified") && (
                          <div className="mt-6 flex items-center gap-4 p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                            <div className="text-3xl">🏅</div>
                            <div>
                              <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-0.5">Project Completed</p>
                              <p className="text-sm font-bold text-amber-900">Badge awarded to Pratham Foundation</p>
                              <p className="text-xs text-amber-700 mt-0.5">Certificate generation triggered — pending TSG Admin approval.</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  </>
                </div>

                {/* Coordinator Management Section */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Team</p>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Coordinator Management</h3>
                      <p className="text-sm text-slate-500 mt-1">Manage your NGO SPOCs and program coordinators</p>
                    </div>
                    <button 
                      onClick={() => setShowAddCoordinator(true)}
                      className="flex items-center gap-2 text-tata-blue font-bold hover:underline cursor-pointer"
                    >
                      <Plus size={18} /> Add New
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coordinators.map(coord => (
                      <div key={coord.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-tata-blue shadow-sm">
                            <User size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{coord.name}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase text-tata-cyan">{coord.role}</span>
                              <span className="text-xs text-slate-400">{coord.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button className="p-2 text-slate-400 hover:text-tata-blue cursor-pointer"><Edit2 size={14} /></button>
                          <button onClick={() => handleDeleteCoordinator(coord.id)} className="p-2 text-slate-400 hover:text-red-500 cursor-pointer"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400 mt-4 italic">
                    Coordinators can only edit projects assigned to them before Admin approval. For access changes, contact TSG Admin.
                  </p>

                  {showAddCoordinator && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 p-6 rounded-2xl bg-tata-blue/5 border border-tata-blue/10"
                    >
                      <form onSubmit={handleAddCoordinator} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input 
                            type="text" 
                            placeholder="Full Name" 
                            required
                            className="form-input" 
                            value={newCoordinator.name}
                            onChange={e => setNewCoordinator({...newCoordinator, name: e.target.value})}
                          />
                          <input 
                            type="email" 
                            placeholder="Email" 
                            required
                            className="form-input"
                            value={newCoordinator.email}
                            onChange={e => setNewCoordinator({...newCoordinator, email: e.target.value})}
                          />
                          <select 
                            className="form-input"
                            value={newCoordinator.role}
                            onChange={e => setNewCoordinator({...newCoordinator, role: e.target.value})}
                          >
                            <option>Coordinator</option>
                            <option>SPOC</option>
                            <option>Field Lead</option>
                          </select>
                        </div>
                        <div className="flex justify-end gap-3">
                          <button type="button" onClick={() => setShowAddCoordinator(false)} className="btn-outline py-2 px-6 cursor-pointer">Cancel</button>
                          <button type="submit" className="btn-black py-2 px-6 cursor-pointer">Add Coordinator</button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Sidebar Stats & Shortlists */}
              <div className="space-y-8">
                {/* Application Queue */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                  {/* Header */}
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Queue</p>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Applications</h3>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      applicants.filter(a => a.status === "Pending").length > 0
                        ? "bg-red-50 text-red-600"
                        : "bg-green-50 text-green-600"
                    }`}>
                      {applicants.filter(a => a.status === "Pending").length} Pending
                    </span>
                  </div>
                  {/* Tab toggle */}
                  <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-5">
                    {(["shortlist", "all"] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setApplicationTab(tab)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          applicationTab === tab
                            ? "bg-white text-tata-blue shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {tab === "shortlist" ? "🤖 AI Shortlist" : `All (${applicants.length})`}
                      </button>
                    ))}
                  </div>
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      placeholder="Search name or skill..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-tata-blue/10"
                    />
                  </div>
                  {/* Applicant list */}
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {(applicationTab === "shortlist" ? shortlistedApplicants : filteredApplicants)
                      .length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-8 italic">No applicants found.</p>
                    ) : (
                      (applicationTab === "shortlist" ? shortlistedApplicants : filteredApplicants)
                        .map((applicant, i) => (
                          <div
                            key={applicant.id}
                            className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-tata-blue/20 hover:bg-slate-50 transition-all group cursor-pointer"
                            onClick={() => {
                              setSelectedApplicant(applicant);
                              setIsProfileDrawerOpen(true);
                            }}
                          >
                            {applicationTab === "shortlist" && (
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                                i === 0 ? "bg-amber-400 text-white" :
                                i === 1 ? "bg-slate-300 text-slate-700" :
                                i === 2 ? "bg-orange-300 text-white" :
                                "bg-slate-100 text-slate-500"
                              }`}>
                                {i + 1}
                              </div>
                            )}
                            <div className="w-8 h-8 rounded-lg bg-tata-blue/10 text-tata-blue flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {applicant.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">{applicant.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {applicant.city} · {applicant.availability}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className={`text-xs font-black ${
                                applicant.matchPercentage >= 90 ? "text-emerald-600" :
                                applicant.matchPercentage >= 80 ? "text-tata-blue" :
                                "text-slate-400"
                              }`}>
                                {applicant.matchPercentage}%
                              </p>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                applicant.status === "Matched" ? "bg-green-50 text-green-700" :
                                applicant.status === "Rejected" ? "bg-red-50 text-red-600" :
                                "bg-amber-50 text-amber-700"
                              }`}>
                                {applicant.status}
                              </span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                  {applicationTab === "shortlist" &&
                    shortlistedApplicants.filter(a => a.status === "Pending").length >= 5 && (
                    <button
                      onClick={handleBulkAccept}
                      className="w-full mt-4 py-2.5 bg-tata-blue text-white text-xs font-bold rounded-xl hover:bg-tata-blue/90 transition-all cursor-pointer"
                    >
                      Bulk Accept Top {shortlistedApplicants.filter(a => a.status === "Pending").length}
                    </button>
                  )}
                  {auditLog.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recent Actions</p>
                      <div className="space-y-1.5">
                        {auditLog.slice(0, 2).map(log => (
                          <div key={log.id} className="flex items-center justify-between text-[10px]">
                            <span className={`font-bold ${log.action === "Accepted" || log.action === "Accepted (Bulk)" ? "text-green-600" : "text-red-500"}`}>
                              {log.action}
                            </span>
                            <span className="text-slate-400 truncate ml-2 max-w-[100px]">{log.volunteer}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-slate-900 to-zinc-800 rounded-2xl shadow-sm p-8 text-white">
                  <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Actions</p>
                  <h3 className="text-xl font-black text-white tracking-tight mb-6">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold flex items-center justify-between transition-all cursor-pointer">
                      Download All CVs <ArrowRight size={16} />
                    </button>
                    <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold flex items-center justify-between transition-all cursor-pointer">
                      Email Selected Volunteers <ArrowRight size={16} />
                    </button>
                    <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold flex items-center justify-between transition-all cursor-pointer">
                      Schedule Interviews <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ═══ SECTION: M&E Tracker ═══ */}
          <section id="ngo-section-me">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Monitoring & Evaluation</p>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">M&E Tracker</h2>
            <div className="space-y-6">
              {ngoData.projects
                ?.filter((p: any) => p.status === "Active" && p.healthUpdates)
                .map((project: any) => {
                  const hasRisk = project.healthUpdates.some(
                    (h: any) => h.status === "At Risk" || h.status === "Drop Out"
                  );
                  return (
                    <div key={project.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Active Project</p>
                          <h3 className="text-base font-black text-slate-900">{project.title}</h3>
                        </div>
                        {hasRisk && (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full">
                            <AlertTriangle size={12} /> Flagged
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {project.healthUpdates.map((update: any, idx: number) => (
                          <div key={idx} className={`p-4 rounded-xl border ${
                            update.status === "Healthy" ? "bg-green-50 border-green-100" :
                            update.status === "At Risk" ? "bg-red-50 border-red-100" :
                            update.status === "Drop Out" ? "bg-orange-50 border-orange-100" :
                            "bg-slate-50 border-slate-100"
                          }`}>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{update.month}</p>
                            <span className={`text-xs font-black uppercase tracking-wide ${
                              update.status === "Healthy" ? "text-green-700" :
                              update.status === "At Risk" ? "text-red-700" :
                              update.status === "Drop Out" ? "text-orange-700" :
                              "text-slate-400"
                            }`}>
                              {update.status === "Pending" ? "Awaiting" : update.status}
                            </span>
                            {update.date && (
                              <p className="text-[10px] text-slate-400 mt-1">{update.date}</p>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 mt-4 italic">
                        Health updates submitted monthly by TSG sub-admin after offline check-in calls. Read-only for NGO.
                      </p>
                    </div>
                  );
                })}
              {!ngoData.projects?.some((p: any) => p.status === "Active" && p.healthUpdates) && (
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 text-center">
                  <p className="text-sm text-slate-400 italic">No active projects with health data. M&E tracking begins once a project is matched and active.</p>
                </div>
              )}
            </div>
          </section>

          {/* ═══ SECTION: Feedback Module ═══ */}
          <section id="ngo-section-feedback">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">End-of-Edition</p>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Feedback Module</h2>
            <div className="space-y-3">
              {ngoData.projects?.map((project: any) => {
                const canGiveFeedback = project.status === "Active" || project.status === "Closed";
                return (
                  <div key={project.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        project.status === "Active" ? "bg-green-50 text-green-600" :
                        project.status === "Closed" ? "bg-slate-100 text-slate-500" :
                        "bg-slate-50 text-slate-300"
                      }`}>
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{project.title}</p>
                        <p className="text-xs text-slate-400">{project.volunteers ?? 0} volunteers · {project.status}</p>
                      </div>
                    </div>
                    {canGiveFeedback ? (
                      <button
                        onClick={() => {
                          setActiveProject(project);
                          navigate("project-feedback");
                        }}
                        className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-all cursor-pointer"
                      >
                        Give Feedback
                      </button>
                    ) : (
                      <span className="text-xs text-slate-300 font-bold uppercase tracking-widest">Not yet active</span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 mt-5 italic">
              Feedback is mandatory for certificate issuance. Both volunteer and NGO feedback must be submitted before TSG Admin can trigger certificates.
            </p>
          </section>

          {/* ═══ SECTION: Grievance Redressal ═══ */}
          <section id="ngo-section-grievance">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Support</p>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Grievance Redressal</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Submit form */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <h3 className="text-sm font-black text-slate-900 mb-5">Raise a Concern</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Project</label>
                    <select
                      value={grievanceForm.projectId}
                      onChange={e => setGrievanceForm({...grievanceForm, projectId: e.target.value})}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-white"
                    >
                      <option value="">Select a project</option>
                      {ngoData.projects?.filter((p: any) => p.status === "Active").map((p: any) => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Category</label>
                    <select
                      value={grievanceForm.category}
                      onChange={e => setGrievanceForm({...grievanceForm, category: e.target.value})}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-white"
                    >
                      <option value="">Select category</option>
                      <option>Volunteer conduct</option>
                      <option>Communication breakdown</option>
                      <option>Project scope disagreement</option>
                      <option>Scheduling conflict</option>
                      <option>Platform / technical issue</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Description</label>
                    <textarea
                      value={grievanceForm.description}
                      onChange={e => setGrievanceForm({...grievanceForm, description: e.target.value})}
                      placeholder="Describe the issue clearly. TSG Admin will acknowledge within 2 working days."
                      className="w-full h-28 px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!grievanceForm.category || !grievanceForm.description || !grievanceForm.projectId) {
                        triggerToast("Please fill all fields before submitting.");
                        return;
                      }
                      setSubmittedGrievances(prev => [...prev, { ...grievanceForm, id: Date.now(), status: "Open", date: new Date().toLocaleDateString() }]);
                      setGrievanceForm({ category: "", description: "", projectId: "" });
                      triggerToast("Grievance submitted. TSG Admin notified. Auto-acknowledgement sent.");
                    }}
                    className="w-full py-3 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-all cursor-pointer"
                  >
                    Submit Grievance
                  </button>
                </div>
              </div>

              {/* Open grievances */}
              <div>
                <h3 className="text-sm font-black text-slate-900 mb-4">Open Grievances</h3>
                {submittedGrievances.length === 0 ? (
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 text-center">
                    <p className="text-xs text-slate-400 italic">No open grievances. Only one grievance per active project at a time.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submittedGrievances.map(g => (
                      <div key={g.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{g.category}</span>
                          <span className="text-xs text-slate-400">{g.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{g.description}</p>
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-2">Status: {g.status} — Pending TSG Admin acknowledgement</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ═══ SECTION: Reports ═══ */}
          <section id="ngo-section-reports">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Analytics</p>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Edition Participation Report", desc: "Applications, matches, completions for ProEngage 2025", date: "Generated 1 Apr 2026" },
                { title: "Volunteer Engagement Summary", desc: "Hours logged, feedback rates, certificate status by volunteer", date: "Generated 1 Apr 2026" },
                { title: "Project Health Report", desc: "Monthly M&E status across all active projects", date: "Generated 20 Mar 2026" },
                { title: "Feedback Completion Tracker", desc: "Who has and hasn't submitted feedback before the deadline", date: "Generated 5 Apr 2026" },
              ].map((report, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
                  <p className="text-sm font-bold text-slate-900 mb-1">{report.title}</p>
                  <p className="text-xs text-slate-500 mb-3">{report.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{report.date}</span>
                    <button
                      onClick={() => triggerToast("Generating report... You will receive an email when it is ready.")}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-orange-500 hover:text-orange-500 transition-colors cursor-pointer"
                    >
                      <Download size={12} /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ SECTION: Partner NGOs ═══ */}
          {ngoData.partnerNGOs && ngoData.tier === "Lead Partner" && (
            <section id="ngo-section-partner-ngos">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Network</p>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Partner NGOs</h2>

              {!selectedPartnerNGO ? (
                <div className="space-y-3">
                  {ngoData.partnerNGOs.map((partner: any) => (
                    <div
                      key={partner.id}
                      className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex items-center justify-between hover:border-orange-200 transition-all cursor-pointer group"
                      onClick={() => setSelectedPartnerNGO(partner)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-black text-sm flex-shrink-0">
                          {partner.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{partner.name}</p>
                          <p className="text-xs text-slate-400">{partner.city} · {partner.focusArea} · {partner.projects.length} project{partner.projects.length !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          partner.status === "Active" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
                        }`}>
                          {partner.status}
                        </span>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-orange-400 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setSelectedPartnerNGO(null)}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-medium mb-6 cursor-pointer transition-colors"
                  >
                    ← Back to Partner NGOs
                  </button>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 mb-6">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-black text-lg flex-shrink-0">
                          {selectedPartnerNGO.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-black text-slate-900">{selectedPartnerNGO.name}</h3>
                          <p className="text-xs text-slate-500">{selectedPartnerNGO.city} · {selectedPartnerNGO.focusArea}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        selectedPartnerNGO.status === "Active" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {selectedPartnerNGO.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-5">
                      <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Volunteers</p>
                        <p className="text-xl font-black text-slate-900">{selectedPartnerNGO.volunteersTotal}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Projects</p>
                        <p className="text-xl font-black text-slate-900">{selectedPartnerNGO.projects.length}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Partner Since</p>
                        <p className="text-sm font-black text-slate-900">{new Date(selectedPartnerNGO.joinedDate).getFullYear()}</p>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Contact</p>
                      <p className="text-sm font-bold text-slate-900">{selectedPartnerNGO.contactName}</p>
                      <p className="text-xs text-slate-500">{selectedPartnerNGO.contactEmail}</p>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Projects</h4>
                  <div className="space-y-2">
                    {selectedPartnerNGO.projects.length === 0 ? (
                      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 text-center">
                        <p className="text-xs text-slate-400 italic">No projects for this partner NGO yet.</p>
                      </div>
                    ) : (
                      selectedPartnerNGO.projects.map((proj: any) => (
                        <div key={proj.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{proj.title}</p>
                            <p className="text-xs text-slate-400">{proj.volunteers} volunteer{proj.volunteers !== 1 ? "s" : ""}</p>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            proj.status === "Active" ? "bg-green-50 text-green-700" :
                            proj.status === "Closed" ? "bg-slate-100 text-slate-500" :
                            "bg-amber-50 text-amber-700"
                          }`}>
                            {proj.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-5 italic">
                    Partner NGO projects are view-only. Partner NGOs manage their own projects independently and do not have edit access to Lead Partner data.
                  </p>
                </div>
              )}
            </section>
          )}

        </div>
      </main>

      {/* Previous Projects Modal */}
      <AnimatePresence>
        {showCloneModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
              onClick={() => setShowCloneModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 bg-tata-blue text-white flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">Select Previous Project</h3>
                  <p className="text-white/60 text-sm">Choose a project to use as a template</p>
                </div>
                <button onClick={() => setShowCloneModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4">
                {ANJALI_MEHTA.projects.filter(p => ["Active", "Closed", "Under Review"].includes(p.status)).map(project => (
                  <div 
                    key={project.id}
                    onClick={() => handleCloneSelect(project)}
                    className="p-6 rounded-2xl border border-slate-100 hover:border-tata-cyan hover:bg-tata-cyan/5 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-tata-blue bg-tata-blue/5 px-2 py-0.5 rounded uppercase tracking-wider">Edition 2025</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                            project.status === 'Active' ? 'bg-green-100 text-green-700' :
                            project.status === 'Under Review' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 group-hover:text-tata-blue transition-colors">{project.title}</h4>
                      </div>
                      <ChevronRight size={20} className="text-slate-300 group-hover:text-tata-cyan transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button onClick={() => setShowCloneModal(false)} className="btn-outline py-3 px-8 cursor-pointer">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Volunteer Profile Drawer */}
      <Drawer 
        isOpen={isProfileDrawerOpen} 
        onClose={() => setIsProfileDrawerOpen(false)} 
        title="Volunteer Profile"
      >
        {selectedApplicant && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
              <div className="w-24 h-24 rounded-3xl bg-tata-blue text-white flex items-center justify-center text-3xl font-bold">
                {selectedApplicant.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">{selectedApplicant.name}</h3>
                <p className="text-slate-500 flex items-center gap-2 text-sm"><Mail size={14} /> {selectedApplicant.email}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="bg-tata-cyan/10 text-tata-cyan text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {selectedApplicant.matchPercentage}% Match
                  </span>
                  {selectedApplicant.isReturning && (
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Returning
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</label>
                <p className="text-sm font-medium text-slate-700 flex items-center gap-2"><MapPin size={14} /> {selectedApplicant.city}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Availability</label>
                <p className="text-sm font-medium text-slate-700 flex items-center gap-2"><Clock size={14} /> {selectedApplicant.availability}</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Experience Summary</label>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed">
                {selectedApplicant.experience}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Skills & Expertise</label>
              <div className="flex flex-wrap gap-2">
                {selectedApplicant.skills.map((skill: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Languages</label>
              <div className="flex flex-wrap gap-2">
                {selectedApplicant.languages.map((lang: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {selectedApplicant.status === "Pending" && (
              <div className="flex gap-4 pt-8">
                <button 
                  onClick={() => {
                    handleReject(selectedApplicant.id);
                    setIsProfileDrawerOpen(false);
                  }}
                  className="flex-1 btn-outline py-4 text-red-500 border-red-100 hover:bg-red-50 cursor-pointer"
                >
                  Reject
                </button>
                <button 
                  onClick={() => {
                    handleAccept(selectedApplicant.id);
                    setIsProfileDrawerOpen(false);
                  }}
                  className="flex-1 btn-black py-4 shadow-xl shadow-black/10 cursor-pointer"
                >
                  Accept Volunteer
                </button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default NGODashboardView;
