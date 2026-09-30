import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getRoleLabel, getRolePath } from '../../utils/role';
import { DRAWER_WIDTH } from './Sidebar';
import '../../styles/dashboard.css';

function Topbar({ user, onLogout, onMobileToggle }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const userInitial = user?.name ? user.name[0].toUpperCase() : 'U';

  const handleProfileClick = () => {
    setMenuOpen(false);
    if (user?.role) {
      navigate(`${getRolePath(user.role)}/profile`);
    }
  };

  const handleLogout = () => {
    setMenuOpen(false);
    onLogout();
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="dash-topbar">
      {/* Left side */}
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-sm d-md-none"
          style={{ border: 'none', background: 'transparent', padding: '6px', fontSize: '1.25rem' }}
          onClick={onMobileToggle}
          aria-label="Toggle menu"
        >
          <i className="bi bi-list" />
        </button>
        <span
          className="d-none d-sm-block fw-bold"
          style={{ fontSize: '1.05rem', color: '#1a1a2e', letterSpacing: '0.02em' }}
        >
          GILDED <span style={{ color: '#B8860B' }}>BLADE</span>
        </span>
      </div>

      {/* Right side */}
      <div className="d-flex align-items-center gap-2">
        {/* Main Site Link */}
        <RouterLink
          to="/"
          className="d-none d-sm-flex align-items-center gap-1"
          style={{ color: '#6c757d', textDecoration: 'none', fontSize: '0.875rem', padding: '6px 12px', borderRadius: '8px', transition: 'all 0.2s' }}
        >
          <i className="bi bi-house" />
          Main Site
        </RouterLink>

        {/* User Dropdown */}
        {user && (
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              className="dash-user-trigger"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: '1px solid #e8e7f4' }}
            >
              <div className="dash-avatar">{userInitial}</div>
              <div className="d-none d-sm-block text-start" style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a2e' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6c757d' }}>
                  {getRoleLabel(user.role)}
                </div>
              </div>
              <i className="bi bi-chevron-down d-none d-sm-inline" style={{ fontSize: '0.75rem', color: '#6c757d' }} />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  minWidth: '200px',
                  background: '#fff',
                  border: '1px solid #e8e7f4',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                  padding: '6px',
                  zIndex: 9999,
                }}
              >
                {/* User info */}
                <div className="px-3 py-2">
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a2e' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{user.email}</div>
                  <span
                    className="mt-1 d-inline-block"
                    style={{
                      padding: '2px 8px',
                      background: 'rgba(184,134,11,0.08)',
                      color: '#B8860B',
                      border: '1px solid rgba(184,134,11,0.25)',
                      borderRadius: '12px',
                      fontSize: '0.67rem',
                      fontWeight: 600,
                    }}
                  >
                    {getRoleLabel(user.role)}
                  </span>
                </div>
                <hr className="my-1" style={{ borderColor: '#e8e7f4' }} />
                <button
                  className="w-100 text-start"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#374151',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onClick={handleProfileClick}
                >
                  <i className="bi bi-person" style={{ color: '#6c757d' }} />
                  Account Profile
                </button>
                <hr className="my-1" style={{ borderColor: '#e8e7f4' }} />
                <button
                  className="w-100 text-start"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#dc3545',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 600,
                  }}
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right" style={{ color: '#dc3545' }} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Topbar;
