import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";

const DRConfirmationView = () => {
  const { user } = useAuth();
  const navigate = useAppNavigate();
  const refId = `DR-2026-AF-${Math.floor(1000 + Math.random() * 9000)}`;
  
  return (
    <div className="pt-20 pb-20 px-6 md:px-12 bg-slate-50 min-h-screen flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white border border-slate-100 rounded-2xl shadow-sm p-12 md:p-16 text-center"
      >
        <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-green-600/10">
          <Check size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Availability Confirmed</h2>
        <p className="text-slate-500 mb-10">Thank you for your willingness to serve. Your availability has been recorded and shared with the Disaster Response Command Centre.</p>
        
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 mb-10">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Reference ID</div>
          <div className="text-2xl font-mono font-black text-tata-blue tracking-wider">{refId}</div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => navigate("dashboard")}
            className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-semibold text-xs uppercase tracking-widest hover:bg-tata-blue transition-all shadow-xl shadow-black/10 cursor-pointer"
          >
            Return to Dashboard
          </button>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            A confirmation email has been sent to {user.email}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DRConfirmationView;
