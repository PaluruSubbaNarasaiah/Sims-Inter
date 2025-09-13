import { useState, useEffect } from "react";
import { role } from "../profile/ProfileContext"; // Assuming this context provides the user role
import { Link, useLocation } from "react-router-dom";
import SIMSLogo from '../../../assets/sims-logo.png';
import {
  FaSchool, FaChalkboard, FaUserGraduate, FaUsers, FaJournalWhills,
  FaClipboardList, FaRegCalendarAlt, FaClipboardCheck, FaDesktop, FaCalendarAlt, FaUserCheck,
  FaCalendarCheck, FaComments, FaBullhorn, FaQuestionCircle,
  FaTimes, FaBars // FaTimes and FaBars for toggle buttons
} from "react-icons/fa";

// Define your menu items with ABSOLUTE paths
export const menuItems = [ // Export menuItems
  {
    items: [
      { icon: FaSchool, label: "Home", href: "/lecturer", visible: ["admin", "lecturer", "student", "parent"], keywords: ["dashboard", "overview"] }, // Added keywords
      { icon: FaUserGraduate, label: "Students", href: "/lecturer/students", visible: ["admin", "lecturer"], keywords: ["student list", "enrollment"] },
      { icon: FaUsers, label: "Parents", href: "/lecturer/parents", visible: ["admin", "lecturer"], keywords: ["parent list", "guardians"] },
      { icon: FaChalkboard, label: "My Streams", href: "/lecturer/myclasses", visible: ["admin", "lecturer", "student", "parent"], keywords: ["stream list", "timetable"] },
      { icon: FaJournalWhills, label: "Diary", href: "/lecturer/diary", visible: ["admin", "lecturer", "student", "parent"], keywords: ["daily diary", "notes"] },
      { icon: FaClipboardList, label: "Exam Reports", href: "/lecturer/exams", visible: ["admin", "lecturer", "student", "parent"], keywords: ["grades", "results", "tests"] },
      { icon: FaRegCalendarAlt, label: "Schedules", href: "/lecturer/schedules", visible: ["admin", "lecturer", "student", "parent"], keywords: ["calendar", "timetable", "events"] },
      { icon: FaClipboardCheck, label: "Assignments", href: "/lecturer/assignments", visible: ["admin", "lecturer", "student", "parent"], keywords: ["homework", "tasks"] },
      { icon: FaDesktop, label: "Library", href: "/lecturer/library", visible: ["admin", "lecturer", "student", "parent"], keywords: ["books", "resources"] },
      { icon: FaUserCheck, label: "Attendance", href: "/lecturer/attendance", visible: ["admin", "lecturer", "student", "parent"], keywords: ["daily attendance", "record"] },
      { icon: FaCalendarAlt, label: "Leaves", href: "/lecturer/leaves", visible: ["admin", "lecturer","parent"], keywords: ["leave requests", "absences"] },
      { icon: FaCalendarCheck, label: "Events", href: "/lecturer/events", visible: ["admin", "lecturer", "student", "parent"], keywords: ["college events", "calendar"] },
      { icon: FaComments, label: "Messages", href: "/lecturer/messages", visible: ["admin", "lecturer", "student", "parent"], keywords: ["inbox", "chats"] },
      { icon: FaBullhorn, label: "Announcements", href: "/lecturer/announcements", visible: ["admin", "lecturer", "student", "parent"], keywords: ["notifications", "notices"] },
      { icon: FaQuestionCircle, label: "Help", href: "/lecturer/help", visible: ["admin", "lecturer", "student", "parent"], keywords: ["support", "faq"] },
    ],
  },
];

const lecturerMenu = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();
  const [isDesktopMenuCollapsed, setIsDesktopMenuCollapsed] = useState(false);

  // Effect to close mobile menu whenever the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location, setIsMobileMenuOpen]);

  // Function to toggle the desktop menu collapse state
  const toggleDesktopMenu = () => {
    setIsDesktopMenuCollapsed(!isDesktopMenuCollapsed);
  };

  return (
    <>
      {/* Mobile Overlay: visible when mobile menu is open on small screens */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Menu Container */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-white shadow-xl lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isMobileMenuOpen ? 'w-[300px] sm:w-[350px]' : ''} {/* Mobile width when open */}
        ${isDesktopMenuCollapsed ? 'lg:w-25' : 'lg:w-65'} {/* Desktop width (w-64 = 256px) */}
      `}>
        <div className="h-full flex flex-col border-r">
          {/* Menu Header (Logo and Toggle Buttons) */}
          <div className="p-4 border-b flex justify-between items-center">
            {/* The SIMS logo will now be hidden when the menu is collapsed */}
            {!isDesktopMenuCollapsed && (
              <Link to="/" className={`flex items-center gap-3`}>
                <img src={SIMSLogo} alt="SIMS Logo" className="h-10 w-15 animate-fade-in-down" />
              </Link>
            )}

            {/* Mobile Close Button (only visible on small screens) */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100"
              aria-label="Close Mobile Menu"
            >
              <FaTimes className="text-gray-500 text-xl" />
            </button>

            {/* Desktop Toggle Button (only visible on large screens) */}
            <button
                onClick={toggleDesktopMenu}
                className="hidden lg:block p-2 rounded-full hover:bg-gray-100"
                title={isDesktopMenuCollapsed ? "Expand Menu" : "Collapse Menu"}
                aria-label={isDesktopMenuCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                <FaBars className="text-gray-500 text-xl" />
            </button>
          </div>

          {/* Menu Items List */}
          <div className="flex-1 overflow-y-auto p-3 scrollbar-hide"> {/* Added scrollbar-hide here */}
            {menuItems.map((group, groupIndex) => (
              <div key={groupIndex} className="flex flex-col gap-1">
                {group.items.map((item) => {
                  // Assuming `role` from context provides the current user's role
                  // and `item.visible` array contains roles that can see this item.
                  // This assumes `role` is a string like "lecturer", "admin", etc.
                  if (item.visible.includes(role)) {
                    const isRootPath = item.href === "/lecturer";
                    const isActive = isRootPath
                      ? location.pathname === item.href || location.pathname === "/lecturer"
                      : location.pathname.startsWith(item.href);

                    return (
                      <Link
                        to={item.href}
                        key={item.label}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg
                          transition-all duration-300 ease-in-out
                          ${isDesktopMenuCollapsed ? 'justify-center' : ''}
                          ${isActive
                            ? 'bg-blue-100 text-blue-700 font-medium border-l-4 border-blue-600'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                          }
                          ${isDesktopMenuCollapsed ? 'py-3' : ''}
                        `}
                      >
                        <item.icon className="text-lg min-w-[24px]" />
                        {!isDesktopMenuCollapsed && (
                          <span className="transition-opacity duration-300 ease-in-out">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default lecturerMenu;