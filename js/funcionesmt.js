 const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');
        const navbar = document.querySelector('.sticky-nav');
        let lastScrollTop = 0;

        // 1. CONTROL DEL MENÚ HAMBURGUESA
        if (navToggle && navLinks) {
            // Abrir / Cerrar menú al presionar el botón hamburguesa
            navToggle.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita que el clic se propague y active otros enlaces por error
                navLinks.classList.toggle('nav-active');
            });

            // Cerrar el menú automáticamente al hacer clic en cualquier opción/enlace
            document.querySelectorAll('.nav-link, .dropdown-menu a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('nav-active');
                });
            });

            // Cerrar el menú si se hace clic fuera de él en la pantalla
            document.addEventListener('click', (e) => {
                if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                    navLinks.classList.remove('nav-active');
                }
            });
        }

        // 2. OCULTAR Y MOSTRAR BARRA AL HACER SCROLL
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Previene comportamiento errático en rebotes de pantalla (iOS)
            if (scrollTop < 0) return;

            // Solo oculta la barra si hemos bajado más de 80px
            if (scrollTop > lastScrollTop && scrollTop > 80) {
                // Deslizando hacia ABAJO: se oculta la barra
                if (navbar) navbar.classList.add('nav-hidden');
                
                // Si el menú hamburguesa estaba abierto, se cierra al bajar
                if (navLinks) navLinks.classList.remove('nav-active');
            } else {
                // Deslizando hacia ARRIBA: reaparece la barra
                if (navbar) navbar.classList.remove('nav-hidden');
            }

            lastScrollTop = scrollTop;
        });

           

      
        // CONFIGURACIÓN DE CONTENIDOS POR CADA SLIDE
            // CONFIGURACIÓN DE CONTENIDOS Y SU BOTÓN RESPECTIVO POR CADA SLIDE
        const slidesData = [
        {
            category: "",
            title: "BOLETÍN DE ORACIÓN",
            description: "Por la Movilización en Turquía",
            subtag: "",
            button: {
            text: "🙏 Unirse a la Intercesión",
            link: "https://wa.me/51938204456?text=Dios%20le%20bendiga,%20deseo%20unirme%20al%20grupo%20de%20intercesión%20por%20Turquía" // Te desplaza a la guía
            }
        },
        {
            category: "",
            title: "VIDEO INFORMATIVO",
            description: "De la Movilización Reciente en Turquía",
            subtag: "",
            button: {
            text: "▶ Ver Video",
            link: "#video-seccion" // Te desplaza al video
            }
        },
        {
            category: "",
            title: "INVOLÚCRATE",
            description: "Comparte la Movilización en Turquía con tus amigos",
            subtag: "",
            button: {
            text: "↪ Comparte",
            link: "https://api.whatsapp.com/send?text=Te%20invito%20a%20unirte%20a%20la%20Gu%C3%ADa%20de%20Oraci%C3%B3n%20por%20la%20Movilización%20en%20Turqu%C3%ADa:%20https://misionturquia.site/" // Enlace a WhatsApp
            }
        }
        
        
        ];

        let currentSlide = 0;
        
        const SLIDE_INTERVAL = 10000; // 10 segundos

// DURACIONES INDIVIDUALES POR SLIDE
const SLIDE_IMAGE_DURATION = 10000; // 10 segundos para diapositivas con fotos
const SLIDE_VIDEO_DURATION = 14000; // 14 segundos para la diapositiva con video de 14s

let carouselTimer = null;

