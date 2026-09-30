import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminAppointments from '../pages/admin/AdminAppointments';
import AdminStaff from '../pages/admin/AdminStaff';
import AdminCustomers from '../pages/admin/AdminCustomers';
import AdminServices from '../pages/admin/AdminServices';
import AdminProfile from '../pages/admin/AdminProfile';

// Receptionist Pages
import ReceptionistDashboard from '../pages/receptionist/ReceptionistDashboard';
import ReceptionistAppointments from '../pages/receptionist/ReceptionistAppointments';
import ReceptionistBookings from '../pages/receptionist/ReceptionistBookings';
import ReceptionistCustomers from '../pages/receptionist/ReceptionistCustomers';
import ReceptionistProfile from '../pages/receptionist/ReceptionistProfile';

// Customer Pages
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import CustomerBookAppointment from '../pages/customer/CustomerBookAppointment';
import CustomerAppointments from '../pages/customer/CustomerAppointments';
import CustomerServices from '../pages/customer/CustomerServices';
import CustomerProfile from '../pages/customer/CustomerProfile';

// Barber Pages
import BarberDashboard from '../pages/barber/BarberDashboard';
import BarberAppointments from '../pages/barber/BarberAppointments';
import BarberSchedule from '../pages/barber/BarberSchedule';
import BarberClients from '../pages/barber/BarberClients';
import BarberProfile from '../pages/barber/BarberProfile';

import ProtectedRoute, { PublicOnlyRoute } from '../components/ProtectedRoute';
import { getRolePath } from '../utils/role';

function DashboardRedirect() {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  if (userStr && token) {
    try {
      const user = JSON.parse(userStr);
      const targetPath = getRolePath(user.role);
      return <Navigate to={targetPath} replace />;
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
  return <Navigate to="/login" replace />;
}

function AppRoutes({ user, onLogin, onLogout }) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin', 'receptionist', 'barber']}>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route path="/dashboard" element={<DashboardRedirect />} />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login onLogin={onLogin} />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      {/* Admin Panel Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAppointments user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/staff"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminStaff user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/customers"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCustomers user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminServices user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminProfile user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />

      {/* Receptionist Panel Routes */}
      <Route
        path="/receptionist"
        element={
          <ProtectedRoute allowedRoles={['receptionist']}>
            <ReceptionistDashboard user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/appointments"
        element={
          <ProtectedRoute allowedRoles={['receptionist']}>
            <ReceptionistAppointments user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/book"
        element={
          <ProtectedRoute allowedRoles={['receptionist']}>
            <ReceptionistBookings user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/customers"
        element={
          <ProtectedRoute allowedRoles={['receptionist']}>
            <ReceptionistCustomers user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/profile"
        element={
          <ProtectedRoute allowedRoles={['receptionist']}>
            <ReceptionistProfile user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />

      {/* Customer Panel Routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/book"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerBookAppointment user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/appointments"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerAppointments user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/services"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerServices user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerProfile user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />

      {/* Barber / Stylist Panel Routes */}
      <Route
        path="/barber"
        element={
          <ProtectedRoute allowedRoles={['barber']}>
            <BarberDashboard user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/barber/appointments"
        element={
          <ProtectedRoute allowedRoles={['barber']}>
            <BarberAppointments user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/barber/schedule"
        element={
          <ProtectedRoute allowedRoles={['barber']}>
            <BarberSchedule user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/barber/clients"
        element={
          <ProtectedRoute allowedRoles={['barber']}>
            <BarberClients user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/barber/profile"
        element={
          <ProtectedRoute allowedRoles={['barber']}>
            <BarberProfile user={user} onLogout={onLogout} />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
