import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Plus, Save, Activity } from "lucide-react";
import { MOCK_CMS_ITEMS } from "@/data/mockData";

export const CMSContentPanel = ({ addAuditLog, triggerToast }: { addAuditLog: any, triggerToast: any }) => {
  const [items, setItems] = useState(MOCK_CMS_ITEMS);
  const [showDrawer, setShowDrawer] = useState(false);
  const [newItem, setNewItem] = useState({ type: "Banner", title: "", body: "", tags: [] as string[] });
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [openHistoryId, setOpenHistoryId] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const moveItem = (id: number, newStatus: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newVersion = item.version + 1;
        const newHistory = [...item.history, `v${newVersion} — Moved to ${newStatus} by Vikram`];
        return { ...item, status: newStatus, version: newVersion, history: newHistory };
      }
      return item;
    }));
    addAuditLog("CMS Content Moved", `Moved item ${id} to ${newStatus}`);
    triggerToast(`Content moved to ${newStatus}`);
  };

  const handleAiSuggest = async () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setNewItem(prev => ({
        ...prev,
        body: `[AI Generated Draft for ${prev.title}]\n\nVolunteering is a core value at Tata. This ${prev.type.toLowerCase()} aims to highlight our commitment to social impact through the ${prev.tags.join(" & ") || "General"} programme. Join us in making a difference today.`
      }));
      setIsAiLoading(false);
      triggerToast("AI-06: Draft suggested based on title.");
    }, 1500);
  };

  const Column = ({ title, status, openHistoryId, setOpenHistoryId }: { title: string, status: string, openHistoryId: number | null, setOpenHistoryId: (id: number | null) => void }) => (
    <div className="flex-1 bg-slate-50 p-6 border border-slate-200 min-h-[600px]">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">{title}</h3>
      <div className="space-y-4">
        {items.filter(i => i.status === status).map(item => (
          <div key={item.id} className="bg-white p-4 border border-slate-200 shadow-sm hover:border-tata-blue transition-all group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">{item.type}</span>
              <span className="text-xs font-mono text-slate-400">v{item.version}</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 mb-2">{item.title}</h4>
            <div className="flex flex-wrap gap-1 mb-4">
              {item.tags.map(t => <span key={t} className="text-xs font-bold text-tata-blue">#{t}</span>)}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
              <div className="text-xs text-slate-400 font-mono">By {item.author}</div>
              <div className="flex gap-2">
                {status === "Draft" && (
                  <button onClick={() => moveItem(item.id, "In Review")} className="text-xs font-semibold text-tata-blue uppercase tracking-widest hover:underline">Submit</button>
                )}
                {status === "In Review" && (
                  <>
                    <button onClick={() => moveItem(item.id, "Published")} className="text-xs font-semibold text-green-600 uppercase tracking-widest hover:underline">Publish</button>
                    <button onClick={() => moveItem(item.id, "Draft")} className="text-xs font-semibold text-red-600 uppercase tracking-widest hover:underline">Return</button>
                  </>
                )}
                {status === "Published" && (
                  <button onClick={() => moveItem(item.id, "Draft")} className="text-xs font-semibold text-slate-400 uppercase tracking-widest hover:underline">Unpublish</button>
                )}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-50">
              <button
                onClick={() => setOpenHistoryId(openHistoryId === item.id ? null : item.id)}
                className="text-xs font-semibold text-slate-400 uppercase tracking-widest hover:text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{openHistoryId === item.id ? "▲" : "▼"}</span> History
              </button>
              {openHistoryId === item.id && (
                <ul className="mt-3 space-y-1">
                  {item.history.map((entry: string, idx: number) => (
                    <li key={idx} className="text-xs text-slate-400 font-mono leading-relaxed">
                      {entry}
                    </li>
                  ))}
                  {status === "Published" && (
                    <li>
                      <button
                        onClick={() => { moveItem(item.id, "Draft"); setOpenHistoryId(null); }}
                        className="text-xs font-semibold text-red-500 uppercase tracking-widest hover:underline mt-2 cursor-pointer"
                      >
                        Roll back to Draft
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-[0.1em]">CMS Content Workflow</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Manage platform content through a structured review process.</p>
        </div>
        <button 
          onClick={() => setShowDrawer(true)}
          className="px-6 py-3 bg-tata-blue text-white text-xs font-semibold uppercase tracking-widest rounded-2xl shadow-lg shadow-tata-blue/20 hover:bg-blue-900 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
        >
          <Plus size={16} /> New Content
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Column title="Draft" status="Draft" openHistoryId={openHistoryId} setOpenHistoryId={setOpenHistoryId} />
        <Column title="In Review" status="In Review" openHistoryId={openHistoryId} setOpenHistoryId={setOpenHistoryId} />
        <Column title="Published" status="Published" openHistoryId={openHistoryId} setOpenHistoryId={setOpenHistoryId} />
      </div>

      <AnimatePresence>
        {showDrawer && (
          <div className="fixed inset-0 z-[200] flex justify-end bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="w-full max-w-2xl bg-white h-full shadow-sm flex flex-col p-10">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest">Create New Content</h3>
                <button onClick={() => setShowDrawer(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="space-y-6 flex-1 overflow-y-auto pr-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Content Type</label>
                  <select className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm bg-white" value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value})}>
                    <option>Banner</option>
                    <option>Event Page</option>
                    <option>News Post</option>
                    <option>Programme Update</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Title</label>
                  <input type="text" className="w-full p-3 border border-slate-200 outline-none focus:border-tata-blue text-sm font-bold" placeholder="Enter title..." value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Body Content</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleAiSuggest}
                        disabled={!newItem.title || isAiLoading}
                        className="text-xs font-semibold text-tata-blue uppercase tracking-widest flex items-center gap-1 hover:underline disabled:opacity-30"
                      >
                        {isAiLoading ? <Activity size={12} className="animate-spin" /> : <Sparkles size={12} />} Suggest (AI-06)
                      </button>
                      <button
                        onClick={() => setPreviewMode(p => !p)}
                        disabled={!newItem.body}
                        className="text-xs font-semibold text-slate-400 uppercase tracking-widest hover:text-slate-700 disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        {previewMode ? "Edit" : "Preview"}
                      </button>
                    </div>
                  </div>
                  {previewMode ? (
                    <div className="w-full p-4 border border-slate-100 bg-slate-50 rounded-lg text-sm leading-relaxed min-h-[200px] text-slate-700 whitespace-pre-wrap">
                      {newItem.body || <span className="text-slate-300 italic">No content yet.</span>}
                    </div>
                  ) : (
                    <textarea
                      className="w-full p-4 border border-slate-200 outline-none focus:border-tata-blue text-sm min-h-[200px] leading-relaxed rounded-lg"
                      placeholder="Write content here..."
                      value={newItem.body}
                      onChange={e => setNewItem({...newItem, body: e.target.value})}
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Tags</label>
                  <div className="flex gap-2">
                    {["TVW", "ProEngage", "General"].map(tag => (
                      <button key={tag} onClick={() => setNewItem({...newItem, tags: newItem.tags.includes(tag) ? newItem.tags.filter(t => t !== tag) : [...newItem.tags, tag]})} className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest border transition-all ${newItem.tags.includes(tag) ? 'bg-tata-blue text-white border-tata-blue' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-10 border-t border-slate-100 flex gap-4">
                <button onClick={() => setShowDrawer(false)} className="flex-1 py-4 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all">Discard</button>
                <button onClick={() => { triggerToast("Draft saved."); setShowDrawer(false); }} className="flex-1 py-4 bg-tata-blue text-white text-xs font-semibold uppercase tracking-widest hover:bg-blue-900 transition-all">Save as Draft</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
