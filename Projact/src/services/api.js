import axios from 'axios';

// Axios configuration with backend base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to attach JWT token from localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const loginUser = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (name, email, password, role = 'Customer', phone = '') => {
  const response = await API.post('/auth/register', { name, email, password, role, phone });
  return response.data;
};

export const getMe = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put('/auth/profile', profileData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await API.put('/auth/change-password', passwordData);
  return response.data;
};

// Dashboard Endpoints
export const fetchCustomerDashboard = async () => {
  const response = await API.get('/dashboard/customer');
  return response.data;
};

export const fetchBarberDashboard = async () => {
  const response = await API.get('/dashboard/barber');
  return response.data;
};

export const fetchReceptionistDashboard = async () => {
  const response = await API.get('/dashboard/receptionist');
  return response.data;
};

// Analytics Endpoints (Admin)
export const fetchAnalyticsOverview = async () => {
  const response = await API.get('/analytics/overview');
  return response.data;
};

export const fetchRevenueAnalytics = async (year) => {
  const response = await API.get('/analytics/revenue', { params: { year } });
  return response.data;
};

export const fetchServicePopularity = async () => {
  const response = await API.get('/analytics/service-popularity');
  return response.data;
};

export const fetchStaffPerformance = async (month, year) => {
  const response = await API.get('/analytics/staff-performance', { params: { month, year } });
  return response.data;
};

// Services Endpoints
export const fetchServices = async () => {
  const response = await API.get('/services');
  return response.data;
};

export const createService = async (serviceData) => {
  const response = await API.post('/services', serviceData);
  return response.data;
};

export const updateService = async (id, serviceData) => {
  const response = await API.put(`/services/${id}`, serviceData);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await API.delete(`/services/${id}`);
  return response.data;
};

// Staff Endpoints
export const fetchStaff = async () => {
  const response = await API.get('/staff');
  return response.data;
};

export const createStaff = async (staffData) => {
  const response = await API.post('/staff', staffData);
  return response.data;
};

export const updateStaff = async (id, staffData) => {
  const response = await API.put(`/staff/${id}`, staffData);
  return response.data;
};

export const deleteStaff = async (id) => {
  const response = await API.delete(`/staff/${id}`);
  return response.data;
};

export const fetchTimeOffs = async () => {
  const response = await API.get('/staff/time-off');
  return response.data;
};

export const fetchMyTimeOffs = async () => {
  const response = await API.get('/staff/my-time-off');
  return response.data;
};

export const requestTimeOff = async (timeOffData) => {
  const response = await API.post('/staff/time-off', timeOffData);
  return response.data;
};

export const updateTimeOffStatus = async (id, status) => {
  const response = await API.put(`/staff/time-off/${id}`, { status });
  return response.data;
};

// User Endpoints
export const fetchUsers = async (params = {}) => {
  const response = await API.get('/users', { params });
  return response.data;
};

export const fetchBarbers = async () => {
  const response = await API.get('/users/barbers');
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await API.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await API.delete(`/users/${id}`);
  return response.data;
};

// Appointment Endpoints
export const fetchAllAppointments = async (params = {}) => {
  const response = await API.get('/appointments', { params });
  return response.data;
};

export const fetchMyAppointments = async (params = {}) => {
  const response = await API.get('/appointments/my', { params });
  return response.data;
};

export const fetchBarberAppointments = async (params = {}) => {
  const response = await API.get('/appointments/barber', { params });
  return response.data;
};

export const fetchAvailableSlots = async (barberId, date) => {
  const response = await API.get('/appointments/available-slots', { params: { barberId, date } });
  return response.data;
};

export const createAppointment = async (appointmentData) => {
  const response = await API.post('/appointments', appointmentData);
  return response.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const response = await API.put(`/appointments/${id}/status`, { status });
  return response.data;
};

export const cancelAppointment = async (id, reason = '') => {
  const response = await API.put(`/appointments/${id}/cancel`, { reason });
  return response.data;
};

export const rescheduleAppointment = async (id, date, timeSlot) => {
  const response = await API.put(`/appointments/${id}/reschedule`, { date, timeSlot });
  return response.data;
};

export const assignBarber = async (id, barberId) => {
  const response = await API.put(`/appointments/${id}/assign`, { barberId });
  return response.data;
};

// Wages / Earnings
export const fetchMyEarnings = async () => {
  const response = await API.get('/wages/my-earnings');
  return response.data;
};

export default API;
