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

// Form submission handler - VERSIÓN MEJORADA
document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const messageDiv = document.getElementById('form-message');
    
    // Mostrar estado de carga
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // Obtener datos del formulario
    const formData = {
        name: form.querySelector('[name="name"]').value,
        email: form.querySelector('[name="email"]').value,
        subject: form.querySelector('[name="subject"]').value,
        message: form.querySelector('[name="message"]').value
    };
    
    console.log('Enviando datos:', formData);
    
    // URL de tu Google Script - ACTUALIZA ESTA URL CON LA NUEVA
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzFtEOuzPw8RlYL0CXGU9nfN8WDIWyC6R4CmQPd0b3f1GtzpuT42V7FTcUl09QdmOk/exec';
    
    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        console.log('Respuesta recibida:', response);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Datos respuesta:', data);
        
        if (data.status === 'success') {
            messageDiv.textContent = '¡Mensaje enviado con éxito! Te contactaremos pronto.';
            messageDiv.className = 'form-message success';
            form.reset();
        } else {
            throw new Error(data.message || 'Error del servidor');
        }
        
    } catch (error) {
        console.error('Error completo:', error);
        
        // Mensajes de error más específicos
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            messageDiv.textContent = 'Error de conexión. Verifica tu internet o intenta más tarde.';
        } else if (error.message.includes('CORS')) {
            messageDiv.textContent = 'Error de configuración del servidor.';
        } else {
            messageDiv.textContent = `Error: ${error.message}`;
        }
        
        messageDiv.className = 'form-message error';
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'form-message';
        }, 8000);
    }
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
