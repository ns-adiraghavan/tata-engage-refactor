import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageSquare, AlertTriangle } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

const Chatbot = () => {
  const { user, userRole } = useAuth();
  const { isChatOpen, setIsChatOpen, isDRActive, chatMessages, setChatMessages, activeProject, setSupportHistory, setShowSupportModal, setSupportSubject, ngoData } = useAppContext();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const volunteerSuggestions = [
    "How do I access my certificate?",
    "Can I change my project mode?",
    "What is TVW 2025 theme?"
  ];

  const drSuggestions = [
    "Deployment logistics for Assam",
    "What skills are needed?",
    "What should I pack?",
    "Coordinate with SPOC"
  ];

  const ngoSuggestions = [
    "How to submit a new project?",
    "Manage application queue",
    "Feedback & certificate timelines",
    "Coordinator management"
  ];

  const suggestions = isDRActive ? drSuggestions : (userRole === 'ngo' ? ngoSuggestions : volunteerSuggestions);

  const handleEscalate = () => {
    setSupportSubject(`Support Request for ${activeProject?.title || 'General Query'}`);
    setShowSupportModal(true);
    setIsChatOpen(false);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), text, sender: 'user' as const };
    setChatMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let systemPrompt = "You are the Tata Engage Assistant, a helpful AI for volunteers and NGOs.";
      if (isDRActive) {
        systemPrompt = "You are the Tata Engage Disaster Response Assistant. Provide information about deployment logistics, safety protocols, and coordination during active disaster relief missions.";
      } else if (userRole === 'ngo') {
        const activeProj = ngoData.projects.find(p => p.status === "Active");
        systemPrompt = `You are the Tata Engage Assistant for NGOs. 
        Current NGO Context: ${ngoData.organization}, Tier: ${ngoData.tier}.
        Current Active Project: ${activeProj ? `${activeProj.title} (Status: ${activeProj.status}, Volunteers: ${activeProj.volunteers})` : 'None'}.
        Knowledge Base: 
        - Project Submission: NGOs can create new projects or clone previous ones.
        - Application Queue: AI shortlists are advisory. NGOs must accept/reject volunteers.
        - Feedback: Due within 3 days of project end date.
        - Certificates: Issued after both NGO and Volunteer feedback are submitted and TSG Admin approves.
        - Coordinators: NGOs can add/remove SPOCs and Coordinators.
        - Edition: TVW Edition 2025 is currently active.
        If you cannot answer a query, suggest escalating to TSG Support.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: text,
        config: { systemInstruction: systemPrompt }
      });

      const botMsg = { 
        id: Date.now() + 1, 
        text: response.text || "I'm sorry, I couldn't process that. Would you like to escalate to TSG Support?", 
        sender: 'bot' as const,
        showEscalate: response.text?.toLowerCase().includes("escalate") || response.text?.toLowerCase().includes("support")
      };
      setChatMessages(prev => [...prev, botMsg]);
      
      // Log to history if it's a significant interaction
      if (userRole === 'ngo') {
        setSupportHistory(prev => [{
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          query: text,
          summary: response.text?.substring(0, 100) + "..."
        }, ...prev]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      const botMsg = { id: Date.now() + 1, text: "I'm having trouble connecting. Please try again or escalate to support.", sender: 'bot' as const, showEscalate: true };
      setChatMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 md:w-96 h-[550px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden mb-4"
          >
            <div className="p-6 bg-tata-blue text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm">Engage AI Assistant</h4>
                    {isDRActive && (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-semibold uppercase tracking-widest rounded-full animate-bounce">
                        DR Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {chatMessages.map(msg => (
                <div key={msg.id} className="space-y-2">
                  <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                      msg.sender === 'user' 
                        ? 'bg-tata-blue text-white rounded-tr-none shadow-lg' 
                        : 'bg-white text-zinc-900 rounded-tl-none border border-slate-100 shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                  {msg.sender === 'bot' && (msg as any).showEscalate && (
                    <div className="flex justify-start pl-2">
                      <button 
                        onClick={handleEscalate}
                        className="text-xs font-bold text-tata-blue hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <AlertTriangle size={10} /> Escalate to TSG Support
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              {chatMessages.length === 1 && (
                <div className="pt-4 space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Suggested Questions</p>
                  {suggestions.map(s => (
                    <button 
                      key={s} 
                      onClick={() => handleSend(s)}
                      className="block w-full text-left p-3 rounded-2xl bg-white border border-slate-100 text-xs text-slate-600 hover:border-tata-blue hover:text-tata-blue transition-all cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-50 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-tata-blue/20"
              />
              <button 
                onClick={() => handleSend(input)}
                className="w-12 h-12 bg-tata-blue text-white rounded-lg flex items-center justify-center hover:bg-tata-blue/90 transition-all cursor-pointer"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer ${isChatOpen ? 'bg-zinc-900 rotate-90' : 'bg-tata-blue'}`}
      >
        {isChatOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
};

export default Chatbot;
