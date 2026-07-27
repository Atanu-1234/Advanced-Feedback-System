import React, { useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const sentimentConfig = {
  Positive: { pill: 'bg-green-100 text-green-700 border border-green-200', bar: 'bg-green-500' },
  Negative: { pill: 'bg-red-100 text-red-700 border border-red-200',       bar: 'bg-red-500'   },
  Neutral:  { pill: 'bg-amber-100 text-amber-700 border border-amber-200', bar: 'bg-amber-400' },
};

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

  const stats = [
    { label: 'Total Reviews',  value: total,    color: 'text-gray-900',  bg: 'bg-gray-100'   },
    { label: 'Positive',       value: positive, color: 'text-green-700', bg: 'bg-green-100'  },
    { label: 'Negative',       value: negative, color: 'text-red-700',   bg: 'bg-red-100'    },
    { label: 'Urgent Actions', value: urgent,   color: 'text-orange-700',bg: 'bg-orange-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Page header row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Admin Dashboard
              {newCount > 0 && (
                <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-full">
                  +{newCount} new
                </span>
              )}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Real-time AI-analyzed customer feedback</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold
            ${connected ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
            {connected ? 'Live' : 'Disconnected'}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Feed */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Live Feedback Feed</h2>
              <p className="text-xs text-gray-400 mt-0.5">New reviews appear instantly via WebSocket</p>
            </div>
            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
              {total} entries
            </span>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Loading feedback...</p>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📭</div>
                <p className="text-gray-700 font-semibold text-sm">No feedback yet</p>
                <p className="text-gray-400 text-xs mt-1">New reviews will appear here in real-time</p>
              </div>
            ) : (
              <div className="space-y-3">
                {feedbacks.map((item, idx) => {
                  const s = sentimentConfig[item.sentiment] || sentimentConfig.Neutral;
                  const isUrgent = item.requiresAction;
                  return (
                    <div
                      key={item._id || item.id}
                      className={`rounded-xl border p-4 transition-all fade-up ${isUrgent ? 'border-red-300 bg-red-50 urgent-ring' : 'border-gray-200 bg-gray-50'}`}
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
                          <span className="text-xs bg-white border border-gray-200 text-gray-500 px-2.5 py-1 rounded-full">
                            {item.user?.username || 'Anonymous'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed border-l-2 border-blue-300 pl-3 mb-3 italic">
                        "{item.rawText}"
                      </p>

                      {item.keyItems?.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs text-gray-400 font-medium">Tags:</span>
                          {item.keyItems.map((k, i) => (
                            <span key={i} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md">
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
