import { motion } from "framer-motion";
import { Users, Briefcase, CalendarDays, ShieldCheck } from "lucide-react";
import { ROHAN_DESAI, COMMUNITY_TESTIMONIALS } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { PENDING_APPROVALS_DATA } from "@/data/mockData";

const SPOCHubView = () => {
  const spoc = ROHAN_DESAI;
  const navigate = useAppNavigate();

  const stats = [
    { label: "Total Volunteers", value: spoc.stats.totalVolunteers.toLocaleString(), sub: "TCS Global", icon: Users, color: "text-[#003580]", bg: "bg-blue-50", border: "border-blue-100" },
    { label: "Active ProEngage", value: spoc.stats.activeProEngage, sub: "Ongoing Projects", icon: Briefcase, color: "text-[#00b4d8]", bg: "bg-cyan-50", border: "border-cyan-100" },
    { label: "TVW Events", value: spoc.stats.tvwEvents, sub: "This Edition", icon: CalendarDays, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
    { label: "Pending Verifications", value: PENDING_APPROVALS_DATA.filter((a: any) => a.status === "Pending").length, sub: "Action Required", icon: ShieldCheck, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
  ];

  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#003580] via-[#0046b8] to-[#00b4d8] text-white pt-16 pb-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-xs font-bold text-white/50 uppercase tracking-[0.3em] mb-2">Corporate SPOC</p>
            <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight">Welcome, {spoc.firstName} 👋</h1>
            <p className="text-white/60 text-sm mt-1">{spoc.company} · Corporate SPOC</p>
          </div>
          <button onClick={() => navigate("spoc-dashboard")} className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer">
            Go to Dashboard →
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-16 pb-20">
        {/* KPI tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl bg-white border ${stat.border} shadow-sm hover:shadow-lg transition-all`}
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

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
