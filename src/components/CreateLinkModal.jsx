import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X, Link as LinkIcon, QrCode } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CreateLinkModal({ isOpen, onClose, onSuccess, type = 'short_url' }) {
  const { user } = useContext(AuthContext);
  const [longUrl, setLongUrl] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
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
        body: JSON.stringify({ longUrl, expiresAt: expiresAt || null, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setLongUrl('');
      setExpiresAt('');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            {type === 'qr' ? <QrCode size={24} /> : <LinkIcon size={24} />}
            Create New {type === 'qr' ? 'QR Code' : 'Short Link'}
          </h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Destination URL</label>
            <input
              type="url"
              className="input"
              placeholder="https://example.com/very-long-url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Expiration Date (Optional)</label>
            <input
              type="date"
              className="input"
              min={today}
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          {error && <div className="error-text mb-4">{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn" onClick={onClose} style={{ background: 'var(--input-bg)' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
