import { useState } from "react";
import { User } from "lucide-react";
import { MOCK_TESTIMONIALS, MOCK_FLAGGED_COMMENTS } from "@/data/mockData";

export const ModerationPanel = ({ addAuditLog, triggerToast }: { addAuditLog: any, triggerToast: any }) => {
  const [testimonials, setTestimonials] = useState(MOCK_TESTIMONIALS);
  const [comments, setComments] = useState(MOCK_FLAGGED_COMMENTS);

  const handleTestimonial = (id: number, status: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    addAuditLog("Testimonial Moderated", `Testimonial ${id} set to ${status}`);
    triggerToast(`Testimonial ${status.toLowerCase()}`);
  };

  const handleComment = (id: number, action: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, status: action === "Remove" ? "Removed" : "Dismissed" } : c));
    addAuditLog("Comment Moderated", `Comment ${id} ${action.toLowerCase()}d`);
    triggerToast(`Comment ${action.toLowerCase()}d`);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-6">
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.1em]">Testimonials Queue</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Review and approve volunteer success stories.</p>
          </div>
          <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            {testimonials.filter(t => t.status === "Pending").length} Pending
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all relative group">
              {t.status === "Approved" && (
                <div className="absolute top-4 right-4 px-2 py-0.5 bg-green-50 text-green-600 text-[8px] font-black uppercase tracking-widest rounded-lg border border-green-100">
                  Live
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-tata-blue/10 group-hover:text-tata-blue transition-colors">
                  {t.volunteer[0]}
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 uppercase tracking-tight">{t.volunteer}</div>
                  <div className="text-[9px] text-slate-400 font-mono uppercase tracking-widest">{t.project}</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-50">
                "{t.text}"
              </p>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => handleTestimonial(t.id, "Approved")} 
                  className="flex-1 py-2.5 bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-600/20 transition-all border border-green-100"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleTestimonial(t.id, "Unpublished")} 
                  className="flex-1 py-2.5 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 hover:text-slate-600 transition-all border border-slate-100"
                >
                  Unpublish
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.1em]">Comment Moderation</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Manage flagged content and maintain community standards.</p>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100 animate-pulse">
              {comments.filter(c => c.status === "Flagged").length} Flagged
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-6">User</th>
                <th className="p-6">Comment</th>
                <th className="p-6">Reason</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {comments.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="text-xs font-black text-slate-900 uppercase tracking-tight">{c.user}</div>
                  </td>
                  <td className="p-6">
                    <p className="text-xs text-slate-600 max-w-md truncate font-medium">{c.comment}</p>
                  </td>
                  <td className="p-6">
                    <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-100 uppercase tracking-widest">
                      {c.reason}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                      c.status === "Flagged" ? "bg-amber-50 text-amber-600 border-amber-100" : 
                      c.status === "Removed" ? "bg-red-50 text-red-600 border-red-100" : 
                      "bg-slate-50 text-slate-400 border-slate-100"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-6 text-right space-x-3">
                    <button 
                      onClick={() => handleComment(c.id, "Dismiss")} 
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-tata-blue transition-colors"
                    >
                      Dismiss Flag
                    </button>
                    <button 
                      onClick={() => handleComment(c.id, "Remove")} 
                      className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline"
                    >
                      Remove Comment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
