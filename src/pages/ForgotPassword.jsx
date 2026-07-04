import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [institutionId, setInstitutionId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [maskedMobile, setMaskedMobile] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institutionId, action: 'forgot-password' }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setMaskedMobile(data.maskedMobile);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institutionId, newPassword, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Password reset failed');
      }

      setSuccess('Password reset successfully. You can now login.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Reset Password</h2>
        
        {success && (
          <div className="mb-4" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            {success}
          </div>
        )}

        {!success && step === 1 && (
          <form onSubmit={handleSendOtp}>
            <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>
              Enter your Employee ID to receive a reset OTP on your registered mobile.
            </p>
            <div className="form-group">
              <label>Employee ID</label>
              <input
                type="text"
                className="input"
                value={institutionId}
                onChange={(e) => setInstitutionId(e.target.value)}
                placeholder="e.g. 5994"
                required
              />
            </div>
            {error && <div className="error-text mb-4">{error}</div>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send Reset Code'}
            </button>
          </form>
        )}
        
        {!success && step === 2 && (
          <form onSubmit={handleSubmit}>
            <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>
              Enter the OTP sent to {maskedMobile} and your new password.
            </p>
            <div className="form-group">
              <label>OTP</label>
              <input
                type="text"
                className="input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                className="input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && <div className="error-text mb-4">{error}</div>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <button 
              type="button" 
              className="btn btn-danger mt-2" 
              style={{ width: '100%', justifyContent: 'center', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }} 
              onClick={() => setStep(1)}
            >
              Back
            </button>
          </form>
        )}

        <p className="text-center mt-4 text-muted" style={{ fontSize: '0.9rem' }}>
          Remembered your password? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
