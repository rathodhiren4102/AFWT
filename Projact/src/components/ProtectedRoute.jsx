import React from 'react';
import { Navigate } from 'react-router-dom';
import { normalizeRole, getRolePath } from '../utils/role';

export function PublicOnlyRoute({ children }) {
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

  return children;
}

function ProtectedRoute({ children, allowedRoles }) {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!userStr || !token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    const userRole = normalizeRole(user.role);

    if (allowedRoles && allowedRoles.length > 0) {
      const normalizedAllowed = allowedRoles.map((r) => normalizeRole(r));
      if (!normalizedAllowed.includes(userRole)) {
        const authorizedPath = getRolePath(userRole);
        return <Navigate to={authorizedPath} replace />;
      }
    }
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
