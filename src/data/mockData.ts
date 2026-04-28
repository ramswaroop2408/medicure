import { Patient, AnalyticsData, DashboardStats } from '../types';

const firstNames = ['James', 'Sarah', 'Michael', 'Emily', 'Robert', 'Olivia', 'William', 'Sophia', 'David', 'Isabella', 'Daniel', 'Mia', 'Alexander', 'Charlotte', 'Ethan', 'Amelia', 'Benjamin', 'Harper', 'Lucas', 'Evelyn'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'White'];
const conditions = ['Hypertension', 'Diabetes Type 2', 'Asthma', 'Migraine', 'Arthritis', 'Cardiac Arrhythmia', 'COPD', 'Thyroid Disorder', 'Chronic Back Pain', 'Anxiety Disorder', 'Allergic Rhinitis', 'Gastritis'];
const statuses: Patient['status'][] = ['Active', 'Recovered', 'Critical', 'Under Observation'];
const doctors = ['Dr. Anderson', 'Dr. Patel', 'Dr. Kim', 'Dr. Thompson', 'Dr. Chen', 'Dr. Roberts'];

function generateAvatar(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`;
}

export const mockPatients: Patient[] = Array.from({ length: 24 }, (_, i) => {
  const first = firstNames[i % firstNames.length];
  const last = lastNames[(i * 3 + 7) % lastNames.length];
  const name = `${first} ${last}`;
  return {
    id: `PAT-${String(i + 1).padStart(4, '0')}`,
    name,
    age: 22 + ((i * 7) % 55),
    gender: i % 3 === 0 ? 'Male' : i % 3 === 1 ? 'Female' : 'Other',
    email: `${first.toLowerCase()}.${last.toLowerCase()}@email.com`,
    phone: `(555) ${String(100 + i).padStart(3, '0')}-${String(1000 + i * 37).slice(0, 4)}`,
    condition: conditions[i % conditions.length],
    status: statuses[i % statuses.length],
    lastVisit: new Date(2026, 3, 28 - (i * 3) % 30).toISOString().split('T')[0],
    doctor: doctors[i % doctors.length],
    avatar: generateAvatar(name),
  };
});

export const mockAnalyticsData: AnalyticsData[] = [
  { month: 'Oct', patients: 320, revenue: 48000, appointments: 410 },
  { month: 'Nov', patients: 350, revenue: 52000, appointments: 445 },
  { month: 'Dec', patients: 290, revenue: 45000, appointments: 380 },
  { month: 'Jan', patients: 410, revenue: 61000, appointments: 520 },
  { month: 'Feb', patients: 380, revenue: 57000, appointments: 490 },
  { month: 'Mar', patients: 450, revenue: 67000, appointments: 560 },
  { month: 'Apr', patients: 470, revenue: 71000, appointments: 590 },
];

export const mockDashboardStats: DashboardStats = {
  totalPatients: 2847,
  activePatients: 1234,
  appointments: 186,
  revenue: 71000,
  criticalCases: 23,
  recoveredToday: 12,
};
