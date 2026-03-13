// Advanced Portfolio Website JavaScript
class PortfolioManager {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupAnimations();
        this.setupScrollEffects();
    }

    init() {
        // Initialize loading animation
        document.body.classList.add('loading');
        
        // Setup initial state
        this.currentTab = 'projects';
        this.isScrolling = false;
        
        // Initialize components
        this.setupTypewriter();
        this.setupParticleSystem();
        this.setupSkillBars();
        
        console.log('🚀 Premium Portfolio Initialized');
    }

    setupEventListeners() {
        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.smoothScrollTo(target);
                }
            });
        });

        // Header scroll effect
        window.addEventListener('scroll', () => {
            this.handleHeaderScroll();
            this.handleScrollAnimations();
        });

        // Mobile menu toggle
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Portfolio tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = btn.getAttribute('data-tab');
                this.showTab(tabName, btn);
            });
        });

        // Social links with analytics
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.trackSocialClick(btn);
            });
        });

        // Form submission
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Special handling for tech cards
                    if (entry.target.classList.contains('tech-card')) {
                        this.animateSkillBar(entry.target);
                    }
                    
                    // Special handling for project cards
                    if (entry.target.classList.contains('project-card')) {
                        this.animateProjectCard(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.reveal, .tech-card, .project-card, .certificate-card').forEach(el => {
            el.classList.add('reveal');
            this.scrollObserver.observe(el);
        });
    }

    setupScrollEffects() {
        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.premium-hero');
            if (hero) {
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            }
        });

        // Floating elements animation
        this.animateFloatingElements();
    }

    setupTypewriter() {
        const heroTitle = document.querySelector('.title-name');
        if (heroTitle) {
            setTimeout(() => {
                this.typeWriter(heroTitle, 'Sahid Ansari', 100);
            }, 1000);
        }
    }

    setupParticleSystem() {
        // Create floating particles in hero section
        setInterval(() => {
            this.createParticle();
        }, 3000);
    }

    setupSkillBars() {
        // Animate skill bars when they come into view
        document.querySelectorAll('.tech-card').forEach(card => {
            const skillBar = card.querySelector('.skill-progress');
            if (skillBar) {
                skillBar.style.width = '0%';
            }
        });
    }

    // Navigation Methods
    smoothScrollTo(target) {
        const headerHeight = document.querySelector('.premium-header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    handleHeaderScroll() {
        const header = document.querySelector('.premium-header');
        const scrolled = window.pageYOffset;
        
        if (scrolled > 100) {
            header.style.background = 'rgba(12, 12, 12, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(12, 12, 12, 0.95)';
            header.style.boxShadow = 'none';
        }
    }

    handleScrollAnimations() {
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        requestAnimationFrame(() => {
            this.isScrolling = false;
        });
    }

    toggleMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
        
        // Toggle mobile menu icon
        const mobileBtn = document.querySelector('.mobile-menu-btn i');
        if (navLinks.classList.contains('active')) {
            mobileBtn.className = 'fas fa-times';
        } else {
            mobileBtn.className = 'fas fa-bars';
        }
    }

    // Portfolio Tab Management
    showTab(tabName, clickedBtn) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab content
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Add active class to clicked button
        clickedBtn.classList.add('active');

        // Animate cards in the selected tab
        setTimeout(() => {
            this.animateTabContent(tabName);
        }, 100);

        this.currentTab = tabName;
    }

    animateTabContent(tabName) {
        const tabContent = document.getElementById(tabName);
        const cards = tabContent.querySelectorAll('.project-card, .certificate-card, .tech-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    // Animation Methods
    typeWriter(element, text, speed = 100) {
        element.innerHTML = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }

    createParticle() {
        const hero = document.querySelector('.premium-hero');
        if (!hero) return;

        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: 100%;
            pointer-events: none;
            animation: floatUp 4s linear forwards;
            z-index: 1;
        `;

        hero.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 4000);
    }

    animateFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 1.5}s`;
            element.style.animationDuration = `${6 + Math.random() * 2}s`;
        });
    }

    animateSkillBar(techCard) {
        const skillProgress = techCard.querySelector('.skill-progress');
        if (skillProgress) {
            const targetWidth = skillProgress.style.width || '0%';
            skillProgress.style.width = '0%';
            
            setTimeout(() => {
                skillProgress.style.transition = 'width 2s cubic-bezier(0.4, 0, 0.2, 1)';
                skillProgress.style.width = skillProgress.getAttribute('style').match(/width:\s*(\d+%)/)?.[1] || '0%';
            }, 300);
        }
    }

    animateProjectCard(projectCard) {
        const icon = projectCard.querySelector('.project-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        }
    }

    // Interaction Handlers
    trackSocialClick(socialBtn) {
        const platform = socialBtn.classList.contains('linkedin') ? 'LinkedIn' : 'GitHub';
        console.log(`🔗 Social link clicked: ${platform}`);
        
        // Add click animation
        socialBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            socialBtn.style.transform = '';
        }, 150);
    }

    handleFormSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = event.target.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            this.showNotification('Message sent successfully! 🚀', 'success');
            event.target.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
        
        console.log('📧 Form submitted:', data);
    }

    handleKeyboardNavigation(event) {
        // Tab navigation for portfolio tabs
        if (event.key === 'Tab' && event.target.classList.contains('tab-btn')) {
            // Handle tab key navigation
        }
        
        // Escape key to close mobile menu
        if (event.key === 'Escape') {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks.classList.contains('active')) {
                this.toggleMobileMenu();
            }
        }
    }

    handleResize() {
        // Recalculate animations on resize
        if (window.innerWidth < 768) {
            // Mobile optimizations
            document.querySelectorAll('.floating-element').forEach(el => {
                el.style.display = 'none';
            });
        } else {
            document.querySelectorAll('.floating-element').forEach(el => {
                el.style.display = 'flex';
            });
        }
    }

    // Utility Methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #667eea, #764ba2)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // CV Download Functionality
    downloadCV() {
        const cvData = {
            name: "Sahid Ansari",
            title: "B.Tech CSE (AI/ML) Student",
            email: "sahid.ansari@email.com",
            location: "Kolkata, India",
            education: [
                {
                    degree: "B.Tech Computer Science Engineering (AI/ML)",
                    institution: "Brainware University",
                    location: "Kolkata",
                    year: "2024-2028"
                }
            ],
            skills: [
                "Python", "C Programming", "HTML5", "CSS3", "JavaScript",
                "Machine Learning", "Data Analysis", "Web Development",
                "Problem Solving", "Critical Thinking"
            ],
            projects: [
                {
                    name: "Portfolio Website",
                    description: "Modern responsive personal portfolio with premium design",
                    technologies: ["HTML", "CSS", "JavaScript"]
                },
                {
                    name: "AI Virtual Assistant",
                    description: "Intelligent assistant powered by AI and ML",
                    technologies: ["Python", "NLP", "Machine Learning"],
                    status: "In Progress"
                }
            ],
            certificates: [
                {
                    name: "AI Tools Workshop",
                    issuer: "Be10x",
                    year: "2024",
                    description: "ChatGPT and AI Tools for Enhanced Productivity"
                }
            ]
        };

        const cvContent = this.generateCVContent(cvData);
        this.downloadFile(cvContent, 'Sahid_Ansari_CV.txt', 'text/plain');
        
        this.showNotification('CV downloaded successfully! 📄', 'success');
    }

    generateCVContent(data) {
        return `
SAHID ANSARI
${data.title}
${data.email} | ${data.location}

EDUCATION
${data.education.map(edu => 
    `• ${edu.degree}\n  ${edu.institution}, ${edu.location} (${edu.year})`
).join('\n\n')}

TECHNICAL SKILLS
${data.skills.join(' • ')}

PROJECTS
${data.projects.map(project => 
    `• ${project.name}${project.status ? ` (${project.status})` : ''}
  ${project.description}
  Technologies: ${project.technologies.join(', ')}`
).join('\n\n')}

CERTIFICATES
${data.certificates.map(cert => 
    `• ${cert.name} - ${cert.issuer} (${cert.year})
  ${cert.description}`
).join('\n\n')}

INTERESTS
Artificial Intelligence, Machine Learning, Web Development, 
Technology Innovation, Problem Solving

---
Generated from sahidansari.dev
        `.trim();
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}

