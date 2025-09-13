// LeaveModule.jsx
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
    BookOpen, // For Leave Type (like a book for rules/policy)
    User, // For Child name
    Paperclip // For Attachments
} from 'lucide-react';

// Mock data for parent's children and existing leave requests
const mockChildren = [
    { id: 'child1', name: 'Raj Kumar', class: '10', section: 'A' },
    { id: 'child2', name: 'Priya Sharma', class: '9', section: 'B' },
];

const mockLeaveRequests = [
    {
        id: 1,
        childId: 'child1',
        childName: 'Raj Kumar',
        leaveType: 'Sick Leave',
        startDate: '2024-07-15',
        endDate: '2024-07-16',
        status: 'Pending',
        lecturerComment: '',
        requestedAt: '2024-07-14T10:00:00Z',
    },
    {
        id: 2,
        childId: 'child2',
        childName: 'Priya Sharma',
        leaveType: 'Family Event',
        startDate: '2024-07-20',
        endDate: '2024-07-22',
        status: 'Approved',
        lecturerComment: 'Approved. Please ensure notes are collected.',
        requestedAt: '2024-07-13T15:30:00Z',
    },
];

const LeaveModule = () => {
    const [children, setChildren] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [error, setError] = useState(null);
    const [showRequestForm, setShowRequestForm] = useState(false);

    const [newRequest, setNewRequest] = useState({
        childId: '', // Can be a specific childId or 'all'
        leaveType: '',
        startDate: '',
        endDate: '', // Now optional
        attachment: null, // For file upload simulation
    });

    // Simulate fetching children data on component mount
    useEffect(() => {
        setChildren(mockChildren);
    }, []);

    // Simulate fetching leave requests on component mount
    useEffect(() => {
        setLeaveRequests(mockLeaveRequests);
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
        const { childId, leaveType, startDate, endDate } = newRequest;
        if (!childId || !leaveType || !startDate) {
            alert('Please fill in all required fields: Child, Leave Type, and Start Date.');
            return;
        }

        // Handle optional end date: if not provided, set it to be the same as startDate
        const finalEndDate = endDate || startDate;

        if (new Date(startDate) > new Date(finalEndDate)) {
            alert('End Date cannot be before Start Date.');
            return;
        }

        let childrenToProcess = [];
        if (newRequest.childId === 'all') {
            childrenToProcess = children; // Apply to all children
            if (childrenToProcess.length === 0) {
                alert('No children available to apply leave to.');
                return;
            }
        } else {
            const selectedChild = children.find(c => c.id === newRequest.childId);
            if (!selectedChild) {
                alert('Selected child not found.');
                return;
            }
            childrenToProcess = [selectedChild]; // Apply to a single selected child
        }

        let newRequestsToAdd = [];
        let currentMaxId = leaveRequests.length > 0 ? Math.max(...leaveRequests.map(req => req.id)) : 0;

        childrenToProcess.forEach((child, index) => {
            const newId = currentMaxId + 1 + index; // Ensure unique IDs for multiple requests
            newRequestsToAdd.push({
                id: newId,
                childId: child.id,
                childName: child.name,
                leaveType: newRequest.leaveType,
                startDate: newRequest.startDate,
                endDate: finalEndDate,
                status: 'Pending', // New requests always start as Pending
                lecturerComment: '',
                requestedAt: new Date().toISOString(),
                // attachment: newRequest.attachment ? newRequest.attachment.name : null, // Simulate attachment name
            });
        });

        setLeaveRequests(prev => [...newRequestsToAdd, ...prev]); // Add new requests to the beginning of the list
        alert(`Leave request${newRequestsToAdd.length > 1 ? 's' : ''} submitted successfully!`);

        // Reset form and hide it
        setNewRequest({
            childId: '',
            leaveType: '',
            startDate: '',
            endDate: '',
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
        <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center mb-4 sm:mb-0">
                    <Calendar className="mr-3 text-blue-600" size={32} /> Leave Requests
                </h1>
            </div>

            {/* Raise New Leave Request Section */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
                <button
                    onClick={() => setShowRequestForm(!showRequestForm)}
                    className="w-full flex justify-between items-center text-lg font-semibold text-gray-800 py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200"
                >
                    <span className="flex items-center">
                        <PlusCircle size={20} className="mr-3 text-blue-600" />
                        Raise New Leave Request
                    </span>
                    {showRequestForm ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {showRequestForm && (
                    <form onSubmit={handleSubmitRequest} className="mt-4 border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="childId" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <User size={16} className="mr-2 text-gray-500" /> Child
                                </label>
                                <select
                                    id="childId"
                                    name="childId"
                                    value={newRequest.childId}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-base focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Child</option>
                                    <option value="all">All Children</option> {/* Added "All Children" option */}
                                    {children.map(child => (
                                        <option key={child.id} value={child.id}>{child.name} (Class {child.class}-{child.section})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <BookOpen size={16} className="mr-2 text-gray-500" /> Leave Type
                                </label>
                                <select
                                    id="leaveType"
                                    name="leaveType"
                                    value={newRequest.leaveType}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-base focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Family Event">Family Event</option>
                                    <option value="Vacation">Vacation</option>
                                    <option value="Emergency">Emergency</option> {/* Added Emergency */}
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
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-base focus:ring-blue-500 focus:border-blue-500"
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
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-base focus:ring-blue-500 focus:border-blue-500"
                                    // Removed 'required' attribute
                                />
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
                                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
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
                                        childId: '', leaveType: '', startDate: '', endDate: '', /* reason: '', */ attachment: null,
                                    });
                                    setShowRequestForm(false);
                                }}
                                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold flex items-center hover:bg-gray-300 transition duration-200"
                            >
                                <XCircle size={20} className="mr-2" /> Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold flex items-center hover:bg-blue-700 shadow-md transition duration-200"
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
                        <ListTodo size={20} className="mr-3 text-gray-600" /> My Leave Requests
                    </h2>
                </div>

                {leaveRequests.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No leave requests submitted yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                                        Child Name
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                                        Leave Type
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                                        Duration
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sm:px-6 sm:py-3">
                                        lecturer's Comment
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
                                {leaveRequests.map(request => (
                                    <tr key={request.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900 sm:px-6 sm:py-4 sm:text-sm">
                                            {request.childName}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-800 sm:px-6 sm:py-4 sm:text-sm">
                                            {request.leaveType}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600 sm:px-6 sm:py-4 sm:text-sm">
                                            {request.startDate} {request.endDate && request.startDate !== request.endDate ? `to ${request.endDate}` : ''}
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-600 sm:px-6 sm:py-4 sm:text-sm max-w-xs overflow-hidden text-ellipsis">
                                            {request.lecturerComment || 'N/A'}
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

export default LeaveModule;