// AssignmentModule.jsx
import React, { useState, useEffect } from 'react';
import {
  Eye,
  Pencil,
  Trash2,
  PlusCircle,
  X,
  ClipboardList, // Main icon for Assignment Module
  Tag, // For Subject
  Calendar, // For Due Date
  Users, // For Class
  CheckCircle, // For Submitted status
  Clock, // For Pending status
  AlertCircle, // For Late status
  FileText, // For Description
  UserCheck, // For Submissions
  Award, // For Grade (individual submission grade)
  Download, // For download button
  Info, // For general info/error alerts
  ListTodo // Icon for View Submissions
} from 'lucide-react';

import CreateAssignment from './CreateAssignment'; // Import the new component
import ViewSubmissions from './ViewSubmissions'; // Import the new ViewSubmissions component

// Assuming you will create this component for editing
const EditAssignment = ({
  showEditForm,
  setShowEditForm,
  setAlert,
  assignmentToEdit,
  setAssignmentToEdit,
  assignments,
  setAssignments,
  allAvailableClasses,
  allAvailableSections
}) => {
  const [editedAssignment, setEditedAssignment] = useState(assignmentToEdit);

  useEffect(() => {
    setEditedAssignment(assignmentToEdit); // Update form when assignmentToEdit changes
  }, [assignmentToEdit]);

  if (!showEditForm || !editedAssignment) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAssignment({ ...editedAssignment, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editedAssignment.title || !editedAssignment.class || !editedAssignment.section || !editedAssignment.subject || !editedAssignment.dueDate) {
      setAlert({ message: 'Please fill in all required fields (Title, Class, Section, Subject, Due Date).', type: 'error' });
      return;
    }

    setAssignments(assignments.map(assign =>
      assign.id === editedAssignment.id ? editedAssignment : assign
    ));
    setAlert({ message: 'Assignment updated successfully!', type: 'success' });
    setShowEditForm(false);
    setAssignmentToEdit(null); // Clear the assignment to edit
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Pencil size={24} className="text-indigo-600" /> Edit Assignment
          </h2>
          <button
            onClick={() => { setShowEditForm(false); setAssignmentToEdit(null); setAlert({ message: '', type: '' }); }}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Title */}
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">Assignment Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="edit-title"
              name="title"
              value={editedAssignment.title}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
              placeholder="e.g., Data Structures Assignment"
              required
            />
          </div>

          {/* Class */}
          <div>
            <label htmlFor="edit-class" className="block text-sm font-medium text-gray-700 mb-1">Stream <span className="text-red-500">*</span></label>
            <select
              id="edit-class"
              name="class"
              value={editedAssignment.class}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
              required
            >
              <option value="">Select Stream</option>
              {allAvailableClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label htmlFor="edit-section" className="block text-sm font-medium text-gray-700 mb-1">Section <span className="text-red-500">*</span></label>
            <select
              id="edit-section"
              name="section"
              value={editedAssignment.section}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
              required
            >
              <option value="">Select Section</option>
              {allAvailableSections.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="edit-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="edit-subject"
              name="subject"
              value={editedAssignment.subject}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
              placeholder="e.g., Computer Science"
              required
            />
          </div>

          {/* Due Date */}
          <div className="sm:col-span-2">
            <label htmlFor="edit-dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              id="edit-dueDate"
              name="dueDate"
              value={editedAssignment.dueDate}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="edit-description"
              name="description"
              value={editedAssignment.description}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
              rows="3"
              placeholder="Provide a brief description of the assignment..."
            ></textarea>
          </div>

          <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => { setShowEditForm(false); setAssignmentToEdit(null); setAlert({ message: '', type: '' }); }}
              className="flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 transition-colors"
            >
              <X className="mr-2" size={20} />
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
            >
              <Pencil className="mr-2" size={20} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const AssignmentModule = () => {
  // Sample data with AP junior college stream assignments
  const initialAssignmentsData = [
    { id: 5, title: "Calculus Problem Set", class: "MPC Year 1", section: "A", subject: "Mathematics", dueDate: "2025-07-20", description: "Solve problems on limits, derivatives and basic integration." },
    { id: 6, title: "Cell Biology Lab Report", class: "BiPC Year 1", section: "B", subject: "Biology", dueDate: "2025-07-22", description: "Prepare detailed lab report on cell structure and organelles." },
    { id: 7, title: "Organic Chemistry Reactions", class: "BiPC Year 2", section: "A", subject: "Chemistry", dueDate: "2025-07-25", description: "Study and explain organic reaction mechanisms with examples." },
    { id: 8, title: "Microeconomics Case Study", class: "MEC Year 1", section: "C", subject: "Economics", dueDate: "2025-07-18", description: "Analyze market structures and consumer behavior patterns." },
    { id: 9, title: "Indian Constitution Essay", class: "HEC Year 2", section: "A", subject: "Civics", dueDate: "2025-08-01", description: "Write comprehensive essay on fundamental rights and duties." },
  ];

  // Mock submission data with increased counts and varied statuses/dates
  const mockSubmissionsData = [
    // Assignment 5: Physics Problem Set (Due: 2025-07-20)
    { id: 1, assignmentId: 5, studentName: "John Doe", submittedDate: "2025-07-19", status: "Graded", grade: "A", feedback: "Excellent!" },
    { id: 2, assignmentId: 5, studentName: "Jane Smith", submittedDate: "2025-07-21", status: "Pending", grade: "-", feedback: "" }, // Late
    { id: 3, assignmentId: 5, studentName: "Alice Johnson", submittedDate: "2025-07-19", status: "Graded", grade: "B+", feedback: "Good effort." },
    { id: 4, assignmentId: 5, studentName: "Bob Williams", submittedDate: "2025-07-20", status: "Pending", grade: "-", feedback: "" }, // On time
    { id: 5, assignmentId: 5, studentName: "Charlie Brown", submittedDate: "2025-07-22", status: "Pending", grade: "-", feedback: "" }, // Late
    { id: 6, assignmentId: 5, studentName: "David Lee", submittedDate: "2025-07-20", status: "Graded", grade: "A-", feedback: "Well structured." },
    { id: 7, assignmentId: 5, studentName: "Eva Green", submittedDate: "2025-07-23", status: "Pending", grade: "-", feedback: "" }, // Late
    { id: 8, assignmentId: 5, studentName: "Frank White", submittedDate: "2025-07-18", status: "Graded", grade: "B", feedback: "Needs more detail." },
    { id: 9, assignmentId: 5, studentName: "Grace Black", submittedDate: "2025-07-21", status: "Pending", grade: "-", feedback: "" }, // Late
    { id: 10, assignmentId: 5, studentName: "Harry Gray", submittedDate: "2025-07-19", status: "Graded", grade: "A", feedback: "Fantastic!" },
    { id: 11, assignmentId: 5, studentName: "Ivy Stone", submittedDate: "2025-07-24", status: "Pending", grade: "-", feedback: "" }, // Late

    // Assignment 6: Biology Diagram Drawing (Due: 2025-07-22)
    { id: 12, assignmentId: 6, studentName: "Liam Hall", submittedDate: "2025-07-21", status: "Graded", grade: "B+", feedback: "Clear labels." },
    { id: 13, assignmentId: 6, studentName: "Mia King", submittedDate: "2025-07-23", status: "Pending", grade: "-", feedback: "" }, // Late
    { id: 14, assignmentId: 6, studentName: "Noah Scott", submittedDate: "2025-07-21", status: "Graded", grade: "A-", feedback: "Detailed." },
    { id: 15, assignmentId: 6, studentName: "Olivia Adams", submittedDate: "2025-07-24", status: "Pending", grade: "-", feedback: "" }, // Late
    { id: 16, assignmentId: 6, studentName: "James Baker", submittedDate: "2025-07-22", status: "Graded", grade: "B", feedback: "Good attempt." },
    { id: 17, assignmentId: 6, studentName: "Sophia Carter", submittedDate: "2025-07-25", status: "Pending", grade: "-", feedback: "" }, // Late
    { id: 18, assignmentId: 6, studentName: "William Davis", submittedDate: "2025-07-21", status: "Graded", grade: "A", feedback: "Perfect!" },
    { id: 19, assignmentId: 6, studentName: "Ava Evans", submittedDate: "2025-07-26", status: "Pending", grade: "-", feedback: "" }, // Late
    { id: 20, assignmentId: 6, studentName: "Logan Fisher", submittedDate: "2025-07-22", status: "Graded", grade: "B+", feedback: "Well drawn." },

    // Assignment 7: Geometry Proofs (Due: 2025-07-25)
    { id: 21, assignmentId: 7, studentName: "Benjamin Green", submittedDate: "2025-07-23", status: "Graded", grade: "A", feedback: "Clear and concise." },
    { id: 22, assignmentId: 7, studentName: "Harper Hill", submittedDate: "2025-07-24", status: "Pending", grade: "-", feedback: "" }, // On time
    { id: 23, assignmentId: 7, studentName: "Mason Johnson", submittedDate: "2025-07-23", status: "Graded", grade: "A-", feedback: "Good reasoning." },
    { id: 24, assignmentId: 7, studentName: "Evelyn Jones", submittedDate: "2025-07-26", status: "Pending", grade: "-", feedback: "" }, // Late
    { id: 25, assignmentId: 7, studentName: "Lucas Lewis", submittedDate: "2025-07-24", status: "Graded", grade: "B+", feedback: "Some errors." },
    { id: 26, assignmentId: 7, studentName: "Abigail Miller", submittedDate: "2025-07-24", status: "Graded", grade: "A", feedback: "Excellent proofs." },
    { id: 27, assignmentId: 7, studentName: "Ethan Nelson", submittedDate: "2025-07-27", status: "Pending", grade: "-", feedback: "" }, // Late

    // Assignment 8: French Vocabulary Quiz (Due: 2025-07-18)
    { id: 28, assignmentId: 8, studentName: "Amelia Parker", submittedDate: "2025-07-17", status: "Graded", grade: "A", feedback: "Very good." },
    { id: 29, assignmentId: 8, studentName: "Alexander Rivera", submittedDate: "2025-07-19", status: "Pending", grade: "-", feedback: "" }, // Late
    { id: 30, assignmentId: 8, studentName: "Charlotte Ross", submittedDate: "2025-07-17", status: "Graded", grade: "B+", feedback: "Needs more practice." },
    { id: 31, assignmentId: 8, studentName: "Daniel Taylor", submittedDate: "2025-07-20", status: "Pending", grade: "-", feedback: "" }, // Late
    { id: 32, assignmentId: 8, studentName: "Elizabeth Turner", submittedDate: "2025-07-18", status: "Graded", grade: "A-", feedback: "Solid." },
    { id: 33, assignmentId: 8, studentName: "Michael Walker", submittedDate: "2025-07-21", status: "Pending", grade: "-", feedback: "" }, // Late
    { id: 34, assignmentId: 8, studentName: "Emily White", submittedDate: "2025-07-17", status: "Graded", grade: "B", feedback: "" },
    { id: 35, assignmentId: 8, studentName: "Jacob Young", submittedDate: "2025-07-22", status: "Pending", grade: "-", feedback: "" }, // Late
    { id: 36, assignmentId: 8, studentName: "Sofia Wright", submittedDate: "2025-07-18", status: "Graded", grade: "A", feedback: "Impressive." },
    { id: 37, assignmentId: 8, studentName: "Noah Green", submittedDate: "2025-07-23", status: "Pending", grade: "-", feedback: "" }, // Late

    // Assignment 9: Computer Science Project (Due: 2025-08-01)
    { id: 38, assignmentId: 9, studentName: "Isabella Adams", submittedDate: "2025-07-29", status: "Graded", grade: "A", feedback: "Excellent code!" },
    { id: 39, assignmentId: 9, studentName: "Joshua Baker", submittedDate: "2025-07-30", status: "Pending", grade: "-", feedback: "" },
    { id: 40, assignmentId: 9, studentName: "Mia Clark", submittedDate: "2025-07-28", status: "Graded", grade: "B+", feedback: "Functional." },
    { id: 41, assignmentId: 9, studentName: "Andrew Davis", submittedDate: "2025-07-31", status: "Pending", grade: "-", feedback: "" },
    { id: 42, assignmentId: 9, studentName: "Elizabeth Evans", submittedDate: "2025-07-29", status: "Graded", grade: "A-", feedback: "Well commented." },
    { id: 43, assignmentId: 9, studentName: "Joseph Garcia", submittedDate: "2025-08-02", status: "Pending", grade: "-", feedback: "" }, // Late
    { id: 44, assignmentId: 9, studentName: "Avery Hernandez", submittedDate: "2025-07-30", status: "Graded", grade: "A", feedback: "Robust." },
    { id: 45, assignmentId: 9, studentName: "Ella King", submittedDate: "2025-08-03", status: "Pending", grade: "-", feedback: "" }, // Late
    { id: 46, assignmentId: 9, studentName: "David Lewis", submittedDate: "2025-07-31", status: "Graded", grade: "B+", feedback: "Good logic." },
    { id: 47, assignmentId: 9, studentName: "Grace Martinez", submittedDate: "2025-07-29", status: "Graded", grade: "A", feedback: "Creative solution." },
    { id: 48, assignmentId: 9, studentName: "Samuel Moore", submittedDate: "2025-08-04", status: "Pending", grade: "-", feedback: "" }, // Late
    { id: 49, assignmentId: 9, studentName: "Chloe Nguyen", submittedDate: "2025-07-30", status: "Graded", grade: "A-", feedback: "Efficient." },
    { id: 50, assignmentId: 9, studentName: "Daniel Perez", submittedDate: "2025-08-05", status: "Pending", grade: "-", feedback: "" }, // Late
    { id: 51, assignmentId: 9, studentName: "Zoe Ramirez", submittedDate: "2025-07-31", status: "Graded", grade: "B", feedback: "Minor issues." },
    { id: 52, assignmentId: 9, studentName: "Henry Scott", submittedDate: "2025-08-06", status: "Pending", grade: "-", feedback: "" }, // Late
  ];

  // Calculate initial assignments with accurate submission counts and dynamic status
  const initialAssignmentsWithCounts = initialAssignmentsData.map(assignment => {
    const submissionsForThisAssignment = mockSubmissionsData.filter(
      submission => submission.assignmentId === assignment.id
    );
    const totalActualSubmissions = submissionsForThisAssignment.length;
    const pendingActualSubmissions = submissionsForThisAssignment.filter(s => s.status === "Pending").length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const dueDate = new Date(assignment.dueDate);
    dueDate.setHours(0, 0, 0, 0); // Normalize to start of day

    let displayStatus = "Upcoming"; // Default status

    if (dueDate < today) {
      // Due date has passed
      if (totalActualSubmissions === 0) {
        displayStatus = "Late"; // No submissions and past due
      } else if (pendingActualSubmissions > 0) {
        displayStatus = "Late"; // Past due with pending submissions
      } else {
        // Check for individual late submissions even if overall status is "Completed"
        const anyLateIndividualSubmissions = submissionsForThisAssignment.some(s => {
          const submittedDate = new Date(s.submittedDate);
          submittedDate.setHours(0, 0, 0, 0);
          return submittedDate > dueDate;
        });
        displayStatus = anyLateIndividualSubmissions ? "Late" : "Completed";
      }
    } else if (dueDate >= today) {
      // Due date is today or in the future
      if (totalActualSubmissions === 0) {
        displayStatus = "Pending"; // Future due date, no submissions yet
      } else if (pendingActualSubmissions > 0) {
        displayStatus = "Pending"; // Future due date, some pending submissions
      } else {
        displayStatus = "Completed"; // Future due date, all submitted and not pending
      }
    }


    return {
      ...assignment,
      submissions: totalActualSubmissions, // Total actual submissions
      status: displayStatus // Dynamic status for the assignment
    };
  });

  const [assignments, setAssignments] = useState(initialAssignmentsWithCounts);
  const [selectedAssignment, setSelectedAssignment] = useState(null); // For View modal
  const [showCreateForm, setShowCreateForm] = useState(false); // For Create modal

  // New states for editing
  const [editingAssignment, setEditingAssignment] = useState(null); // Stores the assignment object being edited
  const [showEditForm, setShowEditForm] = useState(false); // Controls visibility of Edit modal
  
  // State to control full page view for submissions
  const [showViewSubmissionsPage, setShowViewSubmissionsPage] = useState(false);
  const [selectedClassFilter, setSelectedClassFilter] = useState("All");
  const [selectedSectionFilter, setSelectedSectionFilter] = useState("All"); // New state for section filter


  const [alert, setAlert] = useState({ message: '', type: '' });

  // Dynamically get unique classes and sections from assignments data
  // Use `initialAssignmentsData` for full list of classes/sections, even if no submissions yet
  const uniqueClasses = [...new Set(initialAssignmentsData.map(a => a.class))].sort();
  const uniqueSections = [...new Set(initialAssignmentsData.map(a => a.section))].sort();

  const allAvailableClasses = ["All", ...uniqueClasses];
  const allAvailableSections = ["All", ...uniqueSections];


  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment); // Set the assignment to be edited
    setShowEditForm(true); // Open the edit form
    setAlert({ message: '', type: '' }); // Clear any previous alerts
  };

  const deleteAssignment = (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(assignments.filter(assignment => assignment.id !== id));
      setAlert({ message: 'Assignment deleted successfully!', type: 'success' });
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const classMatch = selectedClassFilter === "All" || assignment.class === selectedClassFilter;
    const sectionMatch = selectedSectionFilter === "All" || assignment.section === selectedSectionFilter;
    return classMatch && sectionMatch;
  });

  // In the view modal, totalSubmissions, pendingSubmissions, and lateSubmissions are for the selected assignment
  // Filter mockSubmissionsData based on the selectedAssignment's ID
  const submissionsForSelectedAssignment = selectedAssignment
    ? mockSubmissionsData.filter(s => s.assignmentId === selectedAssignment.id)
    : [];
  const totalSubmissions = submissionsForSelectedAssignment.length;
  const pendingSubmissions = submissionsForSelectedAssignment.filter(s => s.status === "Pending").length;

  // Calculate late submissions for the *selected assignment* in the modal
  const lateSubmissionsForModal = selectedAssignment
    ? submissionsForSelectedAssignment.filter(s => {
        const submittedDate = new Date(s.submittedDate);
        submittedDate.setHours(0, 0, 0, 0); // Normalize to start of day
        const dueDate = new Date(selectedAssignment.dueDate);
        dueDate.setHours(0, 0, 0, 0); // Normalize to start of day
        return submittedDate > dueDate;
      }).length
    : 0;

  // --- NEW CALCULATIONS FOR GLOBAL SUMMARY STATS ---
  const getSubmissionsByFilter = (submissionsData, classFilter, sectionFilter) => {
    let filteredSubmissions = submissionsData;
    if (classFilter !== "All") {
      const filteredAssignmentIds = initialAssignmentsData
        .filter(a => a.class === classFilter)
        .map(a => a.id);
      filteredSubmissions = filteredSubmissions.filter(s => filteredAssignmentIds.includes(s.assignmentId));
    }
    if (sectionFilter !== "All") {
      const filteredAssignmentIds = initialAssignmentsData
        .filter(a => a.section === sectionFilter)
        .map(a => a.id);
      filteredSubmissions = filteredSubmissions.filter(s => filteredAssignmentIds.includes(s.assignmentId));
    }
    return filteredSubmissions;
  };

  const filteredMockSubmissions = getSubmissionsByFilter(mockSubmissionsData, selectedClassFilter, selectedSectionFilter);

  const totalPendingSubmissionsGlobal = filteredMockSubmissions.filter(s => s.status === "Pending").length;

  const totalLateSubmissionsGlobal = filteredMockSubmissions.filter(s => {
    const assignment = initialAssignmentsData.find(a => a.id === s.assignmentId);
    if (!assignment) return false; // Should not happen with valid data

    const submittedDate = new Date(s.submittedDate);
    submittedDate.setHours(0, 0, 0, 0);
    const dueDate = new Date(assignment.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return submittedDate > dueDate;
  }).length;
  // --- END NEW CALCULATIONS ---

  const handleBackToAssignments = (classFilterFromSubmissions = "All") => {
    setShowViewSubmissionsPage(false);
    // This line is crucial to set the filter back if provided by ViewSubmissions
    setSelectedClassFilter(classFilterFromSubmissions); 
  };


  if (showViewSubmissionsPage) {
    return (
      <ViewSubmissions
        // Pass relevant props to ViewSubmissions
        // No need for allSubmissions and assignmentsData as mock data is in ViewSubmissions
        onBackToAssignmentModule={handleBackToAssignments} // Correct prop name and function
        selectedClassFilter={selectedClassFilter} // Pass current filter
        allAvailableClasses={allAvailableClasses} // Pass available classes for dropdown
      />
    );
  }

  return (
        <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4 md:mb-0 flex items-center gap-3">
            <ClipboardList size={36} className="text-purple-600" />
            Assignment Management
          </h1>
          <div className="flex gap-3"> {/* Container for buttons */}
            <button
              onClick={() => setShowViewSubmissionsPage(true)} // Change to show full page
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition duration-200 shadow-md flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transform hover:-translate-y-0.5"
            >
              <ListTodo className="mr-2" size={20} />
              View Submissions
            </button>
            <button
              onClick={() => { setShowCreateForm(true); setAlert({ message: '', type: '' }); }}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition duration-200 shadow-md flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:-translate-y-0.5"
            >
              <PlusCircle className="mr-2" size={20} />
              Create New Assignment
            </button>
          </div>
        </div>

        {/* Alert Message */}
        {alert.message && (
          <div className={`flex items-center justify-between p-4 mb-6 rounded-lg shadow-md ${
            alert.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            alert.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
          }`} role="alert">
            <div className="flex items-center">
              {alert.type === 'success' && <CheckCircle className="mr-3" size={20} />}
              {alert.type === 'error' && <Info className="mr-3" size={20} />}
              <span className="text-sm font-medium">{alert.message}</span>
            </div>
            <button
              onClick={() => setAlert({ message: '', type: '' })}
              className={`p-1 rounded-full transition-colors ${
                alert.type === 'success' ? 'hover:bg-green-200' :
                alert.type === 'error' ? 'hover:bg-red-200' :
                'hover:bg-blue-200'
              }`}
              aria-label="Dismiss alert"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Class and Section Filter Dropdowns and Stats Cards */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4"> {/* Container for filters */}
            {/* Course Filter */}
            <div>
              <label htmlFor="classFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Stream:</label>
              <div className="relative">
                <select
                  id="classFilter"
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
                >
                  {allAvailableClasses.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* Section Filter */}
            <div>
              <label htmlFor="sectionFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Section:</label>
              <div className="relative">
                <select
                  id="sectionFilter"
                  value={selectedSectionFilter}
                  onChange={(e) => setSelectedSectionFilter(e.target.value)}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
                >
                  {allAvailableSections.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
                <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-center items-center text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Assignments</h3>
              <p className="text-3xl font-bold text-indigo-600">
                {filteredAssignments.length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-center items-center text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Pending Submissions</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {totalPendingSubmissionsGlobal}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-center items-center text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Late Submissions</h3>
              <p className="text-3xl font-bold text-red-600">
                {totalLateSubmissionsGlobal}
              </p>
            </div>
          </div>
        </div>


        {/* Assignments Table */}
        <div className="rounded-xl border border-gray-200 shadow-lg overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stream</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Section</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                {/* Removed Status Column Header */}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submissions</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="transition-colors duration-200 hover:bg-indigo-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{assignment.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{assignment.class}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{assignment.section}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{assignment.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{assignment.dueDate}</td>
                    {/* Removed Status Data Cell */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{assignment.submissions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="p-2.5 rounded-full text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          onClick={() => handleViewAssignment(assignment)}
                          title="View Details"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          className="p-2.5 rounded-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                          onClick={() => handleEditAssignment(assignment)}
                          title="Edit Assignment"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          className="p-2.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          onClick={() => deleteAssignment(assignment.id)}
                          title="Delete Assignment"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-6 text-center text-gray-500">
                    No assignments found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create Assignment Form (Modal) - Now a separate component */}
        <CreateAssignment
          showCreateForm={showCreateForm}
          setShowCreateForm={setShowCreateForm}
          setAlert={setAlert}
          assignments={assignments}
          setAssignments={setAssignments}
          allAvailableClasses={allAvailableClasses.filter(cls => cls !== "All")} // Pass filtered classes
          allAvailableSections={allAvailableSections.filter(sec => sec !== "All")} // Pass filtered sections
        />

        {/* Edit Assignment Form (Modal) */}
        <EditAssignment
          showEditForm={showEditForm}
          setShowEditForm={setShowEditForm}
          setAlert={setAlert}
          assignmentToEdit={editingAssignment} // Pass the assignment to edit
          setAssignmentToEdit={setEditingAssignment} // Setter for the assignment to edit
          assignments={assignments}
          setAssignments={setAssignments}
          allAvailableClasses={allAvailableClasses.filter(cls => cls !== "All")}
          allAvailableSections={allAvailableSections.filter(sec => sec !== "All")}
        />

        {/* View Assignment Modal */}
        {selectedAssignment && (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ClipboardList size={24} className="text-purple-600" /> {selectedAssignment.title}
                </h2>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                {/* Assignment Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                    <Users size={20} className="text-indigo-500" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Stream</h3>
                      <p className="text-base font-semibold text-gray-900">{selectedAssignment.class}</p>
                    </div>
                  </div>
                  {/* Display Section in View Assignment Modal */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                    <Tag size={20} className="text-purple-500" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Section</h3>
                      <p className="text-base font-semibold text-gray-900">{selectedAssignment.section}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                    <Tag size={20} className="text-green-500" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Subject</h3>
                      <p className="text-base font-semibold text-gray-900">{selectedAssignment.subject}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                    <Calendar size={20} className="text-orange-500" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Due Date</h3>
                      <p className="text-base font-semibold text-gray-900">{selectedAssignment.dueDate}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="text-base font-medium text-gray-700 mb-2 flex items-center gap-2"><FileText size={20} className="text-blue-500" /> Description</h3>
                  <p className="text-gray-800 leading-relaxed">{selectedAssignment.description || "No description provided."}</p>
                </div>

                {/* Summary Stats for Submissions */}
                <h3 className="text-xl font-bold text-gray-800 mb-4">Submission Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"> {/* Changed to 3 columns */}
                  <div className="bg-blue-50 p-5 rounded-xl shadow-sm border border-blue-100 flex flex-col justify-center items-center text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Submissions</h3>
                    <p className="text-3xl font-bold text-blue-600 flex items-center gap-1">
                      <UserCheck size={28} /> {totalSubmissions}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-5 rounded-xl shadow-sm border border-yellow-100 flex flex-col justify-center items-center text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Pending</h3>
                    <p className="text-3xl font-bold text-yellow-600 flex items-center gap-1">
                      <Clock size={28} /> {pendingSubmissions}
                    </p>
                  </div>
                   <div className="bg-red-50 p-5 rounded-xl shadow-sm border border-red-100 flex flex-col justify-center items-center text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Late</h3>
                    <p className="text-3xl font-bold text-red-600 flex items-center gap-1">
                      <AlertCircle size={28} /> {lateSubmissionsForModal}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end p-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default AssignmentModule;