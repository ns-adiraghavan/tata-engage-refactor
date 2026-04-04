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
          <button onClick={() => setShowAddDomain(true)} className="px-6 py-2 bg-tata-blue text-white text-xs font-semibold uppercase tracking-widest hover:bg-blue-900 transition-all flex items-center gap-2">
            <Plus size={14} /> Add New Domain
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-widest">
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
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-semibold uppercase tracking-widest rounded">{domain.status}</span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="text-xs font-semibold text-tata-blue uppercase tracking-widest hover:underline">Validate</button>
                    <button className="text-xs font-semibold text-slate-400 uppercase tracking-widest hover:text-slate-600">Edit</button>
                    <button onClick={() => {
                      if(window.confirm("Are you sure you want to remove this domain?")) {
                        addAuditLog("Remove Domain", `Removed domain ${domain.domain} for ${domain.company}`);
                        triggerToast("Domain removed successfully.");
                      }
                    }} className="text-xs font-semibold text-red-400 uppercase tracking-widest hover:text-red-600">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAddDomain && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-8 w-full max-w-md border border-slate-200 shadow-2xl">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-6">Add New Company Domain</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Company Name</label>
                  <input type="text" className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm" placeholder="e.g. Tata Communications" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Domain</label>
                  <input type="text" className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm" placeholder="e.g. tatacommunications.com" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setShowAddDomain(false)} className="flex-1 py-3 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                  <button onClick={() => {
                    addAuditLog("Add Domain", "Added new company domain");
                    setShowAddDomain(false);
                    triggerToast("Domain added successfully.");
                  }} className="flex-1 py-3 bg-tata-blue text-white text-xs font-semibold uppercase tracking-widest hover:bg-blue-900 transition-all">Add Domain</button>
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
          <button className="px-6 py-2 bg-zinc-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-zinc-800 transition-all">Promote Employee to SPOC</button>
        </div>

        <div className="overflow-x-auto border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-widest">
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
                    <div className="text-xs text-slate-400 font-mono">{s.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest rounded ${
                      s.role === "Corporate SPOC" ? "bg-blue-100 text-blue-600" : "bg-cyan-100 text-cyan-600"
                    }`}>{s.role}</span>
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-700">{s.company}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${s.status === "Active" ? "bg-green-500" : "bg-slate-300"}`} />
                      <span className="text-xs font-bold text-slate-600">{s.status}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">2026-01-15</span>
                      {s.id % 3 === 0 && (
                        <span className="bg-amber-100 text-amber-700 text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                          <Clock size={8} /> 3-month review due
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => {
                      addAuditLog("Deactivate SPOC", `Deactivated SPOC ${s.name}`);
                      triggerToast(`SPOC ${s.name} deactivated.`);
                    }} className="text-xs font-semibold text-red-400 uppercase tracking-widest hover:text-red-600">Deactivate</button>
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
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-widest">
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
                    <div className="text-xs text-slate-400 font-mono">{v.email}</div>
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-700">{v.company}</td>
                  <td className="p-4 text-xs font-medium text-slate-500">{v.type}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest rounded ${
                      v.status === "Active" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                    }`}>{v.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setShowEditVolunteer(v)} className="text-xs font-semibold text-tata-blue uppercase tracking-widest hover:underline">Edit Record</button>
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
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest">Edit Volunteer Record</h3>
                <button onClick={() => setShowEditVolunteer(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Full Name</label>
                  <input type="text" className="w-full p-3 border border-slate-200 outline-none text-sm bg-slate-50" value={showEditVolunteer.name} readOnly />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Email Address</label>
                  <input type="email" className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm" defaultValue={showEditVolunteer.email} />
                  {!showEditVolunteer.email.endsWith(".com") && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-100 flex items-center gap-2 text-red-600">
                      <AlertTriangle size={14} />
                      <span className="text-xs font-bold uppercase">Domain mismatch warning</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Assigned Company</label>
                  <select className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm" defaultValue={showEditVolunteer.company}>
                    <option>TCS</option>
                    <option>Tata Steel</option>
                    <option>Tata Motors</option>
                    <option>TCS (Ex-Employee)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">User Type</label>
                  <select className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm" defaultValue={showEditVolunteer.type}>
                    <option>Employee</option>
                    <option>Retiree</option>
                    <option>Family Member</option>
                  </select>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Reason for Change*</label>
                  <textarea className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm min-h-[100px]" placeholder="Required for audit trail..."></textarea>
                </div>
              </div>

              <div className="pt-8 flex gap-4">
                <button onClick={() => setShowEditVolunteer(null)} className="flex-1 py-3 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                <button onClick={() => {
                  addAuditLog("Edit Volunteer", `Updated record for ${showEditVolunteer.name}`);
                  setShowEditVolunteer(null);
                  triggerToast("Record updated successfully.");
                }} className="flex-1 py-3 bg-tata-blue text-white text-xs font-semibold uppercase tracking-widest hover:bg-blue-900 transition-all">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );

    const AccessControlTab = () => {
      const modules = ["tvw", "proengage", "reports", "cms", "certificates"];
      const baseUserTypes = Object.keys(permissions);

      // Local toggle state: true = Allow, false = Block
      const [toggleState, setToggleState] = useState<Record<string, Record<string, boolean>>>(() => {
        const initial: Record<string, Record<string, boolean>> = {};
        for (const role of baseUserTypes) {
          initial[role] = {};
          for (const mod of modules) {
            initial[role][mod] = (permissions as any)[role]?.[mod] !== "None";
          }
        }
        return initial;
      });

      const [addingRole, setAddingRole] = useState(false);
      const [newRoleName, setNewRoleName] = useState("");

      const handleToggle = (role: string, mod: string) => {
        const current = toggleState[role]?.[mod] ?? false;
        const next = !current;
        setToggleState(prev => ({
          ...prev,
          [role]: { ...prev[role], [mod]: next }
        }));
        addAuditLog("Update Permission", `Changed ${role} access to ${mod} to ${next ? "Allow" : "Block"}`);
        triggerToast(`${role.replace("_", " ")} → ${mod}: ${next ? "Allow" : "Block"}`);
      };

      const handleSaveNewRole = () => {
        const key = newRoleName.trim().toLowerCase().replace(/\s+/g, "_");
        if (!key) return;
        setToggleState(prev => ({
          ...prev,
          [key]: modules.reduce((acc, m) => ({ ...acc, [m]: false }), {} as Record<string, boolean>)
        }));
        addAuditLog("Add Role", `Added new role "${newRoleName.trim()}" to permission matrix`);
        triggerToast(`Role "${newRoleName.trim()}" added.`);
        setNewRoleName("");
        setAddingRole(false);
      };

      const allRoles = Object.keys(toggleState);

      return (
        <div className="space-y-6">
          <p className="text-[13px] text-muted-foreground">Changes apply platform-wide. All edits are logged to the audit trail.</p>

          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  <th className="p-4">Role</th>
                  {modules.map(m => <th key={m} className="p-4 text-center">{m}</th>)}
                  <th className="p-4 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allRoles.map(role => (
                  <tr key={role} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-xs font-semibold text-slate-900 uppercase tracking-widest">{role.replace(/_/g, " ")}</td>
                    {modules.map(mod => {
                      const allowed = toggleState[role]?.[mod] ?? false;
                      return (
                        <td key={mod} className="p-4 text-center">
                          <button
                            onClick={() => handleToggle(role, mod)}
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                              allowed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {allowed ? "Allow" : "Block"}
                          </button>
                        </td>
                      );
                    })}
                    <td className="p-4" />
                  </tr>
                ))}

                {/* Add role row */}
                {addingRole ? (
                  <tr className="bg-blue-50/40">
                    <td className="p-4">
                      <input
                        type="text"
                        placeholder="Role name…"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        className="w-full text-xs font-semibold uppercase tracking-widest bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-tata-blue/20"
                        autoFocus
                      />
                    </td>
                    {modules.map(mod => (
                      <td key={mod} className="p-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-red-100 text-red-800">Block</span>
                      </td>
                    ))}
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={handleSaveNewRole} className="px-3 py-1.5 bg-tata-blue text-white text-xs font-bold rounded-lg hover:bg-tata-blue/90 transition-colors cursor-pointer flex items-center gap-1">
                          <Save size={12} /> Save
                        </button>
                        <button onClick={() => { setAddingRole(false); setNewRoleName(""); }} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={modules.length + 2} className="p-4">
                      <button
                        onClick={() => setAddingRole(true)}
                        className="flex items-center gap-2 text-xs font-bold text-tata-blue hover:underline cursor-pointer"
                      >
                        <Plus size={14} /> Add role
                      </button>
                    </td>
                  </tr>
                )}
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
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {subTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded-lg transition-all relative ${
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
