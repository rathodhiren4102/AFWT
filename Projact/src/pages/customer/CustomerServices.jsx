import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import EmptyState from '../../components/dashboard/EmptyState';
import { fetchServices } from '../../services/api';

const CATEGORIES = [
  'Haircut',
  'Beard Styling',
  'Hair Coloring',
  'Facial',
  'Spa',
  'Massage',
  'Manicure',
  'Pedicure',
  'Other',
];

function CustomerServices({ user, onLogout }) {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const loadServices = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchServices();
      if (res.success) {
        setServices(res.data || res.services || []);
      }
    } catch (err) {
      console.error('Failed to fetch services menu:', err);
      setError(err.response?.data?.message || 'Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleBookService = (svc) => {
    navigate('/customer/book', { state: { preselectedServiceId: svc._id } });
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? s.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <PageHeader
        title="Services & Grooming Packages"
        subtitle="Explore our curated catalog of precision hair, beard grooming, skin treatments, and spa packages."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Customer', path: '/customer' }, { label: 'Services Menu' }]}
      />

      {/* Filter / Search Toolbar */}
      <Card sx={{ mb: 3.5 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                placeholder="Search haircuts, facials, beard styling..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Filter Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="">All Service Categories</MenuItem>
                  {CATEGORIES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Service Cards Grid */}
      {loading ? (
        <LoadingState message="Loading service packages..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadServices} />
      ) : filteredServices.length === 0 ? (
        <EmptyState
          title="No Services Found"
          message="No grooming packages match your search filters."
        />
      ) : (
        <Grid container spacing={3}>
          {filteredServices.map((svc) => (
            <Grid item xs={12} sm={6} md={4} key={svc._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ fontSize: '1.1rem' }}>
                      {svc.name}
                    </Typography>
                    <Chip
                      label={svc.category}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(212, 175, 55, 0.12)',
                        color: 'primary.main',
                        fontWeight: 600,
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                      }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      minHeight: 45,
                      mb: 2.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {svc.description || 'Master artisan grooming, hot towel refresh, and premium product application.'}
                  </Typography>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                      <CurrencyRupeeIcon sx={{ fontSize: 20 }} />
                      <Typography variant="h5" fontWeight={700} color="primary.main">
                        {svc.price}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2" fontWeight={600}>
                        {svc.duration} mins
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>

                <Divider sx={{ borderColor: 'divider' }} />

                <CardActions sx={{ p: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<BookmarkBorderIcon />}
                    onClick={() => handleBookService(svc)}
                  >
                    Book This Service
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </DashboardLayout>
  );
}

export default CustomerServices;
