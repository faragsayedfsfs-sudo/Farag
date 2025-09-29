
import React, { useState, useMemo } from 'react';
import { MOCK_STUDENTS, MOCK_TEACHERS, MOCK_CLASSROOMS, MOCK_ITEMS, MOCK_SESSIONS, MOCK_TIMETABLE, MOCK_DATA_SHEETS } from './data/mockData';
import type { Student, Teacher, Classroom, Item, Attendance, TeacherAbsence, Session, TimetableSlot, SheetData } from './types';
import Sidebar from './components/Sidebar';
import StudentManager from './components/StudentManager';
import TeacherManager from './components/TeacherManager';
import InventoryManager from './components/InventoryManager';
import DataManager from './components/DataManager';

export type View = 'students' | 'teachers' | 'inventory' | 'data';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('students');

  // State Management
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [classrooms, setClassrooms] = useState<Classroom[]>(MOCK_CLASSROOMS);
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [teacherAbsences, setTeacherAbsences] = useState<TeacherAbsence[]>([]);
  const [dataSheets, setDataSheets] = useState<SheetData[]>(MOCK_DATA_SHEETS);
  
  const sessions = useMemo(() => MOCK_SESSIONS, []);
  const timetable = useMemo(() => MOCK_TIMETABLE, []);

  const addAttendanceRecord = (records: Attendance[]) => {
    setAttendance(prev => {
      const newRecords = records.filter(record => 
        !prev.some(p => p.studentId === record.studentId && p.date === record.date && p.sessionId === record.sessionId)
      );
      const updatedRecords = prev.map(p => {
        const matchingNew = records.find(r => r.studentId === p.studentId && r.date === p.date && r.sessionId === p.sessionId);
        return matchingNew ? matchingNew : p;
      });
      return [...updatedRecords, ...newRecords];
    });
  };
  
  const addTeacherAbsence = (absence: Omit<TeacherAbsence, 'id'>) => {
    setTeacherAbsences(prev => [...prev, { ...absence, id: Date.now().toString() }]);
  };
  
  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity: Math.max(0, newQuantity) } : item
      )
    );
  };
  
  const updateDataSheet = (sheetId: string, newRows: SheetData['rows']) => {
    setDataSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === sheetId ? { ...sheet, rows: newRows } : sheet
      )
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case 'students':
        return <StudentManager 
                  students={students}
                  classrooms={classrooms}
                  teachers={teachers}
                  attendance={attendance}
                  sessions={sessions}
                  addAttendanceRecord={addAttendanceRecord}
                />;
      case 'teachers':
        return <TeacherManager 
                  teachers={teachers}
                  timetable={timetable}
                  classrooms={classrooms}
                  absences={teacherAbsences}
                  addTeacherAbsence={addTeacherAbsence}
                />;
      case 'inventory':
        return <InventoryManager items={items} updateItemQuantity={updateItemQuantity} />;
      case 'data':
        return <DataManager sheets={dataSheets} updateDataSheet={updateDataSheet} />;
      default:
        return <div>Select a view</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
