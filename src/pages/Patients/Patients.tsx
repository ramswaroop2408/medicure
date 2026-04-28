import React from 'react';
import Header from '../../components/Layout/Header';
import { useAppStore } from '../../store/useAppStore';
import PatientGrid from '../../components/Patients/PatientGrid';
import PatientList from '../../components/Patients/PatientList';
import { LayoutGrid, List, Users } from 'lucide-react';

const Patients: React.FC = () => {
  const { patients, searchQuery, viewMode, setViewMode } = useAppStore();

  const filtered = patients.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.condition.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.doctor.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <Header title="Patient Details" />
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-surface-500 text-sm">
            <Users size={18} />
            <span>{filtered.length} patients</span>
          </div>

          <div className="flex bg-white border border-surface-100 rounded-xl p-0.5 gap-0.5">
            <button
              className={`p-2 rounded-lg border-none cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-primary-500 text-white shadow-sm' : 'bg-transparent text-surface-400 hover:text-surface-700 hover:bg-surface-50'}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`p-2 rounded-lg border-none cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-primary-500 text-white shadow-sm' : 'bg-transparent text-surface-400 hover:text-surface-700 hover:bg-surface-50'}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-surface-400">
            <Users size={48} />
            <h3 className="mt-4 mb-1 text-surface-600">No patients found</h3>
            <p className="text-sm">Try adjusting your search query</p>
          </div>
        ) : viewMode === 'grid' ? (
          <PatientGrid patients={filtered} />
        ) : (
          <PatientList patients={filtered} />
        )}
      </div>
    </>
  );
};

export default Patients;
