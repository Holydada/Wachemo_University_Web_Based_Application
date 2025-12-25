-- Wachemo University Digital Campus - Sample Data
-- This file seeds the database with realistic test data

-- =============================================
-- ADMIN USER SETUP
-- =============================================

-- Create default admin user (password: admin123)
INSERT INTO users (wcu_id, email, password_hash, role, status) VALUES
('WCU/ADMIN/001', 'admin@wcu.edu.et', '$2b$10$rQZ8kJQZ8kJQZ8kJQZ8kJO8kJQZ8kJQZ8kJQZ8kJQZ8kJQZ8kJQZ8k', 'admin', 'active');

INSERT INTO user_profiles (user_id, full_name, father_name, mother_name, date_of_birth, gender, phone_number) VALUES
(1, 'System Administrator', 'Admin Father', 'Admin Mother', '1990-01-01', 'male', '+251911000000');

-- Create registrar user (password: registrar123)
INSERT INTO users (wcu_id, email, password_hash, role, status) VALUES
('WCU/REG/001', 'registrar@wcu.edu.et', '$2b$10$rQZ8kJQZ8kJQZ8kJQZ8kJO8kJQZ8kJQZ8kJQZ8kJQZ8kJQZ8kJQZ8k', 'registrar', 'active');

INSERT INTO user_profiles (user_id, full_name, father_name, mother_name, date_of_birth, gender, phone_number) VALUES
(2, 'Registrar Office', 'Registrar Father', 'Registrar Mother', '1985-05-15', 'female', '+251911000001');

-- =============================================
-- SAMPLE DEPARTMENTS
-- =============================================

-- Engineering & Technology Departments
INSERT INTO departments (college_id, name, name_amharic, code, description, requires_coc_exam) VALUES
(1, 'Computer Science & Engineering', 'የኮምፒዩተር ሳይንስ እና ምህንድስና', 'CSE', 'Software development and computer systems', FALSE),
(1, 'Electrical Engineering', 'የኤሌክትሪክ ምህንድስና', 'EE', 'Electrical systems and power engineering', FALSE),
(1, 'Civil Engineering', 'የሲቪል ምህንድስና', 'CE', 'Construction and infrastructure engineering', FALSE);

-- Medicine & Health Sciences Departments
INSERT INTO departments (college_id, name, name_amharic, code, description, requires_coc_exam) VALUES
(3, 'Medicine', 'ህክምና', 'MED', 'General medicine and healthcare', TRUE),
(3, 'Pharmacy', 'ፋርማሲ', 'PHAR', 'Pharmaceutical sciences', TRUE),
(3, 'Nursing', 'ነርሲንግ', 'NURS', 'Nursing and patient care', FALSE);

-- Business & Economics Departments
INSERT INTO departments (college_id, name, name_amharic, code, description, requires_coc_exam) VALUES
(5, 'Accounting & Finance', 'አካውንቲንግ እና ፋይናንስ', 'ACFN', 'Financial management and accounting', FALSE),
(5, 'Management', 'ማኔጅመንት', 'MGT', 'Business management and administration', FALSE),
(5, 'Economics', 'ኢኮኖሚክስ', 'ECON', 'Economic theory and policy', FALSE);

-- =============================================
-- SAMPLE PROGRAMS
-- =============================================

INSERT INTO programs (department_id, name, name_amharic, degree_type, duration_years, total_credits) VALUES
(1, 'Bachelor of Science in Computer Science', 'የኮምፒዩተር ሳይንስ ባችለር ዲግሪ', 'bachelor', 4, 120),
(2, 'Bachelor of Science in Electrical Engineering', 'የኤሌክትሪክ ምህንድስና ባችለር ዲግሪ', 'bachelor', 5, 150),
(4, 'Doctor of Medicine', 'የህክምና ዶክተር ዲግሪ', 'bachelor', 6, 180),
(5, 'Bachelor of Science in Pharmacy', 'የፋርማሲ ባችለር ዲግሪ', 'bachelor', 5, 150),
(7, 'Bachelor of Science in Accounting', 'የአካውንቲንግ ባችለር ዲግሪ', 'bachelor', 4, 120);

-- =============================================
-- SAMPLE FACULTY USERS
-- =============================================

-- Computer Science Faculty
INSERT INTO users (wcu_id, email, password_hash, role, status) VALUES
('WCU/FAC/001', 'dr.ahmed@wcu.edu.et', '$2b$10$rQZ8kJQZ8kJQZ8kJQZ8kJO8kJQZ8kJQZ8kJQZ8kJQZ8kJQZ8kJQZ8k', 'faculty', 'active'),
('WCU/FAC/002', 'dr.meron@wcu.edu.et', '$2b$10$rQZ8kJQZ8kJQZ8kJQZ8kJO8kJQZ8kJQZ8kJQZ8kJQZ8kJQZ8kJQZ8k', 'faculty', 'active');

INSERT INTO user_profiles (user_id, full_name, father_name, mother_name, date_of_birth, gender, phone_number) VALUES
(3, 'Dr. Ahmed Mohammed', 'Mohammed Ali', 'Fatima Hassan', '1980-03-20', 'male', '+251911000002'),
(4, 'Dr. Meron Tadesse', 'Tadesse Bekele', 'Almaz Worku', '1982-07-10', 'female', '+251911000003');

-- Set department head
UPDATE departments SET head_id = 3 WHERE id = 1;

-- =============================================
-- SAMPLE COURSES
-- =============================================

-- Computer Science Courses
INSERT INTO courses (department_id, code, name, name_amharic, credits, year_level, semester, course_type) VALUES
(1, 'CS101', 'Introduction to Programming', 'የፕሮግራሚንግ መግቢያ', 3, 1, 1, 'core'),
(1, 'CS102', 'Data Structures', 'የዳታ መዋቅሮች', 4, 1, 2, 'core'),
(1, 'CS201', 'Object Oriented Programming', 'ኦብጀክት ኦሪየንትድ ፕሮግራሚንግ', 4, 2, 1, 'core'),
(1, 'CS202', 'Database Systems', 'የዳታቤዝ ሲስተሞች', 3, 2, 2, 'core'),
(1, 'CS301', 'Software Engineering', 'ሶፍትዌር ምህንድስና', 4, 3, 1, 'core'),
(1, 'CS401', 'Final Year Project', 'የመጨረሻ ዓመት ፕሮጀክት', 6, 4, 1, 'core');

-- Add prerequisites
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, min_grade) VALUES
(2, 1, 'C'), -- Data Structures requires Programming
(3, 1, 'C'), -- OOP requires Programming
(4, 2, 'C'), -- Database requires Data Structures
(5, 3, 'C'), -- Software Engineering requires OOP
(6, 5, 'C'); -- Final Project requires Software Engineering

-- =============================================
-- SAMPLE STUDENTS
-- =============================================

-- Freshman Students (2024 intake)
INSERT INTO users (wcu_id, email, password_hash, role, status) VALUES
('WCU/2024/001234', 'student1@wcu.edu.et', '$2b$10$rQZ8kJQZ8kJQZ8kJQZ8kJO8kJQZ8kJQZ8kJQZ8kJQZ8kJQZ8kJQZ8k', 'student', 'active'),
('WCU/2024/001235', 'student2@wcu.edu.et', '$2b$10$rQZ8kJQZ8kJQZ8kJQZ8kJO8kJQZ8kJQZ8kJQZ8kJQZ8kJQZ8kJQZ8k', 'student', 'active'),
('WCU/2024/001236', 'student3@wcu.edu.et', '$2b$10$rQZ8kJQZ8kJQZ8kJQZ8kJO8kJQZ8kJQZ8kJQZ8kJQZ8kJQZ8kJQZ8k', 'student', 'active');

INSERT INTO user_profiles (user_id, full_name, father_name, mother_name, date_of_birth, gender, phone_number, current_address) VALUES
(5, 'Abebe Kebede', 'Kebede Alemu', 'Almaz Tesfaye', '2005-09-15', 'male', '+251911000004', 'Addis Ababa, Ethiopia'),
(6, 'Hanan Mohammed', 'Mohammed Ibrahim', 'Aisha Ahmed', '2005-12-03', 'female', '+251911000005', 'Hawassa, Ethiopia'),
(7, 'Daniel Girma', 'Girma Wolde', 'Tigist Haile', '2005-08-22', 'male', '+251911000006', 'Bahir Dar, Ethiopia');

