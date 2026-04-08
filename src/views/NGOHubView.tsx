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
        {/* Banner */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 md:p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Featured
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Driving impact through skilled volunteering
              </h2>
              <p className="text-sm text-slate-600">
                Showcase your organisation's ongoing work, highlight volunteer impact, and bring visibility to your current programmes.
              </p>
            </div>
            <div className="w-full h-48 md:h-56 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 text-sm">
              Image placeholder
            </div>
          </div>
        </div>

        {/* Edition KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Edition", value: "ProEngage 2025" },
            { label: "Live Projects", value: ngoData.projects?.filter((p: any) => p.status === "Active").length ?? 2 },
            { label: "My Past Edition", value: "2024" },
            { label: "Badges Earned", value: "3" },
          ].map((kpi, i) => (
            <div
              key={i}
              className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4"
            >
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                {kpi.label}
              </p>
              <p className="text-xl font-black text-tata-blue">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Community Section */}
        <div className="space-y-10 mt-16">

          {/* Voices */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Voices from volunteers
            </p>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {COMMUNITY_TESTIMONIALS.map((t) => (
                <div
                  key={t.id}
                  className="min-w-[320px] max-w-sm p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex-shrink-0"
                >
                  <p className="text-sm text-slate-700 italic mb-4">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#003580] text-white flex items-center justify-center text-xs font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{t.author}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback summary */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Feedback snapshot
            </p>
            <p className="text-sm text-slate-600">
              Volunteers are actively engaging across your projects. Feedback submission rate is strong, with a few pending inputs.
            </p>
          </div>

          {/* Conversations placeholder */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Conversations
            </p>
            <p className="text-sm text-slate-600">
              Volunteer and coordinator conversations will surface here in future iterations.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NGOHubView;
