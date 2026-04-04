import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Lock, Filter, Check, Save, Download, Upload, FileSpreadsheet, Edit3, FolderOpen } from "lucide-react";
import { COMPANY_DOMAINS, MOCK_PROJECT_SUBMISSIONS } from "@/data/mockData";

export const ProjectOversightPanel = ({ addAuditLog, triggerToast }: { addAuditLog: any, triggerToast: any }) => {
  const [projects, setProjects] = useState(MOCK_PROJECT_SUBMISSIONS);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterArea, setFilterArea] = useState("All");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnComments, setReturnComments] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showCapModal, setShowCapModal] = useState(false);
  const [capType, setCapType] = useState<"edition" | "project" | "ngo">("edition");
  const [capValue, setCapValue] = useState(2);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importTab, setImportTab] = useState("Offline Projects");
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  const filteredProjects = projects.filter(p => {
    const matchesStatus = filterStatus === "All" || p.status === filterStatus;
    const matchesArea = filterArea === "All" || p.skillArea === filterArea;
    return matchesStatus && matchesArea;
  });

  const handleApprove = (id: number) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: "Approved" } : p));
    addAuditLog("Project Approved", `Approved project: ${project.title}`);
    triggerToast(`Project "${project.title}" is now live.`);
    setSelectedProject(null);
  };

  const handleReturn = () => {
    if (!selectedProject) return;
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, status: "Returned", returnComments } : p));
    addAuditLog("Project Returned", `Returned project: ${selectedProject.title} with comments.`);
    triggerToast(`Project returned to NGO.`);
    setShowReturnModal(false);
    setSelectedProject(null);
    setReturnComments("");
  };

  const handleReject = () => {
    if (!selectedProject) return;
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, status: "Rejected", rejectReason } : p));
    addAuditLog("Project Rejected", `Rejected project: ${selectedProject.title}. Reason: ${rejectReason}`);
    triggerToast(`Project rejected and archived.`);
    setShowRejectModal(false);
    setSelectedProject(null);
    setRejectReason("");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? selectedProject : p));
    addAuditLog("Project Edited by Admin", `Edited fields for project: ${selectedProject.title}`);
    triggerToast(`Project changes saved.`);
    setIsEditing(false);
  };

  const toggleCompanyRestriction = (company: string) => {
    if (!selectedProject) return;
    const current = selectedProject.restrictedCompanies || [];
    const updated = current.includes(company) 
      ? current.filter((c: string) => c !== company)
      : [...current, company];
    setSelectedProject({ ...selectedProject, restrictedCompanies: updated });
  };

  const VolunteerCapConfig = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-tata-blue/5 rounded-full -mr-12 -mt-12 blur-2xl" />
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-lg bg-tata-blue/10 flex items-center justify-center text-tata-blue">
          <ShieldCheck size={20} />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest">Volunteer Cap Configuration</h3>
      </div>
      
      <div className="space-y-3 relative z-10">
        {[
          { id: "edition", label: "Edition-Level Cap", desc: "Max applications per volunteer across all projects" },
          { id: "project", label: "Project-Level Cap", desc: "Max volunteers per project" },
          { id: "ngo", label: "NGO-Level Cap", desc: "Max volunteers per NGO" }
        ].map((cap) => (
          <div 
            key={cap.id} 
            onClick={() => setCapType(cap.id as any)}
            className={`flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer group relative ${
              capType === cap.id ? "border-tata-blue bg-blue-50/50 shadow-sm" : "border-slate-100 bg-white hover:border-slate-200"
            }`}
          >
            <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              capType === cap.id ? "border-tata-blue bg-tata-blue" : "border-slate-200"
            }`}>
              {capType === cap.id && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <div>
              <label className="text-xs font-bold text-slate-900 block">{cap.label}</label>
              <p className="text-xs text-slate-400 uppercase tracking-tight font-medium">{cap.desc}</p>
            </div>
            {capType !== cap.id && (
              <div className="absolute inset-0 bg-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-not-allowed rounded-lg">
                <div className="bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 uppercase tracking-widest rounded-full shadow-lg">Only one cap can be active</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-slate-50 relative z-10">
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Cap Value</label>
          <div className="relative">
            <input 
              type="number" 
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-tata-blue focus:bg-white transition-all text-sm font-bold" 
              value={capValue}
              onChange={(e) => setCapValue(Number(e.target.value))}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 uppercase tracking-widest">Projects</span>
          </div>
        </div>
        <button 
          onClick={() => setShowCapModal(true)}
          className="mt-6 px-8 py-3 bg-tata-blue text-white text-xs font-semibold uppercase tracking-widest rounded-2xl hover:bg-blue-900 transition-all shadow-lg shadow-tata-blue/20"
        >
          Apply Cap
        </button>
      </div>
    </div>
  );

  const BulkImportTool = () => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" onClick={() => setShowImportModal(false)}>
      <div className="bg-white w-full max-w-4xl border border-slate-200 shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest">Excel Bulk Import Tool</h3>
          <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-slate-200 rounded-full"><X size={20} /></button>
        </div>

        <div className="flex border-b border-slate-200">
          {["Offline Projects", "Post-Window Applications", "Feedback on Behalf"].map((tab) => (
            <button
              key={tab}
              onClick={() => setImportTab(tab)}
              className={`px-8 py-4 text-xs font-semibold uppercase tracking-widest transition-all relative ${
                importTab === tab ? "text-tata-blue" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
              {importTab === tab && <motion.div layoutId="importTab" className="absolute bottom-0 left-0 right-0 h-1 bg-tata-blue" />}
            </button>
          ))}
        </div>

        <div className="p-8 flex-1 overflow-y-auto space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-widest">1. Download Template</h4>
              <p className="text-xs text-slate-500">Use our standardized Excel template to ensure data compatibility.</p>
              <button className="flex items-center gap-2 text-tata-blue text-xs font-semibold uppercase tracking-widest hover:underline">
                <Download size={14} /> Download {importTab} Template.xlsx
              </button>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-widest">2. Upload File</h4>
              <div className="border-2 border-dashed border-slate-200 p-8 text-center hover:border-tata-blue transition-all cursor-pointer group rounded-2xl">
                <Upload size={24} className="mx-auto text-slate-300 group-hover:text-tata-blue mb-2" />
                <p className="text-xs font-bold text-slate-400 uppercase">Drop Excel file here or click to browse</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-widest">3. Data Preview (Parsed Rows)</h4>
            <div className="border border-slate-100 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="p-3">Row</th>
                    <th className="p-3">Project Title / Volunteer</th>
                    <th className="p-3">NGO / Company</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="text-xs">
                      <td className="p-3 font-mono text-slate-400">{i}</td>
                      <td className="p-3 font-bold text-slate-700">Sample Data Row {i}</td>
                      <td className="p-3 text-slate-500">Tata Sample Co.</td>
                      <td className="p-3"><span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded uppercase text-[10px] font-semibold">Ready</span></td>
                      <td className="p-3 text-green-600 font-bold">✓ Valid</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-4">
          <button onClick={() => setShowImportModal(false)} className="px-8 py-3 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-white transition-all">Cancel</button>
          <button 
            onClick={() => {
              triggerToast("18 imported, 2 failed — see error log");
              setShowImportModal(false);
            }}
            className="px-8 py-3 bg-zinc-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-all"
          >
            Confirm & Process Import
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Project Oversight</h2>
          <p className="text-xs text-slate-400 font-mono mt-1">Manage all NGO-submitted projects and platform-wide caps.</p>
        </div>
        <button 
          onClick={() => setShowImportModal(true)}
          className="px-6 py-3 bg-zinc-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
        >
          <FileSpreadsheet size={16} /> Bulk Import Tool
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Table Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 bg-white p-4 border border-slate-200">
            <div className="flex items-center gap-2 px-3 border-r border-slate-100">
              <Filter size={14} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Filters</span>
            </div>
            <select 
              className="px-3 py-1.5 border border-slate-100 text-xs font-semibold uppercase tracking-widest outline-none focus:border-tata-blue bg-slate-50"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option>Under Review</option>
              <option>Approved</option>
              <option>Returned</option>
              <option>Rejected</option>
            </select>
            <select 
              className="px-3 py-1.5 border border-slate-100 text-xs font-semibold uppercase tracking-widest outline-none focus:border-tata-blue bg-slate-50"
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
            >
              <option value="All">All Skill Areas</option>
              <option>Education</option>
              <option>Environment</option>
              <option>Healthcare</option>
              <option>Rural Development</option>
            </select>
            <button className="text-xs font-semibold text-slate-400 uppercase tracking-widest hover:text-tata-blue">Clear All</button>
          </div>

          {/* Project Table */}
          {filteredProjects.length === 0 ? (
            <div className="bg-white border border-slate-200 flex flex-col items-center justify-center py-16 text-center">
              <FolderOpen size={40} className="text-slate-300 mb-4" />
              <h4 className="text-[15px] font-medium text-slate-700 mb-1">No projects awaiting review</h4>
              <p className="text-[13px] text-muted-foreground">Submitted NGO projects will appear here.</p>
            </div>
          ) : (
          <div className="bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    <th className="p-4">Project Title</th>
                    <th className="p-4">NGO</th>
                    <th className="p-4">Skill Area</th>
                    <th className="p-4">Mode</th>
                    <th className="p-4 text-center">Volunteers</th>
                    <th className="p-4">AI Score</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProjects.map((p) => (
                    <tr 
                      key={p.id} 
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                      onClick={() => setSelectedProject(p)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-tata-blue transition-colors">{p.title}</div>
                          {p.restrictedCompanies.length > 0 && <Lock size={12} className="text-amber-500" />}
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">ID: PROJ-{p.id.toString().padStart(4, '0')}</div>
                      </td>
                      <td className="p-4 text-xs font-medium text-slate-700">{p.ngo}</td>
                      <td className="p-4 text-xs font-medium text-slate-700">{p.skillArea}</td>
                      <td className="p-4 text-xs font-medium text-slate-500">{p.mode}</td>
                      <td className="p-4 text-center text-xs font-bold text-slate-900">{p.volunteersNeeded}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                            p.aiScore > 8 ? 'bg-green-100 text-green-600' : p.aiScore > 6 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                          }`}>{p.aiScore}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest rounded ${
                          p.status === "Approved" ? "bg-green-100 text-green-600" : 
                          p.status === "Under Review" ? "bg-blue-100 text-blue-600" : 
                          p.status === "Returned" ? "bg-amber-100 text-amber-600" : 
                          "bg-slate-100 text-slate-600"
                        }`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </div>

        {/* Sidebar Config */}
        <div className="lg:col-span-1">
          <VolunteerCapConfig />
        </div>
      </div>

      {/* Review Drawer */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm" onClick={() => { setSelectedProject(null); setIsEditing(false); }}>
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest">Project Review Detail</h3>
                  <p className="text-xs text-slate-400 font-mono">NGO: {selectedProject.ngo}</p>
                </div>
                <div className="flex items-center gap-4">
                  {selectedProject.status === "Approved" && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg">
                      <Lock size={14} className="text-amber-600" />
                      <span className="text-xs font-bold text-amber-700 uppercase">Restricted</span>
                      <button 
                        onClick={() => setShowCompanyModal(true)}
                        className="text-xs font-semibold text-tata-blue uppercase tracking-widest hover:underline ml-2"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                  <button onClick={() => { setSelectedProject(null); setIsEditing(false); }} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10">
                {isEditing ? (
                  <form onSubmit={handleSaveEdit} className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-xs font-semibold text-tata-blue uppercase tracking-widest border-b border-tata-blue/10 pb-2">Edit Project Fields</h4>
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Project Title</label>
                          <input 
                            type="text" 
                            className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm font-bold" 
                            value={selectedProject.title}
                            onChange={(e) => setSelectedProject({ ...selectedProject, title: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Skill Area</label>
                            <select 
                              className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm bg-white"
                              value={selectedProject.skillArea}
                              onChange={(e) => setSelectedProject({ ...selectedProject, skillArea: e.target.value })}
                            >
                              <option>Education</option>
                              <option>Environment</option>
                              <option>Healthcare</option>
                              <option>Rural Development</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Volunteers Needed</label>
                            <input 
                              type="number" 
                              className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm" 
                              value={selectedProject.volunteersNeeded}
                              onChange={(e) => setSelectedProject({ ...selectedProject, volunteersNeeded: Number(e.target.value) })}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                          <textarea 
                            className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm min-h-[150px]" 
                            value={selectedProject.description}
                            onChange={(e) => setSelectedProject({ ...selectedProject, description: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel Edits</button>
                      <button type="submit" className="flex-1 py-4 bg-tata-blue text-white text-xs font-semibold uppercase tracking-widest hover:bg-blue-900 transition-all">Save & Update Project</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <section className="space-y-6">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <h4 className="text-xs font-semibold text-tata-blue uppercase tracking-widest">Project Brief</h4>
                        <button onClick={() => setIsEditing(true)} className="text-xs font-semibold text-slate-400 uppercase tracking-widest hover:text-tata-blue flex items-center gap-1">
                          <Edit3 size={12} /> Edit Directly
                        </button>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h1 className="text-2xl font-black text-slate-900 leading-tight">{selectedProject.title}</h1>
                          <div className="flex gap-4 mt-3">
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-widest rounded">{selectedProject.skillArea}</span>
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-widest rounded">{selectedProject.mode}</span>
                            <span className="px-2 py-1 bg-blue-50 text-tata-blue text-[10px] font-semibold uppercase tracking-widest rounded">{selectedProject.volunteersNeeded} Volunteers Needed</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Project Description</label>
                            <p className="text-sm text-slate-700 leading-relaxed">{selectedProject.description}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Expected Outcomes</label>
                              <p className="text-xs text-slate-600 font-medium">{selectedProject.outcomes}</p>
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Impact Targets</label>
                              <p className="text-xs text-slate-600 font-medium">{selectedProject.impactTargets}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-6">
                      <h4 className="text-xs font-semibold text-tata-blue uppercase tracking-widest border-b border-tata-blue/10 pb-2">AI Quality Score Breakdown</h4>
                      <div className="grid grid-cols-4 gap-4">
                        {Object.entries(selectedProject.aiBreakdown).map(([key, val]: [string, any]) => (
                          <div key={key} className="p-4 bg-slate-50 border border-slate-100 text-center">
                            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">{key}</div>
                            <div className={`text-xl font-semibold ${val > 8 ? 'text-green-600' : val > 6 ? 'text-amber-600' : 'text-red-600'}`}>{val}/10</div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="pt-10 border-t border-slate-100 grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleApprove(selectedProject.id)}
                        className="py-4 bg-green-600 text-white text-xs font-semibold uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                      >
                        Approve Project
                      </button>
                      <button 
                        onClick={() => setShowReturnModal(true)}
                        className="py-4 bg-amber-500 text-white text-xs font-semibold uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
                      >
                        Return with Comments
                      </button>
                      <button 
                        onClick={() => setShowRejectModal(true)}
                        className="col-span-2 py-4 border border-red-200 text-red-600 text-xs font-semibold uppercase tracking-widest hover:bg-red-50 transition-all"
                      >
                        Reject & Archive
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" onClick={() => setShowReturnModal(false)}>
          <div className="bg-white p-8 w-full max-w-md border border-slate-200 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6">Return Project with Comments</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Feedback for NGO*</label>
                <textarea 
                  className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm min-h-[150px]" 
                  placeholder="Explain what needs to be improved..."
                  value={returnComments}
                  onChange={(e) => setReturnComments(e.target.value)}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowReturnModal(false)} className="flex-1 py-3 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                <button 
                  onClick={handleReturn}
                  disabled={!returnComments}
                  className="flex-1 py-3 bg-amber-500 text-white text-xs font-semibold uppercase tracking-widest hover:bg-amber-600 transition-all disabled:opacity-50"
                >
                  Confirm Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" onClick={() => setShowRejectModal(false)}>
          <div className="bg-white p-8 w-full max-w-md border border-slate-200 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6">Reject Project Submission</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Rejection Reason*</label>
                <select 
                  className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm bg-white"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                >
                  <option value="">Select Reason</option>
                  <option>Does not align with Tata values</option>
                  <option>Incomplete impact targets</option>
                  <option>Duplicate of existing project</option>
                  <option>NGO eligibility issue</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowRejectModal(false)} className="flex-1 py-3 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                <button 
                  onClick={handleReject}
                  disabled={!rejectReason}
                  className="flex-1 py-3 bg-red-600 text-white text-xs font-semibold uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cap Confirmation Modal */}
      {showCapModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" onClick={() => setShowCapModal(false)}>
          <div className="bg-white p-8 w-full max-w-md border border-slate-200 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-blue-50 text-tata-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-4">Apply Volunteer Cap?</h3>
            <p className="text-xs text-slate-500 mb-8 leading-relaxed">
              This will set the <strong>{capType}-level cap</strong> to <strong>{capValue}</strong>. This change will affect all active and future applications in the current edition.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowCapModal(false)} className="flex-1 py-3 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
              <button 
                onClick={() => {
                  addAuditLog("Update Volunteer Cap", `Set ${capType} cap to ${capValue}`);
                  triggerToast(`Volunteer cap updated successfully.`);
                  setShowCapModal(false);
                }}
                className="flex-1 py-3 bg-tata-blue text-white text-xs font-semibold uppercase tracking-widest hover:bg-blue-900 transition-all"
              >
                Confirm & Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company Restriction Modal */}
      {showCompanyModal && selectedProject && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm" onClick={() => setShowCompanyModal(false)}>
          <div className="bg-white p-8 w-full max-w-lg border border-slate-200 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-2">Assign to Companies</h3>
            <p className="text-xs text-slate-400 font-mono mb-6">Restrict which Tata companies' employees can apply to this project.</p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              {COMPANY_DOMAINS.map((c) => (
                <button 
                  key={c.id}
                  onClick={() => toggleCompanyRestriction(c.company)}
                  className={`p-4 border text-left flex items-center justify-between transition-all ${
                    (selectedProject.restrictedCompanies || []).includes(c.company)
                      ? "border-tata-blue bg-blue-50 text-tata-blue"
                      : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <span className="text-xs font-bold">{c.company}</span>
                  {(selectedProject.restrictedCompanies || []).includes(c.company) && <Check size={14} />}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setShowCompanyModal(false)} className="flex-1 py-3 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
              <button 
                onClick={() => {
                  addAuditLog("Project Company Restriction", `Updated restrictions for ${selectedProject.title}`);
                  triggerToast(`Company restrictions updated.`);
                  setShowCompanyModal(false);
                }}
                className="flex-1 py-3 bg-tata-blue text-white text-xs font-semibold uppercase tracking-widest hover:bg-blue-900 transition-all"
              >
                Save Restrictions
              </button>
            </div>
          </div>
        </div>
      )}

      {showImportModal && <BulkImportTool />}
    </div>
  );
};
