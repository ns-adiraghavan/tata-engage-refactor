import { motion } from "framer-motion";
import { X, Lock, Check } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const OrientationModal = () => {
  const { setShowOrientationModal } = useAppContext();
  const modules = [
    { id: 1, title: "Platform Overview", status: "Completed" },
    { id: 2, title: "TVW Coordinator Guide", status: "Completed" },
    { id: 3, title: "ProEngage Monitoring", status: "Locked" },
    { id: 4, title: "Data Privacy", status: "Locked" },
    { id: 5, title: "SPOC Code of Conduct", status: "Locked" }
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-zinc-900/80 backdrop-blur-md"
        onClick={() => setShowOrientationModal(false)}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-10 md:p-16">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-3xl font-bold text-tata-blue mb-2">SPOC Orientation</h2>
              <p className="text-slate-500">Master the platform to effectively manage your company's volunteering impact.</p>
            </div>
            <button onClick={() => setShowOrientationModal(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
            {modules.map((m) => (
              <div key={m.id} className={`p-6 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                m.status === "Completed" ? "border-green-100 bg-green-50/50" : "border-slate-100 bg-slate-50/50 opacity-60"
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${
                  m.status === "Completed" ? "bg-green-500 text-white" : "bg-slate-200 text-slate-400"
                }`}>
                  {m.status === "Completed" ? <Check size={20} /> : <Lock size={20} />}
                </div>
                <h4 className="text-xs font-bold text-slate-800 leading-tight">{m.title}</h4>
                <p className="text-xs mt-2 font-bold uppercase tracking-widest text-slate-400">{m.status}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 p-8 bg-tata-blue/5 rounded-3xl border border-tata-blue/10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-tata-blue text-white flex items-center justify-center text-2xl font-bold">
                40%
              </div>
              <div>
                <h4 className="font-bold text-tata-blue">Next: ProEngage Monitoring</h4>
                <p className="text-xs text-slate-500">Learn how to track and approve ProEngage applications for your company.</p>
              </div>
            </div>
            <button className="btn-black py-4 px-10 whitespace-nowrap cursor-pointer">Resume Orientation</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrientationModal;
