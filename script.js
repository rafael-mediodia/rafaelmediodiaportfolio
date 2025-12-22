// Cache browser detection to avoid repeated regex calls
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Throttle function for performance optimization
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const projects = [
    {
        id: 'project-5',
        title: 'Self Declaration',
        subtitle: 'A reflection for immigrants in the United States.',
        thumbnail: null,
        thumbnailImages: [
            'SelfDeclaration/DS3UNIT17_23.jpg',
            'SelfDeclaration/DS3UNIT17_19.jpg'
        ],
        page: 'projects/self-declaration.html'
    },
    {
        id: 'project-field',
        title: 'field (in progress)',
        subtitle: 'A site for interviews, discussions, and making.',
        thumbnail: 'Field/Field-Thumbnail.mp4',
        page: 'projects/field.html',
        inProgress: true // Flag to prevent navigation
    },
    {
        id: 'project-1',
        title: 'Pinoy Plus',
        subtitle: 'A campaign for mga Pinoy creatives.',
        thumbnail: 'PinoyPlus/PinoyPlus-Intro.mp4', // Video thumbnail
        page: 'projects/pinoy-plus.html'
    },
    {
        id: 'project-3',
        title: 'Breakout Games',
        subtitle: 'Discovery and exploration motion identity work.',
        thumbnail: 'Breakout/Breakout-Transition.mp4',
        page: 'projects/breakout-games.html'
    },
    {
        id: 'project-7',
        title: 'Rough Pixel',
        subtitle: 'A typeface mixing digital and analog worlds.',
        thumbnail: null,
        thumbnailImages: null,
        page: 'projects/rough-pixel.html'
    },
    {
        id: 'project-8',
        title: 'superstition superstition superstition',
        subtitle: 'Film about systems and growing up.',
        thumbnail: null,
        thumbnailVideos: [
            'superstitionsuperstitionsuperstition/Mini Clips.mp4',
            'superstitionsuperstitionsuperstition/MiniClip2.mp4',
            'superstitionsuperstitionsuperstition/preview3.mp4'
        ],
        page: 'projects/superstition-superstition-superstition.html'
    },
    {
        id: 'project-4',
        title: 'bounce museum of rubber',
        subtitle: 'An identity for a museum full of elasticity.',
        thumbnail: null,
        thumbnailVideos: [
            'BounceMuseum/BounceThumbnail.mp4',
            'BounceMuseum/bouncethumbnail2.mp4'
        ],
        page: 'projects/bounce-museum.html'
    },
    {
        id: 'project-6',
        title: 'American Dream Series: Part 0',
        subtitle: 'A pilot episode exploring what the American Dream is.',
        thumbnail: 'AmericanDream/American Dream Series Part 0.mp4',
        thumbnailStartTime: 2,
        thumbnailEndTime: 4,
        page: 'projects/american-dream-series.html'
    },
    {
        id: 'motion',
        title: 'More Motion',
        subtitle: 'Motion Collection',
        thumbnail: '',
        page: 'motion.html'
    },
    {
        id: 'illustrations',
        title: 'Illustrations',
        subtitle: 'Illustration Collection',
        thumbnail: null,
        thumbnailImages: [
            'Illustrations/frogs.jpg',
            'Illustrations/mountain_and_tree_and_car_friends.jpg',
            'Illustrations/astronaut_forest jpg.jpg',
            'Illustrations/beetle3.jpg',
            'Illustrations/mockup.jpg',
            'Illustrations/IMG_7604.PNG'
        ],
        page: 'illustrations.html'
    },
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initSafariPlayOverlay();
    initGallery();
    initMotionThumbnail();
});

