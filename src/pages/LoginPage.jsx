import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Phone, Key, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../lib/types';
import { DataStore } from '../lib/store';

export default function LoginPage() {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const cleanPhone = mobileNumber.replace(/[^0-9]/g, '');
      // Fetch latest staff from Firestore (falls back to local cache if offline)
      const allStaff = await DataStore.fetchStaff();

      const foundUser = allStaff.find(
        s => (s.phone === cleanPhone || s.phone.endsWith(cleanPhone)) && s.password === password
      );

      if (foundUser) {
        if (foundUser.status === 'Inactive') {
          setErrorMsg('Account is deactivated. Please contact Super Admin Sonu Sharma.');
          setLoading(false);
          return;
        }
        localStorage.setItem('kdh_auth_user', JSON.stringify(foundUser));
        DataStore.logActivity(foundUser.name, 'Staff Login', 'Logged in successfully');

        if (foundUser.role === 'Field Technician') {
          navigate('/tech-portal');
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        setErrorMsg('Invalid Mobile Number or Password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Connection error. Please check your internet and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 text-center space-y-2">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500 mx-auto shadow-lg shadow-emerald-600/30">
            <img src="/logo.jpeg" alt="Kanha Door House" className="w-full h-full object-cover object-center" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Staff & Admin Login</h2>
          <p className="text-xs text-slate-400">
            {BUSINESS_INFO.name} • GSTIN: {BUSINESS_INFO.gstin}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Staff Mobile Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Enter 10-digit mobile number"
                  value={mobileNumber}
                  onChange={e => setMobileNumber(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password / Passcode *</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                  Log In to Portal <ArrowRight className="w-4 h-4 text-emerald-400" />
                </>
              )}
            </button>
          </form>

          <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 pt-2 border-t border-slate-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Discreet Management Access • Kanha Door House</span>
          </div>

        </div>

      </div>
    </div>
  );
}
