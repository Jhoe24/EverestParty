
const bgSound = document.getElementById('bgSound');
const transitionVideo = document.getElementById('transitionVideo');
const videoOverlay = document.getElementById('videoOverlay');
const container = document.querySelector('.container');
let soundEnabled = false;


// Función para actualizar el temporizador
function updateCountdown() {
    const eventDate = new Date('2025-08-30T17:00:00');
    const now = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
        if (eventDate.getDate() === now.getDate() && eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear()) {
            document.getElementById('countdown').innerHTML = '¡El evento está ocurriendo ahora!';
        }
        else {
            document.getElementById('countdown').innerHTML = '¡El evento ha Terminado!';
        }
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerHTML = `Faltan ${days} días, ${hours} horas, ${minutes} minutos, ${seconds} segundos`;
}

// Actualizar el temporizador cada segundo
setInterval(updateCountdown, 1000);

// Llamar a la función inicialmente para mostrar el tiempo restante al cargar la página
updateCountdown();

// Crear estrellas
function createStars() {
    const starsContainer = document.querySelector('.stars');
    const numberOfStars = 50;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 2 + 's';
        starsContainer.appendChild(star);
    }
}

// Crear confetti
function createConfetti() {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFA07A'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animation = `confettiFall ${confetti.style.animationDuration} linear infinite`;
        document.body.appendChild(confetti);

        // Remover confetti después de la animación
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 5000);
    }
}

// Función para abrir la puerta (MODIFICADA)
function openDoor() {
    soundEnabled = true;
    bgSound.muted = false;
    transitionVideo.muted = false;
    bgSound.play().catch(() => { });
    document.querySelector('.sound-toggle').textContent = '🔊';

    if (soundEnabled) {
        playDoorSound();
    }

    const door = document.querySelector('.door');
    door.style.transform = 'rotateY(-25deg) scale(0.95)';
    door.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';

    // Mostrar el video overlay
    setTimeout(() => {
        videoOverlay.style.display = 'flex';

        // Reproducir el video
        transitionVideo.currentTime = 0;
        transitionVideo.play().catch(error => {
            console.error('Error al reproducir el video:', error);
            // Si falla el video, mostrar directamente la invitación
            showInvitation();
        });

        // Cuando el video termine, mostrar la invitación
        transitionVideo.onended = function () {
            showInvitation();
        };

        // Fallback: mostrar invitación después de 13 segundos si el evento 'ended' no se dispara
        setTimeout(() => {
            if (videoOverlay.style.display === 'flex') {
                showInvitation();
            }
        }, 13500);

    }, 300);
}

// Nueva función para mostrar la invitación
function showInvitation() {
    // Ocultar el video
    container.style.display = 'none';
    videoOverlay.style.display = 'none';


    // Mostrar la invitación
    document.getElementById('invitationContent').style.display = 'flex';
    createConfetti();

    if (soundEnabled) {
        playCelebrationSound();
    }
}

// Función para cerrar la invitación
function closeInvitation() {
    const invitationContent = document.getElementById('invitationContent');
    invitationContent.style.animation = 'fadeOut 0.5s ease';

    container.style.display = 'flex';

    setTimeout(() => {
        invitationContent.style.display = 'none';
        invitationContent.style.animation = 'fadeIn 1s ease';

        // Resetear la puerta
        const door = document.querySelector('.door');
        door.style.transform = '';
        door.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    }, 500);
}

// Función para alternar sonido
function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.querySelector('.sound-toggle');

    if (soundEnabled) {
        bgSound.muted = false;
        transitionVideo.muted = false;
        bgSound.play().catch(() => {
            console.warn('El navegador requiere una interacción del usuario para activar el sonido.');
        });
        btn.textContent = '🔊';
    } else {
        bgSound.muted = true;
        transitionVideo.muted = true;
        btn.textContent = '🔇';

    }
}


// Simulación de sonidos (sin archivos de audio reales)
function playDoorSound() {
    // Simulación de sonido de puerta
    console.log('🚪 Sonido de puerta abriéndose');
}

function playCelebrationSound() {
    // Simulación de sonido de celebración
    console.log('🎉 Sonido de celebración');
}

// Agregar animación de fadeOut al CSS
const style = document.createElement('style');
style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; transform: scale(1); }
                to { opacity: 0; transform: scale(0.8); }
            }
        `;
document.head.appendChild(style);

// Inicializar estrellas cuando se carga la página
window.addEventListener('load', () => {
    createStars();

    bgSound.play().catch(error => {
        console.error('Error al reproducir el sonido de fondo:', error);
    });
});

// Efecto de parallax en el mouse
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        const speed = (index % 5 + 1) * 0.5;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        star.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Efectos de teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        openDoor();
    }
    if (e.key === 'Escape') {
        closeInvitation();
    }
});


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('✅ Service Worker registrado'))
        .catch(err => console.error('❌ Error al registrar SW', err));
}