import React, { useEffect } from 'react';
import '../../styles/dashboard.css';

const SEVERITY_CONFIG = {
  success: { bg: '#198754', icon: 'bi-check-circle-fill' },
  error: { bg: '#dc3545', icon: 'bi-exclamation-circle-fill' },
  warning: { bg: '#ffc107', icon: 'bi-exclamation-triangle-fill' },
  info: { bg: '#0dcaf0', icon: 'bi-info-circle-fill' },
};

function FeedbackSnackbar({ open, message, severity = 'success', onClose, autoHideDuration = 5000 }) {
  useEffect(() => {
    if (open && onClose) {
      const timer = setTimeout(onClose, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, onClose, autoHideDuration]);

  if (!open) return null;

  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.success;

  return (
    <div className="dash-toast-container">
      <div
        className="toast show align-items-center border-0 text-white"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ background: config.bg, borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.35)', fontSize: '0.875rem', fontWeight: 500 }}
      >
        <div className="d-flex align-items-center gap-2 p-3">
          <i className={`bi ${config.icon} fs-5 flex-shrink-0`} />
          <div className="toast-body p-0 flex-grow-1">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white flex-shrink-0"
            onClick={onClose}
            aria-label="Close"
          />
        </div>
      </div>
    </div>
  );
}

export default FeedbackSnackbar;
