import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, CheckCircle2, ExternalLink, Info, Filter, LayoutGrid, FileText, Check, ChevronDown, Sparkles, Edit2, Save, AlertTriangle, Download } from "lucide-react";
import { MOCK_NGO_APPLICATIONS } from "@/constants";
import { COMPANY_DOMAINS } from "@/data/mockData";

export const NGOApprovalsPanel = ({ addAuditLog, triggerToast }: { addAuditLog: any, triggerToast: any }) => {
  const [ngos, setNgos] = useState(MOCK_NGO_APPLICATIONS);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterArea, setFilterArea] = useState("All");
  const [selectedNgo, setSelectedNgo] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  const [editingNgo, setEditingNgo] = useState<any>(null);
  const [assigningNgo, setAssigningNgo] = useState<any>(null);

  const filteredNgos = ngos.filter(ngo => {
    const matchesStatus = filterStatus === "All" || ngo.status === filterStatus;
    const matchesArea = filterArea === "All" || ngo.focusArea === filterArea;
    return matchesStatus && matchesArea;
  });

  const handleApprove = (id: number) => {
    const ngo = ngos.find(n => n.id === id);
    if (!ngo) return;
    setNgos(prev => prev.map(n => n.id === id ? { ...n, status: "Approved" } : n));
    addAuditLog("NGO Approved", `Approved NGO: ${ngo.name}`);
    triggerToast(`NGO ${ngo.name} approved. Welcome email sent.`);
    setSelectedNgo(null);
  };

  const handleReject = () => {
    if (!selectedNgo) return;
    setNgos(prev => prev.map(n => n.id === selectedNgo.id ? { ...n, status: "Rejected" } : n));
    addAuditLog("NGO Rejected", `Rejected NGO: ${selectedNgo.name}. Reason: ${rejectReason}`);
    triggerToast(`NGO ${selectedNgo.name} rejected.`);
    setShowRejectModal(false);
    setSelectedNgo(null);
    setRejectReason("");
    setRejectNote("");
  };

  const handleUpdateNgo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNgo) return;
    setNgos(prev => prev.map(n => n.id === editingNgo.id ? editingNgo : n));
    addAuditLog("NGO Account Edited", `Updated profile for ${editingNgo.name}`);
    triggerToast(`NGO ${editingNgo.name} updated successfully.`);
    setEditingNgo(null);
  };

  const toggleCompanyAssignment = (company: string) => {
    if (!assigningNgo) return;
    const current = assigningNgo.assignedCompanies || [];
    const updated = current.includes(company) 
      ? current.filter(c => c !== company)
      : [...current, company];
    setAssigningNgo({ ...assigningNgo, assignedCompanies: updated });
  };

  const saveCompanyAssignment = () => {
    if (!assigningNgo) return;
    setNgos(prev => prev.map(n => n.id === assigningNgo.id ? assigningNgo : n));
    addAuditLog("NGO Company Assignment", `Updated company restrictions for ${assigningNgo.name}`);
    triggerToast(`Company assignments updated for ${assigningNgo.name}.`);
    setAssigningNgo(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-[0.1em]">NGO Application Queue</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Review and onboard new NGO partners to the platform.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative group">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-tata-blue transition-colors" />
            <select 
              className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold uppercase tracking-widest outline-none focus:border-tata-blue focus:bg-white transition-all appearance-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Flagged</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative group">
            <LayoutGrid size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-tata-blue transition-colors" />
            <select 
              className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold uppercase tracking-widest outline-none focus:border-tata-blue focus:bg-white transition-all appearance-none cursor-pointer"
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
            >
              <option value="All">All Focus Areas</option>
              <option>Education</option>
              <option>Environment</option>
              <option>Healthcare</option>
              <option>Rural Development</option>
              <option>Animal Welfare</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* NGO Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                <th className="p-6">NGO Name</th>
                <th className="p-6">Focus Area</th>
                <th className="p-6">State</th>
                <th className="p-6">Registered Date</th>
                <th className="p-6">AI Score</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredNgos.map((ngo) => (
                <tr 
                  key={ngo.id} 
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedNgo(ngo)}
                >
                  <td className="p-6">
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-tata-blue transition-colors uppercase tracking-tight">{ngo.name}</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">{ngo.regNumber}</div>
                  </td>
                  <td className="p-6">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-widest">{ngo.focusArea}</span>
                  </td>
                  <td className="p-6 text-xs font-bold text-slate-700">{ngo.state}</td>
                  <td className="p-6 text-xs font-mono text-slate-400">{ngo.registeredDate}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${ngo.aiScore * 10}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${ngo.aiScore > 7 ? 'bg-green-500' : ngo.aiScore > 4 ? 'bg-amber-500' : 'bg-red-500'}`} 
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-900">{ngo.aiScore}/10</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-widest rounded-full shadow-sm border ${
                      ngo.status === "Approved" ? "bg-green-50 text-green-600 border-green-100" : 
                      ngo.status === "Pending" ? "bg-blue-50 text-blue-600 border-blue-100" : 
                      ngo.status === "Flagged" ? "bg-red-50 text-red-600 border-red-100 animate-pulse" : 
                      "bg-slate-50 text-slate-600 border-slate-100"
                    }`}>{ngo.status}</span>
                  </td>
                  <td className="p-6 text-right space-x-3" onClick={(e) => e.stopPropagation()}>
                    {ngo.status === "Approved" ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingNgo(ngo)}
                          className="p-2 text-slate-400 hover:text-tata-blue hover:bg-tata-blue/5 rounded-lg transition-all"
                          title="Edit Account"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => setAssigningNgo(ngo)}
                          className="p-2 text-slate-400 hover:text-tata-cyan hover:bg-tata-cyan/5 rounded-lg transition-all"
                          title="Assign Companies"
                        >
                          <Building2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <button className="text-xs font-semibold text-tata-blue uppercase tracking-widest hover:underline">Review Application</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Drawer */}
      <AnimatePresence>
        {selectedNgo && (
          <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="w-full max-w-6xl bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-tata-blue text-white flex items-center justify-center font-semibold">AI</div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest">AI-03 Pre-Screen Summary</h3>
                    <p className="text-xs text-slate-400 font-mono">Reviewing: {selectedNgo.name}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedNgo(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: NGO Details */}
                <div className="w-1/2 border-r border-slate-200 overflow-y-auto p-10 space-y-10">
                  <section className="space-y-6">
                    <h4 className="text-xs font-semibold text-tata-blue uppercase tracking-widest border-b border-tata-blue/10 pb-2">NGO Profile Details</h4>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">NGO Name</label>
                        <p className="text-sm font-bold text-slate-900">{selectedNgo.name}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Registration Number</label>
                        <p className="text-sm font-mono text-slate-700">{selectedNgo.regNumber}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Focus Areas</label>
                        <p className="text-sm font-bold text-slate-900">{selectedNgo.focusArea}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Website</label>
                        <a href="#" className="text-sm font-bold text-tata-blue hover:underline flex items-center gap-1">
                          {selectedNgo.website} <ExternalLink size={12} />
                        </a>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Coordinator Name</label>
                        <p className="text-sm font-bold text-slate-900">{selectedNgo.coordinator}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Registered Date</label>
                        <p className="text-sm font-mono text-slate-700">{selectedNgo.registeredDate}</p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h4 className="text-xs font-semibold text-tata-blue uppercase tracking-widest border-b border-tata-blue/10 pb-2">Uploaded Documents</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedNgo.docs.map((doc: string, i: number) => (
                        <button key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 hover:border-tata-blue/30 transition-all group">
                          <div className="flex items-center gap-3">
                            <FileText size={16} className="text-slate-400 group-hover:text-tata-blue transition-colors" />
                            <span className="text-xs font-bold text-slate-700">{doc}</span>
                          </div>
                          <Download size={14} className="text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right Panel: AI Summary */}
                <div className="w-1/2 bg-slate-50 overflow-y-auto p-10">
                  <div className="bg-white border border-slate-200 p-8 space-y-8 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-tata-cyan" />
                        <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-widest">AI-03 Analysis</h4>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${
                        selectedNgo.confidence === "High" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                      }`}>
                        Confidence: {selectedNgo.confidence}
                      </div>
                    </div>

                    {/* Overall Score */}
                    <div className="text-center py-4">
                      <div className="text-5xl font-black text-slate-900 tracking-tighter">{selectedNgo.aiScore}</div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">/ 10</div>
                    </div>

                    {/* Breakdown Rows */}
                    <div className="space-y-5 pt-2">
                      {/* Document completeness */}
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-semibold text-slate-600 shrink-0">Document completeness</span>
                        <div className="flex items-center gap-3 flex-1 justify-end">
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: selectedNgo.completeness }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-900 w-10 text-right">{selectedNgo.completeness}</span>
                        </div>
                      </div>

                      {/* FCRA certificate */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600">FCRA certificate</span>
                        {selectedNgo.docs?.some((d: string) => d.toLowerCase().includes("fcra")) ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">Present</span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">Missing</span>
                        )}
                      </div>

                      {/* Impact statement clarity */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600">Impact statement clarity</span>
                        {(() => {
                          const level = selectedNgo.aiScore >= 7 ? "High" : selectedNgo.aiScore >= 5 ? "Medium" : "Low";
                          const cls = level === "High" ? "bg-green-100 text-green-800" : level === "Medium" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800";
                          return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{level}</span>;
                        })()}
                      </div>

                      {/* Risk flags */}
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-xs font-semibold text-slate-600 shrink-0 pt-0.5">Risk flags</span>
                        {selectedNgo.riskFlags.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 justify-end">
                            {selectedNgo.riskFlags.map((flag: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">{flag}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">None identified</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">AI Profile Summary</div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
                        "{selectedNgo.aiSummary}"
                      </p>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex gap-4">
                      <button 
                        onClick={() => handleApprove(selectedNgo.id)}
                        className="flex-1 py-4 bg-green-600 text-white text-xs font-semibold uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                      >
                        Approve NGO
                      </button>
                      <button 
                        onClick={() => setShowRejectModal(true)}
                        className="flex-1 py-4 bg-red-600 text-white text-xs font-semibold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                      >
                        Reject Application
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-blue-50 border border-blue-100 flex items-center gap-4">
                    <Info size={24} className="text-tata-blue shrink-0" />
                    <p className="text-xs text-tata-blue font-bold leading-relaxed uppercase tracking-tight">
                      Reviewing an application will notify the NGO of the final decision. Ensure all documents are cross-verified manually before final approval.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 w-full max-w-md border border-slate-200 shadow-2xl">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6">Reject NGO Application</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Rejection Reason*</label>
                <select 
                  className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm bg-white"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                >
                  <option value="">Select Reason</option>
                  <option>Missing documents</option>
                  <option>Duplicate application</option>
                  <option>Does not meet criteria</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Admin Note (Sent to NGO)*</label>
                <textarea 
                  className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm min-h-[120px]" 
                  placeholder="Explain the reason for rejection..."
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowRejectModal(false)} className="flex-1 py-3 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                <button 
                  onClick={handleReject}
                  disabled={!rejectReason || !rejectNote}
                  className="flex-1 py-3 bg-red-600 text-white text-xs font-semibold uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit NGO Modal */}
      {editingNgo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 w-full max-w-md border border-slate-200 shadow-2xl">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6">Edit NGO Account</h3>
            <form onSubmit={handleUpdateNgo} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Coordinator Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm" 
                  value={editingNgo.coordinator}
                  onChange={(e) => setEditingNgo({ ...editingNgo, coordinator: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Focus Area</label>
                <select 
                  className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm bg-white"
                  value={editingNgo.focusArea}
                  onChange={(e) => setEditingNgo({ ...editingNgo, focusArea: e.target.value })}
                >
                  <option>Education</option>
                  <option>Environment</option>
                  <option>Healthcare</option>
                  <option>Rural Development</option>
                  <option>Animal Welfare</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Partnership Tier</label>
                <select className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm bg-white">
                  <option>Standard</option>
                  <option>Strategic Partner</option>
                  <option>Global Partner</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setEditingNgo(null)} className="flex-1 py-3 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-tata-blue text-white text-xs font-semibold uppercase tracking-widest hover:bg-blue-900 transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Company Assignment Modal */}
      {assigningNgo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 w-full max-w-lg border border-slate-200 shadow-2xl">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-2">Assign to Companies</h3>
            <p className="text-xs text-slate-400 font-mono mb-6">Restrict which Tata companies' employees can apply to {assigningNgo.name}'s projects.</p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              {COMPANY_DOMAINS.map((c) => (
                <button 
                  key={c.id}
                  onClick={() => toggleCompanyAssignment(c.company)}
                  className={`p-4 border text-left flex items-center justify-between transition-all ${
                    (assigningNgo.assignedCompanies || []).includes(c.company)
                      ? "border-tata-blue bg-blue-50 text-tata-blue"
                      : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <span className="text-xs font-bold">{c.company}</span>
                  {(assigningNgo.assignedCompanies || []).includes(c.company) && <Check size={14} />}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setAssigningNgo(null)} className="flex-1 py-3 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={saveCompanyAssignment} className="flex-1 py-3 bg-tata-blue text-white text-xs font-semibold uppercase tracking-widest hover:bg-blue-900 transition-all">Save Assignment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
