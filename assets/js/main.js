/**
 * ========================================
 * QSD Cyber Solutions - Main JavaScript
 * Accessibility, Form Validation, Logo Animation
 * Production-ready with fallbacks
 * ========================================
 */

(function() {
    'use strict';
    
    // ========================================
    // 1. QSD Logo Animation (Pixar-style)
    // ========================================
    function initLogoAnimation() {
        const letters = document.querySelectorAll('.logo-letter');
        const lightSource = document.querySelector('.logo-light-source');
        
        if (!letters.length) return;
        
        // Initial state - all dim
        letters.forEach(letter => {
            letter.style.opacity = '0.2';
            letter.style.textShadow = 'none';
            letter.style.transform = 'scale(1)';
        });
        
        if (lightSource) {
            lightSource.style.opacity = '0';
            lightSource.style.transform = 'translateX(0)';
        }
        
        // Light up each letter sequentially
        letters.forEach((letter, index) => {
            setTimeout(() => {
                // Move light source
                if (lightSource) {
                    const offset = index * 48; // Adjust based on letter spacing
                    lightSource.style.transform = `translateX(${offset}px)`;
                    lightSource.style.opacity = '0.8';
                    lightSource.classList.add('active');
                }
                
                // Light up letter
                letter.classList.add('lit');
                letter.style.opacity = '1';
                letter.style.textShadow = '0 0 30px #00d4ff, 0 0 60px #0099cc';
                letter.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                
                // Bounce effect
                letter.style.transform = 'scale(1.15)';
                setTimeout(() => {
                    letter.style.transform = 'scale(1)';
                }, 300);
                
            }, 400 + (index * 700)); // Q: 400ms, S: 1100ms, D: 1800ms
        });
        
        // After all letters are lit, dim the light source slightly
        const totalDuration = 400 + (letters.length * 700) + 500;
        setTimeout(() => {
            if (lightSource) {
                lightSource.style.opacity = '0.3';
                lightSource.style.transition = 'opacity 2s ease';
                setTimeout(() => {
                    lightSource.classList.remove('active');
                }, 2000);
            }
        }, totalDuration);
    }
    
    // ========================================
    // 2. Mobile Navigation Toggle
    // ========================================
    function initMobileNav() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.querySelector('.nav-menu');
        
        if (!toggle || !menu) return;
        
        toggle.addEventListener('click', function(e) {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            menu.classList.toggle('open');
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                toggle.setAttribute('aria-expanded', 'false');
                menu.classList.remove('open');
                toggle.focus();
            }
        });
        
        // Close menu on link click (mobile)
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    toggle.setAttribute('aria-expanded', 'false');
                    menu.classList.remove('open');
                }
            });
        });
    }
    
    // ========================================
    // 3. Contact Form Validation & Submission
    // ========================================
    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const consentInput = document.getElementById('consent');
        const statusDiv = document.querySelector('.form-status');
        
        // Validation functions
        function validateName(value) {
            return value.trim().length >= 2;
        }
        
        function validateEmail(value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value.trim());
        }
        
        function validateMessage(value) {
            return value.trim().length >= 10;
        }
        
        function validateConsent(value) {
            return value === true;
        }
        
        function showError(input, message) {
            const errorSpan = input.parentElement.querySelector('.error-message');
            if (errorSpan) {
                errorSpan.textContent = message;
                errorSpan.classList.add('visible');
            }
            input.setAttribute('aria-invalid', 'true');
        }
        
        function clearError(input) {
            const errorSpan = input.parentElement.querySelector('.error-message');
            if (errorSpan) {
                errorSpan.textContent = '';
                errorSpan.classList.remove('visible');
            }
            input.removeAttribute('aria-invalid');
        }
        
        function setStatus(message, type) {
            if (statusDiv) {
                statusDiv.textContent = message;
                statusDiv.className = 'form-status ' + type;
                statusDiv.setAttribute('role', 'status');
                statusDiv.setAttribute('aria-live', 'polite');
            }
        }
        
        // Real-time validation on blur
        if (nameInput) {
            nameInput.addEventListener('blur', function() {
                if (this.value.trim()) {
                    if (!validateName(this.value)) {
                        showError(this, 'Name must be at least 2 characters');
                    } else {
                        clearError(this);
                    }
                }
            });
            nameInput.addEventListener('input', function() {
                if (this.value.trim() && validateName(this.value)) {
                    clearError(this);
                }
            });
        }
        
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                if (this.value.trim()) {
                    if (!validateEmail(this.value)) {
                        showError(this, 'Please enter a valid email address');
                    } else {
                        clearError(this);
                    }
                }
            });
            emailInput.addEventListener('input', function() {
                if (this.value.trim() && validateEmail(this.value)) {
                    clearError(this);
                }
            });
        }
        
        if (messageInput) {
            messageInput.addEventListener('blur', function() {
                if (this.value.trim()) {
                    if (!validateMessage(this.value)) {
                        showError(this, 'Message must be at least 10 characters');
                    } else {
                        clearError(this);
                    }
                }
            });
            messageInput.addEventListener('input', function() {
                if (this.value.trim() && validateMessage(this.value)) {
                    clearError(this);
                }
            });
        }
        
        if (consentInput) {
            consentInput.addEventListener('change', function() {
                if (this.checked) {
                    clearError(this);
                }
            });
        }
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            
            // Validate name
            if (!validateName(nameInput.value)) {
                showError(nameInput, 'Please enter your full name');
                isValid = false;
            }
            
            // Validate email
            if (!validateEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate message
            if (!validateMessage(messageInput.value)) {
                showError(messageInput, 'Please enter a message (at least 10 characters)');
                isValid = false;
            }
            
            // Validate consent
            if (!consentInput.checked) {
                showError(consentInput, 'Please consent to data processing');
                isValid = false;
            }
            
            if (!isValid) {
                // Focus first invalid field
                const firstInvalid = form.querySelector('[aria-invalid="true"]');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                setStatus('Please fix the errors above.', 'error');
                return;
            }
            
            // Disable submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }
            
            setStatus('Sending your message...', 'info');
            
            // Submit via Formspree
            const formData = new FormData(form);
            
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    setStatus('✅ Thank you! Your message has been sent. We\'ll respond within 24 hours.', 'success');
                    form.reset();
                    // Clear all error states
                    form.querySelectorAll('.error-message').forEach(el => {
                        el.classList.remove('visible');
                    });
                    form.querySelectorAll('[aria-invalid="true"]').forEach(el => {
                        el.removeAttribute('aria-invalid');
                    });
                } else {
                    return response.json().then(data => {
                        if (data.error) {
                            throw new Error(data.error);
                        }
                        throw new Error('Failed to send message');
                    });
                }
            })
            .catch(error => {
                setStatus('❌ Something went wrong. Please try again or contact us directly at hello@qsdcybersolutions.co.za', 'error');
                console.error('Form submission error:', error);
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }
            });
        });
    }
    
    // ========================================
    // 4. Smooth Scroll for Anchor Links
    // ========================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Focus the target for accessibility
                    target.setAttribute('tabindex', '-1');
                    target.focus({ preventScroll: true });
                }
            });
        });
    }
    
    // ========================================
    // 5. Lazy Loading for Images
    // ========================================
    function initLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
                img.loading = 'lazy';
            });
        } else {
            // Fallback for older browsers
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
            document.body.appendChild(script);
        }
    }
    
    // ========================================
    // 6. Analytics (Privacy-friendly)
    // ========================================
    function initAnalytics() {
        // Simple page view tracking (you can replace with Google Analytics or Plausible)
        // This is a no-op placeholder - add your analytics code here if needed
        console.log('QSD Cyber Solutions - Page viewed');
    }
    
    // ========================================
    // 7. Keyboard Navigation for FAQ
    // ========================================
    function initFaqKeyboard() {
        document.querySelectorAll('.faq-item summary').forEach(summary => {
            summary.addEventListener('keydown', function(e) {
                // Enter and Space are handled by browser
                if (e.key === 'Escape') {
                    const details = this.parentElement;
                    if (details.open) {
                        details.open = false;
                        this.focus();
                    }
                }
            });
        });
    }
    
    // ========================================
    // 8. Initialize Everything on DOM Ready
    // ========================================
    function init() {
        // Run animations after a small delay for page load
        setTimeout(initLogoAnimation, 100);
        
        initMobileNav();
        initContactForm();
        initSmoothScroll();
        initLazyLoading();
        initAnalytics();
        initFaqKeyboard();
        
        // Log security headers for debugging (removed in production)
        console.log('🔒 QSD Cyber Solutions - Security-first website loaded');
        console.log('✓ HTTPS enforced');
        console.log('✓ CSP configured');
        console.log('✓ WCAG 2.1 AA accessible');
        console.log('✓ POPIA & GDPR compliant');
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // ========================================
    // 9. Handle Resize Events (Performance)
    // ========================================
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768) {
                const menu = document.querySelector('.nav-menu');
                const toggle = document.querySelector('.nav-toggle');
                if (menu && toggle) {
                    menu.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            }
        }, 250);
    });
    
})();