import React, { useState } from 'react';
import Header from '../../components/Layout/Header';
import { mockAnalyticsData } from '../../data/mockData';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['#2F80ED', '#27AE60', '#F97316', '#8B5CF6', '#EF4444', '#1266D4', '#EC4899'];

const departmentData = [
  { name: 'Cardiology', value: 340 },
  { name: 'Neurology', value: 210 },
  { name: 'Orthopedics', value: 280 },
  { name: 'Pediatrics', value: 190 },
  { name: 'Oncology', value: 150 },
];

type Tab = 'overview' | 'revenue' | 'departments';

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <>
      <Header title="Analytics" />
      <div className="p-6 lg:p-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-surface-100 p-1 rounded-xl w-fit mb-7">
          {(['overview', 'revenue', 'departments'] as Tab[]).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-[10px] text-sm font-medium border-none cursor-pointer transition-colors ${
                activeTab === tab ? 'bg-primary-500 text-white shadow-sm' : 'bg-transparent text-surface-500 hover:text-surface-700 hover:bg-surface-50'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div>
            <div className="bg-white border border-surface-100 rounded-2xl p-5 shadow-sm shadow-surface-900/[.03]">
              <h3 className="text-surface-900 text-base font-semibold m-0 mb-4">Patient Admissions & Appointments</h3>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={mockAnalyticsData}>
                  <defs>
                    <linearGradient id="gradPatients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2F80ED" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#2F80ED" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradAppointments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#27AE60" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#27AE60" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, color: '#334155', boxShadow: '0 4px 12px rgba(15,23,42,0.08)' }} />
                  <Legend />
                  <Area type="monotone" dataKey="patients" stroke="#2F80ED" fill="url(#gradPatients)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="appointments" stroke="#27AE60" fill="url(#gradAppointments)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white border border-surface-100 rounded-2xl p-5 shadow-sm shadow-surface-900/[.03] lg:col-span-2">
              <h3 className="text-surface-900 text-base font-semibold m-0 mb-4">Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={mockAnalyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `$${v / 1000}K`} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, color: '#334155', boxShadow: '0 4px 12px rgba(15,23,42,0.08)' }}
                    formatter={(value: unknown) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                    {mockAnalyticsData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-surface-100 rounded-2xl p-5 shadow-sm shadow-surface-900/[.03]">
              <h3 className="text-surface-900 text-base font-semibold m-0 mb-4">Revenue Summary</h3>
              <div className="flex flex-col gap-3">
                {mockAnalyticsData.map((d) => (
                  <div className="flex items-center gap-3" key={d.month}>
                    <span className="text-sm text-surface-500 w-10 shrink-0">{d.month}</span>
                    <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(d.revenue / 71000) * 100}%` }} />
                    </div>
                    <span className="text-sm text-surface-800 font-medium w-12 text-right">${(d.revenue / 1000).toFixed(0)}K</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-surface-100 rounded-2xl p-5 shadow-sm shadow-surface-900/[.03]">
              <h3 className="text-surface-900 text-base font-semibold m-0 mb-4">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: '$401K', label: 'Total Revenue' },
                  { val: '$57.3K', label: 'Avg Monthly' },
                  { val: '+18%', label: 'Growth Rate' },
                  { val: '$71K', label: 'Peak Month' },
                ].map((m) => (
                  <div key={m.label} className="bg-surface-50 rounded-xl p-4 text-center border border-surface-100">
                    <span className="block text-xl font-bold text-surface-900">{m.val}</span>
                    <span className="block text-xs text-surface-400 mt-1">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white border border-surface-100 rounded-2xl p-5 shadow-sm shadow-surface-900/[.03]">
              <h3 className="text-surface-900 text-base font-semibold m-0 mb-4">Department Distribution</h3>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {departmentData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, color: '#334155', boxShadow: '0 4px 12px rgba(15,23,42,0.08)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-surface-100 rounded-2xl p-5 shadow-sm shadow-surface-900/[.03]">
              <h3 className="text-surface-900 text-base font-semibold m-0 mb-4">Department Breakdown</h3>
              <div className="flex flex-col gap-4">
                {departmentData.map((d, i) => (
                  <div className="flex items-center gap-3" key={d.name}>
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                    <span className="text-sm text-surface-700 flex-1">{d.name}</span>
                    <span className="text-sm text-surface-500">{d.value} patients</span>
                    <span className="text-sm text-surface-400 w-12 text-right">
                      {((d.value / departmentData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Analytics;
