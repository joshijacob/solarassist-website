document.addEventListener('DOMContentLoaded', function () {

    /* =========================================
       MOBILE MENU TOGGLE
    ========================================= */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            mobileNav.classList.toggle('active');
        });

        document.addEventListener('click', function (event) {
            if (
                mobileNav.classList.contains('active') &&
                !mobileNav.contains(event.target) &&
                !mobileMenuBtn.contains(event.target)
            ) {
                mobileNav.classList.remove('active');
            }
        });
    }

    /* =========================================
       STICKY CTA SMART VISIBILITY
       (Hide when footer or form is visible)
    ========================================= */
    const stickyCTA = document.querySelector('.sticky-cta');
    const contactForm = document.getElementById('contactForm');
    const footer = document.querySelector('footer');

    if (stickyCTA) {
        window.addEventListener('scroll', function () {
            let hideCTA = false;

            if (contactForm) {
                const formRect = contactForm.getBoundingClientRect();
                if (formRect.top < window.innerHeight && formRect.bottom > 0) {
                    hideCTA = true;
                }
            }

            if (footer) {
                const footerRect = footer.getBoundingClientRect();
                if (footerRect.top < window.innerHeight) {
                    hideCTA = true;
                }
            }

            stickyCTA.style.display = hideCTA ? 'none' : 'flex';
        });
    }

    /* =========================================
       CONTACT FORM HANDLING (FORMPREE)
    ========================================= */
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '⏳ Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            /* 🔥 Lead intent tagging */
            formData.append('page', window.location.pathname);
            formData.append('source', document.referrer || 'Direct');
            formData.append('device', window.innerWidth <= 768 ? 'Mobile' : 'Desktop');

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (!response.ok) throw new Error('Form error');

                if (formSuccess) {
                    formSuccess.style.display = 'block';
                }

                contactForm.reset();

                setTimeout(() => {
                    if (formSuccess) formSuccess.style.display = 'none';
                }, 5000);

            })
            .catch(() => {
                alert('Unable to send request. Please call or WhatsApp us for faster support.');
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    /* =========================================
       ACTIVE NAV LINK (SEO + UX)
    ========================================= */
    const currentPath = window.location.pathname.replace('/', '') || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
    });

    /* =========================================
       CLICK TRACKING HOOKS (ADS READY)
       (GA4 / Google Ads can hook later)
    ========================================= */
    document.querySelectorAll('[data-track]').forEach(el => {
        el.addEventListener('click', function () {
            const eventName = el.getAttribute('data-track');

            if (window.gtag) {
                gtag('event', eventName, {
                    page_location: window.location.href
                });
            }
        });
    });

});