function initSafariPlayOverlay() {
    if (!isSafari) return;
    
    const overlay = document.getElementById('safariPlayOverlay');
    const playAllButton = document.getElementById('safariPlayAllThumbnails');
    
    // Check if user has visited before (not just clicked play)
    const hasVisitedBefore = localStorage.getItem('safariHasVisited') === 'true';
    const hasPlayedBefore = localStorage.getItem('safariVideosPlayed') === 'true';
    
    // Function to play all videos
    const playAllVideos = () => {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (video.paused) {
                video.play().catch(() => {
                    // If autoplay fails, that's okay
                });
            }
        });
        // Remember that user has played videos
        localStorage.setItem('safariVideosPlayed', 'true');
    };
    
    // Mark that user has visited
    localStorage.setItem('safariHasVisited', 'true');
    
    // Only show big overlay on first visit
    if (hasVisitedBefore) {
        // Don't show overlay on subsequent visits
        if (overlay) overlay.style.display = 'none';
        // Auto-play videos if they've played before
        if (hasPlayedBefore) {
            setTimeout(() => {
                playAllVideos();
            }, 500);
        }
    } else {
        // First visit - show the big overlay
        if (overlay) {
            overlay.style.display = 'flex';
            const button = overlay.querySelector('.safari-play-button');
            if (button) {
                button.addEventListener('click', () => {
                    playAllVideos();
                    overlay.style.display = 'none';
                });
            }
        }
    }
    
    // Always show corner button for Safari users
    if (playAllButton) {
        playAllButton.style.display = 'block';
        playAllButton.addEventListener('click', () => {
            playAllVideos();
        });
    }
}

