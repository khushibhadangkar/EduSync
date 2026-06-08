// ========== THEME TYPES ==========
export type ThemeMode = "dark" | "light";

export type AccentColor =
  | "#4cc9f0"
  | "#f72585"
  | "#ff9800"
  | "#43e97b"
  | "#7c3aed"
  | "#ff6f61";

export interface AccentTheme {
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  accentLightBg: string;
}

// ========== PROFILE TYPES ==========
export interface StudentProfile {
  fullName: string;
  studentId: string;
  email: string;
  phone: string;
  major: string;
  classYear: string;
  avatarImg?: string;
}

// ========== COURSE TYPES ==========
export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  progress: number;
  modulesCompleted: number;
  totalModules: number;
  nextTopic: string;
  icon: string;
  code?: string;
  credits?: number;
  grade?: string;
  gradeBadgeClass?: string;
}

// ========== ASSIGNMENT TYPES ==========
export type AssignmentStatus = "submitted" | "overdue" | "pending";

export interface Assignment {
  id: string;
  course: string;
  title: string;
  description: string;
  status: AssignmentStatus;
  due: string;
  points: number;
}

export interface AssignmentSubmission {
  name: string;
  data: string;
  type: string;
}

// ========== VIDEO TYPES ==========
export interface VideoLecture {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  tags: string[];
  desc: string;
  thumb: string;
  url: string;
}

// ========== DISCUSSION TYPES ==========
export interface DiscussionReply {
  author: string;
  content: string;
}

export interface Discussion {
  id: string;
  title: string;
  author: string;
  tags: string[];
  replies: DiscussionReply[];
  lastActivity: string;
}

// ========== CHAT TYPES ==========
export interface ChatMessage {
  id: number;
  author: string;
  text: string;
  timestamp: string;
  isInstructor: boolean;
}

// ========== NOTIFICATION SETTINGS ==========
export interface NotificationSettings {
  assignments: boolean;
  grades: boolean;
  messages: boolean;
  courses: boolean;
  discussions: boolean;
}

// ========== APP SETTINGS ==========
export interface AppSettings {
  theme: ThemeMode;
  darkMode: boolean;
  accent: AccentColor;
  notifications: NotificationSettings;
}

// ========== MCQ TEST TYPES ==========
export interface TestQuestion {
  q: string;
  options: string[];
  answer: number;
}

export interface MCQTest {
  title: string;
  teacher: string;
  duration: number;
  questions: TestQuestion[];
}

export interface TestState {
  started: boolean;
  finished: boolean;
  answers: (number | undefined)[];
  timeLeft: number;
  current: number;
}

// ========== NAV TYPES ==========
export type TabId =
  | "dashboard"
  | "courses"
  | "assignments"
  | "tests"
  | "grades"
  | "videos"
  | "discussion"
  | "profile"
  | "settings";

export interface NavItem {
  id: TabId;
  label: string;
  icon: string;
  href?: string;
  external?: boolean;
}