-- Student academic records
INSERT INTO students (user_id, college_id, department_id, program_id, admission_year, current_year, current_semester, cumulative_gpa, total_credits_earned, is_freshman) VALUES
(5, 1, 1, 1, 2024, 1, 1, 3.25, 15, FALSE), -- Computer Science student
(6, 3, 4, 3, 2024, 1, 1, 3.80, 18, FALSE), -- Medicine student
(7, 5, 7, 5, 2024, 1, 1, 3.15, 12, FALSE); -- Accounting student

-- =============================================
-- SAMPLE ENROLLMENTS & GRADES
-- =============================================

-- Student 1 (Abebe) - Computer Science
INSERT INTO enrollments (student_id, course_id, academic_year, semester, grade, grade_points, status, teacher_id) VALUES
(5, 1, '2024/2025', 1, 'B+', 3.50, 'completed', 3),
(5, 2, '2024/2025', 2, 'A-', 3.75, 'enrolled', 3);

-- Student 2 (Hanan) - Medicine (excellent student)
INSERT INTO enrollments (student_id, course_id, academic_year, semester, grade, grade_points, status, teacher_id) VALUES
(6, 1, '2024/2025', 1, 'A', 4.00, 'completed', 3);

-- Student 3 (Daniel) - Accounting
INSERT INTO enrollments (student_id, course_id, academic_year, semester, grade, grade_points, status, teacher_id) VALUES
(7, 1, '2024/2025', 1, 'B', 3.00, 'completed', 3);

-- =============================================
-- SAMPLE EXAMS
-- =============================================

INSERT INTO exams (course_id, teacher_id, title, description, exam_type, start_time, end_time, duration_minutes, total_points, status) VALUES
(1, 3, 'Programming Midterm Exam', 'Midterm examination covering basic programming concepts', 'midterm', 
 '2024-12-20 09:00:00', '2024-12-20 11:00:00', 120, 100.00, 'published'),
(2, 3, 'Data Structures Final Exam', 'Final examination on data structures and algorithms', 'final',
 '2024-12-25 14:00:00', '2024-12-25 17:00:00', 180, 150.00, 'draft');

-- Sample exam questions
INSERT INTO exam_questions (exam_id, question_text, question_type, points, order_number, options, correct_answer) VALUES
(1, 'What is the output of the following Python code: print("Hello" + " " + "World")?', 'multiple_choice', 10.00, 1, 
 '["Hello World", "HelloWorld", "Hello + World", "Error"]', 'Hello World'),
(1, 'Explain the difference between a list and a tuple in Python.', 'short_answer', 15.00, 2, NULL, 
 'Lists are mutable while tuples are immutable data structures'),
(1, 'A variable in programming is a named storage location.', 'true_false', 5.00, 3, 
 '["True", "False"]', 'True');

-- =============================================
-- CAFETERIA SETUP
-- =============================================

INSERT INTO cafeteria_locations (name, name_amharic, location, capacity, operating_hours) VALUES
('Main Campus Cafeteria', 'ዋና ካምፓስ ካፌቴሪያ', 'Main Campus Building A', 500, '06:00-22:00'),
('Health Sciences Cafeteria', 'የጤና ሳይንስ ካፌቴሪያ', 'Health Sciences Complex', 200, '07:00-20:00'),
('Engineering Cafeteria', 'የምህንድስና ካፌቴሪያ', 'Engineering Block', 300, '06:30-21:00');

-- Student meal subscriptions
INSERT INTO student_meal_subscriptions (student_id, meal_plan_id, subscription_type, start_date, end_date) VALUES
(5, 1, 'cafeteria_service', '2024-09-01', '2025-06-30'),
(6, 2, 'monthly_allowance', '2024-09-01', '2025-06-30', 'CBE-1234567890'),
(7, 1, 'cafeteria_service', '2024-09-01', '2025-06-30');

