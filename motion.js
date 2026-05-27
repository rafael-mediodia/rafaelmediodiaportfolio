// Use cached Safari detection from script.js if available, otherwise detect
const isSafariMotion = typeof isSafari !== 'undefined' ? isSafari : /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const motionVideos = [
    { file: 'LOGO1-FULL.mp4', tooltip: 'Cortis Fan Motion' },
    { file: 'LOGO2-FULL.mp4', tooltip: 'Cortis Fan Motion' },
    { file: 'Whats at the core.mp4', tooltip: 'Whats At The Core' },
    { file: 'Comp 2.mp4', tooltip: 'Bracketfly' },
    { file: 'Comp 3.mp4', tooltip: 'Face To Face' },
    { file: 'RAFAELMEDIODIA_FORMINMOTION.mp4', tooltip: 'Graphic Design Show' },
    { file: '2nd Ad.mp4', tooltip: 'Jazz TV Ad' },
    { file: 'Bubbles (2).mp4', tooltip: 'Particles' },
    { file: 'RAFAELMEDIODIA_ASSIGNMENT4_COLORLIGHTSHADOW.mp4', tooltip: 'RISD Museum Show' },
    { file: 'girldinneranimation2-gs-color-addedtext.mp4', tooltip: 'Girl Dinner Titlecard' },
    { file: 'Chemistry.mp4', tooltip: 'Movement Exploration' },
    { file: 'EXPIRATIONDATE-POST-GREEN.mp4', tooltip: 'Expiration Date' },
    { file: 'DingDongProductions.mp4', tooltip: 'Ding Dong Productions' },
    { file: 'MagicalMischief.mp4', tooltip: 'Magical Mischief' },
    { file: 'StudioRafael.mp4', tooltip: 'Studio Rafael' },
    { file: 'cutitout.mp4', tooltip: 'Cut It Out' },
    { file: 'newstar!studio.mp4', tooltip: 'New Star Studio' }
];

function getMotionVideoFile(videoData) {
    return typeof videoData === 'string' ? videoData : videoData.file;
}

function getMotionVideoSrc(videoData) {
    const file = getMotionVideoFile(videoData);
    return file.includes('/') ? file : `Motion/${file}`;
}

let motionInitialized = false;
let motionGalleryObserver = null;
let motionArchiveTooltip = null;
let activeArchiveVideoLoads = 0;
const MAX_ARCHIVE_VIDEO_LOADS = 2;

function scheduleMotionWork(fn) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(fn, { timeout: 250 });
    } else {
        setTimeout(fn, 16);
    }
}

function bootMotion() {
    if (motionInitialized || !document.getElementById('motionGallery')) return;
    motionInitialized = true;
    if (document.getElementById('videoZoomModal')) {
        initVideoZoom();
    }
    scheduleMotionWork(() => {
        initMotionGallery();
        initMotionFeatured();
    });
}

function initMotionVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
        if (!motionInitialized) return;
        if (document.hidden) {
            if (featuredVideo) {
                featuredVideo.pause();
            }
            document.querySelectorAll('#motionGallery video').forEach((v) => v.pause());
        } else {
            requestAnimationFrame(() => {
                if (featuredVideo) {
                    const r = featuredVideo.getBoundingClientRect();
                    if (r.bottom > 0 && r.top < window.innerHeight) {
                        featuredVideo.play().catch(() => {});
                    }
                }
                document.querySelectorAll('#motionGallery video').forEach((v) => {
                    if (v.getAttribute('data-src')) return;
                    const r = v.getBoundingClientRect();
                    if (r.bottom > 0 && r.top < window.innerHeight) {
                        v.play().catch(() => {});
                    }
                });
            });
        }
    });
}

function setupMotionOnPage() {
    if (!document.getElementById('motionGallery')) return;

    if (!document.getElementById('archivePanels') && document.getElementById('videoZoomModal')) {
        initVideoZoom();
    }

    if (document.getElementById('archivePanels')) {
        if (typeof registerArchivePanelBoot === 'function') {
            registerArchivePanelBoot('motion', bootMotion);
        }
        if (document.querySelector('.archive-panel[data-panel="motion"]')?.classList.contains('archive-panel--open')) {
            bootMotion();
        }
    } else {
        bootMotion();
        initMotionVisibilityHandler();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMotionOnPage);
} else {
    setupMotionOnPage();
}

