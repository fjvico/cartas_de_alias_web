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

// Form submission handler
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const formData = new FormData(form);
    const messageDiv = document.getElementById('form-message');
    
    // Mostrar estado de carga
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // Convertir FormData a objeto JSON
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // URL de tu Google Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzq-HrMUdAPZoVpEUZE-3b7neEhBGjGxUpaYgN0zS2PZ9BfysKMNisz-gJED76Goko/exec';
    
    // Enviar datos al Google Script
    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(formObject),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error de red: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.result === 'success') {
            // Mostrar mensaje de éxito
            messageDiv.textContent = '¡Mensaje enviado con éxito! Te contactaremos pronto.';
            messageDiv.className = 'form-message success';
            
            // Resetear formulario
            form.reset();
        } else {
            throw new Error(data.message || 'Error del servidor');
        }
    })
    .catch(error => {
        console.error('Error completo:', error);
        // Mostrar mensaje de error específico
        messageDiv.textContent = 'Hubo un error al enviar el mensaje: ' + error.message;
        messageDiv.className = 'form-message error';
    })
    .finally(() => {
        // Restaurar estado del botón
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Ocultar mensaje después de 8 segundos
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'form-message';
        }, 8000);
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
