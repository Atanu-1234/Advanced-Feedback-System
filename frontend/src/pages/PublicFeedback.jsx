import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const sentimentConfig = {
  Positive: { pill: 'bg-[#eaf2e9] text-[#2d5a27] border border-[#c5ddc2]', card: 'border-[#c5ddc2] bg-[#f4f9f3]', label: 'Positive' },
  Negative: { pill: 'bg-red-50 text-red-700 border border-red-200',         card: 'border-red-200 bg-red-50',       label: 'Negative' },
  Neutral:  { pill: 'bg-[#f5f0e8] text-[#8b6f47] border border-[#ddd0bb]', card: 'border-[#ddd0bb] bg-[#faf6ef]', label: 'Neutral'  },
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
    <div className="min-h-screen bg-[#faf9f6] py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Page title */}
        <div className="text-center mb-4 fade-up">
          <p className="text-xs font-semibold text-[#2d5a27] uppercase tracking-widest mb-2">Your Voice Matters</p>
          <h1 className="font-display text-3xl font-bold text-[#1c1c1c] mb-2">Share Your Experience</h1>
          <p className="text-sm text-[#7a6a5a]">
            {isAuthenticated
              ? `Posting as ${username} · Your review will be saved to your profile`
              : 'Your honest feedback helps restaurants improve every day'}
          </p>
        </div>

        {/* Submit card */}
        <div className="bg-white rounded-2xl border border-[#e8e0d5] shadow-sm overflow-hidden fade-up">
          <div className="px-6 py-4 border-b border-[#f0ebe3] flex items-center justify-between bg-[#faf9f6]">
            <div>
              <h2 className="font-semibold text-[#1c1c1c] text-sm">Write a Review</h2>
              <p className="text-xs text-[#a09080] mt-0.5">Analyzed instantly by Gemini AI</p>
            </div>
            {!isAuthenticated && (
              <div className="flex items-center gap-3 text-xs">
                <Link to="/login"    className="text-[#2d5a27] font-semibold hover:underline no-underline">Log in</Link>
                <Link to="/register" className="px-4 py-1.5 bg-[#2d5a27] text-white font-semibold rounded-full no-underline hover:bg-[#234820] transition-all text-xs">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <div className="p-6">
            {submitted && (
              <div className="mb-5 flex items-start gap-3 bg-[#eaf2e9] border border-[#c5ddc2] rounded-xl px-4 py-3">
                <svg className="w-5 h-5 text-[#2d5a27] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <p className="text-sm font-semibold text-[#2d5a27]">Review submitted successfully!</p>
                  <p className="text-xs text-[#4a8c42] mt-0.5">Gemini AI has analyzed and saved your feedback.</p>
                </div>
              </div>
            )}
            {error && (
              <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                rows={5}
                placeholder="Describe your dining experience... e.g. The pasta was perfectly cooked, rich flavour. Service was warm and attentive throughout the evening."
                value={review}
                onChange={e => setReview(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#d4c9bb] rounded-xl text-sm text-[#1c1c1c] bg-[#faf9f6] placeholder-[#b0a090] focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/10 transition-all resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#a09080]">{review.length} characters</span>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#2d5a27] hover:bg-[#234820] disabled:bg-[#7aaa74] text-white font-semibold rounded-full transition-all text-sm flex items-center gap-2">
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
          <div className="bg-white rounded-2xl border border-[#e8e0d5] shadow-sm overflow-hidden fade-up">
            <div className="px-6 py-4 border-b border-[#f0ebe3] flex items-center justify-between bg-[#faf9f6]">
              <div>
                <h2 className="font-semibold text-[#1c1c1c] text-sm">Your Review History</h2>
                <p className="text-xs text-[#a09080] mt-0.5">All your past submissions</p>
              </div>
              <span className="text-xs font-semibold bg-[#f0ebe3] text-[#7a6a5a] px-3 py-1 rounded-full">
                {userHistory.length} total
              </span>
            </div>

            <div className="p-6">
              {userHistory.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-[#f0ebe3] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">📝</div>
                  <p className="text-[#5c5c5c] font-medium text-sm">No reviews yet</p>
                  <p className="text-[#a09080] text-xs mt-1">Submit your first review above</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {userHistory.map((item) => {
                    const s = sentimentConfig[item.sentiment] || sentimentConfig.Neutral;
                    return (
                      <div key={item._id || item.id} className={`rounded-xl border p-4 ${s.card}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.pill}`}>{s.label}</span>
                          <span className="text-xs text-[#a09080]">
                            {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-[#3c3c3c] leading-relaxed mb-2">"{item.rawText}"</p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.keyItems?.map((k, i) => (
                            <span key={i} className="text-xs bg-white border border-[#e8e0d5] text-[#7a6a5a] px-2 py-0.5 rounded-md">{k}</span>
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
