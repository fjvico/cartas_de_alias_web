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

// VERSIÓN CON DEPURACIÓN COMPLETA
document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const messageDiv = document.getElementById('form-message');
    
    // Panel de depuración
    let debugDiv = document.getElementById('debug-panel');
    if (!debugDiv) {
        debugDiv = document.createElement('div');
        debugDiv.id = 'debug-panel';
        debugDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #000;
            color: #0f0;
            padding: 15px;
            border-radius: 8px;
            max-width: 400px;
            max-height: 400px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(debugDiv);
    }
    
    function logDebug(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const color = type === 'error' ? '#f00' : type === 'success' ? '#0f0' : '#fff';
        const line = document.createElement('div');
        line.style.color = color;
        line.textContent = `[${timestamp}] ${message}`;
        debugDiv.appendChild(line);
        debugDiv.scrollTop = debugDiv.scrollHeight;
        console.log(`[${type.toUpperCase()}]`, message);
    }
    
    logDebug('=== INICIO DE ENVÍO ===');
    
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
    
    logDebug('Datos del formulario: ' + JSON.stringify(formData));
    
    // COLOCA AQUÍ TU URL - URL DE EJEMPLO, DEBES CAMBIARLA
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzFtEOuzPw8RlYL0CXGU9nfN8WDIWyC6R4CmQPd0b3f1GtzpuT42V7FTcUl09QdmOk/exec';
    
    logDebug('URL del script: ' + scriptURL);
    
    // Probar diferentes métodos
    logDebug('--- MÉTODO 1: POST con no-cors ---');
    
    try {
        logDebug('Enviando petición POST...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
        
        const response = await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        logDebug('Respuesta recibida (no-cors)');
        logDebug('Type: ' + response.type);
        logDebug('Status: ' + response.status);
        
        // Con no-cors, si llegamos aquí sin error, asumimos éxito
        messageDiv.textContent = '¡Mensaje enviado! Verifica tu Google Sheet.';
        messageDiv.className = 'form-message success';
        logDebug('✓ ÉXITO: Petición completada', 'success');
        form.reset();
        
    } catch (error) {
        logDebug('✗ ERROR en Método 1: ' + error.name + ' - ' + error.message, 'error');
        
        // Intentar método alternativo
        logDebug('--- MÉTODO 2: GET con parámetros ---');
        
        try {
            const params = new URLSearchParams(formData);
            const getURL = `${scriptURL}?${params.toString()}`;
            
            logDebug('URL GET: ' + getURL.substring(0, 100) + '...');
            
            const getResponse = await fetch(getURL, {
                method: 'GET',
                mode: 'no-cors'
            });
            
            logDebug('Respuesta GET recibida');
            messageDiv.textContent = '¡Mensaje enviado! (método alternativo)';
            messageDiv.className = 'form-message success';
            logDebug('✓ ÉXITO con método GET', 'success');
            form.reset();
            
        } catch (error2) {
            logDebug('✗ ERROR en Método 2: ' + error2.name + ' - ' + error2.message, 'error');
            
            // Último intento: FormData
            logDebug('--- MÉTODO 3: FormData POST ---');
            
            try {
                const formDataObj = new FormData();
                Object.keys(formData).forEach(key => {
                    formDataObj.append(key, formData[key]);
                });
                
                const formResponse = await fetch(scriptURL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formDataObj
                });
                
                logDebug('Respuesta FormData recibida');
                messageDiv.textContent = '¡Mensaje enviado! (FormData)';
                messageDiv.className = 'form-message success';
                logDebug('✓ ÉXITO con FormData', 'success');
                form.reset();
                
            } catch (error3) {
                logDebug('✗ ERROR en Método 3: ' + error3.name + ' - ' + error3.message, 'error');
                
                // Diagnóstico adicional
                logDebug('--- DIAGNÓSTICO ---');
                logDebug('Navigator online: ' + navigator.onLine);
                logDebug('User Agent: ' + navigator.userAgent.substring(0, 50));
                
                messageDiv.textContent = 'Error: No se pudo conectar con el servidor. Ver panel de depuración.';
                messageDiv.className = 'form-message error';
            }
        }
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        logDebug('=== FIN DE PROCESO ===');
        
        // Agregar botón para copiar logs
        if (!document.getElementById('copy-logs-btn')) {
            const copyBtn = document.createElement('button');
            copyBtn.id = 'copy-logs-btn';
            copyBtn.textContent = 'Copiar Logs';
            copyBtn.style.cssText = `
                margin-top: 10px;
                padding: 5px 10px;
                background: #0f0;
                color: #000;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            `;
            copyBtn.onclick = () => {
                const logs = debugDiv.innerText;
                navigator.clipboard.writeText(logs).then(() => {
                    copyBtn.textContent = '✓ Copiado!';
                    setTimeout(() => copyBtn.textContent = 'Copiar Logs', 2000);
                });
            };
            debugDiv.appendChild(copyBtn);
        }
        
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
