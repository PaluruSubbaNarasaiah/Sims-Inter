// src/context/ProfileContext.jsx
import React, { createContext, useState, useContext } from 'react';
export let role = "parent";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    phone: '+91 9876543210',
    role: 'Parent -  SIMS Jr College',
    profileImage: '/avatar.png',
    parentId: 'APJC2024001',
    address: 'H.No 12-34, Gandhi Nagar, Vijayawada, AP - 520010',
    occupation: 'Software Engineer',
    children: [
      { name: 'Arjun Kumar', rollNo: 'MPC24001', stream: 'MPC', year: 'First Year' },
      { name: 'Priya Reddy', rollNo: 'BiPC24015', stream: 'BiPC', year: 'Second Year' },
      { name: 'Kiran Sharma', rollNo: 'CEC24008', stream: 'CEC', year: 'First Year' }
    ],
    emergencyContact: '+91 9123456789',
    relationToStudent: 'Father'
  });

  return (
    <ProfileContext.Provider value={{ profileData, setProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);