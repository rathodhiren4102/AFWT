import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import '../../styles/dashboard.css';

function PageHeader({ title, subtitle, breadcrumbs, actionLabel, actionIcon, onAction, extraActions }) {
  return (
    <div className="mb-4">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="breadcrumb" className="mb-2">
          <ol className="breadcrumb mb-0" style={{ fontSize: '0.8rem' }}>
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return isLast || !crumb.path ? (
                <li key={idx} className="breadcrumb-item active fw-semibold" style={{ color: '#B8860B' }}>
                  {crumb.label}
                </li>
              ) : (
                <li key={idx} className="breadcrumb-item">
                  <RouterLink to={crumb.path} className="text-muted text-decoration-none" style={{ transition: 'color 0.2s' }}>
                    {crumb.label}
                  </RouterLink>
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {/* Title row */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
        <div>
          <h1 className="dash-page-title mb-0">{title}</h1>
          {subtitle && (
            <p className="mb-0 mt-1" style={{ color: '#6c757d', fontSize: '0.875rem' }}>
              {subtitle}
            </p>
          )}
        </div>

        {(extraActions || actionLabel) && (
          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            {extraActions}
            {actionLabel && (
              <button
                className="btn btn-dash-primary d-flex align-items-center gap-2"
                onClick={onAction}
                style={{ whiteSpace: 'nowrap' }}
              >
                {actionIcon}
                {actionLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
