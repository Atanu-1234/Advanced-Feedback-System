import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const S = {
  Positive: { bg: '#f0fdf4', border: '#86efac', color: '#15803d', label: '😊 Positive' },
  Negative: { bg: '#fef2f2', border: '#fca5a5', color: '#dc2626', label: '😞 Negative' },
  Neutral:  { bg: '#fefce8', border: '#fde047', color: '#ca8a04', label: '😐 Neutral'  },
};

const tag = { fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#f3f4f6', color: '#555', border: '1px solid #e5e7eb' };

const PublicFeedback = () => {
  const [review, setReview]           = useState('');
  const [loading, setLoading]         = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [error, setError]             = useState('');
  const [userHistory, setUserHistory] = useState([]);
  const { token, isAuthenticated, username } = useContext(AuthContext);
  const apiBase = import.meta.env.VITE_API_BASE_URL;

  const fetchMyHistory = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch(`${apiBase}/api/feedback/my-feedback`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setUserHistory(await res.json());
    } catch {}
  };

  useEffect(() => { fetchMyHistory(); }, [isAuthenticated, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) return;
    setLoading(true); setError(''); setSubmitted(false);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${apiBase}/api/feedback`, { method: 'POST', headers, body: JSON.stringify({ rawText: review }) });
      if (!res.ok) throw new Error('Failed to submit feedback');
      const newFeedback = await res.json();
      setReview(''); setSubmitted(true);
      if (isAuthenticated) setUserHistory(prev => [newFeedback, ...prev]);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const f = { fontFamily: "'Inter', system-ui, sans-serif" };

  return (
    <div style={{ ...f, minHeight: '100vh', background: '#f8f9ff', padding: '40px 16px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Page header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{
            display: 'inline-block', fontSize: '11px', fontWeight: '700',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#667eea', background: '#eef2ff', padding: '4px 14px',
            borderRadius: '20px', marginBottom: '12px',
          }}>
            🤖 Powered by Gemini AI
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
            Share Your Experience
          </h1>
          <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
            {isAuthenticated
              ? `Posting as ${username} · Your review will be saved to your profile`
              : 'Your honest feedback helps restaurants improve every day'}
          </p>
        </div>

        {/* Submit card */}
        <div style={{
          background: '#fff', borderRadius: '20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: '1px solid #eee', overflow: 'hidden', marginBottom: '24px',
        }}>
          {/* Card header */}
          <div style={{
            padding: '20px 28px', borderBottom: '1px solid #f5f5f5',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #667eea08, #764ba208)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px',
              }}>✍️</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#111' }}>Write a Review</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>AI analyzes sentiment, key items & urgency</div>
              </div>
            </div>
            {!isAuthenticated && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Link to="/login" style={{ fontSize: '13px', fontWeight: '600', color: '#667eea', textDecoration: 'none' }}>Log in</Link>
                <Link to="/register" style={{
                  fontSize: '13px', fontWeight: '700', color: '#fff', textDecoration: 'none',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  padding: '6px 16px', borderRadius: '8px',
                }}>Sign up</Link>
              </div>
            )}
          </div>

          {/* Card body */}
          <div style={{ padding: '28px' }}>
            {submitted && (
              <div style={{
                background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px',
                padding: '14px 18px', marginBottom: '20px',
                display: 'flex', alignItems: 'flex-start', gap: '12px',
              }}>
                <span style={{ fontSize: '20px', lineHeight: 1 }}>✅</span>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#15803d' }}>Review submitted successfully!</div>
                  <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '3px' }}>Gemini AI has analyzed and saved your feedback.</div>
                </div>
              </div>
            )}
            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px',
                padding: '12px 16px', marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '13px', color: '#dc2626',
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <textarea
                rows={6}
                placeholder="Describe your dining experience in detail... e.g. The pasta was perfectly cooked with a rich, creamy sauce. The ambiance was cozy and the staff were very attentive. Would definitely visit again!"
                value={review}
                onChange={e => setReview(e.target.value)}
                required
                style={{
                  width: '100%', padding: '16px', borderRadius: '14px',
                  border: '1.5px solid #e5e7eb', fontSize: '14px', color: '#111',
                  background: '#fafafa', resize: 'none', outline: 'none',
                  fontFamily: 'inherit', lineHeight: '1.6', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
                <span style={{ fontSize: '12px', color: '#aaa' }}>
                  {isAuthenticated ? `👤 ${username}` : '🔒 Anonymous'} · {review.length} chars
                </span>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '11px 28px', borderRadius: '12px', border: 'none',
                    background: loading ? '#c7d2fe' : 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: '#fff', fontWeight: '700', fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(102,126,234,0.4)',
                    fontFamily: 'inherit', transition: 'opacity 0.2s',
                  }}
                >
                  {loading ? (
                    <>
                      <svg style={{ animation: 'spin 1s linear infinite', width: '15px', height: '15px' }} fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Analyzing with AI...
                    </>
                  ) : '🚀 Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* History card */}
        {isAuthenticated && (
          <div style={{
            background: '#fff', borderRadius: '20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            border: '1px solid #eee', overflow: 'hidden',
          }}>
            <div style={{
              padding: '20px 28px', borderBottom: '1px solid #f5f5f5',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                }}>📋</div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: '#111' }}>Your Review History</div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>All your past submissions</div>
                </div>
              </div>
              <span style={{
                fontSize: '12px', fontWeight: '700', padding: '4px 12px',
                background: '#f3f4f6', color: '#555', borderRadius: '20px',
              }}>
                {userHistory.length} total
              </span>
            </div>

            <div style={{ padding: '24px 28px' }}>
              {userHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📝</div>
                  <div style={{ fontWeight: '600', fontSize: '15px', color: '#333' }}>No reviews yet</div>
                  <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>Submit your first review above</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
                  {userHistory.map((item) => {
                    const s = S[item.sentiment] || S.Neutral;
                    return (
                      <div key={item._id || item.id} style={{
                        borderRadius: '14px', border: `1px solid ${s.border}`,
                        background: s.bg, padding: '16px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{
                            fontSize: '12px', fontWeight: '700', padding: '4px 12px',
                            borderRadius: '20px', background: '#fff',
                            border: `1px solid ${s.border}`, color: s.color,
                          }}>{s.label}</span>
                          <span style={{ fontSize: '11px', color: '#999' }}>
                            {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#333', lineHeight: '1.6', margin: '0 0 10px', fontStyle: 'italic' }}>
                          "{item.rawText}"
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {item.keyItems?.map((k, i) => <span key={i} style={tag}>{k}</span>)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PublicFeedback;
