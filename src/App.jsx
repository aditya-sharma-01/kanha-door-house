import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TechPortalPage from './pages/TechPortalPage';

export default function App() {
  return (
    <Router>
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
