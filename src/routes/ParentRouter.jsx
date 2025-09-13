// src/routes/ParentRouter.jsx
import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SIMSLogo from '../assets/sims-logo.png';
import ParentMenu, { menuItems } from '../pages/parent/components/Menu'; // Renamed import to ParentMenu, import menuItems
import Navbar from '../pages/parent/components/Navbar'; // Assuming this Navbar is specific to parent
import ParentPage from '../pages/parent/parentpage/ParentPage';
import ProfileModule from '../pages/parent/profile/ProfileModule';
import MyChildrenModule from '../pages/parent/mychildren/MyChildrenModule';
import FeeModule from '../pages/parent/fee/FeeModule';
import DiaryModule from '../pages/parent/diary/DiaryModule'
import ExamModule from '../pages/parent/exams/ExamModule';
import AttendanceModule from '../pages/parent/attendance/AttendanceModule';
import LeaveModule from '../pages/parent/leaves/LeaveModule';
import EventModule from '../pages/parent/events/EventModule';
import MessageModule from '../pages/parent/messages/MessageModule';
import AnnouncementModule from '../pages/parent/announcements/AnnouncementModule';
import AnnouncementOverviewModal from '../pages/parent/announcements/AnnouncementOverviewModal';
import HelpModule from '../pages/parent/help/HelpModule';
import { MessageProvider } from '../pages/parent/messages/MessageProvider';
import AnnouncementProvider from '../pages/parent/announcements/AnnouncementProvider';
import { ProfileProvider } from '../pages/parent/profile/ProfileContext';
import AboutUs from '../pages/AboutUs';
import PrivacyPolicy from '../pages/PrivacyPolicy';

// Simple NoPageFound component for demonstration
const NoPageFound = ({ query }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-600">
    <h2 className="text-2xl font-bold mb-2">No Page Found</h2>
    <p className="text-lg">Your search for "<span className="font-semibold text-blue-600">{query}</span>" did not match any pages.</p>
    <p className="text-md mt-2">Redirecting to the previous page...</p>
  </div>
);

function ParentRouter() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNoPageFound, setShowNoPageFound] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');
  const [lastVisitedPath, setLastVisitedPath] = useState('/parent'); // State to store the path before search

  const navigate = useNavigate();
  const location = useLocation();

  // Effect to update lastVisitedPath when the route changes, excluding when NoPageFound is shown
  useEffect(() => {
    if (!showNoPageFound) {
      setLastVisitedPath(location.pathname);
    }
  }, [location.pathname, showNoPageFound]);

  // Effect for redirection after displaying NoPageFound
  useEffect(() => {
    let timer;
    if (showNoPageFound) {
      timer = setTimeout(() => {
        setShowNoPageFound(false);
        navigate(lastVisitedPath); // Navigate back to the last visited path
      }, 2000); // 2 seconds
    }
    return () => clearTimeout(timer); // Cleanup the timer
  }, [showNoPageFound, navigate, lastVisitedPath]);

  const handleSearchNavigate = (query) => {
    setShowNoPageFound(false); // Reset no page found on new search
    setLastSearchQuery(''); // Clear previous search query feedback

    const lowerCaseQuery = query.toLowerCase().trim();

    if (!lowerCaseQuery) {
      // If query is empty, navigate to parent home and do nothing else
      navigate('/parent');
      return;
    }

    let foundMatch = false;

    // Flatten menuItems for easier search
    const allMenuItems = menuItems.flatMap(group => group.items);

    for (const item of allMenuItems) {
      // Define searchable terms: label and any explicit keywords
      const allSearchableTerms = [item.label.toLowerCase(), ...(item.keywords || []).map(k => k.toLowerCase())];

      if (allSearchableTerms.some(term => term.includes(lowerCaseQuery))) {
        navigate(item.href);
        foundMatch = true;
        break;
      }
    }

    if (!foundMatch) {
      setShowNoPageFound(true);
      setLastSearchQuery(query);
      // No need to navigate here, the useEffect will handle it after 2 seconds
    }
  };

  return (
    <ProfileProvider>
      <div className="h-screen flex flex-col lg:flex-row bg-gray-50">
        <ParentMenu isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <AnnouncementProvider>
            <MessageProvider>
              <Navbar
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                onSearchNavigate={handleSearchNavigate} // Pass the search handler
              />

              <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                {showNoPageFound ? (
                  <NoPageFound query={lastSearchQuery} />
                ) : (
                  <Routes>
                    <Route path="/" element={<ParentPage />} />
                    <Route path="/profile" element={<ProfileModule />} />
                    <Route path="/mychildren" element={<MyChildrenModule />} />
                    <Route path="/fee" element={<FeeModule />} />
                    <Route path="/diary" element={<DiaryModule />} />
                    <Route path="/exams" element={<ExamModule />} />
                    <Route path="/attendance" element={<AttendanceModule />} />
                    <Route path="/leaves" element={<LeaveModule />} />
                    <Route path="/messages" element={<MessageModule />} />
                    <Route path="/events" element={<EventModule />} />
                    <Route path="/announcements" element={<AnnouncementModule />} />
                    <Route path="/announcements/overview" element={<AnnouncementOverviewModal />} />
                    <Route path="/help" element={<HelpModule />} />
                    <Route path="/aboutus" element={<AboutUs />} />
                    <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                  </Routes>
                )}
              </main>
            </MessageProvider>
          </AnnouncementProvider>
        </div>
      </div>
    </ProfileProvider>
  );
}

export default ParentRouter;