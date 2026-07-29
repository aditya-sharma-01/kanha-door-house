import Link from 'next/link';
import { ShieldCheck, MapPin, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/types';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Business Overview */}
        <div className="space-y-4">
          <div className="font-bold text-xl text-white tracking-tight">
            KANHA <span className="text-emerald-500">DOOR HOUSE</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Leading manufacturer and installer of high-precision WPVC Doors, UPVC Doors & Windows, Aluminium Architectural Frames, and Waterproof Flush Doors operating in Bihar since {BUSINESS_INFO.established}.
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/60 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" /> GSTIN: {BUSINESS_INFO.gstin}
          </div>
        </div>

        {/* Col 2: Products & Solutions */}
        <div>
          <div className="font-semibold text-sm text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Manufacturing Range
          </div>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> WPVC Waterproof Main Doors</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> UPVC Sliding & Casement Windows</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Heavy Duty Aluminium 3-Track Windows</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Termite Proof Flush Doors</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Toughened Glass Fittings & Locks</li>
          </ul>
        </div>

        {/* Col 3: Quick Navigation */}
        <div>
          <div className="font-semibold text-sm text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Portals & Access
          </div>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">🔑 Internal Managerial ERP</Link></li>
            <li><Link href="/tech-portal" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">🔧 Technician Field Portal</Link></li>
            <li><Link href="/#quote" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">🧮 Request On-Site Measurement</Link></li>
            <li><Link href="/login" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">🔒 Admin & Staff Login</Link></li>
          </ul>
        </div>

        {/* Col 4: Address & Contact */}
        <div className="space-y-3">
          <div className="font-semibold text-sm text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Factory & Showroom
          </div>
          <div className="flex items-start gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{BUSINESS_INFO.address}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{BUSINESS_INFO.phone}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Proprietor: <strong>{BUSINESS_INFO.owner}</strong></span>
          </div>
        </div>

      </div>

      {/* Bottom Legal Credit Bar */}
      <div className="bg-slate-900 border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved. GST Compliant Billing & Field Service System.
      </div>
    </footer>
  );
}
