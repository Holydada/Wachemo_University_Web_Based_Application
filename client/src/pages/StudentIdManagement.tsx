import React, { useState } from 'react';
import SharedLayout from '../components/Layout/SharedLayout';

interface IdRequest {
  id: string;
  studentId: string;
  studentName: string;
  college: string;
  department: string;
  year: string;
  section: string;
  requestType: 'new' | 'replacement';
  reason?: string;
  status: 'pending' | 'approved' | 'printed' | 'rejected';
  requestDate: string;
  photo?: string;
  paymentReceipt?: string;
}

const StudentIdManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('request');
  const [formData, setFormData] = useState({
    fullName: '',
    college: '',
    department: '',
    section: '',
    academicYear: '',
    photo: null as File | null,
    requestType: 'new' as 'new' | 'replacement',
    reason: '',
    paymentReceipt: null as File | null
  });

  const [requests] = useState<IdRequest[]>([
    {
      id: '1',
      studentId: 'WCU/2024/001234',
      studentName: 'Abebe Kebede',
      college: 'Engineering & Technology',
      department: 'Computer Engineering',
      year: '2nd Year',
      section: 'A',
      requestType: 'new',
      status: 'approved',
      requestDate: '2024-12-20'
    },
    {
      id: '2',
      studentId: 'WCU/2024/001235',
      studentName: 'Almaz Tadesse',
      college: 'Natural Sciences',
      department: 'Computer Science',
      year: '3rd Year',
      section: 'B',
      requestType: 'replacement',
      reason: 'Lost ID card',
      status: 'pending',
      requestDate: '2024-12-22'
    }
  ]);

  const colleges = [
    'Engineering & Technology',
    'Natural & Computational Sciences',
    'Medicine & Health Sciences',
    'Agricultural Sciences',
    'Business & Economics',
    'Social Sciences & Humanities',
    'Education & Behavioral Sciences',
    'School of Law',
    'School of Veterinary Medicine'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const renderIdRequest = () => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#7a0a2d', marginBottom: '24px' }}>Student ID Card Request</h2>
      
      <div style={{ display: 'grid', gap: '24px' }}>
        {/* Request Type */}
        <div>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#374151' }}>
            Request Type *
          </label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="requestType"
                value="new"
                checked={formData.requestType === 'new'}
                onChange={(e) => handleInputChange('requestType', e.target.value)}
              />
              <span>New ID Card</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="requestType"
                value="replacement"
                checked={formData.requestType === 'replacement'}
                onChange={(e) => handleInputChange('requestType', e.target.value)}
              />
              <span>Replacement ID Card</span>
            </label>
          </div>
        </div>

        {/* Personal Information */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
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
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
              College *
            </label>
            <select
              value={formData.college}
              onChange={(e) => handleInputChange('college', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">Select College</option>
              {colleges.map(college => (
                <option key={college} value={college}>{college}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
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
              placeholder="Enter your department"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
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
              placeholder="Enter your section (e.g., A, B, C)"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
              Academic Year *
            </label>
            <select
              value={formData.academicYear}
              onChange={(e) => handleInputChange('academicYear', e.target.value)}
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

        {/* Photo Upload */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
            Student Photo *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload('photo', e.target.files?.[0] || null)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Upload a clear passport-size photo (JPG, PNG format)
          </p>
        </div>

        {/* Replacement Reason */}
        {formData.requestType === 'replacement' && (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Reason for Replacement *
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
                  minHeight: '80px'
                }}
                placeholder="Explain why you need a replacement ID card"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Payment Receipt *
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload('paymentReceipt', e.target.files?.[0] || null)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Upload payment receipt for replacement fee
              </p>
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
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
          Submit ID Request
        </button>
      </div>
    </div>
  );

  const renderIdPreview = () => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#7a0a2d', marginBottom: '24px' }}>Digital ID Card Preview</h2>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        {/* ID Card Front */}
        <div style={{
          width: '350px',
          height: '220px',
          background: 'linear-gradient(135deg, #7a0a2d, #c42e53)',
          borderRadius: '12px',
          padding: '20px',
          color: '#fff',
          position: 'relative',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
        }}>
          {/* University Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#fff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7a0a2d',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              WCU
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Wachemo University</div>
              <div style={{ fontSize: '10px', opacity: 0.9 }}>Main Campus</div>
            </div>
          </div>

          {/* Student Info */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: '#fff',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7a0a2d',
              fontSize: '12px'
            }}>
              PHOTO
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                Abebe Kebede
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '2px' }}>
                WCU/2024/001234
              </div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>
                Computer Engineering • 2nd Year
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            width: '40px',
            height: '40px',
            background: '#fff',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7a0a2d',
            fontSize: '10px'
          }}>
            QR
          </div>
        </div>
      </div>

      {/* ID Card Back Preview */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '350px',
          height: '220px',
          background: '#f8f9fa',
          border: '2px solid #e2e8f0',
          borderRadius: '12px',
          padding: '20px',
          color: '#374151'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#7a0a2d' }}>
              WACHEMO UNIVERSITY
            </div>
            <div style={{ fontSize: '10px', color: '#6b7280' }}>
              Main Campus, Hossana, Ethiopia
            </div>
          </div>

          <div style={{ fontSize: '10px', lineHeight: '1.4', marginBottom: '12px' }}>
            "The bearer of this card is a student in Wachemo University Main Campus"
          </div>

          <div style={{ fontSize: '9px', color: '#6b7280' }}>
            <div>📧 info@wcu.edu.et</div>
            <div>📞 +251-46-550-0123</div>
            <div>🌐 www.wcu.edu.et</div>
            <div>📍 P.O. Box 667, Hossana</div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            fontSize: '8px',
            color: '#6b7280'
          }}>
            University Seal
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequestStatus = () => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#7a0a2d', marginBottom: '24px' }}>ID Request Status</h2>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {requests.map((request) => (
          <div key={request.id} style={{
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'start', marginBottom: '12px' }}>
              <div>
                <h4 style={{ margin: '0 0 8px', color: '#374151' }}>{request.studentName}</h4>
                <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#6b7280' }}>
                  {request.studentId} • {request.college}
                </p>
                <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                  {request.department} • {request.year} • Section {request.section}
                </p>
              </div>
              <span style={{
                background: request.status === 'approved' ? '#dcfce7' : 
                           request.status === 'pending' ? '#fef3c7' : '#fecaca',
                color: request.status === 'approved' ? '#15803d' : 
                       request.status === 'pending' ? '#92400e' : '#dc2626',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {request.status}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
              <span>Type: {request.requestType}</span>
              <span>Requested: {request.requestDate}</span>
              {request.reason && <span>Reason: {request.reason}</span>}
            </div>

            {request.status === 'approved' && (
              <div style={{ marginTop: '12px' }}>
                <button style={{
                  background: '#28a745',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  marginRight: '8px'
                }}>
                  Print ID Card
                </button>
                <button style={{
                  background: '#17a2b8',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  Download Digital Copy
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <SharedLayout title="Student ID Management" userRole="student">
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
            { id: 'request', label: 'Request ID', icon: '📝' },
            { id: 'preview', label: 'ID Preview', icon: '🆔' },
            { id: 'status', label: 'Request Status', icon: '📋' }
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
        {activeTab === 'request' && renderIdRequest()}
        {activeTab === 'preview' && renderIdPreview()}
        {activeTab === 'status' && renderRequestStatus()}
      </div>
    </SharedLayout>
  );
};

export default StudentIdManagement;