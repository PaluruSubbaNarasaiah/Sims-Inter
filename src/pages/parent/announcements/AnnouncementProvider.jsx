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
      title: 'MPC Stream - JEE Coaching Classes Start',
      content: 'JEE coaching classes for MPC students will commence from July 1st. All Mathematics, Physics, and Chemistry students are required to attend. Classes will be held from 6:00 AM to 8:00 AM daily.',
      target: ['students', 'parents'],
      startDate: '2024-06-25',
      endDate: '2024-07-05',
      status: 'active',
      createdAt: '2024-06-20T09:00:00Z'
    },
    {
      id: 'ann-002',
      title: 'BiPC Stream - NEET Mock Test Schedule',
      content: 'NEET mock tests for BiPC students (Biology, Physics, Chemistry) will be conducted every Saturday starting July 6th. Students must bring their hall tickets and stationery.',
      target: ['students'],
      startDate: '2024-06-26',
      endDate: '2024-07-10',
      status: 'active',
      createdAt: '2024-06-21T11:30:00Z'
    },
    {
      id: 'ann-003',
      title: 'CEC Stream - Commerce Fair Registration',
      content: 'Registration open for Commerce Fair 2024. CEC students (Commerce, Economics, Civics) can participate in various competitions. Last date for registration: July 15th.',
      target: ['students', 'parents'],
      startDate: '2024-06-28',
      endDate: '2024-07-15',
      status: 'active',
      createdAt: '2024-06-22T14:15:00Z'
    },
    {
      id: 'ann-004',
      title: 'Fee Payment Reminder - All Streams',
      content: 'Reminder: Second installment fees for all streams (MPC, BiPC, CEC, MEC, HEC) are due by July 31st. Late payment will incur additional charges.',
      target: ['parents'],
      startDate: '2024-06-30',
      endDate: '2024-07-31',
      status: 'active',
      createdAt: '2024-06-25T16:00:00Z'
    },
    {
      id: 'ann-005',
      title: 'MEC & HEC Streams - Economics Seminar',
      content: 'Special economics seminar for MEC and HEC students. Topic: "Current Economic Trends in India". Date: July 20th, Time: 2:00 PM in Main Auditorium.',
      target: ['students'],
      startDate: '2024-07-01',
      endDate: '2024-07-20',
      status: 'active',
      createdAt: '2024-06-28T10:45:00Z'
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