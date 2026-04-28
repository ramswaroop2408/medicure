import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../../types';
import { Calendar, Stethoscope } from 'lucide-react';

interface Props {
  patients: Patient[];
}

const PatientGrid: React.FC<Props> = ({ patients }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {patients.map((p) => (
        <div
          className="bg-white border border-surface-100 rounded-2xl p-4 transition-shadow hover:shadow-md hover:shadow-surface-900/[.06] cursor-pointer"
          key={p.id}
          onClick={() => navigate(`/patients/${p.id}`)}
        >
          <div className="flex items-center gap-3 mb-3">
            <img src={p.avatar} alt={p.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-surface-100" />
            <span className={`ml-auto status-${p.status.toLowerCase().replace(' ', '-')}`}>
              {p.status}
            </span>
          </div>
          <h4 className="text-surface-900 text-sm font-semibold m-0 mb-0.5">{p.name}</h4>
          <span className="text-surface-400 text-xs">{p.id}</span>
          <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-surface-100">
            <div className="flex items-center gap-2 text-xs text-surface-600">
              <Stethoscope size={14} className="text-surface-400 shrink-0" />
              <span className="truncate">{p.condition}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-surface-600">
              <Calendar size={14} className="text-surface-400 shrink-0" />
              <span className="truncate">Last visit: {p.lastVisit}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-surface-100">
            <span className="text-xs text-primary-600 font-medium">{p.doctor}</span>
            <span className="text-xs text-surface-400">{p.age}y, {p.gender}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientGrid;
