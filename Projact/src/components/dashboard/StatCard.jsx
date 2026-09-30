import React from 'react';
import '../../styles/dashboard.css';

function StatCard({ title, value, icon, accentColor = '#B8860B', subtitle }) {
  return (
    <div className="dash-stat-card">
      {/* Top accent bar */}
      <div
        className="dash-stat-accent-bar"
        style={{ background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}55 100%)` }}
      />

      <div className="d-flex justify-content-between align-items-start mb-3">
        <p className="mb-0 fw-semibold" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
          {title}
        </p>
        {icon && (
          <div
            className="dash-stat-icon-box"
            style={{
              background: `${accentColor}18`,
              color: accentColor,
              border: `1px solid ${accentColor}30`,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div
        className="fw-bold"
        style={{
          fontSize: '1.6rem',
          color: accentColor,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}
      >
        {value !== undefined && value !== null ? value : '—'}
      </div>

      {subtitle && (
        <p className="mb-0 mt-1" style={{ fontSize: '0.75rem', color: '#6c757d' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default StatCard;
