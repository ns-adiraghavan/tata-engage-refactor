import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import type { View } from "@/types";
import type { View } from "@/types";

const MegaMenu = ({ isOpen, onClose, isLoggedIn, onNavigate, onLogout, user }: { 
  isOpen: boolean, 
  onClose: () => void,
  isLoggedIn: boolean,
  onNavigate: (view: View) => void,
  onLogout: () => void,
  user: any
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
        />
        <motion.div 
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl overflow-y-auto"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG2f-xo_Z2La9Y0SPnOLqZWBtorh4oXrzkVg&s" 
                  alt="TATA engage" 
                  className="h-12 md:h-14 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer"><X size={24} /></button>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</h3>
                <ul className="space-y-4 text-xl font-medium">
                  <li 
                    onClick={() => { onNavigate(user.role === 'ngo' ? 'ngo-dashboard' : (isLoggedIn ? "dashboard" : "home")); onClose(); }}
                    className="hover:text-tata-blue cursor-pointer flex items-center justify-between group"
                  >
                    {isLoggedIn ? (user.role === 'ngo' ? "NGO Dashboard" : "Dashboard") : "Home"} <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-all" />
                  </li>
                  {isLoggedIn && (
                    <>
                      <li 
                        onClick={() => { onNavigate("profile"); onClose(); }}
                        className="hover:text-tata-blue cursor-pointer flex items-center justify-between group"
                      >
                        My Profile <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-all" />
                      </li>
                      <li 
                        onClick={() => { onNavigate("tvw"); onClose(); }}
                        className="hover:text-tata-blue cursor-pointer flex items-center justify-between group"
                      >
                        TVW Hub <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-all" />
                      </li>
                      <li 
                        onClick={() => { onNavigate("tvw-vibe"); onClose(); }}
                        className="hover:text-tata-blue cursor-pointer flex items-center justify-between group"
                      >
                        TVW Vibe Highlights <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-all" />
                      </li>
                      <li 
                        onClick={() => { onNavigate("proengage"); onClose(); }}
                        className="hover:text-tata-blue cursor-pointer flex items-center justify-between group"
                      >
                        ProEngage Projects <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-all" />
                      </li>
                      <li 
                        onClick={() => { onNavigate("disaster-response"); onClose(); }}
                        className="hover:text-tata-blue cursor-pointer flex items-center justify-between group"
                      >
                        Disaster Response <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-all" />
                      </li>
                    </>
                  )}
                  <li 
                    onClick={() => { onNavigate("disaster-response"); onClose(); }}
                    className="hover:text-tata-blue cursor-pointer flex items-center justify-between group"
                  >
                    Disaster Response <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-all" />
                  </li>
                  <li className="hover:text-tata-blue cursor-pointer flex items-center justify-between group">
                    Volunteering Opportunities <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-all" />
                  </li>
                  <li className="hover:text-tata-blue cursor-pointer flex items-center justify-between group">
                    Our Programmes <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-all" />
                  </li>
                  <li className="hover:text-tata-blue cursor-pointer flex items-center justify-between group">
                    Impact Stories <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-all" />
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Resources</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="hover:text-tata-blue cursor-pointer">NGO Partners</li>
                  <li className="hover:text-tata-blue cursor-pointer">Corporate Volunteering</li>
                  <li className="hover:text-tata-blue cursor-pointer">Media Toolkit</li>
                  <li className="hover:text-tata-blue cursor-pointer">Annual Reports</li>
                </ul>
              </section>

              <div className="pt-8 border-t border-slate-100">
                {isLoggedIn ? (
                  <button onClick={onLogout} className="w-full btn-outline border-red-200 text-red-500 hover:bg-red-50 cursor-pointer">Logout</button>
                ) : (
                  <>
                    <button onClick={() => { onNavigate("register-role"); onClose(); }} className="w-full btn-black mb-4 cursor-pointer">Register Now</button>
                    <button onClick={() => { onNavigate("login"); onClose(); }} className="w-full btn-outline cursor-pointer">Login</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default MegaMenu;
