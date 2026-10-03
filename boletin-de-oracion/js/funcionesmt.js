/* ==========================================================================
   OCULTAR PANTALLA DE CARGA CUANDO LA PÁGINA ESTÉ LISTA
   ========================================================================== */

window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    // Breve pausa de 200ms para asegurar una transición visual agradable
    setTimeout(() => {
      loader.classList.add('loader-hidden');
    }, 200);
  }
});

// Respaldo de seguridad: si alguna imagen o recurso tarda demasiado,
// el loader se ocultará automáticamente a los 4 segundos para no bloquear al usuario.
setTimeout(() => {
  const loader = document.getElementById('pageLoader');
  if (loader && !loader.classList.contains('loader-hidden')) {
    loader.classList.add('loader-hidden');
  }
}, 4000); 
 
 
 /* ==========================================================================
   1. CONTROL DE NAVEGACIÓN Y MENÚ HAMBURGUESA
   ========================================================================== */

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navbar = document.querySelector('.sticky-nav');
let lastScrollTop = 0;

if (navToggle && navLinks) {
  // Abrir / Cerrar menú al presionar el botón hamburguesa
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que el clic se propague y active otros enlaces por error
    navLinks.classList.toggle('nav-active');
  });

  // Cerrar el menú automáticamente al hacer clic en cualquier opción/enlace
  document.querySelectorAll('.nav-link, .dropdown-menu a').forEach((link) => {
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

// Ocultar y mostrar la barra sticky al hacer scroll
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


/* ==========================================================================
   2. CONFIGURACIÓN Y DATOS DEL CARRUSEL
   ========================================================================== */

const slidesData = [
  {
    category: "",
    title: "Boletín de Oración",
    description: "Movilización en Turquía",
    subtag: "",
    button: {
      text: "↪ Unirse a la Intercesión",
      link: "https://wa.me/51938204456?text=Dios%20le%20bendiga,%20deseo%20unirme%20al%20grupo%20de%20intercesión%20por%20Turquía" // Te desplaza a la guía
    }
  },
  {
    category: "",
    title: "Video Informativo",
    description: "Conoce la Movilización Más Reciente",
    subtag: "",
    button: {
      text: "▶ Ver Video",
      link: "#video-seccion" // Te desplaza al videojavascript:void(0)
    }
  },
  {
    category: "",
    title: "Involúcrate",
    description: "Comparte la Movilización con tus Amigos",
    subtag: "",
    button: {
      text: "↪ Comparte",
      link: "https://api.whatsapp.com/send?text=Te%20invito%20a%20unirte%20a%20la%20Gu%C3%ADa%20de%20Oraci%C3%B3n%20por%20la%20Movilización%20en%20Turqu%C3%ADa:%20https://mmmturquia/boletin-de-oracion/" // Enlace a WhatsApp
    }
  },
    {
    category: "",
    title: "Descarga Nuestra App",
    description: "Lleva el Boletín en tu pantalla de inicio",
    subtag: "",
    button: {
      text: "⭣ Instalar Aplicación",
      link: "javascript:void(0)"
    }
  }
];


// Duraciones individuales por slide
const SLIDE_IMAGE_DURATION = 10000; // 10 segundos para diapositivas con fotos
const SLIDE_VIDEO_DURATION = 10000; // 14 segundos para la diapositiva con video de 14s

let carouselTimer = null;


/* ==========================================================================
   3. FUNCIONES DE CONTROL DEL CARRUSEL
   ========================================================================== */

// Reiniciar el temporizador de forma segura según el slide activo
function resetCarouselTimer(duration = SLIDE_IMAGE_DURATION) {
  if (carouselTimer) {
    clearInterval(carouselTimer);
  }
  carouselTimer = setInterval(() => {
    showSlide(currentSlide + 1);
  }, duration);
}

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
  slides.forEach((slide) => slide.classList.remove('active'));
  dots.forEach((dot) => dot.classList.remove('active'));

  const activeSlide = slides[currentSlide];
  activeSlide.classList.add('active');

  if (dots[currentSlide]) dots[currentSlide].classList.add('active');

  // 3. Control de video (Reinicio a cero y reproducción limpia)
  const video = activeSlide.querySelector('video');

  // Pausar cualquier otro video en slides inactivas
  document.querySelectorAll('.carousel-slide video').forEach((v) => {
    if (v !== video) v.pause();
  });

  if (video) {
    video.currentTime = 0; // Rebobina al inicio exacto (segundo 0)
    video.play().catch((err) => {
      console.warn("Autoplay prevenido por el navegador:", err);
    });

    // Ajusta la espera a 14s para que el video termine completo sin cortarse
    resetCarouselTimer(SLIDE_VIDEO_DURATION);
  } else {
    // Asigna el tiempo estándar de 10s para imágenes
    resetCarouselTimer(SLIDE_IMAGE_DURATION);
  }

  // 4. Cambiar contenido y hacer fade-in a los 400ms
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
      const btn4 = document.getElementById('btnDescargar');

      const buttons = [btn1, btn2, btn3,btn4,];

      // Ocultar todos los botones primero
      buttons.forEach((btn) => {
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

window.setSlide = function (index) {
  showSlide(index);
  resetCarouselTimer();
};


/* ==========================================================================
   4. SOPORTE PARA DESLIZAR CON EL DEDO (SWIPE TÁCTIL)
   ========================================================================== */

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

// Inicialización del carrusel al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelectorAll('.carousel-slide').length > 0) {
    showSlide(0);
    startCarouselTimer();
    initSwipeSupport();
  }
});


/* ==========================================================================
   5. MODO NOCTURNO (THEME TOGGLE)
   ========================================================================== */

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


/* ==========================================================================
   6. MENÚ DESPLEGABLE Y ACCIONES DE COMPARTIR
   ========================================================================== */

// Abrir / cerrar el menú desplegable actual
function toggleShareMenu(btnElement, event) {
  event.stopPropagation();

  // Busca el menú que está justo al lado del botón presionado
  const parentContainer = btnElement.closest('.share-dropdown');
  const menu = parentContainer.querySelector('.share-menu');

  // Cierra cualquier otro menú que pudiera estar abierto en la página
  document.querySelectorAll('.share-menu.show').forEach((openMenu) => {
    if (openMenu !== menu) {
      openMenu.classList.remove('show');
    }
  });

  // Alterna el menú actual
  menu.classList.toggle('show');
}

// Cierra cualquier menú abierto si el usuario hace clic fuera de él
window.addEventListener('click', function () {
  document.querySelectorAll('.share-menu.show').forEach((openMenu) => {
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


/* ==========================================================================
   SISTEMA UNIVERSAL DE INSTALACIÓN PWA (3 BOTONES)
   ========================================================================== */

let deferredPrompt = null;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const installButtons = document.querySelectorAll('.pwa-install-trigger');

// Función que ejecuta el proceso de instalación al pulsar CUALQUIERA de los 3 botones
async function ejecutarInstalacionPWA() {
  // Caso iPhone / iPad
  if (isIOS) {
    alert("Para instalar en tu iPhone / iPad:\n1. Toca el botón 'Compartir' (el icono con el cuadrado y la flecha hacia arriba en Safari).\n2. Selecciona 'Agregar al inicio'.");
    return;
  }

  // Caso Android / Chrome / Edge con evento nativo listo
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Respuesta del usuario: ${outcome}`);

    deferredPrompt = null;

    if (outcome === 'accepted') {
      // Ocultar todos los botones si el usuario aceptó instalar
      installButtons.forEach(btn => btn.style.display = 'none');
    }
    return;
  }

  // Respaldo informativo
  alert("Para instalar esta App:\n• En Android / Chrome: Toca los 3 puntos arriba a la derecha y selecciona 'Instalar aplicación' o 'Agregar a la pantalla principal'.\n• En PC: Busca el icono (+) en la barra de direcciones.");
}

// Conectar el evento click a todos los botones que tengan la clase .pwa-install-trigger
installButtons.forEach(btn => {
  btn.addEventListener('click', ejecutarInstalacionPWA);
});

// 1. Cuando Chrome / Android detecte que es instalable
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Mostramos el botón del navbar y el del footer
  installButtons.forEach(btn => {
    // Si no es el botón del carrusel (que se controla con los slides), mostrarlo
    if (btn.id !== 'btnDescargar') {
      btn.style.display = 'inline-flex';
    }
  });
});

// 2. Si el usuario está en iOS (Safari no lanza beforeinstallprompt)
if (isIOS) {
  window.addEventListener('DOMContentLoaded', () => {
    installButtons.forEach(btn => {
      if (btn.id !== 'btnDescargar') {
        btn.style.display = 'inline-flex';
      }
    });
  });
}

// 3. Si la app ya se instaló, ocultar los 3 botones automáticamente
window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  installButtons.forEach(btn => btn.style.display = 'none');
});

// 4. Si la app ya se está ejecutando instalada (Modo Pantalla Completa / Standalone)
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
  window.addEventListener('DOMContentLoaded', () => {
    installButtons.forEach(btn => btn.style.display = 'none');
  });
}

/* ==========================================================================
   MOSTRAR FECHA DE ÚLTIMA MODIFICACIÓN
   ========================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  const elementoFecha = document.getElementById('fechaModificacion');
  if (!elementoFecha) return;

  try {
    // Reemplaza "tu-usuario" y "tu-repositorio" con tus datos de GitHub
    const res = await fetch('https://api.github.com/repos/tdcmhk/guiadeoracion/commits?per_page=1');
    const data = await res.json();
    
    if (data && data[0]) {
      const fechaCommit = new Date(data[0].commit.committer.date);
      const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
      elementoFecha.textContent = fechaCommit.toLocaleDateString('es-ES', opciones);
    }
  } catch (error) {
    // Si falla la API, usa la fecha del archivo
    elementoFecha.textContent = new Date(document.lastModified).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  }
});

/* ==========================================================================
   CONTROL DEL BOTÓN FLOTANTE "VOLVER ARRIBA"
   ========================================================================== */

const btnScrollTop = document.getElementById('btnScrollTop');

if (btnScrollTop) {
  // Mostrar u ocultar el botón según la posición del scroll
  window.addEventListener('scroll', () => {
    // Aparece cuando el usuario ha bajado más de 350px
    if (window.pageYOffset > 350) {
      btnScrollTop.classList.add('show');
    } else {
      btnScrollTop.classList.remove('show');
    }
  }, { passive: true });

  // Desplazamiento suave al inicio al presionar el botón
  btnScrollTop.addEventListener('click', () => {
    // Quita el enfoque (focus) para que no se quede de color turquesa
    btnScrollTop.blur();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   ACORDEÓN PARA .day-card
   ========================================================================== */
const btnToggleMotivos = document.getElementById('btnToggleMotivos');
const textoToggle = document.getElementById('textoToggleMotivos');
const iconoToggle = document.getElementById('iconoToggleMotivos');
const diasExtras = document.querySelectorAll('.day-card.motivo-extra');

let diasDesplegados = false;

if (btnToggleMotivos && diasExtras.length > 0) {
  btnToggleMotivos.addEventListener('click', () => {
    diasDesplegados = !diasDesplegados;

    diasExtras.forEach(card => {
      if (diasDesplegados) {
        card.classList.add('visible');
      } else {
        card.classList.remove('visible');
      }
    });

    if (diasDesplegados) {
      textoToggle.textContent = 'Ver menos motivos';
      iconoToggle.textContent = 'expand_less';
    } else {
      textoToggle.textContent = `Ver más motivos`;
      iconoToggle.textContent = 'expand_more';
    }
  });
}

/* ==========================================================================
   CONECTAR MENÚ DE SECCIONES CON EL BOTÓN "VER MÁS MOTIVOS"
   ========================================================================== */
document.querySelectorAll('.dropdown-menu a[href^="#seccion-"]').forEach(enlace => {
  enlace.addEventListener('click', function (e) {
    const destinoId = this.getAttribute('href'); // ej: "#seccion-7"
    const tarjetaDestino = document.querySelector(destinoId);

    if (tarjetaDestino) {
      // Si la sección es un 'motivo-extra' y todavía está oculta (no tiene .visible)
      if (tarjetaDestino.classList.contains('motivo-extra') && !tarjetaDestino.classList.contains('visible')) {
        // Hacemos clic automático en el botón "Ver más motivos" para desplegarlas todas
        if (btnToggleMotivos) {
          btnToggleMotivos.click();
        } else {
          // O forzamos la clase .visible a todas las tarjetas extra
          diasExtras.forEach(card => card.classList.add('visible'));
        }
      }

      // Cerrar el menú móvil si estaba abierto
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) navLinks.classList.remove('nav-active');

      // Esperar un instante a que se despliegue y hacer scroll suave hasta la sección
      setTimeout(() => {
        tarjetaDestino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  });
});

/* ==========================================================================
   CONTADOR DE ORACIONES CON REINICIO AUTOMÁTICO CADA SEMANA
   ========================================================================== */

// 1. Función para calcular el año y número de semana actual (ej: "2026-W40")
function obtenerIdentificadorSemana() {
  const ahora = new Date();
  // Ajuste al jueves más cercano para calcular la semana ISO
  const d = new Date(Date.UTC(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()));
  const diaSemana = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - diaSemana);
  const inicioAno = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const numeroSemana = Math.ceil((((d - inicioAno) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-sem${numeroSemana}`;
}

const SEMANA_ACTUAL = obtenerIdentificadorSemana(); // Ej: "2026-sem40"
const NAMESPACE = 'mmmturquia_boletin';
// La clave cambia automáticamente cada semana: en la nueva semana arranca en 0
const KEY = `oraciones_${SEMANA_ACTUAL}`;
const API_URL = `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}`;

const btnOrar = document.getElementById('btnOrarYa');
const totalOracionesEl = document.getElementById('totalOraciones');
const txtBtnOrar = document.getElementById('txtBtnOrar');
const msgConfirmacion = document.getElementById('msgConfirmacionOracion');

// 2. Obtener conteo de la semana actual
async function obtenerConteoOraciones() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      // Si es una nueva semana y aún no hay votos, inicia en 0
      totalOracionesEl.textContent = "0";
      return;
    }
    const data = await res.json();
    const count = parseInt(data.count, 10);
    totalOracionesEl.textContent = isNaN(count) ? "0" : count.toLocaleString('es-ES');
  } catch (error) {
    totalOracionesEl.textContent = "0";
  }
}

// 3. Verificar si el usuario ya oró en ESTA semana
function verificarEstadoUsuario() {
  // Compara la semana guardada con la semana en curso
  const ultimaSemanaQueOro = localStorage.getItem('ultima_semana_oracion_turquia');
  if (ultimaSemanaQueOro === SEMANA_ACTUAL) {
    marcarBotonComoCompletado();
  } else {
    // Si cambió de semana, el botón se habilita de nuevo
    habilitarBoton();
  }
}

function habilitarBoton() {
  if (!btnOrar) return;
  btnOrar.disabled = false;
  btnOrar.classList.remove('ya-oro');
  if (txtBtnOrar) txtBtnOrar.textContent = 'He orado por esta causa';
  if (msgConfirmacion) msgConfirmacion.style.display = 'none';
}

function marcarBotonComoCompletado() {
  if (!btnOrar) return;
  btnOrar.disabled = true;
  btnOrar.classList.add('ya-oro');
  if (txtBtnOrar) txtBtnOrar.textContent = '¡Ya te has unido en oración!';
  if (msgConfirmacion) {
    msgConfirmacion.textContent = '✨¡Amén! Tu oración ha sido sumada al clamor por Turquía.';
    msgConfirmacion.style.display = 'block';
  }
}

// 4. Registrar la oración de la semana
async function registrarOracion() {
  if (localStorage.getItem('ultima_semana_oracion_turquia') === SEMANA_ACTUAL) return;

  btnOrar.disabled = true;
  if (txtBtnOrar) txtBtnOrar.textContent = 'Sumando clamor...';

  const textoActual = totalOracionesEl.textContent || "0";
  const numeroLimpio = parseInt(textoActual.replace(/\D/g, ''), 10);
  const conteoActual = isNaN(numeroLimpio) ? 0 : numeroLimpio;

  try {
    const res = await fetch(`${API_URL}/up`);
    if (res.ok) {
      const data = await res.json();
      const count = parseInt(data.count, 10);
      totalOracionesEl.textContent = isNaN(count) ? (conteoActual + 1).toLocaleString('es-ES') : count.toLocaleString('es-ES');
    } else {
      totalOracionesEl.textContent = (conteoActual + 1).toLocaleString('es-ES');
    }
  } catch (err) {
    totalOracionesEl.textContent = (conteoActual + 1).toLocaleString('es-ES');
  }

  // Guardamos la semana en que oró
  localStorage.setItem('ultima_semana_oracion_turquia', SEMANA_ACTUAL);
  marcarBotonComoCompletado();
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  if (btnOrar && totalOracionesEl) {
    obtenerConteoOraciones();
    verificarEstadoUsuario();
    btnOrar.addEventListener('click', registrarOracion);
  }
});

/* ==========================================================================
   INTERACCIÓN DEL CHAT HACIA WHATSAPP
   ========================================================================== */
const chatWidget = document.querySelector('.chat-widget-container');
const btnTrigger = document.getElementById('chatTriggerBtn');
const btnClose = document.getElementById('btnChatClose');
const formWsp = document.getElementById('chatWhatsappForm');

if (btnTrigger && chatWidget) {
  btnTrigger.addEventListener('click', () => {
    chatWidget.classList.toggle('is-open');
  });
}

if (btnClose && chatWidget) {
  btnClose.addEventListener('click', () => {
    chatWidget.classList.remove('is-open');
  });
}

if (formWsp) {
  formWsp.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('chatNombre').value.trim();
    const motivo = document.getElementById('chatMotivo').value;
    const mensaje = document.getElementById('chatMensaje').value.trim();

    // Mensaje estructurado con saltos de línea para WhatsApp
    const textoMensaje = `*Petición desde el Boletín de Oración*\n\n` +
                         `👤 *Nombre:* ${nombre}\n` +
                         `📌 *Motivo:* ${motivo}\n\n` +
                         `💬 *Mensaje:* ${mensaje}`;

    // Número de teléfono configurado
    const numeroTelefono = "51983204456";

    // Enlace seguro con codificación de texto
    const enlaceWsp = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(textoMensaje)}`;

    // Abrir WhatsApp en pestaña nueva
    window.open(enlaceWsp, '_blank');

    // Cerrar el popup y limpiar el formulario
    chatWidget.classList.remove('is-open');
    formWsp.reset();
  });
}