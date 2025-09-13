// superadmin/SuperAdminPage.jsx
import React, { useState, useEffect } from 'react';
// import { LogOut } from 'lucide-react'; // No longer needed directly here
import AddAdmin from './AddAdmin';
import AdminList from './AdminList';

const SuperAdminPage = () => {
  // State for the list of admins - central state management
  const [admins, setAdmins] = useState([]);

  // Utility function: Calculate renewal date based on plan type
  const calculateRenewalDate = (planType) => {
    const today = new Date(); // This is the 'renewed date' if called at the time of renewal
    const renewalDate = new Date(today);

    if (planType === 'monthly') {
      renewalDate.setDate(renewalDate.getDate() + 30); // Add 30 days for monthly
    } else {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1); // Add one year for yearly
    }

    return renewalDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Utility function: Check if a plan is expired
  const isPlanExpired = (renewalDate) => {
    const today = new Date();
    const renewal = new Date(renewalDate);
    // Set both dates to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    renewal.setHours(0, 0, 0, 0);
    return renewal.getTime() < today.getTime();
  };

  // Utility function: Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Mock Data for initial load
  useEffect(() => {
    const mockAdmins = [
      {
        id: 1,
        collegeName: 'Springfield Elementary',
        email: 'principal.springfield@example.com',
        userId: 'springfield_admin',
        password: 'password123',
        contactNumber: '9876543210', // Added contact number
        status: true,
        createdAt: '2024-01-15',
        planType: 'yearly',
        renewalDate: '2025-01-15',
        profileImage: '/avatar.png'
      },
      {
        id: 2,
        collegeName: 'Riverdale High College',
        email: 'head.riverdale@example.com',
        userId: 'riverdale_admin',
        password: 'password456',
        contactNumber: '9123456789', // Added contact number
        status: true,
        createdAt: '2024-03-01',
        planType: 'monthly',
        renewalDate: '2024-04-01', // Expired
        profileImage: null
      },
      {
        id: 3,
        collegeName: 'Oakwood Academy',
        email: 'info.oakwood@example.com',
        userId: 'oakwood_coord',
        password: 'password789',
        contactNumber: '9988776655', // Added contact number
        status: true,
        createdAt: '2024-06-10',
        planType: 'yearly',
        renewalDate: '2025-06-10',
        profileImage: null // No image
      },
      {
        id: 4,
        collegeName: 'Maplewood Prep',
        email: 'admissions.maple@example.com',
        userId: 'maple_lead',
        password: 'securepassword',
        contactNumber: '9000111222', // Added contact number
        status: true,
        createdAt: '2024-05-01',
        planType: 'monthly',
        renewalDate: '2025-05-31', // Expired as of July 2, 2025
        profileImage: '/avatar.png' // Default image
      }
    ];

    // Update the 'status' based on 'renewalDate' for mock data
    const updatedMockAdmins = mockAdmins.map(admin => ({
        ...admin,
        // Set status to false if expired, UNLESS there's a specific manual override to keep it true.
        // For initial mock data, we'll just set it based on expiry.
        status: !isPlanExpired(admin.renewalDate)
    }));
    setAdmins(updatedMockAdmins);
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">


      <div className="max-w-8xl mx-auto p-4 md:p-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all college admin accounts</p>
          </div>
        </div>

        {/* Add New Admin Section */}
        <AddAdmin
          admins={admins} // Pass admins to check for duplicates
          setAdmins={setAdmins}
          calculateRenewalDate={calculateRenewalDate}
        />

        {/* Admin List Section */}
        <AdminList
          admins={admins} // Pass admins to display
          setAdmins={setAdmins} // Pass setAdmins for updates (delete, edit)
          calculateRenewalDate={calculateRenewalDate} // For plan renewal in edit mode
          isPlanExpired={isPlanExpired} // For displaying expired status
          formatDate={formatDate} // For consistent date formatting
        />
      </div>
    </div>
  );
};

export default SuperAdminPage;