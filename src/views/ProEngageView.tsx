import Drawer from "@/components/layout/Drawer";
import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Heart, Search, Clock, Info, Check, Sparkles, Laptop, TrendingUp, GraduationCap, Megaphone, Scale, Leaf, Users, Package, Plus, ArrowLeft } from "lucide-react";
import { PROENGAGE_PROJECTS } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const SKILL_AREA_TO_CATEGORY: Record<string, string> = {
  "Finance": "Finance & Accounting",
  "IT": "IT & Technology",
  "Education": "Education & Coaching",
  "Legal": "Legal & Compliance",
  "Healthcare": "Healthcare",
  "Environment": "Environment",
  "HR": "HR & People",
  "Operations": "Operations & Logistics",
  "Communication": "Marketing & Communications",
  "Project Management": "Operations & Logistics",
};

const CATEGORIES = [
  { name: "IT & Technology", icon: Laptop },
  { name: "Finance & Accounting", icon: TrendingUp },
  { name: "Education & Coaching", icon: GraduationCap },
  { name: "Marketing & Communications", icon: Megaphone },
  { name: "Legal & Compliance", icon: Scale },
  { name: "Healthcare", icon: Heart },
  { name: "Environment", icon: Leaf },
  { name: "HR & People", icon: Users },
  { name: "Operations & Logistics", icon: Package },
  { name: "Research & Analysis", icon: Search },
  { name: "Others", icon: Plus },
];

const getCategory = (area: string) => SKILL_AREA_TO_CATEGORY[area] || "Others";

const AREA_IMAGES: Record<string, string> = {
  Finance: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=60",
  IT: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=60",
  Education: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=60",
  Legal: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=60",
  Healthcare: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=60",
  Environment: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=60",
  HR: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=60",
  Operations: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=60",
  Communication: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=60",
};
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=60";

const ProEngageView = () => {
  const { appliedProjects, setAppliedProjects, likedProjects, setLikedProjects, triggerToast } = useAppContext();
  const { user } = useAuth();
  const rawNavigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All Projects");
  const [isApplying, setIsApplying] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [motivation, setMotivation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Count projects per category
  const categoryCounts = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat.name] = PROENGAGE_PROJECTS.filter(p => getCategory(p.area) === cat.name).length;
    return acc;
  }, {});

  // Filtered projects for level 2
  const filteredProjects = PROENGAGE_PROJECTS.filter(p => {
    const matchesCategory = selectedCategory ? getCategory(p.area) === selectedCategory : true;
    const matchesTab = activeTab === "All Projects" ? true : activeTab === "Matched" ? p.matched : p.area === activeTab;
    const matchesSearch = searchQuery
      ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ngo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesCategory && matchesTab && matchesSearch;
  });

  // AI Top 3 recommendations
  const aiRecommended = PROENGAGE_PROJECTS.filter(p => p.matched).slice(0, 3);

  // Collections for level 1
  const trendingProjects = PROENGAGE_PROJECTS.slice(0, 3);
  const closingSoonProjects = PROENGAGE_PROJECTS.filter(p => p.commitment?.includes("4") || p.commitment?.includes("6")).slice(0, 3);
  const matchesForYou = PROENGAGE_PROJECTS.filter(p => p.matched).slice(0, 3);

  const ProjectCard = ({ project }: { project: any }) => (
    <motion.div
      key={project.id}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-2xl transition-all relative group flex flex-col overflow-hidden"
    >
      <img
        src={AREA_IMAGES[project.area] || DEFAULT_IMAGE}
        alt={project.area}
        className="w-full h-[120px] object-cover"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      {project.matched && (
        <div className="absolute top-[132px] right-6 w-8 h-8 rounded-full bg-tata-cyan/10 flex items-center justify-center text-tata-cyan" title="Skill Match">
          <Sparkles size={16} />
        </div>
      )}

      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-6">
          <div className="text-xs font-bold text-tata-blue uppercase tracking-widest mb-2 flex items-center gap-2">
            <Building2 size={12} /> {project.ngo}
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-tata-blue transition-colors leading-tight">{project.title}</h3>
          {project.matched && (() => {
            const skillArea = project.area;
            const location = project.mode.includes("Mumbai") ? "Mumbai" : project.mode.includes("Delhi") ? "Delhi" : "";
            const chip = user.skills?.some((s: string) => s.toLowerCase() === skillArea.toLowerCase())
              ? `Matches your ${skillArea} skills`
              : location === user.city
                ? `Near you · ${location}`
                : "Recommended for you";
            return (
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs mb-2">
                {chip}
              </span>
            );
          })()}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold uppercase tracking-wider">{project.area}</span>
            <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">{project.mode}</span>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-6 line-clamp-3 flex-grow">{project.description}</p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Clock size={16} className="text-slate-400" /> {project.commitment}
          </div>
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill: string, i: number) => (
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
      </div>
    </motion.div>
  );

  const CollectionRow = ({ title, projects }: { title: string; projects: any[] }) => (
    projects.length > 0 ? (
      <div className="mb-12">
        <h3 className="text-lg font-black text-violet-700 tracking-tight mb-6">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      </div>
    ) : null
  );

  return (
    <div className="pt-20 pb-20 px-6 md:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button onClick={() => rawNavigate(-1)} className="flex items-center gap-1 text-sm font-bold text-tata-blue hover:underline cursor-pointer mb-4">
            <ArrowLeft size={15} /> ← Back
          </button>
          <h1 className="text-4xl font-bold text-tata-blue mb-4 tracking-tight">ProEngage Projects</h1>
          <p className="text-slate-500 max-w-2xl text-lg">Skill-based volunteering opportunities for Tata employees to contribute their professional expertise to social causes.</p>
        </div>

        {/* AI Top 3 Recommendations — always visible */}
        {aiRecommended.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <Sparkles size={18} />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">AI Recommended For You</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aiRecommended.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by skills, NGO or project name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-100 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-tata-blue/20 shadow-sm"
            />
          </div>
          {selectedCategory && (
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {["All Projects", "Matched"].map((tab) => (
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
          )}
        </div>

        {/* Level 2: Category filtered view */}
        {selectedCategory ? (
          <div>
            <button
              onClick={() => { setSelectedCategory(null); setActiveTab("All Projects"); }}
              className="flex items-center gap-2 text-sm font-bold text-tata-blue hover:underline cursor-pointer mb-8"
            >
              <ArrowLeft size={16} /> Back to categories
            </button>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">{selectedCategory}</h2>
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map(p => <ProjectCard key={p.id} project={p} />)}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-400 text-lg">No projects found in this category.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Level 1: Category Grid */}
            <div className="mb-16">
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6">Browse by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm hover:shadow-xl hover:border-tata-blue/20 transition-all cursor-pointer text-left group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-tata-blue/5 group-hover:text-tata-blue transition-colors">
                      <cat.icon size={24} />
                    </div>
                    <h4 className="font-bold text-slate-900 tracking-tight mb-1 group-hover:text-tata-blue transition-colors">{cat.name}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{categoryCounts[cat.name] || 0} projects</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Collections */}
            <CollectionRow title="🔥 Trending" projects={trendingProjects} />
            <CollectionRow title="⏰ Closing Soon" projects={closingSoonProjects} />
            <CollectionRow title="✨ Matches for You" projects={matchesForYou} />
          </>
        )}

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
                      {user.skills.map((s: string, i: number) => (
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
