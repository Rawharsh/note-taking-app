import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP verification failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', data.user.email);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      <p>Please login to continue to your account.</p>

      {error && <p className="error-text">{error}</p>}

      <input
        type="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {step === 2 && (
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      )}

      {step === 1 ? (
        <button onClick={handleSendOTP} disabled={loading}>
          {loading ? 'Sending...' : 'Get OTP'}
        </button>
      ) : (
        <button onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
      )}

      <p>Need an account? <a href="/">Create one</a></p>
    </div>
  );
}

export default Login;
