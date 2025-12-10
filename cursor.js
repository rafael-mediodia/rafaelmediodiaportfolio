// Custom cursor (only on devices with precise pointing)
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;
    
    // Only enable on devices with mouse/trackpad
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
    }
    
    // Initialize cursor position to center of viewport (will update on first mouse move)
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    
    // Set initial position immediately
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    // Track mouse position
    let hasMoved = false;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!hasMoved) {
            // On first move, snap cursor to mouse position
            cursorX = mouseX;
            cursorY = mouseY;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            hasMoved = true;
        }
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover states
    const hoverElements = document.querySelectorAll('a, button, .project-thumb, .name-trigger, .back-link, .bio-link');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    
});

