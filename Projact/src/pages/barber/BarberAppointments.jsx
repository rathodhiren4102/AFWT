import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Stack,
  MenuItem,
  Grid,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/dashboard/DataTable';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import FeedbackSnackbar from '../../components/ui/FeedbackSnackbar';
import { fetchBarberAppointments, updateAppointmentStatus } from '../../services/api';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

function BarberAppointments({ user, onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Snackbar feedback state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;

      const res = await fetchBarberAppointments(params);
      if (res.success) {
        setAppointments(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching barber appointments:', err);
      setError(err.response?.data?.message || 'Failed to load your appointments schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, dateFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      const res = await updateAppointmentStatus(id, status);
      if (res.success) {
        setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
        setSnackbar({
          open: true,
          message: `Appointment status updated to ${status}.`,
          severity: 'success',
        });
        loadAppointments();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to update status.',
        severity: 'error',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('');
    setDateFilter('');
    setSearch('');
  };

  const filteredAppointments = appointments.filter((a) => {
    const custName = a.customer?.name?.toLowerCase() || '';
    const svcName = a.service?.name?.toLowerCase() || '';
    const query = search.toLowerCase();
    return custName.includes(query) || svcName.includes(query);
  });

  const columns = [
    {
      header: 'Client Details',
      accessor: 'customer',
      render: (row) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'rgba(212, 175, 55, 0.15)',
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            {row.customer?.name ? row.customer.name[0].toUpperCase() : 'C'}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {row.customer?.name || 'Client'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              📞 {row.customer?.phone || 'No phone'}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      header: 'Service Requested',
      accessor: 'service',
      render: (row) => (
        <Box>
          <Typography variant="body2">{row.service?.name}</Typography>
          <Typography variant="caption" color="primary.main" fontWeight={600}>
            ₹{row.service?.price || 0} • {row.service?.duration || 30} mins
          </Typography>
        </Box>
      ),
    },
    {
      header: 'Date & Time',
      accessor: 'date',
      render: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {row.date}
          </Typography>
          <Typography variant="caption" color="primary.main" fontWeight={600}>
            @{row.timeSlot}
          </Typography>
        </Box>
      ),
    },
    {
      header: 'Service Status',
      accessor: 'status',
      render: (row) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={row.status}
              disabled={updatingId === row._id}
              onChange={(e) => handleStatusChange(row._id, e.target.value)}
              sx={{
                fontSize: '0.825rem',
                fontWeight: 600,
                color:
                  row.status === 'Completed'
                    ? 'success.main'
                    : row.status === 'Confirmed'
                    ? 'primary.main'
                    : row.status === 'In Progress'
                    ? 'info.main'
                    : row.status === 'Cancelled'
                    ? 'error.main'
                    : 'warning.main',
              }}
            >
              {STATUS_OPTIONS.map((st) => (
                <MenuItem key={st} value={st} sx={{ fontSize: '0.825rem', fontWeight: 500 }}>
                  {st}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {updatingId === row._id && <CircularProgress size={16} color="primary" />}
        </Stack>
      ),
    },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <PageHeader
        title="My Client Appointments"
        subtitle="Review assigned styling appointments, manage clients, and update service progress in real-time."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Stylist', path: '/barber' }, { label: 'Appointments' }]}
      />

      {/* Filter / Search Toolbar */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                placeholder="Search by client or service name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Filter Status"
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
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Filter Date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {(statusFilter || dateFilter || search) && (
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  variant="text"
                  color="inherit"
                  startIcon={<FilterAltOffIcon />}
                  onClick={handleResetFilters}
                  fullWidth
                >
                  Clear Filters
                </Button>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Main Table */}
      {loading ? (
        <LoadingState message="Loading your appointments..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadAppointments} />
      ) : (
        <DataTable
          columns={columns}
          data={filteredAppointments}
          emptyMessage="No appointments matched your query or filter criteria."
        />
      )}

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

export default BarberAppointments;
