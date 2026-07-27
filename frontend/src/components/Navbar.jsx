import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, role, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const active = (p) => location.pathname === p;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to={isAuthenticated ? '/feedback' : '/register'} className="flex items-center gap-2 no-underline shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow">RF</div>
          <span className="font-bold text-gray-900 text-base">RestoFeedback</span>
        </Link>

        {/* Center nav */}
        {isAuthenticated && (
          <nav className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <Link to="/feedback"
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all no-underline ${active('/feedback') ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              Submit Review
            </Link>
            {role === 'admin' && (
              <Link to="/admin/dashboard"
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all no-underline ${active('/admin/dashboard') ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                Dashboard
              </Link>
            )}
          </nav>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center uppercase">
                  {username?.[0]}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{username}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                  {role}
                </span>
              </div>
              <button onClick={() => { logout(); navigate('/login'); }}
                className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all no-underline ${active('/login') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                Log in
              </Link>
              <Link to="/register" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all no-underline shadow-sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
