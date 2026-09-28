export type UserRole = 'ADMIN' | 'GVCN' | 'TEACHER' | 'PARENT' | 'STUDENT';

export type AcademicRating = 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu';
export type ConductRating = 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu';
export type AttendanceStatus = 'present' | 'late' | 'excused' | 'unexcused'; // Có mặt, Đi muộn, Nghỉ phép, Nghỉ không phép

export interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  birthday: string;
  gender: 'Nam' | 'Nữ';
  avatar: string;
  group: 'Tổ 1' | 'Tổ 2' | 'Tổ 3' | 'Tổ 4';
  parentName: string;
  parentPhone: string;
  address: string;
  status: 'Đang học' | 'Nghỉ phép' | 'Tạm nghỉ';
  academicRating: AcademicRating;
  conductRating: ConductRating;
  gpa: number;
  conductScore: number;
  // Specific subject scores
  scores: {
    math: number;
    literature: number;
    science: number; // KHTN
    english: number;
    historyGeo: number; // LS&ĐL
    civics: number; // GDCD
    informatics: number; // Tin học
    technology: number; // Công nghệ
  };
  // Detailed test scores for subject modal
  scoreDetails?: {
    [subject: string]: {
      oral: number;
      test15m: number;
      test45m: number;
      final: number;
    };
  };
  // Attendance this week (T2 -> T6)
  weeklyAttendance: {
    monday: AttendanceStatus;
    tuesday: AttendanceStatus;
    wednesday: AttendanceStatus;
    thursday: AttendanceStatus;
    friday: AttendanceStatus;
  };
  totalAbsences: number;
  totalLate: number;
  teacherNote?: string;
  actionPlan?: string;
  concernIssue?: string; // Reason if in "Cần quan tâm"
  progressHighlight?: string; // If in "Tiến bộ / Tuyên dương"
  isFlaggedForConcern?: boolean;
  isFlaggedForProgress?: boolean;
}

export interface ViolationRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  violation: string;
  action: string;
  status: 'Đã xử lý' | 'Chưa xử lý';
  pointsDeducted: number;
}

export interface AchievementRecord {
  id: string;
  studentId: string;
  studentName: string;
  avatar?: string;
  category: 'Học sinh xuất sắc' | 'Tiến bộ vượt bậc' | 'Việc tốt' | 'Hoạt động phong trào' | 'Khác';
  title: string;
  description: string;
  date: string;
  pointsAdded: number;
}

export interface SystemNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'alert' | 'success' | 'info' | 'warning';
  read: boolean;
  studentId?: string;
}

export interface WeeklyReportData {
  week: number;
  dateRange: string;
  totalStudents: number;
  presentRate: number;
  totalViolations: number;
  totalAwards: number;
  generalComment: string;
  academicsSummary: string;
  attendanceSummary: string;
  conductSummary: string;
  highlights: string[];
  studentsToWatch: { name: string; issue: string; recommendation: string }[];
}

export interface SubjectInfo {
  id: string;
  name: string;
  shortName: string;
  teacher: string;
  averageScore: number;
  color: string;
}
