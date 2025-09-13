// src/contexts/MessageProvider.jsx or src/pages/messages/MessageProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      id: 'msg-001',
      subject: 'JEE Mock Test Schedule',
      content: 'Dear students, the JEE Main mock test series will begin from July 1st. Please report to the examination hall by 9:30 AM. All the best!',
      sender: 'ramesh.kumar@college.edu',
      recipients: ['mpc.students@college.edu'],
      status: 'sent',
      date: '2025-06-25T14:30:00Z',
      read: true,
      attachments: ['jee_mock_schedule.pdf'],
      starred: true,
      deletedAt: null
    },
    {
      id: 'msg-002',
      subject: 'NEET Biology Lab Session',
      content: 'Special biology lab sessions for NEET preparation will be conducted every Saturday. BiPC students are encouraged to attend.',
      sender: 'lakshmi.devi@college.edu',
      recipients: ['bipc.students@college.edu'],
      status: 'sent',
      date: '2025-06-26T18:15:00Z',
      read: false,
      attachments: [],
      starred: false,
      deletedAt: null
    },
    {
      id: 'msg-003',
      subject: 'Commerce Career Guidance',
      content: 'Career counseling session for CEC and MEC students regarding CA, CS, and banking opportunities on June 28th at 3 PM.',
      sender: 'suresh.babu@college.edu',
      recipients: ['commerce.students@college.edu'],
      status: 'sent',
      date: '2025-06-27T09:00:00Z',
      read: false,
      attachments: ['career_guidance_brochure.pdf'],
      starred: false,
      deletedAt: null
    },
    {
      id: 'msg-004',
      subject: 'Intermediate Board Exam Preparation',
      content: 'Special coaching classes for AP Intermediate Board exams will start from January 15th. Attendance is mandatory for all second-year students.',
      sender: 'principal@college.edu',
      recipients: ['all.students@college.edu'],
      status: 'sent',
      date: '2025-06-28T10:00:00Z',
      read: false,
      attachments: ['board_exam_schedule.pdf'],
      starred: true,
      deletedAt: null
    },
  ]);

  const TRASH_RETENTION_DAYS = 30;

  // Helper function to calculate days since deletion (copied from MessageModule)
  const getDaysSinceDeletion = (deletedAt) => {
    if (!deletedAt) return null;
    const now = new Date();
    const deletedDate = new Date(deletedAt);
    const diffTime = Math.abs(now - deletedDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days
  };

  // Effect to "purge" old trash messages (copied from MessageModule)
  useEffect(() => {
    setMessages(prevMessages =>
      prevMessages.filter(msg => {
        if (msg.status === 'trash' && msg.deletedAt) {
          const days = getDaysSinceDeletion(msg.deletedAt);
          return days <= TRASH_RETENTION_DAYS;
        }
        return true;
      })
    );
  }, []);

  // Calculate unread count specifically for the inbox (excluding sent by current user, drafts, and trash)
  const unreadMessageCount = messages.filter(m =>
    !m.read &&
    m.status === 'sent' && // It must be a sent message
    m.sender !== 'student@college.edu' && // Not sent by the current user (student)
    m.status !== 'trash' // Not in trash
  ).length;

  // Functions that modify messages (you would move these from MessageModule.jsx)
  const handleSendMessage = (newMessage) => {
    setMessages(prev => [...prev, {
      ...newMessage,
      id: `msg-${Date.now()}`,
      status: 'sent',
      date: new Date().toISOString(),
      sender: 'student@college.edu',
      read: true,
      starred: false,
      deletedAt: null
    }]);
  };

  const handleSaveDraft = (draftMessage) => {
    setMessages(prev => [...prev, {
      ...draftMessage,
      id: `msg-${Date.now()}`,
      status: 'draft',
      date: new Date().toISOString(),
      sender: 'student@college.edu',
      read: false,
      starred: false,
      deletedAt: null
    }]);
  };

  const handleDeleteMessage = (id) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, status: 'trash', deletedAt: new Date().toISOString(), originalStatus: msg.status } : msg
    ));
  };

  const handleUndoDelete = (id) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, status: msg.originalStatus || 'inbox', deletedAt: null, originalStatus: undefined } : msg
    ));
  };

  const handlePermanentDelete = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleMarkAsRead = (id) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  const handleToggleStar = (id) => {
    setMessages(prev => prev.map(msg =>
        msg.id === id ? { ...msg, starred: !msg.starred } : msg
    ));
  };


  const value = {
    messages,
    unreadMessageCount,
    handleSendMessage,
    handleSaveDraft,
    handleDeleteMessage,
    handleUndoDelete,
    handlePermanentDelete,
    handleMarkAsRead,
    handleToggleStar,
    getDaysSinceDeletion, // Provide if MessageModule still needs it directly
    TRASH_RETENTION_DAYS // Provide if MessageModule still needs it directly
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};