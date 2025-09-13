import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  PlusCircle,
  X,
  School,
  Users,
  User,
  BookText,
  GraduationCap,
  Save,
  CheckCircle,
  Info
} from 'lucide-react';

const ClassModule = () => {
  // Sample data for Andhra Pradesh junior college streams
  const initialProgramsData = [
    {
      id: 1,
      programName: 'MPC',
      semester: 1,
      strength: 45,
      coordinator: 'Mr. Ravi Kumar',
      lecturers: [
        { name: 'Mr. Ravi Kumar', empId: 'L001', courses: ['Mathematics'] },
        { name: 'Ms. Priya Sharma', empId: 'L002', courses: ['Physics'] },
        { name: 'Dr. Suresh Reddy', empId: 'L003', courses: ['Chemistry'] }
      ]
    },
    {
      id: 2,
      programName: 'MPC',
      semester: 2,
      strength: 42,
      coordinator: 'Mr. Ravi Kumar',
      lecturers: [
        { name: 'Mr. Ravi Kumar', empId: 'L001', courses: ['Mathematics'] },
        { name: 'Ms. Priya Sharma', empId: 'L002', courses: ['Physics'] },
        { name: 'Dr. Suresh Reddy', empId: 'L003', courses: ['Chemistry'] }
      ]
    },
    {
      id: 3,
      programName: 'BiPC',
      semester: 1,
      strength: 60,
      coordinator: 'Dr. Lakshmi Devi',
      lecturers: [
        { name: 'Dr. Lakshmi Devi', empId: 'L004', courses: ['Biology'] },
        { name: 'Ms. Priya Sharma', empId: 'L002', courses: ['Physics'] },
        { name: 'Dr. Suresh Reddy', empId: 'L003', courses: ['Chemistry'] }
      ]
    },
    {
      id: 4,
      programName: 'CEC',
      semester: 1,
      strength: 35,
      coordinator: 'Mr. Venkat Rao',
      lecturers: [
        { name: 'Mr. Venkat Rao', empId: 'L005', courses: ['Commerce'] },
        { name: 'Ms. Anjali Gupta', empId: 'L006', courses: ['Economics'] },
        { name: 'Mr. Krishna Murthy', empId: 'L007', courses: ['Civics'] }
      ]
    },
    {
      id: 5,
      programName: 'MEC',
      semester: 1,
      strength: 40,
      coordinator: 'Ms. Anjali Gupta',
      lecturers: [
        { name: 'Mr. Ravi Kumar', empId: 'L001', courses: ['Mathematics'] },
        { name: 'Ms. Anjali Gupta', empId: 'L006', courses: ['Economics'] },
        { name: 'Mr. Venkat Rao', empId: 'L005', courses: ['Commerce'] }
      ]
    },
    {
      id: 6,
      programName: 'HEC',
      semester: 1,
      strength: 38,
      coordinator: 'Ms. Sita Mahalakshmi',
      lecturers: [
        { name: 'Ms. Sita Mahalakshmi', empId: 'L008', courses: ['History'] },
        { name: 'Ms. Anjali Gupta', empId: 'L006', courses: ['Economics'] },
        { name: 'Mr. Krishna Murthy', empId: 'L007', courses: ['Civics'] }
      ]
    },
  ];

  const [programs, setPrograms] = useState(initialProgramsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPrograms, setFilteredPrograms] = useState(initialProgramsData);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [studentCounts, setStudentCounts] = useState({});

  const [newProgram, setNewProgram] = useState({
    programName: '',
    semester: '',
  });

  const [addedSemesters, setAddedSemesters] = useState([]);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [filterClass, setFilterClass] = useState('All');
  const [filterSection, setFilterSection] = useState('All');

  const programNames = [...new Set(initialProgramsData.map(p => p.programName))];
  const semesters = [...new Set(initialProgramsData.map(p => p.semester))].sort((a, b) => a - b);

  // Dummy fetch functions
  const fetchPrograms = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPrograms(initialProgramsData);
      setFilteredPrograms(initialProgramsData);
      setLoading(false);
    }, 500);
  };

  const fetchStudentCounts = () => {
    const counts = {};
    initialProgramsData.forEach(prog => {
      counts[`${prog.programName}-${prog.semester}`] = prog.strength;
    });
    setStudentCounts(counts);
  };

  const getCoordinatorForProgram = (programName, semester) => {
    const programItem = programs.find(p => p.programName === programName && p.semester === semester);
    return programItem && programItem.coordinator ? programItem.coordinator : 'Not Assigned';
  };

  useEffect(() => {
    fetchPrograms();
    fetchStudentCounts();
  }, []);

  useEffect(() => {
    const results = programs.filter(
      (prog) => {
        const matchesSearchTerm =
          prog.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prog.semester.toString().includes(searchTerm.toLowerCase()) ||
          getCoordinatorForProgram(prog.programName, prog.semester).toLowerCase().includes(searchTerm.toLowerCase()) ||
          prog.lecturers.some(lecturer =>
            lecturer.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

        const matchesClassFilter =
          filterClass === 'All' || prog.programName === filterClass;

        const matchesSectionFilter =
          filterSection === 'All' || prog.semester.toString() === filterSection;

        return matchesSearchTerm && matchesClassFilter && matchesSectionFilter;
      }
    );
    setFilteredPrograms(results);
  }, [searchTerm, programs, filterClass, filterSection]);

  const resetForm = () => {
    setNewProgram({ programName: '', semester: '' });
    setEditingProgramId(null);
    setIsAddEditModalOpen(false);
    setAddedSemesters([]);
    setAlert({ message: '', type: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (!newProgram.programName || (!editingProgramId && !newProgram.semester && addedSemesters.length === 0)) {
      setAlert({ message: 'Please fill in Program Name and Semester.', type: 'error' });
      setSubmitting(false);
      return;
    }
    setTimeout(() => {
      if (editingProgramId) {
        setPrograms(prev => prev.map(prog => prog.id === editingProgramId ? { ...prog, programName: newProgram.programName, semester: newProgram.semester } : prog));
        setAlert({ message: 'Program updated successfully!', type: 'success' });
      } else {
        const newId = programs.length + 1;
        const programData = {
          id: newId,
          programName: newProgram.programName,
          strength: 0,
          semester: newProgram.semester,
          coordinator: 'Not Assigned',
          lecturers: []
        };
        setPrograms(prev => [...prev, programData]);
        setAlert({ message: 'Program added successfully!', type: 'success' });
      }
      fetchPrograms();
      fetchStudentCounts();
      resetForm();
      setSubmitting(false);
    }, 1000);
  };

  const handleAddAnotherSemester = () => {
    setSubmitting(true);
    if (!newProgram.programName || !newProgram.semester) {
      setAlert({ message: 'Please fill in Program Name and Semester before adding another.', type: 'error' });
      setSubmitting(false);
      return;
    }
    setTimeout(() => {
      const newId = programs.length + 1;
      const programData = {
        id: newId,
        programName: newProgram.programName,
        strength: 0,
        semester: newProgram.semester,
        coordinator: 'Not Assigned',
        lecturers: []
      };
      setPrograms(prev => [...prev, programData]);
      setAlert({ message: `Semester '${newProgram.semester}' added for ${newProgram.programName}! Add another or close.`, type: 'success' });
      setAddedSemesters(prev => [...prev, newProgram.semester]);
      setNewProgram(prev => ({ ...prev, semester: '' }));
      fetchPrograms();
      fetchStudentCounts();
      setSubmitting(false);
    }, 1000);
  };

  const handleViewDetails = (programId) => {
    const selected = programs.find(prog => prog.id === programId);
    setSelectedProgram(selected);
    setIsViewModalOpen(true);
  };

  const handleEdit = (programId) => {
    const programToEdit = programs.find(prog => prog.id === programId);
    if (!programToEdit) {
      setAlert({ message: 'Program not found', type: 'error' });
      return;
    }
    setEditingProgramId(programId);
    setNewProgram({
      programName: programToEdit.programName,
      semester: programToEdit.semester,
    });
    setIsAddEditModalOpen(true);
    setAlert({ message: '', type: '' });
    setAddedSemesters([]);
  };

  const handleDelete = (programId) => {
    if (window.confirm('Are you sure you want to delete this program entry?')) {
      setTimeout(() => {
        setPrograms(prev => prev.filter(prog => prog.id !== programId));
        setAlert({ message: 'Program entry deleted successfully!', type: 'success' });
        fetchPrograms();
        fetchStudentCounts();
      }, 500);
    }
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setSelectedProgram(null);
  };

  if (loading) {
    return (
      <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
          <School className="mr-4 text-indigo-600" size={36} />
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">Stream Management</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-lg text-gray-600">Loading programs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center">
          <School className="mr-4 text-indigo-600" size={36} />
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">Stream Management</h1>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <select
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="All">All Streams</option>
              {programNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
            >
              <option value="All">All Years</option>
              {semesters.map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {alert.message && (
        <div className={`flex items-center justify-between p-4 mb-6 rounded-lg shadow-md ${alert.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
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
            className={`p-1 rounded-full transition-colors ${alert.type === 'success' ? 'hover:bg-green-200' :
              alert.type === 'error' ? 'hover:bg-red-200' :
                'hover:bg-blue-200'
              }`}
            aria-label="Dismiss alert"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 items-center">
        <div className="relative flex-grow w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            placeholder="Search streams, years, or coordinator names"
            className="pl-10 pr-4 py-2.5 w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { resetForm(); setIsAddEditModalOpen(true); }}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition transform hover:-translate-y-0.5"
          >
            <PlusCircle size={20} /> Add New Stream
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Stream
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Year
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Strength
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Coordinator
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Lecturers
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((programItem) => (
                <tr key={programItem.id} className="hover:bg-indigo-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {programItem.programName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {programItem.semester === 1 ? '1st Year' : '2nd Year'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-900 mr-2">
                        {studentCounts[`${programItem.programName}-${programItem.semester}`] || 0}
                      </span>
                      <Users size={20} className="text-gray-500" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {getCoordinatorForProgram(programItem.programName, programItem.semester)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex flex-wrap gap-1">
                      {programItem.lecturers.map((lecturer, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <User size={12} className="mr-1" />{lecturer.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(programItem.id)}
                        className="p-2.5 rounded-full text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        title="View Profile"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => handleEdit(programItem.id)}
                        className="p-2.5 rounded-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(programItem.id)}
                        className="p-2.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-sm text-gray-500">
                  No programs found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isAddEditModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 md:p-8 w-full max-w-lg md:max-w-xl shadow-2xl border border-gray-100 transition-all duration-300 ease-in-out transform scale-100 opacity-100">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">{editingProgramId ? 'Edit Stream' : 'Add New Stream'}</h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="programName" className="block text-sm font-medium text-gray-700 mb-1">Stream Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="programName"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                    value={newProgram.programName}
                    onChange={(e) => {
                      setNewProgram({ ...newProgram, programName: e.target.value, semester: '' });
                      setAddedSemesters([]);
                    }}
                    placeholder="e.g., MPC, BiPC"
                    required
                    disabled={editingProgramId || addedSemesters.length > 0}
                  />
                </div>

                {!editingProgramId && addedSemesters.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Previously Added Semesters for {newProgram.programName}:</p>
                    <ul className="list-disc list-inside text-gray-600 text-sm">
                      {addedSemesters.map((semester, index) => (
                        <li key={index}>Semester: <span className="font-semibold">{semester}</span></li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">Year <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    id="semester"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 text-base transition-colors"
                    value={newProgram.semester}
                    onChange={(e) => setNewProgram({ ...newProgram, semester: e.target.value })}
                    placeholder="e.g., 1, 2"
                    min="1"
                    max="2"
                    required
                  />
                </div>

                <div className="flex justify-between space-x-3 pt-4 border-t border-gray-100">
                  {!editingProgramId && (
                    <button
                      type="button"
                      onClick={handleAddAnotherSemester}
                      className="flex items-center px-4 py-2.5 border border-indigo-300 rounded-lg shadow-sm text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={submitting || !newProgram.programName || !newProgram.semester}
                    >
                      <PlusCircle className="mr-2" size={20} />
                      Add Year & Add Another
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 transition-colors"
                    disabled={submitting}
                  >
                    <X className="mr-2" size={20} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting || !newProgram.programName || (!editingProgramId && addedSemesters.length === 0 && !newProgram.semester)}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingProgramId ? 'Saving...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2" size={20} />
                        {editingProgramId ? 'Save Changes' : (addedSemesters.length > 0 ? 'Done Adding' : 'Add Stream')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform scale-100 opacity-100 transition-all duration-300 ease-in-out">
            <div className="flex justify-between items-center border-b p-4"><h2 className="text-xl font-bold text-gray-900">Stream Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-indigo-50 p-5 rounded-lg shadow-sm border border-indigo-100">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                    <Info size={22} className="mr-2 text-indigo-600" /> Stream Information
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Stream:</span> {selectedProgram.programName}</p>
                    <p><span className="font-medium">Semester:</span> {selectedProgram.semester || 'N/A'}</p>
                    <p><span className="font-medium">Students:</span> {studentCounts[`${selectedProgram.programName}-${selectedProgram.semester}`] || 0}</p>
                    <p><span className="font-medium">Coordinator:</span> {selectedProgram.coordinator}</p>
                  </div>
                </div>
                <div className="bg-purple-50 p-5 rounded-lg shadow-sm border border-purple-100">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center"><Users size={22} className="mr-2 text-purple-600" /> Stream Statistics</h3>
                  <div className="space-y-2 text-gray-700"><p><span className="font-medium">Enrolled Students:</span> {studentCounts[`${selectedProgram.programName}-${selectedProgram.semester}`] || 0}</p></div>
                </div>
              </div>
              <div className="bg-green-50 p-5 rounded-lg shadow-sm border border-green-100">
                <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                  <BookText size={22} className="mr-2 text-green-600" /> Lecturers & Subjects
                </h3>
                <div className="space-y-4">
                  {selectedProgram.lecturers.length > 0 ? selectedProgram.lecturers.map((lecturer, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <User size={20} className="text-gray-500 mr-2 mt-1" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-900">{lecturer.name} ({lecturer.empId})</p>
                        <p className="text-sm text-gray-600 mt-1">Subjects: {lecturer.courses.join(', ')}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500">No lecturers assigned to this program.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-100">
              <button
                onClick={closeModal}
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

export default ClassModule;