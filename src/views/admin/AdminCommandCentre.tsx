import React, { useState } from "react";
import { Users, Briefcase, Heart, ShieldCheck, Bell, ExternalLink, Activity, Download, Plus, X } from "lucide-react";
import type { View } from "@/types";
import { MOCK_NGO_APPLICATIONS } from "@/constants";
import { MOCK_PROJECT_SUBMISSIONS, MOCK_BULK_EMAILS, MOCK_TESTIMONIALS } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";

export const AdminCommandCentre = () => {
  const { setAdminActiveTab, auditLogs } = useAppContext();

  const [reportCards, setReportCards] = useState([
    { id: 1, title: "ProEngage edition report", description: "Applications, matches, completions by company", lastGenerated: "12 Mar 2025" },
    { id: 2, title: "TVW participation report", description: "Events, registrations, hours logged by region", lastGenerated: "5 Mar 2025" },
    { id: 3, title: "Non-programme email log", description: "All bulk emails sent, open rates, bounce rates", lastGenerated: "1 Mar 2025" },
    { id: 4, title: "Volunteer attrition report", description: "Drop-outs by stage, reason, and edition", lastGenerated: "20 Feb 2025" },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReportName, setNewReportName] = useState("");
  const [newReportDesc, setNewReportDesc] = useState("");
  const stats = [
    { label: "Total Registered Users", value: "12,540", icon: Users, color: "text-tata-blue", trend: "+12.5%", trendUp: true },
    { label: "Active NGOs", value: "450", icon: Heart, color: "text-red-500", trend: "+3.2%", trendUp: true },
    { label: "Open ProEngage Projects", value: "85", icon: Briefcase, color: "text-tata-cyan", trend: "-2.1%", trendUp: false },
    { label: "Pending Admin Actions", value: (MOCK_NGO_APPLICATIONS.filter(n => n.status === "Pending" || n.status === "Flagged").length + MOCK_PROJECT_SUBMISSIONS.filter(p => p.status === "Under Review").length + MOCK_BULK_EMAILS.filter(e => e.status === "Awaiting approval").length + MOCK_TESTIMONIALS.filter(t => t.status === "Pending").length).toString(), icon: Bell, color: "text-red-600", badge: true, trend: "Requires Action", trendUp: false },
  ];

  const pendingActions = [
    { id: 1, title: `${MOCK_NGO_APPLICATIONS.filter(n => n.status === "Pending" || n.status === "Flagged").length} NGO applications awaiting review`, type: "NGO Approvals", priority: "High", time: "2h ago" },
    { id: 2, title: `${MOCK_PROJECT_SUBMISSIONS.filter(p => p.status === "Under Review").length} projects pending approval`, type: "Project Oversight", priority: "Medium", time: "5h ago" },
    { id: 3, title: `${MOCK_BULK_EMAILS.filter(e => e.status === "Awaiting approval").length} bulk emails awaiting sign-off`, type: "Email & Certificates", priority: "Low", time: "1d ago" },
    { id: 4, title: `${MOCK_TESTIMONIALS.filter(t => t.status === "Pending").length} testimonials pending moderation`, type: "Moderation", priority: "Low", time: "3h ago" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                stat.trendUp ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-500"
              }`}>
                {stat.trend}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</span>
                {stat.badge && <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-semibold text-slate-900 uppercase tracking-widest text-xs">Platform Activity Overview</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-bold bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">Daily</button>
                <button className="px-3 py-1 text-xs font-bold bg-tata-blue text-white rounded-lg">Weekly</button>
                <button className="px-3 py-1 text-xs font-bold bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">Monthly</button>
              </div>
            </div>
            <div className="p-8 h-80 flex flex-col bg-slate-50/30">
              <div className="w-full flex-1 flex items-end justify-around gap-4 px-4">
                {[40, 70, 45, 90, 65, 85, 50].map((h, i) => (
                  <div key={i} className="flex-1 flex items-end h-full">
                    <div 
                      className="w-full bg-tata-blue rounded-t-lg transition-all duration-1000 ease-out hover:bg-tata-cyan" 
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 w-full flex justify-around text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-semibold text-slate-900 uppercase tracking-widest text-xs">Recent System Events</h3>
              <button className="text-xs font-semibold text-tata-blue uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-50">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                      <Activity size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{log.action}</div>
                      <div className="text-xs text-slate-400 font-mono">{log.details}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-400">{new Date(log.timestamp).toLocaleDateString()}</div>
                    <div className="text-xs font-mono text-slate-300">{new Date(log.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Actions Feed */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 uppercase tracking-widest text-xs">Pending Actions</h3>
              <span className="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-widest">12 Alerts</span>
            </div>
            <div className="p-4 space-y-3">
              {pendingActions.map((action) => (
                <button 
                  key={action.id} 
                  onClick={() => setAdminActiveTab(action.type)}
                  className="w-full text-left p-4 rounded-lg border border-slate-50 hover:border-tata-blue/20 hover:bg-slate-50/50 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-tata-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-widest ${
                      action.priority === "High" ? "bg-red-100 text-red-600" : 
                      action.priority === "Medium" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                    }`}>
                      {action.priority} Priority
                    </span>
                    <span className="text-xs font-mono text-slate-400">{action.time}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-tata-blue transition-colors">{action.title}</div>
                  <div className="text-xs text-slate-400 mt-1 uppercase tracking-widest">{action.type}</div>
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-slate-50">
              <button className="w-full py-3 text-xs font-semibold text-slate-400 uppercase tracking-widest hover:text-tata-blue transition-colors">
                View All Actions
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl text-white p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-tata-blue/20 rounded-full -mr-16 -mt-16 blur-3xl" />
            <h4 className="text-xs font-semibold text-tata-cyan uppercase tracking-widest mb-4 relative z-10">Admin Quick Links</h4>
            <div className="space-y-3 relative z-10">
              <button className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white transition-colors group">
                Generate Edition Report <ExternalLink size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white transition-colors group">
                Bulk NGO Export <ExternalLink size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white transition-colors group">
                Platform Settings <ShieldCheck size={12} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">External</p>
              <h3 className="text-sm font-black text-slate-900">Annual Reporting Portal</h3>
              <p className="text-xs text-slate-400 mt-1">TSG external reporting dashboard</p>
            </div>
            <button
              onClick={() => triggerToast("Annual reporting portal link — to be configured by TSG.")}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-tata-blue hover:text-white hover:border-tata-blue transition-all cursor-pointer"
            >
              Open →
            </button>
          </div>
        </div>
      </div>

      {/* Report Library */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Report Library</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportCards.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all">
              <h4 className="text-base font-medium text-slate-900 mb-1">{report.title}</h4>
              <p className="text-[13px] text-muted-foreground mb-3">{report.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Last generated: {report.lastGenerated}</span>
                <button className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:border-tata-blue hover:text-tata-blue transition-colors cursor-pointer flex items-center gap-1.5">
                  <Download size={13} /> Generate &amp; download
                </button>
              </div>
            </div>
          ))}

          {/* Add report type card */}
          <button
            onClick={() => setShowAddModal(true)}
            className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex items-center justify-center gap-2 text-sm font-semibold text-slate-400 hover:border-tata-blue hover:text-tata-blue transition-colors cursor-pointer min-h-[140px]"
          >
            <Plus size={16} /> Add report type
          </button>
        </div>
      </div>

      {/* Add Report Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Add report type</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-1.5">Report name</label>
                <input
                  type="text"
                  value={newReportName}
                  onChange={(e) => setNewReportName(e.target.value)}
                  placeholder="e.g. Monthly impact summary"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tata-blue/20"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-1.5">Description</label>
                <input
                  type="text"
                  value={newReportDesc}
                  onChange={(e) => setNewReportDesc(e.target.value)}
                  placeholder="One-line description of the report"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tata-blue/20"
                />
              </div>
            </div>
            <button
              onClick={() => {
                if (!newReportName.trim()) return;
                setReportCards(prev => [...prev, {
                  id: Date.now(),
                  title: newReportName.trim(),
                  description: newReportDesc.trim() || "Custom report",
                  lastGenerated: "Not yet generated"
                }]);
                setNewReportName("");
                setNewReportDesc("");
                setShowAddModal(false);
              }}
              className="w-full py-3 bg-tata-blue text-white rounded-lg text-sm font-bold hover:bg-tata-blue/90 transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
