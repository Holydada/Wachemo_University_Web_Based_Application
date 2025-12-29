-- Academic Structure Tables
USE wcu_digital_campus;

-- Colleges table
CREATE TABLE colleges (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  name_amharic VARCHAR(255),
  code VARCHAR(20) UNIQUE NOT NULL,
  dean_id INT,
  description TEXT,
  established_year INT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dean_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_code (code),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Departments table
CREATE TABLE departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  college_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_amharic VARCHAR(255),
  code VARCHAR(20) UNIQUE NOT NULL,
  head_id INT,
  description TEXT,
  requires_coc_exam BOOLEAN DEFAULT FALSE,
  min_gpa_requirement DECIMAL(3,2) DEFAULT 1.75,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
  FOREIGN KEY (head_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_college (college_id),
  INDEX idx_code (code),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Programs table
CREATE TABLE programs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  department_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_amharic VARCHAR(255),
  degree_type ENUM('diploma', 'bachelor', 'master', 'phd') NOT NULL,
  duration_years INT NOT NULL,
  total_credits INT NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
  INDEX idx_department (department_id),
  INDEX idx_degree_type (degree_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;