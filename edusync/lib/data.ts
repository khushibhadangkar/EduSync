import type {
  Course,
  Assignment,
  VideoLecture,
  Discussion,
  MCQTest,
  AccentColor,
  AccentTheme,
  NavItem,
} from "@/types";

// ========== ACCENT THEMES ==========
export const ACCENT_THEMES: Record<AccentColor, AccentTheme> = {
  "#4cc9f0": {
    primary: "#4361ee",
    primaryLight: "#4895ef",
    secondary: "#3f37c9",
    accent: "#4cc9f0",
    accentLightBg: "rgba(76, 201, 240, 0.13)",
  },
  "#f72585": {
    primary: "#f72585",
    primaryLight: "#ff80ab",
    secondary: "#b5179e",
    accent: "#f72585",
    accentLightBg: "rgba(247, 37, 133, 0.13)",
  },
  "#ff9800": {
    primary: "#ff9800",
    primaryLight: "#ffc107",
    secondary: "#ff5722",
    accent: "#ff9800",
    accentLightBg: "rgba(255, 152, 0, 0.13)",
  },
  "#43e97b": {
    primary: "#43e97b",
    primaryLight: "#38b000",
    secondary: "#008e5b",
    accent: "#43e97b",
    accentLightBg: "rgba(67, 233, 123, 0.13)",
  },
  "#7c3aed": {
    primary: "#7c3aed",
    primaryLight: "#a78bfa",
    secondary: "#5b21b6",
    accent: "#7c3aed",
    accentLightBg: "rgba(124, 58, 237, 0.13)",
  },
  "#ff6f61": {
    primary: "#ff6f61",
    primaryLight: "#ffb199",
    secondary: "#d7263d",
    accent: "#ff6f61",
    accentLightBg: "rgba(255, 111, 97, 0.13)",
  },
};

export const ACCENT_COLORS: AccentColor[] = [
  "#4cc9f0",
  "#f72585",
  "#ff9800",
  "#43e97b",
  "#7c3aed",
  "#ff6f61",
];

// ========== COURSES DATA ==========
export const COURSES: Course[] = [
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    instructor: "Dr. Johnson",
    instructorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    progress: 75,
    modulesCompleted: 12,
    totalModules: 16,
    nextTopic: "Sorting Algorithms",
    icon: "laptop-code",
    code: "CSC 301",
    credits: 3,
    grade: "A",
    gradeBadgeClass: "grade-a",
  },
  {
    id: "dbms",
    title: "Database Management Systems",
    instructor: "Prof. Chen",
    instructorAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
    progress: 60,
    modulesCompleted: 9,
    totalModules: 15,
    nextTopic: "SQL Joins",
    icon: "database",
    code: "CSC 315",
    credits: 3,
    grade: "B+",
    gradeBadgeClass: "grade-b-plus",
  },
  {
    id: "webdev",
    title: "Web Development",
    instructor: "Mr. Rodriguez",
    instructorAvatar: "https://randomuser.me/api/portraits/men/52.jpg",
    progress: 45,
    modulesCompleted: 7,
    totalModules: 16,
    nextTopic: "React Components",
    icon: "code",
    code: "CSC 350",
    credits: 3,
    grade: "A",
    gradeBadgeClass: "grade-a",
  },
];

export const INSTRUCTOR_AVATARS: Record<string, string> = {
  "Dr. Johnson": "https://randomuser.me/api/portraits/men/32.jpg",
  "Prof. Chen": "https://randomuser.me/api/portraits/men/45.jpg",
  "Mr. Rodriguez": "https://randomuser.me/api/portraits/men/52.jpg",
};

// ========== ASSIGNMENTS DATA ==========
export const ASSIGNMENTS: Assignment[] = [
  {
    id: "react-library",
    course: "Web Development",
    title: "React Component Library",
    description:
      "Create a reusable component library with at least 10 components.",
    status: "submitted",
    due: "",
    points: 120,
  },
  {
    id: "bst-impl",
    course: "Data Structures & Algorithms",
    title: "Binary Search Tree Implementation",
    description:
      "Implement a complete binary search tree with insertion, deletion, and traversal methods.",
    status: "overdue",
    due: "6/23/2025",
    points: 100,
  },
  {
    id: "db-design",
    course: "Database Management Systems",
    title: "Database Design Project",
    description:
      "Design and implement a normalized database schema for an e-commerce platform.",
    status: "pending",
    due: "6/28/2025",
    points: 150,
  },
];

