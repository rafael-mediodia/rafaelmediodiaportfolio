// Cache browser detection to avoid repeated regex calls
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Reuse motion.js list when available (motion.js loads before script.js on homepage)
function getRandomMotionVideo() {
    if (typeof motionVideos !== 'undefined' && motionVideos.length && typeof getMotionVideoSrc === 'function') {
        return getMotionVideoSrc(motionVideos[Math.floor(Math.random() * motionVideos.length)]);
    }
    return 'Motion/LOGO1-FULL.mp4';
}

const projects = [
    {
        id: 'project-1',
        title: 'Pinoy Plus',
        subtitle: 'A campaign for mga Pinoy creatives.',
        thumbnail: 'PinoyPlus/PinoyPlus-Intro.mp4', // Video thumbnail
        page: 'projects/pinoy-plus.html'
    },
    {
        id: 'project-5',
        title: 'Self Declaration',
        subtitle: 'A reflection for immigrants in the United States.',
        thumbnail: null,
        thumbnailImages: [
            'SelfDeclaration/Self-Declaration_4.jpg',
            'SelfDeclaration/Self-Declaration_1.jpg'
        ],
        page: 'projects/self-declaration.html'
    },
    {
        id: 'project-providenceland',
        title: 'Providenceland',
        subtitle: 'Title card for Nora Guttman, by Nora Guttman.',
        thumbnail: 'ProvidenceLand/ProvidenceLandTItleCard.mp4',
        page: 'projects/providenceland.html'
    },
    {
        id: 'project-make-my-mark',
        title: 'Make My Mark',
        subtitle: 'Degree project book on fast making and assembly.',
        thumbnail: 'MakeMyMark/MakeMyMark.mp4',
        page: 'projects/make-my-mark.html'
    },
    {
        id: 'project-risd-gdees',
        title: "RISD GDee's",
        subtitle: 'Ongoing identity and motion for RISD GD\'s student showcase.',
        thumbnail: "RISDGDee's/RISDGDee's_Thumbnail.mp4",
        page: 'projects/risd-gdees.html'
    },
    {
        id: 'project-field',
        title: 'field',
        subtitle: 'A site for interviews, discussions, and music.',
        thumbnail: 'Field/Field-Thumbnail.mp4',
        page: 'projects/field.html'
    },
    {
        id: 'project-brown-student-radio',
        title: 'Brown Student Radio',
        subtitle: 'Ongoing brand identity for Brown\'s student-run radio.',
        thumbnail: 'Brown Student Radio/BSRShirt_thumb.jpg',
        page: 'projects/brown-student-radio.html'
    },
    {
        id: 'project-3',
        title: 'Breakout Games',
        subtitle: 'Discovery and exploration motion identity work.',
        thumbnail: 'Breakout/Breakout-Transition.mp4',
        page: 'projects/breakout-games.html'
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
        id: 'project-mycelium-titlecard',
        title: 'Mycelium Title Card',
        subtitle: 'Film Title for MYCELIUM, by Veronica Egas.',
        thumbnail: 'MYCELIUM_TITLECARD.mp4',
        page: 'projects/mycelium-titlecard.html'
    },
    {
        id: 'project-chasing-sunsets',
        title: 'Chasing Sunsets',
        subtitle: 'Film Title Card for Chasing Sunsets, by Veronica Egas.',
        thumbnail: 'CHASINGSUNSETS.mp4',
        page: 'projects/chasing-sunsets.html'
    },
    {
        id: 'typefaces',
        title: 'Typefaces',
        subtitle: 'Original typefaces and lettering.',
        thumbnailType: 'typefaces',
        archivePanel: 'typefaces',
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
        archivePanel: 'illustrations'
    },
    {
        id: 'motion',
        title: 'Motion',
        subtitle: 'Take a peek at what I\'ve made move!',
        thumbnail: getRandomMotionVideo(),
        archivePanel: 'motion'
    },
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Defer Safari overlay to not block initial render
    if (isSafari) {
        setTimeout(() => {
            initSafariPlayOverlay();
        }, 100);
    }
    // Defer gallery until after first paint (double rAF) so shell stays responsive
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            initGallery();
        });
    });
});

