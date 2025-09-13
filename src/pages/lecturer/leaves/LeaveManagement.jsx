// LeaveManagement.jsx (lecturer's Own Leave Request Panel)
import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Send,
    ListTodo,
    ChevronDown,
    ChevronUp,
    PlusCircle,
    XCircle,
    CheckCircle,
    Briefcase, // For Leave Type (lecturer's work-related leave)
    User, // For lecturer name
    Paperclip // For Attachments
} from 'lucide-react';

// Mock data for the current lecturer (for display purposes)
const mocklecturerInfo = {
    id: 'lecturer1',
    name: 'Dr. Lakshmi Devi',
    employeeId: 'FAC001',
    department: 'Mathematics',
};

// Mock data for lecturer's own leave requests
const mocklecturerLeaveRequests = [
    {
        id: 101,
        applicantId: 'lecturer1',
        applicantName: 'Mrs. Smith',
        leaveType: 'Sick Leave',
        startDate: '2024-07-25',
        endDate: '2024-07-25',
        status: 'Pending',
        adminComment: '', // Admin's comment on lecturer's leave
        requestedAt: '2024-07-10T09:00:00Z',
    },
    {
        id: 102,
        applicantId: 'lecturer1',
        applicantName: 'Mrs. Smith',
        leaveType: 'Casual Leave',
        startDate: '2024-08-05',
        endDate: '2024-08-07',
        status: 'Approved',
        adminComment: 'Approved. Enjoy your time off!',
        requestedAt: '2024-07-01T14:00:00Z',
    },
];

