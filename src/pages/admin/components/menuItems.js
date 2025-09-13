import { FaSchool,FaChalkboard,FaUserGraduate,FaUsers,FaCreditCard,
  FaLandmark,FaBook,FaClipboardList,FaRegCalendarAlt,FaClipboardCheck,FaDesktop,
  FaChartBar,FaUserCheck,FaCalendarCheck,FaComments,FaBullhorn,FaQuestionCircle,
  FaLaptopCode,FaCalendarAlt,FaAddressCard} from "react-icons/fa";

export const menuItems = [
  {
    items: [
      { icon: FaSchool, label: "Home", href: "/admin", visible: ["admin", "lecturer", "student", "parent"], keywords: ["dashboard", "overview"] },
      { icon: FaChalkboard, label: "Lecturers", href: "/admin/lecturer", visible: ["admin", "lecturer"], keywords: ["lecturers", "staff", "educators"] },
      { icon: FaAddressCard, label: "Admissions", href: "/admin/admissions", visible: ["admin", "lecturer"], keywords: ["admission", "users"] },
      { icon: FaUserGraduate, label: "Students", href: "/admin/students", visible: ["admin", "lecturer"], keywords: ["pupils", "learners"] },
      { icon: FaUsers, label: "Parents", href: "/admin/parents", visible: ["admin", "lecturer"], keywords: ["guardians", "family"] },
      { icon: FaCreditCard, label: "Fee", href: "/admin/fee", visible: ["admin"], keywords: ["payments", "dues", "tuition"] },
      { icon: FaLandmark, label: "Bank", href: "/admin/bank", visible: ["admin"], keywords: ["accounts", "transactions", "finance"] },
      { icon: FaBook, label: "Subjects", href: "/admin/subjects", visible: ["admin"], keywords: ["subjects", "curriculum"] },
      { icon: FaLaptopCode, label: "Classes", href: "/admin/classes", visible: ["admin", "lecturer"], keywords: ["sections", "years"] },
      { icon: FaClipboardList, label: "Exam Reports", href: "/admin/exams", visible: ["admin", "lecturer", "student", "parent"], keywords: ["tests", "assessments", "grades", "results"] },
      { icon: FaRegCalendarAlt, label: "Schedules", href: "/admin/schedules", visible: ["admin", "lecturer", "student", "parent"], keywords: ["timetables", "calendar", "daily plan"] },
      { icon: FaClipboardCheck, label: "Assignments", href: "/admin/assignments", visible: ["admin", "lecturer", "student", "parent"], keywords: ["homework", "tasks", "projects"] },
      { icon: FaDesktop, label: "Library", href: "/admin/library", visible: ["admin", "lecturer", "student", "parent"], keywords: ["books", "resources", "reading"] },
      { icon: FaChartBar, label: "Results", href: "/admin/results", visible: ["admin", "lecturer", "student", "parent"], keywords: ["scores", "performance", "outcomes"] },
      { icon: FaUserCheck, label: "Attendance", href: "/admin/attendance", visible: ["admin", "lecturer","parent"], keywords: ["presence", "absent", "roll call"] },
      { icon: FaCalendarAlt, label: "Leaves", href: "/admin/leaves", visible: ["admin", "lecturer", "student", "parent"], keywords: ["absences", "vacation", "holiday"] },
      { icon: FaCalendarCheck, label: "Events", href: "/admin/events", visible: ["admin", "lecturer", "student", "parent"], keywords: ["activities", "functions", "gatherings"] },
      { icon: FaComments, label: "Messages", href: "/admin/messages", visible: ["admin", "lecturer", "student", "parent"], keywords: ["chats", "communications", "inbox"] },
      { icon: FaBullhorn, label: "Announcements", href: "/admin/announcements", visible: ["admin", "lecturer", "student", "parent"], keywords: ["notices", "alerts", "news"] },
      { icon: FaQuestionCircle, label: "Help", href: "/admin/help", visible: ["admin", "lecturer", "student", "parent"], keywords: ["support", "faq", "guidance"] },
    ],
  },
];