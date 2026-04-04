import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const RegisterFormView = () => {
  const { selectedRole, formData, setFormData, handleFormSubmit } = useAppContext();
  const navigate = useAppNavigate();
  const renderFields = () => {
    switch (selectedRole) {
      case "volunteer":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">First Name*</label>
                <input type="text" required placeholder="Enter first name" className="form-input" />
              </div>
              <div>
                <label className="form-label">Last Name*</label>
                <input type="text" required placeholder="Enter last name" className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Email Address*</label>
                <input type="email" required placeholder="Enter email" className="form-input" />
              </div>
              <div>
                <label className="form-label">Phone Number*</label>
                <input type="tel" required placeholder="Enter phone number" className="form-input" />
              </div>
            </div>
            <div>
              <label className="form-label">Date of Birth*</label>
              <input type="date" required className="form-input" />
              <p className="text-[10px] text-zinc-400 mt-1">Must be 18+ for volunteer eligibility</p>
            </div>
            <div>
              <label className="form-label">Areas of Interest*</label>
              <textarea placeholder="Tell us what you are passionate about..." className="form-input min-h-[80px] mb-3" />
              <div className="flex flex-wrap gap-2">
                {["Environment", "Education", "Health", "Livelihood", "Disaster Response", "Animal Welfare", "Women Empowerment"].map(tag => (
                  <button key={tag} type="button" className="px-4 py-1.5 rounded-full border border-zinc-200 text-xs font-medium hover:bg-zinc-100 transition-colors">
                    {tag}
                  </button>
                ))}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Email Address*</label>
                <input type="email" placeholder="Enter email" className="form-input" />
              </div>
              <div>
                <label className="form-label">Phone Number*</label>
                <input type="tel" placeholder="Enter phone number" className="form-input" />
              </div>
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
      case "tata_employee":
        return (
          <>
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
                  placeholder="Enter work email" 
                  className="form-input"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Alternate Email</label>
                <input type="email" placeholder="Enter personal email" className="form-input" />
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
      case "corporate_spoc":
        return (
          <>
            <div className="mb-6 p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
              <Info size={20} className="text-amber-600 mt-1 shrink-0" />
              <p className="text-sm text-amber-800 leading-relaxed">
                <span className="font-bold">Note:</span> SPOC roles are assigned by TSG Admin. Your request has been submitted for review. You will receive an email once your account is activated.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Email Address*</label>
                <input type="email" required placeholder="Enter work email" className="form-input" />
              </div>
              <div>
                <label className="form-label">Phone Number*</label>
                <input type="tel" required placeholder="Enter phone number" className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Company Name*</label>
                <input type="text" required placeholder="Enter company name" className="form-input" />
              </div>
              <div>
                <label className="form-label">Designation*</label>
                <input type="text" required placeholder="Enter designation" className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Employee ID*</label>
                <input type="text" required placeholder="Enter employee ID" className="form-input" />
              </div>
              <div>
                <label className="form-label">Department*</label>
                <input type="text" required placeholder="Enter department" className="form-input" />
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
      case "platform_admin":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">First Name*</label>
                <input type="text" required placeholder="Enter first name" className="form-input" />
              </div>
              <div>
                <label className="form-label">Last Name*</label>
                <input type="text" required placeholder="Enter last name" className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Email Address*</label>
                <input type="email" required placeholder="Enter admin email" className="form-input" />
              </div>
              <div>
                <label className="form-label">Phone Number*</label>
                <input type="tel" required placeholder="Enter phone number" className="form-input" />
              </div>
            </div>
            <div>
              <label className="form-label">Admin Code*</label>
              <input type="password" required placeholder="Enter authorization code" className="form-input" />
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
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Register as {selectedRole === "ngo" ? "NGO" : selectedRole?.replace("-", " ")}</h3>
            <div className="h-1 w-12 bg-tata-purple rounded-full" />
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
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
    </div>
  );
};

export default RegisterFormView;