function initMotionThumbnail() {
    const motionThumb = document.querySelector('.motion-thumb');
    if (!motionThumb) return;
    
    // Clear any existing content first
    motionThumb.innerHTML = '';
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
        if (typeof motionVideos !== 'undefined' && motionVideos.length > 0) {
            const shuffledVideos = [...motionVideos].sort(() => Math.random() - 0.5);
            let currentVideoIndex = 0;
            
            // Use two video elements for seamless crossfade transitions
            const video1 = document.createElement('video');
            const video2 = document.createElement('video');
            
            [video1, video2].forEach(video => {
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.autoplay = true;
                video.preload = 'metadata'; // Changed from 'auto' to 'metadata' for better performance
            video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
            video.setAttribute('loop', '');
            video.setAttribute('muted', '');
            video.removeAttribute('controls');
            video.setAttribute('disablePictureInPicture', '');
            video.setAttribute('disableRemotePlayback', '');
            video.setAttribute('x-webkit-airplay', 'deny');
            video.setAttribute('webkit-playsinline', 'true');
            video.className = 'motion-thumb-video';
            // Force Safari to not show controls
            video.controls = false;
                video.style.position = 'absolute';
                video.style.top = '0';
                video.style.left = '0';
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.objectFit = 'contain';
                video.style.transition = 'opacity 0.3s ease';
                video.style.willChange = 'opacity';
                video.style.backfaceVisibility = 'hidden';
            });
            
            video1.style.opacity = '1';
            video2.style.opacity = '0';
            video2.style.pointerEvents = 'none';
            
            motionThumb.classList.remove('placeholder');
            motionThumb.classList.add('has-video');
            motionThumb.style.position = 'relative';
            motionThumb.appendChild(video1);
            motionThumb.appendChild(video2);
            
            let activeVideo = video1;
            let nextVideo = video2;
            let videoChangeTimeout = null;
            let isInitialized = false;
            
            function cleanup() {
                if (videoChangeTimeout) {
                    clearTimeout(videoChangeTimeout);
                    videoChangeTimeout = null;
                }
                video1.pause();
                video2.pause();
            }
            
            function preloadNextVideo() {
                if (shuffledVideos.length > 0) {
                    const nextIndex = (currentVideoIndex + 1) % shuffledVideos.length;
                    const videoData = shuffledVideos[nextIndex];
                            const videoFile = typeof videoData === 'string' ? videoData : videoData.file;
                    const videoSrc = `Motion/${videoFile}`;
                    nextVideo.src = videoSrc;
                    nextVideo.load();
                }
            }
            
            function loadAndPlayVideo(video, videoSrc, onReady) {
                video.src = videoSrc;
                            video.load();
                            
                            const handleLoadedMetadata = () => {
                                const duration = video.duration;
                                if (duration > 3) {
                                    const maxStartTime = Math.max(0, duration - 3);
                                    const randomStart = Math.random() * maxStartTime;
                                    video.currentTime = randomStart;
                    }
                    
                    if (onReady) {
                        onReady();
                    }
                };
                
                const handleError = () => {
                    // If video fails to load, try next one
                                            currentVideoIndex = (currentVideoIndex + 1) % shuffledVideos.length;
                    if (onReady) {
                        setTimeout(() => switchToNextVideo(), 500);
                                }
                            };
                            
                            video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
                video.addEventListener('error', handleError, { once: true });
            }
            
            function switchToNextVideo() {
                if (shuffledVideos.length === 0) return;
                
                // Preload the next video in the sequence
                preloadNextVideo();
                
                // Wait for next video to be ready, then crossfade
                const handleNextVideoReady = () => {
                    nextVideo.removeEventListener('canplay', handleNextVideoReady);
                    nextVideo.removeEventListener('loadedmetadata', handleNextVideoReady);
                    
                    // Start playing next video
                    nextVideo.play().catch(() => {
                        // Autoplay blocked, that's okay
                    });
                    
                    // Crossfade: fade out active, fade in next
                    requestAnimationFrame(() => {
                        activeVideo.style.opacity = '0';
                        nextVideo.style.opacity = '1';
                    });
                    
                    // Swap references
                    const temp = activeVideo;
                    activeVideo = nextVideo;
                    nextVideo = temp;
                    
                    // Update index
                    currentVideoIndex = (currentVideoIndex + 1) % shuffledVideos.length;
                    
                    // Schedule next switch
                    if (videoChangeTimeout) {
                        clearTimeout(videoChangeTimeout);
                    }
                    videoChangeTimeout = setTimeout(switchToNextVideo, 3000);
                };
                
                if (nextVideo.readyState >= 2) {
                    handleNextVideoReady();
                } else {
                    nextVideo.addEventListener('canplay', handleNextVideoReady, { once: true });
                    nextVideo.addEventListener('loadedmetadata', handleNextVideoReady, { once: true });
                }
            }
            
            function startPlaying() {
                if (shuffledVideos.length === 0) return;
                
                const videoData = shuffledVideos[currentVideoIndex];
                const videoFile = typeof videoData === 'string' ? videoData : videoData.file;
                const videoSrc = `Motion/${videoFile}`;
                
                loadAndPlayVideo(activeVideo, videoSrc, () => {
                    activeVideo.play().catch(() => {
                        // Autoplay blocked - this is expected
                    });
                    // Preload next video immediately
                    preloadNextVideo();
                    // Schedule first switch
                    videoChangeTimeout = setTimeout(switchToNextVideo, 3000);
                });
            }
            
            const thumbObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!isInitialized) {
                            isInitialized = true;
                            startPlaying();
                        }
                        thumbObserver.unobserve(motionThumb);
                    } else {
                        // Cleanup when out of view
                        cleanup();
                        isInitialized = false;
                    }
                });
            }, {
                rootMargin: '50px' // Reduced from 200px to prevent premature loading
            });
            
            // Cleanup on page unload
            window.addEventListener('beforeunload', cleanup);
            
            thumbObserver.observe(motionThumb);
        }
    });
}

