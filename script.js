// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 1500);
});

// Fallback: Force hide loading screen after 3 seconds
setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}, 3000);

// Prevent scroll during loading
document.body.style.overflow = 'hidden';

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
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

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// Scroll Animation for Elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate skill bars when they come into view
            if (entry.target.classList.contains('skills')) {
                const skillBars = entry.target.querySelectorAll('.skill-progress-fill');
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 100);
                });
            }
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .project-card, .timeline-item, .skill-category, .achievement-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Dynamic Year in Footer
const currentYear = new Date().getFullYear();
document.querySelector('.footer p').textContent = `© ${currentYear} Jitendra Sethia. Built with passion and code.`;

// Add hover effect to planets
document.querySelectorAll('.planet').forEach(planet => {
    planet.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.3)';
    });
    
    planet.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Typing Effect for Hero Title (Optional Enhancement)
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    // Disable typing effect to prevent issues
    // The title will appear normally
}

// Add active state to navigation based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Project Links - Update these with actual project URLs
const projectLinks = {
    'GramLink AI': '#',
    'FarmLink AI': '#',
    'Bond Buy': '#',
    'Suryadut Solar De-watering System': '#',
    'Jain Consultancy Website': '#',
    'RAG-Based Govt Scheme Finder': '#'
};

// Add click handlers for project cards
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const projectTitle = e.target.closest('.project-card').querySelector('h3').textContent;
        if (projectLinks[projectTitle] === '#') {
            e.preventDefault();
            alert('Project link coming soon! This project is currently in development or documentation.');
        }
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add animation to skill tags on hover
document.querySelectorAll('.skill-tags span').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Console message for developers
console.log('%c👋 Hey there, fellow developer!', 'color: #4A90E2; font-size: 20px; font-weight: bold;');
console.log('%cInterested in the code? Check out my GitHub!', 'color: #50C878; font-size: 14px;');
console.log('%chttps://github.com/jitendrasethia', 'color: #FF6B6B; font-size: 14px;');

// Email button with fallback
const emailBtn = document.getElementById('emailBtn');
if (emailBtn) {
    emailBtn.addEventListener('click', function(e) {
        const email = 'jitendrasethiaofficail@gmail.com';
        
        // Try to copy email to clipboard as fallback
        setTimeout(() => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    showNotification('Email copied to clipboard!');
                }).catch(() => {
                    showNotification('Email: ' + email);
                });
            }
        }, 100);
    });
}

// Show notification function
function showNotification(message) {
    // Remove existing notification if any
    const existingNotif = document.querySelector('.email-notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'email-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
