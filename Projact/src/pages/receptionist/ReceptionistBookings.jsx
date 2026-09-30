import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Divider,
  CircularProgress,
  Paper,
  Chip,
  Alert,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PersonIcon from '@mui/icons-material/Person';
import ContentCutIcon from '@mui/icons-material/ContentCut';

import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import FeedbackSnackbar from '../../components/ui/FeedbackSnackbar';
import { fetchUsers, fetchServices, fetchBarbers, fetchAvailableSlots, createAppointment } from '../../services/api';

function ReceptionistBookings({ user, onLogout }) {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);

  // Form selections
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        setLoading(true);
        setError('');
        const [custRes, svcRes, barbRes] = await Promise.all([
          fetchUsers({ role: 'Customer' }),
          fetchServices(),
          fetchBarbers(),
        ]);

        if (custRes.success) setCustomers(custRes.data || custRes.users || []);
        if (svcRes.success) setServices(svcRes.data || svcRes.services || []);
        if (barbRes.success) setBarbers(barbRes.data || []);
      } catch (err) {
        console.error('Failed to load booking resources:', err);
        setError(err.response?.data?.message || 'Failed to load booking options.');
      } finally {
        setLoading(false);
      }
    };

    loadDropdowns();
  }, []);

  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedBarber || !selectedDate) {
        setAvailableSlots([]);
        return;
      }
      try {
        setLoadingSlots(true);
        const res = await fetchAvailableSlots(selectedBarber, selectedDate);
        if (res.success) {
          setAvailableSlots(res.data || []);
          setSelectedSlot('');
        }
      } catch (err) {
        console.error('Failed to fetch available slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [selectedBarber, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedService || !selectedBarber || !selectedDate || !selectedSlot) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required booking selections including time slot.',
        severity: 'warning',
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        customer: selectedCustomer,
        service: selectedService,
        barber: selectedBarber,
        date: selectedDate,
        timeSlot: selectedSlot,
        notes,
      };

      const res = await createAppointment(payload);
      if (res.success) {
        setSnackbar({
          open: true,
          message: 'Appointment successfully created at front desk!',
          severity: 'success',
        });
        setTimeout(() => {
          navigate('/receptionist/appointments');
        }, 1200);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to create booking.',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedServiceObj = services.find((s) => s._id === selectedService);
  const selectedBarberObj = barbers.find((b) => b._id === selectedBarber);
  const selectedCustomerObj = customers.find((c) => c._id === selectedCustomer);

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <PageHeader
        title="Walk-in & Phone Reservation"
        subtitle="Book appointments dynamically using real stylist schedules and live availability."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Front Desk', path: '/receptionist' }, { label: 'New Booking' }]}
      />

      {loading ? (
        <LoadingState message="Loading client registry and service catalog..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <Grid container spacing={3.5}>
          {/* Booking Form */}
          <Grid item xs={12} lg={7}>
            <Card>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonthIcon sx={{ color: 'primary.main' }} />
                  Appointment Details
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {/* Customer Select */}
                  <FormControl fullWidth required>
                    <InputLabel id="customer-label">1. Select Registered Client</InputLabel>
                    <Select
                      labelId="customer-label"
                      value={selectedCustomer}
                      label="1. Select Registered Client"
                      onChange={(e) => setSelectedCustomer(e.target.value)}
                    >
                      {customers.map((c) => (
                        <MenuItem key={c._id} value={c._id}>
                          {c.name} ({c.email} — 📞 {c.phone || 'No phone'})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Service Select */}
                  <FormControl fullWidth required>
                    <InputLabel id="service-label">2. Select Grooming Service</InputLabel>
                    <Select
                      labelId="service-label"
                      value={selectedService}
                      label="2. Select Grooming Service"
                      onChange={(e) => setSelectedService(e.target.value)}
                    >
                      {services.map((s) => (
                        <MenuItem key={s._id} value={s._id}>
                          {s.name} — ₹{s.price} ({s.duration} mins) [{s.category}]
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Stylist & Date Grid */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel id="barber-label">3. Select Stylist</InputLabel>
                        <Select
                          labelId="barber-label"
                          value={selectedBarber}
                          label="3. Select Stylist"
                          onChange={(e) => setSelectedBarber(e.target.value)}
                        >
                          {barbers.map((b) => (
                            <MenuItem key={b._id} value={b._id}>
                              {b.name} ({b.specializations?.join(', ') || 'Barber'})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="4. Appointment Date"
                        type="date"
                        required
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        fullWidth
                        inputProps={{ min: new Date().toISOString().split('T')[0] }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>

                  {/* Time Slots Section */}
                  {selectedBarber && selectedDate && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="subtitle2" color="text.primary" fontWeight={600} sx={{ mb: 1.5 }}>
                        5. Select Time Slot *
                      </Typography>
                      {loadingSlots ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                          <CircularProgress size={20} color="primary" />
                          <Typography variant="body2" color="text.secondary">
                            Checking real-time stylist availability...
                          </Typography>
                        </Box>
                      ) : availableSlots.length === 0 ? (
                        <Alert severity="warning" variant="outlined" sx={{ borderRadius: 2 }}>
                          No available slots for this date or stylist is on leave.
                        </Alert>
                      ) : (
                        <Grid container spacing={1}>
                          {availableSlots.map((slot) => {
                            const isSelected = selectedSlot === slot.time;
                            return (
                              <Grid item xs={4} sm={3} md={2.4} key={slot.time}>
                                <Button
                                  type="button"
                                  variant={isSelected ? 'contained' : 'outlined'}
                                  color={isSelected ? 'primary' : 'inherit'}
                                  disabled={!slot.available}
                                  onClick={() => setSelectedSlot(slot.time)}
                                  fullWidth
                                  sx={{
                                    py: 1,
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    borderColor: isSelected
                                      ? 'primary.main'
                                      : slot.available
                                      ? 'divider'
                                      : 'rgba(0, 0, 0, 0.06)',
                                    bgcolor: isSelected
                                      ? 'primary.main'
                                      : slot.available
                                      ? 'background.paper'
                                      : 'transparent',
                                    color: isSelected ? '#FFFFFF' : 'text.primary',
                                    textDecoration: !slot.available ? 'line-through' : 'none',
                                    opacity: !slot.available ? 0.4 : 1,
                                  }}
                                >
                                  {slot.time}
                                </Button>
                              </Grid>
                            );
                          })}
                        </Grid>
                      )}
                    </Box>
                  )}

                  {/* Notes */}
                  <TextField
                    label="Special Front Desk Notes (Optional)"
                    placeholder="Walk-in request, skin sensitivity, requested beverages..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    multiline
                    rows={2}
                    fullWidth
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={submitting}
                    startIcon={
                      submitting ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <CheckCircleIcon />
                      )
                    }
                    sx={{ mt: 1, py: 1.3 }}
                  >
                    {submitting ? 'Confirming Reservation...' : 'Confirm Appointment Booking'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Reservation Summary Panel */}
          <Grid item xs={12} lg={5}>
            <Card sx={{ position: 'sticky', top: 90 }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Reservation Summary
                </Typography>

                <Divider sx={{ mb: 2.5, borderColor: 'divider' }} />

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Client
                    </Typography>
                    <Typography variant="body1" fontWeight={600} color={selectedCustomerObj ? 'text.primary' : 'text.disabled'}>
                      {selectedCustomerObj ? selectedCustomerObj.name : 'No client selected'}
                    </Typography>
                    {selectedCustomerObj && (
                      <Typography variant="caption" color="text.secondary">
                        {selectedCustomerObj.email}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Grooming Package
                    </Typography>
                    <Typography variant="body1" fontWeight={600} color={selectedServiceObj ? 'primary.main' : 'text.disabled'}>
                      {selectedServiceObj ? selectedServiceObj.name : 'No service chosen'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Stylist / Barber
                    </Typography>
                    <Typography variant="body2" fontWeight={500} color={selectedBarberObj ? 'text.primary' : 'text.disabled'}>
                      {selectedBarberObj ? selectedBarberObj.name : 'No stylist selected'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Scheduled Date & Time Slot
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedDate} {selectedSlot ? `@ ${selectedSlot}` : '(Slot pending)'}
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: 'divider' }} />

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Estimated Duration:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedServiceObj ? `${selectedServiceObj.duration} Minutes` : '—'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight={700}>
                      Total Estimated Fee:
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="primary.main">
                      ₹{selectedServiceObj ? selectedServiceObj.price : 0}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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

export default ReceptionistBookings;
