import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Stack,
  Avatar,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import EditNoteIcon from '@mui/icons-material/EditNote';

import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import EmptyState from '../../components/dashboard/EmptyState';
import StatusChip from '../../components/ui/StatusChip';
import { fetchBarberAppointments } from '../../services/api';

function BarberSchedule({ user, onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchBarberAppointments({ date: selectedDate });
      if (res.success) {
        setAppointments(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setError(err.response?.data?.message || 'Failed to load schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <PageHeader
        title="My Daily Work Schedule"
        subtitle="Interactive timeline and agenda of your assigned appointments for the selected date."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Stylist', path: '/barber' }, { label: 'Schedule' }]}
      />

      {/* Date Picker Bar */}
      <Card sx={{ mb: 3.5, maxWidth: 360 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <TextField
            label="Select Schedule Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <CalendarMonthIcon sx={{ color: 'primary.main', mr: 1 }} />,
            }}
          />
        </CardContent>
      </Card>

      {/* Schedule Content */}
      {loading ? (
        <LoadingState message="Fetching your daily schedule..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadSchedule} />
      ) : appointments.length === 0 ? (
        <EmptyState
          title="No Appointments Scheduled"
          message={`You have no client bookings on ${selectedDate}. You are free during this period.`}
        />
      ) : (
        <Stack spacing={2}>
          {appointments.map((appt) => (
            <Card
              key={appt._id}
              sx={{
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2.5}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  justifyContent="space-between"
                >
                  {/* Time Badge */}
                  <Paper
                    elevation={0}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: 'rgba(212, 175, 55, 0.12)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      textAlign: 'center',
                      minWidth: 100,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" display="block">
                      Time Slot
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                      {appt.timeSlot}
                    </Typography>
                  </Paper>

                  {/* Appointment Details */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="h6" fontWeight={700} color="text.primary">
                        {appt.customer?.name || 'Client'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        (📞 {appt.customer?.phone || 'No phone registered'})
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ContentCutIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {appt.service?.name} ({appt.service?.duration} mins)
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="primary.main" fontWeight={600}>
                        ₹{appt.totalAmount || appt.service?.price || 0}
                      </Typography>
                    </Stack>

                    {appt.notes && (
                      <Box
                        sx={{
                          mt: 1.5,
                          p: 1.25,
                          borderRadius: 1.5,
                          bgcolor: 'surface.main',
                          border: '1px solid',
                          borderColor: 'divider',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <EditNoteIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                        <Typography variant="caption" color="text.secondary">
                          Notes: <Box component="span" sx={{ color: 'text.primary' }}>{appt.notes}</Box>
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Status */}
                  <Box sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}>
                    <StatusChip status={appt.status} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </DashboardLayout>
  );
}

export default BarberSchedule;
