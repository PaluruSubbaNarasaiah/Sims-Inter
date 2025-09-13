// For Parent Menu

import { useState, useEffect } from "react";
import { role } from "../profile/ProfileContext"; // Assuming this context provides the user role
import { Link, useLocation } from "react-router-dom";
import SIMSLogo from '../../../assets/sims-logo.png';
import {
  FaSchool, FaUsers, FaCreditCard, FaBook, FaClipboardList, FaChartBar,
  FaUserCheck, FaCalendarCheck, FaCalendarAlt, FaComments, FaBullhorn, FaQuestionCircle,
  FaTimes, FaBars // Added FaTimes and FaBars for toggle buttons
} from "react-icons/fa";

// Define your menu items with ABSOLUTE paths
export const menuItems = [ // Export menuItems
  {
    items: [
      { icon: FaSchool, label: "Home", href: "/parent", visible: ["admin", "lecturer", "student", "parent"], keywords: ["dashboard", "overview"] }, // Added keywords
      { icon: FaUsers, label: "My Students", href: "/parent/mychildren", visible: ["parent"], keywords: ["students", "wards"] }, // Added keywords
      { icon: FaCreditCard, label: "Fees", href: "/parent/fee", visible: ["parent"], keywords: ["payments", "dues", "tuition"] }, // Added keywords
      { icon: FaBook, label: "College Diary", href: "/parent/diary", visible: ["admin", "lecturer", "student", "parent"], keywords: ["daily journal", "notes", "activities"] }, // Added keywords
      { icon: FaClipboardList, label: "Exam Reports", href: "/parent/exams", visible: ["admin", "lecturer", "student", "parent"], keywords: ["grades", "results", "tests", "scores"] }, // Added keywords
      { icon: FaUserCheck, label: "Attendance", href: "/parent/attendance", visible: ["admin", "lecturer", "student", "parent"], keywords: ["daily attendance", "record", "absent", "present"] }, // Added keywords
      { icon: FaCalendarAlt, label: "Leaves", href: "/parent/leaves", visible: ["admin", "lecturer","parent"], keywords: ["leave requests", "absences"] }, // Added keywords
      { icon: FaCalendarCheck, label: "Events", href: "/parent/events", visible: ["admin", "lecturer", "student", "parent"], keywords: ["college events", "calendar", "activities"] }, // Added keywords
      { icon: FaComments, label: "Messages", href: "/parent/messages", visible: ["admin", "lecturer", "student", "parent"], keywords: ["inbox", "chats", "communication"] }, // Added keywords
      { icon: FaBullhorn, label: "Announcements", href: "/parent/announcements", visible: ["admin", "lecturer", "student", "parent"], keywords: ["notifications", "notices", "updates"] }, // Added keywords
      { icon: FaQuestionCircle, label: "Help", href: "/parent/help", visible: ["admin", "lecturer", "student", "parent"], keywords: ["support", "faq", "guide"] }, // Added keywords
    ],
  },
];

const ParentMenu = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
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
        ${isMobileMenuOpen ? 'w-[300px] sm:w-[350px]' : ''}
        ${isDesktopMenuCollapsed ? 'lg:w-25' : 'lg:w-65'}
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
          <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
            {menuItems.map((group, groupIndex) => (
              <div key={groupIndex} className="flex flex-col gap-1">
                {group.items.map((item) => {
                  if (item.visible.includes(role)) {
                    const isRootPath = item.href === "/parent";
                    const isActive = isRootPath
                      ? location.pathname === item.href || location.pathname === "/parent"
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

export default ParentMenu;