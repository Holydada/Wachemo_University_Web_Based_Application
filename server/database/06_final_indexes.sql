-- ==================== DATABASE OPTIMIZATION - FINAL VERSION ====================
USE wcu_digital_campus;

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_wcu_id ON users(wcu_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- User profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Students
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_college_id ON students(college_id);
CREATE INDEX IF NOT EXISTS idx_students_department_id ON students(department_id);
CREATE INDEX IF NOT EXISTS idx_students_program_id ON students(program_id);
CREATE INDEX IF NOT EXISTS idx_students_academic_status ON students(academic_status);

-- Departments
CREATE INDEX IF NOT EXISTS idx_departments_college_id ON departments(college_id);
CREATE INDEX IF NOT EXISTS idx_departments_head_id ON departments(head_id);

-- Courses
CREATE INDEX IF NOT EXISTS idx_courses_department_id ON courses(department_id);
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);
CREATE INDEX IF NOT EXISTS idx_courses_year_level ON courses(year_level);

-- Enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_academic_year ON enrollments(academic_year);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id INT,
  user_id INT,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_user_id (user_id),
  INDEX idx_audit_action (action),
  INDEX idx_audit_created (created_at)
);

-- System health table
CREATE TABLE IF NOT EXISTS system_health (
  id INT PRIMARY KEY AUTO_INCREMENT,
  service_name VARCHAR(50) NOT NULL,
  status ENUM('healthy', 'degraded', 'unhealthy') NOT NULL,
  response_time INT,
  error_message TEXT,
  checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_health_service (service_name)
);

SELECT 'Database optimization completed!' as status;
