import { useState, useEffect } from "react";
import { role } from "../profile/ProfileContext"; // Assuming this context provides the user role
import { Link, useLocation } from "react-router-dom";
import SIMSLogo from '../../../assets/sims-logo.png';
import { FaTimes, FaBars } from "react-icons/fa";
import { menuItems } from './menuItems';

const Menu = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();
  // State for controlling the collapsed/expanded state of the desktop menu
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
          <div className="flex-1 overflow-y-auto p-3 scrollbar-hide"> {/* Added scrollbar-hide */}
            {menuItems.map((group, groupIndex) => (
              <div key={groupIndex} className="flex flex-col gap-1">
                {group.items.map((item) => {
                  // Check if the current user role has visibility for this menu item
                  if (item.visible.includes(role?.toLowerCase())) {
                    // Determine if the link is active based on the current URL
                    const isRootPath = item.href === "/admin";
                    const isActive = isRootPath
                      ? location.pathname === item.href || location.pathname === "/" // Matches /admin or /
                      : location.pathname.startsWith(item.href); // Matches /admin/lecturers for /admin/lecturers/add

                    return (
                      <Link
                        to={item.href}
                        key={item.label}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg
                          transition-all duration-300 ease-in-out /* Smooth transition for items */
                          ${isDesktopMenuCollapsed ? 'justify-center' : ''} /* Center icon when collapsed */
                          ${isActive
                            ? 'bg-blue-100 text-blue-700 font-medium border-l-4 border-blue-600' // Unique active style
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' // Normal and hover style
                          }
                          ${isDesktopMenuCollapsed ? 'py-3' : ''} /* Adjust padding when collapsed */
                        `}
                      >
                        <item.icon className="text-lg min-w-[24px]" />
                        {/* Hide label text when desktop menu is collapsed with a fade transition */}
                        {!isDesktopMenuCollapsed && (
                          <span className="transition-opacity duration-300 ease-in-out">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    );
                  }
                  return null; // Don't render item if not visible for the role
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;