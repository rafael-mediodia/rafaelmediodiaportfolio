// Project image and video zoom functionality (optimized for Safari)
let currentImageIndex = 0;
let imageZoomArray = [];
let currentVideoIndex = 0;
let videoZoomArray = [];

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
    if (!imageSrc) return;
    
    // Use requestAnimationFrame for smoother transitions in Safari
    requestAnimationFrame(() => {
        img.style.opacity = '0';
        requestAnimationFrame(() => {
            // Check if image is already loaded
            if (img.src === imageSrc && img.complete) {
                requestAnimationFrame(() => {
                    img.style.opacity = '1';
                });
            } else {
                img.src = imageSrc;
                img.onload = () => {
                    requestAnimationFrame(() => {
                        img.style.opacity = '1';
                    });
                };
                // Handle error case
                img.onerror = () => {
                    img.style.opacity = '1';
                };
            }
        });
    });
}

function openImageZoom(imageSrc) {
    const modal = document.getElementById('imageZoomModal');
    const img = document.getElementById('zoomedImage');
    
    if (!modal || !img) return;
    
    // Collect all images from the project page (both loaded and unloaded)
    const projectImages = Array.from(document.querySelectorAll('.project-images-panel img'))
        .map(imgEl => {
            // Get src from either src attribute or data-src
            return imgEl.src || imgEl.getAttribute('data-src') || imgEl.getAttribute('src');
        })
        .filter(src => src); // Filter out null/undefined
    
    imageZoomArray = projectImages.length > 0 ? projectImages : [imageSrc];
    currentImageIndex = imageZoomArray.findIndex(src => {
        if (!src || !imageSrc) return false;
        return src === imageSrc || 
               src.endsWith(imageSrc.split('/').pop()) || 
               imageSrc.endsWith(src.split('/').pop());
    });
    
    if (currentImageIndex === -1) {
        currentImageIndex = 0;
    }
    
    // Optimize for Safari - use transform instead of opacity for better performance
    img.style.transform = 'scale(0.95)';
    img.style.opacity = '0';
    
    // Handle image loading - check if already loaded
    const finalSrc = imageZoomArray[currentImageIndex];
    if (img.src === finalSrc && img.complete) {
        // Image already loaded, skip onload
        requestAnimationFrame(() => {
            img.style.transform = 'scale(1)';
            img.style.opacity = '1';
        });
    } else {
        img.src = finalSrc;
        img.onload = () => {
            requestAnimationFrame(() => {
                img.style.transform = 'scale(1)';
                img.style.opacity = '1';
            });
        };
        // Handle error case
        img.onerror = () => {
            img.style.opacity = '1';
        };
    }
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    modal.style.display = 'flex';
    
    // Use requestAnimationFrame for smoother Safari animations
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
    
    document.addEventListener('keydown', handleImageKeydown);
}

function initProjectVideoZoom() {
    const modal = document.getElementById('videoZoomModal');
    if (!modal) return;
    
    const closeBtn = document.getElementById('videoZoomClose');
    const video = document.getElementById('zoomedVideo');
    
    if (!closeBtn || !video) return;
    
    const closeModal = () => {
        modal.style.display = 'none';
        modal.classList.remove('active');
        video.pause();
        video.currentTime = 0;
        // Use requestAnimationFrame for smoother Safari transitions
        requestAnimationFrame(() => {
            document.body.style.overflow = '';
        });
        document.removeEventListener('keydown', handleVideoKeydown);
    };
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.video-zoom-container') === null) {
            closeModal();
        }
    });
}

function handleVideoKeydown(e) {
    if (e.key === 'ArrowLeft') {
        navigateVideo(-1);
    } else if (e.key === 'ArrowRight') {
        navigateVideo(1);
    } else if (e.key === 'Escape') {
        const modal = document.getElementById('videoZoomModal');
        const video = document.getElementById('zoomedVideo');
        if (modal && video) {
            modal.style.display = 'none';
            modal.classList.remove('active');
            video.pause();
            video.currentTime = 0;
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleVideoKeydown);
        }
    }
}

function navigateVideo(direction) {
    if (videoZoomArray.length === 0) return;
    
    currentVideoIndex = (currentVideoIndex + direction + videoZoomArray.length) % videoZoomArray.length;
    const video = document.getElementById('zoomedVideo');
    if (!video) return;
    
    const videoData = videoZoomArray[currentVideoIndex];
    const videoSrc = typeof videoData === 'string' ? videoData : videoData.src;
    const hasControls = typeof videoData === 'object' ? videoData.hasControls : false;
    
    // Use requestAnimationFrame for smoother transitions in Safari
    requestAnimationFrame(() => {
        video.style.opacity = '0';
        requestAnimationFrame(() => {
            video.src = videoSrc;
            if (hasControls) {
                video.setAttribute('controls', '');
            } else {
                video.removeAttribute('controls');
                // For autoplay videos, ensure they have the right attributes
                video.setAttribute('muted', '');
                video.setAttribute('loop', '');
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
            }
            video.load();
            
            // Handle video loading with better error handling
            const handleVideoLoad = () => {
                if (!hasControls) {
                    video.play().catch(() => {
                        // Autoplay blocked - this is expected in some browsers
                    });
                }
                requestAnimationFrame(() => {
                    video.style.opacity = '1';
                });
            };
            
            if (video.readyState >= 2) {
                // Video already loaded
                handleVideoLoad();
            } else {
                video.addEventListener('loadeddata', handleVideoLoad, { once: true });
                video.addEventListener('error', () => {
                    // Handle video load error
                    video.style.opacity = '1';
                }, { once: true });
            }
        });
    });
}

