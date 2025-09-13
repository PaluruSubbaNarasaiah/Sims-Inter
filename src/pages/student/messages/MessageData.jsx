// MessageData.jsx

const mockUsers = [
  // Faculty
  { id: 'F001', name: 'Dr. Ramesh Kumar', type: 'lecturer' },
  { id: 'F002', name: 'Prof. Lakshmi Devi', type: 'lecturer' },
  { id: 'F003', name: 'Mr. Suresh Babu', type: 'lecturer' },
  { id: 'F004', name: 'Mrs. Priya Sharma', type: 'lecturer' },
  { id: 'F005', name: 'Dr. Venkat Rao', type: 'lecturer' },

  // Students
  { id: 'S101', name: 'Arjun Reddy', type: 'Student' },
  { id: 'S102', name: 'Priya Nair', type: 'Student' },
  { id: 'S103', name: 'Kiran Kumar', type: 'Student' },
  { id: 'S104', name: 'Sneha Patel', type: 'Student' },
  { id: 'S105', name: 'Rahul Sharma', type: 'Student' },
  { id: 'S106', name: 'Divya Krishna', type: 'Student' },

];

/**
 * Simulates fetching users based on a search query (ID or name).
 * For the student panel, it only returns 'lecturer' or 'Student' types.
 *
 * @param {string} query The search string.
 * @returns {Array} An array of user objects matching the query and allowed types.
 */
export const fetchUsers = (query) => {
  const allowedTypes = ['lecturer', 'Student']; // Students can only message lecturer and other students

  if (!query) {
    // Return a small sample of allowed types for initial suggestions
    return mockUsers.filter(user => allowedTypes.includes(user.type)).slice(0, 5);
  }
  const lowerCaseQuery = query.toLowerCase();
  return mockUsers.filter(user =>
    (user.id.toLowerCase().includes(lowerCaseQuery) ||
     user.name.toLowerCase().includes(lowerCaseQuery)) &&
    allowedTypes.includes(user.type) // Filter by allowed types
  );
};

/**
 * Simulates fetching a single user by their ID.
 *
 * @param {string} id The user ID to look up.
 * @returns {object|null} The user object if found, otherwise null.
 */
export const fetchUserById = (id) => {
  const allowedTypes = ['lecturer', 'Student']; // Students can only message lecturer and other students
  const user = mockUsers.find(u => u.id === id);
  return user && allowedTypes.includes(user.type) ? user : null; // Return null if type is not allowed
};

export default mockUsers;