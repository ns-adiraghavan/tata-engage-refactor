import Drawer from "@/components/layout/Drawer";
import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Heart, Search, Clock, Info, Check, Sparkles, Save } from "lucide-react";
import { PROENGAGE_PROJECTS } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

const ProEngageView = () => {
  const { appliedProjects, setAppliedProjects, likedProjects, setLikedProjects, triggerToast } = useAppContext();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("All Projects");
  const [isApplying, setIsApplying] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [motivation, setMotivation] = useState("");

  const handleApply = (project: any) => {
    setSelectedProject(project);
    setIsApplying(true);
  };

  const submitApplication = () => {
    if (!selectedProject) return;
    setAppliedProjects([...appliedProjects, selectedProject.id]);
    setIsApplying(false);
    setMotivation("");
    triggerToast(`Application for ${selectedProject.title} submitted!`);
  };

  const toggleLike = (id: number) => {
    if (likedProjects.includes(id)) {
      setLikedProjects(likedProjects.filter(p => p !== id));
    } else {
      setLikedProjects([...likedProjects, id]);
    }
  };

  const filteredProjects = PROENGAGE_PROJECTS.filter(p => {
    if (activeTab === "All Projects") return true;
    if (activeTab === "Matched") return p.matched;
    return p.area === activeTab;
  });

  return (
    <div className="pt-28 pb-20 px-6 md:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-tata-blue mb-4 tracking-tight">ProEngage Projects</h1>
          <p className="text-slate-500 max-w-2xl text-lg">Skill-based volunteering opportunities for Tata employees to contribute their professional expertise to social causes.</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by skills, NGO or project name..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-100 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-tata-blue/20 shadow-sm" 
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {["All Projects", "Matched", "Finance", "Education", "Environment"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 rounded-3xl text-sm font-bold whitespace-nowrap transition-all border ${
                  activeTab === tab 
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-black/10" 
                    : "bg-white text-slate-500 border-zinc-100 hover:border-slate-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <motion.div 
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm hover:shadow-2xl transition-all relative group flex flex-col"
            >
              {project.matched && (
                <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-tata-cyan/10 flex items-center justify-center text-tata-cyan" title="Skill Match">
                  <Sparkles size={16} />
                </div>
              )}
              
              <div className="mb-6">
                <div className="text-xs font-bold text-tata-blue uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Building2 size={12} /> {project.ngo}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3 group-hover:text-tata-blue transition-colors leading-tight">{project.title}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">{project.area}</span>
                  <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">{project.mode}</span>
                </div>
              </div>

              <p className="text-sm text-slate-500 mb-6 line-clamp-3 flex-grow">{project.description}</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Clock size={16} className="text-slate-400" /> {project.commitment}
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill, i) => (
                    <span key={i} className="text-xs font-bold text-tata-cyan bg-tata-cyan/5 px-2 py-0.5 rounded uppercase tracking-wider">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  disabled={appliedProjects.includes(project.id)}
                  onClick={() => handleApply(project)}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                    appliedProjects.includes(project.id)
                      ? "bg-green-50 text-green-600 cursor-default"
                      : "bg-zinc-900 text-white hover:bg-tata-blue shadow-lg shadow-black/10 cursor-pointer"
                  }`}
                >
                  {appliedProjects.includes(project.id) ? (
                    <><Check size={20} /> Applied</>
                  ) : "Apply Now"}
                </button>
                <button 
                  onClick={() => toggleLike(project.id)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border ${
                    likedProjects.includes(project.id)
                      ? "bg-red-50 border-red-100 text-red-500"
                      : "bg-white border-zinc-100 text-slate-300 hover:text-red-500 hover:border-red-100"
                  }`}
                >
                  <Heart size={24} fill={likedProjects.includes(project.id) ? "currentColor" : "none"} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Application Drawer */}
        <Drawer 
          isOpen={isApplying} 
          onClose={() => setIsApplying(false)} 
          title="Project Application"
        >
          {selectedProject && (
            <div className="space-y-8">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <h4 className="font-bold text-zinc-900 mb-1">{selectedProject.title}</h4>
                <p className="text-sm text-slate-500">{selectedProject.ngo}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Your Profile Summary</label>
                  <div className="p-4 bg-white border border-zinc-100 rounded-2xl">
                    <div className="font-bold text-sm text-zinc-900">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-slate-500">{user.designation} at {user.company}</div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {user.skills.map((s, i) => (
                        <span key={i} className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Why do you want to volunteer?*</label>
                  <textarea 
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Tell the NGO about your motivation and how your skills can help..."
                    className="w-full h-40 p-4 bg-white border border-zinc-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-tata-blue/20 resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-tata-cyan/5 rounded-2xl border border-tata-cyan/10">
                  <Info size={18} className="text-tata-cyan shrink-0" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    By submitting, you agree to share your professional profile and contact details with {selectedProject.ngo}.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsApplying(false)} className="flex-1 btn-outline py-4 cursor-pointer">Save for Later</button>
                <button 
                  onClick={submitApplication}
                  disabled={!motivation.trim()}
                  className="flex-1 btn-black py-4 shadow-xl shadow-black/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Application
                </button>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default ProEngageView;