function openVideoZoom(videoSrc, hasControls = false) {
    const modal = document.getElementById('videoZoomModal');
    const video = document.getElementById('zoomedVideo');
    
    if (!modal || !video) return;
    
    // Collect all videos from the project page (both with src and data-src)
    const projectVideos = Array.from(document.querySelectorAll('.project-images-panel video'))
        .map(vid => {
            // Get source - prioritize actual src, then data-src, then src attribute
            let src = vid.src;
            if (!src || src === window.location.href) {
                src = vid.getAttribute('data-src');
            }
            if (!src) {
                src = vid.getAttribute('src');
            }
            // If still no src, try to construct from data-src
            if (!src && vid.hasAttribute('data-src')) {
                const dataSrc = vid.getAttribute('data-src');
                // If it's a relative path, make it absolute
                if (dataSrc && !dataSrc.startsWith('http') && !dataSrc.startsWith('//')) {
                    src = new URL(dataSrc, window.location.href).href;
                } else {
                    src = dataSrc;
                }
            }
            return {
                src: src,
                hasControls: vid.hasAttribute('controls')
            };
        })
        .filter(v => v.src && v.src !== window.location.href); // Filter out videos without valid src
    
    videoZoomArray = projectVideos.length > 0 ? projectVideos : [{ src: videoSrc, hasControls }];
    currentVideoIndex = videoZoomArray.findIndex(v => {
        const vSrc = v.src;
        const checkSrc = videoSrc;
        return vSrc === checkSrc || vSrc.endsWith(checkSrc.split('/').pop()) || checkSrc.endsWith(vSrc.split('/').pop());
    });
    
    if (currentVideoIndex === -1) {
        currentVideoIndex = 0;
    }
    
    const currentVideo = videoZoomArray[currentVideoIndex];
    
    // Optimize for Safari - use transform instead of opacity for better performance
    video.style.transform = 'scale(0.95)';
    video.style.opacity = '0';
    video.src = currentVideo.src;
    if (currentVideo.hasControls) {
        video.setAttribute('controls', '');
    } else {
        video.removeAttribute('controls');
        // For autoplay videos, ensure they have the right attributes
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
    }
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    modal.style.display = 'flex';
    
    // Use requestAnimationFrame for smoother Safari animations
    requestAnimationFrame(() => {
        modal.classList.add('active');
        requestAnimationFrame(() => {
            video.load();
            
            // Handle video loading with better error handling
            const handleVideoLoad = () => {
                if (!currentVideo.hasControls) {
                    video.play().catch(() => {
                        // Autoplay blocked - this is expected in some browsers
                    });
                }
                video.style.transform = 'scale(1)';
                video.style.opacity = '1';
            };
            
            if (video.readyState >= 2) {
                // Video already loaded
                handleVideoLoad();
            } else {
                video.addEventListener('loadeddata', handleVideoLoad, { once: true });
                video.addEventListener('error', () => {
                    // Handle video load error
                    video.style.transform = 'scale(1)';
                    video.style.opacity = '1';
                }, { once: true });
            }
        });
    });
    
    document.addEventListener('keydown', handleVideoKeydown);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initProjectImageZoom();
    initProjectVideoZoom();
    
    // Add click handlers to project images
    const projectImages = document.querySelectorAll('.project-images-panel img');
    projectImages.forEach(img => {
        // Make images clickable
        img.style.cursor = 'pointer';
        
        img.addEventListener('click', (e) => {
            e.preventDefault();
            let imageSrc = img.src;
            // If src is empty or just the page URL, try data-src
            if (!imageSrc || imageSrc === window.location.href) {
                imageSrc = img.getAttribute('data-src');
            }
            // If we have a relative path, convert it to absolute
            if (imageSrc && !imageSrc.startsWith('http') && !imageSrc.startsWith('//') && !imageSrc.startsWith('/')) {
                imageSrc = new URL(imageSrc, window.location.href).href;
            }
            if (imageSrc && imageSrc !== window.location.href) {
                openImageZoom(imageSrc);
            }
        });
    });
    
    // Add click handlers to project videos
    const projectVideos = document.querySelectorAll('.project-images-panel video');
    projectVideos.forEach(vid => {
        // Make videos clickable - ensure pointer events are enabled
        vid.style.cursor = 'pointer';
        vid.style.pointerEvents = 'auto';
        
        vid.addEventListener('click', (e) => {
            // Don't open zoom if clicking on controls (for videos with controls attribute)
            if (vid.hasAttribute('controls')) {
                // Check if click was on video controls area
                const rect = vid.getBoundingClientRect();
                const clickY = e.clientY - rect.top;
                const videoHeight = rect.height;
                // If click is in bottom 15% of video, might be controls - let it through
                if (clickY > videoHeight * 0.85) {
                    return;
                }
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            // Get video source - try multiple methods
            let videoSrc = vid.src;
            // If src is empty or just the page URL, try data-src
            if (!videoSrc || videoSrc === window.location.href) {
                videoSrc = vid.getAttribute('data-src');
            }
            if (!videoSrc) {
                videoSrc = vid.getAttribute('src');
            }
            
            // If we have a relative path from data-src, convert it to absolute
            if (videoSrc && !videoSrc.startsWith('http') && !videoSrc.startsWith('//') && !videoSrc.startsWith('/')) {
                // It's a relative path, make it absolute
                videoSrc = new URL(videoSrc, window.location.href).href;
            }
            
            if (videoSrc && videoSrc !== window.location.href) {
                const hasControls = vid.hasAttribute('controls');
                openVideoZoom(videoSrc, hasControls);
            }
        }, { passive: false });
    });
});

