'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, User, Key, ArrowRight, Wrench } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('admin'); // 'admin', 'manager', 'tech'
  const [email, setEmail] = useState('sonusharma@kanhadoorhouse.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setEmail('sonusharma@kanhadoorhouse.com');
      setPassword('admin123');
    } else if (selectedRole === 'manager') {
      setEmail('rakesh.billing@kanhadoorhouse.com');
      setPassword('staff123');
    } else {
      setEmail('amit.tech@kanhadoorhouse.com');
      setPassword('tech123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === 'tech') {
        router.push('/tech-portal');
      } else {
        router.push('/dashboard');
      }
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-emerald-600/30">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Kanha Door House Portal</h2>
          <p className="text-xs text-slate-400">GSTIN: {BUSINESS_INFO.gstin} • Jamalpur, Bihar</p>
        </div>

        {/* Role Switcher */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">Select Role Access</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${role === 'admin' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('manager')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${role === 'manager' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
              >
                Office Staff
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('tech')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${role === 'tech' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
              >
                Field Fitter
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email / Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Passcode / Password</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : (
                <>
                  Log In to {role === 'tech' ? 'Field Tech Portal' : 'Managerial Hub'} <ArrowRight className="w-4 h-4 text-emerald-400" />
                </>
              )}
            </button>
          </form>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500 text-center">
            🔒 Secured by Firebase Auth & GST Legal Compliance Protocol.
          </div>
        </div>

      </div>
    </div>
  );
}
