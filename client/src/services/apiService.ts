import api from './api';

// ==================== STUDENT APIs ====================
export const studentAPI = {
  // Get student profile
  getProfile: async () => {
    const response = await api.get('/students/profile');
    return response.data;
  },

  // Get enrolled courses
  getCourses: async () => {
    const response = await api.get('/students/courses');
    return response.data;
  },

  // Get grades with GPA
  getGrades: async () => {
    const response = await api.get('/students/grades');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: { phone?: string; address?: string; photo_url?: string }) => {
    const response = await api.put('/students/profile', data);
    return response.data;
  },
};

// ==================== FACULTY APIs ====================
export const facultyAPI = {
  // Get faculty profile
  getProfile: async () => {
    const response = await api.get('/faculty/profile');
    return response.data;
  },

  // Get assigned courses
  getCourses: async () => {
    const response = await api.get('/faculty/courses');
    return response.data;
  },

  // Get students in a course
  getCourseStudents: async (courseId: number) => {
    const response = await api.get(`/faculty/courses/${courseId}/students`);
    return response.data;
  },

  // Submit/Update grade
  submitGrade: async (data: {
    enrollment_id: number;
    grade: number;
    letter_grade: string;
    grade_point: number;
  }) => {
    const response = await api.post('/faculty/grades', data);
    return response.data;
  },
};

// ==================== ADMIN APIs ====================
export const adminAPI = {
  // Get all users
  getUsers: async (params?: { role?: string; status?: string; search?: string }) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: number) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Create new user
  createUser: async (data: any) => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  // Update user
  updateUser: async (id: number, data: any) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: number) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Get system statistics
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

// ==================== COURSES APIs ====================
export const coursesAPI = {
  // Get all courses
  getCourses: async (params?: { department_id?: number; semester?: number; search?: string }) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  // Get course by ID
  getCourseById: async (id: number) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Create course
  createCourse: async (data: any) => {
    const response = await api.post('/courses', data);
    return response.data;
  },

  // Update course
  updateCourse: async (id: number, data: any) => {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  },

  // Delete course
  deleteCourse: async (id: number) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  // Enroll in course
  enrollCourse: async (data: { student_id: number; course_id: number }) => {
    const response = await api.post('/courses/enroll', data);
    return response.data;
  },
};

// ==================== EXAM APIs ====================
export const examAPI = {
  // Faculty: Create exam
  createExam: async (data: any) => {
    const response = await api.post('/exams/create', data);
    return response.data;
  },

  // Faculty: Add question
  addQuestion: async (data: any) => {
    const response = await api.post('/exams/questions', data);
    return response.data;
  },

  // Faculty: Publish exam
  publishExam: async (examId: number) => {
    const response = await api.put(`/exams/${examId}/publish`);
    return response.data;
  },

  // Student: Get available exams
  getAvailableExams: async () => {
    const response = await api.get('/exams/available');
    return response.data;
  },

  // Student: Start exam
  startExam: async (examId: number) => {
    const response = await api.post(`/exams/${examId}/start`);
    return response.data;
  },

  // Student: Save answer
  saveAnswer: async (data: { attempt_id: number; question_id: number; answer: string }) => {
    const response = await api.post('/exams/answers/save', data);
    return response.data;
  },

  // Student: Submit exam
  submitExam: async (attemptId: number) => {
    const response = await api.post(`/exams/${attemptId}/submit`);
    return response.data;
  },

  // Faculty: Get exam results
  getExamResults: async (examId: number) => {
    const response = await api.get(`/exams/${examId}/results`);
    return response.data;
  },

  // Log violation
  logViolation: async (data: { attempt_id: number; violation_type: string; details: string }) => {
    const response = await api.post('/exams/violations', data);
    return response.data;
  },
};

