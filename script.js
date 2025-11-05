// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handler - VERSIÓN SIMPLIFICADA
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const messageDiv = document.getElementById('form-message');
    
    // Mostrar estado de carga
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // URL de tu Google Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzq-HrMUdAPZoVpEUZE-3b7neEhBGjGxUpaYgN0zS2PZ9BfysKMNisz-gJED76Goko/exec';
    
    // Crear formulario dinámico para enviar
    const tempForm = document.createElement('form');
    tempForm.method = 'POST';
    tempForm.action = scriptURL;
    tempForm.style.display = 'none';
    
    // Añadir campos al formulario
    const fields = ['name', 'email', 'subject', 'message'];
    fields.forEach(field => {
        const input = document.createElement('input');
        input.name = field;
        input.value = form.querySelector(`[name="${field}"]`).value;
        tempForm.appendChild(input);
    });
    
    // Añadir formulario al documento y enviar
    document.body.appendChild(tempForm);
    tempForm.submit();
    
    // Mostrar mensaje de éxito (asumimos que funciona)
    messageDiv.textContent = '¡Mensaje enviado con éxito! Te contactaremos pronto.';
    messageDiv.className = 'form-message success';
    form.reset();
    
    // Restaurar estado del botón después de un delay
    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        document.body.removeChild(tempForm);
        
        // Ocultar mensaje después de 8 segundos
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'form-message';
        }, 8000);
    }, 1000);
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
