import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Stack,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import DataTable from '../../components/dashboard/DataTable';
import StatusChip from '../../components/ui/StatusChip';
import EmptyState from '../../components/dashboard/EmptyState';
import FeedbackSnackbar from '../../components/ui/FeedbackSnackbar';
import { fetchReceptionistDashboard, updateAppointmentStatus } from '../../services/api';

function ReceptionistDashboard({ user, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmingId, setConfirmingId] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchReceptionistDashboard();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load receptionist dashboard:', err);
      setError(err.response?.data?.message || 'Failed to load front desk data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickConfirm = async (id) => {
    try {
      setConfirmingId(id);
      const res = await updateAppointmentStatus(id, 'Confirmed');
      if (res.success) {
        setSnackbar({
          open: true,
          message: 'Appointment confirmed successfully!',
          severity: 'success',
        });
        loadData();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to confirm appointment.',
        severity: 'error',
      });
    } finally {
      setConfirmingId(null);
    }
  };

  const appointmentColumns = [
    {
      header: 'Customer',
      accessor: 'customer',
      render: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {row.customer?.name || 'Walk-in Client'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            📞 {row.customer?.phone || 'No phone'}
          </Typography>
        </Box>
      ),
    },
    {
      header: 'Service',
      accessor: 'service',
      render: (row) => row.service?.name || 'Service',
    },
    {
      header: 'Stylist / Barber',
      accessor: 'barber',
      render: (row) => row.barber?.name || 'Unassigned',
    },
    {
      header: 'Time Slot',
      accessor: 'timeSlot',
      render: (row) => (
        <Chip
          icon={<AccessTimeIcon sx={{ fontSize: '14px !important' }} />}
          label={row.timeSlot}
          size="small"
          sx={{ bgcolor: 'rgba(212, 175, 55, 0.12)', color: 'primary.main', fontWeight: 600 }}
        />
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
        row.status === 'Pending' ? (
          <Button
            size="small"
            variant="contained"
            color="primary"
            disabled={confirmingId === row._id}
            startIcon={<CheckCircleIcon />}
            onClick={() => handleQuickConfirm(row._id)}
          >
            Confirm
          </Button>
        ) : null,
    },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <PageHeader
        title="Front Desk & Reception Command"
        subtitle="Daily desk overview, walk-in check-in status, and real-time appointment arrivals."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Front Desk' }]}
      />

      {loading ? (
        <LoadingState message="Connecting to front desk terminal..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <>
          {/* Summary Grid */}
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Today's Appointments"
                value={data?.todayCount || 0}
                icon={<EventAvailableIcon />}
                accentColor="#D4AF37"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Confirmation"
                value={data?.pendingCount || 0}
                icon={<HourglassEmptyIcon />}
                accentColor="#F59E0B"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Active On-Duty Barbers"
                value={data?.availableBarbers?.length || 0}
                icon={<ContentCutIcon />}
                accentColor="#38BDF8"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Recent Client Registrations"
                value={data?.recentCustomers?.length || 0}
                icon={<PeopleIcon />}
                accentColor="#10B981"
              />
            </Grid>
          </Grid>

          {/* Today's Appointments Table */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Today's Scheduled Appointments
              </Typography>
              <DataTable
                columns={appointmentColumns}
                data={data?.todayAppointments || []}
                emptyMessage="No appointments scheduled for today yet."
                defaultRowsPerPage={5}
              />
            </CardContent>
          </Card>

          {/* Active Stylists & Pending Approvals */}
          <Grid container spacing={3}>
            {/* Active Stylists */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Active Stylists On-Duty
                  </Typography>

                  {!data?.availableBarbers || data.availableBarbers.length === 0 ? (
                    <EmptyState
                      title="No Barbers Active"
                      message="No barbers are currently on shift for today."
                    />
                  ) : (
                    <Stack spacing={1.5}>
                      {data.availableBarbers.map((b) => (
                        <Paper
                          key={b._id}
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ bgcolor: 'primary.main', color: '#FFFFFF', fontWeight: 700 }}>
                              {b.name ? b.name[0].toUpperCase() : 'B'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {b.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {b.specializations?.join(', ') || 'Barber'}
                              </Typography>
                            </Box>
                          </Stack>
                          <Chip
                            label={`${b.workingHours?.start || '09:00'} - ${b.workingHours?.end || '18:00'}`}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Pending Approvals */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Pending Client Check-ins
                  </Typography>

                  {!data?.pendingAppointments || data.pendingAppointments.length === 0 ? (
                    <EmptyState
                      title="All Caught Up!"
                      message="No pending appointments requiring immediate check-in or confirmation."
                    />
                  ) : (
                    <Stack spacing={1.5}>
                      {data.pendingAppointments.map((appt) => (
                        <Paper
                          key={appt._id}
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {appt.customer?.name || 'Walk-in Client'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {appt.service?.name} on {appt.date} @ {appt.timeSlot}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            disabled={confirmingId === appt._id}
                            onClick={() => handleQuickConfirm(appt._id)}
                          >
                            Confirm
                          </Button>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
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

export default ReceptionistDashboard;
