// Online Exam System JavaScript

class ExamSystem {
    constructor() {
        this.currentQuestion = 15;
        this.totalQuestions = 50;
        this.timeRemaining = 6332; // seconds (1:45:32)
        this.violations = 0;
        this.maxViolations = 3;
        this.answers = {};
        this.flaggedQuestions = [16];
        this.isFullscreen = false;
        this.autoSaveInterval = null;
        this.timerInterval = null;
        
        this.init();
    }
    
    init() {
        this.enforceFullscreen();
        this.startTimer();
        this.setupAutoSave();
        this.setupSecurityMonitoring();
        this.setupEventListeners();
        this.disableRightClick();
        this.preventCopyPaste();
        this.loadExamData();
        
        console.log('Exam system initialized');
    }
    
    // Security Functions
    enforceFullscreen() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
        
        this.isFullscreen = true;
    }
    
    setupSecurityMonitoring() {
        // Monitor tab switching and focus loss
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.recordViolation('Tab switch or window focus lost');
            }
        });
        
        window.addEventListener('blur', () => {
            this.recordViolation('Window lost focus');
        });
        
        // Monitor fullscreen exit
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                this.recordViolation('Exited fullscreen mode');
                setTimeout(() => this.enforceFullscreen(), 1000);
            }
        });
        
        // Monitor keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Prevent common shortcuts
            if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a' || e.key === 's')) {
                e.preventDefault();
                this.recordViolation(`Attempted keyboard shortcut: Ctrl+${e.key.toUpperCase()}`);
            }
            
            // Prevent F12, F5, etc.
            if (e.key === 'F12' || e.key === 'F5' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
                this.recordViolation('Attempted to open developer tools');
            }
        });
    }
    
    recordViolation(type) {
        this.violations++;
        console.warn(`Security violation: ${type}. Count: ${this.violations}`);
        
        // Update violation display
        document.getElementById('violationCount').textContent = this.violations;
        
        // Show violation warning
        this.showSecurityWarning();
        
        // Auto-submit if max violations reached
        if (this.violations >= this.maxViolations) {
            this.autoSubmitExam('Maximum security violations reached');
        }
    }
    
    showSecurityWarning() {
        const overlay = document.getElementById('securityOverlay');
        overlay.style.display = 'flex';
    }
    
    acknowledgeViolation() {
        const overlay = document.getElementById('securityOverlay');
        overlay.style.display = 'none';
    }
    
    disableRightClick() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.recordViolation('Right-click attempted');
        });
    }
    
    preventCopyPaste() {
        document.addEventListener('copy', (e) => {
            e.preventDefault();
            this.recordViolation('Copy attempted');
        });
        
        document.addEventListener('paste', (e) => {
            e.preventDefault();
            this.recordViolation('Paste attempted');
        });
    }
    
    // Timer Functions
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.autoSubmitExam('Time expired');
            }
            
            // Warning at 5 minutes
            if (this.timeRemaining === 300) {
                this.showTimeWarning();
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        const hours = Math.floor(this.timeRemaining / 3600);
        const minutes = Math.floor((this.timeRemaining % 3600) / 60);
        const seconds = this.timeRemaining % 60;
        
        const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('examTimer').textContent = display;
        
        // Change color when time is running low
        const timerElement = document.getElementById('examTimer');
        if (this.timeRemaining <= 300) { // 5 minutes
            timerElement.style.color = '#ef4444';
        } else if (this.timeRemaining <= 900) { // 15 minutes
            timerElement.style.color = '#f59e0b';
        }
    }
    
    showTimeWarning() {
        alert('Warning: Only 5 minutes remaining!');
    }
    
    // Auto-save Functions
    setupAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.saveProgress();
        }, 30000); // Save every 30 seconds
        
        // Save on answer change
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio' || e.target.tagName === 'TEXTAREA') {
                this.saveCurrentAnswer();
                this.updateAutoSaveIndicator();
            }
        });
    }
    
    saveProgress() {
        const examData = {
            currentQuestion: this.currentQuestion,
            answers: this.answers,
            flaggedQuestions: this.flaggedQuestions,
            timeRemaining: this.timeRemaining,
            violations: this.violations,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage (in real app, would save to server)
        localStorage.setItem('examProgress', JSON.stringify(examData));
        this.updateAutoSaveIndicator();
    }
    
    saveCurrentAnswer() {
        const questionKey = `question${this.currentQuestion}`;
        const selectedAnswer = document.querySelector(`input[name="${questionKey}"]:checked`);
        const explanation = document.getElementById('explanation');
        
        if (selectedAnswer || explanation.value) {
            this.answers[this.currentQuestion] = {
                answer: selectedAnswer ? selectedAnswer.value : null,
                explanation: explanation.value,
                timestamp: new Date().toISOString()
            };
        }
        
        this.updateQuestionStatus();
    }
    
    updateAutoSaveIndicator() {
        const indicator = document.querySelector('.auto-save-indicator');
        indicator.innerHTML = '<i class="fas fa-check-circle text-success me-1"></i>Auto-saved';
        
        setTimeout(() => {
            indicator.innerHTML = '<i class="fas fa-save text-muted me-1"></i>Saving...';
        }, 2000);
    }
    
    // Navigation Functions
    goToQuestion(questionNumber) {
        if (questionNumber >= 1 && questionNumber <= this.totalQuestions) {
            this.saveCurrentAnswer();
            this.currentQuestion = questionNumber;
            this.loadQuestion(questionNumber);
            this.updateNavigator();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions) {
            this.goToQuestion(this.currentQuestion + 1);
        }
    }
    
    previousQuestion() {
        if (this.currentQuestion > 1) {
            this.goToQuestion(this.currentQuestion - 1);
        }
    }
    
    loadQuestion(questionNumber) {
        // In a real application, this would load question data from server
        console.log(`Loading question ${questionNumber}`);
        
        // Update question header
        document.querySelector('.question-header h5').textContent = `Question ${questionNumber} of ${this.totalQuestions}`;
        
        // Load saved answer if exists
        if (this.answers[questionNumber]) {
            const savedAnswer = this.answers[questionNumber];
            if (savedAnswer.answer) {
                const radio = document.querySelector(`input[name="question${questionNumber}"][value="${savedAnswer.answer}"]`);
                if (radio) radio.checked = true;
            }
            if (savedAnswer.explanation) {
                document.getElementById('explanation').value = savedAnswer.explanation;
            }
        } else {
            // Clear form
            document.querySelectorAll(`input[name="question${questionNumber}"]`).forEach(input => {
                input.checked = false;
            });
            document.getElementById('explanation').value = '';
        }
    }
    
    updateNavigator() {
        // Update question numbers in navigator
        document.querySelectorAll('.question-number').forEach(btn => {
            btn.classList.remove('current');
        });
        
        const currentBtn = document.querySelector(`.question-number:nth-child(${this.currentQuestion})`);
        if (currentBtn) {
            currentBtn.classList.add('current');
        }
        
        // Update progress
        const answeredCount = Object.keys(this.answers).length;
        const progressPercent = (answeredCount / this.totalQuestions) * 100;
        document.querySelector('.progress-bar').style.width = `${progressPercent}%`;
        document.querySelector('.navigator-header small').textContent = `${answeredCount} of ${this.totalQuestions} questions answered`;
    }
    
    updateQuestionStatus() {
        const questionBtn = document.querySelector(`.question-number:nth-child(${this.currentQuestion})`);
        if (questionBtn && this.answers[this.currentQuestion]) {
            questionBtn.classList.add('answered');
        }
    }
    
    // Question Actions
    flagQuestion() {
        if (!this.flaggedQuestions.includes(this.currentQuestion)) {
            this.flaggedQuestions.push(this.currentQuestion);
            const questionBtn = document.querySelector(`.question-number:nth-child(${this.currentQuestion})`);
            if (questionBtn) {
                questionBtn.classList.add('flagged');
            }
        }
        
        // Update flagged count in navigator
        document.querySelector('.btn-outline-warning').innerHTML = 
            `<i class="fas fa-flag me-1"></i>Review Flagged (${this.flaggedQuestions.length})`;
    }
    
    clearAnswer() {
        document.querySelectorAll(`input[name="question${this.currentQuestion}"]`).forEach(input => {
            input.checked = false;
        });
        document.getElementById('explanation').value = '';
        
        // Remove from answers
        delete this.answers[this.currentQuestion];
        
        // Update question status
        const questionBtn = document.querySelector(`.question-number:nth-child(${this.currentQuestion})`);
        if (questionBtn) {
            questionBtn.classList.remove('answered');
        }
        
        this.updateNavigator();
    }
    
    markForReview() {
        this.flagQuestion();
        alert('Question marked for review');
    }
    
    // Submission Functions
    submitExam() {
        const modal = new bootstrap.Modal(document.getElementById('submitModal'));
        this.updateSubmissionSummary();
        modal.show();
    }
    
    updateSubmissionSummary() {
        const answeredCount = Object.keys(this.answers).length;
        const notAnswered = this.totalQuestions - answeredCount;
        const timeUsed = 7200 - this.timeRemaining; // 2 hours - remaining
        
        // Update summary display
        document.querySelector('.submission-summary').innerHTML = `
            <h6>Exam Summary</h6>
            <div class="row">
                <div class="col-md-6">
                    <ul class="list-unstyled">
                        <li><strong>Total Questions:</strong> ${this.totalQuestions}</li>
                        <li><strong>Answered:</strong> ${answeredCount}</li>
                        <li><strong>Flagged:</strong> ${this.flaggedQuestions.length}</li>
                        <li><strong>Not Answered:</strong> ${notAnswered}</li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <ul class="list-unstyled">
                        <li><strong>Time Used:</strong> ${this.formatTime(timeUsed)}</li>
                        <li><strong>Time Remaining:</strong> ${this.formatTime(this.timeRemaining)}</li>
                        <li><strong>Violations:</strong> ${this.violations}</li>
                        <li><strong>Auto-saves:</strong> ${answeredCount}</li>
                    </ul>
                </div>
            </div>
            
            ${notAnswered > 0 ? `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>Warning:</strong> You have ${notAnswered} unanswered questions. 
                Are you sure you want to submit your exam?
            </div>
            ` : ''}
            
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="confirmSubmission">
                <label class="form-check-label" for="confirmSubmission">
                    I confirm that I want to submit my exam. I understand that I cannot make changes after submission.
                </label>
            </div>
        `;
        
        // Enable/disable submit button based on checkbox
        document.getElementById('confirmSubmission').addEventListener('change', (e) => {
            document.getElementById('finalSubmitBtn').disabled = !e.target.checked;
        });
    }
    
    finalSubmit() {
        // Clear intervals
        clearInterval(this.timerInterval);
        clearInterval(this.autoSaveInterval);
        
        // Prepare submission data
        const submissionData = {
            studentId: 'WCU/2024/001234',
            examId: 'CS301_MIDTERM_2025',
            answers: this.answers,
            flaggedQuestions: this.flaggedQuestions,
            violations: this.violations,
            timeUsed: 7200 - this.timeRemaining,
            submissionTime: new Date().toISOString()
        };
        
        // In real application, send to server
        console.log('Submitting exam:', submissionData);
        
        // Show success message and redirect
        alert('Exam submitted successfully!');
        window.location.href = 'student-dashboard.html';
    }
    
    autoSubmitExam(reason) {
        console.log(`Auto-submitting exam: ${reason}`);
        alert(`Exam automatically submitted: ${reason}`);
        this.finalSubmit();
    }
    
    // Utility Functions
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    loadExamData() {
        // Load saved progress if exists
        const savedProgress = localStorage.getItem('examProgress');
        if (savedProgress) {
            const data = JSON.parse(savedProgress);
            this.answers = data.answers || {};
            this.flaggedQuestions = data.flaggedQuestions || [];
            this.violations = data.violations || 0;
            // Note: Don't restore time for security
        }
        
        this.updateNavigator();
    }
    
    setupEventListeners() {
        // Confirmation checkbox
        document.addEventListener('change', (e) => {
            if (e.target.id === 'confirmSubmission') {
                document.getElementById('finalSubmitBtn').disabled = !e.target.checked;
            }
        });
    }
}

