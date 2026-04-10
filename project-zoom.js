// Project image and video zoom functionality (optimized for Safari)
let currentImageIndex = 0;
let imageZoomArray = [];
let currentVideoIndex = 0;
let videoZoomArray = [];

function normalizeProjectImageUrl(src) {
    if (!src || src === window.location.href) return '';
    if (src.startsWith('http') || src.startsWith('//') || src.startsWith('/')) return src;
    try {
        return new URL(src, window.location.href).href;
    } catch {
        return src;
    }
}

function collectGalleryImageSources() {
    const seen = new Set();
    const out = [];
    document.querySelectorAll('.project-images-panel img').forEach((imgEl) => {
        const raw = imgEl.src || imgEl.getAttribute('data-src') || '';
        if (!raw || raw === window.location.href) return;
        const u = normalizeProjectImageUrl(raw);
        if (!seen.has(u)) {
            seen.add(u);
            out.push(u);
        }
    });
    return out;
}

function closeImageZoomModal() {
    const modal = document.getElementById('imageZoomModal');
    if (!modal) return;
    const zoomedImg = document.getElementById('zoomedImage');
    modal.style.display = 'none';
    modal.classList.remove('active');
    document.body.classList.remove('project-media-modal-open');
    document.removeEventListener('keydown', handleImageKeydown);
    requestAnimationFrame(() => {
        document.body.style.overflow = '';
        if (zoomedImg) {
            zoomedImg.style.willChange = 'auto';
        }
        window.dispatchEvent(new Event('resize'));
    });
}

function closeVideoZoomModal() {
    const modal = document.getElementById('videoZoomModal');
    const video = document.getElementById('zoomedVideo');
    if (!modal) return;
    modal.style.display = 'none';
    modal.classList.remove('active');
    document.body.classList.remove('project-media-modal-open');
    document.removeEventListener('keydown', handleVideoKeydown);
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
    requestAnimationFrame(() => {
        document.body.style.overflow = '';
        window.dispatchEvent(new Event('resize'));
    });
}

function initProjectImageZoom() {
    const modal = document.getElementById('imageZoomModal');
    if (!modal) return;
    
    const closeBtn = document.getElementById('imageZoomClose');
    const img = document.getElementById('zoomedImage');
    
    if (!closeBtn || !img) return;
    
    closeBtn.addEventListener('click', closeImageZoomModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.image-zoom-container') === null) {
            closeImageZoomModal();
        }
    });
}

function handleImageKeydown(e) {
    if (e.key === 'ArrowLeft') {
        navigateImage(-1);
    } else if (e.key === 'ArrowRight') {
        navigateImage(1);
    } else if (e.key === 'Escape') {
        closeImageZoomModal();
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
    
    document.querySelectorAll('.project-images-panel video').forEach((v) => v.pause());
    document.body.classList.add('project-media-modal-open');
    img.decoding = 'async';
    img.style.willChange = 'transform, opacity';
    
    const projectImages = collectGalleryImageSources();
    const normalizedClick = normalizeProjectImageUrl(imageSrc);
    
    imageZoomArray = projectImages.length > 0 ? projectImages : [normalizedClick];
    currentImageIndex = imageZoomArray.findIndex((src) => {
        if (!src || !normalizedClick) return false;
        const a = normalizeProjectImageUrl(src);
        const b = normalizedClick;
        return (
            a === b ||
            a.endsWith(b.split('/').pop()) ||
            b.endsWith(a.split('/').pop())
        );
    });
    
    if (currentImageIndex === -1) {
        currentImageIndex = 0;
    }
    
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
    
    closeBtn.addEventListener('click', closeVideoZoomModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.video-zoom-container') === null) {
            closeVideoZoomModal();
        }
    });
}

function handleVideoKeydown(e) {
    if (e.key === 'ArrowLeft') {
        navigateVideo(-1);
    } else if (e.key === 'ArrowRight') {
        navigateVideo(1);
    } else if (e.key === 'Escape') {
        closeVideoZoomModal();
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
    
    document.querySelectorAll('.project-images-panel video').forEach((v) => v.pause());
    document.body.classList.add('project-media-modal-open');
    
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
                hasControls: vid.hasAttribute('controls') || vid.getAttribute('data-modal-controls') === 'true'
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
        video.removeAttribute('muted');
        video.removeAttribute('loop');
        video.muted = false;
        video.loop = false;
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
                video.play().catch(() => {
                    // Autoplay blocked - this is expected in some browsers
                });
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
    initSafariPlayAllButton();
    
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
                const hasControls = vid.hasAttribute('controls') || vid.getAttribute('data-modal-controls') === 'true';
                openVideoZoom(videoSrc, hasControls);
            }
        }, { passive: false });
    });
});

function initSafariPlayAllButton() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!isSafari) return;
    
    // Check if we're on a project page (has project-images-panel)
    const projectPanel = document.querySelector('.project-images-panel');
    if (!projectPanel) return;
    
    // Check if there are any videos on the page
    const videos = document.querySelectorAll('.project-images-panel video');
    if (videos.length === 0) return;
    
    // Create button if it doesn't exist
    let button = document.getElementById('safariPlayAllButton');
    if (!button) {
        button = document.createElement('button');
        button.id = 'safariPlayAllButton';
        button.className = 'safari-play-all-button';
        button.textContent = 'PLAY ALL';
        document.body.appendChild(button);
    }
    
    // Show button
    button.style.display = 'block';
    
    // When clicked, play all videos
    button.addEventListener('click', () => {
        videos.forEach(video => {
            if (video.paused) {
                video.play().catch(() => {
                    // If autoplay fails, that's okay
                });
            }
        });
    });
}

