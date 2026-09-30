import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockResetIcon from '@mui/icons-material/LockReset';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import SaveIcon from '@mui/icons-material/Save';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SendIcon from '@mui/icons-material/Send';

import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import DataTable from '../../components/dashboard/DataTable';
import StatusChip from '../../components/ui/StatusChip';
import FeedbackSnackbar from '../../components/ui/FeedbackSnackbar';
import { getMe, updateProfile, changePassword, requestTimeOff, fetchMyTimeOffs } from '../../services/api';

function BarberProfile({ user, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [timeOffs, setTimeOffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [submittingTimeOff, setSubmittingTimeOff] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Profile Form
  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      bio: '',
    },
  });

  // Time Off Form
  const {
    control: timeOffControl,
    handleSubmit: handleTimeOffSubmit,
    reset: resetTimeOff,
    formState: { errors: timeOffErrors },
  } = useForm({
    defaultValues: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      reason: '',
    },
  });

  // Password Form
  const {
    control: passControl,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    watch: watchPass,
    formState: { errors: passErrors },
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [meRes, timeOffRes] = await Promise.all([getMe(), fetchMyTimeOffs()]);

      if (meRes.success) {
        setProfile(meRes.user);
        resetProfile({
          name: meRes.user.name || '',
          phone: meRes.user.phone || '',
          bio: meRes.user.bio || '',
        });
      }
      if (timeOffRes.success) {
        setTimeOffs(timeOffRes.data || []);
      }
    } catch (err) {
      console.error('Error loading barber profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onProfileSave = async (data) => {
    try {
      setUpdatingProfile(true);
      const res = await updateProfile(data);
      if (res.success) {
        setSnackbar({
          open: true,
          message: 'Profile information updated successfully!',
          severity: 'success',
        });
        const updatedUser = { ...user, name: res.user.name, phone: res.user.phone };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to update profile.',
        severity: 'error',
      });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const onTimeOffSave = async (data) => {
    try {
      setSubmittingTimeOff(true);
      const res = await requestTimeOff(data);
      if (res.success) {
        setSnackbar({
          open: true,
          message: 'Time-off leave request submitted for review!',
          severity: 'success',
        });
        resetTimeOff({
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          reason: '',
        });
        loadData();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to submit time-off request.',
        severity: 'error',
      });
    } finally {
      setSubmittingTimeOff(false);
    }
  };

  const onPasswordSave = async (data) => {
    try {
      setChangingPass(true);
      const res = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (res.success) {
        setSnackbar({
          open: true,
          message: 'Password changed successfully!',
          severity: 'success',
        });
        resetPass({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to change password.',
        severity: 'error',
      });
    } finally {
      setChangingPass(false);
    }
  };

  const newPasswordValue = watchPass('newPassword');

  const timeOffColumns = [
    {
      header: 'Start Date',
      accessor: 'startDate',
    },
    {
      header: 'End Date',
      accessor: 'endDate',
    },
    {
      header: 'Reason / Note',
      accessor: 'reason',
      render: (row) => row.reason || <Typography variant="caption" color="text.disabled">—</Typography>,
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
        title="Stylist Profile & Leave Management"
        subtitle="Manage professional credentials, request time-off leaves, and configure security."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Stylist', path: '/barber' }, { label: 'Profile' }]}
      />

      {loading ? (
        <LoadingState message="Fetching workstation profile..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(212, 175, 55, 0.15)', color: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Stylist Profile Details
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Your workstation public identity and specialty qualifications.
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ mb: 3, borderColor: 'divider' }} />

                <form onSubmit={handleProfileSubmit(onProfileSave)}>
                  <Stack spacing={2.5}>
                    <TextField
                      label="Email Address"
                      value={profile?.email || ''}
                      disabled
                      fullWidth
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="Commission Rate"
                          value={`${profile?.commissionRate || 0}%`}
                          disabled
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Experience"
                          value={`${profile?.experience || 0} Years`}
                          disabled
                          fullWidth
                        />
                      </Grid>
                    </Grid>

                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Specializations
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                        {profile?.specializations?.map((spec, idx) => (
                          <Chip key={idx} label={spec} size="small" variant="outlined" color="primary" />
                        ))}
                      </Box>
                    </Box>

                    <Controller
                      name="name"
                      control={profileControl}
                      rules={{ required: 'Full name is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Full Name"
                          error={Boolean(profileErrors.name)}
                          helperText={profileErrors.name?.message}
                          fullWidth
                        />
                      )}
                    />

                    <Controller
                      name="phone"
                      control={profileControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Phone Number"
                          placeholder="+91 9876543210"
                          fullWidth
                        />
                      )}
                    />

                    <Controller
                      name="bio"
                      control={profileControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Public Bio / Stylist Experience"
                          multiline
                          rows={3}
                          placeholder="Master stylist with expertise in modern fade cuts and beard grooming..."
                          fullWidth
                        />
                      )}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={updatingProfile}
                      startIcon={
                        updatingProfile ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      sx={{ alignSelf: 'flex-start', mt: 1 }}
                    >
                      {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
                    </Button>
                  </Stack>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Time Off & Security */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {/* Time Off Request Card */}
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: 'warning.main' }}>
                      <EventBusyIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Request Time-Off Leave
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Submit unavailability dates so clients cannot book your slots.
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 2.5, borderColor: 'divider' }} />

                  <form onSubmit={handleTimeOffSubmit(onTimeOffSave)}>
                    <Stack spacing={2}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="startDate"
                            control={timeOffControl}
                            rules={{ required: 'Start date is required' }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Start Date"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={Boolean(timeOffErrors.startDate)}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="endDate"
                            control={timeOffControl}
                            rules={{ required: 'End date is required' }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="End Date"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={Boolean(timeOffErrors.endDate)}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>

                      <Controller
                        name="reason"
                        control={timeOffControl}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Reason for Leave"
                            placeholder="e.g. Vacation, family emergency, training..."
                            fullWidth
                          />
                        )}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        color="warning"
                        disabled={submittingTimeOff}
                        startIcon={
                          submittingTimeOff ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <SendIcon />
                          )
                        }
                        sx={{ alignSelf: 'flex-start' }}
                      >
                        {submittingTimeOff ? 'Submitting...' : 'Submit Leave Request'}
                      </Button>
                    </Stack>
                  </form>

                  {/* My Requested Leaves Table */}
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 3, mb: 1.5 }}>
                    My Leave Requests History
                  </Typography>
                  <DataTable
                    columns={timeOffColumns}
                    data={timeOffs}
                    emptyMessage="No time-off requests submitted yet."
                    defaultRowsPerPage={5}
                  />
                </CardContent>
              </Card>

              {/* Security & Password Card */}
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(59, 130, 246, 0.15)', color: 'info.main' }}>
                      <LockResetIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Security & Password
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Change your workstation access password.
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 2.5, borderColor: 'divider' }} />

                  <form onSubmit={handlePassSubmit(onPasswordSave)}>
                    <Stack spacing={2}>
                      <Controller
                        name="currentPassword"
                        control={passControl}
                        rules={{ required: 'Current password is required' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Current Password"
                            type="password"
                            error={Boolean(passErrors.currentPassword)}
                            helperText={passErrors.currentPassword?.message}
                            fullWidth
                          />
                        )}
                      />

                      <Controller
                        name="newPassword"
                        control={passControl}
                        rules={{
                          required: 'New password is required',
                          minLength: { value: 6, message: 'Password must be at least 6 characters' },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="New Password"
                            type="password"
                            error={Boolean(passErrors.newPassword)}
                            helperText={passErrors.newPassword?.message}
                            fullWidth
                          />
                        )}
                      />

                      <Controller
                        name="confirmPassword"
                        control={passControl}
                        rules={{
                          required: 'Please confirm password',
                          validate: (val) => val === newPasswordValue || 'Passwords do not match',
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Confirm New Password"
                            type="password"
                            error={Boolean(passErrors.confirmPassword)}
                            helperText={passErrors.confirmPassword?.message}
                            fullWidth
                          />
                        )}
                      />

                      <Button
                        type="submit"
                        variant="outlined"
                        color="primary"
                        disabled={changingPass}
                        startIcon={
                          changingPass ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <VpnKeyIcon />
                          )
                        }
                        sx={{ alignSelf: 'flex-start' }}
                      >
                        {changingPass ? 'Updating...' : 'Change Password'}
                      </Button>
                    </Stack>
                  </form>
                </CardContent>
              </Card>
            </Stack>
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

export default BarberProfile;
