import React, { useState } from 'react';
import SharedLayout from '../components/Layout/SharedLayout';

const StudentRegistration: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: '',
    placeOfBirth: '',
    currentAddress: '',
    phoneNumber: '',
    email: '',
    
    // Academic Information
    grade8Document: null as File | null,
    grade9_12Transcript: null as File | null,
    grade12ExamResult: null as File | null,
    nationalExamScore: '',
    
    // College Selection
    selectedCollege: '',
    selectedDepartment: '',
    cocExamRequired: false,
    cocExamScore: '',
    
    // Registration Type
    registrationType: 'freshman', // freshman, continuing, department-change
    currentYear: '',
    currentSemester: '',
    studentId: ''
  });

  const colleges = [
    { id: 'engineering', name: 'Engineering & Technology', requiresCOC: false, hasPreCourses: true },
    { id: 'natural-sciences', name: 'Natural & Computational Sciences', requiresCOC: false, hasPreCourses: false },
    { id: 'medicine', name: 'Medicine & Health Sciences', requiresCOC: true, hasPreCourses: false },
    { id: 'agriculture', name: 'Agricultural Sciences', requiresCOC: false, hasPreCourses: false },
    { id: 'business', name: 'Business & Economics', requiresCOC: false, hasPreCourses: false },
    { id: 'social-sciences', name: 'Social Sciences & Humanities', requiresCOC: false, hasPreCourses: false },
    { id: 'education', name: 'Education & Behavioral Sciences', requiresCOC: false, hasPreCourses: false },
    { id: 'law', name: 'School of Law', requiresCOC: false, hasPreCourses: false },
    { id: 'veterinary', name: 'School of Veterinary Medicine', requiresCOC: true, hasPreCourses: false }
  ];

  const departments = {
    'medicine': ['Medicine', 'Pharmacy', 'Anesthesia', 'Dental Medicine', 'Nursing', 'Public Health'],
    'engineering': ['Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Computer Engineering', 'Software Engineering'],
    'natural-sciences': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Statistics'],
    'agriculture': ['Agronomy', 'Animal Science', 'Horticulture', 'Agricultural Economics', 'Natural Resource Management'],
    'business': ['Management', 'Accounting', 'Economics', 'Marketing', 'Finance'],
    'social-sciences': ['History', 'Geography', 'English Language', 'Amharic Language', 'Social Work'],
    'education': ['Educational Planning', 'Psychology', 'Curriculum & Instruction', 'Special Needs Education'],
    'law': ['Law'],
    'veterinary': ['Veterinary Medicine']
  };

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

  const handleCollegeChange = (collegeId: string) => {
    const college = colleges.find(c => c.id === collegeId);
    setFormData(prev => ({
      ...prev,
      selectedCollege: collegeId,
      selectedDepartment: '',
      cocExamRequired: college?.requiresCOC || false
    }));
  };

  const renderStep1 = () => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#7a0a2d', marginBottom: '24px', fontSize: '24px' }}>Personal Information</h2>
      
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
            Father's Name *
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
            placeholder="Enter father's name"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
            Mother's Name *
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
            placeholder="Enter mother's name"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
            Date of Birth *
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
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
            Gender *
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
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
            Place of Birth *
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
            placeholder="Enter place of birth"
          />
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
            Current Address *
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
            placeholder="Enter your current address"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
            Phone Number *
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

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            placeholder="Enter email address (optional)"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#7a0a2d', marginBottom: '24px', fontSize: '24px' }}>Academic Documents</h2>
      
      <div style={{ display: 'grid', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
            Grade 8 Ministry Document *
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload('grade8Document', e.target.files?.[0] || null)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Upload PDF, JPG, or PNG format
          </p>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
            Grade 9-12 Transcript *
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload('grade9_12Transcript', e.target.files?.[0] || null)}
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
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
            Grade 12 National Exam Result *
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload('grade12ExamResult', e.target.files?.[0] || null)}
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
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
            National Exam Score *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="700"
            value={formData.nationalExamScore}
            onChange={(e) => handleInputChange('nationalExamScore', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            placeholder="Enter your national exam score"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#7a0a2d', marginBottom: '24px', fontSize: '24px' }}>College & Department Selection</h2>
      
      <div style={{ display: 'grid', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
            Select College *
          </label>
          <select
            value={formData.selectedCollege}
            onChange={(e) => handleCollegeChange(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="">Choose a college</option>
            {colleges.map(college => (
              <option key={college.id} value={college.id}>
                {college.name}
              </option>
            ))}
          </select>
        </div>

        {formData.selectedCollege && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
              Select Department *
            </label>
            <select
              value={formData.selectedDepartment}
              onChange={(e) => handleInputChange('selectedDepartment', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">Choose a department</option>
              {departments[formData.selectedCollege as keyof typeof departments]?.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.cocExamRequired && (
          <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px', border: '1px solid #f59e0b' }}>
            <h4 style={{ color: '#92400e', marginBottom: '12px' }}>COC Exam Required</h4>
            <p style={{ color: '#92400e', fontSize: '14px', marginBottom: '16px' }}>
              This college requires a COC (Certificate of Competency) exam. Your COC score will be combined with your freshman results for department selection.
            </p>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#92400e' }}>
              COC Exam Score *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.cocExamScore}
              onChange={(e) => handleInputChange('cocExamScore', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="Enter your COC exam score"
            />
          </div>
        )}

        {colleges.find(c => c.id === formData.selectedCollege)?.hasPreCourses && (
          <div style={{ background: '#dbeafe', padding: '16px', borderRadius: '8px', border: '1px solid #3b82f6' }}>
            <h4 style={{ color: '#1e40af', marginBottom: '8px' }}>Pre-Courses Required</h4>
            <p style={{ color: '#1e40af', fontSize: '14px' }}>
              This college requires one semester of pre-courses before department selection after completing freshman year.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#7a0a2d', marginBottom: '24px', fontSize: '24px' }}>Registration Summary</h2>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
          <h4 style={{ color: '#374151', marginBottom: '12px' }}>Personal Information</h4>
          <p><strong>Name:</strong> {formData.fullName}</p>
          <p><strong>Father's Name:</strong> {formData.fatherName}</p>
          <p><strong>Mother's Name:</strong> {formData.motherName}</p>
          <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
          <p><strong>Gender:</strong> {formData.gender}</p>
          <p><strong>Phone:</strong> {formData.phoneNumber}</p>
        </div>

        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
          <h4 style={{ color: '#374151', marginBottom: '12px' }}>Academic Selection</h4>
          <p><strong>College:</strong> {colleges.find(c => c.id === formData.selectedCollege)?.name}</p>
          <p><strong>Department:</strong> {formData.selectedDepartment}</p>
          <p><strong>National Exam Score:</strong> {formData.nationalExamScore}</p>
          {formData.cocExamRequired && (
            <p><strong>COC Exam Score:</strong> {formData.cocExamScore}</p>
          )}
        </div>

        <div style={{ padding: '16px', background: '#dcfce7', borderRadius: '8px', border: '1px solid #16a34a' }}>
          <h4 style={{ color: '#15803d', marginBottom: '8px' }}>Next Steps</h4>
          <p style={{ color: '#15803d', fontSize: '14px' }}>
            After submission, you will receive a registration slip with your course list. 
            Please visit the registrar's office to complete your registration process.
          </p>
        </div>
      </div>
    </div>
  );

  const handleSubmit = () => {
    // Here you would submit the form data to the backend
    alert('Registration submitted successfully! Please visit the registrar office to complete the process.');
  };

  return (
    <SharedLayout title="Student Registration" userRole="student">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Progress Steps */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '32px',
          background: '#fff',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} style={{ 
              display: 'flex', 
              alignItems: 'center',
              flex: 1
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step >= stepNumber ? '#7a0a2d' : '#e2e8f0',
                color: step >= stepNumber ? '#fff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600'
              }}>
                {stepNumber}
              </div>
              <div style={{ 
                marginLeft: '12px',
                fontSize: '14px',
                fontWeight: '500',
                color: step >= stepNumber ? '#7a0a2d' : '#64748b'
              }}>
                {stepNumber === 1 && 'Personal Info'}
                {stepNumber === 2 && 'Documents'}
                {stepNumber === 3 && 'College Selection'}
                {stepNumber === 4 && 'Review'}
              </div>
              {stepNumber < 4 && (
                <div style={{
                  flex: 1,
                  height: '2px',
                  background: step > stepNumber ? '#7a0a2d' : '#e2e8f0',
                  marginLeft: '16px'
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '32px',
          padding: '24px',
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            style={{
              padding: '12px 24px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: '#fff',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              cursor: step === 1 ? 'not-allowed' : 'pointer',
              opacity: step === 1 ? 0.5 : 1
            }}
          >
            Previous
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                background: '#7a0a2d',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                background: '#16a34a',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Submit Registration
            </button>
          )}
        </div>
      </div>
    </SharedLayout>
  );
};

export default StudentRegistration;