import { motion } from "framer-motion";
import { ShieldCheck, Mail, Globe, Send } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";

const OtpChannelView = () => {
  const { otpChannel, setOtpChannel, handleOtpChannelSelect } = useAppContext();
  const navigate = useAppNavigate();
  return (
  <div className="min-h-screen pt-20 flex items-center justify-center p-6 bg-slate-100">
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl p-10 text-center"
    >
      <div className="w-20 h-20 bg-tata-blue/10 text-tata-blue rounded-full flex items-center justify-center mx-auto mb-8">
        <ShieldCheck size={40} />
      </div>
      <h2 className="text-3xl font-bold text-tata-blue mb-4">Verify Your Account</h2>
      <p className="text-slate-500 mb-10">
        Choose how you would like to receive your verification code.
      </p>

      <div className="space-y-4 mb-10">
        <div 
          onClick={() => setOtpChannel("email")}
          className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${otpChannel === "email" ? "border-tata-blue bg-tata-blue/5" : "border-zinc-100 hover:border-zinc-200"}`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${otpChannel === "email" ? "bg-tata-blue text-white" : "bg-zinc-100 text-zinc-500"}`}>
              <Mail size={20} />
            </div>
            <div className="text-left">
              <div className="font-bold text-zinc-900">Email Address</div>
              <div className="text-xs text-zinc-500">Send OTP to your email</div>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${otpChannel === "email" ? "border-tata-blue" : "border-zinc-300"}`}>
            {otpChannel === "email" && <div className="w-3 h-3 bg-tata-blue rounded-full" />}
          </div>
        </div>

        <div 
          onClick={() => setOtpChannel("phone")}
          className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${otpChannel === "phone" ? "border-tata-blue bg-tata-blue/5" : "border-zinc-100 hover:border-zinc-200"}`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${otpChannel === "phone" ? "bg-tata-blue text-white" : "bg-zinc-100 text-zinc-500"}`}>
              <Globe size={20} />
            </div>
            <div className="text-left">
              <div className="font-bold text-zinc-900">Phone Number</div>
              <div className="text-xs text-zinc-500">Send OTP via SMS</div>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${otpChannel === "phone" ? "border-tata-blue" : "border-zinc-300"}`}>
            {otpChannel === "phone" && <div className="w-3 h-3 bg-tata-blue rounded-full" />}
          </div>
        </div>
      </div>

      <div className="mb-10 text-left">
        <label className="form-label">{otpChannel === "email" ? "Email Address" : "Phone Number"}</label>
        <input 
          type={otpChannel === "email" ? "email" : "tel"} 
          placeholder={otpChannel === "email" ? "Enter your email" : "Enter your phone number"} 
          className="form-input"
        />
      </div>

      <button onClick={handleOtpChannelSelect} className="w-full btn-black py-4 text-lg mb-6 cursor-pointer">Verify Password</button>
      
      <button onClick={() => navigate("register-form")} className="text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">
        Back to Form
      </button>
    </motion.div>
  </div>
  );
};

export default OtpChannelView;
