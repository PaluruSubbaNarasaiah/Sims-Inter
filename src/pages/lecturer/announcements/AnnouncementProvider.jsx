// src/contexts/AnnouncementProvider.jsx (or src/components/AnnouncementProvider.jsx, choose your path)
import React, { useState, createContext, useContext } from 'react';

// Create a Context for announcements
const AnnouncementContext = createContext(null);

// Custom hook to use the announcement context
export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error('useAnnouncements must be used within an AnnouncementProvider');
  }
  return context;
};

const AnnouncementProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 'ann-001',
      title: 'Intermediate Board Exam Schedule - 2025',
      content: 'The Andhra Pradesh Intermediate Board examination schedule for 1st and 2nd year students has been released. MPC, BiPC, CEC, MEC, and HEC stream students can check their exam dates on the college portal. Hall tickets will be available from March 1st.',
      target: ['students', 'faculty'],
      startDate: '2025-02-15',
      endDate: '2025-04-30',
      status: 'active',
      createdAt: '2025-02-14T10:30:00Z'
    },
    {
      id: 'ann-002',
      title: 'JEE/NEET Coaching Registration Open',
      content: 'Registration is now open for integrated JEE and NEET coaching programs for MPC and BiPC stream students. Special weekend batches available for 2nd year students. Contact the coaching coordinator for more details.',
      target: ['students', 'parents'],
      startDate: '2025-02-10',
      endDate: '2025-03-15',
      status: 'active',
      createdAt: '2025-02-09T14:20:00Z'
    }
  ]);

  const handleAddAnnouncement = (newAnn) => {
    setAnnouncements(prev => [...prev, newAnn]);
  };

  const handleUpdateAnnouncement = (updatedAnn) => {
    setAnnouncements(prev => prev.map(a => a.id === updatedAnn.id ? updatedAnn : a));
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AnnouncementContext.Provider value={{ announcements, handleAddAnnouncement, handleUpdateAnnouncement, handleDeleteAnnouncement }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export default AnnouncementProvider;