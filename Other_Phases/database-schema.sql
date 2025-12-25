-- Wachemo University Digital Campus Database Schema
-- Comprehensive schema with proper module linkages and Ethiopian compliance

-- =============================================
-- CORE USER MANAGEMENT SYSTEM
-- =============================================

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    wcu_id VARCHAR(20) UNIQUE NOT NULL, -- Format: WCU/2024/001234
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty', 'admin', 'registrar', 'dean', 'department_head', 'librarian', 'cafeteria_staff', 'dormitory_admin', 'hr_admin') NOT NULL,
    status ENUM('active', 'inactive', 'suspended', 'graduated') DEFAULT 'active',
    face_embedding TEXT, -- Stored face recognition data
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_wcu_id (wcu_id),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);

CREATE TABLE user_profiles (
    user_id INT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    mother_name VARCHAR(255) NOT NULL,
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
    INDEX idx_full_name (full_name),
    INDEX idx_phone (phone_number)
);

-- =============================================
-- ACADEMIC STRUCTURE
-- =============================================

CREATE TABLE colleges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    name_amharic VARCHAR(255),
    code VARCHAR(10) UNIQUE NOT NULL,
    dean_id INT,
    description TEXT,
    established_year YEAR,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (dean_id) REFERENCES users(id),
    INDEX idx_code (code),
    INDEX idx_dean (dean_id)
);

CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    college_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_amharic VARCHAR(255),
    code VARCHAR(10) UNIQUE NOT NULL,
    head_id INT,
    description TEXT,
    requires_coc_exam BOOLEAN DEFAULT FALSE,
    min_gpa_requirement DECIMAL(3,2) DEFAULT 1.75,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (college_id) REFERENCES colleges(id),
    FOREIGN KEY (head_id) REFERENCES users(id),
    INDEX idx_college (college_id),
    INDEX idx_code (code),
    INDEX idx_head (head_id)
);

CREATE TABLE programs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_amharic VARCHAR(255),
    degree_type ENUM('bachelor', 'master', 'phd', 'diploma') NOT NULL,
    duration_years INT NOT NULL,
    total_credits INT NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (department_id) REFERENCES departments(id),
    INDEX idx_department (department_id),
    INDEX idx_degree_type (degree_type)
);

-- =============================================
-- STUDENT ACADEMIC JOURNEY
-- =============================================

CREATE TABLE students (
    user_id INT PRIMARY KEY,
    college_id INT,
    department_id INT,
    program_id INT,
    admission_year YEAR NOT NULL,
    current_year INT DEFAULT 1,
    current_semester INT DEFAULT 1,
    academic_status ENUM('active', 'probation', 'suspended', 'graduated', 'dropped') DEFAULT 'active',
    cumulative_gpa DECIMAL(3,2) DEFAULT 0.00,
    total_credits_earned INT DEFAULT 0,
    is_freshman BOOLEAN DEFAULT TRUE,
    coc_exam_score DECIMAL(5,2) NULL,
    registration_status ENUM('registered', 'pending', 'blocked') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(id),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (program_id) REFERENCES programs(id),
    INDEX idx_college_dept (college_id, department_id),
    INDEX idx_admission_year (admission_year),
    INDEX idx_academic_status (academic_status)
);

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
    
    FOREIGN KEY (department_id) REFERENCES departments(id),
    INDEX idx_department (department_id),
    INDEX idx_code (code),
    INDEX idx_year_semester (year_level, semester)
);

