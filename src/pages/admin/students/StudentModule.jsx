// StudentModule.jsx
import React, { useState } from 'react';
import Select from 'react-select';
import {
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Edit,
  Trash,
  Plus,
  Filter,
  Search,
  Users,
  CheckCircle,
  Briefcase,
  FileText,
} from 'lucide-react';
import { allPrograms } from '../results/ReportsData';
import ViewEditStudent from './ViewEditStudent';

const MOCK_STUDENTS = [
  {
    id: 's1',
    admissionNo: 'ADM-2024-001',
    studentId: 'MPC2024001',
    password: 'student123',
    name: 'Arjun Reddy',
    rollNumber: 'MPC24001',
    program: 'MPC',
    semester: 1,
    parent: 'Rajesh Reddy',
    status: 'active',
    avatar: 'https://via.placeholder.com/150/0066CC/FFFFFF?text=AR',
    address: '123 Jubilee Hills, Hyderabad, Telangana 500033',
    gender: 'Male',
    dateOfBirth: '2002-03-15',
    studentType: 'Current Student',
    documents: [],
  },
  {
    id: 's2',
    admissionNo: 'ADM-2024-002',
    studentId: 'CEC2024002',
    password: 'student123',
    name: 'Priya Sharma',
    rollNumber: 'CEC24002',
    program: 'CEC',
    semester: 2,
    parent: 'Suresh Sharma',
    status: 'active',
    avatar: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=PS',
    address: '456 Banjara Hills, Hyderabad, Telangana 500034',
    gender: 'Female',
    dateOfBirth: '2001-07-22',
    studentType: 'Current Student',
    documents: [],
  },
  {
    id: 's3',
    admissionNo: 'ADM-2024-003',
    studentId: 'HEC2024003',
    password: 'student123',
    name: 'Sneha Devi',
    rollNumber: 'HEC24003',
    program: 'HEC',
    semester: 1,
    parent: 'Vinod Gupta',
    status: 'active',
    avatar: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=SD',
    address: '789 Madhapur, Hyderabad, Telangana 500081',
    gender: 'Female',
    dateOfBirth: '2003-01-10',
    studentType: 'Migrated Student',
    previousSchoolName: 'Sri Chaitanya Junior College',
    previousSchoolAddress: '36 Ameerpet, Hyderabad, Telangana 500016',
    previousSchoolStartDate: '2021-06-01',
    previousSchoolEndDate: '2023-05-31',
    documents: [
      { name: 'Transfer Certificate.pdf', url: 'http://example.com/docs/tc_sneha.pdf' },
      { name: 'Migration Certificate.pdf', url: 'http://example.com/docs/mc_sneha.pdf' }
    ],
  },
  {
    id: 's4',
    admissionNo: 'ADM-2024-004',
    studentId: 'BiPC2024004',
    password: 'student123',
    name: 'Rohan Joshi',
    rollNumber: 'BiPC24004',
    program: 'BiPC',
    semester: 2,
    parent: 'Ramesh Joshi',
    status: 'active',
    avatar: 'https://via.placeholder.com/150/FFE66D/000000?text=RJ',
    address: '321 Kondapur, Hyderabad, Telangana 500084',
    gender: 'Male',
    dateOfBirth: '2000-11-05',
    studentType: 'Current Student',
    documents: [],
  },
  {
    id: 's5',
    admissionNo: 'ADM-2024-005',
    studentId: 'MPC2024005',
    password: 'student123',
    name: 'Vikram Rao',
    rollNumber: 'MPC24005',
    program: 'MPC',
    semester: 2,
    parent: 'Harish Rao',
    status: 'active',
    avatar: 'https://via.placeholder.com/150/A8E6CF/000000?text=VR',
    address: '654 Gachibowli, Hyderabad, Telangana 500032',
    gender: 'Male',
    dateOfBirth: '2001-09-18',
    studentType: 'Current Student',
    documents: [],
  },
  {
    id: 's6',
    admissionNo: 'ADM-2024-006',
    studentId: 'MEC2024006',
    password: 'student123',
    name: 'Divya Lakshmi',
    rollNumber: 'MEC24006',
    program: 'MEC',
    semester: 1,
    parent: 'Krishna Lakshmi',
    status: 'active',
    avatar: 'https://via.placeholder.com/150/FF8B94/FFFFFF?text=DL',
    address: '987 Kukatpally, Hyderabad, Telangana 500072',
    gender: 'Female',
    dateOfBirth: '2003-12-03',
    studentType: 'Current Student',
    documents: [],
  },
  {
    id: 's7',
    admissionNo: 'ADM-2024-007',
    studentId: 'CEC2024007',
    password: 'student123',
    name: 'Karthik Nair',
    rollNumber: 'CEC24007',
    program: 'CEC',
    semester: 1,
    parent: 'Sunil Nair',
    status: 'active',
    avatar: 'https://via.placeholder.com/150/C7CEEA/000000?text=KN',
    address: '147 Secunderabad, Hyderabad, Telangana 500003',
    gender: 'Male',
    dateOfBirth: '2002-06-14',
    studentType: 'Migrated Student',
    previousSchoolName: 'Narayana Junior College',
    previousSchoolAddress: 'Dilsukhnagar, Hyderabad, Telangana 500060',
    previousSchoolStartDate: '2020-07-01',
    previousSchoolEndDate: '2022-04-30',
    documents: [
      { name: 'Transfer Certificate.pdf', url: 'http://example.com/docs/tc_karthik.pdf' }
    ],
  },
  {
    id: 's8',
    admissionNo: 'ADM-2024-008',
    studentId: 'HEC2024008',
    password: 'student123',
    name: 'Kavya Rao',
    rollNumber: 'HEC24008',
    program: 'HEC',
    semester: 2,
    parent: 'Ashok Rao',
    status: 'active',
    avatar: 'https://via.placeholder.com/150/FFEAA7/000000?text=KR',
    address: '258 Miyapur, Hyderabad, Telangana 500049',
    gender: 'Female',
    dateOfBirth: '2000-04-28',
    studentType: 'Current Student',
    documents: [],
  },
  {
    id: 's9',
    admissionNo: 'ADM-2024-009',
    studentId: 'BiPC2024009',
    password: 'student123',
    name: 'Aditya Verma',
    rollNumber: 'BiPC24009',
    program: 'BiPC',
    semester: 1,
    parent: 'Prakash Verma',
    status: 'active',
    avatar: 'https://via.placeholder.com/150/DDA0DD/000000?text=AV',
    address: '369 Uppal, Hyderabad, Telangana 500039',
    gender: 'Male',
    dateOfBirth: '2003-08-12',
    studentType: 'Current Student',
    documents: [],
  },
  {
    id: 's10',
    admissionNo: 'ADM-2024-010',
    studentId: 'MEC2024010',
    password: 'student123',
    name: 'Ananya Reddy',
    rollNumber: 'MEC24010',
    program: 'MEC',
    semester: 2,
    parent: 'Ravi Reddy',
    status: 'active',
    avatar: 'https://via.placeholder.com/150/98D8C8/000000?text=AR',
    address: '741 LB Nagar, Hyderabad, Telangana 500074',
    gender: 'Female',
    dateOfBirth: '2000-02-17',
    studentType: 'Current Student',
    documents: [],
  },
  {
    id: 's11',
    admissionNo: 'ADM-2024-011',
    studentId: 'MPC2024011',
    password: 'student123',
    name: 'Rahul Gupta',
    rollNumber: 'MPC24011',
    program: 'MPC',
    semester: 2,
    parent: 'Manoj Gupta',
    status: 'active',
    avatar: 'https://via.placeholder.com/150/F7DC6F/000000?text=RG',
    address: '852 Nizampet, Hyderabad, Telangana 500090',
    gender: 'Male',
    dateOfBirth: '2001-10-25',
    studentType: 'Migrated Student',
    previousSchoolName: 'Fiitjee Junior College',
    previousSchoolAddress: 'Punjagutta, Hyderabad, Telangana 500082',
    previousSchoolStartDate: '2019-06-15',
    previousSchoolEndDate: '2021-05-20',
    documents: [
      { name: 'Transfer Certificate.pdf', url: 'http://example.com/docs/tc_rahul.pdf' },
      { name: 'Character Certificate.pdf', url: 'http://example.com/docs/cc_rahul.pdf' }
    ],
  },
  {
    id: 's12',
    admissionNo: 'ADM-2024-012',
    studentId: 'HEC2024012',
    password: 'student123',
    name: 'Meera Sharma',
    rollNumber: 'HEC24012',
    program: 'HEC',
    semester: 1,
    parent: 'Srinivas Sharma',
    status: 'active',
    avatar: 'https://via.placeholder.com/150/BB8FCE/FFFFFF?text=MS',
    address: '963 Kompally, Hyderabad, Telangana 500014',
    gender: 'Female',
    dateOfBirth: '2003-05-09',
    studentType: 'Current Student',
    documents: [],
  }
];

