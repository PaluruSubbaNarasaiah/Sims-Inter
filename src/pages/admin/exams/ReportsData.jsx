// --- Constants for Grade Thresholds ---
export const GOOD_THRESHOLD = 70;    // Marks >= 70% (adjusted for intermediate level)
export const AVERAGE_THRESHOLD = 50; // Marks >= 50% and < 70%
export const POOR_THRESHOLD = 0;     // Marks < 50% (assuming marks can't be negative)

// --- Predefined Mock Data ---
const predefinedExams = [
  // 1st Year Exams
  { examId: 'EXM0101', examName: 'Mathematics I', class: '1st Year', subject: 'Mathematics', date: '2025-06-15', time: '10:00 AM', duration: 120, maxMarks: 100, status: 'Completed', roomNo: 'Hall A', examiner: 'Mr. Ahmad Khan' },
  { examId: 'EXM0102', examName: 'Physics I', class: '1st Year', subject: 'Physics', date: '2025-06-17', time: '10:00 AM', duration: 120, maxMarks: 100, status: 'Completed', roomNo: 'Hall B', examiner: 'Ms. Sarah Ahmed' },
  { examId: 'EXM0103', examName: 'Chemistry I', class: '1st Year', subject: 'Chemistry', date: '2025-06-19', time: '10:00 AM', duration: 120, maxMarks: 100, status: 'Completed', roomNo: 'Lab 1', examiner: 'Mr. Hassan Ali' },
  { examId: 'EXM0104', examName: 'Biology I', class: '1st Year', subject: 'Biology', date: '2025-06-21', time: '10:00 AM', duration: 120, maxMarks: 100, status: 'Completed', roomNo: 'Lab 2', examiner: 'Dr. Fatima Sheikh' },
  // 2nd Year Exams
  { examId: 'EXM0201', examName: 'Mathematics II', class: '2nd Year', subject: 'Mathematics', date: '2025-06-16', time: '10:00 AM', duration: 120, maxMarks: 100, status: 'Completed', roomNo: 'Hall A', examiner: 'Mr. Ahmad Khan' },
  { examId: 'EXM0202', examName: 'Physics II', class: '2nd Year', subject: 'Physics', date: '2025-06-18', time: '10:00 AM', duration: 120, maxMarks: 100, status: 'Completed', roomNo: 'Hall B', examiner: 'Ms. Sarah Ahmed' },
  { examId: 'EXM0203', examName: 'Chemistry II', class: '2nd Year', subject: 'Chemistry', date: '2025-06-20', time: '10:00 AM', duration: 120, maxMarks: 100, status: 'Completed', roomNo: 'Lab 1', examiner: 'Mr. Hassan Ali' },
  { examId: 'EXM0204', examName: 'Biology II', class: '2nd Year', subject: 'Biology', date: '2025-06-22', time: '10:00 AM', duration: 120, maxMarks: 100, status: 'Completed', roomNo: 'Lab 2', examiner: 'Dr. Fatima Sheikh' },
];

const predefinedStudents = [
  // 1st Year Students - Pre-Engineering
  { id: 'PE01001', name: 'Alice Johnson', class: '1st Year', section: 'Pre-Engineering', rollNo: 'PE2024001' },
  { id: 'PE01002', name: 'Bob Smith', class: '1st Year', section: 'Pre-Engineering', rollNo: 'PE2024002' },
  { id: 'PE01003', name: 'Carol Davis', class: '1st Year', section: 'Pre-Engineering', rollNo: 'PE2024003' },
  { id: 'PE01004', name: 'David Wilson', class: '1st Year', section: 'Pre-Engineering', rollNo: 'PE2024004' },
  { id: 'PE01005', name: 'Emma Brown', class: '1st Year', section: 'Pre-Engineering', rollNo: 'PE2024005' },
  // 1st Year Students - Pre-Medical
  { id: 'PM01001', name: 'Frank Miller', class: '1st Year', section: 'Pre-Medical', rollNo: 'PM2024001' },
  { id: 'PM01002', name: 'Grace Taylor', class: '1st Year', section: 'Pre-Medical', rollNo: 'PM2024002' },
  { id: 'PM01003', name: 'Henry Anderson', class: '1st Year', section: 'Pre-Medical', rollNo: 'PM2024003' },
  { id: 'PM01004', name: 'Ivy Thomas', class: '1st Year', section: 'Pre-Medical', rollNo: 'PM2024004' },
  { id: 'PM01005', name: 'Jack Martinez', class: '1st Year', section: 'Pre-Medical', rollNo: 'PM2024005' },
  // 2nd Year Students - Pre-Engineering
  { id: 'PE02001', name: 'Kate Garcia', class: '2nd Year', section: 'Pre-Engineering', rollNo: 'PE2023001' },
  { id: 'PE02002', name: 'Liam Rodriguez', class: '2nd Year', section: 'Pre-Engineering', rollNo: 'PE2023002' },
  { id: 'PE02003', name: 'Mia Lopez', class: '2nd Year', section: 'Pre-Engineering', rollNo: 'PE2023003' },
  { id: 'PE02004', name: 'Noah Lee', class: '2nd Year', section: 'Pre-Engineering', rollNo: 'PE2023004' },
  { id: 'PE02005', name: 'Olivia Walker', class: '2nd Year', section: 'Pre-Engineering', rollNo: 'PE2023005' },
  // 2nd Year Students - Pre-Medical
  { id: 'PM02001', name: 'Paul Hall', class: '2nd Year', section: 'Pre-Medical', rollNo: 'PM2023001' },
  { id: 'PM02002', name: 'Quinn Allen', class: '2nd Year', section: 'Pre-Medical', rollNo: 'PM2023002' },
  { id: 'PM02003', name: 'Ruby Young', class: '2nd Year', section: 'Pre-Medical', rollNo: 'PM2023003' },
  { id: 'PM02004', name: 'Sam King', class: '2nd Year', section: 'Pre-Medical', rollNo: 'PM2023004' },
  { id: 'PM02005', name: 'Tina Wright', class: '2nd Year', section: 'Pre-Medical', rollNo: 'PM2023005' },
];

