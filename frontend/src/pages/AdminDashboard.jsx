import React, { useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const sentimentConfig = {
  Positive: { pill: 'bg-[#eaf2e9] text-[#2d5a27] border border-[#c5ddc2]' },
  Negative: { pill: 'bg-red-50 text-red-700 border border-red-200'         },
  Neutral:  { pill: 'bg-[#f5f0e8] text-[#8b6f47] border border-[#ddd0bb]' },
};

const StatCard = ({ label, value, accent }) => (
  <div className="bg-white rounded-2xl border border-[#e8e0d5] p-6">
    <div className={`text-3xl font-display font-bold mb-1 ${accent}`}>{value}</div>
    <div className="text-xs text-[#a09080] font-medium uppercase tracking-widest">{label}</div>
  </div>
);

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [connected, setConnected] = useState(false);
  const [newCount, setNewCount]   = useState(0);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const fetchInsights = async () => {
      try {
        const res = await fetch(`${apiBase}/api/insights`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setFeedbacks(await res.json());
      } catch {}
      finally { setLoading(false); }
    };
    fetchInsights();

    const socket = io(apiBase);
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

  return (
    <div className="min-h-screen bg-[#faf9f6] py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between fade-up">
          <div>
            <p className="text-xs font-semibold text-[#2d5a27] uppercase tracking-widest mb-1">Admin Panel</p>
            <h1 className="font-display text-3xl font-bold text-[#1c1c1c] flex items-center gap-3">
              Dashboard
              {newCount > 0 && (
                <span className="text-xs font-bold bg-[#2d5a27] text-white px-3 py-1 rounded-full font-sans">
                  +{newCount} new
                </span>
              )}
            </h1>
            <p className="text-sm text-[#7a6a5a] mt-1">Real-time AI-analyzed customer feedback</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold
            ${connected
              ? 'bg-[#eaf2e9] border-[#c5ddc2] text-[#2d5a27]'
              : 'bg-red-50 border-red-200 text-red-600'}`}>
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-[#2d5a27] animate-pulse' : 'bg-red-400'}`} />
            {connected ? 'Live' : 'Disconnected'}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 fade-up">
          <StatCard label="Total Reviews"  value={total}    accent="text-[#1c1c1c]"   />
          <StatCard label="Positive"       value={positive} accent="text-[#2d5a27]"   />
          <StatCard label="Negative"       value={negative} accent="text-red-600"      />
          <StatCard label="Urgent Actions" value={urgent}   accent="text-[#8b5e3c]"   />
        </div>

        {/* Feed */}
        <div className="bg-white rounded-2xl border border-[#e8e0d5] shadow-sm overflow-hidden fade-up">
          <div className="px-6 py-4 border-b border-[#f0ebe3] flex items-center justify-between bg-[#faf9f6]">
            <div>
              <h2 className="font-semibold text-[#1c1c1c] text-sm">Live Feedback Feed</h2>
              <p className="text-xs text-[#a09080] mt-0.5">New reviews appear instantly via WebSocket</p>
            </div>
            <span className="text-xs font-semibold bg-[#f0ebe3] text-[#7a6a5a] px-3 py-1 rounded-full">
              {total} entries
            </span>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-4 border-[#e8e0d5] border-t-[#2d5a27] rounded-full animate-spin mx-auto mb-3" />
                <p className="text-[#a09080] text-sm">Loading feedback...</p>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-[#f0ebe3] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📭</div>
                <p className="font-semibold text-[#5c5c5c] text-sm">No feedback yet</p>
                <p className="text-[#a09080] text-xs mt-1">New reviews will appear here in real-time</p>
              </div>
            ) : (
              <div className="space-y-3">
                {feedbacks.map((item, idx) => {
                  const s = sentimentConfig[item.sentiment] || sentimentConfig.Neutral;
                  const isUrgent = item.requiresAction;
                  return (
                    <div
                      key={item._id || item.id}
                      className={`rounded-xl border p-5 transition-all fade-up ${isUrgent ? 'border-red-300 bg-red-50 urgent-ring' : 'border-[#e8e0d5] bg-[#faf9f6]'}`}
                      style={{ animationDelay: `${Math.min(idx, 5) * 0.05}s` }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.pill}`}>
                            {item.sentiment}
                          </span>
                          {isUrgent && (
                            <span className="text-xs font-bold bg-red-600 text-white px-2.5 py-1 rounded-full animate-pulse">
                              Urgent
                            </span>
                          )}
                          <span className="text-xs bg-white border border-[#e8e0d5] text-[#7a6a5a] px-2.5 py-1 rounded-full">
                            {item.user?.username || 'Anonymous'}
                          </span>
                        </div>
                        <span className="text-xs text-[#a09080]">
                          {new Date(item.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="text-sm text-[#3c3c3c] leading-relaxed border-l-2 border-[#c5ddc2] pl-3 mb-3 italic">
                        "{item.rawText}"
                      </p>

                      {item.keyItems?.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs text-[#a09080] font-medium">Tags:</span>
                          {item.keyItems.map((k, i) => (
                            <span key={i} className="text-xs bg-white border border-[#e8e0d5] text-[#7a6a5a] px-2 py-0.5 rounded-md">
                              {k}
                            </span>
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
    </div>
  );
};

export default AdminDashboard;
