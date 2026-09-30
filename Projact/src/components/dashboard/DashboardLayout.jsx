import React, { useState } from 'react';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';
import Topbar from './Topbar';
import '../../styles/dashboard.css';

function DashboardLayout({ user, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="dash-wrapper">
      {/* Mobile overlay */}
      <div
        className={`dash-mobile-overlay${sidebarOpen ? ' active' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <Sidebar
        role={user?.role}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Content Area */}
      <div className="dash-main">
        <Topbar
          user={user}
          onLogout={onLogout}
          onMobileToggle={toggleSidebar}
        />

        <main className="dash-content">
          <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