function initSafariPlayOverlay() {
    const overlay = document.getElementById('safariPlayOverlay');
    const playAllButton = document.getElementById('safariPlayAllThumbnails');
    
    // Check if user has visited before (not just clicked play)
    const hasVisitedBefore = localStorage.getItem('safariHasVisited') === 'true';
    const hasPlayedBefore = localStorage.getItem('safariVideosPlayed') === 'true';
    
    const playAllVideos = () => {
        document.querySelectorAll('#gallery video').forEach((video) => {
            const lazySrc = video.getAttribute('data-src');
            if (lazySrc && !video.src) {
                video.src = lazySrc;
                video.removeAttribute('data-src');
                const start = video.getAttribute('data-clip-start');
                if (start !== null) {
                    const end = parseFloat(video.getAttribute('data-clip-end'), 10);
                    const t0 = parseFloat(start, 10);
                    video.addEventListener('loadedmetadata', () => {
                        video.currentTime = t0;
                        const loopClip = () => {
                            if (video.currentTime >= end) {
                                video.currentTime = t0;
                            }
                        };
                        video.addEventListener('timeupdate', loopClip);
                    }, { once: true });
                }
                if (isSafari) {
                    video.preload = 'auto';
                }
                video.load();
            }
            video.play().catch(() => {});
        });
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

function initGallery() {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;
    
    // Lazy tooltip creation - only create on first hover
    let tooltip = null;
    let tooltipTitle = null;
    let tooltipSubtitle = null;
    const getTooltip = () => {
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'project-tooltip';
            tooltipTitle = document.createElement('div');
            tooltipTitle.className = 'project-tooltip-title';
            tooltipSubtitle = document.createElement('div');
            tooltipSubtitle.className = 'project-tooltip-subtitle';
            tooltip.appendChild(tooltipTitle);
            tooltip.appendChild(tooltipSubtitle);
            document.body.appendChild(tooltip);
        }
        return tooltip;
    };
    
    // Use document fragment for batch DOM insertion
    const fragment = document.createDocumentFragment();
    
    projects.forEach((project) => {
        const thumb = document.createElement('div');
        thumb.className = 'project-thumb';
        thumb.setAttribute('data-project-id', project.id);
        thumb.onclick = () => {
            if (project.inProgress) {
                return;
            }
            if (project.archivePanel && typeof window.openArchivePanel === 'function') {
                window.openArchivePanel(project.archivePanel);
                return;
            }
            if (project.page) {
                window.location.href = project.page;
            }
        };
        
        if (project.thumbnailType === 'typefaces' && typeof window.initTypefaceGalleryThumb === 'function') {
            window.initTypefaceGalleryThumb(thumb);
        } else if (project.thumbnailVideos && project.thumbnailVideos.length > 0) {
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
                // Force Safari to not show controls
                video.controls = false;
                video.style.position = 'absolute';
                video.style.top = '0';
                video.style.left = '0';
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.objectFit = 'cover';
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
                const nextIndex = (currentVideoIndex + 1) % project.thumbnailVideos.length;
                const nextVideoSrc = project.thumbnailVideos[nextIndex];
                nextVideo.src = nextVideoSrc;
                nextVideo.load();
            }
            
            function switchToNextVideo() {
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
            
            function handleVideoEnd() {
                activeVideo.removeEventListener('ended', handleVideoEnd);
                switchToNextVideo();
            }
            
            function startPlaying() {
                // Append videos to DOM only when visible
                if (!thumb.contains(video1)) {
                    thumb.appendChild(video1);
                    thumb.appendChild(video2);
                }
                
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
            
            const thumbObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!isInitialized) {
                            isInitialized = true;
                            startPlaying();
                        } else if (video1.parentElement) {
                            playVideo(activeVideo);
                        }
                    } else {
                        if (video1.parentElement) video1.pause();
                        if (video2.parentElement) video2.pause();
                    }
                });
            }, {
                rootMargin: '25px'
            });
            
            thumb.style.position = 'relative';
            thumb.classList.add('has-video');
            // Don't append videos until they're needed (when intersecting)
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
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.autoplay = true;
                video.preload = 'none';
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                video.setAttribute('loop', '');
                video.setAttribute('muted', '');
                video.removeAttribute('controls');
                video.setAttribute('disablePictureInPicture', '');
                video.setAttribute('disableRemotePlayback', '');
                video.setAttribute('x-webkit-airplay', 'deny');
                video.controls = false;
                video.setAttribute('data-src', project.thumbnail);
                if (project.id === 'project-6' && project.thumbnailStartTime !== undefined) {
                    video.setAttribute('data-clip-start', String(project.thumbnailStartTime));
                    video.setAttribute('data-clip-end', String(project.thumbnailEndTime));
                }
                
                function attachClipLoop(vid) {
                    const start = vid.getAttribute('data-clip-start');
                    if (start === null) return;
                    const end = parseFloat(vid.getAttribute('data-clip-end'), 10);
                    const t0 = parseFloat(start, 10);
                    vid.addEventListener('loadedmetadata', () => {
                        vid.currentTime = t0;
                        const loopClip = () => {
                            if (vid.currentTime >= end) {
                                vid.currentTime = t0;
                            }
                        };
                        vid.addEventListener('timeupdate', loopClip);
                    }, { once: true });
                }
                
                const thumbObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const vid = entry.target;
                        const lazySrc = vid.getAttribute('data-src');
                        if (entry.isIntersecting) {
                            if (lazySrc && !vid.src) {
                                vid.src = lazySrc;
                                vid.removeAttribute('data-src');
                                attachClipLoop(vid);
                                if (isSafari) {
                                    vid.preload = 'auto';
                                } else {
                                    vid.preload = 'metadata';
                                }
                            }
                            if (!vid.src) return;
                            if (isSafari) {
                                vid.preload = 'auto';
                            }
                            const playThumbVideo = () => {
                                vid.play().catch(() => {});
                            };
                            if (isSafari) {
                                if (vid.readyState >= 3) {
                                    playThumbVideo();
                                } else {
                                    vid.addEventListener('canplaythrough', playThumbVideo, { once: true });
                                    vid.addEventListener('loadeddata', playThumbVideo, { once: true });
                                }
                            } else if (vid.readyState >= 2) {
                                playThumbVideo();
                            } else {
                                vid.addEventListener('loadeddata', playThumbVideo, { once: true });
                            }
                        } else {
                            vid.pause();
                        }
                    });
                }, {
                    rootMargin: '120px'
                });
                
                thumbObserver.observe(video);
                
                thumb.classList.add('has-video');
                thumb.appendChild(video);
            } else {
                const img = document.createElement('img');
                img.loading = 'lazy'; // Lazy load images
                img.decoding = 'async';
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
                img.loading = 'lazy'; // Lazy load images
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
                const nextIndex = (currentImageIndex + 1) % project.thumbnailImages.length;
                const nextImageSrc = project.thumbnailImages[nextIndex];
                // Preload the image
                const preloadImg = new Image();
                preloadImg.src = nextImageSrc;
                nextImage.src = nextImageSrc;
            }
            
            function switchToNextImage() {
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
            
            function startCycling() {
                // Load first image only when visible
                activeImage.loading = 'lazy';
                activeImage.src = project.thumbnailImages[currentImageIndex];
                // Preload next image immediately
                preloadNextImage();
                // Start cycling interval
                cycleInterval = setInterval(switchToNextImage, 4000);
            }
            
            const thumbObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!isInitialized) {
                            isInitialized = true;
                            startCycling();
                        } else if (!cycleInterval) {
                            cycleInterval = setInterval(switchToNextImage, 4000);
                        }
                    } else {
                        if (cycleInterval) {
                            clearInterval(cycleInterval);
                            cycleInterval = null;
                        }
                    }
                });
            }, {
                rootMargin: '25px'
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
        }
        
        // Lazy tooltip event listeners - only attach on first hover
        let tooltipAttached = false;
        let rafId = null;
        thumb.addEventListener('mouseenter', (e) => {
            if (!tooltipAttached) {
                tooltipAttached = true;
                const tip = getTooltip();
                thumb.addEventListener('mousemove', (e) => {
                    // Cancel any pending animation frame
                    if (rafId) cancelAnimationFrame(rafId);
                    // Use requestAnimationFrame for smooth updates
                    rafId = requestAnimationFrame(() => {
                        // Use left/top for fixed positioning
                        tip.style.left = (e.clientX + 5) + 'px';
                        tip.style.top = (e.clientY + 5) + 'px';
                        tip.style.transform = 'none';
                        rafId = null;
                    });
                });
                thumb.addEventListener('mouseleave', () => {
                    if (rafId) cancelAnimationFrame(rafId);
                    tip.style.opacity = '0';
                    tip.style.willChange = 'auto';
                });
            }
            const tip = getTooltip();
            // Always update tooltip content when hovering over a thumbnail
            tooltipTitle.textContent = project.title;
            tooltipSubtitle.textContent = project.subtitle;
            tip.style.willChange = 'left, top, opacity';
            tip.style.opacity = '1';
            // Use left/top for fixed positioning
            tip.style.left = (e.clientX + 5) + 'px';
            tip.style.top = (e.clientY + 5) + 'px';
            tip.style.transform = 'none';
        });
        
        // Add to fragment instead of directly to gallery
        fragment.appendChild(thumb);
    });
    
    // Batch append all thumbnails at once
    gallery.appendChild(fragment);
    
    function resumeVisibleGalleryVideos() {
        document.querySelectorAll('#gallery video').forEach((v) => {
            if (!v.src) return;
            const r = v.getBoundingClientRect();
            if (r.bottom > 0 && r.top < window.innerHeight) {
                v.play().catch(() => {});
            }
        });
    }
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.querySelectorAll('#gallery video').forEach((v) => v.pause());
        } else {
            resumeVisibleGalleryVideos();
        }
    });
}
