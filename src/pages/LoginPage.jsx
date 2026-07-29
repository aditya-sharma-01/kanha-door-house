import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Key, ArrowRight, ShieldCheck, AlertCircle, Fingerprint, Sparkles } from 'lucide-react';
import { BUSINESS_INFO } from '../lib/types';
import { DataStore } from '../lib/store';
import { Capacitor } from '@capacitor/core';
import { 
  authenticateWithFingerprint, 
  getSavedBiometricUser, 
  saveBiometricUser,
  isBiometricAvailable 
} from '../lib/biometrics';

export default function LoginPage() {
  const navigate = useNavigate();
  const isNative = Capacitor.isNativePlatform();

  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [bioAvailable, setBioAvailable] = useState(false);
  const [bioUser, setBioUser] = useState(null);

  useEffect(() => {
    isBiometricAvailable().then(avail => setBioAvailable(avail));
    const saved = getSavedBiometricUser();
    setBioUser(saved);
  }, []);

  const handleFingerprintLogin = async () => {
    setErrorMsg('');
    const saved = getSavedBiometricUser();
    if (!saved || !saved.phone) {
      setErrorMsg('No saved staff account on this device. Please log in with Mobile Number & Password once to register your fingerprint.');
      return;
    }

    setLoading(true);
    try {
      await authenticateWithFingerprint();

      // Fingerprint verified successfully!
      localStorage.setItem('kdh_auth_user', JSON.stringify(saved));
      DataStore.logActivity(saved.name, 'Fingerprint Login', 'Authenticated via native device fingerprint scanner');

      if (saved.role === 'Field Technician') {
        navigate('/tech-portal', { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Fingerprint auth failed:', err);
      if (err.message && !err.message.includes('Canceled') && !err.message.includes('cancelled') && !err.message.includes('Cancel')) {
        setErrorMsg(`Fingerprint Scan Error: ${err.message || 'Verification failed.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const cleanPhone = mobileNumber.replace(/[^0-9]/g, '');
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
        saveBiometricUser(foundUser); // Save user for 1-tap fingerprint authentication!
        setBioUser(foundUser);
        DataStore.logActivity(foundUser.name, 'Staff Login', 'Logged in successfully');

        if (foundUser.role === 'Field Technician') {
          navigate('/tech-portal', { replace: true });
        } else {
          navigate('/admin/dashboard', { replace: true });
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
    <div className={`min-h-screen flex items-center justify-center p-4 ${isNative ? 'bg-slate-950 text-white' : 'bg-slate-900/90 text-slate-900'}`}>
      <div className="max-w-sm w-full bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden space-y-0">
        
        {/* App Header Banner */}
        <div className="bg-slate-950 p-6 text-center space-y-3 border-b border-slate-800">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500 mx-auto shadow-xl shadow-emerald-500/20 bg-white flex items-center justify-center">
            <img src="/logo.jpeg" alt="Kanha Door House Logo" className="w-full h-full object-cover object-center" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">{BUSINESS_INFO.name}</h1>
            <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
              ERP & Mobile Duty Application
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1">
              GSTIN: {BUSINESS_INFO.gstin}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 bg-slate-900">
          
          <div className="text-center space-y-1">
            <h2 className="text-sm font-bold text-slate-200">Staff Account Authentication</h2>
            <p className="text-xs text-slate-400">Super Admin, Office Staff & Field Technicians</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* FINGERPRINT QUICK SIGN IN BUTTON */}
          <div className="space-y-2 pt-1 border-b border-slate-800 pb-4">
            <button
              type="button"
              disabled={loading}
              onClick={handleFingerprintLogin}
              className="w-full bg-slate-950 hover:bg-slate-800 border border-emerald-500/50 hover:border-emerald-400 text-white rounded-2xl p-3 flex items-center justify-between transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Fingerprint className="w-6 h-6 animate-pulse text-emerald-400" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs font-black text-white flex items-center gap-1">
                    Fingerprint Quick Unlock <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {bioUser ? `Unlock account for ${bioUser.name}` : 'Instant 1-Tap Sensor Scan'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-2 py-1 rounded-lg font-bold shrink-0">
                SCAN ➔
              </span>
            </button>
          </div>

          {/* STANDARD PASSWORD LOGIN FORM */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Enter 10-digit mobile number"
                  value={mobileNumber}
                  onChange={e => setMobileNumber(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs font-bold text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Passcode / Password *</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs font-bold text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <span>Sign In To App</span> <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

          <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1 pt-2 border-t border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Biometric Encrypted • Kanha Door House ERP</span>
          </div>

        </div>

      </div>
    </div>
  );
}
