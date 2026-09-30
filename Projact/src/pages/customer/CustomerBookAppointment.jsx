import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Stepper,
  Step,
  StepLabel,
  Avatar,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import FeedbackSnackbar from '../../components/ui/FeedbackSnackbar';
import { fetchServices, fetchBarbers, fetchAvailableSlots, createAppointment } from '../../services/api';

const STEPS = ['Select Service', 'Select Stylist', 'Choose Date & Slot', 'Review & Confirm'];

function CustomerBookAppointment({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeStep, setActiveStep] = useState(() => (location.state?.preselectedServiceId ? 1 : 0));
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);

  // Selections
  const [selectedService, setSelectedService] = useState(
    location.state?.preselectedServiceId || ''
  );

  useEffect(() => {
    if (location.state?.preselectedServiceId) {
      setSelectedService(location.state.preselectedServiceId);
      setActiveStep(1);
    }
  }, [location.state]);
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
    const loadResources = async () => {
      try {
        setLoading(true);
        setError('');
        const [svcRes, barbRes] = await Promise.all([fetchServices(), fetchBarbers()]);

        if (svcRes.success) setServices(svcRes.data || svcRes.services || []);
        if (barbRes.success) setBarbers(barbRes.data || []);
      } catch (err) {
        console.error('Failed to load booking resources:', err);
        setError(err.response?.data?.message || 'Failed to load booking options.');
      } finally {
        setLoading(false);
      }
    };

    loadResources();
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
        console.error('Failed to fetch available time slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [selectedBarber, selectedDate]);

  const handleNext = () => {
    if (activeStep === 0 && !selectedService) {
      setSnackbar({ open: true, message: 'Please select a grooming service package.', severity: 'warning' });
      return;
    }
    if (activeStep === 1 && !selectedBarber) {
      setSnackbar({ open: true, message: 'Please select your preferred stylist.', severity: 'warning' });
      return;
    }
    if (activeStep === 2 && !selectedSlot) {
      setSnackbar({ open: true, message: 'Please select an available time slot.', severity: 'warning' });
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService || !selectedBarber || !selectedDate || !selectedSlot) {
      setSnackbar({ open: true, message: 'Please complete all booking selections.', severity: 'warning' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await createAppointment({
        service: selectedService,
        barber: selectedBarber,
        date: selectedDate,
        timeSlot: selectedSlot,
        notes,
      });

      if (res.success) {
        setSnackbar({
          open: true,
          message: 'Appointment booked successfully!',
          severity: 'success',
        });
        setTimeout(() => {
          navigate('/customer/appointments');
        }, 1200);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to create appointment reservation.',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedServiceObj = services.find((s) => s._id === selectedService);
  const selectedBarberObj = barbers.find((b) => b._id === selectedBarber);

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <PageHeader
        title="Book a Grooming Experience"
        subtitle="Select your preferred hairstyle or treatment, stylist, date, and live available slot."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Customer', path: '/customer' }, { label: 'Book Appointment' }]}
      />

      {loading ? (
        <LoadingState message="Fetching available stylists & service menu..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <Grid container spacing={3.5}>
          {/* Main Stepper Card */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                {/* Stepper Header */}
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                  {STEPS.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {/* Step 0: Select Service */}
                {activeStep === 0 && (
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                      1. Select a Service Package
                    </Typography>
                    <Grid container spacing={2}>
                      {services.map((svc) => {
                        const isSelected = selectedService === svc._id;
                        return (
                          <Grid item xs={12} sm={6} key={svc._id}>
                            <Paper
                              onClick={() => setSelectedService(svc._id)}
                              elevation={0}
                              sx={{
                                p: 2.5,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                borderRadius: 2.5,
                                border: isSelected ? '2px solid' : '1px solid',
                                borderColor: isSelected ? 'primary.main' : 'divider',
                                bgcolor: isSelected ? 'rgba(184, 134, 11, 0.08)' : 'background.paper',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  bgcolor: isSelected ? 'rgba(184, 134, 11, 0.12)' : 'rgba(0, 0, 0, 0.02)',
                                },
                              }}
                            >
                              <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Typography variant="subtitle1" fontWeight={700} color={isSelected ? 'primary.main' : 'text.primary'}>
                                    {svc.name}
                                  </Typography>
                                  <Chip label={svc.category} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                                  {svc.description || 'Precision haircut and styling package.'}
                                </Typography>
                              </Box>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" fontWeight={700} color="primary.main">
                                  ₹{svc.price}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ⏱️ {svc.duration} mins
                                </Typography>
                              </Stack>
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}

                {/* Step 1: Select Stylist */}
                {activeStep === 1 && (
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                      2. Choose Your Master Stylist / Barber
                    </Typography>
                    <Grid container spacing={2}>
                      {barbers.map((b) => {
                        const isSelected = selectedBarber === b._id;
                        return (
                          <Grid item xs={12} sm={6} key={b._id}>
                            <Paper
                              onClick={() => setSelectedBarber(b._id)}
                              elevation={0}
                              sx={{
                                p: 2.5,
                                cursor: 'pointer',
                                borderRadius: 2.5,
                                border: isSelected ? '2px solid' : '1px solid',
                                borderColor: isSelected ? 'primary.main' : 'divider',
                                bgcolor: isSelected ? 'rgba(184, 134, 11, 0.08)' : 'background.paper',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  bgcolor: isSelected ? 'rgba(184, 134, 11, 0.12)' : 'rgba(0, 0, 0, 0.02)',
                                },
                              }}
                            >
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ width: 46, height: 46, bgcolor: 'primary.main', color: '#FFFFFF', fontWeight: 700 }}>
                                  {b.name ? b.name[0].toUpperCase() : 'B'}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle1" fontWeight={700} color={isSelected ? 'primary.main' : 'text.primary'}>
                                    {b.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    {b.specializations?.join(', ') || 'Barber'}
                                  </Typography>
                                  {b.experience && (
                                    <Typography variant="caption" color="primary.main" fontWeight={600}>
                                      {b.experience} Years Experience
                                    </Typography>
                                  )}
                                </Box>
                              </Stack>
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}

                {/* Step 2: Date & Available Slots */}
                {activeStep === 2 && (
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                      3. Select Date & Real-Time Time Slot
                    </Typography>

                    <Box sx={{ mb: 3, maxWidth: 320 }}>
                      <TextField
                        label="Appointment Date"
                        type="date"
                        required
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        fullWidth
                        inputProps={{ min: new Date().toISOString().split('T')[0] }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Box>

                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                      Available Live Slots for {selectedDate}:
                    </Typography>

                    {loadingSlots ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
                        <CircularProgress size={20} color="primary" />
                        <Typography variant="body2" color="text.secondary">
                          Retrieving real-time workstation availability...
                        </Typography>
                      </Box>
                    ) : availableSlots.length === 0 ? (
                      <Alert severity="warning" variant="outlined" sx={{ borderRadius: 2 }}>
                        No available slots for {selectedBarberObj?.name} on this date. Please select another date.
                      </Alert>
                    ) : (
                      <Grid container spacing={1.5}>
                        {availableSlots.map((slot) => {
                          const isSelected = selectedSlot === slot.time;
                          return (
                            <Grid item xs={4} sm={3} md={2.4} key={slot.time}>
                              <Button
                                variant={isSelected ? 'contained' : 'outlined'}
                                color={isSelected ? 'primary' : 'inherit'}
                                disabled={!slot.available}
                                onClick={() => setSelectedSlot(slot.time)}
                                fullWidth
                                sx={{
                                  py: 1.2,
                                  fontSize: '0.85rem',
                                  fontWeight: 600,
                                  textDecoration: !slot.available ? 'line-through' : 'none',
                                  opacity: !slot.available ? 0.35 : 1,
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

                {/* Step 3: Notes & Confirm */}
                {activeStep === 3 && (
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                      4. Special Requests & Review
                    </Typography>

                    <TextField
                      label="Special Instructions / Styling Notes (Optional)"
                      placeholder="e.g. skin allergies, preferred beverage, specific fade taper..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      multiline
                      rows={3}
                      fullWidth
                      sx={{ mb: 3 }}
                    />

                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2.5,
                        bgcolor: 'rgba(212, 175, 55, 0.05)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={700} color="primary.main" gutterBottom>
                        Confirmation Summary
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Service:
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedServiceObj?.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Stylist:
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedBarberObj?.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Date:
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedDate}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Time Slot:
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="primary.main">
                            {selectedSlot}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                )}

                {/* Stepper Navigation Buttons */}
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                  >
                    Back
                  </Button>

                  {activeStep < STEPS.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={submitting}
                      startIcon={
                        submitting ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <CheckCircleIcon />
                        )
                      }
                    >
                      {submitting ? 'Confirming...' : 'Confirm Reservation'}
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Summary Card */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ position: 'sticky', top: 90 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Selected Treatment
                </Typography>

                <Divider sx={{ mb: 2, borderColor: 'divider' }} />

                {selectedServiceObj ? (
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Package Name
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                        {selectedServiceObj.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedServiceObj.description}
                      </Typography>
                    </Box>

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Duration:
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        ⏱️ {selectedServiceObj.duration} Minutes
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Stylist:
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedBarberObj ? selectedBarberObj.name : 'Pending selection'}
                      </Typography>
                    </Stack>

                    <Divider sx={{ borderColor: 'divider' }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight={700}>
                        Estimated Price:
                      </Typography>
                      <Typography variant="h5" fontWeight={700} color="primary.main">
                        ₹{selectedServiceObj.price}
                      </Typography>
                    </Stack>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Choose a grooming service package to preview estimated duration and price.
                  </Typography>
                )}
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

export default CustomerBookAppointment;
