import React from 'react';

/**
 * Reusable Bootstrap 5 Modal wrapper (no MUI Dialog).
 */
function BsModal({ open, onClose, title, children, footer, size = 'md', loading = false, titleIcon }) {
  if (!open) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050 }}
        onClick={loading ? undefined : onClose}
      />
      <div
        className="modal fade show d-block"
        style={{ zIndex: 1055 }}
        role="dialog"
        aria-modal="true"
      >
        <div className={`modal-dialog modal-${size} modal-dialog-centered modal-dialog-scrollable`}>
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-bottom" style={{ borderColor: '#e8e7f4' }}>
              <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                {titleIcon && <span style={{ color: '#B8860B' }}>{titleIcon}</span>}
                {title}
              </h5>
              {!loading && (
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  aria-label="Close"
                />
              )}
            </div>
            <div className="modal-body p-4">{children}</div>
            {footer && (
              <div
                className="modal-footer border-top gap-2"
                style={{ borderColor: '#e8e7f4' }}
              >
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BsModal;
