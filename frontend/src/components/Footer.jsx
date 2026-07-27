import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-[#1c1c1c] text-[#a09080] mt-auto">
    <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">

      {/* Top grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#4a8c42] flex items-center justify-center">
              <span className="text-white text-xs font-bold">RF</span>
            </div>
            <span className="font-display font-bold text-white text-lg">RestoFeedback</span>
          </div>
          <p className="text-sm leading-relaxed text-[#7a6a5a] max-w-xs">
            AI-powered restaurant feedback platform. Real-time insights that help restaurants serve you better.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            {[
              { to: '/register', label: 'Create Account' },
              { to: '/login',    label: 'Sign In' },
              { to: '/feedback', label: 'Submit Review' },
            ].map(l => (
              <li key={l.to}>
                <Link to={l.to} className="text-[#7a6a5a] hover:text-white transition-colors no-underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Features */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Features</h4>
          <ul className="space-y-3 text-sm text-[#7a6a5a]">
            <li>AI Sentiment Analysis</li>
            <li>Real-time Dashboard</li>
            <li>Review History</li>
            <li>Secure JWT Auth</li>
          </ul>
        </div>

        {/* Tech */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Built With</h4>
          <div className="flex flex-wrap gap-2">
            {['React 19', 'Node.js', 'MongoDB', 'Gemini AI', 'Socket.io', 'Tailwind'].map(t => (
              <span key={t} className="text-xs border border-[#333] text-[#7a6a5a] px-2.5 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#2a2a2a] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4a4a4a]">
        <span>© {new Date().getFullYear()} RestoFeedback. All rights reserved.</span>
        <span>Made with <span className="text-[#8b5e3c]">♥</span> using React & Tailwind CSS</span>
      </div>
    </div>
  </footer>
);

export default Footer;
