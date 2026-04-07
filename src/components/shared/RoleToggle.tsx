import { useAppNavigate } from "@/hooks/useAppNavigate";

interface RoleToggleProps {
  activeView: "volunteer" | "spoc";
  className?: string;
}

const RoleToggle = ({ activeView, className = "" }: RoleToggleProps) => {
  const navigate = useAppNavigate();

  return (
    <div className={`inline-flex p-1 rounded-full border ${className}`}>
      <button
        onClick={() => navigate("volunteer-hub")}
        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          activeView === "volunteer"
            ? "bg-white text-slate-900 shadow-md"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        👤 Volunteer view
      </button>
      <button
        onClick={() => navigate("spoc-hub")}
        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          activeView === "spoc"
            ? "bg-white text-slate-900 shadow-md"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        🧑‍💼 SPOC view
      </button>
    </div>
  );
};

export default RoleToggle;