-- Sample daily menus
INSERT INTO daily_menus (cafeteria_id, menu_date, meal_type, menu_items, created_by) VALUES
(1, '2024-12-18', 'breakfast', '["Bread", "Egg", "Tea", "Honey"]', 1),
(1, '2024-12-18', 'lunch', '["Injera", "Doro Wot", "Vegetable Curry", "Salad"]', 1),
(1, '2024-12-18', 'dinner', '["Rice", "Beef Stew", "Cabbage", "Fruit"]', 1);

-- =============================================
-- ID CARDS
-- =============================================

INSERT INTO id_cards (student_id, card_number, qr_code, card_type, issue_date, expiry_date, printed_by) VALUES
(5, 'WCU-ID-001234', 'QR-WCU-2024-001234', 'main_id', '2024-09-15', '2028-09-15', 1),
(6, 'WCU-ID-001235', 'QR-WCU-2024-001235', 'main_id', '2024-09-15', '2028-09-15', 1),
(7, 'WCU-ID-001236', 'QR-WCU-2024-001236', 'main_id', '2024-09-15', '2028-09-15', 1);

-- Meal cards
INSERT INTO id_cards (student_id, card_number, qr_code, card_type, issue_date, expiry_date, printed_by) VALUES
(5, 'WCU-MEAL-001234', 'QR-MEAL-2024-001234', 'meal_card', '2024-09-15', '2025-06-30', 1),
(7, 'WCU-MEAL-001236', 'QR-MEAL-2024-001236', 'meal_card', '2024-09-15', '2025-06-30', 1);

-- =============================================
-- COST SHARING AGREEMENTS
-- =============================================

INSERT INTO cost_sharing_agreements (student_id, academic_year, agreement_date, services_selected, total_estimated_cost, digital_signature) VALUES
(5, '2024/2025', '2024-09-01', '["Tuition Fee", "Dormitory", "Cafeteria Service", "Library Access", "Internet & WiFi", "Medical Services"]', 34800.00, 'DIGITAL_SIGNATURE_HASH_ABEBE'),
(6, '2024/2025', '2024-09-01', '["Tuition Fee", "Library Access", "Internet & WiFi", "Medical Services"]', 20400.00, 'DIGITAL_SIGNATURE_HASH_HANAN'),
(7, '2024/2025', '2024-09-01', '["Tuition Fee", "Dormitory", "Cafeteria Service", "Library Access", "Internet & WiFi"]', 33000.00, 'DIGITAL_SIGNATURE_HASH_DANIEL');

-- =============================================
-- LIBRARY SETUP
-- =============================================

INSERT INTO libraries (name, name_amharic, location, specialization, librarian_id, capacity) VALUES
('Central Library', 'ማዕከላዊ ቤተ መጽሃፍት', 'Main Campus', 'General', 2, 1000),
('Health Sciences Library', 'የጤና ሳይንስ ቤተ መጽሃፍት', 'Health Complex', 'Health', 2, 300),
('Technology Library', 'የቴክኖሎጂ ቤተ መጽሃፍት', 'Engineering Block', 'Technology', 2, 500);

-- Sample books
INSERT INTO books (library_id, isbn, title, author, publisher, publication_year, category, total_copies, available_copies) VALUES
(1, '978-0134685991', 'Effective Java', 'Joshua Bloch', 'Addison-Wesley', 2017, 'Programming', 5, 4),
(1, '978-0596517748', 'JavaScript: The Good Parts', 'Douglas Crockford', 'O\'Reilly Media', 2008, 'Programming', 3, 3),
(2, '978-0323661508', 'Gray\'s Anatomy for Students', 'Richard Drake', 'Elsevier', 2019, 'Medicine', 10, 8),
(3, '978-0134494166', 'Clean Code', 'Robert Martin', 'Prentice Hall', 2008, 'Software Engineering', 7, 6);

-- =============================================
-- DORMITORY SETUP
-- =============================================

INSERT INTO dormitory_blocks (block_name, block_number, gender, total_floors, total_rooms) VALUES
('Block A - Male', 'A', 'male', 3, 60),
('Block B - Female', 'B', 'female', 3, 60),
('Block C - Male', 'C', 'male', 2, 40);

