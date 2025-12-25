// Core Type Definitions for Wachemo University Digital Campus

export interface User {
  id: number;
  wcu_id: string;
  email?: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  face_embedding?: string;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
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
  date_of_birth: Date;
  gender: 'male' | 'female';
  place_of_birth?: string;
  current_address?: string;
  phone_number?: string;
  photo_url?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at: Date;
  updated_at: Date;
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
  created_at: Date;
  updated_at: Date;
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
  created_at: Date;
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
  created_at: Date;
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
  created_at: Date;
}

export type CourseType = 'core' | 'elective' | 'prerequisite';

export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  academic_year: string;
  semester: number;
  enrollment_date: Date;
  grade?: Grade;
  grade_points?: number;
  status: EnrollmentStatus;
  teacher_id?: number;
}

export type Grade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F' | 'I' | 'W' | 'NG';
export type EnrollmentStatus = 'enrolled' | 'completed' | 'dropped' | 'incomplete';

export interface Exam {
  id: number;
  course_id: number;
  teacher_id: number;
  title: string;
  description?: string;
  exam_type: ExamType;
  start_time: Date;
  end_time: Date;
  duration_minutes: number;
  max_attempts: number;
  passing_score: number;
  total_points: number;
  instructions?: string;
  proctoring_enabled: boolean;
  face_verification_required: boolean;
  fullscreen_required: boolean;
  status: ExamStatus;
  created_at: Date;
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

export interface ExamSession {
  id: number;
  exam_id: number;
  student_id: number;
  attempt_number: number;
  start_time: Date;
  end_time?: Date;
  time_remaining?: number;
  total_score?: number;
  percentage_score?: number;
  status: ExamSessionStatus;
  violations_count: number;
  face_verification_passed: boolean;
  ip_address?: string;
  user_agent?: string;
}

export type ExamSessionStatus = 'in_progress' | 'completed' | 'submitted' | 'timed_out' | 'cancelled';

export interface ExamAnswer {
  id: number;
  session_id: number;
  question_id: number;
  answer_text?: string;
  selected_option?: string;
  is_correct?: boolean;
  points_earned: number;
  answered_at: Date;
}

export interface IDCard {
  id: number;
  student_id: number;
  card_number: string;
  qr_code: string;
  card_type: CardType;
  issue_date: Date;
  expiry_date: Date;
  print_count: number;
  status: CardStatus;
  printed_by?: number;
  created_at: Date;
}

export type CardType = 'main_id' | 'meal_card';
export type CardStatus = 'active' | 'lost' | 'expired' | 'revoked';

export interface ClearanceRequest {
  id: number;
  student_id: number;
  request_type: ClearanceType;
  reason: string;
  academic_year: string;
  semester: number;
  status: ClearanceStatus;
  current_step: number;
  face_verification_passed: boolean;
  created_at: Date;
  completed_at?: Date;
}

export type ClearanceType = 'graduation' | 'transfer' | 'withdrawal' | 'temporary';
export type ClearanceStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

export interface CostSharingAgreement {
  id: number;
  student_id: number;
  academic_year: string;
  agreement_date: Date;
  services_selected: string[];
  total_estimated_cost: number;
  repayment_percentage: number;
  monthly_deduction?: number;
  employment_start_date?: Date;
  agreement_status: AgreementStatus;
  digital_signature: string;
  witness_signature?: string;
  created_at: Date;
}

export type AgreementStatus = 'active' | 'completed' | 'defaulted' | 'waived';

export interface Payment {
  id: number;
  student_id: number;
  payment_type_id: number;
  amount: number;
  payment_method: PaymentMethod;
  transaction_reference?: string;
  receipt_number?: string;
  payment_date: Date;
  verified_by?: number;
  verification_date?: Date;
  status: PaymentStatus;
  notes?: string;
}

export type PaymentMethod = 'bank_transfer' | 'mobile_money' | 'cash' | 'online';
export type PaymentStatus = 'pending' | 'verified' | 'rejected' | 'refunded';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JWTPayload {
  userId: number;
  wcuId: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Face Recognition Types
export interface FaceVerificationResult {
  success: boolean;
  confidence: number;
  message: string;
}

// File Upload Types
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Database Connection Types
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
  acquireTimeout: number;
  timeout: number;
}

// Socket.IO Types
export interface SocketUser {
  userId: number;
  wcuId: string;
  role: UserRole;
  socketId: string;
}

// Audit Log Types
export interface AuditLog {
  id: number;
  user_id?: number;
  action: string;
  table_name?: string;
  record_id?: number;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

// Ethiopian Specific Types
export interface EthiopianDate {
  year: number;
  month: number;
  day: number;
  gregorianDate: Date;
}

export interface BilingualText {
  english: string;
  amharic: string;
}

// System Configuration Types
export interface SystemConfig {
  key: string;
  value: string;
  description?: string;
  is_public: boolean;
  updated_at: Date;
}

// Notification Types
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: Date;
}

export type NotificationType = 'info' | 'warning' | 'error' | 'success' | 'exam' | 'grade' | 'announcement';