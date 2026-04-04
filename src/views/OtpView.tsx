import { motion } from "framer-motion";
import { Mail, Globe } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const OtpView = () => {
  const { otp, setOtp, otpChannel, handleOtpVerify } = useAppContext();
  return (
  <div className="min-h-screen pt-20 flex items-center justify-center p-6 bg-slate-100">
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center"
    >
      <div className="w-20 h-20 bg-tata-cyan/10 text-tata-cyan rounded-full flex items-center justify-center mx-auto mb-8">
        {otpChannel === "email" ? <Mail size={40} /> : <Globe size={40} />}
      </div>
      <h2 className="text-3xl font-bold text-tata-blue mb-4">Verify Your {otpChannel === "email" ? "Email" : "Phone"}</h2>
      <p className="text-slate-500 mb-10">
        We've sent a 6-digit verification code to your {otpChannel === "email" ? "email address" : "phone number"}. Please enter it below.
      </p>

      <div className="flex justify-between gap-2 mb-10">
        {otp.map((digit, i) => (
          <input 
            key={i}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => {
              const newOtp = [...otp];
              newOtp[i] = e.target.value;
              setOtp(newOtp);
              if (e.target.value && i < 5) {
                const next = e.target.nextElementSibling as HTMLInputElement;
                next?.focus();
              }
            }}
            className="w-12 h-16 text-center text-2xl font-bold bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-tata-blue focus:outline-none transition-all"
          />
        ))}
      </div>

      <button onClick={handleOtpVerify} className="w-full btn-black py-4 text-lg mb-6 cursor-pointer">Verify & Complete</button>
      
      <p className="text-sm text-zinc-500">
        Didn't receive the code? <button className="font-bold text-zinc-900 hover:underline cursor-pointer">Resend Code</button>
      </p>
    </motion.div>
  </div>
  );
};

export default OtpView;
