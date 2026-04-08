import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, MapPin, Award, Sparkles, MessageSquare, ArrowRight, ShieldAlert, ClipboardList, Compass, Clock, Users, LayoutDashboard, User } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { IS_PE_SEASON, ROHAN_DESAI_VOLUNTEER } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";


const DashboardView = () => {
  const { user: authUser } = useAuth();
  // When a corporate SPOC views the volunteer dashboard, use their volunteer persona
  const user = authUser?.role === "corporate_spoc" ? ROHAN_DESAI_VOLUNTEER : authUser;
  const navigate = useAppNavigate();
  const { projectStatus, setProjectStatus, isDRActive, setDrResponses, hasSubmittedAvailability, setHasSubmittedAvailability, drDeploymentLog, isDRClosed, triggerToast } = useAppContext();
  const [appTab, setAppTab] = useState<"current" | "past">("current");
  const [activeSidebarItem, setActiveSidebarItem] = useState("Activity");

  const sidebarItems = [
    { label: "Activity", icon: LayoutDashboard, anchor: "#vol-section-activity" },
    ...(IS_PE_SEASON ? [{ label: "Explore", icon: Compass, anchor: "#vol-section-explore" }] : []),
    { label: "History", icon: Clock, anchor: "#vol-section-history" },
    { label: "Profile", icon: User, anchor: null as string | null },
  ];

  const handleSidebarClick = (item: typeof sidebarItems[0]) => {
    if (item.label === "Profile") {
      navigate("profile");
      return;
    }
    setActiveSidebarItem(item.label);
    if (item.anchor) {
      const el = document.querySelector(item.anchor);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="pt-20 pb-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 min-h-screen">
      {/* ═══ SIDEBAR ═══ */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-20 h-[calc(100vh-80px)] w-56 bg-white border-r border-slate-100 p-4 z-30">
        {/* Identity card */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-full bg-tata-blue text-white flex items-center justify-center font-bold text-sm shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-slate-400">Tata Employee</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {sidebarItems.map((item) => {
            const isActive = activeSidebarItem === item.label && item.label !== "Profile";
            return (
              <button
                key={item.label}
                onClick={() => handleSidebarClick(item)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                  isActive
                    ? "border-l-2 border-tata-cyan text-tata-blue bg-cyan-50/50"
                    : "text-slate-500 hover:bg-slate-50 border-l-2 border-transparent"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="lg:ml-56 max-w-7xl mx-auto px-6 md:px-12">
        {/* Disaster Response Feedback Form */}
        {isDRClosed && hasSubmittedAvailability && drDeploymentLog.some(log => log.volunteers.some((v: any) => v.email === user.email)) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-8 bg-tata-blue rounded-3xl shadow-2xl shadow-tata-blue/20 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Deployment Feedback</h3>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Assam Flood Relief 2026</p>
                </div>
              </div>
              <p className="text-sm text-white/80 mb-8 max-w-xl">The disaster response mission has concluded. Your feedback is vital to improving our emergency protocols. Please take 2 minutes to share your field experience.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    triggerToast("Thank you for your feedback!");
                    setHasSubmittedAvailability(false);
                  }}
                  className="px-8 py-4 bg-tata-cyan text-tata-blue rounded-2xl font-semibold text-xs uppercase tracking-widest hover:bg-white transition-all cursor-pointer"
                >
                  Complete Feedback Form
                </button>
                <button 
                  onClick={() => setHasSubmittedAvailability(false)}
                  className="px-8 py-4 bg-white/10 text-white rounded-2xl font-semibold text-xs uppercase tracking-widest hover:bg-white/20 transition-all cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Disaster Response Notification Banner */}
        {isDRActive && !hasSubmittedAvailability && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-red-600 rounded-3xl shadow-2xl shadow-red-600/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 animate-pulse">
                <ShieldAlert size={32} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2 py-0.5 bg-white text-red-600 text-xs font-semibold uppercase rounded tracking-widest">Emergency Alert</span>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Assam Flood Relief: Volunteer Call</h3>
                </div>
                <p className="text-white/80 text-sm font-medium">Urgent deployment needed for on-ground relief operations. Please share your availability.</p>
              </div>
            </div>
            <button 
              onClick={() => navigate("dr-availability-form")}
              className="px-8 py-4 bg-white text-red-600 rounded-2xl font-semibold text-xs uppercase tracking-widest shadow-xl hover:bg-slate-50 transition-all relative z-10 cursor-pointer"
            >
              Submit Availability
            </button>
          </motion.div>
        )}

        {/* Post-Submission Status */}
        {isDRActive && hasSubmittedAvailability && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-green-50 border border-green-100 rounded-3xl flex items-center justify-between gap-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500 text-white flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-green-900 uppercase text-xs tracking-widest">Availability Submitted</h3>
                <p className="text-sm text-green-700">You are registered for the Assam Flood Relief. Reference ID: <span className="font-mono font-bold">DR-2026-AF-0842</span></p>
              </div>
            </div>
            <button 
              onClick={() => {
                setHasSubmittedAvailability(false);
                setDrResponses(prev => prev.filter(r => r.email !== user.email));
                triggerToast("Availability withdrawn successfully.");
              }}
              className="text-xs font-semibold text-red-600 uppercase tracking-widest hover:underline cursor-pointer"
            >
              Withdraw Availability
            </button>
          </motion.div>
        )}


        {/* Match Banner */}
        {projectStatus === "matched" && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-green-50 border border-green-100 rounded-3xl flex items-center gap-6 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-green-500 text-white flex items-center justify-center shrink-0">
              <Sparkles size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-green-900">You've been matched!</h3>
              <p className="text-sm text-green-700">Pratham NGO has selected you for <span className="font-bold">Financial Literacy for Rural Women</span>. Check your email for next steps.</p>
            </div>
            <button 
              onClick={() => setProjectStatus("active")}
              className="btn-black py-2 px-6 text-xs cursor-pointer"
            >
              Start Project
            </button>
          </motion.div>
        )}

        {/* In-System Notifications */}
        <div className="mb-10 bg-white border border-zinc-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              <div className="w-1 h-5 bg-tata-blue rounded-full mr-3" />
              Activity
            </h3>
            <button className="text-xs font-semibold text-tata-blue uppercase tracking-widest hover:underline">Mark all as read</button>
          </div>
          <div className="space-y-3">
            {isDRActive && (
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="p-4 bg-white rounded-2xl border-l-4 border-l-red-600 border-slate-100 shadow-sm flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <ShieldAlert size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Urgent: Assam Flood Relief Volunteer Call</p>
                    <p className="text-xs text-slate-500">Tata Group is mobilizing for emergency relief. Your skills are needed.</p>
                  </div>
                </div>
                <button onClick={() => navigate("dr-availability-form")} className="p-2 text-slate-400 hover:text-tata-blue hover:bg-slate-50 rounded-lg transition-all">
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            )}
            <div className="p-4 bg-white rounded-2xl border-l-4 border-l-tata-blue border-slate-100 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-tata-blue flex items-center justify-center">
                  <Award size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Certificate Issued: Digital Literacy</p>
                  <p className="text-xs text-slate-500">Your certificate for the Digital Literacy project is now available for download.</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-tata-blue hover:bg-slate-50 rounded-lg transition-all">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ═══ Panels A + B side by side ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Panel A — Your Activity */}
          <div className="bg-gradient-to-br from-tata-blue to-[#0057ff] rounded-3xl p-8 shadow-sm">
            <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Overview</p>
            <h2 className="text-xl font-black text-white tracking-tight mb-6">Your Activity</h2>

            {IS_PE_SEASON ? (
              <div className="space-y-4">
                {user.activeApplication?.status === "Matched" && (
                  <div className="w-full p-6 bg-white/15 border border-white/20 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{user.activeApplication.title}</h4>
                        <p className="text-xs text-white/70 mt-1">{user.activeApplication.ngo}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">Matched</span>
                    </div>
                    <button
                      onClick={() => navigate("active-project-management")}
                      className="mt-4 text-sm font-bold text-white/80 hover:text-white cursor-pointer flex items-center gap-1"
                    >
                      View project → <ArrowRight size={14} />
                    </button>
                  </div>
                )}
                <div className="w-full p-6 bg-white/15 border border-white/20 rounded-2xl">
                  <h4 className="text-sm font-bold text-white mb-1">ProEngage is open</h4>
                  <p className="text-xs text-white/70 mb-4">Find projects matched to your skills</p>
                  <button
                    onClick={() => navigate("proengage")}
                    className="px-5 py-2 bg-white text-tata-blue text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    Browse projects <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-5 bg-white/15 border border-white/20 rounded-2xl">
                  <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Volunteering</p>
                  <p className="text-sm text-white/80">Explore past TVW events and stay ready for the next edition.</p>
                </div>
              </div>
            )}
          </div>

          {/* Panel B — Your Impact */}
          <div className="bg-slate-50 border-l-4 border-tata-cyan rounded-2xl p-8 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Stats</p>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Your Impact</h2>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Hours volunteered</p>
                <p className="text-3xl font-black text-tata-blue">48h</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Projects</p>
                <p className="text-3xl font-black text-tata-blue">{user.history?.length ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Referrals</p>
                <p className="text-3xl font-black text-tata-blue">1</p>
              </div>
            </div>
            {user.city && (
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <MapPin size={12} /> {user.city} · {user.company}
              </div>
            )}
            {user.skills && user.skills.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.skills.map((s: string) => (
                    <span key={s} className="bg-tata-blue/10 text-tata-blue text-xs font-semibold px-2.5 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {user.interests && user.interests.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Interests</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.interests.map((interest: string) => (
                    <span key={interest} className="bg-tata-cyan/10 text-tata-blue text-xs font-semibold px-2.5 py-1 rounded-full">{interest}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {user.preferredMode && (
                <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full">{user.preferredMode} mode</span>
              )}
              {user.disasterResponseInterest && (
                <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">DR Ready</span>
              )}
            </div>
            <div className="border-t border-slate-200 mt-6 pt-4">
              <button onClick={() => navigate("profile")} className="text-xs font-semibold text-tata-blue hover:underline cursor-pointer">
                Edit profile →
              </button>
            </div>
          </div>
        </div>

        {/* ═══ SPOC Card ═══ */}
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Users size={12} /> Your SPOC</p>
        <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-5 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-tata-blue/10 text-tata-blue font-bold text-sm flex items-center justify-center flex-shrink-0">RD</div>
            <div>
              <p className="font-semibold text-sm text-slate-900">Rohan Desai</p>
              <p className="text-xs text-slate-500">Corporate SPOC · Tata Consultancy Services</p>
              <p className="text-xs text-slate-400 mt-0.5">Your point of contact for volunteering</p>
            </div>
          </div>
          <button onClick={() => triggerToast("Message sent to Rohan Desai. He'll respond within 24 hours.")} className="text-sm text-tata-blue font-semibold border border-tata-blue/30 rounded-lg px-4 py-2 hover:bg-tata-blue/5 cursor-pointer transition-colors">Contact SPOC</button>
        </div>

        {/* ═══ SECTION: Explore ═══ */}
        {IS_PE_SEASON && (
          <>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Discover</p>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8 flex items-center gap-2"><Compass size={16} /> Explore</h2>

            <div className="space-y-8 mb-12">
              <section className="bg-violet-50 rounded-3xl p-8 shadow-sm border border-violet-100">
                <div className="flex items-center gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-bold">🤖 AI Picks</span>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recommended for you</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Digital Literacy for Seniors", org: "HelpAge India", match: "98% Match", skillArea: "Education", location: "Delhi", applicantCount: 25, isNew: false },
                    { title: "Sustainability Audit", org: "Green Earth NGO", match: "92% Match", skillArea: "Finance", location: "Pune", applicantCount: 10, isNew: false },
                    { title: "Career Mentorship", org: "Udaan Foundation", match: "85% Match", skillArea: "Strategic Planning", location: "Mumbai", applicantCount: 8, isNew: true }
                  ].map((item, i) => {
                    const chip = user.skills?.some((s: string) => s.toLowerCase() === item.skillArea.toLowerCase())
                      ? `Matches your ${item.skillArea} skills`
                      : item.location === user.city
                        ? `Near you · ${item.location}`
                        : item.applicantCount > 20
                          ? "Trending this edition"
                          : item.isNew
                            ? "New NGO partner"
                            : "Recommended for you";

                    return (
                      <div key={i} className="bg-white border-l-4 border-violet-400 border border-slate-100 rounded-2xl p-4 hover:shadow-sm transition-all cursor-pointer group relative">
                        <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 text-[10px] font-bold">🤖 AI</span>
                        <div className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-2">{item.match}</div>
                        <h4 className="font-bold text-sm mb-1 group-hover:text-tata-blue transition-colors">{item.title}</h4>
                        <p className="text-xs text-slate-500 mb-2">{item.org}</p>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs">
                          {chip}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </>
        )}


        {/* ═══ SECTION: Your history ═══ */}
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Timeline</p>
        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8 flex items-center gap-2"><Clock size={16} /> Your History</h2>

        <div className="space-y-8 mb-12">
          {/* Application Tabs */}
          <section>
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-6">
              <button
                onClick={() => setAppTab("current")}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-widest cursor-pointer ${appTab === "current" ? "bg-white text-tata-blue rounded-lg shadow-sm" : "text-slate-400"}`}
              >
                Current
              </button>
              <button
                onClick={() => setAppTab("past")}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-widest cursor-pointer ${appTab === "past" ? "bg-white text-tata-blue rounded-lg shadow-sm" : "text-slate-400"}`}
              >
                Past
              </button>
            </div>

            {appTab === "current" && user.activeApplication ? (
              <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{user.activeApplication.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{user.activeApplication.ngo}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Calendar size={12} /> {user.activeApplication.date}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    user.activeApplication.status === "Matched" ? "bg-green-100 text-green-700" :
                    user.activeApplication.status === "Rejected" ? "bg-red-100 text-red-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {user.activeApplication.status}
                  </span>
                </div>
                <div className="border-t border-zinc-100 mt-4 pt-4">
                  <button onClick={() => navigate("active-project-management")} className="text-sm text-tata-blue font-semibold hover:underline cursor-pointer">
                    View project →
                  </button>
                </div>
              </div>
            ) : appTab === "current" ? (
              <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm text-center py-12">
                <ClipboardList size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No active application</p>
              </div>
            ) : (
              <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">After-School Coding Club</h4>
                    <p className="text-sm text-slate-500 mt-1">Teach For India</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Calendar size={12} /> March 28, 2026</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-700">Rejected</span>
                </div>
                <div className="border-t border-zinc-100 mt-4 pt-4">
                  <p className="text-xs text-slate-400 italic">Project filled before your application was reviewed</p>
                </div>
              </div>
            )}
          </section>

          {/* Earned Badges */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Recognition</p>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Earned Badges</h2>
            <div className="flex flex-wrap gap-4">
              {(user?.badges ?? []).map((badge: any) => (
                <div key={badge.id} className="group relative">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl hover:scale-110 hover:ring-2 hover:ring-tata-blue/30 hover:bg-tata-blue/5 transition-all cursor-pointer border border-slate-100">
                    {badge.icon}
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-zinc-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    {badge.name} • {badge.date}
                  </div>
                </div>
              ))}
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-tata-cyan hover:text-tata-cyan transition-colors cursor-pointer">
                <Award size={24} />
              </div>
            </div>
          </section>
        </div>

      </div>

      {/* ═══ Refer a Colleague ═══ */}
      <div className="bg-slate-50 border-t border-slate-200 py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Know someone who'd love to volunteer?</h3>
            <p className="text-xs text-slate-500 mt-1">Refer a Tata colleague and grow the community.</p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText("https://tatavolunteers.org/join?ref=" + user.email);
              toast({ title: "Referral link copied!", description: "Share it with your colleagues." });
            }}
            className="px-5 py-2.5 bg-tata-blue text-white text-sm font-semibold rounded-lg hover:bg-tata-blue/90 transition-colors cursor-pointer"
          >
            Copy referral link
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
