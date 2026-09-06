(function() {
    'use strict';

    initNavbar();
    initScrollReveal();
    initCounters();
    initMobileNav();
    initForceDownload();

    // ===== NAVBAR =====
    function initNavbar() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // ===== MOBILE NAV =====
    function initMobileNav() {
        const toggle = document.getElementById('nav-toggle');
        const links = document.querySelector('.nav-links');
        if (!toggle || !links) return;
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            links.classList.toggle('open');
        });
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                toggle.classList.remove('active');
                links.classList.remove('open');
            });
        });
    }

    // ===== SCROLL REVEAL =====
    function initScrollReveal() {
        const els = document.querySelectorAll('.skill-card, .project-card, .cert-card, .screenshot-card, .contact-card, .about-text, .hero-badge, .hero-desc, .hero-actions, .hero-stats');
        els.forEach(el => el.classList.add('reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), i * 60);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        els.forEach(el => observer.observe(el));
    }

    // ===== COUNTER ANIMATION =====
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
                    let current = 0;
                    const step = Math.max(1, Math.floor(target / 30));
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = current;
                    }, 40);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => observer.observe(c));
    }

    // ===== FORCE DOWNLOAD (bypasses mobile browsers hijacking .pdf links into a broken viewer) =====
    function initForceDownload() {
        document.querySelectorAll('a[data-force-download]').forEach(link => {
            link.addEventListener('click', async function(e) {
                e.preventDefault();
                const url = this.getAttribute('href');
                const filename = url.split('/').pop();
                const originalText = this.textContent;
                try {
                    this.textContent = 'Скачивание…';
                    const response = await fetch(url);
                    if (!response.ok) throw new Error('network');
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
                } catch (err) {
                    // Last resort fallback: plain navigation to the file
                    window.location.href = url;
                } finally {
                    this.textContent = originalText;
                }
            });
        });
    }

})();
