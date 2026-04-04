import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, ShieldCheck, Eye, Award, Send, ChevronDown, Save, History } from "lucide-react";
import { COMPANY_DOMAINS, MOCK_EMAIL_TRIGGERS, MOCK_BULK_EMAILS, MOCK_CERTIFICATE_PROJECTS } from "@/data/mockData";

export const EmailCertificatesPanel = ({ addAuditLog, triggerToast }: { addAuditLog: any, triggerToast: any }) => {
  const [activeTab, setActiveTab] = useState<"Triggers" | "Bulk Email" | "Certificates">("Triggers");
  const [triggers, setTriggers] = useState(MOCK_EMAIL_TRIGGERS);
  const [expandedTrigger, setExpandedTrigger] = useState<number | null>(null);
  const [bulkEmails, setBulkEmails] = useState(MOCK_BULK_EMAILS);
  const [certProjects, setCertProjects] = useState(MOCK_CERTIFICATE_PROJECTS);
  
  // Bulk Email State
  const [bulkSubject, setBulkSubject] = useState("");
  const [bulkBody, setBulkBody] = useState("");
  const [bulkAudience, setBulkAudience] = useState("All Users");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [showBulkPreview, setShowBulkPreview] = useState(false);

  // Certificate State
  const [showTriggerModal, setShowTriggerModal] = useState<any>(null);
  const [viewVolunteers, setViewVolunteers] = useState<any>(null);

  const handleUpdateTrigger = (id: number, updates: any) => {
    setTriggers(prev => prev.map(t => t.id === id ? { ...t, ...updates, lastEdited: new Date().toISOString() } : t));
    addAuditLog("Email Trigger Updated", `Updated template for trigger ID: ${id}`);
  };

  const handleSubmitBulk = () => {
    const newBulk = {
      id: bulkEmails.length + 1,
      subject: bulkSubject,
      body: bulkBody,
      audience: bulkAudience === "Specific Company" ? `Companies: ${selectedCompanies.join(", ")}` : bulkAudience,
      status: "Awaiting approval",
      sentDate: "-",
      openRate: "-"
    };
    setBulkEmails([newBulk, ...bulkEmails]);
    addAuditLog("Bulk Email Submitted", `Submitted bulk email for approval: ${bulkSubject}`);
    triggerToast("Email submitted for approval by Sub-Admin Meera.");
    setBulkSubject("");
    setBulkBody("");
    setBulkAudience("All Users");
    setSelectedCompanies([]);
  };

  const handleTriggerCertificates = (id: number) => {
    const project = certProjects.find(p => p.id === id);
    if (!project) return;
    setCertProjects(prev => prev.map(p => p.id === id ? { ...p, status: "Generated" } : p));
    addAuditLog("Certificates Triggered", `Triggered certificates for project: ${project.title}`);
    triggerToast(`Generating certificates for ${project.volunteersCount} volunteers...`);
    
    setTimeout(() => {
      setCertProjects(prev => prev.map(p => p.id === id ? { ...p, status: "Emailed" } : p));
      triggerToast(`Certificates emailed for ${project.title}.`);
    }, 3000);
    
    setShowTriggerModal(null);
  };

  const EmailTriggerTab = () => (
    <div className="space-y-4">
      {triggers.map((trigger) => (
        <div key={trigger.id} className="bg-white border border-slate-200 overflow-hidden">
          <button 
            onClick={() => setExpandedTrigger(expandedTrigger === trigger.id ? null : trigger.id)}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${trigger.enabled ? 'bg-green-500' : 'bg-slate-300'}`} />
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-900 uppercase tracking-widest">{trigger.type}</div>
                <div className="text-xs text-slate-400 font-mono">{trigger.condition}</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-xs text-slate-400 font-mono text-right">
                Last edited: {new Date(trigger.lastEdited).toLocaleString()}
              </div>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${expandedTrigger === trigger.id ? 'rotate-180' : ''}`} />
            </div>
          </button>
          
          <AnimatePresence>
            {expandedTrigger === trigger.id && (
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="border-t border-slate-100 bg-slate-50 overflow-hidden"
              >
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Subject Line</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm font-bold bg-white" 
                          defaultValue={trigger.subject}
                          onChange={(e) => handleUpdateTrigger(trigger.id, { subject: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Send Timing</label>
                        <select 
                          className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm bg-white"
                          defaultValue={trigger.timing}
                          onChange={(e) => handleUpdateTrigger(trigger.id, { timing: e.target.value })}
                        >
                          <option>Immediately</option>
                          <option>3 days before deadline</option>
                          <option>1 day before deadline</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-3 pt-4">
                        <button 
                          onClick={() => handleUpdateTrigger(trigger.id, { enabled: !trigger.enabled })}
                          className={`w-12 h-6 rounded-full relative transition-all ${trigger.enabled ? 'bg-tata-blue' : 'bg-slate-300'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${trigger.enabled ? 'left-7' : 'left-1'}`} />
                        </button>
                        <span className="text-xs font-semibold text-slate-900 uppercase tracking-widest">
                          {trigger.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Email Body (Merge Tags: {"{{volunteer_name}}"}, {"{{project_title}}"})</label>
                      <textarea 
                        className="w-full p-4 border border-slate-200 outline-none focus:border-tata-blue text-sm min-h-[180px] bg-white leading-relaxed"
                        defaultValue={trigger.body}
                        onChange={(e) => handleUpdateTrigger(trigger.id, { body: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-200 flex justify-end gap-4">
                    <button 
                      onClick={() => triggerToast("Test email sent to vikram.nair@tata.com")}
                      className="px-6 py-2 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2"
                    >
                      <Send size={14} /> Send Test Email
                    </button>
                    <button className="px-6 py-2 bg-tata-blue text-white text-xs font-semibold uppercase tracking-widest hover:bg-blue-900 transition-all">
                      Save Template
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );

  const BulkEmailTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white border border-slate-200 p-8 space-y-6">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Compose Bulk Dispatch</h3>
          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Target Audience</label>
              <select 
                className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm bg-white"
                value={bulkAudience}
                onChange={(e) => setBulkAudience(e.target.value)}
              >
                <option>All Users</option>
                <option>Specific Company</option>
                <option>All SPOCs</option>
                <option>All NGOs</option>
                <option>Custom Segment</option>
              </select>
            </div>
            
            {bulkAudience === "Specific Company" && (
              <div className="grid grid-cols-2 gap-3">
                {COMPANY_DOMAINS.map(c => (
                  <button 
                    key={c.id}
                    onClick={() => {
                      setSelectedCompanies(prev => 
                        prev.includes(c.company) ? prev.filter(x => x !== c.company) : [...prev, c.company]
                      );
                    }}
                    className={`p-3 border text-left text-xs font-bold uppercase tracking-widest transition-all ${
                      selectedCompanies.includes(c.company) ? 'border-tata-blue bg-blue-50 text-tata-blue' : 'border-slate-100 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {c.company}
                  </button>
                ))}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Email Subject</label>
              <input 
                type="text" 
                className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm font-bold" 
                placeholder="Enter subject line..."
                value={bulkSubject}
                onChange={(e) => setBulkSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Message Body</label>
              <textarea 
                className="w-full p-4 border border-slate-200 outline-none focus:border-tata-blue text-sm min-h-[250px] leading-relaxed"
                placeholder="Compose your message here..."
                value={bulkBody}
                onChange={(e) => setBulkBody(e.target.value)}
              />
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <button 
              onClick={() => setShowBulkPreview(true)}
              className="px-8 py-3 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <Eye size={16} /> Preview Render
            </button>
            <button 
              onClick={handleSubmitBulk}
              disabled={!bulkSubject || !bulkBody}
              className="px-8 py-3 bg-zinc-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
            >
              Submit for Send
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-widest">Dispatch History</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {bulkEmails.map((email) => (
              <div key={email.id} className="p-4 space-y-2 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">{email.subject}</div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-widest ${
                    email.status === "Sent" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                  }`}>
                    {email.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>Audience: {email.audience}</span>
                  <span>{email.sentDate}</span>
                </div>
                {email.status === "Sent" && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-tata-blue" style={{ width: email.openRate }} />
                    </div>
                    <span className="text-xs font-semibold text-tata-blue">{email.openRate} Open</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-6">
          <div className="flex items-center gap-3 text-tata-blue mb-4">
            <ShieldCheck size={20} />
            <h4 className="text-xs font-semibold uppercase tracking-widest">Approval Gate Active</h4>
          </div>
          <p className="text-xs text-tata-blue font-bold leading-relaxed uppercase tracking-tight">
            Bulk emails cannot be sent directly. A second Admin (Sub-Admin Meera) must verify the content and target audience before dispatch.
          </p>
        </div>
      </div>

      {showBulkPreview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-10 bg-black/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest">Email Preview Render</h3>
              <button onClick={() => setShowBulkPreview(false)} className="p-2 hover:bg-slate-200 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-10 flex-1 overflow-y-auto space-y-8 bg-white">
              <div className="border-b border-slate-100 pb-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Subject</div>
                <div className="text-lg font-semibold text-slate-900">{bulkSubject || "(No Subject)"}</div>
              </div>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {bulkBody || "(No Body Content)"}
              </div>
              <div className="pt-10 border-t border-slate-100 text-center">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Footer Preview</div>
                <div className="text-xs text-slate-400">
                  You are receiving this email as a registered member of the Tata Engage platform.<br />
                  © 2026 Tata Sons Private Limited. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const CertificatesTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                <th className="p-4">Project Title</th>
                <th className="p-4">NGO</th>
                <th className="p-4 text-center">Volunteers Completed</th>
                <th className="p-4 text-center">Feedback Submitted %</th>
                <th className="p-4">Certificate Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {certProjects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-xs font-bold text-slate-900">{p.title}</td>
                  <td className="p-4 text-xs font-medium text-slate-700">{p.ngo}</td>
                  <td className="p-4 text-center text-xs font-bold text-slate-900">{p.volunteersCount}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-tata-blue" style={{ width: `${p.feedbackPercent}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-900">{p.feedbackPercent}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest rounded ${
                      p.status === "Emailed" ? "bg-green-100 text-green-600" : 
                      p.status === "Generated" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                    }`}>{p.status}</span>
                  </td>
                  <td className="p-4 text-right space-x-4">
                    <button 
                      onClick={() => setViewVolunteers(p)}
                      className="text-xs font-semibold text-slate-400 uppercase tracking-widest hover:text-slate-600"
                    >
                      Manage Volunteers
                    </button>
                    <button 
                      disabled={p.status !== "Not Triggered"}
                      onClick={() => setShowTriggerModal(p)}
                      className="text-xs font-semibold text-tata-blue uppercase tracking-widest hover:underline disabled:opacity-30"
                    >
                      Trigger Certificates
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showTriggerModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 w-full max-w-md border border-slate-200 shadow-2xl text-center">
            <div className="w-16 h-16 bg-blue-50 text-tata-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <Award size={32} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-4">Trigger Certificates?</h3>
            <p className="text-xs text-slate-500 mb-8 leading-relaxed">
              This will generate and email certificates to <strong>{showTriggerModal.volunteersCount} volunteers</strong> for the project "{showTriggerModal.title}" within 24 hours.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowTriggerModal(null)} className="flex-1 py-3 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
              <button 
                onClick={() => handleTriggerCertificates(showTriggerModal.id)}
                className="flex-1 py-3 bg-tata-blue text-white text-xs font-semibold uppercase tracking-widest hover:bg-blue-900 transition-all"
              >
                Confirm & Trigger
              </button>
            </div>
          </div>
        </div>
      )}

      {viewVolunteers && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest">Manage Project Volunteers</h3>
                <p className="text-xs text-slate-400 font-mono">{viewVolunteers.title}</p>
              </div>
              <button onClick={() => setViewVolunteers(null)} className="p-2 hover:bg-slate-200 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    <th className="p-4">Volunteer Name</th>
                    <th className="p-4">Project Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewVolunteers.volunteers.map((v: any) => (
                    <tr key={v.id}>
                      <td className="p-4 text-xs font-bold text-slate-900">{v.name}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-semibold uppercase tracking-widest rounded">{v.status}</span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => {
                            if(window.confirm(`Mark ${v.name} as Drop Out? This will exclude them from certificates.`)) {
                              addAuditLog("Volunteer Manual Override", `Marked ${v.name} as Drop Out for project ${viewVolunteers.title}`);
                              triggerToast(`${v.name} marked as Drop Out.`);
                            }
                          }}
                          className="text-xs font-semibold text-red-400 uppercase tracking-widest hover:text-red-600"
                        >
                          Manual Override (Drop Out)
                        </button>
                      </td>
                    </tr>
                  ))}
                  {viewVolunteers.volunteers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No volunteer records found for this project.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-[0.1em]">Email & Certificates</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Manage automated triggers, bulk communications, and recognition.</p>
        </div>
        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          {["Triggers", "Bulk Email", "Certificates"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded-lg transition-all relative ${
                activeTab === tab 
                  ? "bg-white text-tata-blue shadow-sm border border-slate-100" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab === "Triggers" ? "Email Trigger Config" : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[600px]">
        {activeTab === "Triggers" && <EmailTriggerTab />}
        {activeTab === "Bulk Email" && <BulkEmailTab />}
        {activeTab === "Certificates" && <CertificatesTab />}
      </div>
    </div>
  );
};
