// src/pages/admin/admissions/AdmissionModule.jsx

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {
  User, Mail, Phone, Home, Key, Image, Users, FileText, Plus, X, Calendar, Venus, Briefcase, School, Paperclip, Hash, BookOpen, IdCard, CheckCircle, Info, AlertCircle
} from 'lucide-react';

// Constants for Andhra Pradesh junior college streams
const STREAM_OPTIONS = [
  { label: 'MPC (Maths, Physics, Chemistry)', value: 'MPC' },
  { label: 'BiPC (Biology, Physics, Chemistry)', value: 'BiPC' },
  { label: 'CEC (Commerce, Economics, Civics)', value: 'CEC' },
  { label: 'MEC (Maths, Economics, Commerce)', value: 'MEC' },
  { label: 'HEC (History, Economics, Civics)', value: 'HEC' },
];

const COACHING_PROGRAM_OPTIONS = [
  { value: 'JEE', label: 'JEE (Mains + Advanced)' },
  { value: 'NEET', label: 'NEET' },
  { value: 'EAPCET', label: 'EAPCET' },
  { value: 'CA', label: 'CA Foundation' },
  { value: 'CLAT', label: 'CLAT' },
];

const GENDER_OPTIONS = [
  { value: '', label: 'Select Gender' },
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

// Initial state for parent data
const initialParentData = {
  parentId: '',
  password: '',
  name: '',
  email: '',
  phone: '',
  childrenCount: 0,
  address: '',
  image: null,
  parentImageFile: null,
};

// --- Mock Data for Demonstration ---
const MOCK_EXISTING_PARENTS = [
  {
    parentId: 'P001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '9876543210',
    address: '123 Jubilee Hills, Hyderabad, Telangana 500033',
    childrenCount: 2,
    image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=RK', // Example image URL
  },
  {
    parentId: 'P002',
    name: 'Lakshmi Devi',
    email: 'lakshmi.devi@example.com',
    phone: '1234567890',
    address: '456 Banjara Hills, Hyderabad, Telangana 500034',
    childrenCount: 1,
    image: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=LD', // Example image URL
  },
];

const MOCK_EXISTING_STUDENTS = [
  {
    parentId: 'P001',
    studentId: 'S001A',
    name: 'Arjun Kumar',
    dateOfBirth: '2005-03-10',
    gender: 'Male',
    stream: 'MPC',
    studentType: 'Current Student',
    avatar: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=AK',
    coachingPrograms: ['JEE'],
  },
  {
    parentId: 'P001',
    studentId: 'S001B',
    name: 'Priya Kumar',
    dateOfBirth: '2003-07-22',
    gender: 'Female',
    stream: 'BiPC',
    studentType: 'Current Student',
    avatar: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=PK',
    coachingPrograms: ['NEET'],
  },
  {
    parentId: 'P002',
    studentId: 'S002A',
    name: 'Sita Devi',
    dateOfBirth: '2004-01-05',
    gender: 'Female',
    stream: 'CEC',
    studentType: 'Migrated Student',
    avatar: 'https://via.placeholder.com/150/008000/FFFFFF?text=SD',
    previousSchoolName: 'Narayana Junior College',
    previousSchoolAddress: '789 Ameerpet, Hyderabad, Telangana 500016',
    previousSchoolPhone: '5551234567',
    previousSchoolStartDate: '2020-09-01',
    previousSchoolEndDate: '2024-06-30',
    documents: [],
    coachingPrograms: [],
  },
];

const STUDENT_TYPE_OPTIONS = [
  { value: 'Current Student', label: 'Current Student' },
  { value: 'Migrated Student', label: 'Migrated Student' },
];
// --- End Mock Data ---


// AdmissionModule Component
function AdmissionModule({ onSave, existingParents = MOCK_EXISTING_PARENTS, existingStudents = MOCK_EXISTING_STUDENTS, uploadFile }) {
  // Initialize admissionMode to 'newAdmission' to show new admission form by default
  const [admissionMode, setAdmissionMode] = useState('newAdmission'); // 'newAdmission', 'existingParent'
  const [parentData, setParentData] = useState(initialParentData);
  const [studentsData, setStudentsData] = useState([]); // For new students being added
  const [parentErrors, setParentErrors] = useState({});
  const [studentsErrors, setStudentsErrors] = useState([]);
  const [showParentPassword, setShowParentPassword] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' }); // State for submission message

  // State for existing parent mode
  const [existingParentIdInput, setExistingParentIdInput] = useState('');
  const [selectedExistingParent, setSelectedExistingParent] = useState(null); // Full object of the found parent
  const [foundExistingChildren, setFoundExistingChildren] = useState([]);
  const [existingParentError, setExistingParentError] = useState('');


  // Clear student errors when students data changes (e.g., child removed)
  useEffect(() => {
    setStudentsErrors(prevErrors => {
      const newErrors = Array(studentsData.length).fill(null).map((_, i) => prevErrors[i] || {});
      return newErrors;
    });
  }, [studentsData.length]);

  // Reset form when admission mode changes
  useEffect(() => {
    // Clear all form data and errors
    setParentData(initialParentData);
    setStudentsData([]);
    setParentErrors({});
    setStudentsErrors([]);
    setAlert({ message: '', type: '' });
    setSelectedExistingParent(null);
    setFoundExistingChildren([]);
    setExistingParentIdInput('');
    setExistingParentError('');
  }, [admissionMode]);


  // --- Validation Functions ---
  const validateParentForm = () => {
    if (admissionMode === 'existingParent' && !selectedExistingParent) {
      setParentErrors({ parentId: 'Please select an existing guardian/parent.' }); // Adjusted error key for clarity
      return false;
    }

    const errors = {};
    if (admissionMode === 'newAdmission') {
      if (!parentData.parentId) errors.parentId = 'Parent ID is required';
      if (!parentData.password) errors.password = 'Password is required';
      if (!parentData.name) errors.name = 'Name is required';
      if (!parentData.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(parentData.email)) {
        errors.email = 'Email format is invalid';
      }
      if (!parentData.phone) {
        errors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(parentData.phone)) {
        errors.phone = 'Phone number must be 10 digits';
      }
      if (!parentData.address) errors.address = 'Address is required';
    }

    setParentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStudentForm = (student, index) => {
    const errors = {};
    if (!student.studentId) errors.studentId = 'Student ID is required';
    if (!student.password) errors.password = 'Password is required';
    if (!student.name) errors.name = 'Name is required';
    if (!student.dateOfBirth) {
      errors.dateOfBirth = 'Date of Birth is required';
    } else {
      const dob = new Date(student.dateOfBirth);
      const today = new Date();
      // Calculate 15 years ago from today for junior college age validation
      const fifteenYearsAgo = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());

      if (dob > fifteenYearsAgo) {
        errors.dateOfBirth = 'Student must be at least 15 years old';
      }
    }
    if (!student.gender) errors.gender = 'Gender is required';
    if (!student.stream) errors.stream = 'Stream is required';
    if (!student.studentType) errors.studentType = 'Student Type is required';

    if (student.studentType === 'Migrated Student') {
      if (!student.previousSchoolName) errors.previousSchoolName = 'Previous School Name is required';
      if (!student.previousSchoolAddress) errors.previousSchoolAddress = 'Previous School Address is required';
      if (!student.previousSchoolPhone) {
        errors.previousSchoolPhone = 'Previous School Phone is required';
      } else if (!/^\d{10}$/.test(student.previousSchoolPhone)) {
        errors.previousSchoolPhone = 'Phone number must be 10 digits';
      }
      if (!student.previousSchoolStartDate) errors.previousSchoolStartDate = 'Start Date is required';
      if (!student.previousSchoolEndDate) errors.previousSchoolEndDate = 'End Date is required';
    }

    setStudentsErrors(prevErrors => {
      const newErrors = [...prevErrors];
      newErrors[index] = errors;
      return newErrors;
    });
    return Object.keys(errors).length === 0;
  };

  const validateAllForms = () => {
    const isParentFormValid = validateParentForm();
    
    let allStudentsValid = true;
    if (studentsData.length === 0) {
      setAlert({ message: 'Please add at least one student.', type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
      return false; // Minimum 1 student validation
    }

    const newStudentsErrors = studentsData.map((student, index) => {
      const studentValid = validateStudentForm(student, index);
      if (!studentValid) allStudentsValid = false;
      return studentsErrors[index]; // This will be updated by validateStudentForm
    });
    setStudentsErrors(newStudentsErrors); // Ensure state is updated after all validations

    return isParentFormValid && allStudentsValid;
  };


  // --- Parent Handlers ---
  const handleChangeParent = (e) => {
    const { name, value } = e.target;
    setParentData(prev => ({ ...prev, [name]: value }));
    setParentErrors(prev => ({ ...prev, [name]: undefined })); // Clear error on change
  };

  const handleImageChangeParent = (e) => {
    const file = e.target.files[0];
    if (file) {
      setParentData(prev => ({ ...prev, image: URL.createObjectURL(file), parentImageFile: file }));
    }
  };

  const handleExistingParentIdChange = (e) => {
    const { value } = e.target;
    setExistingParentIdInput(value);
    setExistingParentError('');
    setSelectedExistingParent(null);
    setFoundExistingChildren([]);
    setParentData(initialParentData); // Reset parentData in case no parent is found

    if (value.trim() === '') {
        return; // Don't search if input is empty
    }

    const foundParent = existingParents.find(p => p.parentId === value);
    if (foundParent) {
      setSelectedExistingParent(foundParent);
      // Populate parentData with the found parent's details to display them.
      // Note: For existing parent mode, this parentData is mainly for display.
      // The actual 'parent' payload for submission will use selectedExistingParent.
      setParentData(prev => ({ 
        ...prev, 
        parentId: foundParent.parentId,
        name: foundParent.name,
        email: foundParent.email,
        phone: foundParent.phone,
        address: foundParent.address,
        image: foundParent.image || null, // Use existing image if available
      })); 
      const children = existingStudents.filter(s => s.parentId === foundParent.parentId);
      setFoundExistingChildren(children);
    } else {
      setExistingParentError('Guardian/Parent ID not found.');
    }
  };


  // --- Student Handlers (dynamic forms) ---
  const handleAddStudent = () => {
    setStudentsData(prev => [
      ...prev,
      {
        id: Date.now() + prev.length, // Simple unique key for React list
        studentId: '',
        password: '',
        name: '',
        dateOfBirth: '',
        gender: '',
        stream: '',
        studentType: null,
        avatar: null,
        studentAvatarFile: null,
        documents: [],
        studentDocumentsFiles: [],
        showPassword: false,
        previousSchoolName: '',
        previousSchoolAddress: '',
        previousSchoolPhone: '',
        previousSchoolStartDate: '',
        previousSchoolEndDate: '',
        coachingPrograms: [],
      }
    ]);
  };

  const handleRemoveStudent = (idToRemove) => {
    setStudentsData(prev => prev.filter(student => student.id !== idToRemove));
    // Errors will be re-aligned by useEffect when studentsData.length changes
  };

  const handleChangeStudent = (index, e) => {
    const { name, value } = e.target;
    setStudentsData(prev => {
      const newStudents = [...prev];
      newStudents[index] = { ...newStudents[index], [name]: value };
      return newStudents;
    });
    setStudentsErrors(prevErrors => { // Clear specific student error on change
      const newErrors = [...prevErrors];
      if (newErrors[index]) {
        newErrors[index][name] = undefined;
      }
      return newErrors;
    });
  };

  const handleSelectChangeStudent = (index, name, selectedOption) => {
    setStudentsData(prev => {
      const newStudents = [...prev];
      const value = selectedOption ? selectedOption.value : '';
      newStudents[index] = { ...newStudents[index], [name]: value };
      // For multi-select, the value is an array of options
      if (Array.isArray(selectedOption)) {
        const multiValue = selectedOption.map(opt => opt.value);
        newStudents[index] = { ...newStudents[index], [name]: multiValue };
      }
      return newStudents;
    });
    setStudentsErrors(prevErrors => { // Clear specific student error on change
      const newErrors = [...prevErrors];
      if (newErrors[index]) {
        newErrors[index][name] = undefined;
      }
      return newErrors;
    });
  };

  const getSelectValue = (options, value) => {
    return options.find(option => option.value === value) || null;
  };

  const getMultiSelectValues = (options, values) => {
    return options.filter(option => (values || []).includes(option.value));
  };

  const handleMultiSelectChangeStudent = (index, name, selectedOptions) => {
    setStudentsData(prev => {
      const newStudents = [...prev];
      const values = selectedOptions ? selectedOptions.map(o => o.value) : [];
      newStudents[index] = { ...newStudents[index], [name]: values };
      return newStudents;
    });
  };

  const handleAvatarChangeStudent = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setStudentsData(prev => {
        const newStudents = [...prev];
        newStudents[index] = { ...newStudents[index], avatar: URL.createObjectURL(file), studentAvatarFile: file };
        return newStudents;
      });
    }
  };

  const handleDocumentUploadStudent = (index, e) => {
    const files = Array.from(e.target.files);
    setStudentsData(prev => {
      const newStudents = [...prev];
      newStudents[index] = {
        ...newStudents[index],
        studentDocumentsFiles: [...newStudents[index].studentDocumentsFiles, ...files]
      };
      return newStudents;
    });
  };

  const handleRemoveDocumentStudent = (studentIndex, docIndex) => {
    setStudentsData(prev => {
      const newStudents = [...prev];
      newStudents[studentIndex].studentDocumentsFiles = newStudents[studentIndex].studentDocumentsFiles.filter((_, i) => i !== docIndex);
      return newStudents;
    });
  };

  // --- Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setAlert({ message: '', type: '' }); // Clear any previous submission messages

    // If in existing parent mode and no parent selected, prevent submission for parent validation
    if (admissionMode === 'existingParent' && !selectedExistingParent) {
      setExistingParentError('Please enter a valid Guardian/Parent ID to proceed.');
      setAlert({ message: 'Please correct the errors in the form.', type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
      return;
    }

    const allFormsValid = validateAllForms();

    if (!allFormsValid) {
      setAlert({ message: 'Please correct the errors in the form.', type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
      return; // Stop submission if validation fails
    }

    try {
      // Define the school code. In a real application, this would come from a configuration or a backend.
      const SCHOOL_CODE = "SCH"; 
      // Generate a unique admission ID using the desired format.
      // Note: This is a client-side generated ID using a timestamp.
      // For truly unique and sequentially incrementing IDs across multiple users/sessions,
      // a backend service is required to manage and generate these IDs.
      const admissionId = `${SCHOOL_CODE}ADM${Date.now()}`;

      let parentPayloadForSave = {};
      let finalParentId = '';

      if (admissionMode === 'newAdmission') {
        parentPayloadForSave = { ...parentData };
        delete parentPayloadForSave.image; // Remove local URL from payload
        let parentImageUrl = null;
        if (parentData.parentImageFile && typeof uploadFile === 'function') {
          parentImageUrl = await uploadFile(parentData.parentImageFile, `parents/${parentData.parentId}/profile`);
        }
        parentPayloadForSave.image = parentImageUrl;
        parentPayloadForSave.admissionId = admissionId; // Add the generated admission ID to the parent payload
        finalParentId = parentData.parentId;
        parentPayloadForSave.childrenCount = studentsData.length; // Count only new children for a new parent
        // For a new parent, you would typically save them via an API call here.
        // const newParent = await onSave('parent', parentPayloadForSave); 
        // finalParentId = newParent.parentId; // If API returns the ID
        console.log("New parent data to be saved:", parentPayloadForSave); // For demonstration
      } else if (admissionMode === 'existingParent') {
        if (!selectedExistingParent) { // Should be caught by earlier validation, but as a safeguard
            setAlert({ message: 'No existing parent selected.', type: 'error' });
            setTimeout(() => setAlert({ message: '', type: '' }), 3000);
            return;
        }
        // When updating an existing parent, you might only need to update childrenCount
        // or just use their existing ID to link new students.
        parentPayloadForSave = { ...selectedExistingParent }; 
        finalParentId = selectedExistingParent.parentId;
        // Update childrenCount to reflect total children (existing + new)
        parentPayloadForSave.childrenCount = (foundExistingChildren.length || 0) + studentsData.length;
        // If you need to update the existing parent record in backend, do it here
        // await onSave('updateParent', { parentId: finalParentId, childrenCount: parentPayloadForSave.childrenCount });
        console.log("Existing guardian/parent data updated (student count likely):", parentPayloadForSave); // For demonstration
      }
      

      const studentsPayload = await Promise.all(studentsData.map(async (student) => {
        const studentCopy = { ...student };
        delete studentCopy.id; // Remove local React key
        delete studentCopy.avatar; // Remove local URL
        delete studentCopy.studentAvatarFile; // Remove local File object
        delete studentCopy.studentDocumentsFiles; // Remove local File objects
        delete studentCopy.showPassword; // Remove local UI state

        let studentAvatarUrl = null;
        if (student.studentAvatarFile && typeof uploadFile === 'function') {
          studentAvatarUrl = await uploadFile(student.studentAvatarFile, `students/${student.studentId}/avatar`);
        }
        studentCopy.avatar = studentAvatarUrl;

        const documentUrls = [];
        if (typeof uploadFile === 'function') {
          await Promise.all(
            student.studentDocumentsFiles.map(file => uploadFile(file, `students/${student.studentId}/documents`))
          ).then(urls => documentUrls.push(...urls));
        }
        studentCopy.documents = documentUrls;

        // Link student to parent
        studentCopy.parentId = finalParentId; // Link new student to the parent (new or existing)

        return studentCopy;
      }));

      // Assume onSave handles saving of all students (new ones)
      // await onSave('students', studentsPayload); // Example for saving new students

      setAlert({ message: `The Admission has been added successfully! Admission ID: ${admissionId}`, type: 'success' });
      console.log('Admission ID created:', admissionId);
      console.log('Final Parent Data:', parentPayloadForSave);
      console.log('New Students Data (to be saved):', studentsPayload);
      
      // Clear alert after a few seconds
      setTimeout(() => setAlert({ message: '', type: '' }), 5000);

      // Reset all form fields
      setParentData(initialParentData);
      setStudentsData([]);
      setParentErrors({});
      setStudentsErrors([]);
      setSelectedExistingParent(null);
      setFoundExistingChildren([]);
      setExistingParentIdInput('');
      setExistingParentError('');
      // setAdmissionMode(null); // Keep the current mode active after submission, or reset to default if desired
      
    } catch (error) {
      console.error("Error during submission (e.g., file upload issue):", error);
      setAlert({ message: 'An error occurred during admission. Please try again.', type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 5000);
    }
  };


  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Admission Form</h2>
            <button
              type="button"
              onClick={() => setAdmissionMode(admissionMode === 'newAdmission' ? 'existingParent' : 'newAdmission')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg shadow-lg transition-colors duration-300 ease-in-out text-lg font-medium ${
                admissionMode === 'newAdmission'
                  ? 'bg-purple-600 text-white hover:bg-purple-700 transform hover:scale-105'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 transform hover:scale-105'
              }`}
            >
              {admissionMode === 'newAdmission' ? (
                <>
                  <Users size={20} /> Existing Guardian/Parent
                </>
              ) : (
                <>
                  <Plus size={20} /> New Student Admission
                </>
              )}
            </button>
        </div>

        <form className="space-y-10" onSubmit={handleSubmit}>
            {/* --- Existing Parent Mode Input --- */}
            {admissionMode === 'existingParent' && (
              <section className="border border-purple-200 rounded-lg p-6 bg-purple-50 shadow-sm">
                <h3 className="text-2xl font-bold text-purple-800 mb-6 border-b-2 border-purple-300 pb-4 flex items-center gap-2">
                  <Users size={28} /> Existing Guardian/Parent Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Parent ID for lookup */}
                  <div>
                    <label htmlFor="existingParentId" className="block text-sm font-medium text-gray-700">Enter Existing Guardian/Parent ID <span className="text-red-500">*</span></label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IdCard size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="existingParentId"
                        id="existingParentId"
                        value={existingParentIdInput}
                        onChange={handleExistingParentIdChange}
                        className={`pl-10 pr-3 py-2 block w-full border ${existingParentError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out`}
                        placeholder="Enter Guardian/Parent ID (e.g., P001, P002)"
                      />
                    </div>
                    {existingParentError && <p className="mt-1 text-sm text-red-600">{existingParentError}</p>}
                  </div>

                  {/* Display Parent Name (automatically shown) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Guardian/Parent Name</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={parentData.name || ''}
                        className="pl-10 pr-3 py-2 block w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                        readOnly
                        placeholder="Guardian/Parent Name will appear here"
                      />
                    </div>
                  </div>

                  {/* Display Parent ID (automatically shown) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Guardian/Parent ID</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IdCard size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={parentData.parentId || ''}
                        className="pl-10 pr-3 py-2 block w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                        readOnly
                        placeholder="Guardian/Parent ID will appear here"
                      />
                    </div>
                  </div>
                </div>

                {selectedExistingParent && foundExistingChildren.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-purple-300">
                    <h4 className="text-xl font-semibold text-purple-800 mb-4 flex items-center gap-2">
                      <BookOpen size={24} /> Previously Admitted Students
                    </h4>
                    <div className="space-y-3">
                      {foundExistingChildren.map((child, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 bg-white rounded-md shadow-sm border border-purple-100">
                          {child.avatar && (
                            <img src={child.avatar} alt="Child Avatar" className="w-10 h-10 rounded-full object-cover" />
                          )}
                          <div className="flex-grow">
                            <p className="font-medium text-gray-800">{child.name} (<span className="text-purple-600">{child.studentId}</span>)</p>
                            <p className="text-sm text-gray-600">Stream: {child.stream} | Gender: {child.gender}</p>
                          </div>
                          <Info size={20} className="text-purple-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedExistingParent && foundExistingChildren.length === 0 && (
                     <div className="mt-8 pt-6 border-t border-purple-300 text-center text-gray-500">
                         <p>No previously admitted students found for this guardian/parent.</p>
                     </div>
                )}
              </section>
            )}

            {/* --- New Admission Mode Parent Details Section --- */}
            {admissionMode === 'newAdmission' && (
              <section className="border border-blue-200 rounded-lg p-6 bg-blue-50 shadow-sm">
                <h3 className="text-2xl font-bold text-blue-800 mb-6 border-b-2 border-blue-300 pb-4 flex items-center gap-2">
                  <Users size={28} /> Guardian/Parent Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Parent ID */}
                  <div>
                    <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">Guardian/Parent ID <span className="text-red-500">*</span></label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IdCard size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="parentId"
                        id="parentId"
                        value={parentData.parentId}
                        onChange={handleChangeParent}
                        className={`pl-10 pr-3 py-2 block w-full border ${parentErrors.parentId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                        placeholder="Enter Guardian/Parent ID"
                      />
                    </div>
                    {parentErrors.parentId && <p className="mt-1 text-sm text-red-600">{parentErrors.parentId}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="parentPassword" className="block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key size={20} className="text-gray-400" />
                      </div>
                      <input
                        type={showParentPassword ? 'text' : 'password'}
                        name="password"
                        id="parentPassword"
                        value={parentData.password}
                        onChange={handleChangeParent}
                        className={`pl-10 pr-10 py-2 block w-full border ${parentErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                        placeholder="Set Guardian/Parent Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowParentPassword(!showParentPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-blue-600 focus:outline-none"
                      >
                        {showParentPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {parentErrors.password && <p className="mt-1 text-sm text-red-600">{parentErrors.password}</p>}
                  </div>

                  {/* Name */}
                  <div>
                    <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="parentName"
                        value={parentData.name}
                        onChange={handleChangeParent}
                        className={`pl-10 pr-3 py-2 block w-full border ${parentErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                        placeholder="Enter Guardian/Parent Name"
                      />
                    </div>
                    {parentErrors.name && <p className="mt-1 text-sm text-red-600">{parentErrors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="parentEmail"
                        value={parentData.email}
                        onChange={handleChangeParent}
                        className={`pl-10 pr-3 py-2 block w-full border ${parentErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                        placeholder="Enter Guardian/Parent Email"
                      />
                    </div>
                    {parentErrors.email && <p className="mt-1 text-sm text-red-600">{parentErrors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700">Phone <span className="text-red-500">*</span></label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="phone"
                        id="parentPhone"
                        value={parentData.phone}
                        onChange={handleChangeParent}
                        className={`pl-10 pr-3 py-2 block w-full border ${parentErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                        placeholder="Enter 10-digit Phone"
                        maxLength="10"
                      />
                    </div>
                    {parentErrors.phone && <p className="mt-1 text-sm text-red-600">{parentErrors.phone}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="parentAddress" className="block text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Home size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="address"
                        id="parentAddress"
                        value={parentData.address}
                        onChange={handleChangeParent}
                        className={`pl-10 pr-3 py-2 block w-full border ${parentErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                        placeholder="Enter Guardian/Parent Address"
                      />
                    </div>
                    {parentErrors.address && <p className="mt-1 text-sm text-red-600">{parentErrors.address}</p>}
                  </div>

                  {/* Parent Image Upload */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Upload Guardian/Parent Image (Optional)</label>
                    <div
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file && file.type.startsWith('image/')) {
                          setParentData((prev) => ({ ...prev, image: URL.createObjectURL(file), parentImageFile: file }));
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      className="flex items-center justify-center p-4 border-2 border-dashed border-gray-400 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 text-center min-h-[80px] transition duration-150 ease-in-out"
                      onClick={() => document.getElementById('parentFileInput').click()}
                    >
                      {parentData.image ? (
                        <img src={parentData.image} alt="Parent Preview" className="w-24 h-24 rounded-full object-cover shadow-sm border border-gray-200" />
                      ) : (
                        <p className="text-gray-600 text-sm flex items-center gap-2"><Image size={20} className="text-gray-500" /> Drag & drop or click to upload</p>
                      )}
                    </div>
                    <input
                      id="parentFileInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChangeParent}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* --- Children Details Section (for new children, applies to both modes) --- */}
            {/* Show this section if new admission is selected OR if existing parent is selected AND found */}
            {(admissionMode === 'newAdmission' || (admissionMode === 'existingParent' && selectedExistingParent)) && (
              <section className="space-y-8">
                <h3 className="text-2xl font-bold text-blue-800 mb-6 border-b-2 border-blue-300 pb-4 flex items-center gap-2">
                  <BookOpen size={28} /> New Student Details
                </h3>
                {studentsData.map((student, index) => (
                  <div key={student.id} className="border border-green-200 p-6 rounded-lg bg-green-50 mb-6 relative shadow-md">
                    <h4 className="text-xl font-semibold text-green-800 mb-4 pb-2 border-b border-green-200">Student #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(student.id)}
                      className="absolute top-4 right-4 text-red-600 hover:text-red-800 p-2 rounded-full bg-red-100 transition-colors duration-200 ease-in-out shadow-sm"
                      aria-label={`Remove Student ${index + 1}`}
                    >
                      <X size={20} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Student ID */}
                      <div>
                        <label htmlFor={`studentId-${index}`} className="block text-sm font-medium text-gray-700">Student ID <span className="text-red-500">*</span></label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IdCard size={20} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="studentId"
                            id={`studentId-${index}`}
                            value={student.studentId}
                            onChange={(e) => handleChangeStudent(index, e)}
                            className={`pl-10 pr-3 py-2 block w-full border ${studentsErrors[index]?.studentId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                            placeholder="Enter Student ID"
                          />
                        </div>
                        {studentsErrors[index]?.studentId && <p className="mt-1 text-sm text-red-600">{studentsErrors[index].studentId}</p>}
                      </div>

                      {/* Password */}
                      <div>
                        <label htmlFor={`studentPassword-${index}`} className="block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Key size={20} className="text-gray-400" />
                          </div>
                          <input
                            type={student.showPassword ? 'text' : 'password'}
                            name="password"
                            id={`studentPassword-${index}`}
                            value={student.password}
                            onChange={(e) => handleChangeStudent(index, e)}
                            className={`pl-10 pr-10 py-2 block w-full border ${studentsErrors[index]?.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                            placeholder="Set Student Password"
                          />
                          <button
                            type="button"
                            onClick={() => setStudentsData(prev => {
                              const newStudents = [...prev];
                              newStudents[index] = { ...newStudents[index], showPassword: !newStudents[index].showPassword };
                              return newStudents;
                            })}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-blue-600 focus:outline-none"
                          >
                            {student.showPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                        {studentsErrors[index]?.password && <p className="mt-1 text-sm text-red-600">{studentsErrors[index].password}</p>}
                      </div>

                      {/* Name */}
                      <div>
                        <label htmlFor={`studentName-${index}`} className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={20} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="name"
                            id={`studentName-${index}`}
                            value={student.name}
                            onChange={(e) => handleChangeStudent(index, e)}
                            className={`pl-10 pr-3 py-2 block w-full border ${studentsErrors[index]?.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                            placeholder="Enter Student Name"
                          />
                        </div>
                        {studentsErrors[index]?.name && <p className="mt-1 text-sm text-red-600">{studentsErrors[index].name}</p>}
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label htmlFor={`dateOfBirth-${index}`} className="block text-sm font-medium text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar size={20} className="text-gray-400" />
                          </div>
                          <input
                            type="date"
                            name="dateOfBirth"
                            id={`dateOfBirth-${index}`}
                            value={student.dateOfBirth}
                            onChange={(e) => handleChangeStudent(index, e)}
                            className={`pl-10 pr-3 py-2 block w-full border ${studentsErrors[index]?.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                          />
                        </div>
                        {studentsErrors[index]?.dateOfBirth && <p className="mt-1 text-sm text-red-600">{studentsErrors[index].dateOfBirth}</p>}
                      </div>

                      {/* Gender */}
                      <div>
                        <label htmlFor={`gender-${index}`} className="block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                        <Select
                          id={`gender-${index}`}
                          options={GENDER_OPTIONS}
                          value={getSelectValue(GENDER_OPTIONS, student.gender)}
                          onChange={(selectedOption) => handleSelectChangeStudent(index, 'gender', selectedOption)}
                          classNamePrefix="react-select"
                          className={`mt-1 ${studentsErrors[index]?.gender ? 'border border-red-500 rounded-md' : ''}`}
                          placeholder="Select Gender"
                        />
                        {studentsErrors[index]?.gender && <p className="mt-1 text-sm text-red-600">{studentsErrors[index].gender}</p>}
                      </div>

                      {/* Stream */}
                      <div>
                        <label htmlFor={`stream-${index}`} className="block text-sm font-medium text-gray-700">Stream <span className="text-red-500">*</span></label>
                        <Select
                          id={`stream-${index}`}
                          options={STREAM_OPTIONS}
                          value={getSelectValue(STREAM_OPTIONS, student.stream)}
                          onChange={(selectedOption) => handleSelectChangeStudent(index, 'stream', selectedOption)}
                          classNamePrefix="react-select"
                          className={`mt-1 ${studentsErrors[index]?.stream ? 'border border-red-500 rounded-md' : ''}`}
                          placeholder="Select Stream"
                        />
                        {studentsErrors[index]?.stream && <p className="mt-1 text-sm text-red-600">{studentsErrors[index].stream}</p>}
                      </div>

                      {/* Coaching Programs */}
                      <div>
                        <label htmlFor={`coachingPrograms-${index}`} className="block text-sm font-medium text-gray-700">Integrated Coaching</label>
                        <Select
                          isMulti
                          id={`coachingPrograms-${index}`}
                          options={COACHING_PROGRAM_OPTIONS}
                          value={getMultiSelectValues(COACHING_PROGRAM_OPTIONS, student.coachingPrograms)}
                          onChange={(selectedOptions) => handleMultiSelectChangeStudent(index, 'coachingPrograms', selectedOptions)}
                          classNamePrefix="react-select"
                          className="mt-1"
                          placeholder="Select Coaching"
                        />
                      </div>

                      {/* Student Type */}
                      <div>
                        <label htmlFor={`studentType-${index}`} className="block text-sm font-medium text-gray-700">Student Type <span className="text-red-500">*</span></label>
                        <Select
                          id={`studentType-${index}`}
                          name="studentType"
                          options={STUDENT_TYPE_OPTIONS}
                          value={getSelectValue(STUDENT_TYPE_OPTIONS, student.studentType)}
                          onChange={(selectedOption) => handleSelectChangeStudent(index, 'studentType', selectedOption)}
                          classNamePrefix="react-select"
                          className={`mt-1 ${studentsErrors[index]?.studentType ? 'border border-red-500 rounded-md' : ''}`}
                          placeholder="Select Student Type"
                        />
                        {studentsErrors[index]?.studentType && <p className="mt-1 text-sm text-red-600">{studentsErrors[index].studentType}</p>}
                      </div>

                      {/* Student Avatar Upload */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium mb-1 text-gray-700">Upload Student Avatar (Optional)</label>
                        <div
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file && file.type.startsWith('image/')) {
                              handleAvatarChangeStudent(index, { target: { files: [file] } });
                            }
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          className="flex items-center justify-center p-4 border-2 border-dashed border-gray-400 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 text-center min-h-[80px] transition duration-150 ease-in-out"
                          onClick={() => document.getElementById(`studentAvatarInput-${index}`).click()}
                        >
                          {student.avatar ? (
                            <img src={student.avatar} alt="Student Preview" className="w-24 h-24 rounded-full object-cover shadow-sm border border-gray-200" />
                          ) : (
                            <p className="text-gray-600 text-sm flex items-center gap-2"><Image size={20} className="text-gray-500" /> Drag & drop or click to upload</p>
                          )}
                        </div>
                        <input
                          id={`studentAvatarInput-${index}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleAvatarChangeStudent(index, e)}
                        />
                      </div>
                    </div>

                    {/* --- Previous School Details (Conditional) --- */}
                    {student.studentType === 'Migrated Student' && (
                      <div className="mt-8 pt-6 border-t border-green-200">
                        <h4 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                          <School size={24} /> Previous School Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* School Name */}
                          <div>
                            <label htmlFor={`previousSchoolName-${index}`} className="block text-sm font-medium text-gray-700">School Name <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="previousSchoolName"
                              id={`previousSchoolName-${index}`}
                              value={student.previousSchoolName}
                              onChange={(e) => handleChangeStudent(index, e)}
                              className={`mt-1 px-3 py-2 block w-full border ${studentsErrors[index]?.previousSchoolName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                              placeholder="Enter Previous School Name"
                            />
                            {studentsErrors[index]?.previousSchoolName && <p className="mt-1 text-sm text-red-600">{studentsErrors[index].previousSchoolName}</p>}
                          </div>

                          {/* Address */}
                          <div>
                            <label htmlFor={`previousSchoolAddress-${index}`} className="block text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="previousSchoolAddress"
                              id={`previousSchoolAddress-${index}`}
                              value={student.previousSchoolAddress}
                              onChange={(e) => handleChangeStudent(index, e)}
                              className={`mt-1 px-3 py-2 block w-full border ${studentsErrors[index]?.previousSchoolAddress ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                              placeholder="Enter Previous School Address"
                            />
                            {studentsErrors[index]?.previousSchoolAddress && <p className="mt-1 text-sm text-red-600">{studentsErrors[index].previousSchoolAddress}</p>}
                          </div>

                          {/* Phone Number */}
                          <div>
                            <label htmlFor={`previousSchoolPhone-${index}`} className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="previousSchoolPhone"
                              id={`previousSchoolPhone-${index}`}
                              value={student.previousSchoolPhone}
                              onChange={(e) => handleChangeStudent(index, e)}
                              className={`mt-1 px-3 py-2 block w-full border ${studentsErrors[index]?.previousSchoolPhone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                              placeholder="Enter Phone Number"
                              maxLength="10"
                            />
                            {studentsErrors[index]?.previousSchoolPhone && <p className="mt-1 text-sm text-red-600">{studentsErrors[index].previousSchoolPhone}</p>}
                          </div>

                          {/* Start Date */}
                          <div>
                            <label htmlFor={`previousSchoolStartDate-${index}`} className="block text-sm font-medium text-gray-700">Start Date <span className="text-red-500">*</span></label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Calendar size={20} className="text-gray-400" />
                                </div>
                                <input
                                  type="date"
                                  name="previousSchoolStartDate"
                                  id={`previousSchoolStartDate-${index}`}
                                  value={student.previousSchoolStartDate}
                                  onChange={(e) => handleChangeStudent(index, e)}
                                  className={`pl-10 pr-3 py-2 block w-full border ${studentsErrors[index]?.previousSchoolStartDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                                />
                            </div>
                            {studentsErrors[index]?.previousSchoolStartDate && <p className="mt-1 text-sm text-red-600">{studentsErrors[index].previousSchoolStartDate}</p>}
                          </div>

                          {/* End Date */}
                          <div>
                            <label htmlFor={`previousSchoolEndDate-${index}`} className="block text-sm font-medium text-gray-700">End Date <span className="text-red-500">*</span></label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar size={20} className="text-gray-400" />
                              </div>
                              <input
                                type="date"
                                name="previousSchoolEndDate"
                                id={`previousSchoolEndDate-${index}`}
                                value={student.previousSchoolEndDate}
                                onChange={(e) => handleChangeStudent(index, e)}
                                className={`pl-10 pr-3 py-2 block w-full border ${studentsErrors[index]?.previousSchoolEndDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
                              />
                            </div>
                            {studentsErrors[index]?.previousSchoolEndDate && <p className="mt-1 text-sm text-red-600">{studentsErrors[index].previousSchoolEndDate}</p>}
                          </div>
                        </div>

                        {/* Documents for Previous School */}
                        <div className="mt-6">
                          <label className="block text-sm font-medium mb-1 text-gray-700">Documents (Transcripts, Certificates, etc.) (Optional)</label>
                          <div
                            onDrop={(e) => {
                              e.preventDefault();
                              handleDocumentUploadStudent(index, { target: { files: e.dataTransfer.files } });
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-400 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 text-center min-h-[80px] transition duration-150 ease-in-out"
                            onClick={() => document.getElementById(`studentDocumentsInput-${index}`).click()}
                          >
                            <p className="text-gray-600 text-sm flex items-center gap-2"><Paperclip size={20} className="text-gray-500" /> Drag & drop or click to upload documents</p>
                          </div>
                          <input
                            id={`studentDocumentsInput-${index}`}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleDocumentUploadStudent(index, e)}
                          />
                          <div className="mt-2 space-y-2">
                            {student.studentDocumentsFiles.map((file, docIndex) => (
                              <div key={docIndex} className="flex items-center justify-between p-2 border border-gray-200 rounded-md bg-white shadow-sm text-sm">
                                <span className="truncate">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDocumentStudent(index, docIndex)}
                                  className="ml-4 text-red-500 hover:text-red-700"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-center mt-8">
                  <button
                    type="button"
                    onClick={handleAddStudent}
                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-lg text-lg font-medium transform hover:scale-105"
                  >
                    <Plus size={22} /> {studentsData.length === 0 ? 'Add Student' : 'Add Another Student'}
                  </button>
                </div>
              </section>
            )}
          </form>

       {/* Submission Section */}
       <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-200">
          {alert.message && (
            <div className={`p-4 text-center text-lg font-semibold rounded-md w-full max-w-md flex items-center justify-center gap-3 ${
              alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {alert.type === 'success' 
                ? <CheckCircle size={24} /> 
                : <AlertCircle size={24} />}
              {alert.message}
            </div>
          )}
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-10 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-lg text-lg font-medium transform hover:scale-105"
          >
            Submit Admission
          </button>
        </div>
      </div>
  );
}

export default AdmissionModule;