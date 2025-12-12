// Project image zoom functionality (optimized for Safari)
let currentImageIndex = 0;
let imageZoomArray = [];

function initProjectImageZoom() {
    const modal = document.getElementById('imageZoomModal');
    if (!modal) return;
    
    const closeBtn = document.getElementById('imageZoomClose');
    const img = document.getElementById('zoomedImage');
    
    if (!closeBtn || !img) return;
    
    const closeModal = () => {
        modal.style.display = 'none';
        modal.classList.remove('active');
        // Use requestAnimationFrame for smoother Safari transitions
        requestAnimationFrame(() => {
            document.body.style.overflow = '';
        });
        document.removeEventListener('keydown', handleImageKeydown);
    };
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.image-zoom-container') === null) {
            closeModal();
        }
    });
}

function handleImageKeydown(e) {
    if (e.key === 'ArrowLeft') {
        navigateImage(-1);
    } else if (e.key === 'ArrowRight') {
        navigateImage(1);
    } else if (e.key === 'Escape') {
        const modal = document.getElementById('imageZoomModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleImageKeydown);
        }
    }
}

function navigateImage(direction) {
    if (imageZoomArray.length === 0) return;
    
    currentImageIndex = (currentImageIndex + direction + imageZoomArray.length) % imageZoomArray.length;
    const img = document.getElementById('zoomedImage');
    if (!img) return;
    
    const imageSrc = imageZoomArray[currentImageIndex];
    
    // Use requestAnimationFrame for smoother transitions in Safari
    requestAnimationFrame(() => {
        img.style.opacity = '0';
        requestAnimationFrame(() => {
            img.src = imageSrc;
            img.onload = () => {
                requestAnimationFrame(() => {
                    img.style.opacity = '1';
                });
            };
        });
    });
}

function openImageZoom(imageSrc) {
    const modal = document.getElementById('imageZoomModal');
    const img = document.getElementById('zoomedImage');
    
    if (!modal || !img) return;
    
    // Collect all images from the project page
    const projectImages = Array.from(document.querySelectorAll('.project-images-panel img[src]'))
        .map(img => img.src);
    
    imageZoomArray = projectImages.length > 0 ? projectImages : [imageSrc];
    currentImageIndex = imageZoomArray.findIndex(src => src === imageSrc || src.endsWith(imageSrc.split('/').pop()));
    
    if (currentImageIndex === -1) {
        currentImageIndex = 0;
    }
    
    // Optimize for Safari - use transform instead of opacity for better performance
    img.style.transform = 'scale(0.95)';
    img.style.opacity = '0';
    img.src = imageSrc;
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    modal.style.display = 'flex';
    
    // Use requestAnimationFrame for smoother Safari animations
    requestAnimationFrame(() => {
        modal.classList.add('active');
        requestAnimationFrame(() => {
            img.style.transform = 'scale(1)';
            img.style.opacity = '1';
        });
    });
    
    document.addEventListener('keydown', handleImageKeydown);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initProjectImageZoom();
    
    // Add click handlers to project images
    const projectImages = document.querySelectorAll('.project-images-panel img');
    projectImages.forEach(img => {
        // Make images clickable
        img.style.cursor = 'pointer';
        
        img.addEventListener('click', (e) => {
            e.preventDefault();
            const imageSrc = img.src || img.getAttribute('data-src');
            if (imageSrc) {
                openImageZoom(imageSrc);
            }
        });
    });
});

