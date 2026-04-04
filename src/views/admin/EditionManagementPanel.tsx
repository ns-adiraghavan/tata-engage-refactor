import { useState } from "react";
import { motion } from "framer-motion";
import { X, ShieldCheck, Lock, Eye, Calendar, Info, CalendarDays, Plus, Save, History, AlertTriangle, Upload } from "lucide-react";
import { MOCK_EDITIONS } from "@/data/mockData";

export const EditionManagementPanel = ({ addAuditLog, triggerToast }: { addAuditLog: any, triggerToast: any }) => {
  const [activeTab, setActiveTab] = useState<"ProEngage" | "TVW">("ProEngage");
  const [proengageEditions, setProengageEditions] = useState(MOCK_EDITIONS.proengage);
  const [tvwEditions, setTvwEditions] = useState(MOCK_EDITIONS.tvw);
  const [selectedEdition, setSelectedEdition] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState<any>(null);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const currentPE = proengageEditions.find(e => e.status === "Open") || proengageEditions[1];
  const currentTVW = tvwEditions.find(e => e.status === "Open") || tvwEditions[1];

  const handleStatusChange = (type: "proengage" | "tvw", id: number, newStatus: string) => {
    if (type === "proengage") {
      setProengageEditions(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    } else {
      setTvwEditions(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    }
    addAuditLog("Edition Status Changed", `Changed ${type} edition ${id} status to ${newStatus}`);
    triggerToast(`Edition status updated to ${newStatus}.`);
    setShowStatusModal(null);
  };

  const handleFreeze = () => {
    addAuditLog("Edition Data Frozen", "Locked all edition data for reporting");
    triggerToast("Edition data frozen successfully.");
    setShowFreezeModal(false);
  };

  const ProEngageConfig = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-4">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Edition History</h3>
          <button 
            onClick={() => triggerToast("Cloning current edition settings...")}
            className="text-xs font-semibold text-tata-blue uppercase tracking-widest hover:underline flex items-center gap-1"
          >
            <Plus size={12} /> Create New
          </button>
        </div>
        <div className="space-y-3">
          {proengageEditions.map((e) => (
            <button 
              key={e.id}
              onClick={() => setSelectedEdition(e)}
              className={`w-full p-5 rounded-lg border text-left transition-all relative overflow-hidden group ${
                selectedEdition?.id === e.id && activeTab === "ProEngage"
                  ? "border-tata-blue bg-white shadow-lg shadow-tata-blue/5"
                  : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
              }`}
            >
              {selectedEdition?.id === e.id && activeTab === "ProEngage" && (
                <div className="absolute top-0 left-0 w-1 h-full bg-tata-blue" />
              )}
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-semibold uppercase tracking-tight ${selectedEdition?.id === e.id ? "text-tata-blue" : "text-slate-900"}`}>{e.name}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                  e.status === "Open" ? "bg-green-100 text-green-600" : 
                  e.status === "Closed" ? "bg-slate-100 text-slate-500" : "bg-blue-100 text-blue-600"
                }`}>{e.status}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Calendar size={10} />
                {e.goLive} — {e.endDate}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-10">
        {selectedEdition ? (
          <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
            <div className="flex justify-between items-center border-b border-slate-50 pb-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest">Configure Edition</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedEdition.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest shadow-sm ${
                  selectedEdition.status === "Open" ? "bg-green-50 text-green-600 border border-green-100" : "bg-slate-50 text-slate-500 border border-slate-100"
                }`}>{selectedEdition.status}</span>
                <button 
                  onClick={() => setShowStatusModal({ type: "proengage", id: selectedEdition.id, current: selectedEdition.status })}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold uppercase tracking-widest rounded-lg hover:bg-black transition-all shadow-lg shadow-slate-900/10"
                >
                  Manual Override
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-8">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-3">Edition Name</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-tata-blue focus:bg-white transition-all text-sm font-bold" defaultValue={selectedEdition.name} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-3">Go-Live Date</label>
                <div className="relative">
                  <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="date" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-tata-blue focus:bg-white transition-all text-sm font-bold" defaultValue={selectedEdition.goLive} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-3">Official End Date</label>
                <div className="relative">
                  <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="date" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-tata-blue focus:bg-white transition-all text-sm font-bold" defaultValue={selectedEdition.endDate} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-3">Application Window Start</label>
                <input type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-tata-blue focus:bg-white transition-all text-sm font-bold" defaultValue={selectedEdition.appWindow.start} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-3">Application Window End</label>
                <input type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-tata-blue focus:bg-white transition-all text-sm font-bold" defaultValue={selectedEdition.appWindow.end} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-3">Buffer Period (Days)</label>
                <input type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-tata-blue focus:bg-white transition-all text-sm font-bold" defaultValue={selectedEdition.buffer} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-3">Volunteer Application Cap</label>
                <div className="relative">
                  <input type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-tata-blue focus:bg-white transition-all text-sm font-bold" defaultValue={selectedEdition.cap} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 uppercase tracking-widest">Projects</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4 text-amber-700 shadow-sm">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Info size={20} className="text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1">System Constraint Note</p>
                <p className="text-xs font-medium leading-relaxed">Only one cap type can be active at a time — project-level, NGO-level, or edition-level. Changing this will override other active caps.</p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50 flex justify-end gap-4">
              <button className="px-10 py-4 rounded-lg border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all">Discard Changes</button>
              <button onClick={() => triggerToast("Edition settings saved.")} className="px-10 py-4 bg-tata-blue text-white text-xs font-semibold uppercase tracking-widest rounded-lg hover:bg-blue-900 transition-all shadow-lg shadow-tata-blue/20">Save Configuration</button>
            </div>
          </form>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-6 py-32">
            <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
              <Calendar size={48} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-2">No Edition Selected</p>
              <p className="text-xs text-slate-400 font-medium">Select an edition from the history to begin configuration</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const TVWConfig = () => {
    const [tvwForm, setTvwForm] = useState(currentTVW);

    return (
      <div className="bg-white border border-slate-200 p-8">
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="flex justify-between items-center border-b border-slate-100 pb-6">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest">TVW Edition Setup (CMS-linked)</h3>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-100 flex items-center gap-2"
              >
                <Eye size={14} /> Preview Hub
              </button>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${
                tvwForm.status === "Open" ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-500"
              }`}>{tvwForm.status}</div>
              <button 
                onClick={() => setShowStatusModal({ type: "tvw", id: tvwForm.id, current: tvwForm.status })}
                className="text-xs font-semibold text-tata-blue uppercase tracking-widest hover:underline"
              >
                Status Gate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Edition Name</label>
                <input type="text" className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm" defaultValue={tvwForm.name} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Theme Title</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm" 
                  defaultValue={tvwForm.theme}
                  onChange={(e) => setTvwForm({ ...tvwForm, theme: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">TVW Week Start</label>
                  <input type="date" className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm" defaultValue={tvwForm.dates.start} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">TVW Week End</label>
                  <input type="date" className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm" defaultValue={tvwForm.dates.end} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Collateral Upload (PDF)</label>
                <div className="border-2 border-dashed border-slate-100 p-8 text-center hover:border-tata-blue transition-all cursor-pointer group">
                  <Upload size={24} className="mx-auto text-slate-300 group-hover:text-tata-blue mb-2" />
                  <p className="text-xs font-bold text-slate-400 uppercase">Upload SPOC Toolkit</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">GCSO Message</label>
                <textarea 
                  className="w-full p-4 border border-slate-200 outline-none focus:border-tata-blue text-sm min-h-[200px] leading-relaxed"
                  defaultValue={tvwForm.gcsoMessage}
                  onChange={(e) => setTvwForm({ ...tvwForm, gcsoMessage: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Hero Banner Image</label>
                <div className="aspect-video bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                  <img 
                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800" 
                    className="w-full h-full object-cover opacity-50"
                    alt="Hero Preview"
                  />
                  <button className="absolute p-3 bg-white/90 shadow-xl rounded-full text-tata-blue hover:scale-110 transition-transform">
                    <Upload size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 flex items-center gap-3 text-tata-blue">
            <ShieldCheck size={18} />
            <p className="text-xs font-bold uppercase tracking-widest">Event posting by SPOCs is only enabled once Admin sets status to "Open".</p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <button className="px-8 py-3 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all">Discard</button>
            <button onClick={() => triggerToast("TVW CMS settings updated.")} className="px-8 py-3 bg-tata-blue text-white text-xs font-semibold uppercase tracking-widest hover:bg-blue-900 transition-all">Publish Updates</button>
          </div>
        </form>

        {showPreview && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-10 bg-black/80 backdrop-blur-md">
            <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl relative">
              <button onClick={() => setShowPreview(false)} className="absolute top-8 right-8 z-10 p-3 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-all">
                <X size={24} />
              </button>
              <div className="relative h-96">
                <img 
                  src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=2000" 
                  className="w-full h-full object-cover brightness-50"
                  alt="TVW Banner"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <span className="px-4 py-1 rounded-full bg-tata-cyan text-tata-blue text-xs font-bold mb-4 inline-block uppercase tracking-widest">TVW 2025</span>
                  <h1 className="text-5xl font-black text-white mb-4 tracking-tight uppercase">{tvwForm.theme}</h1>
                  <p className="text-white/80 max-w-xl mx-auto text-lg">Join the global movement of Tata volunteers making an impact across the world.</p>
                </div>
              </div>
              <div className="p-12 bg-slate-50">
                <div className="max-w-2xl mx-auto text-center">
                  <h3 className="text-xs font-semibold text-tata-blue uppercase tracking-[0.3em] mb-6">GCSO Message Preview</h3>
                  <p className="text-xl font-serif italic text-slate-600 leading-relaxed">"{tvwForm.gcsoMessage}"</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {/* Edition Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-tata-blue/5 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-1">Active ProEngage Edition</h3>
              <p className="text-xs text-slate-400 font-mono">{currentPE.name}</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-600 text-[10px] font-semibold uppercase tracking-widest rounded">Status: {currentPE.status}</span>
          </div>
          <div className="grid grid-cols-3 gap-6 relative z-10">
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Volunteers</div>
              <div className="text-xl font-semibold text-slate-900">{currentPE.volunteers.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Projects Live</div>
              <div className="text-xl font-semibold text-slate-900">{currentPE.projects}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Days Left</div>
              <div className="text-xl font-semibold text-tata-blue">72</div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 text-white p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-tata-cyan/10 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-1">Active TVW Edition</h3>
              <p className="text-xs text-zinc-500 font-mono">{currentTVW.name}</p>
            </div>
            <span className="px-2 py-1 bg-tata-cyan text-tata-blue text-[10px] font-semibold uppercase tracking-widest rounded">Status: {currentTVW.status}</span>
          </div>
          <div className="grid grid-cols-3 gap-6 relative z-10">
            <div>
              <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">Volunteers</div>
              <div className="text-xl font-semibold text-white">{currentTVW.volunteers.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">Events Live</div>
              <div className="text-xl font-semibold text-white">{currentTVW.projects}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">Days to Start</div>
              <div className="text-xl font-semibold text-tata-cyan">58</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex border-b border-slate-200">
          {["ProEngage", "TVW"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-8 py-4 text-xs font-semibold uppercase tracking-widest transition-all relative ${
                activeTab === tab ? "text-tata-blue" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab} Edition Config
              {activeTab === tab && <motion.div layoutId="editionSubTab" className="absolute bottom-0 left-0 right-0 h-1 bg-tata-blue" />}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setShowFreezeModal(true)}
          className="px-6 py-2 bg-red-50 text-red-600 border border-red-100 text-xs font-semibold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
        >
          <Lock size={14} /> Freeze Edition Data
        </button>
      </div>

      {activeTab === "ProEngage" ? <ProEngageConfig /> : <TVWConfig />}

      {/* Status Override Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 w-full max-w-md border border-slate-200 shadow-2xl">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest text-center mb-4">Manual Status Override</h3>
            <p className="text-xs text-slate-500 text-center mb-8 leading-relaxed">
              This will manually {showStatusModal.current === "Open" ? "close" : "open"} applications for all 200+ projects in this edition. This action is immediate and will notify all active SPOCs.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowStatusModal(null)} className="flex-1 py-3 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
              <button 
                onClick={() => handleStatusChange(showStatusModal.type, showStatusModal.id, showStatusModal.current === "Open" ? "Closed" : "Open")}
                className="flex-1 py-3 bg-zinc-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-all"
              >
                Confirm Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Freeze Data Modal */}
      {showFreezeModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 w-full max-w-md border border-slate-200 shadow-2xl">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest text-center mb-4">Freeze Edition Data?</h3>
            <p className="text-xs text-slate-500 text-center mb-8 leading-relaxed">
              Freezing will lock all volunteer records, project outcomes, and hours for the current edition. No further edits will be possible. This is required for final reporting.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowFreezeModal(false)} className="flex-1 py-3 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
              <button 
                onClick={handleFreeze}
                className="flex-1 py-3 bg-red-600 text-white text-xs font-semibold uppercase tracking-widest hover:bg-red-700 transition-all"
              >
                Confirm Freeze
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
