import React, { useState, useMemo } from 'react';
import { BookOpen, Plus, Edit, Trash, X, Book } from 'lucide-react'; // Removed Calendar and Clock icons

const MyClassesModule = () => {
    // Mock current lecturer ID.
    const currentlecturerId = "F125"; // Displaying courses for this lecturer

    // Mock data for all courses in the system with simplified fields.
    const [allCourses, setAllCourses] = useState([
        {
            id: 'course_001',
            name: 'MPC Year 1', // Stream
            section: 'A', // Section
            subject: 'Mathematics',
            lecturerId: 'F125',
        },
        {
            id: 'course_002',
            name: 'MPC Year 2', // Stream
            section: 'B', // Section
            subject: 'Physics',
            lecturerId: 'F125',
        },
        {
            id: 'course_003',
            name: 'BiPC Year 1', // Stream
            section: 'A', // Section
            subject: 'Chemistry',
            lecturerId: 'F125',
        },
        {
            id: 'course_004',
            name: 'BiPC Year 2', // Stream
            section: 'C', // Section
            subject: 'Biology',
            lecturerId: 'F125',
        },
        {
            id: 'course_005',
            name: 'CEC Year 1', // Stream
            section: 'D', // Section
            subject: 'Commerce',
            lecturerId: 'F125',
        },
        {
            id: 'course_006',
            name: 'HEC Year 1', // Stream
            section: 'A', // Section
            subject: 'History',
            lecturerId: 'F125',
        },
        {
            id: 'course_007',
            name: 'MEC Year 2', // Stream
            section: 'B', // Section
            subject: 'Economics',
            lecturerId: 'F125',
        },
    ]);

    // State for managing the add/edit form
    const [showForm, setShowForm] = useState(false);
    const [editingClass, setEditingClass] = useState(null); // Holds the class object being edited
    const [formData, setFormData] = useState({
        id: '',
        name: '', // Grade
        section: '', // Section
        subject: '',
        lecturerId: currentlecturerId, // Default to current lecturer
    });

    // Filters courses to only show those assigned to the current lecturer.
    const lecturerCourses = useMemo(() => {
        return allCourses.filter(course => course.lecturerId === currentlecturerId);
    }, [allCourses, currentlecturerId]);

    // Resets form data and opens the form for adding a new class
    const handleAddClick = () => {
        setEditingClass(null); // Not editing any existing class
        setFormData({
            id: '', // Will be generated on submission
            name: '',
            section: '',
            subject: '',
            lecturerId: currentlecturerId,
        });
        setShowForm(true);
    };

    // Populates form data with the class being edited and opens the form
    const handleEditClick = (cls) => {
        setEditingClass(cls);
        setFormData(cls); // Populate form with existing class data
        setShowForm(true);
    };

    // Handles deletion of a class
    const handleDeleteClick = (classId) => {
        // IMPORTANT: In a real application, replace window.confirm with a custom modal/dialog.
        if (window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
            setAllCourses(prevCourses => prevCourses.filter(course => course.id !== classId));
            // If the deleted class was the one being edited, close the form
            if (editingClass && editingClass.id === classId) {
                handleCancelClick();
            }
        }
    };

    // Closes the form and resets editing state
    const handleCancelClick = () => {
        setShowForm(false);
        setEditingClass(null);
        setFormData({ // Reset form data
            id: '', name: '', section: '', subject: '', lecturerId: currentlecturerId
        });
    };

    // Handles changes in form input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handles form submission (add or update)
    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        // IMPORTANT: In a real application, replace alert with a custom modal/dialog.
        if (!formData.name || !formData.subject || !formData.section) {
            alert('Please fill in all fields (Subject, Grade, and Section).');
            return;
        }

        if (editingClass) {
            // Update existing class
            setAllCourses(prevCourses =>
                prevCourses.map(course =>
                    course.id === editingClass.id ? { ...formData } : course
                )
            );
        } else {
            // Add new class
            const newCourse = { ...formData, id: `course_${Date.now()}` }; // Generate unique ID
            setAllCourses(prevCourses => [...prevCourses, newCourse]);
        }

        setShowForm(false); // Close form after submission
        setEditingClass(null); // Clear editing state
        setFormData({ // Reset form data
            id: '', name: '', section: '', subject: '', lecturerId: currentlecturerId
        });
    };


    return (
        <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b-2 border-blue-500">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <BookOpen size={36} className="text-blue-600" /> My Assigned Streams
                </h1>
                {/* Add New Class Button */}
                 <button
                    onClick={handleAddClick}
                    className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-md flex items-center gap-2"
                 >
                    <Plus size={20} /> Add New Stream
                 </button>
            </div>

            {/* Add/Edit Class Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200 animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
                        {editingClass ? 'Edit Class Details' : 'Add New Class'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                            <input
                                type="text"
                                name="subject"
                                id="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Stream (e.g., MPC Year 1)</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                                required
                            />
                        </div>
                        <div className="col-span-1">
                            <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">Section (e.g., A)</label>
                            <input
                                type="text"
                                name="section"
                                id="section"
                                value={formData.section}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                                required
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={handleCancelClick}
                                className="px-6 py-3 border border-gray-300 rounded-full shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150"
                            >
                                {editingClass ? 'Update Class' : 'Add Class'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Main Content Area: Table of Classes */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 min-h-[400px] overflow-x-auto border border-gray-200">
                {lecturerCourses.length === 0 ? (
                    // Display message if no classes are assigned
                    <div className="text-center text-gray-500 py-16 flex flex-col items-center justify-center">
                        <Book size={60} className="mb-6 text-gray-300" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Classes Assigned Yet!</h3>
                        <p className="text-base text-gray-600 mb-6">
                            It looks like you haven't been assigned any classes.
                            <br />
                            Please add a class using the "Add New Class" button above to get started.
                        </p>
                        <button
                            onClick={handleAddClick}
                            className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-md flex items-center gap-2"
                        >
                            <Plus size={20} /> Add Your First Stream
                        </button>
                    </div>
                ) : (
                    // Display classes in a table
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject Name
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stream
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Section
                                </th>
                                <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {lecturerCourses.map(cls => (
                                <tr key={cls.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {cls.subject}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {cls.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {cls.section}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => handleEditClick(cls)}
                                                className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                                                title="Edit Class"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(cls.id)}
                                                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                                                title="Delete Class"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MyClassesModule;