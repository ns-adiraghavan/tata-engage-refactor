import { ChevronRight, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import tataEngageLogoNoBg from "@/assets/tata-engage-logo-nobg.png";

const Footer = () => (
  <footer className="bg-slate-900 text-white pt-16 pb-8 px-6 md:px-12">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
      <div>
        <div className="mb-6">
          <img 
            src={tataEngageLogoNoBg} 
            alt="TATA engage" 
            className="h-14 md:h-16 object-contain brightness-0 invert"
          />
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          Tata Engage is the group-wide volunteering programme that encourages Tata employees, 
          their families, and retirees to volunteer their time and skills for the benefit of society.
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-6">Quick Links</h4>
        <ul className="space-y-3 text-slate-400 text-sm">
          <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Volunteering Policy</a></li>
          <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
          <li><a href="/login" className="hover:text-white transition-colors">Login</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-6">Programmes</h4>
        <ul className="space-y-3 text-slate-400 text-sm">
          <li><a href="#" className="hover:text-white transition-colors">TVW (Tata Volunteering Week)</a></li>
          <li><a href="#" className="hover:text-white transition-colors">ProEngage</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Tata Pro-Bono</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Disaster Response</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-6">Connect With Us</h4>
        <div className="flex gap-4 mb-6">
          <Facebook size={20} className="text-slate-400 hover:text-white cursor-pointer" />
          <Twitter size={20} className="text-slate-400 hover:text-white cursor-pointer" />
          <Instagram size={20} className="text-slate-400 hover:text-white cursor-pointer" />
          <Linkedin size={20} className="text-slate-400 hover:text-white cursor-pointer" />
          <Youtube size={20} className="text-slate-400 hover:text-white cursor-pointer" />
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-xs text-slate-400 mb-2">Subscribe to our newsletter</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Email address" className="bg-transparent border-b border-slate-600 text-sm py-1 focus:outline-none flex-1" />
            <button className="text-tata-cyan cursor-pointer"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
      <p>© 2026 Tata Sons Private Limited. All rights reserved.</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-white">Privacy Policy</a>
        <a href="#" className="hover:text-white">Terms of Use</a>
        <a href="#" className="hover:text-white">Cookie Policy</a>
        <a href="/admin-login" className="hover:text-slate-400 transition-colors">Admin access</a>
      </div>
    </div>
  </footer>
);

export default Footer;
