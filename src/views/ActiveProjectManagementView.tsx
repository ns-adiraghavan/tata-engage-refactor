import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, CheckCircle2, Sparkles, Edit2, StopCircle, AlertTriangle, Activity, ChevronLeft } from "lucide-react";
import type { View } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";

const ActiveProjectManagementView = ({ project }: { project: any }) => {
  const { user } = useAuth();
  const navigate = useAppNavigate();
  const { triggerToast } = useAppContext();
  const MOCK_HEALTH_UPDATES = [
    { month: "January", status: "Updated", date: "2026-01-15" },
    { month: "February", status: "Updated", date: "2026-02-14" },
    { month: "March", status: "At Risk", date: "2026-03-20" },
    { month: "April", status: "Pending", date: null },
  ];
  const [healthUpdates, setHealthUpdates] = useState(MOCK_HEALTH_UPDATES);
  const [projectStatus, setProjectStatus] = useState(project?.status || "Active");
  const [showConfirmModal, setShowConfirmModal] = useState<"close" | null>(null);
  const [auditTrail, setAuditTrail] = useState<any[]>([]);
  const [isSubAdminMode, setIsSubAdminMode] = useState(false);

  const handleStatusChange = (newStatus: string, action: string) => {
    setProjectStatus(newStatus);
    setAuditTrail(prev => [{
      id: Date.now(),
      action,
      user: "Anjali Mehta (NGO)",
      date: new Date().toLocaleString()
    }, ...prev]);
    triggerToast(`Project ${action} successfully. TSG Admin notified.`);
    setShowConfirmModal(null);
  };

  const toggleHealthStatus = (month: string) => {
    setHealthUpdates(prev => prev.map(h => {
      if (h.month === month) {
        const nextStatus = h.status === "Updated" ? "At Risk" : h.status === "At Risk" ? "Pending" : "Updated";
        return { ...h, status: nextStatus, date: nextStatus === "Updated" ? new Date().toISOString().split('T')[0] : h.date };
      }
      return h;
    }));
  };

  const hasRisk = healthUpdates.some(h => h.status === "At Risk" || (h.month === "April" && h.status === "Pending"));

  return (
    <div className="min-h-screen pt-20 pb-20 bg-slate-50 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <button onClick={() => navigate("ngo-dashboard")} className="flex items-center gap-2 text-slate-500 hover:text-tata-blue font-medium mb-4 transition-colors cursor-pointer">
              <ChevronLeft size={18} /> Back to Dashboard
            </button>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold text-tata-blue">{project?.title || "Active Project"}</h1>
              <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                projectStatus === 'Active' ? 'bg-green-100 text-green-700' :
                projectStatus === 'Paused' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {projectStatus}
              </span>
            </div>
            <p className="text-slate-500">Project ID: #{project?.id || "101"} • Stage: Execution</p>
          </div>
          
          <div className="flex gap-3">
            <button onClick={() => setShowConfirmModal("close")} className="bg-red-500 text-white py-3 px-6 rounded-lg font-bold hover:bg-red-600 transition-all flex items-center gap-2 cursor-pointer">
              <StopCircle size={18} /> Close Project
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Kick-Off Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Mail size={120} />
              </div>
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Kick-Off Emails Sent</h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Confirmation emails have been successfully dispatched to the NGO team and all 4 matched volunteers.
                  </p>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Timestamp: April 01, 2026, 10:00 AM</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-green-600">Status: Delivered</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* M&E Tracker */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-tata-blue">M&E Tracker</h3>
                  <p className="text-sm text-slate-500">Monitoring & Evaluation Monthly Health Updates</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">TSG Sub-Admin Mode</span>
                  <button 
                    onClick={() => setIsSubAdminMode(!isSubAdminMode)}
                    className={`w-12 h-6 rounded-full transition-all relative ${isSubAdminMode ? "bg-tata-cyan" : "bg-slate-200"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isSubAdminMode ? "left-7" : "left-1"}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {healthUpdates.map((update, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        update.status === 'Updated' ? 'bg-green-100 text-green-600' :
                        update.status === 'At Risk' ? 'bg-red-100 text-red-600' :
                        'bg-slate-200 text-slate-400'
                      }`}>
                        <Activity size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{update.month}</h4>
                        <p className="text-xs text-slate-400">{update.date ? `Updated on ${update.date}` : "Awaiting Update"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        update.status === 'Updated' ? 'bg-green-100 text-green-700' :
                        update.status === 'At Risk' ? 'bg-red-100 text-red-700' :
                        'bg-slate-200 text-slate-500'
                      }`}>
                        {update.status}
                      </span>
                      {isSubAdminMode && (
                        <button 
                          onClick={() => toggleHealthStatus(update.month)}
                          className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-tata-blue transition-all cursor-pointer"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Trail */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <History size={20} className="text-tata-blue" /> Project Audit Trail
              </h3>
              <div className="space-y-4">
                {auditTrail.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No status changes logged yet.</p>
                ) : (
                  auditTrail.map(log => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-tata-blue/10 text-tata-blue flex items-center justify-center font-bold text-xs">
                          {log.user.split(' ')[0][0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-700">{log.action}</p>
                          <p className="text-xs text-slate-400">By {log.user}</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{log.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* AI Risk Flag Card */}
            {hasRisk && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-red-500 to-red-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <AlertTriangle size={80} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={20} className="text-red-200" />
                    <span className="text-xs font-bold uppercase tracking-widest text-red-100">AI Risk Flag (AI-05)</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 leading-tight">Project health flagged – review recommended</h3>
                  <p className="text-red-100 text-sm mb-6 opacity-90">
                    Our AI has detected a potential risk due to {healthUpdates.some(h => h.status === "At Risk") ? "a monthly health update marked 'At Risk'" : "an overdue health update for April"}.
                  </p>
                  <button className="w-full py-3 bg-white text-red-600 rounded-lg font-bold text-sm hover:bg-red-50 transition-all cursor-pointer">
                    Review Details
                  </button>
                </div>
              </motion.div>
            )}

            {/* Simulated SPOC Dashboard Panel */}
            <div className="bg-zinc-900 rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold">SPOC Dashboard</h3>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Simulated View</span>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-tata-cyan/20 text-tata-cyan flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Rahul Singh</p>
                      <p className="text-xs text-zinc-500">Corporate SPOC</p>
                    </div>
                  </div>
                  {hasRisk ? (
                    <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-200 leading-relaxed">
                        Alert: {project?.title} health flagged. Action required.
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 italic">No active alerts for your projects.</p>
                  )}
                </div>
                <button className="w-full py-3 text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer">
                  View All Projects
                </button>
              </div>
            </div>

            {/* Project Quick Stats */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-6">Project Progress</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-400 uppercase tracking-widest">Completion</span>
                    <span className="text-tata-blue">75%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-tata-blue w-3/4" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Volunteers</p>
                    <p className="text-xl font-semibold text-slate-800">4/5</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-xl font-semibold text-slate-800">2m left</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
              onClick={() => setShowConfirmModal(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 text-center"
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 ${
                showConfirmModal === 'close' ? 'bg-red-100 text-red-500' : 'bg-amber-100 text-amber-500'
              }`}>
                {showConfirmModal === 'pause' ? <Pause size={40} /> : 
                 showConfirmModal === 'close' ? <StopCircle size={40} /> : <History size={40} />}
              </div>
              <h2 className="text-2xl font-bold text-tata-blue mb-4">
                {showConfirmModal === 'pause' ? "Pause Project?" : 
                 showConfirmModal === 'close' ? "Close Project?" : "Request Extension?"}
              </h2>
              <p className="text-slate-500 mb-10">
                {showConfirmModal === 'pause' ? "This will temporarily halt all volunteer activities. TSG Admin will be notified." : 
                 showConfirmModal === 'close' ? "Are you sure you want to close this project? This action cannot be undone." : 
                 "This will send a request to TSG Admin to extend the project duration."}
              </p>
              <div className="flex gap-4">
                <button onClick={() => setShowConfirmModal(null)} className="flex-1 btn-outline py-4 cursor-pointer">Cancel</button>
                <button 
                  onClick={() => {
                    const status = showConfirmModal === 'pause' ? 'Paused' : showConfirmModal === 'close' ? 'Closed' : 'Active';
                    const action = showConfirmModal === 'pause' ? 'Paused' : showConfirmModal === 'close' ? 'Closed' : 'Extension Requested';
                    handleStatusChange(status, action);
                  }}
                  className={`flex-1 py-4 rounded-lg font-bold text-white transition-all cursor-pointer ${
                    showConfirmModal === 'close' ? 'bg-red-500 hover:bg-red-600' : 'bg-zinc-900 hover:bg-tata-blue'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActiveProjectManagementView;