const StudentModule = () => {
  const [students, setStudents] = useState(MOCK_STUDENTS);

  const [filters, setFilters] = useState({
    searchQuery: '',
    studentId: '',
    admissionNo: '', // New filter for Admission No
    studentType: 'all', // Added studentType filter
  });

  const [showFilters, setShowFilters] = useState(false);

  // Consolidated modal state
  const [openViewEditModal, setOpenViewEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); // To control edit/view mode in ViewEditStudent


  // Calculate totals
  const totalStudents = students.length;
  const totalCurrent = students.filter(s => s.studentType === 'Current Student').length;
  const totalMigrated = students.filter(s => s.studentType === 'Migrated Student').length;

  // Handle filter changes
  const handleFilterChange = (name, value) =>{
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      class: 'all',
      program: 'all',
      studentId: '',
      admissionNo: '',
      studentType: 'all',
    });
  };

  const activeFilterCount = Object.values(filters).filter(f => f && f !== 'all').length;


  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const { searchQuery, program: selectedProgram, studentId: filterStudentId, admissionNo: filterAdmissionNo, studentType: filterStudentType } = filters;

    const matchesSearch =
      searchQuery === '' ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProgram = selectedProgram === 'all' || student.program === selectedProgram;
    const matchesStudentId = filterStudentId === '' || student.studentId.toLowerCase().includes(filterStudentId.toLowerCase());
    const matchesAdmissionNo = filterAdmissionNo === '' || student.admissionNo.toLowerCase().includes(filterAdmissionNo.toLowerCase()); // New admission no filter
    const matchesStudentType = filterStudentType === 'all' || student.studentType === filterStudentType; // New student type filter

    return matchesSearch && matchesProgram && matchesStudentId && matchesAdmissionNo && matchesStudentType;
  });

  // Handle delete student
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      try {
        // In a real application, you would make an API call here:
        // const token = JSON.parse(localStorage.getItem('authToken'));
        // if (!token) {
        //   console.error("No token found");
        //   return;
        // }
        // await axios.delete(`http://localhost:5000/api/students/${id}`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     "Content-Type": "application/json"
        //   }
        // });
        setStudents(students.filter(student => student.id !== id));
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const programOptions = [{ value: 'all', label: 'All Programs' }, ...allPrograms.map(program => ({ value: program, label: program }))];
  const studentTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'Current Student', label: 'Current Student' },
    { value: 'Migrated Student', label: 'Migrated Student' },
  ];

  // Placeholder for document upload API call
  const uploadFile = async (file) => {
    // In a real application, you would implement actual file upload logic (e.g., to cloud storage)
    // For now, it mocks a successful upload
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`http://example.com/documents/${Date.now()}-${file.name}`);
      }, 500);
    });
  };

  const handleSaveStudent = async (studentData) => {
    // This function handles both adding new students and updating existing ones
    try {
      const isNew = !studentData.id;
      let updatedStudents;

      if (isNew) {
        const newStudentWithId = { ...studentData, id: `s${students.length + 1}` };
        updatedStudents = [...students, newStudentWithId];
        alert('Student added successfully!');
      } else {
        updatedStudents = students.map(s => s.id === studentData.id ? studentData : s);
        alert('Student updated successfully!');
      }
      setStudents(updatedStudents);
      setOpenViewEditModal(false);
      setSelectedStudent(null);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Error saving student. Please try again.');
    }
  };

  const handleAddClick = () => {
    setSelectedStudent(null);
    setIsEditMode(true);
    setOpenViewEditModal(true);
  };

  const handleView = (student) => {
    setSelectedStudent(student);
    setIsEditMode(false);
    setOpenViewEditModal(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditMode(true);
    setOpenViewEditModal(true);
  };

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
      {/* Summary Cards */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"> {/* Added hidden and sm:grid to hide on mobile */}
        {/* Card 1: Total Students */}
        <div className="relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md">
          <div className="p-4 sm:p-6"> {/* Reduced padding for smaller screens */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4"> {/* Adjusted icon positioning */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-100 flex items-center justify-center shadow-sm"> {/* Adjusted icon container size */}
                <Users size={24} className="text-blue-600" /> {/* Adjusted icon size */}
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-medium text-gray-500">All Students</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Total Students</h3> {/* Adjusted text size */}
              <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-100"> {/* Reduced padding */}
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalStudents}</p> {/* Adjusted text size */}
              </div>
            </div>
          </div>
        </div>
        {/* Card 2: Current Students */}
        <div className="relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md">
          <div className="p-4 sm:p-6"> {/* Reduced padding for smaller screens */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4"> {/* Adjusted icon positioning */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-green-100 flex items-center justify-center shadow-sm"> {/* Adjusted icon container size */}
                <CheckCircle size={24} className="text-green-600" /> {/* Adjusted icon size */}
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-gray-500">Current Students</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Current Students</h3> {/* Adjusted text size */}
              <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-100"> {/* Reduced padding */}
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalCurrent}</p> {/* Adjusted text size */}
              </div>
            </div>
          </div>
        </div>
        {/* Card 3: Migrated Students */}
        <div className="relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md">
          <div className="p-4 sm:p-6"> {/* Reduced padding for smaller screens */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4"> {/* Adjusted icon positioning */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-yellow-100 flex items-center justify-center shadow-sm"> {/* Adjusted icon container size */}
                <Briefcase size={24} className="text-yellow-600" /> {/* Adjusted icon size */}
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-xs font-medium text-gray-500">Migrated Students</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Migrated Students</h3> {/* Adjusted text size */}
              <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-100"> {/* Reduced padding */}
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalMigrated}</p> {/* Adjusted text size */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Student Records</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleAddClick}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus size={18} /> Add Student
            </button>
            {/* Search Input */}
            <div className="relative flex-grow w-full md:w-[400px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search students..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Filter size={18} /> Filters {activeFilterCount > 0 && <span className="ml-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">{activeFilterCount}</span>}
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="admission-no-filter" className="block text-sm font-medium text-gray-700 mb-1">Admission No.</label>
              <input
                id="admission-no-filter"
                type="text"
                placeholder="Filter by Admission No."
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={filters.admissionNo}
                onChange={(e) => handleFilterChange('admissionNo', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="student-id-filter" className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input
                id="student-id-filter"
                type="text"
                placeholder="Filter by Student ID"
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={filters.studentId}
                onChange={(e) => handleFilterChange('studentId', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="class-filter" className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
              <Select
                id="class-filter"
                options={programOptions}
                value={programOptions.find(option => option.value === filters.program)}
                onChange={(selected) => handleFilterChange('program', selected.value)}
                className="basic-single"
                classNamePrefix="select"
              />
            </div>
            <div>
              <label htmlFor="student-type-filter" className="block text-sm font-medium text-gray-700 mb-1">Student Type</label>
              <Select
                id="student-type-filter"
                options={studentTypeOptions}
                value={studentTypeOptions.find(option => option.value === filters.studentType)}
                onChange={(selected) => handleFilterChange('studentType', selected.value)}
                className="basic-single"
                classNamePrefix="select"
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2 mt-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Student Table */}
        <div className="bg-white border border-gray-200 shadow overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avatar
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admission No.
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stream
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll No.
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Avatar src={student.avatar} alt={student.name} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.admissionNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {student.program} {student.semester && `(Year ${student.semester})`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {student.rollNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {student.studentType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {student.parent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <IconButton
                          onClick={() => handleView(student)} // Changed to handleView
                          color="primary"
                          size="small"
                        >
                          <FileText size={20} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEdit(student)} // Changed to handleEdit
                          color="primary"
                          size="small"
                        >
                          <Edit size={20} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(student.id)}
                          color="secondary"
                          size="small"
                        >
                          <Trash size={20} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    <p className="text-center text-gray-500 py-4">
                      No student records found matching your criteria. Try adjusting your search or filter criteria.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      {/* Modals */}
      {openViewEditModal && ( // Consolidated modal
        <ViewEditStudent
          onClose={() => { setOpenViewEditModal(false); setSelectedStudent(null); setIsEditMode(false); }}
          onSave={handleSaveStudent} // Unified save handler
          data={selectedStudent} // Pass selected student data
          editable={isEditMode} // Pass edit mode flag
          existingStudents={students}
          uploadFile={uploadFile}
        />
      )}
    </div>
  );
};

export default StudentModule;