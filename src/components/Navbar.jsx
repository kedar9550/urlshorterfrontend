import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Link as LinkIcon, Shield, Menu, Moon, Sun } from 'lucide-react';

export default function Navbar({ isSidebarFolded, setIsSidebarFolded }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const profileImageUrl = `https://info.aec.edu.in/aec/employeephotos/${user.institutionId}.jpg`;

  return (
    <nav className="navbar" style={{ background: 'var(--primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/dashboard" className="nav-brand" style={{ color: 'white' }}>
          <LinkIcon size={24} color="white" />
          URLShorty
        </Link>
      </div>
      
      <div className="nav-profile">
        <button 
          onClick={toggleTheme} 
          className="btn" 
          style={{ background: 'transparent', color: 'white', marginRight: '10px' }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {user.role === 'admin' && (
          <Link to="/admin" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginRight: '10px' }}>
            <Shield size={16} /> Admin Panel
          </Link>
        )}
        
        <div className="profile-details" style={{ textAlign: 'right', marginRight: '10px', color: 'white' }}>
          <div style={{ fontWeight: '600' }}>{user.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>{user.institutionId}</div>
        </div>
        
        {!imgError ? (
          <img 
            src={profileImageUrl} 
            alt="Profile" 
            className="profile-img"
            style={{ borderColor: 'white' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="profile-avatar" style={{ background: 'white', color: 'var(--primary)' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        
        <button onClick={handleLogout} className="logout-btn" style={{ borderColor: 'white', color: 'white' }} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
