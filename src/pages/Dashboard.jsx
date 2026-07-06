import { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Copy, Trash2, Power, PowerOff, Plus, Check } from 'lucide-react';
import DataTable from '../components/DataTable';
import CreateLinkModal from '../components/CreateLinkModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const { user, appMode } = useContext(AuthContext);
  const [urls, setUrls] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  
  const fetchUrls = async () => {
    try {
      const endpoint = appMode === 'admin' ? '/api/urls/all' : '/api/urls/my-urls';
      const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        // Filter out QR codes, only show short_urls
        let filtered = data.filter(u => u.type === 'short_url' || !u.type);
        if (appMode === 'admin') {
           // On admin page, don't hide soft-deleted ones so they can be hard deleted
        } else {
           filtered = filtered.filter(u => !u.isDeleted);
        }
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUrls(filtered);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [appMode]);

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
    if (!window.confirm('Are you sure you want to delete this link? It will stop working permanently.')) return;
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

  const handleHardDelete = async (id) => {
    if (!window.confirm('WARNING: This will permanently wipe this link from the database. Proceed?')) return;
    try {
      const res = await fetch(`${API_URL}/api/urls/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) fetchUrls();
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns = useMemo(() => {
    const cols = [
      {
        label: 'Original URL',
        key: 'longUrl',
        sortable: true,
        render: (row) => (
          <div style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <a href={row.longUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }} title={row.longUrl}>
              {row.longUrl}
            </a>
          </div>
        )
      },
      {
        label: 'Short URL',
        key: 'shortCode',
        sortable: true,
        render: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a href={row.shortUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
              {row.shortCode}
            </a>
            <button onClick={() => copyToClipboard(row.shortUrl, row._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} title="Copy">
              {copiedId === row._id ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
            </button>
          </div>
        )
      },
      {
        label: 'Created',
        key: 'createdAt',
        sortable: true,
        render: (row) => (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {row.createdAt ? new Date(row.createdAt).toLocaleString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit'
            }) : 'N/A'}
          </div>
        )
      },
      {
        label: 'Clicks',
        key: 'clicks',
        sortable: true,
        render: (row) => <span className="badge" style={{ background: 'rgba(128,128,128,0.2)' }}>{row.clicks}</span>
      },
      {
        label: 'Status',
        key: 'isActive',
        sortable: true,
        render: (row) => {
          if (row.isDeleted) return <span className="badge badge-deleted" title="Soft deleted by user">User Deleted</span>;
          let isExpired = false;
          if (row.expiresAt && new Date(row.expiresAt) < new Date()) {
            isExpired = true;
          }
          return isExpired ? (
            <span className="badge badge-expired" title="This link has crossed its expiration date">Expired</span>
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
              title={row.isActive ? 'Deactivate Link' : 'Activate Link'}
            >
              {row.isActive ? <PowerOff size={14} color="white"/> : <Power size={14} color="white"/>}
            </button>
            {appMode === 'admin' ? (
              <button 
                onClick={() => handleHardDelete(row._id)}
                className="btn btn-danger" 
                style={{ padding: '0.4rem' }}
                title="Hard Delete"
              >
                <Trash2 size={14} />
              </button>
            ) : (
              <button 
                onClick={() => handleSoftDelete(row._id)}
                className="btn btn-danger" 
                style={{ padding: '0.4rem' }}
                title="Delete Link"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )
      }
    ];

    if (appMode === 'admin') {
      cols.unshift({
        label: 'Creator',
        key: 'creator',
        sortable: false,
        render: (row) => {
          const u = row.userId;
          const displayId = u?.designation ? `${u.designation} (${u.institutionId})` : (u?.institutionId || '-');
          return (
            <div>
              <div><strong>{u?.name || 'Unknown'}</strong></div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>{displayId}</div>
            </div>
          );
        }
      });
    }

    return cols;
  }, [appMode, copiedId]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Short URLs</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Create New
        </button>
      </div>

      <div className="glass-card">
        <DataTable 
          data={urls} 
          columns={columns} 
          searchPlaceholder="Search Original URL..."
          searchKey="longUrl"
        />
      </div>

      <CreateLinkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchUrls}
        type="short_url"
      />
    </div>
  );
}
