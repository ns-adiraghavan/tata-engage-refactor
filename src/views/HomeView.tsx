import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ChevronRight, Heart, Award } from "lucide-react";
import type { View } from "@/types";
import { useAppContext } from "@/context/AppContext";

const HomeView = () => {
  const { navigate } = useAppContext();
  return (
  <div className="pt-20">
    {/* Hero Section */}
    <section className="relative h-[85vh] flex items-center px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=2000" 
          alt="Volunteers" 
          className="w-full h-full object-cover brightness-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tata-blue/80 to-transparent" />
      </div>
      
      <div className="relative z-10 max-w-3xl text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1 rounded-full bg-tata-cyan/20 border border-tata-cyan/30 text-tata-cyan text-sm font-bold mb-6 backdrop-blur-md">
            #TataEngage #Volunteering
          </span>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            Empowering Communities <br />
            <span className="text-tata-cyan">Through Service</span>
          </h1>
          <p className="text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl">
            Join thousands of Tata employees and citizens in making a meaningful difference. 
            Your skills and time can change lives.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate("register-role")} className="btn-black px-10 py-4 rounded-full text-lg cursor-pointer shadow-xl shadow-black/20">
              Start Volunteering
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all cursor-pointer">
              Explore Programmes
            </button>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Legacy Section */}
    <section className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-tata-cyan/10 rounded-full blur-3xl" />
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800" 
            alt="Legacy" 
            className="rounded-3xl shadow-2xl relative z-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-8 -right-8 bg-tata-blue text-white p-8 rounded-2xl shadow-xl z-20 hidden md:block">
            <div className="text-4xl font-bold mb-1">150+</div>
            <div className="text-sm opacity-80">Years of Giving</div>
          </div>
        </div>
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-tata-blue">A Legacy of Compassion</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            The Tata Group's commitment to community service dates back to our founder, Jamsetji Tata. 
            He believed that in a free enterprise, the community is not just another stakeholder in 
            business, but is in fact the very purpose of its existence.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-tata-cyan/10 flex items-center justify-center text-tata-cyan shrink-0">
                <Award size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-1">Global Impact</h4>
                <p className="text-sm text-slate-500">Reaching millions across 100+ countries.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-tata-purple/10 flex items-center justify-center text-tata-purple shrink-0">
                <Heart size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-1">Employee Driven</h4>
                <p className="text-sm text-slate-500">Over 1 million volunteering hours annually.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Programmes Section */}
    <section className="py-24 px-6 md:px-12 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-tata-blue">Our Programmes</h2>
            <p className="text-slate-600 max-w-xl">
              Diverse initiatives designed to leverage different skills and time commitments for maximum social impact.
            </p>
          </div>
          <button className="btn-secondary cursor-pointer">View All Programmes</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "TVW", 
              subtitle: "Tata Volunteering Week", 
              desc: "A bi-annual celebration of volunteering where employees across the globe come together.",
              img: "https://picsum.photos/seed/tata-volunteering/600/400",
              color: "tata-cyan"
            },
            { 
              title: "ProEngage", 
              subtitle: "Skill-based Volunteering", 
              desc: "Project-based volunteering that allows employees to use their professional expertise.",
              img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600",
              color: "tata-purple"
            },
            { 
              title: "Disaster Response", 
              subtitle: "Rapid Action", 
              desc: "Coordinated efforts to provide immediate relief and long-term rehabilitation during disasters.",
              img: "https://picsum.photos/seed/disaster-relief/600/400",
              color: "tata-blue"
            }
          ].map((p, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg group cursor-pointer"
            >
              <div className="h-48 overflow-hidden">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="p-8">
                <div className={`text-xs font-bold uppercase tracking-widest mb-2 text-${p.color}`}>{p.subtitle}</div>
                <h3 className="text-2xl font-bold mb-4">{p.title}</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">{p.desc}</p>
                <button className="flex items-center gap-2 font-bold text-tata-blue group-hover:gap-4 transition-all cursor-pointer">
                  Learn More <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Stay Connected */}
    <section className="py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto bg-tata-blue rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-tata-cyan/20 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-tata-purple/20 rounded-full blur-3xl -ml-32 -mb-32" />
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Stay Connected</h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Get the latest updates on volunteering opportunities and impact stories delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-tata-cyan backdrop-blur-md"
            />
            <button className="bg-tata-cyan text-tata-blue px-8 py-4 rounded-full font-bold hover:bg-white transition-all cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
  );
};

export default HomeView;
