// src/context/ProfileContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
export let role = "admin";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    name: 'Mr. Subba Narasaiah',
    email: 'SubbaNarasaiah.admin@sims.edu',
    phone: '+91 98765 43210',
    role: 'College Administrator',
    profileImage: '/avatar.png',
    subscriptionActive: true, // Added: true if subscription is active
    subscriptionExpiryDate: '2026-07-15' // Added: Expiry date in YYYY-MM-DD format
  });

  // On initial load, try to get the image from localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileData(prev => ({ ...prev, profileImage: savedImage }));
    }
  }, []); // Runs only once on mount

  // When profileData.profileImage changes, update localStorage
  useEffect(() => {
    if (profileData.profileImage && profileData.profileImage.startsWith('data:image')) {
      // Only save if it's a user-uploaded image (base64 data URL)
      localStorage.setItem('profileImage', profileData.profileImage);
    } else if (profileData.profileImage === '/avatar.png') {
      // If the image is reset to the default, remove it from localStorage
      localStorage.removeItem('profileImage');
    }
  }, [profileData.profileImage]);

  return (
    <ProfileContext.Provider value={{ profileData, setProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);