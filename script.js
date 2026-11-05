const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const homeVideoLoadQueue = [];
let activeHomeVideoLoads = 0;
const MAX_HOME_VIDEO_LOADS = 2;

function posterFor(src) {
    if (!src) return '';
    const file = src.split('#')[0].split('/').pop().replace(/\.[^.]+$/, '');
    const safe = file.replace(/[^A-Za-z0-9._-]+/g, '-');
    return `posters/${safe}.jpg`;
}

function queueHomeVideoLoad(video, options = {}) {
    const { preload = 'metadata', onReady } = options;
    const lazySrc = video.getAttribute('data-src');

    if (!lazySrc) {
        onReady?.();
        return;
    }

    if (video.dataset.loadQueued === 'true') return;

    video.dataset.loadQueued = 'true';
    homeVideoLoadQueue.push({ video, preload, onReady });
    drainHomeVideoLoadQueue();
}

function drainHomeVideoLoadQueue() {
    while (activeHomeVideoLoads < MAX_HOME_VIDEO_LOADS && homeVideoLoadQueue.length) {
        const { video, preload, onReady } = homeVideoLoadQueue.shift();
        const lazySrc = video.getAttribute('data-src');

        if (!lazySrc) {
            delete video.dataset.loadQueued;
            onReady?.();
            continue;
        }

        activeHomeVideoLoads += 1;
        let settled = false;
        const done = () => {
            if (settled) return;
            settled = true;
            activeHomeVideoLoads = Math.max(0, activeHomeVideoLoads - 1);
            delete video.dataset.loadQueued;
            onReady?.();
            drainHomeVideoLoadQueue();
        };

        video.addEventListener('loadedmetadata', done, { once: true });
        video.addEventListener('error', done, { once: true });
        video.src = lazySrc;
        video.removeAttribute('data-src');
        video.preload = preload;
        video.load();
    }
}

// Reuse motion.js list when available (motion.js loads before script.js on homepage)
function getRandomMotionVideo() {
    if (typeof motionVideos !== 'undefined' && motionVideos.length && typeof getMotionVideoSrc === 'function') {
        return getMotionVideoSrc(motionVideos[Math.floor(Math.random() * motionVideos.length)]);
    }
    return 'Motion/LOGO1-FULL.mp4';
}

