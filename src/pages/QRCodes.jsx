import { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Copy, Trash2, Power, PowerOff, Plus, Download } from 'lucide-react';
import DataTable from '../components/DataTable';
import CreateLinkModal from '../components/CreateLinkModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function QRCodes() {
  const { user } = useContext(AuthContext);
  const [urls, setUrls] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const fetchUrls = async () => {
    try {
      const res = await fetch(`${API_URL}/api/urls/my-urls`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        // Filter only qr codes
        setUrls(data.filter(u => u.type === 'qr'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/urls/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) fetchUrls();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSoftDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this QR Code? It will stop working permanently.')) return;
    try {
      const res = await fetch(`${API_URL}/api/urls/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) fetchUrls();
    } catch (err) {
      console.error(err);
    }
  };

  const downloadQRCode = async (shortUrl, shortCode) => {
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(shortUrl)}`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `qrcode-${shortCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download QR code', err);
      alert('Failed to download QR code. Please try again.');
    }
  };

  const columns = useMemo(() => [
    {
      label: 'QR Code',
      key: 'qr',
      sortable: false,
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(row.shortUrl)}`} 
            alt="QR Code"
            className="qr-image"
          />
          <button 
            onClick={() => downloadQRCode(row.shortUrl, row.shortCode)}
            className="btn"
            style={{ padding: '0.4rem', background: 'var(--primary)', color: 'white' }}
            title="Download High-Res QR"
          >
            <Download size={14} />
          </button>
        </div>
      )
    },
    {
      label: 'Destination',
      key: 'longUrl',
      sortable: true,
      render: (row) => (
        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <a href={row.longUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }} title={row.longUrl}>
            {row.longUrl}
          </a>
        </div>
      )
    },
    {
      label: 'Scans (Clicks)',
      key: 'clicks',
      sortable: true,
      render: (row) => <span className="badge" style={{ background: 'rgba(128,128,128,0.2)' }}>{row.clicks}</span>
    },
    {
      label: 'Status',
      key: 'isActive',
      sortable: true,
      render: (row) => {
        let isExpired = false;
        if (row.expiresAt && new Date(row.expiresAt) < new Date()) {
          isExpired = true;
        }
        return isExpired ? (
          <span className="badge badge-expired" title="This QR has crossed its expiration date">Expired</span>
        ) : row.isActive ? (
          <span className="badge badge-active">Active</span>
        ) : (
          <span className="badge badge-inactive">Inactive</span>
        );
      }
    },
    {
      label: 'Actions',
      key: 'actions',
      sortable: false,
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => handleToggleActive(row._id, row.isActive)}
            className="btn" 
            style={{ padding: '0.4rem', background: row.isActive ? 'var(--warning)' : 'var(--success)' }}
            title={row.isActive ? 'Deactivate QR' : 'Activate QR'}
          >
            {row.isActive ? <PowerOff size={14} color="white"/> : <Power size={14} color="white"/>}
          </button>
          <button 
            onClick={() => handleSoftDelete(row._id)}
            className="btn btn-danger" 
            style={{ padding: '0.4rem' }}
            title="Delete QR"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ], []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>QR Codes</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Create QR
        </button>
      </div>

      <div className="glass-card">
        <DataTable 
          data={urls} 
          columns={columns} 
          searchPlaceholder="Search Destination URL..."
          searchKey="longUrl"
        />
      </div>

      <CreateLinkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchUrls}
        type="qr"
      />
    </div>
  );
}
