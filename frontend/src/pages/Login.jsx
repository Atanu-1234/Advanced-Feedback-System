import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useContext(AuthContext);
  const navigate  = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const res  = await fetch(`${apiBase}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid credentials');
      login(data.access_token, data.role, data.username);
      navigate(data.role === 'admin' ? '/admin/dashboard' : '/feedback');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* Floating card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
        overflow: 'hidden',
      }}>

        {/* Card top banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          padding: '36px 40px 32px',
          textAlign: 'center',
        }}>
          {/* Icon */}
          <div style={{
            width: '64px', height: '64px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '28px',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>🔑</div>

          <h1 style={{
            color: '#ffffff',
            fontSize: '26px',
            fontWeight: '700',
            margin: '0 0 8px',
            letterSpacing: '-0.5px',
          }}>Welcome Back</h1>

          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>
            Sign in to continue to your account
          </p>

          {/* Step dots */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
            {/* Step 1 - done */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: '#4ade80', color: '#fff',
                fontSize: '11px', fontWeight: '800',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>✓</div>
              <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: '600' }}>Register</span>
            </div>
            <div style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,0.4)' }} />
            {/* Step 2 - active */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: '#ffffff', color: '#302b63',
                fontSize: '11px', fontWeight: '800',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>2</div>
              <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: '600' }}>Login</span>
            </div>
            <div style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
            {/* Step 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)',
                fontSize: '11px', fontWeight: '700',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>3</div>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Review</span>
            </div>
          </div>
        </div>

        {/* Form body */}
        <div style={{ padding: '32px 40px' }}>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', borderRadius: '12px',
              padding: '12px 16px', fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '20px',
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Username */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: '600',
                color: '#374151', marginBottom: '8px', letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                style={{
                  width: '100%', padding: '13px 16px',
                  border: '1.5px solid #e5e7eb', borderRadius: '12px',
                  fontSize: '14px', color: '#111827',
                  background: '#f9fafb', outline: 'none',
                  boxSizing: 'border-box', transition: 'border-color 0.2s',
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = '#302b63'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: '600',
                color: '#374151', marginBottom: '8px', letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '13px 16px',
                  border: '1.5px solid #e5e7eb', borderRadius: '12px',
                  fontSize: '14px', color: '#111827',
                  background: '#f9fafb', outline: 'none',
                  boxSizing: 'border-box', transition: 'border-color 0.2s',
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = '#302b63'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #0f0c29 0%, #302b63 100%)',
                color: '#ffffff', border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'opacity 0.2s', fontFamily: 'inherit',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(48,43,99,0.4)',
              }}
              onMouseEnter={e => { if (!loading) e.target.style.opacity = '0.9'; }}
              onMouseLeave={e => { e.target.style.opacity = '1'; }}
            >
              {loading ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite', width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </>
              ) : '✨ Sign In'}
            </button>
          </form>
        </div>

        {/* Card footer */}
        <div style={{
          borderTop: '1px solid #f3f4f6',
          padding: '20px 40px',
          textAlign: 'center',
          background: '#fafafa',
        }}>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#302b63', fontWeight: '700', textDecoration: 'none' }}>
              Create one here
            </Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;
