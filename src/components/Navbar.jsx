import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Menu, X } from 'lucide-react';
import { BUSINESS_INFO } from '../lib/types';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const cleanPhoneNum = BUSINESS_INFO.phone.replace(/[^0-9+]/g, '');

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200">
      
      {/* Top Banner Bar - Hidden on mobile screen viewports to prevent layout wrapping */}
      <div className="hidden md:flex bg-slate-900 text-slate-300 text-[11px] py-1.5 px-6 justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> GSTIN: {BUSINESS_INFO.gstin}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Prop: {BUSINESS_INFO.owner} (Estd. {BUSINESS_INFO.established})</span>
        </div>
        <div className="flex items-center gap-3">
          <a href={`tel:${cleanPhoneNum}`} className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors font-mono font-semibold">
            <Phone className="w-3.5 h-3.5 text-emerald-400" /> {BUSINESS_INFO.phone}
          </a>
          <span className="text-slate-600">•</span>
          <span className="text-amber-400 font-medium">Jamalpur, Bihar</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0 bg-white flex items-center justify-center">
            <img 
              src="/logo.jpeg" 
              alt="Kanha Door House Logo" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-sm sm:text-lg text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors truncate">
              KANHA <span className="text-emerald-600">DOOR HOUSE</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mt-0.5 truncate hidden xs:block">
              WPVC • UPVC • Aluminium • Flush Doors
            </div>
          </div>
        </Link>

        {/* Desktop Links (Hidden on Mobile) */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-extrabold text-slate-700 tracking-wide uppercase">
          <a href="/#products" className="hover:text-emerald-600 transition-colors whitespace-nowrap">Products & Specs</a>
          <a href="/#machinery" className="hover:text-emerald-600 transition-colors whitespace-nowrap">Precision Manufacturing</a>
          <a href="/#quote" className="hover:text-emerald-600 transition-colors whitespace-nowrap">Estimator</a>
          <a href="/#contact" className="hover:text-emerald-600 transition-colors whitespace-nowrap">Contact</a>
        </div>

        {/* Right Side: Quick Call Pill + Mobile Menu Button */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`tel:${cleanPhoneNum}`}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm shadow-emerald-600/30 transition-all active:scale-95"
            title="Call Kanha Door House"
          >
            <Phone className="w-3.5 h-3.5 fill-white" />
            <span className="hidden xs:inline">Call Shop</span>
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
          </button>
        </div>

      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <a
            href="/#products"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <span>Products & Specs</span>
            <span className="text-xs text-slate-400">🚪</span>
          </a>
          <a
            href="/#machinery"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <span>Precision Manufacturing</span>
            <span className="text-xs text-slate-400">⚙️</span>
          </a>
          <a
            href="/#quote"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <span>Instant Cost Estimator</span>
            <span className="text-xs text-slate-400">🧮</span>
          </a>
          <a
            href="/#contact"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <span>Contact & Location</span>
            <span className="text-xs text-slate-400">📍</span>
          </a>

          <div className="pt-3 border-t border-slate-100">
            <a
              href={`tel:${cleanPhoneNum}`}
              className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call Shop: {BUSINESS_INFO.phone}</span>
            </a>
          </div>
        </div>
      )}

    </header>
  );
}
