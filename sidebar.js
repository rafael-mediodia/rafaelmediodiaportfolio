function initSidebar() {
    const path = window.location.pathname;
    const isInSubdirectory = path.includes('/projects/') || path.split('/').filter(Boolean).length > 1;
    const prefix = isInSubdirectory ? '../' : '';
    
    const sidebarHTML = `
        <a href="${prefix}index.html" class="info-name-link">
            <div class="info-name">RAFAEL MEDIODIA</div>
        </a>
        <div class="info-birth">(b.2004) ✧</div>
        <div class="info-about">
            is pursuing his degree in Graphic Design at the Rhode Island School of Design with a focus on Computation. He enjoys play, systems, and making things move around a screen (◕‿◕)
        </div>
        <div class="info-current">
            Currently Designing @ <a href="https://visions-mag.squarespace.com/" class="info-link" target="_blank">VISIONS</a>, <a href="https://bsrlive.com/" class="info-link" target="_blank">BSR</a> ˚ ༘
        </div>
        <div class="info-previous">
            Previously @ <a href="https://mediocre.rodeo" class="info-link" target="_blank">Mediocre</a>
        </div>
        <div class="info-location">
            Raised in Louisville, Kentucky ⋆·˚ ༘*
        </div>
        <div class="info-links">
            <a href="${prefix}motion.html" class="info-link">MOTION</a>
            <a href="${prefix}illustrations.html" class="info-link">ILLUSTRATION</a>
        </div>
        <div class="info-links">
            <a href="mailto:rmediodi@risd.edu" class="info-link">EMAIL</a>
            <a href="${prefix}Rafael Mediodia Resume 2025.pdf" class="info-link">RESUME</a>
            <a href="https://www.linkedin.com/in/rafael-mediodia-067b9418b/" class="info-link" target="_blank">LINKEDIN</a>
            <a href="https://www.instagram.com/middledays/" class="info-link" target="_blank">INSTAGRAM</a>
        </div>
    `;
    
    const infoContainer = document.querySelector('.info-container');
    if (infoContainer) {
        infoContainer.innerHTML = sidebarHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
});