let featuredVideo = null;

function initMotionFeatured() {
    const featuredContainer = document.getElementById('motionFeatured');
    if (!featuredContainer) return;
    
    featuredVideo = document.createElement('video');
    featuredVideo.setAttribute('data-src', 'RAFAELMEDIODIA_MOTIONREEL.mp4');
    const featuredSrc = 'RAFAELMEDIODIA_MOTIONREEL.mp4';
    featuredVideo.muted = true;
    featuredVideo.loop = true;
    featuredVideo.playsInline = true;
    featuredVideo.preload = 'metadata';
    featuredVideo.setAttribute('playsinline', '');
    featuredVideo.setAttribute('webkit-playsinline', '');
    featuredVideo.setAttribute('loop', '');
    featuredVideo.setAttribute('muted', '');
    featuredVideo.className = 'motion-featured-video';
    featuredContainer.dataset.videoSrc = featuredSrc;
    featuredContainer.dataset.tooltip = 'Rafael Mediodia Motion Reel 2026!';
    featuredContainer.setAttribute('aria-label', 'Motion Reel');

    const panelInner = featuredContainer.closest('.archive-panel-inner');
    const featuredObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                playLazyArchiveVideo(featuredVideo);
            } else {
                featuredVideo.pause();
            }
        });
    }, { root: panelInner || null, rootMargin: '0px', threshold: 0.1 });
    
    featuredContainer.appendChild(featuredVideo);
    featuredObserver.observe(featuredContainer);

    if (!motionArchiveTooltip) {
        motionArchiveTooltip = document.createElement('div');
        motionArchiveTooltip.className = 'project-tooltip';
        document.body.appendChild(motionArchiveTooltip);
    }

    const featuredCaption = document.createElement('div');
    featuredCaption.className = 'motion-featured-caption';
    featuredCaption.textContent = 'Rafael Mediodia Motion Reel 2026!';
    featuredContainer.insertAdjacentElement('afterend', featuredCaption);

    featuredContainer.addEventListener('click', () => {
        openVideoZoom(featuredSrc);
    });

    featuredContainer.addEventListener('mouseover', (e) => {
        motionArchiveTooltip.innerHTML = '<div class="project-tooltip-title">Rafael Mediodia Motion Reel 2026!</div>';
        motionArchiveTooltip.style.opacity = '1';
        motionArchiveTooltip.style.left = `${e.clientX + 5}px`;
        motionArchiveTooltip.style.top = `${e.clientY + 5}px`;
    });

    featuredContainer.addEventListener('mousemove', (e) => {
        if (motionArchiveTooltip.style.opacity !== '1') return;
        motionArchiveTooltip.style.left = `${e.clientX + 5}px`;
        motionArchiveTooltip.style.top = `${e.clientY + 5}px`;
    });

    featuredContainer.addEventListener('mouseleave', () => {
        motionArchiveTooltip.style.opacity = '0';
    });
}

function playLazyArchiveVideo(vid) {
    const panel = vid.closest('.archive-panel[data-panel="motion"]');
    if (panel && !panel.classList.contains('archive-panel--open')) return;

    const lazySrc = vid.getAttribute('data-src');
    if (lazySrc) {
        if (activeArchiveVideoLoads >= MAX_ARCHIVE_VIDEO_LOADS) return;
        activeArchiveVideoLoads += 1;
        vid.src = lazySrc;
        vid.removeAttribute('data-src');
        vid.preload = 'metadata';
        vid.load();
        vid.addEventListener('loadedmetadata', () => {
            const duration = vid.duration;
            if (duration > 3) {
                vid.currentTime = Math.random() * Math.max(0, duration - 3);
            }
            vid.play().catch(() => {});
        }, { once: true });
        vid.addEventListener('pause', () => {
            activeArchiveVideoLoads = Math.max(0, activeArchiveVideoLoads - 1);
        }, { once: true });
        return;
    }
    vid.play().catch(() => {});
}

