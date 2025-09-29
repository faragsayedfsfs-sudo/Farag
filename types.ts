
export interface Student {
  id: string;
  name: string;
  level: number;
  classroomId: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
}

export interface Classroom {
  id: string;
  name: string;
  level: number;
  teacherId: string;
}

export interface Item {
  id: string;
  name: string;
  quantity: number;
}

export interface Session {
  id: string;
  name: string;
}

export interface Attendance {
  studentId: string;
  sessionId: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent';
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time: string; // e.g., "09:00 - 10:00"
  subject: string;
  classroomId: string;
}

export interface TeacherAbsence {
  id: string;
  teacherId: string;
  date: string; // YYYY-MM-DD
  coverTeacherId: string | null;
}

export interface DataRow {
  id: string;
  colA: string;
  colB: string;
  colC: string;
  colD: string;
  colE: string;
}

export interface SheetData {
  id: string;
  name: string;
  rows: DataRow[];
}
