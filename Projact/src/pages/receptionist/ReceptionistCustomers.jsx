import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';

import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/dashboard/DataTable';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import FeedbackSnackbar from '../../components/ui/FeedbackSnackbar';
import { fetchUsers, registerUser } from '../../services/api';

function ReceptionistCustomers({ user, onLogout }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Dialog state
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchUsers({ role: 'Customer' });
      if (res.success) {
        setCustomers(res.data || res.users || []);
      }
    } catch (err) {
      console.error('Error fetching receptionist customers:', err);
      setError(err.response?.data?.message || 'Failed to load customer list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleOpenAdd = () => {
    reset({
      name: '',
      email: '',
      phone: '',
      password: '',
    });
    setOpenAddDialog(true);
  };

  const handleOpenView = (cust) => {
    setViewCustomer(cust);
    setOpenViewDialog(true);
  };

  const onAddSubmit = async (data) => {
    try {
      setSubmitting(true);
      const res = await registerUser(
        data.name,
        data.email,
        data.password || 'Customer@123',
        'Customer',
        data.phone
      );
      if (res.success || res.token) {
        setSnackbar({
          open: true,
          message: `Customer ${data.name} registered successfully!`,
          severity: 'success',
        });
        setOpenAddDialog(false);
        loadCustomers();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to register customer.',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  const columns = [
    {
      header: 'Customer Name',
      accessor: 'name',
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
            {row.name ? row.name[0].toUpperCase() : 'C'}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {row._id ? row._id.substring(row._id.length - 6) : 'N/A'}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      header: 'Email Address',
      accessor: 'email',
    },
    {
      header: 'Phone Number',
      accessor: 'phone',
      render: (row) => row.phone || <Typography variant="caption" color="text.disabled">—</Typography>,
    },
    {
      header: 'Registration Date',
      accessor: 'createdAt',
      render: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'),
    },
    {
      header: 'Actions',
      accessor: '_id',
      align: 'right',
      render: (row) => (
        <Tooltip title="View Profile Details">
          <IconButton size="small" onClick={() => handleOpenView(row)} color="primary">
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <PageHeader
        title="Front Desk Client Directory"
        subtitle="Lookup registered salon customers, phone numbers, and register walk-in clients."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Front Desk', path: '/receptionist' }, { label: 'Customers' }]}
        actionLabel="Register Walk-in Client"
        actionIcon={<PersonAddIcon />}
        onAction={handleOpenAdd}
      />

      {/* Search Toolbar */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <TextField
            placeholder="Search by customer name, email, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={{ maxWidth: 450 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Main Table */}
      {loading ? (
        <LoadingState message="Loading front desk client directory..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadCustomers} />
      ) : (
        <DataTable
          columns={columns}
          data={filteredCustomers}
          emptyMessage="No customer records found matching your query."
        />
      )}

      {/* Register Customer Dialog */}
      <Dialog open={openAddDialog} onClose={() => !submitting && setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddIcon sx={{ color: 'primary.main' }} />
          Register Walk-in Client
        </DialogTitle>
        <form onSubmit={handleSubmit(onAddSubmit)}>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Full name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  placeholder="e.g. Arjun Kapoor"
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address format',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email Address"
                  type="email"
                  placeholder="client@example.com"
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
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
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Initial Password (Optional)"
                  type="password"
                  placeholder="Defaults to Customer@123"
                  helperText="Leave blank for automatic default password"
                  fullWidth
                />
              )}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpenAddDialog(false)} disabled={submitting} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              startIcon={submitting && <CircularProgress size={16} color="inherit" />}
            >
              {submitting ? 'Registering...' : 'Register Customer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Customer Details Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main', color: '#FFFFFF' }}>
            <PersonIcon />
          </Avatar>
          Client Profile
        </DialogTitle>
        <DialogContent dividers sx={{ py: 2 }}>
          {viewCustomer && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Customer Name
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {viewCustomer.name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body2">{viewCustomer.email}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body2">{viewCustomer.phone || 'No phone registered'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Registered Date
                </Typography>
                <Typography variant="body2">
                  {viewCustomer.createdAt ? new Date(viewCustomer.createdAt).toLocaleString() : 'N/A'}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenViewDialog(false)} variant="contained" color="primary">
            Close
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

export default ReceptionistCustomers;
