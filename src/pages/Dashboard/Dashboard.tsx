import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import { mockDashboardStats, mockAnalyticsData, mockPatients } from '../../data/mockData';
import {
  Users,
  UserCheck,
  CalendarClock,
  DollarSign,
  AlertTriangle,
  HeartPulse,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const stats = [
  { label: 'Total Patients', value: mockDashboardStats.totalPatients, icon: Users, color: '#2F80ED', trend: '+12%' },
  { label: 'Active Patients', value: mockDashboardStats.activePatients, icon: UserCheck, color: '#27AE60', trend: '+8%' },
  { label: 'Appointments', value: mockDashboardStats.appointments, icon: CalendarClock, color: '#F97316', trend: '+24%' },
  { label: 'Revenue', value: `$${(mockDashboardStats.revenue / 1000).toFixed(0)}K`, icon: DollarSign, color: '#8B5CF6', trend: '+18%' },
  { label: 'Critical Cases', value: mockDashboardStats.criticalCases, icon: AlertTriangle, color: '#EF4444', trend: '-5%' },
  { label: 'Recovered Today', value: mockDashboardStats.recoveredToday, icon: HeartPulse, color: '#1266D4', trend: '+3' },
];

const recentPatients = mockPatients.slice(0, 5);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header title="Dashboard" />
      <div className="p-6 lg:p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-7">
          {stats.map((s) => (
            <div className="bg-white border border-surface-100 rounded-2xl p-4 flex flex-col gap-3 transition-shadow hover:shadow-md hover:shadow-surface-900/[.06]" key={s.label}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}12`, color: s.color }}>
                <s.icon size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-surface-900">{s.value}</span>
                <span className="text-xs text-surface-500 mt-0.5">{s.label}</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium" style={{ color: s.trend.startsWith('-') ? '#EF4444' : '#27AE60' }}>
                <TrendingUp size={14} />
                {s.trend}
              </span>
            </div>
          ))}
        </div>

        {/* Chart + Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
          {/* Chart */}
          <div className="bg-white border border-surface-100 rounded-2xl p-5 shadow-sm shadow-surface-900/[.03]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-surface-900 text-base font-semibold m-0">Patient Trends</h3>
              <span className="text-surface-400 text-xs">Last 7 months</span>
            </div>
            <div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={mockAnalyticsData}>
                  <defs>
                    <linearGradient id="patientGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2F80ED" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#2F80ED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, color: '#334155', boxShadow: '0 4px 12px rgba(15,23,42,0.08)' }}
                  />
                  <Area type="monotone" dataKey="patients" stroke="#2F80ED" fill="url(#patientGrad)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-white border border-surface-100 rounded-2xl p-5 shadow-sm shadow-surface-900/[.03]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-surface-900 text-base font-semibold m-0">Recent Patients</h3>
              <a href="/patients" className="flex items-center gap-1 text-primary-500 text-xs font-medium no-underline hover:text-primary-700 transition-colors">
                View All <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="flex flex-col gap-1">
              {recentPatients.map((p) => (
                <div className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-surface-50 transition-colors cursor-pointer" key={p.id} onClick={() => navigate(`/patients/${p.id}`)}>
                  <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-surface-800 truncate">{p.name}</span>
                    <span className="block text-xs text-surface-400 truncate">{p.condition}</span>
                  </div>
                  <span className={`status-${p.status.toLowerCase().replace(' ', '-')}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