// Función para reiniciar el temporizador de forma segura según el slide activo
function resetCarouselTimer(duration = SLIDE_IMAGE_DURATION) {
    if (carouselTimer) {
        clearInterval(carouselTimer);
    }
    carouselTimer = setInterval(() => {
        showSlide(currentSlide + 1);
    }, duration);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const textContainer = document.getElementById('carouselTextContainer');
    const buttonsContainer = document.querySelector('.hero-buttons');
    const totalSlides = slides.length;

    if (totalSlides === 0) return;

    // Ajuste de índice circular
    currentSlide = (index + totalSlides) % totalSlides;

    // 1. Iniciar animación de salida (fade-out) para texto y botones
    if (textContainer) textContainer.classList.add('fade-out');
    if (buttonsContainer) buttonsContainer.classList.add('fade-out');

    // 2. Transición de imágenes/videos y puntos
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    const activeSlide = slides[currentSlide];
    activeSlide.classList.add('active');
    
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');

    // 3. CONTROL DE VIDEO (Reinicio a cero y reproducción limpia)
    const video = activeSlide.querySelector('video');
    
    // Pausar cualquier otro video en slides inactivas
    document.querySelectorAll('.carousel-slide video').forEach(v => {
        if (v !== video) v.pause();
    });

    if (video) {
        video.currentTime = 0; // Rebobina al inicio exacto (segundo 0)
        video.play().catch(err => {
            console.warn("Autoplay prevenido por el navegador:", err);
        });
        
        // Ajusta la espera a 14s para que el video termine completo sin cortarse
        resetCarouselTimer(SLIDE_VIDEO_DURATION);
    } else {
        // Asigna el tiempo estándar de 10s para imágenes
        resetCarouselTimer(SLIDE_IMAGE_DURATION);
    }

    // 4. Cambiar contenido y hacer fade-in a los 400ms (Tu lógica intacta)
    setTimeout(() => {
        const data = slidesData[currentSlide];
        if (data) {
            // Textos
            const titleEl = document.getElementById('carouselTitle');
            const descEl = document.getElementById('carouselDescription');
            const catEl = document.getElementById('carouselCategory');

            if (titleEl && data.title) titleEl.textContent = data.title;
            if (descEl && data.description) descEl.textContent = data.description;
            if (catEl && data.category) catEl.textContent = data.category;

            // Actualización dinámica de botones
            const btn1 = document.getElementById('btnGuia');
            const btn2 = document.getElementById('btnVideo');
            const btn3 = document.getElementById('btnIntercesion');

            const buttons = [btn1, btn2, btn3];

            // Ocultar todos los botones primero
            buttons.forEach(btn => {
                if (btn) btn.style.display = 'none';
            });

            // Mostrar solo el correspondiente al slide actual
            const activeBtn = buttons[currentSlide];
            if (activeBtn && data.button) {
                activeBtn.textContent = data.button.text;
                activeBtn.href = data.button.link;
                activeBtn.style.display = 'inline-flex';
                
                if (currentSlide === 2) {
                    activeBtn.target = "_blank";
                } else {
                    activeBtn.removeAttribute("target");
                }
            }
        }

        // Reactivar la visibilidad suave
        if (textContainer) textContainer.classList.remove('fade-out');
        if (buttonsContainer) buttonsContainer.classList.remove('fade-out');
    }, 400);
}

        window.setSlide = function(index) {
        showSlide(index);
        resetCarouselTimer();
        };

      function startCarouselTimer(duration = 10000) {
    if (carouselTimer) clearInterval(carouselTimer);
    
    carouselTimer = setInterval(() => {
        showSlide(currentSlide + 1);
    }, duration);
}

        function stopCarouselTimer() {
        if (carouselTimer) {
            clearInterval(carouselTimer);
            carouselTimer = null;
        }
        }

        function resetCarouselTimer() {
        stopCarouselTimer();
        startCarouselTimer();
        }

        // --- Soporte para Deslizar con el Dedo (Swipe Táctil) ---
        let touchStartX = 0;
        let touchEndX = 0;

        function initSwipeSupport() {
        const heroHeader = document.querySelector('.hero-header');
        if (!heroHeader) return;

        heroHeader.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopCarouselTimer(); // Pausa el tiempo al tocar la pantalla
        }, { passive: true });

        heroHeader.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startCarouselTimer(); // Reinicia el temporizador de 10 segundos al soltar
        }, { passive: true });
        }

        function handleSwipe() {
        const minSwipeDistance = 40; // Distancia mínima en píxeles para considerar un swipe
        const swipeDistance = touchEndX - touchStartX;

        if (swipeDistance < -minSwipeDistance) {
            showSlide(currentSlide + 1); // Deslizar hacia la izquierda (Siguiente)
        } else if (swipeDistance > minSwipeDistance) {
            showSlide(currentSlide - 1); // Deslizar hacia la derecha (Anterior)
        }
        }

        // Inicialización
        document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelectorAll('.carousel-slide').length > 0) {
            showSlide(0);
            startCarouselTimer();
            initSwipeSupport();
        }
        });

        const themeToggleBtn = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');

        // 1. Verificar si el usuario ya tenía guardado el modo oscuro
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            if (themeIcon) themeIcon.textContent = 'light_mode';
        }

        // 2. Alternar entre modo claro y modo oscuro al hacer clic
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');

                if (document.body.classList.contains('dark-mode')) {
                    themeIcon.textContent = 'light_mode'; // Cambia el ícono a Sol
                    localStorage.setItem('theme', 'dark'); // Guarda la preferencia
                } else {
                    themeIcon.textContent = 'dark_mode'; // Cambia el ícono a Luna
                    localStorage.setItem('theme', 'light');
                }
            });
        }


       


        // Abrir y cerrar el menú desplegable
        // Función para abrir/cerrar el menú desplegable actual
        function toggleShareMenu(btnElement, event) {
            event.stopPropagation();
            
            // Busca el menú que está justo al lado del botón presionado
            const parentContainer = btnElement.closest('.share-dropdown');
            const menu = parentContainer.querySelector('.share-menu');

            // Cierra cualquier otro menú que pudiera estar abierto en la página
            document.querySelectorAll('.share-menu.show').forEach(openMenu => {
                if (openMenu !== menu) {
                    openMenu.classList.remove('show');
                }
            });

            // Alterna el menú actual
            menu.classList.toggle('show');
        }

        // Cierra cualquier menú abierto si el usuario hace clic fuera de él
        window.addEventListener('click', function() {
            document.querySelectorAll('.share-menu.show').forEach(openMenu => {
                openMenu.classList.remove('show');
            });
        });

      

        // Compartir en WhatsApp
        function shareToWhatsApp() {
            const text = "Únete a nosotros en oración y apoya la obra en Turquía: ";
            const url = window.location.href;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + url)}`, '_blank');
        }

        // Compartir en Facebook
        function shareToFacebook() {
            const url = window.location.href;
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        }

        // Copiar enlace al portapapeles
        function copyPageLink() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert("¡Enlace copiado al portapapeles!");
            }).catch(err => {
                console.error("Error al copiar: ", err);
            });
        }

let deferredPrompt;
const installBtn = document.getElementById('btnInstalarApp');

// Detectar si el usuario está usando un iPhone / iPad (iOS)
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// 1. CASO CHROME / ANDROID / PC: Se activa con el evento nativo
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    if (installBtn) {
        installBtn.style.display = 'inline-flex';
    }
});

// 2. CASO SAFARI / IOS: Se muestra el botón con una instrucción
if (isIOS && installBtn) {
    // En iOS siempre mostramos el botón
    installBtn.style.display = 'inline-flex';
    
    installBtn.addEventListener('click', () => {
        alert("Para instalar en tu iPhone:\n1. Toca el botón 'Compartir' (el icono con la flecha hacia arriba en Safari).\n2. Selecciona 'Agregar al inicio'.");
    });
} else if (installBtn) {
    // Acción para Chrome / Android / Edge
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        deferredPrompt = null;
        installBtn.style.display = 'none';
    });
}

// Ocultar si ya está instalada la App
window.addEventListener('appinstalled', () => {
    if (installBtn) installBtn.style.display = 'none';
});