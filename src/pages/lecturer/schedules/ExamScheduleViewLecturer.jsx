// ExamScheduleViewLecturer.jsx
import React, { useState, useEffect } from 'react';

// Define all possible individual exam types for consistency
const AllExamTypes = [
  "Formative Assessment 1", "Formative Assessment 2", "Formative Assessment 3",
  "Summative Assessment 1", "Summative Assessment 2", "Summative Assessment 3"
];

// Helper function to categorize and sort schedules
const categorizeAndSortSchedules = (schedules, selectedClassId) => {
  const categories = {
    "Formative Assessment": [],
    "Summative Assessment": []
  };

  console.log("categorizeAndSortSchedules: Incoming schedules:", schedules);
  console.log("categorizeAndSortSchedules: Selected Class ID:", selectedClassId);

  // Filter schedules relevant to the currently selected class ID
  const filteredByClass = schedules.filter(
    (schedule) => schedule.classId === selectedClassId
  );

  console.log("categorizeAndSortSchedules: Filtered by class:", filteredByClass);

  // Assign each filtered schedule to its main category
  filteredByClass.forEach(schedule => {
    if (AllExamTypes.includes(schedule.examType)) {
        if (schedule.examType.includes("Formative Assessment")) {
            categories["Formative Assessment"].push(schedule);
        } else if (schedule.examType.includes("Summative Assessment")) {
            categories["Summative Assessment"].push(schedule);
        }
    }
  });

  // Sort schedules within each category by date and then time
  Object.values(categories).forEach(categorySchedules => {
    categorySchedules.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`);
      const dateTimeB = new Date(`${b.date}T${b.time}`);
      return dateTimeA - dateTimeB;
    });
  });

  console.log("categorizeAndSortSchedules: Categorized and sorted:", categories);
  return categories;
};


const ExamScheduleViewLecturer = ({ adminExamSchedules }) => {
  // Generate class options for the dropdown filter
  const classOptions = ['MPC Year 1', 'MPC Year 2', 'BiPC Year 1', 'BiPC Year 2', 'CEC Year 1', 'CEC Year 2', 'MEC Year 1', 'MEC Year 2', 'HEC Year 1', 'HEC Year 2'];
  const [selectedClassToView, setSelectedClassToView] = useState(classOptions[0]); // Default to MPC Year 1

  const [categorizedSchedules, setCategorizedSchedules] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    console.log("ExamScheduleViewLecturer useEffect: adminExamSchedules prop received:", adminExamSchedules);
    console.log("ExamScheduleViewLecturer useEffect: selectedClassToView state:", selectedClassToView);

    try {
      // Process and categorize the admin exam schedules for the currently selected class to view
      const categories = categorizeAndSortSchedules(adminExamSchedules, selectedClassToView);
      setCategorizedSchedules(categories);
    } catch (err) {
      console.error("Error categorizing exam schedules in useEffect:", err);
      setError("Failed to process exam schedules for display. Please check data format.");
    } finally {
      setLoading(false);
    }

  }, [adminExamSchedules, selectedClassToView]); // Re-run effect when adminExamSchedules or selectedClassToView changes

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-3">Loading exam schedules...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center py-8 text-lg font-medium">{error}</div>;
  }

  const hasAnySchedulesForSelectedClass = categorizedSchedules && Object.values(categorizedSchedules).some(arr => arr.length > 0);
  console.log("ExamScheduleViewLecturer: Has any schedules for selected class:", hasAnySchedulesForSelectedClass);


  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">FA's &  SA's Exam Schedules</h2>

      {!hasAnySchedulesForSelectedClass && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-6 rounded-lg shadow-md" role="alert">
          <p className="font-bold text-lg mb-2">No Exam Schedules Created!</p>
          <p>There are no exam schedules for <span className="font-semibold">{selectedClassToView}</span> across any assessment types yet.</p>
        </div>
      )}

      {/* Formative Assessment Section (Read-Only) */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">Formative Assessment</h3>
        {categorizedSchedules && categorizedSchedules["Formative Assessment"].length === 0 ? (
          <div className="bg-gray-50 border-l-4 border-gray-300 text-gray-700 p-4 rounded-md">
            <p>No available schedules for Formative Assessments in {selectedClassToView}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categorizedSchedules && categorizedSchedules["Formative Assessment"].map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{schedule.examType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {/* Summative Assessment Section (Read-Only) */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">Summative Assessment</h3>
        {categorizedSchedules && categorizedSchedules["Summative Assessment"].length === 0 ? (
          <div className="bg-gray-50 border-l-4 border-gray-300 text-gray-700 p-4 rounded-md">
            <p>No available schedules for Summative Assessments in {selectedClassToView}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categorizedSchedules && categorizedSchedules["Summative Assessment"].map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{schedule.examType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

export default ExamScheduleViewLecturer;