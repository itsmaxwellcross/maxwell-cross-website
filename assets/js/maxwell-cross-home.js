/**
 * Maxwell Cross - Homepage Scripts
 */

(function() {
    'use strict';

    // ============================================
    // TERMINAL TYPING EFFECT
    // ============================================
    function initTerminalEffect() {
        const terminalLines = document.querySelectorAll('.mc-hero .mc-terminal__output');
        let delay = 500;
        
        terminalLines.forEach((line, index) => {
            line.style.opacity = '0';
            setTimeout(() => {
                line.style.transition = 'opacity 0.3s ease';
                line.style.opacity = '1';
            }, delay + (index * 400));
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            });
        });
    }

    // ============================================
    // SCROLL ANIMATIONS (FADE IN ON SCROLL)
    // ============================================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('mc-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Elements to animate
        const animatedElements = document.querySelectorAll(
            '.mc-post, .mc-about__content, .mc-about__terminal, .mc-newsletter-cta__card'
        );
        
        animatedElements.forEach(el => {
            el.classList.add('mc-animate');
            observer.observe(el);
        });
    }

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    function initNavbarScroll() {
        const navbar = document.querySelector('.mc-home .top');
        if (!navbar) return;

        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add background when scrolled
            if (currentScroll > 50) {
                navbar.classList.add('mc-navbar--scrolled');
            } else {
                navbar.classList.remove('mc-navbar--scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }

    // ============================================
    // CURSOR BLINK EFFECT FOR TERMINAL
    // ============================================
    function initCursorBlink() {
        const cursors = document.querySelectorAll('.mc-terminal__cursor');
        cursors.forEach(cursor => {
            setInterval(() => {
                cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
            }, 530);
        });
    }

    // ============================================
    // INITIALIZE ALL
    // ============================================
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onReady);
        } else {
            onReady();
        }
    }

    function onReady() {
        initTerminalEffect();
        initSmoothScroll();
        initScrollAnimations();
        initNavbarScroll();
        initCursorBlink();
        
        console.log('[Maxwell Cross] Homepage scripts loaded');
    }

    // Run initialization
    init();

})();
