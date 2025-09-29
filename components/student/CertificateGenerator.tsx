
import React, { useState, useRef, useMemo, useEffect } from 'react';
import type { Student, Attendance } from '../../types';
import { DownloadIcon } from '../icons/DownloadIcon';

declare const html2canvas: any;
declare const jspdf: any;

interface CertificateGeneratorProps {
  students: Student[];
  attendance: Attendance[];
}

const CertificateTemplate: React.FC<{ studentName: string | null; studentId: string | null; level: number | string | null; completionDate: string; attendanceHours: number; }> = ({ studentName, studentId, level, completionDate, attendanceHours }) => (
  <div className="w-[800px] h-[565px] border-4 border-blue-800 bg-slate-50 p-8 flex flex-col items-center justify-between text-center relative">
    <div className="absolute inset-0 bg-blue-50 opacity-10 z-0"></div>
    <div className="z-10">
      <h1 className="text-5xl font-serif text-blue-900">Certificate of Completion</h1>
      <p className="text-xl text-slate-600 mt-4">This certificate is proudly presented to</p>
    </div>
    <div className="z-10">
      <h2 className="text-6xl font-extrabold font-cursive text-sky-600 border-b-2 border-sky-500 pb-2">{studentName || 'Select a Student'}</h2>
      {studentId && <p className="text-md text-slate-500 mt-2">Student ID: {studentId}</p>}
    </div>
    <div className="z-10">
      <p className="text-lg text-slate-700">for successfully completing all required coursework, with a total attendance of <span className="font-bold">{attendanceHours} hours</span>, for Level {level || '___'}.</p>
      <p className="text-md text-slate-500 mt-4">Awarded on this day, {completionDate}</p>
    </div>
    <div className="z-10 w-full flex justify-between items-end">
        <div className="text-center">
            <p className="border-t-2 border-slate-400 pt-2 font-semibold">School Principal</p>
        </div>
        <div className="text-center">
            <p className="text-sm">School Seal</p>
        </div>
    </div>
  </div>
);

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ students, attendance }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [completionDateInput, setCompletionDateInput] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [showStudentId, setShowStudentId] = useState(true);
  const certificateRef = useRef<HTMLDivElement>(null);

  const selectedStudent = useMemo(() => students.find(s => s.id === selectedStudentId), [students, selectedStudentId]);
  const uniqueLevels = useMemo(() => [...new Set(students.map(s => s.level))].sort((a,b) => a-b), [students]);
  
  const attendanceHours = useMemo(() => {
    if (!selectedStudentId) return 0;
    const attendedSessions = attendance.filter(
        a => a.studentId === selectedStudentId && a.status === 'present'
    ).length;
    return attendedSessions * 1.5;
  }, [attendance, selectedStudentId]);

  useEffect(() => {
    if (selectedStudent) {
      setSelectedLevel(selectedStudent.level.toString());
    } else {
      setSelectedLevel('');
    }
  }, [selectedStudent]);

  const handleDownload = () => {
    if (!selectedStudent || !certificateRef.current) return;
    setIsLoading(true);
    
    html2canvas(certificateRef.current, { scale: 2 }).then((canvas: any) => {
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = jspdf;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [800, 565]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 800, 565);
      pdf.save(`Certificate-${selectedStudent.name.replace(' ', '_')}.pdf`);
      setIsLoading(false);
    });
  };

  const formattedCompletionDate = useMemo(() => {
    if (!completionDateInput) return '____________';
    const date = new Date(completionDateInput + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }, [completionDateInput]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Certificate Generator</h2>
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-slate-50 rounded-lg border items-end">
        <div>
          <label htmlFor="student-select" className="block text-sm font-medium text-slate-700">Select Student</label>
          <select
            id="student-select"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="mt-1 block w-full min-w-[200px] p-2 text-base border-slate-300 rounded-md"
          >
            <option value="">-- Select a Student --</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>{student.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="level-select" className="block text-sm font-medium text-slate-700">Level</label>
          <select
            id="level-select"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            disabled={!selectedStudentId}
            className="mt-1 block w-full min-w-[120px] p-2 text-base border-slate-300 rounded-md disabled:bg-slate-100"
          >
            <option value="">-- Select Level --</option>
            {uniqueLevels.map(level => (
              <option key={level} value={level}>Level {level}</option>
            ))}
          </select>
        </div>
        <div>
            <label htmlFor="completion-date" className="block text-sm font-medium text-slate-700">Completion Date</label>
            <input 
                type="date"
                id="completion-date"
                value={completionDateInput}
                onChange={e => setCompletionDateInput(e.target.value)}
                className="mt-1 block w-full p-2 text-base border-slate-300 rounded-md"
            />
        </div>
        <div className="flex items-center h-10">
            <input
                id="show-student-id-check"
                type="checkbox"
                checked={showStudentId}
                onChange={(e) => setShowStudentId(e.target.checked)}
                className="h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
            />
            <label htmlFor="show-student-id-check" className="ml-2 text-sm font-medium text-slate-700">
                Include Student ID
            </label>
        </div>
        <button
          onClick={handleDownload}
          disabled={!selectedStudentId || !selectedLevel || isLoading}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md font-semibold disabled:bg-slate-400 hover:bg-green-700"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      <h3 className="text-lg font-medium mb-2">Certificate Preview</h3>
      <div ref={certificateRef}>
        <CertificateTemplate 
            studentName={selectedStudent?.name || null} 
            studentId={showStudentId ? selectedStudent?.id || null : null}
            level={selectedLevel}
            completionDate={formattedCompletionDate} 
            attendanceHours={attendanceHours}
        />
      </div>
    </div>
  );
};

export default CertificateGenerator;