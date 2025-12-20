// Smooth scrolling function
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Form submission handler
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const messageDiv = document.getElementById('form-message');
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Basic validation
    if (!name || !email || !phone || !message) {
        showFormMessage('Please fill in all fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading message
    showFormMessage('Sending message...', 'success');
    
    // Disable submit button to prevent multiple submissions
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    try {
        // Backend API URL - Update this for production deployment
        // For local development: use localhost (file:// protocol or localhost)
        // For production: update the production URL below
        const isLocalDev = window.location.hostname === 'localhost' 
            || window.location.hostname === '127.0.0.1'
            || window.location.protocol === 'file:'
            || !window.location.hostname;
        
        // TODO: Replace 'YOUR_BACKEND_URL' with your actual deployed backend URL when ready
        // Examples: 'https://your-backend.railway.app' or 'https://your-backend.render.com'
        const PRODUCTION_API_URL = 'YOUR_BACKEND_URL'; // Update this when backend is deployed
        
        const API_BASE_URL = isLocalDev 
            ? 'http://localhost:3000' 
            : (PRODUCTION_API_URL !== 'YOUR_BACKEND_URL' ? PRODUCTION_API_URL : null);
        
        // Check if backend URL is configured
        if (!API_BASE_URL) {
            showFormMessage('Backend server is not configured. Please contact us directly at pcjohncorp998@gmail.com or +1 (845) 404-1285.', 'error');
            return;
        }
        
        // Send data to backend API
        const response = await fetch(`${API_BASE_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                message: message
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showFormMessage(data.message || 'Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
            form.reset();
        } else {
            showFormMessage(data.message || 'Failed to send message. Please try again later.', 'error');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showFormMessage('Failed to send message. Please check your connection and try again, or contact us directly.', 'error');
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
    }
}

// Show form message
function showFormMessage(message, type) {
    const messageDiv = document.getElementById('form-message');
    if (!messageDiv) return;
    
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
    // Error messages stay visible until user dismisses or new message appears
}

// FAQ Toggle
function toggleFaq(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Lightbox functionality
const portfolioImages = [
    'Images/portfolio-image-1.jpg',
    'Images/portfolio-solar-maintenance.jpeg',
    'Images/portfolio-image-3.jpg'
];

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (lightbox && lightboxImg && portfolioImages[index]) {
        lightboxImg.src = portfolioImages[index];
        lightboxImg.alt = `Project Image ${index + 1}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox(event) {
    const lightbox = document.getElementById('lightbox');
    if (event.target === lightbox || event.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close lightbox on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            closeLightbox({ target: lightbox });
        }
    }
});

// Statistics counter animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const isDecimal = target % 1 !== 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target, isDecimal);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(current, isDecimal);
        }
    }, 16);
}

function formatNumber(num, isDecimal = false) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return Math.floor(num / 1000) + 'K+';
    }
    if (isDecimal) {
        return num.toFixed(1);
    }
    return Math.floor(num).toString();
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animate statistics if this is a stat card
            if (entry.target.classList.contains('stat-card')) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.dataset.animated) {
                    const target = parseFloat(statNumber.dataset.target);
                    statNumber.dataset.animated = 'true';
                    animateCounter(statNumber, target);
                }
            }
        }
    });
}, observerOptions);

// Hero image rotation functionality
function initHeroImageRotation() {
    const heroSlides = document.querySelectorAll('.hero-image-slide');
    if (heroSlides.length === 0) return;
    
    let currentSlide = 0;
    
    function rotateHeroImages() {
        // Remove active class from current slide
        heroSlides[currentSlide].classList.remove('active');
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % heroSlides.length;
        
        // Add active class to new slide
        heroSlides[currentSlide].classList.add('active');
    }
    
    // Rotate images every 5 seconds (5000ms)
    setInterval(rotateHeroImages, 5000);
}

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero image rotation
    initHeroImageRotation();
    
    // Observe statistics cards
    document.querySelectorAll('.stat-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observe other sections for fade-in animations
    document.querySelectorAll('.service-card, .benefit-card, .testimonial-card, .portfolio-item').forEach(element => {
        observer.observe(element);
    });
    
    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
    // This can be implemented if a mobile menu is added
    console.log('Mobile menu toggle');
}

// Form input validation on blur
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error styling
    field.classList.remove('error');
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (!isValid) {
        field.classList.add('error');
        // You could show error message tooltip here
    }
    
    return isValid;
}

// Add error styling to CSS via JavaScript (or add to CSS file)
const style = document.createElement('style');
style.textContent = `
    .contact-form input.error,
    .contact-form textarea.error {
        border-color: #EF4444;
    }
`;
document.head.appendChild(style);