CREATE TABLE course_prerequisites (
    course_id INT NOT NULL,
    prerequisite_course_id INT NOT NULL,
    min_grade ENUM('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F') DEFAULT 'D',
    
    PRIMARY KEY (course_id, prerequisite_course_id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (prerequisite_course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    academic_year VARCHAR(9) NOT NULL, -- Format: 2024/2025
    semester INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade ENUM('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'I', 'W', 'NG') NULL,
    grade_points DECIMAL(3,2) NULL,
    status ENUM('enrolled', 'completed', 'dropped', 'incomplete') DEFAULT 'enrolled',
    teacher_id INT,
    
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    UNIQUE KEY unique_enrollment (student_id, course_id, academic_year, semester),
    INDEX idx_student_year (student_id, academic_year),
    INDEX idx_course_year (course_id, academic_year)
);

-- =============================================
-- EXAMINATION SYSTEM
-- =============================================

CREATE TABLE exams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    teacher_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    exam_type ENUM('midterm', 'final', 'quiz', 'assignment') NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    duration_minutes INT NOT NULL,
    max_attempts INT DEFAULT 1,
    passing_score DECIMAL(5,2) DEFAULT 50.00,
    total_points DECIMAL(5,2) NOT NULL,
    instructions TEXT,
    proctoring_enabled BOOLEAN DEFAULT TRUE,
    face_verification_required BOOLEAN DEFAULT TRUE,
    fullscreen_required BOOLEAN DEFAULT TRUE,
    status ENUM('draft', 'published', 'active', 'completed', 'cancelled') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    INDEX idx_course (course_id),
    INDEX idx_teacher (teacher_id),
    INDEX idx_start_time (start_time),
    INDEX idx_status (status)
);

CREATE TABLE exam_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exam_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false', 'short_answer', 'essay', 'fill_blank') NOT NULL,
    points DECIMAL(5,2) NOT NULL,
    order_number INT NOT NULL,
    options JSON NULL, -- For multiple choice questions
    correct_answer TEXT NULL,
    explanation TEXT NULL,
    
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    INDEX idx_exam (exam_id),
    INDEX idx_order (exam_id, order_number)
);

CREATE TABLE exam_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exam_id INT NOT NULL,
    student_id INT NOT NULL,
    attempt_number INT DEFAULT 1,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    time_remaining INT NULL, -- in seconds
    total_score DECIMAL(5,2) NULL,
    percentage_score DECIMAL(5,2) NULL,
    status ENUM('in_progress', 'completed', 'submitted', 'timed_out', 'cancelled') DEFAULT 'in_progress',
    violations_count INT DEFAULT 0,
    face_verification_passed BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    FOREIGN KEY (exam_id) REFERENCES exams(id),
    FOREIGN KEY (student_id) REFERENCES students(user_id),
    UNIQUE KEY unique_attempt (exam_id, student_id, attempt_number),
    INDEX idx_exam_student (exam_id, student_id),
    INDEX idx_status (status)
);

CREATE TABLE exam_answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT NOT NULL,
    question_id INT NOT NULL,
    answer_text TEXT,
    selected_option VARCHAR(10) NULL,
    is_correct BOOLEAN NULL,
    points_earned DECIMAL(5,2) DEFAULT 0,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES exam_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES exam_questions(id),
    UNIQUE KEY unique_answer (session_id, question_id),
    INDEX idx_session (session_id)
);

CREATE TABLE exam_violations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT NOT NULL,
    violation_type ENUM('tab_switch', 'window_blur', 'copy_attempt', 'paste_attempt', 'right_click', 'fullscreen_exit', 'face_not_detected') NOT NULL,
    violation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details JSON NULL,
    
    FOREIGN KEY (session_id) REFERENCES exam_sessions(id) ON DELETE CASCADE,
    INDEX idx_session (session_id),
    INDEX idx_type (violation_type)
);

-- =============================================
-- ID CARD & CAFETERIA SYSTEM
-- =============================================

CREATE TABLE id_cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    card_number VARCHAR(20) UNIQUE NOT NULL,
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    card_type ENUM('main_id', 'meal_card') NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    print_count INT DEFAULT 0,
    status ENUM('active', 'lost', 'expired', 'revoked') DEFAULT 'active',
    printed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    FOREIGN KEY (printed_by) REFERENCES users(id),
    INDEX idx_student (student_id),
    INDEX idx_card_number (card_number),
    INDEX idx_qr_code (qr_code),
    INDEX idx_status (status)
);

CREATE TABLE id_card_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    request_type ENUM('new', 'replacement', 'renewal') NOT NULL,
    reason TEXT,
    penalty_paid BOOLEAN DEFAULT FALSE,
    penalty_amount DECIMAL(10,2) NULL,
    payment_receipt VARCHAR(255) NULL,
    status ENUM('pending', 'approved', 'rejected', 'printed', 'delivered') DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_by INT NULL,
    processed_at TIMESTAMP NULL,
    
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(id),
    INDEX idx_student (student_id),
    INDEX idx_status (status)
);

CREATE TABLE cafeteria_locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    name_amharic VARCHAR(255),
    location VARCHAR(255),
    capacity INT,
    operating_hours VARCHAR(100),
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    
    INDEX idx_status (status)
);

CREATE TABLE meal_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    name_amharic VARCHAR(255),
    description TEXT,
    daily_meals INT DEFAULT 3, -- breakfast, lunch, dinner
    monthly_allowance DECIMAL(10,2) DEFAULT 3000.00,
    is_government_sponsored BOOLEAN DEFAULT TRUE,
    
    INDEX idx_sponsored (is_government_sponsored)
);

