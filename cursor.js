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
    
    // Use transform for GPU-accelerated positioning (better for Safari)
    // Track mouse position with passive listener for better performance
    let hasMoved = false;
    let isAnimating = false;
    let hoverScale = 1;
    
    function updateCursorTransform() {
        cursor.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px) scale(${hoverScale})`;
    }
    
    // Set initial position
    updateCursorTransform();
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!hasMoved) {
            // On first move, snap cursor to mouse position
            cursorX = mouseX;
            cursorY = mouseY;
            updateCursorTransform();
            hasMoved = true;
            // Start animation immediately
            if (!isAnimating) {
                isAnimating = true;
                animateCursor();
            }
        }
        
        // Start animation loop if not already running
        if (!isAnimating) {
            isAnimating = true;
            animateCursor();
        }
    }, { passive: true });
    
    function animateCursor() {
        // Use faster easing for better responsiveness
        const ease = 0.15;
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        // Only animate if there's meaningful movement (reduces unnecessary updates)
        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
            cursorX += dx * ease;
            cursorY += dy * ease;
            
            // Use transform for GPU-accelerated positioning (Safari optimized)
            updateCursorTransform();
            
            requestAnimationFrame(animateCursor);
        } else {
            // Snap to final position when close enough
            cursorX = mouseX;
            cursorY = mouseY;
            updateCursorTransform();
            isAnimating = false;
        }
    }
    
    // Start initial animation
    animateCursor();
    
    // Hover states - use event delegation for better performance
    document.addEventListener('mouseenter', (e) => {
        const target = e.target;
        if (target.matches('a, button, .project-thumb, .name-trigger, .back-link, .bio-link, .project-back-link')) {
            hoverScale = 1.5;
            updateCursorTransform();
        }
    }, true);
    
    document.addEventListener('mouseleave', (e) => {
        const target = e.target;
        if (target.matches('a, button, .project-thumb, .name-trigger, .back-link, .bio-link, .project-back-link')) {
            hoverScale = 1;
            updateCursorTransform();
        }
    }, true);
    
});

