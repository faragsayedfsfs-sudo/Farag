
import React, { useMemo } from 'react';
import type { TimetableSlot, Classroom, Teacher } from '../../types';

interface TimetableViewProps {
  timetable: TimetableSlot[];
  classrooms: Classroom[];
  teachers: Teacher[];
}

const TimetableView: React.FC<TimetableViewProps> = ({ timetable, classrooms, teachers }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [...new Set(timetable.map(t => t.time))].sort();

  const classroomMap = useMemo(() =>
    classrooms.reduce((acc, c) => ({ ...acc, [c.id]: c }), {} as Record<string, Classroom>),
  [classrooms]);
  
  const teacherMap = useMemo(() =>
    teachers.reduce((acc, t) => ({ ...acc, [t.id]: t }), {} as Record<string, Teacher>),
  [teachers]);

  const getSlotInfo = (day: string, time: string) => {
    return timetable.filter(slot => slot.day === day && slot.time === time);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">School Timetable</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-slate-300">
          <thead>
            <tr>
              <th className="border border-slate-300 p-2 bg-slate-100">Time</th>
              {days.map(day => (
                <th key={day} className="border border-slate-300 p-2 bg-slate-100">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(time => (
              <tr key={time}>
                <td className="border border-slate-300 p-2 font-semibold bg-slate-50">{time}</td>
                {days.map(day => (
                  <td key={day} className="border border-slate-300 p-2 align-top">
                    {getSlotInfo(day, time).map(slot => {
                        const classroom = classroomMap[slot.classroomId];
                        const teacher = classroom ? teacherMap[classroom.teacherId] : null;
                        return (
                          <div key={slot.id} className="bg-sky-100 text-sky-800 p-2 rounded-md mb-1 text-xs">
                            <p className="font-bold">{slot.subject}</p>
                            <p>{classroom?.name}</p>
                            <p className="italic text-sky-600">{teacher?.name}</p>
                          </div>
                        )
                    })}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimetableView;