const LeaveManagement = () => {
    const [lecturerLeaveRequests, setlecturerLeaveRequests] = useState([]);
    const [error, setError] = useState(null);
    const [showRequestForm, setShowRequestForm] = useState(false);

    const [newRequest, setNewRequest] = useState({
        leaveType: '',
        startDate: '',
        endDate: '', // Now optional
        reason: '', // Added for lecturer's leave
        attachment: null, // For file upload simulation
    });

    // Simulate fetching lecturer's leave requests on component mount
    useEffect(() => {
        setlecturerLeaveRequests(mocklecturerLeaveRequests);
    }, []);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'attachment' && files) {
            setNewRequest(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setNewRequest(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmitRequest = (e) => {
        e.preventDefault();

        // Basic validation for common fields
        const { leaveType, startDate, endDate, reason } = newRequest;
        if (!leaveType || !startDate || !reason) {
            alert('Please fill in all required fields: Leave Type, Start Date, and Reason.');
            return;
        }

        // Handle optional end date: if not provided, set it to be the same as startDate
        const finalEndDate = endDate || startDate;

        if (new Date(startDate) > new Date(finalEndDate)) {
            alert('End Date cannot be before Start Date.');
            return;
        }

        const newId = lecturerLeaveRequests.length > 0 ? Math.max(...lecturerLeaveRequests.map(req => req.id)) + 1 : 1;

        const newlecturerRequest = {
            id: newId,
            applicantId: mocklecturerInfo.id, // Assign current lecturer's ID
            applicantName: mocklecturerInfo.name, // Assign current lecturer's name
            leaveType: newRequest.leaveType,
            startDate: newRequest.startDate,
            endDate: finalEndDate,
            status: 'Pending', // New requests always start as Pending for admin approval
            adminComment: '', // Admin comment initially empty
            requestedAt: new Date().toISOString(),
            // attachment: newRequest.attachment ? newRequest.attachment.name : null, // Simulate attachment name
        };

        setlecturerLeaveRequests(prev => [newlecturerRequest, ...prev]); // Add new request to the beginning of the list
        alert(`Leave request submitted successfully! It will be reviewed by the admin.`);

        // Reset form and hide it
        setNewRequest({
            leaveType: '',
            startDate: '',
            endDate: '',
            reason: '',
            attachment: null,
        });
        setShowRequestForm(false);
    };

    const getStatusColorClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Approved':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-lg">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 sm:gap-4 lg:gap-8">
            {/* Raise New Leave Request Section */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
                <button
                    onClick={() => setShowRequestForm(!showRequestForm)}
                    className="w-full flex justify-between items-center text-lg font-semibold text-gray-800 py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200"
                >
                    <span className="flex items-center">
                        <PlusCircle size={20} className="mr-3 text-purple-600" />
                        Raise New Leave Request for Myself
                    </span>
                    {showRequestForm ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {showRequestForm && (
                    <form onSubmit={handleSubmitRequest} className="mt-4 border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <Briefcase size={16} className="mr-2 text-gray-500" /> Leave Type
                                </label>
                                <select
                                    id="leaveType"
                                    name="leaveType"
                                    value={newRequest.leaveType}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-base focus:ring-purple-500 focus:border-purple-500"
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Casual Leave">Casual Leave</option>
                                    <option value="Earned Leave">Earned Leave</option>
                                    <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
                                    <option value="Sabbatical">Sabbatical</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <Calendar size={16} className="mr-2 text-gray-500" /> Start Date
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={newRequest.startDate}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-base focus:ring-purple-500 focus:border-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <Calendar size={16} className="mr-2 text-gray-500" /> End Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={newRequest.endDate}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-base focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            <div className="md:col-span-2"> {/* Make reason take full width on medium screens */}
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <ListTodo size={16} className="mr-2 text-gray-500" /> Reason for Leave
                                </label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    value={newRequest.reason}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-base focus:ring-purple-500 focus:border-purple-500 resize-y"
                                    placeholder="Briefly explain the reason for your leave..."
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <Paperclip size={16} className="mr-2 text-gray-500" /> Attachment (Optional)
                            </label>
                            <input
                                type="file"
                                id="attachment"
                                name="attachment"
                                onChange={handleInputChange}
                                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                            />
                            {newRequest.attachment && (
                                <p className="mt-2 text-sm text-gray-500">Selected: {newRequest.attachment.name}</p>
                            )}
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setNewRequest({
                                        leaveType: '', startDate: '', endDate: '', reason: '', attachment: null,
                                    });
                                    setShowRequestForm(false);
                                }}
                                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold flex items-center hover:bg-gray-300 transition duration-200"
                            >
                                <XCircle size={20} className="mr-2" /> Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-semibold flex items-center hover:bg-purple-700 shadow-md transition duration-200"
                            >
                                <Send size={20} className="mr-2" /> Submit Request
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* My Leave Requests Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
                        <ListTodo size={20} className="mr-3 text-gray-600" /> My Submitted Leave Requests
                    </h2>
                </div>

                {lecturerLeaveRequests.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No leave requests submitted yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                                        Applicant
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                                        Leave Type
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                                        Duration
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                                        Reason
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                                        Admin's Comment
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                                        Status
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                                        Requested On
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {lecturerLeaveRequests.map(request => (
                                    <tr key={request.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900 sm:px-6 sm:py-4 sm:text-sm">
                                            {request.applicantName}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-800 sm:px-6 sm:py-4 sm:text-sm">
                                            {request.leaveType}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600 sm:px-6 sm:py-4 sm:text-sm">
                                            {request.startDate} {request.endDate && request.startDate !== request.endDate ? `to ${request.endDate}` : ''}
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-600 sm:px-6 sm:py-4 sm:text-sm max-w-xs overflow-hidden text-ellipsis break-words">
                                            {request.reason || 'N/A'}
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-600 sm:px-6 sm:py-4 sm:text-sm max-w-xs overflow-hidden text-ellipsis break-words">
                                            {request.adminComment || 'Awaiting Admin Comment'}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap sm:px-6 sm:py-4">
                                            <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600 sm:px-6 sm:py-4 sm:text-sm">
                                            {new Date(request.requestedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveManagement;