
import type { Student, Teacher, Classroom, Item, Session, TimetableSlot, SheetData } from '../types';

export const MOCK_TEACHERS: Teacher[] = [
  { id: 'T1', name: 'Mr. John Smith', subject: 'Mathematics' },
  { id: 'T2', name: 'Ms. Emily Johnson', subject: 'Science' },
  { id: 'T3', name: 'Mrs. Sarah Davis', subject: 'English' },
  { id: 'T4', name: 'Mr. Robert Brown', subject: 'History' },
];

export const MOCK_CLASSROOMS: Classroom[] = [
  { id: 'C1', name: 'Class 1A', level: 1, teacherId: 'T1' },
  { id: 'C2', name: 'Class 1B', level: 1, teacherId: 'T2' },
  { id: 'C3', name: 'Class 2A', level: 2, teacherId: 'T3' },
];

export const MOCK_STUDENTS: Student[] = [
  // 21 students for level 1
  ...Array.from({ length: 11 }, (_, i) => ({ id: `S${i + 1}`, name: `Student ${i + 1}`, level: 1, classroomId: 'C1' })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: `S${i + 12}`, name: `Student ${i + 12}`, level: 1, classroomId: 'C2' })),
  // Some students for level 2
  ...Array.from({ length: 15 }, (_, i) => ({ id: `S${i + 22}`, name: `Student ${i + 22}`, level: 2, classroomId: 'C3' })),
];

export const MOCK_SESSIONS: Session[] = Array.from({ length: 10 }, (_, i) => ({
  id: `SES${i + 1}`,
  name: `Session ${i + 1}`,
}));

export const MOCK_ITEMS: Item[] = [
  { id: 'I1', name: 'Whiteboard Markers', quantity: 50 },
  { id: 'I2', name: 'Notebooks', quantity: 200 },
  { id: 'I3', name: 'Pens', quantity: 300 },
  { id: 'I4', name: 'Projector', quantity: 5 },
  { id: 'I5', name: 'Textbooks - Math', quantity: 150 },
  { id: 'I6', name: 'Textbooks - Science', quantity: 150 },
  { id: 'I7', name: 'First Aid Kits', quantity: 10 },
  { id: 'I8', name: 'Chairs', quantity: 250 },
  { id: 'I9', name: 'Desks', quantity: 250 },
  { id: 'I10', name: 'Laptops', quantity: 25 },
];

export const MOCK_TIMETABLE: TimetableSlot[] = [
  // Class 1A
  { id: 'TT1', day: 'Monday', time: '09:00 - 10:00', subject: 'Mathematics', classroomId: 'C1' },
  { id: 'TT2', day: 'Monday', time: '10:00 - 11:00', subject: 'Science', classroomId: 'C1' },
  // Class 1B
  { id: 'TT3', day: 'Monday', time: '09:00 - 10:00', subject: 'Science', classroomId: 'C2' },
  { id: 'TT4', day: 'Monday', time: '10:00 - 11:00', subject: 'Mathematics', classroomId: 'C2' },
  // Class 2A
  { id: 'TT5', day: 'Monday', time: '09:00 - 10:00', subject: 'English', classroomId: 'C3' },
  { id: 'TT6', day: 'Monday', time: '10:00 - 11:00', subject: 'History', classroomId: 'C3' },
   // Tuesday
  { id: 'TT7', day: 'Tuesday', time: '09:00 - 10:00', subject: 'English', classroomId: 'C1' },
  { id: 'TT8', day: 'Tuesday', time: '10:00 - 11:00', subject: 'History', classroomId: 'C1' },
];

export const MOCK_DATA_SHEETS: SheetData[] = Array.from({ length: 10 }, (_, i) => ({
  id: `DS${i + 1}`,
  name: `Sheet ${i + 1}`,
  rows: [
    { id: `R1-${i}`, colA: `Sample A${i+1}`, colB: `Sample B${i+1}`, colC: `100`, colD: `Yes`, colE: new Date().toLocaleDateString() },
    { id: `R2-${i}`, colA: `Sample C${i+1}`, colB: `Sample D${i+1}`, colC: `250`, colD: `No`, colE: new Date().toLocaleDateString() },
  ],
}));
