import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { COMMUNITY_TESTIMONIALS } from "@/data/mockData";

const NGOHubView = () => {
  const { ngoData } = useAppContext();
  const navigate = useAppNavigate();

  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#003580] via-[#0046b8] to-[#00b4d8] text-white pt-16 pb-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-2">
                Welcome, {ngoData.firstName ?? "Anjali"}
              </h1>
              <p className="text-xl opacity-80">{ngoData.organization}</p>
            </div>
            <div className="flex flex-col gap-4 items-end">
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-3xl font-black">{ngoData.projects?.filter((p: any) => p.status === "Active").length ?? 2}</p>
                  <p className="text-xs text-white/50 uppercase tracking-widest">Active projects</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black">{ngoData.pendingApplications ?? 8}</p>
                  <p className="text-xs text-white/50 uppercase tracking-widest">Pending applications</p>
                </div>
              </div>
              <button onClick={() => navigate("ngo-dashboard")} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold border border-white/10 transition-all cursor-pointer text-center">
                Go to Dashboard →
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-16 pb-20">
        {/* Testimonials */}
        <h3 className="text-[13px] uppercase text-muted-foreground tracking-[0.08em] font-semibold mb-4 mt-20">Voices from volunteers</h3>
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
      </div>
    </div>
  );
};

export default NGOHubView;
