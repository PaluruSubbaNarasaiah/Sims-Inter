import React, { useState } from 'react';
// Import JSZip and saveAs for file manipulation
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  FileText, // For View Details button
  Edit, // For Grade/Edit button
  ArrowLeft, // For back button
  UserCheck, // Main icon for Submissions
  Download, // For download button
} from 'lucide-react';

const ViewSubmissions = ({ onBackToAssignmentModule, selectedProgramFilter, allAvailablePrograms }) => {
  // Comprehensive mock data for ALL student submissions across different assignments
  // Now using useState to allow updates for grading
  const [mockAllSubmissions, setMockAllSubmissions] = useState([
    { submissionId: 101, assignmentTitle: "Calculus Problem Set", program: "MPC", semester: "Year 1", course: "Mathematics", studentName: "Arjun Reddy", submittedDate: "2025-09-19", status: "Graded", grade: "A", feedback: "Excellent work, very clear solutions.", file: { name: "arjun_calculus.pdf", content: "PDF content for Calculus Problem Set by Arjun Reddy." } },
    { submissionId: 102, assignmentTitle: "Calculus Problem Set", program: "MPC", semester: "Year 1", course: "Mathematics", studentName: "Priya Sharma", submittedDate: "2025-09-20", status: "Pending", grade: "-", feedback: "", file: { name: "priya_calculus.docx", content: "DOCX content for Calculus Problem Set by Priya Sharma." } },
    { submissionId: 103, assignmentTitle: "Cell Biology Lab Report", program: "BiPC", semester: "Year 1", course: "Biology", studentName: "Sneha Devi", submittedDate: "2025-09-21", status: "Graded", grade: "B+", feedback: "Good observations, but review cell structure diagrams.", file: { name: "sneha_biology_lab.pdf", content: "PDF content for Cell Biology Lab Report by Sneha Devi." } },
    { submissionId: 104, assignmentTitle: "Indian Constitution Essay", program: "HEC", semester: "Year 2", course: "Civics", studentName: "Rohan Joshi", submittedDate: "2025-09-29", status: "Late", grade: "C", feedback: "Submitted late. Content needs more constitutional details.", file: { name: "rohan_constitution.docx", content: "DOCX content for Indian Constitution Essay by Rohan Joshi." } },
    { submissionId: 105, assignmentTitle: "Organic Chemistry Reactions", program: "BiPC", semester: "Year 2", course: "Chemistry", studentName: "Divya Lakshmi", submittedDate: "2025-09-30", status: "Pending", grade: "-", feedback: "", file: { name: "divya_chemistry.pdf", content: "PDF content for Organic Chemistry Reactions by Divya Lakshmi." } },
    { submissionId: 106, assignmentTitle: "Mechanics Assignment", program: "MPC", semester: "Year 2", course: "Physics", studentName: "Vikram Rao", submittedDate: "2025-09-24", status: "Graded", grade: "B", feedback: "Solid understanding, minor errors in motion equations.", file: { name: "vikram_physics.pdf", content: "PDF content for Mechanics Assignment by Vikram Rao." } },
    { submissionId: 107, assignmentTitle: "Accounting Principles", program: "CEC", semester: "Year 1", course: "Commerce", studentName: "Kavya Rao", submittedDate: "2025-09-17", status: "Graded", grade: "A-", feedback: "Well prepared journal entries.", file: { name: "kavya_accounting.xlsx", content: "Excel content for Accounting Principles by Kavya Rao." } },
    { submissionId: 108, assignmentTitle: "Microeconomics Case Study", program: "MEC", semester: "Year 1", course: "Economics", studentName: "Karthik Nair", submittedDate: "2025-09-27", status: "Pending", grade: "-", feedback: "", file: { name: "karthik_economics.pdf", content: "PDF content for Microeconomics Case Study by Karthik Nair." } },
  ]);

  // State for filters and search
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterProgram, setFilterProgram] = useState(selectedProgramFilter || "All");
  const [searchTerm, setSearchTerm] = useState("");

  // States for modal management
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [currentGrade, setCurrentGrade] = useState('');
  const [currentFeedback, setCurrentFeedback] = useState('');

  // Use the allAvailablePrograms prop if passed, otherwise define locally
  const availablePrograms = allAvailablePrograms || ["All", "MPC", "BiPC", "CEC", "MEC", "HEC"];
  const allAvailableStatuses = ["All", "Graded", "Pending", "Late"];

  // Filter submissions based on current criteria
  const filteredSubmissions = mockAllSubmissions.filter(submission => {
    const matchesStatus = filterStatus === "All" || submission.status === filterStatus;
    const matchesProgram = filterProgram === "All" || submission.program === filterProgram;
    const matchesSearch = searchTerm === "" ||
      submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.course.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesProgram && matchesSearch;
  });

  // Handle Download: Simulates downloading the student's uploaded file as a zip
  const handleDownload = async (submissionId) => {
    const submission = mockAllSubmissions.find(s => s.submissionId === submissionId);
    if (submission && submission.file) {
      const zip = new JSZip();
      zip.file(submission.file.name, submission.file.content);
      
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${submission.studentName.replace(/\s/g, '_')}_${submission.assignmentTitle.replace(/\s/g, '_')}_submission.zip`);
      alert(`Downloading ${submission.file.name} for ${submission.studentName}.`);
    } else {
      alert("No file available for download for this submission.");
    }
  };

  // Handle View Details: Opens a modal with submission details
  const handleViewDetails = (submissionId) => {
    const submission = mockAllSubmissions.find(s => s.submissionId === submissionId);
    setSelectedSubmission(submission);
    setShowViewDetailsModal(true);
  };

  // Handle Grade: Opens a modal to input grade and feedback
  const handleGrade = (submissionId) => {
    const submission = mockAllSubmissions.find(s => s.submissionId === submissionId);
    setSelectedSubmission(submission);
    setCurrentGrade(submission?.grade === '-' ? '' : submission?.grade || '');
    setCurrentFeedback(submission?.feedback || '');
    setShowGradeModal(true);
  };

  // Handle saving the grade from the modal
  const saveGrade = () => {
    if (!selectedSubmission) return;

    setMockAllSubmissions(prevSubmissions =>
      prevSubmissions.map(s =>
        s.submissionId === selectedSubmission.submissionId
          ? {
              ...s,
              grade: currentGrade.trim() === "" ? "-" : currentGrade,
              feedback: currentFeedback,
              status: "Graded" // Mark as graded
            }
          : s
      )
    );
    alert(`Graded submission ${selectedSubmission.submissionId}: Grade - ${currentGrade}, Feedback - ${currentFeedback}`);
    setShowGradeModal(false); // Close modal after saving
    setSelectedSubmission(null);
    setCurrentGrade('');
    setCurrentFeedback('');
  };

  // Function to go back to AssignmentModule using the prop
  const handleGoBack = () => {
    onBackToAssignmentModule(filterProgram); 
  };

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4 md:mb-0 flex items-center gap-3">
          <UserCheck size={36} className="text-blue-600" />
          Student Submissions
        </h1>
        <button
          onClick={handleGoBack}
          className="px-5 py-2.5 bg-gray-600 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition duration-200 shadow-md flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transform hover:-translate-y-0.5"
        >
          <ArrowLeft className="mr-2" size={20} /> Back to Assignments
        </button>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Submissions:</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student, assignment, course..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status:</label>
          <div className="relative">
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
            >
              {allAvailableStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
        <div>
          <label htmlFor="programFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Stream:</label>
          <div className="relative">
            <select
              id="programFilter"
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
            >
              {availablePrograms.map(prog => (
                <option key={prog} value={prog}>{prog}</option>
              ))}
            </select>
            <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
        <div className="flex items-end">
          <div className="bg-white p-3 rounded-xl shadow-md border border-gray-200 flex flex-col justify-center items-center text-center w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Submissions</h3>
            <p className="text-3xl font-bold text-blue-600">
              {filteredSubmissions.length}
            </p>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="rounded-xl border border-gray-200 shadow-lg overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assignment</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stream</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted On</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((submission) => (
                <tr key={submission.submissionId} className="transition-colors duration-200 hover:bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.assignmentTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.program}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.semester}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.course}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.submittedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold
                      ${submission.status === "Graded" ? "bg-green-100 text-green-800" :
                        submission.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.grade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                        <button
                            className="p-2.5 rounded-full text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            onClick={() => handleViewDetails(submission.submissionId)}
                            title="View Details"
                        >
                            <FileText size={20} />
                        </button>
                        <button
                            className="p-2.5 rounded-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            onClick={() => handleGrade(submission.submissionId)}
                            title="Grade Submission"
                        >
                            <Edit size={20} />
                        </button>
                        <button
                            className="p-2.5 rounded-full text-gray-600 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            onClick={() => handleDownload(submission.submissionId)}
                            title="Download Submission"
                        >
                            <Download size={20} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-6 text-center text-gray-500">
                  No submissions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {showViewDetailsModal && selectedSubmission && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setShowViewDetailsModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Submission Details</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Student Name:</strong> {selectedSubmission.studentName}</p>
              <p><strong>Assignment:</strong> {selectedSubmission.assignmentTitle}</p>
              <p><strong>Stream:</strong> {selectedSubmission.program}</p>
              <p><strong>Year:</strong> {selectedSubmission.semester}</p>
              <p><strong>Course:</strong> {selectedSubmission.course}</p>
              <p><strong>Submitted On:</strong> {selectedSubmission.submittedDate}</p>
              <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedSubmission.status === "Graded" ? "bg-green-100 text-green-800" : selectedSubmission.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{selectedSubmission.status}</span></p>
              <p><strong>Grade:</strong> {selectedSubmission.grade}</p>
              <p><strong>Feedback:</strong> {selectedSubmission.feedback || 'No feedback provided.'}</p>
              <p><strong>Submitted File:</strong> {selectedSubmission.file?.name || 'N/A'}</p>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowViewDetailsModal(false)}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grade Submission Modal */}
      {showGradeModal && selectedSubmission && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setShowGradeModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Grade Submission</h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Student:</strong> {selectedSubmission.studentName}</p>
              <p><strong>Assignment:</strong> {selectedSubmission.assignmentTitle}</p>
              <div>
                <label htmlFor="gradeInput" className="block text-sm font-medium text-gray-700 mb-1">Grade:</label>
                <input
                  type="text"
                  id="gradeInput"
                  value={currentGrade}
                  onChange={(e) => setCurrentGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., A+, B, 95%"
                />
              </div>
              <div>
                <label htmlFor="feedbackInput" className="block text-sm font-medium text-gray-700 mb-1">Feedback:</label>
                <textarea
                  id="feedbackInput"
                  value={currentFeedback}
                  onChange={(e) => setCurrentFeedback(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-y"
                  placeholder="Provide feedback for the student..."
                ></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowGradeModal(false)}
                className="px-5 py-2.5 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={saveGrade}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                Save Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSubmissions;