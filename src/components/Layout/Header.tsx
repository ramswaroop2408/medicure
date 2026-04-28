import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppStore } from '../../store/useAppStore';
import { Menu, Bell, Search } from 'lucide-react';

const notifDotColor: Record<string, string> = {
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  success: 'bg-emerald-500',
  error: 'bg-red-500',
};

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { user, demoMode } = useAuth();
  const { notifications, markNotificationRead, clearNotifications, toggleSidebar, setSearchQuery } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const timeAgo = (date: Date) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  return (
    <header className="flex items-center gap-4 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-surface-100 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button className="flex md:hidden bg-transparent border-none text-surface-500 cursor-pointer p-1 hover:text-surface-700" onClick={toggleSidebar}>
          <Menu size={22} />
        </button>
        <h1 className="text-xl font-bold text-surface-900 m-0 whitespace-nowrap">{title}</h1>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-[400px] relative mx-4 hidden md:block">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search patients, records..."
          className="w-full py-2 pr-3 pl-10 bg-surface-50 border border-surface-200 rounded-xl text-surface-700 text-sm outline-none transition-colors placeholder:text-surface-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            className="bg-transparent border-none text-surface-500 cursor-pointer relative p-1.5 rounded-lg transition-colors hover:bg-surface-100 hover:text-surface-700"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[0.65rem] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[300px] md:w-[360px] -right-10 md:right-0 bg-white border border-surface-100 rounded-2xl shadow-xl shadow-surface-900/8 overflow-hidden z-50">
              <div className="flex justify-between items-center px-4 py-3.5 border-b border-surface-100 font-semibold text-surface-900 text-sm">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button className="bg-transparent border-none text-primary-500 text-xs cursor-pointer hover:text-primary-700" onClick={clearNotifications}>Mark all read</button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-surface-400 py-8 text-sm">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex gap-3 px-4 py-3.5 cursor-pointer transition-colors border-b border-surface-100 last:border-b-0 hover:bg-surface-50 ${!n.read ? 'bg-primary-50/50' : ''}`}
                      onClick={() => markNotificationRead(n.id)}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notifDotColor[n.type] || 'bg-blue-500'}`} />
                      <div>
                        <strong className="block text-surface-800 text-sm mb-0.5">{n.title}</strong>
                        <p className="text-surface-500 text-xs leading-relaxed m-0">{n.message}</p>
                        <span className="text-surface-400 text-[0.72rem] mt-1 block">{timeAgo(n.timestamp)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-sm">
            {(user?.email || 'U')[0].toUpperCase()}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-surface-800 text-sm font-medium">{user?.displayName || user?.email?.split('@')[0] || 'User'}</span>
            {demoMode && <span className="bg-warning-100 text-warning-600 text-[0.65rem] font-semibold px-1.5 py-px rounded w-fit">Demo</span>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
