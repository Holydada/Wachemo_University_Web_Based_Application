import React, { useState } from 'react';
import SharedLayout from '../components/Layout/SharedLayout';

interface ClearanceRequest {
  id: string;
  studentId: string;
  studentName: string;
  faculty: string;
  department: string;
  section: string;
  classYear: string;
  reason: string;
  photo: string;
  requestDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  approvals: ClearanceApproval[];
}

interface ClearanceApproval {
  id: string;
  department: string;
  approverName: string;
  approverTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedDate?: string;
  comments?: string;
}

const StudentClearance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('request');
  const [formData, setFormData] = useState({
    fullName: '',
    faculty: '',
    department: '',
    section: '',
    classYear: '',
    reason: '',
    photo: null as File | null
  });

  const clearanceDepartments = [
    { id: 'dept_head', name: 'Department Head', required: true },
    { id: 'bookstore', name: 'Book Store', required: true },
    { id: 'library', name: 'Library', required: true },
    { id: 'sport_store', name: 'Sport Store', required: true },
    { id: 'dormitory', name: 'Dormitory', required: true },
    { id: 'cafeteria', name: 'Cafeteria', required: true },
    { id: 'faculty_dean', name: 'Faculty Dean', required: true },
    { id: 'student_service', name: 'Student Service Directorate', required: true },
    { id: 'registrar', name: 'Registrar', required: true }
  ];

  const [clearanceRequests, setClearanceRequests] = useState<ClearanceRequest[]>([
    {
      id: '1',
      studentId: 'WCU/2024/001234',
      studentName: 'Abebe Kebede',
      faculty: 'Engineering & Technology',
      department: 'Computer Engineering',
      section: 'A',
      classYear: '4th Year',
      reason: 'Graduation Clearance',
      photo: '/student-photos/001234.jpg',
      requestDate: '2024-12-20',
      status: 'in-progress',
      approvals: [
        {
          id: '1',
          department: 'Department Head',
          approverName: 'Dr. Ahmed Mohammed',
          approverTitle: 'Department Head',
          status: 'approved',
          approvedDate: '2024-12-21',
          comments: 'All academic requirements completed'
        },
        {
          id: '2',
          department: 'Library',
          approverName: 'Ms. Fatima Hassan',
          approverTitle: 'Head Librarian',
          status: 'approved',
          approvedDate: '2024-12-21',
          comments: 'No outstanding books'
        },
        {
          id: '3',
          department: 'Cafeteria',
          approverName: 'Mr. Bekele Tadesse',
          approverTitle: 'Cafeteria Manager',
          status: 'pending'
        }
      ]
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      photo: file
    }));
  };

  const handleSubmitRequest = () => {
    const newRequest: ClearanceRequest = {
      id: Date.now().toString(),
      studentId: 'WCU/2024/001234',
      studentName: formData.fullName,
      faculty: formData.faculty,
      department: formData.department,
      section: formData.section,
      classYear: formData.classYear,
      reason: formData.reason,
      photo: '/student-photos/new.jpg',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      approvals: clearanceDepartments.map(dept => ({
        id: Date.now().toString() + dept.id,
        department: dept.name,
        approverName: '',
        approverTitle: '',
        status: 'pending' as const
      }))
    };

    setClearanceRequests(prev => [newRequest, ...prev]);
    
    // Reset form
    setFormData({
      fullName: '',
      faculty: '',
      department: '',
      section: '',
      classYear: '',
      reason: '',
      photo: null
    });

    alert('Clearance request submitted successfully!');
    setActiveTab('status');
  };

  const renderClearanceRequest = () => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#7a0a2d', marginBottom: '24px' }}>📋 Student Clearance Request</h2>
      
      <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #f59e0b' }}>
        <h4 style={{ color: '#92400e', marginBottom: '8px' }}>📸 Face Verification Required</h4>
        <p style={{ color: '#92400e', fontSize: '14px', margin: 0 }}>
          Please complete face verification before submitting your clearance request for security purposes.
        </p>
        <button style={{
          background: '#f59e0b',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          marginTop: '8px'
        }}>
          Start Face Verification
        </button>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Faculty *
            </label>
            <select
              value={formData.faculty}
              onChange={(e) => handleInputChange('faculty', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">Select Faculty</option>
              <option value="Engineering & Technology">Engineering & Technology</option>
              <option value="Natural & Computational Sciences">Natural & Computational Sciences</option>
              <option value="Medicine & Health Sciences">Medicine & Health Sciences</option>
              <option value="Agricultural Sciences">Agricultural Sciences</option>
              <option value="Business & Economics">Business & Economics</option>
              <option value="Social Sciences & Humanities">Social Sciences & Humanities</option>
              <option value="Education & Behavioral Sciences">Education & Behavioral Sciences</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Department *
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="Your department"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Section *
            </label>
            <input
              type="text"
              value={formData.section}
              onChange={(e) => handleInputChange('section', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="A, B, C..."
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Class Year *
            </label>
            <select
              value={formData.classYear}
              onChange={(e) => handleInputChange('classYear', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="5th Year">5th Year</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Reason for Clearance *
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              minHeight: '100px'
            }}
            placeholder="Explain why you need clearance (e.g., Graduation, Transfer, etc.)"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Student Photo *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Upload a recent passport-size photo
          </p>
        </div>

        <button
          onClick={handleSubmitRequest}
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
          Submit Clearance Request
        </button>
      </div>
    </div>
  );

  const renderClearanceStatus = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      {clearanceRequests.map(request => (
        <div
          key={request.id}
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
            <div>
              <h3 style={{ color: '#7a0a2d', marginBottom: '8px' }}>{request.studentName}</h3>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                {request.studentId} • {request.faculty}
              </p>
              <p style={{ color: '#9ca3af', fontSize: '12px' }}>
                Requested: {new Date(request.requestDate).toLocaleDateString()}
              </p>
            </div>
            <span style={{
              background: request.status === 'completed' ? '#dcfce7' : 
                         request.status === 'in-progress' ? '#fef3c7' : 
                         request.status === 'rejected' ? '#fecaca' : '#f3f4f6',
              color: request.status === 'completed' ? '#15803d' : 
                     request.status === 'in-progress' ? '#92400e' : 
                     request.status === 'rejected' ? '#dc2626' : '#6b7280',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'capitalize'
            }}>
              {request.status === 'in-progress' ? '🔄 In Progress' : 
               request.status === 'completed' ? '✅ Completed' : 
               request.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
            </span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#374151', marginBottom: '12px' }}>Clearance Progress</h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              {clearanceDepartments.map(dept => {
                const approval = request.approvals.find(a => a.department === dept.name);
                return (
                  <div
                    key={dept.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: approval?.status === 'approved' ? '#f0fdf4' : 
                                 approval?.status === 'rejected' ? '#fef2f2' : '#f8fafc',
                      border: '1px solid ' + (approval?.status === 'approved' ? '#bbf7d0' : 
                                             approval?.status === 'rejected' ? '#fecaca' : '#e2e8f0'),
                      borderRadius: '8px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{dept.name}</div>
                      {approval?.approverName && (
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {approval.approverName} - {approval.approverTitle}
                        </div>
                      )}
                      {approval?.comments && (
                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                          "{approval.comments}"
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        background: approval?.status === 'approved' ? '#dcfce7' : 
                                   approval?.status === 'rejected' ? '#fecaca' : '#fef3c7',
                        color: approval?.status === 'approved' ? '#15803d' : 
                               approval?.status === 'rejected' ? '#dc2626' : '#92400e',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {approval?.status === 'approved' ? '✅ Approved' : 
                         approval?.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                      </span>
                      {approval?.approvedDate && (
                        <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>
                          {new Date(approval.approvedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {request.status === 'completed' && (
            <div style={{ background: '#dcfce7', padding: '16px', borderRadius: '8px', border: '1px solid #16a34a' }}>
              <h4 style={{ color: '#15803d', marginBottom: '8px' }}>🎉 Clearance Completed!</h4>
              <p style={{ color: '#15803d', fontSize: '14px', marginBottom: '12px' }}>
                Your clearance has been approved by all departments. You can now download your clearance certificate.
              </p>
              <button style={{
                background: '#16a34a',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                📄 Download Certificate
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <SharedLayout title="Student Clearance" userRole="student">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
            { id: 'request', label: 'New Request', icon: '📝' },
            { id: 'status', label: 'Request Status', icon: '📋' },
            { id: 'guide', label: 'Process Guide', icon: '📖' }
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
        {activeTab === 'request' && renderClearanceRequest()}
        {activeTab === 'status' && renderClearanceStatus()}
        {activeTab === 'guide' && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ color: '#7a0a2d', marginBottom: '24px' }}>📖 Clearance Process Guide</h2>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
                <h4 style={{ color: '#0369a1', marginBottom: '8px' }}>Step 1: Submit Request</h4>
                <p style={{ color: '#0369a1', fontSize: '14px', margin: 0 }}>
                  Fill out the clearance form with your personal information and reason for clearance.
                </p>
              </div>
              
              <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                <h4 style={{ color: '#92400e', marginBottom: '8px' }}>Step 2: Department Approvals</h4>
                <p style={{ color: '#92400e', fontSize: '14px', margin: 0 }}>
                  Your request will be sent to all relevant departments for approval. Each department will review and approve/reject your request.
                </p>
              </div>
              
              <div style={{ background: '#dcfce7', padding: '16px', borderRadius: '8px', border: '1px solid #16a34a' }}>
                <h4 style={{ color: '#15803d', marginBottom: '8px' }}>Step 3: Final Approval</h4>
                <p style={{ color: '#15803d', fontSize: '14px', margin: 0 }}>
                  Once all departments approve, the registrar will give final approval and you can download your clearance certificate.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <h4 style={{ color: '#374151', marginBottom: '12px' }}>Required Departments:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {clearanceDepartments.map(dept => (
                  <div key={dept.id} style={{ padding: '8px', background: '#f8fafc', borderRadius: '6px', fontSize: '14px' }}>
                    ✓ {dept.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </SharedLayout>
  );
};

export default StudentClearance;