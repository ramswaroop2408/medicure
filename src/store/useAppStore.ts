import { create } from 'zustand';
import { Patient, Notification } from '../types';
import { mockPatients } from '../data/mockData';

interface AppState {
  patients: Patient[];
  searchQuery: string;
  viewMode: 'grid' | 'list';
  notifications: Notification[];
  sidebarOpen: boolean;

  setSearchQuery: (query: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  patients: mockPatients,
  searchQuery: '',
  viewMode: 'grid',
  notifications: [
    {
      id: '1',
      title: 'Critical Alert',
      message: 'Patient James Garcia requires immediate attention - vitals dropping.',
      type: 'error',
      timestamp: new Date(Date.now() - 300000),
      read: false,
    },
    {
      id: '2',
      title: 'Appointment Reminder',
      message: 'You have 5 appointments scheduled for today.',
      type: 'info',
      timestamp: new Date(Date.now() - 1800000),
      read: false,
    },
    {
      id: '3',
      title: 'Patient Recovered',
      message: 'Emily Brown has been discharged successfully.',
      type: 'success',
      timestamp: new Date(Date.now() - 3600000),
      read: true,
    },
  ],
  sidebarOpen: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setViewMode: (mode) => set({ viewMode: mode }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date(),
        },
        ...state.notifications,
      ],
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  clearNotifications: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
