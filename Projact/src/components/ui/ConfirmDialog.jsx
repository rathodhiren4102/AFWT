import React from 'react';
import '../../styles/dashboard.css';

function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'error',
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  const btnClass = confirmColor === 'error' ? 'btn-danger' : 'btn-warning';

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050 }}
        onClick={loading ? undefined : onCancel}
      />
      {/* Modal */}
      <div
        className="modal fade show d-block"
        style={{ zIndex: 1055 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 400 }}>
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 pb-0 pt-4 px-4">
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: confirmColor === 'error' ? 'rgba(220,53,69,0.12)' : 'rgba(212,175,55,0.12)',
                    color: confirmColor === 'error' ? '#dc3545' : '#B8860B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0,
                  }}
                >
                  <i className="bi bi-exclamation-triangle" />
                </div>
                <h5 id="confirm-dialog-title" className="modal-title fw-bold mb-0">
                  {title}
                </h5>
              </div>
            </div>
            <div className="modal-body px-4 py-3">
              <p className="text-muted mb-0" style={{ fontSize: '0.925rem' }}>
                {message}
              </p>
            </div>
            <div className="modal-footer border-0 px-4 pb-4 pt-2 gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                {cancelText}
              </button>
              <button
                className={`btn ${btnClass}`}
                onClick={onConfirm}
                disabled={loading}
              >
                {loading && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                {loading ? 'Processing...' : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmDialog;
