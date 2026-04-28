import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-surface-50">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-[250px] min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
