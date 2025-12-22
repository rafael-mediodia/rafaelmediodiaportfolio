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
            // Rough Pixel - Lo-fi pixel-perfect bitmap animation
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
            let lastFrameTime = 0;
            let glyphData = []; // Pre-calculated glyph positions and properties
            let seededRandom = null; // Seeded random for consistent jitter
            const ANIMATION_DURATION = 8000; // 8 seconds
            const TARGET_FPS = 8; // Low frame rate
            const FRAME_INTERVAL = 1000 / TARGET_FPS;
            const GRID_SIZE = 12; // Increased from 8 to reduce glyph count
            
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
            
            // Seeded random for consistent jitter
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
                
                ctx = canvas.getContext('2d', { willReadFrequently: false }); // Changed to false for better performance
                ctx.scale(dpr, dpr);
                
                // Disable all smoothing
                ctx.imageSmoothingEnabled = false;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillStyle = '#fff';
                
                // Detect supported glyphs (only once)
                supportedGlyphs = detectSupportedGlyphs();
                
                // Pre-calculate glyph data for performance
                const cols = Math.ceil(width / GRID_SIZE);
                const rows = Math.ceil(height / GRID_SIZE);
                glyphData = [];
                seededRandom = createSeededRandom(12345); // Fixed seed for consistency
                
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const baseX = Math.floor(col * GRID_SIZE);
                        const baseY = Math.floor(row * GRID_SIZE);
                        const char = supportedGlyphs[Math.floor(seededRandom() * supportedGlyphs.length)];
                        const jitterSeed = row * cols + col;
                        
                        glyphData.push({
                            baseX,
                            baseY,
                            char,
                            jitterSeed,
                            row,
                            col
                        });
                    }
                }
                
                startTime = performance.now();
                lastFrameTime = 0;
                animate();
            }
            
            // Step function for low frame rate
            function step(t) {
                return Math.floor(t);
            }
            
            // Linear interpolation (no easing)
            function lerp(a, b, t) {
                return a + (b - a) * t;
            }
            
            // Animation loop
            function animate() {
                const currentTime = performance.now();
                
                // Low frame rate simulation
                if (currentTime - lastFrameTime < FRAME_INTERVAL) {
                    animationFrameId = requestAnimationFrame(animate);
                    return;
                }
                lastFrameTime = currentTime;
                
                const elapsed = (currentTime - startTime) % ANIMATION_DURATION;
                const progress = elapsed / ANIMATION_DURATION;
                
                // Clear canvas
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
                
                const width = canvas.width / (window.devicePixelRatio || 1);
                const height = canvas.height / (window.devicePixelRatio || 1);
                
                // Pre-calculate phase info
                // Extended timing: more time to see the word clearly
                // 0.0-0.25: Noisy field (scattered) - small glyphs
                // 0.25-0.55: Coalesce into readable cluster (longer for word visibility) - grow to medium
                // 0.55-0.80: Break apart - shrink back to small
                // 0.80-1.0: Return to noise - small scattered glyphs
                let phase = 'noise';
                let phaseProgress = 0;
                const clusterX = width * 0.5;
                const clusterY = height * 0.5;
                
                if (progress < 0.25) {
                    phase = 'noise';
                    phaseProgress = progress / 0.25;
                } else if (progress < 0.55) {
                    phase = 'coalesce';
                    phaseProgress = (progress - 0.25) / 0.3;
                } else if (progress < 0.80) {
                    phase = 'break';
                    phaseProgress = (progress - 0.55) / 0.25;
                } else {
                    phase = 'noise';
                    phaseProgress = (progress - 0.80) / 0.2;
                }
                
                // Pre-calculate misalignment (deterministic)
                const misalignFrame = Math.floor(progress * 20) % 4;
                const rowShift = misalignFrame === 0 ? ((Math.floor(progress * 100) % 3 === 0) ? 1 : -1) : 0;
                
                // Batch render by size/opacity to reduce state changes
                const renderBatches = {
                    small: [],
                    medium: [],
                    large: []
                };
                
                // Pre-calculate all positions
                glyphData.forEach((glyph, index) => {
                    let x = glyph.baseX;
                    let y = glyph.baseY;
                    let size = 8;
                    let opacity = 1;
                    
                    // Use seeded random for consistent jitter (based on frame)
                    const frameSeed = glyph.jitterSeed + Math.floor(progress * 100);
                    const localRand = createSeededRandom(frameSeed);
                    
                    if (phase === 'noise') {
                        const jitterX = Math.floor((localRand() - 0.5) * 4);
                        const jitterY = Math.floor((localRand() - 0.5) * 4);
                        x = Math.floor(glyph.baseX + jitterX);
                        y = Math.floor(glyph.baseY + jitterY);
                        opacity = 0.3 + localRand() * 0.4;
                        
                        // Occasional jitter
                        const jitterCheck = localRand();
                        if (jitterCheck > 0.7) {
                            x += localRand() > 0.5 ? 1 : -1;
                            y += localRand() > 0.5 ? 1 : -1;
                        }
                    } else if (phase === 'coalesce') {
                        x = Math.floor(lerp(glyph.baseX, clusterX, phaseProgress));
                        y = Math.floor(lerp(glyph.baseY, clusterY, phaseProgress));
                        size = Math.floor(lerp(8, 14, phaseProgress)); // Smaller max size
                        opacity = lerp(0.4, 1, phaseProgress);
                        
                        // Reduce opacity of glyphs near the word area to make word more visible
                        if (phaseProgress > 0.5) {
                            const distToCenter = Math.sqrt(Math.pow(x - clusterX, 2) + Math.pow(y - clusterY, 2));
                            if (distToCenter < 100) {
                                opacity *= 0.2; // Make background glyphs more transparent near word
                            }
                        }
                    } else if (phase === 'break') {
                        const angle = Math.atan2(glyph.baseY - clusterY, glyph.baseX - clusterX);
                        const distance = Math.sqrt(Math.pow(glyph.baseX - clusterX, 2) + Math.pow(glyph.baseY - clusterY, 2));
                        const targetDistance = distance * (1 + phaseProgress * 2);
                        x = Math.floor(clusterX + Math.cos(angle) * targetDistance);
                        y = Math.floor(clusterY + Math.sin(angle) * targetDistance);
                        // Shrink more aggressively back to small size
                        size = Math.floor(lerp(14, 8, phaseProgress));
                        opacity = lerp(1, 0.3, phaseProgress);
                    } else if (phase === 'noise' && progress > 0.8) {
                        // Final noise phase - ensure all glyphs are small
                        const jitterX = Math.floor((localRand() - 0.5) * 4);
                        const jitterY = Math.floor((localRand() - 0.5) * 4);
                        x = Math.floor(glyph.baseX + jitterX);
                        y = Math.floor(glyph.baseY + jitterY);
                        size = 8; // Force small size
                        opacity = 0.3 + localRand() * 0.4;
                        
                        // Occasional jitter
                        const jitterCheck = localRand();
                        if (jitterCheck > 0.7) {
                            x += localRand() > 0.5 ? 1 : -1;
                            y += localRand() > 0.5 ? 1 : -1;
                        }
                    }
                    
                    // Apply row misalignment
                    if (rowShift !== 0 && glyph.row % 3 === 0) {
                        x = Math.floor(x + rowShift);
                    }
                    
                    // Skip if off-screen or very low opacity
                    if (x < -20 || x > width + 20 || y < -20 || y > height + 20 || opacity < 0.1) {
                        return;
                    }
                    
                    // Batch by size
                    const batch = size <= 8 ? 'small' : size <= 12 ? 'medium' : 'large';
                    renderBatches[batch].push({ x, y, size, opacity, char: glyph.char });
                });
                
                // Render batches (reduces font/alpha state changes)
                ctx.fillStyle = '#fff';
                
                // Small glyphs
                if (renderBatches.small.length > 0) {
                    ctx.font = '8px "Rough Pixel", monospace';
                    renderBatches.small.forEach(g => {
                        if (g.opacity < 0.99) ctx.globalAlpha = g.opacity;
                        ctx.fillText(g.char, g.x, g.y);
                        if (g.opacity < 0.99) ctx.globalAlpha = 1;
                    });
                }
                
                // Medium glyphs
                if (renderBatches.medium.length > 0) {
                    ctx.font = '12px "Rough Pixel", monospace';
                    renderBatches.medium.forEach(g => {
                        if (g.opacity < 0.99) ctx.globalAlpha = g.opacity;
                        ctx.fillText(g.char, g.x, g.y);
                        if (g.opacity < 0.99) ctx.globalAlpha = 1;
                    });
                }
                
                // Large glyphs
                if (renderBatches.large.length > 0) {
                    renderBatches.large.forEach(g => {
                        ctx.font = `${g.size}px "Rough Pixel", monospace`;
                        if (g.opacity < 0.99) ctx.globalAlpha = g.opacity;
                        ctx.fillText(g.char, g.x, g.y);
                        if (g.opacity < 0.99) ctx.globalAlpha = 1;
                    });
                }
                
                // Render "ROUGH PIXEL" word during coalesce phase only - don't show during break
                // Show word earlier (at 0.5 of coalesce) and keep it visible until end of coalesce
                const showWord = phase === 'coalesce' && phaseProgress > 0.5;
                
                if (showWord) {
                    const word = 'ROUGH PIXEL';
                    // Calculate word progress: 0.5-1.0 during coalesce, then fade during break
                    let wordProgress = 1;
                    if (phase === 'coalesce') {
                        wordProgress = (phaseProgress - 0.5) / 0.5; // 0 to 1 as coalesce progresses
                    } else if (phase === 'break') {
                        wordProgress = 1 - (phaseProgress / 0.3); // Fade from 1 to 0 during early break
                    }
                    const wordSize = Math.floor(lerp(14, 22, Math.min(1, wordProgress))); // Larger size for clarity
                    ctx.font = `${wordSize}px "Rough Pixel", monospace`;
                    
                    // Calculate total width using measureText - ensure all characters are included
                    let totalWidth = 0;
                    const wordChars = [];
                    
                    // Build character array with proper spacing
                    for (let i = 0; i < word.length; i++) {
                        const char = word[i];
                        if (char === ' ') {
                            // Space character - use a fixed width
                            const spaceWidth = wordSize * 0.5;
                            wordChars.push({ char: ' ', width: spaceWidth, render: false });
                            totalWidth += spaceWidth;
                        } else {
                            // Check if character is supported, if not use a placeholder width
                            if (supportedGlyphs.includes(char)) {
                                ctx.font = `${wordSize}px "Rough Pixel", monospace`;
                                const width = ctx.measureText(char).width;
                                wordChars.push({ char, width, render: true });
                                totalWidth += width;
                            } else {
                                // Character not supported - use estimated width and render placeholder
                                const estimatedWidth = wordSize * 0.6;
                                wordChars.push({ char, width: estimatedWidth, render: false });
                                totalWidth += estimatedWidth;
                            }
                        }
                    }
                    
                    // Ensure word fits on canvas, adjust size if needed
                    const maxWidth = width * 0.9;
                    let adjustedWordSize = wordSize;
                    if (totalWidth > maxWidth) {
                        adjustedWordSize = Math.floor(wordSize * (maxWidth / totalWidth));
                        // Recalculate widths with adjusted size
                        ctx.font = `${adjustedWordSize}px "Rough Pixel", monospace`;
                        totalWidth = 0;
                        wordChars.forEach(wc => {
                            if (wc.char === ' ') {
                                wc.width = adjustedWordSize * 0.5;
                            } else if (wc.render) {
                                wc.width = ctx.measureText(wc.char).width;
                            } else {
                                wc.width = adjustedWordSize * 0.6;
                            }
                            totalWidth += wc.width;
                        });
                    }
                    
                    const wordX = Math.floor(clusterX - totalWidth / 2);
                    const wordY = Math.floor(clusterY - adjustedWordSize / 2);
                    
                    // Ensure word stays within canvas bounds
                    const clampedWordX = Math.max(5, Math.min(wordX, width - totalWidth - 5));
                    
                    // Render with full opacity during coalesce, fade during break
                    ctx.globalAlpha = wordProgress > 0.8 ? 1 : wordProgress;
                    ctx.fillStyle = '#fff';
                    ctx.font = `${adjustedWordSize}px "Rough Pixel", monospace`;
                    
                    let currentX = clampedWordX;
                    
                    // Render each character - ensure ALL characters are rendered
                    for (let i = 0; i < wordChars.length; i++) {
                        const { char, width, render } = wordChars[i];
                        if (char === ' ') {
                            // Skip space visually but advance position
                            currentX += width;
                        } else if (render) {
                            // Render character at integer pixel position
                            const charX = Math.floor(currentX);
                            const charY = Math.floor(wordY);
                            
                            // Render if within reasonable bounds (allow slight overflow for edge cases)
                            if (charX >= -10 && charX < width + 10 && charY >= -10 && charY < height + 10) {
                                ctx.fillText(char, charX, charY);
                            }
                            currentX += width;
                        } else {
                            // Character not supported, just advance
                            currentX += width;
                        }
                    }
                    
                    
                    ctx.globalAlpha = 1;
                }
                
                // Hero glyph moments (1-2 oversized glyphs) - only show during word display
                // Remove hero glyphs - they're causing confusion at the end
                // The word "ROUGH PIXEL" is enough to showcase the typeface
                
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

