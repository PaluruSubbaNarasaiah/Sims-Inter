// ReportsData.jsx - Andhra Pradesh Junior College Streams
export const GOOD_THRESHOLD = 80;
export const AVERAGE_THRESHOLD = 50;
export const EXCELLENT_THRESHOLD = 90;
export const FAIL_THRESHOLD = 30;

export const allPrograms = ['MPC', 'BiPC', 'CEC', 'MEC', 'HEC'];
export const allSemesters = [1, 2];

export const coursesConfig = {
  'Mathematics': { maxMarks: 100, passingMarks: 33 },
  'Physics': { maxMarks: 100, passingMarks: 33 },
  'Chemistry': { maxMarks: 100, passingMarks: 33 },
  'Biology': { maxMarks: 100, passingMarks: 33 },
  'Commerce': { maxMarks: 100, passingMarks: 33 },
  'Economics': { maxMarks: 100, passingMarks: 33 },
  'Civics': { maxMarks: 100, passingMarks: 33 },
  'History': { maxMarks: 100, passingMarks: 33 },
  'English': { maxMarks: 100, passingMarks: 33 },
  'Telugu': { maxMarks: 100, passingMarks: 33 },
};

export const students = [
  // MPC Students
  {
    id: 'MPC21001', name: 'Arjun Reddy', program: 'MPC', semester: 1, rollNo: 'MPC101',
    marks: { 'Mathematics': 92, 'Physics': 88, 'Chemistry': 85 }
  },
  {
    id: 'MPC21002', name: 'Priya Sharma', program: 'MPC', semester: 1, rollNo: 'MPC102',
    marks: { 'Mathematics': 85, 'Physics': 82, 'Chemistry': 78 }
  },
  {
    id: 'MPC21003', name: 'Vikram Rao', program: 'MPC', semester: 2, rollNo: 'MPC201',
    marks: { 'Mathematics': 75, 'Physics': 68, 'Chemistry': 72 }
  },
  {
    id: 'MPC21004', name: 'Ananya Gupta', program: 'MPC', semester: 2, rollNo: 'MPC202',
    marks: { 'Mathematics': 45, 'Physics': 35, 'Chemistry': 40 }
  },

  // BiPC Students
  {
    id: 'BiPC21001', name: 'Sneha Devi', program: 'BiPC', semester: 1, rollNo: 'BiPC101',
    marks: { 'Biology': 95, 'Chemistry': 90, 'Physics': 88 }
  },
  {
    id: 'BiPC21002', name: 'Divya Lakshmi', program: 'BiPC', semester: 1, rollNo: 'BiPC102',
    marks: { 'Biology': 82, 'Chemistry': 78, 'Physics': 85 }
  },
  {
    id: 'CEC21001', name: 'Karthik Nair', program: 'CEC', semester: 1, rollNo: 'CEC101',
    marks: { 'Commerce': 65, 'Economics': 72, 'Civics': 68 }
  },
  {
    id: 'CEC21002', name: 'Kavya Rao', program: 'CEC', semester: 2, rollNo: 'CEC201',
    marks: { 'Commerce': 55, 'Economics': 60, 'Civics': 58 }
  },

  // MEC Students
  {
    id: 'MEC21001', name: 'Rahul Gupta', program: 'MEC', semester: 1, rollNo: 'MEC101',
    marks: { 'Mathematics': 84, 'Economics': 89, 'Commerce': 81 }
  },
  {
    id: 'MEC21002', name: 'Meera Iyer', program: 'MEC', semester: 1, rollNo: 'MEC102',
    marks: { 'Mathematics': 70, 'Economics': 75, 'Commerce': 68 }
  },
  {
    id: 'HEC21001', name: 'Rohan Joshi', program: 'HEC', semester: 2, rollNo: 'HEC201',
    marks: { 'History': 70, 'Economics': 65, 'Civics': 75 }
  },
  {
    id: 'HEC21002', name: 'Sita Mahalakshmi', program: 'HEC', semester: 2, rollNo: 'HEC202',
    marks: { 'History': 50, 'Economics': 45, 'Civics': 48 }
  },
];

export const getStudentGradeCategory = (percentage) => {
  if (percentage >= EXCELLENT_THRESHOLD) {
    return 'Excellent';
  } else if (percentage >= GOOD_THRESHOLD) {
    return 'Good';
  } else if (percentage >= AVERAGE_THRESHOLD) {
    return 'Average';
  } else {
    return 'Poor';
  }
};