import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Building2, Heart, CheckCircle2, Search, Globe, Calendar, MapPin, Award, Sparkles, MessageSquare, ArrowRight, ShieldAlert, ClipboardList, Activity, Compass, Clock } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { IS_PE_SEASON, TVW_EVENTS } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";


const DashboardView = () => {
  const { user } = useAuth();
  const navigate = useAppNavigate();
  const { projectStatus, setProjectStatus, showPulseCheck, setShowPulseCheck, pulseCheckSubmitted, setPulseCheckSubmitted, setShowFeedbackForm, isDRActive, setDrResponses, hasSubmittedAvailability, setHasSubmittedAvailability, drDeploymentLog, isDRClosed, triggerToast } = useAppContext();
  const [pulseText, setPulseText] = useState("");
  const [appTab, setAppTab] = useState<"current" | "past">("current");
  const firstTvwEvent = TVW_EVENTS[0];

  const handlePulseSubmit = () => {
    setPulseCheckSubmitted(true);
    triggerToast("Your thoughts have been saved — only visible to you");
    setTimeout(() => setShowPulseCheck(false), 2000);
  };


  return (
    <div className="pt-20 pb-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
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
            <h3 className="text-white font-bold text-lg mb-6">Your Activity</h3>

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
                {firstTvwEvent && (
                  <div className="p-5 bg-white/15 border border-white/20 rounded-2xl">
                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">TVW Vibe</p>
                    <h4 className="text-sm font-bold text-white">{firstTvwEvent.title}</h4>
                    <p className="text-xs text-white/60 mt-1 flex items-center gap-1"><MapPin size={12} /> {firstTvwEvent.location}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Panel B — Your Impact */}
          <div className="bg-slate-50 border-l-4 border-tata-cyan rounded-2xl p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-6">Your Impact</h3>
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
            <div className="border-t border-slate-200 mt-6 pt-4">
              <button onClick={() => navigate("profile")} className="text-xs font-semibold text-tata-blue hover:underline cursor-pointer">
                View full profile →
              </button>
            </div>
          </div>
        </div>

        {/* ═══ SECTION: Active programmes ═══ */}
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-[0.08em] mb-6 flex items-center gap-2"><div className="w-1 h-5 bg-tata-blue rounded-full mr-1" /><Activity size={16} /> Active programmes</h3>

        <div className="space-y-8 mb-12">
          {/* Active Application */}
          {user.activeApplication && (
          <section className="bg-tata-blue rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Your Active Application</h2>
                  <p className="text-white/60 text-sm">Track your current volunteering status</p>
                </div>
                <span className={`px-4 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                  projectStatus === "matched" || projectStatus === "active" ? "bg-green-500 text-white" : "bg-white/20"
                }`}>
                  {projectStatus === "matched" ? "Matched 🎉" : projectStatus === "active" ? "Active 🚀" : "Completed ✅"}
                </span>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/10">
                <h3 className="text-lg font-bold mb-2">{user.activeApplication.title}</h3>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <div className="flex items-center gap-1"><Calendar size={14} /> {user.activeApplication.date}</div>
                    <div className="flex items-center gap-1"><Building2 size={14} /> {user.activeApplication.ngo}</div>
                  </div>
                  {projectStatus === "matched" && (
                    <button className="bg-white text-tata-blue px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
                      Access Orientation Materials <ArrowRight size={14} />
                    </button>
                  )}
                  {projectStatus === "active" && (
                    <button 
                      onClick={() => {
                        setProjectStatus("completed");
                        setShowFeedbackForm(true);
                      }}
                      className="bg-tata-cyan text-tata-blue px-4 py-2 rounded-lg text-xs font-bold hover:bg-tata-cyan/90 transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
          )}

          {/* Pulse Check */}
          {projectStatus === "active" && showPulseCheck && (
            <motion.section 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-tata-purple/10 flex items-center justify-center text-tata-purple">
                  <Heart size={20} />
                </div>
                <h3 className="font-bold text-zinc-900">What's on your mind?</h3>
              </div>
              {pulseCheckSubmitted ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="mx-auto text-green-500 mb-2" size={32} />
                  <p className="text-sm text-slate-500">Your thoughts have been saved — only visible to you</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500">How is your project going? Share your thoughts privately.</p>
                  <textarea 
                    value={pulseText}
                    onChange={(e) => setPulseText(e.target.value)}
                    placeholder="Share your experience so far..."
                    className="w-full h-24 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-tata-blue/20 resize-none"
                  />
                  <button 
                    onClick={handlePulseSubmit}
                    disabled={!pulseText.trim()}
                    className="btn-black py-3 px-8 text-sm cursor-pointer disabled:opacity-50"
                  >
                    Save Thoughts
                  </button>
                </div>
              )}
            </motion.section>
          )}
        </div>

        {/* ═══ SECTION: Explore ═══ */}
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-[0.08em] mb-6 flex items-center gap-2"><div className="w-1 h-5 bg-tata-blue rounded-full mr-1" /><Compass size={16} /> Explore</h3>

        <div className="space-y-8 mb-12">
          {/* AI Recommendations — PE season only */}
          {IS_PE_SEASON && (
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-tata-cyan/10 flex items-center justify-center text-tata-cyan">
                  <Search size={18} />
                </div>
                <h2 className="text-xl font-bold text-zinc-900">AI Recommended For You</h2>
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
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-tata-cyan transition-colors cursor-pointer group">
                      <div className="text-xs font-bold text-tata-cyan uppercase tracking-widest mb-2">{item.match}</div>
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
          )}

          {/* TVW Section */}
          {!IS_PE_SEASON ? (
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-zinc-900">Upcoming TVW Events</h2>
                <button onClick={() => navigate("tvw")} className="text-sm font-bold text-tata-blue hover:underline cursor-pointer">View Calendar</button>
              </div>
              <div className="space-y-4">
                {[
                  { title: "Global Tree Plantation Day", date: "April 15, 2026", loc: "Mumbai Hub", type: "On-field" },
                  { title: "Virtual Mentoring Kickoff", date: "April 18, 2026", loc: "Online", type: "Virtual" }
                ].map((event, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-zinc-100 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-50 flex flex-col items-center justify-center text-tata-blue">
                        <span className="text-xs font-bold uppercase">{event.date.split(' ')[0]}</span>
                        <span className="text-lg font-bold">{event.date.split(' ')[1].replace(',', '')}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900">{event.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1"><MapPin size={12} /> {event.loc}</span>
                          <span className="flex items-center gap-1"><Globe size={12} /> {event.type}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-300" />
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="bg-slate-100 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-zinc-700 mb-1">TVW 2024 highlights</h3>
                <p className="text-sm text-zinc-500">View photos and stories from the last edition</p>
              </div>
              <button onClick={() => navigate("tvw")} className="text-sm font-bold text-tata-blue hover:underline cursor-pointer flex items-center gap-1">
                View highlights <ChevronRight size={16} />
              </button>
            </section>
          )}
        </div>


        {/* ═══ SECTION: Your history ═══ */}
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-[0.08em] mb-6 flex items-center gap-2"><div className="w-1 h-5 bg-tata-blue rounded-full mr-1" /><Clock size={16} /> Your history</h3>

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
            <h2 className="text-xl font-bold text-zinc-900 mb-6">Earned Badges</h2>
            <div className="flex flex-wrap gap-4">
              {user.badges.map((badge: any) => (
                <div key={badge.id} className="group relative">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl hover:scale-110 transition-transform cursor-pointer border border-slate-100">
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
