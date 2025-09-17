// src/pages/admin/profile/ProfileModule.jsx
import React, { useState } from 'react';
import {
  User, Mail, Phone, Lock, Calendar, MapPin,
  Edit2, Save, Camera, XCircle, Eye, EyeOff, CheckCircle // Added CheckCircle for active status
} from 'lucide-react';
import { useProfile } from './ProfileContext'; // Adjust the import path as necessary

const ProfileModule = () => {
  const { profileData, setProfileData } = useProfile(); // setProfileData assumed to update general profile info
  const [localImage, setLocalImage] = useState(profileData.profileImage);

  // State for password change functionality
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // State for toggling password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Utility function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };



  // Handler for password change submission
  const handleChangePassword = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setPasswordError(''); // Clear previous errors
    setPasswordSuccess(''); // Clear previous success messages

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('All password fields are required.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    // Add more complexity checks if needed (e.g., regex for special characters, numbers)

    console.log('Attempting to change password...');
    console.log('Current Password:', currentPassword);
    console.log('New Password:', newPassword);

    // --- In a real application, you would make an API call here ---
    try {
      // Simulate API call success
      // const response = await fetch('/api/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ currentPassword, newPassword }),
      // });
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Failed to change password.');
      // }
      // const data = await response.json();
      setPasswordSuccess('Password changed successfully!');
      // Reset password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowPasswordChange(false); // Optionally hide the form after success
    } catch (error) {
      setPasswordError(error.message || 'An unexpected error occurred.');
    }
  };

  // Handler for canceling password change
  const handleCancelPasswordChange = () => {
    setShowPasswordChange(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordError('');
    setPasswordSuccess('');
  };

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-extrabold text-gray-900">Profile Settings</h1>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-xl p-8 text-center shadow-sm">
              <div className="relative mx-auto w-36 h-36 mb-6">
                <img
                  src={localImage || '/avatar.png'} // Fallback to default avatar
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-blue-200"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
              {/* Ensure profileData.role exists for this to work */}
              <p className="text-blue-700 bg-blue-100 px-4 py-1.5 rounded-full text-sm font-semibold inline-block mt-2">
                {profileData.role || 'N/A'}
              </p>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-2">
            {/* Personal Information Section */}
            <div className="bg-white border rounded-xl p-8 shadow-sm mb-8">
              <h3 className="text-xl font-semibold mb-6 border-b pb-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <p className="bg-gray-50 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-800">{profileData.name}</p>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-800">
                    <Mail size={18} className="text-gray-500" /> <span>{profileData.email}</span>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-800">
                    <Phone size={18} className="text-gray-500" /> <span>{profileData.phone || 'N/A'}</span>
                  </div>
                </div>

                {/* Role (Non-editable) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Role</label>
                  <p className="bg-gray-50 px-4 py-2.5 border border-gray-200 rounded-lg flex items-center gap-2 text-gray-800">
                    <Lock size={18} className="text-gray-500" /> {profileData.role || 'N/A'}
                  </p>
                </div>

                {/* Subscription Status and Expiry Date */}
                <div className="md:col-span-2"> {/* Make it span full width if needed */}
                  {profileData.subscriptionActive ? (
                    <div className="mt-4 flex items-center text-green-700 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                      <CheckCircle size={18} className="mr-2" />
                      <span className="font-medium">Subscription Active</span>
                      {profileData.subscriptionExpiryDate && (
                        <span className="ml-3 text-sm text-green-600">
                          (Expires: {formatDate(profileData.subscriptionExpiryDate)})
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center text-red-700 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                      <XCircle size={18} className="mr-2" />
                      <span className="font-medium">Subscription Inactive</span>
                      {profileData.subscriptionExpiryDate && (
                        <span className="ml-3 text-sm text-red-600">
                          (Expired on: {formatDate(profileData.subscriptionExpiryDate)})
                        </span>
                      )}
                    </div>
                  )}
                </div>

              </div>

            {/* Profile information is now read-only */}
            </div>

            {/* Password Management Section */}
            <div className="bg-white border rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-6 border-b pb-3 flex items-center gap-2">
                <Lock size={20} className="text-purple-600" /> Password Management
              </h3>

              {!showPasswordChange ? (
                <button
                  onClick={() => setShowPasswordChange(true)}
                  className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                  Change Password
                </button>
              ) : (
                <form onSubmit={handleChangePassword}>
                  <div className="grid grid-cols-1 gap-7">
                    {/* Current Password */}
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          id="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-purple-500 focus:border-purple-500 pr-10"
                          autoComplete="current-password"
                          required
                        />
                        <span
                          onClick={() => setShowCurrentPassword(prev => !prev)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                        >
                          {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-purple-500 focus:border-purple-500 pr-10"
                          autoComplete="new-password"
                          required
                          minLength="8"
                        />
                        <span
                          onClick={() => setShowNewPassword(prev => !prev)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmNewPassword"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-purple-500 focus:border-purple-500 pr-10"
                          autoComplete="new-password"
                          required
                          minLength="8"
                        />
                        <span
                          onClick={() => setShowConfirmPassword(prev => !prev)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                      </div>
                    </div>
                  </div>

                  {passwordError && (
                    <p className="text-red-600 text-sm mt-4">{passwordError}</p>
                  )}
                  {passwordSuccess && (
                    <p className="text-green-600 text-sm mt-4">{passwordSuccess}</p>
                  )}

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCancelPasswordChange}
                      className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                    >
                      <Save size={18} /> Update Password
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProfileModule;