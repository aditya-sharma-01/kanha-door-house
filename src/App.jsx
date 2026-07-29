import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TechPortalPage from './pages/TechPortalPage';

function SessionAutoRedirector() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is at root '/' or '/login' or '/admin', check for active session
    if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/admin') {
      try {
        const stored = localStorage.getItem('kdh_auth_user');
        if (stored) {
          const user = JSON.parse(stored);
          if (user && user.phone && user.role) {
            if (user.role === 'Field Technician') {
              navigate('/tech-portal', { replace: true });
            } else if (user.role === 'Super Admin' || user.role === 'Office Staff') {
              navigate('/admin/dashboard', { replace: true });
            }
          }
        }
      } catch (e) {}
    }
  }, [location.pathname, navigate]);

  return null;
}

export default function App() {
  return (
    <Router>
      <SessionAutoRedirector />
      <div className="flex flex-col min-h-screen antialiased bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<LoginPage />} />
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/tech-portal" element={<TechPortalPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
