import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [successMessage, setSuccessMessage] = useState('');
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

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await registerUser(data.name, data.email, data.password, 'Customer');
      triggerToast('Registration Successful! Redirecting to login...', 'success');
      setSuccessMessage('Registration Successful! You can now log in with your email.');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      const apiErr = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrorMessage(apiErr);
      triggerToast(apiErr, 'error');
    }
  };


  return (
    <div className="split-form-wrapper">
      {toast.show && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
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
          Join Gilded Blade Portal today. Start booking the premium haircut, styling, and care you deserve.
        </p>
      </div>

      <div className="split-side-form">
        <h2 className="form-header-title">Create Account</h2>

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

        {successMessage && (
          <div className="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>{successMessage}</span>
          </div>
        )}


        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              disabled={isLoading}
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="error-text">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="text"
              placeholder="Enter your email address"
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
              placeholder="Create a strong password (6+ chars)"
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
              Register
            </button>
          )}
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '13px', color: '#aaaaaa' }}>
          Already have an account?{' '}
          <span
            style={{ color: '#d4af37', cursor: 'pointer', fontWeight: '600' }}
            onClick={() => !isLoading && navigate('/login')}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
