import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, role, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const active = (p) => location.pathname === p;

  const navLink = (path, label) => ({
    display: 'inline-block',
    padding: '6px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'all 0.2s',
    background: active(path) ? '#f0f4ff' : 'transparent',
    color: active(path) ? '#667eea' : '#555',
  });

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #f0f0f0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
      }}>

        {/* Logo */}
        <Link to={isAuthenticated ? '/feedback' : '/register'} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          textDecoration: 'none', flexShrink: 0,
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(102,126,234,0.4)',
          }}>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: '800' }}>RF</span>
          </div>
          <span style={{ fontWeight: '700', fontSize: '17px', color: '#1a1a1a', letterSpacing: '-0.3px' }}>
            RestoFeedback
          </span>
        </Link>

        {/* Center nav */}
        {isAuthenticated && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Link to="/feedback" style={navLink('/feedback', 'Submit Review')}>Submit Review</Link>
            {role === 'admin' && (
              <Link to="/admin/dashboard" style={navLink('/admin/dashboard', 'Dashboard')}>Dashboard</Link>
            )}
          </nav>
        )}

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {isAuthenticated ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 12px', background: '#f8f8f8',
                border: '1px solid #ebebeb', borderRadius: '10px',
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff', fontSize: '12px', fontWeight: '700',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textTransform: 'uppercase',
                }}>
                  {username?.[0]}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a' }}>{username}</span>
                <span style={{
                  fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px',
                  background: role === 'admin' ? '#fef3c7' : '#d1fae5',
                  color: role === 'admin' ? '#92400e' : '#065f46',
                }}>
                  {role}
                </span>
              </div>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                style={{
                  padding: '7px 16px', fontSize: '13px', fontWeight: '600',
                  color: '#666', background: 'transparent',
                  border: '1px solid #e0e0e0', borderRadius: '8px',
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.target.style.borderColor = '#ff4d4d'; e.target.style.color = '#ff4d4d'; }}
                onMouseLeave={e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.color = '#666'; }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                padding: '7px 16px', fontSize: '14px', fontWeight: '500',
                color: '#555', textDecoration: 'none', borderRadius: '8px',
                transition: 'all 0.2s',
              }}>
                Log in
              </Link>
              <Link to="/register" style={{
                padding: '8px 20px', fontSize: '14px', fontWeight: '700',
                color: '#fff', textDecoration: 'none', borderRadius: '10px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 2px 10px rgba(102,126,234,0.35)',
                transition: 'opacity 0.2s',
              }}>
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
