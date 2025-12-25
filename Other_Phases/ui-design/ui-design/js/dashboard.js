// Dashboard JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
    initSectionNavigation();
    initQuickActions();
    initNotifications();
    initFormHandlers();
    
    console.log('Dashboard loaded successfully');
});

// Initialize dashboard functionality
function initDashboard() {
    // Load user data
    loadUserData();
    
    // Initialize charts if needed
    initCharts();
    
    // Set up real-time updates
    setupRealTimeUpdates();
    
    // Initialize tooltips
    initTooltips();
}

// Section navigation
function initSectionNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Update active nav link
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection + '-section') {
                    section.classList.add('active');
                }
            });
            
            // Update URL hash
            window.location.hash = targetSection;
            
            // Load section-specific data
            loadSectionData(targetSection);
        });
    });
    
    // Handle initial hash
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetLink = document.querySelector(`[data-section="${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
}

// Quick actions functionality
function initQuickActions() {
    const quickActionButtons = document.querySelectorAll('[data-section]');
    
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            const navLink = document.querySelector(`.nav-link[data-section="${section}"]`);
            
            if (navLink) {
                navLink.click();
            }
        });
    });
}

// Notification system
function initNotifications() {
    // Mark notifications as read when dropdown is opened
    const notificationDropdown = document.querySelector('.notification-dropdown');
    if (notificationDropdown) {
        notificationDropdown.addEventListener('shown.bs.dropdown', function() {
            markNotificationsAsRead();
        });
    }
    
    // Handle notification clicks
    const notificationItems = document.querySelectorAll('.notification-dropdown .dropdown-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (!this.href || this.href === '#') {
                e.preventDefault();
                handleNotificationClick(this);
            }
        });
    });
}

// Form handlers
function initFormHandlers() {
    // Registration form
    const registrationForm = document.querySelector('#registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistrationSubmit);
    }
    
    // Course selection checkboxes
    const courseCheckboxes = document.querySelectorAll('input[type="checkbox"][data-course]');
    courseCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateRegistrationSummary);
    });
    
    // Save draft functionality
    const saveDraftButtons = document.querySelectorAll('.save-draft');
    saveDraftButtons.forEach(button => {
        button.addEventListener('click', saveDraft);
    });
}

// Load user data
function loadUserData() {
    // Simulate API call to load user data
    const userData = {
        name: 'Abebe Kebede',
        id: 'WCU/2024/001234',
        department: 'Computer Science',
        year: '2nd Year',
        gpa: 3.45,
        creditHours: 45,
        upcomingExams: 2,
        mealBalance: 450
    };
    
    // Update dashboard with user data
    updateDashboardStats(userData);
}

// Update dashboard statistics
function updateDashboardStats(data) {
    const stats = document.querySelectorAll('.dashboard-stat-number');
    
    if (stats[0]) stats[0].textContent = data.gpa.toFixed(2);
    if (stats[1]) stats[1].textContent = data.creditHours;
    if (stats[2]) stats[2].textContent = data.upcomingExams;
    if (stats[3]) stats[3].textContent = data.mealBalance;
}

// Load section-specific data
function loadSectionData(section) {
    switch (section) {
        case 'registration':
            loadRegistrationData();
            break;
        case 'academics':
            loadAcademicData();
            break;
        case 'exams':
            loadExamData();
            break;
        case 'services':
            loadServicesData();
            break;
        case 'financial':
            loadFinancialData();
            break;
        case 'support':
            loadSupportData();
            break;
        default:
            break;
    }
}

// Registration data loading
function loadRegistrationData() {
    // Simulate loading registration data
    console.log('Loading registration data...');
    
    // Update registration summary when courses change
    updateRegistrationSummary();
}

// Update registration summary
function updateRegistrationSummary() {
    const selectedCourses = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const totalCredits = calculateTotalCredits();
    const registrationFee = 2500;
    const lateFee = isLateRegistration() ? 150 : 0;
    
    // Update summary display
    const summaryElements = {
        courses: document.querySelector('.summary-courses'),
        credits: document.querySelector('.summary-credits'),
        regFee: document.querySelector('.summary-reg-fee'),
        lateFee: document.querySelector('.summary-late-fee')
    };
    
    if (summaryElements.courses) summaryElements.courses.textContent = selectedCourses;
    if (summaryElements.credits) summaryElements.credits.textContent = totalCredits;
    if (summaryElements.regFee) summaryElements.regFee.textContent = registrationFee + ' ETB';
    if (summaryElements.lateFee) summaryElements.lateFee.textContent = lateFee + ' ETB';
}

// Calculate total credits
function calculateTotalCredits() {
    let total = 0;
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    checkedBoxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const creditsCell = row.querySelector('td:nth-child(4)');
        if (creditsCell) {
            total += parseInt(creditsCell.textContent) || 0;
        }
    });
    
    return total;
}

// Check if registration is late
function isLateRegistration() {
    const deadline = new Date('2025-01-30');
    const now = new Date();
    return now > deadline;
}

// Handle registration form submission
function handleRegistrationSubmit(e) {
    e.preventDefault();
    
    const selectedCourses = document.querySelectorAll('input[type="checkbox"]:checked');
    const totalCredits = calculateTotalCredits();
    
    // Validation
    if (selectedCourses.length === 0) {
        showNotification('Please select at least one course', 'warning');
        return;
    }
    
    if (totalCredits < 12) {
        showNotification('Minimum 12 credit hours required', 'warning');
        return;
    }
    
    if (totalCredits > 18) {
        showNotification('Maximum 18 credit hours allowed', 'warning');
        return;
    }
    
    // Show confirmation modal
    showRegistrationConfirmation();
}

// Show registration confirmation
function showRegistrationConfirmation() {
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    modal.show();
}

// Save draft functionality
function saveDraft() {
    const formData = collectFormData();
    
    // Save to localStorage
    localStorage.setItem('registrationDraft', JSON.stringify(formData));
    
    showNotification('Draft saved successfully', 'success');
}

// Collect form data
function collectFormData() {
    const selectedCourses = [];
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    checkedBoxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const courseCode = row.querySelector('td:nth-child(2)').textContent;
        selectedCourses.push(courseCode);
    });
    
    return {
        selectedCourses,
        timestamp: new Date().toISOString()
    };
}

// Load draft data
function loadDraft() {
    const draft = localStorage.getItem('registrationDraft');
    if (draft) {
        const data = JSON.parse(draft);
        
        // Restore selections
        data.selectedCourses.forEach(courseCode => {
            const checkbox = document.querySelector(`input[data-course="${courseCode}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        updateRegistrationSummary();
        showNotification('Draft loaded', 'info');
    }
}

