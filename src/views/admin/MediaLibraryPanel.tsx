import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { X, Lock, Youtube, FileText, Upload } from "lucide-react";
import { MOCK_MEDIA_ASSETS } from "@/data/mockData";

export const MediaLibraryPanel = ({ triggerToast }: { triggerToast: any }) => {
  const [filter, setFilter] = useState("All");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Media Library</h2>
          <p className="text-xs text-slate-400 font-mono mt-1">Manage all uploaded images, documents, and videos.</p>
        </div>
        <button onClick={() => triggerToast("Upload triggered...")} className="px-6 py-3 bg-zinc-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2">
          <Upload size={16} /> Upload Asset
        </button>
      </div>

      <div className="flex gap-4 border-b border-slate-200 pb-4">
        {["All", "TVW", "ProEngage", "General"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`text-xs font-semibold uppercase tracking-widest transition-all ${filter === f ? 'text-tata-blue' : 'text-slate-400 hover:text-slate-600'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {MOCK_MEDIA_ASSETS.filter(a => filter === "All" || a.programme === filter).map(asset => (
          <div key={asset.id} onClick={() => setSelectedAsset(asset)} className="bg-white border border-slate-200 group cursor-pointer hover:border-tata-blue transition-all">
            <div className="aspect-square bg-slate-100 overflow-hidden relative">
              {asset.type === "image" ? (
                <img src={asset.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={asset.name} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  {asset.type === "pdf" ? <FileText size={48} /> : <Youtube size={48} />}
                </div>
              )}
              {asset.privacy !== "Public" && (
                <div className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded backdrop-blur-sm">
                  <Lock size={10} />
                </div>
              )}
            </div>
            <div className="p-3">
              <div className="text-xs font-bold text-slate-900 truncate">{asset.name}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-1 uppercase">{asset.programme} • {asset.date}</div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md border border-slate-200 shadow-2xl p-8 space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest">Asset Details</h3>
                <button onClick={() => setSelectedAsset(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="aspect-video bg-slate-100 border border-slate-100 flex items-center justify-center">
                {selectedAsset.type === "image" ? <img src={selectedAsset.url} className="w-full h-full object-contain" alt="" /> : <FileText size={64} className="text-slate-300" />}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">File Name</label>
                  <p className="text-xs font-bold text-slate-900">{selectedAsset.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Programme</label>
                    <p className="text-xs font-bold text-slate-900">{selectedAsset.programme}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Privacy</label>
                    <p className="text-xs font-bold text-slate-900">{selectedAsset.privacy}</p>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Usage</label>
                  <p className="text-xs text-slate-500 italic">Appears on: TVW Hub Hero, News Feed</p>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 flex gap-4">
                <button className="flex-1 py-3 border border-slate-200 text-xs font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all">Delete Asset</button>
                <button onClick={() => triggerToast("Asset settings updated.")} className="flex-1 py-3 bg-tata-blue text-white text-xs font-semibold uppercase tracking-widest hover:bg-blue-900 transition-all">Update Privacy</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
