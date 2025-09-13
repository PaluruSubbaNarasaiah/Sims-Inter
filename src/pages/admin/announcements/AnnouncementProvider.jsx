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
      title: 'Mid-Term Examination Schedule Released',
      content: 'The schedule for the upcoming mid-term examinations for all undergraduate and postgraduate programs has been released. Please check the college portal for detailed timings and hall tickets. Good luck with your preparations!',
      target: ['students'],
      startDate: '2025-09-15',
      endDate: '2025-10-05',
      status: 'active',
      createdAt: '2025-09-14T11:00:00Z'
    },
    {
      id: 'ann-002',
      title: 'lecturer Development Program on AI in Education',
      content: 'A lecturer Development Program (FDP) on "Integrating AI in Higher Education" is scheduled for all teaching staff. The session will be held in the main auditorium on September 20th. Registration is mandatory.',
      target: ['lecturers', 'staff'],
      startDate: '2025-09-16',
      endDate: '2025-09-19',
      status: 'active',
      createdAt: '2025-09-15T09:00:00Z'
    },
    {
      id: 'ann-003',
      title: 'Annual Tech Fest "Innovate 2025" Announcement',
      content: 'Get ready for Innovate 2025, our annual technical festival! Events include hackathons, coding competitions, and project exhibitions. More details to follow. All departments are invited to participate.',
      target: ['all'],
      startDate: '2025-09-10',
      endDate: '2025-09-14',
      status: 'expired',
      createdAt: '2025-09-09T15:00:00Z'
    },
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