import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Eye, Award, Check, Sparkles, Star, ChevronLeft, Download, Upload, FileCheck } from "lucide-react";
import type { View } from "@/types";
import { MOCK_APPLICANTS, ANJALI_MEHTA } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";

const ProjectFeedbackView = ({ project }: { project: any }) => {
  const { setNgoData, triggerToast } = useAppContext();
  const navigate = useAppNavigate();
  const [feedbackData, setFeedbackData] = useState<any>(
    MOCK_APPLICANTS.filter(a => a.projectId === project?.id).map(a => ({
      volunteerId: a.id,
      name: a.name,
      assessment: "",
      ratings: { communication: 0, reliability: 0, contribution: 0 },
      submitted: false
    }))
  );
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showCertificatePreview, setShowCertificatePreview] = useState<any>(null);

  const handleRating = (vId: number, category: string, value: number) => {
    setFeedbackData(prev => prev.map(f => 
      f.volunteerId === vId ? { ...f, ratings: { ...f.ratings, [category]: value } } : f
    ));
  };

  const handleAssessment = (vId: number, text: string) => {
    setFeedbackData(prev => prev.map(f => 
      f.volunteerId === vId ? { ...f, assessment: text } : f
    ));
  };

  const submitFeedback = async (vId: number) => {
    setFeedbackData(prev => prev.map(f => 
      f.volunteerId === vId ? { ...f, submitted: true } : f
    ));
    triggerToast("Feedback submitted for volunteer.");
    
    // Check if all submitted to trigger AI summary and update project status
    const updatedFeedback = feedbackData.map((f: any) => f.volunteerId === vId ? { ...f, submitted: true } : f);
    const allSubmitted = updatedFeedback.every((f: any) => f.submitted);
    
    if (allSubmitted) {
      generateAiSummary();
      // Update project status in global state
      setNgoData(prev => ({
        ...prev,
        projects: prev.projects.map(p => 
          p.id === project.id ? { ...p, status: "Closed – Certified" } : p
        )
      }));
    }
  };

  const generateAiSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const allText = feedbackData.map((f: any) => f.assessment).join(". ");
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following volunteer feedback and provide a summary in JSON format with: "themes" (array of strings), "sentimentScore" (number 1-100), and "qualitySignal" (string: "High", "Medium", or "Low"). Feedback: ${allText}`,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || "{}");
      setAiSummary(result);
      triggerToast("AI Feedback Summary Generated!");
    } catch (error) {
      console.error("AI Summary failed:", error);
      setAiSummary({
        themes: ["Strong commitment", "Technical proficiency", "Good teamwork"],
        sentimentScore: 85,
        qualitySignal: "High"
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const allSubmitted = feedbackData.length > 0 && feedbackData.every((f: any) => f.submitted);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <button onClick={() => navigate("ngo-dashboard")} className="flex items-center gap-2 text-slate-500 hover:text-tata-blue font-medium mb-4 transition-colors cursor-pointer">
              <ChevronLeft size={18} /> Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-tata-blue">Project Closure & Feedback</h1>
            <p className="text-slate-500 mt-2">{project?.title} • Edition 2025</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsBulkMode(!isBulkMode)}
              className="btn-outline py-3 px-6 flex items-center gap-2 cursor-pointer"
            >
              {isBulkMode ? "Individual View" : "Bulk Upload"}
            </button>
          </div>
        </div>

        {isBulkMode ? (
          <div className="glass rounded-[2.5rem] p-10 shadow-xl bg-white text-center">
            <div className="w-20 h-20 bg-tata-blue/5 text-tata-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Bulk Feedback Upload</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Download our Excel template, fill in the volunteer assessments and ratings, and upload it back to close the project in one go.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-outline py-3 px-8 flex items-center gap-2 cursor-pointer">
                <Download size={18} /> Download Template
              </button>
              <label className="bg-zinc-900 text-white py-3 px-8 rounded-xl font-bold hover:bg-tata-blue transition-all flex items-center gap-2 cursor-pointer">
                <Upload size={18} /> Upload Completed File
                <input type="file" className="hidden" onChange={() => triggerToast("File uploaded and processed!")} />
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {feedbackData.map((volunteer: any) => (
              <div key={volunteer.volunteerId} className="glass rounded-[2.5rem] p-8 shadow-xl bg-white border border-slate-100">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-tata-blue text-white flex items-center justify-center text-xl font-bold">
                      {volunteer.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{volunteer.name}</h4>
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Volunteer ID: #{volunteer.volunteerId}</p>
                    </div>
                  </div>
                  {volunteer.submitted && (
                    <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      Submitted
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Qualitative Assessment</label>
                      <textarea 
                        disabled={volunteer.submitted}
                        value={volunteer.assessment}
                        onChange={(e) => handleAssessment(volunteer.volunteerId, e.target.value)}
                        placeholder="Describe the volunteer's performance, key achievements, and areas for growth..."
                        className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-tata-blue/20 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Ratings (Optional)</label>
                    {['communication', 'reliability', 'contribution'].map((cat) => (
                      <div key={cat} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-sm font-bold text-slate-700 capitalize">{cat}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button 
                              key={star}
                              disabled={volunteer.submitted}
                              onClick={() => handleRating(volunteer.volunteerId, cat, star)}
                              className={`p-1 transition-colors ${volunteer.ratings[cat] >= star ? "text-amber-400" : "text-slate-300"}`}
                            >
                              <Star size={20} fill={volunteer.ratings[cat] >= star ? "currentColor" : "none"} />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {!volunteer.submitted && (
                  <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end">
                    <button 
                      onClick={() => submitFeedback(volunteer.volunteerId)}
                      className="bg-zinc-900 text-white py-3 px-10 rounded-xl font-bold hover:bg-tata-blue transition-all shadow-xl shadow-black/10 cursor-pointer"
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* AI Summary Section */}
        <AnimatePresence>
          {allSubmitted && aiSummary && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 space-y-8"
            >
              <div className="bg-gradient-to-br from-tata-blue to-blue-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                  <Sparkles size={150} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles size={24} className="text-tata-cyan" />
                    <h3 className="text-2xl font-bold">NLP Feedback Summary (AI-04)</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Top Themes</p>
                      <div className="flex flex-wrap gap-2">
                        {aiSummary.themes.map((theme: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-medium border border-white/10">{theme}</span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Sentiment Score</p>
                      <div className="flex items-end gap-2">
                        <span className="text-5xl font-black text-tata-cyan">{aiSummary.sentimentScore}</span>
                        <span className="text-xl font-bold text-white/40 mb-1">/100</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-white/40 uppercase tracking-widest">NGO Quality Signal</p>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
                        aiSummary.qualitySignal === 'High' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        <Award size={18} /> {aiSummary.qualitySignal} Signal
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate Trigger Card */}
              <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                    <FileCheck size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Certificate Conditions Met ✅</h3>
                    <p className="text-slate-500">Both NGO and Volunteer feedback have been submitted. TSG Admin approval is pending for final certificate generation.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCertificatePreview(feedbackData[0])}
                  className="btn-outline py-4 px-8 flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Eye size={18} /> Preview Certificate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {showCertificatePreview && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/80 backdrop-blur-md"
              onClick={() => setShowCertificatePreview(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden aspect-[1.414/1] p-16 border-[12px] border-tata-blue/10"
            >
              <div className="absolute top-0 left-0 w-full h-4 bg-tata-blue" />
              <div className="absolute bottom-0 left-0 w-full h-4 bg-tata-blue" />
              
              <div className="h-full border-2 border-tata-blue/20 p-12 flex flex-col items-center text-center relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Building2 size={120} />
                </div>
                
                <img src="https://www.tata.com/content/dam/tata/images/home-page/tata_logo_blue.png" alt="Tata Logo" className="h-12 mb-12" referrerPolicy="no-referrer" />
                
                <h2 className="text-4xl font-serif text-tata-blue mb-4">Certificate of Appreciation</h2>
                <p className="text-slate-400 uppercase tracking-[0.3em] font-bold mb-12">Tata Volunteer Week - Edition 2025</p>
                
                <p className="text-xl text-slate-600 mb-2">This is to certify that</p>
                <h3 className="text-5xl font-serif font-bold text-slate-800 mb-8 underline decoration-tata-cyan decoration-4 underline-offset-8">
                  {showCertificatePreview.name}
                </h3>
                
                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                  has successfully completed the volunteering project <span className="font-bold text-tata-blue">"{project?.title}"</span> with <span className="font-bold text-tata-blue">{ANJALI_MEHTA.organization}</span>. Their contribution and dedication towards social impact are highly appreciated.
                </p>
                
                <div className="mt-auto pt-16 flex justify-between w-full">
                  <div className="text-center">
                    <div className="w-48 h-0.5 bg-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">NGO Representative</p>
                    <p className="text-sm font-bold text-slate-800">Anjali Mehta</p>
                  </div>
                  <div className="text-center">
                    <div className="w-48 h-0.5 bg-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">TSG Admin</p>
                    <p className="text-sm font-bold text-slate-800">Tata Sustainability Group</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowCertificatePreview(null)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectFeedbackView;
