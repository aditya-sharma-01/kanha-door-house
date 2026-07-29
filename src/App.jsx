import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TechPortalPage from './pages/TechPortalPage';

function AppSessionManager({ isNative }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('kdh_auth_user');
      const user = stored ? JSON.parse(stored) : null;

      if (isNative) {
        // NATIVE ANDROID APP CONTAINER
        if (user && user.phone && user.role) {
          if (user.role === 'Field Technician') {
            if (location.pathname !== '/tech-portal') {
              navigate('/tech-portal', { replace: true });
            }
          } else if (user.role === 'Super Admin' || user.role === 'Office Staff') {
            if (location.pathname !== '/admin/dashboard') {
              navigate('/admin/dashboard', { replace: true });
            }
          }
        } else {
          // Unauthenticated inside Android App -> Force display Login Page
          if (location.pathname !== '/admin' && location.pathname !== '/login' && location.pathname !== '/') {
            navigate('/admin', { replace: true });
          }
        }
      } else {
        // PUBLIC WEB BROWSER
        if (user && user.phone && user.role) {
          if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/admin') {
            if (user.role === 'Field Technician') {
              navigate('/tech-portal', { replace: true });
            } else if (user.role === 'Super Admin' || user.role === 'Office Staff') {
              navigate('/admin/dashboard', { replace: true });
            }
          }
        }
      }
    } catch (e) {}
  }, [isNative, location.pathname, navigate]);

  return null;
}

export default function App() {
  const isNative = Capacitor.isNativePlatform();

  return (
    <Router>
      <AppSessionManager isNative={isNative} />
      <div className={`flex flex-col min-h-screen antialiased text-slate-900 selection:bg-emerald-500 selection:text-white ${isNative ? 'bg-slate-950' : 'bg-slate-50'}`}>
        {!isNative && <Navbar />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={isNative ? <LoginPage /> : <HomePage />} />
            <Route path="/admin" element={<LoginPage />} />
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/tech-portal" element={<TechPortalPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        {!isNative && <Footer />}
      </div>
    </Router>
  );
}
