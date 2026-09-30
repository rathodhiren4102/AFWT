import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
  Avatar,
  Paper,
  Chip,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import DataTable from '../../components/dashboard/DataTable';
import StatusChip from '../../components/ui/StatusChip';
import EmptyState from '../../components/dashboard/EmptyState';
import { fetchCustomerDashboard } from '../../services/api';

function CustomerDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchCustomerDashboard();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load customer dashboard:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const upcoming = data?.upcomingAppointments || [];
  const nextAppt = upcoming.length > 0 ? upcoming[0] : null;

  const appointmentColumns = [
    {
      header: 'Date & Time',
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
      render: (row) => row.service?.name || 'Styling Package',
    },
    {
      header: 'Assigned Stylist',
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
          ₹{row.totalAmount || row.service?.price || 0}
        </Typography>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      align: 'right',
      render: (row) => <StatusChip status={row.status} />,
    },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <PageHeader
        title={`Welcome back, ${user?.name || 'Customer'}`}
        subtitle="Manage your personal grooming reservations, track bookings, and reserve new slots."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'My Dashboard' }]}
        actionLabel="Book Appointment"
        actionIcon={<AddIcon />}
        onAction={() => navigate('/customer/book')}
      />

      {loading ? (
        <LoadingState message="Loading your styling overview..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <>
          {/* Summary Grid */}
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Total Styling Bookings"
                value={data?.totalAppointments || 0}
                icon={<CalendarMonthIcon />}
                accentColor="#38BDF8"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Next Upcoming Session"
                value={nextAppt ? `${nextAppt.date}` : 'No upcoming booking'}
                subtitle={nextAppt ? `Slot: ${nextAppt.timeSlot} • ${nextAppt.service?.name}` : 'Reserve your next cut now!'}
                icon={<EventAvailableIcon />}
                accentColor="#D4AF37"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Total Spent on Services"
                value={`₹${data?.totalSpent ? data.totalSpent.toLocaleString() : 0}`}
                icon={<MonetizationOnIcon />}
                accentColor="#10B981"
              />
            </Grid>
          </Grid>

          {/* Upcoming Appointments */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                <Typography variant="h6" fontWeight={700}>
                  Upcoming Grooming Appointments
                </Typography>
                <Button
                  component={RouterLink}
                  to="/customer/appointments"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  View All Appointments
                </Button>
              </Stack>

              <DataTable
                columns={appointmentColumns}
                data={upcoming}
                emptyMessage="You have no upcoming appointments scheduled. Reserve one now!"
                defaultRowsPerPage={5}
              />
            </CardContent>
          </Card>

          {/* Frequently Booked Services */}
          {data?.favoriteServices && data.favoriteServices.length > 0 && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
                  Your Most Frequently Booked Treatments
                </Typography>
                <Grid container spacing={2}>
                  {data.favoriteServices.map((fav) => (
                    <Grid item xs={12} sm={6} md={4} key={fav._id}>
                      <Paper
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
                            {fav.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {fav.category}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${fav.bookings} times`}
                          size="small"
                          sx={{ bgcolor: 'rgba(212, 175, 55, 0.12)', color: 'primary.main', fontWeight: 700 }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export default CustomerDashboard;
