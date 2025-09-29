
import React, { useState, useMemo, useCallback } from 'react';
import type { Student, Classroom, Attendance, Session } from '../../types';
import Modal from '../Modal';
import Toast from '../Toast';

interface AttendanceTrackerProps {
  students: Student[];
  classrooms: Classroom[];
  attendance: Attendance[];
  sessions: Session[];
  addAttendanceRecord: (records: Attendance[]) => void;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ students, classrooms, attendance, sessions, addAttendanceRecord }) => {
  const [selectedClassroom, setSelectedClassroom] = useState<string>(classrooms[0]?.id || '');
  const [selectedSession, setSelectedSession] = useState<string>(sessions[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, 'present' | 'absent'>>({});
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const studentsInClass = useMemo(() =>
    students.filter(student => student.classroomId === selectedClassroom),
  [students, selectedClassroom]);

  const existingRecords = useMemo(() =>
    attendance.filter(a => a.date === selectedDate && a.sessionId === selectedSession),
  [attendance, selectedDate, selectedSession]);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent') => {
    setAttendanceStatus(prev => ({ ...prev, [studentId]: status }));
  };
  
  const markAll = (status: 'present' | 'absent') => {
    const newStatus = studentsInClass.reduce((acc, student) => {
      acc[student.id] = status;
      return acc;
    }, {} as Record<string, 'present' | 'absent'>);
    setAttendanceStatus(newStatus);
  };

  const handleSubmit = () => {
    const records: Attendance[] = Object.entries(attendanceStatus).map(([studentId, status]) => ({
      studentId,
      sessionId: selectedSession,
      date: selectedDate,
      status
    }));
    addAttendanceRecord(records);
    setToast({ message: 'Attendance submitted successfully!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };
  
  const getStudentStatus = (studentId: string) => {
    if (attendanceStatus[studentId]) return attendanceStatus[studentId];
    const record = existingRecords.find(r => r.studentId === studentId);
    return record?.status;
  };

  const attendanceSummary = useMemo(() => {
    const summary: Record<string, { present: number; absent: number }> = {};
    students.forEach(s => summary[s.id] = { present: 0, absent: 0 });
    attendance.forEach(a => {
      if(summary[a.studentId]) {
        if (a.status === 'present') summary[a.studentId].present++;
        else summary[a.studentId].absent++;
      }
    });
    return summary;
  }, [attendance, students]);

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h2 className="text-2xl font-semibold mb-4">Attendance Register</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 rounded-lg border">
        <div>
          <label className="block text-sm font-medium text-slate-700">Classroom</label>
          <select value={selectedClassroom} onChange={e => setSelectedClassroom(e.target.value)} className="mt-1 block w-full p-2 border-slate-300 rounded-md">
            {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Session</label>
          <select value={selectedSession} onChange={e => setSelectedSession(e.target.value)} className="mt-1 block w-full p-2 border-slate-300 rounded-md">
            {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Date</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="mt-1 block w-full p-2 border-slate-300 rounded-md" />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
            <button onClick={() => markAll('present')} className="px-4 py-2 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200">Mark All Present</button>
            <button onClick={() => markAll('absent')} className="px-4 py-2 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200">Mark All Absent</button>
        </div>
        <button onClick={handleSubmit} className="px-6 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-semibold">Submit Attendance</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {studentsInClass.map(student => {
              const status = getStudentStatus(student.id);
              return (
              <tr key={student.id} className={status === 'absent' ? 'bg-red-100' : (status === 'present' ? 'bg-green-100' : 'bg-white')}>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{student.name}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleStatusChange(student.id, 'present')} className={`px-3 py-1 text-sm rounded-full ${status === 'present' ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>Present</button>
                    <button onClick={() => handleStatusChange(student.id, 'absent')} className={`px-3 py-1 text-sm rounded-full ${status === 'absent' ? 'bg-red-500 text-white' : 'bg-slate-200'}`}>Absent</button>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Absence Report & Summary</h3>
        <div className="flex justify-end mb-4">
          <button onClick={() => setFormModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Report Absent Student (MS Form)</button>
        </div>
         <p className="text-sm text-slate-500 mb-4">This table shows total hours attended assuming each session is 1.5 hours long.</p>
        <table className="min-w-full divide-y divide-slate-200">
           <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sessions Attended</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sessions Absent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Total Attendance Hours</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td className="px-6 py-4 text-sm font-medium">{student.name}</td>
                <td className="px-6 py-4 text-sm text-green-600">{attendanceSummary[student.id].present}</td>
                <td className="px-6 py-4 text-sm text-red-600">{attendanceSummary[student.id].absent}</td>
                <td className="px-6 py-4 text-sm font-semibold">{attendanceSummary[student.id].present * 1.5} hours</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)} title="Report Student Absence (MS Form Simulation)">
        <form onSubmit={(e) => { e.preventDefault(); setFormModalOpen(false); setToast({message: 'Absence reported via simulated MS Form.', type: 'success'}); }}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Student Name</label>
            <select className="mt-1 block w-full p-2 border-slate-300 rounded-md">
              {students.map(s => <option key={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Date of Absence</label>
            <input type="date" className="mt-1 block w-full p-2 border-slate-300 rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Reason (Optional)</label>
            <textarea className="mt-1 block w-full p-2 border-slate-300 rounded-md" rows={3}></textarea>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={() => setFormModalOpen(false)} className="px-4 py-2 bg-slate-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Submit to MS Teams</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AttendanceTracker;