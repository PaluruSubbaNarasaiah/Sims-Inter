import React, { useState } from 'react';
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

function AddLecturer({ onClose, onSave, existinglecturers }) {
  const [formData, setFormData] = useState({
    empId: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    subject: [],
    classes: [],
    classlecturer: null,
    address: '',
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const { empId, name, email, phone, password, subject, classes, classlecturer, image } = formData;
    const trimmedEmpId = empId.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmpId) newErrors.empId = 'EMP ID is required';
    if (!trimmedPassword) newErrors.password = 'Password is required';
    if (!name.trim()) newErrors.name = 'Name is required';

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

    if (!image) newErrors.image = 'Image is required';

    if (existinglecturers.some(t => t.empId.toLowerCase() === trimmedEmpId.toLowerCase())) {
      newErrors.empId = 'Duplicate EMP ID found';
    }

    if (existinglecturers.some(t => t.email.toLowerCase() === trimmedEmail)) {
      newErrors.email = 'Duplicate Gmail ID found';
    }

    if (existinglecturers.some(t => t.phone === trimmedPhone)) {
      newErrors.phone = 'Duplicate phone number found';
    }

    if (subject.length < 1) newErrors.subject = 'At least 1 subject is required';
    if (classes.length < 1) newErrors.classes = 'At least 1 stream is required';
    if (!classlecturer) newErrors.classlecturer = 'Stream Coordinator is required';

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
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formattedData = {
      ...formData,
      empId: formData.empId.trim(),
      password: formData.password.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject.map(s => s.value),
      classes: formData.classes.map(c => c.value),
      classlecturer: formData.classlecturer?.value,
    };

    onSave(formattedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] md:w-[450px] max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Add New Lecturer</h2>
        <div className="flex flex-col gap-3">

          <div>
            <input
              name="empId"
              value={formData.empId}
              onChange={handleChange}
              placeholder="Lecturer EMP ID *"
              className={`p-2 border rounded w-full ${errors.empId ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.empId && <p className="text-red-500 text-sm mt-1">{errors.empId}</p>}
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password *"
              className={`p-2 pr-10 border rounded w-full ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 text-lg"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {['name', 'email', 'phone', 'address'].map((field) => (
            <div key={field}>
              <input
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} *`}
                className={`p-2 border rounded w-full ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
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
            />
            {errors.classlecturer && <p className="text-red-500 text-sm mt-1">{errors.classlecturer}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upload Image *</label>
            <div
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                  setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
                  setErrors((prev) => ({ ...prev, image: '' }));
                }
              }}
              onDragOver={(e) => e.preventDefault()}
              className={`flex items-center justify-center p-4 border-2 border-dashed rounded cursor-pointer text-center ${
                errors.image ? 'border-red-500 bg-red-50' : 'border-gray-400 bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => document.getElementById('fileInput').click()}
            >
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <p className="text-gray-600 text-sm">Drag & drop or click to upload</p>
              )}
            </div>
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
        </div>
      </div>
    </div>
  );
}

export default AddLecturer;