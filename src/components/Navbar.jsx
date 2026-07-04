import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Link as LinkIcon, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const profileImageUrl = `https://info.aec.edu.in/aec/employeephotos/${user.institutionId}.jpg`;

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="nav-brand">
        <LinkIcon size={24} color="#3b82f6" />
        URLShorty
      </Link>
      
      <div className="nav-profile">
        {user.role === 'admin' && (
          <Link to="/admin" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', marginRight: '10px' }}>
            <Shield size={16} /> Admin Panel
          </Link>
        )}
        
        <div style={{ textAlign: 'right', marginRight: '10px' }}>
          <div style={{ fontWeight: '600' }}>{user.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.institutionId}</div>
        </div>
        
        {!imgError ? (
          <img 
            src={profileImageUrl} 
            alt="Profile" 
            className="profile-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        
        <button onClick={handleLogout} className="logout-btn" title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
