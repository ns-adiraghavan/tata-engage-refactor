import { useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, Award, Info, Star, Save, History, Download, X, Plus } from "lucide-react";
import type { View } from "@/types";
import { MOCK_FAMILY_MEMBERS } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

const TagInput = ({ tags, onChange, placeholder, disabled }: { tags: string[]; onChange: (t: string[]) => void; placeholder?: string; disabled?: boolean }) => {
  const [input, setInput] = useState("");
  const addTag = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) { onChange([...tags, val]); }
    setInput("");
  };
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {tags.map(tag => (
        <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
          {tag}
          {!disabled && (
            <button type="button" onClick={() => onChange(tags.filter(t => t !== tag))} className="text-slate-400 hover:text-red-500 cursor-pointer"><X size={12} /></button>
          )}
        </span>
      ))}
      {!disabled && (
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
          onBlur={addTag}
          placeholder={placeholder}
          className="text-sm py-1 px-2 border-b border-slate-200 focus:border-tata-blue outline-none min-w-[120px]"
        />
      )}
    </div>
  );
};

const ProfileView = () => {
  const { user, setUser, userRole } = useAuth();
  const { projectStatus, feedbackSubmitted, supportHistory, ngoData, triggerToast } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(userRole === 'ngo' ? {
    firstName: "Anjali",
    lastName: "Mehta",
    email: "anjali.mehta@pratham.org",
    designation: "Program Director",
    company: "Pratham NGO"
  } : {
    ...user,
    languages: user.languages || ["English", "Hindi", "Marathi"],
    linkedinUrl: user.linkedinUrl || "",
    disasterResponseInterest: user.disasterResponseInterest ?? true,
    preferredMode: user.preferredMode || "Either",
    notifyProEngage: user.notifyProEngage ?? true,
    notifyTVW: user.notifyTVW ?? true,
  });
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');

  const handleSave = () => {
    if (userRole !== 'ngo') setUser(profileData as any);
    setIsEditing(false);
    triggerToast("Profile updated successfully!");
  };

  const shareToLinkedIn = () => {
    const text = `Proud to have volunteered with Pratham NGO on the Financial Literacy for Rural Women project through Tata Engage! #TataEngage #BeTheChange`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="pt-28 pb-20 px-6 md:px-12 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-tata-blue text-white flex items-center justify-center text-3xl font-bold shadow-xl">
              {profileData.firstName[0]}{profileData.lastName[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900">{profileData.firstName} {profileData.lastName}</h1>
              <p className="text-slate-500">{profileData.designation} at {profileData.company}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 rounded bg-tata-blue/10 text-tata-blue text-xs font-bold uppercase tracking-wider">
                  {userRole === 'ngo' ? 'NGO Partner' : 'Tata Employee'}
                </span>
                <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">Verified</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`btn-${isEditing ? 'black' : 'outline'} py-2 px-8 cursor-pointer`}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
        </div>

        {userRole === 'ngo' && (
          <div className="flex gap-8 border-b border-slate-100 mb-8">
            <button 
              onClick={() => setActiveTab('info')}
              className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'info' ? 'text-tata-blue' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Profile Info
              {activeTab === 'info' && <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-tata-blue" />}
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'history' ? 'text-tata-blue' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Support History
              {activeTab === 'history' && <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-tata-blue" />}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {activeTab === 'info' ? (
              <>
                {/* Personal Info — locked fields */}
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">First Name</label>
                        <div className="py-2 text-zinc-900 border-b border-zinc-50 font-medium">{profileData.firstName}</div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Last Name</label>
                        <div className="py-2 text-zinc-900 border-b border-zinc-50 font-medium">{profileData.lastName}</div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                      <div className="py-2 text-zinc-900 border-b border-zinc-50 font-medium">{profileData.email}</div>
                    </div>
                    {isEditing && (
                      <p className="text-xs text-slate-400 italic">Name and email are locked. Contact Admin to update.</p>
                    )}
                  </div>
                </section>

                {/* Professional Details */}
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">Professional Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Designation</label>
                        {isEditing ? (
                          <input type="text" value={profileData.designation} onChange={(e) => setProfileData({...profileData, designation: e.target.value})} className="w-full py-2 border-b border-tata-blue focus:outline-none font-medium" />
                        ) : (
                          <div className="py-2 text-zinc-900 border-b border-zinc-50 font-medium">{profileData.designation}</div>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Organization</label>
                        {isEditing ? (
                          <input type="text" value={profileData.company} onChange={(e) => setProfileData({...profileData, company: e.target.value})} className="w-full py-2 border-b border-tata-blue focus:outline-none font-medium" />
                        ) : (
                          <div className="py-2 text-zinc-900 border-b border-zinc-50 font-medium">{profileData.company}</div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">City</label>
                        {isEditing ? (
                          <input type="text" value={profileData.city || ""} onChange={(e) => setProfileData({...profileData, city: e.target.value})} className="w-full py-2 border-b border-tata-blue focus:outline-none font-medium" />
                        ) : (
                          <div className="py-2 text-zinc-900 border-b border-zinc-50 font-medium">{profileData.city || "—"}</div>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">LinkedIn Profile</label>
                        {isEditing ? (
                          <input type="url" value={profileData.linkedinUrl || ""} onChange={(e) => setProfileData({...profileData, linkedinUrl: e.target.value})} placeholder="https://linkedin.com/in/..." className="w-full py-2 border-b border-tata-blue focus:outline-none font-medium" />
                        ) : (
                          <div className="py-2 text-zinc-900 border-b border-zinc-50 font-medium">{profileData.linkedinUrl || "—"}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Volunteering Preferences */}
                {userRole !== 'ngo' && (
                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">Volunteering Preferences</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Skills</label>
                        <TagInput tags={profileData.skills || []} onChange={(t) => setProfileData({...profileData, skills: t})} placeholder="Add skill…" disabled={!isEditing} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Areas of Interest</label>
                        <TagInput tags={profileData.interests || []} onChange={(t) => setProfileData({...profileData, interests: t})} placeholder="Add interest…" disabled={!isEditing} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Languages Spoken</label>
                        <TagInput tags={profileData.languages || []} onChange={(t) => setProfileData({...profileData, languages: t})} placeholder="Add language…" disabled={!isEditing} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Preferred Volunteering Mode</label>
                        <div className="flex gap-4">
                          {["Remote", "In-Person", "Either"].map(mode => (
                            <label key={mode} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="preferredMode"
                                value={mode}
                                checked={profileData.preferredMode === mode}
                                onChange={() => isEditing && setProfileData({...profileData, preferredMode: mode})}
                                disabled={!isEditing}
                                className="accent-tata-blue"
                              />
                              <span className="text-sm font-medium text-slate-700">{mode}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-slate-50">
                        <span className="text-sm font-medium text-slate-700">Available for disaster response volunteering</span>
                        <button
                          type="button"
                          onClick={() => isEditing && setProfileData({...profileData, disasterResponseInterest: !profileData.disasterResponseInterest})}
                          className={`w-11 h-6 rounded-full relative transition-colors ${profileData.disasterResponseInterest ? 'bg-tata-blue' : 'bg-slate-300'} ${!isEditing ? 'opacity-60' : 'cursor-pointer'}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${profileData.disasterResponseInterest ? 'translate-x-5' : ''}`} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase block">Notification Preferences</label>
                        <div className="flex items-center justify-between py-3 border-b border-slate-50">
                          <span className="text-sm font-medium text-slate-700">Email me about new ProEngage projects</span>
                          <button
                            type="button"
                            onClick={() => isEditing && setProfileData({...profileData, notifyProEngage: !profileData.notifyProEngage})}
                            className={`w-11 h-6 rounded-full relative transition-colors ${profileData.notifyProEngage ? 'bg-tata-blue' : 'bg-slate-300'} ${!isEditing ? 'opacity-60' : 'cursor-pointer'}`}
                          >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${profileData.notifyProEngage ? 'translate-x-5' : ''}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-slate-50">
                          <span className="text-sm font-medium text-slate-700">Email me about TVW events in my city</span>
                          <button
                            type="button"
                            onClick={() => isEditing && setProfileData({...profileData, notifyTVW: !profileData.notifyTVW})}
                            className={`w-11 h-6 rounded-full relative transition-colors ${profileData.notifyTVW ? 'bg-tata-blue' : 'bg-slate-300'} ${!isEditing ? 'opacity-60' : 'cursor-pointer'}`}
                          >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${profileData.notifyTVW ? 'translate-x-5' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {userRole !== 'ngo' && (
                  <>
                    {/* Badge Wall */}
                    <section>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">Badge Wall</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {user.badges.map((badge, i) => (
                          <motion.div 
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all"
                          >
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                              {badge.icon}
                            </div>
                            <h4 className="text-xs font-bold text-zinc-900 mb-1">{badge.name}</h4>
                            <p className="text-xs text-slate-400 font-medium uppercase">{badge.date}</p>
                          </motion.div>
                        ))}
                        {feedbackSubmitted && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 rounded-3xl bg-tata-cyan/5 border border-tata-cyan/20 flex flex-col items-center text-center relative overflow-hidden"
                          >
                            <motion.div 
                              animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 bg-tata-cyan/10"
                            />
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl mb-4 z-10">
                              ⭐
                            </div>
                            <h4 className="text-xs font-bold text-tata-cyan mb-1 z-10">Feedback Star</h4>
                            <p className="text-xs text-tata-cyan/60 font-medium uppercase z-10">April 2026</p>
                          </motion.div>
                        )}
                      </div>
                    </section>

                    {/* Certificates */}
                    {projectStatus === "completed" && (
                      <section>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">Completion Certificates</h3>
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative bg-zinc-900 rounded-3xl p-10 text-white overflow-hidden shadow-2xl"
                        >
                          <div className="absolute top-0 right-0 w-64 h-64 bg-tata-cyan/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                          <div className="absolute bottom-0 left-0 w-64 h-64 bg-tata-purple/10 rounded-full -ml-32 -mb-32 blur-3xl" />
                          
                          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                            <div className="w-48 h-64 bg-white rounded-2xl shadow-2xl flex flex-col p-4 text-zinc-900 shrink-0">
                              <div className="text-[10px] font-bold text-tata-blue mb-4">TATA ENGAGE</div>
                              <div className="flex-1 flex flex-col items-center justify-center text-center">
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                  <Award size={24} className="text-tata-blue" />
                                </div>
                                <div className="text-xs font-bold mb-1">CERTIFICATE OF COMPLETION</div>
                                <div className="text-[10px] text-slate-400 mb-4">PROENGAGE EDITION 2025</div>
                                <div className="text-[12px] font-bold text-tata-blue mb-1">{user.firstName} {user.lastName}</div>
                                <div className="text-[6px] text-slate-500 max-w-[100px]">For outstanding contribution to the Financial Literacy project.</div>
                              </div>
                              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-end">
                                <div className="text-[6px] font-bold">PRATHAM NGO</div>
                                <div className="w-8 h-8 bg-slate-100 rounded" />
                              </div>
                            </div>
                            <div>
                              <h4 className="text-2xl font-bold mb-4">Your Impact, Certified.</h4>
                              <p className="text-slate-400 text-sm mb-8 leading-relaxed">This certificate recognizes your commitment to social change and your contribution to the Tata Engage ecosystem.</p>
                              <div className="flex flex-wrap gap-4">
                                <button className="bg-white text-zinc-900 py-3 px-8 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-tata-cyan transition-all cursor-pointer">
                                  <Download size={18} /> Download PDF
                                </button>
                                <button onClick={shareToLinkedIn} className="bg-white/10 hover:bg-white/20 text-white py-3 px-8 rounded-lg font-bold text-sm flex items-center gap-2 transition-all cursor-pointer">
                                  <Linkedin size={18} /> Share to LinkedIn
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </section>
                    )}
                  </>
                )}
              </>
            ) : (
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">Support Interaction History</h3>
                <div className="space-y-4">
                  {supportHistory.length > 0 ? (
                    supportHistory.map((log) => (
                      <motion.div 
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-tata-blue bg-tata-blue/10 px-2 py-0.5 rounded uppercase tracking-wider">AI Assistant</span>
                            <span className="text-xs text-slate-400 font-medium">{log.timestamp}</span>
                          </div>
                          <h4 className="font-bold text-zinc-900 text-sm">Query: {log.query}</h4>
                          <p className="text-xs text-slate-500 italic">Summary: {log.summary}</p>
                        </div>
                        <div className="flex items-center">
                          <button className="text-xs font-bold text-tata-blue hover:underline cursor-pointer">View Full Transcript</button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <History size={32} />
                      </div>
                      <p className="text-slate-400 font-medium">No support history found.</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-12">
            {/* Stats/Sidebar */}
            {userRole === 'ngo' ? (
              <section className="p-8 bg-zinc-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-tata-blue/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-8">Organization Stats</h3>
                <div className="space-y-8">
                  <div>
                    <div className="text-3xl font-bold mb-1">{ngoData.projects.length}</div>
                    <div className="text-xs text-white/60 font-bold uppercase tracking-wider">Total Projects</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">{ngoData.volunteers}</div>
                    <div className="text-xs text-white/60 font-bold uppercase tracking-wider">Volunteers Engaged</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">{ngoData.tier}</div>
                    <div className="text-xs text-white/60 font-bold uppercase tracking-wider">NGO Tier Status</div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="p-8 bg-zinc-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-tata-blue/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-8">Engagement Stats</h3>
                <div className="space-y-8">
                  <div>
                    <div className="text-3xl font-bold mb-1">128</div>
                    <div className="text-xs text-white/60 font-bold uppercase tracking-wider">Volunteering Hours</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">4</div>
                    <div className="text-xs text-white/60 font-bold uppercase tracking-wider">Projects Completed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">2,450</div>
                    <div className="text-xs text-white/60 font-bold uppercase tracking-wider">Impact Points</div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* ═══ Your SPOC ═══ */}
        <div className="mt-12">
          <h3 className="text-[13px] uppercase text-muted-foreground tracking-[0.08em] font-semibold mb-4 flex items-center">
            <div className="w-1 h-5 bg-tata-blue rounded-full mr-3" />
            Your SPOC
          </h3>
          <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-tata-blue/10 text-tata-blue font-bold flex items-center justify-center">
                RD
              </div>
              <div>
                <p className="font-semibold text-slate-900">Rohan Desai</p>
                <p className="text-sm text-slate-500">Corporate SPOC · Tata Consultancy Services</p>
                <p className="text-xs text-slate-400 mt-1">Covers your region and company volunteering</p>
              </div>
            </div>
            <button
              onClick={() => triggerToast("Message sent to Rohan Desai. He'll respond within 24 hours.")}
              className="text-sm text-tata-blue font-semibold border border-tata-blue/30 rounded-lg px-4 py-2 hover:bg-tata-blue/5 cursor-pointer"
            >
              Contact SPOC
            </button>
          </div>
        </div>

        {/* ═══ Family Members ═══ */}
        <div className="mt-12">
          <h3 className="text-[13px] uppercase text-muted-foreground tracking-[0.08em] font-semibold mb-4 flex items-center">
            <div className="w-1 h-5 bg-tata-blue rounded-full mr-3" />
            Family Members registered under you
          </h3>
          <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-5">
            {MOCK_FAMILY_MEMBERS.map((member, i) => (
              <div key={member.id} className={`flex justify-between items-center py-3 ${i < MOCK_FAMILY_MEMBERS.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                <div>
                  <p className="font-semibold text-sm text-slate-900">{member.name}</p>
                  <p className="text-xs text-slate-400">{member.relationship}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${member.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {member.status}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => triggerToast("Invite link copied. Share it with your family member to register.")}
            className="mt-3 text-sm text-tata-blue font-semibold cursor-pointer"
          >
            + Invite a family member
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileView;
