import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ArrowLeft, CheckCircle2, MapPin, Info, List, Send, FileText, Check, Sparkles, ArrowRight, Save, Copy } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";

const CreateProjectView = () => {
  const { clonedProject, setClonedProject, triggerToast } = useAppContext();
  const navigate = useAppNavigate();
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState(clonedProject || {
    title: "",
    skillArea: "",
    mode: "Online",
    duration: "3 months",
    volunteers: 1,
    location: "",
    brief: "",
    outcomes: "",
    isSkillBased: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [qualityScore, setQualityScore] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // AI Quality Score Calculation (debounced 300ms)
  const [scoreHint, setScoreHint] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      let score = 0;
      const conditions: { met: boolean; hint: string }[] = [
        { met: (projectData.brief || "").trim().split(/\s+/).filter(Boolean).length >= 50, hint: "Write at least 50 words in the description to improve your score." },
        { met: (projectData.outcomes || "").trim().length > 0, hint: "Add text to the outcomes/impact section to improve your score." },
        { met: (projectData.outcomes || "").trim().split(/\s+/).filter(Boolean).length >= 30, hint: "Add more detail to your outcome section to improve your score." },
        { met: !!(projectData.duration || "").trim(), hint: "Select a project duration to improve your score." },
        { met: !!(projectData.mode || "").trim(), hint: "Select a project mode to improve your score." },
        { met: !!(projectData.skillArea || "").trim(), hint: "Select a skill area to improve your score." },
        { met: (projectData.title || "").trim().split(/\s+/).filter(Boolean).length >= 4, hint: "Use at least 4 words in your project title." },
        { met: projectData.volunteers > 0, hint: "Set a volunteer count to improve your score." },
      ];
      const points = [2, 2, 1, 1, 1, 1, 1, 1]; // max 10
      conditions.forEach((c, i) => { if (c.met) score += points[i]; });
      setQualityScore(Math.min(score, 10));

      const firstUnmet = conditions.find(c => !c.met);
      setScoreHint(firstUnmet ? firstUnmet.hint : "");
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [projectData]);

  // Auto-save simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSaved(new Date());
      triggerToast("Draft saved automatically");
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const generateTemplate = async (area: string) => {
    if (!area) return;
    setIsGenerating(true);
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a professional project brief template for a volunteering project in the area of ${area}. The template should include sections for Project Overview, Key Responsibilities, and Required Skills. Keep it concise but professional.`,
      });
      
      if (response.text) {
        setProjectData(prev => ({ ...prev, brief: response.text || "" }));
        triggerToast("AI Template Generated!");
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
      // Fallback template
      const fallback = `Project Overview: [Describe the goal of this ${area} project]\n\nKey Responsibilities:\n- [Task 1]\n- [Task 2]\n\nRequired Skills:\n- [Skill 1]\n- [Skill 2]`;
      setProjectData(prev => ({ ...prev, brief: fallback }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSkillAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const area = e.target.value;
    setProjectData(prev => ({ ...prev, skillArea: area }));
    if (area && projectData.isSkillBased) generateTemplate(area);
  };

  const handleSaveDraft = () => {
    setClonedProject(null);
    triggerToast("Project saved as draft");
    navigate("ngo-dashboard");
  };

  const handleSubmit = () => {
    setClonedProject(null);
    triggerToast("Project submitted for review");
    navigate("ngo-dashboard");
  };

  const steps = [
    { id: 1, title: "Project Basics", icon: <Building2 size={20} /> },
    { id: 2, title: "Project Brief", icon: <FileText size={20} /> },
    { id: 3, title: "Outcomes & Impact", icon: <Sparkles size={20} /> }
  ];

  return (
    <div className="min-h-screen pt-20 pb-20 bg-slate-50 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => {
              setClonedProject(null);
              navigate("ngo-dashboard");
            }}
            className="flex items-center gap-2 text-slate-500 hover:text-tata-blue font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            {lastSaved && (
              <span className="text-xs text-slate-400 italic">
                Last auto-saved: {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button onClick={handleSaveDraft} className="btn-outline py-2 px-6 text-sm flex items-center gap-2 cursor-pointer">
              <Save size={16} /> Save as Draft
            </button>
          </div>
        </div>

        {clonedProject && (
          <div className="mb-6 flex items-center gap-2 px-6 py-2 bg-tata-blue/5 border border-tata-blue/10 rounded-full w-fit">
            <Copy size={14} className="text-tata-blue" />
            <span className="text-xs font-bold text-tata-blue">Copied from: {clonedProject.sourceTitle}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Stepper */}
          <div className="bg-tata-blue p-8 text-white">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
              {steps.map((s) => (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    step >= s.id ? "bg-tata-cyan text-tata-blue shadow-lg shadow-tata-cyan/20" : "bg-white/10 text-white/40"
                  }`}>
                    {step > s.id ? <Check size={24} /> : s.icon}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest ${step >= s.id ? "text-white" : "text-white/40"}`}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-10 md:p-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold text-tata-blue mb-2">Project Basics</h2>
                      <p className="text-slate-500">Let's start with the essential details of your project.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2">
                        <label className="form-label">Project Title*</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Financial Literacy Module for Rural Women" 
                          className="form-input"
                          value={projectData.title}
                          onChange={e => setProjectData({...projectData, title: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="form-label">Skill Area*</label>
                        <select 
                          className="form-input"
                          value={projectData.skillArea}
                          onChange={handleSkillAreaChange}
                        >
                          <option value="">Select Area</option>
                          <option value="Finance">Finance</option>
                          <option value="Tech">Tech</option>
                          <option value="Education">Education</option>
                          <option value="Health">Health</option>
                          <option value="Environment">Environment</option>
                          <option value="Marketing">Marketing</option>
                        </select>
                      </div>

                      <div>
                        <label className="form-label">Mode*</label>
                        <div className="flex gap-2">
                          {["Online", "Offline", "Hybrid"].map(m => (
                            <button
                              key={m}
                              onClick={() => setProjectData({...projectData, mode: m})}
                              className={`flex-1 py-3 rounded-lg text-sm font-bold border-2 transition-all ${
                                projectData.mode === m ? "border-tata-blue bg-tata-blue/5 text-tata-blue" : "border-slate-100 text-slate-400 hover:border-slate-200"
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="form-label">Duration*</label>
                        <select 
                          className="form-input"
                          value={projectData.duration}
                          onChange={e => setProjectData({...projectData, duration: e.target.value})}
                        >
                          {[1, 2, 3, 4, 5, 6].map(m => (
                            <option key={m} value={`${m} months`}>{m} {m === 1 ? 'month' : 'months'}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="form-label">Volunteer Count*</label>
                        <input 
                          type="number" 
                          min="1"
                          className="form-input"
                          value={projectData.volunteers}
                          onChange={e => setProjectData({...projectData, volunteers: parseInt(e.target.value)})}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="form-label">City/Location*</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="text" 
                            placeholder="Enter city or 'Virtual'" 
                            className="form-input pl-12"
                            value={projectData.location}
                            onChange={e => setProjectData({...projectData, location: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-3xl font-bold text-tata-blue mb-2">Project Brief</h2>
                        <p className="text-slate-500">Describe the project goals and volunteer responsibilities.</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center min-w-[140px]">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">AI Quality Score</div>
                        <div
                          className={`text-2xl font-bold ${qualityScore > 7 ? 'text-green-500' : qualityScore > 4 ? 'text-amber-500' : 'text-red-500'}`}
                          style={{ transition: 'all 0.4s ease' }}
                        >
                          {qualityScore}/10
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${qualityScore > 7 ? 'bg-green-500' : qualityScore > 4 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${qualityScore * 10}%`, transition: 'all 0.4s ease' }}
                          />
                        </div>
                        {scoreHint && (
                          <p className="text-[11px] text-muted-foreground mt-2 text-left leading-snug">{scoreHint}</p>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <div className="flex justify-between items-center mb-2">
                        <label className="form-label mb-0">Detailed Description*</label>
                        <button 
                          onClick={() => generateTemplate(projectData.skillArea)}
                          disabled={isGenerating || !projectData.skillArea}
                          className="flex items-center gap-2 text-xs font-bold text-tata-blue hover:underline disabled:opacity-50"
                        >
                          <Sparkles size={14} /> {isGenerating ? "Generating..." : "Regenerate AI Template"}
                        </button>
                      </div>
                      <textarea 
                        className="form-input min-h-[300px] font-mono text-sm leading-relaxed"
                        placeholder="Describe your project in detail..."
                        value={projectData.brief}
                        onChange={e => setProjectData({...projectData, brief: e.target.value})}
                      />
                      {isGenerating && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-tata-blue border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm font-bold text-tata-blue">AI is crafting your brief...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold text-tata-blue mb-2">Outcomes & Impact</h2>
                      <p className="text-slate-500">What are the expected results of this project?</p>
                    </div>

                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2 group">
                        <label className="form-label mb-0">Expected Outcomes*</label>
                        <div className="relative">
                          <Info size={14} className="text-slate-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-zinc-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                            Be specific about the impact. e.g., "100 women trained in basic bookkeeping."
                          </div>
                        </div>
                      </div>
                      {clonedProject && (
                        <div className="mb-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-800 text-xs font-bold animate-pulse">
                          <Sparkles size={16} className="shrink-0" />
                          Please update this section for the new edition
                        </div>
                      )}
                      <textarea 
                        className="form-input min-h-[200px]"
                        placeholder="List the key deliverables and impact metrics..."
                        value={projectData.outcomes}
                        onChange={e => setProjectData({...projectData, outcomes: e.target.value})}
                      />
                    </div>

                    <div className="bg-tata-blue/5 border border-tata-blue/10 p-8 rounded-3xl">
                      <h4 className="font-bold text-tata-blue mb-4 flex items-center gap-2">
                        <CheckCircle2 size={18} /> Final Review
                      </h4>
                      <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-tata-cyan" />
                          Project will be submitted to TSG Admin for approval.
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-tata-cyan" />
                          Expected review time: 2-3 business days.
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-tata-cyan" />
                          You can edit the project while it's in 'Draft' or 'Under Review' status.
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Footer Actions */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
              <button 
                onClick={() => step > 1 ? setStep(step - 1) : navigate("ngo-dashboard")}
                className="btn-outline py-3 px-8 cursor-pointer"
              >
                {step === 1 ? "Cancel" : "Previous Step"}
              </button>
              
              <div className="flex gap-4">
                {step < 3 ? (
                  <button 
                    onClick={() => setStep(step + 1)}
                    disabled={step === 1 && !projectData.title}
                    className="btn-black py-3 px-10 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    Next Step <ArrowRight size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmit}
                    disabled={!projectData.outcomes}
                    className="bg-tata-cyan text-tata-blue py-3 px-10 rounded-lg font-bold hover:bg-tata-blue hover:text-white transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send size={18} /> Submit for Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

          {/* Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* AI Quality Score */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">AI Quality Score</p>
                <div
                  className={`text-4xl font-black ${qualityScore > 7 ? 'text-green-500' : qualityScore > 4 ? 'text-amber-500' : 'text-red-500'}`}
                  style={{ transition: 'all 0.4s ease' }}
                >
                  {qualityScore}/10
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${qualityScore > 7 ? 'bg-green-500' : qualityScore > 4 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${qualityScore * 10}%`, transition: 'all 0.4s ease' }}
                  />
                </div>
                {scoreHint && (
                  <p className="text-xs text-slate-500 mt-3 leading-snug">{scoreHint}</p>
                )}
                <p className="text-xs text-slate-400 italic mt-3">Score visible to NGO only — not shown to Admin</p>
              </div>

              {/* Project Checklist */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Project Checklist</p>
                <div className="space-y-2">
                  {[
                    { label: "Title", done: (projectData.title || "").trim().length > 0 },
                    { label: "Skill Area", done: !projectData.isSkillBased || !!(projectData.skillArea || "").trim() },
                    { label: "Mode", done: !!(projectData.mode || "").trim() },
                    { label: "Duration", done: !!(projectData.duration || "").trim() },
                    { label: "Brief (50+ words)", done: (projectData.brief || "").trim().split(/\s+/).filter(Boolean).length >= 50 },
                    { label: "Outcomes (30+ words)", done: (projectData.outcomes || "").trim().split(/\s+/).filter(Boolean).length >= 30 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${item.done ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-400"}`}>
                        {item.done ? <Check size={12} /> : "–"}
                      </div>
                      <span className={`text-sm ${item.done ? "text-slate-700 font-medium" : "text-slate-400"}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refer an NGO */}
              <button
                onClick={() => triggerToast("Referral link copied!")}
                className="w-full py-3 px-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm font-bold text-slate-600 hover:border-slate-200 hover:text-slate-800 transition-all cursor-pointer"
              >
                Refer another NGO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectView;
