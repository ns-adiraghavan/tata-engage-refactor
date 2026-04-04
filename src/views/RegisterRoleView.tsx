import { motion } from "framer-motion";
import { User, Users, Building2, Briefcase, Heart, ShieldCheck } from "lucide-react";
import type { Role } from "@/types";
import { useAppContext } from "@/context/AppContext";

const RegisterRoleView = () => {
  const { selectedRole, navigate, handleRoleSelect } = useAppContext();
  return (
  <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-white">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-center mb-6">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG2f-xo_Z2La9Y0SPnOLqZWBtorh4oXrzkVg&s" 
              alt="TATA engage" 
              className="h-16 md:h-20 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-4xl font-bold text-zinc-900 mb-2">Create Your Account</h2>
          <p className="text-zinc-500 text-lg">Join our volunteering platform</p>
        </motion.div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-3xl p-8 md:p-12 shadow-sm">
        <h3 className="text-xl font-bold text-zinc-900 mb-8">Select Your Role</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { id: "volunteer", title: "Individual Volunteer", icon: User, desc: "For citizens who want to volunteer" },
            { id: "ngo", title: "NGO Representative", icon: Heart, desc: "For non-profits looking for support" },
            { id: "tata_employee", title: "Tata Employee", icon: Briefcase, desc: "Exclusive for Tata Group employees" },
            { id: "family_member", title: "Family Member", icon: Users, desc: "For family of Tata employees" },
            { id: "corporate_spoc", title: "Corporate SPOC", icon: Building2, desc: "For company volunteering leads" },
            { id: "platform_admin", title: "Platform Admin", icon: ShieldCheck, desc: "For platform managers" }
          ].map((role, i) => (
            <motion.div 
              key={role.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleRoleSelect(role.id as Role)}
              className={`role-card ${selectedRole === role.id ? 'active' : ''}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedRole === role.id ? 'bg-tata-purple text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                <role.icon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-1">{role.title}</h4>
                <p className="text-xs text-zinc-500 leading-tight">{role.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-100 text-center">
          <p className="text-sm text-zinc-500">
            Already have an account? <button onClick={() => navigate("login")} className="font-bold text-zinc-900 hover:underline cursor-pointer">Login here</button>
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button onClick={() => navigate("home")} className="text-zinc-400 hover:text-zinc-600 text-sm font-medium transition-colors cursor-pointer">
          Back to Home
        </button>
      </div>
    </div>
  </div>
  );
};

export default RegisterRoleView;
