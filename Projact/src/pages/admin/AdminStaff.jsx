import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/dashboard/DataTable';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FeedbackSnackbar from '../../components/ui/FeedbackSnackbar';
import StatusChip from '../../components/ui/StatusChip';
import BsModal from '../../components/ui/BsModal';
import { fetchStaff, createStaff, updateStaff, deleteStaff } from '../../services/api';

function AdminStaff({ user, onLogout }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '', phone: '', role: 'Barber', specializations: 'Haircut, Beard Styling', commissionRate: 50, experience: 3 },
  });

  const loadStaffData = async () => {
    try {
      setLoading(true); setError('');
      const res = await fetchStaff();
      if (res.success) setStaff(res.data || res.staff || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load staff roster.');
    } finally { setLoading(false); }
  };

  useEffect(() => { loadStaffData(); }, []);

  const handleOpenAdd = () => {
    setEditingStaff(null);
    reset({ name: '', email: '', password: '', phone: '', role: 'Barber', specializations: 'Haircut, Beard Styling', commissionRate: 50, experience: 3 });
    setOpenDialog(true);
  };

  const handleOpenEdit = (member) => {
    setEditingStaff(member);
    reset({
      name: member.name || '', email: member.email || '', password: '',
      phone: member.phone || '', role: member.role || 'Barber',
      specializations: Array.isArray(member.specializations) ? member.specializations.join(', ') : member.specializations || '',
      commissionRate: member.commissionRate || 50, experience: member.experience || 0,
    });
    setOpenDialog(true);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const payload = {
        name: data.name, email: data.email, phone: data.phone, role: data.role,
        specializations: data.specializations ? data.specializations.split(',').map((s) => s.trim()).filter(Boolean) : [],
        commissionRate: Number(data.commissionRate) || 0,
        experience: Number(data.experience) || 0,
      };
      if (editingStaff) {
        if (data.password) payload.password = data.password;
        const res = await updateStaff(editingStaff._id, payload);
        if (res.success) {
          setSnackbar({ open: true, message: `Staff member ${data.name} updated!`, severity: 'success' });
          setOpenDialog(false); loadStaffData();
        }
      } else {
        payload.password = data.password || 'Staff@123';
        const res = await createStaff(payload);
        if (res.success) {
          setSnackbar({ open: true, message: `Staff member ${data.name} created!`, severity: 'success' });
          setOpenDialog(false); loadStaffData();
        }
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to save staff.', severity: 'error' });
    } finally { setSubmitting(false); }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteStaff(deleteTarget._id);
      setStaff((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      setSnackbar({ open: true, message: 'Staff member removed.', severity: 'success' });
      setDeleteTarget(null); loadStaffData();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to delete staff.', severity: 'error' });
    } finally { setDeleting(false); }
  };

  const filteredStaff = staff.filter((s) => {
    const matchSearch = s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter ? s.role === roleFilter : true;
    return matchSearch && matchRole;
  });

  const columns = [
    {
      header: 'Staff Member',
      accessor: 'name',
      render: (row) => (
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#B8860B', color: '#fff', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {row.name ? row.name.substring(0, 2).toUpperCase() : 'ST'}
          </div>
          <div>
            <div className="fw-semibold" style={{ fontSize: '0.875rem' }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{row.email}</div>
          </div>
        </div>
      ),
    },
    { header: 'Role', accessor: 'role', render: (row) => <StatusChip status={row.role} /> },
    {
      header: 'Specializations',
      accessor: 'specializations',
      render: (row) => (
        <div className="d-flex flex-wrap gap-1" style={{ maxWidth: 280 }}>
          {Array.isArray(row.specializations) && row.specializations.length > 0 ? (
            row.specializations.map((spec, i) => (
              <span key={i} className="badge rounded-pill" style={{ background: '#f0eefa', color: '#5856d6', border: '1px solid #dddaf5', fontSize: '0.68rem', fontWeight: 600 }}>{spec}</span>
            ))
          ) : (
            <span style={{ fontSize: '0.75rem', color: '#aaa' }}>General Service</span>
          )}
        </div>
      ),
    },
    { header: 'Contact', accessor: 'phone', render: (row) => row.phone || <span style={{ color: '#aaa' }}>—</span> },
    {
      header: 'Commission',
      accessor: 'commissionRate',
      render: (row) => <span style={{ fontWeight: 700, color: '#B8860B' }}>{row.commissionRate || 0}%</span>,
    },
    {
      header: 'Actions',
      accessor: '_id',
      align: 'right',
      render: (row) => (
        <div className="d-flex gap-1 justify-content-end">
          <button className="btn btn-sm btn-outline-primary" title="Edit" onClick={() => handleOpenEdit(row)}><i className="bi bi-pencil" /></button>
          <button className="btn btn-sm btn-outline-danger" title="Delete" onClick={() => setDeleteTarget(row)}><i className="bi bi-trash" /></button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <PageHeader
        title="Staff & Stylist Directory"
        subtitle="Manage active salon barbers, receptionists, specializations, and commission rates."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Admin', path: '/admin' }, { label: 'Staff' }]}
        actionLabel="Add New Staff"
        actionIcon={<i className="bi bi-person-plus-fill" />}
        onAction={handleOpenAdd}
      />

      {/* Filters */}
      <div className="dash-card mb-3">
        <div className="row g-2">
          <div className="col-12 col-sm-6 col-md-4">
            <div className="input-group">
              <span className="input-group-text" style={{ background: '#fafafa', borderColor: '#e8e7f4' }}><i className="bi bi-search text-muted" /></span>
              <input type="text" className="form-control dash-form-control" placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ borderLeft: 0 }} />
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <select className="form-select dash-form-control" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">All Roles</option>
              <option value="Barber">Barber / Stylist</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? <LoadingState message="Loading staff directory..." /> : error ? <ErrorState message={error} onRetry={loadStaffData} /> : (
        <DataTable columns={columns} data={filteredStaff} emptyMessage="No staff members found." />
      )}

      {/* Add/Edit Modal */}
      <BsModal
        open={openDialog}
        onClose={() => !submitting && setOpenDialog(false)}
        title={editingStaff ? 'Edit Staff Member' : 'Register New Staff Member'}
        titleIcon={<i className="bi bi-scissors" />}
        size="lg"
        loading={submitting}
        footer={
          <>
            <button className="btn btn-outline-secondary" onClick={() => setOpenDialog(false)} disabled={submitting}>Cancel</button>
            <button className="btn btn-dash-primary" form="staff-form" type="submit" disabled={submitting}>
              {submitting && <span className="spinner-border spinner-border-sm me-2" />}
              {submitting ? 'Saving...' : editingStaff ? 'Save Changes' : 'Create Staff Member'}
            </button>
          </>
        }
      >
        <form id="staff-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            <div className="col-12">
              <label className="dash-form-label">Full Name *</label>
              <Controller name="name" control={control} rules={{ required: 'Full name is required' }} render={({ field }) => (
                <input {...field} type="text" className={`form-control dash-form-control ${errors.name ? 'is-invalid' : ''}`} placeholder="e.g. Vikram Malhotra" />
              )} />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>
            <div className="col-12 col-sm-6">
              <label className="dash-form-label">Email Address *</label>
              <Controller name="email" control={control} rules={{ required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } }} render={({ field }) => (
                <input {...field} type="email" className={`form-control dash-form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="staff@gildedblade.com" />
              )} />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>
            <div className="col-12 col-sm-6">
              <label className="dash-form-label">{editingStaff ? 'New Password (leave blank)' : 'Password *'}</label>
              <Controller name="password" control={control} rules={{ required: editingStaff ? false : 'Password required', minLength: { value: 6, message: 'Min 6 characters' } }} render={({ field }) => (
                <input {...field} type="password" className={`form-control dash-form-control ${errors.password ? 'is-invalid' : ''}`} placeholder={editingStaff ? 'Leave empty to preserve' : 'Min 6 characters'} />
              )} />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>
            <div className="col-12 col-sm-6">
              <label className="dash-form-label">Phone</label>
              <Controller name="phone" control={control} render={({ field }) => (
                <input {...field} type="text" className="form-control dash-form-control" placeholder="+91 9876543210" />
              )} />
            </div>
            <div className="col-12 col-sm-6">
              <label className="dash-form-label">Role</label>
              <Controller name="role" control={control} render={({ field }) => (
                <select {...field} className="form-select dash-form-control">
                  <option value="Barber">Barber / Stylist</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Admin">Admin</option>
                </select>
              )} />
            </div>
            <div className="col-12">
              <label className="dash-form-label">Specializations (comma separated)</label>
              <Controller name="specializations" control={control} render={({ field }) => (
                <input {...field} type="text" className="form-control dash-form-control" placeholder="Haircut, Beard Styling, Facial" />
              )} />
            </div>
            <div className="col-12 col-sm-6">
              <label className="dash-form-label">Commission Rate (%)</label>
              <Controller name="commissionRate" control={control} rules={{ min: { value: 0, message: 'Must be positive' }, max: { value: 100, message: 'Max 100%' } }} render={({ field }) => (
                <input {...field} type="number" className={`form-control dash-form-control ${errors.commissionRate ? 'is-invalid' : ''}`} />
              )} />
              {errors.commissionRate && <div className="invalid-feedback">{errors.commissionRate.message}</div>}
            </div>
            <div className="col-12 col-sm-6">
              <label className="dash-form-label">Experience (Years)</label>
              <Controller name="experience" control={control} rules={{ min: { value: 0, message: 'Must be 0 or more' } }} render={({ field }) => (
                <input {...field} type="number" className={`form-control dash-form-control ${errors.experience ? 'is-invalid' : ''}`} />
              )} />
              {errors.experience && <div className="invalid-feedback">{errors.experience.message}</div>}
            </div>
          </div>
        </form>
      </BsModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Remove Staff Member"
        message={`Are you sure you want to delete ${deleteTarget?.name}? They will no longer be able to log in.`}
        confirmText="Delete Staff"
        confirmColor="error"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
      <FeedbackSnackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} />
    </DashboardLayout>
  );
}

export default AdminStaff;
