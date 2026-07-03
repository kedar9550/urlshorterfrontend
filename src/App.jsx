import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL; // set in Vercel env vars

export default function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setCopied(false);

    if (!longUrl.trim()) {
      setError('Please paste a URL first.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setShortUrl(data.shortUrl);
    } catch (err) {
      setError(err.message || 'Failed to shorten URL. Backend may be waking up, try again in a few seconds.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔗 URL Shortener</h1>
        <p style={styles.subtitle}>Paste a long link, get a short one.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/very/long/link"
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        {shortUrl && (
          <div style={styles.resultBox}>
            <a href={shortUrl} target="_blank" rel="noreferrer" style={styles.resultLink}>
              {shortUrl}
            </a>
            <button onClick={handleCopy} style={styles.copyButton}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f4f5f7',
    fontFamily: 'system-ui, sans-serif',
  },
  card: {
    background: '#fff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    width: '90%',
    maxWidth: '480px',
    textAlign: 'center',
  },
  title: { margin: '0 0 4px', fontSize: '24px' },
  subtitle: { margin: '0 0 24px', color: '#666', fontSize: '14px' },
  form: { display: 'flex', gap: '8px' },
  input: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  button: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    background: '#111',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
  },
  error: { color: '#d33', marginTop: '16px', fontSize: '14px' },
  resultBox: {
    marginTop: '20px',
    padding: '12px',
    background: '#f0f4ff',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  resultLink: {
    color: '#2554c7',
    fontSize: '14px',
    wordBreak: 'break-all',
    textDecoration: 'none',
  },
  copyButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    whiteSpace: 'nowrap',
  },
};
