
import React, { useState } from 'react';
import type { Teacher, TimetableSlot, Classroom, TeacherAbsence } from '../types';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { UserXIcon } from './icons/UserXIcon';
import TeacherList from './teacher/TeacherList';
import TimetableView from './teacher/TimetableView';
import AbsenceManager from './teacher/AbsenceManager';


interface TeacherManagerProps {
  teachers: Teacher[];
  timetable: TimetableSlot[];
  classrooms: Classroom[];
  absences: TeacherAbsence[];
  addTeacherAbsence: (absence: Omit<TeacherAbsence, 'id'>) => void;
}

type TeacherView = 'list' | 'timetable' | 'absences';

const TeacherManager: React.FC<TeacherManagerProps> = (props) => {
  const [activeTab, setActiveTab] = useState<TeacherView>('list');

  const tabs = [
    { id: 'list', label: 'Teacher Information', icon: BriefcaseIcon },
    { id: 'timetable', label: 'Timetable', icon: CalendarIcon },
    { id: 'absences', label: 'Absence & Cover', icon: UserXIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'list':
        return <TeacherList teachers={props.teachers} />;
      case 'timetable':
        return <TimetableView timetable={props.timetable} classrooms={props.classrooms} teachers={props.teachers} />;
      case 'absences':
        return <AbsenceManager teachers={props.teachers} absences={props.absences} addTeacherAbsence={props.addTeacherAbsence} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Teacher Management</h1>
      <div className="flex border-b border-slate-300 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TeacherView)}
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

export default TeacherManager;
