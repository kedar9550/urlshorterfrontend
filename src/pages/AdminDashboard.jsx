import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Link as LinkIcon, ExternalLink } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [urls, setUrls] = useState([]);
  
  // Admin Link Creation
  const [longUrl, setLongUrl] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAllUrls = async () => {
    try {
      const res = await fetch(`${API_URL}/api/urls/all`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) setUrls(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllUrls();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/urls`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ longUrl, expiresAt: expiresAt || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLongUrl('');
      setExpiresAt('');
      fetchAllUrls();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHardDelete = async (id) => {
    if (!confirm('WARNING: This will permanently wipe this link from the database. Proceed?')) return;
    try {
      const res = await fetch(`${API_URL}/api/urls/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) fetchAllUrls();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="glass-card mb-4" style={{ borderColor: 'var(--primary)' }}>
        <h2>Admin: Create Link</h2>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <div style={{ flex: '1 1 300px' }}>
            <input
              type="url"
              className="input"
              placeholder="https://very-long-url.com/..."
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="date"
              className="input"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <LinkIcon size={16} /> Shorten
          </button>
        </form>
        {error && <div className="error-text">{error}</div>}
      </div>

      <div className="glass-card">
        <h3>Global Link Database</h3>
        <p className="text-muted mb-2">View and manage all links across the platform.</p>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Creator (ID)</th>
                <th>QR</th>
                <th>Links</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.map(url => {
                let statusBadge = null;
                
                if (url.isDeleted) {
                  statusBadge = <span className="badge badge-deleted">User Deleted</span>;
                } else if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
                  statusBadge = <span className="badge badge-expired">Expired</span>;
                } else if (!url.isActive) {
                  statusBadge = <span className="badge badge-inactive">Inactive</span>;
                } else {
                  statusBadge = <span className="badge badge-active">Active</span>;
                }

                return (
                  <tr key={url._id} style={{ opacity: url.isDeleted ? 0.6 : 1 }}>
                    <td>
                      <div><strong>{url.userId?.name || 'Unknown'}</strong></div>
                      <div className="text-muted" style={{ fontSize: '0.8rem' }}>{url.userId?.institutionId || '-'}</div>
                    </td>
                    <td>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(url.shortUrl)}`} 
                        alt="QR Code"
                        className="qr-image"
                      />
                    </td>
                    <td>
                      <div style={{ marginBottom: '4px' }}>
                        <a href={url.shortUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                          {url.shortUrl}
                        </a>
                      </div>
                      <div style={{ fontSize: '0.8rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <a href={url.longUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>{url.longUrl}</a>
                      </div>
                      <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#cbd5e1' }}>
                        Clicks: {url.clicks}
                      </div>
                    </td>
                    <td>
                      {statusBadge}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleHardDelete(url._id)}
                        className="btn btn-danger" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={14} /> Hard Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {urls.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">No links in the system yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
