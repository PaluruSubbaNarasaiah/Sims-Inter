// MessageData.jsx

const mockUsers = [
  // Lecturers
  { id: 'L001', name: 'Dr. Alice Smith', type: 'Lecturer' },
  { id: 'L002', name: 'Prof. Bob Johnson', type: 'Lecturer' },
  { id: 'L003', name: 'Dr. Carol White', type: 'Lecturer' },

  // Students
  { id: 'S101', name: 'David Lee', type: 'Student' },
  { id: 'S102', name: 'Eva Green', type: 'Student' },
  { id: 'S103', name: 'Frank Black', type: 'Student' },

  // Parents
  { id: 'P201', name: 'Grace Hall', type: 'Parent' },
  { id: 'P202', name: 'Henry King', type: 'Parent' },

];

/**
 * Simulates fetching users based on a search query or by ID.
 * In a real application, this would be an API call to your backend.
 *
 * @param {string} query The search string (can be an ID or part of a name).
 * @returns {Array} An array of user objects matching the query.
 */
export const fetchUsers = (query) => {
  if (!query) {
    // If no query, return a small sample or common contacts.
    // For this mock, we'll return all users, but in real app, you'd limit.
    return mockUsers.slice(0, 5);
  }
  const lowerCaseQuery = query.toLowerCase();
  return mockUsers.filter(user =>
    user.id.toLowerCase().includes(lowerCaseQuery) ||
    user.name.toLowerCase().includes(lowerCaseQuery)
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

// Export the mock users array itself if needed elsewhere, though fetchUsers is generally better
export default mockUsers;