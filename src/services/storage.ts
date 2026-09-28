import { Student, ViolationRecord, AchievementRecord, SystemNotification, WeeklyReportData, SubjectInfo, UserRole } from '../types';
import { INITIAL_STUDENTS, INITIAL_VIOLATIONS, INITIAL_ACHIEVEMENTS, INITIAL_NOTIFICATIONS, INITIAL_WEEKLY_REPORT, INITIAL_SUBJECTS } from '../data/mockData';

const KEYS = {
  STUDENTS: 'ql8a2_students',
  VIOLATIONS: 'ql8a2_violations',
  ACHIEVEMENTS: 'ql8a2_achievements',
  NOTIFICATIONS: 'ql8a2_notifications',
  WEEKLY_REPORT: 'ql8a2_weekly_report',
  SUBJECTS: 'ql8a2_subjects',
  CURRENT_ROLE: 'ql8a2_current_role',
  CURRENT_WEEK: 'ql8a2_current_week',
  CURRENT_PERIOD: 'ql8a2_current_period',
};

export const storageService = {
  // Students
  getStudents: (): Student[] => {
    try {
      const data = localStorage.getItem(KEYS.STUDENTS);
      if (!data) {
        localStorage.setItem(KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
        return INITIAL_STUDENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  saveStudents: (students: Student[]) => {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
  },

  addStudent: (student: Omit<Student, 'id'>): Student => {
    const students = storageService.getStudents();
    const newStudent: Student = {
      ...student,
      id: `hs-${Date.now()}`,
    };
    students.unshift(newStudent);
    storageService.saveStudents(students);
    return newStudent;
  },

  updateStudent: (student: Student) => {
    const students = storageService.getStudents();
    const index = students.findIndex((s) => s.id === student.id);
    if (index !== -1) {
      students[index] = student;
      storageService.saveStudents(students);
    }
  },

  deleteStudent: (id: string) => {
    const students = storageService.getStudents().filter((s) => s.id !== id);
    storageService.saveStudents(students);
  },

  deleteMultipleStudents: (ids: string[]) => {
    const idSet = new Set(ids);
    const students = storageService.getStudents().filter((s) => !idSet.has(s.id));
    storageService.saveStudents(students);
  },

  deleteAllStudents: () => {
    storageService.saveStudents([]);
  },

  // Violations
  getViolations: (): ViolationRecord[] => {
    try {
      const data = localStorage.getItem(KEYS.VIOLATIONS);
      if (!data) {
        localStorage.setItem(KEYS.VIOLATIONS, JSON.stringify(INITIAL_VIOLATIONS));
        return INITIAL_VIOLATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_VIOLATIONS;
    }
  },

  addViolation: (violation: Omit<ViolationRecord, 'id'>) => {
    const list = storageService.getViolations();
    const item: ViolationRecord = {
      ...violation,
      id: `v-${Date.now()}`,
    };
    list.unshift(item);
    localStorage.setItem(KEYS.VIOLATIONS, JSON.stringify(list));
    return item;
  },

  updateViolation: (violation: ViolationRecord) => {
    const list = storageService.getViolations();
    const index = list.findIndex((v) => v.id === violation.id);
    if (index !== -1) {
      list[index] = violation;
      localStorage.setItem(KEYS.VIOLATIONS, JSON.stringify(list));
    }
  },

  deleteViolation: (id: string) => {
    const list = storageService.getViolations().filter((v) => v.id !== id);
    localStorage.setItem(KEYS.VIOLATIONS, JSON.stringify(list));
  },

  // Achievements
  getAchievements: (): AchievementRecord[] => {
    try {
      const data = localStorage.getItem(KEYS.ACHIEVEMENTS);
      if (!data) {
        localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(INITIAL_ACHIEVEMENTS));
        return INITIAL_ACHIEVEMENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  },

  addAchievement: (record: Omit<AchievementRecord, 'id'>) => {
    const list = storageService.getAchievements();
    const item: AchievementRecord = {
      ...record,
      id: `ach-${Date.now()}`,
    };
    list.unshift(item);
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(list));
    return item;
  },

  deleteAchievement: (id: string) => {
    const list = storageService.getAchievements().filter((a) => a.id !== id);
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(list));
  },

  // Notifications
  getNotifications: (): SystemNotification[] => {
    try {
      const data = localStorage.getItem(KEYS.NOTIFICATIONS);
      if (!data) {
        localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  markNotificationAsRead: (id: string) => {
    const notifs = storageService.getNotifications();
    const found = notifs.find((n) => n.id === id);
    if (found) {
      found.read = true;
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    }
  },

  markAllNotificationsRead: () => {
    const notifs = storageService.getNotifications().map((n) => ({ ...n, read: true }));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  // Weekly Report
  getWeeklyReport: (): WeeklyReportData => {
    try {
      const data = localStorage.getItem(KEYS.WEEKLY_REPORT);
      if (!data) {
        localStorage.setItem(KEYS.WEEKLY_REPORT, JSON.stringify(INITIAL_WEEKLY_REPORT));
        return INITIAL_WEEKLY_REPORT;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_WEEKLY_REPORT;
    }
  },

  saveWeeklyReport: (report: WeeklyReportData) => {
    localStorage.setItem(KEYS.WEEKLY_REPORT, JSON.stringify(report));
  },

  // Subjects
  getSubjects: (): SubjectInfo[] => {
    try {
      const data = localStorage.getItem(KEYS.SUBJECTS);
      if (!data) {
        localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
        return INITIAL_SUBJECTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SUBJECTS;
    }
  },

  // Role
  getCurrentRole: (): UserRole => {
    return (localStorage.getItem(KEYS.CURRENT_ROLE) as UserRole) || 'GVCN';
  },

  setCurrentRole: (role: UserRole) => {
    localStorage.setItem(KEYS.CURRENT_ROLE, role);
  },

  // Reset all
  resetToDefaultData: () => {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(KEYS.VIOLATIONS, JSON.stringify(INITIAL_VIOLATIONS));
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(INITIAL_ACHIEVEMENTS));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(KEYS.WEEKLY_REPORT, JSON.stringify(INITIAL_WEEKLY_REPORT));
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
  }
};
