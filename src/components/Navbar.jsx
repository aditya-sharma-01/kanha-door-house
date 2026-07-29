import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Menu, X } from 'lucide-react';
import { BUSINESS_INFO } from '../lib/types';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      {/* Top Banner Bar - hidden on mobile to save space */}
      <div className="hidden sm:flex bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> GSTIN: {BUSINESS_INFO.gstin}
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">Prop: {BUSINESS_INFO.owner} (Estd. {BUSINESS_INFO.established})</span>
        </div>
        <div className="flex items-center gap-3">
          <a href={`tel:${BUSINESS_INFO.phone.replace(/\s/g,'')}`} className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
            <Phone className="w-3.5 h-3.5 text-emerald-400" /> {BUSINESS_INFO.phone}
          </a>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400 font-medium">Jamalpur, Bihar</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-3">

        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          {/* Circular logo frame */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center bg-white">
            <img
              src="/logo.jpeg"
              alt="Kanha Door House Logo"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors truncate">
              KANHA <span className="text-emerald-600">DOOR HOUSE</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mt-0.5 truncate hidden sm:block">
              WPVC • UPVC • Aluminium • Flush Doors
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
          <a href="/#products" className="hover:text-emerald-600 transition-colors whitespace-nowrap">Products</a>
          <a href="/#machinery" className="hover:text-emerald-600 transition-colors whitespace-nowrap">Manufacturing</a>
          <a href="/#quote" className="hover:text-emerald-600 transition-colors whitespace-nowrap">Get Quote</a>
          <a href="/#contact" className="hover:text-emerald-600 transition-colors whitespace-nowrap">Contact</a>
        </div>

        {/* Mobile: phone pill + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={`tel:${BUSINESS_INFO.phone.replace(/\s/g,'')}`}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Call</span>
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-5 py-4 space-y-1 shadow-lg">
          <a href="/#products" onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Products & Specs</a>
          <a href="/#machinery" onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Precision Manufacturing</a>
          <a href="/#quote" onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Instant Estimator</a>
          <a href="/#contact" onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Contact & Location</a>
          <div className="pt-3 border-t border-slate-100">
            <a href={`tel:${BUSINESS_INFO.phone.replace(/\s/g,'')}`} className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors">
              <Phone className="w-4 h-4" /> {BUSINESS_INFO.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
