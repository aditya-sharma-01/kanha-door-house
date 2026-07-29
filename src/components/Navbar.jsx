import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Hammer, Menu, X, Wrench, Lock } from 'lucide-react';
import { BUSINESS_INFO } from '../lib/types';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-panel shadow-sm border-b border-slate-200">
      {/* Top Banner Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> GSTIN: {BUSINESS_INFO.gstin}
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">Prop: {BUSINESS_INFO.owner} (Estd. {BUSINESS_INFO.established})</span>
        </div>
        <div className="flex items-center gap-4">
          <a href={`tel:${BUSINESS_INFO.phone.split('/')[0].trim()}`} className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
            <Phone className="w-3.5 h-3.5 text-emerald-400" /> {BUSINESS_INFO.phone}
          </a>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-amber-400 font-medium">Jamalpur, Bihar</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex justify-between items-center">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-xl text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
              KANHA <span className="text-emerald-600">DOOR HOUSE</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium tracking-wide uppercase mt-0.5">
              WPVC • UPVC • Aluminium • Flush Doors
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="flex items-center gap-6 text-sm font-semibold text-slate-700">
          <a href="/#products" className="hover:text-emerald-600 transition-colors">Products & Specs</a>
          <a href="/#machinery" className="hover:text-emerald-600 transition-colors">Precision Manufacturing</a>
          <a href="/#quote" className="hover:text-emerald-600 transition-colors">Instant Estimator</a>
          <a href="/#contact" className="hover:text-emerald-600 transition-colors">Contact Us</a>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3">
          <a href="/#products" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold text-slate-700 py-1">Products & Specs</a>
          <a href="/#machinery" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold text-slate-700 py-1">Precision Manufacturing</a>
          <a href="/#quote" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold text-slate-700 py-1">Instant Estimator</a>
          <a href="/#contact" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold text-slate-700 py-1">Contact & Location</a>
        </div>
      )}
    </header>
  );
}
