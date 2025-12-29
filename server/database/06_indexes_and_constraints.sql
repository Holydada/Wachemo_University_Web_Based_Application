-- ==================== DATABASE OPTIMIZATION ====================
-- File: 06_indexes_and_constraints.sql
-- Purpose: Add indexes and constraints for performance and data integrity

USE wcu_digital_campus;

-- ==================== INDEXES FOR PERFORMANCE ====================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_wcu_id ON users(wcu_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Student indexes
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_college_id ON students(college_id);
CREATE INDEX IF NOT EXISTS idx_students_department_id ON students(department_id);
CREATE INDEX IF NOT EXISTS idx_students_program_id ON students(program_id);
CREATE INDEX IF NOT EXISTS idx_students_academic_status ON students(academic_status);
CREATE INDEX IF NOT EXISTS idx_students_registration_status ON students(registration_status);

-- Department indexes
CREATE INDEX IF NOT EXISTS idx_departments_college_id ON departments(college_id);
CREATE INDEX IF NOT EXISTS idx_departments_head_id ON departments(head_id);
CREATE INDEX IF NOT EXISTS idx_departments_status ON departments(status);

-- Course indexes
CREATE INDEX IF NOT EXISTS idx_courses_department_id ON courses(department_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_semester ON courses(semester);
CREATE INDEX IF NOT EXISTS idx_courses_year_level ON courses(year_level);
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(course_code);

-- Enrollment indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_course ON enrollments(student_id, course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_date ON enrollments(enrollment_date);

-- Grade indexes
CREATE INDEX IF NOT EXISTS idx_grades_enrollment_id ON grades(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_grades_status ON grades(status);
CREATE INDEX IF NOT EXISTS idx_grades_recorded_date ON grades(recorded_date);

-- ==================== CONSTRAINTS FOR DATA INTEGRITY ====================

-- Grade constraints
ALTER TABLE grades 
ADD CONSTRAINT IF NOT EXISTS chk_grade_range 
CHECK (grade >= 0 AND grade <= 100);

ALTER TABLE grades 
ADD CONSTRAINT IF NOT EXISTS chk_grade_point_range 
CHECK (grade_point >= 0 AND grade_point <= 4.0);

-- User status constraint
ALTER TABLE users 
ADD CONSTRAINT IF NOT EXISTS chk_user_status 
CHECK (status IN ('active', 'inactive', 'suspended'));

-- User role constraint
ALTER TABLE users 
ADD CONSTRAINT IF NOT EXISTS chk_user_role 
CHECK (role IN ('student', 'faculty', 'admin', 'registrar', 'librarian', 'cafeteria_staff'));

-- Enrollment status constraint
ALTER TABLE enrollments 
ADD CONSTRAINT IF NOT EXISTS chk_enrollment_status 
CHECK (status IN ('active', 'dropped', 'completed'));

-- Grade status constraint
ALTER TABLE grades 
ADD CONSTRAINT IF NOT EXISTS chk_grade_status 
CHECK (status IN ('draft', 'pending', 'final', 'approved'));

-- ==================== AUDIT LOG TABLE ====================

CREATE TABLE IF NOT EXISTS audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id INT,
  user_id INT,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_user_id (user_id),
  INDEX idx_audit_action (action),
  INDEX idx_audit_table (table_name),
  INDEX idx_audit_created (created_at)
);

-- ==================== SYSTEM HEALTH TABLE ====================

CREATE TABLE IF NOT EXISTS system_health (
  id INT PRIMARY KEY AUTO_INCREMENT,
  service_name VARCHAR(50) NOT NULL,
  status ENUM('healthy', 'degraded', 'unhealthy') NOT NULL,
  response_time INT,
  error_message TEXT,
  checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_health_service (service_name),
  INDEX idx_health_checked (checked_at)
);

-- ==================== BACKUP LOG TABLE ====================

CREATE TABLE IF NOT EXISTS backup_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  backup_type ENUM('full', 'incremental') NOT NULL,
  file_path VARCHAR(255),
  file_size BIGINT,
  status ENUM('started', 'completed', 'failed') NOT NULL,
  error_message TEXT,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  INDEX idx_backup_status (status),
  INDEX idx_backup_started (started_at)
);

-- ==================== SUCCESS MESSAGE ====================

SELECT 'Database optimization completed successfully!' as message;
SELECT 'Indexes created for improved query performance' as status;
SELECT 'Constraints added for data integrity' as status;
SELECT 'Audit and monitoring tables created' as status;
