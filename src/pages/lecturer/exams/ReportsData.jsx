// ReportsData.jsx

export const GOOD_THRESHOLD = 80;
export const AVERAGE_THRESHOLD = 50;
export const POOR_THRESHOLD = 0; // Keeping this as 0, as percentages below AVERAGE_THRESHOLD will fall here
export const FAIL_THRESHOLD = 30; // New threshold for a more explicit 'Fail' or 'Very Poor' within 'Poor'

export const lecturerClasses = ['MPC Year 1', 'BiPC Year 1', 'MEC Year 1'];

// Subject configuration with max marks (initial values).
// This will be treated as the default if no updates are made.
export const subjectsConfig = {
  'Mathematics': { maxMarks: 100 },
  'Physics': { maxMarks: 100 },
  'Chemistry': { maxMarks: 100 },
  'Biology': { maxMarks: 100 },
  'Economics': { maxMarks: 80 },
  'Commerce': { maxMarks: 80 },
  'Civics': { maxMarks: 70 },
  'History': { maxMarks: 70 },
  'English': { maxMarks: 70 }
};

export const students = [
  {
    id: 'S001',
    name: 'Arjun Reddy',
    class: 'MPC Year 1',
    section: 'A',
    rollNo: '2024MPC001',
    marks: {
      'Mathematics': 85,
      'Physics': 86,
      'Chemistry': 76,
      'English': 58
    }
  },
  {
    id: 'S002',
    name: 'Priya Sharma',
    class: 'BiPC Year 1',
    section: 'A',
    rollNo: '2024BPC001',
    marks: {
      'Biology': 82,
      'Physics': 79,
      'Chemistry': 75,
      'English': 65
    }
  },
  {
    id: 'S003',
    name: 'Kiran Kumar',
    class: 'MEC Year 1',
    section: 'A',
    rollNo: '2024MEC001',
    marks: {
      'Mathematics': 78,
      'Economics': 84,
      'Commerce': 72,
      'English': 61
    }
  },
  {
    id: 'S004',
    name: 'Sneha Rao',
    class: 'MPC Year 1',
    section: 'B',
    rollNo: '2024MPC002',
    marks: {
      'Mathematics': 68,
      'Physics': 72,
      'Chemistry': 69,
      'English': 55
    }
  },
  {
    id: 'S005',
    name: 'Rahul Chandra',
    class: 'BiPC Year 1',
    section: 'B',
    rollNo: '2024BPC002',
    marks: {
      'Biology': 74,
      'Physics': 71,
      'Chemistry': 77,
      'English': 62
    }
  },
  {
    id: 'S006',
    name: 'Vikram',
    class: 'CEC Year 1',
    section: 'A',
    rollNo: '2024CEC001',
    marks: {
      'Commerce': 71,
      'Economics': 43,
      'Civics': 81,
      'English': 54
    }
  },
  {
    id: 'S007',
    name: 'Divya',
    class: 'HEC Year 1',
    section: 'A',
    rollNo: '2024HEC001',
    marks: {
      'History': 77,
      'Economics': 48,
      'Civics': 87,
      'English': 60
    }
  },
  {
    id: 'S008',
    name: 'Aditya',
    class: 'MPC Year 1',
    section: 'C',
    rollNo: '2024MPC003',
    marks: {
      'Mathematics': 28,
      'Physics': 21,
      'Chemistry': 25,
      'English': 29
    }
  },
  {
    id: 'S009',
    name: 'Meera',
    class: 'BiPC Year 1',
    section: 'C',
    rollNo: '2024BPC003',
    marks: {
      'Biology': 75,
      'Physics': 46,
      'Chemistry': 85,
      'English': 59
    }
  },
  {
    id: 'S010',
    name: 'Karan',
    class: 'MEC Year 1',
    section: 'B',
    rollNo: '2024MEC002',
    marks: {
      'Mathematics': 73,
      'Economics': 44,
      'Commerce': 83,
      'English': 56
    }
  },
  {
    id: 'S011',
    name: 'Ishita',
    class: 'CEC Year 1',
    section: 'B',
    rollNo: '2024CEC002',
    marks: {
      'Commerce': 78,
      'Economics': 50,
      'Civics': 88,
      'English': 62
    }
  },
  {
    id: 'S012',
    name: 'Rohan',
    class: 'MPC Year 1',
    section: 'C',
    rollNo: '2024MPC004',
    marks: {
      'Mathematics': 29,
      'Physics': 26,
      'Chemistry': 19,
      'English': 25
    }
  },
  {
    id: 'S013',
    name: 'Neha',
    class: 'BiPC Year 1',
    section: 'C',
    rollNo: '2024BPC004',
    marks: {
      'Biology': 74,
      'Physics': 47,
      'Chemistry': 84,
      'English': 58
    }
  },
  {
    id: 'S014',
    name: 'Aryan',
    class: 'MEC Year 1',
    section: 'B',
    rollNo: '2024MEC003',
    marks: {
      'Mathematics': 72,
      'Economics': 43,
      'Commerce': 82,
      'English': 55
    }
  },
  {
    id: 'S015',
    name: 'Tanvi',
    class: 'HEC Year 1',
    section: 'B',
    rollNo: '2024HEC002',
    marks: {
      'History': 76,
      'Economics': 49,
      'Civics': 86,
      'English': 60
    }
  },
  {
    id: 'S016',
    name: 'Siddharth',
    class: 'MPC Year 2',
    section: 'A',
    rollNo: '2023MPC001',
    marks: {
      'Mathematics': 71,
      'Physics': 42,
      'Chemistry': 81,
      'English': 54
    }
  },
  {
    id: 'S017',
    name: 'Pooja',
    class: 'BiPC Year 2',
    section: 'A',
    rollNo: '2023BPC001',
    marks: {
      'Biology': 75,
      'Physics': 48,
      'Chemistry': 85,
      'English': 59
    }
  },
  {
    id: 'S018',
    name: 'Vivek',
    class: 'CEC Year 2',
    section: 'A',
    rollNo: '2023CEC001',
    marks: {
      'Commerce': 73,
      'Economics': 45,
      'Civics': 83,
      'English': 57
    }
  },
  {
    id: 'S019',
    name: 'Shreya',
    class: 'MEC Year 2',
    section: 'A',
    rollNo: '2023MEC001',
    marks: {
      'Mathematics': 77,
      'Economics': 50,
      'Commerce': 87,
      'English': 61
    }
  },
  {
    id: 'S020',
    name: 'Raj',
    class: 'HEC Year 2',
    section: 'A',
    rollNo: '2023HEC001',
    marks: {
      'History': 70,
      'Economics': 41,
      'Civics': 80,
      'English': 53
    }
  }
];

