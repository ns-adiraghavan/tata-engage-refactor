import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const TVWVibeView = () => (
  <div className="pt-28 pb-20 px-6 md:px-12 bg-white min-h-screen">
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold text-tata-blue mb-4 tracking-tight">TVW Vibe Highlights</h1>
          <p className="text-slate-500 max-w-2xl text-lg">Capturing the spirit of volunteering across the Tata group. See how our colleagues are making a difference.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline py-2 px-6 text-sm cursor-pointer">Past Editions</button>
          <button className="btn-black py-2 px-6 text-sm cursor-pointer">Submit Your Story</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Mumbai Coastal Cleanup", img: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=800", date: "2 days ago" },
          { title: "Teaching Coding in Rural Schools", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800", date: "4 days ago" },
          { title: "Sustainable Farming Workshop", img: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=800", date: "1 week ago" },
          { title: "Blood Donation Camp - Jamshedpur", img: "https://images.unsplash.com/photo-1615461066841-6116ecaaba7f?auto=format&fit=crop&q=80&w=800", date: "1 week ago" },
          { title: "Digital Literacy for All", img: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800", date: "2 weeks ago" },
          { title: "Green Earth Initiative", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800", date: "2 weeks ago" }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-4 shadow-lg group-hover:shadow-2xl transition-all">
              <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-white font-bold flex items-center gap-2">Read Story <ArrowRight size={16} /></span>
              </div>
            </div>
            <h3 className="font-bold text-zinc-900 group-hover:text-tata-blue transition-colors">{item.title}</h3>
            <p className="text-xs text-slate-400 font-medium uppercase mt-1 tracking-wider">{item.date}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default TVWVibeView;
