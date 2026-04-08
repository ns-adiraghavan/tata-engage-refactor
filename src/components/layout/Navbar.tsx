import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, User, LogOut, Share2, LayoutDashboard, Search } from "lucide-react";
import tataLogo from "@/assets/tata-logo.png";
import tataEngageLogo from "@/assets/tata-engage-logo.png";
import type { View } from "@/types";
import { MOCK_NOTIFICATIONS } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";

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
  const { triggerToast } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
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

  const hubView = (): View =>
    user?.role === "ngo"
      ? "ngo-hub"
      : user?.role === "corporate_spoc"
      ? "spoc-hub"
      : "volunteer-hub";


  const unreadCount = notifications.filter((n) => !n.read).length;

  const dotColor = (type: string) => {
    if (type === "match") return "bg-green-500";
    if (type === "certificate") return "bg-blue-500";
    return "bg-amber-500";
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setNotifOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="h-16 bg-white border-b border-zinc-100 flex items-center justify-between px-6 md:px-12">
        {/* Left: Tata logo → home */}
        <div className="flex-shrink-0">
          <img
            src={tataLogo}
            alt="Tata"
            className="h-9 w-9 object-contain cursor-pointer"
            onClick={() => onNavigate("home")}
          />
        </div>

        {/* Centre: public nav links */}
        {!isLoggedIn && (
          <div className="hidden md:flex items-center gap-8">
            {["Home", "Our Programmes", "Impact Stories", "Partner With Us", "Resources"].map((link) => (
              <span
                key={link}
                onClick={() => link === "Home" && onNavigate("home")}
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                {link}
              </span>
            ))}
          </div>
        )}

        {/* Right */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* Bell icon + notification panel */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen((o) => !o)}
                  className="p-2 hover:bg-zinc-100 rounded-full cursor-pointer relative"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-sm z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
                      <span className="font-semibold text-sm text-zinc-900">Notifications</span>
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-blue-600 font-medium hover:underline cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    </div>

                    {/* List */}
                    {unreadCount === 0 && notifications.every((n) => n.read) ? (
                      <div className="py-8 text-center">
                        <p className="text-xs text-slate-400">You're all caught up</p>
                      </div>
                    ) : (
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`flex items-start gap-3 px-4 py-3 border-b border-zinc-50 last:border-b-0 ${
                              n.read ? "bg-white" : "bg-slate-50"
                            }`}
                          >
                            <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${dotColor(n.type)}`} />
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-zinc-900">{n.title}</p>
                              <p className="text-xs text-slate-500 line-clamp-2">{n.body}</p>
                              <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Engage logo → hub */}
              <img
                src={tataEngageLogo}
                alt="TATA engage"
                className="h-8 object-contain cursor-pointer hidden md:block"
                onClick={() => onNavigate(hubView())}
              />

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
                    <div className="px-4 py-3 border-b border-zinc-100">
                      <div className="font-semibold text-sm text-zinc-900">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{roleLabel()}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { onNavigate("profile"); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                      >
                        <User size={16} /> Profile
                      </button>
                      <button
                        onClick={() => { onNavigate(hubView()); setDropdownOpen(false); }}
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
