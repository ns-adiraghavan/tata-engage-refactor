import { motion } from "framer-motion";
import { Building2, ShieldCheck, Landmark } from "lucide-react";
import { useLocation } from "react-router-dom";
import tataEngageLogoNoBg from "@/assets/tata-engage-logo-nobg.png";
import { VIKRAM_NAIR, ROHAN_DESAI, PRIYA_SHARMA, ANJALI_MEHTA } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";

const LoginView = () => {
  const { setIsLoggedIn, setUser } = useAuth();
  const navigate = useAppNavigate();
  const { triggerToast } = useAppContext();
  const location = useLocation();
  const isAdminLogin = location.pathname === "/admin-login";

  return (
  <div className="min-h-screen pt-20 flex items-center justify-center p-6 bg-slate-100 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full z-0">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tata-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tata-cyan/10 rounded-full blur-3xl" />
    </div>

    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md glass rounded-3xl p-10 relative z-10"
    >
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <img 
            src={tataEngageLogoNoBg} 
            alt="TATA engage" 
            className="h-16 md:h-20 object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
        <p className="text-slate-500 text-sm mt-2">
          {isAdminLogin ? "Login to your admin dashboard" : "Login to your volunteering dashboard"}
        </p>
      </div>

      {!isAdminLogin && (
        <>
          <button 
            onClick={() => {
              setIsLoggedIn(true);
              setUser(PRIYA_SHARMA);
              navigate("dashboard");
              triggerToast("Login Successful! Welcome back, Priya.");
            }}
            className="w-full flex items-center justify-center gap-3 bg-[#003580] text-white py-4 rounded-2xl font-bold hover:bg-[#002a66] transition-all mb-6 cursor-pointer shadow-lg shadow-blue-900/20"
          >
            <ShieldCheck size={20} />
            Tata Employee SSO
          </button>

          <button 
            onClick={() => {
              setIsLoggedIn(true);
              setUser(ROHAN_DESAI);
              navigate("spoc-dashboard");
              triggerToast("Login Successful! Welcome back, Rohan.");
            }}
            className="w-full flex items-center justify-center gap-3 bg-[#00b4d8] text-tata-blue py-4 rounded-2xl font-bold hover:bg-[#00a0c2] transition-all mb-6 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Building2 size={20} />
            Login as SPOC
          </button>

          <button 
            onClick={() => {
              setIsLoggedIn(true);
              setUser(ANJALI_MEHTA);
              navigate("ngo-dashboard");
              triggerToast("Login Successful! Welcome back, Anjali.");
            }}
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all mb-6 cursor-pointer shadow-lg shadow-emerald-600/20"
          >
            <Landmark size={20} />
            Login as NGO
          </button>
        </>
      )}

      {isAdminLogin && (
        <button 
          onClick={() => {
            setIsLoggedIn(true);
            setUser(VIKRAM_NAIR);
            navigate("admin-dashboard");
            triggerToast("Login Successful! Welcome, Vikram Nair.");
          }}
          className="w-full flex items-center justify-center gap-3 bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all mb-6 cursor-pointer shadow-lg shadow-zinc-900/20"
        >
          <ShieldCheck size={20} />
          Login as Admin (Vikram Nair)
        </button>
      )}

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Or Login With</span></div>
      </div>

      <form className="space-y-5">
        <div>
          <label className="form-label">Email Address / Phone Number</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input type="text" placeholder="Enter email or phone" className="form-input pl-12" />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="form-label mb-0">Password</label>
            <button onClick={() => navigate("forgot-password")} type="button" className="text-xs font-bold text-zinc-900 hover:underline cursor-pointer">Forgot Password?</button>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input type="password" placeholder="••••••••" className="form-input pl-12 pr-12" />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 cursor-pointer"><Eye size={18} /></button>
          </div>
        </div>
        <button onClick={() => { setIsLoggedIn(true); setUser(isAdminLogin ? VIKRAM_NAIR : PRIYA_SHARMA); navigate(isAdminLogin ? "admin-dashboard" : "dashboard"); triggerToast("Login Successful!"); }} type="button" className="w-full btn-black py-4 text-lg mt-4 cursor-pointer">Log In</button>
      </form>

      {!isAdminLogin && (
        <p className="text-center text-sm text-slate-500 mt-8">
          Don't have an account? <button onClick={() => navigate("register-role")} className="font-bold text-tata-blue hover:underline cursor-pointer">Register Now</button>
        </p>
      )}
    </motion.div>
  </div>
  );
};

export default LoginView;
