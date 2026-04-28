import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import { useAppStore } from '../../store/useAppStore';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Stethoscope,
  User,
  FileText,
  Pill,
  ClipboardList,
  Clock,
  Activity,
  Heart,
  Thermometer,
  Droplets,
  ChevronRight,
} from 'lucide-react';

type Tab = 'overview' | 'history' | 'prescriptions' | 'reports';

// Mock detailed data keyed by patient index
const generateMedicalHistory = (patientId: string) => {
  const idx = parseInt(patientId.replace('PAT-', ''), 10) || 1;
  return [
    { date: '2026-04-25', event: 'Routine checkup', doctor: 'Dr. Anderson', notes: 'Vitals stable. Blood pressure within normal range.', type: 'checkup' as const },
    { date: '2026-04-10', event: 'Lab results received', doctor: 'Dr. Patel', notes: 'Cholesterol levels slightly elevated. Dietary changes recommended.', type: 'lab' as const },
    { date: '2026-03-18', event: 'Follow-up visit', doctor: 'Dr. Kim', notes: 'Patient reports improvement in symptoms. Continue current medication.', type: 'followup' as const },
    { date: '2026-02-28', event: 'Emergency visit', doctor: 'Dr. Thompson', notes: 'Acute episode managed. Stabilized and discharged same day.', type: 'emergency' as const },
    { date: '2026-02-05', event: 'Initial consultation', doctor: 'Dr. Chen', notes: `First visit for ${idx % 2 === 0 ? 'recurring symptoms' : 'new complaints'}. Full workup ordered.`, type: 'consultation' as const },
    { date: '2026-01-15', event: 'Imaging completed', doctor: 'Dr. Roberts', notes: 'X-ray results normal. No structural abnormalities detected.', type: 'imaging' as const },
  ];
};

