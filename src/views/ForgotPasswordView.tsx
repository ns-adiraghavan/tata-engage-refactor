import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const ForgotPasswordView = () => {
  const navigate = useAppNavigate();
  return (
  <div className="min-h-screen pt-20 flex items-center justify-center p-6 bg-slate-100">
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl p-10"
    >
      <button onClick={() => navigate("login")} className="flex items-center gap-2 text-slate-500 hover:text-tata-blue font-medium mb-8 transition-colors cursor-pointer">
        <ArrowLeft size={18} /> Back to Login
      </button>

      <h2 className="text-3xl font-bold text-tata-blue mb-4">Reset Password</h2>
      <p className="text-slate-500 mb-8">
        Enter your email address or phone number and we'll send you instructions to reset your password.
      </p>

      <form className="space-y-6">
        <div>
          <label className="form-label">Email Address / Phone Number</label>
          <input type="text" required placeholder="Enter email or phone" className="form-input" />
        </div>
        <button type="button" className="w-full btn-black py-4 text-lg cursor-pointer">Send Reset Link</button>
      </form>
    </motion.div>
  </div>
  );
};

export default ForgotPasswordView;