CREATE TABLE student_meal_subscriptions (
    student_id INT PRIMARY KEY,
    meal_plan_id INT NOT NULL,
    subscription_type ENUM('cafeteria_service', 'monthly_allowance') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    bank_account VARCHAR(50) NULL, -- For monthly allowance recipients
    status ENUM('active', 'suspended', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id),
    INDEX idx_type (subscription_type),
    INDEX idx_status (status)
);

CREATE TABLE daily_menus (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cafeteria_id INT NOT NULL,
    menu_date DATE NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner') NOT NULL,
    menu_items JSON NOT NULL, -- Array of food items
    nutritional_info JSON NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cafeteria_id) REFERENCES cafeteria_locations(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE KEY unique_menu (cafeteria_id, menu_date, meal_type),
    INDEX idx_date (menu_date)
);

CREATE TABLE meal_usage_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    cafeteria_id INT NOT NULL,
    meal_date DATE NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner') NOT NULL,
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scanned_by INT,
    
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    FOREIGN KEY (cafeteria_id) REFERENCES cafeteria_locations(id),
    FOREIGN KEY (scanned_by) REFERENCES users(id),
    UNIQUE KEY unique_meal_usage (student_id, meal_date, meal_type),
    INDEX idx_student_date (student_id, meal_date),
    INDEX idx_cafeteria_date (cafeteria_id, meal_date)
);

-- =============================================
-- CLEARANCE SYSTEM
-- =============================================

CREATE TABLE clearance_departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    name_amharic VARCHAR(255),
    order_sequence INT NOT NULL,
    responsible_role VARCHAR(50) NOT NULL,
    description TEXT,
    is_required BOOLEAN DEFAULT TRUE,
    
    INDEX idx_sequence (order_sequence)
);

CREATE TABLE clearance_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    request_type ENUM('graduation', 'transfer', 'withdrawal', 'temporary') NOT NULL,
    reason TEXT NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    semester INT NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'rejected') DEFAULT 'pending',
    current_step INT DEFAULT 1,
    face_verification_passed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_status (status),
    INDEX idx_type (request_type)
);

CREATE TABLE clearance_approvals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    department_id INT NOT NULL,
    approver_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'requires_action') DEFAULT 'pending',
    comments TEXT NULL,
    digital_signature VARCHAR(500) NULL,
    approved_at TIMESTAMP NULL,
    
    FOREIGN KEY (request_id) REFERENCES clearance_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES clearance_departments(id),
    FOREIGN KEY (approver_id) REFERENCES users(id),
    UNIQUE KEY unique_approval (request_id, department_id),
    INDEX idx_request (request_id),
    INDEX idx_approver (approver_id)
);

-- =============================================
-- COST SHARING SYSTEM (Ethiopian Government Compliance)
-- =============================================

CREATE TABLE cost_sharing_agreements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    agreement_date DATE NOT NULL,
    services_selected JSON NOT NULL, -- Array of selected services
    total_estimated_cost DECIMAL(12,2) NOT NULL,
    repayment_percentage DECIMAL(5,2) DEFAULT 15.00, -- Government standard
    monthly_deduction DECIMAL(10,2) NULL,
    employment_start_date DATE NULL,
    agreement_status ENUM('active', 'completed', 'defaulted', 'waived') DEFAULT 'active',
    digital_signature VARCHAR(500) NOT NULL,
    witness_signature VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_agreement (student_id, academic_year),
    INDEX idx_student (student_id),
    INDEX idx_year (academic_year),
    INDEX idx_status (agreement_status)
);

CREATE TABLE cost_sharing_services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(255) NOT NULL,
    service_name_amharic VARCHAR(255) NOT NULL,
    annual_cost DECIMAL(10,2) NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE,
    description TEXT,
    
    INDEX idx_mandatory (is_mandatory)
);

-- =============================================
-- LIBRARY MANAGEMENT SYSTEM
-- =============================================

CREATE TABLE libraries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    name_amharic VARCHAR(255),
    location VARCHAR(255),
    specialization VARCHAR(255), -- Health, Technology, etc.
    librarian_id INT,
    capacity INT,
    operating_hours VARCHAR(100),
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    
    FOREIGN KEY (librarian_id) REFERENCES users(id),
    INDEX idx_specialization (specialization),
    INDEX idx_status (status)
);

CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    library_id INT NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    title VARCHAR(500) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publisher VARCHAR(255),
    publication_year YEAR,
    category VARCHAR(100),
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    location_code VARCHAR(50),
    status ENUM('active', 'damaged', 'lost', 'retired') DEFAULT 'active',
    
    FOREIGN KEY (library_id) REFERENCES libraries(id),
    INDEX idx_library (library_id),
    INDEX idx_isbn (isbn),
    INDEX idx_title (title),
    INDEX idx_category (category)
);

CREATE TABLE book_checkouts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    book_id INT NOT NULL,
    student_id INT NOT NULL,
    library_id INT NOT NULL,
    checkout_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE NOT NULL,
    return_date TIMESTAMP NULL,
    status ENUM('checked_out', 'returned', 'overdue', 'lost') DEFAULT 'checked_out',
    librarian_id INT NOT NULL,
    fine_amount DECIMAL(8,2) DEFAULT 0.00,
    
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (student_id) REFERENCES students(user_id),
    FOREIGN KEY (library_id) REFERENCES libraries(id),
    FOREIGN KEY (librarian_id) REFERENCES users(id),
    INDEX idx_student (student_id),
    INDEX idx_book (book_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
);

-- =============================================
-- DORMITORY MANAGEMENT
-- =============================================

CREATE TABLE dormitory_blocks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    block_name VARCHAR(50) NOT NULL,
    block_number VARCHAR(10) NOT NULL,
    gender ENUM('male', 'female', 'mixed') NOT NULL,
    total_floors INT NOT NULL,
    total_rooms INT NOT NULL,
    status ENUM('active', 'maintenance', 'closed') DEFAULT 'active',
    
    INDEX idx_gender (gender),
    INDEX idx_status (status)
);

CREATE TABLE dormitory_rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    block_id INT NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    floor_number INT NOT NULL,
    capacity INT NOT NULL, -- 4 or 6 students
    current_occupancy INT DEFAULT 0,
    room_type ENUM('standard', 'accessible') DEFAULT 'standard',
    status ENUM('available', 'occupied', 'maintenance', 'reserved') DEFAULT 'available',
    
    FOREIGN KEY (block_id) REFERENCES dormitory_blocks(id),
    UNIQUE KEY unique_room (block_id, room_number),
    INDEX idx_block (block_id),
    INDEX idx_capacity (capacity),
    INDEX idx_status (status)
);

CREATE TABLE dormitory_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    room_id INT NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    assignment_date DATE NOT NULL,
    checkout_date DATE NULL,
    status ENUM('active', 'checked_out', 'transferred', 'terminated') DEFAULT 'active',
    assigned_by INT NOT NULL,
    
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES dormitory_rooms(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    INDEX idx_student (student_id),
    INDEX idx_room (room_id),
    INDEX idx_year (academic_year),
    INDEX idx_status (status)
);

-- =============================================
-- NEWS & ANNOUNCEMENTS
-- =============================================

CREATE TABLE news_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    name_amharic VARCHAR(255),
    description TEXT,
    target_audience JSON NOT NULL, -- Array of roles who can see this category
    
    INDEX idx_name (name)
);

CREATE TABLE news_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    title_amharic VARCHAR(500),
    content TEXT NOT NULL,
    content_amharic TEXT,
    excerpt TEXT,
    featured_image VARCHAR(500),
    author_id INT NOT NULL,
    visibility JSON NOT NULL, -- Array of roles who can see this post
    is_featured BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    view_count INT DEFAULT 0,
    
    FOREIGN KEY (category_id) REFERENCES news_categories(id),
    FOREIGN KEY (author_id) REFERENCES users(id),
    INDEX idx_category (category_id),
    INDEX idx_author (author_id),
    INDEX idx_status (status),
    INDEX idx_publish_date (publish_date),
    INDEX idx_featured (is_featured)
);

-- =============================================
-- PAYMENT SYSTEM
-- =============================================

CREATE TABLE payment_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    name_amharic VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    is_penalty BOOLEAN DEFAULT FALSE,
    
    INDEX idx_penalty (is_penalty)
);

CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    payment_type_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('bank_transfer', 'mobile_money', 'cash', 'online') NOT NULL,
    transaction_reference VARCHAR(255) UNIQUE,
    receipt_number VARCHAR(255) UNIQUE,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_by INT NULL,
    verification_date TIMESTAMP NULL,
    status ENUM('pending', 'verified', 'rejected', 'refunded') DEFAULT 'pending',
    notes TEXT,
    
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_type_id) REFERENCES payment_types(id),
    FOREIGN KEY (verified_by) REFERENCES users(id),
    INDEX idx_student (student_id),
    INDEX idx_reference (transaction_reference),
    INDEX idx_status (status),
    INDEX idx_payment_date (payment_date)
);

