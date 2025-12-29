import React, { useState } from 'react';
import SharedLayout from '../components/Layout/SharedLayout';

interface Course {
  id: string;
  title: string;
  provider: 'coursera' | 'udemy' | 'edx' | 'wcu' | 'other';
  instructor: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  description: string;
  thumbnailUrl: string;
  courseUrl: string;
  price: number;
  rating: number;
  enrolledStudents: number;
  addedBy: string;
  addedDate: string;
  status: 'active' | 'inactive';
}

interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledDate: string;
  progress: number;
  completed: boolean;
  certificateUrl?: string;
}

const ELearningPlatform: React.FC = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');

  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Introduction to Machine Learning',
      provider: 'coursera',
      instructor: 'Andrew Ng',
      duration: '11 weeks',
      level: 'beginner',
      category: 'Computer Science',
      description: 'Learn the fundamentals of machine learning and artificial intelligence.',
      thumbnailUrl: 'https://via.placeholder.com/300x200',
      courseUrl: 'https://www.coursera.org/learn/machine-learning',
      price: 49,
      rating: 4.9,
      enrolledStudents: 1250,
      addedBy: 'Dr. Ahmed Mohammed',
      addedDate: '2024-12-15',
      status: 'active'
    },
    {
      id: '2',
      title: 'Complete Web Development Bootcamp',
      provider: 'udemy',
      instructor: 'Angela Yu',
      duration: '65 hours',
      level: 'beginner',
      category: 'Web Development',
      description: 'Become a full-stack web developer with just one course.',
      thumbnailUrl: 'https://via.placeholder.com/300x200',
      courseUrl: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
      price: 84.99,
      rating: 4.7,
      enrolledStudents: 890,
      addedBy: 'Dr. Fatima Hassan',
      addedDate: '2024-12-10',
      status: 'active'
    },
    {
      id: '3',
      title: 'Data Structures and Algorithms',
      provider: 'wcu',
      instructor: 'Dr. Bekele Tadesse',
      duration: '16 weeks',
      level: 'intermediate',
      category: 'Computer Science',
      description: 'Comprehensive course on data structures and algorithms for WCU students.',
      thumbnailUrl: 'https://via.placeholder.com/300x200',
      courseUrl: '/courses/dsa-wcu',
      price: 0,
      rating: 4.8,
      enrolledStudents: 450,
      addedBy: 'WCU Faculty',
      addedDate: '2024-12-01',
      status: 'active'
    }
  ]);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([
    {
      id: '1',
      studentId: 'WCU/2024/001234',
      courseId: '1',
      enrolledDate: '2024-12-20',
      progress: 65,
      completed: false
    },
    {
      id: '2',
      studentId: 'WCU/2024/001234',
      courseId: '3',
      enrolledDate: '2024-12-01',
      progress: 100,
      completed: true,
      certificateUrl: '/certificates/dsa-cert-001234.pdf'
    }
  ]);

  const [newCourseForm, setNewCourseForm] = useState({
    title: '',
    provider: 'other' as 'coursera' | 'udemy' | 'edx' | 'wcu' | 'other',
    instructor: '',
    duration: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    category: '',
    description: '',
    courseUrl: '',
    price: 0
  });

  const categories = [
    'Computer Science',
    'Web Development',
    'Data Science',
    'Business',
    'Design',
    'Marketing',
    'Engineering',
    'Medicine',
    'Languages',
    'Mathematics'
  ];

  const providers = [
    { id: 'coursera', name: 'Coursera', color: '#0056d3' },
    { id: 'udemy', name: 'Udemy', color: '#a435f0' },
    { id: 'edx', name: 'edX', color: '#02262f' },
    { id: 'wcu', name: 'WCU Internal', color: '#7a0a2d' },
    { id: 'other', name: 'Other', color: '#6b7280' }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesProvider = !selectedProvider || course.provider === selectedProvider;
    return matchesCategory && matchesProvider;
  });

  const myEnrollments = enrollments.filter(enrollment => enrollment.studentId === 'WCU/2024/001234');

  const handleEnroll = (courseId: string) => {
    const newEnrollment: Enrollment = {
      id: Date.now().toString(),
      studentId: 'WCU/2024/001234',
      courseId,
      enrolledDate: new Date().toISOString().split('T')[0],
      progress: 0,
      completed: false
    };

    setEnrollments(prev => [...prev, newEnrollment]);
    alert('Successfully enrolled in the course!');
  };

  const handleAddCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      ...newCourseForm,
      thumbnailUrl: 'https://via.placeholder.com/300x200',
      rating: 0,
      enrolledStudents: 0,
      addedBy: 'Current User',
      addedDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setCourses(prev => [newCourse, ...prev]);
    
    // Reset form
    setNewCourseForm({
      title: '',
      provider: 'other',
      instructor: '',
      duration: '',
      level: 'beginner',
      category: '',
      description: '',
      courseUrl: '',
      price: 0
    });

    alert('Course added successfully!');
    setActiveTab('browse');
  };

  const renderCourseBrowser = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Filters */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ color: '#7a0a2d', marginBottom: '16px' }}>🔍 Filter Courses</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Provider</label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">All Providers</option>
              {providers.map(provider => (
                <option key={provider.id} value={provider.id}>{provider.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredCourses.map(course => {
          const isEnrolled = myEnrollments.some(e => e.courseId === course.id);
          const enrollment = myEnrollments.find(e => e.courseId === course.id);
          const provider = providers.find(p => p.id === course.provider);

          return (
            <div
              key={course.id}
              style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                height: '160px',
                background: `linear-gradient(135deg, ${provider?.color || '#6b7280'}, #ffffff)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '48px'
              }}>
                {course.provider === 'coursera' && '🎓'}
                {course.provider === 'udemy' && '💻'}
                {course.provider === 'edx' && '📚'}
                {course.provider === 'wcu' && '🏛️'}
                {course.provider === 'other' && '🌐'}
              </div>
              
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <span style={{
                    background: provider?.color || '#6b7280',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {provider?.name}
                  </span>
                  <span style={{
                    background: course.level === 'beginner' ? '#dcfce7' : 
                               course.level === 'intermediate' ? '#fef3c7' : '#fecaca',
                    color: course.level === 'beginner' ? '#15803d' : 
                           course.level === 'intermediate' ? '#92400e' : '#dc2626',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {course.level}
                  </span>
                </div>
                
                <h4 style={{ color: '#374151', marginBottom: '8px', fontSize: '16px' }}>{course.title}</h4>
                <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '12px', lineHeight: '1.4' }}>
                  {course.description}
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', fontSize: '12px', color: '#9ca3af' }}>
                  <span>👨‍🏫 {course.instructor}</span>
                  <span>⏱️ {course.duration}</span>
                  <span>⭐ {course.rating}/5</span>
                  <span>👥 {course.enrolledStudents}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#7a0a2d' }}>
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </span>
                  
                  {isEnrolled ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {enrollment?.completed ? (
                        <span style={{
                          background: '#dcfce7',
                          color: '#15803d',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          ✅ Completed
                        </span>
                      ) : (
                        <span style={{
                          background: '#fef3c7',
                          color: '#92400e',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          📚 {enrollment?.progress}%
                        </span>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      style={{
                        background: '#7a0a2d',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMyCourses = () => (
    <div style={{ display: 'grid', gap: '20px' }}>
      {myEnrollments.map(enrollment => {
        const course = courses.find(c => c.id === enrollment.courseId);
        if (!course) return null;

        return (
          <div
            key={enrollment.id}
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ color: '#7a0a2d', marginBottom: '8px' }}>{course.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                  👨‍🏫 {course.instructor} • ⏱️ {course.duration}
                </p>
                <p style={{ color: '#9ca3af', fontSize: '12px' }}>
                  Enrolled: {new Date(enrollment.enrolledDate).toLocaleDateString()}
                </p>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                {enrollment.completed ? (
                  <div>
                    <span style={{
                      background: '#dcfce7',
                      color: '#15803d',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      ✅ Completed
                    </span>
                    {enrollment.certificateUrl && (
                      <div style={{ marginTop: '8px' }}>
                        <a
                          href={enrollment.certificateUrl}
                          style={{
                            background: '#3b82f6',
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textDecoration: 'none'
                          }}
                        >
                          📜 Certificate
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#7a0a2d' }}>
                      {enrollment.progress}%
                    </div>
                    <div style={{
                      width: '120px',
                      height: '8px',
                      background: '#e2e8f0',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginTop: '4px'
                    }}>
                      <div style={{
                        width: `${enrollment.progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #7a0a2d, #c42e53)',
                        borderRadius: '4px'
                      }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href={course.courseUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#7a0a2d',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                Continue Learning
              </a>
              <button
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                View Details
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderAddCourse = () => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#7a0a2d', marginBottom: '24px' }}>➕ Add New Course</h2>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Course Title *
            </label>
            <input
              type="text"
              value={newCourseForm.title}
              onChange={(e) => setNewCourseForm(prev => ({ ...prev, title: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="Enter course title"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Provider *
            </label>
            <select
              value={newCourseForm.provider}
              onChange={(e) => setNewCourseForm(prev => ({ ...prev, provider: e.target.value as any }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              {providers.map(provider => (
                <option key={provider.id} value={provider.id}>{provider.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Course URL *
          </label>
          <input
            type="url"
            value={newCourseForm.courseUrl}
            onChange={(e) => setNewCourseForm(prev => ({ ...prev, courseUrl: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            placeholder="https://www.coursera.org/learn/course-name"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Instructor *
            </label>
            <input
              type="text"
              value={newCourseForm.instructor}
              onChange={(e) => setNewCourseForm(prev => ({ ...prev, instructor: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="Instructor name"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Duration
            </label>
            <input
              type="text"
              value={newCourseForm.duration}
              onChange={(e) => setNewCourseForm(prev => ({ ...prev, duration: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="8 weeks"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Level
            </label>
            <select
              value={newCourseForm.level}
              onChange={(e) => setNewCourseForm(prev => ({ ...prev, level: e.target.value as any }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Price ($)
            </label>
            <input
              type="number"
              value={newCourseForm.price}
              onChange={(e) => setNewCourseForm(prev => ({ ...prev, price: Number(e.target.value) }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Category *
          </label>
          <select
            value={newCourseForm.category}
            onChange={(e) => setNewCourseForm(prev => ({ ...prev, category: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Description *
          </label>
          <textarea
            value={newCourseForm.description}
            onChange={(e) => setNewCourseForm(prev => ({ ...prev, description: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              minHeight: '100px'
            }}
            placeholder="Course description..."
          />
        </div>

        <button
          onClick={handleAddCourse}
          style={{
            background: '#7a0a2d',
            color: '#fff',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Add Course
        </button>
      </div>
    </div>
  );

  return (
    <SharedLayout title="E-Learning Platform" userRole="student">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '24px',
          background: '#fff',
          padding: '4px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          {[
            { id: 'browse', label: 'Browse Courses', icon: '🔍' },
            { id: 'my-courses', label: 'My Courses', icon: '📚' },
            { id: 'add-course', label: 'Add Course', icon: '➕' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                borderRadius: '6px',
                background: activeTab === tab.id ? '#7a0a2d' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#64748b',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'browse' && renderCourseBrowser()}
        {activeTab === 'my-courses' && renderMyCourses()}
        {activeTab === 'add-course' && renderAddCourse()}
      </div>
    </SharedLayout>
  );
};

export default ELearningPlatform;