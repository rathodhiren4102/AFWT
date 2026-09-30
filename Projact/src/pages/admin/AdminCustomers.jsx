import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/dashboard/DataTable';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FeedbackSnackbar from '../../components/ui/FeedbackSnackbar';
import BsModal from '../../components/ui/BsModal';
import { fetchUsers, updateUser, deleteUser, registerUser } from '../../services/api';

function AdminCustomers({ user, onLogout }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', phone: '', password: '' },
  });

  const loadCustomers = async () => {
    try {
      setLoading(true); setError('');
      const res = await fetchUsers({ role: 'Customer' });
      if (res.success) setCustomers(res.data || res.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customers.');
    } finally { setLoading(false); }
  };

  useEffect(() => { loadCustomers(); }, []);

  const handleOpenAdd = () => { setEditingCustomer(null); reset({ name: '', email: '', phone: '', password: '' }); setOpenDialog(true); };
  const handleOpenEdit = (cust) => { setEditingCustomer(cust); reset({ name: cust.name || '', email: cust.email || '', phone: cust.phone || '', password: '' }); setOpenDialog(true); };
  const handleOpenView = (cust) => { setViewCustomer(cust); setOpenViewDialog(true); };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (editingCustomer) {
        const res = await updateUser(editingCustomer._id, { name: data.name, email: data.email, phone: data.phone, role: 'Customer' });
        if (res.success) { setSnackbar({ open: true, message: `Customer ${data.name} updated!`, severity: 'success' }); setOpenDialog(false); loadCustomers(); }
      } else {
        const res = await registerUser(data.name, data.email, data.password || 'Customer@123', 'Customer', data.phone);
        if (res.success || res.token) { setSnackbar({ open: true, message: `Customer ${data.name} added!`, severity: 'success' }); setOpenDialog(false); loadCustomers(); }
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to save.', severity: 'error' });
    } finally { setSubmitting(false); }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteUser(deleteTarget._id);
      setCustomers((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setSnackbar({ open: true, message: 'Customer deleted.', severity: 'success' });
      setDeleteTarget(null); loadCustomers();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to delete.', severity: 'error' });
    } finally { setDeleting(false); }
  };

  const filteredCustomers = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  const columns = [
    {
      header: 'Customer',
      accessor: 'name',
      render: (row) => (
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(212,175,55,0.15)', color: '#B8860B', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {row.name ? row.name[0].toUpperCase() : 'C'}
          </div>
          <div>
            <div className="fw-semibold" style={{ fontSize: '0.875rem' }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>ID: {row._id ? row._id.slice(-6) : 'N/A'}</div>
          </div>
        </div>
      ),
    },
    { header: 'Email Address', accessor: 'email' },
    { header: 'Phone', accessor: 'phone', render: (row) => row.phone || <span style={{ color: '#aaa' }}>—</span> },
    { header: 'Joined', accessor: 'createdAt', render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—' },
    {
      header: 'Actions',
      accessor: '_id',
      align: 'right',
      render: (row) => (
        <div className="d-flex gap-1 justify-content-end">
          <button className="btn btn-sm btn-outline-secondary" title="View" onClick={() => handleOpenView(row)}><i className="bi bi-eye" /></button>
          <button className="btn btn-sm btn-outline-primary" title="Edit" onClick={() => handleOpenEdit(row)}><i className="bi bi-pencil" /></button>
          <button className="btn btn-sm btn-outline-danger" title="Delete" onClick={() => setDeleteTarget(row)}><i className="bi bi-trash" /></button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <PageHeader
        title="Client & Customer Registry"
        subtitle="Manage customer profiles, account credentials, and contact details."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Admin', path: '/admin' }, { label: 'Customers' }]}
        actionLabel="Add Customer"
        actionIcon={<i className="bi bi-person-plus-fill" />}
        onAction={handleOpenAdd}
      />

      <div className="dash-card mb-3">
        <div className="input-group" style={{ maxWidth: 450 }}>
          <span className="input-group-text" style={{ background: '#fafafa', borderColor: '#e8e7f4' }}><i className="bi bi-search text-muted" /></span>
          <input type="text" className="form-control dash-form-control" placeholder="Search by name, email, or phone..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ borderLeft: 0 }} />
        </div>
      </div>

      {loading ? <LoadingState message="Loading client registry..." /> : error ? <ErrorState message={error} onRetry={loadCustomers} /> : (
        <DataTable columns={columns} data={filteredCustomers} emptyMessage="No customers found." />
      )}

      {/* Add/Edit Modal */}
      <BsModal
        open={openDialog}
        onClose={() => !submitting && setOpenDialog(false)}
        title={editingCustomer ? 'Edit Customer Profile' : 'Register New Customer'}
        loading={submitting}
        footer={
          <>
            <button className="btn btn-outline-secondary" onClick={() => setOpenDialog(false)} disabled={submitting}>Cancel</button>
            <button className="btn btn-dash-primary" form="customer-form" type="submit" disabled={submitting}>
              {submitting && <span className="spinner-border spinner-border-sm me-2" />}
              {submitting ? 'Saving...' : editingCustomer ? 'Save Changes' : 'Create Customer'}
            </button>
          </>
        }
      >
        <form id="customer-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex flex-column gap-3">
            <div>
              <label className="dash-form-label">Full Name *</label>
              <Controller name="name" control={control} rules={{ required: 'Full name is required' }} render={({ field }) => (
                <input {...field} type="text" className={`form-control dash-form-control ${errors.name ? 'is-invalid' : ''}`} placeholder="e.g. Rahul Verma" />
              )} />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>
            <div>
              <label className="dash-form-label">Email Address *</label>
              <Controller name="email" control={control} rules={{ required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } }} render={({ field }) => (
                <input {...field} type="email" className={`form-control dash-form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="name@example.com" />
              )} />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>
            <div>
              <label className="dash-form-label">Phone Number</label>
              <Controller name="phone" control={control} render={({ field }) => (
                <input {...field} type="text" className="form-control dash-form-control" placeholder="+91 9876543210" />
              )} />
            </div>
            {!editingCustomer && (
              <div>
                <label className="dash-form-label">Password *</label>
                <Controller name="password" control={control} rules={{ required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } }} render={({ field }) => (
                  <input {...field} type="password" className={`form-control dash-form-control ${errors.password ? 'is-invalid' : ''}`} placeholder="Min 6 characters" />
                )} />
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>
            )}
          </div>
        </form>
      </BsModal>

      {/* View Modal */}
      <BsModal
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        title="Customer Details"
        footer={<button className="btn btn-dash-primary" onClick={() => setOpenViewDialog(false)}>Close</button>}
      >
        {viewCustomer && (
          <div className="d-flex flex-column gap-3">
            {[
              { label: 'Full Name', value: viewCustomer.name },
              { label: 'Email Address', value: viewCustomer.email },
              { label: 'Phone Number', value: viewCustomer.phone || 'No phone registered' },
              { label: 'Registered On', value: viewCustomer.createdAt ? new Date(viewCustomer.createdAt).toLocaleString() : 'N/A' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </BsModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Customer Account"
        message={`Remove ${deleteTarget?.name}? This will permanently delete their profile.`}
        confirmText="Delete Account"
        confirmColor="error"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
      <FeedbackSnackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} />
    </DashboardLayout>
  );
}

export default AdminCustomers;
