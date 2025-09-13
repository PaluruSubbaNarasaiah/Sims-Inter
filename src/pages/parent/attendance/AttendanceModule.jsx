import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock, Calendar as CalendarIcon, Ban, CalendarDays } from 'lucide-react';
import { FaCheckCircle } from "react-icons/fa"; // Import FaCheckCircle for child selection UI
import Calendar from './Calendar'; // Assuming Calendar.jsx is in the same directory

const AttendanceModule = () => {
    // Mock data for students in AP junior college
    const [studentInfo] = useState({
        students: [
            {
                id: 'student1',
                name: "Arjun Kumar",
                course: "MPC",
                subjects: "Mathematics, Physics, Chemistry",
                semester: "2nd Year",
                rollNumber: "MPC23001",
                profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
            },
            {
                id: 'student2',
                name: "Priya Reddy",
                course: "BiPC",
                subjects: "Biology, Physics, Chemistry",
                semester: "1st Year",
                rollNumber: "BPC24002",
                profilePic: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
            },
            {
                id: 'student3',
                name: "Kiran Sharma",
                course: "CEC",
                subjects: "Commerce, Economics, Civics",
                semester: "2nd Year",
                rollNumber: "CEC23003",
                profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
            }
        ]
    });

    // Sample data - Junior College attendance with lectures and practical sessions
    const [allAttendanceDataByStudent] = useState({
        'student1': [
            // Arjun Kumar's Attendance (May, June, July 2025) - MPC Stream
            { date: '2025-05-01', status: 'leave', reason: 'Labour Day' },
            { date: '2025-05-02', status: 'present' },
            { date: '2025-05-03', status: 'present' },
            { date: '2025-05-06', status: 'absent', reason: 'Not Informed' },
            { date: '2025-05-07', status: 'present' },
            { date: '2025-05-08', status: 'present' },
            { date: '2025-05-09', status: 'half-day', reason: 'Physics practical only', checkOut: '12:00' },
            { date: '2025-05-13', status: 'present' },

            { date: '2025-06-03', status: 'present' },
            { date: '2025-06-04', status: 'present' },
            { date: '2025-06-05', status: 'absent', reason: 'Not Informed' },
            { date: '2025-06-06', status: 'present' },
            { date: '2025-06-07', status: 'present' },
            { date: '2025-06-10', status: 'present' },
            { date: '2025-06-17', status: 'leave', reason: 'Bakri Eid' },
            { date: '2025-06-20', status: 'half-day', reason: 'Mathematics class only', checkOut: '12:00' },
            { date: '2025-06-21', status: 'present' },
            { date: '2025-06-23', status: 'present' },

            // Alex Johnson's Attendance (July 2025)
            { date: '2025-07-01', status: 'present' },
            { date: '2025-07-02', status: 'present' },
            { date: '2025-07-03', status: 'half-day', reason: 'Project presentation', checkOut: '12:30' },
            { date: '2025-07-04', status: 'present' },
            { date: '2025-07-07', status: 'absent', reason: 'Not Informed' },
            { date: '2025-07-08', status: 'present' },
            { date: '2025-07-09', status: 'present' },
            { date: '2025-07-10', status: 'leave', reason: 'Medical Leave' },
            { date: '2025-07-11', status: 'present' },
            { date: '2025-07-14', status: 'present' },
            { date: '2025-07-15', status: 'present' },
            { date: '2025-07-16', status: 'half-day', reason: 'Internship interview', checkOut: '11:45' },
            { date: '2025-07-17', status: 'present' },
            { date: '2025-07-18', status: 'present' },
            { date: '2025-07-21', status: 'absent', reason: 'Not Informed' },
            { date: '2025-07-22', status: 'present' },
            { date: '2025-07-23', status: 'present' },
        ],
        'student2': [
            // Priya Reddy's Attendance (May, June, July 2025) - BiPC Stream

            { date: '2025-05-01', status: 'leave', reason: 'Labour Day' },
            { date: '2025-05-02', status: 'present' },
            { date: '2025-05-03', status: 'present' },
            { date: '2025-05-06', status: 'present' },
            { date: '2025-05-07', status: 'absent', reason: 'Not Informed' },
            { date: '2025-05-08', status: 'present' },
            { date: '2025-05-09', status: 'present' },
            { date: '2025-05-13', status: 'present' },

            { date: '2025-06-03', status: 'present' },
            { date: '2025-06-04', status: 'present' },
            { date: '2025-06-05', status: 'present' },
            { date: '2025-06-06', status: 'absent', reason: 'Not Informed' },
            { date: '2025-06-07', status: 'present' },
            { date: '2025-06-10', status: 'present' },
            { date: '2025-06-17', status: 'leave', reason: 'Bakri Eid' },
            { date: '2025-06-20', status: 'present' },
            { date: '2025-06-21', status: 'present' },
            { date: '2025-06-23', status: 'present' },

            // Emily Johnson's Attendance (July 2025)
            { date: '2025-07-01', status: 'present' },
            { date: '2025-07-02', status: 'present' },
            { date: '2025-07-03', status: 'present' },
            { date: '2025-07-04', status: 'half-day', reason: 'Practical exam', checkOut: '13:00' },
            { date: '2025-07-07', status: 'present' },
            { date: '2025-07-08', status: 'present' },
            { date: '2025-07-09', status: 'absent', reason: 'Not Informed' },
            { date: '2025-07-10', status: 'present' },
            { date: '2025-07-11', status: 'present' },
            { date: '2025-07-14', status: 'leave', reason: 'Study Leave' },
            { date: '2025-07-15', status: 'leave', reason: 'Study Leave' },
            { date: '2025-07-16', status: 'present' },
            { date: '2025-07-17', status: 'half-day', reason: 'Seminar attendance', checkOut: '12:15' },
            { date: '2025-07-18', status: 'present' },
            { date: '2025-07-21', status: 'present' },
            { date: '2025-07-22', status: 'absent', reason: 'Not Informed' },
            { date: '2025-07-23', status: 'present' },
        ],
        'student3': [
            // Kiran Sharma's Attendance (May, June, July 2025) - CEC Stream
            { date: '2025-05-01', status: 'leave', reason: 'Labour Day' },
            { date: '2025-05-02', status: 'present' },
            { date: '2025-05-03', status: 'present' },
            { date: '2025-05-06', status: 'present' },
            { date: '2025-05-07', status: 'present' },
            { date: '2025-05-08', status: 'absent', reason: 'Not Informed' },
            { date: '2025-05-09', status: 'half-day', reason: 'Commerce practical', checkOut: '12:30' },
            { date: '2025-05-13', status: 'present' },

            { date: '2025-06-03', status: 'present' },
            { date: '2025-06-04', status: 'present' },
            { date: '2025-06-05', status: 'present' },
            { date: '2025-06-06', status: 'present' },
            { date: '2025-06-07', status: 'present' },
            { date: '2025-06-10', status: 'absent', reason: 'Not Informed' },
            { date: '2025-06-17', status: 'leave', reason: 'Bakri Eid' },
            { date: '2025-06-20', status: 'present' },
            { date: '2025-06-21', status: 'half-day', reason: 'Economics seminar', checkOut: '13:00' },
            { date: '2025-06-23', status: 'present' },

            { date: '2025-07-01', status: 'present' },
            { date: '2025-07-02', status: 'present' },
            { date: '2025-07-03', status: 'present' },
            { date: '2025-07-04', status: 'present' },
            { date: '2025-07-07', status: 'present' },
            { date: '2025-07-08', status: 'present' },
            { date: '2025-07-09', status: 'present' },
            { date: '2025-07-10', status: 'present' },
            { date: '2025-07-11', status: 'absent', reason: 'Not Informed' },
            { date: '2025-07-14', status: 'present' },
            { date: '2025-07-15', status: 'present' },
            { date: '2025-07-16', status: 'half-day', reason: 'CA Foundation class', checkOut: '12:00' },
            { date: '2025-07-17', status: 'present' },
            { date: '2025-07-18', status: 'present' },
            { date: '2025-07-21', status: 'present' },
            { date: '2025-07-22', status: 'present' },
            { date: '2025-07-23', status: 'present' },
        ]
    });

    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [monthlyAttendanceData, setMonthlyAttendanceData] = useState([]);
    const [stats, setStats] = useState({
        present: 0,
        absent: 0,
        halfDays: 0,
        leave: 0
    });

    // Set initial selected student and attendance data
    useEffect(() => {
        if (studentInfo.students && studentInfo.students.length > 0) {
            setSelectedStudentId(studentInfo.students[0].id);
        }
    }, [studentInfo.students]);

    // Filter attendance data for the current month and selected student
    useEffect(() => {
        if (!selectedStudentId) {
            setMonthlyAttendanceData([]);
            return;
        }

        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth(); // 0-indexed month

        const studentAttendance = allAttendanceDataByStudent[selectedStudentId] || [];

        const filteredData = studentAttendance.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getFullYear() === year && itemDate.getMonth() === month;
        });
        setMonthlyAttendanceData(filteredData);
        setSelectedDate(null); // Clear selected date when student or month changes
    }, [currentMonth, selectedStudentId, allAttendanceDataByStudent]);

    // Calculate attendance stats for the monthlyAttendanceData
    useEffect(() => {
        const calculateStats = () => {
            const present = monthlyAttendanceData.filter(a => a.status === 'present').length;
            const absent = monthlyAttendanceData.filter(a => a.status === 'absent').length;
            const halfDays = monthlyAttendanceData.filter(a => a.status === 'half-day').length;
            const leave = monthlyAttendanceData.filter(a => a.status === 'leave').length;

            setStats({
                present,
                absent,
                halfDays,
                leave
            });
        };

        calculateStats();
    }, [monthlyAttendanceData]);

    // Helper function for coloring the status badge in details section
    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-800';
            case 'absent': return 'bg-red-100 text-red-800';
            case 'half-day': return 'bg-blue-100 text-blue-800';
            case 'leave': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Handle student selection
    const handleStudentSelect = (studentId) => {
        setSelectedStudentId(studentId);
        setCurrentMonth(new Date()); // Reset calendar to current month for new student
    };

    return (
        <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <CalendarDays size={32} className="text-indigo-600" />
                    Student Attendance
                </h1>
            </div>

            {/* Student Selector */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {studentInfo.students.map(student => (
                        <div
                            key={student.id}
                            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                                ${selectedStudentId === student.id ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                            onClick={() => handleStudentSelect(student.id)}
                        >
                            <img
                                src={student.profilePic}
                                alt={student.name}
                                className="rounded-full mr-3 border border-gray-200"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow">
                                <h6 className="mb-0 font-semibold text-gray-800">{student.name}</h6>
                                <small className="text-gray-500">{student.course} - {student.semester}</small>
                                <br />
                                <small className="text-gray-400">{student.subjects}</small>
                                <br />
                                <small className="text-gray-400">Roll: {student.rollNumber}</small>
                            </div>
                            {selectedStudentId === student.id && (
                                <FaCheckCircle className="text-blue-500 ml-auto" size={20} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Display message if no student is selected or no students exist */}
            {!selectedStudentId && (
                <div className="bg-blue-50 p-4 rounded-lg text-blue-800 flex items-center justify-center mb-6 shadow-sm">
                    <AlertCircle className="mr-2" size={20} />
                    Please select a student to view attendance records.
                </div>
            )}

            {selectedStudentId && (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col items-center justify-center text-center">
                            <CheckCircle className="text-green-600 mb-1" size={24} />
                            <h3 className="text-sm font-medium text-gray-500">Present</h3>
                            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col items-center justify-center text-center">
                            <XCircle className="text-red-600 mb-1" size={24} />
                            <h3 className="text-sm font-medium text-gray-500">Absent</h3>
                            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col items-center justify-center text-center">
                            <Clock className="text-blue-600 mb-1" size={24} />
                            <h3 className="text-sm font-medium text-gray-500">Half Days</h3>
                            <p className="text-2xl font-bold text-blue-600">{stats.halfDays}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col items-center justify-center text-center">
                            <AlertCircle className="text-yellow-600 mb-1" size={24} />
                            <h3 className="text-sm font-medium text-gray-500">Leaves</h3>
                            <p className="text-2xl font-bold text-yellow-600">{stats.leave}</p>
                        </div>
                    </div>

                    {/* Calendar View Component */}
                    <Calendar
                        currentMonth={currentMonth}
                        monthlyAttendanceData={monthlyAttendanceData}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        setCurrentMonth={setCurrentMonth}
                    />

                    {/* Attendance Details */}
                    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold">Attendance Details</h2>
                            <p className="text-sm text-gray-500">
                                {selectedDate
                                    ? `Details for ${selectedDate.date.toDateString()}`
                                    : 'Select a date to view details'}
                            </p>
                        </div>

                        {selectedDate ? (
                            selectedDate.attendance ? (
                                <div className="p-4">
                                    <div className={`flex items-center justify-between p-3 rounded-lg ${getStatusColor(selectedDate.attendance.status)} mb-4`}>
                                        <div className="flex items-center">
                                            {/* Icons for the selected date detail */}
                                            {selectedDate.attendance.status === 'present' && <CheckCircle className="text-green-500" size={18} />}
                                            {selectedDate.attendance.status === 'absent' && <XCircle className="text-red-500" size={18} />}
                                            {selectedDate.attendance.status === 'half-day' && <Clock className="text-blue-500" size={18} />}
                                            {selectedDate.attendance.status === 'leave' && <AlertCircle className="text-yellow-500" size={18} />}
                                            <span className="ml-2 font-medium capitalize">{selectedDate.attendance.status}</span>
                                        </div>
                                        {selectedDate.attendance.reason && (
                                            <span className="text-sm">{selectedDate.attendance.reason}</span>
                                        )}
                                    </div>

                                    {/* Display Check Out time ONLY if status is 'half-day' */}
                                    {selectedDate.attendance.status === 'half-day' && selectedDate.attendance.checkOut && (
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="border rounded-lg p-4">
                                                <h3 className="text-sm font-medium text-gray-500 mb-2">Check Out</h3>
                                                <div className="flex items-center">
                                                    <Clock className="text-gray-400 mr-2" size={18} />
                                                    <span className="text-lg font-medium">
                                                        {selectedDate.attendance.checkOut}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    {selectedDate.date.getDay() === 0 ? ( // Check if it's a Sunday
                                        <>
                                            <Ban className="mx-auto mb-2 text-gray-400" size={24} />
                                            <p>No attendance recorded on Sundays</p>
                                        </>
                                    ) : (
                                        <>
                                            <CalendarIcon className="mx-auto mb-2 text-gray-400" size={24} />
                                            <p>No attendance record for this date</p>
                                        </>
                                    )}
                                </div>
                            )
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                <CalendarIcon className="mx-auto mb-2 text-gray-400" size={24} />
                                <p>Select a date to view attendance details</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AttendanceModule;