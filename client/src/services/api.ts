import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { 
  ApiResponse, 
  PaginatedResponse, 
  LoginCredentials, 
  AuthTokens, 
  User, 
  Student,
  Exam,
  ExamSession,
  Course,
  Enrollment,
  ClearanceRequest,
  NewsPost,
  Notification
} from '../types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post('/auth/refresh', {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// API Service Class
class ApiService {
  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response = await api.post('/auth/logout');
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  }

  // User endpoints
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await api.get('/users/me');
    return response.data;
  }

  async updateProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await api.put('/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  async uploadProfilePhoto(file: File): Promise<ApiResponse<{ photo_url: string }>> {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await api.post('/users/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Student endpoints
  async getStudentProfile(studentId?: number): Promise<ApiResponse<Student>> {
    const url = studentId ? `/students/${studentId}` : '/students/me';
    const response = await api.get(url);
    return response.data;
  }

  async registerStudent(studentData: any): Promise<ApiResponse<Student>> {
    const response = await api.post('/students/register', studentData);
    return response.data;
  }

  async getStudentEnrollments(studentId?: number, academicYear?: string): Promise<ApiResponse<Enrollment[]>> {
    const params = new URLSearchParams();
    if (academicYear) params.append('academicYear', academicYear);
    
    const url = studentId 
      ? `/students/${studentId}/enrollments?${params}`
      : `/students/me/enrollments?${params}`;
    
    const response = await api.get(url);
    return response.data;
  }

  async enrollInCourse(courseId: number): Promise<ApiResponse<Enrollment>> {
    const response = await api.post('/students/enroll', { courseId });
    return response.data;
  }

  async dropCourse(enrollmentId: number): Promise<ApiResponse> {
    const response = await api.delete(`/students/enrollments/${enrollmentId}`);
    return response.data;
  }

  // Course endpoints
  async getCourses(params?: {
    departmentId?: number;
    yearLevel?: number;
    semester?: number;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Course>> {
    const response = await api.get('/courses', { params });
    return response.data;
  }

  async getCourse(courseId: number): Promise<ApiResponse<Course>> {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  }

  // Exam endpoints
  async getExams(params?: {
    courseId?: number;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Exam>> {
    const response = await api.get('/exams', { params });
    return response.data;
  }

  async getExam(examId: number): Promise<ApiResponse<Exam>> {
    const response = await api.get(`/exams/${examId}`);
    return response.data;
  }

  async startExam(examId: number): Promise<ApiResponse<ExamSession>> {
    const response = await api.post(`/exams/${examId}/start`);
    return response.data;
  }

  async submitExamAnswer(sessionId: number, questionId: number, answer: any): Promise<ApiResponse> {
    const response = await api.post(`/exams/sessions/${sessionId}/answers`, {
      questionId,
      ...answer,
    });
    return response.data;
  }

  async submitExam(sessionId: number): Promise<ApiResponse<ExamSession>> {
    const response = await api.post(`/exams/sessions/${sessionId}/submit`);
    return response.data;
  }

  async getExamSession(sessionId: number): Promise<ApiResponse<ExamSession>> {
    const response = await api.get(`/exams/sessions/${sessionId}`);
    return response.data;
  }

  async reportExamViolation(sessionId: number, violation: string, details?: any): Promise<ApiResponse> {
    const response = await api.post(`/exams/sessions/${sessionId}/violations`, {
      violation,
      details,
    });
    return response.data;
  }

  // Face verification endpoints
  async verifyFace(imageData: string, userId?: number): Promise<ApiResponse<{ success: boolean; confidence: number }>> {
    const response = await api.post('/auth/verify-face', {
      imageData,
      userId,
    });
    return response.data;
  }

  async enrollFace(imageData: string): Promise<ApiResponse> {
    const response = await api.post('/auth/enroll-face', { imageData });
    return response.data;
  }

  // Grade endpoints
  async getGrades(studentId?: number, academicYear?: string): Promise<ApiResponse<Enrollment[]>> {
    const params = new URLSearchParams();
    if (academicYear) params.append('academicYear', academicYear);
    
    const url = studentId 
      ? `/grades/student/${studentId}?${params}`
      : `/grades/me?${params}`;
    
    const response = await api.get(url);
    return response.data;
  }

  async getTranscript(studentId?: number): Promise<ApiResponse<any>> {
    const url = studentId ? `/grades/transcript/${studentId}` : '/grades/transcript';
    const response = await api.get(url);
    return response.data;
  }

  // Clearance endpoints
  async getClearanceRequests(studentId?: number): Promise<ApiResponse<ClearanceRequest[]>> {
    const url = studentId 
      ? `/clearance/student/${studentId}`
      : '/clearance/me';
    
    const response = await api.get(url);
    return response.data;
  }

  async createClearanceRequest(requestData: {
    request_type: string;
    reason: string;
    academic_year: string;
    semester: number;
  }): Promise<ApiResponse<ClearanceRequest>> {
    const response = await api.post('/clearance/request', requestData);
    return response.data;
  }

  async getClearanceStatus(requestId: number): Promise<ApiResponse<ClearanceRequest>> {
    const response = await api.get(`/clearance/requests/${requestId}`);
    return response.data;
  }

  // News endpoints
  async getNews(params?: {
    categoryId?: number;
    featured?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<NewsPost>> {
    const response = await api.get('/news', { params });
    return response.data;
  }

  async getNewsPost(postId: number): Promise<ApiResponse<NewsPost>> {
    const response = await api.get(`/news/${postId}`);
    return response.data;
  }

  // Notification endpoints
  async getNotifications(params?: {
    unreadOnly?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Notification>> {
    const response = await api.get('/notifications', { params });
    return response.data;
  }

  async markNotificationAsRead(notificationId: number): Promise<ApiResponse> {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse> {
    const response = await api.put('/notifications/read-all');
    return response.data;
  }

  // ID Card endpoints
  async requestIDCard(cardType: 'main_id' | 'meal_card', reason?: string): Promise<ApiResponse> {
    const response = await api.post('/id-cards/request', { cardType, reason });
    return response.data;
  }

  async getIDCardStatus(): Promise<ApiResponse<any[]>> {
    const response = await api.get('/id-cards/status');
    return response.data;
  }

  // Cafeteria endpoints
  async getDailyMenu(date?: string): Promise<ApiResponse<any[]>> {
    const params = date ? { date } : {};
    const response = await api.get('/cafeteria/menu', { params });
    return response.data;
  }

  async getMealUsage(startDate?: string, endDate?: string): Promise<ApiResponse<any[]>> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await api.get('/cafeteria/usage', { params });
    return response.data;
  }

  // Library endpoints
  async searchBooks(query: string, libraryId?: number): Promise<ApiResponse<any[]>> {
    const params: any = { query };
    if (libraryId) params.libraryId = libraryId;
    
    const response = await api.get('/library/search', { params });
    return response.data;
  }

  async getBookCheckouts(): Promise<ApiResponse<any[]>> {
    const response = await api.get('/library/checkouts');
    return response.data;
  }

  // Admin endpoints (for admin users)
  async getDashboardStats(): Promise<ApiResponse<any>> {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  }

  async getSystemHealth(): Promise<ApiResponse<any>> {
    const response = await api.get('/health');
    return response.data;
  }

  // File upload helper
  async uploadFile(file: File, endpoint: string): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default api; // Export the axios instance
export { api as apiClient }; // Also export with an alias