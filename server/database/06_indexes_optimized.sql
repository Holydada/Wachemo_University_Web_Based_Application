-- ==================== DATABASE OPTIMIZATION (CORRECTED) ====================
-- Optimized for actual WCU database structure

USE wcu_digital_campus;

-- ==================== INDEXES FOR PERFORMANCE ====================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_wcu_id ON users(wcu_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Student indexes
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_college_id ON students(college_id);
CREATE INDEX IF NOT EXISTS idx_students_department_id ON students(department_id);
CREATE INDEX IF NOT EXISTS idx_students_program_id ON students(program_id);
CREATE INDEX IF NOT EXISTS idx_students_academic_status ON students(academic_status);

-- Department indexes
CREATE INDEX IF NOT EXISTS idx_departments_college_id ON departments(college_id);
CREATE INDEX IF NOT EXISTS idx_departments_head_id ON departments(head_id);

-- Course indexes
CREATE INDEX IF NOT EXISTS idx_courses_department_id ON courses(department_id);
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);
CREATE INDEX IF NOT EXISTS idx_courses_year_level ON courses(year_level);
CREATE INDEX IF NOT EXISTS idx_courses_semester ON courses(semester);

-- Enrollment indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);

-- Grade submission indexes (if table exists)
CREATE INDEX IF NOT EXISTS idx_grade_submissions_enrollment_id ON grade_submissions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_grade_submissions_status ON grade_submissions(status);

-- ==================== CONSTRAINTS FOR DATA INTEGRITY ====================

-- User status constraint
ALTER TABLE users 
ADD CONSTRAINT IF NOT EXISTS chk_user_status 
CHECK (status IN ('active', 'inactive', 'suspended'));

-- User role constraint
ALTER TABLE users 
ADD CONSTRAINT IF NOT EXISTS chk_user_role 
CHECK (role IN ('student', 'faculty', 'admin', 'registrar', 'librarian', 'cafeteria_staff', 'hr_admin'));

-- Enrollment status constraint
ALTER TABLE enrollments 
ADD CONSTRAINT IF NOT EXISTS chk_enrollment_status 
CHECK (status IN ('active', 'dropped', 'completed', 'pending'));

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

-- ==================== SUCCESS MESSAGE ====================

SELECT 'Database optimization completed successfully!' as message;
SELECT COUNT(*) as indexes_created FROM information_schema.statistics 
WHERE table_schema = 'wcu_digital_campus';
