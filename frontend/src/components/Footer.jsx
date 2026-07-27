import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{
    background: '#0f0f0f',
    color: '#888',
    marginTop: 'auto',
    fontFamily: "'Inter', system-ui, sans-serif",
  }}>
    {/* Top gradient bar */}
    <div style={{ height: '3px', background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)' }} />

    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 24px 32px' }}>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '40px',
        marginBottom: '48px',
      }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: '12px', fontWeight: '800' }}>RF</span>
            </div>
            <span style={{ color: '#fff', fontWeight: '700', fontSize: '16px' }}>RestoFeedback</span>
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#555', maxWidth: '220px' }}>
            AI-powered restaurant feedback platform delivering real-time insights for better dining.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Quick Links
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { to: '/register', label: 'Create Account' },
              { to: '/login',    label: 'Sign In' },
              { to: '/feedback', label: 'Submit Review' },
            ].map(l => (
              <Link key={l.to} to={l.to} style={{ color: '#666', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#666'}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Features
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['AI Sentiment Analysis', 'Real-time Dashboard', 'Review History', 'Secure JWT Auth'].map(f => (
              <span key={f} style={{ color: '#555', fontSize: '13px' }}>{f}</span>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Built With
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['React 19', 'Node.js', 'MongoDB', 'Gemini AI', 'Socket.io', 'Tailwind'].map(t => (
              <span key={t} style={{
                fontSize: '11px', padding: '4px 10px', borderRadius: '20px',
                border: '1px solid #2a2a2a', color: '#555',
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid #1e1e1e',
        paddingTop: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        fontSize: '12px',
        color: '#3a3a3a',
      }}>
        <span>© {new Date().getFullYear()} RestoFeedback. All rights reserved.</span>
        <span>Made with <span style={{ color: '#e05252' }}>♥</span> using React & Tailwind CSS</span>
      </div>
    </div>
  </footer>
);

export default Footer;
