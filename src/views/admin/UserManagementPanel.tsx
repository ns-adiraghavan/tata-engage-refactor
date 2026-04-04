import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, User, Search, Clock, Info, Plus, Save, AlertTriangle } from "lucide-react";
import type { Role } from "@/types";
import { COMPANY_DOMAINS, VOLUNTEER_RECORDS, PERMISSION_MATRIX, SPOC_DIRECTORY } from "@/data/mockData";

export const UserManagementPanel = () => {
  const { addAuditLog, triggerToast } = useAppContext();
    const [activeSubTab, setActiveSubTab] = useState("Company Domain Registry");
    const [showAddDomain, setShowAddDomain] = useState(false);
    const [showEditVolunteer, setShowEditVolunteer] = useState<any>(null);
    const [domainSearch, setDomainSearch] = useState("");
    const [volunteerSearch, setVolunteerSearch] = useState("");
    const [permissions, setPermissions] = useState(PERMISSION_MATRIX);

    const subTabs = [
      "Company Domain Registry",
      "SPOC Management",
      "Volunteer Record Editor",
      "Access Control Panel"
    ];

    const DomainRegistryTab = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search domains..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:ring-2 focus:ring-tata-blue/10 outline-none text-xs"
              value={domainSearch}
              onChange={(e) => setDomainSearch(e.target.value)}
            />
          </div>
          <button onClick={() => setShowAddDomain(true)} className="px-6 py-2 bg-tata-blue text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-900 transition-all flex items-center gap-2">
            <Plus size={14} /> Add New Domain
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-4">Company Name</th>
                <th className="p-4">Domain</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COMPANY_DOMAINS.filter(d => d.company.toLowerCase().includes(domainSearch.toLowerCase()) || d.domain.includes(domainSearch)).map((domain) => (
                <tr key={domain.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-xs font-bold text-slate-900">{domain.company}</td>
                  <td className="p-4 text-xs font-mono text-slate-500">{domain.domain}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[8px] font-black uppercase tracking-widest rounded">{domain.status}</span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="text-[10px] font-black text-tata-blue uppercase tracking-widest hover:underline">Validate</button>
                    <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Edit</button>
                    <button onClick={() => {
                      if(window.confirm("Are you sure you want to remove this domain?")) {
                        addAuditLog("Remove Domain", `Removed domain ${domain.domain} for ${domain.company}`);
                        triggerToast("Domain removed successfully.");
                      }
                    }} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAddDomain && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-8 w-full max-w-md border border-slate-200 shadow-2xl">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Add New Company Domain</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Company Name</label>
                  <input type="text" className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm" placeholder="e.g. Tata Communications" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Domain</label>
                  <input type="text" className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm" placeholder="e.g. tatacommunications.com" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setShowAddDomain(false)} className="flex-1 py-3 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                  <button onClick={() => {
                    addAuditLog("Add Domain", "Added new company domain");
                    setShowAddDomain(false);
                    triggerToast("Domain added successfully.");
                  }} className="flex-1 py-3 bg-tata-blue text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-900 transition-all">Add Domain</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );

    const SPOCManagementTab = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search SPOCs..." className="w-full pl-10 pr-4 py-2 border border-slate-200 outline-none text-xs" />
          </div>
          <button className="px-6 py-2 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">Promote Employee to SPOC</button>
        </div>

        <div className="overflow-x-auto border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-4">SPOC Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Company</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Review</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SPOC_DIRECTORY.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="text-xs font-bold text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{s.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded ${
                      s.role === "Corporate SPOC" ? "bg-blue-100 text-blue-600" : "bg-cyan-100 text-cyan-600"
                    }`}>{s.role}</span>
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-700">{s.company}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${s.status === "Active" ? "bg-green-500" : "bg-slate-300"}`} />
                      <span className="text-[10px] font-bold text-slate-600">{s.status}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500">2026-01-15</span>
                      {s.id % 3 === 0 && (
                        <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                          <Clock size={8} /> 3-month review due
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => {
                      addAuditLog("Deactivate SPOC", `Deactivated SPOC ${s.name}`);
                      triggerToast(`SPOC ${s.name} deactivated.`);
                    }} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600">Deactivate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    const VolunteerEditorTab = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 outline-none text-xs"
              value={volunteerSearch}
              onChange={(e) => setVolunteerSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-4">Volunteer</th>
                <th className="p-4">Company</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {VOLUNTEER_RECORDS.filter(v => v.name.toLowerCase().includes(volunteerSearch.toLowerCase()) || v.email.includes(volunteerSearch)).map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="text-xs font-bold text-slate-900">{v.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{v.email}</div>
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-700">{v.company}</td>
                  <td className="p-4 text-xs font-medium text-slate-500">{v.type}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded ${
                      v.status === "Active" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                    }`}>{v.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setShowEditVolunteer(v)} className="text-[10px] font-black text-tata-blue uppercase tracking-widest hover:underline">Edit Record</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showEditVolunteer && (
          <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              className="w-full max-w-md bg-white h-full shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Edit Volunteer Record</h3>
                <button onClick={() => setShowEditVolunteer(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Full Name</label>
                  <input type="text" className="w-full p-3 border border-slate-200 outline-none text-sm bg-slate-50" value={showEditVolunteer.name} readOnly />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Email Address</label>
                  <input type="email" className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm" defaultValue={showEditVolunteer.email} />
                  {!showEditVolunteer.email.endsWith(".com") && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-100 flex items-center gap-2 text-red-600">
                      <AlertTriangle size={14} />
                      <span className="text-[10px] font-bold uppercase">Domain mismatch warning</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Assigned Company</label>
                  <select className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm" defaultValue={showEditVolunteer.company}>
                    <option>TCS</option>
                    <option>Tata Steel</option>
                    <option>Tata Motors</option>
                    <option>TCS (Ex-Employee)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">User Type</label>
                  <select className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm" defaultValue={showEditVolunteer.type}>
                    <option>Employee</option>
                    <option>Retiree</option>
                    <option>Family Member</option>
                  </select>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Reason for Change*</label>
                  <textarea className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm min-h-[100px]" placeholder="Required for audit trail..."></textarea>
                </div>
              </div>

              <div className="pt-8 flex gap-4">
                <button onClick={() => setShowEditVolunteer(null)} className="flex-1 py-3 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                <button onClick={() => {
                  addAuditLog("Edit Volunteer", `Updated record for ${showEditVolunteer.name}`);
                  setShowEditVolunteer(null);
                  triggerToast("Record updated successfully.");
                }} className="flex-1 py-3 bg-tata-blue text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-900 transition-all">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );

    const AccessControlTab = () => {
      const modules = ["tvw", "proengage", "reports", "cms", "certificates"];
      const userTypes = ["volunteer", "spoc", "ngo", "sub_admin"];

      return (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-100 flex items-center gap-3 text-tata-blue">
            <Info size={18} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Changes to permissions take effect immediately for all active sessions.</p>
          </div>

          <div className="overflow-x-auto border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="p-4">User Type</th>
                  {modules.map(m => <th key={m} className="p-4 text-center">{m}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userTypes.map(type => (
                  <tr key={type} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-xs font-black text-slate-900 uppercase tracking-widest">{type.replace("_", " ")}</td>
                    {modules.map(module => (
                      <td key={module} className="p-4 text-center">
                        <select 
                          className={`text-[10px] font-black uppercase tracking-widest border-none bg-transparent outline-none cursor-pointer ${
                            (permissions as any)[type][module] === "Write" ? "text-green-600" : 
                            (permissions as any)[type][module] === "Read" ? "text-tata-blue" : "text-slate-300"
                          }`}
                          value={(permissions as any)[type][module]}
                          onChange={(e) => {
                            const newVal = e.target.value;
                            setPermissions({
                              ...permissions,
                              [type]: { ...(permissions as any)[type], [module]: newVal }
                            });
                            addAuditLog("Update Permission", `Changed ${type} access to ${module} to ${newVal}`);
                            triggerToast(`Permissions updated for ${type}.`);
                          }}
                        >
                          <option>None</option>
                          <option>Read</option>
                          <option>Write</option>
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-[0.1em]">User Management</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">Control platform access, company domains, and SPOC roles.</p>
          </div>
          <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100">
            {subTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all relative ${
                  activeSubTab === tab 
                    ? "bg-white text-tata-blue shadow-sm border border-slate-100" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {activeSubTab === "Company Domain Registry" && <DomainRegistryTab />}
          {activeSubTab === "SPOC Management" && <SPOCManagementTab />}
          {activeSubTab === "Volunteer Record Editor" && <VolunteerEditorTab />}
          {activeSubTab === "Access Control Panel" && <AccessControlTab />}
        </div>
      </div>
    );
  };
