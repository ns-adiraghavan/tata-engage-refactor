import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { COMMUNITY_TESTIMONIALS } from "@/data/mockData";
import { FileText, Mail, MessageSquare } from "lucide-react";

const VolunteerHubView = () => {
  const { user } = useAuth();
  const navigate = useAppNavigate();
  const { referralCount, triggerToast, isProEngageActive } = useAppContext();
  const proEngageActive = isProEngageActive ?? true;

  const copyReferralLink = () => {
    navigator.clipboard.writeText("https://tataengage.com/refer/priya123");
    triggerToast("Referral link copied to clipboard!");
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ═══ HERO ═══ */}
        <div className="mb-10 rounded-3xl bg-gradient-to-br from-[#003580] via-[#0046b8] to-[#00b4d8] text-white p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-xs font-bold text-white/50 uppercase tracking-[0.3em] mb-2">
                {new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 17 ? "Good Afternoon" : "Good Evening"}
              </p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{user.firstName} 👋</h1>
              <p className="text-white/60 text-sm mt-1">{user.company} · {user.designation}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate("my-applications")} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold border border-white/10 transition-all cursor-pointer">My Applications</button>
              <button onClick={() => navigate("profile")} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold border border-white/10 transition-all cursor-pointer">Profile</button>
              <button onClick={() => navigate("dashboard")} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold border border-white/10 transition-all cursor-pointer">My Dashboard →</button>
              {proEngageActive && (
                <button onClick={() => navigate("proengage")} className="px-5 py-2.5 bg-white text-[#003580] hover:bg-white/90 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg">Find Projects</button>
              )}
            </div>
          </div>
          {/* Impact strip */}
          <div className="mt-8 pt-6 border-t border-white/10 flex gap-8">
            {[
              { num: user.history?.length ?? 0, label: "Projects completed" },
              { num: "48h", label: "Hours volunteered" },
              { num: user.badges?.length ?? 0, label: "Badges earned" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-black">{stat.num}</p>
                <p className="text-xs text-white/50 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ TESTIMONIALS ═══ */}
        <h3 className="text-[13px] uppercase text-muted-foreground tracking-[0.08em] font-semibold mb-4">Voices from the community</h3>
        <div className="flex gap-6 overflow-x-auto pb-4 mb-12">
          {COMMUNITY_TESTIMONIALS.map((t) => (
            <div key={t.id} className="min-w-[320px] max-w-sm p-6 bg-white rounded-2xl border border-slate-100 flex-shrink-0 shadow-sm">
              <p className="text-sm text-slate-700 italic mb-4">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#003580] text-white flex items-center justify-center text-xs font-bold">{t.avatar}</div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.author}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ═══ REFER A COLLEAGUE ═══ */}
        <h3 className="text-[13px] uppercase text-muted-foreground tracking-[0.08em] font-semibold mb-4">Refer a Colleague</h3>
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden relative max-w-xl mb-8">
          <div className="absolute top-0 right-0 w-24 h-24 bg-tata-cyan/5 rounded-full -mr-12 -mt-12" />
          <p className="text-sm text-slate-500 mb-6">Invite someone to Tata Engage and help grow our community.</p>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
            <div className="text-xs font-bold text-slate-400 uppercase mb-2">Your Referral Link</div>
            <div className="flex items-center justify-between gap-2">
              <code className="text-xs text-tata-blue font-mono truncate">tataengage.com/refer/priya123</code>
              <button onClick={copyReferralLink} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-tata-blue transition-colors cursor-pointer">
                <FileText size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              You've referred <span className="font-bold text-zinc-900">{referralCount} person</span> so far
            </div>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-tata-blue hover:text-white transition-all cursor-pointer"><Mail size={14} /></button>
              <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-green-500 hover:text-white transition-all cursor-pointer"><MessageSquare size={14} /></button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default VolunteerHubView;
