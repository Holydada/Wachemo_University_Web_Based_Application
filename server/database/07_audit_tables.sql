-- ============================================
-- AUDIT TABLES FOR TRACKING CHANGES
-- ============================================

USE wcu_digital_campus;

-- ============================================
-- USER ACTIVITY AUDIT
-- ============================================
CREATE TABLE IF NOT EXISTS audit_user_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_table (table_name),
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- GRADE CHANGES AUDIT
-- ============================================
CREATE TABLE IF NOT EXISTS audit_grade_changes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    enrollment_id INT NOT NULL,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    old_grade VARCHAR(2),
    new_grade VARCHAR(2),
    old_grade_points DECIMAL(3,2),
    new_grade_points DECIMAL(3,2),
    changed_by INT NOT NULL,
    reason TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_grade_enrollment (enrollment_id),
    INDEX idx_audit_grade_student (student_id),
    INDEX idx_audit_grade_changed_by (changed_by),
    INDEX idx_audit_grade_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- LOGIN ATTEMPTS AUDIT
-- ============================================
CREATE TABLE IF NOT EXISTS audit_login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    user_id INT,
    success BOOLEAN NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    failure_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_login_email (email),
    INDEX idx_audit_login_user (user_id),
    INDEX idx_audit_login_success (success),
    INDEX idx_audit_login_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ENROLLMENT CHANGES AUDIT
-- ============================================
CREATE TABLE IF NOT EXISTS audit_enrollment_changes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    enrollment_id INT NOT NULL,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    changed_by INT NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_enroll_enrollment (enrollment_id),
    INDEX idx_audit_enroll_student (student_id),
    INDEX idx_audit_enroll_changed_by (changed_by),
    INDEX idx_audit_enroll_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SYSTEM ERRORS LOG
-- ============================================
CREATE TABLE IF NOT EXISTS system_error_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    error_type VARCHAR(50) NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    user_id INT,
    request_url VARCHAR(500),
    request_method VARCHAR(10),
    request_body TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_error_type (error_type),
    INDEX idx_error_user (user_id),
    INDEX idx_error_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VERIFICATION
-- ============================================
SHOW TABLES LIKE 'audit_%';
SHOW TABLES LIKE 'system_%';
