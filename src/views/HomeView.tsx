import Footer from "@/components/layout/Footer";
import { UserPlus, Search, Award, ChevronRight } from "lucide-react";
import { useAppNavigate } from "@/hooks/useAppNavigate";

const HomeView = () => {
  const navigate = useAppNavigate();

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="min-h-screen bg-white pt-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <span className="inline-block bg-blue-50 text-tata-blue text-xs font-semibold px-3 py-1 rounded-full mb-6">
              Tata Group Volunteering
            </span>
            <h1 className="text-5xl font-bold text-zinc-900 leading-tight mb-6">
              Volunteer. Connect. Impact.
            </h1>
            <p className="text-lg text-zinc-500 mb-10 leading-relaxed">
              Join thousands of Tata employees, family members, and retirees making a meaningful difference across India and the world.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("register-role")}
                className="btn-black px-8 py-3 rounded-xl text-sm cursor-pointer"
              >
                Start Volunteering
              </button>
              <button className="btn-outline px-8 py-3 rounded-xl text-sm cursor-pointer">
                Learn How It Works
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=900"
              alt="Volunteers collaborating outdoors"
              className="rounded-2xl object-cover w-full h-[520px]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* ═══ IMPACT METRICS ═══ */}
      <section className="bg-tata-blue py-10">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center divide-x divide-white/20">
          {[
            { num: "50,000+", label: "Volunteers" },
            { num: "1,200+", label: "NGO Partners" },
            { num: "3", label: "Programmes" },
            { num: "150+", label: "Years of Giving" },
          ].map((stat, i) => (
            <div key={i} className="px-10 py-2 text-center">
              <div className="text-3xl font-bold text-white">{stat.num}</div>
              <div className="text-sm text-white/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="bg-zinc-50 py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 text-center mb-3">
            How It Works
          </p>
          <h2 className="text-3xl font-bold text-zinc-900 text-center mb-16">
            Three steps to start volunteering
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                icon: UserPlus,
                title: "Register",
                desc: "Create your profile in minutes using your Tata email or personal account.",
                cardClass: "bg-blue-50 border border-blue-100",
                circleClass: "bg-tata-blue text-white",
                iconClass: "text-tata-blue",
              },
              {
                step: 2,
                icon: Search,
                title: "Find a Project",
                desc: "Browse ProEngage skill-based projects or sign up for TVW events near you.",
                cardClass: "bg-violet-50 border border-violet-100",
                circleClass: "bg-violet-600 text-white",
                iconClass: "text-violet-600",
              },
              {
                step: 3,
                icon: Award,
                title: "Make an Impact",
                desc: "Complete the project, earn a certificate, and track your volunteering journey.",
                cardClass: "bg-emerald-50 border border-emerald-100",
                circleClass: "bg-emerald-600 text-white",
                iconClass: "text-emerald-600",
              },
            ].map((s) => (
              <div key={s.step} className={`${s.cardClass} rounded-2xl p-8 text-center`}>
                <div className={`w-8 h-8 ${s.circleClass} rounded-full text-sm font-bold flex items-center justify-center mb-4 mx-auto`}>
                  {s.step}
                </div>
                <div className={`flex justify-center mb-4 ${s.iconClass}`}>
                  <s.icon size={28} />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">{s.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OUR PROGRAMMES ═══ */}
      <section className="bg-slate-50 py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-900 mb-12">Our Programmes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "TVW",
                subtitle: "Tata Volunteering Week",
                desc: "A bi-annual celebration of volunteering where employees across the globe come together.",
                img: "https://picsum.photos/seed/tata-volunteering/600/400",
                accentBar: "bg-tata-cyan",
                subtitleColor: "text-tata-cyan",
              },
              {
                title: "ProEngage",
                subtitle: "Skill-based Volunteering",
                desc: "Project-based volunteering that allows employees to use their professional expertise.",
                img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600",
                accentBar: "bg-violet-500",
                subtitleColor: "text-violet-600",
              },
              {
                title: "Disaster Response",
                subtitle: "Rapid Action",
                desc: "Coordinated efforts to provide immediate relief and long-term rehabilitation during disasters.",
                img: "https://picsum.photos/seed/disaster-relief/600/400",
                accentBar: "bg-red-500",
                subtitleColor: "text-red-600",
              },
            ].map((p, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm"
              >
                <div className={`h-1 w-full ${p.accentBar}`} />
                <div className="h-44 overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <div className={`text-xs font-bold uppercase tracking-widest ${p.subtitleColor} mb-2`}>
                    {p.subtitle}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-3">{p.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed mb-4">{p.desc}</p>
                  <button className="flex items-center gap-1 font-semibold text-sm text-tata-blue cursor-pointer">
                    Learn More <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ IMPACT STORIES ═══ */}
      <section className="bg-slate-900 py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-3">
            Impact Stories
          </p>
          <h2 className="text-3xl font-bold text-white mb-12">Stories from the field</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                category: "Education",
                headline: "Teaching coding to 200 girls in Pune",
              },
              {
                category: "Environment",
                headline: "1,000 trees planted across TCS campuses",
              },
              {
                category: "Health",
                headline: "Free health camps serving rural Maharashtra",
              },
            ].map((story, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-zinc-100"
              >
                <div className="bg-slate-100 h-40 flex items-center justify-center">
                  <span className="text-xs text-zinc-400">Photo from TSG</span>
                </div>
                <div className="p-5">
                  <span className="inline-block bg-blue-50 text-tata-blue text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3">
                    {story.category}
                  </span>
                  <h3 className="text-base font-bold text-zinc-900 mb-3 leading-snug">
                    {story.headline}
                  </h3>
                  <button className="flex items-center gap-1 text-sm font-semibold text-tata-blue cursor-pointer">
                    Read more <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeView;
