// AttendanceModule.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import ViewAttendance from './ViewAttendance';
import { Search, CalendarDays, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

const studentsData = [
  {id: 1,studentId: "MPC2024001",name: "Arjun Reddy",photo: "https://images.pexels.com/photos/3771118/pexels-photo-3771118.jpeg?auto=compress&cs=tinysrgb&w=1200",class: "MPC Year 1",section: "A"},
  {id: 2,studentId: "CEC2024002",name: "Priya Sharma",photo: "https://images.pexels.com/photos/3762804/pexels-photo=3762804.jpeg?auto=compress&cs=tinysrgb&w=1200",class: "CEC Year 1",section: "B"},
  {id: 3,studentId: "BiPC2024003",name: "Sneha Devi",photo: "https://images.pexels.com/photos/3771092/pexels-photo-3771092.jpeg?auto=compress&cs=tinysrgb&w=1200",class: "BiPC Year 1",section: "A"},
  {id: 4,studentId: "HEC2024004",name: "Rohan Joshi",photo: "https://images.pexels.com/photos/3771100/pexels-photo-3771100.jpeg?auto=compress&cs=tinysrgb&w=1200",class: "HEC Year 2",section: "C"},
  {id: 5,studentId: "MEC2024005",name: "Divya Lakshmi",photo: "https://images.pexels.com/photos/3771113/pexels-photo-3771113.jpeg?auto=compress&cs=tinysrgb&w=1200",class: "MEC Year 1",section: "B"},
  {id: 6,studentId: "MPC2024006",name: "Vikram Rao",photo: "https://images.pexels.com/photos/3771107/pexels-photo-3771107.jpeg?auto=compress&cs=tinysrgb&w=1200",class: "MPC Year 2",section: "A"},
  {id: 7,studentId: "BiPC2024007",name: "Kavya Rao",photo: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=1200",class: "BiPC Year 2",section: "A"},
  {id: 8,studentId: "CEC2024008",name: "Karthik Nair",photo: "https://images.pexels.com/photos/3771110/pexels-photo-3771110.jpeg?auto=compress&cs=tinysrgb&w=1200",class: "CEC Year 2",section: "B"},
  {id: 9,studentId: "HEC2024009",name: "Ananya Reddy",photo: "https://images.pexels.com/photos/3771095/pexels-photo-3771095.jpeg?auto=compress&cs=tinysrgb&w=1200",class: "HEC Year 1",section: "A"},
  {id: 10,studentId: "MEC2024010",name: "Rahul Gupta",photo: "https://images.pexels.com/photos/3771119/pexels-photo-3771119.jpeg?auto=compress&cs=tinysrgb&w=1200",class: "MEC Year 2",section: "C"},
];


const initialAttendance = (data) =>
  data.reduce((acc, item) => {
    acc[item.id] = { status: '', checkOut: null, comment: null }; // Changed default status to empty string
    return acc;
  }, {});

const getToday = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

const classes = ["MPC Year 1", "MPC Year 2", "BiPC Year 1", "BiPC Year 2", "CEC Year 1", "CEC Year 2", "MEC Year 1", "MEC Year 2", "HEC Year 1", "HEC Year 2"];
const sections = ['A', 'B', 'C', 'D'];
const attendanceStatuses = ['', 'Present', 'Absent', 'Half Day', 'Leave']; // Added empty string for "Select Status"
const predefinedComments = [
  "", // Option for no comment selected (displays "Select Comment")
  "Sick Leave",
  "Family Event",
  "Vacation",
  "Emergency",
  "Other"
];

const AttendanceModule = () => {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [attendanceByDate, setAttendanceByDate] = useState({
    [getToday()]: {
      students: initialAttendance(studentsData),
    },
  });
  const [search, setSearch] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [currentView, setCurrentView] = useState('AttendanceModule');

  useEffect(() => {
    setAttendanceByDate((prev) => {
      if (!prev[selectedDate]) {
        return {
          ...prev,
          [selectedDate]: {
            students: initialAttendance(studentsData),
          },
        };
      }
      return prev;
    });
  }, [selectedDate]);

  const handleStatusChange = (id, status, checkOutTime = null, commentVal = null) => {
    setAttendanceByDate((prev) => {
        const currentStudentData = prev[selectedDate]?.students[id] || {};
        let newComment = currentStudentData.comment; // Default to existing comment

        if (status === 'Absent') {
            newComment = "Not Informed";
        } else if (status === 'Leave' || status === 'Half Day') { // Modified line
            // If changing to Leave or Half Day, and commentVal is provided, use it. Otherwise, keep existing or default to empty string.
            newComment = commentVal !== null ? commentVal : (currentStudentData.comment || "");
        } else {
            newComment = null; // Clear comment for Present
        }

        return {
            ...prev,
            [selectedDate]: {
                ...prev[selectedDate],
                students: {
                    ...prev[selectedDate].students,
                    [id]: {
                        status: status,
                        checkOut: status === 'Half Day' ? (checkOutTime || '12:00') : null,
                        comment: newComment,
                    },
                },
            },
        };
    });
  };

  const handleSaveAttendance = () => {
    console.log("Saving attendance for date:", selectedDate);
    console.log("Attendance data:", currentAttendance.students);
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    messageBox.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <p class="text-lg font-semibold text-gray-800 mb-4">Attendance Saved!</p>
        <button id="closeMessageBox" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">OK</button>
      </div>
    `;
    document.body.appendChild(messageBox);
    document.getElementById('closeMessageBox').onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  const filteredStudents = studentsData.filter((s) =>
    (selectedClass === '' || s.class === selectedClass) &&
    (selectedSection === '' || s.section === selectedSection) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) ||
    String(s.class).toLowerCase().includes(search.toLowerCase()) ||
    s.section.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId.toLowerCase().includes(search.toLowerCase()))
  );

  const currentAttendance = attendanceByDate[selectedDate] || {
    students: initialAttendance(studentsData),
  };

  const handleViewChange = (viewName) => {
    setCurrentView(viewName);
  };

  if (currentView === 'ViewAttendance') {
    return <ViewAttendance onViewChange={handleViewChange} />;
  }

  const showCheckOutColumn = Object.values(currentAttendance.students).some(student => student.status === 'Half Day');
  // Comment column should show if ANY student is Absent OR Leave OR Half Day - Modified line
  const showCommentColumn = Object.values(currentAttendance.students).some(
    student => student.status === 'Absent' || student.status === 'Leave' || student.status === 'Half Day'
  );

  const getStatusDisplayClasses = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-50 text-green-800 border-green-300';
      case 'Absent': return 'bg-red-50 text-red-800 border-red-300';
      case 'Half Day': return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Leave': return 'bg-yellow-50 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-50 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    const size = 16;
    switch (status) {
      case 'Present': return <CheckCircle2 size={size} className="text-green-600" />;
      case 'Absent': return <XCircle size={size} className="text-red-600" />;
      case 'Half Day': return <Clock size={size} className="text-blue-600" />;
      case 'Leave': return <AlertCircle size={size} className="text-yellow-600" />;
      default: return null;
    }
  };

  let tableColumns = [
    { header: 'Photo', accessor: 'photo', className: 'w-16 px-4 py-3' },
    { header: 'Name', accessor: 'name', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
    { header: 'Student ID', accessor: 'studentId', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
    { header: 'Stream', accessor: 'class', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
    { header: 'Section', accessor: 'section', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
    { header: 'Status', accessor: 'status', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
  ];

  if (showCheckOutColumn) {
    tableColumns.push({ header: 'CheckOut Time', accessor: 'checkOut', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' });
  }
  if (showCommentColumn) {
    tableColumns.push({ header: 'Comment', accessor: 'comment', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' });
  }


  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <CalendarDays size={32} className="text-indigo-600" />
          Attendance Management
        </h1>
        <button
          onClick={() => handleViewChange('ViewAttendance')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out font-semibold"
        >
          View My Attendance
        </button>
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Toggle Search"
        >
          <Search size={24} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search by name, program, section or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 w-72"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
          <label htmlFor="attendance-date" className="font-semibold text-gray-700">Date:</label>
          <input
            id="attendance-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          />

          <label htmlFor="attendance-class" className="font-semibold text-gray-700 ml-4">Stream:</label>
          <select
            id="attendance-class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          >
            <option value="">All Streams</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>

          <label htmlFor="attendance-section" className="font-semibold text-gray-700 ml-4">Section:</label>
          <select
            id="attendance-section"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          >
            <option value="">All Sections</option>
            {sections.map((sec) => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
        </div>

        {showMobileSearch && (
          <div className="relative w-full md:hidden mt-4">
            <input
              type="text"
              placeholder="Search by name, program, section or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 w-full"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        )}
      </div>

      <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-inner border border-gray-200">
        <Table
          columns={tableColumns}
          data={filteredStudents}
          renderRow={(student) => (
            <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150">
              <td className="py-3 px-4"><img src={student.photo} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm" /></td>
              <td className="py-3 px-4 text-sm text-gray-800 font-medium">{student.name}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{student.studentId}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{student.class}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{student.section}</td>
              <td className="py-3 px-4">
                <div className="relative flex items-center">
                  <span className="absolute left-3">
                    {getStatusIcon(currentAttendance.students[student.id]?.status)} {/* No default 'Present' here */}
                  </span>
                  <select
                    value={currentAttendance.students[student.id]?.status || ''} // Set default value to empty string
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      const checkOutVal = currentAttendance.students[student.id]?.checkOut;
                      const commentVal = currentAttendance.students[student.id]?.comment;
                      handleStatusChange(student.id, newStatus, checkOutVal, commentVal);
                    }}
                    className={`
                      block w-full pl-10 pr-3 py-1.5 rounded-md border text-sm font-medium appearance-none
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                      ${getStatusDisplayClasses(currentAttendance.students[student.id]?.status || '')} {/* Apply classes based on current or empty status */}
                    `}
                  >
                    {attendanceStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status === '' ? 'Select Status' : status} {/* Display "Select Status" for empty value */}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
              {showCheckOutColumn && (
                <td className="py-3 px-4">
                  {currentAttendance.students[student.id]?.status === 'Half Day' ? (
                    <input
                      type="time"
                      value={currentAttendance.students[student.id]?.checkOut || '12:00'}
                      onChange={(e) => handleStatusChange(student.id, 'Half Day', e.target.value, currentAttendance.students[student.id]?.comment)}
                      className="w-24 border rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">--:--</span>
                  )}
                </td>
              )}
              {showCommentColumn && (
                <td className="py-3 px-4">
                  {currentAttendance.students[student.id]?.status === 'Absent' ? (
                    <span className="text-gray-700 text-sm font-medium">Not Informed</span>
                  ) : (currentAttendance.students[student.id]?.status === 'Leave' || currentAttendance.students[student.id]?.status === 'Half Day') ? ( // Modified line
                    <select
                      value={currentAttendance.students[student.id]?.comment || ''}
                      onChange={(e) =>
                        handleStatusChange(
                          student.id,
                          currentAttendance.students[student.id].status,
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
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSaveAttendance}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
};

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