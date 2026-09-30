import React, { useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import './styles/styles.css';

function MainLayout({ user, onLogin, onLogout }) {
  const location = useLocation();

  const isDashboardRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/receptionist') ||
    location.pathname.startsWith('/customer') ||
    location.pathname.startsWith('/barber');

  return (
    <>
      {!isDashboardRoute && <Navbar user={user} onLogout={onLogout} />}

      <main style={{ minHeight: isDashboardRoute ? '100vh' : '80vh' }}>
        <AppRoutes user={user} onLogin={onLogin} onLogout={onLogout} />
      </main>

      {!isDashboardRoute && <Footer />}
    </>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  });

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <BrowserRouter>
      <MainLayout user={user} onLogin={handleLogin} onLogout={handleLogout} />
    </BrowserRouter>
  );
}

export default App;
