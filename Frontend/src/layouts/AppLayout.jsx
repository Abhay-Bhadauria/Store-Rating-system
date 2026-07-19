import { useState } from 'react';
import Header from '@components/common/Header';
import Sidebar from '@components/common/Sidebar';
import { useAuth } from '@context/AuthContext';

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        role={user?.role}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={handleMenuClick} showMenuButton />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

