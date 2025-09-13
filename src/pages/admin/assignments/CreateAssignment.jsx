// CreateAssignment.jsx
import React, { useState } from 'react';
import { PlusCircle, X, CheckCircle, Info } from 'lucide-react';

const CreateAssignment = ({ showCreateForm, setShowCreateForm, setAlert, assignments, setAssignments, allAvailablePrograms, allAvailableSemesters }) => {
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    program: "",
    year: "",
    course: "",
    dueDate: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({ ...newAssignment, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newAssignment.title || !newAssignment.program || !newAssignment.semester || !newAssignment.course || !newAssignment.dueDate) {
      setAlert({ message: 'Please fill in all required fields (Title, Program, Semester, Course, Due Date).', type: 'error' });
      return;
    }

    const newId = assignments.length > 0 ? Math.max(...assignments.map(a => a.id)) + 1 : 1;
    setAssignments([
      ...assignments,
      {
        id: newId,
        title: newAssignment.title,
        program: newAssignment.program,
        semester: newAssignment.semester,
        course: newAssignment.course,
        dueDate: newAssignment.dueDate,
        status: "Pending",
        submissions: 0,
        graded: 0, // Ensure 'graded' is included for new assignments
        description: newAssignment.description,
      },
    ]);
    setNewAssignment({ title: "", program: "", semester: "", course: "", dueDate: "", description: "" });
    setShowCreateForm(false);
    setAlert({ message: 'Assignment created successfully!', type: 'success' });
  };

  if (!showCreateForm) {
    return null; // Don't render if the form is not supposed to be shown
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 md:p-8 w-full max-w-lg shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"> {/* Changed max-w-md to max-w-lg */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Assignment</h2>
          <button
            onClick={() => { setShowCreateForm(false); setAlert({ message: '', type: '' }); }}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="title"
                name="title"
                value={newAssignment.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                required
                placeholder="e.g., Lab Report 1"
              />
            </div>

            {/* Program and Semester (two columns on larger screens) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">Program <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    id="program"
                    name="program"
                    value={newAssignment.program}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
                    required
                  >
                    <option value="">Select Program</option>
                    {allAvailablePrograms.map((prog) => (
                      <option key={prog} value={prog}>{prog}</option>
                    ))}
                  </select>
                  <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">Semester <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    id="semester"
                    name="semester"
                    value={newAssignment.semester}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
                    required
                  >
                    <option value="">Select Semester</option>
                    {allAvailableSemesters.map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                  <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            {/* Course and Due Date (two columns on larger screens) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Course <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="course"
                  name="course"
                  value={newAssignment.course}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                  required
                  placeholder="e.g., Data Structures"
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={newAssignment.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={newAssignment.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                rows="3"
                placeholder="Provide a brief description of the assignment..."
              ></textarea>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => { setShowCreateForm(false); setAlert({ message: '', type: '' }); }}
                className="flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 transition-colors"
              >
                <X className="mr-2" size={20} />
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
              >
                <PlusCircle className="mr-2" size={25} />
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;