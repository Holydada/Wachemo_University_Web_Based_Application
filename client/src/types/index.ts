// Core Type Definitions for WCU Digital Campus Frontend

export interface User {
  id: number;
  wcu_id: string;
  email?: string;
  role: UserRole;
  status: UserStatus;
  profile?: UserProfile;
  last_login?: string;
  created_at: string;
}

export type UserRole = 
  | 'student' 
  | 'faculty' 
  | 'admin' 
  | 'registrar' 
  | 'dean' 
  | 'department_head' 
  | 'librarian' 
  | 'cafeteria_staff' 
  | 'dormitory_admin' 
  | 'hr_admin';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'graduated';

export interface UserProfile {
  user_id: number;
  full_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  place_of_birth?: string;
  current_address?: string;
  phone_number?: string;
  photo_url?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface Program {
  id: number;
  department_id: number;
  name: string;
  name_amharic?: string;
  degree_type: 'bachelor' | 'master' | 'phd' | 'diploma';
  duration_years: number;
  total_credits: number;
  status: 'active' | 'inactive';
}

export interface Student {
  user_id: number;
  college_id?: number;
  department_id?: number;
  program_id?: number;
  admission_year: number;
  current_year: number;
  current_semester: number;
  academic_status: AcademicStatus;
  cumulative_gpa: number;
  total_credits_earned: number;
  is_freshman: boolean;
  coc_exam_score?: number;
  registration_status: RegistrationStatus;
  college?: College;
  department?: Department;
  program?: Program;
}

export type AcademicStatus = 'active' | 'probation' | 'suspended' | 'graduated' | 'dropped';
export type RegistrationStatus = 'registered' | 'pending' | 'blocked';

export interface College {
  id: number;
  name: string;
  name_amharic?: string;
  code: string;
  dean_id?: number;
  description?: string;
  established_year?: number;
  status: 'active' | 'inactive';
}

export interface Department {
  id: number;
  college_id: number;
  name: string;
  name_amharic?: string;
  code: string;
  head_id?: number;
  description?: string;
  requires_coc_exam: boolean;
  min_gpa_requirement: number;
  status: 'active' | 'inactive';
}

export interface Course {
  id: number;
  department_id: number;
  code: string;
  name: string;
  name_amharic?: string;
  credits: number;
  year_level: number;
  semester: number;
  course_type: CourseType;
  description?: string;
  status: 'active' | 'inactive';
  prerequisites?: Course[];
}

export type CourseType = 'core' | 'elective' | 'prerequisite';

export interface Exam {
  id: number;
  course_id: number;
  teacher_id: number;
  title: string;
  description?: string;
  exam_type: ExamType;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  max_attempts: number;
  passing_score: number;
  total_points: number;
  instructions?: string;
  proctoring_enabled: boolean;
  face_verification_required: boolean;
  fullscreen_required: boolean;
  status: ExamStatus;
  course?: Course;
  questions?: ExamQuestion[];
}

export type ExamType = 'midterm' | 'final' | 'quiz' | 'assignment';
export type ExamStatus = 'draft' | 'published' | 'active' | 'completed' | 'cancelled';

export interface ExamQuestion {
  id: number;
  exam_id: number;
  question_text: string;
  question_type: QuestionType;
  points: number;
  order_number: number;
  options?: string[];
  correct_answer?: string;
  explanation?: string;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'fill_blank';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// Authentication Types
export interface LoginCredentials {
  wcuId: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalStudents?: number;
  totalCourses?: number;
  activeExams?: number;
  pendingClearances?: number;
  systemUptime?: string;
  [key: string]: any;
}

// Additional types for API service
export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface ExamSession {
  id: number;
  exam_id: number;
  student_id: number;
  start_time: string;
  end_time?: string;
  status: 'in_progress' | 'completed' | 'abandoned' | 'violated';
  score?: number;
  answers?: ExamAnswer[];
  violations?: ExamViolation[];
}

export interface ExamAnswer {
  id: number;
  session_id: number;
  question_id: number;
  answer: string;
  is_correct?: boolean;
  points_earned?: number;
}

export interface ExamViolation {
  id: number;
  session_id: number;
  violation_type: string;
  description: string;
  timestamp: string;
}

export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  academic_year: string;
  semester: number;
  enrollment_date: string;
  status: 'enrolled' | 'dropped' | 'completed';
  grade?: string;
  grade_points?: number;
  course?: Course;
}

export interface ClearanceRequest {
  id: number;
  student_id: number;
  request_type: string;
  reason: string;
  academic_year: string;
  semester: number;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  processed_at?: string;
  processed_by?: number;
  comments?: string;
}

export interface NewsPost {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  author_id: number;
  category_id?: number;
  featured: boolean;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
  tags?: string[];
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  created_at: string;
  data?: any;
}