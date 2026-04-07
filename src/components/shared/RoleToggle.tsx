import { useAppNavigate } from "@/hooks/useAppNavigate";

interface RoleToggleProps {
  activeView: "volunteer" | "spoc";
  className?: string;
}

const RoleToggle = ({ activeView, className = "" }: RoleToggleProps) => {
  const navigate = useAppNavigate();

  return (
    <div className={`inline-flex p-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 ${className}`}>
      <button
        onClick={() => navigate("volunteer-hub")}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
          activeView === "volunteer"
            ? "bg-white text-slate-900 shadow-md"
            : "text-white/80 hover:text-white hover:bg-white/10"
        }`}
      >
        👤 Volunteer view
      </button>
      <button
        onClick={() => navigate("spoc-hub")}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
          activeView === "spoc"
            ? "bg-white text-slate-900 shadow-md"
            : "text-white/80 hover:text-white hover:bg-white/10"
        }`}
      >
        🧑‍💼 SPOC view
      </button>
    </div>
  );
};

export default RoleToggle;
