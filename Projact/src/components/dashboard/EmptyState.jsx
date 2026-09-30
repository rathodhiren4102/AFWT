import React from 'react';
import '../../styles/dashboard.css';

function EmptyState({
  title = 'No Records Found',
  message = 'There is no data available to display at this time.',
  actionLabel,
  actionIcon,
  onAction,
  icon,
}) {
  return (
    <div className="dash-empty-state">
      <div className="dash-empty-icon">
        {icon || <i className="bi bi-inbox" />}
      </div>
      <h6 className="fw-bold mb-2" style={{ color: '#1a1a2e' }}>{title}</h6>
      <p className="mb-0" style={{ color: '#6c757d', fontSize: '0.875rem', maxWidth: 440, margin: '0 auto' }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          className="btn btn-dash-primary mt-3"
          onClick={onAction}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          {actionIcon}
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
