import Drawer from "@/components/layout/Drawer";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, User, Users, Mail, Search, MapPin, Clock, Check, Sparkles, MessageSquare, ArrowRight, Star, Plus, Edit2, Trash2, Copy, AlertTriangle, Download, Inbox, CheckCircle2 } from "lucide-react";
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

  const handleCloneSelect = (project: any) => {
    // Mocking full data for the clone since ANJALI_MEHTA.projects is simplified
    const fullProjectData = {
      title: project.title,
      skillArea: "Education", // Mocked
      mode: "Hybrid", // Mocked
      duration: "3 months", // Mocked
      volunteers: project.volunteers || 5,
      location: "Mumbai", // Mocked
      brief: "This project aims to provide quality education and support to underprivileged children in urban areas. Volunteers will assist in teaching basic literacy and numeracy skills.", // Mocked
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
    
    // Check if project is fulfilled (simulated logic)
    const matchedCount = applicants.filter(a => a.status === "Matched").length + 1;
    if (matchedCount >= 5) { // Assuming 5 is the limit for this demo
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
    <div className="min-h-screen pt-20 bg-[#F8FAFC]">

      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-16 pb-20">
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

        {/* AI Risk Flag Alert for NGO Dashboard */}
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
            <div key={i} className={`p-8 rounded-3xl bg-white border ${stat.border} shadow-sm hover:shadow-xl transition-all group relative overflow-hidden`}>
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
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Projects</p>
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
                                  : <button className="text-xs font-semibold text-tata-blue hover:underline cursor-pointer">Give Feedback</button>
                                }
                              </td>
                              <td className="px-5 py-4 text-xs text-zinc-500">{v.hours ?? "—"}</td>
                              <td className="px-5 py-4">
                                <button className="text-xs font-semibold text-zinc-400 hover:text-zinc-700 cursor-pointer">View</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </>
            </div>

            {/* Coordinator Management Section */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Team</p>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">Coordinator Management</h3>
                  <p className="text-sm text-slate-500">Manage your NGO SPOCs and program coordinators</p>
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
            {/* Application Queue Summary */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">Application Queue</h3>
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">8 Pending</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">New Today</span>
                  <span className="font-bold text-slate-800">+3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Average Review Time</span>
                  <span className="font-bold text-slate-800">1.2 Days</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-tata-cyan w-2/3" />
                </div>
                <p className="text-xs text-slate-400 text-center">65% of applications reviewed this week</p>
              </div>
            </div>


            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-tata-blue to-blue-900 rounded-3xl p-8 text-white shadow-xl">
              <h3 className="font-bold mb-6">Quick Actions</h3>
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
      </div>

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