const projects = [
    {
        id: 'project-risd-gdees',
        title: "RISD GDee's",
        subtitle: 'Identity and motion for RISD Graphic Design\'s student showcase.',
        thumbnail: null,
        page: 'projects/risd-gdees.html',
        skills: ['Identity', 'Motion system', 'Event graphics', 'Art direction'],
        previewMedia: [
            { src: "RISDGDee's/16 by 9 reel.mp4", type: 'video' },
            { src: "RISDGDee's/storyreel.mp4", type: 'video', portrait: true },
        ],
    },
    {
        id: 'project-pinoy-plus',
        title: 'Pinoy Plus',
        subtitle: 'A campaign and web experience for mga Pinoy creatives.',
        thumbnail: 'PinoyPlus/PinoyPlus-Intro.mp4',
        page: 'projects/pinoy-plus.html',
        skills: ['Campaign identity', 'Web design', 'Motion', 'Community systems'],
        previewMedia: [
            { src: 'PinoyPlus/Instagram Posts.mp4', type: 'video' },
            { src: 'PinoyPlus/PinoyPlusDocuIntros.mp4', type: 'video' },
            { src: 'PinoyPlus/PinoyPlus_Signage_1.png', type: 'image' },
        ],
    },
    {
        id: 'project-5',
        title: 'Self Declaration',
        subtitle: 'A publication for immigrants in the United States.',
        thumbnail: 'SelfDeclaration/Self-Declaration_4.jpg',
        page: 'projects/self-declaration.html',
        skills: ['Book design', 'Print design'],
        previewMedia: [
            { src: 'SelfDeclaration/Self-Declaration_3.jpg', type: 'image' },
            { src: 'SelfDeclaration/selfdeclaration_grandfather_1.jpg', type: 'image' },
            { src: 'SelfDeclaration/Self-Declaration_1.jpg', type: 'image' },
        ],
    },
    {
        id: 'project-providenceland',
        title: 'Providenceland',
        subtitle: 'Title card and hand-built lettering for Nora Guttman.',
        thumbnail: 'ProvidenceLand/ProvidenceLandTItleCard.mp4',
        page: 'projects/providenceland.html',
        skills: ['Title design', 'Lettering', 'Motion', 'Material exploration'],
        featured: true,
        previewMedia: [
            { src: 'ProvidenceLand/OnceUponATimeHandlettering.png', type: 'image' },
            { src: 'ProvidenceLand/FinalTitleCard_Still.png', type: 'image' },
            { src: 'ProvidenceLand/PR.png', type: 'image' },
        ],
    },
    {
        id: 'project-make-my-mark',
        title: 'Make My Mark',
        subtitle: 'Degree project book on fast making and assembly.',
        thumbnail: 'MakeMyMark/MakeMyMark.mp4',
        page: 'projects/make-my-mark.html',
        skills: ['Publication design', 'Typography', 'Print production'],
        previewMedia: [],
    },
    {
        id: 'project-field',
        title: 'field',
        subtitle: 'A site for interviews, discussions, and music.',
        thumbnail: 'Field/Field-Thumbnail.mp4',
        page: 'projects/field.html',
        skills: ['Brand identity', 'Motion design', 'Type design'],
        previewMedia: [
            { src: 'Field/Field-ArtistIntros.mp4', type: 'video' },
        ],
    },
    {
        id: 'project-brown-student-radio',
        title: 'Brown Student Radio',
        subtitle: 'Campaign identity and motion for BSR\'s 4/20 event.',
        thumbnail: 'Brown Student Radio/BSR420_MainFeed.mp4',
        page: 'projects/brown-student-radio.html',
        skills: ['Campaign design', 'Motion', 'Social graphics'],
        previewMedia: [
            { src: 'Brown Student Radio/BSR420_Story-Reel.mp4', type: 'video', portrait: true },
        ],
    },
    {
        id: 'project-breakout',
        title: 'Breakout Games',
        subtitle: 'Discovery and exploration motion identity work.',
        thumbnail: 'Breakout/BreakoutMotion1.mp4',
        page: 'projects/breakout-games.html',
        skills: ['Motion identity', 'Brand studies', 'Animation'],
        previewMedia: [
            { src: 'Breakout/Breakout-Transition.mp4', type: 'video' },
        ],
    },
    {
        id: 'typefaces',
        title: 'Typefaces',
        subtitle: 'I love drawing and seeing how they become systems. This lead me to type design!',
        thumbnailType: 'typefaces',
        page: 'typefaces.html',
        skills: ['Typeface design', 'Variable fonts', 'Lettering'],
        previewMedia: [],
    },
];

// Initialize
function initHomeViewFilter() {
    const filter = document.querySelector('.home-view-filter');
    if (!filter) return;

    const buttons = Array.from(filter.querySelectorAll('[data-home-view]'));
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    const readStored = () => {
        try {
            const stored = sessionStorage.getItem('home-view');
            if (stored === 'scroll' || stored === 'file') return stored;
        } catch (_) {
            /* storage unavailable */
        }
        return 'file';
    };

    const apply = (next, persist) => {
        const mode = next === 'scroll' ? 'scroll' : 'file';
        document.body.classList.toggle('home-view-scroll', mode === 'scroll');
        buttons.forEach((button) => {
            const on = button.dataset.homeView === mode;
            button.classList.toggle('home-view-toggle--active', on);
            button.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        if (persist) {
            try {
                sessionStorage.setItem('home-view', mode);
            } catch (_) {
                /* storage unavailable */
            }
        }
        document.dispatchEvent(new CustomEvent('home-view-change', { detail: mode }));
    };

    const sync = () => {
        if (mobileQuery.matches) {
            apply('scroll', false);
            return;
        }
        apply(readStored(), false);
    };

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            if (mobileQuery.matches) return;
            apply(button.dataset.homeView, true);
        });
    });

    if (typeof mobileQuery.addEventListener === 'function') {
        mobileQuery.addEventListener('change', sync);
    } else if (typeof mobileQuery.addListener === 'function') {
        mobileQuery.addListener(sync);
    }
    sync();
}

