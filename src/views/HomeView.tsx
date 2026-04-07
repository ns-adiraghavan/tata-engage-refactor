import Footer from "@/components/layout/Footer";
import { UserPlus, Search, Award, ChevronRight } from "lucide-react";
import { useAppNavigate } from "@/hooks/useAppNavigate";

const HomeView = () => {
  const navigate = useAppNavigate();

  return (
    <div>
      {/* ═══ HERO ═══ */}

      <section className="relative min-h-[88vh] bg-zinc-950 flex items-center overflow-hidden pt-16">

        {/* Background photo — full bleed, dark overlay */}

        <div className="absolute inset-0">

          <img

            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1600"

            alt="Volunteers"

            className="w-full h-full object-cover opacity-30"

            referrerPolicy="no-referrer"

          />

          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/70 to-transparent" />

        </div>

        {/* Content — left aligned, generous width */}

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">

          <div className="max-w-2xl">

            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide">

              <span className="w-1.5 h-1.5 rounded-full bg-tata-cyan inline-block" />

              Tata Group · Volunteering Platform

            </span>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] mb-8 tracking-tight">

              Volunteer.<br />Connect.<br />Impact.

            </h1>

            <p className="text-lg text-white/60 mb-10 leading-relaxed max-w-lg">

              Join thousands of Tata employees, family members, and retirees making a meaningful difference across India and the world.

            </p>

            <div className="flex flex-wrap gap-4">

              <button

                onClick={() => navigate("register-role")}

                className="bg-white text-zinc-900 px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-all cursor-pointer"

              >

                Start Volunteering

              </button>

              <button className="bg-white/10 border border-white/20 text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all cursor-pointer">

                Learn How It Works

              </button>

            </div>

          </div>

        </div>

        {/* Bottom fade into metrics bar */}

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-tata-blue to-transparent" />

      </section>

      {/* ═══ IMPACT METRICS ═══ */}
      <section className="bg-tata-blue py-12">
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
      <section className="bg-zinc-900 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-3">
            How It Works
          </p>
          <h2 className="text-3xl font-bold text-white mb-10">Three steps to get started</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="relative rounded-2xl overflow-hidden bg-[#0f2d4a] p-8 flex flex-col justify-between min-h-[360px] lg:row-span-1">
              <div className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 400 360" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="350" cy="50" r="200" fill="none" stroke="white" strokeWidth="0.5" opacity="0.08"/>
                  <circle cx="350" cy="50" r="120" fill="none" stroke="white" strokeWidth="0.5" opacity="0.06"/>
                  <line x1="0" y1="300" x2="400" y2="80" stroke="white" strokeWidth="0.5" opacity="0.07"/>
                </svg>
              </div>
              <div className="relative z-10">
                <span className="text-[80px] font-black text-white/10 leading-none select-none">01</span>
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-tata-blue flex items-center justify-center mb-4">
                  <UserPlus size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Register</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">Create your profile using your Tata email or personal account. Takes under 3 minutes.</p>
              </div>
            </div>

            {/* Step 2 — season-aware, two parallel tracks */}
            <div className="relative rounded-2xl overflow-hidden bg-[#1a0d2e] p-8 flex flex-col justify-between min-h-[172px] lg:col-span-2">
              <div className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 600 172" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="500" cy="86" r="160" fill="none" stroke="white" strokeWidth="0.5" opacity="0.08"/>
                  <line x1="0" y1="140" x2="600" y2="30" stroke="white" strokeWidth="0.5" opacity="0.07"/>
                  <circle cx="80" cy="20" r="50" fill="none" stroke="white" strokeWidth="0.5" opacity="0.06"/>
                </svg>
              </div>
              <div className="relative z-10">
                <span className="text-[56px] font-black text-white/10 leading-none select-none block mb-4">02</span>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* ProEngage track */}
                  <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-violet-700 flex items-center justify-center shrink-0">
                        <Search size={14} className="text-white" />
                      </div>
                      <span className="text-xs font-bold text-violet-300 uppercase tracking-widest">ProEngage</span>
                    </div>
                    <p className="text-sm text-zinc-300 font-semibold mb-1">Apply to a skill project</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">Match your professional skills to NGO projects during the ProEngage season.</p>
                  </div>
                  {/* Divider */}
                  <div className="flex sm:flex-col items-center justify-center gap-2 text-zinc-600">
                    <div className="h-px sm:h-8 w-8 sm:w-px bg-zinc-700" />
                    <span className="text-xs font-semibold text-zinc-600">or</span>
                    <div className="h-px sm:h-8 w-8 sm:w-px bg-zinc-700" />
                  </div>
                  {/* TVW track */}
                  <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-tata-blue flex items-center justify-center shrink-0">
                        <Award size={14} className="text-white" />
                      </div>
                      <span className="text-xs font-bold text-tata-cyan uppercase tracking-widest">TVW</span>
                    </div>
                    <p className="text-sm text-zinc-300 font-semibold mb-1">Sign up for a TVW event</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">Join group volunteering events during Tata Volunteering Week — no project commitment needed.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl overflow-hidden bg-[#0d2b1f] p-8 flex flex-col justify-between min-h-[172px] lg:col-span-2">
              <div className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 600 172" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="86" r="160" fill="none" stroke="white" strokeWidth="0.5" opacity="0.08"/>
                  <line x1="0" y1="30" x2="600" y2="140" stroke="white" strokeWidth="0.5" opacity="0.07"/>
                  <circle cx="520" cy="160" r="60" fill="none" stroke="white" strokeWidth="0.5" opacity="0.06"/>
                </svg>
              </div>
              <div className="relative z-10 flex items-center justify-between h-full">
                <div className="flex-1">
                  <span className="text-[56px] font-black text-white/10 leading-none select-none block mb-2">03</span>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center shrink-0">
                      <Award size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Make an Impact</h3>
                      <p className="text-sm text-zinc-400 mt-1">Complete the project, earn a certificate, and build your volunteering record.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ OUR PROGRAMMES ═══ */}
      <section className="bg-[#fafaf8] py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-3">
            Our Programmes
          </p>
          <h2 className="text-3xl font-bold text-zinc-900 mb-10">Ways to volunteer</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* TVW — featured wide card */}
            <div className="relative rounded-2xl overflow-hidden min-h-[340px] flex flex-col justify-end lg:col-span-2 group cursor-pointer">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=900"
                  alt="Tata Volunteering Week"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              </div>
              <div className="relative z-10 p-8">
                <span className="inline-block bg-tata-cyan text-zinc-900 text-xs font-bold px-3 py-1 rounded-full tracking-wide mb-4">Bi-annual · Global</span>
                <h3 className="text-2xl font-bold text-white mb-2">Tata Volunteering Week</h3>
                <p className="text-sm text-white/70 mb-4 max-w-md">A celebration of volunteering where employees across the globe come together for a week of collective action.</p>
                <button className="flex items-center gap-1 text-tata-cyan text-sm font-semibold group-hover:gap-2 transition-all cursor-pointer">
                  Learn more <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* ProEngage + Disaster Response — stacked right column */}
            <div className="flex flex-col gap-4">
              <div className="relative rounded-2xl overflow-hidden min-h-[162px] flex flex-col justify-end group cursor-pointer">
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600"
                    alt="ProEngage"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                </div>
                <div className="relative z-10 p-5">
                  <span className="inline-block bg-violet-400 text-zinc-900 text-xs font-bold px-2.5 py-0.5 rounded-full tracking-wide mb-2">Skill-based</span>
                  <h3 className="text-base font-bold text-white">ProEngage</h3>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden min-h-[162px] flex flex-col justify-end group cursor-pointer">
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&q=80&w=600"
                    alt="Disaster Response"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                </div>
                <div className="relative z-10 p-5">
                  <span className="inline-block bg-red-400 text-white text-xs font-bold px-2.5 py-0.5 rounded-full tracking-wide mb-2">Rapid Action</span>
                  <h3 className="text-base font-bold text-white">Disaster Response</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ IMPACT STORIES ═══ */}
      <section className="bg-[#0f1118] py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-3">
            Impact Stories
          </p>
          <h2 className="text-3xl font-bold text-white mb-10">Stories from the field</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* LEFT: Large featured card */}
            <div className="relative rounded-2xl overflow-hidden bg-[#0f2d4a] min-h-[420px] flex flex-col justify-end p-8 group cursor-pointer hover:brightness-125 transition-all duration-300">
              <div className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="480" cy="80" r="260" fill="none" stroke="white" strokeWidth="0.5" opacity="0.12"/>
                  <circle cx="480" cy="80" r="160" fill="none" stroke="white" strokeWidth="0.5" opacity="0.08"/>
                  <circle cx="480" cy="80" r="80" fill="none" stroke="white" strokeWidth="0.5" opacity="0.06"/>
                  <line x1="0" y1="380" x2="600" y2="100" stroke="white" strokeWidth="0.5" opacity="0.1"/>
                  <line x1="0" y1="300" x2="400" y2="0" stroke="white" strokeWidth="0.5" opacity="0.07"/>
                  <circle cx="100" cy="360" r="40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.08"/>
                </svg>
              </div>
              <div className="relative z-10">
                <span className="inline-block bg-tata-cyan text-zinc-900 text-xs font-bold px-3 py-1 rounded-full tracking-wide mb-4">Education</span>
                <h3 className="text-2xl font-bold text-white leading-snug mb-4">Teaching coding to 200 girls in Pune — and changing what they think is possible</h3>
                <button className="flex items-center gap-1 text-tata-cyan text-sm font-semibold group-hover:gap-2 transition-all cursor-pointer">
                  Read story <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* RIGHT: 2×2 grid of smaller cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden bg-[#0d2b1f] min-h-[200px] flex flex-col justify-end p-5 group cursor-pointer hover:brightness-125 transition-all duration-300">
                <div className="absolute inset-0">
                  <svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="200" r="180" fill="none" stroke="white" strokeWidth="0.5" opacity="0.12"/>
                    <line x1="200" y1="0" x2="300" y2="200" stroke="white" strokeWidth="0.5" opacity="0.1"/>
                    <circle cx="260" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1"/>
                  </svg>
                </div>
                <div className="relative z-10">
                  <span className="inline-block bg-emerald-400 text-zinc-900 text-xs font-bold px-2.5 py-0.5 rounded-full tracking-wide mb-3">Environment</span>
                  <h3 className="text-sm font-bold text-white leading-snug">1,000 trees planted across TCS campuses</h3>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-[#003580] min-h-[200px] flex flex-col justify-end p-5 group cursor-pointer hover:brightness-125 transition-all duration-300">
                <div className="absolute inset-0">
                  <svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="150" cy="100" r="140" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1"/>
                    <circle cx="150" cy="100" r="80" fill="none" stroke="white" strokeWidth="0.5" opacity="0.07"/>
                    <line x1="0" y1="0" x2="300" y2="200" stroke="white" strokeWidth="0.5" opacity="0.1"/>
                  </svg>
                </div>
                <div className="relative z-10">
                  <span className="inline-block bg-tata-cyan text-zinc-900 text-xs font-bold px-2.5 py-0.5 rounded-full tracking-wide mb-3">Health</span>
                  <h3 className="text-sm font-bold text-white leading-snug">Free health camps serving rural Maharashtra</h3>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-[#2d1040] min-h-[200px] flex flex-col justify-end p-5 group cursor-pointer hover:brightness-125 transition-all duration-300">
                <div className="absolute inset-0">
                  <svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="280" cy="180" r="160" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1"/>
                    <line x1="0" y1="0" x2="300" y2="150" stroke="white" strokeWidth="0.5" opacity="0.1"/>
                    <circle cx="40" cy="40" r="35" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1"/>
                  </svg>
                </div>
                <div className="relative z-10">
                  <span className="inline-block bg-violet-400 text-white text-xs font-bold px-2.5 py-0.5 rounded-full tracking-wide mb-3">Skills</span>
                  <h3 className="text-sm font-bold text-white leading-snug">50 finance professionals mentoring rural entrepreneurs</h3>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-[#2d1a00] min-h-[200px] flex flex-col justify-end p-5 group cursor-pointer hover:brightness-125 transition-all duration-300">
                <div className="absolute inset-0">
                  <svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="150" cy="0" r="180" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1"/>
                    <line x1="300" y1="0" x2="0" y2="200" stroke="white" strokeWidth="0.5" opacity="0.1"/>
                    <circle cx="260" cy="170" r="40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.09"/>
                  </svg>
                </div>
                <div className="relative z-10">
                  <span className="inline-block bg-amber-400 text-zinc-900 text-xs font-bold px-2.5 py-0.5 rounded-full tracking-wide mb-3">Disaster Response</span>
                  <h3 className="text-sm font-bold text-white leading-snug">Tata volunteers deployed within 48 hours of Kerala floods</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeView;
