// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Calculate offset for fixed header
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handler
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const formData = new FormData(form);
    const messageDiv = document.getElementById('form-message');
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // Send form data to Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbwF9JEJysVFy8ktHtpFdIMpwx8Ip-hOHFFTTXHfbfaSyVsg-pdkOZyk8DdD_ODZpd0/exec', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        messageDiv.textContent = '¡Mensaje enviado con éxito! Te contactaremos pronto.';
        messageDiv.className = 'form-message success';
        
        // Reset form
        form.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        // Show error message
        messageDiv.textContent = 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.';
        messageDiv.className = 'form-message error';
    })
    .finally(() => {
        // Restore button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'form-message';
        }, 5000);
    });
});

// Header background on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(5px)';
    } else {
        header.style.backgroundColor = 'white';
        header.style.backdropFilter = 'none';
    }
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.hero-text, .book-details, .author-content, .podcast-content, .preorder-content, .contact-content');
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .hero-text, .book-details, .author-content, .podcast-content, .preorder-content, .contact-content {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
