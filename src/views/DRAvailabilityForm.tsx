import React, { useState } from "react";
import { ArrowLeft, Search, Send, ShieldAlert } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";

const DRAvailabilityForm = () => {
  const { user } = useAuth();
  const navigate = useAppNavigate();
  const { setDrResponses, setHasSubmittedAvailability, triggerToast } = useAppContext();
  const [formData, setFormData] = useState({
    location: "Mumbai, Maharashtra",
    willingToTravel: "Assam, North East India",
    startDate: "2026-04-10",
    endDate: "2026-04-20",
    skills: ["First Aid", "Logistics"],
    travelWillingness: "national",
    medicalNotes: ""
  });

  const availableSkills = ["First Aid", "Logistics", "Search & Rescue", "Medical (Doctor/Nurse)", "Counseling", "Translation", "Driving (Heavy Vehicle)"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newResponse = {
      id: `DR-${Math.floor(Math.random() * 10000)}`,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      company: user.company || "Tata Group",
      location: formData.location,
      willingTo: formData.willingToTravel,
      dates: `${formData.startDate} to ${formData.endDate}`,
      skills: formData.skills,
      travel: formData.travelWillingness,
      timestamp: new Date().toISOString()
    };
    
    setDrResponses(prev => [newResponse, ...prev]);
    setHasSubmittedAvailability(true);
    navigate("dr-confirmation");
    triggerToast("Confirmation email sent to your registered address.");
  };

  return (
    <div className="pt-20 pb-20 px-6 md:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate("dashboard")} className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8 hover:text-tata-blue transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="glass rounded-3xl p-10 md:p-12 shadow-2xl border border-white/20">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-red-600/20">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Disaster Response Availability</h2>
              <p className="text-slate-500 text-sm">Assam Flood Relief — Volunteer Deployment Call</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Current Location</label>
                <input 
                  type="text" 
                  required
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-tata-blue/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Willing to Travel To</label>
                <input 
                  type="text" 
                  required
                  value={formData.willingToTravel}
                  onChange={e => setFormData({...formData, willingToTravel: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-tata-blue/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Available From</label>
                <input 
                  type="date" 
                  required
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-tata-blue/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Available Until</label>
                <input 
                  type="date" 
                  required
                  value={formData.endDate}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-tata-blue/20"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Relevant Skills & Certifications</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableSkills.map(skill => (
                  <label key={skill} className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center gap-3 ${
                    formData.skills.includes(skill) ? "bg-tata-blue/5 border-tata-blue/20" : "bg-white border-slate-100 hover:border-slate-200"
                  }`}>
                    <input 
                      type="checkbox" 
                      checked={formData.skills.includes(skill)}
                      onChange={e => {
                        if (e.target.checked) setFormData({...formData, skills: [...formData.skills, skill]});
                        else setFormData({...formData, skills: formData.skills.filter(s => s !== skill)});
                      }}
                      className="w-4 h-4 rounded border-slate-300 text-tata-blue focus:ring-tata-blue"
                    />
                    <span className="text-xs font-bold text-slate-600">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Travel Willingness</label>
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                {["local", "national", "international"].map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFormData({...formData, travelWillingness: mode as any})}
                    className={`flex-1 py-3 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all ${
                      formData.travelWillingness === mode ? "bg-white text-tata-blue shadow-sm" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">Medical Notes / Allergies (Optional)</label>
              <textarea 
                value={formData.medicalNotes}
                onChange={e => setFormData({...formData, medicalNotes: e.target.value})}
                placeholder="Any specific medical conditions or allergies we should be aware of for field deployment?"
                className="w-full h-32 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-tata-blue/20 resize-none"
              />
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                className="w-full py-5 bg-red-600 text-white rounded-3xl font-semibold text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-3 cursor-pointer"
              >
                <Send size={18} /> Submit Availability
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DRAvailabilityForm;
