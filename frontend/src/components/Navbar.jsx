import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, role, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const active = (p) => location.pathname === p;

  return (
    <header className="bg-[#faf9f6] border-b border-[#e8e0d5] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to={isAuthenticated ? '/feedback' : '/register'} className="flex items-center gap-2.5 no-underline shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#2d5a27] flex items-center justify-center">
            <span className="text-white text-xs font-bold">RF</span>
          </div>
          <span className="font-display font-bold text-[#1c1c1c] text-lg tracking-tight">RestoFeedback</span>
        </Link>

        {/* Center nav */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/feedback"
              className={`no-underline transition-colors font-medium ${active('/feedback') ? 'text-[#2d5a27] border-b-2 border-[#2d5a27] pb-0.5' : 'text-[#5c5c5c] hover:text-[#1c1c1c]'}`}>
              Submit Review
            </Link>
            {role === 'admin' && (
              <Link to="/admin/dashboard"
                className={`no-underline transition-colors font-medium ${active('/admin/dashboard') ? 'text-[#2d5a27] border-b-2 border-[#2d5a27] pb-0.5' : 'text-[#5c5c5c] hover:text-[#1c1c1c]'}`}>
                Dashboard
              </Link>
            )}
          </nav>
        )}

        {/* Right */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-[#5c5c5c]">
                <div className="w-7 h-7 rounded-full bg-[#2d5a27] text-white text-xs font-bold flex items-center justify-center uppercase">
                  {username?.[0]}
                </div>
                <span className="font-medium text-[#1c1c1c]">{username}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${role === 'admin' ? 'bg-[#f0ebe3] text-[#8b5e3c]' : 'bg-[#eaf2e9] text-[#2d5a27]'}`}>
                  {role}
                </span>
              </div>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="text-sm font-medium text-[#5c5c5c] hover:text-[#1c1c1c] border border-[#d4c9bb] hover:border-[#1c1c1c] px-4 py-1.5 rounded-full transition-all">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className={`text-sm font-medium no-underline transition-colors ${active('/login') ? 'text-[#2d5a27]' : 'text-[#5c5c5c] hover:text-[#1c1c1c]'}`}>
                Log in
              </Link>
              <Link to="/register"
                className="text-sm font-semibold no-underline bg-[#2d5a27] hover:bg-[#234820] text-white px-5 py-2 rounded-full transition-all">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
