import type {
  StudentProfile,
  AppSettings,
  Discussion,
  ChatMessage,
  AssignmentSubmission,
  AccentColor,
} from "@/types";
import { DEFAULT_DISCUSSIONS } from "./data";

const DEFAULT_PROFILE: StudentProfile = {
  fullName: "John Smith",
  studentId: "CS2025001",
  email: "john.smith@university.edu",
  phone: "+1 (555) 123-4567",
  major: "Computer Science",
  classYear: "2025",
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: "light",
  darkMode: false,
  accent: "#4cc9f0",
  notifications: {
    assignments: true,
    grades: true,
    messages: true,
    courses: true,
    discussions: true,
  },
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// ========== PROFILE ==========
export function getProfile(): StudentProfile {
  if (!isBrowser()) return DEFAULT_PROFILE;
  return {
    fullName:
      localStorage.getItem("profile-fullname") || DEFAULT_PROFILE.fullName,
    studentId:
      localStorage.getItem("profile-id") || DEFAULT_PROFILE.studentId,
    email: localStorage.getItem("profile-email") || DEFAULT_PROFILE.email,
    phone: localStorage.getItem("profile-phone") || DEFAULT_PROFILE.phone,
    major: localStorage.getItem("profile-major") || DEFAULT_PROFILE.major,
    classYear:
      localStorage.getItem("profile-classyear") || DEFAULT_PROFILE.classYear,
    avatarImg: localStorage.getItem("profile-avatar-img") || undefined,
  };
}

export function saveProfile(profile: Partial<StudentProfile>): void {
  if (!isBrowser()) return;
  if (profile.fullName !== undefined)
    localStorage.setItem("profile-fullname", profile.fullName);
  if (profile.studentId !== undefined)
    localStorage.setItem("profile-id", profile.studentId);
  if (profile.email !== undefined)
    localStorage.setItem("profile-email", profile.email);
  if (profile.phone !== undefined)
    localStorage.setItem("profile-phone", profile.phone);
  if (profile.major !== undefined)
    localStorage.setItem("profile-major", profile.major);
  if (profile.classYear !== undefined)
    localStorage.setItem("profile-classyear", profile.classYear);
  if (profile.avatarImg !== undefined) {
    if (profile.avatarImg) {
      localStorage.setItem("profile-avatar-img", profile.avatarImg);
    } else {
      localStorage.removeItem("profile-avatar-img");
    }
  }
}

export function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0][0] || "?").toUpperCase();
}

// ========== SETTINGS ==========
export function getSettings(): AppSettings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  return {
    theme:
      (localStorage.getItem("settings-theme") as AppSettings["theme"]) ||
      DEFAULT_SETTINGS.theme,
    darkMode: localStorage.getItem("settings-darkmode") === "true",
    accent:
      (localStorage.getItem("settings-accent") as AccentColor) ||
      DEFAULT_SETTINGS.accent,
    notifications: {
      assignments: localStorage.getItem("notif-assignments") !== "false",
      grades: localStorage.getItem("notif-grades") !== "false",
      messages: localStorage.getItem("notif-messages") !== "false",
      courses: localStorage.getItem("notif-courses") !== "false",
      discussions: localStorage.getItem("notif-discussions") !== "false",
    },
  };
}

export function saveSettings(settings: Partial<AppSettings>): void {
  if (!isBrowser()) return;
  if (settings.theme !== undefined)
    localStorage.setItem("settings-theme", settings.theme);
  if (settings.darkMode !== undefined)
    localStorage.setItem("settings-darkmode", String(settings.darkMode));
  if (settings.accent !== undefined)
    localStorage.setItem("settings-accent", settings.accent);
  if (settings.notifications) {
    const n = settings.notifications;
    if (n.assignments !== undefined)
      localStorage.setItem("notif-assignments", String(n.assignments));
    if (n.grades !== undefined)
      localStorage.setItem("notif-grades", String(n.grades));
    if (n.messages !== undefined)
      localStorage.setItem("notif-messages", String(n.messages));
    if (n.courses !== undefined)
      localStorage.setItem("notif-courses", String(n.courses));
    if (n.discussions !== undefined)
      localStorage.setItem("notif-discussions", String(n.discussions));
  }
}

// ========== DISCUSSIONS ==========
export function getDiscussions(): Discussion[] {
  if (!isBrowser()) return DEFAULT_DISCUSSIONS;
  const raw = localStorage.getItem("discussions");
  if (raw) {
    try {
      return JSON.parse(raw) as Discussion[];
    } catch {
      return DEFAULT_DISCUSSIONS;
    }
  }
  localStorage.setItem("discussions", JSON.stringify(DEFAULT_DISCUSSIONS));
  return DEFAULT_DISCUSSIONS;
}

export function saveDiscussions(discussions: Discussion[]): void {
  if (!isBrowser()) return;
  localStorage.setItem("discussions", JSON.stringify(discussions));
}

// ========== COURSE CHAT ==========
export function getChatMessages(courseName: string): ChatMessage[] {
  if (!isBrowser()) return [];
  const key = `course-chat-${encodeURIComponent(courseName)}`;
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw) as ChatMessage[];
    } catch {
      return [];
    }
  }
  return [];
}

export function saveChatMessages(
  courseName: string,
  messages: ChatMessage[]
): void {
  if (!isBrowser()) return;
  const key = `course-chat-${encodeURIComponent(courseName)}`;
  localStorage.setItem(key, JSON.stringify(messages));
}

// ========== ASSIGNMENT SUBMISSIONS ==========
export function getSubmission(
  assignmentId: string
): AssignmentSubmission | null {
  if (!isBrowser()) return null;
  const key = `assignment-submission-${encodeURIComponent(assignmentId)}`;
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw) as AssignmentSubmission;
    } catch {
      return null;
    }
  }
  return null;
}

export function saveSubmission(
  assignmentId: string,
  submission: AssignmentSubmission
): void {
  if (!isBrowser()) return;
  const key = `assignment-submission-${encodeURIComponent(assignmentId)}`;
  localStorage.setItem(key, JSON.stringify(submission));
}

export function deleteSubmission(assignmentId: string): void {
  if (!isBrowser()) return;
  const key = `assignment-submission-${encodeURIComponent(assignmentId)}`;
  localStorage.removeItem(key);
}

// ========== BOOKMARKS ==========
export function getBookmarks(): string[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem("course-bookmarks");
  if (raw) {
    try {
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  }
  return [];
}

export function toggleBookmark(courseId: string): boolean {
  if (!isBrowser()) return false;
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(courseId);
  if (idx > -1) {
    bookmarks.splice(idx, 1);
  } else {
    bookmarks.push(courseId);
  }
  localStorage.setItem("course-bookmarks", JSON.stringify(bookmarks));
  return bookmarks.includes(courseId);
}
