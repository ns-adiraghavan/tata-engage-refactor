import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, ShieldCheck, ArrowLeft, Mail, Sparkles, MessageSquare, Activity, Download, FileSpreadsheet, ShieldAlert } from "lucide-react";
import type { View } from "@/types";
import { useAppContext } from "@/context/AppContext";

const DRPrototypeView = () => {
  const { user, isDRActive, setIsDRActive, navigate } = useAppContext();
  const [activeTab, setActiveTab] = useState<"volunteer" | "spoc" | "csr">("volunteer");

  return (
    <div className="min-h-screen bg-slate-50 p-10 space-y-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Simultaneous Notification Prototype</h2>
            <p className="text-slate-500">Demonstrating real-time alert delivery across three distinct user roles.</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            {[
              { id: "volunteer", label: "Volunteer (Priya)", icon: User },
              { id: "spoc", label: "SPOC (Rohan)", icon: Briefcase },
              { id: "csr", label: "CSR Head (Vikram)", icon: ShieldCheck }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === tab.id ? "bg-zinc-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "volunteer" && (
            <motion.div 
              key="volunteer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Volunteer Dashboard Perspective */}
              <div className="bg-red-600 p-6 rounded-[2rem] shadow-2xl shadow-red-600/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-700" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 animate-pulse">
                    <ShieldAlert size={32} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="px-2 py-0.5 bg-white text-red-600 text-[9px] font-black uppercase rounded tracking-widest">Emergency</span>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">Disaster Response Activated</h3>
                    </div>
                    <p className="text-white/80 text-sm font-medium">Urgent volunteer call for Flood Relief in Assam. Your skills are needed on-ground.</p>
                  </div>
                </div>
                <button className="px-8 py-4 bg-white text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-slate-50 transition-all relative z-10 cursor-pointer">
                  Respond to Call
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-40 grayscale pointer-events-none">
                <div className="h-48 bg-white rounded-3xl border border-slate-200" />
                <div className="h-48 bg-white rounded-3xl border border-slate-200" />
                <div className="h-48 bg-white rounded-3xl border border-slate-200" />
              </div>
            </motion.div>
          )}

          {activeTab === "spoc" && (
            <motion.div 
              key="spoc"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* SPOC Corner Perspective */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8 opacity-40 grayscale pointer-events-none">
                  <div className="h-64 bg-white rounded-3xl border border-slate-200" />
                  <div className="h-96 bg-white rounded-3xl border border-slate-200" />
                </div>
                <div className="space-y-8">
                  <div className="glass rounded-[2.5rem] p-8 shadow-xl border border-red-100 bg-red-50/30">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-red-600 text-white rounded-xl shadow-lg shadow-red-600/20">
                        <Activity size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active DR Alert</h4>
                        <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">Assam Flood Relief</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="p-4 bg-white rounded-2xl border border-red-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Company Responses</div>
                        <div className="text-3xl font-black text-slate-900">124</div>
                        <div className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Volunteers from TCS</div>
                      </div>
                      <button className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-tata-blue transition-all shadow-xl shadow-black/10 cursor-pointer flex items-center justify-center gap-2">
                        <FileSpreadsheet size={16} /> View DR Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "csr" && (
            <motion.div 
              key="csr"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* CSR Head Perspective */}
              <div className="max-w-3xl mx-auto">
                <div className="glass rounded-[3rem] p-10 shadow-2xl border border-white/20">
                  <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-tata-blue text-white rounded-2xl flex items-center justify-center shadow-lg shadow-tata-blue/20">
                        <Mail size={24} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Sent Email Card</h4>
                        <p className="text-[10px] text-slate-400 font-mono">Coordinating Alert — Sent 2 mins ago</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase rounded-full tracking-widest">Delivered</span>
                  </div>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">To:</span>
                      <span className="text-xs font-bold text-slate-900">All Company CSR Heads, Regional SPOCs</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">Subject:</span>
                      <span className="text-xs font-black text-red-600 uppercase tracking-tight">CRITICAL: One Tata Response Activation — Assam Floods</span>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed italic">
                      "Team, we have activated Phase 1 of the One Tata Response Framework for the Assam Floods. Please review the deployment logistics and coordinate with your respective volunteer pools. The DR Dashboard is now live for monitoring."
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chatbot Context Switch Demo */}
        <div className="mt-20 p-10 bg-zinc-900 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-tata-blue/10 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-tata-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-tata-blue/20">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">AI-02 Chatbot Context Switch</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                When a Disaster Response is active, the AI assistant automatically switches modes. It provides DR-specific prompts and prioritizes deployment logistics and safety information.
              </p>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isDRActive ? "bg-red-600 text-white" : "bg-white/10 text-white/40"}`}>
                  {isDRActive ? "DR Active Mode" : "Standard Mode"}
                </div>
                <button 
                  onClick={() => setIsDRActive(!isDRActive)}
                  className="text-[10px] font-black text-tata-cyan uppercase tracking-widest hover:underline cursor-pointer"
                >
                  Toggle Mode for Demo
                </button>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/10">
                <div className="p-6 bg-tata-blue text-white flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={18} />
                    <h4 className="font-bold text-xs">Engage AI</h4>
                    {isDRActive && (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full animate-bounce">
                        DR Active
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Suggested DR Prompts</div>
                  <div className="space-y-2">
                    {(isDRActive ? [
                      "Deployment logistics for Assam",
                      "What skills are needed?",
                      "What should I pack?",
                      "Coordinate with SPOC"
                    ] : [
                      "How to apply?",
                      "TVW 2025 theme",
                      "Download certificate"
                    ]).map((p, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-bold text-slate-600 hover:border-tata-blue transition-all cursor-pointer">
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-10 left-10 z-50">
        <button 
          onClick={() => navigate("admin-dashboard")}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Admin
        </button>
      </div>
    </div>
  );
};

export default DRPrototypeView;
