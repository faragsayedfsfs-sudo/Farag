
import React, { useState, useMemo } from 'react';
import type { Teacher, TeacherAbsence } from '../../types';
import Modal from '../Modal';
import Toast from '../Toast';
import { MailIcon } from '../icons/MailIcon';

interface AbsenceManagerProps {
  teachers: Teacher[];
  absences: TeacherAbsence[];
  addTeacherAbsence: (absence: Omit<TeacherAbsence, 'id'>) => void;
}

const AbsenceManager: React.FC<AbsenceManagerProps> = ({ teachers, absences, addTeacherAbsence }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [absentTeacherId, setAbsentTeacherId] = useState('');
  const [absenceDate, setAbsenceDate] = useState(new Date().toISOString().split('T')[0]);
  const [coverTeacherId, setCoverTeacherId] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const teacherMap = useMemo(() =>
    teachers.reduce((acc, t) => ({ ...acc, [t.id]: t.name }), {} as Record<string, string>),
  [teachers]);
  
  const availableCoverTeachers = useMemo(() => 
    teachers.filter(t => t.id !== absentTeacherId),
  [teachers, absentTeacherId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!absentTeacherId || !absenceDate || !coverTeacherId) {
      setToast({ message: 'Please fill all fields.', type: 'error' });
      return;
    }
    addTeacherAbsence({ teacherId: absentTeacherId, date: absenceDate, coverTeacherId });
    setToast({ message: `Email sent to ${teacherMap[coverTeacherId]} to cover.`, type: 'success' });
    setModalOpen(false);
    setAbsentTeacherId('');
    setCoverTeacherId('');
  };
  
  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Teacher Absences</h2>
        <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700">Log Absence & Assign Cover</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Absent Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Cover Teacher</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {absences.map((absence) => (
              <tr key={absence.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{absence.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{teacherMap[absence.teacherId]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{absence.coverTeacherId ? teacherMap[absence.coverTeacherId] : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Log Teacher Absence">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Absent Teacher</label>
            <select value={absentTeacherId} onChange={e => setAbsentTeacherId(e.target.value)} className="mt-1 block w-full p-2 border-slate-300 rounded-md" required>
              <option value="">Select Teacher</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Date of Absence</label>
            <input type="date" value={absenceDate} onChange={e => setAbsenceDate(e.target.value)} className="mt-1 block w-full p-2 border-slate-300 rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Assign Cover Teacher</label>
            <select value={coverTeacherId} onChange={e => setCoverTeacherId(e.target.value)} className="mt-1 block w-full p-2 border-slate-300 rounded-md" required>
              <option value="">Select Cover Teacher</option>
              {availableCoverTeachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-slate-200 rounded-md">Cancel</button>
            <button type="submit" className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-md">
              <MailIcon className="w-5 h-5 mr-2" /> Send Email to Cover Teacher
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AbsenceManager;
