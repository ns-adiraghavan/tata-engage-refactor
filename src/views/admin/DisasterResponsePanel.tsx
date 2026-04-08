import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Building2, ShieldCheck, Eye, CheckCircle2, Globe, MapPin, Filter, List, Send, Check, Zap, Plus, History, AlertTriangle, Activity, ShieldAlert } from "lucide-react";
import { TATA_COMPANIES, GEOGRAPHIES } from "@/constants";
import { DR_TEMPLATES } from "@/data/mockData";


export const DisasterResponsePanel = ({ addAuditLog, triggerToast, drResponses, setIsDRActive, isDRActive, drDeploymentLog, setDrDeploymentLog, isDRClosed, setIsDRClosed }: { 
  addAuditLog: (action: string, details: string) => void, 
  triggerToast: (msg: string) => void,
  drResponses: any[],
  setIsDRActive: (val: boolean) => void,
  isDRActive: boolean,
  drDeploymentLog: any[],
  setDrDeploymentLog: React.Dispatch<React.SetStateAction<any[]>>,
  isDRClosed: boolean,
  setIsDRClosed: (val: boolean) => void
}) => {
  
  const [step, setStep] = useState<"initiate" | "status" | "dashboard">("initiate");
  const [audience, setAudience] = useState<"all" | "specific" | "geography">("all");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedGeographies, setSelectedGeographies] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState(DR_TEMPLATES[0]);
  const [customSubject, setCustomSubject] = useState(DR_TEMPLATES[0].subject);
  const [customBody, setCustomBody] = useState(DR_TEMPLATES[0].body);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const [notifiedCount, setNotifiedCount] = useState(0);

  // Dashboard State
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);
  const [filters, setFilters] = useState({ geography: "All", skill: "All", travel: "All" });
  const [isConfirmingCadre, setIsConfirmingCadre] = useState(false);

  const handleTrigger = () => {
    setIsTriggering(true);
    // Simulate notification process
    setTimeout(() => {
      const count = audience === "all" ? 45000 : audience === "specific" ? selectedCompanies.length * 500 : selectedGeographies.length * 1200;
      setNotifiedCount(count);
      setIsTriggering(false);
      setStep("status");
      setIsDRActive(true);
      setIsDRClosed(false);
      addAuditLog(`Triggered Disaster Response Alert: ${selectedTemplate.name}`, "Vikram Nair");
      triggerToast("Disaster Response Alert Triggered Successfully!");
    }, 2000);
  };

  const resetForm = () => {
    setStep("initiate");
    setAudience("all");
    setSelectedCompanies([]);
    setSelectedGeographies([]);
    setNotifiedCount(0);
  };

  const handleConfirmCadre = () => {
    setIsConfirmingCadre(true);
    setTimeout(() => {
      const selectedData = drResponses.filter(r => selectedVolunteers.includes(r.id));
      const newDeployment = {
        id: `DEP-${Math.floor(Math.random() * 10000)}`,
        volunteers: selectedData,
        instructions: "Deploy to Guwahati Relief Centre by 08:00 AM. Report to Mr. Baruah.",
        timestamp: new Date().toISOString()
      };
      setDrDeploymentLog(prev => [newDeployment, ...prev]);
      setIsConfirmingCadre(false);
      setSelectedVolunteers([]);
      addAuditLog(`Confirmed Deployment Cadre: ${selectedData.length} volunteers selected`, "Vikram Nair");
      triggerToast(`Personalised deployment instructions sent to ${selectedData.length} volunteers!`);
    }, 1500);
  };

  const handleCloseResponse = () => {
    setIsDRActive(false);
    setIsDRClosed(true);
    addAuditLog("Disaster Response Call Closed — Feedback forms triggered", "Vikram Nair");
    triggerToast("Disaster Response Closed. Feedback forms sent to all deployed volunteers.");
  };

  const filteredResponses = drResponses.filter(res => {
    const geoMatch = filters.geography === "All" || res.location.includes(filters.geography);
    const skillMatch = filters.skill === "All" || res.skills.includes(filters.skill);
    const travelMatch = filters.travel === "All" || res.travel === filters.travel;
    return geoMatch && skillMatch && travelMatch;
  });

  const allSkills = Array.from(new Set(drResponses.flatMap(r => r.skills)));
  const allGeos = Array.from(new Set(drResponses.map(r => r.location.split(",")[0])));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {step === "initiate" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/10">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Initiate Volunteer Call</h3>
                  <p className="text-xs text-slate-500">Configure and broadcast an emergency alert to the volunteer pool.</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Audience Selection */}
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Select Target Audience</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "all", label: "All Tata", icon: Globe },
                      { id: "specific", label: "Specific Companies", icon: Building2 },
                      { id: "geography", label: "Geography", icon: MapPin }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setAudience(opt.id as any)}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group ${
                          audience === opt.id 
                            ? "bg-zinc-900 border-zinc-900 text-white shadow-xl" 
                            : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        <opt.icon size={20} className={audience === opt.id ? "text-tata-cyan" : "group-hover:text-tata-blue"} />
                        <span className="text-xs font-semibold uppercase tracking-wider">{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  {audience === "specific" && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-3">
                      {TATA_COMPANIES.map(company => (
                        <label key={company} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={selectedCompanies.includes(company)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedCompanies([...selectedCompanies, company]);
                              else setSelectedCompanies(selectedCompanies.filter(c => c !== company));
                            }}
                            className="w-4 h-4 rounded border-slate-300 text-tata-blue focus:ring-tata-blue"
                          />
                          <span className="text-xs font-bold text-slate-600 group-hover:text-tata-blue">{company}</span>
                        </label>
                      ))}
                    </motion.div>
                  )}

                  {audience === "geography" && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-3">
                      {GEOGRAPHIES.map(geo => (
                        <label key={geo} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={selectedGeographies.includes(geo)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedGeographies([...selectedGeographies, geo]);
                              else setSelectedGeographies(selectedGeographies.filter(g => g !== geo));
                            }}
                            className="w-4 h-4 rounded border-slate-300 text-tata-blue focus:ring-tata-blue"
                          />
                          <span className="text-xs font-bold text-slate-600 group-hover:text-tata-blue">{geo}</span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Message Template */}
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Message Template</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {DR_TEMPLATES.map(template => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplate(template);
                          setCustomSubject(template.subject);
                          setCustomBody(template.body);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          selectedTemplate.id === template.id 
                            ? "bg-tata-blue/5 border-tata-blue/20 ring-2 ring-tata-blue/10" 
                            : "bg-white border-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-xs font-semibold text-tata-blue uppercase tracking-widest mb-1">{template.name}</div>
                        <div className="text-xs text-slate-500 line-clamp-2">{template.subject}</div>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Subject Line</label>
                      <input 
                        type="text" 
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-tata-blue/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Message Body</label>
                      <textarea 
                        value={customBody}
                        onChange={(e) => setCustomBody(e.target.value)}
                        className="w-full h-40 px-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-tata-blue/20 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions & Summary Column */}
          <div className="space-y-8">
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-widest mb-6">Alert Summary</h4>
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Target Audience</div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    {audience === "all" ? "All Registered Volunteers" : audience === "specific" ? `${selectedCompanies.length} Companies` : `${selectedGeographies.length} Geographies`}
                  </div>
                  {audience !== "all" && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="px-2 py-0.5 bg-tata-blue/10 text-tata-blue text-xs font-semibold uppercase rounded tracking-wider">
                        DR Interest Filter
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Estimated Reach</div>
                  <div className="text-2xl font-black text-tata-blue">
                    {audience === "all" ? "45,000+" : audience === "specific" ? selectedCompanies.length * 500 : selectedGeographies.length * 1200}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Volunteers Notified</div>
                </div>

                <div className="space-y-3 pt-4">
                  <button 
                    onClick={() => setIsPreviewOpen(true)}
                    className="w-full py-4 rounded-2xl border border-slate-200 font-semibold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Eye size={16} /> Preview Alert
                  </button>
                  <button 
                    onClick={handleTrigger}
                    disabled={isTriggering || (audience === "specific" && selectedCompanies.length === 0) || (audience === "geography" && selectedGeographies.length === 0)}
                    className="w-full py-5 bg-red-600 text-white rounded-2xl font-semibold text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTriggering ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Broadcasting...</>
                    ) : (
                      <><Zap size={16} /> Trigger Volunteer Call</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
              <AlertTriangle size={20} className="text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed font-medium">
                <span className="font-semibold uppercase block mb-1">Critical Action</span>
                Triggering this alert will send push notifications, SMS, and emails to the selected audience. This action is irreversible and will be logged in the audit trail.
              </p>
            </div>
          </div>
        </div>
      )}

      {step === "status" && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-600/10">
              <Check size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Alert Broadcasted</h3>
            <p className="text-slate-500 mb-12">The disaster response call has been successfully triggered and is being delivered to the selected audience.</p>
            
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Total Notified</div>
                <div className="text-4xl font-black text-tata-blue">{notifiedCount.toLocaleString()}</div>
              </div>
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Delivery Status</div>
                <div className="text-xl font-semibold text-green-600 uppercase tracking-widest">In Progress</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep("dashboard")} className="flex-1 py-5 bg-zinc-900 text-white rounded-2xl font-semibold text-xs uppercase tracking-widest hover:bg-tata-blue transition-all shadow-xl shadow-black/10 cursor-pointer">
                Go to Response Dashboard
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {step === "dashboard" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Response Dashboard</h3>
              <p className="text-sm text-slate-500">Live monitoring of volunteer responses and deployment status.</p>
            </div>
            <button onClick={() => setStep("initiate")} className="btn-outline py-3 px-6 text-xs font-semibold uppercase tracking-widest cursor-pointer flex items-center gap-2">
              <Plus size={16} /> New Call
            </button>
          </div>

          {/* Dashboard Skeleton / Empty State */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Total Responses", value: drResponses.length.toString(), icon: Users, color: "text-tata-blue" },
              { label: "Available Now", value: drResponses.length > 0 ? drResponses.length.toString() : "0", icon: CheckCircle2, color: "text-green-600" },
              { label: "En Route", value: "0", icon: MapPin, color: "text-amber-600" },
              { label: "On Ground", value: "0", icon: ShieldCheck, color: "text-red-600" }
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg bg-slate-50 ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-3xl font-black text-slate-900">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Response List */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-widest">Volunteer Response List</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Select volunteers to form the deployment cadre</p>
              </div>
              <div className="flex items-center gap-3">
                {selectedVolunteers.length > 0 && (
                  <button 
                    onClick={handleConfirmCadre}
                    disabled={isConfirmingCadre}
                    className="px-6 py-3 bg-tata-blue text-white rounded-2xl text-xs font-semibold uppercase tracking-widest shadow-lg shadow-tata-blue/20 hover:bg-blue-900 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {isConfirmingCadre ? "Sending..." : `Confirm Cadre (${selectedVolunteers.length})`}
                  </button>
                )}
                <button 
                  onClick={handleCloseResponse}
                  className="px-6 py-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-red-100 transition-all cursor-pointer"
                >
                  Close Response
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Geography</label>
                <select 
                  value={filters.geography}
                  onChange={e => setFilters({...filters, geography: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:outline-none"
                >
                  <option value="All">All Geographies</option>
                  {allGeos.map(geo => <option key={geo} value={geo}>{geo}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Skill</label>
                <select 
                  value={filters.skill}
                  onChange={e => setFilters({...filters, skill: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:outline-none"
                >
                  <option value="All">All Skills</option>
                  {allSkills.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Travel Willingness</label>
                <select 
                  value={filters.travel}
                  onChange={e => setFilters({...filters, travel: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:outline-none"
                >
                  <option value="All">All Levels</option>
                  <option value="local">Local</option>
                  <option value="national">National</option>
                  <option value="international">International</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest w-10">
                      <input 
                        type="checkbox" 
                        checked={selectedVolunteers.length === filteredResponses.length && filteredResponses.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedVolunteers(filteredResponses.map(r => r.id));
                          else setSelectedVolunteers([]);
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-tata-blue"
                      />
                    </th>
                    <th className="px-8 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Volunteer</th>
                    <th className="px-8 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Company</th>
                    <th className="px-8 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Location</th>
                    <th className="px-8 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Skills</th>
                    <th className="px-8 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredResponses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center text-slate-400 text-sm italic">
                        No responses match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredResponses.map((res) => (
                      <tr key={res.id} className={`hover:bg-slate-50/50 transition-colors ${selectedVolunteers.includes(res.id) ? "bg-tata-blue/5" : ""}`}>
                        <td className="px-8 py-6">
                          <input 
                            type="checkbox" 
                            checked={selectedVolunteers.includes(res.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedVolunteers([...selectedVolunteers, res.id]);
                              else setSelectedVolunteers(selectedVolunteers.filter(id => id !== res.id));
                            }}
                            className="w-4 h-4 rounded border-slate-300 text-tata-blue"
                          />
                        </td>
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-900">{res.name}</div>
                          <div className="text-xs text-slate-400">{res.email}</div>
                        </td>
                        <td className="px-8 py-6 text-sm font-medium text-slate-600">{res.company}</td>
                        <td className="px-8 py-6 text-sm font-medium text-slate-600">{res.location}</td>
                        <td className="px-8 py-6">
                          <div className="flex flex-wrap gap-1">
                            {res.skills.map((skill: string) => (
                              <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase tracking-wider">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold uppercase rounded-full tracking-widest">Verified</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deployment Log Panel */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center">
                <History size={20} />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-widest">Deployment Log</h4>
            </div>
            
            <div className="space-y-6">
              {drDeploymentLog.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-3xl">
                  No deployments confirmed yet.
                </div>
              ) : (
                drDeploymentLog.map((log) => (
                  <div key={log.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-xs font-semibold text-tata-blue uppercase tracking-widest mb-1">Deployment #{log.id}</div>
                        <div className="text-xs text-slate-500 font-bold">{new Date(log.timestamp).toLocaleString()}</div>
                      </div>
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold uppercase rounded-full tracking-widest">Instructions Sent</span>
                    </div>
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Selected Cadre ({log.volunteers.length})</div>
                      <div className="flex flex-wrap gap-2">
                        {log.volunteers.map((v: any) => (
                          <span key={v.id} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-full">
                            {v.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-slate-100">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Instructions Sent</div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">"{log.instructions}"</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-6">
              <Activity size={40} />
            </div>
            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Awaiting Responses</h4>
            <p className="text-slate-500 max-md">Live data will populate here as volunteers begin responding to the active call. This dashboard will show skill distribution, location clusters, and deployment readiness.</p>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h4 className="font-semibold text-slate-900 uppercase tracking-widest text-sm">Alert Preview</h4>
                <button onClick={() => setIsPreviewOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg">
                    <div className="text-xs font-semibold text-tata-cyan uppercase tracking-widest mb-1">Push Notification</div>
                    <div className="font-bold text-sm">{customSubject}</div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Email Content</div>
                    <div className="font-semibold text-lg text-slate-900 mb-4">{customSubject}</div>
                    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{customBody}</div>
                    <div className="mt-8 pt-8 border-t border-slate-200 flex justify-center">
                      <button className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold text-xs uppercase tracking-widest shadow-lg shadow-red-600/20">
                        Respond Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button onClick={() => setIsPreviewOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 rounded-lg font-semibold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer">Close Preview</button>
                <button onClick={() => { setIsPreviewOpen(false); handleTrigger(); }} className="flex-1 py-4 bg-red-600 text-white rounded-lg font-semibold text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 cursor-pointer">Confirm & Send</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
