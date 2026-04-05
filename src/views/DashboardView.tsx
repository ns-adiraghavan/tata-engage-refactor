import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Building2, Heart, Mail, CheckCircle2, Search, Globe, Calendar, MapPin, Award, FileText, Sparkles, MessageSquare, ArrowRight, ShieldAlert, ClipboardList, Activity, Compass, Clock } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";

const DashboardView = () => {
  const { user } = useAuth();
  const navigate = useAppNavigate();
  const { projectStatus, setProjectStatus, showPulseCheck, setShowPulseCheck, pulseCheckSubmitted, setPulseCheckSubmitted, setShowFeedbackForm, referralCount, isDRActive, setDrResponses, hasSubmittedAvailability, setHasSubmittedAvailability, drDeploymentLog, isDRClosed, triggerToast } = useAppContext();
  const [pulseText, setPulseText] = useState("");
  const isTVWActive = false;
  const isProEngageActive = true;

  const handlePulseSubmit = () => {
    setPulseCheckSubmitted(true);
    triggerToast("Your thoughts have been saved — only visible to you");
    setTimeout(() => setShowPulseCheck(false), 2000);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText("https://tataengage.com/refer/priya123");
    triggerToast("Referral link copied to clipboard!");
  };

  return (
    <div className="pt-28 pb-20 px-6 md:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
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
        <div className="mb-10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Recent Notifications</h3>
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

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-tata-blue">Welcome back, {user.firstName}!</h1>
            <p className="text-slate-500">Here's what's happening in your volunteering journey.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("my-applications")} className="btn-outline py-2 px-6 text-sm cursor-pointer">My Applications</button>
            <button onClick={() => navigate("profile")} className="btn-outline py-2 px-6 text-sm cursor-pointer">View Profile</button>
            <button onClick={() => navigate("disaster-response")} className="btn-outline py-2 px-6 text-sm cursor-pointer flex items-center gap-2">
              <ShieldAlert size={14} className="text-red-600" /> Disaster Response
            </button>
            <button onClick={() => navigate("proengage")} className="btn-black py-2 px-6 text-sm cursor-pointer">Find Projects</button>
          </div>
        </div>

        {/* ProEngage Edition CTA */}
        {isProEngageActive ? (
          user.activeApplication?.status === "Matched" ? (
            <div className="w-full mb-8 p-6 bg-white border border-green-200 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{user.activeApplication.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{user.activeApplication.ngo}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Matched</span>
              </div>
              <button
                onClick={() => navigate("active-project")}
                className="mt-4 text-sm font-bold text-tata-blue hover:underline cursor-pointer flex items-center gap-1"
              >
                View project <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("proengage")}
              className="w-full mb-8 py-4 bg-tata-blue text-white text-sm font-bold rounded-2xl hover:bg-tata-blue/90 transition-colors cursor-pointer"
            >
              Apply to ProEngage projects
            </button>
          )
        ) : (
          <div className="w-full mb-8 p-5 border border-zinc-200 rounded-2xl flex items-center justify-between bg-white">
            <p className="text-sm text-zinc-600">
              Next ProEngage edition coming soon — keep your profile updated to get better matches
            </p>
            <button onClick={() => navigate("profile")} className="text-sm font-bold text-tata-blue hover:underline whitespace-nowrap cursor-pointer flex items-center gap-1">
              Edit profile <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* ═══ SECTION: Active programmes ═══ */}
        <h3 className="text-[13px] uppercase text-muted-foreground tracking-[0.08em] font-semibold mb-4 flex items-center gap-2"><Activity size={16} /> Active programmes</h3>

        <div className="space-y-8 mb-12">
          {/* Active Application */}
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
        <h3 className="text-[13px] uppercase text-muted-foreground tracking-[0.08em] font-semibold mb-4 flex items-center gap-2"><Compass size={16} /> Explore</h3>

        <div className="space-y-8 mb-12">
          {/* AI Recommendations */}
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

          {/* TVW Section */}
          {isTVWActive ? (
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
              <button onClick={() => navigate("tvw-vibe")} className="text-sm font-bold text-tata-blue hover:underline cursor-pointer flex items-center gap-1">
                View highlights <ChevronRight size={16} />
              </button>
            </section>
          )}
        </div>

        {/* ═══ SECTION: Your history ═══ */}
        <h3 className="text-[13px] uppercase text-muted-foreground tracking-[0.08em] font-semibold mb-4 flex items-center gap-2"><Clock size={16} /> Your history</h3>

        <div className="space-y-8 mb-12">
          {/* Application History */}
          {user.history && user.history.length === 0 && (
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 flex flex-col items-center justify-center py-16 text-center">
              <ClipboardList size={40} className="text-slate-300 mb-4" />
              <h4 className="text-[15px] font-medium text-slate-700 mb-1">No applications yet</h4>
              <p className="text-[13px] text-muted-foreground mb-4">Projects you apply to will be tracked here.</p>
              <button
                onClick={() => navigate("proengage")}
                className="px-5 py-2 bg-tata-blue text-white text-sm font-semibold rounded-lg hover:bg-tata-blue/90 transition-colors cursor-pointer"
              >
                Browse projects →
              </button>
            </section>
          )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Earned Badges */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">Earned Badges</h2>
            <div className="flex flex-wrap gap-4">
              {user.badges.map(badge => (
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

          {/* What's New */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">What's New</h2>
            <div className="space-y-6">
              {[
                { title: "New ProEngage projects listed for Q2", time: "2 hours ago" },
                { title: "Tata Steel volunteers reach 50k hours milestone", time: "1 day ago" },
                { title: "Updated Volunteering Policy for 2026", time: "3 days ago" }
              ].map((news, i) => (
                <div key={i} className="border-l-2 border-tata-cyan pl-4 cursor-pointer hover:bg-slate-50 transition-colors py-1">
                  <h4 className="text-sm font-bold text-zinc-900 mb-1">{news.title}</h4>
                  <span className="text-xs text-slate-400 font-medium uppercase">{news.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        </div>

        {/* ═══ SECTION: More (collapsed) ═══ */}
        <details className="mb-8">
          <summary className="text-[13px] uppercase text-muted-foreground tracking-[0.08em] font-semibold cursor-pointer select-none mb-4">More</summary>
          <div className="mt-4">
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 overflow-hidden relative max-w-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-tata-cyan/5 rounded-full -mr-12 -mt-12" />
              <h2 className="text-xl font-bold text-zinc-900 mb-2">Refer a Colleague</h2>
              <p className="text-sm text-slate-500 mb-6">Invite someone to Tata Engage and help grow our community.</p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">Your Referral Link</div>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs text-tata-blue font-mono truncate">tataengage.com/refer/priya123</code>
                  <button onClick={copyReferralLink} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-tata-blue transition-colors">
                    <FileText size={16} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  You've referred <span className="font-bold text-zinc-900">{referralCount} person</span> so far
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-tata-blue hover:text-white transition-all"><Mail size={14} /></button>
                  <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-green-500 hover:text-white transition-all"><MessageSquare size={14} /></button>
                </div>
              </div>
            </section>
          </div>
        </details>
      </div>
    </div>
  );
};

export default DashboardView;
