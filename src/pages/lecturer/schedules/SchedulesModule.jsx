// SchedulesModule.jsx
import React, { useState } from 'react';
import RegularScheduleView from './RegularScheduleView';
import ExamScheduleViewLecturer from './ExamScheduleViewLecturer'; // Modified for lecturer panel
import CreateRegularScheduleModal from './CreateRegularScheduleModal';
import { FiPlus } from 'react-icons/fi'; // Plus icon for "Create Schedule" button
import { CalendarDays } from 'lucide-react';

const SchedulesModule = () => {
  // Define tabs for the lecturer panel
  const tabs = ["Regular Schedule", "Exam Schedule"];
  const [activeTab, setActiveTab] = useState(tabs[0]); // Default to "Regular Schedule"

  // State to manage modal for creating/editing regular schedules
  const [showCreateRegularScheduleModal, setShowCreateRegularScheduleModal] = useState(false);
  const [editingRegularSchedule, setEditingRegularSchedule] = useState(null); // Stores schedule data if in edit mode

  // Mock lecturer ID (replace with actual lecturer ID from context/auth in a real app)
  const currentlecturerId = "lecturer_T123";

  // In-memory state for lecturer's own regular schedules
  const [lecturerRegularSchedules, setlecturerRegularSchedules] = useState([
    // Mock Data for demonstration
    { id: 'trs1', lecturerId: 'lecturer_T123', dayOfWeek: 'Monday', startTime: '09:00', endTime: '09:45', subject: 'Mathematics', classId: 'MPC Year 1' },
    { id: 'trs2', lecturerId: 'lecturer_T123', dayOfWeek: 'Monday', startTime: '10:00', endTime: '10:45', subject: 'Physics', classId: 'MPC Year 2' },
    { id: 'trs3', lecturerId: 'lecturer_T123', dayOfWeek: 'Tuesday', startTime: '11:00', endTime: '11:45', subject: 'Chemistry', classId: 'BiPC Year 1' },
    { id: 'trs4', lecturerId: 'lecturer_T124', dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '09:45', subject: 'Biology', classId: 'BiPC Year 2' }, // Another lecturer's schedule
  ]);

  // In-memory state for exam schedules (read-only for lecturers, comes from Admin)
  const [adminExamSchedules, setAdminExamSchedules] = useState([
    // Mock Data for demonstration (consistent with Admin's data structure)
    { id: 'adm_exam1', classId: 'MPC Year 1', examType: 'Formative Assessment 1', date: '2025-07-10', time: '09:00', subject: 'Mathematics' },
    { id: 'adm_exam2', classId: 'MPC Year 2', examType: 'Formative Assessment 2', date: '2025-07-15', time: '11:00', subject: 'Physics' },
    { id: 'adm_exam3', classId: 'BiPC Year 1', examType: 'Summative Assessment 1', date: '2025-07-20', time: '10:30', subject: 'Chemistry' },
    { id: 'adm_exam4', classId: 'BiPC Year 2', examType: 'Formative Assessment 3', date: '2025-07-25', time: '14:00', subject: 'Biology' },
    { id: 'adm_exam5', classId: 'CEC Year 1', examType: 'Summative Assessment 2', date: '2025-08-01', time: '09:00', subject: 'Commerce' },
  ]);

  // Handler for opening the create/edit regular schedule modal
  const handleCreateOrEditRegularSchedule = (schedule = null) => {
    setEditingRegularSchedule(schedule); // Set null for creating new, set object for editing
    setShowCreateRegularScheduleModal(true); // Open the modal
  };

  // Handler for saving a regular schedule (add new or update existing)
  const handleSaveRegularSchedule = (scheduleData) => {
    if (editingRegularSchedule) {
      // Update existing regular schedule
      setlecturerRegularSchedules(prevSchedules =>
        prevSchedules.map(s => (s.id === editingRegularSchedule.id ? { ...s, ...scheduleData } : s))
      );
      console.log("Regular Schedule updated successfully!");
    } else {
      // Add new regular schedule
      const newSchedule = {
        ...scheduleData,
        id: `trs${Date.now()}`, // Unique ID for in-memory data
        lecturerId: currentlecturerId, // Assign to the current lecturer
      };
      setlecturerRegularSchedules(prevSchedules => [...prevSchedules, newSchedule]);
      console.log("Regular Schedule added successfully!");
    }
    setShowCreateRegularScheduleModal(false); // Close modal
    setEditingRegularSchedule(null); // Clear editing state
  };

  // Handler for deleting a regular schedule
  const handleDeleteRegularSchedule = (scheduleId) => {
    if (window.confirm("Are you sure you want to delete this regular schedule?")) {
      setlecturerRegularSchedules(prevSchedules =>
        prevSchedules.filter(s => s.id !== scheduleId)
      );
      console.log("Regular Schedule deleted successfully!");
    }
  };

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <CalendarDays size={32} className="text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Period & Exam Schedules
          </h1>
        </div>
        
        {activeTab === "Regular Schedule" && ( // Show "Create Schedule" button only for Regular Schedules
          <button
            onClick={() => handleCreateOrEditRegularSchedule(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FiPlus className="mr-2 text-xl" />
            Create Regular Schedule
          </button>
        )}
      </header>

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
          <RegularScheduleView
            lecturerRegularSchedules={lecturerRegularSchedules.filter(s => s.lecturerId === currentlecturerId)} // Filter for current lecturer
            onEditRegularSchedule={handleCreateOrEditRegularSchedule}
            onDeleteRegularSchedule={handleDeleteRegularSchedule}
          />
        )}
        {activeTab === "Exam Schedule" && (
          <ExamScheduleViewLecturer
            adminExamSchedules={adminExamSchedules} // All admin exam schedules
          />
        )}
      </div>

      {/* Create/Edit Regular Schedule Modal */}
      {showCreateRegularScheduleModal && (
        <CreateRegularScheduleModal
          initialData={editingRegularSchedule}
          onClose={() => {
            setShowCreateRegularScheduleModal(false);
            setEditingRegularSchedule(null);
          }}
          onSave={handleSaveRegularSchedule}
          classTabs={['MPC Year 1', 'MPC Year 2', 'BiPC Year 1', 'BiPC Year 2', 'CEC Year 1', 'CEC Year 2', 'MEC Year 1', 'MEC Year 2', 'HEC Year 1', 'HEC Year 2']} // Pass AP stream options
        />
      )}
    </div>
  );
};

export default SchedulesModule;