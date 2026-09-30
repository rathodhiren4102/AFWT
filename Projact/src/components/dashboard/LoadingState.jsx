import React from 'react';
import '../../styles/dashboard.css';

function LoadingState({ message = 'Loading data...', size = 44 }) {
  return (
    <div className="dash-loading">
      <div
        className="spinner-border"
        role="status"
        style={{ width: size, height: size, color: '#B8860B', borderWidth: '3px' }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 mb-0" style={{ color: '#6c757d', fontSize: '0.875rem', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
}

export default LoadingState;
