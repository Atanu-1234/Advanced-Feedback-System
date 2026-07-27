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
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-4xl fade-up">
        <div className="bg-white rounded-3xl shadow-lg border border-[#e8e0d5] overflow-hidden flex flex-col md:flex-row">

          {/* Left panel */}
          <div className="bg-[#1c1c1c] md:w-5/12 p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-10">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">RF</span>
                </div>
                <span className="font-display font-bold text-white text-lg">RestoFeedback</span>
              </div>
              <h2 className="font-display text-3xl font-bold text-white leading-snug mb-4">
                Welcome back.
              </h2>
              <p className="text-[#7a6a5a] text-sm leading-relaxed">
                Sign in to continue sharing your dining experiences and help restaurants serve you better.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-10">
              {[
                { value: '2,400+', label: 'Reviews' },
                { value: '98%',    label: 'Satisfaction' },
                { value: '150+',   label: 'Restaurants' },
                { value: '< 2s',   label: 'AI Analysis' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="font-display text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-[#7a6a5a] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right form panel */}
          <div className="flex-1 p-10">
            {/* Steps */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#4a8c42] text-white text-xs font-bold flex items-center justify-center">✓</div>
                <span className="text-sm font-semibold text-[#4a8c42]">Register</span>
              </div>
              <div className="flex-1 h-px bg-[#2d5a27] max-w-8" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#2d5a27] text-white text-xs font-bold flex items-center justify-center">2</div>
                <span className="text-sm font-semibold text-[#2d5a27]">Login</span>
              </div>
              <div className="flex-1 h-px bg-[#e8e0d5] max-w-8" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#f0ebe3] text-[#b0a090] text-xs font-bold flex items-center justify-center">3</div>
                <span className="text-sm text-[#b0a090]">Review</span>
              </div>
            </div>

            <h1 className="font-display text-2xl font-bold text-[#1c1c1c] mb-1">Sign in to your account</h1>
            <p className="text-sm text-[#7a6a5a] mb-8">Enter your credentials to continue.</p>

            {error && (
              <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#5c5c5c] uppercase tracking-widest mb-2">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#d4c9bb] rounded-xl text-sm text-[#1c1c1c] bg-[#faf9f6] placeholder-[#b0a090] focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5c5c5c] uppercase tracking-widest mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#d4c9bb] rounded-xl text-sm text-[#1c1c1c] bg-[#faf9f6] placeholder-[#b0a090] focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/10 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2d5a27] hover:bg-[#234820] disabled:bg-[#7aaa74] text-white font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>

            <p className="text-sm text-[#7a6a5a] mt-6 text-center">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#2d5a27] font-semibold hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
