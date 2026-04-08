import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { COMMUNITY_TESTIMONIALS, IS_PE_SEASON, ROHAN_DESAI_VOLUNTEER } from "@/data/mockData";
import { FileText, Mail, MessageSquare, Users, HeartHandshake, AlertTriangle } from "lucide-react";
import RoleToggle from "@/components/shared/RoleToggle";

const TESTIMONIAL_BG = ['bg-tata-blue', 'bg-violet-700', 'bg-emerald-800', 'bg-amber-700'];
const VIBE_STORIES = [
  { title: "Mumbai Coastal Cleanup", img: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=800", date: "2 days ago" },
  { title: "Teaching Coding in Rural Schools", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800", date: "4 days ago" },
  { title: "Sustainable Farming Workshop", img: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=800", date: "1 week ago" },
  { title: "Blood Donation Camp - Jamshedpur", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800", date: "1 week ago" },
  { title: "Digital Literacy for All", img: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800", date: "2 weeks ago" },
  { title: "Green Earth Initiative", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800", date: "2 weeks ago" },
];

const PROGRAMME_DESCRIPTIONS: Record<string, string> = {
  "TVW": "Events, volunteering week, team activities",
  "ProEngage": "Skill-based projects matched to you",
  "Disaster Response": "Emergency deployment & relief",
};

const VolunteerHubView = () => {
  const { user: authUser } = useAuth();
  const navigate = useAppNavigate();
  const { referralCount, triggerToast } = useAppContext();

  // When a corporate SPOC toggles to volunteer view, use their volunteer persona
  const user = authUser?.role === "corporate_spoc" ? ROHAN_DESAI_VOLUNTEER : authUser;
  const isProEngageActive = true;

  const copyReferralLink = () => {
    navigator.clipboard.writeText("https://tataengage.com/refer/priya123");
    triggerToast("Referral link copied to clipboard!");
  };

  const programmes = [
    { label: "TVW", nav: "tvw", bgClass: "bg-tata-cyan/20", iconClass: "text-tata-blue", Icon: Users },
    { label: "ProEngage", nav: "proengage", bgClass: "bg-violet-100", iconClass: "text-violet-600", Icon: HeartHandshake },
    { label: "Disaster Response", nav: "disaster-response", bgClass: "bg-red-100", iconClass: "text-red-600", Icon: AlertTriangle },
  ];

  const stats = [
    { num: user.history?.length ?? 0, label: "Projects completed", sub: "All time", border: "border-tata-cyan", dot: "bg-cyan-100 text-tata-cyan" },
    { num: (user.hoursVolunteered != null ? `${user.hoursVolunteered}h` : "48h"), label: "Hours volunteered", sub: "This edition", border: "border-violet-400", dot: "bg-violet-100 text-violet-500" },
    { num: user.badges?.length ?? 0, label: "Badges earned", sub: "All time", border: "border-amber-400", dot: "bg-amber-100 text-amber-500" },
    { num: user.history?.length ?? 1, label: "Applications", sub: "This edition", border: "border-red-400", dot: "bg-red-100 text-red-500" },
  ];

  return (
    <div className="pt-20 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ═══ HERO ═══ */}
        <div className="relative min-h-[420px] md:min-h-[480px] bg-zinc-950 rounded-3xl overflow-hidden mb-10 flex items-end">
          <img src="https://images.unsplash.com/photo-1593113616828-6f22bca04804?auto=format&fit=crop&q=80&w=1600" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/60 to-transparent" />
          <div className="relative z-10 p-8 md:p-12 w-full">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/70 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-tata-cyan inline-block" />
              Tata Group · Volunteering
            </span>
            <h1 className="font-serif text-5xl md:text-7xl text-white leading-[0.95] tracking-tight mb-2">
              Welcome, {user.firstName}!
            </h1>
            <p className="text-white/50 text-sm mt-1 mb-6">{user.company} · {user.designation}</p>
            {(user?.role?.includes("spoc") || user?.role === "corporate_spoc") && (
              <RoleToggle activeView="volunteer" className="mb-6" />
            )}
            <p className="text-sm text-white/70 mt-0 mb-6">
              {IS_PE_SEASON
                ? "ProEngage is open — browse projects matched to your skills."
                : "Stay connected — TVW is coming soon."}
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate("dashboard")} className="bg-white/10 border border-white/20 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all cursor-pointer">My Activity</button>
              <button onClick={() => navigate("profile")} className="bg-white/10 border border-white/20 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all cursor-pointer">Profile</button>
              <button onClick={() => navigate("dashboard")} className="bg-white/10 border border-white/20 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all cursor-pointer">My Dashboard →</button>
              {isProEngageActive && (
                <button onClick={() => navigate("proengage")} className="bg-white text-zinc-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-all cursor-pointer">Find Projects</button>
              )}
            </div>
          </div>
        </div>

        {/* ═══ STAT TILES ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className={`bg-white border border-slate-100 border-l-4 ${stat.border} rounded-2xl shadow-sm p-5 relative`}>
              <div className={`absolute top-4 right-4 w-8 h-8 rounded-full ${stat.dot} flex items-center justify-center text-xs font-bold`}>•</div>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.num}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* ═══ PROGRAMME TILES ═══ */}
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
              <p className="text-xs text-slate-400 mt-1">{PROGRAMME_DESCRIPTIONS[p.label]}</p>
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

        {/* ═══ TESTIMONIAL SEPARATOR ═══ */}
        <div className="flex items-center gap-4 mb-6 mt-2">
          <div className="w-full h-px bg-slate-200" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap px-3">More voices</span>
          <div className="w-full h-px bg-slate-200" />
        </div>

        {/* ═══ TESTIMONIALS SCROLL ═══ */}
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

        {/* ═══ TVW VIBE ═══ */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[13px] uppercase text-muted-foreground tracking-[0.08em] font-semibold">TVW Vibe</h3>
            <div className="flex gap-3">
              <button className="border border-slate-200 text-slate-600 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-slate-50">Past Editions</button>
              <button onClick={() => triggerToast("Story submitted for Admin review!")} className="bg-tata-blue text-white rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-tata-blue/90">Submit Your Story</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VIBE_STORIES.map((story) => (
              <div key={story.title} className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
                  <img src={story.img} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 group-hover:text-tata-blue transition-colors">{story.title}</h3>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">{story.date}</p>
              </div>
            ))}
          </div>
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
