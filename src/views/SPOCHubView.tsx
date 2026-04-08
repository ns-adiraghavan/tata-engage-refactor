import { motion } from "framer-motion";
import { Users, Briefcase, CalendarDays, ShieldCheck } from "lucide-react";
import { ROHAN_DESAI, COMMUNITY_TESTIMONIALS } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useAuth } from "@/context/AuthContext";
import { PENDING_APPROVALS_DATA } from "@/data/mockData";
import RoleToggle from "@/components/shared/RoleToggle";

const SPOCHubView = () => {
  const spoc = ROHAN_DESAI;
  const navigate = useAppNavigate();
  const { user } = useAuth();
  const showToggle = user?.role?.includes("spoc") || user?.role === "corporate_spoc";

  const stats = [
    { label: "Total Volunteers", value: spoc.stats.totalVolunteers.toLocaleString(), sub: "TCS Global", icon: Users, borderAccent: "border-tata-cyan", dot: "bg-cyan-100 text-tata-cyan" },
    { label: "Active ProEngage", value: spoc.stats.activeProEngage, sub: "Ongoing Projects", icon: Briefcase, borderAccent: "border-violet-400", dot: "bg-violet-100 text-violet-500" },
    { label: "TVW Events", value: spoc.stats.tvwEvents, sub: "This Edition", icon: CalendarDays, borderAccent: "border-amber-400", dot: "bg-amber-100 text-amber-500" },
    { label: "Pending Verifications", value: PENDING_APPROVALS_DATA.filter((a: any) => a.status === "Pending").length, sub: "Action Required", icon: ShieldCheck, borderAccent: "border-red-400", dot: "bg-red-100 text-red-500" },
  ];

  return (
    <div className="pt-20 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
      {/* Hero */}
      <div className="relative min-h-[420px] md:min-h-[480px] bg-zinc-950 rounded-3xl overflow-hidden mb-10 flex items-end">
        <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1600" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/60 to-transparent" />
        <div className="relative z-10 p-8 md:p-12 w-full">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/70 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-tata-cyan inline-block" />
            Tata Group · SPOC Portal
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-white leading-[0.95] tracking-tight mb-2">
            Welcome, {spoc.firstName}!
          </h1>
          <p className="text-white/50 text-sm mt-1 mb-6">{spoc.company} · Corporate SPOC</p>
          {showToggle && <RoleToggle activeView="spoc" className="mb-6" />}
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate("spoc-dashboard")} className="bg-white text-zinc-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-all cursor-pointer">Go to Dashboard →</button>
          </div>
        </div>
      </div>
        {/* KPI tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => {
            const tileBg = ["bg-cyan-50 border-cyan-100", "bg-violet-50 border-violet-100", "bg-amber-50 border-amber-100", "bg-red-50 border-red-100"][i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`${tileBg} border border-l-4 ${stat.borderAccent} rounded-2xl shadow-sm p-5 relative`}
              >
                <div className={`absolute top-4 right-4 w-8 h-8 rounded-full ${stat.dot} flex items-center justify-center text-xs font-bold`}>•</div>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {spoc.badges && spoc.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {spoc.badges.map((badge: any) => (
              <span key={badge.id} className="bg-white/15 border border-white/20 rounded-full px-3 py-1 text-xs text-white font-semibold">
                {badge.icon} {badge.name}
              </span>
            ))}
          </div>
        )}

        {/* Testimonials */}
        <h3 className="text-[13px] uppercase text-muted-foreground tracking-[0.08em] font-semibold mb-4">Voices from volunteers</h3>
        <div className="flex gap-6 overflow-x-auto pb-4 mb-12">
          {COMMUNITY_TESTIMONIALS.map((t) => (
            <div key={t.id} className="min-w-[300px] max-w-sm p-5 bg-white rounded-2xl border border-slate-100 flex-shrink-0 shadow-sm">
              <p className="text-sm text-slate-700 italic mb-3">"{t.quote}"</p>
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
      </div>
    </div>
  );
};

export default SPOCHubView;
