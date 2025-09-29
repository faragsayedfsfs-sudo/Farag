
import React from 'react';
import type { Teacher } from '../../types';

interface TeacherListProps {
  teachers: Teacher[];
}

const TeacherList: React.FC<TeacherListProps> = ({ teachers }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Teachers</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Teacher ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Primary Subject</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{teacher.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{teacher.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{teacher.subject}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherList;
