import React, { useState } from 'react';
import SharedLayout from '../components/Layout/SharedLayout';

interface CostSharingForm {
  id: string;
  studentId: string;
  name: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  placeOfBirth: string;
  currentAddress: string;
  phoneNumber: string;
  universityName: string;
  department: string;
  academicYear: string;
  photo: string;
  agreementAccepted: boolean;
  signature: string;
  submittedDate: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

const CostSharingAgreement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('form');
  const [currentLanguage, setCurrentLanguage] = useState<'english' | 'amharic'>('english');
  
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: '' as 'male' | 'female' | '',
    placeOfBirth: '',
    currentAddress: '',
    phoneNumber: '',
    universityName: 'Wachemo University',
    department: '',
    academicYear: '2024/25',
    photo: null as File | null,
    agreementAccepted: false,
    signature: ''
  });

  const [submissions, setSubmissions] = useState<CostSharingForm[]>([
    {
      id: '1',
      studentId: 'WCU/2024/001234',
      name: 'Abebe Kebede',
      fatherName: 'Kebede Alemu',
      motherName: 'Almaz Tadesse',
      dateOfBirth: '2000-05-15',
      gender: 'male',
      placeOfBirth: 'Addis Ababa',
      currentAddress: 'Hossana, SNNPR',
      phoneNumber: '+251911123456',
      universityName: 'Wachemo University',
      department: 'Computer Engineering',
      academicYear: '2024/25',
      photo: '/student-photos/001234.jpg',
      agreementAccepted: true,
      signature: 'Abebe Kebede',
      submittedDate: '2024-12-20',
      status: 'approved'
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.agreementAccepted) {
      alert('Please accept the cost sharing agreement to continue.');
      return;
    }

    const newSubmission: CostSharingForm = {
      id: Date.now().toString(),
      studentId: 'WCU/2024/001234',
      ...formData,
      gender: formData.gender as 'male' | 'female',
      photo: '/student-photos/new.jpg',
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'submitted'
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    
    // Reset form
    setFormData({
      name: '',
      fatherName: '',
      motherName: '',
      dateOfBirth: '',
      gender: '',
      placeOfBirth: '',
      currentAddress: '',
      phoneNumber: '',
      universityName: 'Wachemo University',
      department: '',
      academicYear: '2024/25',
      photo: null,
      agreementAccepted: false,
      signature: ''
    });

    alert('Cost sharing agreement submitted successfully!');
    setActiveTab('status');
  };

  const agreementTextEnglish = `I, the student, agree to the Cost Sharing Agreement as required by the Ethiopian Federal Government University system. After completing my education, I will repay a portion of the educational cost in accordance with the applicable legal directives. Repayment criteria, amount, and method shall be governed by the Ethiopian Cost Sharing regulations.

The cost sharing agreement includes:
1. Educational services and facilities provided by the university
2. Accommodation and dormitory services
3. Cafeteria and meal services
4. Internet and library access
5. Other university services as applicable

I understand that this agreement is legally binding and I commit to fulfilling my obligations as outlined in the Ethiopian Federal Government Cost Sharing Policy.`;

  const agreementTextAmharic = `እኔ ተማሪው በኢትዮጵያ ፌዴራል መንግስት ዩኒቨርሲቲ የትምህርት አገልግሎት በማግኘት ላይ እንደምታስፈልገኝ የክፍያ አጋር ስምምነት እቀበላለሁ። ከትምህርት ተማርኩ በኋላ በሕጋዊ መመሪያ መሠረት የትምህርት ወጪ አንድ ክፍል መክፈል እንደምክፈል እገባለሁ። የመክፈል መስፈርቶች፣ መጠን እና የመክፈል ዘዴ በኢትዮጵያ የክፍያ አጋር ሕግ መመሪያዎች ይመራሉ።

የክፍያ አጋር ስምምነቱ የሚያካትተው፦
1. በዩኒቨርሲቲው የሚሰጡ የትምህርት አገልግሎቶች እና መሳሪያዎች
2. የመኖሪያ ቤት እና የመኝታ ቤት አገልግሎቶች
3. የካፌቴሪያ እና የምግብ አገልግሎቶች
4. የኢንተርኔት እና የቤተ መጻሕፍት አገልግሎት
5. ሌሎች የዩኒቨርሲቲ አገልግሎቶች እንደሚያስፈልግ

ይህ ስምምነት በሕግ የሚያስገድድ መሆኑን ተረድቻለሁ እናም በኢትዮጵያ ፌዴራል መንግስት የክፍያ አጋር ፖሊሲ ውስጥ እንደተገለጸው ግዴታዎቼን ለመወጣት ቃል እገባለሁ።`;

  const renderCostSharingForm = () => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: '#7a0a2d', marginBottom: '8px' }}>
            {currentLanguage === 'english' 
              ? '📄 Ethiopian Federal Government University Students Cost Sharing Agreement Form'
              : '📄 የኢትዮጵያ ፌዴራል መንግስት ዩኒቨርሲቲ ተማሪዎች የክፍያ አጋር ስምምነት ቅጽ'
            }
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            {currentLanguage === 'english' 
              ? 'Complete this form to establish your cost sharing agreement with the university'
              : 'ከዩኒቨርሲቲው ጋር የክፍያ አጋር ስምምነትዎን ለማቋቋም ይህንን ቅጽ ይሙሉ'
            }
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCurrentLanguage('english')}
            style={{
              background: currentLanguage === 'english' ? '#7a0a2d' : '#f3f4f6',
              color: currentLanguage === 'english' ? '#fff' : '#374151',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            English
          </button>
          <button
            onClick={() => setCurrentLanguage('amharic')}
            style={{
              background: currentLanguage === 'amharic' ? '#7a0a2d' : '#f3f4f6',
              color: currentLanguage === 'amharic' ? '#fff' : '#374151',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            አማርኛ
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {/* Personal Information */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              {currentLanguage === 'english' ? 'Name *' : 'ስም *'}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder={currentLanguage === 'english' ? 'Enter your full name' : 'ሙሉ ስምዎን ያስገቡ'}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              {currentLanguage === 'english' ? "Father's Name *" : 'የአባት ስም *'}
            </label>
            <input
              type="text"
              value={formData.fatherName}
              onChange={(e) => handleInputChange('fatherName', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder={currentLanguage === 'english' ? "Father's name" : 'የአባትዎን ስም'}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              {currentLanguage === 'english' ? "Mother's Name *" : 'የእናት ስም *'}
            </label>
            <input
              type="text"
              value={formData.motherName}
              onChange={(e) => handleInputChange('motherName', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder={currentLanguage === 'english' ? "Mother's name" : 'የእናትዎን ስም'}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              {currentLanguage === 'english' ? 'Date of Birth *' : 'የትውልድ ቀን *'}
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              {currentLanguage === 'english' ? 'Gender *' : 'ፆታ *'}
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">{currentLanguage === 'english' ? 'Select Gender' : 'ፆታ ይምረጡ'}</option>
              <option value="male">{currentLanguage === 'english' ? 'Male' : 'ወንድ'}</option>
              <option value="female">{currentLanguage === 'english' ? 'Female' : 'ሴት'}</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              {currentLanguage === 'english' ? 'Place of Birth *' : 'የትውልድ ቦታ *'}
            </label>
            <input
              type="text"
              value={formData.placeOfBirth}
              onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder={currentLanguage === 'english' ? 'Place of birth' : 'የትውልድ ቦታ'}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              {currentLanguage === 'english' ? 'Current Address *' : 'የመኖሪያ አድራሻ *'}
            </label>
            <textarea
              value={formData.currentAddress}
              onChange={(e) => handleInputChange('currentAddress', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                minHeight: '80px'
              }}
              placeholder={currentLanguage === 'english' ? 'Current address' : 'አሁን ያሉበት አድራሻ'}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              {currentLanguage === 'english' ? 'Phone Number *' : 'ስልክ ቁጥር *'}
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="+251 or 09XXXXXXXX"
            />
          </div>
        </div>

        {/* Academic Information */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              {currentLanguage === 'english' ? 'University Name *' : 'ዩኒቨርሲቲ ስም *'}
            </label>
            <input
              type="text"
              value={formData.universityName}
              readOnly
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                background: '#f9fafb'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              {currentLanguage === 'english' ? 'Department / Program *' : 'ክፍል / መድረክ *'}
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
              placeholder={currentLanguage === 'english' ? 'Your department' : 'የእርስዎ ክፍል'}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              {currentLanguage === 'english' ? 'Academic Year *' : 'የትምህርት ዓመት *'}
            </label>
            <input
              type="text"
              value={formData.academicYear}
              onChange={(e) => handleInputChange('academicYear', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="2024/25"
            />
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            {currentLanguage === 'english' ? 'Photo Upload *' : 'ፎቶ *'}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleInputChange('photo', e.target.files?.[0] || null)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Agreement Text */}
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ color: '#374151', marginBottom: '16px' }}>
            {currentLanguage === 'english' ? 'Cost Sharing Agreement' : 'የክፍያ አጋር ስምምነት'}
          </h4>
          <div style={{ 
            fontSize: '14px', 
            lineHeight: '1.6', 
            color: '#4b5563',
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '12px',
            background: '#fff',
            borderRadius: '6px',
            border: '1px solid #d1d5db'
          }}>
            {currentLanguage === 'english' ? agreementTextEnglish : agreementTextAmharic}
          </div>
        </div>

        {/* Agreement Acceptance */}
        <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px', border: '1px solid #f59e0b' }}>
          <label style={{ display: 'flex', alignItems: 'start', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.agreementAccepted}
              onChange={(e) => handleInputChange('agreementAccepted', e.target.checked)}
              style={{ marginTop: '2px' }}
            />
            <span style={{ color: '#92400e', fontSize: '14px', fontWeight: '600' }}>
              {currentLanguage === 'english' 
                ? '✅ I accept the Cost Sharing Agreement / እቀበላለሁ'
                : '✅ የክፍያ አጋር ስምምነቱን እቀበላለሁ / I accept'
              }
            </span>
          </label>
        </div>

        {/* Signature */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            {currentLanguage === 'english' ? 'Digital Signature *' : 'ፊርማ *'}
          </label>
          <input
            type="text"
            value={formData.signature}
            onChange={(e) => handleInputChange('signature', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            placeholder={currentLanguage === 'english' ? 'Type your full name as signature' : 'እንደ ፊርማ ሙሉ ስምዎን ይተይቡ'}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!formData.agreementAccepted}
          style={{
            background: formData.agreementAccepted ? '#7a0a2d' : '#9ca3af',
            color: '#fff',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: formData.agreementAccepted ? 'pointer' : 'not-allowed'
          }}
        >
          {currentLanguage === 'english' ? 'Submit Agreement' : 'ስምምነት ያስገቡ'}
        </button>
      </div>
    </div>
  );

  const renderSubmissionStatus = () => (
    <div style={{ display: 'grid', gap: '20px' }}>
      {submissions.map(submission => (
        <div
          key={submission.id}
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
              <h3 style={{ color: '#7a0a2d', marginBottom: '8px' }}>{submission.name}</h3>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                {submission.studentId} • {submission.department}
              </p>
              <p style={{ color: '#9ca3af', fontSize: '12px' }}>
                Submitted: {new Date(submission.submittedDate).toLocaleDateString()}
              </p>
            </div>
            <span style={{
              background: submission.status === 'approved' ? '#dcfce7' : 
                         submission.status === 'submitted' ? '#fef3c7' : 
                         submission.status === 'rejected' ? '#fecaca' : '#f3f4f6',
              color: submission.status === 'approved' ? '#15803d' : 
                     submission.status === 'submitted' ? '#92400e' : 
                     submission.status === 'rejected' ? '#dc2626' : '#6b7280',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'capitalize'
            }}>
              {submission.status === 'approved' ? '✅ Approved' : 
               submission.status === 'submitted' ? '⏳ Under Review' : 
               submission.status === 'rejected' ? '❌ Rejected' : '📝 Draft'}
            </span>
          </div>

          {submission.status === 'approved' && (
            <div style={{ background: '#dcfce7', padding: '16px', borderRadius: '8px', border: '1px solid #16a34a' }}>
              <h4 style={{ color: '#15803d', marginBottom: '8px' }}>🎉 Agreement Approved!</h4>
              <p style={{ color: '#15803d', fontSize: '14px', marginBottom: '12px' }}>
                Your cost sharing agreement has been approved. You can now download your signed agreement copy.
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
                📄 Download Agreement
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <SharedLayout title="Cost Sharing Agreement" userRole="student">
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
            { id: 'form', label: 'Agreement Form', icon: '📄' },
            { id: 'status', label: 'Submission Status', icon: '📋' },
            { id: 'info', label: 'Information', icon: 'ℹ️' }
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
        {activeTab === 'form' && renderCostSharingForm()}
        {activeTab === 'status' && renderSubmissionStatus()}
        {activeTab === 'info' && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ color: '#7a0a2d', marginBottom: '24px' }}>ℹ️ Cost Sharing Information</h2>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
                <h4 style={{ color: '#0369a1', marginBottom: '12px' }}>What is Cost Sharing?</h4>
                <p style={{ color: '#0369a1', fontSize: '14px', lineHeight: '1.6' }}>
                  Cost sharing is a policy by the Ethiopian Federal Government where students receive subsidized education 
                  and services during their studies, and after graduation, they repay a portion of the educational costs 
                  through monthly deductions from their salary.
                </p>
              </div>

              <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                <h4 style={{ color: '#92400e', marginBottom: '12px' }}>Services Included</h4>
                <ul style={{ color: '#92400e', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
                  <li>Tuition and educational services</li>
                  <li>Dormitory accommodation</li>
                  <li>Cafeteria meal services</li>
                  <li>Internet and library access</li>
                  <li>Sports and recreational facilities</li>
                  <li>Medical services</li>
                </ul>
              </div>

              <div style={{ background: '#dcfce7', padding: '20px', borderRadius: '8px', border: '1px solid #16a34a' }}>
                <h4 style={{ color: '#15803d', marginBottom: '12px' }}>Important Notes</h4>
                <ul style={{ color: '#15803d', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
                  <li>This agreement must be signed annually</li>
                  <li>The agreement is legally binding</li>
                  <li>Repayment begins after graduation and employment</li>
                  <li>Monthly deductions are calculated based on salary</li>
                  <li>Keep a copy of your signed agreement for records</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </SharedLayout>
  );
};

export default CostSharingAgreement;