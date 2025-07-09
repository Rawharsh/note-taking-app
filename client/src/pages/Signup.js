import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/auth/send-otp', { email });
      if (res.data.success) {
        setStep(2);
      } else {
        alert(res.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/auth/verify-otp', { email, otp });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      } else {
        alert('Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      alert('Error verifying OTP');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <p>Create an account to continue.</p>

      <input
        type="email"
        placeholder="you@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      {step === 2 && (
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={e => setOtp(e.target.value)}
        />
      )}

      {step === 1 ? (
        <button onClick={handleSendOtp}>Get OTP</button>
      ) : (
        <button onClick={handleVerifyOtp}>Verify & Sign Up</button>
      )}

      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

export default Signup;
