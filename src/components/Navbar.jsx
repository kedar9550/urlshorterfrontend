import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Shield, Menu, Moon, Sun, Key } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';
import logo from '../assets/aditya-logo.png';

export default function Navbar({ isSidebarFolded, setIsSidebarFolded }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

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

  if (!user) {
    return (
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="nav-brand" style={{ color: 'white' }}>
            <img src={logo} alt="Aditya Logo" className="nav-logo" />
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
        </div>
      </nav>
    );
  }

  const profileImageUrl = `https://info.aec.edu.in/aec/employeephotos/${user.institutionId}.jpg`;

  return (
    <>
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/dashboard" className="nav-brand" style={{ color: 'white' }}>
            <img src={logo} alt="Aditya Logo" className="nav-logo" />
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
            <Link to="/admin" className="btn desktop-only" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginRight: '10px' }}>
              <Shield size={16} /> Admin Panel
            </Link>
          )}

          <div style={{ position: 'relative' }} ref={menuRef}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <div className="profile-details" style={{ textAlign: 'right', color: 'white' }}>
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
            </div>

            {isProfileMenuOpen && (
              <div className="glass-card mobile-only-flex" style={{
                position: 'absolute',
                top: 'calc(100% + 15px)',
                right: 0,
                padding: '1rem',
                flexDirection: 'column',
                gap: '0.5rem',
                minWidth: '220px',
                zIndex: 1000,
                background: 'var(--bg-color)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.institutionId}</div>
                </div>

                {user.role === 'admin' && (
                  <Link to="/admin" className="btn" style={{ background: 'transparent', color: 'var(--text-main)', justifyContent: 'flex-start', padding: '0.5rem' }}>
                    <Shield size={18} /> Admin Panel
                  </Link>
                )}

                <button
                  onClick={() => { setIsChangePasswordOpen(true); setIsProfileMenuOpen(false); }}
                  className="btn"
                  style={{ background: 'transparent', color: 'var(--text-main)', justifyContent: 'flex-start', padding: '0.5rem' }}
                >
                  <Key size={18} /> Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="btn"
                  style={{ background: 'transparent', color: 'var(--danger)', justifyContent: 'flex-start', padding: '0.5rem' }}
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>

          <div className="desktop-only" style={{ display: 'flex', gap: '10px', marginLeft: '10px' }}>
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="logout-btn"
              style={{ borderColor: 'white', color: 'white' }}
              title="Change Password"
            >
              <Key size={18} />
            </button>

            <button onClick={handleLogout} className="logout-btn" style={{ borderColor: 'white', color: 'white' }} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
}
