// src/context/ProfileContext.jsx
import React, { createContext, useState, useContext } from 'react';
export let role = "lecturer";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    name: 'Dr. Ramesh Kumar',
    email: 'ramesh.kumar@apcollege.edu',
    phone: '+91 9876543210',
    role: 'Lecturer - Mathematics (MPC Stream)',
    profileImage: '/avatar.png'
  });

  return (
    <ProfileContext.Provider value={{ profileData, setProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
