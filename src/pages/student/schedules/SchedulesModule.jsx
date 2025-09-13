// SchedulesModule.jsx
import React, { useState } from 'react';
import RegularScheduleViewStudent from './RegularScheduleViewStudent';
import ExamScheduleViewLecturer from '../../lecturer/schedules/ExamScheduleViewLecturer';
import { CalendarDays } from 'lucide-react'; // Assuming you're using lucide-react for icons

const SchedulesModule = () => {
  // Define tabs for the student panel
  const tabs = ["Regular Schedule", "Exam Schedule"];
  const [activeTab, setActiveTab] = useState(tabs[0]); // Default to "Regular Schedule"

  const currentStudentClasses = ["MPC-2A", "JEE-Batch1"]; // Student enrolled in MPC 2nd year section A and JEE coaching

  // In-memory state for ALL lecturers' regular schedules.
  // The student view will filter this based on currentStudentClasses.
  const [alllecturersRegularSchedules] = useState([
    // MPC Stream Schedule
    { id: 'trs1', lecturerId: 'lecturer_F101', dayOfWeek: 'Monday', startTime: '08:30', endTime: '09:20', subject: 'Mathematics', classId: 'MPC-2A' },
    { id: 'trs2', lecturerId: 'lecturer_F102', dayOfWeek: 'Monday', startTime: '09:30', endTime: '10:20', subject: 'Physics', classId: 'MPC-2A' },
    { id: 'trs3', lecturerId: 'lecturer_F103', dayOfWeek: 'Monday', startTime: '10:30', endTime: '11:20', subject: 'Chemistry', classId: 'MPC-2A' },
    { id: 'trs4', lecturerId: 'lecturer_F104', dayOfWeek: 'Monday', startTime: '11:30', endTime: '12:20', subject: 'English', classId: 'MPC-2A' },
    { id: 'trs5', lecturerId: 'lecturer_F105', dayOfWeek: 'Monday', startTime: '14:00', endTime: '14:50', subject: 'Telugu', classId: 'MPC-2A' },
    
    { id: 'trs6', lecturerId: 'lecturer_F102', dayOfWeek: 'Tuesday', startTime: '08:30', endTime: '09:20', subject: 'Physics', classId: 'MPC-2A' },
    { id: 'trs7', lecturerId: 'lecturer_F101', dayOfWeek: 'Tuesday', startTime: '09:30', endTime: '10:20', subject: 'Mathematics', classId: 'MPC-2A' },
    { id: 'trs8', lecturerId: 'lecturer_F103', dayOfWeek: 'Tuesday', startTime: '10:30', endTime: '11:20', subject: 'Chemistry', classId: 'MPC-2A' },
    { id: 'trs9', lecturerId: 'lecturer_F105', dayOfWeek: 'Tuesday', startTime: '11:30', endTime: '12:20', subject: 'Telugu', classId: 'MPC-2A' },
    
    { id: 'trs10', lecturerId: 'lecturer_F103', dayOfWeek: 'Wednesday', startTime: '08:30', endTime: '09:20', subject: 'Chemistry', classId: 'MPC-2A' },
    { id: 'trs11', lecturerId: 'lecturer_F101', dayOfWeek: 'Wednesday', startTime: '09:30', endTime: '10:20', subject: 'Mathematics', classId: 'MPC-2A' },
    { id: 'trs12', lecturerId: 'lecturer_F102', dayOfWeek: 'Wednesday', startTime: '10:30', endTime: '11:20', subject: 'Physics', classId: 'MPC-2A' },
    { id: 'trs13', lecturerId: 'lecturer_F104', dayOfWeek: 'Wednesday', startTime: '11:30', endTime: '12:20', subject: 'English', classId: 'MPC-2A' },
    
    // JEE Coaching Schedule
    { id: 'trs14', lecturerId: 'lecturer_F201', dayOfWeek: 'Monday', startTime: '15:00', endTime: '16:30', subject: 'JEE Mathematics', classId: 'JEE-Batch1' },
    { id: 'trs15', lecturerId: 'lecturer_F202', dayOfWeek: 'Tuesday', startTime: '15:00', endTime: '16:30', subject: 'JEE Physics', classId: 'JEE-Batch1' },
    { id: 'trs16', lecturerId: 'lecturer_F203', dayOfWeek: 'Wednesday', startTime: '15:00', endTime: '16:30', subject: 'JEE Chemistry', classId: 'JEE-Batch1' },
    { id: 'trs17', lecturerId: 'lecturer_F201', dayOfWeek: 'Thursday', startTime: '15:00', endTime: '16:30', subject: 'JEE Mathematics', classId: 'JEE-Batch1' },
    { id: 'trs18', lecturerId: 'lecturer_F202', dayOfWeek: 'Friday', startTime: '15:00', endTime: '16:30', subject: 'JEE Physics', classId: 'JEE-Batch1' },
    { id: 'trs19', lecturerId: 'lecturer_F204', dayOfWeek: 'Saturday', startTime: '09:00', endTime: '12:00', subject: 'JEE Mock Test', classId: 'JEE-Batch1' },
  ]);

  // In-memory state for admin-provided exam schedules (read-only for students)
  const [adminExamSchedules, setAdminExamSchedules] = useState([
    // AP Intermediate Exam Schedule
    { id: 'adm_exam1', classId: 'MPC-2A', examType: 'Unit Test 1', date: '2025-07-15', time: '09:00', subject: 'Mathematics' },
    { id: 'adm_exam2', classId: 'MPC-2A', examType: 'Unit Test 1', date: '2025-07-16', time: '09:00', subject: 'Physics' },
    { id: 'adm_exam3', classId: 'MPC-2A', examType: 'Unit Test 1', date: '2025-07-17', time: '09:00', subject: 'Chemistry' },
    { id: 'adm_exam4', classId: 'MPC-2A', examType: 'Unit Test 1', date: '2025-07-18', time: '09:00', subject: 'English' },
    { id: 'adm_exam5', classId: 'MPC-2A', examType: 'Unit Test 1', date: '2025-07-19', time: '09:00', subject: 'Telugu' },
    
    { id: 'adm_exam6', classId: 'MPC-2A', examType: 'Quarterly Exam', date: '2025-09-15', time: '09:00', subject: 'Mathematics' },
    { id: 'adm_exam7', classId: 'MPC-2A', examType: 'Quarterly Exam', date: '2025-09-17', time: '09:00', subject: 'Physics' },
    { id: 'adm_exam8', classId: 'MPC-2A', examType: 'Quarterly Exam', date: '2025-09-19', time: '09:00', subject: 'Chemistry' },
    
    // JEE Coaching Exams
    { id: 'adm_exam9', classId: 'JEE-Batch1', examType: 'JEE Mock Test 1', date: '2025-07-20', time: '09:00', subject: 'JEE Main Pattern' },
    { id: 'adm_exam10', classId: 'JEE-Batch1', examType: 'JEE Mock Test 2', date: '2025-08-10', time: '09:00', subject: 'JEE Main Pattern' },
    { id: 'adm_exam11', classId: 'JEE-Batch1', examType: 'JEE Advanced Mock', date: '2025-09-05', time: '09:00', subject: 'JEE Advanced Pattern' },
  ]);

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        <div className="flex items-center gap-3">
          <CalendarDays size={32} className="text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Class & Exam Schedules
          </h1>
        </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-6 sticky top-0 bg-gray-50 z-10 p-1 -mx-6 w-[calc(100%+3rem)]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium rounded-t-lg transition duration-200 ease-in-out text-sm md:text-base
              ${activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="bg-white rounded-lg shadow p-6 min-h-[400px]">
        {activeTab === "Regular Schedule" && (
          <RegularScheduleViewStudent
            alllecturersRegularSchedules={alllecturersRegularSchedules}
            currentStudentClasses={currentStudentClasses} // Pass student's enrolled classes
          />
        )}
        {activeTab === "Exam Schedule" && (
          <ExamScheduleViewLecturer // Reusing the lecturer's read-only exam view
            adminExamSchedules={adminExamSchedules}
          />
        )}
      </div>
    </div>
  );
};

export default SchedulesModule;
