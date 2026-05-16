import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';

function LoginWrapper({ onLogin, theme, toggleTheme }) {
  const navigate = useNavigate();
  const handleLogin = (username) => {
    onLogin(username);
    navigate('/dashboard');
  };
  return <Login onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />;
}

function DashboardWrapper({ user, theme, toggleTheme, onLogout }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    onLogout();
    navigate('/');
  };
  return <Dashboard user={user} theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />;
}

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [user,  setUser]  = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          user
            ? <Navigate to="/dashboard" replace />
            : <LoginWrapper onLogin={setUser} theme={theme} toggleTheme={toggleTheme} />
        }/>
        <Route path="/dashboard" element={
          user
            ? <DashboardWrapper user={user} theme={theme} toggleTheme={toggleTheme} onLogout={() => setUser(null)} />
            : <Navigate to="/" replace />
        }/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}