function initMotionGallery() {
    const gallery = document.getElementById('motionGallery');
    if (!gallery || gallery.dataset.ready === 'true') return;
    gallery.dataset.ready = 'true';

    if (!motionArchiveTooltip) {
        motionArchiveTooltip = document.createElement('div');
        motionArchiveTooltip.className = 'project-tooltip';
        document.body.appendChild(motionArchiveTooltip);
    }

    const panelInner = gallery.closest('.archive-panel-inner');
    const observerRoot = panelInner || null;

    if (!motionGalleryObserver) {
        motionGalleryObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const vid = entry.target;
                if (entry.isIntersecting) {
                    playLazyArchiveVideo(vid);
                } else {
                    if (vid.src) {
                        activeArchiveVideoLoads = Math.max(0, activeArchiveVideoLoads - 1);
                    }
                    vid.pause();
                }
            });
        }, { root: observerRoot, rootMargin: '40px 0px', threshold: 0.2 });
    }

    const fragment = document.createDocumentFragment();

    motionVideos.forEach((videoData) => {
        const videoSrc = getMotionVideoSrc(videoData);
        const tooltipText = videoData.tooltip || 'More Motion';

        const videoContainer = document.createElement('div');
        videoContainer.className = 'motion-video-item';
        videoContainer.dataset.videoSrc = videoSrc;
        videoContainer.dataset.tooltip = tooltipText;

        const video = document.createElement('video');
        video.setAttribute('data-src', videoSrc);
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'none';
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');

        videoContainer.appendChild(video);
        fragment.appendChild(videoContainer);
        motionGalleryObserver.observe(video);
    });

    gallery.appendChild(fragment);

    gallery.addEventListener('mouseover', (e) => {
        const item = e.target.closest('.motion-video-item');
        if (!item || !gallery.contains(item)) return;
        motionArchiveTooltip.innerHTML = `<div class="project-tooltip-title">${item.dataset.tooltip}</div>`;
        motionArchiveTooltip.style.opacity = '1';
        motionArchiveTooltip.style.left = `${e.clientX + 5}px`;
        motionArchiveTooltip.style.top = `${e.clientY + 5}px`;
    });

    gallery.addEventListener('mousemove', (e) => {
        if (motionArchiveTooltip.style.opacity !== '1') return;
        motionArchiveTooltip.style.left = `${e.clientX + 5}px`;
        motionArchiveTooltip.style.top = `${e.clientY + 5}px`;
    });

    gallery.addEventListener('mouseleave', () => {
        motionArchiveTooltip.style.opacity = '0';
    });

    gallery.addEventListener('click', (e) => {
        const item = e.target.closest('.motion-video-item');
        if (item?.dataset.videoSrc) {
            openVideoZoom(item.dataset.videoSrc);
        }
    });
}

let currentVideoIndex = 0;
let videoZoomArray = [];

function initVideoZoom() {
    const modal = document.getElementById('videoZoomModal');
    const closeBtn = document.getElementById('videoZoomClose');
    const video = document.getElementById('zoomedVideo');
    if (!modal || !closeBtn || !video) return;
    
    const closeModal = () => {
        modal.style.display = 'none';
        modal.classList.remove('active');
        video.pause();
        video.currentTime = 0;
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
        modal.style.display = 'none';
        modal.classList.remove('active');
        video.pause();
        video.currentTime = 0;
        document.removeEventListener('keydown', handleVideoKeydown);
    }
}

function navigateVideo(direction) {
    if (videoZoomArray.length === 0) return;
    
    currentVideoIndex = (currentVideoIndex + direction + videoZoomArray.length) % videoZoomArray.length;
    const video = document.getElementById('zoomedVideo');
    const videoFile = getMotionVideoSrc(videoZoomArray[currentVideoIndex]);
    
    video.src = videoFile;
    video.load();
    video.addEventListener('loadedmetadata', () => {
        video.play();
    }, { once: true });
}

function openVideoZoom(videoSrc) {
    const modal = document.getElementById('videoZoomModal');
    const video = document.getElementById('zoomedVideo');
    
    videoZoomArray = motionVideos;
    currentVideoIndex = motionVideos.findIndex(v => getMotionVideoSrc(v) === videoSrc);
    
    if (currentVideoIndex === -1) {
        currentVideoIndex = 0;
    }
    
    video.src = videoSrc;
    video.load();
    modal.style.display = 'flex';
    modal.classList.add('active');
    
    document.addEventListener('keydown', handleVideoKeydown);
    
    video.addEventListener('loadedmetadata', () => {
        video.play();
    }, { once: true });
}


