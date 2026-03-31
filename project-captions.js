// Project Image Captions
// Automatically wraps images/videos with data-caption attributes in a container
// and displays the caption below the media

document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
        initProjectCaptions();
    });
});

function initProjectCaptions() {
    const projectImagesPanel = document.querySelector('.project-images-panel');
    if (!projectImagesPanel) return;
    
    // Helper function to check if element is already wrapped
    function isAlreadyWrapped(element) {
        return element.parentElement && element.parentElement.classList.contains('project-image-wrapper');
    }
    
    // Handle slideshow containers first (before individual images)
    const slideshowContainers = projectImagesPanel.querySelectorAll('[class*="slideshow"]');
    slideshowContainers.forEach(container => {
        // Skip if already wrapped
        if (isAlreadyWrapped(container)) return;
        
        // If slideshow container has a caption attribute, use it
        const containerCaption = container.getAttribute('data-caption');
        if (containerCaption) {
            const wrapper = document.createElement('div');
            wrapper.className = 'project-image-wrapper';
            
            const captionEl = document.createElement('div');
            captionEl.className = 'project-image-caption';
            captionEl.textContent = containerCaption;
            
            container.parentNode.insertBefore(wrapper, container);
            wrapper.appendChild(container);
            wrapper.appendChild(captionEl);
        }
    });
    
    // Find all images and videos with data-caption attribute (excluding those in slideshows)
    const mediaWithCaptions = projectImagesPanel.querySelectorAll('img[data-caption], video[data-caption]');
    
    mediaWithCaptions.forEach(media => {
        // Skip if already wrapped
        if (isAlreadyWrapped(media)) return;
        
        // Skip if inside a slideshow container (slideshows should use container-level captions)
        if (media.closest('[class*="slideshow"]')) return;
        
        const caption = media.getAttribute('data-caption');
        if (!caption) return;
        
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'project-image-wrapper';
        
        // Create caption element
        const captionEl = document.createElement('div');
        captionEl.className = 'project-image-caption';
        captionEl.textContent = caption;
        
        // Wrap the media element
        media.parentNode.insertBefore(wrapper, media);
        wrapper.appendChild(media);
        wrapper.appendChild(captionEl);
    });
}
