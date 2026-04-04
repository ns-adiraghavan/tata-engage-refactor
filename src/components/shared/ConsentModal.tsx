import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ConsentModal = ({ isOpen, onAccept, onCancel }: { isOpen: boolean, onAccept: () => void, onCancel: () => void }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Consent Required</h2>
              
              <div className="space-y-4 text-zinc-600 text-sm leading-relaxed mb-8">
                <p>
                  We collect and process your personal information (PII) to create and manage your account.
                </p>
                <p>
                  Please review and provide your consent to proceed.
                </p>
              </div>

              <div className="flex items-start gap-3 mb-8 bg-zinc-50 p-4 rounded-lg">
                <input 
                  type="checkbox" 
                  id="consent" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-zinc-300 text-black focus:ring-black cursor-pointer" 
                />
                <label htmlFor="consent" className="text-sm text-zinc-700 font-medium cursor-pointer">
                  I agree to the collection and processing of my personal data.
                </label>
              </div>

              <div className="flex gap-4">
                <button onClick={onCancel} className="flex-1 btn-outline py-3 cursor-pointer">Cancel</button>
                <button 
                  onClick={onAccept} 
                  disabled={!agreed}
                  className="flex-1 btn-black py-3 cursor-pointer"
                >
                  Accept & Continue
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConsentModal;
