import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Globe, Calendar, MapPin, Filter, CalendarDays, List, Check, MessageSquare } from "lucide-react";
import type { View } from "@/types";
import { TVW_EVENTS } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";

const TVWHubView = () => {
  const { registeredEvents, setRegisteredEvents, triggerToast } = useAppContext();
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [filters, setFilters] = useState({ location: "All", theme: "All", mode: "All" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleRegisterClick = (event: any) => {
    setSelectedEvent(event);
    setIsRegistering(true);
  };

  const confirmRegistration = () => {
    if (!selectedEvent) return;
    setRegisteredEvents([...registeredEvents, selectedEvent.id]);
    setIsRegistering(false);
    triggerToast("You're registered! A confirmation email has been sent.");
  };

  const filteredEvents = TVW_EVENTS.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = filters.location === "All" || event.location.includes(filters.location);
    const matchesTheme = filters.theme === "All" || event.theme === filters.theme;
    const matchesMode = filters.mode === "All" || event.mode === filters.mode;
    return matchesSearch && matchesLocation && matchesTheme && matchesMode;
  });

  return (
    <div className="pt-20 pb-20 px-6 md:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="relative h-64 rounded-3xl overflow-hidden mb-12 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover brightness-50"
            alt="TVW Banner"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="px-4 py-1 rounded-full bg-tata-cyan text-tata-blue text-xs font-bold mb-4 inline-block uppercase tracking-widest">TVW 2025</span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">Be The Change</h1>
              <p className="text-white/80 max-w-xl mx-auto text-lg">Join the global movement of Tata volunteers making an impact across the world.</p>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Left Column: Message & Dates */}
          <div className="lg:col-span-1 space-y-8">
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-tata-purple/10 flex items-center justify-center text-tata-purple">
                  <MessageSquare size={20} />
                </div>
                <h3 className="font-bold text-zinc-900">GCSO Message</h3>
              </div>
              <p className="text-sm text-slate-500 italic leading-relaxed mb-4">
                "Volunteering is at the heart of our culture. TVW is a time for us to celebrate our commitment to the community."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <div>
                  <div className="text-xs font-bold text-zinc-900">Siddharth Sharma</div>
                  <div className="text-xs text-slate-400 uppercase">Group CEO, Tata Trusts</div>
                </div>
              </div>
            </section>

            <section className="bg-zinc-900 rounded-3xl p-8 text-white shadow-xl">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <CalendarDays size={18} className="text-tata-cyan" /> Key Dates
              </h3>
              <div className="space-y-6">
                {[
                  { date: "June 1, 2025", event: "TVW Kickoff" },
                  { date: "June 15, 2025", event: "Global Impact Day" },
                  { date: "June 30, 2025", event: "Closing Ceremony" }
                ].map((d, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1 h-10 bg-tata-cyan rounded-full" />
                    <div>
                      <div className="text-xs font-bold text-tata-cyan uppercase">{d.date}</div>
                      <div className="text-sm font-medium text-white/80">{d.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Events List */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4 bg-white p-1 rounded-2xl border border-zinc-100 shadow-sm">
                <button 
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all ${viewMode === "list" ? "bg-zinc-900 text-white shadow-lg" : "text-slate-400 hover:text-zinc-900"}`}
                >
                  <List size={18} /> List View
                </button>
                <button 
                  onClick={() => setViewMode("calendar")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all ${viewMode === "calendar" ? "bg-zinc-900 text-white shadow-lg" : "text-slate-400 hover:text-zinc-900"}`}
                >
                  <CalendarDays size={18} /> Calendar
                </button>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search events..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-tata-blue/20" 
                  />
                </div>
                <div className="flex gap-2">
                  <select 
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="px-4 py-3 bg-white border border-zinc-100 rounded-2xl text-sm focus:outline-none"
                  >
                    <option>All Locations</option>
                    <option>Mumbai</option>
                    <option>Pune</option>
                    <option>Chennai</option>
                    <option>Virtual</option>
                  </select>
                  <button className="p-3 bg-white border border-zinc-100 rounded-2xl text-slate-400 hover:text-zinc-900 transition-colors">
                    <Filter size={20} />
                  </button>
                </div>
              </div>
            </div>

            {viewMode === "list" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map((event) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm hover:shadow-xl transition-all group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${event.mode === 'Virtual' ? 'bg-tata-cyan/10 text-tata-cyan' : 'bg-tata-purple/10 text-tata-purple'}`}>
                        {event.mode}
                      </div>
                      <div className="text-xs font-bold text-slate-400 uppercase">{event.company}</div>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-tata-blue transition-colors">{event.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-6">{event.description}</p>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Calendar size={16} className="text-slate-400" /> {event.date}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <MapPin size={16} className="text-slate-400" /> {event.location}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Users size={16} className="text-slate-400" /> 
                        <span className={event.capacity === 'Full' ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>
                          {event.capacity === 'Full' ? 'Registration Full' : 'Open for Registration'}
                        </span>
                      </div>
                    </div>

                    <button 
                      disabled={event.capacity === 'Full' || registeredEvents.includes(event.id)}
                      onClick={() => handleRegisterClick(event)}
                      className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                        registeredEvents.includes(event.id) 
                          ? 'bg-green-50 text-green-600 cursor-default' 
                          : event.capacity === 'Full' 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                            : 'bg-zinc-900 text-white hover:bg-tata-blue shadow-lg shadow-black/10 cursor-pointer'
                      }`}
                    >
                      {registeredEvents.includes(event.id) ? (
                        <><Check size={20} /> Registered</>
                      ) : event.capacity === 'Full' ? (
                        'Full'
                      ) : (
                        'Register Now'
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm">
                <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="bg-slate-50 p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{day}</div>
                  ))}
                  {Array.from({ length: 30 }).map((_, i) => {
                    const day = i + 1;
                    const hasEvent = filteredEvents.find(e => e.date.includes(`June ${day}`));
                    return (
                      <div key={i} className="bg-white min-h-[120px] p-3 hover:bg-slate-50 transition-colors group relative">
                        <span className="text-sm font-bold text-slate-300 group-hover:text-zinc-900 transition-colors">{day}</span>
                        {hasEvent && (
                          <div 
                            onClick={() => handleRegisterClick(hasEvent)}
                            className="mt-2 p-2 bg-tata-blue/5 border border-tata-blue/10 rounded-lg cursor-pointer hover:bg-tata-blue/10 transition-all"
                          >
                            <div className="text-xs font-bold text-tata-blue line-clamp-2 leading-tight">{hasEvent.title}</div>
                            <div className="text-[10px] text-slate-400 mt-1">{hasEvent.mode}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Confirmation Modal */}
      <AnimatePresence>
        {isRegistering && selectedEvent && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRegistering(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-tata-blue" />
              <h3 className="text-2xl font-bold text-zinc-900 mb-4">Confirm Registration</h3>
              <p className="text-slate-500 mb-8">
                You are about to register for <span className="font-bold text-zinc-900">"{selectedEvent.title}"</span> on {selectedEvent.date}.
              </p>
              
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl">
                  <MapPin size={18} className="text-tata-blue" />
                  {selectedEvent.location}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl">
                  <Globe size={18} className="text-tata-blue" />
                  {selectedEvent.mode} Mode
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setIsRegistering(false)} className="flex-1 btn-outline py-4 cursor-pointer">Cancel</button>
                <button onClick={confirmRegistration} className="flex-1 btn-black py-4 shadow-xl shadow-black/10 cursor-pointer">Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TVWHubView;
