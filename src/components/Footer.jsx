import { ShieldCheck, MapPin, Phone, Award, CheckCircle2 } from 'lucide-react';
import { BUSINESS_INFO } from '../lib/types';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Col 1: Business Overview */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-600 shrink-0">
              <img src="/logo.jpeg" alt="Kanha Door House" className="w-full h-full object-cover object-center" />
            </div>
            <div className="font-bold text-lg text-white tracking-tight leading-tight">
              KANHA <span className="text-emerald-500">DOOR HOUSE</span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Leading manufacturer and installer of high-precision WPVC Doors, UPVC Doors & Windows, Aluminium Frames, and Waterproof Flush Doors in Bihar since {BUSINESS_INFO.established}.
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/60 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4 shrink-0" /> GSTIN: {BUSINESS_INFO.gstin}
          </div>
        </div>

        {/* Col 2: Products */}
        <div>
          <div className="font-semibold text-sm text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Manufacturing Range
          </div>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> WPVC Waterproof Main Doors</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> UPVC Sliding & Casement Windows</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Aluminium 3-Track Windows</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Termite Proof Flush Doors</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Toughened Glass Fittings & Locks</li>
          </ul>
        </div>

        {/* Col 3: Quick Links */}
        <div>
          <div className="font-semibold text-sm text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Quick Links
          </div>
          <ul className="space-y-2.5 text-xs">
            <li><a href="/#quote" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">🧮 Request On-Site Measurement</a></li>
            <li><a href="/#products" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">🚪 Products & Material Specs</a></li>
            <li><a href="/#machinery" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">⚙️ Machine Cutting & Fitting</a></li>
            <li><a href="/#contact" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">📍 Contact & Location</a></li>
          </ul>
        </div>

        {/* Col 4: Address & Contact */}
        <div className="space-y-3">
          <div className="font-semibold text-sm text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Shop
          </div>
          <div className="flex items-start gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{BUSINESS_INFO.address}</span>
          </div>
          <a href={`tel:${BUSINESS_INFO.phone.replace(/\s/g,'')}`} className="flex items-center gap-2.5 text-xs hover:text-emerald-400 transition-colors">
            <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{BUSINESS_INFO.phone}</span>
          </a>
          <div className="flex items-center gap-2.5 text-xs">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Proprietor: <strong className="text-slate-300">{BUSINESS_INFO.owner}</strong></span>
          </div>
        </div>

      </div>

      {/* Bottom Legal Bar */}
      <div className="bg-slate-900 border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved. GST Compliant Billing & Field Service System.
      </div>
    </footer>
  );
}
