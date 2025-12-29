-- Users and Authentication Tables
USE wcu_digital_campus;

-- Users table (main authentication table)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  wcu_id VARCHAR(50) UNIQUE NOT NULL COMMENT 'Format: WCU/YEAR/XXXXXX',
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'faculty', 'admin', 'registrar', 'dean', 'department_head', 'hr_admin', 'librarian', 'cafeteria_staff', 'dormitory_admin') NOT NULL,
  status ENUM('active', 'inactive', 'suspended', 'graduated') DEFAULT 'active',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_wcu_id (wcu_id),
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User profiles table
CREATE TABLE user_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  father_name VARCHAR(255),
  mother_name VARCHAR(255),
  date_of_birth DATE NOT NULL,
  gender ENUM('male', 'female') NOT NULL,
  place_of_birth VARCHAR(255),
  current_address TEXT,
  phone_number VARCHAR(20),
  photo_url VARCHAR(500),
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_full_name (full_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;