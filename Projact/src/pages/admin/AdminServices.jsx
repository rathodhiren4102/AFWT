import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import EmptyState from '../../components/dashboard/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FeedbackSnackbar from '../../components/ui/FeedbackSnackbar';
import BsModal from '../../components/ui/BsModal';
import { fetchServices, createService, updateService, deleteService } from '../../services/api';

const CATEGORIES = ['Haircut', 'Beard Styling', 'Hair Coloring', 'Facial', 'Spa', 'Massage', 'Manicure', 'Pedicure', 'Other'];

function AdminServices({ user, onLogout }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: '', description: '', category: 'Haircut', price: 300, duration: 30 },
  });

  const loadServices = async () => {
    try {
      setLoading(true); setError('');
      const res = await fetchServices();
      if (res.success) setServices(res.data || res.services || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load service menu.');
    } finally { setLoading(false); }
  };

  useEffect(() => { loadServices(); }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    reset({ name: '', description: '', category: 'Haircut', price: 300, duration: 30 });
    setOpenDialog(true);
  };

  const handleOpenEdit = (svc) => {
    setEditingService(svc);
    reset({ name: svc.name || '', description: svc.description || '', category: svc.category || 'Haircut', price: svc.price || 0, duration: svc.duration || 30 });
    setOpenDialog(true);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const payload = { name: data.name, description: data.description, category: data.category, price: Number(data.price), duration: Number(data.duration) };
      if (editingService) {
        const res = await updateService(editingService._id, payload);
        if (res.success) { setSnackbar({ open: true, message: `Service "${data.name}" updated!`, severity: 'success' }); setOpenDialog(false); loadServices(); }
      } else {
        const res = await createService(payload);
        if (res.success) { setSnackbar({ open: true, message: `Service "${data.name}" added!`, severity: 'success' }); setOpenDialog(false); loadServices(); }
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to save service.', severity: 'error' });
    } finally { setSubmitting(false); }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteService(deleteTarget._id);
      setServices((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      setSnackbar({ open: true, message: 'Service deleted.', severity: 'success' });
      setDeleteTarget(null); loadServices();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to delete.', severity: 'error' });
    } finally { setDeleting(false); }
  };

  const filteredServices = services.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = s.name?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q);
    return matchSearch && (categoryFilter ? s.category === categoryFilter : true);
  });

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <PageHeader
        title="Services & Grooming Catalog"
        subtitle="Configure salon treatments, pricing, duration intervals, and package descriptions."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Admin', path: '/admin' }, { label: 'Services' }]}
        actionLabel="Add New Service"
        actionIcon={<i className="bi bi-plus-lg" />}
        onAction={handleOpenAdd}
      />

      {/* Filters */}
      <div className="dash-card mb-3">
        <div className="row g-2">
          <div className="col-12 col-sm-6 col-md-4">
            <div className="input-group">
              <span className="input-group-text" style={{ background: '#fafafa', borderColor: '#e8e7f4' }}><i className="bi bi-search text-muted" /></span>
              <input type="text" className="form-control dash-form-control" placeholder="Search services..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ borderLeft: 0 }} />
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <select className="form-select dash-form-control" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? <LoadingState message="Loading service catalog..." /> : error ? <ErrorState message={error} onRetry={loadServices} /> : filteredServices.length === 0 ? (
        <EmptyState title="No Services Found" message="No grooming services match your criteria." actionLabel="Add First Service" actionIcon={<i className="bi bi-plus-lg" />} onAction={handleOpenAdd} />
      ) : (
        <div className="row g-3">
          {filteredServices.map((svc) => (
            <div key={svc._id} className="col-12 col-sm-6 col-md-4">
              <div className="dash-card h-100 d-flex flex-column" style={{ transition: 'border-color 0.2s, box-shadow 0.2s' }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-bold mb-0" style={{ fontSize: '1.05rem' }}>{svc.name}</h6>
                  <span className="badge ms-2" style={{ background: 'rgba(59,130,246,0.12)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.25)', fontWeight: 600, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                    {svc.category}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6c757d', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 40, flexGrow: 1 }}>
                  {svc.description || 'Professional grooming and precision styling.'}
                </p>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span style={{ color: '#B8860B', fontWeight: 700, fontSize: '1.1rem' }}>₹{svc.price}</span>
                  <span style={{ color: '#6c757d', fontSize: '0.8rem' }}><i className="bi bi-clock me-1" />{svc.duration} mins</span>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary flex-fill" onClick={() => handleOpenEdit(svc)}><i className="bi bi-pencil me-1" />Edit</button>
                  <button className="btn btn-sm btn-outline-danger flex-fill" onClick={() => setDeleteTarget(svc)}><i className="bi bi-trash me-1" />Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <BsModal
        open={openDialog}
        onClose={() => !submitting && setOpenDialog(false)}
        title={editingService ? 'Edit Service Package' : 'Create New Service Package'}
        titleIcon={<i className="bi bi-scissors" />}
        loading={submitting}
        footer={
          <>
            <button className="btn btn-outline-secondary" onClick={() => setOpenDialog(false)} disabled={submitting}>Cancel</button>
            <button className="btn btn-dash-primary" form="service-form" type="submit" disabled={submitting}>
              {submitting && <span className="spinner-border spinner-border-sm me-2" />}
              {submitting ? 'Saving...' : editingService ? 'Save Changes' : 'Create Service'}
            </button>
          </>
        }
      >
        <form id="service-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            <div className="col-12">
              <label className="dash-form-label">Service Name *</label>
              <Controller name="name" control={control} rules={{ required: 'Service name is required' }} render={({ field }) => (
                <input {...field} type="text" className={`form-control dash-form-control ${errors.name ? 'is-invalid' : ''}`} placeholder="e.g. Royal Beard Sculpt & Steam" />
              )} />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>
            <div className="col-12">
              <label className="dash-form-label">Category *</label>
              <Controller name="category" control={control} rules={{ required: 'Category is required' }} render={({ field }) => (
                <select {...field} className="form-select dash-form-control">
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              )} />
            </div>
            <div className="col-12 col-sm-6">
              <label className="dash-form-label">Price (₹) *</label>
              <Controller name="price" control={control} rules={{ required: 'Price is required', min: { value: 0, message: 'Cannot be negative' } }} render={({ field }) => (
                <input {...field} type="number" className={`form-control dash-form-control ${errors.price ? 'is-invalid' : ''}`} />
              )} />
              {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
            </div>
            <div className="col-12 col-sm-6">
              <label className="dash-form-label">Duration (Minutes) *</label>
              <Controller name="duration" control={control} rules={{ required: 'Duration is required', min: { value: 5, message: 'Min 5 minutes' } }} render={({ field }) => (
                <input {...field} type="number" className={`form-control dash-form-control ${errors.duration ? 'is-invalid' : ''}`} />
              )} />
              {errors.duration && <div className="invalid-feedback">{errors.duration.message}</div>}
            </div>
            <div className="col-12">
              <label className="dash-form-label">Description</label>
              <Controller name="description" control={control} render={({ field }) => (
                <textarea {...field} className="form-control dash-form-control" rows={3} placeholder="Brief description of the package..." />
              )} />
            </div>
          </div>
        </form>
      </BsModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Service Package"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmText="Delete Service"
        confirmColor="error"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
      <FeedbackSnackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} />
    </DashboardLayout>
  );
}

export default AdminServices;
