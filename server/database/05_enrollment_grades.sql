-- Enrollment and Grades Tables
USE wcu_digital_campus;

-- Enrollments table
CREATE TABLE enrollments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  academic_year VARCHAR(20) NOT NULL,
  semester INT NOT NULL,
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('enrolled', 'dropped', 'completed') DEFAULT 'enrolled',
  grade VARCHAR(2),
  grade_points DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (student_id, course_id, academic_year, semester),
  INDEX idx_student (student_id),
  INDEX idx_course (course_id),
  INDEX idx_academic_year (academic_year, semester)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Grade submissions (teacher grade entry)
CREATE TABLE grade_submissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  enrollment_id INT NOT NULL,
  teacher_id INT NOT NULL,
  grade VARCHAR(2) NOT NULL,
  grade_points DECIMAL(3,2) NOT NULL,
  submission_status ENUM('draft', 'submitted', 'approved', 'rejected') DEFAULT 'draft',
  submitted_at TIMESTAMP NULL,
  approved_by INT,
  approved_at TIMESTAMP NULL,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_enrollment (enrollment_id),
  INDEX idx_teacher (teacher_id),
  INDEX idx_status (submission_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;