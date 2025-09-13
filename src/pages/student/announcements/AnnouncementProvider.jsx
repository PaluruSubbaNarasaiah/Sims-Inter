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
      title: 'College Reopening on Monday!',
      content: 'Exciting news! College will reopen on June 24th after the short break. We look forward to seeing everyone back on campus, ready for a productive second half of the term.',
      target: ['all'],
      startDate: '2025-06-19',
      endDate: '2025-06-23',
      status: 'active',
      createdAt: '2025-06-18T10:30:00Z'
    },
    {
      id: 'ann-002',
      title: 'JEE Mock Test Schedule',
      content: 'JEE coaching students - Mock test series will begin from July 1st. All JEE aspirants must attend the orientation session on June 30th at 10 AM in the main auditorium.',
      target: ['jee'],
      startDate: '2025-06-20',
      endDate: '2025-06-30',
      status: 'active',
      createdAt: '2025-06-19T09:00:00Z'
    },
    {
      id: 'ann-003',
      title: 'NEET Biology Lab Sessions',
      content: 'Special biology lab sessions for NEET coaching students will be conducted every Saturday from 2 PM to 5 PM. BiPC stream students are also welcome to join.',
      target: ['neet', 'bipc'],
      startDate: '2025-06-21',
      endDate: '2025-07-15',
      status: 'active',
      createdAt: '2025-06-20T11:15:00Z'
    },
    {
      id: 'ann-004',
      title: 'Commerce Stream Career Guidance',
      content: 'Career counseling session for CEC and MEC stream students. Learn about CA, CS, and other commerce career opportunities. Session on June 28th at 3 PM.',
      target: ['cec', 'mec', 'ca'],
      startDate: '2025-06-22',
      endDate: '2025-06-28',
      status: 'active',
      createdAt: '2025-06-21T14:30:00Z'
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