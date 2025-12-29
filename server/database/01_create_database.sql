-- Wachemo University Digital Campus Database
-- Database Creation Script
-- MySQL 8.0+

-- Drop database if exists (for development only)
DROP DATABASE IF EXISTS wcu_digital_campus;

-- Create database
CREATE DATABASE wcu_digital_campus
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Use the database
USE wcu_digital_campus;

-- Set timezone
SET time_zone = '+03:00'; -- East Africa Time (EAT)

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Set SQL mode for strict data validation
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Create database user (optional - for production)
-- CREATE USER IF NOT EXISTS 'wcu_admin'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT ALL PRIVILEGES ON wcu_digital_campus.* TO 'wcu_admin'@'localhost';
-- FLUSH PRIVILEGES;

SELECT 'Database wcu_digital_campus created successfully!' AS message;