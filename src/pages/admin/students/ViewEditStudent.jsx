// ViewEditStudent.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {
  Plus, X, Paperclip, FileText, Image, Download, Users
} from 'lucide-react';

const PROGRAM_OPTIONS = [
  { value: 'MPC', label: 'MPC (Maths, Physics, Chemistry)' },
  { value: 'BiPC', label: 'BiPC (Biology, Physics, Chemistry)' },
  { value: 'CEC', label: 'CEC (Commerce, Economics, Civics)' },
  { value: 'MEC', label: 'MEC (Maths, Economics, Commerce)' },
  { value: 'HEC', label: 'HEC (History, Economics, Civics)' },
];

const SEMESTER_OPTIONS = [
  { label: 'Year 1', value: 1 },
  { label: 'Year 2', value: 2 },
];

const GENDER_OPTIONS = [
  { value: '', label: 'Select Gender' },
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const STUDENT_TYPE_OPTIONS = [
  { value: 'Current Student', label: 'Current Student' },
  { value: 'Migrated Student', label: 'Migrated Student' },
];

const COACHING_PROGRAM_OPTIONS = [
  { value: 'JEE', label: 'JEE (Mains + Advanced)' },
  { value: 'NEET', label: 'NEET' },
  { value: 'EAPCET', label: 'EAPCET' },
  { value: 'CA', label: 'CA Foundation' },
  { value: 'CLAT', label: 'CLAT' },
];

const ViewEditStudent = ({ onClose, onSave, data, editable = false, existingStudents, uploadFile }) => {
  const [formData, setFormData] = useState({
    admissionNo: '',
    studentId: '',
    password: '',
    name: '',
    rollNumber: '',
    program: '',
    semester: '',
    parent: '',
    status: 'active',
    avatar: '',
    address: '',
    gender: '',
    dateOfBirth: '',
    studentType: 'Current Student',
    previousSchoolName: '',
    previousSchoolAddress: '',
    previousSchoolStartDate: '',
    previousSchoolEndDate: '',
    documents: [],
    coachingPrograms: [],
    newPassword: '', // For updating password in edit mode
  });

  const [errors, setErrors] = useState({});
  const [documentsToUpload, setDocumentsToUpload] = useState([]);
  const [avatarToUpload, setAvatarToUpload] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        program: data.program || '', // Store actual value
        semester: data.semester || '', // Store actual value
        gender: data.gender || '', // Store actual value
        studentType: data.studentType || 'Current Student', // Store actual value
        dateOfBirth: data.dateOfBirth || '',
        previousSchoolName: data.previousSchoolName || '',
        previousSchoolAddress: data.previousSchoolAddress || '',
        previousSchoolStartDate: data.previousSchoolStartDate || '',
        previousSchoolEndDate: data.previousSchoolEndDate || '',
        coachingPrograms: data.coachingPrograms || [],
        newPassword: '', // Clear newPassword on data load
      });
      setAvatarPreview(data.avatar || '');
      setDocumentsToUpload([]); // Clear new documents on data load
    } else {
      // Reset form for adding new student
      setFormData({
        admissionNo: '',
        studentId: '',
        password: '',
        name: '',
        rollNumber: '',
        program: '',
        semester: '',
        parent: '',
        status: 'active',
        avatar: '',
        address: '',
        gender: '',
        dateOfBirth: '',
        studentType: 'Current Student',
        previousSchoolName: '',
        previousSchoolAddress: '',
        previousSchoolStartDate: '',
        previousSchoolEndDate: '',
        documents: [],
        coachingPrograms: [],
        newPassword: '',
      });
      setAvatarPreview('');
      setDocumentsToUpload([]);
    }
    setErrors({});
  }, [data]);

  const validateForm = async () => {
    const newErrors = {};
    const {
      admissionNo, studentId, password, name, rollNumber,
      parent, address, gender, dateOfBirth, studentType, previousSchoolName,
      previousSchoolAddress, previousSchoolStartDate, previousSchoolEndDate, newPassword
    } = formData;

    if (!admissionNo.trim()) newErrors.admissionNo = 'Admission No. is required';
    // Password is required for new students, optional for existing edits
    if (!data && !password.trim()) newErrors.password = 'Password is required';
    if (!data && password.trim().length < 6) newErrors.password = 'Password must be at least 6 characters long';
    if (editable && newPassword.trim() && newPassword.trim().length < 6) newErrors.newPassword = 'New password must be at least 6 characters long';
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!formData.program) newErrors.program = 'Stream is required';
    if (!formData.semester) newErrors.semester = 'Year is required';
    if (!parent.trim()) newErrors.parent = 'Parent Name/ID is required';
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!gender) newErrors.gender = 'Gender is required';
    if (!dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';

    if (studentType === 'Migrated Student') {
      if (!previousSchoolName.trim()) newErrors.previousSchoolName = 'Previous Junior College Name is required for Migrated Students';
      if (!previousSchoolAddress.trim()) newErrors.previousSchoolAddress = 'Previous Junior College Address is required for Migrated Students';
      if (!previousSchoolStartDate) newErrors.previousSchoolStartDate = 'Previous Junior College Start Date is required for Migrated Students';
      if (!previousSchoolEndDate) newErrors.previousSchoolEndDate = 'Previous Junior College End Date is required for Migrated Students';
    }

    // Check for duplicates, excluding the current student if in edit mode
    if (existingStudents) {
      const studentsToCheck = data ? existingStudents.filter(s => s.id !== data.id) : existingStudents;

      if (studentsToCheck.some(s => s.admissionNo.toLowerCase() === admissionNo.toLowerCase())) {
        newErrors.admissionNo = 'Admission No. already exists';
      }
      if (studentsToCheck.some(s => s.studentId.toLowerCase() === studentId.toLowerCase())) {
        newErrors.studentId = 'Student ID already exists';
      }
      if (rollNumber.trim() && studentsToCheck.some(s => s.rollNumber.toLowerCase() === rollNumber.toLowerCase())) {
        newErrors.rollNumber = 'Roll Number already exists';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData(prev => ({ ...prev, [name]: selectedOption ? selectedOption.value : '' }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    if (name === 'studentType' && selectedOption?.value === 'Current Student') {
      setFormData(prev => ({
        ...prev,
        previousSchoolName: '',
        previousSchoolAddress: '',
        previousSchoolStartDate: '',
        previousSchoolEndDate: '',
        documents: [],
      }));
    }
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    setFormData(prev => ({ ...prev, [name]: selectedOptions ? selectedOptions.map(o => o.value) : [] }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDocumentUpload = (event) => {
    const files = Array.from(event.target.files);
    setDocumentsToUpload(prev => [...prev, ...files]);
  };

  const handleRemoveExistingDocument = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleRemoveNewUploadDocument = (indexToRemove) => {
    setDocumentsToUpload(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarToUpload(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarToUpload(null);
      setAvatarPreview(formData.avatar || ''); // Revert to existing avatar if available
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      let finalAvatarUrl = formData.avatar;
      if (avatarToUpload) {
        const url = await uploadFile(avatarToUpload);
        if (url) {
          finalAvatarUrl = url;
        }
      }

      const newlyUploadedDocumentUrls = [];
      for (const file of documentsToUpload) {
        const url = await uploadFile(file);
        if (url) {
          newlyUploadedDocumentUrls.push({ name: file.name, url: url });
        }
      }

      // Merge existing documents with newly uploaded ones
      const combinedDocuments = [...(formData.documents || []), ...newlyUploadedDocumentUrls];

      // Determine the final password
      const finalPassword = editable && formData.newPassword.trim() ? formData.newPassword.trim() : (formData.password || '');

      onSave({
        ...formData,
        avatar: finalAvatarUrl,
        documents: combinedDocuments,
        password: finalPassword,
        // Ensure program, semester, gender, studentType are stored as values, not objects
        program: formData.program,
        semester: formData.semester,
        gender: formData.gender,
        studentType: formData.studentType,
        coachingPrograms: formData.coachingPrograms || [],
      });
      onClose();
    }
  };

  const getSelectValue = (options, value) => {
    return options.find(option => option.value === value) || null;
  };

  const getMultiSelectValues = (options, values) => {
    return options.filter(option => (values || []).includes(option.value));
  };

  const dialogTitle = data
    ? (editable ? `Edit ${getSelectValue(STUDENT_TYPE_OPTIONS, formData.studentType)?.label || 'Student'} Details` : `View ${getSelectValue(STUDENT_TYPE_OPTIONS, formData.studentType)?.label || 'Student'} Details`)
    : 'Add New Student';

  return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
              <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Avatar Upload/Display */}
            <div className="md:col-span-2 flex flex-col items-center justify-center p-4">
              {editable ? (
                <div
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file && file.type.startsWith('image/')) {
                      setAvatarToUpload(file);
                      setAvatarPreview(URL.createObjectURL(file));
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-gray-400 rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100 text-center w-32 h-32 overflow-hidden"
                  onClick={() => document.getElementById('avatar-upload').click()}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Image className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-gray-600 text-sm">Drag & drop or click to upload</p>
                    </div>
                  )}
                </div>
              ) : (
                formData.avatar && (
                  <img src={formData.avatar} alt="Student Avatar" className="w-24 h-24 rounded-full object-cover mx-auto" />
                )
              )}
              <input
                id="avatar-upload"
                name="avatar"
                type="file"
                className="hidden"
                onChange={handleAvatarUpload}
                accept="image/*"
                disabled={!editable}
              />
            </div>

            {/* Form Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Admission No. {editable && <span className="text-red-500">*</span>}</label>
              <input type="text" name="admissionNo" value={formData.admissionNo} onChange={handleChange} readOnly={!editable}
                className={`mt-1 block w-full border ${errors.admissionNo ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 ${!editable ? 'bg-gray-100' : ''}`} />
              {errors.admissionNo && <p className="text-red-500 text-xs mt-1">{errors.admissionNo}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Student ID {editable && <span className="text-red-500">*</span>}</label>
              <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} readOnly={!editable}
                className={`mt-1 block w-full border ${errors.studentId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 ${!editable ? 'bg-gray-100' : ''}`} />
              {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
            </div>

            {/* Password Field - only for adding or editing (newPassword) */}
            {!data && ( // Only show 'password' field for new student
              <div>
                <label className="block text-sm font-medium text-gray-700">Password {editable && <span className="text-red-500">*</span>}</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} readOnly={!editable}
                    className={`mt-1 block w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 pr-10 ${!editable ? 'bg-gray-100' : ''}`} />
                  {editable && (
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  )}
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            )}
            {data && editable && ( // Only show 'newPassword' field in edit mode for existing student
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password (optional)</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="newPassword" value={formData.newPassword} onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 pr-10`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name {editable && <span className="text-red-500">*</span>}</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} readOnly={!editable}
                className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 ${!editable ? 'bg-gray-100' : ''}`} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} readOnly={!editable}
                className={`mt-1 block w-full border ${errors.rollNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 ${!editable ? 'bg-gray-100' : ''}`} />
              {errors.rollNumber && <p className="text-red-500 text-xs mt-1">{errors.rollNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Section</label>
              <input type="text" name="section" value={formData.section} onChange={handleChange} readOnly={!editable}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${!editable ? 'bg-gray-100' : ''}`} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Stream {editable && <span className="text-red-500">*</span>}</label>
              <Select options={PROGRAM_OPTIONS} value={getSelectValue(PROGRAM_OPTIONS, formData.program)} onChange={(selected) => handleSelectChange('program', selected)} placeholder="Select Stream"
                className={`mt-1 basic-single ${errors.program ? 'border-red-500' : ''}`} classNamePrefix="select" isDisabled={!editable} />
              {errors.program && <p className="text-red-500 text-xs mt-1">{errors.program}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Year {editable && <span className="text-red-500">*</span>}</label>
              <Select options={SEMESTER_OPTIONS} value={getSelectValue(SEMESTER_OPTIONS, formData.semester)} onChange={(selected) => handleSelectChange('semester', selected)} placeholder="Select Year"
                className={`mt-1 basic-single ${errors.semester ? 'border-red-500' : ''}`} classNamePrefix="select" isDisabled={!editable} />
              {errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Parent Name/ID {editable && <span className="text-red-500">*</span>}</label>
              <input type="text" name="parent" value={formData.parent} onChange={handleChange} readOnly={!editable}
                className={`mt-1 block w-full border ${errors.parent ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 ${!editable ? 'bg-gray-100' : ''}`} />
              {errors.parent && <p className="text-red-500 text-xs mt-1">{errors.parent}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address {editable && <span className="text-red-500">*</span>}</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} readOnly={!editable}
                className={`mt-1 block w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 ${!editable ? 'bg-gray-100' : ''}`} />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Gender {editable && <span className="text-red-500">*</span>}</label>
              <Select options={GENDER_OPTIONS} value={getSelectValue(GENDER_OPTIONS, formData.gender)} onChange={(selected) => handleSelectChange('gender', selected)} placeholder="Select Gender"
                className={`mt-1 basic-single ${errors.gender ? 'border-red-500' : ''}`} classNamePrefix="select" isDisabled={!editable} />
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth {editable && <span className="text-red-500">*</span>}</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} readOnly={!editable}
                className={`mt-1 block w-full border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 ${!editable ? 'bg-gray-100' : ''}`} />
              {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Student Type</label>
              <Select options={STUDENT_TYPE_OPTIONS} value={getSelectValue(STUDENT_TYPE_OPTIONS, formData.studentType)} onChange={(selected) => handleSelectChange('studentType', selected)} placeholder="Select Student Type"
                className="mt-1 basic-single" classNamePrefix="select" isDisabled={!editable} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Integrated Coaching</label>
              <Select isMulti options={COACHING_PROGRAM_OPTIONS} value={getMultiSelectValues(COACHING_PROGRAM_OPTIONS, formData.coachingPrograms)}
                onChange={(selected) => handleMultiSelectChange('coachingPrograms', selected)} placeholder="Select Coaching Programs"
                className="mt-1 basic-multi-select" classNamePrefix="select" isDisabled={!editable} />
            </div>

            {formData.studentType === 'Migrated Student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Previous Junior College Name {editable && <span className="text-red-500">*</span>}</label>
                  <input type="text" name="previousSchoolName" value={formData.previousSchoolName} onChange={handleChange} readOnly={!editable}
                    className={`mt-1 block w-full border ${errors.previousSchoolName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 ${!editable ? 'bg-gray-100' : ''}`} />
                  {errors.previousSchoolName && <p className="text-red-500 text-xs mt-1">{errors.previousSchoolName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Previous Junior College Address {editable && <span className="text-red-500">*</span>}</label>
                  <input type="text" name="previousSchoolAddress" value={formData.previousSchoolAddress} onChange={handleChange} readOnly={!editable}
                    className={`mt-1 block w-full border ${errors.previousSchoolAddress ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 ${!editable ? 'bg-gray-100' : ''}`} />
                  {errors.previousSchoolAddress && <p className="text-red-500 text-xs mt-1">{errors.previousSchoolAddress}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Previous Junior College Start Date {editable && <span className="text-red-500">*</span>}</label>
                  <input type="date" name="previousSchoolStartDate" value={formData.previousSchoolStartDate} onChange={handleChange} readOnly={!editable}
                    className={`mt-1 block w-full border ${errors.previousSchoolStartDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 ${!editable ? 'bg-gray-100' : ''}`} />
                  {errors.previousSchoolStartDate && <p className="text-red-500 text-xs mt-1">{errors.previousSchoolStartDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Previous Junior College End Date {editable && <span className="text-red-500">*</span>}</label>
                  <input type="date" name="previousSchoolEndDate" value={formData.previousSchoolEndDate} onChange={handleChange} readOnly={!editable}
                    className={`mt-1 block w-full border ${errors.previousSchoolEndDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 ${!editable ? 'bg-gray-100' : ''}`} />
                  {errors.previousSchoolEndDate && <p className="text-red-500 text-xs mt-1">{errors.previousSchoolEndDate}</p>}
                </div>

                {/* Documents Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Documents</label>
                  <ul className="mb-4">
                    {formData.documents.map((doc, index) => (
                      <li key={`existing-${index}`} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-1">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                          <FileText size={14} /> {doc.name}
                        </a>
                        {editable && (
                          <button type="button" onClick={() => handleRemoveExistingDocument(index)} className="text-red-500 hover:text-red-700">
                            <X size={16} />
                          </button>
                        )}
                        {!editable && <Download size={16} className="text-gray-500" />}
                      </li>
                    ))}
                    {documentsToUpload.map((file, index) => (
                      <li key={`new-${index}`} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-1">
                        <span className="flex items-center gap-1">
                          <Paperclip size={14} /> {file.name}
                        </span>
                        {editable && (
                          <button type="button" onClick={() => handleRemoveNewUploadDocument(index)} className="text-red-500 hover:text-red-700">
                            <X size={16} />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>

                  {editable && (
                    <div
                      className="flex items-center justify-center p-4 border-2 border-dashed border-gray-400 rounded cursor-pointer bg-gray-50 hover:bg-gray-100 text-center"
                      onClick={() => document.getElementById('document-upload').click()}
                    >
                      <Plus size={20} className="text-gray-500 mr-2" />
                      <p className="text-gray-600 text-sm">Drag & drop or click to upload documents</p>
                    </div>
                  )}
                  <input
                    id="document-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleDocumentUpload}
                    disabled={!editable}
                  />
                </div>
              </>
            )}
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <button
          type="button"
          onClick={() => { onClose(); setErrors({}); }}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"

        >
          {editable ? 'Cancel' : 'Close'}
        </button>
        {editable && (
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        )}
      </DialogActions>
    </Dialog>
        </div>
  );
};

export default ViewEditStudent;