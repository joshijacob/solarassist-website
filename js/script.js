// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-nav');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('mobile-nav') && 
            !navMenu.contains(event.target) && 
            !mobileMenuBtn.contains(event.target)) {
            navMenu.classList.remove('mobile-nav');
        }
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const service = formData.get('service');
            const message = formData.get('message');
            
            // Create WhatsApp message
            const whatsappMessage = `Hello Solar Assist!%0A%0AName: ${name}%0APhone: ${phone}%0AService Needed: ${service}%0AMessage: ${message}`;
            
            // Redirect to WhatsApp
            window.open(`https://wa.me/8281770660?text=${whatsappMessage}`, '_blank');
            
            // Reset form
            contactForm.reset();
            
            // Show success message
            alert('Thank you! Redirecting to WhatsApp to complete your request.');
        });
    }
    
    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
