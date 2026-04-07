import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, User, LogOut, Share2, LayoutDashboard } from "lucide-react";
import tataEngageLogo from "@/assets/tata-engage-logo.png";
import type { View } from "@/types";

const Navbar = ({
  onNavigate,
  isLoggedIn,
  onLogout,
  user,
}: {
  onNavigate: (view: View) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  user: any;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const roleLabel = () => {
    if (!user) return "";
    if (user.role === "ngo") return `NGO · ${user.organization}`;
    if (user.role === "corporate_spoc") return `Corporate SPOC · ${user.company}`;
    if (user.role === "platform_admin") return "TSG Admin";
    return `Tata Employee · ${user.company}`;
  };

  const dashboardView = (): View =>
    user?.role === "ngo"
      ? "ngo-dashboard"
      : user?.role === "corporate_spoc"
      ? "spoc-dashboard"
      : user?.role === "platform_admin"
      ? "admin-dashboard"
      : "dashboard";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Top strip — ProEngage teal accent */}
      <div className="h-8 bg-[#003580] flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-[11px] tracking-wide">
            Tata Sons Group · Volunteering Platform
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-white/70 text-[11px]">
          <span className="hover:text-white cursor-pointer transition-colors">About TataEngage</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer transition-colors">Resources</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer transition-colors">Partner With Us</span>
        </div>
      </div>

      {/* Main nav bar */}
      <div className="h-16 bg-white border-b border-zinc-100 flex items-center justify-between px-6 md:px-12">
        {/* Left: Tata logo */}
        <div className="flex items-center gap-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/1200px-Tata_logo.svg.png"
            alt="TATA"
            className="h-8 md:h-10 object-contain cursor-pointer"
            onClick={() => onNavigate(isLoggedIn ? dashboardView() : "home")}
            referrerPolicy="no-referrer"
          />
          {/* Public nav links — only when not logged in */}
          {!isLoggedIn && (
            <div className="hidden md:flex items-center gap-6">
              {["Home", "Our Programs", "Impact Stories", "Partner With Us"].map((link) => (
                <span
                  key={link}
                  onClick={() => link === "Home" && onNavigate("home")}
                  className="text-sm font-medium text-zinc-600 hover:text-[#003580] transition-colors cursor-pointer"
                >
                  {link}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Centre: TataEngage logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <img
            src={tataEngageLogo}
            alt="TATA engage"
            className="h-12 md:h-14 object-contain cursor-pointer"
            onClick={() => onNavigate(isLoggedIn ? dashboardView() : "home")}
          />
        </div>

        {/* Right: bell + avatar */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <button className="p-2 hover:bg-zinc-100 rounded-full cursor-pointer relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Avatar dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#003580] text-white flex items-center justify-center text-sm font-bold">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>
                  <ChevronDown size={14} className="text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-zinc-100 overflow-hidden z-[80]">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-zinc-100">
                      <div className="font-semibold text-sm text-zinc-900">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{roleLabel()}</p>
                    </div>
                    {/* Menu items */}
                    <div className="py-1">
                      <button
                        onClick={() => { onNavigate("profile"); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                      >
                        <User size={16} /> Profile
                      </button>
                      <button
                        onClick={() => { onNavigate(dashboardView()); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                      >
                        <LayoutDashboard size={16} /> My Hub
                      </button>
                      <button
                        onClick={() => { setDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                      >
                        <Share2 size={16} /> Refer a Colleague
                      </button>
                    </div>
                    <div className="border-t border-zinc-100 py-1">
                      <button
                        onClick={() => { onLogout(); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span
                onClick={() => onNavigate("login")}
                className="text-sm font-medium text-zinc-600 hover:text-[#003580] transition-colors cursor-pointer"
              >
                Log In
              </span>
              <button
                onClick={() => onNavigate("register-role")}
                className="btn-black py-2 px-5 text-sm cursor-pointer"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
