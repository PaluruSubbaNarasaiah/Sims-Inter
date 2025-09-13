import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Calendar, MapPin, Edit2, Save, Camera, XCircle, Tag, BookOpen, Users, UserCheck } from 'lucide-react';
import { useProfile } from './ProfileContext';

const ProfileModule = () => {
  const { profileData, setProfileData } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [localImage, setLocalImage] = useState(profileData.profileImage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    setProfileData(prev => ({ ...prev, profileImage: localImage }));
    console.log('Saved profile:', profileData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLocalImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => setLocalImage('/avatar.png');

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        {/* Header - Simplified */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-extrabold text-gray-900">Profile Settings</h1>
          {/* Edit/Save buttons removed from here */}
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-xl p-8 text-center shadow-sm">
              <div className="relative mx-auto w-36 h-36 mb-6">
                <img
                  src={localImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-blue-200"
                />
                {isEditing && (
                  <>
                    <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 bg-blue-700 text-white p-2 rounded-full cursor-pointer">
                      {localImage === '/avatar.png' ? <Camera size={18} /> : <Edit2 size={18} />}
                      <input
                        id="profile-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {localImage !== '/avatar.png' && (
                      <button onClick={handleImageRemove} className="absolute bottom-0 left-0 bg-red-600 text-white p-2 rounded-full">
                        <XCircle size={18} />
                      </button>
                    )}
                  </>
                )}
              </div>
              <h2 className="text-2xl font-bold">{profileData.name}</h2>
              <p className="text-blue-700 bg-blue-100 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">{profileData.role}</p> {/* Added mb-4 for spacing */}

              {/* Edit/Save buttons moved here */}
              <div className="flex justify-center items-center gap-4 mt-4"> {/* Added mt-4 for spacing */}
                {isEditing ? (
                  <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition">
                    <Save size={18} /> Save Changes
                  </button>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition">
                    <Edit2 size={18} /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-6 border-b pb-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {/* Name - Kept editable */}
                <div>
                  <label className="block text-sm mb-2">Full Name</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    {profileData.name}
                  </div>
                </div>

                {/* Student ID - Read Only */}
                <div>
                  <label className="block text-sm mb-2">Student ID</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    <Tag size={18} /> <span>{profileData.studentId}</span>
                  </div>
                </div>

                {/* Course - Read Only */}
                <div>
                  <label className="block text-sm mb-2">Course</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    <BookOpen size={18} /> <span>{profileData.course}</span>
                  </div>
                </div>

                {/* Year - Read Only */}
                <div>
                  <label className="block text-sm mb-2">Academic Year</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    <Calendar size={18} /> <span>{profileData.year}</span>
                  </div>
                </div>

                {/* Stream - Read Only */}
                <div className="md:col-span-2">
                  <label className="block text-sm mb-2">Stream</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    <BookOpen size={18} /> <span>{profileData.stream}</span>
                  </div>
                </div>

                {/* Coaching - Read Only */}
                <div>
                  <label className="block text-sm mb-2">Integrated Coaching</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    <Tag size={18} /> <span>{profileData.coaching}</span>
                  </div>
                </div>

                {/* Roll Number - Read Only */}
                <div>
                  <label className="block text-sm mb-2">Roll Number</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    <Tag size={18} /> <span>{profileData.rollNumber}</span>
                  </div>
                </div>

                {/* Section - Read Only */}
                <div>
                  <label className="block text-sm mb-2">Section</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    <Users size={18} /> <span>{profileData.section}</span>
                  </div>
                </div>

                {/* Class lecturer ID with Name - Read Only */}
                <div>
                  <label className="block text-sm mb-2">Class lecturer</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    <UserCheck size={18} /> <span>{profileData.classlecturerName} ({profileData.classlecturerId})</span>
                  </div>
                </div>

                {/* Parent ID with Name - Read Only */}
                <div>
                  <label className="block text-sm mb-2">Parent/Guardian</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    <User size={18} /> <span>{profileData.parentName} ({profileData.parentId})</span>
                  </div>
                </div>

                {/* Role - Still Read Only */}
                <div>
                  <label className="block text-sm mb-2">Assigned Role</label>
                  <p className="bg-gray-50 px-4 py-2.5 border rounded-lg flex items-center gap-2">
                    <Lock size={18} /> {profileData.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProfileModule;