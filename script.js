/**
 * ENTREPOLY v3 — WITH ASSETS
 * Image lightbox, video player, lazy loading,
 * particle system, scroll reveals.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==================== NAV ====================
    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
    
    menuBtn.addEventListener('click', () => {
        const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !expanded);
        navLinks.classList.toggle('active');
        document.body.style.overflow = expanded ? '' : 'hidden';
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
            menuBtn.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            menuBtn.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            menuBtn.focus();
        }
    });

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight + 20;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== PARTICLES ====================
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 25; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 3 + 2;
            p.style.cssText = `
                width: ${size}px; height: ${size}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.3 + 0.1};
                animation: float-particle ${Math.random() * 15 + 15}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(p);
        }
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float-particle {
                0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
                10% { opacity: var(--o, 0.2); }
                90% { opacity: var(--o, 0.2); }
                100% { transform: translateY(-100vh) translateX(${Math.random() * 60 - 30}px); }
            }
        `;
        document.head.appendChild(style);
    }

    // ==================== SCROLL REVEAL ====================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children').forEach(el => {
        observer.observe(el);
    });

    // ==================== ANIMATED COUNTERS ====================
    const counters = document.querySelectorAll('.stat-num');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCount(entry.target, target);
                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => countObserver.observe(c));

    function animateCount(el, target) {
        const start = performance.now();
        const duration = 2000;
        
        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + (target > 10 ? '+' : '');
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    // ==================== LIGHTBOX GALLERY ====================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;

    function openLightbox(index) {
        const item = galleryItems[index];
        const img = item.querySelector('img');
        const caption = item.dataset.caption || '';
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        currentIndex = index;
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        openLightbox(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        openLightbox(currentIndex);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
    document.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // ==================== VIDEO FALLBACK ====================
    const video = document.querySelector('.gameplay-video');
    const fallback = document.getElementById('videoFallback');
    
    if (video) {
        video.addEventListener('error', () => {
            video.style.display = 'none';
            fallback.style.display = 'block';
        });
        
        // Check if video source exists
        const source = video.querySelector('source');
        if (source) {
            fetch(source.src, { method: 'HEAD' })
                .then(r => {
                    if (!r.ok) throw new Error('Video not found');
                })
                .catch(() => {
                    video.style.display = 'none';
                    fallback.style.display = 'block';
                });
        }
    }

    document.getElementById('playBtn')?.addEventListener('click', () => {
        toast('Trailer coming soon!');
    });

    // ==================== BACK TO TOP ====================
    const backTop = document.getElementById('backTop');
    window.addEventListener('scroll', () => {
        backTop.classList.toggle('visible', window.scrollY > 600);
    });
    backTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==================== NEWSLETTER ====================
    const nlForm = document.getElementById('newsletterForm');
    const nlMsg = document.getElementById('nlMsg');
    
    if (nlForm) {
        nlForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = nlForm.querySelector('input[type="email"]').value;
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                nlMsg.textContent = 'Subscribed! You\'ll hear from us soon.';
                nlMsg.className = 'nl-msg success';
                nlForm.reset();
            } else {
                nlMsg.textContent = 'Please enter a valid email.';
                nlMsg.className = 'nl-msg error';
            }
            setTimeout(() => { nlMsg.textContent = ''; nlMsg.className = 'nl-msg'; }, 4000);
        });
    }

    // ==================== CONTACT FORM ====================
    const contactForm = document.getElementById('contactForm');
    const formMsg = document.getElementById('formMsg');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(contactForm);
            const name = data.get('name').trim();
            const email = data.get('email').trim();
            const subject = data.get('subject');
            const message = data.get('message').trim();
            
            if (!name || !email || !subject || !message) {
                showFormMsg('Fill in all fields.', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showFormMsg('Valid email needed.', 'error');
                return;
            }
            
            showFormMsg('Message sent! We\'ll reply soon.', 'success');
            contactForm.reset();
        });
    }
    
    function showFormMsg(text, type) {
        formMsg.textContent = text;
        formMsg.className = `form-msg ${type}`;
        setTimeout(() => { formMsg.textContent = ''; formMsg.className = 'form-msg'; }, 5000);
    }

    // ==================== TOAST ====================
    function toast(msg) {
        const t = document.createElement('div');
        t.style.cssText = `
            position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
            background: var(--bg-panel); color: #f8fafc; padding: 12px 24px;
            border-radius: 8px; border: 1px solid var(--border-subtle);
            font-family: var(--font-body); font-size: 0.875rem; z-index: 10000;
            opacity: 0; transition: opacity 0.3s ease;
        `;
        t.textContent = msg;
        document.body.appendChild(t);
        requestAnimationFrame(() => t.style.opacity = '1');
        setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2500);
    }

    // ==================== ACTIVE NAV LINK ====================
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const pos = window.scrollY + 120;
        sections.forEach(sec => {
            if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
                document.querySelectorAll('.nav-links a').forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${sec.id}`);
                });
            }
        });
    });

    // ==================== PARALLAX HERO ====================
    const heroInner = document.querySelector('.hero-inner');
    window.addEventListener('scroll', () => {
        if (window.innerWidth > 768 && heroInner) {
            const rate = window.scrollY * 0.25;
            heroInner.style.transform = `translateY(${rate}px)`;
            heroInner.style.opacity = Math.max(0, 1 - window.scrollY / 500);
        }
    });

    // ==================== LAZY LOAD IMAGES ====================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imgObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });
        
        lazyImages.forEach(img => imgObserver.observe(img));
    }

    console.log('🎲 EntrePoly v3 loaded — OldMateStudios, Nairobi');
});