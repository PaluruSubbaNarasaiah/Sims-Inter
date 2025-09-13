// src/routes/lecturerRouter.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom'; // Added useNavigate, useLocation
import SIMSLogo from '../assets/sims-logo.png';
import LecturerMenu, { menuItems } from '../pages/lecturer/components/Menu'; // Import menuItems
import Navbar from '../pages/lecturer/components/Navbar';
import LecturerPage from '../pages/lecturer/lecturer/LecturerPage';
import ProfileModule from '../pages/lecturer/profile/ProfileModule';
import StudentModule from '../pages/lecturer/students/StudentModule';
import ParentModule from '../pages/lecturer/parents/ParentModule';
import MyClassesModule from '../pages/lecturer/myclasses/MyClassesModule';
import DiaryModule from '../pages/lecturer/diary/DiaryModule'
import ExamModule from '../pages/lecturer/exams/ExamModule';
import SchedulesModule from '../pages/lecturer/schedules/SchedulesModule';
import AssignmentModule from '../pages/lecturer/assignments/AssignmentModule';
import LibraryModule from '../pages/lecturer/library/LibraryModule';
import AttendanceModule from '../pages/lecturer/attendance/AttendanceModule';
import LeavesModule from '../pages/lecturer/leaves/LeaveModule';
import EventModule from '../pages/lecturer/events/EventModule';
import MessageModule from '../pages/lecturer/messages/MessageModule';
import AnnouncementModule from '../pages/lecturer/announcements/AnnouncementModule';
import AnnouncementOverviewModal from '../pages/lecturer/announcements/AnnouncementOverviewModal';
import HelpModule from '../pages/lecturer/help/HelpModule';
import { MessageProvider } from '../pages/lecturer/messages/MessageProvider';
import AnnouncementProvider from '../pages/lecturer/announcements/AnnouncementProvider';
import { ProfileProvider } from '../pages/lecturer/profile/ProfileContext';
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

function LecturerRouter() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNoPageFound, setShowNoPageFound] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');
  const [lastVisitedPath, setLastVisitedPath] = useState('/lecturer'); // State to store the path before search

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
      // If query is empty, navigate to lecturer home and do nothing else
      navigate('/lecturer');
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
        {/* Sidebar Menu */}
        <LecturerMenu isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnnouncementProvider>
            <MessageProvider>
              {/* Navbar component - now accepts mobile menu state and search handler */}
              <Navbar
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                onSearchNavigate={handleSearchNavigate} // Pass the search handler
              />

              {/* Main content routing area */}
              <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                {showNoPageFound ? (
                  <NoPageFound query={lastSearchQuery} />
                ) : (
                  <Routes>
                    <Route path="/" element={<LecturerPage />} />
                    <Route path="/profile" element={<ProfileModule />} />
                    <Route path="/students" element={<StudentModule />} />
                    <Route path="/parents" element={<ParentModule />} />
                    <Route path="/myclasses" element={<MyClassesModule />} />
                    <Route path="/diary" element={<DiaryModule />} />
                    <Route path="/exams" element={<ExamModule />} />
                    <Route path="/schedules" element={<SchedulesModule />} />
                    <Route path="/assignments" element={<AssignmentModule />} />
                    <Route path="/library" element={<LibraryModule />} />
                    <Route path="/attendance" element={<AttendanceModule />} />
                    <Route path="/leaves" element={<LeavesModule />} />
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

export default LecturerRouter;