-- =============================================
-- SYSTEM AUDIT & LOGGING
-- =============================================

CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    table_name VARCHAR(100),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_table (table_name),
    INDEX idx_created_at (created_at)
);

-- =============================================
-- INITIAL DATA SETUP
-- =============================================

-- Insert default colleges
INSERT INTO colleges (name, name_amharic, code) VALUES
('Engineering & Technology', 'ምህንድስና እና ቴክኖሎጂ', 'ENG'),
('Natural & Computational Sciences', 'ተፈጥሮ እና ኮምፒዩቴሽናል ሳይንስ', 'NCS'),
('Medicine & Health Sciences', 'ህክምና እና ጤና ሳይንስ', 'MHS'),
('Agriculture Sciences', 'የግብርና ሳይንስ', 'AGR'),
('Business & Economics', 'ቢዝነስ እና ኢኮኖሚክስ', 'BEC'),
('Social Science & Humanities', 'ማህበራዊ ሳይንስ እና ሰብአዊነት', 'SSH'),
('Education and Behavioral Sciences', 'ትምህርት እና ባህሪ ሳይንስ', 'EBS'),
('School of Law', 'የህግ ትምህርት ቤት', 'LAW'),
('School of Veterinary Medicine', 'የእንስሳት ህክምና ትምህርት ቤት', 'VET');

-- Insert clearance departments
INSERT INTO clearance_departments (name, name_amharic, order_sequence, responsible_role) VALUES
('Department Head', 'የመምሪያ ኃላፊ', 1, 'department_head'),
('Book Store', 'መጽሃፍ ቤት', 2, 'librarian'),
('Library', 'ቤተ መጽሃፍት', 3, 'librarian'),
('Sport Store', 'ስፖርት መደብር', 4, 'admin'),
('Dormitory', 'መኝታ ቤት', 5, 'dormitory_admin'),
('Cafeteria', 'ካፌቴሪያ', 6, 'cafeteria_staff'),
('Faculty Dean', 'የፋኩልቲ ዲን', 7, 'dean'),
('Student Services', 'የተማሪ አገልግሎት', 8, 'admin'),
('Registrar', 'ሬጂስትራር', 9, 'registrar');

-- Insert cost sharing services
INSERT INTO cost_sharing_services (service_name, service_name_amharic, annual_cost, is_mandatory) VALUES
('Tuition Fee', 'የትምህርት ክፍያ', 15000.00, TRUE),
('Dormitory', 'መኝታ ቤት', 3600.00, FALSE),
('Cafeteria Service', 'የካፌቴሪያ አገልግሎት', 10800.00, FALSE),
('Library Access', 'የቤተ መጽሃፍት መዳረሻ', 1200.00, TRUE),
('Internet & WiFi', 'ኢንተርኔት እና ዋይፋይ', 2400.00, TRUE),
('Medical Services', 'የህክምና አገልግሎት', 1800.00, TRUE);

-- Insert meal plans
INSERT INTO meal_plans (name, name_amharic, description, is_government_sponsored) VALUES
('Government Cafeteria Service', 'የመንግስት ካፌቴሪያ አገልግሎት', 'Three meals per day in university cafeterias', TRUE),
('Monthly Cash Allowance', 'ወርሃዊ የገንዘብ አበል', '3000 Birr monthly allowance for self-catering', TRUE);

-- Insert payment types
INSERT INTO payment_types (name, name_amharic, amount, is_penalty) VALUES
('Late Registration Penalty', 'የዘገየ ምዝገባ ቅጣት', 50.00, TRUE),
('Lost ID Card Penalty', 'የጠፋ መታወቂያ ካርድ ቅጣት', 100.00, TRUE),
('Library Fine', 'የቤተ መጽሃፍት ቅጣት', 5.00, TRUE),
('Exam Retake Fee', 'የፈተና መድገም ክፍያ', 200.00, FALSE);

-- Create indexes for performance optimization
CREATE INDEX idx_users_composite ON users(role, status, wcu_id);
CREATE INDEX idx_students_composite ON students(college_id, department_id, academic_status);
CREATE INDEX idx_enrollments_composite ON enrollments(student_id, academic_year, semester, status);
CREATE INDEX idx_exams_composite ON exams(course_id, start_time, status);
CREATE INDEX idx_clearance_composite ON clearance_requests(student_id, status, request_type);