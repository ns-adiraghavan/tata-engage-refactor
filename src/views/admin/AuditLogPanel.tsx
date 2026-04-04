import { useState } from "react";
import { User, ShieldCheck, Search, Download } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

export const AuditLogPanel = () => {
  const { user } = useAuth();
  const { auditLogs, triggerToast } = useAppContext();
  const [filterType, setFilterType] = useState("All");
  const [search, setSearch] = useState("");

  const filteredLogs = auditLogs.filter(log => {
    const matchesType = filterType === "All" || log.action.includes(filterType);
    const matchesSearch = log.details.toLowerCase().includes(search.toLowerCase()) || log.user.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-[0.1em]">System Audit Trail</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Chronological record of every administrative action.</p>
        </div>
        <button 
          onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8," + auditLogs.map(e => `${e.timestamp},${e.user},${e.action},${e.details}`).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "audit_log_export.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            triggerToast("Audit log exported as CSV.");
          }}
          className="px-6 py-3 bg-zinc-900 text-white text-xs font-semibold uppercase tracking-widest rounded-2xl shadow-lg shadow-zinc-900/20 hover:bg-black hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
        >
          <Download size={16} /> Export as CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-4 bg-white p-4 border border-slate-200">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Admin or Details..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-100 text-xs font-semibold uppercase tracking-widest outline-none focus:border-tata-blue bg-slate-50"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border border-slate-100 text-xs font-semibold uppercase tracking-widest outline-none focus:border-tata-blue bg-slate-50"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
        >
          <option value="All">All Actions</option>
          <option>NGO</option>
          <option>Project</option>
          <option>Email</option>
          <option>User</option>
          <option>CMS</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Admin Name</th>
                <th className="p-4">Action Type</th>
                <th className="p-4">Details</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-xs font-mono text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-4 text-xs font-bold text-slate-900">{log.user}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-widest rounded">{log.action}</span>
                  </td>
                  <td className="p-4 text-xs font-mono text-slate-400">{log.details}</td>
                  <td className="p-4 text-right">
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-semibold uppercase tracking-widest rounded">Success</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-100 flex items-center gap-3 text-slate-400">
        <ShieldCheck size={16} />
        <p className="text-xs font-bold uppercase tracking-widest">Audit log is tamper-proof and retained for 7 years per DPDP compliance.</p>
      </div>
    </div>
  );
};
