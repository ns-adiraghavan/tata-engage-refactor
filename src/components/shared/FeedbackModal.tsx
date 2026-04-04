import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Send, Star } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const FeedbackModal = () => {
  const { showFeedbackForm, setShowFeedbackForm, feedbackSubmitted, setFeedbackSubmitted, triggerToast } = useAppContext();
  const [rating, setRating] = useState(0);
  const [ngoRatings, setNgoRatings] = useState({ quality: 0, comms: 0, clarity: 0 });
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    setFeedbackSubmitted(true);
    triggerToast("Thank you! Your certificate will be issued within 24 hours.");
    setTimeout(() => setShowFeedbackForm(false), 2000);
  };

  return (
    <AnimatePresence>
      {showFeedbackForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            onClick={() => setShowFeedbackForm(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-zinc-900 mb-2">Project Feedback</h2>
                  <p className="text-slate-500">Share your experience with <span className="font-bold text-tata-blue">Financial Literacy for Rural Women</span></p>
                </div>
                <button onClick={() => setShowFeedbackForm(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer">
                  <X size={24} />
                </button>
              </div>

              {feedbackSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">Feedback Submitted!</h3>
                  <p className="text-slate-500 mb-8">Thank you for your valuable input. Your certificate will be issued within 24 hours.</p>
                  <button onClick={() => setShowFeedbackForm(false)} className="btn-black py-3 px-10 cursor-pointer">Close</button>
                </motion.div>
              ) : (
                <div className="space-y-8">
                  {/* Section 1: Experience */}
                  <section>
                    <h4 className="text-sm font-bold text-zinc-900 mb-4 uppercase tracking-wider">Section 1: Your Experience</h4>
                    <div className="flex gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star} 
                          onClick={() => setRating(star)}
                          className={`p-1 transition-all ${rating >= star ? 'text-yellow-400 scale-110' : 'text-slate-200'}`}
                        >
                          <Star size={32} fill={rating >= star ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us more about your journey..."
                      className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-tata-blue/20 resize-none"
                    />
                  </section>

                  {/* Section 2: NGO Rating */}
                  <section className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Section 2: NGO Rating (Optional)</h4>
                      <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">ADMIN ONLY</span>
                    </div>
                    <div className="space-y-4">
                      {[
                        { key: 'quality', label: 'Quality of Engagement' },
                        { key: 'comms', label: 'Communication' },
                        { key: 'clarity', label: 'Project Clarity' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <span className="text-xs text-slate-600 font-medium">{item.label}</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button 
                                key={star} 
                                onClick={() => setNgoRatings({...ngoRatings, [item.key]: star})}
                                className={`p-1 transition-all ${(ngoRatings as any)[item.key] >= star ? 'text-tata-blue' : 'text-slate-200'}`}
                              >
                                <Star size={16} fill={(ngoRatings as any)[item.key] >= star ? "currentColor" : "none"} />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-4 italic">Note: NGO ratings are only visible to TSG Admin</p>
                  </section>

                  <button 
                    onClick={handleSubmit}
                    disabled={!rating}
                    className="w-full btn-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    Submit Feedback <Send size={18} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
