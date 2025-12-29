import React, { useState, useEffect } from 'react';
import SharedLayout from '../components/Layout/SharedLayout';

interface Question {
  id: string;
  type: 'mcq' | 'fill-blank' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
}

interface Exam {
  id: string;
  title: string;
  course: string;
  duration: number; // in minutes
  startTime: string;
  endTime: string;
  questions: Question[];
  status: 'upcoming' | 'active' | 'completed';
  attempts: number;
  maxAttempts: number;
}

const OnlineExamination: React.FC = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [faceVerified, setFaceVerified] = useState(false);
  const [violations, setViolations] = useState<string[]>([]);

  // Sample exam data
  const exams: Exam[] = [
    {
      id: '1',
      title: 'Data Structures and Algorithms - Midterm',
      course: 'CSE 2201',
      duration: 120,
      startTime: '2024-12-26T09:00:00',
      endTime: '2024-12-26T11:00:00',
      status: 'upcoming',
      attempts: 0,
      maxAttempts: 1,
      questions: [
        {
          id: '1',
          type: 'mcq',
          question: 'What is the time complexity of binary search?',
          options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
          correctAnswer: 'O(log n)',
          points: 5
        },
        {
          id: '2',
          type: 'fill-blank',
          question: 'A _____ is a linear data structure that follows LIFO principle.',
          correctAnswer: 'stack',
          points: 3
        },
        {
          id: '3',
          type: 'short-answer',
          question: 'Explain the difference between Array and Linked List.',
          points: 10
        }
      ]
    },
    {
      id: '2',
      title: 'Database Management Systems - Final',
      course: 'CSE 3301',
      duration: 180,
      startTime: '2024-12-28T14:00:00',
      endTime: '2024-12-28T17:00:00',
      status: 'upcoming',
      attempts: 0,
      maxAttempts: 2,
      questions: [
        {
          id: '4',
          type: 'mcq',
          question: 'Which normal form eliminates transitive dependencies?',
          options: ['1NF', '2NF', '3NF', 'BCNF'],
          correctAnswer: '3NF',
          points: 5
        }
      ]
    }
  ];

  // Timer effect
  useEffect(() => {
    if (examStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Auto-submit when time runs out
            setExamStarted(false);
            setSelectedExam(null);
            
            // Exit fullscreen
            if (document.exitFullscreen) {
              document.exitFullscreen();
            }
            
            // Clear saved answers
            if (selectedExam) {
              localStorage.removeItem(`exam_${selectedExam.id}_answers`);
            }
            
            alert('Time is up! Exam submitted automatically.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examStarted, timeRemaining, selectedExam]);

  // Anti-cheating measures
  useEffect(() => {
    if (examStarted) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setViolations(prev => [...prev, `Tab switched at ${new Date().toLocaleTimeString()}`]);
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.key === 'u')) {
          e.preventDefault();
          setViolations(prev => [...prev, `Attempted to open dev tools at ${new Date().toLocaleTimeString()}`]);
        }
      };

      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        setViolations(prev => [...prev, `Right-click attempted at ${new Date().toLocaleTimeString()}`]);
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('contextmenu', handleContextMenu);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, [examStarted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = (exam: Exam) => {
    if (!faceVerified) {
      alert('Please complete face verification first');
      return;
    }
    
    setSelectedExam(exam);
    setTimeRemaining(exam.duration * 60);
    setExamStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    
    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Auto-save to localStorage
    localStorage.setItem(`exam_${selectedExam?.id}_answers`, JSON.stringify({
      ...answers,
      [questionId]: answer
    }));
  };

  const handleSubmitExam = () => {
    if (window.confirm('Are you sure you want to submit the exam?')) {
      setExamStarted(false);
      setSelectedExam(null);
      
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      
      // Clear saved answers
      localStorage.removeItem(`exam_${selectedExam?.id}_answers`);
      
      alert('Exam submitted successfully!');
    }
  };

  const handleFaceVerification = () => {
    // Simulate face verification
    setTimeout(() => {
      setFaceVerified(true);
      alert('Face verification successful!');
    }, 2000);
  };

  if (examStarted && selectedExam) {
    const currentQ = selectedExam.questions[currentQuestion];
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#fff',
        zIndex: 9999,
        padding: '20px',
        overflow: 'auto'
      }}>
        {/* Exam Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 20px',
          background: '#7a0a2d',
          color: '#fff',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div>
            <h2 style={{margin: 0}}>{selectedExam.title}</h2>
            <p style={{margin: '5px 0 0', opacity: 0.9}}>{selectedExam.course}</p>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: '24px', fontWeight: 'bold'}}>{formatTime(timeRemaining)}</div>
            <div style={{fontSize: '14px', opacity: 0.9}}>Time Remaining</div>
          </div>
        </div>

        {/* Question Progress */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '10px 0',
          borderBottom: '1px solid #e5e5e5'
        }}>
          <span>Question {currentQuestion + 1} of {selectedExam.questions.length}</span>
          <div style={{display: 'flex', gap: '5px'}}>
            {selectedExam.questions.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: answers[selectedExam.questions[index].id] 
                    ? '#28a745' 
                    : index === currentQuestion 
                      ? '#7a0a2d' 
                      : '#e5e5e5',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Question Content */}
        <div style={{
          background: '#f8f9fa',
          padding: '30px',
          borderRadius: '8px',
          marginBottom: '20px',
          minHeight: '400px'
        }}>
          <h3 style={{marginBottom: '20px', color: '#333'}}>
            {currentQ.question} ({currentQ.points} points)
          </h3>

          {currentQ.type === 'mcq' && currentQ.options && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              {currentQ.options.map((option, index) => (
                <label
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px',
                    background: '#fff',
                    border: '2px solid #e5e5e5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="radio"
                    name={`question_${currentQ.id}`}
                    value={option}
                    checked={answers[currentQ.id] === option}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    style={{marginRight: '15px'}}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {currentQ.type === 'fill-blank' && (
            <input
              type="text"
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              placeholder="Enter your answer"
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          )}

          {currentQ.type === 'short-answer' && (
            <textarea
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              placeholder="Enter your detailed answer"
              rows={8}
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            style={{
              padding: '12px 24px',
              background: currentQuestion === 0 ? '#ccc' : '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>

          <div style={{display: 'flex', gap: '10px'}}>
            {violations.length > 0 && (
              <div style={{
                background: '#dc3545',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px'
              }}>
                ⚠️ {violations.length} violation(s)
              </div>
            )}
            
            <button
              onClick={handleSubmitExam}
              style={{
                padding: '12px 24px',
                background: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Submit Exam
            </button>
          </div>

          <button
            onClick={() => setCurrentQuestion(Math.min(selectedExam.questions.length - 1, currentQuestion + 1))}
            disabled={currentQuestion === selectedExam.questions.length - 1}
            style={{
              padding: '12px 24px',
              background: currentQuestion === selectedExam.questions.length - 1 ? '#ccc' : '#7a0a2d',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: currentQuestion === selectedExam.questions.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <SharedLayout>
      <div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
        <h1 style={{color: '#7a0a2d', marginBottom: '30px'}}>Online Examination System</h1>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #e5e5e5',
          marginBottom: '30px'
        }}>
          {['available', 'completed', 'results'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '15px 30px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #7a0a2d' : '3px solid transparent',
                color: activeTab === tab ? '#7a0a2d' : '#666',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab} Exams
            </button>
          ))}
        </div>

        {/* Face Verification */}
        {!faceVerified && (
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h3 style={{color: '#856404', marginBottom: '15px'}}>Face Verification Required</h3>
            <p style={{marginBottom: '15px'}}>
              Please complete face verification before starting any exam. This ensures exam security and prevents cheating.
            </p>
            <button
              onClick={handleFaceVerification}
              style={{
                padding: '10px 20px',
                background: '#7a0a2d',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Start Face Verification
            </button>
          </div>
        )}

        {/* Available Exams */}
        {activeTab === 'available' && (
          <div style={{display: 'grid', gap: '20px'}}>
            {exams.filter(exam => exam.status === 'upcoming').map(exam => (
              <div
                key={exam.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  padding: '25px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                  <div style={{flex: 1}}>
                    <h3 style={{color: '#7a0a2d', marginBottom: '10px'}}>{exam.title}</h3>
                    <p style={{color: '#666', marginBottom: '15px'}}>Course: {exam.course}</p>
                    
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px'}}>
                      <div>
                        <strong>Duration:</strong> {exam.duration} minutes
                      </div>
                      <div>
                        <strong>Questions:</strong> {exam.questions.length}
                      </div>
                      <div>
                        <strong>Attempts:</strong> {exam.attempts}/{exam.maxAttempts}
                      </div>
                      <div>
                        <strong>Start Time:</strong> {new Date(exam.startTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleStartExam(exam)}
                    disabled={!faceVerified || exam.attempts >= exam.maxAttempts}
                    style={{
                      padding: '12px 24px',
                      background: (!faceVerified || exam.attempts >= exam.maxAttempts) ? '#ccc' : '#28a745',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: (!faceVerified || exam.attempts >= exam.maxAttempts) ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {exam.attempts >= exam.maxAttempts ? 'No Attempts Left' : 'Start Exam'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Exams */}
        {activeTab === 'completed' && (
          <div style={{textAlign: 'center', padding: '50px', color: '#666'}}>
            <h3>No completed exams yet</h3>
            <p>Your completed exams will appear here after submission.</p>
          </div>
        )}

        {/* Results */}
        {activeTab === 'results' && (
          <div style={{textAlign: 'center', padding: '50px', color: '#666'}}>
            <h3>No results available</h3>
            <p>Exam results will be published here once graded by instructors.</p>
          </div>
        )}
      </div>
    </SharedLayout>
  );
};

export default OnlineExamination;
 