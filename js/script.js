document.addEventListener('DOMContentLoaded', function() {
    // =======================================================
    // Lógica para el Menú de Navegación y Selector de Idioma
    // =======================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const languageSelector = document.querySelector('.language-selector');
    const langButton = document.querySelector('.lang-button');
    const langLinks = document.querySelectorAll('.lang-dropdown-content a');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('is-open');
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Cierra el selector de idioma si el menú móvil se abre
            if (languageSelector && languageSelector.classList.contains('active')) {
                languageSelector.classList.remove('active');
            }
        });

        // Opcional: Cerrar el menú si se hace clic en un enlace del menú
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    if (langButton && languageSelector) {
        langButton.addEventListener('click', function(event) {
            event.stopPropagation();
            languageSelector.classList.toggle('active');
        });
    }

    if (langLinks.length > 0) {
        langLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const selectedLang = this.getAttribute('data-lang');
                if (selectedLang === 'en') {
                    window.location.href = '/en/en_index.html';
                } else if (selectedLang === 'es') {
                    window.location.href = '/index.html';
                }
            });
        });
    }

    // Lógica para el botón de silenciar/desactivar silencio del video principal
    const heroVideo = document.getElementById('heroVideo');
    const muteToggleButton = document.getElementById('muteToggle');

    if (heroVideo && muteToggleButton) {
        // Establecer el estado inicial del icono basado en la propiedad 'muted' del video
        if (heroVideo.muted) {
            muteToggleButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            muteToggleButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        }

        muteToggleButton.addEventListener('click', function() {
            if (heroVideo.muted) {
                heroVideo.muted = false; // Desactivar silencio
                muteToggleButton.innerHTML = '<i class="fas fa-volume-up"></i>'; // Cambiar a icono de sonido
            } else {
                heroVideo.muted = true; // Silenciar
                muteToggleButton.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Cambiar a icono de mute
            }
        });
    }
    
    // Cierra ambos menús si se hace clic fuera
    document.addEventListener('click', function(event) {
        const isClickInsideNavbar = menuToggle && menuToggle.contains(event.target) || mobileMenu && mobileMenu.contains(event.target);
        const isClickInsideLangSelector = languageSelector && languageSelector.contains(event.target);

        if (!isClickInsideNavbar && mobileMenu && mobileMenu.classList.contains('is-open')) {
            mobileMenu.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
        if (languageSelector && languageSelector.classList.contains('active') && !isClickInsideLangSelector) {
            languageSelector.classList.remove('active');
        }
    });

    // =======================================================
    // Lógica para la Sección de Portafolio Interactivo
    // =======================================================
    const portfolioCardsContainer = document.getElementById('portfolio-cards-container');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const projectTitle = document.getElementById('project-title');
    const projectDescription = document.getElementById('project-description');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const paginationDots = document.getElementById('pagination-dots');
    const videoContainer = document.querySelector('.video-container');

    let currentProjectIndex = 0;
    let player;

    // Carga la API de YouTube de forma asíncrona
    function loadYouTubeAPI() {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag) {
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
            document.head.appendChild(tag);
        }
    }

    // Se ejecutará cuando la API esté lista
    window.onYouTubeIframeAPIReady = function() {
        initializeYouTubePlayer();
    };

    function initializeYouTubePlayer() {
        const initialVideoId = portfolioCards[0] ? portfolioCards[0].getAttribute('data-youtube-id') : null;

        // Asegúrate de que el contenedor del reproductor exista
        if (document.getElementById('portfolio-youtube-player')) {
            player = new YT.Player('portfolio-youtube-player', {
                videoId: initialVideoId,
                playerVars: {
                    autoplay: 1,
                    mute: 1,
                    loop: 1,
                    controls: 0,
                    playlist: initialVideoId,
                    showinfo: 0,
                    modestbranding: 1,
                    rel: 0,
                    autohide: 1,
                    start: 0
                },
                events: {
                    'onReady': onPlayerReady
                }
            });
        }
    }

    function onPlayerReady(event) {
        event.target.playVideo();
        updateProjectDetails(0);
        if (portfolioCards[0]) {
            portfolioCards[0].classList.add('active');
        }
        if (paginationDots.children.length > 0) {
            paginationDots.children[0].classList.add('active');
        }
    }

    function createPaginationDots() {
        if (paginationDots) {
            paginationDots.innerHTML = '';
            portfolioCards.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('pagination-dot');
                dot.addEventListener('click', () => {
                    showProject(index);
                });
                paginationDots.appendChild(dot);
            });
        }
    }

    function showProject(index) {
        if (portfolioCards.length === 0) return;

        // Bucle infinito: si el índice es menor que 0, pasa a la última tarjeta
        if (index < 0) {
            index = portfolioCards.length - 1;
        }
        // Bucle infinito: si el índice es mayor o igual al número de tarjetas, pasa a la primera
        else if (index >= portfolioCards.length) {
            index = 0;
        }
        
        currentProjectIndex = index;
        
        // Se ha eliminado el código para la animación de movimiento.

        portfolioCards.forEach(card => card.classList.remove('active'));
        if (portfolioCards[currentProjectIndex]) {
            portfolioCards[currentProjectIndex].classList.add('active');
        }

        if (paginationDots) {
            const dots = paginationDots.querySelectorAll('.pagination-dot');
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentProjectIndex]) {
                dots[currentProjectIndex].classList.add('active');
            }
        }
        
        updateProjectDetails(currentProjectIndex);
    }

    function updateProjectDetails(index) {
        const card = portfolioCards[index];
        if (!card) return;

        const title = card.getAttribute('data-title');
        const description = card.getAttribute('data-description');
        const youtubeId = card.getAttribute('data-youtube-id');

        if (projectTitle && projectDescription) {
            projectTitle.textContent = title;
            projectDescription.textContent = description;
        }

        if (player && youtubeId) {
            player.loadVideoById(youtubeId, 0);
            if (videoContainer) {
                videoContainer.style.opacity = '1';
            }
        } else if (videoContainer) {
            videoContainer.style.opacity = '0.5';
        }
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            showProject(currentProjectIndex - 1 < 0 ? portfolioCards.length - 1 : currentProjectIndex - 1);
        });

        nextBtn.addEventListener('click', () => {
            showProject(currentProjectIndex + 1 >= portfolioCards.length ? 0 : currentProjectIndex + 1);
        });
    }

    portfolioCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            showProject(index);
        });
    });

    // Inicialización de la sección del portafolio
    createPaginationDots();
    loadYouTubeAPI();
});