import { useState, useEffect } from "react";
import Footer from "@/components/layout/Footer";
import { UserPlus, Search, Award, ChevronRight, ChevronLeft } from "lucide-react";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useAppContext } from "@/context/AppContext";


const HERO_SLIDES = [
  {
    photo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1600",
    label: "Community",
    headline: "Volunteers across the globe making a difference",
  },
  {
    photo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1600",
    label: "Education",
    headline: "Teaching skills that last a lifetime",
  },
  {
    photo: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1600",
    label: "Environment",
    headline: "Protecting the planet, one initiative at a time",
  },
];

const FEATURED_STORIES = [
  {
    tag: "Education",
    tagColor: "bg-tata-cyan text-zinc-900",
    bg: "bg-[#0f2d4a]",
    headline: "Teaching coding to 200 girls in Pune — and changing what they think is possible",
  },
  {
    tag: "Health",
    tagColor: "bg-emerald-400 text-zinc-900",
    bg: "bg-[#0d2b1f]",
    headline: "Free health camps reaching 10,000 rural families across Maharashtra",
  },
  {
    tag: "Skills",
    tagColor: "bg-violet-400 text-white",
    bg: "bg-[#2d1040]",
    headline: "50 finance professionals mentoring rural entrepreneurs in Tier-3 cities",
  },
  {
    tag: "Disaster",
    tagColor: "bg-amber-400 text-zinc-900",
    bg: "bg-[#2d1a00]",
    headline: "Tata volunteers deployed within 48 hours of Kerala floods",
  },
];

const PROGRAMMES = [
  {
    id: "TVW",
    title: "Tata Volunteering Week",
    tagLabel: "Bi-annual · Global",
    tagColor: "bg-tata-cyan text-zinc-900",
    photo: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=900",
    description: "A bi-annual celebration of volunteering. Employees across Tata companies join hands for a week of collective action.",
    stats: "12 Editions · 50,000+ Volunteers",
    cta: "Browse Events",
  },
  {
    id: "ProEngage",
    title: "ProEngage",
    tagLabel: "Skill-based",
    tagColor: "bg-violet-400 text-zinc-900",
    photo: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600",
    description: "Match your professional skills to NGO projects. Work remotely or in-person on meaningful skill-based engagements.",
    stats: "1,200+ Projects · 85 NGO Partners",
    cta: "Browse Projects",
  },
  {
    id: "DR",
    title: "Disaster Response",
    tagLabel: "Rapid Action",
    tagColor: "bg-red-400 text-white",
    photo: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&q=80&w=600",
    description: "When disaster strikes, Tata volunteers deploy within 48 hours to provide relief and support.",
    stats: "24 Responses · 8 States covered",
    cta: "Learn More",
  },
];

const SECTION_IDS = ["hero", "highlights", "metrics", "impact-stories", "how-it-works", "programmes"];
const SECTION_LABELS = ["Hero", "Highlights", "Impact", "Stories", "How It Works", "Programmes"];

