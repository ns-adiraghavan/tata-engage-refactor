import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Drawer = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
        />
        <motion.div 
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-white z-[110] shadow-2xl overflow-y-auto"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-tata-blue">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer"><X size={24} /></button>
            </div>
            {children}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default Drawer;