// Enhanced Animations CSS (injected via JavaScript)
const animationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes floatUp {
        from {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes glow {
        0%, 100% {
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
        }
        50% {
            box-shadow: 0 0 40px rgba(102, 126, 234, 0.6);
        }
    }
    
    .particle {
        animation: floatUp 4s linear forwards !important;
    }
    
    .glow-effect {
        animation: glow 2s ease-in-out infinite;
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Global Functions (for backward compatibility)
function downloadCV() {
    portfolioManager.downloadCV();
}

function showTab(tabName) {
    const clickedBtn = event.target.closest('.tab-btn');
    portfolioManager.showTab(tabName, clickedBtn);
}

function handleFormSubmit(event) {
    portfolioManager.handleFormSubmit(event);
}

// Initialize Portfolio Manager
let portfolioManager;

document.addEventListener('DOMContentLoaded', function() {
    portfolioManager = new PortfolioManager();
    
    // Page load animation
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.classList.remove('loading');
    }, 500);
});

// Performance Optimization
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Preload images
        const imageUrls = [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face'
        ];
        
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    });
}

// Service Worker Registration (Progressive Web App)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered successfully');
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed');
            });
    });
}

// Error Handling
window.addEventListener('error', (event) => {
    console.error('💥 JavaScript Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('💥 Unhandled Promise Rejection:', event.reason);
});

console.log('🎯 Premium Portfolio JavaScript Loaded Successfully!');
console.log('💫 All features initialized and ready to use!');
