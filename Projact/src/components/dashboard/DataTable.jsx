import React, { useState } from 'react';
import EmptyState from './EmptyState';
import '../../styles/dashboard.css';

function DataTable({
  columns,
  data = [],
  keyField = '_id',
  emptyMessage = 'No records found',
  rowsPerPageOptions = [5, 10, 25, 50],
  defaultRowsPerPage = 10,
  enablePagination = true,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  if (!data || data.length === 0) {
    return <EmptyState title="No Records" message={emptyMessage} />;
  }

  const displayedRows = enablePagination
    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : data;

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="dash-table-wrap">
      <div style={{ overflowX: 'auto', maxHeight: '600px', overflowY: 'auto' }}>
        <table className="table table-hover" aria-label="data table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || col.accessor || idx}
                  style={{
                    textAlign: col.align || 'left',
                    width: col.width,
                    minWidth: col.minWidth,
                    position: 'sticky',
                    top: 0,
                    background: '#f8f7fe',
                    zIndex: 1,
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((row, rowIndex) => {
              const rowKey = row[keyField] || row.id || rowIndex;
              return (
                <tr key={rowKey}>
                  {columns.map((col, colIndex) => (
                    <td
                      key={col.key || col.accessor || colIndex}
                      style={{ textAlign: col.align || 'left' }}
                    >
                      {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {enablePagination && data.length > rowsPerPageOptions[0] && (
        <div className="dash-pagination justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <span>Rows per page:</span>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
            >
              {rowsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span>
              {page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, data.length)} of {data.length}
            </span>
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              <i className="bi bi-chevron-left" />
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
