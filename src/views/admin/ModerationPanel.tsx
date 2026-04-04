import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp } from "lucide-react";

interface ModerationItem {
  id: number;
  submitter: string;
  text: string;
  date: string;
  status: string;
}

const INITIAL_NGO_TESTIMONIALS: ModerationItem[] = [
  { id: 1, submitter: "Pratham Foundation", text: "The volunteer cohort exceeded our expectations in the digital literacy project across 3 districts.", date: "2 Apr 2026", status: "Pending" },
  { id: 2, submitter: "Teach For India", text: "Exceptional commitment from TCS volunteers — they helped us scale to 12 new classrooms this quarter.", date: "30 Mar 2026", status: "Pending" },
  { id: 3, submitter: "CRY India", text: "Our partnership with Tata Volunteering Week delivered measurable outcomes for child welfare programmes.", date: "28 Mar 2026", status: "Pending" },
];

const INITIAL_VOLUNTEER_TESTIMONIALS: ModerationItem[] = [
  { id: 10, submitter: "Priya Sharma", text: "It was a life-changing experience teaching the elderly how to use digital payments safely.", date: "1 Apr 2026", status: "Pending" },
  { id: 11, submitter: "Amit Verma", text: "Seeing the impact on the ground was incredible — the farmers adopted new techniques within weeks.", date: "29 Mar 2026", status: "Pending" },
];

const INITIAL_VIBE_SUBMISSIONS: ModerationItem[] = [
  { id: 20, submitter: "Rohan Desai", text: "Beach cleanup drive at Versova — 200 kg of plastic collected by our team of 45 volunteers!", date: "3 Apr 2026", status: "Pending" },
  { id: 21, submitter: "Sneha Patil", text: "Tree plantation event in Pune — planted 500 saplings with the local community and school children.", date: "1 Apr 2026", status: "Pending" },
  { id: 22, submitter: "Kavita Nair", text: "Health awareness camp in rural Kerala — free check-ups for 300+ families over the weekend.", date: "28 Mar 2026", status: "Pending" },
  { id: 23, submitter: "Arjun Mehta", text: "Coding bootcamp for underprivileged youth — 60 students completed their first web project!", date: "25 Mar 2026", status: "Pending" },
];

export const ModerationPanel = ({ addAuditLog, triggerToast }: { addAuditLog: any; triggerToast: any }) => {
  const [ngoTestimonials, setNgoTestimonials] = useState(INITIAL_NGO_TESTIMONIALS);
  const [volunteerTestimonials, setVolunteerTestimonials] = useState(INITIAL_VOLUNTEER_TESTIMONIALS);
  const [vibeSubmissions, setVibeSubmissions] = useState(INITIAL_VIBE_SUBMISSIONS);

  const handleAction = (
    setter: React.Dispatch<React.SetStateAction<ModerationItem[]>>,
    category: string,
    id: number,
    action: "Approved" | "Rejected"
  ) => {
    setter(prev => prev.filter(item => item.id !== id));
    addAuditLog(`${category} Moderated`, `Item ${id} ${action.toLowerCase()}`);
    triggerToast(`${category} ${action.toLowerCase()}.`);
  };

  const truncate = (text: string, max = 80) =>
    text.length > max ? text.slice(0, max) + "…" : text;

  const renderSection = (
    title: string,
    items: ModerationItem[],
    setter: React.Dispatch<React.SetStateAction<ModerationItem[]>>,
    category: string
  ) => (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-[0.1em]">{title}</h3>
        <span className="text-xs font-bold text-white bg-tata-blue px-2.5 py-0.5 rounded-full min-w-[22px] text-center">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-xl border border-slate-100">
          <ThumbsUp size={40} className="text-slate-300 mb-4" />
          <h4 className="text-[15px] font-medium text-slate-700 mb-1">Nothing to moderate</h4>
          <p className="text-[13px] text-muted-foreground">Approved content will publish automatically.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                <th className="p-4">Submitter</th>
                <th className="p-4">Excerpt</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <AnimatePresence>
              <tbody className="divide-y divide-slate-50">
                {items.map(item => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <span className="text-xs font-semibold text-slate-900">{item.submitter}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-slate-600 font-medium">{truncate(item.text)}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-muted-foreground font-mono">{item.date}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleAction(setter, category, item.id, "Approved")}
                          className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-100 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(setter, category, item.id, "Rejected")}
                          className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </AnimatePresence>
          </table>
        </div>
      )}
    </section>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-[0.1em]">Content Moderation</h3>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Review and approve testimonials and vibe submissions before they go live.</p>
      </div>

      {renderSection("NGO testimonials", ngoTestimonials, setNgoTestimonials, "NGO Testimonial")}
      {renderSection("Volunteer testimonials", volunteerTestimonials, setVolunteerTestimonials, "Volunteer Testimonial")}
      {renderSection("Biweekly vibe submissions", vibeSubmissions, setVibeSubmissions, "Vibe Submission")}
    </div>
  );
};
