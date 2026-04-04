import { useState } from "react";
import { motion } from "framer-motion";
import { Info, Clock } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import ConsentModal from "@/components/shared/ConsentModal";

const RegisterFormView = () => {
  const { selectedRole, formData, setFormData, handleConsentAccept, triggerToast } = useAppContext();
  const navigate = useAppNavigate();
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [ngoSubmitted, setNgoSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === "corporate_spoc") {
      triggerToast("SPOC roles are assigned by TSG Admin. Your request has been submitted for review.");
      return;
    }
    if (selectedRole === "ngo") {
      setIsConsentOpen(true);
      return;
    }
    setIsConsentOpen(true);
  };

  const handleConsentAcceptLocal = () => {
    setIsConsentOpen(false);
    if (selectedRole === "ngo") {
      setNgoSubmitted(true);
      return;
    }
    handleConsentAccept();
  };

  if (ngoSubmitted) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-white">
        <div className="max-w-lg mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <Clock size={40} />
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">Application Submitted</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
              <p className="text-amber-800 font-semibold text-lg mb-2">Your application is under review.</p>
              <p className="text-amber-700 text-sm">TSG Admin will respond within 48 hours. You will receive an email notification once your account is approved.</p>
            </div>
            <p className="text-zinc-500 text-sm mb-8">
              In the meantime, if you have any questions, please contact us at <span className="font-semibold text-zinc-700">support@tataengage.com</span>
            </p>
            <button onClick={() => navigate("home")} className="btn-outline px-8 py-3 cursor-pointer">
              Return to Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const renderFields = () => {
    switch (selectedRole) {
      case "tata_employee":
        return (
          <>
            <div className="mb-6 p-5 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
              <Info size={20} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-semibold mb-1">Tata Employee Registration</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  If you have an official Tata email (@tata.com), enter it below for instant verification.
                  If you don't have a Tata email, use your personal email and provide your SPOC's email for manual verification.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Full Name*</label>
                <input type="text" required placeholder="Enter full name" className="form-input" />
              </div>
              <div>
                <label className="form-label">Tata Company*</label>
                <select required className="form-input">
                  <option value="">Select Company</option>
                  <option>Tata Consultancy Services</option>
                  <option>Tata Motors</option>
                  <option>Tata Steel</option>
                  <option>Tata Power</option>
                  <option>Titan Company</option>
                  <option>Tata Communications</option>
                  <option>Indian Hotels (IHCL)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Designation*</label>
                <input type="text" required placeholder="Enter designation" className="form-input" />
              </div>
              <div>
                <label className="form-label">Date of Birth*</label>
                <input type="date" required className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">City/Country*</label>
                <input type="text" required placeholder="Enter city, country" className="form-input" />
              </div>
              <div>
                <label className="form-label">LinkedIn URI</label>
                <input type="url" placeholder="https://linkedin.com/in/..." className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Email Address*</label>
                <input 
                  type="email" 
                  required 
                  placeholder="Enter work or personal email" 
                  className="form-input"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <p className="text-xs text-zinc-400 mt-1">Use your @tata.com email for instant verification</p>
              </div>
              <div>
                <label className="form-label">SPOC Email</label>
                <input type="email" placeholder="Enter your SPOC's email" className="form-input" />
                <p className="text-xs text-zinc-400 mt-1">Required if you don't have an official Tata email. Your company SPOC will verify your identity.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Professional Skills*</label>
                <input type="text" placeholder="e.g. Project Management, Coding" className="form-input" />
              </div>
              <div>
                <label className="form-label">Language Proficiency*</label>
                <input type="text" placeholder="e.g. English, Hindi" className="form-input" />
              </div>
            </div>
            <div>
              <label className="form-label">Area of Interest*</label>
              <select required className="form-input">
                <option value="">Select Interest</option>
                <option>Education</option>
                <option>Environment</option>
                <option>Livelihood</option>
                <option>Health</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Password*</label>
                <input type="password" required placeholder="••••••••" className="form-input" />
              </div>
              <div>
                <label className="form-label">Confirm Password*</label>
                <input type="password" required placeholder="••••••••" className="form-input" />
              </div>
            </div>
          </>
        );
      case "retired_employee":
        return (
          <>
            <div className="mb-6 p-5 bg-tata-purple/5 border border-tata-purple/15 rounded-2xl flex items-start gap-4">
              <Info size={20} className="text-tata-purple mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-tata-purple font-semibold mb-1">Retired Employee Registration</p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Welcome back to the Tata family! As a retiree, you'll need to provide a personal email and the email of a SPOC from your last Tata company who can confirm your service history.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Full Name*</label>
                <input type="text" required placeholder="Enter full name" className="form-input" />
              </div>
              <div>
                <label className="form-label">Last Tata Company*</label>
                <select required className="form-input">
                  <option value="">Select Company</option>
                  <option>Tata Consultancy Services</option>
                  <option>Tata Motors</option>
                  <option>Tata Steel</option>
                  <option>Tata Power</option>
                  <option>Titan Company</option>
                  <option>Tata Communications</option>
                  <option>Indian Hotels (IHCL)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Last Designation Held*</label>
                <input type="text" required placeholder="e.g. Senior Manager" className="form-input" />
              </div>
              <div>
                <label className="form-label">Year of Retirement*</label>
                <input type="number" required placeholder="e.g. 2022" min="1950" max="2026" className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Personal Email*</label>
                <input 
                  type="email" 
                  required 
                  placeholder="Enter personal email" 
                  className="form-input"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">SPOC / HR Email from Last Company*</label>
                <input type="email" required placeholder="Enter SPOC or HR contact email" className="form-input" />
                <p className="text-xs text-zinc-400 mt-1">This person will verify your employment history with the Tata Group.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Date of Birth*</label>
                <input type="date" required className="form-input" />
              </div>
              <div>
                <label className="form-label">City/Country*</label>
                <input type="text" required placeholder="Enter city, country" className="form-input" />
              </div>
            </div>
            <div>
              <label className="form-label">Areas of Interest*</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Education", "Environment", "Health", "Livelihood", "Mentoring", "Skill Development"].map(tag => (
                  <button key={tag} type="button" className="px-4 py-1.5 rounded-full border border-zinc-200 text-xs font-medium hover:bg-zinc-100 transition-colors">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Password*</label>
                <input type="password" required placeholder="••••••••" className="form-input" />
              </div>
              <div>
                <label className="form-label">Confirm Password*</label>
                <input type="password" required placeholder="••••••••" className="form-input" />
              </div>
            </div>
          </>
        );
      case "ngo":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">NGO Name*</label>
                <input type="text" placeholder="Enter NGO name" className="form-input" />
              </div>
              <div>
                <label className="form-label">Registration Number*</label>
                <input type="text" placeholder="Enter registration number" className="form-input" />
              </div>
            </div>
            <div>
              <label className="form-label">Email Address*</label>
              <input type="email" placeholder="Enter email" className="form-input" />
            </div>
            <div>
              <label className="form-label">Website</label>
              <input type="url" placeholder="https://www.ngo.org" className="form-input" />
            </div>
            <div>
              <label className="form-label">Address*</label>
              <textarea placeholder="Enter full address" className="form-input min-h-[100px]" />
            </div>
            <div>
              <label className="form-label">Focus Areas*</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Education", "Healthcare", "Rural Development", "Skill Development", "Sustainability"].map(tag => (
                  <button key={tag} type="button" className="px-4 py-1.5 rounded-full border border-zinc-200 text-xs font-medium hover:bg-zinc-100 transition-colors">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </>
        );
      case "family_member":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Personal Email*</label>
                <input type="email" required placeholder="Enter personal email" className="form-input" />
              </div>
              <div>
                <label className="form-label">Linked Tata Employee Email*</label>
                <input type="email" required placeholder="Enter employee email" className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Relation to Tata Employee*</label>
                <select required className="form-input">
                  <option value="">Select Relation</option>
                  <option>Spouse</option>
                  <option>Child</option>
                  <option>Parent</option>
                  <option>Sibling</option>
                </select>
              </div>
              <div>
                <label className="form-label">Full Name*</label>
                <input type="text" required placeholder="Enter full name" className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Tata Company (of Employee)*</label>
                <input type="text" required placeholder="Enter company" className="form-input" />
              </div>
              <div>
                <label className="form-label">Designation (of Employee)*</label>
                <input type="text" required placeholder="Enter designation" className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Date of Birth*</label>
                <input type="date" required className="form-input" />
              </div>
              <div>
                <label className="form-label">City/Country*</label>
                <input type="text" required placeholder="Enter city, country" className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Password*</label>
                <input type="password" required placeholder="••••••••" className="form-input" />
              </div>
              <div>
                <label className="form-label">Confirm Password*</label>
                <input type="password" required placeholder="••••••••" className="form-input" />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const roleLabel = selectedRole === "tata_employee" ? "Tata Employee" 
    : selectedRole === "retired_employee" ? "Retired Employee"
    : selectedRole === "ngo" ? "Partner Organisation" 
    : selectedRole === "family_member" ? "Family Member"
    : selectedRole?.replace("-", " ");

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-4xl font-bold text-zinc-900 mb-2">Create Your Account</h2>
            <p className="text-zinc-500 text-lg">Join our volunteering platform</p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-zinc-100 rounded-3xl p-8 md:p-12 shadow-sm"
        >
          <div className="mb-10">
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Register as {roleLabel}</h3>
            <div className="h-1 w-12 bg-tata-purple rounded-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderFields()}

            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              <button 
                type="button" 
                onClick={() => navigate("register-role")} 
                className="flex-1 btn-outline cursor-pointer"
              >
                Back
              </button>
              <button 
                type="submit" 
                className="flex-1 btn-black cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <ConsentModal
        isOpen={isConsentOpen}
        onAccept={handleConsentAcceptLocal}
        onCancel={() => setIsConsentOpen(false)}
      />
    </div>
  );
};

export default RegisterFormView;
