import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Copy, Trash2, Edit2, Link as LinkIcon, Power, PowerOff } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [urls, setUrls] = useState([]);
  const [longUrl, setLongUrl] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fetchUrls = async () => {
    try {
      const res = await fetch(`${API_URL}/api/urls/my-urls`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) setUrls(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUrls();
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
      fetchUrls();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
    if (!confirm('Are you sure you want to delete this link? It will stop working permanently.')) return;
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div>
      <div className="glass-card mb-4">
        <h2>Create New Short Link</h2>
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
              title="Expiration Date (Optional)"
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
        <h3>My Links</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>QR</th>
                <th>Original URL</th>
                <th>Short URL</th>
                <th>Clicks</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.map(url => {
                let isExpired = false;
                if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
                  isExpired = true;
                }

                return (
                  <tr key={url._id}>
                    <td>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(url.shortUrl)}`} 
                        alt="QR Code"
                        className="qr-image"
                      />
                    </td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a href={url.longUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>{url.longUrl}</a>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <a href={url.shortUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                          {url.shortCode}
                        </a>
                        <button onClick={() => copyToClipboard(url.shortUrl)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td><span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>{url.clicks}</span></td>
                    <td>
                      {isExpired ? (
                        <span className="badge badge-expired" title="This link has crossed its expiration date">Expired</span>
                      ) : url.isActive ? (
                        <span className="badge badge-active">Active</span>
                      ) : (
                        <span className="badge badge-inactive">Inactive</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleToggleActive(url._id, url.isActive)}
                          className="btn" 
                          style={{ padding: '0.4rem', background: url.isActive ? 'var(--warning)' : 'var(--success)' }}
                          title={url.isActive ? 'Deactivate Link' : 'Activate Link'}
                        >
                          {url.isActive ? <PowerOff size={14} color="white"/> : <Power size={14} color="white"/>}
                        </button>
                        <button 
                          onClick={() => handleSoftDelete(url._id)}
                          className="btn btn-danger" 
                          style={{ padding: '0.4rem' }}
                          title="Delete Link"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {urls.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">You haven't created any links yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
