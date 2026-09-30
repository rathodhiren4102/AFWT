import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
  Chip,
  Avatar,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PercentIcon from '@mui/icons-material/Percent';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import DataTable from '../../components/dashboard/DataTable';
import StatusChip from '../../components/ui/StatusChip';
import FeedbackSnackbar from '../../components/ui/FeedbackSnackbar';
import { fetchBarberDashboard, updateAppointmentStatus } from '../../services/api';

function BarberDashboard({ user, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchBarberDashboard();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch barber dashboard:', err);
      setError(err.response?.data?.message || 'Failed to load barber dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingId(id);
      const res = await updateAppointmentStatus(id, status);
      if (res.success) {
        setSnackbar({
          open: true,
          message: `Appointment updated to "${status}"!`,
          severity: 'success',
        });
        loadDashboard();
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

  const todayColumns = [
    {
      header: 'Time Slot',
      accessor: 'timeSlot',
      render: (row) => (
        <Chip
          icon={<AccessTimeIcon sx={{ fontSize: '14px !important' }} />}
          label={row.timeSlot}
          size="small"
          sx={{ bgcolor: 'rgba(212, 175, 55, 0.12)', color: 'primary.main', fontWeight: 700 }}
        />
      ),
    },
    {
      header: 'Client Name',
      accessor: 'customer',
      render: (row) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'rgba(212, 175, 55, 0.15)',
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '0.8rem',
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
          <Typography variant="caption" color="text.secondary">
            ⏱️ {row.service?.duration || 30} mins
          </Typography>
        </Box>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      header: 'Workstation Action',
      accessor: '_id',
      align: 'right',
      render: (row) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          {row.status === 'Confirmed' && (
            <Button
              size="small"
              variant="contained"
              color="info"
              disabled={updatingId === row._id}
              startIcon={<PlayArrowIcon />}
              onClick={() => handleStatusUpdate(row._id, 'In Progress')}
            >
              Start Service
            </Button>
          )}
          {row.status === 'In Progress' && (
            <Button
              size="small"
              variant="contained"
              color="success"
              disabled={updatingId === row._id}
              startIcon={<DoneAllIcon />}
              onClick={() => handleStatusUpdate(row._id, 'Completed')}
            >
              Complete
            </Button>
          )}
        </Stack>
      ),
    },
  ];

  const upcomingColumns = [
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => (
        <Typography variant="body2" fontWeight={600}>
          {row.date}
        </Typography>
      ),
    },
    {
      header: 'Time Slot',
      accessor: 'timeSlot',
      render: (row) => (
        <Typography variant="body2" color="primary.main">
          {row.timeSlot}
        </Typography>
      ),
    },
    {
      header: 'Client',
      accessor: 'customer',
      render: (row) => row.customer?.name || 'Client',
    },
    {
      header: 'Service',
      accessor: 'service',
      render: (row) => row.service?.name,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusChip status={row.status} />,
    },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <PageHeader
        title="Stylist Workstation Dashboard"
        subtitle="Today's live clients queue, service workstation progress, and commission earnings."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Stylist Workstation' }]}
      />

      {loading ? (
        <LoadingState message="Loading your workstation queue..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadDashboard} />
      ) : (
        <>
          {/* Workstation Metrics */}
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Today's Appointments"
                value={data?.todayAppointments?.length || 0}
                icon={<EventAvailableIcon />}
                accentColor="#D4AF37"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completed Clients"
                value={data?.totalCompleted || 0}
                icon={<CheckCircleIcon />}
                accentColor="#10B981"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="This Month's Earnings"
                value={`₹${data?.monthlyEarnings?.totalEarnings ? data.monthlyEarnings.totalEarnings.toLocaleString() : 0}`}
                icon={<MonetizationOnIcon />}
                accentColor="#38BDF8"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Commission Rate"
                value={`${data?.commissionRate || 0}%`}
                icon={<PercentIcon />}
                accentColor="#F59E0B"
              />
            </Grid>
          </Grid>

          {/* Today's Client Queue */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Today's Scheduled Clients
              </Typography>
              <DataTable
                columns={todayColumns}
                data={data?.todayAppointments || []}
                emptyMessage="You have no appointments scheduled for today."
                defaultRowsPerPage={5}
              />
            </CardContent>
          </Card>

          {/* Upcoming Bookings */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Upcoming Future Bookings
              </Typography>
              <DataTable
                columns={upcomingColumns}
                data={data?.upcomingAppointments || []}
                emptyMessage="No future appointments assigned at this time."
                defaultRowsPerPage={5}
              />
            </CardContent>
          </Card>
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

export default BarberDashboard;
