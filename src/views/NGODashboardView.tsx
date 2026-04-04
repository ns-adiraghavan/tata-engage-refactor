import Drawer from "@/components/layout/Drawer";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, User, Users, Mail, Search, MapPin, Clock, Check, Sparkles, MessageSquare, ArrowRight, Star, Plus, Edit2, Trash2, Copy, AlertTriangle, Download, Inbox } from "lucide-react";
import type { View } from "@/types";
import { MOCK_APPLICANTS, ANJALI_MEHTA } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useLocation } from "react-router-dom";

const NGODashboardView = () => {
  const { setClonedProject, setActiveProject, ngoData, triggerToast } = useAppContext();
  const navigate = useAppNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"projects" | "applications" | "coordinators">("projects");
  const [applicationTab, setApplicationTab] = useState<"shortlist" | "all">("shortlist");
  const [coordinators, setCoordinators] = useState(ngoData.coordinators);
  const [showAddCoordinator, setShowAddCoordinator] = useState(false);
  const [newCoordinator, setNewCoordinator] = useState({ name: "", email: "", role: "Coordinator" });
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [dismissedReminders, setDismissedReminders] = useState<number[]>([]);

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
    <div className="min-h-screen pt-20 bg-slate-50">
      {/* NGO Welcome Banner */}
      <section className="bg-tata-blue text-white pt-16 pb-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <Sparkles size={400} className="text-white" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-tata-cyan/20 text-tata-cyan px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-tata-cyan/30">
                  {ANJALI_MEHTA.tier}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome, {ANJALI_MEHTA.firstName}</h1>
              <p className="text-xl opacity-80">{ANJALI_MEHTA.organization}</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowCloneModal(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 backdrop-blur-md border border-white/10 cursor-pointer"
              >
                <Copy size={20} /> Create from Previous
              </button>
              <button 
                onClick={() => {
                  setClonedProject(null);
                  navigate("create-project");
                }}
                className="bg-tata-cyan text-tata-blue px-6 py-3 rounded-lg font-bold hover:bg-white transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus size={20} /> Create New Project
              </button>
            </div>
          </div>
        </div>
      </section>

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
          {[
            { label: "Active Projects", value: ANJALI_MEHTA.projects.filter(p => p.status === "Active").length, icon: Sparkles, color: "text-green-600", bg: "bg-green-50" },
            { label: "Volunteers matched this edition", value: ANJALI_MEHTA.projects.filter(p => p.status === "Active" || p.status === "Closed").reduce((sum, p) => sum + p.volunteers, 0), icon: Users, color: "text-tata-blue", bg: "bg-blue-50" },
            { label: "Pending Applications", value: ANJALI_MEHTA.pendingApplications, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">{stat.label}</p>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h4>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Project Management Panel */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-3xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-tata-blue">Project Management</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveTab("projects")}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "projects" ? "bg-tata-blue text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                  >
                    Projects
                  </button>
                  <button 
                    onClick={() => setActiveTab("applications")}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "applications" ? "bg-tata-blue text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                  >
                    Applications <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{ANJALI_MEHTA.pendingApplications}</span>
                  </button>
                </div>
              </div>

              {activeTab === "projects" ? (
                <div className="space-y-4">
                  {ngoData.projects.map(project => (
                    <div key={project.id} className="p-6 rounded-2xl border border-slate-100 hover:border-tata-cyan/30 hover:bg-tata-cyan/5 transition-all group">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              project.status === 'Active' ? 'bg-green-100 text-green-700' :
                              project.status === 'Under Review' ? 'bg-amber-100 text-amber-700' :
                              project.status === 'Draft' ? 'bg-slate-100 text-slate-600' :
                              project.status === 'Closed – Certified' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {project.status}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">Stage: {project.stage}</span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-800 mb-2">{project.title}</h4>
                          <div className="flex items-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-1.5"><Users size={16} /> {project.volunteers} Volunteers</div>
                            <div className="flex items-center gap-1.5"><MessageSquare size={16} /> {project.applications} Applications</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="p-3 hover:bg-white rounded-lg text-slate-400 hover:text-tata-blue transition-all shadow-sm border border-transparent hover:border-slate-100 cursor-pointer">
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setActiveProject(project);
                              if (project.status === "Active") {
                                navigate("active-project-management");
                              } else if (project.status === "Closed – Certified") {
                                navigate("project-feedback");
                              } else {
                                triggerToast("Project details view coming soon.");
                              }
                            }}
                            className="btn-outline py-2 px-4 text-sm cursor-pointer"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                      
                      {/* Visual Pipeline */}
                      <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Project Lifecycle</span>
                          <span className="text-xs font-bold text-tata-blue uppercase tracking-widest">
                            {project.status === 'Closed – Certified' ? '100% Complete' : '75% Complete'}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                          <div className="h-full bg-tata-blue w-1/4 border-r border-white/20" />
                          <div className="h-full bg-tata-blue w-1/4 border-r border-white/20" />
                          <div className="h-full bg-tata-blue w-1/4 border-r border-white/20" />
                          <div className={`h-full ${project.status === 'Closed – Certified' ? 'bg-tata-blue' : 'bg-slate-200'} w-1/4`} />
                        </div>
                        <div className="flex justify-between mt-2">
                          {["Draft", "Review", "Execution", "Closing"].map((stage, idx) => (
                            <span key={idx} className={`text-xs font-bold uppercase ${
                              (project.status === 'Closed – Certified' && stage === 'Closing') || project.stage === stage ? 'text-tata-blue' : 'text-slate-400'
                            }`}>
                              {stage}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Sub-tabs */}
                  <div className="flex border-b border-slate-100">
                    <button 
                      onClick={() => setApplicationTab("shortlist")}
                      className={`px-6 py-4 text-sm font-bold transition-all relative ${applicationTab === "shortlist" ? "text-tata-blue" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      AI-Suggested Shortlist
                      {applicationTab === "shortlist" && <motion.div layoutId="appTab" className="absolute bottom-0 left-0 right-0 h-1 bg-tata-blue rounded-full" />}
                    </button>
                    <button 
                      onClick={() => setApplicationTab("all")}
                      className={`px-6 py-4 text-sm font-bold transition-all relative ${applicationTab === "all" ? "text-tata-blue" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      All Applications
                      {applicationTab === "all" && <motion.div layoutId="appTab" className="absolute bottom-0 left-0 right-0 h-1 bg-tata-blue rounded-full" />}
                    </button>
                  </div>

                  {applicationTab === "shortlist" ? (
                    shortlistedApplicants.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Inbox size={40} className="text-slate-300 mb-4" />
                        <h4 className="text-[15px] font-medium text-slate-700 mb-1">No applications yet</h4>
                        <p className="text-[13px] text-muted-foreground">Volunteer applications will appear here once your project goes live.</p>
                      </div>
                    ) : (
                    <div className="space-y-6">
                      <div className="bg-tata-blue/5 border border-tata-blue/10 p-4 rounded-2xl flex items-center gap-3 text-tata-blue text-xs font-bold">
                        <Sparkles size={18} />
                        This shortlist is AI-generated based on skills and experience. It is advisory only.
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {shortlistedApplicants.map((applicant, idx) => (
                          <motion.div 
                            key={applicant.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-lg transition-all group relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-tata-blue/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform" />
                            <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                              <div className="flex gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-tata-blue/10 text-tata-blue flex items-center justify-center text-xl font-bold shrink-0">
                                  {applicant.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-slate-800">{applicant.name}</h4>
                                    {applicant.isReturning && (
                                      <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Star size={10} fill="currentColor" /> Returning Volunteer
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-500 mb-3 line-clamp-1">{applicant.experience}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {applicant.skills.map((skill, i) => (
                                      <span key={i} className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">{skill}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end justify-between gap-4">
                                <div className="text-right">
                                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Match Score</div>
                                  <div className="text-2xl font-black text-tata-blue">{applicant.matchPercentage}%</div>
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => {
                                      setSelectedApplicant(applicant);
                                      setIsProfileDrawerOpen(true);
                                    }}
                                    className="btn-outline py-2 px-4 text-xs cursor-pointer"
                                  >
                                    View Profile
                                  </button>
                                  <button 
                                    onClick={() => handleAccept(applicant.id)}
                                    className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-tata-blue transition-all cursor-pointer"
                                  >
                                    Accept
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    )
                  ) : (
                    <div className="space-y-6">
                      {/* Filters */}
                      <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex-1 min-w-[200px] relative">
                          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="Search by name or skill..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-tata-blue/20"
                          />
                        </div>
                        <select 
                          value={filterSkill}
                          onChange={(e) => setFilterSkill(e.target.value)}
                          className="px-4 py-2 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none"
                        >
                          <option value="">All Skills</option>
                          <option value="Finance">Finance</option>
                          <option value="Teaching">Teaching</option>
                          <option value="Project Management">Project Management</option>
                          <option value="Digital Marketing">Digital Marketing</option>
                        </select>
                        <select 
                          value={filterCity}
                          onChange={(e) => setFilterCity(e.target.value)}
                          className="px-4 py-2 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none"
                        >
                          <option value="">All Cities</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Pune">Pune</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Bangalore">Bangalore</option>
                        </select>
                      </div>

                      {/* Bulk Actions */}
                      {selectedApplicants.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-4 bg-zinc-900 text-white rounded-2xl shadow-xl"
                        >
                          <span className="text-sm font-bold">{selectedApplicants.length} volunteers selected</span>
                          <div className="flex gap-3">
                            <button onClick={() => setSelectedApplicants([])} className="text-xs font-bold hover:underline">Cancel</button>
                            <button onClick={handleBulkAccept} className="bg-tata-cyan text-tata-blue px-6 py-2 rounded-lg text-xs font-bold">Bulk Accept</button>
                          </div>
                        </motion.div>
                      )}

                      <div className="space-y-4">
                        {filteredApplicants.map(applicant => (
                          <div key={applicant.id} className="p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4 hover:bg-slate-50 transition-all">
                            <div className="flex items-center gap-4">
                              <input 
                                type="checkbox" 
                                checked={selectedApplicants.includes(applicant.id)}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedApplicants([...selectedApplicants, applicant.id]);
                                  else setSelectedApplicants(selectedApplicants.filter(id => id !== applicant.id));
                                }}
                                className="w-4 h-4 rounded border-slate-300 text-tata-blue focus:ring-tata-blue"
                              />
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                                {applicant.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 text-sm">{applicant.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <span>{applicant.city}</span>
                                  <span>•</span>
                                  <span>{applicant.availability}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                                applicant.status === 'Matched' ? 'bg-green-100 text-green-700' :
                                applicant.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                applicant.status === 'Fulfilled' ? 'bg-slate-100 text-slate-500' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {applicant.status}
                              </span>
                              {applicant.status === "Pending" && (
                                <div className="flex gap-1">
                                  <button onClick={() => handleReject(applicant.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all cursor-pointer"><X size={16} /></button>
                                  <button onClick={() => handleAccept(applicant.id)} className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-all cursor-pointer"><Check size={16} /></button>
                                </div>
                              )}
                              <button 
                                onClick={() => {
                                  setSelectedApplicant(applicant);
                                  setIsProfileDrawerOpen(true);
                                }}
                                className="p-2 hover:bg-slate-100 text-slate-400 rounded-lg cursor-pointer"
                              >
                                <ChevronRight size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Audit Trail */}
                  <div className="mt-12 pt-8 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Decision Audit Trail</h4>
                    <div className="space-y-3">
                      {auditLog.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No decisions logged yet.</p>
                      ) : (
                        auditLog.map(log => (
                          <div key={log.id} className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3">
                              <span className={`w-2 h-2 rounded-full ${log.action.includes('Accepted') ? 'bg-green-500' : 'bg-red-500'}`} />
                              <span className="font-bold text-slate-700">{log.volunteer}</span>
                              <span className="text-slate-500">{log.action}</span>
                            </div>
                            <span className="text-slate-400">{log.date}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Coordinator Management Section */}
            <div className="glass rounded-3xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-tata-blue">Coordinator Management</h3>
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

            {/* Volunteer Shortlists */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-6">Volunteer Shortlists</h3>
              <div className="space-y-6">
                {ANJALI_MEHTA.projects.filter(p => p.volunteers > 0).map(project => (
                  <div key={project.id}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{project.title}</h4>
                      <button className="text-tata-blue text-xs font-bold hover:underline cursor-pointer">View All</button>
                    </div>
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].slice(0, project.volunteers).map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                          V{i}
                        </div>
                      ))}
                      {project.volunteers > 4 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-tata-blue text-white flex items-center justify-center text-xs font-bold">
                          +{project.volunteers - 4}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
