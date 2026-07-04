import { Link, useLocation } from 'react-router-dom';
import { Link2, QrCode, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar({ isSidebarFolded, setIsSidebarFolded }) {
  const location = useLocation();

  return (
    <div className={`sidebar ${isSidebarFolded ? 'folded' : ''}`}>
      <div className="sidebar-nav">
        <Link 
          to="/dashboard" 
          className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          title="Short URLs"
        >
          <Link2 size={20} />
          <span className="sidebar-text">Short URLs</span>
        </Link>
        <Link 
          to="/qrcodes" 
          className={`sidebar-link ${location.pathname === '/qrcodes' ? 'active' : ''}`}
          title="QR Codes"
        >
          <QrCode size={20} />
          <span className="sidebar-text">QR Codes</span>
        </Link>
      </div>

      <div className="sidebar-footer" style={{ marginTop: 'auto', display: 'flex', justifyContent: isSidebarFolded ? 'center' : 'flex-end', width: '100%' }}>
        <button 
          onClick={() => setIsSidebarFolded(!isSidebarFolded)} 
          className="btn fold-btn" 
          style={{ background: 'transparent', color: 'var(--text-muted)', padding: '0.5rem' }}
          title={isSidebarFolded ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarFolded ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </div>
  );
}
