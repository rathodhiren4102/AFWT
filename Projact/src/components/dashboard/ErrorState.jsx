import React from 'react';
import '../../styles/dashboard.css';

function ErrorState({
  title = 'Error Loading Data',
  message = 'Unable to load information from the server.',
  onRetry,
}) {
  return (
    <div className="alert alert-danger d-flex align-items-start gap-3 rounded-3 my-3" role="alert" style={{ boxShadow: '0 4px 16px rgba(220,53,69,0.15)' }}>
      <i className="bi bi-exclamation-triangle-fill fs-4 mt-1 flex-shrink-0" />
      <div className="flex-grow-1">
        <h6 className="alert-heading fw-bold mb-1">{title}</h6>
        <p className="mb-0" style={{ fontSize: '0.875rem' }}>{message}</p>
      </div>
      {onRetry && (
        <button
          className="btn btn-sm btn-outline-danger flex-shrink-0"
          onClick={onRetry}
          style={{ whiteSpace: 'nowrap' }}
        >
          <i className="bi bi-arrow-clockwise me-1" />
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorState;
