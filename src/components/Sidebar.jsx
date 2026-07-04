import { Link, useLocation } from 'react-router-dom';
import { Link2, QrCode, User, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-nav">
        <Link 
          to="/dashboard" 
          className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          <Link2 size={20} />
          <span>Short URLs</span>
        </Link>
        <Link 
          to="/qrcodes" 
          className={`sidebar-link ${location.pathname === '/qrcodes' ? 'active' : ''}`}
        >
          <QrCode size={20} />
          <span>QR Codes</span>
        </Link>
        {/* We can add Profile or Admin here if needed */}
      </div>

      {/* Theme Toggle at bottom of sidebar on desktop, or inside menu on mobile */}
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
        <button 
          onClick={toggleTheme} 
          className="btn" 
          style={{ background: 'transparent', color: 'var(--text-muted)' }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </div>
  );
}
