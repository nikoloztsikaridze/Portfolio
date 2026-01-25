// ========================================
// Portfolio JavaScript Functionality
// ========================================

// ნავიგაციის Mobile Menu
const createMobileMenu = () => {
    const navbar = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');
    
    // Hamburger ღილაკის შექმნა
    const hamburger = document.createElement('div');
    hamburger.classList.add('hamburger');
    hamburger.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    navbar.appendChild(hamburger);
    
    // Menu Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Menu დახურვა Link-ზე დაჭერისას
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
};

// Typing Animation Hero Section-ში
const typingAnimation = () => {
    const subtitle = document.querySelector('.hero-subtitle');
    const roles = [
        'Aspiring DevOps Engineer',
        'Cloud Enthusiast ☁️',
        'Automation Expert 🤖',
        'CI/CD Pipeline Builder 🚀',
        'Infrastructure as Code 💻'
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const type = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            subtitle.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            subtitle.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentRole.length) {
            setTimeout(() => isDeleting = true, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
        
        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(type, typingSpeed);
    };
    
    type();
};

// Scroll Animation - Elements Fade In
const scrollAnimation = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // ყველა სექციის დაკვირვება
    document.querySelectorAll('.skill-card, .project-card, .stat-card, .contact-item').forEach(el => {
        el.classList.add('hidden-element');
        observer.observe(el);
    });
};

// Back to Top ღილაკი
const backToTop = () => {
    const btn = document.createElement('button');
    btn.classList.add('back-to-top');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// Active Navigation Link on Scroll
const activeNavOnScroll = () => {
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
            }
        });
    });
};

// Skills Progress Animation
const skillsProgress = () => {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach((card, index) => {
        const items = card.querySelectorAll('li');
        const skills = [
            [90, 85, 80, 75], // Frontend
            [85, 80, 70, 88], // Backend
            [95, 90, 92, 85]  // Tools
        ];
        
        items.forEach((item, i) => {
            const progressBar = document.createElement('div');
            progressBar.classList.add('skill-progress');
            
            const progress = document.createElement('div');
            progress.classList.add('skill-progress-bar');
            progress.style.width = '0%';
            progress.setAttribute('data-progress', skills[index]?.[i] || 75);
            
            progressBar.appendChild(progress);
            item.appendChild(progressBar);
        });
    });
    
    // Animation on Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress-bar');
                progressBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-progress');
                    setTimeout(() => {
                        bar.style.width = targetWidth + '%';
                    }, 200);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillCards.forEach(card => observer.observe(card));
};

// Contact Form Validation & Submit
const contactFormHandler = () => {
    const form = document.querySelector('.contact-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validation
        if (!name || !email || !message) {
            showNotification('გთხოვთ შეავსოთ ყველა ველი!', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('გთხოვთ შეიყვანოთ ვალიდური Email!', 'error');
            return;
        }
        
        // Success
        showNotification('მესიჯი წარმატებით გაიგზავნა! ✓', 'success');
        form.reset();
    });
};

// Email Validation
const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Notification System
const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};

// Dark Mode Toggle
const darkModeToggle = () => {
    const toggle = document.createElement('button');
    toggle.classList.add('theme-toggle');
    toggle.innerHTML = '🌙';
    document.body.appendChild(toggle);
    
    let isDark = false;
    
    toggle.addEventListener('click', () => {
        isDark = !isDark;
        document.body.classList.toggle('dark-mode');
        toggle.innerHTML = isDark ? '☀️' : '🌙';
    });
};

// Smooth Scroll Enhancement
const smoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Loading Animation
const pageLoader = () => {
    const loader = document.createElement('div');
    loader.classList.add('page-loader');
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 500);
        }, 1000);
    });
};

// Counter Animation for Stats
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-card h3');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                const duration = 2000;
                const increment = finalValue / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < finalValue) {
                        target.textContent = Math.floor(current) + '+';
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.textContent = finalValue + '+';
                    }
                };
                
                updateCounter();
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
};

// Header Scroll Effect
const headerScrollEffect = () => {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
};

// Initialize All Functions
const init = () => {
    pageLoader();
    createMobileMenu();
    typingAnimation();
    scrollAnimation();
    backToTop();
    activeNavOnScroll();
    skillsProgress();
    contactFormHandler();
    darkModeToggle();
    smoothScroll();
    animateCounters();
    headerScrollEffect();
    
    console.log('🚀 Portfolio loaded successfully!');
};

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}


// Contact Form Handler with Database
const contactFormHandler = () => {
    const form = document.querySelector('.contact-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validation
        if (!name || !email || !message) {
            showNotification('გთხოვთ შეავსოთ ყველა ველი!', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('გთხოვთ შეიყვანოთ ვალიდური Email!', 'error');
            return;
        }
        
        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'იგზავნება...';
        submitBtn.disabled = true;
        
        try {
            // Send to Backend API
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showNotification(data.message, 'success');
                form.reset();
            } else {
                showNotification(data.message, 'error');
            }
            
        } catch (error) {
            console.error('Error:', error);
            showNotification('სერვერთან დაკავშირება ვერ მოხერხდა!', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
};

// Email Validation
const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Notification System
const showNotification = (message, type) => {
    // არსებული notification წაშალე
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};

// Initialize
const init = () => {
    // ... existing code ...
    contactFormHandler();  // დაამატე ეს
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
