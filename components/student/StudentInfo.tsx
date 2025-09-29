import React, { useState, useMemo } from 'react';
import type { Student, Classroom } from '../../types';

interface StudentInfoProps {
  students: Student[];
  classrooms: Classroom[];
}

const StudentInfo: React.FC<StudentInfoProps> = ({ students, classrooms }) => {
  const [filterLevel, setFilterLevel] = useState<string>('');
  const [filterClassroom, setFilterClassroom] = useState<string>('');

  const classroomMap = useMemo(() => 
    classrooms.reduce((acc, curr) => {
      acc[curr.id] = curr.name;
      return acc;
    }, {} as Record<string, string>), 
  [classrooms]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const levelMatch = filterLevel ? student.level === parseInt(filterLevel, 10) : true;
      const classroomMatch = filterClassroom ? student.classroomId === filterClassroom : true;
      return levelMatch && classroomMatch;
    });
  }, [students, filterLevel, filterClassroom]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Students</h2>
      <div className="flex gap-4 mb-4 p-4 bg-slate-50 rounded-lg border">
        <div>
          <label htmlFor="levelFilter" className="block text-sm font-medium text-slate-700">Filter by Level</label>
          <select 
            id="levelFilter" 
            value={filterLevel} 
            onChange={e => setFilterLevel(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
          >
            <option value="">All Levels</option>
            {[...new Set(students.map(s => s.level))].sort().map(level => (
              <option key={level} value={level}>Level {level}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="classroomFilter" className="block text-sm font-medium text-slate-700">Filter by Classroom</label>
          <select 
            id="classroomFilter" 
            value={filterClassroom} 
            onChange={e => setFilterClassroom(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
          >
            <option value="">All Classrooms</option>
            {classrooms.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Level</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Classroom</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-slate-100 text-slate-800">
                    {student.id}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{student.level}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{classroomMap[student.classroomId] || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentInfo;