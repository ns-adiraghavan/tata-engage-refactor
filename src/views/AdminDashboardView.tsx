import { motion } from "framer-motion";
import { Menu, User, Users, Briefcase, Heart, ShieldCheck, ArrowLeft, Mail, Search, Bell, Calendar, LayoutGrid, FileText, History, ShieldAlert } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { EmailCertificatesPanel } from "@/views/admin/EmailCertificatesPanel";
import { CMSContentPanel } from "@/views/admin/CMSContentPanel";
import { DisasterResponsePanel } from "@/views/admin/DisasterResponsePanel";
import { MediaLibraryPanel } from "@/views/admin/MediaLibraryPanel";
import { ModerationPanel } from "@/views/admin/ModerationPanel";
import { ProjectOversightPanel } from "@/views/admin/ProjectOversightPanel";
import { EditionManagementPanel } from "@/views/admin/EditionManagementPanel";
import { NGOApprovalsPanel } from "@/views/admin/NGOApprovalsPanel";
import { UserManagementPanel } from "@/views/admin/UserManagementPanel";
import { AuditLogPanel } from "@/views/admin/AuditLogPanel";
import { AdminCommandCentre } from "@/views/admin/AdminCommandCentre";

const AdminDashboardView = () => {
  const { handleLogout } = useAuth();
  const { isDRActive, setIsDRActive, drResponses, drDeploymentLog, setDrDeploymentLog, isDRClosed, setIsDRClosed, adminActiveTab, setAdminActiveTab, addAuditLog, triggerToast } = useAppContext();
  const sidebarItems = [
    { id: "Dashboard", icon: LayoutGrid },
    { id: "User Management", icon: Users },
    { id: "NGO Approvals", icon: Heart },
    { id: "Edition Management", icon: Calendar },
    { id: "Project Oversight", icon: Briefcase },
    { id: "Email & Certificates", icon: Mail },
    { id: "CMS Content", icon: FileText },
    { id: "Disaster Response", icon: ShieldAlert },
    { id: "Media Library", icon: LayoutGrid },
    { id: "Moderation", icon: ShieldCheck },
    { id: "Audit Log", icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed inset-y-0 left-0 z-50">
        {/* Logo / brand */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-tata-blue rounded-xl flex items-center justify-center font-bold text-white text-sm">T</div>
            <div>
              <p className="font-bold text-slate-900 text-sm leading-none">TataEngage</p>
              <p className="text-xs text-tata-blue font-semibold uppercase tracking-widest mt-0.5">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto px-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2 px-2">Main Menu</p>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setAdminActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer mb-0.5 ${
                adminActiveTab === item.id
                  ? "bg-blue-50 text-tata-blue border-l-2 border-tata-blue"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent"
              }`}
            >
              <item.icon size={16} className="flex-shrink-0" />
              <span className="truncate text-left">{item.id}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100 mb-3">
            <div className="w-8 h-8 rounded-lg bg-tata-blue flex items-center justify-center font-bold text-white text-xs">VN</div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">Vikram Nair</p>
              <p className="text-xs text-slate-400">TSG Admin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-red-100">
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-8">
            <h2 className="font-black text-slate-900 uppercase tracking-[0.15em] text-sm">{adminActiveTab}</h2>
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 w-80 group focus-within:border-tata-blue/30 transition-all">
              <Search size={16} className="text-slate-400 group-focus-within:text-tata-blue transition-colors" />
              <input 
                type="text" 
                placeholder="Search projects, users, or logs..." 
                className="bg-transparent border-none focus:ring-0 text-xs w-full ml-2 placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="relative cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors group">
                <Bell size={20} className="text-slate-400 group-hover:text-tata-blue transition-colors" />
                <div className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-xs font-semibold rounded-full flex items-center justify-center border-2 border-white shadow-lg shadow-red-600/20">12</div>
              </div>
              <div className="relative cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors group">
                <Mail size={20} className="text-slate-400 group-hover:text-tata-blue transition-colors" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-tata-cyan rounded-full border-2 border-white shadow-lg shadow-tata-cyan/20" />
              </div>
            </div>
            <div className="h-10 w-px bg-slate-100" />
            <div className="flex flex-col items-end">
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
              <div className="text-xs font-mono text-slate-400 uppercase">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
          </div>
        </header>

        <div className="p-10 flex-1 max-w-[1600px] mx-auto w-full">
          {adminActiveTab === "Dashboard" && <AdminCommandCentre />}
          {adminActiveTab === "User Management" && <UserManagementPanel />}
          {adminActiveTab === "NGO Approvals" && <NGOApprovalsPanel addAuditLog={addAuditLog} triggerToast={triggerToast} />}
          {adminActiveTab === "Edition Management" && <EditionManagementPanel addAuditLog={addAuditLog} triggerToast={triggerToast} />}
          {adminActiveTab === "Project Oversight" && <ProjectOversightPanel addAuditLog={addAuditLog} triggerToast={triggerToast} />}
          {adminActiveTab === "Email & Certificates" && <EmailCertificatesPanel addAuditLog={addAuditLog} triggerToast={triggerToast} />}
          {adminActiveTab === "CMS Content" && <CMSContentPanel addAuditLog={addAuditLog} triggerToast={triggerToast} />}
          {adminActiveTab === "Disaster Response" && (
            <DisasterResponsePanel 
              addAuditLog={addAuditLog} 
              triggerToast={triggerToast} 
              drResponses={drResponses}
              setIsDRActive={setIsDRActive}
              isDRActive={isDRActive}
              drDeploymentLog={drDeploymentLog}
              setDrDeploymentLog={setDrDeploymentLog}
              isDRClosed={isDRClosed}
              setIsDRClosed={setIsDRClosed}
            />
          )}
          {adminActiveTab === "Media Library" && <MediaLibraryPanel triggerToast={triggerToast} />}
          {adminActiveTab === "Moderation" && <ModerationPanel addAuditLog={addAuditLog} triggerToast={triggerToast} />}
          {adminActiveTab === "Audit Log" && <AuditLogPanel />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardView;
