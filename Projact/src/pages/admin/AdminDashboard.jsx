import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import DataTable from '../../components/dashboard/DataTable';
import StatusChip from '../../components/ui/StatusChip';
import EmptyState from '../../components/dashboard/EmptyState';
import { fetchAnalyticsOverview, fetchServicePopularity, fetchAllAppointments } from '../../services/api';

function AdminDashboard({ user, onLogout }) {
  const [stats, setStats] = useState(null);
  const [popularServices, setPopularServices] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [overviewRes, popularityRes, apptsRes] = await Promise.all([
        fetchAnalyticsOverview(),
        fetchServicePopularity(),
        fetchAllAppointments({ limit: 6 }),
      ]);
      if (overviewRes.success) setStats(overviewRes.data);
      if (popularityRes.success) setPopularServices(popularityRes.data?.serviceStats || []);
      if (apptsRes.success) setRecentAppointments(apptsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboardData(); }, []);

  const appointmentColumns = [
    {
      header: 'Customer',
      accessor: 'customer',
      render: (row) => (
        <div>
          <div className="fw-semibold" style={{ fontSize: '0.875rem', color: '#1a1a2e' }}>
            {row.customer?.name || 'Walk-in Client'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
            {row.customer?.phone || row.customer?.email || 'No contact'}
          </div>
        </div>
      ),
    },
    {
      header: 'Service',
      accessor: 'service',
      render: (row) => <span style={{ fontSize: '0.875rem' }}>{row.service?.name || 'Styling Package'}</span>,
    },
    {
      header: 'Stylist / Barber',
      accessor: 'barber',
      render: (row) => <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>{row.barber?.name || 'Unassigned'}</span>,
    },
    {
      header: 'Schedule',
      accessor: 'date',
      render: (row) => (
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{row.date}</div>
          <div style={{ fontSize: '0.75rem', color: '#B8860B', fontWeight: 600 }}>{row.timeSlot}</div>
        </div>
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
        title="Admin Analytics & Performance Dashboard"
        subtitle="Real-time operational summary, staff capacity, and appointment metrics."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Admin Dashboard' }]}
      />

      {loading ? (
        <LoadingState message="Fetching live metrics & analytics..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadDashboardData} />
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="row g-3 mb-4">
            {[
              { title: 'Total Customers', value: stats?.totalCustomers, icon: <i className="bi bi-people-fill" />, color: '#38BDF8' },
              { title: 'Total Staff', value: stats?.totalStaff, icon: <i className="bi bi-person-badge-fill" />, color: '#A78BFA' },
              { title: 'Total Bookings', value: stats?.totalAppointments, icon: <i className="bi bi-calendar-check-fill" />, color: '#F472B6' },
              { title: "Today's Bookings", value: stats?.todayAppointments, icon: <i className="bi bi-calendar-event-fill" />, color: '#D4AF37' },
              { title: 'Pending Review', value: stats?.pendingAppointments, icon: <i className="bi bi-hourglass-split" />, color: '#F59E0B' },
              { title: 'Total Revenue', value: `₹${stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : 0}`, icon: <i className="bi bi-currency-rupee" />, color: '#10B981' },
            ].map((card) => (
              <div key={card.title} className="col-12 col-sm-6 col-md-4 col-lg-2">
                <StatCard title={card.title} value={card.value} icon={card.icon} accentColor={card.color} />
              </div>
            ))}
          </div>

          {/* Services + Recent Appointments */}
          <div className="row g-3">
            {/* Popular Services */}
            <div className="col-12 col-lg-5">
              <div className="dash-card h-100">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-trending-up" style={{ color: '#B8860B', fontSize: '1.2rem' }} />
                  <h6 className="fw-bold mb-0">Top Performing Services</h6>
                </div>
                {popularServices.length === 0 ? (
                  <EmptyState
                    title="No Service Analytics"
                    message="Completed service revenue data will appear here."
                  />
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {popularServices.map((svc, idx) => (
                      <div
                        key={svc._id || idx}
                        className="d-flex justify-content-between align-items-center p-2 rounded-3"
                        style={{ border: '1px solid #e8e7f4', background: '#fafafa', transition: 'all 0.2s' }}
                      >
                        <div>
                          <div className="fw-semibold" style={{ fontSize: '0.875rem' }}>{svc.serviceName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{svc.category}</div>
                        </div>
                        <div className="text-end">
                          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#B8860B' }}>
                            {svc.bookings} bookings
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#198754', fontWeight: 600 }}>
                            ₹{svc.totalRevenue ? svc.totalRevenue.toLocaleString() : 0}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="col-12 col-lg-7">
              <div className="dash-card h-100">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-clock-history" style={{ color: '#B8860B', fontSize: '1.2rem' }} />
                  <h6 className="fw-bold mb-0">Recent Salon Bookings</h6>
                </div>
                <DataTable
                  columns={appointmentColumns}
                  data={recentAppointments}
                  emptyMessage="No recent appointments logged in the system."
                  defaultRowsPerPage={5}
                  rowsPerPageOptions={[5, 10]}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default AdminDashboard;