// ==================== LIBRARY APIs ====================
export const libraryAPI = {
  // Get all books
  getBooks: async (params?: {
    library_type?: string;
    category?: string;
    search?: string;
    available_only?: boolean;
  }) => {
    const response = await api.get('/library/books', { params });
    return response.data;
  },

  // Add book
  addBook: async (data: any) => {
    const response = await api.post('/library/books', data);
    return response.data;
  },

  // Borrow book
  borrowBook: async (data: { book_id: number; student_wcu_id: string; due_date: string }) => {
    const response = await api.post('/library/borrow', data);
    return response.data;
  },

  // Return book
  returnBook: async (data: { borrow_id: number }) => {
    const response = await api.post('/library/return', data);
    return response.data;
  },

  // Get my borrowed books
  getMyBooks: async () => {
    const response = await api.get('/library/my-books');
    return response.data;
  },

  // Get active borrows
  getActiveBorrows: async () => {
    const response = await api.get('/library/active-borrows');
    return response.data;
  },

  // Get overdue books
  getOverdueBooks: async () => {
    const response = await api.get('/library/overdue');
    return response.data;
  },
};

// ==================== CAFETERIA APIs ====================
export const cafeteriaAPI = {
  // Get weekly menu
  getMenu: async () => {
    const response = await api.get('/cafeteria/menu');
    return response.data;
  },

  // Update menu
  updateMenu: async (data: any) => {
    const response = await api.post('/cafeteria/menu', data);
    return response.data;
  },

  // Get my cafeteria status
  getMyStatus: async () => {
    const response = await api.get('/cafeteria/my-status');
    return response.data;
  },

  // Register preference
  registerPreference: async (data: {
    subscription_type: string;
    academic_year: string;
    semester: number;
    bank_account?: string;
  }) => {
    const response = await api.post('/cafeteria/register', data);
    return response.data;
  },

  // Record consumption
  recordConsumption: async (data: { student_wcu_id: string; meal_type: string }) => {
    const response = await api.post('/cafeteria/consume', data);
    return response.data;
  },

  // Get consumption history
  getMyConsumption: async () => {
    const response = await api.get('/cafeteria/my-consumption');
    return response.data;
  },

  // Sign cost sharing agreement
  signAgreement: async (data: any) => {
    const response = await api.post('/cafeteria/cost-sharing', data);
    return response.data;
  },

  // Get my agreements
  getMyAgreements: async () => {
    const response = await api.get('/cafeteria/my-agreements');
    return response.data;
  },
};

// ==================== NEWS APIs ====================
export const newsAPI = {
  // Get all news
  getNews: async (params?: { category?: string; visibility?: string; search?: string }) => {
    const response = await api.get('/news', { params });
    return response.data;
  },

  // Get news by ID
  getNewsById: async (id: number) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  // Create news
  createNews: async (data: any) => {
    const response = await api.post('/news', data);
    return response.data;
  },

  // Update news
  updateNews: async (id: number, data: any) => {
    const response = await api.put(`/news/${id}`, data);
    return response.data;
  },

  // Delete news
  deleteNews: async (id: number) => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },

  // Get featured news
  getFeaturedNews: async () => {
    const response = await api.get('/news/featured/list');
    return response.data;
  },
};

// ==================== STUDENT ID APIs ====================
export const studentIdAPI = {
  // Request ID card
  requestId: async (data: { photo_url: string; request_type: string }) => {
    const response = await api.post('/student-id/request', data);
    return response.data;
  },

  // Request replacement
  requestReplacement: async (data: {
    photo_url: string;
    payment_receipt: string;
    reason: string;
  }) => {
    const response = await api.post('/student-id/request-replacement', data);
    return response.data;
  },

  // Get all requests
  getRequests: async (params?: { status?: string }) => {
    const response = await api.get('/student-id/requests', { params });
    return response.data;
  },

  // Approve/Reject request
  updateRequest: async (id: number, data: { status: string; rejection_reason?: string }) => {
    const response = await api.put(`/student-id/requests/${id}`, data);
    return response.data;
  },

  // Get print data
  getPrintData: async (studentId: number) => {
    const response = await api.get(`/student-id/print/${studentId}`);
    return response.data;
  },

  // Get my card status
  getMyCard: async () => {
    const response = await api.get('/student-id/my-card');
    return response.data;
  },

  // Revoke card
  revokeCard: async (data: { card_id: number; reason: string }) => {
    const response = await api.post('/student-id/revoke', data);
    return response.data;
  },
};

