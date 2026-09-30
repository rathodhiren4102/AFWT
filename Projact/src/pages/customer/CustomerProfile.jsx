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
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockResetIcon from '@mui/icons-material/LockReset';
import SaveIcon from '@mui/icons-material/Save';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import FeedbackSnackbar from '../../components/ui/FeedbackSnackbar';
import { getMe, updateProfile, changePassword } from '../../services/api';

function CustomerProfile({ user, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
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

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getMe();
      if (res.success) {
        setProfile(res.user);
        resetProfile({
          name: res.user.name || '',
          phone: res.user.phone || '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onProfileSave = async (data) => {
    try {
      setUpdatingProfile(true);
      const res = await updateProfile(data);
      if (res.success) {
        setSnackbar({
          open: true,
          message: 'Profile details updated successfully!',
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

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <PageHeader
        title="My Profile & Security Settings"
        subtitle="Manage your personal contact information and account login credentials."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Customer', path: '/customer' }, { label: 'Profile' }]}
      />

      {loading ? (
        <LoadingState message="Loading your account profile..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadProfile} />
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
                      Personal Details
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Your registered styling contact information.
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

          {/* Security Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
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
                      Change your password to keep your bookings secure.
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ mb: 3, borderColor: 'divider' }} />

                <form onSubmit={handlePassSubmit(onPasswordSave)}>
                  <Stack spacing={2.5}>
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
                      sx={{ alignSelf: 'flex-start', mt: 1 }}
                    >
                      {changingPass ? 'Updating...' : 'Change Password'}
                    </Button>
                  </Stack>
                </form>
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

export default CustomerProfile;
