import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const OtpView = () => {
  const { otp, setOtp, handleOtpVerify } = useAppContext();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const handleChange = useCallback((index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp, setOtp]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  }, [otp, setOtp]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center p-6 bg-slate-100">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center"
      >
        <div className="w-20 h-20 bg-tata-cyan/10 text-tata-cyan rounded-full flex items-center justify-center mx-auto mb-8">
          <Mail size={40} />
        </div>
        <h2 className="text-3xl font-bold text-tata-blue mb-4">Verify Your Email</h2>
        <p className="text-slate-500 mb-10">
          We've sent a 6-digit verification code to your email address. Please enter it below.
        </p>

        <div className="flex justify-center gap-3 mb-10" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input 
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-14 h-16 text-center text-2xl font-bold bg-white border-2 border-slate-300 rounded-lg focus:border-tata-blue focus:ring-2 focus:ring-tata-blue/20 focus:outline-none transition-all shadow-sm"
            />
          ))}
        </div>

        <button onClick={handleOtpVerify} className="w-full btn-black py-4 text-lg mb-6 cursor-pointer">Verify & Complete</button>
        
        <div className="text-sm text-zinc-500">
          {canResend ? (
            <p>
              Didn't receive the code?{" "}
              <button onClick={handleResend} className="font-bold text-tata-blue hover:underline cursor-pointer">
                Resend Code
              </button>
            </p>
          ) : (
            <p>
              Resend code in <span className="font-bold text-zinc-900">{countdown}s</span>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OtpView;
