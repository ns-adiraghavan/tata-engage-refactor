import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const SupportModal = () => {
  const { showSupportModal, setShowSupportModal, supportSubject, setSupportSubject, triggerToast } = useAppContext();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleEscalate = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setShowSupportModal(false);
      triggerToast("Support request sent! TSG will contact you shortly.");
    }, 1500);
  };

  return (
    <AnimatePresence>
      {showSupportModal && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            onClick={() => setShowSupportModal(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-1">Escalate to TSG Support</h2>
                  <p className="text-sm text-slate-500">Our team will review your query and get back to you.</p>
                </div>
                <button onClick={() => setShowSupportModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Subject</label>
                  <input 
                    type="text" 
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-tata-blue/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Message</label>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-tata-blue/20 resize-none"
                  />
                </div>
                <button 
                  onClick={handleEscalate}
                  disabled={!message || isSending}
                  className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-tata-blue transition-all cursor-pointer"
                >
                  {isSending ? "Sending..." : "Send Support Request"} <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SupportModal;
