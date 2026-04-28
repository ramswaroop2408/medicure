import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAppStore } from '../../store/useAppStore';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  LogOut,
  Activity,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 bg-surface-900/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`w-[250px] bg-white border-r border-surface-100 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-surface-100">
          <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center text-white shrink-0">
            <Activity size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-surface-900 font-[Poppins] leading-tight">MediCure</span>
            <span className="text-[0.65rem] text-primary-500 font-medium -mt-0.5">Analytics</span>
          </div>
          <button className="ml-auto bg-transparent border-none text-surface-400 cursor-pointer p-1 md:hidden hover:text-surface-600" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors no-underline ${
                  isActive ? 'bg-primary-50 text-primary-600' : 'text-surface-500 hover:bg-surface-50 hover:text-surface-700'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="flex items-center gap-3 px-4 py-3 mx-3 mb-3 text-surface-500 bg-transparent border border-surface-200 rounded-xl text-sm cursor-pointer transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
