const projects = [
    {
        id: 'project-1',
        title: 'Pinoy Plus',
        subtitle: 'Identity Design',
        thumbnail: 'PinoyPlus/PinoyPlus-Intro.mp4', // Video thumbnail
        page: 'projects/pinoy-plus.html'
    },
    {
        id: 'project-5',
        title: 'Self Declaration',
        subtitle: 'Print Design',
        thumbnail: null,
        thumbnailImages: [
            'SelfDeclaration/DS3UNIT17_23.jpg',
            'SelfDeclaration/DS3UNIT17_19.jpg'
        ],
        page: 'projects/self-declaration.html'
    },
    {
        id: 'project-7',
        title: 'Rough Pixel',
        subtitle: 'Type Design',
        thumbnail: null,
        thumbnailImages: null,
        page: 'projects/rough-pixel.html'
    },
    {
        id: 'project-3',
        title: 'Breakout Games',
        subtitle: 'Motion Design',
        thumbnail: 'Breakout/Breakout-Transition.mp4',
        page: 'projects/breakout-games.html'
    },
    {
        id: 'project-4',
        title: 'bounce museum of rubber',
        subtitle: 'Identity Design',
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
        subtitle: 'Motion Design, Video',
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
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
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
                video.preload = 'auto';
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
                rootMargin: '200px'
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
        thumb.onclick = () => window.location.href = project.page;
        
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
                video.preload = 'auto';
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
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            
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
                    
                    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
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
                rootMargin: '200px'
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
                video.preload = 'metadata';
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
                            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                            
                            if (isSafari) {
                                vid.preload = 'auto';
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
                    rootMargin: '200px'
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
                rootMargin: '200px'
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
            // Rough Pixel - create animated text-based preview
            thumb.classList.add('placeholder');
            thumb.classList.add('font-preview');
            thumb.style.background = '#000';
            thumb.style.overflow = 'hidden';
            thumb.style.position = 'relative';
            thumb.style.display = 'flex';
            thumb.style.alignItems = 'center';
            thumb.style.justifyContent = 'center';
            thumb.style.aspectRatio = '5/4'; // Match video thumbnail aspect ratio
            
            const previewText = document.createElement('div');
            previewText.className = 'font-preview-text';
            previewText.style.fontFamily = "'Rough Pixel', monospace";
            // Use clamp for responsive font sizing that scales with container
            // Adjusted for 5:4 aspect ratio (wider container)
            previewText.style.fontSize = 'clamp(3.5rem, 10cqw, 8.5rem)'; // Use container query units, adjusted for wider ratio
            previewText.style.padding = '0';
            previewText.style.display = 'flex';
            previewText.style.flexDirection = 'column';
            previewText.style.alignItems = 'center';
            previewText.style.justifyContent = 'center';
            previewText.style.height = '100%';
            previewText.style.width = '100%';
            previewText.style.color = '#fff';
            previewText.style.letterSpacing = '0.05em';
            previewText.style.lineHeight = '1.0';
            previewText.style.textAlign = 'center';
            previewText.style.margin = '0';
            previewText.style.boxSizing = 'border-box';
            previewText.style.whiteSpace = 'pre-line'; // Allow newlines to render
            previewText.style.position = 'relative'; // Ensure positioning context
            previewText.style.overflow = 'hidden'; // Prevent text from being cut off
            previewText.style.wordBreak = 'break-word'; // Break long words if needed
            previewText.style.transform = 'translateY(4%)'; // Optically lower the content for better visual centering
            thumb.style.transition = 'background 0.5s ease';
            previewText.style.transition = 'color 0.5s ease';
            
            const line1 = 'ROUGH';
            const line2 = 'PIXEL';
            const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,;:?!';
            let hasAnimated = false;
            let colorInterval = null;
            let glyphCycleInterval = null;
            let typeTimeout = null;
            
            // Cleanup function to prevent memory leaks
            function cleanup() {
                if (colorInterval) {
                    clearInterval(colorInterval);
                    colorInterval = null;
                }
                if (glyphCycleInterval) {
                    clearInterval(glyphCycleInterval);
                    glyphCycleInterval = null;
                }
                if (typeTimeout) {
                    clearTimeout(typeTimeout);
                    typeTimeout = null;
                }
            }
            
            // Animate text appearing - type out "ROUGH" then "PIXEL" on separate lines
            function animateText() {
                if (hasAnimated) return;
                hasAnimated = true;
                
                let currentIndex = 0;
                let displayedLine1 = '';
                let displayedLine2 = '';
                
                // Create line break element for better performance
                const br = document.createElement('br');
                
                // First, type out "ROUGH" (typewriter effect)
                function typeLine1() {
                    if (currentIndex < line1.length) {
                        displayedLine1 += line1[currentIndex];
                        // Use textContent for better performance and security
                        previewText.textContent = displayedLine1 + (displayedLine2 ? '\n' + displayedLine2 : '');
                        currentIndex++;
                        typeTimeout = setTimeout(typeLine1, 150);
                    } else {
                        // After "ROUGH" is complete, start typing "PIXEL"
                        currentIndex = 0;
                        typeTimeout = setTimeout(typeLine2, 300);
                    }
                }
                
                // Then type out "PIXEL" (typewriter effect)
                function typeLine2() {
                    if (currentIndex < line2.length) {
                        displayedLine2 += line2[currentIndex];
                        previewText.textContent = displayedLine1 + '\n' + displayedLine2;
                        currentIndex++;
                        typeTimeout = setTimeout(typeLine2, 150);
                    } else {
                        // After both lines are complete, wait a moment then cycle through glyphs
                        typeTimeout = setTimeout(cycleGlyphs, 500);
                    }
                }
                
                previewText.textContent = ''; // Start with empty text
                typeLine1();
            }
            
            // Cycle through glyphs really fast
            function cycleGlyphs() {
                let glyphIndex = 0;
                let cycleCount = 0;
                const totalCycles = 2; // Cycle through all glyphs twice
                const glyphsPerCycle = glyphs.length * totalCycles;
                
                // Clear any existing interval
                if (glyphCycleInterval) {
                    clearInterval(glyphCycleInterval);
                }
                
                // Store original font size (clamp value) - using container-relative units, adjusted for 5:4 ratio
                const originalFontSize = 'clamp(3.5rem, 10cqw, 8.5rem)';
                
                // Clear content first to avoid glitch
                previewText.textContent = '';
                
                // Use requestAnimationFrame to smooth the transition
                requestAnimationFrame(() => {
                    // Increase font size for glyph animation - adjusted for 5:4 aspect ratio
                    previewText.style.fontSize = 'clamp(7rem, 20cqw, 17rem)';
                    // Ensure glyphs are centered during animation - maintain all centering properties
                    previewText.style.display = 'flex';
                    previewText.style.flexDirection = 'column';
                    previewText.style.alignItems = 'center';
                    previewText.style.justifyContent = 'center';
                    previewText.style.textAlign = 'center';
                    previewText.style.width = '100%';
                    previewText.style.height = '100%';
                    previewText.style.margin = '0';
                    previewText.style.padding = '0';
                    
                    // Start the glyph cycling after a brief delay to ensure smooth transition
                    requestAnimationFrame(() => {
                        glyphCycleInterval = setInterval(() => {
                            const currentGlyph = glyphs[glyphIndex];
                            // Show just one glyph on one line, centered - use textContent for better performance
                            previewText.textContent = currentGlyph;
                    
                            glyphIndex = (glyphIndex + 1) % glyphs.length;
                            cycleCount++;
                            
                            if (cycleCount >= glyphsPerCycle) {
                                clearInterval(glyphCycleInterval);
                                glyphCycleInterval = null;
                                // Use requestAnimationFrame for smooth transition back
                                requestAnimationFrame(() => {
                                    // Reset font size back to original
                                    previewText.style.fontSize = originalFontSize;
                                    // Clear content first, then rebuild with proper structure for flexbox
                                    previewText.textContent = '';
                                    const line1Div = document.createElement('div');
                                    line1Div.textContent = line1;
                                    line1Div.style.textAlign = 'center';
                                    line1Div.style.width = '100%';
                                    const line2Div = document.createElement('div');
                                    line2Div.textContent = line2;
                                    line2Div.style.textAlign = 'center';
                                    line2Div.style.width = '100%';
                                    previewText.appendChild(line1Div);
                                    previewText.appendChild(line2Div);
                                    // Ensure flexbox centering is maintained - reapply all properties
                                    previewText.style.display = 'flex';
                                    previewText.style.flexDirection = 'column';
                                    previewText.style.alignItems = 'center';
                                    previewText.style.justifyContent = 'center';
                                    previewText.style.textAlign = 'center';
                                    previewText.style.width = '100%';
                                    previewText.style.height = '100%';
                                    previewText.style.margin = '0';
                                    previewText.style.padding = '0';
                                    previewText.style.whiteSpace = 'normal'; // Reset white-space for flexbox
                                    // Wait 3 seconds then start color animation
                                    typeTimeout = setTimeout(startColorAnimation, 3000);
                                });
                            }
                        }, 50); // Very fast - 50ms per glyph
                    });
                });
            }
            
            let isBlackBackground = true;
            function startColorAnimation() {
                // Clear any existing interval
                if (colorInterval) {
                    clearInterval(colorInterval);
                }
                
                colorInterval = setInterval(() => {
                    if (isBlackBackground) {
                        thumb.style.background = '#fff'; // White background
                        previewText.style.color = '#000'; // Black text
                    } else {
                        thumb.style.background = '#000'; // Black background
                        previewText.style.color = '#fff'; // White text
                    }
                    isBlackBackground = !isBlackBackground;
                }, 5000); // Change every 5 seconds
            }
            
            thumb.appendChild(previewText);
            
            // Start animation when thumbnail comes into view
            const thumbObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasAnimated) {
                        // Wait a moment for thumbnail to be sized
                        typeTimeout = setTimeout(animateText, 100);
                        thumbObserver.unobserve(thumb);
                    } else if (!entry.isIntersecting && hasAnimated) {
                        // Cleanup when out of view to save resources
                        cleanup();
                        hasAnimated = false;
                    }
                });
            }, { rootMargin: '200px' });
            
            thumbObserver.observe(thumb);
            
            // Cleanup on page unload
            window.addEventListener('beforeunload', cleanup);
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
        
        thumb.addEventListener('mousemove', (e) => {
            tooltip.style.left = e.clientX + 5 + 'px';
            tooltip.style.top = e.clientY + 5 + 'px';
        });
        
        thumb.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
        
        gallery.appendChild(thumb);
    });
}
