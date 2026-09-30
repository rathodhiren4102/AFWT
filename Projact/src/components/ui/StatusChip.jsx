import React from 'react';
import '../../styles/dashboard.css';

function StatusChip({ status, size = 'small' }) {
  if (!status) return null;

  const s = String(status).toLowerCase();

  let chipClass = 'dash-chip-default';
  let label = status;

  if (s === 'completed' || s === 'approved' || s === 'active') {
    chipClass = 'dash-chip-completed';
  } else if (s === 'confirmed') {
    chipClass = 'dash-chip-confirmed';
  } else if (s === 'in progress' || s === 'in-progress') {
    chipClass = 'dash-chip-in-progress';
  } else if (s === 'pending') {
    chipClass = 'dash-chip-pending';
  } else if (s === 'cancelled' || s === 'rejected' || s === 'inactive') {
    chipClass = 'dash-chip-cancelled';
  } else if (s === 'admin') {
    chipClass = 'dash-chip-admin';
    label = 'Admin';
  } else if (s === 'receptionist') {
    chipClass = 'dash-chip-receptionist';
    label = 'Receptionist';
  } else if (s === 'barber') {
    chipClass = 'dash-chip-barber';
    label = 'Barber / Stylist';
  } else if (s === 'customer') {
    chipClass = 'dash-chip-customer';
    label = 'Customer';
  }

  return (
    <span
      className={`dash-chip ${chipClass}`}
      style={{ fontSize: size === 'small' ? '0.72rem' : '0.82rem' }}
    >
      {label}
    </span>
  );
}

export default StatusChip;
