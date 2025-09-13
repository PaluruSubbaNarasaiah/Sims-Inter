// src/contexts/MessageProvider.jsx or src/pages/messages/MessageProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    // Your initial messages array from MessageModule.jsx
    // Ensure you keep this data consistent with MessageModule's initial state
    {
      id: 'msg-001',
      subject: 'MPC Stream - JEE Mock Test Schedule',
      content: 'Dear Parents, JEE mock test for MPC students (Mathematics, Physics, Chemistry) is scheduled for July 15th at 9:00 AM. Please ensure your ward brings hall ticket and stationery.',
      sender: 'ravi.kumar@juniorcollege.edu',
      recipients: ['parent1@email.com', 'parent2@email.com'],
      status: 'sent',
      date: '2024-07-05T14:30:00Z',
      read: true,
      attachments: ['jee_mock_schedule.pdf'],
      starred: true,
      deletedAt: null
    },
    {
      id: 'msg-002',
      subject: 'BiPC Stream - NEET Coaching Update',
      content: 'NEET coaching classes for BiPC students will have additional sessions on weekends. New timings: Saturday & Sunday 8:00 AM to 12:00 PM.',
      sender: 'lakshmi.devi@juniorcollege.edu',
      recipients: ['all'],
      status: 'sent',
      date: '2024-07-08T18:15:00Z',
      read: false,
      attachments: [],
      starred: false,
      deletedAt: null
    },
    {
      id: 'msg-003',
      subject: 'CEC Stream - Commerce Fair Participation',
      content: 'Regarding the upcoming commerce fair, CEC students need to submit their project proposals by July 20th...',
      sender: 'sunitha.rao@juniorcollege.edu',
      recipients: ['cec.parents@juniorcollege.edu'],
      status: 'draft',
      date: '2024-07-09T09:00:00Z',
      read: false,
      attachments: [],
      starred: false,
      deletedAt: null
    },
    {
        id: 'msg-004',
        subject: 'Fee Payment Reminder - All Streams',
        content: 'This is a reminder that the second installment fees for all streams (MPC, BiPC, CEC, MEC, HEC) are due by July 31st. Late payment will incur additional charges.',
        sender: 'accounts@juniorcollege.edu',
        recipients: ['all.parents@juniorcollege.edu'],
        status: 'sent',
        date: '2024-07-15T10:00:00Z',
        read: false,
        attachments: ['fee_structure.pdf'],
        starred: true,
        deletedAt: null
    },
    {
        id: 'msg-005',
        subject: 'EAPCET Counseling Information',
        content: 'Important information regarding EAPCET counseling process for MPC and BiPC students. Counseling starts from August 1st. Please find attached guidelines.',
        sender: 'principal@juniorcollege.edu',
        recipients: ['mpc.parents@juniorcollege.edu', 'bipc.parents@juniorcollege.edu'],
        status: 'sent',
        date: '2024-07-20T16:00:00Z',
        read: false,
        attachments: ['eapcet_guidelines.pdf'],
        starred: false,
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
    m.sender !== 'parent@juniorcollege.edu' && // Not sent by the current user (parent)
    m.status !== 'trash' // Not in trash
  ).length;

  // Functions that modify messages (you would move these from MessageModule.jsx)
  const handleSendMessage = (newMessage) => {
    setMessages(prev => [...prev, {
      ...newMessage,
      id: `msg-${Date.now()}`,
      status: 'sent',
      date: new Date().toISOString(),
      sender: 'parent@juniorcollege.edu',
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
      sender: 'parent@juniorcollege.edu',
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