-- Sample rooms
INSERT INTO dormitory_rooms (block_id, room_number, floor_number, capacity, current_occupancy) VALUES
(1, 'A101', 1, 4, 2),
(1, 'A102', 1, 4, 4),
(2, 'B201', 2, 6, 3),
(3, 'C301', 3, 4, 1);

-- Room assignments
INSERT INTO dormitory_assignments (student_id, room_id, academic_year, assignment_date, assigned_by) VALUES
(5, 1, '2024/2025', '2024-09-01', 1), -- Abebe in A101
(7, 4, '2024/2025', '2024-09-01', 1); -- Daniel in C301

-- =============================================
-- NEWS & ANNOUNCEMENTS
-- =============================================

INSERT INTO news_categories (name, name_amharic, description, target_audience) VALUES
('Academic News', 'የአካዳሚክ ዜናዎች', 'Academic announcements and updates', '["student", "faculty", "admin"]'),
('Administrative', 'አስተዳደራዊ', 'Administrative announcements', '["faculty", "admin"]'),
('Student Life', 'የተማሪ ህይወት', 'Student activities and events', '["student"]');

INSERT INTO news_posts (category_id, title, title_amharic, content, content_amharic, author_id, visibility, is_featured, publish_date) VALUES
(1, 'New Semester Registration Opens', 'የአዲስ ሴሚስተር ምዝገባ ተከፈተ', 
 'Registration for the new semester is now open. Students can register online through the digital campus portal.',
 'የአዲሱ ሴሚስተር ምዝገባ አሁን ተከፍቷል። ተማሪዎች በዲጂታል ካምፓስ ፖርታል በኩል በመስመር ላይ መመዝገብ ይችላሉ።',
 1, '["student", "faculty"]', TRUE, '2024-12-15 10:00:00'),

(3, 'Cultural Festival Next Week', 'የባህል በዓል በሚቀጥለው ሳምንት', 
 'Join us for the annual cultural festival featuring traditional music, dance, and food from all regions of Ethiopia.',
 'ከኢትዮጵያ ሁሉም ክልሎች ባህላዊ ሙዚቃ፣ ዳንስ እና ምግብ የሚያሳይ ዓመታዊ የባህል በዓል ይቀላቀሉን።',
 1, '["student"]', FALSE, '2024-12-16 14:30:00');

-- =============================================
-- SAMPLE PAYMENTS
-- =============================================

INSERT INTO payments (student_id, payment_type_id, amount, payment_method, transaction_reference, receipt_number, verified_by, verification_date, status) VALUES
(5, 1, 50.00, 'bank_transfer', 'TXN-2024-001', 'RCP-2024-001', 1, '2024-09-10 10:30:00', 'verified'),
(7, 2, 100.00, 'mobile_money', 'TXN-2024-002', 'RCP-2024-002', 1, '2024-10-15 14:20:00', 'verified');

-- =============================================
-- AUDIT LOG SAMPLES
-- =============================================

INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values, ip_address) VALUES
(1, 'CREATE_USER', 'users', 5, '{"wcu_id": "WCU/2024/001234", "role": "student"}', '192.168.1.100'),
(3, 'UPDATE_GRADE', 'enrollments', 1, '{"grade": "B+", "grade_points": 3.50}', '192.168.1.101'),
(1, 'CREATE_EXAM', 'exams', 1, '{"title": "Programming Midterm Exam", "status": "published"}', '192.168.1.100');

-- =============================================
-- UPDATE STATISTICS
-- =============================================

-- Update room occupancy
UPDATE dormitory_rooms SET current_occupancy = 2 WHERE id = 1;
UPDATE dormitory_rooms SET current_occupancy = 1 WHERE id = 4;

-- Update book availability
UPDATE books SET available_copies = 4 WHERE id = 1;
UPDATE books SET available_copies = 8 WHERE id = 3;

-- =============================================
-- PERFORMANCE OPTIMIZATION
-- =============================================

-- Analyze tables for query optimization
ANALYZE TABLE users, students, enrollments, exams, courses;

-- Update table statistics
UPDATE students SET updated_at = CURRENT_TIMESTAMP WHERE user_id IN (5, 6, 7);

COMMIT;