document.addEventListener('DOMContentLoaded', () => {
    initHomeViewFilter();
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

let readMediaVideoObserver = null;

function observeReadMediaVideo(video) {
    if (!('IntersectionObserver' in window)) {
        const src = video.getAttribute('data-src');
        if (src) {
            video.src = src;
            video.removeAttribute('data-src');
            video.load();
        }
        return;
    }

    if (!readMediaVideoObserver) {
        readMediaVideoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const vid = entry.target;
                if (entry.isIntersecting) {
                    queueHomeVideoLoad(vid, {
                        preload: 'metadata',
                        onReady: () => vid.play().catch(() => {}),
                    });
                } else {
                    vid.pause();
                }
            });
        }, { rootMargin: '160px' });
    }

    readMediaVideoObserver.observe(video);
}

function createReadMediaItem(media, projectTitle) {
    const item = document.createElement('div');
    item.className = 'home-project-media';
    if (media.portrait) item.classList.add('home-project-media--portrait');

    if (media.type === 'vimeo') {
        item.classList.add('home-project-media--vimeo');
        const iframe = document.createElement('iframe');
        iframe.src = media.src;
        iframe.title = projectTitle;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        item.appendChild(iframe);
    } else if (media.type === 'video' || media.src.toLowerCase().endsWith('.mp4')) {
        const video = document.createElement('video');
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = true;
        video.preload = 'metadata';
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
        video.removeAttribute('controls');
        video.controls = false;
        video.setAttribute('disablePictureInPicture', '');
        video.setAttribute('disableRemotePlayback', '');
        video.setAttribute('x-webkit-airplay', 'deny');
        video.setAttribute('data-src', media.src);
        video.poster = posterFor(media.src);
        video.setAttribute('aria-label', projectTitle);
        observeReadMediaVideo(video);
        item.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = media.src;
        img.alt = projectTitle;
        img.loading = 'lazy';
        img.decoding = 'async';
        item.appendChild(img);
    }

    return item;
}

