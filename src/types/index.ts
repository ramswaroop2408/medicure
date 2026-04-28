export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  condition: string;
  status: 'Active' | 'Recovered' | 'Critical' | 'Under Observation';
  lastVisit: string;
  doctor: string;
  avatar: string;
}

export interface AnalyticsData {
  month: string;
  patients: number;
  revenue: number;
  appointments: number;
}

export interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  appointments: number;
  revenue: number;
  criticalCases: number;
  recoveredToday: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
}
