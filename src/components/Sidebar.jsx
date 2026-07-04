import { Link, useLocation } from 'react-router-dom';
import { Link2, QrCode } from 'lucide-react';

export default function Sidebar({ isSidebarFolded }) {
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
          {!isSidebarFolded && <span>Short URLs</span>}
        </Link>
        <Link 
          to="/qrcodes" 
          className={`sidebar-link ${location.pathname === '/qrcodes' ? 'active' : ''}`}
          title="QR Codes"
        >
          <QrCode size={20} />
          {!isSidebarFolded && <span>QR Codes</span>}
        </Link>
      </div>
    </div>
  );
}
