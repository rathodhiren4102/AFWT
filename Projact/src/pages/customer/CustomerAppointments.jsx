import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  MenuItem,
  Grid,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/dashboard/DataTable';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import StatusChip from '../../components/ui/StatusChip';
import FeedbackSnackbar from '../../components/ui/FeedbackSnackbar';
import { fetchMyAppointments, cancelAppointment } from '../../services/api';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

function CustomerAppointments({ user, onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Cancel Dialog state
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Snackbar feedback state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await fetchMyAppointments(params);
      if (res.success) {
        setAppointments(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching customer appointments:', err);
      setError(err.response?.data?.message || 'Failed to load your appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    try {
      setCancelling(true);
      const res = await cancelAppointment(cancelTarget._id, cancelReason);
      if (res.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === cancelTarget._id ? { ...a, status: 'Cancelled' } : a))
        );
        setSnackbar({
          open: true,
          message: 'Appointment successfully cancelled.',
          severity: 'success',
        });
        setCancelTarget(null);
        setCancelReason('');
        loadAppointments();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to cancel appointment.',
        severity: 'error',
      });
    } finally {
      setCancelling(false);
    }
  };

  const columns = [
    {
      header: 'Scheduled Date & Time',
      accessor: 'date',
      render: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {row.date}
          </Typography>
          <Typography variant="caption" color="primary.main" fontWeight={600}>
            @{row.timeSlot}
          </Typography>
        </Box>
      ),
    },
    {
      header: 'Service Package',
      accessor: 'service',
      render: (row) => (
        <Typography variant="body2" fontWeight={600}>
          {row.service?.name || 'Styling'}
        </Typography>
      ),
    },
    {
      header: 'Stylist / Barber',
      accessor: 'barber',
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.barber?.name || 'Assigned Stylist'}
        </Typography>
      ),
    },
    {
      header: 'Total Price',
      accessor: 'totalAmount',
      render: (row) => (
        <Typography variant="body2" fontWeight={700} color="primary.main">
          ₹{row.totalAmount || row.service?.price}
        </Typography>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      header: 'Action',
      accessor: '_id',
      align: 'right',
      render: (row) =>
        row.status !== 'Cancelled' && row.status !== 'Completed' ? (
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<CancelIcon fontSize="small" />}
            onClick={() => setCancelTarget(row)}
          >
            Cancel
          </Button>
        ) : null,
    },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <PageHeader
        title="My Grooming Appointments"
        subtitle="Review booking history, manage reservations, and check status."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Customer', path: '/customer' }, { label: 'Appointments' }]}
      />

      {/* Filter Toolbar */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <FormControl size="small" sx={{ maxWidth: 280, width: '100%' }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filter by Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              {STATUS_OPTIONS.map((st) => (
                <MenuItem key={st} value={st}>
                  {st}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      {loading ? (
        <LoadingState message="Loading your appointments..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadAppointments} />
      ) : (
        <DataTable
          columns={columns}
          data={appointments}
          emptyMessage="You have no appointments on record for this filter."
        />
      )}

      {/* Cancellation Dialog with Reason */}
      <Dialog
        open={Boolean(cancelTarget)}
        onClose={() => !cancelling && setCancelTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Cancel Appointment</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <DialogContentText sx={{ mb: 2, color: 'text.secondary' }}>
            Are you sure you want to cancel your appointment for{' '}
            <strong>{cancelTarget?.service?.name}</strong> on <strong>{cancelTarget?.date} @ {cancelTarget?.timeSlot}</strong>?
          </DialogContentText>
          <TextField
            label="Reason for cancellation (optional)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setCancelTarget(null)} disabled={cancelling} color="inherit">
            Keep Appointment
          </Button>
          <Button
            onClick={handleCancelConfirm}
            disabled={cancelling}
            variant="contained"
            color="error"
            startIcon={cancelling && <CircularProgress size={16} color="inherit" />}
          >
            {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </DashboardLayout>
  );
}

export default CustomerAppointments;
