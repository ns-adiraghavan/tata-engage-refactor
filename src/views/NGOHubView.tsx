import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { COMMUNITY_TESTIMONIALS } from "@/data/mockData";

const NGOHubView = () => {
  const { ngoData } = useAppContext();
  const navigate = useAppNavigate();

  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        {/* Hero */}
        <div className="relative min-h-[420px] md:min-h-[480px] bg-zinc-950 rounded-3xl overflow-hidden mb-10 flex items-end">
          <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1600" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/60 to-transparent" />
          <div className="relative z-10 p-8 md:p-12 w-full">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/70 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-tata-cyan inline-block" />
              Tata Group · Partner NGO
            </span>
            <h1 className="font-serif text-5xl md:text-7xl text-white leading-[0.95] tracking-tight mb-2">
              Welcome, {ngoData.firstName ?? "Anjali"}!
            </h1>
            <p className="text-white/50 text-sm mt-1 mb-6">{ngoData.organization} · Lead Partner</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate("ngo-dashboard")} className="bg-white text-zinc-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-all cursor-pointer">Go to Dashboard →</button>
            </div>
          </div>
        </div>

        {/* ═══ STAT TILES ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Active Projects", value: ngoData.projects?.filter((p: any) => p.status === "Active").length ?? 2, border: "border-tata-cyan", dot: "bg-cyan-100 text-tata-cyan" },
            { label: "Pending Applications", value: ngoData.pendingApplications ?? 8, border: "border-violet-400", dot: "bg-violet-100 text-violet-500" },
            { label: "Edition", value: "ProEngage 2025", border: "border-amber-400", dot: "bg-amber-100 text-amber-500" },
            { label: "Badges Earned", value: "3", border: "border-red-400", dot: "bg-red-100 text-red-500" },
          ].map((kpi, i) => {
            const tileBg = ["bg-cyan-50 border-cyan-100", "bg-violet-50 border-violet-100", "bg-amber-50 border-amber-100", "bg-red-50 border-red-100"][i];
            return (
              <div key={i} className={`${tileBg} border border-l-4 ${kpi.border} rounded-2xl shadow-sm p-5 relative`}>
                <div className={`absolute top-4 right-4 w-8 h-8 rounded-full ${kpi.dot} flex items-center justify-center text-xs font-bold`}>•</div>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              </div>
            );
          })}
        </div>

        {/* Banner */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 md:p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Featured</p>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">Driving impact through skilled volunteering</h2>
              <p className="text-sm text-slate-600">Showcase your organisation's ongoing work, highlight volunteer impact, and bring visibility to your current programmes.</p>
            </div>
            <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop" alt="NGO volunteering activity" className="w-full h-48 md:h-56 object-cover rounded-2xl" referrerPolicy="no-referrer" />
          </div>
        </div>

        {/* NGO Profile */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 mb-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Organisation</p>
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">NGO Profile</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Registered Name</p><p className="font-semibold text-slate-800">{ngoData.organization}</p></div>
            <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Partnership Tier</p><p className="font-semibold text-orange-600">{ngoData.tier}</p></div>
            <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Primary Contact</p><p className="font-semibold text-slate-800">{ngoData.firstName} {ngoData.lastName}</p></div>
          </div>
        </div>

        {/* NGO Identity */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Focus Areas
              </p>
              <p className="text-sm text-slate-700">
                Education · Livelihood · Women Empowerment
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Operating Cities
              </p>
              <p className="text-sm text-slate-700">
                Mumbai · Pune · Delhi
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Partnership
              </p>
              <p className="text-sm text-slate-700">
                Partner Since 2022 · Lead Partner
              </p>
            </div>
          </div>
        </div>

        {/* Featured Story */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 md:p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <img
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop"
              alt="Volunteer teaching session"
              className="w-full h-56 md:h-64 object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Featured Story
              </p>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-3">
                Enabling digital literacy for underserved communities
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Through ProEngage, volunteers helped design and implement a digital learning programme reaching over 500 learners across multiple cities.
              </p>
              <p className="text-sm italic text-slate-700">
                "The volunteers brought structure and scale to our programme in ways we couldn't have achieved alone."
              </p>
            </div>
          </div>
        </div>

        {/* Community Section */}
        <div className="space-y-10 mt-16">

          {/* Voices */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Voices from volunteers
            </p>

            <div className="flex items-center gap-4 my-6">
              <div className="h-px flex-1 bg-slate-200" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                More voices
              </p>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

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
