import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-950 border-t border-gray-800 mt-auto">
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">

        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">RF</div>
            <span className="text-white font-bold text-base">RestoFeedback</span>
          </div>
          <p className="text-gray-500 text-xs text-center md:text-left max-w-xs">
            AI-powered restaurant feedback. Real-time insights for better dining.
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm">
          <Link to="/register" className="text-gray-400 hover:text-white transition-colors no-underline">Register</Link>
          <Link to="/login"    className="text-gray-400 hover:text-white transition-colors no-underline">Login</Link>
          <Link to="/feedback" className="text-gray-400 hover:text-white transition-colors no-underline">Reviews</Link>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap justify-center gap-2">
          {['React', 'Node.js', 'MongoDB', 'Gemini AI', 'Socket.io'].map(t => (
            <span key={t} className="text-xs bg-gray-900 border border-gray-800 text-gray-500 px-2.5 py-1 rounded-md">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
        <span>© {new Date().getFullYear()} RestoFeedback. All rights reserved.</span>
        <span>Built with <span className="text-red-500">♥</span> using React & Tailwind CSS</span>
      </div>
    </div>
  </footer>
);

export default Footer;
