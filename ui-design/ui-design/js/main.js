// Main JavaScript for Wachemo University Digital Campus

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initAnimations();
    initModals();
    initFormValidation();
    initTooltips();
    
    console.log('Wachemo University Digital Campus System Loaded');
});

// Navbar functionality
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    // Handle scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation functionality
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Add fade-in class to service cards and news cards
    document.querySelectorAll('.service-card, .news-card').forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });
}

// Modal functionality
function initModals() {
    // Handle portal selection
    const portalButtons = document.querySelectorAll('[data-portal]');
    portalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const portal = this.getAttribute('data-portal');
            redirectToPortal(portal);
        });
    });
}

// Form validation
function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}

// Initialize tooltips
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Portal redirection
function redirectToPortal(portal) {
    const portals = {
        'student': 'student-dashboard.html',
        'faculty': 'faculty-dashboard.html',
        'admin': 'admin-dashboard.html'
    };
    
    if (portals[portal]) {
        // Add loading state
        showLoading();
        
        // Simulate loading time
        setTimeout(() => {
            window.location.href = portals[portal];
        }, 1000);
    }
}

// Loading functionality
function showLoading() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Loading portal...</p>
        </div>
    `;
    
    // Add loading styles
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        flex-direction: column;
    `;
    
    document.body.appendChild(loadingOverlay);
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
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

// Language switching
function switchLanguage(lang) {
    // This would integrate with a translation system
    console.log('Switching to language:', lang);
    showNotification(`Language switched to ${lang === 'en' ? 'English' : 'አማርኛ'}`, 'success');
}

// Search functionality
function initSearch() {
    const searchInput = document.querySelector('#searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            // Implement search logic here
            console.log('Searching for:', query);
        });
    }
}

// Statistics counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with commas and preserve original suffix
            const originalText = counter.textContent;
            const suffix = originalText.replace(/[\d,]/g, '');
            counter.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 16);
    });
}

// Initialize counter animation when stats section is visible
const statsSection = document.querySelector('.stat-item');
if (statsSection) {
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    statsObserver.observe(statsSection.parentElement);
}

// Service card interactions
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// News card interactions
document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('click', function() {
        // Handle news card click
        const title = this.querySelector('h5').textContent;
        showNotification(`Opening: ${title}`, 'info');
    });
});

// Portal card interactions
document.querySelectorAll('.portal-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.portal-icon');
        icon.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.portal-icon');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC key to close modals
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            const modal = bootstrap.Modal.getInstance(openModal);
            modal.hide();
        }
    }
    
    // Ctrl+K for search (if implemented)
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('#searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Performance monitoring
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
}

logPerformance();

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Service Worker registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export functions for use in other files
window.WCUSystem = {
    showNotification,
    switchLanguage,
    redirectToPortal,
    showLoading
};