// ==================== DORMITORY APIs ====================
export const dormitoryAPI = {
  // Get all blocks
  getBlocks: async () => {
    const response = await api.get('/dormitory/blocks');
    return response.data;
  },

  // Get rooms in block
  getRooms: async (blockId: number) => {
    const response = await api.get(`/dormitory/blocks/${blockId}/rooms`);
    return response.data;
  },

  // Assign student
  assignStudent: async (data: {
    student_id: number;
    room_id: number;
    academic_year: string;
    semester: number;
  }) => {
    const response = await api.post('/dormitory/assign', data);
    return response.data;
  },

  // Get my assignment
  getMyAssignment: async () => {
    const response = await api.get('/dormitory/my-assignment');
    return response.data;
  },

  // Get my roommates
  getMyRoommates: async () => {
    const response = await api.get('/dormitory/my-roommates');
    return response.data;
  },

  // Request clearance
  requestClearance: async (data: {
    items: any[];
    clearance_type: string;
    destination: string;
  }) => {
    const response = await api.post('/dormitory/clearance/request', data);
    return response.data;
  },

  // Approve clearance
  approveClearance: async (id: number, data: { notes?: string }) => {
    const response = await api.put(`/dormitory/clearance/${id}/approve`, data);
    return response.data;
  },

  // Get my clearances
  getMyClearances: async () => {
    const response = await api.get('/dormitory/my-clearances');
    return response.data;
  },
};

// ==================== PAYMENT APIs ====================
export const paymentAPI = {
  // Initiate payment
  initiatePayment: async (data: {
    payment_type: string;
    amount: number;
    description: string;
  }) => {
    const response = await api.post('/payments/initiate', data);
    return response.data;
  },

  // Submit payment proof
  submitProof: async (
    paymentId: number,
    data: { transaction_id: string; receipt_url: string; payment_method: string }
  ) => {
    const response = await api.post(`/payments/${paymentId}/proof`, data);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentId: number, data: { status: string; notes?: string }) => {
    const response = await api.put(`/payments/${paymentId}/verify`, data);
    return response.data;
  },

  // Get my payments
  getMyPayments: async () => {
    const response = await api.get('/payments/my-payments');
    return response.data;
  },

  // Get all payments
  getAllPayments: async (params?: { status?: string; payment_type?: string }) => {
    const response = await api.get('/payments/all', { params });
    return response.data;
  },

  // Get payment statistics
  getStats: async () => {
    const response = await api.get('/payments/stats');
    return response.data;
  },
};

// ==================== PARTNERSHIP APIs ====================
export const partnershipAPI = {
  // Submit partnership request
  submitRequest: async (data: any) => {
    const response = await api.post('/partnerships/request', data);
    return response.data;
  },

  // Get all requests
  getRequests: async (params?: { status?: string }) => {
    const response = await api.get('/partnerships/requests', { params });
    return response.data;
  },

  // Update request status
  updateRequest: async (
    id: number,
    data: { status: string; admin_response?: string; admin_notes?: string }
  ) => {
    const response = await api.put(`/partnerships/requests/${id}`, data);
    return response.data;
  },

  // Add partner
  addPartner: async (data: any) => {
    const response = await api.post('/partnerships/partners', data);
    return response.data;
  },

  // Get partners
  getPartners: async (params?: { featured_only?: boolean }) => {
    const response = await api.get('/partnerships/partners', { params });
    return response.data;
  },

  // Update partner
  updatePartner: async (id: number, data: any) => {
    const response = await api.put(`/partnerships/partners/${id}`, data);
    return response.data;
  },

  // Delete partner
  deletePartner: async (id: number) => {
    const response = await api.delete(`/partnerships/partners/${id}`);
    return response.data;
  },
};

