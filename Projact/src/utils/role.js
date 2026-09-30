export const normalizeRole = (role) => {
  if (!role) return '';
  const r = String(role).trim().toLowerCase();
  if (r === 'admin') return 'admin';
  if (r === 'receptionist') return 'receptionist';
  if (r === 'barber' || r === 'stylist') return 'barber';
  if (r === 'customer') return 'customer';
  return r;
};

export const getRolePath = (role) => {
  const norm = normalizeRole(role);
  switch (norm) {
    case 'admin':
      return '/admin';
    case 'receptionist':
      return '/receptionist';
    case 'barber':
      return '/barber';
    case 'customer':
    default:
      return '/customer';
  }
};

export const getRoleLabel = (role) => {
  const norm = normalizeRole(role);
  switch (norm) {
    case 'admin':
      return 'Admin';
    case 'receptionist':
      return 'Receptionist';
    case 'barber':
      return 'Barber / Stylist';
    case 'customer':
      return 'Customer';
    default:
      return role || 'User';
  }
};
