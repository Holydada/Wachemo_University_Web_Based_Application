import React, { useState } from 'react';
import SharedLayout from '../components/Layout/SharedLayout';

interface StudentGrade {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  gradePoints: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: string;
  academicYear: string;
  students: StudentGrade[];
}

const TeacherGradeEntry: React.FC = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      code: 'CS301',
      name: 'Data Structures and Algorithms',
      credits: 4,
      semester: 'Semester 1',
      academicYear: '2024/25',
      students: [
        {
          id: '1',
          studentId: 'WCU/2024/001234',
          studentName: 'Abebe Kebede',
          grade: 'A',
          gradePoints: 4.0,
          status: 'draft'
        },
        {
          id: '2',
          studentId: 'WCU/2024/001235',
          studentName: 'Almaz Tadesse',
          grade: 'B+',
          gradePoints: 3.5,
          status: 'submitted'
        },
        {
          id: '3',
          studentId: 'WCU/2024/001236',
          studentName: 'Dawit Haile',
          grade: '',
          gradePoints: 0,
          status: 'draft'
        }
      ]
    },
    {
      id: '2',
      code: 'CS302',
      name: 'Database Management Systems',
      credits: 3,
      semester: 'Semester 1',
      academicYear: '2024/25',
      students: [
        {
          id: '4',
          studentId: 'WCU/2024/001237',
          studentName: 'Hanan Mohammed',
          grade: 'A-',
          gradePoints: 3.7,
          status: 'approved'
        }
      ]
    }
  ]);

  const gradeScale = [
    { grade: 'A', points: 4.0, range: '90-100' },
    { grade: 'A-', points: 3.7, range: '85-89' },
    { grade: 'B+', points: 3.3, range: '80-84' },
    { grade: 'B', points: 3.0, range: '75-79' },
    { grade: 'B-', points: 2.7, range: '70-74' },
    { grade: 'C+', points: 2.3, range: '65-69' },
    { grade: 'C', points: 2.0, range: '60-64' },
    { grade: 'C-', points: 1.7, range: '55-59' },
    { grade: 'D', points: 1.0, range: '50-54' },
    { grade: 'F', points: 0.0, range: '0-49' }
  ];

  const handleGradeChange = (studentId: string, grade: string) => {
    if (!selectedCourse) return;
    
    const gradeInfo = gradeScale.find(g => g.grade === grade);
    const gradePoints = gradeInfo ? gradeInfo.points : 0;

    setCourses(prev => prev.map(course => 
      course.id === selectedCourse.id 
        ? {
            ...course,
            students: course.students.map(student =>
              student.id === studentId
                ? { ...student, grade, gradePoints, status: 'draft' as const }
                : student
            )
          }
        : course
    ));

    // Update selected course
    setSelectedCourse(prev => prev ? {
      ...prev,
      students: prev.students.map(student =>
        student.id === studentId
          ? { ...student, grade, gradePoints, status: 'draft' as const }
          : student
      )
    } : null);
  };

  const handleSubmitGrades = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? {
            ...course,
            students: course.students.map(student => ({
              ...student,
              status: student.grade ? 'submitted' as const : student.status
            }))
          }
        : course
    ));
    
    alert('Grades submitted successfully! They will be sent to the department for approval.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'submitted': return '#17a2b8';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const renderCourseList = () => (
    <div style={{ display: 'grid', gap: '20px' }}>
      {courses.map(course => {
        const totalStudents = course.students.length;
        const gradedStudents = course.students.filter(s => s.grade).length;
        const submittedStudents = course.students.filter(s => s.status === 'submitted' || s.status === 'approved').length;
        
        return (
          <div
            key={course.id}
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
                <h3 style={{ color: '#7a0a2d', marginBottom: '8px' }}>{course.name}</h3>
                <p style={{ color: '#6b7280', marginBottom: '4px' }}>
                  {course.code} • {course.credits} Credits • {course.semester} {course.academicYear}
                </p>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                  {totalStudents} students enrolled
                </p>
              </div>
              
              <button
                onClick={() => setSelectedCourse(course)}
                style={{
                  background: '#7a0a2d',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Enter Grades
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#7a0a2d' }}>{gradedStudents}/{totalStudents}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Grades Entered</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#17a2b8' }}>{submittedStudents}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Submitted</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
                  {((gradedStudents / totalStudents) * 100).toFixed(0)}%
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Complete</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderGradeEntry = () => {
    if (!selectedCourse) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <h3>Select a course to enter grades</h3>
          <p>Choose a course from the courses tab to start entering grades.</p>
        </div>
      );
    }

    return (
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ color: '#7a0a2d', marginBottom: '4px' }}>{selectedCourse.name}</h3>
            <p style={{ color: '#6b7280', margin: 0 }}>
              {selectedCourse.code} • {selectedCourse.semester} {selectedCourse.academicYear}
            </p>
          </div>
          <button
            onClick={() => setSelectedCourse(null)}
            style={{
              background: '#6b7280',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            ← Back to Courses
          </button>
        </div>

        {/* Grade Scale Reference */}
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '12px', color: '#374151' }}>Grade Scale Reference</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
            {gradeScale.map(scale => (
              <div key={scale.grade} style={{ textAlign: 'center', fontSize: '12px' }}>
                <div style={{ fontWeight: 'bold', color: '#7a0a2d' }}>{scale.grade}</div>
                <div style={{ color: '#6b7280' }}>{scale.range}%</div>
                <div style={{ color: '#9ca3af' }}>{scale.points}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Students Grade Entry */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Student</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Grade</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Points</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedCourse.students.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#374151' }}>{student.studentName}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{student.studentId}</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <select
                      value={student.grade}
                      onChange={(e) => handleGradeChange(student.id, e.target.value)}
                      disabled={student.status === 'approved'}
                      style={{
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        background: student.status === 'approved' ? '#f3f4f6' : '#fff'
                      }}
                    >
                      <option value="">Select Grade</option>
                      {gradeScale.map(scale => (
                        <option key={scale.grade} value={scale.grade}>
                          {scale.grade} ({scale.points})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>
                    {student.gradePoints.toFixed(1)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      background: getStatusColor(student.status),
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            style={{
              padding: '12px 24px',
              background: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmitGrades(selectedCourse.id)}
            style={{
              padding: '12px 24px',
              background: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Submit for Approval
          </button>
        </div>
      </div>
    );
  };

  const renderGradeReports = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ color: '#7a0a2d', marginBottom: '20px' }}>📊 Grade Distribution Summary</h3>
        
        {courses.map(course => {
          const gradeDistribution = gradeScale.map(scale => ({
            grade: scale.grade,
            count: course.students.filter(s => s.grade === scale.grade).length
          })).filter(item => item.count > 0);

          return (
            <div key={course.id} style={{ marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '12px' }}>{course.name} ({course.code})</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '12px' }}>
                {gradeDistribution.map(item => (
                  <div key={item.grade} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#7a0a2d' }}>{item.count}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Grade {item.grade}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <SharedLayout title="Grade Entry System" userRole="teacher">
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
            { id: 'courses', label: 'My Courses', icon: '📚' },
            { id: 'entry', label: 'Grade Entry', icon: '✏️' },
            { id: 'reports', label: 'Reports', icon: '📊' }
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
        {activeTab === 'courses' && renderCourseList()}
        {activeTab === 'entry' && renderGradeEntry()}
        {activeTab === 'reports' && renderGradeReports()}
      </div>
    </SharedLayout>
  );
};

export default TeacherGradeEntry;