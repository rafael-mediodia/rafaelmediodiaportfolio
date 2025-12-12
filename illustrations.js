const illustrations = [
    { file: 'frogs.jpg', tooltip: 'Frogs In The Bogs' },
    { file: 'mountain_and_tree_and_car_friends.jpg', tooltip: 'Mountain Friends' },
    { file: 'astronaut_forest jpg.jpg', tooltip: 'Space Park' },
    { file: 'beetle3.jpg', tooltip: 'Toy Dung Beetle' },
    { file: 'mockup.jpg', tooltip: 'Mockup Editorial' },
    { file: 'IMG_7604.PNG', tooltip: 'Tudu Fish' },
    { file: 'bearlookingdown.png', tooltip: 'Cookie The Bear' },
    { file: 'bearlookingforward.png', tooltip: 'Cookie The Bear' },
    { file: 'bearzoomin.png', tooltip: 'Cookie The Bear' },
    { file: 'Car3.png', tooltip: 'Bumpy Road' }
];

function getIllustrationFile(illustrationData) {
    return typeof illustrationData === 'string' ? illustrationData : illustrationData.file;
}

document.addEventListener('DOMContentLoaded', () => {
    initIllustrationsGallery();
    initImageZoom();
});

function initIllustrationsGallery() {
    const gallery = document.getElementById('illustrationsGallery');
    const tooltip = document.createElement('div');
    tooltip.className = 'project-tooltip';
    document.body.appendChild(tooltip);
    
    const imagesToLoad = illustrations.length > 0 ? illustrations : [];
    
    if (imagesToLoad.length === 0) {
        return;
    }
    
    imagesToLoad.forEach((imageData, index) => {
        const imageFile = typeof imageData === 'string' ? imageData : imageData.file;
        const tooltipText = typeof imageData === 'string' ? 'Illustration' : (imageData.tooltip || 'Illustration');
        
        const imageContainer = document.createElement('div');
        imageContainer.className = 'illustration-item';
        imageContainer.setAttribute('data-image-src', `Illustrations/${imageFile}`);
        
        const img = document.createElement('img');
        img.setAttribute('data-src', `Illustrations/${imageFile}`);
        img.alt = tooltipText;
        
        imageContainer.appendChild(img);
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    if (image.getAttribute('data-src')) {
                        image.src = image.getAttribute('data-src');
                        image.removeAttribute('data-src');
                        imageObserver.unobserve(image);
                    }
                }
            });
        }, {
            rootMargin: '100px'
        });
        
        imageObserver.observe(img);
        
        imageContainer.addEventListener('mouseenter', (e) => {
            tooltip.innerHTML = `
                <div class="project-tooltip-title">${tooltipText}</div>
            `;
            tooltip.style.opacity = '1';
            tooltip.style.left = e.clientX + 5 + 'px';
            tooltip.style.top = e.clientY + 5 + 'px';
        });
        
        imageContainer.addEventListener('mousemove', (e) => {
            tooltip.style.left = e.clientX + 5 + 'px';
            tooltip.style.top = e.clientY + 5 + 'px';
        });
        
        imageContainer.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
        
        imageContainer.addEventListener('click', () => {
            openImageZoom(`Illustrations/${imageFile}`);
        });
        
        gallery.appendChild(imageContainer);
    });
}

let currentImageIndex = 0;
let imageZoomArray = [];

function initImageZoom() {
    const modal = document.getElementById('imageZoomModal');
    const closeBtn = document.getElementById('imageZoomClose');
    const img = document.getElementById('zoomedImage');
    
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
    
    const imageFile = typeof imageZoomArray[currentImageIndex] === 'string' 
        ? imageZoomArray[currentImageIndex] 
        : imageZoomArray[currentImageIndex].file;
    
    // Use requestAnimationFrame for smoother transitions in Safari
    requestAnimationFrame(() => {
        img.style.opacity = '0';
        requestAnimationFrame(() => {
            img.src = `Illustrations/${imageFile}`;
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
    
    imageZoomArray = illustrations;
    const imageFile = imageSrc.split('/').pop();
    currentImageIndex = illustrations.findIndex(i => {
        const file = typeof i === 'string' ? i : i.file;
        return file === imageFile;
    });
    
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

