import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/dashboard/DataTable';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import FeedbackSnackbar from '../../components/ui/FeedbackSnackbar';
import StatusChip from '../../components/ui/StatusChip';
import { fetchAllAppointments, updateAppointmentStatus, assignBarber, fetchBarbers } from '../../services/api';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

function AdminAppointments({ user, onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;
      const [apptsRes, barbersRes] = await Promise.all([
        fetchAllAppointments(params),
        fetchBarbers(),
      ]);
      if (apptsRes.success) setAppointments(apptsRes.data || []);
      if (barbersRes.success) setBarbers(barbersRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [statusFilter, dateFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await updateAppointmentStatus(id, newStatus);
      if (res.success) {
        setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a)));
        setSnackbar({ open: true, message: `Status updated to ${newStatus}.`, severity: 'success' });
        loadData();
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to update status.', severity: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBarberAssign = async (id, barberId) => {
    if (!barberId) return;
    try {
      setUpdatingId(id);
      const res = await assignBarber(id, barberId);
      if (res.success) {
        setSnackbar({ open: true, message: 'Stylist assigned successfully.', severity: 'success' });
        loadData();
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to assign barber.', severity: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.customer?.name?.toLowerCase().includes(q) ||
      a.service?.name?.toLowerCase().includes(q) ||
      a.barber?.name?.toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      header: 'Customer',
      accessor: 'customer',
      render: (row) => (
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(212,175,55,0.15)', color: '#B8860B',
              fontWeight: 700, fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {row.customer?.name ? row.customer.name[0].toUpperCase() : 'G'}
          </div>
          <div>
            <div className="fw-semibold" style={{ fontSize: '0.875rem' }}>{row.customer?.name || 'Walk-in Client'}</div>
            <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>📞 {row.customer?.phone || row.customer?.email || 'No phone'}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Service & Fee',
      accessor: 'service',
      render: (row) => (
        <div>
          <div className="fw-semibold" style={{ fontSize: '0.875rem' }}>{row.service?.name || 'Service'}</div>
          <div style={{ fontSize: '0.75rem', color: '#B8860B', fontWeight: 600 }}>
            ₹{row.totalAmount || row.service?.price || 0} • {row.service?.duration || 30} mins
          </div>
        </div>
      ),
    },
    {
      header: 'Assign Stylist',
      accessor: 'barber',
      render: (row) => (
        <select
          className="form-select form-select-sm"
          style={{ minWidth: 160, fontSize: '0.825rem' }}
          value={row.barber?._id || row.barber || ''}
          disabled={updatingId === row._id}
          onChange={(e) => handleBarberAssign(row._id, e.target.value)}
        >
          <option value="" disabled>Assign Barber</option>
          {barbers.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
      ),
    },
    {
      header: 'Schedule',
      accessor: 'date',
      render: (row) => (
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{row.date}</div>
          <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
            Slot: <span style={{ color: '#B8860B', fontWeight: 600 }}>{row.timeSlot}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm"
            style={{ minWidth: 130, fontSize: '0.825rem', fontWeight: 600 }}
            value={row.status}
            disabled={updatingId === row._id}
            onChange={(e) => handleStatusChange(row._id, e.target.value)}
          >
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
          {updatingId === row._id && (
            <span className="spinner-border spinner-border-sm" role="status" style={{ color: '#B8860B' }} />
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <PageHeader
        title="Master Appointment Command"
        subtitle="Live schedule control, stylist re-assignments, status progressions, and client booking records."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Admin', path: '/admin' }, { label: 'Appointments' }]}
      />

      {/* Filters */}
      <div className="dash-card mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-sm-6 col-md-4">
            <label className="dash-form-label">Search</label>
            <div className="input-group">
              <span className="input-group-text" style={{ background: '#fafafa', borderColor: '#e8e7f4' }}>
                <i className="bi bi-search text-muted" />
              </span>
              <input
                type="text"
                className="form-control dash-form-control"
                placeholder="Customer, stylist, or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ borderLeft: 0 }}
              />
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <label className="dash-form-label">Status Filter</label>
            <select
              className="form-select dash-form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <label className="dash-form-label">Date Filter</label>
            <input
              type="date"
              className="form-control dash-form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          {(statusFilter || dateFilter || search) && (
            <div className="col-12 col-sm-6 col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => { setStatusFilter(''); setDateFilter(''); setSearch(''); }}
              >
                <i className="bi bi-x-circle me-1" />
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading master appointment records..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <DataTable
          columns={columns}
          data={filteredAppointments}
          emptyMessage="No appointments matched your query or filter criteria."
        />
      )}

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </DashboardLayout>
  );
}

export default AdminAppointments;
