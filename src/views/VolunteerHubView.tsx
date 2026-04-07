import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { COMMUNITY_TESTIMONIALS, IS_PE_SEASON } from "@/data/mockData";
import { FileText, Mail, MessageSquare, Calendar, Briefcase, Zap } from "lucide-react";

const TESTIMONIAL_BG = ['bg-tata-blue', 'bg-violet-700', 'bg-emerald-800', 'bg-amber-700'];

const VolunteerHubView = () => {
  const { user } = useAuth();
  const navigate = useAppNavigate();
  const { referralCount, triggerToast } = useAppContext();
  const isProEngageActive = true;

  const copyReferralLink = () => {
    navigator.clipboard.writeText("https://tataengage.com/refer/priya123");
    triggerToast("Referral link copied to clipboard!");
  };

  const programmes = [
    { label: "TVW", nav: "tvw", bgClass: "bg-tata-cyan/20", iconClass: "text-tata-blue", Icon: Calendar },
    { label: "ProEngage", nav: "proengage", bgClass: "bg-violet-100", iconClass: "text-violet-600", Icon: Briefcase },
    { label: "Disaster Response", nav: "disaster-response", bgClass: "bg-red-100", iconClass: "text-red-600", Icon: Zap },
  ];

  const stats = [
    { num: user.history?.length ?? 0, label: "Projects completed", sub: "All time" },
    { num: (user.hoursVolunteered != null ? `${user.hoursVolunteered}h` : "48h"), label: "Hours volunteered", sub: "This edition" },
    { num: user.badges?.length ?? 0, label: "Badges earned", sub: "All time" },
  ];

  return (
    <div className="pt-20 pb-20 bg-slate-50 min-h-screen">
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
              {/* CHANGE 4 — PE-aware subtext */}
              <p className="text-sm text-white/70 mt-3">
                {IS_PE_SEASON
                  ? "ProEngage is open — browse projects matched to your skills."
                  : "Stay connected — TVW is coming soon."}
              </p>
              {/* Badges strip */}
              {user.badges && user.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {user.badges.map((badge: any) => (
                    <span key={badge.id} className="bg-white/15 border border-white/20 rounded-full px-3 py-1 text-xs text-white font-semibold">
                      {badge.icon} {badge.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate("my-applications")} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold border border-white/10 transition-all cursor-pointer">My Applications</button>
                <button onClick={() => navigate("profile")} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold border border-white/10 transition-all cursor-pointer">Profile</button>
                <button onClick={() => navigate("dashboard")} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold border border-white/10 transition-all cursor-pointer">My Dashboard →</button>
                {isProEngageActive && (
                  <button onClick={() => navigate("proengage")} className="px-5 py-2.5 bg-white text-[#003580] hover:bg-white/90 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-sm">Find Projects</button>
                )}
              </div>
              {/* CHANGE 5 — Back to dashboard link */}
              <button onClick={() => navigate("dashboard")} className="text-sm text-white/70 hover:text-white underline cursor-pointer text-left">
                View my dashboard →
              </button>
            </div>
          </div>
          {/* Impact strip — CHANGE 2: vertical card pattern */}
          <div className="mt-8 pt-6 border-t border-white/10 flex gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.num}</p>
                <p className="text-xs font-bold text-slate-400 uppercase">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ PROGRAMME TILES — CHANGE 1 ═══ */}
        <h3 className="text-[13px] uppercase text-muted-foreground tracking-[0.08em] font-semibold mb-4">Programmes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {programmes.map((p) => (
            <button
              key={p.label}
              onClick={() => navigate(p.nav)}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm text-left hover:shadow-md transition-all cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${p.bgClass} mb-4`}>
                <p.Icon size={22} className={p.iconClass} />
              </div>
              <p className="text-sm font-bold text-slate-900">{p.label}</p>
            </button>
          ))}
        </div>

        {/* ═══ FEATURED TESTIMONIAL ═══ */}
        <h3 className="text-[13px] uppercase text-muted-foreground tracking-[0.08em] font-semibold mb-4">From the community</h3>
        {COMMUNITY_TESTIMONIALS[0] && (() => {
          const ft = COMMUNITY_TESTIMONIALS[0];
          return (
            <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-6 flex gap-6 items-start mb-12">
              <span className="text-5xl font-black text-tata-cyan leading-none">"</span>
              <div>
                <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">Verified story</span>
                <p className="text-sm text-slate-700 italic mb-3 mt-2">"{ft.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-tata-blue/10 text-tata-blue text-xs font-bold flex items-center justify-center">{ft.avatar}</div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{ft.author}</p>
                    <p className="text-xs text-slate-400">{ft.role}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ═══ TESTIMONIALS — CHANGE 3 ═══ */}
        <h3 className="text-[13px] uppercase text-muted-foreground tracking-[0.08em] font-semibold mb-4">Voices from the community</h3>
        <div className="flex gap-6 overflow-x-auto pb-4 mb-12">
          {COMMUNITY_TESTIMONIALS.map((t, i) => (
            <div key={t.id} className={`min-w-[320px] max-w-sm p-6 rounded-2xl flex-shrink-0 shadow-sm ${TESTIMONIAL_BG[i % TESTIMONIAL_BG.length]}`}>
              <p className="text-sm text-white/90 italic mb-4">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold">{t.avatar}</div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.author}</p>
                  <p className="text-xs text-white/60">{t.role}</p>
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
