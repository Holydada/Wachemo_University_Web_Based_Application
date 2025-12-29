-- ============================================
-- DATABASE OPTIMIZATION: INDEXES & CONSTRAINTS
-- Corrected to match actual table structure
-- ============================================

USE wcu_digital_campus;

-- ============================================
-- USERS TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at);

-- ============================================
-- STUDENTS TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_students_user ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_college ON students(college_id);
CREATE INDEX IF NOT EXISTS idx_students_department ON students(department_id);
CREATE INDEX IF NOT EXISTS idx_students_program ON students(program_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(academic_status);
CREATE INDEX IF NOT EXISTS idx_students_year ON students(current_year);
CREATE INDEX IF NOT EXISTS idx_students_registration ON students(registration_status);
CREATE INDEX IF NOT EXISTS idx_students_admission ON students(admission_year);

-- ============================================
-- COLLEGES TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_colleges_name ON colleges(name);
CREATE INDEX IF NOT EXISTS idx_colleges_code ON colleges(code);

-- ============================================
-- DEPARTMENTS TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_departments_college ON departments(college_id);
CREATE INDEX IF NOT EXISTS idx_departments_name ON departments(name);
CREATE INDEX IF NOT EXISTS idx_departments_code ON departments(code);
CREATE INDEX IF NOT EXISTS idx_departments_head ON departments(head_id);
CREATE INDEX IF NOT EXISTS idx_departments_status ON departments(status);

-- ============================================
-- PROGRAMS TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_programs_department ON programs(department_id);
CREATE INDEX IF NOT EXISTS idx_programs_name ON programs(name);
CREATE INDEX IF NOT EXISTS idx_programs_degree ON programs(degree_type);
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);

-- ============================================
-- COURSES TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department_id);
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);
CREATE INDEX IF NOT EXISTS idx_courses_year ON courses(year_level);
CREATE INDEX IF NOT EXISTS idx_courses_semester ON courses(semester);
CREATE INDEX IF NOT EXISTS idx_courses_type ON courses(course_type);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);

-- ============================================
-- ENROLLMENTS TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_year ON enrollments(academic_year);
CREATE INDEX IF NOT EXISTS idx_enrollments_semester ON enrollments(semester);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_date ON enrollments(enrollment_date);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_enrollments_student_year ON enrollments(student_id, academic_year);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_year ON enrollments(course_id, academic_year);

-- ============================================
-- GRADE_SUBMISSIONS TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_grade_submissions_enrollment ON grade_submissions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_grade_submissions_submitted ON grade_submissions(submitted_at);

-- ============================================
-- COURSE_PREREQUISITES TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_prerequisites_course ON course_prerequisites(course_id);
CREATE INDEX IF NOT EXISTS idx_prerequisites_required ON course_prerequisites(prerequisite_course_id);

-- ============================================
-- USER_PROFILES TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_user ON user_profiles(user_id);

-- ============================================
-- PERFORMANCE OPTIMIZATION
-- ============================================

-- Analyze tables to update statistics
ANALYZE TABLE users;
ANALYZE TABLE students;
ANALYZE TABLE colleges;
ANALYZE TABLE departments;
ANALYZE TABLE programs;
ANALYZE TABLE courses;
ANALYZE TABLE enrollments;
ANALYZE TABLE grade_submissions;
ANALYZE TABLE course_prerequisites;
ANALYZE TABLE user_profiles;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Show all indexes
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) as COLUMNS,
    INDEX_TYPE,
    NON_UNIQUE
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'wcu_digital_campus'
GROUP BY TABLE_NAME, INDEX_NAME, INDEX_TYPE, NON_UNIQUE
ORDER BY TABLE_NAME, INDEX_NAME;

-- Show table sizes
SELECT 
    TABLE_NAME,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'Size (MB)',
    TABLE_ROWS
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'wcu_digital_campus'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;
