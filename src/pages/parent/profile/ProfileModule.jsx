import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Camera, XCircle, Edit2, Save, Tag, MapPin, Briefcase, Users, AlertCircle } from 'lucide-react';
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-extrabold text-gray-900">Parent Profile</h1>
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
              <p className="text-blue-700 bg-blue-100 px-4 py-1.5 rounded-full text-sm font-semibold mb-2">{profileData.role}</p>
              <p className="text-gray-600 text-sm mb-4">{profileData.occupation}</p>


            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-6 border-b pb-3">Parent Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {/* Name - Kept editable */}
                <div>
                  <label className="block text-sm mb-2">Full Name</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    {profileData.name}
                  </div>
                </div>


                {/* Parent ID */}
                <div>
                  <label className="block text-sm mb-2">Parent ID</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    <Tag size={18} /> <span>{profileData.parentId}</span>
                  </div>
                </div>

                {/* Email - Now Read Only */}
                <div>
                  <label className="block text-sm mb-2">Email Address</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    <Mail size={18} /> <span>{profileData.email}</span>
                  </div>
                </div>

                {/* Phone - Now Read Only */}
                <div>
                  <label className="block text-sm mb-2">Phone Number</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    <Phone size={18} /> <span>{profileData.phone}</span>
                  </div>
                </div>

                {/* Occupation */}
                <div>
                  <label className="block text-sm mb-2">Occupation</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    <Briefcase size={18} /> <span>{profileData.occupation}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm mb-2">Address</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    <MapPin size={18} /> <span>{profileData.address}</span>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm mb-2">Emergency Contact</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    <AlertCircle size={18} /> <span>{profileData.emergencyContact}</span>
                  </div>
                </div>

                {/* Relation to Student */}
                <div>
                  <label className="block text-sm mb-2">Relation to Student</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border rounded-lg">
                    <User size={18} /> <span>{profileData.relationToStudent}</span>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
  );
};

export default ProfileModule;