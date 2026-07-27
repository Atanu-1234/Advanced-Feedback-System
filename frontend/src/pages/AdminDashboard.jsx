import React, { useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const S = {
  Positive: { bg: '#f0fdf4', border: '#86efac', color: '#15803d', label: 'Positive' },
  Negative: { bg: '#fef2f2', border: '#fca5a5', color: '#dc2626', label: 'Negative' },
  Neutral:  { bg: '#fefce8', border: '#fde047', color: '#ca8a04', label: 'Neutral'  },
};

const StatCard = ({ label, value, gradient, icon }) => (
  <div style={{
    background: '#fff', borderRadius: '18px',
    border: '1px solid #eee', padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    fontFamily: "'Inter', system-ui, sans-serif",
  }}>
    <div style={{
      width: '44px', height: '44px', borderRadius: '12px',
      background: gradient, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '20px', marginBottom: '14px',
    }}>{icon}</div>
    <div style={{ fontSize: '32px', fontWeight: '800', color: '#111', lineHeight: 1, marginBottom: '6px' }}>{value}</div>
    <div style={{ fontSize: '12px', fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
  </div>
);

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [connected, setConnected] = useState(false);
  const [newCount, setNewCount]   = useState(0);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL ;
    const fetchInsights = async () => {
      try {
        const res = await fetch(`${apiBase}/api/insights`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setFeedbacks(await res.json());
      } catch {}
      finally { setLoading(false); }
    };
    fetchInsights();

    const socket = io(apiBase, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
    });
    socket.on('connect',      () => setConnected(true));
    socket.on('disconnect',   () => setConnected(false));
    socket.on('new_feedback', (record) => {
      setFeedbacks(prev => [record, ...prev]);
      setNewCount(n => n + 1);
    });
    return () => socket.disconnect();
  }, [token]);

  const total    = feedbacks.length;
  const positive = feedbacks.filter(f => f.sentiment === 'Positive').length;
  const negative = feedbacks.filter(f => f.sentiment === 'Negative').length;
  const urgent   = feedbacks.filter(f => f.requiresAction).length;

  const f = { fontFamily: "'Inter', system-ui, sans-serif" };

  return (
    <div style={{ ...f, minHeight: '100vh', background: '#f8f9ff', padding: '0' }}>

      {/* Top banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 60%, #24243e 100%)',
        padding: '36px 32px 32px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{
              display: 'inline-block', fontSize: '11px', fontWeight: '700',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#a5b4fc', background: 'rgba(165,180,252,0.15)',
              padding: '4px 12px', borderRadius: '20px', marginBottom: '10px',
            }}>Admin Panel</span>
            <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#fff', margin: '0 0 6px', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              Dashboard
              {newCount > 0 && (
                <span style={{
                  fontSize: '12px', fontWeight: '700', padding: '4px 12px',
                  background: '#667eea', color: '#fff', borderRadius: '20px',
                }}>+{newCount} new</span>
              )}
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              Real-time AI-analyzed customer feedback stream
            </p>
          </div>

          {/* Live status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', borderRadius: '12px',
            background: connected ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
            border: `1px solid ${connected ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
          }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: connected ? '#4ade80' : '#f87171',
              display: 'inline-block',
              boxShadow: connected ? '0 0 0 3px rgba(74,222,128,0.3)' : 'none',
              animation: connected ? 'pulse 2s infinite' : 'none',
            }} />
            <span style={{ fontSize: '13px', fontWeight: '600', color: connected ? '#4ade80' : '#f87171' }}>
              {connected ? 'Live Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <StatCard label="Total Reviews"  value={total}    icon="📊" gradient="linear-gradient(135deg, #667eea, #764ba2)" />
          <StatCard label="Positive"       value={positive} icon="😊" gradient="linear-gradient(135deg, #4ade80, #22c55e)" />
          <StatCard label="Negative"       value={negative} icon="😞" gradient="linear-gradient(135deg, #f87171, #ef4444)" />
          <StatCard label="Urgent Actions" value={urgent}   icon="🚨" gradient="linear-gradient(135deg, #fb923c, #f97316)" />
        </div>

        {/* Feed card */}
        <div style={{
          background: '#fff', borderRadius: '20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: '1px solid #eee', overflow: 'hidden',
        }}>
          {/* Feed header */}
          <div style={{
            padding: '20px 28px', borderBottom: '1px solid #f5f5f5',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #667eea08, #764ba208)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
              }}>📡</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#111' }}>Live Feedback Feed</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>New reviews appear instantly via WebSocket</div>
              </div>
            </div>
            <span style={{
              fontSize: '12px', fontWeight: '700', padding: '4px 14px',
              background: '#f3f4f6', color: '#555', borderRadius: '20px',
            }}>{total} entries</span>
          </div>

          {/* Feed body */}
          <div style={{ padding: '24px 28px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: '4px solid #e5e7eb', borderTopColor: '#667eea',
                  animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
                }} />
                <p style={{ color: '#999', fontSize: '14px' }}>Loading feedback data...</p>
              </div>
            ) : feedbacks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '14px' }}>📭</div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#333', marginBottom: '6px' }}>No feedback yet</div>
                <div style={{ fontSize: '13px', color: '#999' }}>New reviews will appear here in real-time</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {feedbacks.map((item, idx) => {
                  const s = S[item.sentiment] || S.Neutral;
                  const isUrgent = item.requiresAction;
                  return (
                    <div key={item._id || item.id} style={{
                      borderRadius: '16px', padding: '20px',
                      border: isUrgent ? '1.5px solid #fca5a5' : '1px solid #f0f0f0',
                      background: isUrgent ? '#fff5f5' : '#fafafa',
                      boxShadow: isUrgent ? '0 0 0 3px rgba(252,165,165,0.2)' : 'none',
                      transition: 'all 0.2s',
                    }}>
                      {/* Top row */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '12px', fontWeight: '700', padding: '4px 12px',
                            borderRadius: '20px', background: s.bg,
                            border: `1px solid ${s.border}`, color: s.color,
                          }}>{s.label}</span>
                          {isUrgent && (
                            <span style={{
                              fontSize: '11px', fontWeight: '800', padding: '4px 12px',
                              borderRadius: '20px', background: '#dc2626', color: '#fff',
                              animation: 'pulse 2s infinite',
                            }}>🚨 Urgent</span>
                          )}
                          <span style={{
                            fontSize: '12px', padding: '4px 12px', borderRadius: '20px',
                            background: '#f3f4f6', color: '#555', border: '1px solid #e5e7eb',
                          }}>
                            👤 {item.user?.username || 'Anonymous'}
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#aaa' }}>
                          {new Date(item.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Review text */}
                      <p style={{
                        fontSize: '14px', color: '#333', lineHeight: '1.7',
                        margin: '0 0 14px', fontStyle: 'italic',
                        borderLeft: '3px solid #667eea', paddingLeft: '14px',
                      }}>
                        "{item.rawText}"
                      </p>

                      {/* Tags */}
                      {item.keyItems?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11px', color: '#aaa', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tags:</span>
                          {item.keyItems.map((k, i) => (
                            <span key={i} style={{
                              fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
                              background: '#f0f4ff', color: '#667eea', border: '1px solid #c7d2fe',
                            }}>{k}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
