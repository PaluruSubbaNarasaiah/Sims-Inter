// AttendanceModule.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { studentsData, lecturersData } from './AttendanceData'; // Assuming AttendanceData.js provides these arrays

// Import icons for a consistent look
import { Search, CalendarDays, Users, GraduationCap, CheckCircle2, XCircle, Clock, AlertCircle, X } from 'lucide-react';

const TABS = [
  { label: 'Lecturers', value: 'lecturers', icon: GraduationCap },
  { label: 'Students', value: 'students', icon: Users },
];

// Define possible attendance statuses for Students - 'Late' is removed for students
// Add "Select Status" as the first option
const studentAttendanceStatuses = ['', 'Present', 'Absent', 'Half Day', 'Leave'];
// Define possible attendance statuses for Lecturers
// Add "Select Status" as the first option
const lecturerAttendanceStatuses = ['', 'Present', 'Absent', 'Late', 'Half Day', 'Leave'];

// Define predefined comments for 'Leave' and 'Half Day' status
const predefinedComments = [
  "", // Option for no comment selected (displays "Select Comment")
  "Sick Leave",
  "Family Event",
  "Vacation",
  "Emergency",
  "Other"
];

// Helper to initialize attendance data for a given list of people
const initialAttendance = (data) =>
  data.reduce((acc, item) => {
    // Initialize with default status (empty string for "Select Status"), null checkIn, null checkOut, and null comment
    acc[item.id] = { status: '', checkIn: null, checkOut: null, comment: null };
    return acc;
  }, {});

// Helper to get today's date in YYYY-mm-dd format
const getToday = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

// Define available programs and semesters for filtering students
const programs = Array.from(new Set(studentsData.map(s => s.program)));
const semesters = Array.from(new Set(studentsData.map(s => s.semester))).sort((a, b) => a - b);

