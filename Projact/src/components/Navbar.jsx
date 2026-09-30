import React from 'react';
import { Link } from 'react-router-dom';
import { getRolePath, getRoleLabel } from '../utils/role';

function Navbar({ user, onLogout }) {
  const rolePath = user ? getRolePath(user.role) : '/login';
  const roleLabel = user ? getRoleLabel(user.role) : '';

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <Link to={user ? '/' : '/login'} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
          gilded<span style={{ color: 'var(--accent-purple)' }}>blade</span><span className="brand-dot">.</span>
        </Link>
      </div>

      {/* Links */}
      <ul className="navbar-links">
        {user ? (
          <>
            <li>
              <Link to="/">
                <span className="nav-num">01</span>
                Home
              </Link>
            </li>
            <li>
              <Link to={rolePath}>
                <span className="nav-num">02</span>
                {roleLabel} Panel
              </Link>
            </li>
            <li>
              <span className="navbar-welcome">👋 {user.name}</span>
            </li>
            <li>
              <button onClick={onLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">
                <span className="nav-num">01</span>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="navbar-cta-btn" style={{ textDecoration: 'none' }}>
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