// ========== VIDEO LECTURES DATA ==========
export const VIDEO_LECTURES: VideoLecture[] = [
  {
    id: "intro-react",
    title: "Introduction to React",
    instructor: "Dr. Johnson",
    duration: "42:18",
    tags: ["React", "Frontend"],
    desc: "Learn the basics of React, component structure, and state management in this comprehensive introduction.",
    thumb: "https://img.youtube.com/vi/2Ji-clqUYnA/mqdefault.jpg",
    url: "https://www.youtube.com/embed/2Ji-clqUYnA",
  },
  {
    id: "python-basics",
    title: "Python for Beginners",
    instructor: "Prof. Chen",
    duration: "55:10",
    tags: ["Python"],
    desc: "Start your Python journey with this beginner-friendly lecture covering syntax, variables, and loops.",
    thumb: "https://img.youtube.com/vi/_uQrJ0TkZlc/mqdefault.jpg",
    url: "https://www.youtube.com/embed/_uQrJ0TkZlc",
  },
  {
    id: "db-design",
    title: "Database Design Essentials",
    instructor: "Mr. Rodriguez",
    duration: "36:44",
    tags: ["Databases"],
    desc: "Understand relational databases, normalization, and schema design.",
    thumb: "https://img.youtube.com/vi/h0nxCDiD-zg/mqdefault.jpg",
    url: "https://www.youtube.com/embed/h0nxCDiD-zg",
  },
  {
    id: "ai-fundamentals",
    title: "AI Fundamentals",
    instructor: "Dr. Smith",
    duration: "48:22",
    tags: ["AI"],
    desc: "Explore the basics of artificial intelligence, machine learning, and neural networks.",
    thumb: "https://img.youtube.com/vi/aircAruvnKk/mqdefault.jpg",
    url: "https://www.youtube.com/embed/aircAruvnKk",
  },
  {
    id: "advanced-react",
    title: "Advanced React Patterns",
    instructor: "Dr. Johnson",
    duration: "39:05",
    tags: ["React", "Frontend"],
    desc: "Dive deeper into React with hooks, context, and advanced component patterns.",
    thumb: "https://img.youtube.com/vi/kK_Wqx3RnHk/mqdefault.jpg",
    url: "https://www.youtube.com/embed/kK_Wqx3RnHk",
  },
  {
    id: "sql-joins",
    title: "SQL Joins Explained",
    instructor: "Prof. Chen",
    duration: "29:18",
    tags: ["Databases"],
    desc: "Master SQL joins with clear examples and practical exercises.",
    thumb: "https://img.youtube.com/vi/9Pzj7Aj25lw/mqdefault.jpg",
    url: "https://www.youtube.com/embed/9Pzj7Aj25lw",
  },
];

// ========== DEFAULT DISCUSSIONS ==========
export const DEFAULT_DISCUSSIONS: Discussion[] = [
  {
    id: "1",
    title: "How to start the group project?",
    author: "Alice",
    tags: ["Project", "Help"],
    replies: [{ author: "Bob", content: "Let's meet on Friday!" }],
    lastActivity: "Today",
  },
  {
    id: "2",
    title: "Share your favorite resources",
    author: "Priya",
    tags: ["Resources"],
    replies: [{ author: "John", content: "Check out freecodecamp.org!" }],
    lastActivity: "Yesterday",
  },
];

// ========== MCQ TEST DATA ==========
export const SAMPLE_TEST: MCQTest = {
  title: "JavaScript Basics Quiz",
  teacher: "Ms. Parker",
  duration: 120,
  questions: [
    {
      q: "Which of the following is a valid way to declare a variable in JavaScript?",
      options: ["var myVar;", "let myVar;", "const myVar;", "All of the above"],
      answer: 3,
    },
    {
      q: "What is the output of: console.log(typeof null);",
      options: ['"object"', '"null"', '"undefined"', '"number"'],
      answer: 0,
    },
    {
      q: "Which method is used to parse a JSON string into a JavaScript object?",
      options: ["JSON.parse()", "JSON.stringify()", "parse.JSON()", "parse()"],
      answer: 0,
    },
    {
      q: 'What will this code output? console.log([1,2,3]+[4,5,6]);',
      options: [
        "[1,2,3,4,5,6]",
        '"1,2,34,5,6"',
        '"1,2,34,5,6"',
        '"1,2,34,5,6"',
      ],
      answer: 1,
    },
    {
      q: "Which of these is NOT a JavaScript data type?",
      options: ["Boolean", "Float", "Undefined", "Symbol"],
      answer: 1,
    },
  ],
};

// ========== NAV ITEMS ==========
export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "courses", label: "My Courses", icon: "book" },
  { id: "assignments", label: "Assignments", icon: "tasks" },
  { id: "tests", label: "Tests", icon: "file-alt" },
  { id: "grades", label: "Grades", icon: "chart-bar" },
  { id: "videos", label: "Video Lectures", icon: "video" },
  { id: "discussion", label: "Discussion", icon: "comments" },
  { id: "profile", label: "Profile", icon: "user" },
  { id: "settings", label: "Settings", icon: "cog" },
];

// ========== SEARCH DATA ==========
export const SEARCH_DATA = {
  courses: COURSES.map((c) => ({ title: c.title, tab: "courses" as const })),
  assignments: ASSIGNMENTS.map((a) => ({
    title: a.title,
    tab: "assignments" as const,
  })),
  grades: COURSES.map((c) => ({ title: c.title, tab: "grades" as const })),
};

// ========== AI CHATBOT RESPONSES ==========
export function getAIMockResponse(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("assignment"))
    return "To view or submit assignments, go to the Assignments tab. You can upload your work and check deadlines there.";
  if (m.includes("test") || m.includes("exam"))
    return "You can access your tests in the Tests tab. Click on a test to begin or review your results.";
  if (m.includes("profile"))
    return "You can view and edit your profile in the Profile tab. Click the Edit Profile button to update your info.";
  if (m.includes("grades") || m.includes("gpa"))
    return "Your grades and GPA are available in the Grades tab. You can also export your grade report.";
  if (m.includes("course"))
    return "All your enrolled courses are listed in the My Courses tab. Click a course for details and resources.";
  if (m.includes("video"))
    return "Video lectures are available in the Video Lectures tab. You can search and filter by topic.";
  if (m.includes("discussion"))
    return "Join community discussions in the Discussion tab. You can post new topics or reply to others.";
  if (m.includes("settings"))
    return "You can customize your experience in the Settings tab, including theme and notifications.";
  if (m.includes("hello") || m.includes("hi"))
    return "Hello! How can I help you with EduSync today?";
  return "I'm here to help you with anything related to EduSync. Try asking about assignments, courses, grades, or settings!";
}