const generatePrescriptions = (patientId: string) => {
  const idx = parseInt(patientId.replace('PAT-', ''), 10) || 1;
  const meds = [
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', status: 'Active', startDate: '2026-03-01', doctor: 'Dr. Anderson' },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', status: 'Active', startDate: '2026-02-15', doctor: 'Dr. Patel' },
    { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once at bedtime', status: 'Active', startDate: '2026-01-20', doctor: 'Dr. Kim' },
    { name: 'Amoxicillin', dosage: '250mg', frequency: 'Three times daily', status: 'Completed', startDate: '2026-01-05', doctor: 'Dr. Thompson' },
    { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed', status: 'Active', startDate: '2025-12-10', doctor: 'Dr. Chen' },
  ];
  // Rotate based on patient index
  return meds.slice(idx % 2).concat(meds.slice(0, idx % 2));
};

const generateReports = (patientId: string) => {
  const idx = parseInt(patientId.replace('PAT-', ''), 10) || 1;
  return [
    { id: `RPT-${idx}01`, name: 'Complete Blood Count', date: '2026-04-20', category: 'Lab', status: 'Reviewed' },
    { id: `RPT-${idx}02`, name: 'Lipid Panel', date: '2026-04-10', category: 'Lab', status: 'Reviewed' },
    { id: `RPT-${idx}03`, name: 'Chest X-Ray', date: '2026-03-15', category: 'Imaging', status: 'Reviewed' },
    { id: `RPT-${idx}04`, name: 'HbA1c Test', date: '2026-02-28', category: 'Lab', status: 'Pending Review' },
    { id: `RPT-${idx}05`, name: 'Thyroid Function Panel', date: '2026-02-10', category: 'Lab', status: 'Reviewed' },
    { id: `RPT-${idx}06`, name: 'ECG Report', date: '2026-01-22', category: 'Cardiology', status: 'Reviewed' },
  ];
};

const vitals = [
  { label: 'Heart Rate', value: '72 bpm', icon: Heart, color: '#EF4444' },
  { label: 'Blood Pressure', value: '120/80', icon: Activity, color: '#2F80ED' },
  { label: 'Temperature', value: '98.6°F', icon: Thermometer, color: '#F97316' },
  { label: 'SpO2', value: '98%', icon: Droplets, color: '#27AE60' },
];

const timelineTypeStyles: Record<string, { bg: string; text: string }> = {
  checkup: { bg: 'bg-primary-50', text: 'text-primary-600' },
  lab: { bg: 'bg-accent-50', text: 'text-accent-600' },
  followup: { bg: 'bg-secondary-50', text: 'text-secondary-600' },
  emergency: { bg: 'bg-red-50', text: 'text-red-600' },
  consultation: { bg: 'bg-warning-50', text: 'text-warning-600' },
  imaging: { bg: 'bg-primary-50', text: 'text-primary-600' },
};

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    return (
      <>
        <Header title="Patient Details" />
        <div className="p-6 flex flex-col items-center justify-center py-20">
          <User size={48} className="text-surface-300 mb-4" />
          <h3 className="text-surface-700 text-lg font-semibold mb-1">Patient not found</h3>
          <p className="text-surface-400 text-sm mb-4">The patient you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/patients')} className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium border-none cursor-pointer hover:bg-primary-600 transition-colors">
            Back to Patients
          </button>
        </div>
      </>
    );
  }

  const history = generateMedicalHistory(patient.id);
  const prescriptions = generatePrescriptions(patient.id);
  const reports = generateReports(patient.id);

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: 'Overview', icon: ClipboardList },
    { key: 'history', label: 'Medical History', icon: Clock },
    { key: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { key: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <>
      <Header title="Patient Details" />
      <div className="p-6 lg:p-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/patients')}
          className="inline-flex items-center gap-1.5 text-surface-500 text-sm mb-5 bg-transparent border-none cursor-pointer hover:text-primary-600 transition-colors p-0"
        >
          <ArrowLeft size={16} /> Back to Patients
        </button>

        {/* Profile Card */}
        <div className="bg-white border border-surface-100 rounded-2xl p-6 mb-6 shadow-sm shadow-surface-900/[.03]">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar + Name */}
            <div className="flex items-start gap-4">
              <img
                src={patient.avatar}
                alt={patient.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-surface-100 shrink-0"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-surface-900 m-0">{patient.name}</h2>
                  <span className={`status-${patient.status.toLowerCase().replace(' ', '-')}`}>{patient.status}</span>
                </div>
                <span className="text-surface-400 text-sm mt-0.5 font-mono">{patient.id}</span>
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <span className="text-surface-600 text-sm">{patient.age} years old</span>
                  <span className="text-surface-300">•</span>
                  <span className="text-surface-600 text-sm">{patient.gender}</span>
                  <span className="text-surface-300">•</span>
                  <span className="text-surface-600 text-sm">{patient.condition}</span>
                </div>
              </div>
            </div>

            {/* Contact + Doctor */}
            <div className="md:ml-auto flex flex-col gap-2 min-w-[220px]">
              <div className="flex items-center gap-2 text-sm text-surface-600">
                <Mail size={15} className="text-surface-400 shrink-0" />
                <span className="truncate">{patient.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-surface-600">
                <Phone size={15} className="text-surface-400 shrink-0" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-surface-600">
                <Stethoscope size={15} className="text-primary-500 shrink-0" />
                <span className="text-primary-600 font-medium">{patient.doctor}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-surface-600">
                <Calendar size={15} className="text-surface-400 shrink-0" />
                <span>Last visit: {patient.lastVisit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vitals Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {vitals.map((v) => (
              <div key={v.label} className="bg-white border border-surface-100 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${v.color}12`, color: v.color }}>
                <v.icon size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-surface-900">{v.value}</span>
                <span className="text-xs text-surface-400">{v.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-surface-100 p-1 rounded-xl w-fit mb-7 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium border-none cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-transparent text-surface-500 hover:text-surface-700 hover:bg-surface-50'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Info */}
            <div className="bg-white border border-surface-100 rounded-2xl p-5 shadow-sm shadow-surface-900/[.03]">
              <h3 className="text-surface-900 text-base font-semibold m-0 mb-4">Patient Summary</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Primary Condition', value: patient.condition },
                  { label: 'Attending Doctor', value: patient.doctor },
                  { label: 'Blood Type', value: ['A+', 'B+', 'O+', 'AB+', 'A-', 'O-'][parseInt(patient.id.replace('PAT-', ''), 10) % 6] },
                  { label: 'Allergies', value: ['Penicillin', 'None known', 'Sulfa drugs', 'Latex', 'None known', 'Aspirin'][parseInt(patient.id.replace('PAT-', ''), 10) % 6] },
                  { label: 'Insurance', value: 'HealthFirst Premium' },
                  { label: 'Emergency Contact', value: '(555) 000-1234' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-surface-100 last:border-b-0">
                    <span className="text-sm text-surface-500">{item.label}</span>
                    <span className="text-sm text-surface-800 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Timeline */}
            <div className="bg-white border border-surface-100 rounded-2xl p-5 shadow-sm shadow-surface-900/[.03]">
              <h3 className="text-surface-900 text-base font-semibold m-0 mb-4">Recent Activity</h3>
              <div className="flex flex-col">
                {history.slice(0, 4).map((h, i) => {
                  const style = timelineTypeStyles[h.type] || timelineTypeStyles.checkup;
                  return (
                    <div key={i} className="flex gap-3 pb-4 last:pb-0 relative">
                      {/* Timeline line */}
                      {i < 3 && <div className="absolute left-[15px] top-8 bottom-0 w-px bg-surface-200" />}
                      {/* Dot */}
                      <div className={`w-[30px] h-[30px] rounded-full ${style.bg} flex items-center justify-center shrink-0 relative z-10`}>
                        <Clock size={14} className={style.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-surface-800">{h.event}</span>
                          <span className="text-xs text-surface-400 shrink-0">{h.date}</span>
                        </div>
                        <p className="text-xs text-surface-500 mt-0.5 m-0 leading-relaxed">{h.notes}</p>
                        <span className="text-xs text-primary-600 mt-1 block">{h.doctor}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white border border-surface-100 rounded-2xl p-5 shadow-sm shadow-surface-900/[.03]">
            <h3 className="text-surface-900 text-base font-semibold m-0 mb-5">Medical History Timeline</h3>
            <div className="flex flex-col">
              {history.map((h, i) => {
                const style = timelineTypeStyles[h.type] || timelineTypeStyles.checkup;
                return (
                  <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
                    {/* Timeline line */}
                    {i < history.length - 1 && <div className="absolute left-[19px] top-10 bottom-0 w-px bg-surface-200" />}
                    {/* Dot */}
                    <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center shrink-0 relative z-10`}>
                      <Clock size={18} className={style.text} />
                    </div>
                    <div className="flex-1 bg-surface-50 rounded-xl p-4 border border-surface-100">
                      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-semibold text-surface-800">{h.event}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                          {h.type.charAt(0).toUpperCase() + h.type.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-surface-600 mt-1 m-0 leading-relaxed">{h.notes}</p>
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-surface-200">
                        <span className="text-xs text-primary-600 font-medium">{h.doctor}</span>
                        <span className="text-xs text-surface-400">{h.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div className="bg-white border border-surface-100 rounded-2xl overflow-hidden shadow-sm shadow-surface-900/[.03]">
            <div className="px-5 py-4 border-b border-surface-100">
              <h3 className="text-surface-900 text-base font-semibold m-0">Current Prescriptions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-surface-100 bg-surface-50/50">
                    <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-5 py-3">Medication</th>
                    <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-5 py-3">Dosage</th>
                    <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-5 py-3">Frequency</th>
                    <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-5 py-3">Start Date</th>
                    <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-5 py-3">Prescribed By</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((rx, i) => (
                    <tr key={i} className="border-b border-surface-100 last:border-b-0 hover:bg-surface-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Pill size={16} className="text-primary-500 shrink-0" />
                          <span className="font-medium text-surface-800">{rx.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-surface-600">{rx.dosage}</td>
                      <td className="px-5 py-3.5 text-surface-600">{rx.frequency}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          rx.status === 'Active'
                            ? 'bg-secondary-50 text-secondary-600'
                            : 'bg-surface-100 text-surface-500'
                        }`}>
                          {rx.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-surface-500">{rx.startDate}</td>
                      <td className="px-5 py-3.5 text-primary-600 font-medium text-xs">{rx.doctor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white border border-surface-100 rounded-2xl overflow-hidden shadow-sm shadow-surface-900/[.03]">
            <div className="px-5 py-4 border-b border-surface-100">
              <h3 className="text-surface-900 text-base font-semibold m-0">Medical Reports</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-surface-100 bg-surface-50/50">
                    <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-5 py-3">Report ID</th>
                    <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-5 py-3">Name</th>
                    <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-5 py-3">Category</th>
                    <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-5 py-3">Date</th>
                    <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id} className="border-b border-surface-100 last:border-b-0 hover:bg-surface-50 transition-colors">
                      <td className="px-5 py-3.5 text-surface-500 font-mono text-xs">{r.id}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-primary-500 shrink-0" />
                          <span className="font-medium text-surface-800">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-600">{r.category}</span>
                      </td>
                      <td className="px-5 py-3.5 text-surface-500">{r.date}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          r.status === 'Reviewed'
                            ? 'bg-secondary-50 text-secondary-600'
                            : 'bg-warning-50 text-warning-600'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button className="bg-transparent border-none text-surface-400 cursor-pointer p-1 hover:text-primary-500 transition-colors">
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PatientDetail;
