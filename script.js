// ===== Preloader =====
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initAOS();
        animateCounters();
    }, 800);
});

// ===== AOS (Animate On Scroll) - Custom Implementation =====
function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

// ===== Navbar =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    
    // Back to top
    const backToTop = document.getElementById('back-to-top');
    backToTop.classList.toggle('visible', window.scrollY > 500);
    
    // Active nav link
    updateActiveNavLink();
});

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
    });
});

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== Animated Counter =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateValue(el, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = Math.floor(start + (end - start) * eased);
        el.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ===== Particles =====
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const count = window.innerWidth < 768 ? 15 : 30;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.width = (Math.random() * 3 + 1) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

createParticles();

// ===== Pricing Tabs =====
const toggleBtns = document.querySelectorAll('.toggle-btn');
const pricingTabs = document.querySelectorAll('.pricing-tab');

function switchTab(tabName) {
    toggleBtns.forEach(b => b.classList.remove('active'));
    toggleBtns.forEach(b => { if (b.getAttribute('data-tab') === tabName) b.classList.add('active'); });
    pricingTabs.forEach(t => t.classList.remove('active'));
    const targetTab = document.getElementById('tab-' + tabName);
    if (targetTab) targetTab.classList.add('active');
}

toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchTab(btn.getAttribute('data-tab'));
    });
});

// ===== Service Links -> Pricing Tabs =====
document.querySelectorAll('.service-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.getAttribute('data-tab');
        if (tab) switchTab(tab);
        document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
    });
});

// ===== Testimonials Slider =====
const track = document.getElementById('testimonial-track');
const cards = track ? track.querySelectorAll('.testimonial-card') : [];
const dotsContainer = document.getElementById('slider-dots');
const prevBtn = document.getElementById('slider-prev');
const nextBtn = document.getElementById('slider-next');
let currentSlide = 0;
let autoSlideInterval;

function initSlider() {
    if (!track || cards.length === 0) return;
    
    // Create dots
    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    
    prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide === 0 ? cards.length - 1 : currentSlide - 1);
    });
    
    nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
    });
    
    startAutoSlide();
    
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
            } else {
                goToSlide(currentSlide === 0 ? cards.length - 1 : currentSlide - 1);
            }
        }
        startAutoSlide();
    }, { passive: true });
}

function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
    }, 5000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

initSlider();

// ===== FAQ Accordion =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all
        faqItems.forEach(i => i.classList.remove('active'));
        
        // Toggle current
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== Contact Form =====
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const message = document.getElementById('form-message').value.trim();
    
    if (!name || !email || !message) return;
    
    // Build mailto link
    const subject = encodeURIComponent('Mesaj de la ' + name + ' - AQUALEX Website');
    const body = encodeURIComponent(
        'Nume: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Telefon: ' + (phone || 'Nespecificat') + '\n\n' +
        'Mesaj:\n' + message
    );
    window.location.href = 'mailto:contact@aqualex.ro?subject=' + subject + '&body=' + body;
    
    // Visual feedback
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> <span>Se deschide email-ul...</span>';
    btn.style.background = '#10b981';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
    }, 3000);
});

// ADDED: Accordion
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const group = header.parentElement;
        const body = group.querySelector('.accordion-body');
        const isActive = group.classList.contains('active');
        
        // Close all accordions in the same tab
        const tab = group.closest('.pricing-tab');
        tab.querySelectorAll('.accordion-group.active').forEach(openGroup => {
            openGroup.classList.remove('active');
            openGroup.querySelector('.accordion-body').style.maxHeight = null;
        });
        
        // Toggle current
        if (!isActive) {
            group.classList.add('active');
            body.style.maxHeight = body.scrollHeight + 'px';
        }
    });
});

// ADDED: Sticky CTA
const stickyCta = document.getElementById('sticky-cta');
if (stickyCta) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
    });
}

// ===== Back to Top =====
document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Cookie Banner =====
function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');
    
    const cookieChoice = localStorage.getItem('aqualex-cookies');
    
    if (!cookieChoice) {
        setTimeout(() => {
            banner.classList.add('show');
        }, 2000);
    }
    
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('aqualex-cookies', 'accepted');
        banner.classList.remove('show');
    });
    
    rejectBtn.addEventListener('click', () => {
        localStorage.setItem('aqualex-cookies', 'rejected');
        banner.classList.remove('show');
    });
}

initCookieBanner();

// ===== Smooth reveal on scroll for nav ===== 
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > lastScroll && currentScroll > 200) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
}, { passive: true });
