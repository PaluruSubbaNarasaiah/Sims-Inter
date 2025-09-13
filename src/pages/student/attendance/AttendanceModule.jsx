// AttendanceModule.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Calendar as CalendarIcon, CalendarDays, AlertCircle, Ban } from 'lucide-react'; // Removed AlertCircle comment, added Ban
import Calendar from './Calendar';

const AttendanceModule = () => {
    // Sample data for AP Junior College subjects
    const [subjects] = useState([
        { id: 'maths', name: 'Mathematics', stream: 'MPC/MEC' },
        { id: 'physics', name: 'Physics', stream: 'MPC/BiPC' },
        { id: 'chemistry', name: 'Chemistry', stream: 'MPC/BiPC' },
        { id: 'biology', name: 'Biology', stream: 'BiPC' },
        { id: 'commerce', name: 'Commerce', stream: 'CEC/MEC' },
        { id: 'economics', name: 'Economics', stream: 'CEC/MEC/HEC' },
        { id: 'civics', name: 'Civics', stream: 'CEC/HEC' },
        { id: 'history', name: 'History', stream: 'HEC' },
        { id: 'jee', name: 'JEE Coaching', stream: 'Integrated' },
        { id: 'neet', name: 'NEET Coaching', stream: 'Integrated' }
    ]);

    const [allAttendanceData] = useState([

        // January 2025
        { date: '2025-01-02', status: 'present' },
        { date: '2025-01-03', status: 'present' },
        { date: '2025-01-06', status: 'present' },
        { date: '2025-01-07', status: 'absent', reason: 'Sick' },
        { date: '2025-01-08', status: 'present' },
        { date: '2025-01-09', status: 'present' },
        { date: '2025-01-10', status: 'half-day', reason: 'Medical appointment', checkOut: '12:30' },
        { date: '2025-01-13', status: 'present' },
        { date: '2025-01-14', status: 'present' },
        { date: '2025-01-15', status: 'present' },
        { date: '2025-01-16', status: 'present' },
        { date: '2025-01-17', status: 'present' },
        { date: '2025-01-20', status: 'present' },
        { date: '2025-01-21', status: 'present' },
        { date: '2025-01-22', status: 'absent', reason: 'Family function' },
        { date: '2025-01-23', status: 'present' },
        { date: '2025-01-24', status: 'present' },
        { date: '2025-01-27', status: 'present' },
        { date: '2025-01-28', status: 'present' },
        { date: '2025-01-29', status: 'half-day', reason: 'Personal work', checkOut: '13:00' },
        { date: '2025-01-30', status: 'present' },
        { date: '2025-01-31', status: 'present' },

        // February 2025
        { date: '2025-02-03', status: 'present' },
        { date: '2025-02-04', status: 'present' },
        { date: '2025-02-05', status: 'present' },
        { date: '2025-02-06', status: 'present' },
        { date: '2025-02-07', status: 'absent', reason: 'Transport strike' },
        { date: '2025-02-10', status: 'present' },
        { date: '2025-02-11', status: 'present' },
        { date: '2025-02-12', status: 'present' },
        { date: '2025-02-13', status: 'half-day', reason: 'Coaching class', checkOut: '12:45' },
        { date: '2025-02-14', status: 'present' },
        { date: '2025-02-17', status: 'present' },
        { date: '2025-02-18', status: 'present' },
        { date: '2025-02-19', status: 'present' },
        { date: '2025-02-20', status: 'present' },
        { date: '2025-02-21', status: 'present' },
        { date: '2025-02-24', status: 'present' },
        { date: '2025-02-25', status: 'absent', reason: 'Fever' },
        { date: '2025-02-26', status: 'present' },
        { date: '2025-02-27', status: 'present' },
        { date: '2025-02-28', status: 'present' },

        // March 2025
        { date: '2025-03-03', status: 'present' },
        { date: '2025-03-04', status: 'present' },
        { date: '2025-03-05', status: 'present' },
        { date: '2025-03-06', status: 'present' },
        { date: '2025-03-07', status: 'half-day', reason: 'JEE mock test', checkOut: '13:15' },
        { date: '2025-03-10', status: 'present' },
        { date: '2025-03-11', status: 'present' },
        { date: '2025-03-12', status: 'present' },
        { date: '2025-03-13', status: 'present' },
        { date: '2025-03-14', status: 'leave', reason: 'Holi festival' },
        { date: '2025-03-17', status: 'present' },
        { date: '2025-03-18', status: 'present' },
        { date: '2025-03-19', status: 'absent', reason: 'Not informed' },
        { date: '2025-03-20', status: 'present' },
        { date: '2025-03-21', status: 'present' },
        { date: '2025-03-24', status: 'present' },
        { date: '2025-03-25', status: 'present' },
        { date: '2025-03-26', status: 'present' },
        { date: '2025-03-27', status: 'half-day', reason: 'NEET counseling', checkOut: '12:00' },
        { date: '2025-03-28', status: 'present' },
        { date: '2025-03-31', status: 'present' },

        // April 2025
        { date: '2025-04-01', status: 'present' },
        { date: '2025-04-02', status: 'present' },
        { date: '2025-04-03', status: 'present' },
        { date: '2025-04-04', status: 'present' },
        { date: '2025-04-07', status: 'present' },
        { date: '2025-04-08', status: 'absent', reason: 'Power cut at home' },
        { date: '2025-04-09', status: 'present' },
        { date: '2025-04-10', status: 'present' },
        { date: '2025-04-11', status: 'present' },
        { date: '2025-04-14', status: 'leave', reason: 'Ugadi festival' },
        { date: '2025-04-15', status: 'present' },
        { date: '2025-04-16', status: 'present' },
        { date: '2025-04-17', status: 'half-day', reason: 'Lab practical exam', checkOut: '13:30' },
        { date: '2025-04-18', status: 'present' },
        { date: '2025-04-21', status: 'present' },
        { date: '2025-04-22', status: 'present' },
        { date: '2025-04-23', status: 'present' },
        { date: '2025-04-24', status: 'present' },
        { date: '2025-04-25', status: 'present' },
        { date: '2025-04-28', status: 'present' },
        { date: '2025-04-29', status: 'absent', reason: 'Heavy rain' },
        { date: '2025-04-30', status: 'present' },

        // May 2025
        { date: '2025-05-01', status: 'leave', reason: 'Labour Day' },
        { date: '2025-05-02', status: 'present' },
        { date: '2025-05-05', status: 'present' },
        { date: '2025-05-06', status: 'present' },
        { date: '2025-05-07', status: 'half-day', reason: 'CA foundation exam', checkOut: '12:30' },
        { date: '2025-05-08', status: 'present' },
        { date: '2025-05-09', status: 'present' },
        { date: '2025-05-12', status: 'present' },
        { date: '2025-05-13', status: 'present' },
        { date: '2025-05-14', status: 'present' },
        { date: '2025-05-15', status: 'absent', reason: 'Sick' },
        { date: '2025-05-16', status: 'present' },
        { date: '2025-05-19', status: 'present' },
        { date: '2025-05-20', status: 'present' },
        { date: '2025-05-21', status: 'present' },
        { date: '2025-05-22', status: 'present' },
        { date: '2025-05-23', status: 'half-day', reason: 'CLAT preparation', checkOut: '12:00' },
        { date: '2025-05-26', status: 'present' },
        { date: '2025-05-27', status: 'present' },
        { date: '2025-05-28', status: 'present' },
        { date: '2025-05-29', status: 'present' },
        { date: '2025-05-30', status: 'present' },

        // June 2025
        { date: '2025-06-02', status: 'present' },
        { date: '2025-06-03', status: 'present' },
        { date: '2025-06-04', status: 'present' },
        { date: '2025-06-05', status: 'present' },
        { date: '2025-06-06', status: 'present' },
        { date: '2025-06-09', status: 'present' },
        { date: '2025-06-10', status: 'absent', reason: 'Internet issues' },
        { date: '2025-06-11', status: 'present' },
        { date: '2025-06-12', status: 'present' },
        { date: '2025-06-13', status: 'present' },
        { date: '2025-06-16', status: 'present' },
        { date: '2025-06-17', status: 'half-day', reason: 'Commerce practical', checkOut: '13:15' },
        { date: '2025-06-18', status: 'present' },
        { date: '2025-06-19', status: 'present' },
        { date: '2025-06-20', status: 'present' },
        { date: '2025-06-23', status: 'present' },
        { date: '2025-06-24', status: 'present' },
        { date: '2025-06-25', status: 'present' },
        { date: '2025-06-26', status: 'present' },
        { date: '2025-06-27', status: 'present' },
        { date: '2025-06-30', status: 'present' },
    ]);



    // Initialize with the current date to show the current month by default
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [monthlyAttendanceData, setMonthlyAttendanceData] = useState([]);
    const [stats, setStats] = useState({
        present: 0,
        absent: 0,
        halfDays: 0,
        leave: 0,
    });

    // Filter attendance data for the current month
    useEffect(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth(); // 0-indexed month

        const filteredData = allAttendanceData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getFullYear() === year && itemDate.getMonth() === month;
        });
        setMonthlyAttendanceData(filteredData);
    }, [currentMonth, allAttendanceData]);

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
                leave,
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
            case 'leave': return 'bg-yellow-100 text-yellow-800'; // Changed from purple-100 to yellow-100 for consistency with icon color
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
            <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <CalendarDays size={32} className="text-indigo-600" />
          Attendance
        </h1>
            </div>

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
                {/* New card for Leaves */}
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
                    <h2 className="text-lg font-semibold">Daily Attendance Details</h2>
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
                                    {selectedDate.attendance.status === 'leave' && <AlertCircle className="text-yellow-600" size={18} />}
                                    <span className="ml-2 font-medium capitalize">{selectedDate.attendance.status}</span>
                                </div>
                                {selectedDate.attendance.reason && (
                                    <span className="text-sm">{selectedDate.attendance.reason}</span>
                                )}
                            </div>

                            {selectedDate.attendance.checkOut && ( // Only check for checkOut
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
        </div>
    );
};

export default AttendanceModule;