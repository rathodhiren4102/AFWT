import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Stack,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';

import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/dashboard/DataTable';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import { fetchBarberAppointments } from '../../services/api';

function BarberClients({ user, onLogout }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Client Details Dialog
  const [selectedClient, setSelectedClient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const loadBarberClients = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchBarberAppointments();
      if (res.success) {
        const appts = res.data || [];
        // Group by customer ID
        const clientMap = {};
        appts.forEach((a) => {
          const cust = a.customer;
          if (!cust || !cust._id) return;
          if (!clientMap[cust._id]) {
            clientMap[cust._id] = {
              _id: cust._id,
              name: cust.name,
              phone: cust.phone || 'N/A',
              email: cust.email || '',
              totalBookings: 1,
              lastVisit: a.date,
              appointments: [a],
            };
          } else {
            clientMap[cust._id].totalBookings += 1;
            clientMap[cust._id].appointments.push(a);
            if (a.date > clientMap[cust._id].lastVisit) {
              clientMap[cust._id].lastVisit = a.date;
            }
          }
        });
        setClients(Object.values(clientMap));
      }
    } catch (err) {
      console.error('Failed to load client history:', err);
      setError(err.response?.data?.message || 'Failed to load client records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBarberClients();
  }, []);

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setOpenDialog(true);
  };

  const filtered = clients.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: 'Client Name',
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
              {row.email}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      header: 'Phone Number',
      accessor: 'phone',
      render: (row) => row.phone || <Typography variant="caption" color="text.disabled">—</Typography>,
    },
    {
      header: 'Total Styling Visits',
      accessor: 'totalBookings',
      render: (row) => (
        <Chip
          label={`${row.totalBookings} visit${row.totalBookings > 1 ? 's' : ''}`}
          size="small"
          sx={{
            bgcolor: 'rgba(212, 175, 55, 0.12)',
            color: 'primary.main',
            fontWeight: 700,
          }}
        />
      ),
    },
    {
      header: 'Most Recent Appointment',
      accessor: 'lastVisit',
      render: (row) => (
        <Typography variant="body2" fontWeight={500}>
          {row.lastVisit || 'N/A'}
        </Typography>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      align: 'right',
      render: (row) => (
        <Tooltip title="View Visit History">
          <IconButton size="small" onClick={() => handleViewClient(row)} color="primary">
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <PageHeader
        title="My Client Directory"
        subtitle="List of clients who have booked styling appointments with your workstation."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Stylist', path: '/barber' }, { label: 'Clients' }]}
      />

      {/* Search Toolbar */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <TextField
            placeholder="Search clients by name, phone, or email..."
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
        <LoadingState message="Compiling client history..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadBarberClients} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="No clients found in your booking history."
        />
      )}

      {/* Client Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main', color: '#FFFFFF' }}>
            <PersonIcon />
          </Avatar>
          Client Styling History
        </DialogTitle>
        <DialogContent dividers sx={{ py: 2 }}>
          {selectedClient && (
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Client Name
                </Typography>
                <Typography variant="body1" fontWeight={700}>
                  {selectedClient.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  📞 {selectedClient.phone} • ✉️ {selectedClient.email}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Appointments Logged ({selectedClient.appointments?.length || 0})
                </Typography>
                <Stack spacing={1}>
                  {selectedClient.appointments?.map((appt) => (
                    <Box
                      key={appt._id}
                      sx={{
                        p: 1.5,
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
                          {appt.service?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {appt.date} @ {appt.timeSlot}
                        </Typography>
                      </Box>
                      <Chip
                        label={appt.status}
                        size="small"
                        color={appt.status === 'Completed' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenDialog(false)} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default BarberClients;
