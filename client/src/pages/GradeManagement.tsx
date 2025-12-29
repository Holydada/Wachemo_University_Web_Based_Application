import React, { useState } from 'react';
import SharedLayout from '../components/Layout/SharedLayout';

interface Grade {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  grade: string;
  gradePoints: number;
  semester: string;
  academicYear: string;
  instructor: string;
}

interface Transcript {
  semester: string;
  academicYear: string;
  courses: Grade[];
  semesterGPA: number;
  cumulativeGPA: number;
  totalCredits: number;
}

const GradeManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('current');

  // Student's grade data
  const [transcripts] = useState<Transcript[]>([
    {
      semester: 'Semester 1',
      academicYear: '2024/25',
      semesterGPA: 3.67,
      cumulativeGPA: 3.45,
      totalCredits: 18,
      courses: [
        {
          id: '1',
          courseCode: 'CS301',
          courseName: 'Data Structures and Algorithms',
          credits: 4,
          grade: 'A',
          gradePoints: 4.0,
          semester: 'Semester 1',
          academicYear: '2024/25',
          instructor: 'Dr. Ahmed Mohammed'
        },
        {
          id: '2',
          courseCode: 'CS302',
          courseName: 'Database Management Systems',
          credits: 3,
          grade: 'B+',
          gradePoints: 3.5,
          semester: 'Semester 1',
          academicYear: '2024/25',
          instructor: 'Dr. Fatima Hassan'
        },
        {
          id: '3',
          courseCode: 'MATH301',
          courseName: 'Discrete Mathematics',
          credits: 3,
          grade: 'A-',
          gradePoints: 3.7,
          semester: 'Semester 1',
          academicYear: '2024/25',
          instructor: 'Dr. Bekele Tadesse'
        },
        {
          id: '4',
          courseCode: 'ENG301',
          courseName: 'Technical Writing',
          credits: 2,
          grade: 'A',
          gradePoints: 4.0,
          semester: 'Semester 1',
          academicYear: '2024/25',
          instructor: 'Ms. Sarah Johnson'
        }
      ]
    },
    {
      semester: 'Semester 2',
      academicYear: '2023/24',
      semesterGPA: 3.25,
      cumulativeGPA: 3.35,
      totalCredits: 16,
      courses: [
        {
          id: '5',
          courseCode: 'CS201',
          courseName: 'Object Oriented Programming',
          credits: 4,
          grade: 'B',
          gradePoints: 3.0,
          semester: 'Semester 2',
          academicYear: '2023/24',
          instructor: 'Dr. Ahmed Mohammed'
        },
        {
          id: '6',
          courseCode: 'CS202',
          courseName: 'Computer Networks',
          credits: 3,
          grade: 'B+',
          gradePoints: 3.5,
          semester: 'Semester 2',
          academicYear: '2023/24',
          instructor: 'Dr. Meron Getachew'
        }
      ]
    }
  ]);

  const currentTranscript = transcripts[0];
  const allGrades = transcripts.flatMap(t => t.courses);
  const overallGPA = transcripts.length > 0 ? transcripts[0].cumulativeGPA : 0;
  const totalCreditsEarned = transcripts.reduce((sum, t) => sum + t.totalCredits, 0);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return '#28a745';
    if (grade.startsWith('B')) return '#17a2b8';
    if (grade.startsWith('C')) return '#ffc107';
    if (grade.startsWith('D')) return '#fd7e14';
    return '#dc3545';
  };

  const renderCurrentGrades = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Academic Summary */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ color: '#7a0a2d', marginBottom: '20px' }}>📊 Academic Performance Summary</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, #28a745, #20c997)', borderRadius: '12px', color: '#fff' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>{overallGPA}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Cumulative GPA</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, #17a2b8, #20c997)', borderRadius: '12px', color: '#fff' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>{currentTranscript.semesterGPA}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Current Semester GPA</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, #7a0a2d, #c42e53)', borderRadius: '12px', color: '#fff' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>{totalCreditsEarned}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Credits Earned</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, #ffc107, #fd7e14)', borderRadius: '12px', color: '#fff' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>{allGrades.length}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Completed Courses</div>
          </div>
        </div>
      </div>

      {/* Current Semester Grades */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#7a0a2d', margin: 0 }}>📚 Current Semester - {currentTranscript.semester} {currentTranscript.academicYear}</h3>
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
            <span>GPA: <strong style={{ color: '#28a745' }}>{currentTranscript.semesterGPA}</strong></span>
            <span>Credits: <strong>{currentTranscript.totalCredits}</strong></span>
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', fontWeight: '600' }}>Course</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', fontWeight: '600' }}>Credits</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', fontWeight: '600' }}>Grade</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', fontWeight: '600' }}>Points</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', fontWeight: '600' }}>Instructor</th>
              </tr>
            </thead>
            <tbody>
              {currentTranscript.courses.map((grade) => (
                <tr key={grade.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#374151' }}>{grade.courseName}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{grade.courseCode}</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{grade.credits}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      background: getGradeColor(grade.grade),
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {grade.grade}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>{grade.gradePoints.toFixed(1)}</td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>{grade.instructor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTranscript = () => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ color: '#7a0a2d', margin: 0 }}>📜 Official Transcript</h3>
        <button style={{
          background: '#7a0a2d',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          📄 Download PDF
        </button>
      </div>

      {transcripts.map((transcript, index) => (
        <div key={index} style={{ marginBottom: '32px' }}>
          <div style={{ 
            background: '#f8fafc', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h4 style={{ margin: 0, color: '#374151' }}>
              {transcript.semester} - {transcript.academicYear}
            </h4>
            <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
              <span>Semester GPA: <strong style={{ color: '#28a745' }}>{transcript.semesterGPA}</strong></span>
              <span>Cumulative GPA: <strong style={{ color: '#7a0a2d' }}>{transcript.cumulativeGPA}</strong></span>
              <span>Credits: <strong>{transcript.totalCredits}</strong></span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '12px' }}>Course Code</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '12px' }}>Course Title</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', fontSize: '12px' }}>Credits</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', fontSize: '12px' }}>Grade</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', fontSize: '12px' }}>Points</th>
                </tr>
              </thead>
              <tbody>
                {transcript.courses.map((course) => (
                  <tr key={course.id}>
                    <td style={{ padding: '10px', fontSize: '13px', fontWeight: '600' }}>{course.courseCode}</td>
                    <td style={{ padding: '10px', fontSize: '13px' }}>{course.courseName}</td>
                    <td style={{ padding: '10px', textAlign: 'center', fontSize: '13px' }}>{course.credits}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <span style={{
                        background: getGradeColor(course.grade),
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {course.grade}
                      </span>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>{course.gradePoints.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGradeAnalytics = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Grade Distribution */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ color: '#7a0a2d', marginBottom: '20px' }}>📈 Grade Distribution</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
          {['A', 'B', 'C', 'D', 'F'].map(gradeLevel => {
            const count = allGrades.filter(g => g.grade.startsWith(gradeLevel)).length;
            const percentage = allGrades.length > 0 ? ((count / allGrades.length) * 100).toFixed(1) : '0';
            
            return (
              <div key={gradeLevel} style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: getGradeColor(gradeLevel),
                  marginBottom: '8px' 
                }}>
                  {count}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Grade {gradeLevel}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Academic Progress */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ color: '#7a0a2d', marginBottom: '20px' }}>📊 Academic Progress</h3>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Degree Progress</span>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>{totalCreditsEarned}/120 Credits</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            background: '#e2e8f0', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(totalCreditsEarned / 120) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #28a745, #20c997)',
              borderRadius: '4px'
            }} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Academic Standing</span>
            <span style={{ 
              fontSize: '14px', 
              fontWeight: '600',
              color: overallGPA >= 3.0 ? '#28a745' : overallGPA >= 2.0 ? '#ffc107' : '#dc3545'
            }}>
              {overallGPA >= 3.0 ? '✅ Good Standing' : overallGPA >= 2.0 ? '⚠️ Probation' : '❌ Academic Warning'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <SharedLayout title="My Grades" userRole="student">
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
            { id: 'current', label: 'Current Grades', icon: '📚' },
            { id: 'transcript', label: 'Official Transcript', icon: '📜' },
            { id: 'analytics', label: 'Grade Analytics', icon: '📈' }
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
        {activeTab === 'current' && renderCurrentGrades()}
        {activeTab === 'transcript' && renderTranscript()}
        {activeTab === 'analytics' && renderGradeAnalytics()}
      </div>
    </SharedLayout>
  );
};

export default GradeManagement;