const AttendanceModule = () => {
  const [activeTab, setActiveTab] = useState('lecturers');
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const [alert, setAlert] = useState({ message: '', type: '' });
  const [attendanceByDate, setAttendanceByDate] = useState({
    [getToday()]: {
      students: initialAttendance(studentsData),
      lecturers: initialAttendance(lecturersData),
    },
  });
  const [search, setSearch] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Ensure attendance exists for selected date when date changes
  useEffect(() => {
    setAttendanceByDate((prev) => {
      if (!prev[selectedDate]) {
        return {
          ...prev,
          [selectedDate]: {
            students: initialAttendance(studentsData),
            lecturers: initialAttendance(lecturersData),
          },
        };
      }
      return prev;
    });
  }, [selectedDate]);

  // Handle status change for a specific person (student or lecturer)
  const handleStatusChange = (type, id, status, providedCheckInTime = null, providedCheckOutTime = null, commentVal = null) => {
    setAttendanceByDate((prev) => {
      const currentPersonData = prev[selectedDate]?.[type]?.[id] || {};
      let newCheckIn = null;
      let newCheckOut = null;
      let newComment = null;

      // Logic based on status
      switch (status) {
        case 'Present':
          // All fields are null for Present
          break;
        case 'Absent':
          newComment = "Not Informed";
          break;
        case 'Late': // Only lecturers can be 'Late'
          newCheckIn = providedCheckInTime !== null ? providedCheckInTime : (currentPersonData.checkIn || '09:00');
          break;
        case 'Half Day':
          newCheckOut = providedCheckOutTime !== null ? providedCheckOutTime : (currentPersonData.checkOut || '12:00');
          newComment = commentVal !== null ? commentVal : (currentPersonData.comment || ""); // Add comment for Half Day
          break;
        case 'Leave':
          newComment = commentVal !== null ? commentVal : (currentPersonData.comment || "");
          break;
        case '': // "Select Status" option
          newCheckIn = null;
          newCheckOut = null;
          newComment = null;
          break;
        default:
          break;
      }

      return {
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          [type]: {
            ...prev[selectedDate][type],
            [id]: {
              status: status,
              checkIn: newCheckIn,
              checkOut: newCheckOut,
              comment: newComment,
            },
          },
        },
      };
    });
  };

  // Handle saving attendance data with error handling
  const handleSaveAttendance = () => {
    try {
      // In a real application, you would send `attendanceByDate` to a backend API here.
      console.log("Saving attendance for date:", selectedDate);
      console.log("Current attendance data:", attendanceByDate[selectedDate]);

      // Example of a simple validation before saving
      if (!attendanceByDate[selectedDate]) {
        throw new Error("No attendance data to save for the selected date.");
      }

      setAlert({ message: 'Attendance saved successfully!', type: 'success' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000); // Clear alert after 3 seconds
    } catch (error) {
      console.error("Failed to save attendance:", error);
      setAlert({ message: `Failed to save attendance: ${error.message}`, type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 5000); // Clear alert after 5 seconds
    }
  };

  // Filter students based on selected program, semester, and search query
  const filteredStudents = studentsData.filter((s) =>
    (selectedProgram === '' || s.program === selectedProgram) &&
    (selectedSemester === '' || s.semester === parseInt(selectedSemester)) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId.toLowerCase().includes(search.toLowerCase()))
  );

  // Get unique courses from lecturersData for the dropdown
  const allCourses = Array.from(new Set(lecturersData.flatMap(t => t.courses)));

  // Filter lecturers based on selected course and search query
  const filteredLecturers = lecturersData.filter((t) =>
    (selectedCourse === '' || t.courses.includes(selectedCourse)) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.courses.join(', ').toLowerCase().includes(search.toLowerCase()) ||
    t.lecturerId.toLowerCase().includes(search.toLowerCase()))
  );

  // Get current attendance data for the selected date
  const currentAttendance = attendanceByDate[selectedDate] || {
    students: initialAttendance(studentsData),
    lecturers: initialAttendance(lecturersData),
  };

  // Helper function to get status display classes for the dropdown
  const getStatusDisplayClasses = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-50 text-green-800 border-green-300';
      case 'Absent': return 'bg-red-50 text-red-800 border-red-300';
      case 'Late': return 'bg-yellow-50 text-yellow-800 border-yellow-300';
      case 'Half Day': return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Leave': return 'bg-orange-50 text-orange-800 border-orange-300';
      case '': return 'bg-gray-50 text-gray-800 border-gray-300'; // For "Select Status"
      default: return 'bg-gray-50 text-gray-800 border-gray-300';
    }
  };

  // Helper function to get status icon for the dropdown
  const getStatusIcon = (status) => {
    const size = 16;
    switch (status) {
      case 'Present': return <CheckCircle2 size={size} className="text-green-600" />;
      case 'Absent': return <XCircle size={size} className="text-red-600" />;
      case 'Late': return <Clock size={size} className="text-yellow-600" />;
      case 'Half Day': return <Clock size={size} className="text-blue-600" />;
      case 'Leave': return <AlertCircle size={size} className="text-orange-600" />;
      default: return null;
    }
  };

  // Determine if CheckIn Time column should be shown (only for Lecturers tab if Late status is present)
  const showCheckInColumnForLecturers = activeTab === 'lecturers' && Object.values(currentAttendance.lecturers).some(lecturer => lecturer.status === 'Late');

  // Determine if CheckOut Time column should be shown for Students
  const showCheckOutColumnForStudents = activeTab === 'students' && Object.values(currentAttendance.students).some(student => student.status === 'Half Day');
  // Determine if CheckOut Time column should be shown for Lecturers
  const showCheckOutColumnForLecturers = activeTab === 'lecturers' && Object.values(currentAttendance.lecturers).some(lecturer => lecturer.status === 'Half Day');

  // Determine if Comment column should be shown for Students
  const showCommentColumnForStudents = activeTab === 'students' && Object.values(currentAttendance.students).some(
    student => student.status === 'Absent' || student.status === 'Leave' || student.status === 'Half Day' // Added Half Day
  );
  // Determine if Comment column should be shown for Lecturers
  const showCommentColumnForLecturers = activeTab === 'lecturers' && Object.values(currentAttendance.lecturers).some(
    lecturer => lecturer.status === 'Absent' || lecturer.status === 'Leave' || lecturer.status === 'Half Day' // Added Half Day
  );

  // Define columns for the student table
  let studentTableColumns = [
    { header: 'Photo', accessor: 'photo', className: 'w-16 px-4 py-3' },
    { header: 'Name', accessor: 'name', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
    { header: 'Student ID', accessor: 'studentId', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
    { header: 'Stream', accessor: 'program', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
    { header: 'Year', accessor: 'semester', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
    { header: 'Status', accessor: 'status', className: 'w-56 px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
  ];
  // Conditionally add CheckOut Time column for students
  if (showCheckOutColumnForStudents) {
    studentTableColumns.push({ header: 'CheckOut Time', accessor: 'checkOut', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' });
  }
  // Conditionally add Comment column for students
  if (showCommentColumnForStudents) {
    studentTableColumns.push({ header: 'Comment', accessor: 'comment', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' });
  }

  // Define columns for the lecturer table
  let lecturerTableColumns = [
    { header: 'Photo', accessor: 'photo', className: 'w-16 px-4 py-3' },
    { header: 'Name', accessor: 'name', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
    { header: 'Lecturer ID', accessor: 'lecturerId', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
    { header: 'Subjects', accessor: 'courses', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
    { header: 'Status', accessor: 'status', className: 'w-56 px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
  ];
  // Conditionally add CheckIn Time column for lecturers
  if (showCheckInColumnForLecturers) {
    lecturerTableColumns.push({ header: 'CheckIn Time', accessor: 'checkIn', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' });
  }
  // Conditionally add CheckOut Time column for lecturers
  if (showCheckOutColumnForLecturers) {
    lecturerTableColumns.push({ header: 'CheckOut Time', accessor: 'checkOut', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' });
  }
  // Conditionally add Comment column for lecturers
  if (showCommentColumnForLecturers) {
    lecturerTableColumns.push({ header: 'Comment', accessor: 'comment', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' });
  }


  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <CalendarDays size={32} className="text-indigo-600" />
            Attendance Management
          </h1>
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle Search"
          >
            <Search size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 border-b border-gray-200 pb-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-t-lg font-medium text-lg transition-colors duration-200
                  ${activeTab === tab.value
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input, Date Selector and Filters (Class/Section or Subject) */}
        <div className="flex flex-col md:flex-row justify-start items-center gap-4 md:gap-8 mb-6">
          {/* Search Input - Desktop */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder={`Search by name, ${activeTab === 'students' ? 'ID' : 'courses or ID'}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 w-72"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Search Input - Mobile (toggleable) */}
          {showMobileSearch && (
            <div className="relative w-full md:hidden mt-4">
              <input
                type="text"
                placeholder={`Search by name, ${activeTab === 'students' ? 'ID' : 'courses or ID'}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <label htmlFor="attendance-date" className="font-semibold text-gray-700">Date:</label>
            <input
              id="attendance-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />

            {activeTab === 'students' && (
              <>
                <label htmlFor="attendance-program" className="font-semibold text-gray-700 ml-4">Stream:</label>
                <select
                  id="attendance-program"
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="">All Streams</option>
                  {programs.map((prog) => (
                    <option key={prog} value={prog}>{prog}</option>
                  ))}
                </select>

                <label htmlFor="attendance-semester" className="font-semibold text-gray-700 ml-4">Year:</label>
                <select
                  id="attendance-semester"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="">All Years</option>
                  {semesters.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </>
            )}

            {activeTab === 'lecturers' && (
              <>
                <label htmlFor="attendance-course" className="font-semibold text-gray-700 ml-4">Subject:</label>
                <select
                  id="attendance-course"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="">All Subjects</option>
                  {allCourses.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-inner border border-gray-200">
          {activeTab === 'students' ? (
            <Table
              columns={studentTableColumns}
              data={filteredStudents}
              renderRow={(student) => (
                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150">
                  <td className="py-3 px-4"><img src={student.photo} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm" /></td>
                  <td className="py-3 px-4 text-sm text-gray-800 font-medium">{student.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{student.studentId}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{student.program}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{student.semester}</td>
                  <td className="py-3 px-4">
                    <div className="relative flex items-center">
                      <span className="absolute left-3 pointer-events-none">
                        {getStatusIcon(currentAttendance.students[student.id]?.status || '')} {/* Default to empty string for initial state */}
                      </span>
                      <select
                        value={currentAttendance.students[student.id]?.status || ''} 
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          const currentCheckIn = currentAttendance.students[student.id]?.checkIn;
                          const currentCheckOut = currentAttendance.students[student.id]?.checkOut;
                          const currentComment = currentAttendance.students[student.id]?.comment;
                          handleStatusChange('students', student.id, newStatus, currentCheckIn, currentCheckOut, currentComment);
                        }}
                        className={`
                          block w-full pl-10 pr-3 py-1.5 rounded-md border text-sm font-medium appearance-none
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                          ${getStatusDisplayClasses(currentAttendance.students[student.id]?.status || '')}
                        `}
                      >
                        {/* Use studentAttendanceStatuses for students */}
                        {studentAttendanceStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status === "" ? "Select Status" : status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  {showCheckOutColumnForStudents && ( // Use student-specific flag
                    <td className="py-3 px-4">
                      {currentAttendance.students[student.id]?.status === 'Half Day' ? (
                        <input
                          type="time"
                          value={currentAttendance.students[student.id]?.checkOut || '12:00'}
                          onChange={(e) => handleStatusChange('students', student.id, 'Half Day', null, e.target.value, currentAttendance.students[student.id]?.comment)}
                          className="w-24 border rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">--:--</span>
                      )}
                    </td>
                  )}
                  {showCommentColumnForStudents && ( // Use student-specific flag
                    <td className="py-3 px-4">
                      {currentAttendance.students[student.id]?.status === 'Absent' ? (
                        <span className="text-gray-700 text-sm font-medium">Not Informed</span>
                      ) : (currentAttendance.students[student.id]?.status === 'Leave' || currentAttendance.students[student.id]?.status === 'Half Day') ? ( // Added Half Day
                        <select
                          value={currentAttendance.students[student.id]?.comment || ''}
                          onChange={(e) =>
                            handleStatusChange(
                              'students',
                              student.id,
                              currentAttendance.students[student.id].status,
                              null, // checkIn
                              currentAttendance.students[student.id].checkOut,
                              e.target.value
                            )
                          }
                          className="w-full border rounded px-2 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {predefinedComments.map((comment, index) => (
                            <option key={index} value={comment}>
                              {comment === "" ? "Select Comment" : comment}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-gray-500 text-sm">--</span>
                      )}
                    </td>
                  )}
                </tr>
              )}
            />
          ) : (
            <Table
              columns={lecturerTableColumns}
              data={filteredLecturers}
              renderRow={(lecturer) => (
                <tr key={lecturer.id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150">
                  <td className="py-3 px-4"><img src={lecturer.photo} alt={lecturer.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm" /></td>
                  <td className="py-3 px-4 text-sm text-gray-800 font-medium">{lecturer.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{lecturer.lecturerId}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{lecturer.courses.join(', ')}</td>
                  <td className="py-3 px-4">
                    <div className="relative flex items-center">
                      <span className="absolute left-3 pointer-events-none">
                        {getStatusIcon(currentAttendance.lecturers[lecturer.id]?.status || '')} {/* Default to empty string for initial state */}
                      </span>
                      <select
                        value={currentAttendance.lecturers[lecturer.id]?.status || ''}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          const currentCheckIn = currentAttendance.lecturers[lecturer.id]?.checkIn;
                          const currentCheckOut = currentAttendance.lecturers[lecturer.id]?.checkOut;
                          const currentComment = currentAttendance.lecturers[lecturer.id]?.comment;
                          handleStatusChange('lecturers', lecturer.id, newStatus, currentCheckIn, currentCheckOut, currentComment);
                        }}
                        className={`
                          block w-full pl-10 pr-3 py-1.5 rounded-md border text-sm font-medium appearance-none
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                          ${getStatusDisplayClasses(currentAttendance.lecturers[lecturer.id]?.status || '')}
                        `}
                      >
                        {/* Use lecturerAttendanceStatuses for lecturers */}
                        {lecturerAttendanceStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status === "" ? "Select Status" : status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  {showCheckInColumnForLecturers && ( // Use lecturer-specific flag
                    <td className="py-3 px-4">
                      {currentAttendance.lecturers[lecturer.id]?.status === 'Late' ? (
                        <input
                          type="time"
                          value={currentAttendance.lecturers[lecturer.id]?.checkIn || '09:00'}
                          onChange={(e) => handleStatusChange('lecturers', lecturer.id, 'Late', e.target.value, null, currentAttendance.lecturers[lecturer.id]?.comment)}
                          className="w-24 border rounded px-2 py-1 text-sm focus:ring-orange-500 focus:border-orange-500"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">--:--</span>
                      )}
                    </td>
                  )}
                  {showCheckOutColumnForLecturers && ( // Use lecturer-specific flag
                    <td className="py-3 px-4">
                      {currentAttendance.lecturers[lecturer.id]?.status === 'Half Day' ? (
                        <input
                          type="time"
                          value={currentAttendance.lecturers[lecturer.id]?.checkOut || '12:00'}
                          onChange={(e) => handleStatusChange('lecturers', lecturer.id, 'Half Day', null, e.target.value, currentAttendance.lecturers[lecturer.id]?.comment)}
                          className="w-24 border rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">--:--</span>
                      )}
                    </td>
                  )}
                  {showCommentColumnForLecturers && ( // Use lecturer-specific flag
                    <td className="py-3 px-4">
                      {currentAttendance.lecturers[lecturer.id]?.status === 'Absent' ? (
                        <span className="text-gray-700 text-sm font-medium">Not Informed</span>
                      ) : (currentAttendance.lecturers[lecturer.id]?.status === 'Leave' || currentAttendance.lecturers[lecturer.id]?.status === 'Half Day') ? ( // Added Half Day
                        <select
                          value={currentAttendance.lecturers[lecturer.id]?.comment || ''}
                          onChange={(e) =>
                            handleStatusChange(
                              'lecturers',
                              lecturer.id,
                              currentAttendance.lecturers[lecturer.id].status,
                              currentAttendance.lecturers[lecturer.id].checkIn,
                              currentAttendance.lecturers[lecturer.id].checkOut,
                              e.target.value
                            )
                          }
                          className="w-full border rounded px-2 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {predefinedComments.map((comment, index) => (
                            <option key={index} value={comment}>
                              {comment === "" ? "Select Comment" : comment}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-gray-500 text-sm">--</span>
                      )}
                    </td>
                  )}
                </tr>
              )}
            />
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveAttendance}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Save Attendance
          </button>
        </div>
      </div>
  );
};

// Integrated Table Component
function Table({ columns, renderRow, data }) {
  return (
    <table className="w-full mt-4">
      <thead>
        <tr className="text-left text-gray-500 text-sm">
          {columns.map((col) => (
            <th key={col.accessor} className={col.className}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((item) => renderRow(item))}</tbody>
    </table>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    header: PropTypes.string.isRequired,
    accessor: PropTypes.string.isRequired,
    className: PropTypes.string
  })).isRequired,
  renderRow: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired
};

export default AttendanceModule;