// ==================== BEHAVIOR APIs ====================
export const behaviorAPI = {
  // Add behavior record
  addRecord: async (data: any) => {
    const response = await api.post('/behavior/records', data);
    return response.data;
  },

  // Get all records
  getRecords: async (params?: {
    student_id?: number;
    behavior_type?: string;
    severity?: string;
  }) => {
    const response = await api.get('/behavior/records', { params });
    return response.data;
  },

  // Get my behavior status
  getMyStatus: async () => {
    const response = await api.get('/behavior/my-status');
    return response.data;
  },

  // Update student status
  updateStatus: async (studentId: number, data: { behavior_status: string; notes?: string }) => {
    const response = await api.put(`/behavior/status/${studentId}`, data);
    return response.data;
  },

  // Get students by status
  getByStatus: async (status: string) => {
    const response = await api.get(`/behavior/by-status/${status}`);
    return response.data;
  },
};

// ==================== E-LEARNING APIs ====================
export const elearningAPI = {
  // Add resource
  addResource: async (data: any) => {
    const response = await api.post('/elearning/resources', data);
    return response.data;
  },

  // Get all resources
  getResources: async (params?: {
    platform?: string;
    category?: string;
    level?: string;
    is_free?: boolean;
    search?: string;
  }) => {
    const response = await api.get('/elearning/resources', { params });
    return response.data;
  },

  // Get resource by ID
  getResourceById: async (id: number) => {
    const response = await api.get(`/elearning/resources/${id}`);
    return response.data;
  },

  // Enroll in resource
  enroll: async (data: { resource_id: number }) => {
    const response = await api.post('/elearning/enroll', data);
    return response.data;
  },

  // Get my enrollments
  getMyEnrollments: async () => {
    const response = await api.get('/elearning/my-enrollments');
    return response.data;
  },

  // Update progress
  updateProgress: async (
    enrollmentId: number,
    data: { progress_percentage: number; completed: boolean }
  ) => {
    const response = await api.put(`/elearning/progress/${enrollmentId}`, data);
    return response.data;
  },

  // Update resource
  updateResource: async (id: number, data: any) => {
    const response = await api.put(`/elearning/resources/${id}`, data);
    return response.data;
  },

  // Delete resource
  deleteResource: async (id: number) => {
    const response = await api.delete(`/elearning/resources/${id}`);
    return response.data;
  },
};

// ==================== REGISTRAR APIs ====================
export const registrarAPI = {
  // Get all registrations
  getRegistrations: async (params?: {
    status?: string;
    semester?: number;
    year_level?: number;
    department_id?: number;
  }) => {
    const response = await api.get('/registrar/registrations', { params });
    return response.data;
  },

  // Register new student
  registerStudent: async (data: any) => {
    const response = await api.post('/registrar/register-student', data);
    return response.data;
  },

  // Approve grade
  approveGrade: async (data: { grade_id: number; approval_status: string; comments?: string }) => {
    const response = await api.post('/registrar/approve-grade', data);
    return response.data;
  },

  // Generate registration slip
  getRegistrationSlip: async (studentId: number) => {
    const response = await api.get(`/registrar/registration-slip/${studentId}`);
    return response.data;
  },

  // Get pending grades
  getPendingGrades: async () => {
    const response = await api.get('/registrar/pending-grades');
    return response.data;
  },
};

// Export all APIs
export default {
  student: studentAPI,
  faculty: facultyAPI,
  admin: adminAPI,
  courses: coursesAPI,
  exam: examAPI,
  library: libraryAPI,
  cafeteria: cafeteriaAPI,
  news: newsAPI,
  studentId: studentIdAPI,
  dormitory: dormitoryAPI,
  payment: paymentAPI,
  partnership: partnershipAPI,
  behavior: behaviorAPI,
  elearning: elearningAPI,
  registrar: registrarAPI,
};
