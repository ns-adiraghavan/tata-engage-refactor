import { Menu, Bell } from "lucide-react";
import type { View } from "@/types";
import type { View } from "@/types";

const Navbar = ({ onNavigate, isLoggedIn, onToggleMenu, user }: { 
  onNavigate: (view: View) => void, 
  isLoggedIn: boolean,
  onToggleMenu: () => void,
  user: any
}) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-100 h-20 flex items-center px-6 md:px-12 justify-between">
    <div className="flex items-center">
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/1200px-Tata_logo.svg.png" 
        alt="TATA" 
        className="h-8 md:h-10 object-contain cursor-pointer"
        onClick={() => onNavigate(isLoggedIn ? "dashboard" : "home")}
        referrerPolicy="no-referrer"
      />
    </div>

    <div className="flex items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center cursor-pointer group" onClick={onToggleMenu}>
          <Menu size={24} className="text-[#003580]" />
          <span className="text-[#003580] font-bold text-[10px] uppercase tracking-tight">Menu</span>
        </div>
        <div className="h-10 w-px bg-zinc-200 mx-2 hidden md:block" />
        <div className="flex items-center cursor-pointer" onClick={() => onNavigate(user.role === 'ngo' ? 'ngo-dashboard' : (isLoggedIn ? "dashboard" : "home"))}>
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG2f-xo_Z2La9Y0SPnOLqZWBtorh4oXrzkVg&s" 
            alt="TATA engage" 
            className="h-12 md:h-14 object-contain"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback to text logo if image fails
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent && !parent.querySelector('.text-logo-fallback')) {
                const fallback = document.createElement('div');
                fallback.className = 'text-logo-fallback flex items-center gap-1 text-xl font-bold tracking-tighter';
                fallback.innerHTML = '<span class="text-[#003580]">TATA</span><span class="text-[#00b4d8]">engage</span>';
                parent.appendChild(fallback);
              }
            }}
          />
        </div>
      </div>

      {isLoggedIn ? (
        <div className="flex items-center gap-4 ml-4">
          <div className="hidden md:block text-right">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Good Morning</div>
            <div className="text-sm font-bold text-tata-blue">
              {user.role === 'ngo' ? `${user.firstName} (${user.organization})` : `${user.firstName} ☀`}
            </div>
          </div>
          <button className="p-2 hover:bg-zinc-100 rounded-full cursor-pointer relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div 
            onClick={() => onNavigate("profile")}
            className="w-10 h-10 rounded-full bg-tata-blue text-white flex items-center justify-center font-bold cursor-pointer hover:ring-4 ring-tata-blue/10 transition-all"
          >
            {user.firstName[0]}{user.lastName[0]}
          </div>
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-3 ml-4">
          <button onClick={() => onNavigate("login")} className="btn-outline py-2 px-6 text-sm cursor-pointer">Login</button>
          <button onClick={() => onNavigate("register-role")} className="btn-black py-2 px-6 text-sm cursor-pointer">Register</button>
        </div>
      )}
    </div>
  </nav>
);

export default Navbar;
