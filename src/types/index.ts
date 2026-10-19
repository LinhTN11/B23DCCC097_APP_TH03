export interface StudentProfile {
  id: string;
  studentCode: string;
  fullName: string;
  className: string;
  major: string;
  faculty: string;
  university: string;
  email: string;
  phone: string;
  academicYear: string;
  avatarUrl?: string;
  gpaScale4: number;
  gpaScale10: number;
  totalCredits: number;
  requiredCredits: number;
  academicRank: string;
}

export interface SubjectEvaluationComponent {
  name: string;
  weight: number; // e.g. 10 for 10%
  score?: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: string;
  lecturer: string;
  lecturerEmail: string;
  room: string;
  scheduleSummary: string;
  dayOfWeek: number; // 2..7 (Thứ 2 - Thứ 7)
  timeRange: string;
  progress: number; // 0..100%
  completedLessons: number;
  totalLessons: number;
  description: string;
  color: string;
  components: SubjectEvaluationComponent[];
}

export interface ScheduleItem {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  dayOfWeek: number; // 2..7, 8 for Sunday
  dayName: string; // 'Thứ Hai', 'Thứ Ba', ...
  dateString?: string;
  startTime: string; // '07:00'
  endTime: string; // '09:30'
  timeRange: string; // '07:00 - 09:30'
  room: string;
  building: string;
  lecturer: string;
  type: 'Lý thuyết' | 'Thực hành' | 'Đồ án' | 'Trực tuyến';
  lessonTopic: string;
  notes?: string;
  color: string;
}

export type AssignmentPriority = 'high' | 'medium' | 'low';

export interface Assignment {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  description: string;
  dueDate: string; // '2024-10-25' or '23:59 25/10/2024'
  dueTimestamp: number;
  isCompleted: boolean;
  priority: AssignmentPriority;
  submissionFormat?: string;
  userNotes?: string;
  color?: string;
}

export interface GradeItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  attendanceScore: number;
  midtermScore: number;
  finalScore: number;
  totalScore10: number;
  gradeLetter: string; // A, B+, B, C+, C, D, F
  totalScore4: number;
}

export interface SemesterGrade {
  semesterName: string;
  academicYear: string;
  gpaSemester4: number;
  gpaSemester10: number;
  creditsEarned: number;
  subjects: GradeItem[];
}

export interface AnnouncementItem {
  id: string;
  title: string;
  sender: string;
  date: string;
  summary: string;
  content: string;
  category: 'Đào tạo' | 'Công tác SV' | 'Khảo thí' | 'Học phí';
  isPinned?: boolean;
}

export interface ExamScheduleItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  examDate: string;
  examTime: string;
  room: string;
  format: string;
  seatNumber: string;
}
