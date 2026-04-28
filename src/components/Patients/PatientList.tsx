import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../../types';

interface Props {
  patients: Patient[];
}

const PatientList: React.FC<Props> = ({ patients }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-surface-100 rounded-2xl overflow-x-auto shadow-sm shadow-surface-900/[.03]">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-surface-100">
            <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-4 py-3">Patient</th>
            <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-4 py-3">ID</th>
            <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-4 py-3">Condition</th>
            <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-4 py-3">Status</th>
            <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-4 py-3">Doctor</th>
            <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-4 py-3">Last Visit</th>
            <th className="text-left text-[0.7rem] font-semibold text-surface-400 uppercase tracking-wider px-4 py-3">Age/Gender</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-b border-surface-100 last:border-b-0 hover:bg-surface-50 transition-colors cursor-pointer" onClick={() => navigate(`/patients/${p.id}`)}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex flex-col">
                    <span className="text-surface-800 font-medium">{p.name}</span>
                    <span className="text-surface-400 text-xs">{p.email}</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-surface-500 font-mono text-xs">{p.id}</td>
              <td className="px-4 py-3 text-surface-700">{p.condition}</td>
              <td className="px-4 py-3">
                <span className={`status-${p.status.toLowerCase().replace(' ', '-')}`}>
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-3 text-primary-600 text-xs font-medium">{p.doctor}</td>
              <td className="px-4 py-3 text-surface-500">{p.lastVisit}</td>
              <td className="px-4 py-3 text-surface-500">{p.age}y, {p.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
