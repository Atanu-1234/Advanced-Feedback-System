import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const sentimentConfig = {
  Positive: { pill: 'bg-green-100 text-green-700 border border-green-200', card: 'border-green-200 bg-green-50', dot: 'bg-green-500', label: '😊 Positive' },
  Negative: { pill: 'bg-red-100 text-red-700 border border-red-200',       card: 'border-red-200 bg-red-50',     dot: 'bg-red-500',   label: '😞 Negative' },
  Neutral:  { pill: 'bg-amber-100 text-amber-700 border border-amber-200', card: 'border-amber-200 bg-amber-50', dot: 'bg-amber-400', label: '😐 Neutral'  },
};

const PublicFeedback = () => {
  const [review, setReview]           = useState('');
  const [loading, setLoading]         = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [error, setError]             = useState('');
  const [userHistory, setUserHistory] = useState([]);
  const { token, isAuthenticated, username } = useContext(AuthContext);
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const fetchMyHistory = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch(`${apiBase}/api/feedback/my-feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const res = await fetch(`${apiBase}/api/feedback`, {
        method: 'POST', headers, body: JSON.stringify({ rawText: review }),
      });
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Page title */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Share Your Experience</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isAuthenticated
              ? `Posting as ${username} · Your review will be saved to your profile`
              : 'Your honest feedback helps restaurants improve every day'}
          </p>
        </div>

        {/* Submit card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Write a Review</h2>
              <p className="text-xs text-gray-400 mt-0.5">Analyzed instantly by Gemini AI</p>
            </div>
            {!isAuthenticated && (
              <div className="flex items-center gap-3 text-xs">
                <Link to="/login"    className="text-blue-600 font-semibold hover:underline no-underline">Log in</Link>
                <Link to="/register" className="px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-lg no-underline hover:bg-blue-700 transition-all">Sign up</Link>
              </div>
            )}
          </div>

          <div className="p-6">
            {submitted && (
              <div className="mb-4 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <p className="text-sm font-semibold text-green-700">Review submitted!</p>
                  <p className="text-xs text-green-600 mt-0.5">AI has analyzed and saved your feedback.</p>
                </div>
              </div>
            )}
            {error && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                rows={5}
                placeholder="Describe your dining experience... e.g. The pizza was amazing, crispy crust and fresh toppings. Service was a bit slow but staff were friendly."
                value={review}
                onChange={e => setReview(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{review.length} characters</span>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all text-sm shadow-sm flex items-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Analyzing...
                    </>
                  ) : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* History */}
        {isAuthenticated && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900 text-sm">Your Review History</h2>
                <p className="text-xs text-gray-400 mt-0.5">All your past submissions</p>
              </div>
              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                {userHistory.length} total
              </span>
            </div>

            <div className="p-6">
              {userHistory.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">📝</div>
                  <p className="text-gray-600 font-medium text-sm">No reviews yet</p>
                  <p className="text-gray-400 text-xs mt-1">Submit your first review above</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {userHistory.map((item) => {
                    const s = sentimentConfig[item.sentiment] || sentimentConfig.Neutral;
                    return (
                      <div key={item._id || item.id} className={`rounded-xl border p-4 ${s.card}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.pill}`}>{s.label}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">"{item.rawText}"</p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.keyItems?.map((k, i) => (
                            <span key={i} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md">{k}</span>
                          ))}
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
    </div>
  );
};

export default PublicFeedback;
