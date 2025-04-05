document.addEventListener('DOMContentLoaded', () => {
    // Variables
    const navLinks = document.querySelector('.nav-links');
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.navbar');
    const links = document.querySelectorAll('.nav-links li');
    const hiddenLinks = document.querySelectorAll('.hidden-content');
    const poemas = document.querySelectorAll('.poema');
    const prevBtn = document.getElementById('prevPoema');
    const nextBtn = document.getElementById('nextPoema');
    const loginBtn = document.getElementById('loginBtn');
    const loginText = document.getElementById('loginText');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');
    const loginRequired = document.getElementById('loginRequired');
    const loginRequiredBtn = document.getElementById('loginRequiredBtn');
    const specialContentLocked = document.getElementById('specialContentLocked');
    const hiddenContent = document.getElementById('hiddenContent');
    const imageModal = document.getElementById('imageModal');
    const expandedImg = document.getElementById('expandedImg');
    const closeImg = document.querySelector('.close-img');
    const ctaBtn = document.getElementById('ctaBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const body = document.body;

    // Crear overlay para el menú móvil
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    body.appendChild(overlay);

    // Índice actual del poema
    let currentPoemaIndex = 0;
    
    // Estado de login
    let isLoggedIn = false;
    
    // Credenciales - CAMBIA ESTO con tus credenciales reales
    // Estas serán las respuestas que tu pareja tendrá que ingresar
    const correctUsername = "Peluchito"; // Tu apodo especial o palabra clave
    const correctPassword = "06/06/2024"; // La fecha en que se conocieron o alguna fecha especial

    // Verificar si ya está logueado (almacenamiento local)
    checkLoginStatus();

    // Crear corazones flotantes
    createFloatingHearts();

    // Detección de dispositivo móvil
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Event Listeners
    burger.addEventListener('click', toggleNav);
    overlay.addEventListener('click', closeNav);
    window.addEventListener('scroll', scrollFunction);
    window.addEventListener('resize', handleResize);
    prevBtn.addEventListener('click', showPrevPoema);
    nextBtn.addEventListener('click', showNextPoema);
    loginBtn.addEventListener('click', openLoginModal);
    closeModal.addEventListener('click', closeLoginModal);
    loginForm.addEventListener('submit', handleLogin);
    loginRequiredBtn.addEventListener('click', openLoginModal);
    closeImg.addEventListener('click', closeImageViewer);
    ctaBtn.addEventListener('click', handleCTAClick);
    logoutBtn.addEventListener('click', performLogout);

    // Añadir event listeners para ocultar el teclado virtual cuando se hace tap fuera de los inputs en dispositivos móviles
    if (isMobile) {
        document.addEventListener('click', function(e) {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                document.activeElement.blur();
            }
        });
    }

    // Funciones

    // Verificar estado de login
    function checkLoginStatus() {
        const loginStatus = localStorage.getItem('isLoggedIn');
        if (loginStatus === 'true') {
            isLoggedIn = true;
            document.body.classList.add('logged-in'); // Añadir clase logged-in al body
            loginText.textContent = 'Mi Amor';
            logoutBtn.style.display = 'block'; // Mostrar botón de logout
            showLoggedInContent();
        } else {
            isLoggedIn = false;
            document.body.classList.remove('logged-in'); // Remover clase logged-in del body
            loginText.textContent = 'Ingresar';
            logoutBtn.style.display = 'none'; // Ocultar botón de logout
            showLoginRequired();
        }
    }

    // Navegación
    function toggleNav() {
        navLinks.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        overlay.classList.toggle('overlay-active');
        body.classList.toggle('body-no-scroll');
        
        // Animar los links
        links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    }

    // Cerrar navegación
    function closeNav() {
        if (navLinks.classList.contains('nav-active')) {
            navLinks.classList.remove('nav-active');
            burger.classList.remove('toggle');
            overlay.classList.remove('overlay-active');
            body.classList.remove('body-no-scroll');
            
            links.forEach(link => {
                link.style.animation = '';
            });
        }
    }

    // Manejar redimensionamiento de la ventana
    function handleResize() {
        // Si la ventana se redimensiona a un tamaño desktop y el menú móvil está abierto, cerrarlo
        if (window.innerWidth > 768 && navLinks.classList.contains('nav-active')) {
            closeNav();
        }
        
        // Ajustar altura del contenedor de poemas en dispositivos móviles pequeños
        if (isLoggedIn) {
            adjustPoemaContainerHeight();
        }
    }

    // Función al hacer scroll
    function scrollFunction() {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    // Crear corazones flotantes
    function createFloatingHearts() {
        const heartsContainer = document.querySelector('.floating-hearts');
        const colors = ['#8A2BE2', '#A56EF2', '#F8BBD0', '#E1BEE7', '#6A1B9A'];
        
        // Reducir cantidad de corazones en dispositivos móviles para mejor rendimiento
        const heartCount = window.innerWidth <= 576 ? 10 : 20;
        
        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('i');
            heart.classList.add('fas', 'fa-heart');
            heart.style.fontSize = `${Math.random() * 20 + 10}px`;
            heart.style.position = 'absolute';
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.top = `${Math.random() * 100}%`;
            heart.style.color = colors[Math.floor(Math.random() * colors.length)];
            heart.style.opacity = Math.random() * 0.5 + 0.2;
            heart.style.animation = `float ${Math.random() * 6 + 3}s ease-in-out infinite`;
            heart.style.animationDelay = `${Math.random() * 5}s`;
            
            heartsContainer.appendChild(heart);
        }
    }

    // Mostrar poema anterior
    function showPrevPoema() {
        if (!isLoggedIn) return; // No hacer nada si no está logueado
        
        poemas[currentPoemaIndex].classList.remove('active');
        currentPoemaIndex = (currentPoemaIndex - 1 + poemas.length) % poemas.length;
        poemas[currentPoemaIndex].classList.add('active');
        adjustPoemaContainerHeight();
    }

    // Mostrar siguiente poema
    function showNextPoema() {
        if (!isLoggedIn) return; // No hacer nada si no está logueado
        
        poemas[currentPoemaIndex].classList.remove('active');
        currentPoemaIndex = (currentPoemaIndex + 1) % poemas.length;
        poemas[currentPoemaIndex].classList.add('active');
        adjustPoemaContainerHeight();
    }

    // Cambiar poemas automáticamente (solo cuando está logueado)
    let poemInterval;
    
    function startPoemaRotation() {
        if (poemInterval) clearInterval(poemInterval);
        poemInterval = setInterval(showNextPoema, 10000);
    }

    // Pausa la rotación automática cuando el usuario interactúa
    function pausePoemaRotation() {
        clearInterval(poemInterval);
        // Reiniciar después de 30 segundos de inactividad
        startPoemaRotation();
    }

    // Abrir modal de login
    function openLoginModal() {
        loginModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Enfoque automático en el primer campo en desktop
        if (!isMobile) {
            setTimeout(() => {
                document.getElementById('username').focus();
            }, 300);
        }
    }

    // Cerrar modal de login
    function closeLoginModal() {
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Cuando el usuario hace clic fuera del modal
    window.onclick = function(event) {
        if (event.target == loginModal) {
            closeLoginModal();
        }
        if (event.target == imageModal) {
            closeImageViewer();
        }
    }

    // Manejar envío del formulario de login
    function handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (username && password) {
            if (username === correctUsername && password === correctPassword) {
                // Login exitoso
                isLoggedIn = true;
                localStorage.setItem('isLoggedIn', 'true');
                document.body.classList.add('logged-in'); // Añadir clase logged-in al body
                loginText.textContent = 'Mi Amor';
                logoutBtn.style.display = 'block'; // Mostrar botón de logout
                closeLoginModal();
                showLoggedInContent();
                
                // Mostrar un mensaje de bienvenida
                showWelcomeMessage();
            } else {
                // Login fallido
                alert('Mmm, parece que no recuerdas Tu apodo especial o nuestra fecha especial. ¡Inténtalo de nuevo!');
            }
        } else {
            alert('Por favor, completa ambos campos.');
        }
    }

    // Función para cerrar sesión
    function performLogout() {
        localStorage.removeItem('isLoggedIn');
        isLoggedIn = false;
        document.body.classList.remove('logged-in'); // Remover clase logged-in del body
        loginText.textContent = 'Ingresar';
        logoutBtn.style.display = 'none'; // Ocultar botón de logout
        hiddenLinks.forEach(link => {
            link.style.display = 'none';
        });
        showLoginRequired();
        
        // Mostrar mensaje de despedida
        showGoodbyeMessage();
        
        // Scroll back to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Mostrar mensaje de bienvenida
    function showWelcomeMessage() {
        const welcomeMsg = document.createElement('div');
        welcomeMsg.classList.add('welcome-msg');
        welcomeMsg.innerHTML = `<p>¡Bienvenido a nuestro espacio especial! ❤️</p>`;
        welcomeMsg.style.position = 'fixed';
        welcomeMsg.style.top = '100px';
        welcomeMsg.style.left = '50%';
        welcomeMsg.style.transform = 'translateX(-50%)';
        welcomeMsg.style.backgroundColor = 'var(--primary-color)';
        welcomeMsg.style.color = 'white';
        welcomeMsg.style.padding = '15px 25px';
        welcomeMsg.style.borderRadius = '8px';
        welcomeMsg.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        welcomeMsg.style.zIndex = '1001';
        welcomeMsg.style.opacity = '0';
        welcomeMsg.style.transition = 'opacity 0.3s ease';
        welcomeMsg.style.width = window.innerWidth <= 576 ? '90%' : 'auto';
        welcomeMsg.style.maxWidth = '300px';
        
        document.body.appendChild(welcomeMsg);
        
        setTimeout(() => {
            welcomeMsg.style.opacity = '1';
        }, 100);
        
        setTimeout(() => {
            welcomeMsg.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(welcomeMsg);
            }, 300);
        }, 3000);
    }

    // Función para mostrar mensaje de despedida
    function showGoodbyeMessage() {
        const goodbyeMsg = document.createElement('div');
        goodbyeMsg.classList.add('welcome-msg');
        goodbyeMsg.innerHTML = `<p>¡Hasta pronto! ❤️</p>`;
        goodbyeMsg.style.position = 'fixed';
        goodbyeMsg.style.top = '100px';
        goodbyeMsg.style.left = '50%';
        goodbyeMsg.style.transform = 'translateX(-50%)';
        goodbyeMsg.style.backgroundColor = 'var(--primary-color)';
        goodbyeMsg.style.color = 'white';
        goodbyeMsg.style.padding = '15px 25px';
        goodbyeMsg.style.borderRadius = '8px';
        goodbyeMsg.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        goodbyeMsg.style.zIndex = '1001';
        goodbyeMsg.style.opacity = '0';
        goodbyeMsg.style.transition = 'opacity 0.3s ease';
        goodbyeMsg.style.width = window.innerWidth <= 576 ? '90%' : 'auto';
        goodbyeMsg.style.maxWidth = '300px';
        
        document.body.appendChild(goodbyeMsg);
        
        setTimeout(() => {
            goodbyeMsg.style.opacity = '1';
        }, 100);
        
        setTimeout(() => {
            goodbyeMsg.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(goodbyeMsg);
            }, 300);
        }, 3000);
    }

    // Mostrar contenido cuando está logueado
    function showLoggedInContent() {
        // No modificamos manualmente el display de los elementos porque 
        // se controla mediante las clases CSS en el body
        
        // Mostrar enlaces ocultos en la navegación
        hiddenLinks.forEach(link => {
            link.style.display = 'block';
        });
        
        // Inicializar funcionalidades que dependen del contenido oculto
        setTimeout(() => {
            initializeHiddenContentFunctions();
        }, 100);
    }
    
    // Inicializar funciones relacionadas con el contenido oculto
    function initializeHiddenContentFunctions() {
        // Ajustar altura de poemas
        adjustPoemaContainerHeight();
        
        // Configurar animaciones de entrada
        setupAnimations();
        
        // Iniciar rotación de poemas
        startPoemaRotation();
        
        // Añadir eventos para pausar la rotación
        prevBtn.addEventListener('click', pausePoemaRotation);
        nextBtn.addEventListener('click', pausePoemaRotation);
    }

    // Mostrar sección de login requerido
    function showLoginRequired() {
        // No modificamos manualmente el display de los elementos porque 
        // se controla mediante las clases CSS en el body
        
        // Ocultar enlaces en la navegación
        hiddenLinks.forEach(link => {
            link.style.display = 'none';
        });
    }
    
    // Ajustar altura del contenedor de poemas
    function adjustPoemaContainerHeight() {
        if (!isLoggedIn) return; // No hacer nada si no está logueado
        
        const poemaContainer = document.querySelector('.poema-container');
        if (!poemaContainer) return;
        
        if (window.innerWidth <= 576) {
            const activePoema = document.querySelector('.poema.active');
            if (activePoema) {
                const poemaHeight = activePoema.scrollHeight;
                poemaContainer.style.height = `${poemaHeight + 20}px`; // 20px extra para padding
            }
        } else {
            // Restaurar altura para pantallas más grandes
            poemaContainer.style.height = window.innerWidth <= 320 ? '360px' : 
                                         window.innerWidth <= 768 ? '340px' : '300px';
        }
    }

    // Expandir imagen de la galería
    window.expandImage = function(element) {
        if (!isLoggedIn) return; // No hacer nada si no está logueado
        
        const img = element.querySelector('img');
        if (img) {
            expandedImg.src = img.src;
            imageModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        } else {
            // Si es un placeholder, no hacer nada o mostrar mensaje
            alert('Aquí deberías colocar tu foto especial');
        }
    }

    // Cerrar el visor de imágenes
    function closeImageViewer() {
        imageModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Manejar click en botón CTA
    function handleCTAClick() {
        if (isLoggedIn) {
            // Si está logueado, desplazar a la sección de historias
            const historiasSection = document.getElementById('historias');
            historiasSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Si no está logueado, abrir el modal de login
            openLoginModal();
        }
    }

    // Configurar animaciones para elementos del contenido oculto
    function setupAnimations() {
        if (!isLoggedIn) return; // No hacer nada si no está logueado
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                        observer.unobserve(entry.target); // Dejar de observar después de animar
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            
            // Observar elementos a animar
            const elementsToAnimate = document.querySelectorAll('.card, .timeline-item, .message-container');
            elementsToAnimate.forEach(element => {
                element.style.opacity = "0";
                element.style.transform = "translateY(20px)";
                element.style.transition = "all 0.6s ease-out";
                observer.observe(element);
            });
        } else {
            // Fallback para navegadores que no soportan IntersectionObserver
            const animatedElements = document.querySelectorAll('.card, .timeline-item, .message-container');
            animatedElements.forEach(element => {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            });
        }
    }

    // Smooth scrolling para navegación con soporte para iOS
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            // Si el enlace es para un contenido oculto y el usuario no ha iniciado sesión, mostrar modal de login
            if (!isLoggedIn && this.parentElement.classList.contains('hidden-content')) {
                openLoginModal();
                return;
            }
            
            if (targetElement) {
                // Cerrar el menú móvil si está abierto
                if (navLinks.classList.contains('nav-active')) {
                    closeNav();
                }
                
                // Calcular posición con offset para la barra de navegación
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20; // 20px de espacio adicional
                
                // Realizar el scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Fix para Safari iOS - ajustar vh units cuando aparece/desaparece la barra de navegación
    if (isMobile) {
        const setVH = () => {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
        setVH();
    }
    
    // Soporte para "pull to refresh" en iOS
    let touchstartY = 0;
    document.addEventListener('touchstart', function(e) {
        touchstartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        const touchY = e.touches[0].clientY;
        const touchDiff = touchY - touchstartY;
        
        // Si el scroll está al principio y el usuario intenta hacer pull down, prevenir el comportamiento por defecto
        if (window.scrollY === 0 && touchDiff > 0) {
            e.preventDefault();
        }
    }, { passive: false });
});