// Global functions for HTML onclick events
function goToQuestion(num) {
    examSystem.goToQuestion(num);
}

function nextQuestion() {
    examSystem.nextQuestion();
}

function previousQuestion() {
    examSystem.previousQuestion();
}

function flagQuestion() {
    examSystem.flagQuestion();
}

function clearAnswer() {
    examSystem.clearAnswer();
}

function markForReview() {
    examSystem.markForReview();
}

function submitExam() {
    examSystem.submitExam();
}

function finalSubmit() {
    examSystem.finalSubmit();
}

function acknowledgeViolation() {
    examSystem.acknowledgeViolation();
}

// Initialize exam system when page loads
let examSystem;
document.addEventListener('DOMContentLoaded', function() {
    examSystem = new ExamSystem();
});

// Prevent page unload without warning
window.addEventListener('beforeunload', function(e) {
    e.preventDefault();
    e.returnValue = 'Are you sure you want to leave the exam? Your progress will be lost.';
});

// Face verification simulation
function startFaceVerification() {
    const modal = new bootstrap.Modal(document.getElementById('faceVerificationModal'));
    modal.show();
    
    // Simulate verification process
    setTimeout(() => {
        modal.hide();
        alert('Identity verified successfully!');
    }, 3000);
}

// Start face verification on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(startFaceVerification, 2000);
});