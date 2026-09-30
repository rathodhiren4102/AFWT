import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

function Login({ onLogin }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const navigate = useNavigate();

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const fillDemoAccount = (email, password) => {
    setValue('email', email);
    setValue('password', password);
    setErrorMessage('');
  };

  const onSubmit = async (data) => {
    setErrorMessage('');
    setIsLoading(true);

    const email = (data.email || '').trim().toLowerCase();
    const password = (data.password || '').trim();

    try {
      // Call backend API via Axios
      const result = await loginUser(email, password);
      
      const { token, user } = result;

      // Save token and user info to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      triggerToast(`Welcome back, ${user.name}! Logging in...`, 'success');

      // Update parent App state
      onLogin(user);

      // Navigate to /dashboard after a short delay so the toast is visible
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      
      // Show proper error messages if login fails
      const apiError = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrorMessage(apiError);
      triggerToast(apiError, 'error');
    }
  };

  return (
    <div className="split-form-wrapper">
      {toast.show && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="split-side-banner">
        <div className="banner-logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <path d="M9 3v18" />
            <path d="M15 3v18" />
            <path d="M5 9h14" />
            <path d="M5 15h14" />
          </svg>
        </div>
        <h3 className="banner-title">GILDED BLADE</h3>
        <p className="banner-subtitle">
          Experience standard precision grooming and barbering. Log in to reserve your styling appointment.
        </p>

        <div style={{ marginTop: '25px', width: '100%', maxWidth: '280px', textAlign: 'left' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary-gold)', fontWeight: '700', display: 'block', marginBottom: '8px' }}>
            Quick Demo Auto-Fill:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@salon.com', 'admin123')}
              style={{ padding: '6px 8px', fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }}
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('emily@salon.com', 'recep123')}
              style={{ padding: '6px 8px', fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }}
            >
              📌 Receptionist
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('marcus@salon.com', 'barber123')}
              style={{ padding: '6px 8px', fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }}
            >
              💈 Barber
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('alex@example.com', 'customer123')}
              style={{ padding: '6px 8px', fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }}
            >
              👤 Customer
            </button>
          </div>
        </div>
      </div>

      <div className="split-side-form">
        <h2 className="form-header-title">Welcome Back</h2>

        {errorMessage && (
          <div className="alert alert-danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="text"
              placeholder="Enter your email"
              disabled={isLoading}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Please enter a valid email address'
                }
              })}
            />
            {errors.email && (
              <p className="error-text">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              disabled={isLoading}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long'
                }
              })}
            />
            {errors.password && (
              <p className="error-text">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {errors.password.message}
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }}>
              Log In
            </button>
          )}
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '13px', color: '#aaaaaa' }}>
          Don't have an account?{' '}
          <span
            style={{ color: '#d4af37', cursor: 'pointer', fontWeight: '600' }}
            onClick={() => !isLoading && navigate('/register')}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
