import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { normalizeRole, getRoleLabel } from '../../utils/role';
import '../../styles/dashboard.css';

export const DRAWER_WIDTH = 260;

const NAV_ICONS = {
  Dashboard: 'bi-speedometer2',
  Appointments: 'bi-calendar-check',
  'Staff Roster': 'bi-people',
  Customers: 'bi-person-lines-fill',
  'Services Menu': 'bi-scissors',
  'My Profile': 'bi-person-circle',
  'Front Desk': 'bi-speedometer2',
  'New Booking': 'bi-calendar-plus',
  'Book Appointment': 'bi-calendar-plus',
  'My Appointments': 'bi-calendar3',
  'Services & Pricing': 'bi-scissors',
  Workstation: 'bi-speedometer2',
  'My Schedule': 'bi-clock',
  'My Clients': 'bi-people',
  'Profile & Leave': 'bi-person-circle',
  Home: 'bi-house',
};

function Sidebar({ role, isOpen, onClose }) {
  const location = useLocation();
  const normRole = normalizeRole(role);

  const navItems = {
    admin: [
      { label: 'Dashboard', path: '/admin' },
      { label: 'Appointments', path: '/admin/appointments' },
      { label: 'Staff Roster', path: '/admin/staff' },
      { label: 'Customers', path: '/admin/customers' },
      { label: 'Services Menu', path: '/admin/services' },
      { label: 'My Profile', path: '/admin/profile' },
    ],
    receptionist: [
      { label: 'Front Desk', path: '/receptionist' },
      { label: 'Appointments', path: '/receptionist/appointments' },
      { label: 'New Booking', path: '/receptionist/book' },
      { label: 'Customers', path: '/receptionist/customers' },
      { label: 'My Profile', path: '/receptionist/profile' },
    ],
    customer: [
      { label: 'Home', path: '/customer' },
      { label: 'Book Appointment', path: '/customer/book' },
      { label: 'My Appointments', path: '/customer/appointments' },
      { label: 'Services & Pricing', path: '/customer/services' },
      { label: 'My Profile', path: '/customer/profile' },
    ],
    barber: [
      { label: 'Workstation', path: '/barber' },
      { label: 'My Appointments', path: '/barber/appointments' },
      { label: 'My Schedule', path: '/barber/schedule' },
      { label: 'My Clients', path: '/barber/clients' },
      { label: 'Profile & Leave', path: '/barber/profile' },
    ],
  };

  const items = navItems[normRole] || navItems.customer;

  return (
    <nav
      className={`dash-sidebar${isOpen ? ' open' : ''}`}
      aria-label="navigation drawer"
      style={{ width: DRAWER_WIDTH }}
    >
      {/* Brand Header */}
      <div className="p-3 d-flex align-items-center gap-2" style={{ borderBottom: '1px solid #e8e7f4' }}>
        <div className="dash-brand-logo">
          <i className="bi bi-scissors" style={{ color: '#fff', fontSize: '1rem' }} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.05em', color: '#1a1a2e', lineHeight: 1.2 }}>
            GILDED <span style={{ color: '#B8860B' }}>BLADE</span>
          </div>
          <div style={{ fontSize: '0.65rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Salon &amp; Barber Portal
          </div>
        </div>
      </div>

      {/* Role Pill */}
      <div className="px-3 py-2">
        <span className="dash-role-pill">
          {getRoleLabel(normRole).toUpperCase()} PORTAL
        </span>
      </div>

      {/* Navigation Links */}
      <div className="px-2 py-2 flex-grow-1">
        {items.map((item) => {
          const isExact =
            item.path === '/admin' ||
            item.path === '/receptionist' ||
            item.path === '/customer' ||
            item.path === '/barber';
          const isActive = isExact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
          const iconClass = NAV_ICONS[item.label] || 'bi-circle';

          return (
            <RouterLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`dash-nav-link${isActive ? ' active' : ''}`}
            >
              <i className={`bi ${iconClass} dash-nav-icon`} />
              <span>{item.label}</span>
            </RouterLink>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className="px-3 py-2 text-center"
        style={{ borderTop: '1px solid #e8e7f4', fontSize: '0.7rem', color: '#aaa' }}
      >
        v2.0 • Gilded Blade System
      </div>
    </nav>
  );
}

export default Sidebar;
