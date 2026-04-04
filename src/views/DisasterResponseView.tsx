import { motion } from "framer-motion";
import { Heart, Globe, Award, LayoutGrid, ArrowRight, Zap, Activity, ShieldAlert } from "lucide-react";
import type { View } from "@/types";
import { useAppContext } from "@/context/AppContext";

const DisasterResponseView = () => {
  const navigate = useAppNavigate();
  return (
    <div className="pt-28 pb-20 px-6 md:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-red-100"
          >
            <ShieldAlert size={14} /> One Tata Response Framework
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-tata-blue mb-6 tracking-tighter leading-none">
            Standing Together <br /> <span className="text-red-600 underline decoration-red-100 underline-offset-8">In Times of Crisis</span>
          </h1>
          <p className="text-slate-500 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mb-10">
            The Tata Group's disaster response mechanism leverages our collective resources, 
            expertise, and volunteer spirit to provide immediate relief and long-term rehabilitation 
            to communities affected by natural calamities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate("register-role")} className="w-full sm:w-auto px-10 py-5 bg-zinc-900 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 group cursor-pointer">
              Register as Volunteer <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer">
              View Framework
            </button>
          </div>
        </section>

        {/* Framework Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">The One Tata Framework</h2>
              <p className="text-slate-500 leading-relaxed">
                Our response is structured into three critical phases, ensuring that we move from 
                immediate life-saving interventions to sustainable community rebuilding.
              </p>
            </div>
            <div className="space-y-6">
              {[
                { phase: "Phase 1: Relief", desc: "Immediate provision of food, water, medical aid, and temporary shelter within the first 72 hours.", icon: Zap, color: "bg-amber-500" },
                { phase: "Phase 2: Restoration", desc: "Restoring essential services, sanitation, and supporting livelihoods in the weeks following a disaster.", icon: Activity, color: "bg-blue-500" },
                { phase: "Phase 3: Rehabilitation", desc: "Long-term reconstruction of infrastructure, schools, and resilient community systems.", icon: Heart, color: "bg-red-500" }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className={`w-12 h-12 rounded-2xl ${item.color} text-white flex items-center justify-center shrink-0 shadow-lg`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase tracking-wide mb-1">{item.phase}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-slate-200 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative z-10">
              <img 
                src="https://picsum.photos/seed/disaster/800/800" 
                alt="Disaster Response" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-tata-blue rounded-[3rem] -z-10 opacity-10 animate-pulse" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-600 rounded-full -z-10 opacity-5" />
          </div>
        </section>

        {/* Volunteering Types */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">How You Can Help</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Different crises require different skills. We match your expertise to the specific needs on the ground.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "On-Ground Relief", skills: "Logistics, Medical, Distribution", icon: Globe, desc: "Direct deployment to affected areas to manage supply chains and distribution centers." },
              { title: "Remote Support", skills: "Data, Tech, Coordination", icon: LayoutGrid, desc: "Supporting operations from your location through information management and technical aid." },
              { title: "Specialized Skills", skills: "Engineering, Psychosocial, Legal", icon: Award, desc: "Providing professional expertise for infrastructure assessment or trauma counseling." }
            ].map((type, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-8 group-hover:bg-tata-blue group-hover:text-white transition-all shadow-inner">
                  <type.icon size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{type.title}</h3>
                <div className="text-[10px] font-black text-tata-cyan uppercase tracking-widest mb-4">{type.skills}</div>
                <p className="text-sm text-slate-500 leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Deployment Process */}
        <section className="bg-zinc-900 rounded-[3rem] p-12 md:p-20 text-white mb-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-tata-blue/10 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-16 text-center">The Deployment Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
              <div className="hidden md:block absolute top-10 left-20 right-20 h-px bg-white/10 border-t border-dashed border-white/20" />
              {[
                { step: "01", title: "Registration", desc: "Register your interest and skills in the Disaster Response pool." },
                { step: "02", title: "Activation", desc: "Receive an alert when a crisis matches your profile and location." },
                { step: "03", title: "Briefing", desc: "Mandatory safety and operational briefing before deployment." },
                { step: "04", title: "Impact", desc: "Execute assigned tasks and contribute to community recovery." }
              ].map((item, i) => (
                <div key={i} className="relative text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 text-2xl font-black text-tata-cyan shadow-2xl backdrop-blur-md">
                    {item.step}
                  </div>
                  <h4 className="font-black uppercase tracking-widest mb-4">{item.title}</h4>
                  <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Past Case Studies</h2>
              <p className="text-slate-500 max-w-xl">A legacy of standing with the nation during its most challenging times.</p>
            </div>
            <button className="text-sm font-black text-tata-blue uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all cursor-pointer">
              View All Impact Reports <ArrowRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { 
                title: "Odisha Cyclone Relief (2024)", 
                impact: "50,000+ Meals Distributed", 
                desc: "Rapid deployment of volunteers to manage community kitchens and medical camps in the aftermath of Cyclone Dana.",
                img: "https://picsum.photos/seed/relief1/800/500"
              },
              { 
                title: "Assam Flood Restoration (2023)", 
                impact: "12 Schools Rebuilt", 
                desc: "Long-term rehabilitation project focusing on restoring educational infrastructure and sanitation in flood-hit districts.",
                img: "https://picsum.photos/seed/relief2/800/500"
              }
            ].map((caseStudy, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-video rounded-[2.5rem] overflow-hidden mb-8 shadow-lg border border-slate-100 relative">
                  <img 
                    src={caseStudy.img} 
                    alt={caseStudy.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-8 left-8 right-8 text-white translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                    <div className="text-[10px] font-black uppercase tracking-widest text-tata-cyan mb-2">Impact Highlight</div>
                    <div className="text-xl font-black">{caseStudy.impact}</div>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-tata-blue transition-colors">{caseStudy.title}</h3>
                <p className="text-slate-500 leading-relaxed">{caseStudy.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-tata-blue rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter">Ready to make a difference?</h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg mb-12">
              Join our pool of dedicated disaster response volunteers. Your skills could be 
              the lifeline someone needs in their darkest hour.
            </p>
            <button onClick={() => navigate("register-role")} className="px-12 py-6 bg-white text-tata-blue rounded-[2rem] font-black uppercase tracking-widest hover:bg-tata-cyan hover:text-white transition-all shadow-2xl cursor-pointer">
              Join the Response Pool
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DisasterResponseView;
