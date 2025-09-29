import React, { useState, useMemo } from 'react';
import type { Student, Classroom, Teacher } from '../../types';

interface ClassroomViewProps {
  students: Student[];
  classrooms: Classroom[];
  teachers: Teacher[];
}

const ClassroomView: React.FC<ClassroomViewProps> = ({ students, classrooms, teachers }) => {
  const [selectedClassroom, setSelectedClassroom] = useState<string>(classrooms[0]?.id || '');

  const teacherMap = useMemo(() =>
    teachers.reduce((acc, curr) => {
      acc[curr.id] = curr.name;
      return acc;
    }, {} as Record<string, string>),
  [teachers]);

  const studentsInClass = useMemo(() =>
    students.filter(student => student.classroomId === selectedClassroom),
  [students, selectedClassroom]);
  
  const currentClassroom = classrooms.find(c => c.id === selectedClassroom);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Classroom Roster</h2>
      <div className="mb-4">
        <label htmlFor="classroomSelect" className="block text-sm font-medium text-slate-700">Select Classroom</label>
        <select
          id="classroomSelect"
          value={selectedClassroom}
          onChange={e => setSelectedClassroom(e.target.value)}
          className="mt-1 block w-full max-w-xs pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
        >
          {classrooms.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      
      {currentClassroom && (
        <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg mb-6">
          <h3 className="text-xl font-bold text-sky-800">{currentClassroom.name}</h3>
          <p className="text-md text-slate-600">Level: {currentClassroom.level}</p>
          <p className="text-md text-slate-600">Teacher: {teacherMap[currentClassroom.teacherId] || 'N/A'}</p>
          <p className="text-md text-slate-600 font-semibold">{studentsInClass.length} Students</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student ID</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {studentsInClass.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                   <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-slate-100 text-slate-800">
                    {student.id}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassroomView;