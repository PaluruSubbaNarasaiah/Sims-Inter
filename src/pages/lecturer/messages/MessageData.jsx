// MessageData.jsx

const mockUsers = [
  // Faculty
  { id: 'F001', name: 'Dr. Lakshmi Devi', type: 'Faculty' },
  { id: 'F002', name: 'Prof. Rajesh Kumar', type: 'Faculty' },
  { id: 'F003', name: 'Dr. Priya Reddy', type: 'Faculty' },
  { id: 'F004', name: 'Prof. Suresh Babu', type: 'Faculty' },
  { id: 'F005', name: 'Dr. Kavitha Sharma', type: 'Faculty' },

  // Students
  { id: '2024MPC001', name: 'Arjun Reddy', type: 'Student' },
  { id: '2024BPC001', name: 'Priya Sharma', type: 'Student' },
  { id: '2024MEC001', name: 'Kiran Kumar', type: 'Student' },
  { id: '2024MPC002', name: 'Sneha Rao', type: 'Student' },
  { id: '2024BPC002', name: 'Rahul Chandra', type: 'Student' },
  { id: '2024CEC001', name: 'Vijay Krishna', type: 'Student' },
  { id: '2024HEC001', name: 'Lakshmi Devi', type: 'Student' },
  { id: '2024MEC002', name: 'Ravi Teja', type: 'Student' },

  // Parents
  { id: 'P201', name: 'Ramesh Reddy (Parent of 2024MPC001)', type: 'Parent' },
  { id: 'P202', name: 'Sunitha Sharma (Parent of 2024BPC001)', type: 'Parent' },
  { id: 'P203', name: 'Venkat Kumar (Parent of 2024MEC001)', type: 'Parent' },
  { id: 'P204', name: 'Madhavi Rao (Parent of 2024MPC002)', type: 'Parent' },
  { id: 'P205', name: 'Srinivas Chandra (Parent of 2024BPC002)', type: 'Parent' },
];

/**
 * Simulates fetching users based on a search query (ID or name).
 * Filters by 'lecturer', 'Student', or 'Parent' types.
 *
 * @param {string} query The search string.
 * @returns {Array} An array of user objects matching the query.
 */
export const fetchUsers = (query) => {
  if (!query) {
    // In a real app, you might return recently contacted users or a small sample.
    // For this mock, return a mix of types for initial suggestions.
    return mockUsers.filter(user => ['F001', '2023CSC001', 'P201'].includes(user.id));
  }
  const lowerCaseQuery = query.toLowerCase();
  return mockUsers.filter(user =>
    (user.id.toLowerCase().includes(lowerCaseQuery) ||
     user.name.toLowerCase().includes(lowerCaseQuery)) &&
    (user.type === 'Faculty' || user.type === 'Student' || user.type === 'Parent')
  );
};

/**
 * Simulates fetching a single user by their ID.
 *
 * @param {string} id The user ID to look up.
 * @returns {object|null} The user object if found, otherwise null.
 */
export const fetchUserById = (id) => {
  return mockUsers.find(user => user.id === id) || null;
};

export default mockUsers;