/**
 * STACKLY SaaS Landing Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Navbar & Scroll Progress Bar
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scrollProgress');
    
    function updateScrollEffects() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        // Sticky Navbar
        if (navbar) {
            if (scrollTop > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Scroll Progress Bar
        if (scrollProgress) {
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = scrollPercent + '%';
        }
    }
    window.addEventListener('scroll', updateScrollEffects, { passive: true });
    updateScrollEffects();

    // 2. AOS (Animate On Scroll) Initialization & Settings
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 60,
            delay: 40,
            mirror: false
        });
    }

    // 2.1. Enhanced Intersection Observer (IO) Scroll Reveal System
    const revealElements = document.querySelectorAll(
        '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .growth-visual, [data-io-reveal]'
    );
    document.body.classList.add('js-reveal');

    // Auto-setup staggered delays for children in stagger grids across all 5 pages
    const staggerContainers = document.querySelectorAll(
        '.reveal-stagger, .core-services-grid, .special-features-grid, .interop-grid, .sla-grid, .articles-grid, .contact-cards-grid, .benefits-grid, .why-visual-cards-grid, .impact-grid, .compliance-grid, .coordinators-grid, .papers-grid, .trials-grid, .podcasts-grid, .spec-grid, .features-grid, .tech-grid, .values-marquee-content, .team-marquee-content'
    );
    staggerContainers.forEach(container => {
        const items = Array.from(container.children);
        items.forEach((item, idx) => {
            if (!item.hasAttribute('data-aos-delay')) {
                item.style.transitionDelay = `${(idx % 4) * 90}ms`;
            }
        });
    });

    const revealOptions = {
        threshold: 0.08,
        rootMargin: '0px 0px 40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Trigger counters inside the revealed section
                entry.target.querySelectorAll('.counter').forEach(counter => {
                    if (!counter.classList.contains('animated')) {
                        animateCounter(counter);
                        counter.classList.add('animated');
                    }
                });

                // Unobserve after activating to free performance
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
        // If element is already in viewport, activate immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('active');
        }
    });

    // Refresh AOS on window load
    window.addEventListener('load', () => {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    });

    // Smooth Anchor Navigation with Sticky Header Offset
    document.querySelectorAll('a[href^="#"]:not([href="#"]):not([href="#!"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                try {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        const headerOffset = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                } catch (err) {
                    // Fallback to normal navigation if selector is invalid
                }
            }
        });
    });

    // Handle hero counters on immediate load
    document.querySelectorAll('.hero .counter').forEach(counter => {
        setTimeout(() => animateCounter(counter), 800);
        counter.classList.add('animated');
    });

    // 3. Counter Animation Function
    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const prefix = el.getAttribute('data-prefix') !== null ? el.getAttribute('data-prefix') : '';
        const suffix = el.getAttribute('data-suffix') !== null ? el.getAttribute('data-suffix') : '';
        const duration = 2000; // ms
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quintic
            const easedProgress = 1 - Math.pow(1 - progress, 5);
            const current = easedProgress * target;

            if (target % 1 !== 0) {
                el.innerText = prefix + current.toLocaleString('en-US', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 2
                }) + suffix;
            } else {
                el.innerText = prefix + Math.floor(current).toLocaleString('en-US') + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // 3.5. Hero Slider Functionality (Continuous 1.5s Automatic Slide Transitions)
    const slides = document.querySelectorAll('.hero-slider .slide');
    let currentSlide = 0;
    let sliderTimer = null;

    function goToSlide(index) {
        if (!slides || slides.length === 0) return;
        currentSlide = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }

    function startSliderTimer() {
        stopSliderTimer();
        sliderTimer = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 1500);
    }

    function stopSliderTimer() {
        if (sliderTimer) {
            clearInterval(sliderTimer);
            sliderTimer = null;
        }
    }

    if (slides.length > 0) {
        goToSlide(0);
        startSliderTimer();
    }

    // 3.8. Hero Section Buttons Explicit Redirection to 404.html
    const heroButtons = document.querySelectorAll('.hero .btn, .hero .hero-ctas a');
    heroButtons.forEach(btn => {
        btn.setAttribute('href', '404.html');
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = '404.html';
        });
    });

    // 4. Smooth Mouse Parallax with Center-Based Tracking
    const visualArea = document.querySelector('.hero-visuals');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (visualArea && !isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const mouseX = (e.clientX - centerX) / 35;
            const mouseY = (e.clientY - centerY) / 35;

            visualArea.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        });
    }

    // 6. Improved Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileClose = document.getElementById('mobile-close');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileToggle && mobileMenu) {
        // Open mobile menu function
        const openMenu = () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
            mobileToggle.innerHTML = '<i class="ph ph-x"></i>';
            mobileToggle.setAttribute('aria-expanded', 'true');
        };

        // Close mobile menu function
        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            mobileToggle.innerHTML = '<i class="ph ph-list"></i>';
            mobileToggle.setAttribute('aria-expanded', 'false');
        };

        // Toggle mobile menu open/close on click
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mobileMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close button inside menu
        if (mobileClose) {
            mobileClose.addEventListener('click', (e) => {
                e.stopPropagation();
                closeMenu();
            });
        }

        // Close menu when clicking on any menu link or footer login button
        mobileMenu.querySelectorAll('.mobile-nav-links a, .mobile-menu-footer a').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        // Close menu when clicking outside the content drawer (on the backdrop)
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMenu();
            }
        });

        // Close on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }


    // 7. 3D Card Tilt Effect
    const cardContainer = document.querySelector('.card-3d-container');
    const stacklyCard = document.querySelector('.stackly-card');

    if (cardContainer && stacklyCard) {
        cardContainer.addEventListener('mousemove', (e) => {
            const rect = cardContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;

            stacklyCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        cardContainer.addEventListener('mouseleave', () => {
            stacklyCard.style.transform = `rotateX(0) rotateY(0)`;
        });
    }

    // 8. Mobile App Scroll Parallax
    const appSection = document.querySelector('.mobile-app');
    const transactions = document.querySelector('.app-transactions');

    if (appSection && transactions) {
        window.addEventListener('scroll', () => {
            const rect = appSection.getBoundingClientRect();
            const winHeight = window.innerHeight;

            if (rect.top < winHeight && rect.bottom > 0) {
                const scrolled = (winHeight - rect.top) / (winHeight + rect.height);
                const translateY = 100 - (scrolled * 200);
                transactions.style.transform = `translateY(${translateY}px)`;
            }
        });
    }

    // 10. Smooth Header Reveals (Non-Destructive & Guaranteed Visible)
    const kineticHeaders = document.querySelectorAll('.kinetic-header');

    if (kineticHeaders.length > 0 && window.gsap && window.ScrollTrigger) {
        kineticHeaders.forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: "top 90%",
                    toggleActions: "play none none none",
                    once: true
                },
                opacity: 0.2,
                y: 15,
                duration: 0.8,
                ease: "power2.out"
            });
        });
    }

    // 11. Testimonials Slider Logic
    const quoteItems = document.querySelectorAll('.testimonial-quote-item');
    const photoSlides = document.querySelectorAll('.photo-slide');
    const tDots = document.querySelectorAll('.t-dot');
    let currentT = 0;
    const tInterval = 6000;

    if (quoteItems.length > 0) {
        function showTestimonial(index) {
            // Remove active and next classes
            quoteItems.forEach(item => item.classList.remove('active'));
            photoSlides.forEach(slide => {
                slide.classList.remove('active');
                slide.classList.remove('next');
            });
            tDots.forEach(dot => dot.classList.remove('active'));

            // Add active classes
            quoteItems[index].classList.add('active');
            photoSlides[index].classList.add('active');
            tDots[index].classList.add('active');

            // Handle "next" slide preview effect
            const nextIndex = (index + 1) % photoSlides.length;
            photoSlides[nextIndex].classList.add('next');

            // Premium GSAP animation for the content
            gsap.fromTo(quoteItems[index].querySelector('.quote-title'),
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
            );

            gsap.fromTo(quoteItems[index].querySelector('.quote-text'),
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
            );

            gsap.fromTo(quoteItems[index].querySelector('.quote-author'),
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.6, delay: 0.4, ease: "power3.out" }
            );
        }

        function nextTestimonial() {
            currentT = (currentT + 1) % quoteItems.length;
            showTestimonial(currentT);
        }

        let tTimer = setInterval(nextTestimonial, tInterval);

        tDots.forEach(dot => {
            dot.addEventListener('click', () => {
                clearInterval(tTimer);
                currentT = parseInt(dot.getAttribute('data-index'));
                showTestimonial(currentT);
                tTimer = setInterval(nextTestimonial, tInterval);
            });
        });

        // Initialize first slide with preview
        showTestimonial(0);
    }

    // 12. PayOne Features Counter Animation
    function animatePayOneCounter(elementId, targetValue, suffix = '', duration = 2000) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = 0;
        const startTime = performance.now();

        // Parse target value (handle 'k' suffix)
        let numericTarget = targetValue;
        if (typeof targetValue === 'string' && targetValue.includes('k')) {
            numericTarget = parseFloat(targetValue) * 1000;
        }

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation (ease out quart)
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (numericTarget - startValue) * easeOutQuart;

            // Format the display value
            let displayValue;
            if (suffix === '%') {
                displayValue = (currentValue).toFixed(1) + '%';
            } else if (suffix === '+') {
                displayValue = Math.floor(currentValue / 1000) + 'k+';
            } else if (targetValue.toString().includes('k')) {
                displayValue = (currentValue / 1000).toFixed(1) + 'k';
            } else {
                displayValue = Math.floor(currentValue);
            }

            element.textContent = displayValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Observe PayOne section and trigger counters when visible
    const payoneSection = document.querySelector('.payone-features');
    if (payoneSection) {
        const payoneObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate diagnostic accuracy to 99.4%
                    animatePayOneCounter('payoneSuccessRate', 99.4, '%', 2000);

                    // Animate active clinicians to 50k+
                    animatePayOneCounter('payoneBankingCards', '50k', '+', 2000);

                    // Unobserve after animation starts
                    payoneObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        payoneObserver.observe(payoneSection);
    }

    // 13. Medical Process Section Scroll Reveal Animation
    const processSection = document.querySelector('.medical-process-section');
    if (processSection) {
        const processItems = processSection.querySelectorAll('.process-step-item');
        const processLeft = processSection.querySelector('.process-left-col');

        const processObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (window.gsap) {
                        gsap.fromTo(processLeft,
                            { opacity: 0, x: -30 },
                            { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
                        );
                        gsap.fromTo(processItems,
                            { opacity: 0, x: 30 },
                            { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }
                        );
                    }
                    processObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        processObserver.observe(processSection);
    }

    // 14. Goals & CTA Section Scroll Reveal Animation
    const goalsSection = document.querySelector('.goals-cta-section');
    if (goalsSection) {
        const goalsBanner = goalsSection.querySelector('.goals-fade-in');
        const goalsHeader = goalsSection.querySelector('.goals-slide-up');
        const goalsCards = goalsSection.querySelectorAll('.goals-card-reveal');

        const goalsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate banner
                    if (goalsBanner) {
                        goalsBanner.classList.add('goals-active');
                    }

                    // Animate header
                    setTimeout(() => {
                        if (goalsHeader) {
                            goalsHeader.classList.add('goals-active');
                        }
                    }, 200);

                    // Staggered card animation
                    goalsCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('goals-active');
                        }, 400 + (index * 200)); // 200ms delay between each card
                    });

                    // Unobserve after animation
                    goalsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        goalsObserver.observe(goalsSection);
    }

    // 15. Simplified Banking Hero GSAP Animations
    const simplifiedHero = document.querySelector('.simplified-hero');
    if (simplifiedHero) {
        const headline = simplifiedHero.querySelector('.hero-headline');
        const mainImage = simplifiedHero.querySelector('.hero-main-image');
        const leftCards = simplifiedHero.querySelectorAll('.floating-cards-left .dashboard-card');
        const rightCards = simplifiedHero.querySelectorAll('.floating-cards-right .dashboard-card');

        // Entrance Timeline
        const heroTl = gsap.timeline({
            scrollTrigger: {
                trigger: simplifiedHero,
                start: "top 90%",
                toggleActions: "play none none none",
                once: true
            }
        });

        heroTl.from(headline, {
            y: 30,
            opacity: 0.3,
            duration: 0.8,
            ease: "power2.out"
        })
            .from(mainImage, {
                scale: 0.95,
                opacity: 0.3,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.5")
            .from(leftCards, {
                x: -40,
                opacity: 0.3,
                duration: 0.6,
                stagger: 0.15,
                ease: "power2.out"
            }, "-=0.6")
            .from(rightCards, {
                x: 40,
                opacity: 0.3,
                duration: 0.6,
                stagger: 0.15,
                ease: "power2.out"
            }, "-=0.6");

        // Continuous Floating Animations
        const allFloatingCards = simplifiedHero.querySelectorAll('.dashboard-card');
        allFloatingCards.forEach((card, index) => {
            gsap.to(card, {
                y: index % 2 === 0 ? -15 : 15, // Alternating directions
                duration: 2 + (index * 0.5), // Varied speeds
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: index * 0.3 // Varied starts
            });
        });
    }

    // 16. What Makes Us Special (Interactive 4-Tab Showcase)
    const specialTabs = document.querySelectorAll('.special-tab-btn');
    const specialPanels = document.querySelectorAll('.special-tab-panel');

    window.switchSpecialTab = function(targetIndex) {
        const tabs = document.querySelectorAll('.special-tab-btn');
        const panels = document.querySelectorAll('.special-tab-panel');
        const index = parseInt(targetIndex, 10);
        if (isNaN(index) || index < 0 || index >= tabs.length) return;

        // Remove active state from all tabs & panels
        tabs.forEach((t, i) => {
            const isActive = i === index;
            t.classList.toggle('active', isActive);
            t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        panels.forEach(p => {
            const panelIdx = parseInt(p.getAttribute('data-panel'), 10);
            if (panelIdx === index) {
                p.classList.add('active');
                p.style.display = 'block';

                // GSAP animations for rich visual entrance if available
                if (window.gsap) {
                    const leftCol = p.querySelector('.special-left');
                    const cardVisual = p.querySelector('.special-card-visual');
                    const floatingBadge = p.querySelector('.special-floating-badge');
                    const floatingCard = p.querySelector('.special-floating-card');
                    const floatingTag = p.querySelector('.special-floating-tag');
                    const img = p.querySelector('.special-showcase-img');

                    if (leftCol) {
                        gsap.fromTo(leftCol.children,
                            { opacity: 0, y: 15 },
                            { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out", overwrite: "auto" }
                        );
                    }
                    if (cardVisual) {
                        gsap.fromTo(cardVisual,
                            { opacity: 0, scale: 0.96 },
                            { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.1)", overwrite: "auto" }
                        );
                    }
                    if (img) {
                        gsap.fromTo(img,
                            { scale: 1.08 },
                            { scale: 1, duration: 0.65, ease: "power2.out", overwrite: "auto" }
                        );
                    }
                    if (floatingBadge) {
                        gsap.fromTo(floatingBadge,
                            { opacity: 0, y: -10 },
                            { opacity: 1, y: 0, duration: 0.4, delay: 0.15, ease: "power2.out", overwrite: "auto" }
                        );
                    }
                    if (floatingCard) {
                        gsap.fromTo(floatingCard,
                            { opacity: 0, y: 15 },
                            { opacity: 1, y: 0, duration: 0.45, delay: 0.2, ease: "power2.out", overwrite: "auto" }
                        );
                    }
                    if (floatingTag) {
                        gsap.fromTo(floatingTag,
                            { opacity: 0, scale: 0.9 },
                            { opacity: 1, scale: 1, duration: 0.4, delay: 0.25, ease: "back.out(1.4)", overwrite: "auto" }
                        );
                    }
                }
            } else {
                p.classList.remove('active');
                p.style.display = 'none';
            }
        });
    };

    if (specialTabs.length > 0) {
        specialTabs.forEach((tab, index) => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                window.switchSpecialTab(index);
            });

            // Keyboard navigation support (ArrowLeft, ArrowRight)
            tab.addEventListener('keydown', (e) => {
                let newIndex = index;
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    newIndex = (index + 1) % specialTabs.length;
                    window.switchSpecialTab(newIndex);
                    specialTabs[newIndex].focus();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    newIndex = (index - 1 + specialTabs.length) % specialTabs.length;
                    window.switchSpecialTab(newIndex);
                    specialTabs[newIndex].focus();
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    window.switchSpecialTab(0);
                    specialTabs[0].focus();
                } else if (e.key === 'End') {
                    e.preventDefault();
                    window.switchSpecialTab(specialTabs.length - 1);
                    specialTabs[specialTabs.length - 1].focus();
                }
            });
        });
    }

    // 17. Medical Process Dynamic Step Showcase
    const processSteps = document.querySelectorAll('.process-step-item');
    const processImages = document.querySelectorAll('.process-bg-image');

    if (processSteps.length > 0 && processImages.length > 0) {
        processSteps.forEach((step, idx) => {
            function activateStep() {
                // Update active step
                processSteps.forEach(s => s.classList.remove('active'));
                step.classList.add('active');

                // Switch matching image
                processImages.forEach(img => {
                    if (img.getAttribute('data-step-img') === String(idx)) {
                        img.classList.add('active');
                    } else {
                        img.classList.remove('active');
                    }
                });
            }

            step.addEventListener('click', activateStep);
            step.addEventListener('mouseenter', activateStep);
        });
    }

    // 18. Why Choose Us Section Animation & Interactive Tilt
    const whyChooseSection = document.querySelector('.why-choose-us-section');
    if (whyChooseSection) {
        const doctorWrapper = whyChooseSection.querySelector('.main-doctor-card-wrapper');
        const doctorFrame = whyChooseSection.querySelector('.doctor-image-frame');

        // GSAP ScrollTrigger Entrance Animation
        if (window.gsap && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);

            const whyTl = gsap.timeline({
                scrollTrigger: {
                    trigger: whyChooseSection,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    once: true
                }
            });

            if (doctorFrame) {
                whyTl.fromTo(doctorFrame, 
                    { opacity: 0, scale: 0.94, y: 35 },
                    { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "power2.out" }
                );
            }

            const whCard = whyChooseSection.querySelector('.working-hours-floating-card');
            if (whCard) {
                whyTl.fromTo(whCard, 
                    { opacity: 0, scale: 0.85, y: 20 },
                    { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" },
                    "-=0.5"
                );
            }

            const badge = whyChooseSection.querySelector('.why-choose-badge');
            if (badge) {
                whyTl.fromTo(badge, 
                    { opacity: 0, y: -15 },
                    { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
                    "-=0.5"
                );
            }

            const heading = whyChooseSection.querySelector('.why-choose-heading');
            if (heading) {
                whyTl.fromTo(heading, 
                    { opacity: 0, y: 25 },
                    { opacity: 1, y: 0, duration: 0.75, ease: "power2.out" },
                    "-=0.4"
                );
            }

            const lead = whyChooseSection.querySelector('.why-choose-lead');
            if (lead) {
                whyTl.fromTo(lead, 
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                    "-=0.5"
                );
            }

            const visualCards = whyChooseSection.querySelectorAll('.why-visual-card');
            if (visualCards.length > 0) {
                whyTl.fromTo(visualCards, 
                    { opacity: 0, x: 25 },
                    { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" },
                    "-=0.4"
                );
            }

            const bottomRow = whyChooseSection.querySelector('.why-bottom-row');
            if (bottomRow) {
                whyTl.fromTo(bottomRow, 
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                    "-=0.4"
                );
            }
        }

        // 3D Parallax Tilt on Doctor Card for non-touch screens
        if (doctorWrapper && !('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
            doctorWrapper.addEventListener('mousemove', (e) => {
                const rect = doctorWrapper.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const rotateY = (x / rect.width) * 8;
                const rotateX = -(y / rect.height) * 8;

                if (doctorFrame) {
                    doctorFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                }
            });

            doctorWrapper.addEventListener('mouseleave', () => {
                if (doctorFrame) {
                    doctorFrame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
                }
            });
        }
    }

    // 19. Global Link & Button 404 Redirection & Scroll Memory Handler
    // Captures exact scroll position before navigating to 404.html so "Go Back" returns to the exact same position
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button');
        if (!target) return;

        // If clicking any link to 404.html (social icons, demo links, etc.), save current scroll position and page URL
        const href = target.getAttribute('href');
        if (href && (href.includes('404.html') || target.closest('.footer-social-icons') || target.closest('.team-socials'))) {
            sessionStorage.setItem('pulse_last_scroll_pos', window.scrollY.toString());
            sessionStorage.setItem('pulse_return_page', window.location.href);
            return;
        }

        // Skip Authentication Portal controls
        if (target.closest('.auth-card') || target.closest('.auth-wrapper') || target.closest('.auth-tab-nav') || target.classList.contains('auth-tab-btn') || target.classList.contains('role-chip') || target.classList.contains('password-toggle-btn') || target.classList.contains('demo-btn') || target.classList.contains('auth-submit-btn')) return;

        // Skip interactive UI controls, tabs, filters, FAQ accordions, and modals
        if (target.closest('.special-tabs-nav') || target.classList.contains('special-tab-btn') || target.classList.contains('filter-btn') || target.closest('.filter-buttons') || target.closest('.faq-item') || target.classList.contains('faq-question')) return;
        if (target.id === 'mobile-toggle' || target.id === 'mobile-close' || target.closest('.mobile-close')) return;
        if (target.type === 'submit' || target.type === 'button' || target.tagName.toLowerCase() === 'button' || target.closest('form')) return;

        // Skip Header Navigation & Mobile Menu Links
        if (target.closest('#navbar') || target.closest('#mobile-menu')) return;

        // Skip Footer Quick Links (.footer-nav-list)
        if (target.closest('.footer-nav-list')) return;

        // Allow direct links to HTML pages, anchors, tel, mailto
        if (!href) return;
        if (href === '#' || href === '') {
            e.preventDefault();
            return;
        }
        if (href.endsWith('.html') || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('javascript:')) {
            return;
        }

        // Intercept and redirect generic unlinked demo items to 404.html with scroll memory
        e.preventDefault();
        sessionStorage.setItem('pulse_last_scroll_pos', window.scrollY.toString());
        sessionStorage.setItem('pulse_return_page', window.location.href);
        window.location.href = '404.html';
    });

    // 19.1 Global Form Submission 404 Redirection & Scroll Memory Handler
    // Guarantees footer newsletter and demo forms always save exact scroll position on submit
    document.addEventListener('submit', (e) => {
        const form = e.target;
        if (!form) return;
        const action = form.getAttribute('action');
        if (action && action.includes('404.html') || form.classList.contains('footer-newsletter-form')) {
            e.preventDefault();
            sessionStorage.setItem('pulse_last_scroll_pos', window.scrollY.toString());
            sessionStorage.setItem('pulse_return_page', window.location.href);
            window.location.href = '404.html';
        }
    });

    // 20. Instant Direct Scroll Restoration on Return (Eliminates Flash of Top / Hero Section)
    function restoreSavedScrollPosition() {
        const savedScroll = sessionStorage.getItem('pulse_last_scroll_pos');
        if (savedScroll !== null) {
            const targetY = parseFloat(savedScroll);
            try {
                window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
            } catch (err) {
                window.scrollTo(0, targetY);
            }
            document.documentElement.scrollTop = targetY;
            document.body.scrollTop = targetY;
            
            requestAnimationFrame(() => {
                try {
                    window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
                } catch (err) {
                    window.scrollTo(0, targetY);
                }
                document.documentElement.scrollTop = targetY;
                document.documentElement.classList.remove('pulse-restoring-scroll');
            });
            setTimeout(() => {
                try {
                    window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
                } catch (err) {
                    window.scrollTo(0, targetY);
                }
                document.documentElement.scrollTop = targetY;
                document.documentElement.classList.remove('pulse-restoring-scroll');
                sessionStorage.removeItem('pulse_last_scroll_pos');
            }, 60);
        } else {
            document.documentElement.classList.remove('pulse-restoring-scroll');
        }
    }

    restoreSavedScrollPosition();
    window.addEventListener('pageshow', () => {
        restoreSavedScrollPosition();
    });

});