// Simplified exams data (This will now also depend on the currentSubjectsConfig)
// We will move the generation of 'exams' inside components that use it, or adjust it based on currentSubjectsConfig
// For now, let's keep a placeholder here, but ExamModule will derive its `exams` dynamically.
export const exams = Object.keys(subjectsConfig).map((subject, index) => ({
  examId: `EXM${String(index + 1).padStart(3, '0')}`,
  examName: `${subject} Exam`,
  subject: subject,
  maxMarks: subjectsConfig[subject].maxMarks, // This will be dynamic from the state in ExamModule
  status: 'Completed'
}));


export const getStudentGradeCategory = (percentage) => {
  if (percentage >= GOOD_THRESHOLD) return 'Good';
  // If a specific FAIL_THRESHOLD is desired within 'Poor' for a clearer distinction,
  // you can uncomment and adjust the following line, and potentially the categories.
  if (percentage < FAIL_THRESHOLD) return 'Poor'; // If percentage is below FAIL_THRESHOLD, it's 'Poor' (or 'Fail')
  if (percentage >= AVERAGE_THRESHOLD) return 'Average';
  return 'Poor'; // Any percentage below AVERAGE_THRESHOLD (that isn't already 'Good')
};


// Modify getClassReportData to accept students AND subjectsConfig as parameters
export const getClassReportData = (className, currentStudents, currentSubjectsConfig) => {
  // Use currentStudents instead of the globally imported 'students'
  const classStudents = currentStudents.filter(student => student.class === className);

  // Generate classExams dynamically based on the provided currentSubjectsConfig
  const classExams = Object.keys(currentSubjectsConfig).map(subject => ({
    subject: subject,
    maxMarks: currentSubjectsConfig[subject].maxMarks,
    // You might need other exam properties, add them if necessary
  }));

  const sections = Array.from(new Set(classStudents.map(s => s.section))).sort();
  const subjects = Array.from(new Set(classExams.map(e => e.subject))).sort();

  // Section Summary
  const sectionSummary = sections.map(section => {
    const studentsInSection = classStudents.filter(s => s.section === section);
    let studentsGradedCount = 0;
    let goodCount = 0;
    let averageCount = 0;
    let poorCount = 0;

    studentsInSection.forEach(student => {
      let studentOverallMarks = 0;
      let studentOverallMaxMarks = 0;
      let studentExamsAttempted = 0;

      Object.entries(student.marks).forEach(([subject, marks]) => {
        const exam = classExams.find(e => e.subject === subject);
        if (exam) {
          studentOverallMarks += marks;
          studentOverallMaxMarks += exam.maxMarks;
          studentExamsAttempted++;
        }
      });

      if (studentExamsAttempted > 0) {
        studentsGradedCount++;
        const percentage = (studentOverallMarks / studentOverallMaxMarks) * 100;
        const category = getStudentGradeCategory(percentage);
        if (category === 'Good') goodCount++;
        else if (category === 'Average') averageCount++;
        else poorCount++;
      }
    });

    const totalStudentsConsidered = goodCount + averageCount + poorCount;
    // Recalculate average percentage based on actual counts and thresholds
    const avgPercentage = totalStudentsConsidered > 0 ?
      ((goodCount * 100 + averageCount * 70 + poorCount * 25) / totalStudentsConsidered) : 0; // Using mid-points for illustration

    return {
      section: section,
      totalStudents: studentsInSection.length,
      studentsGraded: studentsGradedCount,
      averagePercentage: avgPercentage.toFixed(2),
      good: goodCount,
      average: averageCount,
      poor: poorCount
    };
  });

  // Subject Performance
  const subjectPerformance = subjects.map(subject => {
    let goodCount = 0;
    let averageCount = 0;
    let poorCount = 0;
    let totalStudentsWithGradesForSubject = 0;

    classStudents.forEach(student => {
      const marks = student.marks[subject];
      const exam = classExams.find(e => e.subject === subject); // Find the exam based on currentSubjectsConfig
      if (marks !== undefined && exam) { // Ensure marks exist and exam config is found
        totalStudentsWithGradesForSubject++;
        const percentage = (marks / exam.maxMarks) * 100;
        const category = getStudentGradeCategory(percentage);
        if (category === 'Good') goodCount++;
        else if (category === 'Average') averageCount++;
        else poorCount++;
      }
    });

    return {
      subject: subject,
      good: goodCount,
      average: averageCount,
      poor: poorCount,
      totalGradedStudents: totalStudentsWithGradesForSubject
    };
  });

  // Overall Class Performance for Pie Chart
  const overallClassGrades = { Good: 0, Average: 0, Poor: 0 };
  let totalStudentsConsideredForOverall = 0;

  classStudents.forEach(student => {
    let studentOverallMarks = 0;
    let studentOverallMaxMarks = 0;
    let studentExamsAttempted = 0;

    Object.entries(student.marks).forEach(([subject, marks]) => {
      const exam = classExams.find(e => e.subject === subject);
      if (exam) {
        studentOverallMarks += marks;
        studentOverallMaxMarks += exam.maxMarks;
        studentExamsAttempted++;
      }
    });

    if (studentExamsAttempted > 0) {
      totalStudentsConsideredForOverall++;
      const percentage = (studentOverallMarks / studentOverallMaxMarks) * 100;
      const category = getStudentGradeCategory(percentage);
      overallClassGrades[category]++;
    }
  });

  const overallClassChartData = [
    { name: 'Good', value: overallClassGrades.Good, color: '#22C55E' },
    { name: 'Average', value: overallClassGrades.Average, color: '#EAB308' },
    { name: 'Poor', value: overallClassGrades.Poor, color: '#EF4444' },
  ].filter(data => data.value > 0);

  return {
    sectionSummary,
    subjectPerformance,
    overallClassChartData,
    totalStudentsConsideredForOverall
  };
};

// We don't export getCompletedExams directly anymore, as exam max marks are dynamic
// based on currentSubjectsConfig.