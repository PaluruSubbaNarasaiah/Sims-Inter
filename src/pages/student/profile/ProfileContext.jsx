// src/context/ProfileContext.jsx
import React, { createContext, useState, useContext } from 'react';
export let role = "student";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    name: 'Rajesh Kumar Reddy',
    role: 'Student',
    lastLogin: '2025-06-28 09:15 AM',
    college: 'Sri Venkateswara Junior College',
    profileImage: '/avatar.png',
    studentId: '22MPC001',
    course: 'Intermediate MPC',
    year: '2nd Year',
    section: 'A',
    stream: 'MPC (Mathematics, Physics, Chemistry)',
    coaching: 'JEE Main & Advanced',
    classlecturerId: 'FAC101',
    classlecturerName: 'Dr. Ramesh Kumar',
    parentId: 'PAR001',
    parentName: 'Mr. Venkat Reddy & Mrs. Lakshmi Devi',
    admissionYear: '2022-23',
    rollNumber: 'MPC22001'
  });

  return (
    <ProfileContext.Provider value={{ profileData, setProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);