function initSafariPlayOverlay() {
    const overlay = document.getElementById('safariPlayOverlay');
    const playAllButton = document.getElementById('safariPlayAllThumbnails');
    
    // Check if user has visited before (not just clicked play)
    const hasVisitedBefore = localStorage.getItem('safariHasVisited') === 'true';
    const hasPlayedBefore = localStorage.getItem('safariVideosPlayed') === 'true';
    
    const playAllVideos = () => {
        document.querySelectorAll('#gallery video').forEach((video) => {
            const rect = video.getBoundingClientRect();
            const inView = rect.bottom > 0 && rect.top < window.innerHeight + 200;
            if (!inView) return;

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
                    video.preload = 'metadata';
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
    const designJumpNav = document.getElementById('designJumpNav');
    const navFragment = document.createDocumentFragment();

    // Use document fragment for batch DOM insertion
    const fragment = document.createDocumentFragment();
    
    projects.forEach((project, projectIndex) => {
        const card = document.createElement('article');
        card.className = 'home-project-card';
        if (project.featured) card.classList.add('home-project-card--featured');
        card.setAttribute('data-project-id', project.id);
        card.id = `design-${project.id}`;
        const fileTab = document.createElement('a');
        fileTab.className = 'design-jump-link home-file-tab';
        fileTab.href = `#design-${project.id}`;
        fileTab.textContent = project.title;
        const fileTabColors = [
            'var(--accent-sky)',
            'var(--accent-green)',
            'var(--accent-yellow)',
            'var(--accent-orange)',
        ];
        fileTab.style.setProperty('--nav-color', fileTabColors[projectIndex % 4]);
        card.appendChild(fileTab);
        if (project.page) {
            card.tabIndex = 0;
            card.setAttribute('role', 'link');
            card.setAttribute('aria-label', `Open ${project.title}`);
        }

        if (designJumpNav) {
            const navLink = document.createElement('a');
            navLink.className = 'design-jump-link';
            navLink.href = `#design-${project.id}`;
            navLink.textContent = project.title;
            const tabColors = [
                'var(--accent-sky)',
                'var(--accent-green)',
                'var(--accent-yellow)',
                'var(--accent-orange)',
            ];
            navLink.style.setProperty('--nav-color', tabColors[navFragment.childNodes.length % 4]);
            navFragment.appendChild(navLink);
        }

        const thumb = document.createElement('div');
        thumb.className = 'project-thumb';
        thumb.setAttribute('data-project-id', project.id);
        thumb.classList.add('home-project-media');

        const openProject = () => {
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

        thumb.onclick = (e) => {
            e.stopPropagation();
            openProject();
        };
        card.addEventListener('click', (e) => {
            if (e.target.closest('.home-project-title-row')) return;
            if (!project.page && !project.archivePanel) return;
            if (e.target.closest('button, a')) return;
            openProject();
        });
        card.addEventListener('keydown', (e) => {
            if (!project.page && !project.archivePanel) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProject();
            }
        });
        
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
                video.preload = 'metadata';
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
                activeVideo.setAttribute('data-src', firstVideoSrc);
                
                const handleFirstVideoReady = () => {
                    playVideo(activeVideo);
                    activeVideo.addEventListener('ended', handleVideoEnd, { once: true });
                    // Preload next video immediately
                    preloadNextVideo();
                };
                
                queueHomeVideoLoad(activeVideo, {
                    preload: 'metadata',
                    onReady: handleFirstVideoReady,
                });
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
                video.poster = posterFor(project.thumbnail);
                if (project.thumbnailStartTime !== undefined) {
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
                            const playThumbVideo = () => {
                                vid.play().catch(() => {});
                            };
                            if (lazySrc && !vid.src) {
                                attachClipLoop(vid);
                                queueHomeVideoLoad(vid, {
                                    preload: 'metadata',
                                    onReady: playThumbVideo,
                                });
                                return;
                            }
                            if (!vid.src) return;
                            if (isSafari) {
                                vid.preload = 'metadata';
                            }
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
                img.loading = 'lazy';
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
                img.loading = 'lazy';
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
        
        const meta = document.createElement('div');
        meta.className = 'home-project-meta';

        const title = document.createElement('h2');
        title.className = 'home-project-title';
        if (project.page && !project.inProgress) {
            const titleLink = document.createElement('a');
            titleLink.className = 'home-project-title-link';
            titleLink.href = project.page;
            titleLink.textContent = project.title;
            title.appendChild(titleLink);
        } else {
            title.textContent = project.title;
        }

        const titleRow = document.createElement('div');
        titleRow.className = 'home-project-title-row';
        titleRow.appendChild(title);

        const subtitle = document.createElement('p');
        subtitle.className = 'home-project-subtitle';
        subtitle.textContent = project.subtitle || '';

        const skills = document.createElement('ul');
        skills.className = 'home-project-skills';
        skills.addEventListener('keydown', (e) => {
            e.stopPropagation();
        });
        (project.skills || []).forEach((skill) => {
            const item = document.createElement('li');
            item.textContent = skill;
            skills.appendChild(item);
        });

        if (project.skills?.length) titleRow.appendChild(skills);
        meta.appendChild(titleRow);
        meta.appendChild(subtitle);

        const mediaStrip = document.createElement('div');
        mediaStrip.className = 'home-project-media-strip';
        const previewMedia = project.previewMedia || [];
        const shouldLeadWithPreviewMedia = previewMedia[0]?.type === 'vimeo';
        const hasThumbnail =
            project.thumbnailType ||
            project.thumbnailVideos?.length ||
            project.thumbnailImages?.length ||
            (project.thumbnail && project.thumbnail.trim() !== '');
        if (!shouldLeadWithPreviewMedia && hasThumbnail) {
            mediaStrip.appendChild(thumb);
        }
        previewMedia.forEach((media) => {
            mediaStrip.appendChild(createReadMediaItem(media, project.title));
        });

        card.appendChild(meta);
        card.appendChild(mediaStrip);

        // Add to fragment instead of directly to gallery
        fragment.appendChild(card);
    });
    
    // Batch append all thumbnails at once
    if (designJumpNav) {
        designJumpNav.appendChild(navFragment);
    }
    gallery.appendChild(fragment);
    initHomeComicScroll(gallery);
    
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

function initHomeComicScroll(gallery) {
    if (!gallery || !document.body.classList.contains('home-page')) return;

    const pages = Array.from(gallery.querySelectorAll('.home-project-card'));
    if (!pages.length) return;

    const stage = gallery.closest('.gallery-container') || gallery;
    const folder = gallery.closest('.home-folder');
    const nav = document.getElementById('designJumpNav');
    const bottomNav = document.getElementById('designJumpNavBottom');
    const getLinks = () =>
        Array.from(folder?.querySelectorAll('.design-jump-link[href^="#"]') || []);
    let index = 0;
    let locked = false;
    let wheelDelta = 0;
    let wheelReset = 0;
    let touchX = 0;
    let touchY = 0;
    let fitting = false;
    let layingOutTabs = false;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tiltTitle = (page) => {
        const row = page?.querySelector('.home-project-title-row');
        if (!row) return;
        if (reduceMotion) {
            row.style.setProperty('--title-tilt', '0deg');
            return;
        }
        const prev = parseFloat(row.style.getPropertyValue('--title-tilt')) || 0;
        let next = (Math.random() * 1.8 - 0.9).toFixed(2);
        if (Math.abs(next - prev) < 0.35) {
            next = (prev >= 0 ? -0.55 : 0.6).toFixed(2);
        }
        row.style.setProperty('--title-tilt', `${next}deg`);
    };

    const placeTabs = (activeIndex) => {
        const page = pages[activeIndex];
        getLinks().forEach((link) => {
            const active = Boolean(page && link.hash === `#${page.id}`);
            link.classList.toggle('design-jump-link--active', active);
            if (active) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    const layoutTabs = () => {
        if (!nav || !bottomNav || layingOutTabs) return;
        layingOutTabs = true;
        while (bottomNav.firstChild) nav.appendChild(bottomNav.firstChild);
        if (window.matchMedia('(max-width: 768px)').matches) {
            bottomNav.hidden = true;
            layingOutTabs = false;
            return;
        }
        const tabs = Array.from(nav.querySelectorAll('.design-jump-link'));
        const avail = nav.clientWidth;
        const gap = parseFloat(getComputedStyle(nav).gap) || 0;
        let used = 0;
        let split = tabs.length;
        for (let i = 0; i < tabs.length; i += 1) {
            const width = tabs[i].getBoundingClientRect().width;
            const next = i === 0 ? width : used + gap + width;
            if (i > 0 && next > avail + 0.5) {
                split = i;
                break;
            }
            used = next;
        }
        for (let i = split; i < tabs.length; i += 1) {
            bottomNav.appendChild(tabs[i]);
        }
        bottomNav.hidden = bottomNav.childElementCount === 0;
        window.requestAnimationFrame(() => {
            layingOutTabs = false;
        });
    };

    const clearFit = (page) => {
        if (!page) return;
        page.style.removeProperty('--page-scale');
        page.style.marginBottom = '';
        page.style.width = '';
        const strip = page.querySelector('.home-project-media-strip');
        if (!strip) return;
        strip.style.transform = '';
        strip.style.marginBottom = '';
        strip.classList.remove('home-project-media-strip--fit');
    };

    const fitPage = (page) => {
        if (!page || !page.classList.contains('home-project-card--current')) return;
        fitting = true;
        page.style.removeProperty('--page-scale');
        page.style.marginBottom = '';
        page.style.width = '';
        window.requestAnimationFrame(() => {
            fitting = false;
        });
    };

    const scrollMode = () => document.body.classList.contains('home-view-scroll');

    const revealStack = () => {
        pages.forEach((page) => {
            page.classList.remove('home-project-card--pop', 'home-project-card--passed');
            page.classList.add('home-project-card--current');
            page.setAttribute('aria-hidden', 'false');
        });
    };

    const show = (next) => {
        if (scrollMode()) {
            revealStack();
            return;
        }
        index = Math.max(0, Math.min(pages.length - 1, next));
        wheelDelta = 0;
        pages.forEach((page, i) => {
            const current = i === index;
            page.classList.remove('home-project-card--pop');
            page.classList.toggle('home-project-card--current', current);
            page.classList.toggle('home-project-card--passed', !current);
            page.setAttribute('aria-hidden', current ? 'false' : 'true');
            if (!current) clearFit(page);
            page.querySelectorAll('video').forEach((video) => {
                if (current && video.src) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
            if (current) {
                void page.offsetWidth;
                page.classList.add('home-project-card--pop');
                tiltTitle(page);
            }
        });
        layoutTabs();
        placeTabs(index);
        fitPage(pages[index]);
        const id = pages[index]?.id;
        if (id && window.location.hash !== `#${id}`) {
            history.replaceState(null, '', `#${id}`);
        }
    };

    const flip = (dir) => {
        if (locked) return;
        const next = index + dir;
        if (next < 0 || next >= pages.length) return;
        locked = true;
        show(next);
        window.setTimeout(() => {
            locked = false;
        }, 180);
    };

    const currentPage = () => pages[index];

    stage.addEventListener(
        'wheel',
        (e) => {
            if (scrollMode()) return;
            if (e.target.closest('.design-jump-nav') && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                return;
            }
            e.preventDefault();
            const primary = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
            wheelDelta += primary;
            window.clearTimeout(wheelReset);
            wheelReset = window.setTimeout(() => {
                wheelDelta = 0;
            }, 280);
            if (Math.abs(wheelDelta) < 48) return;
            const dir = wheelDelta > 0 ? 1 : -1;
            wheelDelta = 0;
            flip(dir);
        },
        { passive: false }
    );

    gallery.addEventListener(
        'touchmove',
        (e) => {
            if (scrollMode()) return;
            if (e.target.closest('.design-jump-nav')) return;
            e.preventDefault();
        },
        { passive: false }
    );

    gallery.addEventListener(
        'touchstart',
        (e) => {
            if (!e.touches[0]) return;
            touchX = e.touches[0].clientX;
            touchY = e.touches[0].clientY;
        },
        { passive: true }
    );
    gallery.addEventListener(
        'touchend',
        (e) => {
            if (scrollMode()) return;
            if (e.target.closest('.design-jump-nav')) return;
            const touch = e.changedTouches[0];
            if (!touch) return;
            const dx = touchX - touch.clientX;
            const dy = touchY - touch.clientY;
            if (Math.max(Math.abs(dx), Math.abs(dy)) < 36) return;
            const dir = Math.abs(dy) >= Math.abs(dx) ? (dy > 0 ? 1 : -1) : (dx > 0 ? 1 : -1);
            flip(dir);
        },
        { passive: true }
    );

    stage.addEventListener('click', (e) => {
        if (e.target.closest('.home-project-title-link')) return;
        const link = e.target.closest('.design-jump-link[href^="#"]');
        if (!link || !stage.contains(link)) return;
        e.preventDefault();
        e.stopPropagation();
        const next = pages.findIndex((page) => page.id === link.hash.slice(1));
        if (scrollMode()) {
            if (next < 0) return;
            pages[next].scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        if (next < 0) return;
        if (next === index) {
            tiltTitle(pages[index]);
            return;
        }
        show(next);
    });

    document.addEventListener('keydown', (e) => {
        if (!document.body.classList.contains('home-page') || scrollMode()) return;
        const tag = e.target?.tagName;
        if (tag && /INPUT|TEXTAREA|SELECT/.test(tag)) return;
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            flip(1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            flip(-1);
        }
    });

    const refit = () => {
        layoutTabs();
        placeTabs(index);
        fitPage(currentPage());
    };
    window.addEventListener('resize', refit);
    if (typeof ResizeObserver === 'function') {
        const observer = new ResizeObserver(() => {
            if (!fitting && !layingOutTabs) refit();
        });
        observer.observe(stage);
        pages.forEach((page) => observer.observe(page));
    }
    pages.forEach((page) => {
        page.querySelectorAll('img').forEach((img) => {
            if (img.complete) return;
            img.addEventListener('load', refit, { once: true });
        });
    });

    document.addEventListener('home-view-change', (e) => {
        if (e.detail === 'scroll') revealStack();
        else show(index);
    });

    const startId = window.location.hash.slice(1);
    const start = pages.findIndex((page) => page.id === startId);
    show(start >= 0 ? start : 0);
}