const HomeView = () => {
  const navigate = useAppNavigate();
  const { triggerToast } = useAppContext();

  // --- Section scroll indicator ---
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(idx);
        },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // --- Hero carousel ---
  const [heroSlide, setHeroSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setHeroSlide((p) => (p + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // --- Featured story rotation ---
  const [storyIdx, setStoryIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setStoryIdx((p) => (p + 1) % FEATURED_STORIES.length), 4000);
    return () => clearInterval(timer);
  }, []);

  // --- Programmes accordion ---
  const [selectedProgramme, setSelectedProgramme] = useState("TVW");

  return (
    <div className="relative">
      {/* ═══ SECTION DOT RAIL ═══ */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
        {SECTION_IDS.map((id, i) => (
          <button
            key={id}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center justify-end"
            aria-label={`Scroll to ${SECTION_LABELS[i]}`}
          >
            {activeSection === i && (
              <span className="text-xs font-semibold text-white bg-white/15 border border-white/20 px-2.5 py-1 rounded-full mr-2 whitespace-nowrap">
                {SECTION_LABELS[i]}
              </span>
            )}
            <span
              className={`rounded-full transition-all duration-300 shrink-0 ${
                activeSection === i
                  ? "w-2.5 h-2.5 bg-white scale-125"
                  : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          </button>
        ))}
      </div>

      {/* ═══ CONTACT US ═══ */}
      <button
        onClick={() => triggerToast("Opening contact form...")}
        className="fixed bottom-6 left-6 z-50 bg-white text-zinc-900 text-sm font-semibold px-4 py-2.5 rounded-full shadow-md border border-zinc-200 hover:bg-zinc-50 transition-all cursor-pointer"
      >
        Contact Us
      </button>

      {/* ═══ HERO ═══ */}
      <section id="hero" className="relative min-h-[88vh] bg-zinc-950 flex items-center overflow-hidden pt-16">
        {/* Carousel backgrounds */}
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              heroSlide === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.photo}
              alt={slide.label}
              className="w-full h-full object-cover opacity-30"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/70 to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-2xl">
            
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-tata-cyan inline-block" />
              Tata Group · Volunteering Platform
            </span>

            {/* Slide label + headline */}
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-tata-cyan">
                {HERO_SLIDES[heroSlide].label}
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] mb-4 tracking-tight">
              Volunteer.<br />Connect.<br />Impact.
            </h1>

            <p className="text-lg text-white/50 mb-2 leading-relaxed max-w-lg italic">
              {HERO_SLIDES[heroSlide].headline}
            </p>

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

        {/* Carousel controls — bottom left */}
        <div className="absolute bottom-28 left-6 md:left-12 z-20 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHeroSlide((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
              className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setHeroSlide((p) => (p + 1) % HERO_SLIDES.length)}
              className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
            <span className="text-white/40 text-xs font-semibold ml-2 tabular-nums">
              {String(heroSlide + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
            </span>
          </div>
          <div className="flex gap-1.5">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                className={`rounded-full transition-all ${
                  heroSlide === i ? "w-2 h-2 bg-white" : "w-1.5 h-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-tata-blue to-transparent" />
      </section>

      {/* ═══ WHAT'S HAPPENING NOW ═══ */}
      <section id="highlights" className="py-12 px-6 md:px-12 border-t border-white/5 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-6 text-white/40">
            What&apos;s happening now
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-[#0f2d4a] rounded-2xl p-8 min-h-[280px] flex flex-col justify-between">
              <span className="inline-block bg-tata-cyan/20 text-tata-cyan text-xs font-bold px-3 py-1 rounded-full self-start">
                Trending Now
              </span>
              <h3 className="text-2xl font-bold text-white leading-snug mt-4">
                ProEngage Edition 2026 is now open — 85 NGOs, 400+ projects across India
              </h3>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-white/50">Updated 2 hours ago</span>
                <button className="bg-white text-zinc-900 text-sm font-bold px-5 py-2 rounded-xl hover:bg-zinc-100 cursor-pointer transition-all">
                  Browse Projects →
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl p-6 flex flex-col justify-between min-h-[132px] bg-yellow-600">
                <span className="inline-block bg-violet-500/20 text-violet-300 text-xs font-bold px-3 py-1 rounded-full self-start">
                  TVW 2026
                </span>
                <p className="text-base font-bold text-white mt-3">Tata Volunteering Week registration opens in 14 days</p>
                <span className="text-xs text-white/40">Mark your calendar</span>
              </div>
              <div className="rounded-2xl p-6 flex flex-col justify-between min-h-[132px] bg-green-950">
                <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full self-start">
                  Impact
                </span>
                <p className="text-base font-bold text-white mt-3">1,240 volunteers matched this edition — highest ever</p>
                <span className="text-xs text-white/40">ProEngage 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ IMPACT METRICS ═══ */}
      <section id="metrics" className="bg-gradient-to-r from-zinc-950 to-zinc-800 py-12">
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

      {/* ═══ IMPACT STORIES ═══ */}
      <section id="impact-stories" className="py-16 px-6 md:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-3">
            Impact Stories
          </p>
          <h2 className="text-3xl font-bold mb-10 text-slate-950">Stories from the field</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden min-h-[420px] cursor-pointer hover:brightness-125 transition-all duration-300">
              {FEATURED_STORIES.map((story, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 ${story.bg} flex flex-col justify-end p-8 transition-opacity duration-700 ${
                    storyIdx === i ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
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
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full tracking-wide mb-4 ${story.tagColor}`}>
                      {story.tag}
                    </span>
                    <h3 className="text-2xl font-bold text-white leading-snug mb-4">{story.headline}</h3>
                    <span className="flex items-center gap-1 text-tata-cyan text-sm font-semibold">
                      Read story <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
              <div className="absolute bottom-4 left-8 z-20 flex gap-1.5">
                {FEATURED_STORIES.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setStoryIdx(i); }}
                    className={`rounded-full transition-all ${
                      storyIdx === i ? "w-2 h-2 bg-white" : "w-1.5 h-1.5 bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>

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

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-16 px-6 md:px-12 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-3">
            How It Works
          </p>
          <h2 className="text-3xl font-bold mb-10 text-slate-50">Three steps to get started</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                  <div className="flex sm:flex-col items-center justify-center gap-2 text-zinc-600">
                    <div className="h-px sm:h-8 w-8 sm:w-px bg-zinc-700" />
                    <span className="text-xs font-semibold text-zinc-600">or</span>
                    <div className="h-px sm:h-8 w-8 sm:w-px bg-zinc-700" />
                  </div>
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
      <section id="programmes" className="py-16 px-6 md:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-3">
            Our Programmes
          </p>
          <h2 className="text-3xl font-bold mb-10 text-black">Ways to volunteer</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {PROGRAMMES.map((prog) => {
              const isExpanded = selectedProgramme === prog.id;
              return (
                <div
                  key={prog.id}
                  onClick={() => setSelectedProgramme(prog.id)}
                  className={`relative rounded-2xl overflow-hidden flex flex-col justify-end group cursor-pointer transition-all duration-300 ${
                    isExpanded ? "lg:col-span-2 min-h-[380px]" : "min-h-[180px] lg:min-h-[380px]"
                  }`}
                >
                  <div className="absolute inset-0">
                    <img
                      src={prog.photo}
                      alt={prog.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  </div>
                  <div className="relative z-10 p-8">
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full tracking-wide mb-4 ${prog.tagColor}`}>
                      {prog.tagLabel}
                    </span>
                    <h3 className={`font-bold text-white mb-2 ${isExpanded ? "text-2xl" : "text-base"}`}>
                      {prog.title}
                    </h3>
                    {isExpanded && (
                      <>
                        <p className="text-sm text-white/70 mb-3 max-w-md">{prog.description}</p>
                        <p className="text-xs text-white/50 font-semibold mb-4 tracking-wide">{prog.stats}</p>
                        <button className="flex items-center gap-1 text-tata-cyan text-sm font-semibold group-hover:gap-2 transition-all cursor-pointer">
                          {prog.cta} <ChevronRight size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeView;