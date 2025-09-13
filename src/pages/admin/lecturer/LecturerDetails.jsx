import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const SUBJECT_OPTIONS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics',
  'Commerce', 'History', 'Civics', 'English', 'Telugu', 'Hindi'
].map((sub) => ({ label: sub, value: sub }));

const CLASS_OPTIONS = [
  { label: 'MPC Year 1', value: 'MPC-1' },
  { label: 'MPC Year 2', value: 'MPC-2' },
  { label: 'BiPC Year 1', value: 'BiPC-1' },
  { label: 'BiPC Year 2', value: 'BiPC-2' },
  { label: 'CEC Year 1', value: 'CEC-1' },
  { label: 'CEC Year 2', value: 'CEC-2' },
  { label: 'MEC Year 1', value: 'MEC-1' },
  { label: 'MEC Year 2', value: 'MEC-2' },
  { label: 'HEC Year 1', value: 'HEC-1' },
  { label: 'HEC Year 2', value: 'HEC-2' }
];

function LecturerDetails({ data, editable = false, onClose, onUpdate, existinglecturers = [] }) {
  const [formData, setFormData] = useState({
    ...data,
    subject: [],
    classes: [],
    classlecturer: null,
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        subject: data.subject?.map((s) => ({ label: s, value: s })) || [],
        classes: data.classes?.map((c) => ({ label: c, value: c })) || [],
        classlecturer: data.classlecturer ? CLASS_OPTIONS.find(c => c.value === data.classlecturer) : null,
        password: data.password || '',
      });
    }
  }, [data]);

  const validateForm = () => {
    const newErrors = {};
    const { empId, name, email, phone, subject, classes, classlecturer, password } = formData;
    const trimmedEmpId = empId?.trim();
    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPhone = phone?.trim();

    if (!trimmedEmpId) newErrors.empId = 'EMP ID is required';
    if (!trimmedName) newErrors.name = 'Name is required';

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!trimmedEmail) newErrors.email = 'Email is required';
    else if (!gmailRegex.test(trimmedEmail)) {
      newErrors.email = 'Only Gmail addresses are allowed';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!trimmedPhone) newErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(trimmedPhone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    if (!classlecturer) newErrors.classlecturer = 'Stream Coordinator is required';

    if (!data.empId || (data.empId && (trimmedEmpId?.toLowerCase() !== data.empId?.toLowerCase() || trimmedEmail !== data.email?.toLowerCase() || trimmedPhone !== data.phone))) {
        existinglecturers
            .filter((t) => t.empId !== data.empId)
            .forEach((t) => {
                if (t.empId.toLowerCase() === trimmedEmpId?.toLowerCase()) {
                    newErrors.empId = 'Duplicate EMP ID found';
                }
                if (trimmedEmail && t.email?.toLowerCase() === trimmedEmail) {
                    newErrors.email = 'Duplicate Gmail ID found';
                }
                if (trimmedPhone && t.phone === trimmedPhone) {
                    newErrors.phone = 'Duplicate phone number found';
                }
            });
    }

    if (subject.length < 1) newErrors.subject = 'At least 1 subject is required';
    if (classes.length < 1) newErrors.classes = 'At least 1 stream is required';

    if (editable && (!password || password.length < 6)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubjectChange = (selected) => {
    if (selected.length <= 5) {
      setFormData((prev) => ({ ...prev, subject: selected }));
      setErrors((prev) => ({ ...prev, subject: '' }));
    }
  };

  const handleClassChange = (selected) => {
    setFormData((prev) => ({ ...prev, classes: selected }));
    setErrors((prev) => ({ ...prev, classes: '' }));
  };

  const handleClasslecturerChange = (selected) => {
    setFormData((prev) => ({ ...prev, classlecturer: selected }));
    setErrors((prev) => ({ ...prev, classlecturer: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const updatedData = {
      ...formData,
      empId: formData.empId.trim(),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      address: formData.address?.trim() || '',
      subject: formData.subject.map((s) => s.value),
      classes: formData.classes.map((c) => c.value),
      classlecturer: formData.classlecturer.value,
    };

    onUpdate(updatedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] md:w-[450px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {editable ? 'Edit Lecturer Details' : 'Lecturer Details'}
        </h2>

        <div className="flex flex-col gap-3">
          <div>
            <input
              name="empId"
              value={formData.empId}
              onChange={handleChange}
              disabled={!editable || (editable && data.empId)}
              placeholder="Lecturer EMP ID *"
              className={`p-2 border rounded w-full ${
                errors.empId ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.empId && (
              <p className="text-red-500 text-sm mt-1">{errors.empId}</p>
            )}
          </div>

          {editable && (
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password *"
                className={`p-2 border rounded w-full ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          )}

          {['name', 'email', 'phone', 'address'].map((field) => (
            <div key={field}>
              <input
                name={field}
                value={formData[field]}
                onChange={handleChange}
                disabled={!editable}
                placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} *`}
                className={`p-2 border rounded w-full ${
                  errors[field] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">Subjects (1–5) *</label>
            <Select
              isMulti
              options={SUBJECT_OPTIONS}
              value={formData.subject}
              onChange={handleSubjectChange}
              placeholder="Select subjects..."
              isDisabled={!editable}
            />
            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Assigned Streams *</label>
            <Select
              isMulti
              options={CLASS_OPTIONS}
              value={formData.classes}
              onChange={handleClassChange}
              placeholder="Select streams..."
              isDisabled={!editable}
            />
            {errors.classes && <p className="text-red-500 text-sm mt-1">{errors.classes}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stream Coordinator *</label>
            <Select
              options={CLASS_OPTIONS}
              value={formData.classlecturer}
              onChange={handleClasslecturerChange}
              placeholder="Select stream coordinator..."
              isDisabled={!editable}
            />
            {errors.classlecturer && <p className="text-red-500 text-sm mt-1">{errors.classlecturer}</p>}
          </div>

          {editable && (
            <div>
              <label className="block text-sm font-medium mb-1">Upload Image *</label>
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith('image/')) {
                    setFormData((prev) => ({
                      ...prev,
                      image: URL.createObjectURL(file),
                    }));
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                className="flex items-center justify-center p-4 border-2 border-dashed border-gray-400 rounded cursor-pointer bg-gray-50 hover:bg-gray-100 text-center"
                onClick={() => document.getElementById('fileInputEdit').click()}
              >
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <p className="text-gray-600 text-sm">Drag & drop or click to upload</p>
                )}
              </div>
              <input
                id="fileInputEdit"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          )}

          {!editable && formData.image && (
            <img
              src={formData.image}
              alt="Lecturer"
              className="w-24 h-24 rounded-full object-cover mx-auto mt-3"
            />
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Close</button>
          {editable && (
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LecturerDetails;