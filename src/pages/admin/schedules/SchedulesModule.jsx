// SchedulesModule.jsx
import React, { useState, useEffect, useMemo } from 'react';
import ClassScheduleView from './ClassScheduleView';
import CreateScheduleModal from './CreateScheduleModal';
import { LayoutList, Plus } from 'lucide-react'; // Using Lucide icons for consistency

const SchedulesModule = () => {
  // State to store all exam schedules in memory.
  // Each schedule object now directly contains examType, date, time, subject.
  const [allSchedules, setAllSchedules] = useState([
    // Mock Data for AP Junior College streams
    {
      id: 'mock1',
      program: 'MPC',
      year: '1',
      examType: 'Formative Assessment 1',
      date: '2025-07-10',
      time: '09:00',
      course: 'Mathematics',
    },
    {
      id: 'mock2',
      program: 'MPC',
      year: '1',
      examType: 'Formative Assessment 1',
      date: '2025-07-15',
      time: '11:00',
      course: 'Physics',
    },
    {
      id: 'mock3',
      program: 'BiPC',
      year: '2',
      examType: 'Summative Assessment 1',
      date: '2025-07-20',
      time: '10:30',
      course: 'Biology',
    },
    {
      id: 'mock4',
      program: 'CEC',
      year: '1',
      examType: 'Summative Assessment 1',
      date: '2025-07-25',
      time: '14:00',
      course: 'Commerce',
    },
    {
      id: 'mock5',
      program: 'HEC',
      year: '2',
      examType: 'Summative Assessment 2',
      date: '2025-08-01',
      time: '09:00',
      course: 'History',
    },
  ]);

  // Define all possible program tabs from the data
  const programTabs = useMemo(() => 
    Array.from(new Set(allSchedules.map(s => s.program))).sort(), 
    [allSchedules]
  );

  // State to manage the active tab (selected program)
  const [selectedProgram, setSelectedProgram] = useState(programTabs[0] || '');

  // Update selectedProgram if programTabs changes and the current selection is no longer valid
  useEffect(() => {
    if (programTabs.length > 0 && !programTabs.includes(selectedProgram)) {
      setSelectedProgram(programTabs[0]);
    }
  }, [programTabs, selectedProgram]);

  // State to manage the visibility of the Create/Edit Schedule modal
  const [showCreateScheduleModal, setShowCreateScheduleModal] = useState(false);

  // State to hold the schedule data when editing an existing schedule
  const [editingSchedule, setEditingSchedule] = useState(null);

  // Handler for opening the create/edit modal
  const handleCreateOrEditSchedule = (scheduleToEdit = null) => {
    if (scheduleToEdit) {
      // Find all related schedules for the same program and exam type
      const relatedSchedules = allSchedules.filter(
        s => s.program === scheduleToEdit.program && s.examType === scheduleToEdit.examType
      );
      const courseSlots = relatedSchedules.map(s => ({
        course: s.course,
        date: s.date,
        time: s.time,
      }));
      setEditingSchedule({
        program: scheduleToEdit.program,
        examType: scheduleToEdit.examType,
        courseSlots: courseSlots,
      });
    } else {
      setEditingSchedule(null); // For creating a new schedule
    }
    setShowCreateScheduleModal(true); // Open the modal
  };

  // Handler for saving a schedule (add new or update existing)
  const handleSaveSchedule = (scheduleData) => {
    const newSchedules = scheduleData.courseSlots.map((slot, index) => ({
      id: `${Date.now()}-${index}`, // Generate a unique ID for each new entry
      program: scheduleData.program,
      examType: scheduleData.examType,
      course: slot.course,
      date: slot.date,
      time: slot.time,
    }));

    if (editingSchedule) {
      // Remove all old schedules for this program and exam type, then add the new/updated ones
      const otherSchedules = allSchedules.filter(
        s => !(s.program === editingSchedule.program && s.examType === editingSchedule.examType)
      );
      setAllSchedules([...otherSchedules, ...newSchedules]);
      console.log("Schedule updated successfully!");
    } else {
      // Add the new schedules to the list
      setAllSchedules(prevSchedules => [...prevSchedules, ...newSchedules]);
      console.log("Schedule added successfully!");
    }
    // Close the modal and reset editing state
    setShowCreateScheduleModal(false);
    setEditingSchedule(null);
  };

  // Handler for deleting a schedule by its ID
  const handleDeleteSchedule = (scheduleToDelete) => {
    // Confirm deletion with the user using the browser's native confirm dialog
    // NOTE: In a production application, you should replace window.confirm with a custom modal for better UX and styling.
    if (window.confirm(`Are you sure you want to delete all entries for ${scheduleToDelete.examType} in ${scheduleToDelete.program}?`)) {
      // Filter out all schedules that match the program and exam type of the one to be deleted
      setAllSchedules(prevSchedules =>
        prevSchedules.filter(s => 
          !(s.program === scheduleToDelete.program && s.examType === scheduleToDelete.examType))
      );
      console.log("Schedule deleted successfully!");
    }
  };

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        {/* Header and Create Schedule Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4 md:mb-0 flex items-center gap-3">
            <LayoutList size={36} className="text-purple-600" />
            Exam Schedules
          </h1>
          <button
            onClick={() => handleCreateOrEditSchedule(null)} // Pass null to indicate creating a new schedule
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition duration-200 shadow-md flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:-translate-y-0.5"
          >
            <Plus className="mr-2" size={20} />
            Create Schedule
          </button>
        </div>

        {/* Navigation Tabs for Streams */}
        <div className="flex flex-wrap gap-2 sm:gap-3 border-b border-gray-200 mb-8 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
          {programTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedProgram(tab)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium focus:outline-none transition-all duration-200 rounded-lg whitespace-nowrap
                ${selectedProgram === tab
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 transform hover:-translate-y-0.5'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="bg-white rounded-lg shadow-md p-6 min-h-[400px] border border-gray-200">
          {/* ClassScheduleView displays schedules for the currently active stream */}
          <ClassScheduleView
            allSchedules={allSchedules}
            selectedProgram={selectedProgram}
            onEditSchedule={handleCreateOrEditSchedule} // Pass handler for editing a schedule
            onDeleteSchedule={handleDeleteSchedule} // Pass handler for deleting a schedule
          />
        </div>

        {/* Create/Edit Schedule Modal - rendered conditionally based on showCreateScheduleModal state */}
        {showCreateScheduleModal && (
          <CreateScheduleModal
            initialData={editingSchedule} // Pass current schedule data for editing, null for creating
            onClose={() => {
              setShowCreateScheduleModal(false); // Close the modal
              setEditingSchedule(null); // Reset editing state when modal closes
            }}
            onSave={handleSaveSchedule} // Pass the save handler
            programTabs={programTabs} // Pass the list of stream tabs for the dropdown in the modal
          />
        )}
      </div>
  );
};

export default SchedulesModule;