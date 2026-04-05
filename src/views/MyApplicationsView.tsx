import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, CheckCircle2, XCircle, Clock, Award, ArrowRight, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";

const REJECTED_APPLICATION = {
  id: 99,
  title: "After-School Coding Club",
  ngo: "Teach For India",
  appliedDate: "March 28, 2026",
  status: "Rejected" as const,
  reason: "Project filled before your application was reviewed",
};

const MyApplicationsView = () => {
  const { user } = useAuth();
  const navigate = useAppNavigate();
  const [activeTab, setActiveTab] = useState<"current" | "past">("current");

  const statusConfig = {
    Matched: { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    Pending: { color: "bg-slate-100 text-slate-600", icon: Clock },
    Rejected: { color: "bg-red-100 text-red-700", icon: XCircle },
  };

  return (
    <div className="pt-28 pb-20 px-6 md:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-tata-blue tracking-tight mb-2">My Applications</h1>
          <p className="text-slate-500">Track your volunteering applications and history.</p>
        </div>

        {/* Tab toggle */}
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl shadow-inner mb-10 w-fit">
          {[
            { id: "current" as const, label: "Current Edition" },
            { id: "past" as const, label: "Past Editions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-tata-blue shadow-lg shadow-blue-900/5"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "current" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">ProEngage 2025</h3>

            {/* Active application */}
            {user.activeApplication && (() => {
              const app = user.activeApplication;
              const cfg = statusConfig[app.status as keyof typeof statusConfig] || statusConfig.Pending;
              const StatusIcon = cfg.icon;
              return (
                <div className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 tracking-tight">{app.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{app.ngo}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${cfg.color}`}>
                      <StatusIcon size={14} />
                      {app.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-400">
                    <span>Applied: {app.date}</span>
                  </div>
                  {app.status === "Matched" && (
                    <button
                      onClick={() => navigate("active-project-management")}
                      className="mt-6 flex items-center gap-2 text-sm font-bold text-tata-blue hover:underline cursor-pointer"
                    >
                      View project details <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              );
            })()}

            {/* Rejected application */}
            {(() => {
              const app = REJECTED_APPLICATION;
              const cfg = statusConfig.Rejected;
              const StatusIcon = cfg.icon;
              return (
                <div className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 tracking-tight">{app.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{app.ngo}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${cfg.color}`}>
                      <StatusIcon size={14} />
                      {app.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-400 mb-4">
                    <span>Applied: {app.appliedDate}</span>
                  </div>
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-sm text-red-700">
                      <span className="font-bold">Reason:</span> {app.reason}
                    </p>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}

        {activeTab === "past" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Completed Projects</h3>

            {user.history?.map((entry: any) => (
              <div
                key={entry.id}
                className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 tracking-tight">{entry.project}</h4>
                    <p className="text-sm text-slate-500 mt-1">ProEngage 2025</p>
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700">
                    <CheckCircle2 size={14} />
                    Completed
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-6">
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {entry.hours} hours</span>
                  <span>Completed: {entry.date}</span>
                </div>

                <div className="flex items-center gap-6">
                  <button
                    onClick={() => navigate("profile")}
                    className="flex items-center gap-2 text-sm font-bold text-tata-blue hover:underline cursor-pointer"
                  >
                    <Award size={14} /> View Certificate
                  </button>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest">
                    <MessageSquare size={14} /> Feedback submitted ✓
                  </span>
                </div>
              </div>
            ))}

            {(!user.history || user.history.length === 0) && (
              <div className="text-center py-20">
                <ClipboardList size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-400 text-lg">No past applications yet.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyApplicationsView;
