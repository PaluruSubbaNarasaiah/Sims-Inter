import React, { useState, useEffect } from 'react';
import {
  Search,
  PlusCircle,
  Trash2,
  X,
  Pencil,
  BookText, // Icon for Subject
  User, // For individual lecturer
  Info, // For info/error alert 
  CheckCircle, // For success alert
  Save // Added Save icon
} from 'lucide-react';

const SubjectModule = () => {
  // --- Data Structure Update ---
  // Initial data for Andhra Pradesh junior college streams and subjects
  const initialProgramCourses = () => {
    const programs = {};
    const programNames = ['MPC', 'BiPC', 'CEC', 'MEC', 'HEC'];
    programNames.forEach(program => {
      programs[program] = []; // Each program starts with an empty array of subjects
    });
    // Add Andhra Pradesh junior college stream subjects
    programs['MPC'] = [
      { id: 101, name: 'Mathematics', lecturers: [{ empId: 'L001', name: 'Mr. Ravi Kumar' }] },
      { id: 102, name: 'Physics', lecturers: [{ empId: 'L002', name: 'Ms. Priya Sharma' }] },
      { id: 103, name: 'Chemistry', lecturers: [{ empId: 'L003', name: 'Dr. Suresh Reddy' }] },
    ];
    programs['BiPC'] = [
      { id: 201, name: 'Biology', lecturers: [{ empId: 'L004', name: 'Dr. Lakshmi Devi' }] },
      { id: 202, name: 'Physics', lecturers: [{ empId: 'L002', name: 'Ms. Priya Sharma' }] },
      { id: 203, name: 'Chemistry', lecturers: [{ empId: 'L003', name: 'Dr. Suresh Reddy' }] },
    ];
    programs['CEC'] = [
      { id: 301, name: 'Commerce', lecturers: [{ empId: 'L005', name: 'Mr. Venkat Rao' }] },
      { id: 302, name: 'Economics', lecturers: [{ empId: 'L006', name: 'Ms. Anjali Gupta' }] },
      { id: 303, name: 'Civics', lecturers: [{ empId: 'L007', name: 'Mr. Krishna Murthy' }] },
    ];
    programs['MEC'] = [
      { id: 401, name: 'Mathematics', lecturers: [{ empId: 'L001', name: 'Mr. Ravi Kumar' }] },
      { id: 402, name: 'Economics', lecturers: [{ empId: 'L006', name: 'Ms. Anjali Gupta' }] },
      { id: 403, name: 'Commerce', lecturers: [{ empId: 'L005', name: 'Mr. Venkat Rao' }] },
    ];
    programs['HEC'] = [
      { id: 501, name: 'History', lecturers: [{ empId: 'L008', name: 'Ms. Sita Mahalakshmi' }] },
      { id: 502, name: 'Economics', lecturers: [{ empId: 'L006', name: 'Ms. Anjali Gupta' }] },
      { id: 503, name: 'Civics', lecturers: [{ empId: 'L007', name: 'Mr. Krishna Murthy' }] },
    ];
    return programs;
  };

  const [programCourses, setProgramCourses] = useState(() => {
    const storedProgramCourses = localStorage.getItem('programCourses');
    return storedProgramCourses ? JSON.parse(storedProgramCourses) : initialProgramCourses();
  });

  const [selectedProgram, setSelectedProgram] = useState('MPC'); // Default to MPC
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSubject, setNewSubject] = useState({
    name: '',
    group: '',
    year: '',
    lecturers: [{ empId: '', name: '' }]
  });
  const [showAddForm, setShowAddForm] = useState(false); 
  const [editingSubject, setEditingSubject] = useState(null); // Stores the entire subject object for editing
  const [alert, setAlert] = useState({ message: '', type: '' }); // type: 'success' or 'error'

  // Generate program options for Andhra Pradesh junior college
  const programOptions = ['MPC', 'BiPC', 'CEC', 'MEC', 'HEC'];

  // Update localStorage whenever classSubjects change
  useEffect(() => {
    localStorage.setItem('programCourses', JSON.stringify(programCourses));
  }, [programCourses]);

  // Filter and search functionality based on selectedClass
  useEffect(() => {
    const subjectsForSelectedProgram = programCourses[selectedProgram] || [];
    let results = subjectsForSelectedProgram;

    if (searchTerm) {
      results = results.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.lecturers.some(lecturer =>
          lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lecturer.empId.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setFilteredSubjects(results);
  }, [searchTerm, programCourses, selectedProgram]);

  // Add lecturer field in form
  const addLecturerField = () => {
    setNewSubject(prev => ({
      ...prev,
      lecturers: [...prev.lecturers, { empId: '', name: '' }]
    }));
  };

  // Remove lecturer field in form
  const removeLecturerField = (index) => {
    const updatedLecturers = [...newSubject.lecturers];
    updatedLecturers.splice(index, 1);
    setNewSubject(prev => ({
      ...prev,
      lecturers: updatedLecturers
    }));
  };

  // Handle lecturer input change
  const handleLecturerChange = (index, field, value) => {
    const updatedLecturers = [...newSubject.lecturers];
    updatedLecturers[index][field] = value;
    setNewSubject(prev => ({
      ...prev,
      lecturers: updatedLecturers
    }));
  };

  const resetForm = () => {
    setNewSubject({
      name: '',
      group: '',
      year: '',
      lecturers: [{ empId: '', name: '' }]
    });
    setEditingSubject(null);
    setShowAddForm(false);
  };

  // Add new subject for the selected class
  const handleAddSubject = () => {
    if (!newSubject.name || !newSubject.group || !newSubject.year) {
      setAlert({ message: 'Subject Name, Group, and Year are required.', type: 'error' });
      return;
    }
    const validLecturers = newSubject.lecturers.filter(t => t.empId && t.name);
    if (validLecturers.length === 0) {
      setAlert({ message: 'At least one lecturer (with Employee ID and Name) is required for the subject.', type: 'error' });
      return;
    } 
 
    const subjectToAdd = {
      id: Date.now(),
      name: newSubject.name,
      group: newSubject.group,
      year: newSubject.year,
      lecturers: validLecturers
    };

    setProgramCourses(prevProgramCourses => ({
      ...prevProgramCourses, 
      [selectedProgram]: [...(prevProgramCourses[selectedProgram] || []), subjectToAdd]
    }));

    setAlert({ message: `Subject "${newSubject.name}" added successfully to ${selectedProgram}!`, type: 'success' });
    resetForm();
  };

  // Delete subject from the selected program
  const handleDeleteSubject = (id) => {
    if (window.confirm(`Are you sure you want to delete this subject from ${selectedProgram}?`)) {
      setProgramCourses(prevProgramCourses => ({
        ...prevProgramCourses,
        [selectedProgram]: (prevProgramCourses[selectedProgram] || []).filter(subject => subject.id !== id)
      }));
      setAlert({ message: 'Subject deleted successfully!', type: 'success' });
    }
  };

  // Edit subject
  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setNewSubject({
      name: subject.name,
      group: subject.group || '',
      year: subject.year || '',
      lecturers: subject.lecturers.length > 0 ? subject.lecturers : [{ empId: '', name: '' }]
    });
    setShowAddForm(true);
    setAlert({ message: '', type: '' });
  };

  // Update subject in the selected class
  const handleUpdateSubject = () => {
    if (!newSubject.name || !newSubject.group || !newSubject.year) {
      setAlert({ message: 'Subject Name, Group, and Year are required.', type: 'error' });
      return;
    }
    const validLecturers = newSubject.lecturers.filter(t => t.empId && t.name);
    if (validLecturers.length === 0) {
      setAlert({ message: 'At least one lecturer (with Employee ID and Name) is required for the subject.', type: 'error' });
      return;
    }

    setProgramCourses(prevProgramCourses => ({
      ...prevProgramCourses,
      [selectedProgram]: (prevProgramCourses[selectedProgram] || []).map(subject =>
        subject.id === editingSubject.id ? {
          ...subject,
          name: newSubject.name,
          group: newSubject.group,
          year: newSubject.year,
          lecturers: validLecturers
        } : subject
      )
    }));
    setAlert({ message: 'Subject updated successfully!', type: 'success' });
    resetForm();
  };

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
      {/* Header */}
      <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
        <BookText className="mr-4 text-indigo-600" size={36} />
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">Subject Management</h1>
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

      {/* Class Selection and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        {/* Class Selector */}
        <div className="relative w-full md:w-auto">
          <select
            className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
            value={selectedProgram}
            onChange={(e) => {
              setSelectedProgram(e.target.value);
              setSearchTerm(''); // Clear search when program changes
              setAlert({ message: '', type: '' }); // Clear alert
            }}
          >
            {programOptions.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select> 
          <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </div>

        {/* Search Input */}
        <div className="relative flex-grow w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={`Search subjects for ${selectedProgram}...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Add Subject Button */}
        <button
          onClick={() => {
            resetForm();
            setShowAddForm(true);
            setAlert({ message: '', type: '' });
          }}
          className="w-full md:w-auto flex items-center justify-center px-6 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition transform hover:-translate-y-0.5" 
        >
          <PlusCircle className="mr-2" size={20} /> Add Subject
        </button>
      </div>

      {/* Add/Edit Subject Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 md:p-8 w-full max-w-lg md:max-w-xl shadow-2xl border border-gray-100 transition-all duration-300 ease-in-out transform scale-100 opacity-100">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200"> 
              <h2 className="text-2xl font-bold text-gray-900">
                {editingSubject ? `Edit Subject for ${selectedProgram}` : `Add New Subject for ${selectedProgram}`}
              </h2>
              <button
                onClick={() => { setShowAddForm(false); setAlert({ message: '', type: '' }); }}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); editingSubject ? handleUpdateSubject() : handleAddSubject(); }}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-1">Subject Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="subjectName"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    placeholder="Enter subject name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subjectGroup" className="block text-sm font-medium text-gray-700 mb-1">Group <span className="text-red-500">*</span></label>
                  <select
                    id="subjectGroup"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
                    value={newSubject.group || ''}
                    onChange={(e) => setNewSubject({ ...newSubject, group: e.target.value })}
                    required
                  >
                    <option value="">Select Group</option>
                    <option value="MPC">MPC</option>
                    <option value="BiPC">BiPC</option>
                    <option value="CEC">CEC</option>
                    <option value="MEC">MEC</option>
                    <option value="HEC">HEC</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subjectYear" className="block text-sm font-medium text-gray-700 mb-1">Year <span className="text-red-500">*</span></label>
                  <select
                    id="subjectYear"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white pr-10 text-gray-900 transition-colors cursor-pointer"
                    value={newSubject.year || ''}
                    onChange={(e) => setNewSubject({ ...newSubject, year: e.target.value })}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lecturers <span className="text-red-500">*</span></label>
                  {newSubject.lecturers.map((lecturer, index) => (
                    <div key={index} className="flex gap-2 mb-3 items-center">
                      <input
                        type="text"
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                        value={lecturer.empId}
                        onChange={(e) => handleLecturerChange(index, 'empId', e.target.value)}
                        placeholder="Employee ID"
                      />
                      <input
                        type="text"
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                        value={lecturer.name}
                        onChange={(e) => handleLecturerChange(index, 'name', e.target.value)}
                        placeholder="Lecturer Name"
                      />
                      {newSubject.lecturers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLecturerField(index)}
                          className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 transition-colors"
                          title="Remove Lecturer"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addLecturerField}
                    className="mt-1 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                  >
                    <PlusCircle size={18} /> Add Another Lecturer
                  </button>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => { resetForm(); setAlert({ message: '', type: '' }); }}
                    className="flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 transition-colors"
                  >
                    <X className="mr-2" size={20} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
                  >
                    <Save className="mr-2" size={20} />
                    {editingSubject ? 'Save Changes' : 'Add Subject'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subjects Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"> 
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lecturers</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map(subject => (
                <tr key={subject.id} className="transition-colors duration-200 hover:bg-indigo-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {subject.name}
                  </td> 
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {subject.lecturers.length > 0 ? (
                        subject.lecturers.map((lecturer, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700">
                            <User size={16} className="mr-1.5 text-gray-500" />
                            <span className="font-medium">{lecturer.name}</span>
                            <span className="text-gray-500 ml-1">({lecturer.empId})</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm italic">No lecturers assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSubject(subject)}
                        className="p-2.5 rounded-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        title="Edit Subject"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(subject.id)}
                        className="p-2.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        title="Delete Subject"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-6 text-center text-gray-500">
                  No subjects found for {selectedProgram} matching your criteria.
                </td>
              </tr> 
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectModule; 