function initGallery() {
    const gallery = document.getElementById('gallery');
    const tooltip = document.createElement('div');
    tooltip.className = 'project-tooltip';
    document.body.appendChild(tooltip);
    
    projects.forEach((project, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'project-thumb';
        thumb.setAttribute('data-project-id', project.id);
        thumb.onclick = () => {
            // Don't navigate if project is in progress
            if (project.inProgress) {
                return;
            }
            window.location.href = project.page;
        };
        
        if (project.thumbnailVideos && project.thumbnailVideos.length > 0) {
            // Handle cycling video thumbnails - each video loops fully once
            // Use two video elements for seamless crossfade transitions
            const video1 = document.createElement('video');
            const video2 = document.createElement('video');
            
            [video1, video2].forEach(video => {
                video.muted = true;
                video.loop = false;
                video.playsInline = true;
                video.autoplay = true;
                video.preload = 'metadata'; // Changed from 'auto' to 'metadata' for better performance
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                video.setAttribute('muted', '');
                video.removeAttribute('controls');
                video.setAttribute('disablePictureInPicture', '');
                video.setAttribute('disableRemotePlayback', '');
                video.setAttribute('x-webkit-airplay', 'deny');
                video.setAttribute('webkit-playsinline', 'true');
                // Force Safari to not show controls
                video.controls = false;
                video.style.position = 'absolute';
                video.style.top = '0';
                video.style.left = '0';
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.objectFit = 'contain';
                video.style.transition = 'opacity 0.3s ease';
                video.style.willChange = 'opacity';
                video.style.backfaceVisibility = 'hidden';
            });
            
            video1.style.opacity = '1';
            video2.style.opacity = '0';
            video2.style.pointerEvents = 'none';
            
            let currentVideoIndex = 0;
            let activeVideo = video1;
            let nextVideo = video2;
            let isInitialized = false;
            
            function playVideo(video) {
                video.play().catch(() => {
                    // Autoplay blocked - this is expected
                });
            }
            
            function preloadNextVideo() {
                if (project.thumbnailVideos && project.thumbnailVideos.length > 0) {
                    const nextIndex = (currentVideoIndex + 1) % project.thumbnailVideos.length;
                    const nextVideoSrc = project.thumbnailVideos[nextIndex];
                    nextVideo.src = nextVideoSrc;
                    nextVideo.load();
                }
            }
            
            function switchToNextVideo() {
                if (project.thumbnailVideos && project.thumbnailVideos.length > 0) {
                    // Preload the next video in the sequence
                    preloadNextVideo();
                    
                    // Wait for next video to be ready, then crossfade
                    const handleNextVideoReady = () => {
                        nextVideo.removeEventListener('canplay', handleNextVideoReady);
                        nextVideo.removeEventListener('loadeddata', handleNextVideoReady);
                        
                        // Start playing next video
                        playVideo(nextVideo);
                        
                        // Crossfade: fade out active, fade in next
                        activeVideo.style.opacity = '0';
                        nextVideo.style.opacity = '1';
                        
                        // Swap references
                        const temp = activeVideo;
                        activeVideo = nextVideo;
                        nextVideo = temp;
                        
                        // Update index
                        currentVideoIndex = (currentVideoIndex + 1) % project.thumbnailVideos.length;
                        
                        // Set up end handler for new active video
                        activeVideo.addEventListener('ended', handleVideoEnd, { once: true });
                    };
                    
                    if (nextVideo.readyState >= 3) {
                        handleNextVideoReady();
                    } else {
                        nextVideo.addEventListener('canplay', handleNextVideoReady, { once: true });
                        nextVideo.addEventListener('loadeddata', handleNextVideoReady, { once: true });
                    }
                }
            }
            
            function handleVideoEnd() {
                activeVideo.removeEventListener('ended', handleVideoEnd);
                switchToNextVideo();
            }
            
            function startPlaying() {
                if (project.thumbnailVideos && project.thumbnailVideos.length > 0) {
                    const firstVideoSrc = project.thumbnailVideos[currentVideoIndex];
                    activeVideo.src = firstVideoSrc;
                    activeVideo.load();
                    
                    const handleFirstVideoReady = () => {
                        activeVideo.removeEventListener('canplay', handleFirstVideoReady);
                        activeVideo.removeEventListener('loadeddata', handleFirstVideoReady);
                        playVideo(activeVideo);
                        activeVideo.addEventListener('ended', handleVideoEnd, { once: true });
                        // Preload next video immediately
                        preloadNextVideo();
                    };
                    
                    if (isSafari) {
                        if (activeVideo.readyState >= 3) {
                            handleFirstVideoReady();
                        } else {
                            activeVideo.addEventListener('canplaythrough', handleFirstVideoReady, { once: true });
                            activeVideo.addEventListener('canplay', handleFirstVideoReady, { once: true });
                            activeVideo.addEventListener('loadeddata', handleFirstVideoReady, { once: true });
                        }
                    } else {
                        activeVideo.addEventListener('loadeddata', handleFirstVideoReady, { once: true });
                    }
                }
            }
            
            const thumbObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!isInitialized) {
                            isInitialized = true;
                            startPlaying();
                        }
                        thumbObserver.unobserve(thumb);
                    } else {
                        // Pause videos when out of view
                        video1.pause();
                        video2.pause();
                    }
                });
            }, {
                rootMargin: '50px' // Reduced from 200px to prevent premature loading
            });
            
            thumb.style.position = 'relative';
            thumb.classList.add('has-video');
            thumb.appendChild(video1);
            thumb.appendChild(video2);
            thumbObserver.observe(thumb);
            
            // Cleanup on page unload
            window.addEventListener('beforeunload', () => {
                video1.pause();
                video2.pause();
            });
        } else if (project.thumbnail && project.thumbnail.trim() !== '') {
            const isVideo = project.thumbnail.toLowerCase().endsWith('.mp4') || 
                           project.thumbnail.toLowerCase().endsWith('.webm') || 
                           project.thumbnail.toLowerCase().endsWith('.mov');
            
            if (isVideo) {
                const video = document.createElement('video');
                // Set attributes BEFORE setting src for Safari
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.autoplay = true;
            video.preload = 'metadata'; // Keep metadata for single video thumbnails
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                video.setAttribute('loop', '');
                video.setAttribute('muted', '');
                video.removeAttribute('controls');
                video.setAttribute('disablePictureInPicture', '');
                video.setAttribute('disableRemotePlayback', '');
                video.setAttribute('x-webkit-airplay', 'deny');
                video.setAttribute('webkit-playsinline', 'true');
                // Force Safari to not show controls
                video.controls = false;
                // Now set src
                video.src = project.thumbnail;
                
                if (project.id === 'project-2') {
                    video.addEventListener('loadedmetadata', () => {
                        video.currentTime = Math.max(0, video.duration - 3);
                    });
                } else if (project.id === 'project-6' && project.thumbnailStartTime !== undefined) {
                    video.addEventListener('loadedmetadata', () => {
                        video.currentTime = project.thumbnailStartTime;
                        const loopClip = () => {
                            if (video.currentTime >= project.thumbnailEndTime) {
                                video.currentTime = project.thumbnailStartTime;
                            }
                        };
                        video.addEventListener('timeupdate', loopClip);
                    });
                }
                
                const thumbObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const vid = entry.target;
                            
                            // Only use 'auto' preload for Safari when video is actually visible
                            if (isSafari) {
                                vid.preload = 'auto';
                            } else {
                                vid.preload = 'metadata'; // Use metadata for non-Safari browsers
                            }
                            vid.load();
                            
                            const playVideo = () => {
                                vid.play().catch(() => {
                                    // Autoplay blocked - this is expected
                                });
                            };
                            
                            if (isSafari) {
                                if (vid.readyState >= 3) {
                                    playVideo();
                                } else {
                                    vid.addEventListener('canplaythrough', playVideo, { once: true });
                                    vid.addEventListener('loadeddata', playVideo, { once: true });
                                }
                            } else {
                                vid.addEventListener('loadeddata', playVideo, { once: true });
                            }
                            
                            thumbObserver.unobserve(vid);
                        }
                    });
                }, {
                    rootMargin: '50px' // Reduced from 200px to prevent premature loading
                });
                
                thumbObserver.observe(video);
                
                thumb.classList.add('has-video');
                thumb.appendChild(video);
            } else {
                const img = document.createElement('img');
                img.src = project.thumbnail;
                img.alt = project.title;
                thumb.appendChild(img);
            }
        } else if (project.thumbnailImages && project.thumbnailImages.length > 0) {
            // Use two image elements for seamless crossfade transitions
            const img1 = document.createElement('img');
            const img2 = document.createElement('img');
            
            // Determine object-fit based on project
            const objectFit = project.id === 'project-5' ? 'cover' : 'contain';
            
            [img1, img2].forEach(img => {
            img.alt = project.title;
            img.className = 'cycling-thumbnail';
                img.style.position = 'absolute';
                img.style.top = '0';
                img.style.left = '0';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = objectFit;
                img.style.transition = 'opacity 0.3s ease';
                img.style.willChange = 'opacity';
                img.style.backfaceVisibility = 'hidden';
            });
            
            img1.style.opacity = '1';
            img2.style.opacity = '0';
            img2.style.pointerEvents = 'none';
            
            let currentImageIndex = 0;
            let cycleInterval = null;
            let activeImage = img1;
            let nextImage = img2;
            let isInitialized = false;
            
            function preloadNextImage() {
                if (project.thumbnailImages && project.thumbnailImages.length > 0) {
                    const nextIndex = (currentImageIndex + 1) % project.thumbnailImages.length;
                    const nextImageSrc = project.thumbnailImages[nextIndex];
                    // Preload the image
                    const preloadImg = new Image();
                    preloadImg.src = nextImageSrc;
                    nextImage.src = nextImageSrc;
                }
            }
            
            function switchToNextImage() {
                if (project.thumbnailImages && project.thumbnailImages.length > 0) {
                    // Preload the next image
                    preloadNextImage();
                    
                    // Wait for next image to load, then crossfade
                    const handleNextImageLoad = () => {
                        nextImage.removeEventListener('load', handleNextImageLoad);
                        
                        // Crossfade: fade out active, fade in next
                        requestAnimationFrame(() => {
                            activeImage.style.opacity = '0';
                            nextImage.style.opacity = '1';
                        });
                        
                        // Swap references
                        const temp = activeImage;
                        activeImage = nextImage;
                        nextImage = temp;
                        
                        // Update index
                    currentImageIndex = (currentImageIndex + 1) % project.thumbnailImages.length;
                    };
                    
                    if (nextImage.complete && nextImage.naturalHeight !== 0) {
                        handleNextImageLoad();
                    } else {
                        nextImage.addEventListener('load', handleNextImageLoad, { once: true });
                    }
                }
            }
            
            function startCycling() {
                if (project.thumbnailImages && project.thumbnailImages.length > 0) {
                    // Load first image
                    activeImage.src = project.thumbnailImages[currentImageIndex];
                    // Preload next image immediately
                    preloadNextImage();
                    // Start cycling interval
                    cycleInterval = setInterval(switchToNextImage, 4000);
                }
            }
            
            const thumbObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!isInitialized) {
                            isInitialized = true;
                            startCycling();
                        }
                        thumbObserver.unobserve(thumb);
                    } else {
                        if (cycleInterval) {
                            clearInterval(cycleInterval);
                            cycleInterval = null;
                        }
                        isInitialized = false;
                    }
                });
            }, {
                rootMargin: '50px' // Reduced from 200px to prevent premature loading
            });
            
            thumb.style.position = 'relative';
            thumbObserver.observe(thumb);
            thumb.appendChild(img1);
            thumb.appendChild(img2);
            
            // Cleanup on page unload
            window.addEventListener('beforeunload', () => {
                if (cycleInterval) {
                    clearInterval(cycleInterval);
                }
            });
        } else if (project.id === 'motion') {
            thumb.classList.add('placeholder');
            thumb.classList.add('motion-thumb');
            thumb.setAttribute('data-project-index', 'motion');
        } else if (project.id === 'project-7') {
            // Rough Pixel - Grid-based full-coverage animation with large glyphs
            thumb.classList.add('placeholder');
            thumb.classList.add('font-preview');
            thumb.style.background = '#000';
            thumb.style.overflow = 'hidden';
            thumb.style.position = 'relative';
            thumb.style.aspectRatio = '5/4';
            
            const canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.imageRendering = 'pixelated';
            canvas.style.imageRendering = 'crisp-edges';
            
            let ctx = null;
            let supportedGlyphs = [];
            let animationFrameId = null;
            let startTime = null;
            let lastUpdateTime = 0;
            let glyphCells = []; // Pre-computed grid cells with glyphs
            const ANIMATION_DURATION = 8000;
            const UPDATE_INTERVAL = 140; // Stepped updates every 140ms (~7fps)
            const GLYPH_SIZE = 30; // Large glyph size (48-110px range)
            const CELL_PADDING = 8;
            const CELL_SIZE = GLYPH_SIZE + CELL_PADDING;
            const CELL_SPACING = CELL_SIZE * 0.9; // Slight overlap for density
            
            // Glyph detection - pixel-perfect comparison
            function detectSupportedGlyphs() {
                const testCanvas = document.createElement('canvas');
                const testCtx = testCanvas.getContext('2d', { willReadFrequently: true });
                testCanvas.width = 64;
                testCanvas.height = 64;
                
                // Disable antialiasing
                testCtx.imageSmoothingEnabled = false;
                testCtx.textAlign = 'center';
                testCtx.textBaseline = 'middle';
                testCtx.fillStyle = '#fff';
                
                const candidates = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,;:?!';
                const supported = [];
                const fallbackFont = 'monospace';
                
                candidates.split('').forEach(char => {
                    // Render with Rough Pixel
                    testCtx.clearRect(0, 0, 64, 64);
                    testCtx.font = '32px "Rough Pixel", monospace';
                    testCtx.fillText(char, 32, 32);
                    const roughPixelData = testCtx.getImageData(0, 0, 64, 64);
                    
                    // Render with fallback
                    testCtx.clearRect(0, 0, 64, 64);
                    testCtx.font = `32px ${fallbackFont}`;
                    testCtx.fillText(char, 32, 32);
                    const fallbackData = testCtx.getImageData(0, 0, 64, 64);
                    
                    // Compare pixel data
                    let diffPixels = 0;
                    for (let i = 0; i < roughPixelData.data.length; i += 4) {
                        const r1 = roughPixelData.data[i];
                        const r2 = fallbackData.data[i];
                        if (Math.abs(r1 - r2) > 50) {
                            diffPixels++;
                        }
                    }
                    
                    // If more than 5% of pixels differ, glyph is supported
                    if (diffPixels > (64 * 64 * 0.05)) {
                        supported.push(char);
                    }
                });
                
                return supported.length > 0 ? supported : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,;:?!'.split('');
            }
            
            // Seeded random for consistent, pre-computed randomness
            function createSeededRandom(seed) {
                let value = seed;
                return function() {
                    value = (value * 9301 + 49297) % 233280;
                    return value / 233280;
                };
            }
            
            // Initialize canvas and animation
            function initAnimation() {
                const rect = thumb.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                const width = Math.floor(rect.width);
                const height = Math.floor(rect.height);
                
                canvas.width = width * dpr;
                canvas.height = height * dpr;
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';
                
                ctx = canvas.getContext('2d', { willReadFrequently: false });
                ctx.scale(dpr, dpr);
                
                // Disable all smoothing
                ctx.imageSmoothingEnabled = false;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillStyle = '#fff';
                
                // Detect supported glyphs (only once)
                supportedGlyphs = detectSupportedGlyphs();
                
                // Grid-based layout for full coverage
                const cols = Math.ceil(width / CELL_SPACING);
                const rows = Math.ceil(height / CELL_SPACING);
                glyphCells = [];
                const seededRand = createSeededRandom(12345);
                
                // Pre-compute grid: one glyph per cell for full coverage
                // Include "ROUGH PIXEL" letters in the mix
                const roughPixelLetters = 'ROUGH PIXEL'.split('').filter(c => c !== ' ');
                let letterIndex = 0;
                
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const cellX = Math.floor(col * CELL_SPACING);
                        const cellY = Math.floor(row * CELL_SPACING);
                        const seed = row * cols + col;
                        
                        // Mix "ROUGH PIXEL" letters with random glyphs
                        let char;
                        if (seededRand() < 0.3 && letterIndex < roughPixelLetters.length) {
                            // Use "ROUGH PIXEL" letter
                            char = roughPixelLetters[letterIndex];
                            letterIndex = (letterIndex + 1) % roughPixelLetters.length;
                        } else {
                            // Use random supported glyph
                            char = supportedGlyphs[Math.floor(seededRand() * supportedGlyphs.length)];
                        }
                        
                        glyphCells.push({
                            cellX,
                            cellY,
                            char,
                            seed
                        });
                    }
                }
                
                startTime = performance.now();
                lastUpdateTime = startTime;
                animate();
            }
            
            // Linear interpolation (no easing)
            function lerp(a, b, t) {
                return a + (b - a) * t;
            }
            
            // Animation loop - minimal: just change glyphs
            function animate() {
                const currentTime = performance.now();
                const elapsed = (currentTime - startTime) % ANIMATION_DURATION;
                const progress = elapsed / ANIMATION_DURATION;
                
                // Update characters on stepped intervals
                if (currentTime - lastUpdateTime >= UPDATE_INTERVAL) {
                    const charFrame = Math.floor(progress * 20);
                    glyphCells.forEach(cell => {
                        const charIndex = (charFrame + cell.seed) % supportedGlyphs.length;
                        cell.char = supportedGlyphs[charIndex];
                    });
                    lastUpdateTime = currentTime;
                }
                
                // Draw
                const width = canvas.width / (window.devicePixelRatio || 1);
                const height = canvas.height / (window.devicePixelRatio || 1);
                
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, width, height);
                
                ctx.fillStyle = '#fff';
                ctx.font = `${GLYPH_SIZE}px "Rough Pixel", monospace`;
                
                glyphCells.forEach(cell => {
                    ctx.fillText(cell.char, cell.cellX, cell.cellY);
                });
                
                animationFrameId = requestAnimationFrame(animate);
            }
            
            thumb.appendChild(canvas);
            
            // Start animation when thumbnail comes into view
            const thumbObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!ctx) {
                            initAnimation();
                        } else if (!animationFrameId) {
                            startTime = performance.now();
                            lastFrameTime = 0;
                            animate();
                        }
                    } else {
                        if (animationFrameId) {
                            cancelAnimationFrame(animationFrameId);
                            animationFrameId = null;
                        }
                    }
                });
            }, { rootMargin: '50px' });
            
            thumbObserver.observe(thumb);
            
            // Cleanup
            window.addEventListener('beforeunload', () => {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
            });
        }
        
        thumb.addEventListener('mouseenter', (e) => {
            tooltip.innerHTML = `
                <div class="project-tooltip-title">${project.title}</div>
                <div class="project-tooltip-subtitle">${project.subtitle}</div>
            `;
            tooltip.style.opacity = '1';
            tooltip.style.left = e.clientX + 5 + 'px';
            tooltip.style.top = e.clientY + 5 + 'px';
        });
        
        // Throttle tooltip mousemove for better performance
        thumb.addEventListener('mousemove', throttle((e) => {
            tooltip.style.left = e.clientX + 5 + 'px';
            tooltip.style.top = e.clientY + 5 + 'px';
        }, 16)); // ~60fps throttling
        
        thumb.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
        
        gallery.appendChild(thumb);
    });
}

