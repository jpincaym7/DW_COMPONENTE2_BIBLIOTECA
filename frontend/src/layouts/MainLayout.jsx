import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Footer } from '../components/layout/Footer.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { PATHS } from '../routes/paths.js';
import styles from '../styles/layouts/MainLayout.module.css';

export const MainLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(PATHS.LOGIN, { replace: true });
  };

  return (
    <div className={styles.layout}>
      <Navbar
        user={user}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
      />

      <div className={styles.body}>
        <Sidebar isAdmin={isAdmin} isOpen={isSidebarOpen} onNavigate={() => setIsSidebarOpen(false)} />

        <div className={styles.content}>
          <main className={styles.main}>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};