// Mark notifications as read
function markNotificationsAsRead() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = '0';
        badge.style.display = 'none';
    }
}

// Handle notification clicks
function handleNotificationClick(notification) {
    const text = notification.textContent.trim();
    
    if (text.includes('Grade')) {
        // Navigate to academics section
        document.querySelector('[data-section="academics"]').click();
    } else if (text.includes('Library')) {
        // Navigate to services section
        document.querySelector('[data-section="services"]').click();
    } else if (text.includes('Cost-sharing')) {
        // Navigate to financial section
        document.querySelector('[data-section="financial"]').click();
    }
}

// Initialize charts (placeholder)
function initCharts() {
    // This would initialize any charts or graphs
    console.log('Charts initialized');
}

// Setup real-time updates
function setupRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        updateLastSeen();
    }, 60000); // Update every minute
}

// Update last seen time
function updateLastSeen() {
    const lastSeenElement = document.querySelector('.last-seen');
    if (lastSeenElement) {
        const now = new Date();
        lastSeenElement.textContent = `Last updated: ${now.toLocaleTimeString()}`;
    }
}

// Initialize tooltips
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Academic data loading (placeholder)
function loadAcademicData() {
    console.log('Loading academic data...');
}

// Exam data loading (placeholder)
function loadExamData() {
    console.log('Loading exam data...');
}

// Services data loading (placeholder)
function loadServicesData() {
    console.log('Loading services data...');
}

// Financial data loading (placeholder)
function loadFinancialData() {
    console.log('Loading financial data...');
}

// Support data loading (placeholder)
function loadSupportData() {
    console.log('Loading support data...');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+S to save draft
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveDraft();
    }
    
    // Ctrl+1-6 for quick navigation
    if (e.ctrlKey && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const sections = ['dashboard', 'registration', 'academics', 'exams', 'services', 'financial'];
        const sectionIndex = parseInt(e.key) - 1;
        if (sections[sectionIndex]) {
            document.querySelector(`[data-section="${sections[sectionIndex]}"]`).click();
        }
    }
});

// Export functions for global use
window.DashboardSystem = {
    showNotification,
    loadSectionData,
    saveDraft,
    loadDraft,
    updateRegistrationSummary
};