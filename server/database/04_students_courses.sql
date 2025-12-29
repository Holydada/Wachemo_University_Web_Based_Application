-- Students and Courses Tables
USE wcu_digital_campus;

-- Students table
CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  college_id INT,
  department_id INT,
  program_id INT,
  admission_year INT NOT NULL,
  current_year INT DEFAULT 1,
  current_semester INT DEFAULT 1,
  academic_status ENUM('active', 'probation', 'suspended', 'graduated', 'dropped') DEFAULT 'active',
  cumulative_gpa DECIMAL(3,2) DEFAULT 0.00,
  total_credits_earned INT DEFAULT 0,
  is_freshman BOOLEAN DEFAULT TRUE,
  coc_exam_score DECIMAL(5,2),
  registration_status ENUM('registered', 'pending', 'blocked') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE SET NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_college (college_id),
  INDEX idx_department (department_id),
  INDEX idx_academic_status (academic_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Courses table
CREATE TABLE courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  department_id INT NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_amharic VARCHAR(255),
  credits INT NOT NULL,
  year_level INT NOT NULL,
  semester INT NOT NULL,
  course_type ENUM('core', 'elective', 'prerequisite') DEFAULT 'core',
  description TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
  INDEX idx_code (code),
  INDEX idx_department (department_id),
  INDEX idx_year_semester (year_level, semester)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Course prerequisites
CREATE TABLE course_prerequisites (
  course_id INT NOT NULL,
  prerequisite_course_id INT NOT NULL,
  PRIMARY KEY (course_id, prerequisite_course_id),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (prerequisite_course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;