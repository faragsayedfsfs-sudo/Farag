
import React, { useState } from 'react';
import type { Student, Classroom, Teacher, Attendance, Session } from '../types';
import StudentInfo from './student/StudentInfo';
import ClassroomView from './student/ClassroomView';
import AttendanceTracker from './student/AttendanceTracker';
import CertificateGenerator from './student/CertificateGenerator';
import { UsersIcon } from './icons/UsersIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { AwardIcon } from './icons/AwardIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';

interface StudentManagerProps {
  students: Student[];
  classrooms: Classroom[];
  teachers: Teacher[];
  attendance: Attendance[];
  sessions: Session[];
  addAttendanceRecord: (records: Attendance[]) => void;
}

type StudentView = 'info' | 'classrooms' | 'attendance' | 'certificates';

const StudentManager: React.FC<StudentManagerProps> = (props) => {
  const [activeTab, setActiveTab] = useState<StudentView>('info');

  const tabs = [
    { id: 'info', label: 'Student Information', icon: UsersIcon },
    { id: 'classrooms', label: 'Students per Classroom', icon: BookOpenIcon },
    { id: 'attendance', label: 'Student Attendance', icon: ClipboardListIcon },
    { id: 'certificates', label: 'Generate Certificate', icon: AwardIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return <StudentInfo students={props.students} classrooms={props.classrooms} />;
      case 'classrooms':
        return <ClassroomView students={props.students} classrooms={props.classrooms} teachers={props.teachers} />;
      case 'attendance':
        return <AttendanceTracker 
                 students={props.students} 
                 classrooms={props.classrooms} 
                 attendance={props.attendance} 
                 sessions={props.sessions} 
                 addAttendanceRecord={props.addAttendanceRecord} 
               />;
      case 'certificates':
        return <CertificateGenerator students={props.students} attendance={props.attendance} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Student Management</h1>
      <div className="flex border-b border-slate-300 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as StudentView)}
            className={`flex items-center px-6 py-3 text-md font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? 'border-b-2 border-sky-500 text-sky-600'
                : 'text-slate-500 hover:text-sky-500'
            }`}
          >
            <tab.icon className="w-5 h-5 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentManager;