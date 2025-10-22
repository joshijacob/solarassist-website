// Mobile menu toggle
document.querySelector('.mobile-toggle')?.addEventListener('click', function() {
    document.querySelector('.nav-menu').classList.toggle('active');
});

// Form submission for contact page
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // Simple form validation
    if (!name || !email || !phone || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Create mailto link
    const subject = `Solar Assist Inquiry from ${name}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0APhone: ${phone}%0D%0AMessage: ${message}`;
    const mailtoLink = `mailto:solanasist25@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Reset form
    this.reset();
    
    // Show success message
    alert('Thank you for your message! Your email client will open to send the message.');
});

// Set active page based on current URL
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active-page');
        } else {
            link.classList.remove('active-page');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.querySelector('.mobile-toggle');
    
    if (navMenu?.classList.contains('active') && 
        !e.target.closest('.nav-menu') && 
        !e.target.closest('.mobile-toggle')) {
        navMenu.classList.remove('active');
    }
});