const predefinedStudentGrades = [
  // 1st Year Pre-Engineering Students Grades
  { examId: 'EXM0101', studentId: 'PE01001', marks: 85 },
  { examId: 'EXM0102', studentId: 'PE01001', marks: 78 },
  { examId: 'EXM0103', studentId: 'PE01001', marks: 92 },
  { examId: 'EXM0101', studentId: 'PE01002', marks: 72 },
  { examId: 'EXM0102', studentId: 'PE01002', marks: 68 },
  { examId: 'EXM0103', studentId: 'PE01002', marks: 88 },
  { examId: 'EXM0101', studentId: 'PE01003', marks: 90 },
  { examId: 'EXM0102', studentId: 'PE01003', marks: 85 },
  { examId: 'EXM0103', studentId: 'PE01003', marks: 95 },
  { examId: 'EXM0101', studentId: 'PE01004', marks: 65 },
  { examId: 'EXM0102', studentId: 'PE01004', marks: 70 },
  { examId: 'EXM0103', studentId: 'PE01004', marks: 75 },
  { examId: 'EXM0101', studentId: 'PE01005', marks: 45 },
  { examId: 'EXM0102', studentId: 'PE01005', marks: 50 },
  { examId: 'EXM0103', studentId: 'PE01005', marks: 55 },
  // 1st Year Pre-Medical Students Grades
  { examId: 'EXM0101', studentId: 'PM01001', marks: 80 },
  { examId: 'EXM0104', studentId: 'PM01001', marks: 88 },
  { examId: 'EXM0103', studentId: 'PM01001', marks: 85 },
  { examId: 'EXM0101', studentId: 'PM01002', marks: 75 },
  { examId: 'EXM0104', studentId: 'PM01002', marks: 82 },
  { examId: 'EXM0103', studentId: 'PM01002', marks: 78 },
  { examId: 'EXM0101', studentId: 'PM01003', marks: 60 },
  { examId: 'EXM0104', studentId: 'PM01003', marks: 65 },
  { examId: 'EXM0103', studentId: 'PM01003', marks: 68 },
  { examId: 'EXM0101', studentId: 'PM01004', marks: 85 },
  { examId: 'EXM0104', studentId: 'PM01004', marks: 90 },
  { examId: 'EXM0103', studentId: 'PM01004', marks: 88 },
  { examId: 'EXM0101', studentId: 'PM01005', marks: 40 },
  { examId: 'EXM0104', studentId: 'PM01005', marks: 45 },
  { examId: 'EXM0103', studentId: 'PM01005', marks: 48 },
  // 2nd Year Pre-Engineering Students Grades
  { examId: 'EXM0201', studentId: 'PE02001', marks: 88 },
  { examId: 'EXM0202', studentId: 'PE02001', marks: 85 },
  { examId: 'EXM0203', studentId: 'PE02001', marks: 92 },
  { examId: 'EXM0201', studentId: 'PE02002', marks: 75 },
  { examId: 'EXM0202', studentId: 'PE02002', marks: 78 },
  { examId: 'EXM0203', studentId: 'PE02002', marks: 82 },
  { examId: 'EXM0201', studentId: 'PE02003', marks: 95 },
  { examId: 'EXM0202', studentId: 'PE02003', marks: 90 },
  { examId: 'EXM0203', studentId: 'PE02003', marks: 98 },
  { examId: 'EXM0201', studentId: 'PE02004', marks: 68 },
  { examId: 'EXM0202', studentId: 'PE02004', marks: 72 },
  { examId: 'EXM0203', studentId: 'PE02004', marks: 75 },
  { examId: 'EXM0201', studentId: 'PE02005', marks: 50 },
  { examId: 'EXM0202', studentId: 'PE02005', marks: 55 },
  { examId: 'EXM0203', studentId: 'PE02005', marks: 60 },
  // 2nd Year Pre-Medical Students Grades
  { examId: 'EXM0201', studentId: 'PM02001', marks: 82 },
  { examId: 'EXM0204', studentId: 'PM02001', marks: 88 },
  { examId: 'EXM0203', studentId: 'PM02001', marks: 85 },
  { examId: 'EXM0201', studentId: 'PM02002', marks: 78 },
  { examId: 'EXM0204', studentId: 'PM02002', marks: 85 },
  { examId: 'EXM0203', studentId: 'PM02002', marks: 80 },
  { examId: 'EXM0201', studentId: 'PM02003', marks: 65 },
  { examId: 'EXM0204', studentId: 'PM02003', marks: 70 },
  { examId: 'EXM0203', studentId: 'PM02003', marks: 68 },
  { examId: 'EXM0201', studentId: 'PM02004', marks: 90 },
  { examId: 'EXM0204', studentId: 'PM02004', marks: 95 },
  { examId: 'EXM0203', studentId: 'PM02004', marks: 92 },
  { examId: 'EXM0201', studentId: 'PM02005', marks: 45 },
  { examId: 'EXM0204', studentId: 'PM02005', marks: 48 },
  { examId: 'EXM0203', studentId: 'PM02005', marks: 50 },
];

// Function to generate random marks
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// No additional years needed for intermediate college (only 1st and 2nd year)

// Main export function
export const generateSchoolData = () => {
  return {
    allGeneratedExams: predefinedExams,
    allGeneratedStudents: predefinedStudents,
    allGeneratedGrades: predefinedStudentGrades
  };
};