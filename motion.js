const motionPosters = {
    'RAFAELMEDIODIA_MOTIONREEL.mp4': 'motion-posters/RAFAELMEDIODIA_MOTIONREEL.jpg',
    'AmericanDream/American Dream Series Part 0.mp4': 'motion-posters/American-Dream-Series-Part-0.jpg',
    'BounceMuseum/BounceThumbnail.mp4': 'motion-posters/BounceThumbnail.jpg',
    'BounceMuseum/bouncethumbnail2.mp4': 'motion-posters/bouncethumbnail2.jpg',
    'superstitionsuperstitionsuperstition/Mini Clips.mp4': 'motion-posters/Mini-Clips.jpg',
    'superstitionsuperstitionsuperstition/MiniClip2.mp4': 'motion-posters/MiniClip2.jpg',
    'superstitionsuperstitionsuperstition/preview3.mp4': 'motion-posters/preview3.jpg',
    'MYCELIUM_TITLECARD.mp4': 'motion-posters/MYCELIUM_TITLECARD.jpg',
    'CHASINGSUNSETS.mp4': 'motion-posters/CHASINGSUNSETS.jpg',
    'Motion/cutitout.mp4': 'motion-posters/cutitout.jpg',
    'Motion/Bubbles (2).mp4': 'motion-posters/Bubbles-2.jpg',
    'Motion/LOGO1-FULL.mp4': 'motion-posters/LOGO1-FULL.jpg',
    'Motion/RAFAELMEDIODIA_ASSIGNMENT4_COLORLIGHTSHADOW.mp4': 'motion-posters/RAFAELMEDIODIA_ASSIGNMENT4_COLORLIGHTSHADOW.jpg',
    'Motion/Whats at the core.mp4': 'motion-posters/Whats-at-the-core.jpg',
    'Motion/StudioRafael.mp4': 'motion-posters/StudioRafael.jpg',
    'Motion/LOGO2-FULL.mp4': 'motion-posters/LOGO2-FULL.jpg',
    'Motion/girldinneranimation2-gs-color-addedtext.mp4': 'motion-posters/girldinneranimation2-gs-color-addedtext.jpg',
    'Motion/Chemistry.mp4': 'motion-posters/Chemistry.jpg',
    'Motion/2nd Ad.mp4': 'motion-posters/2nd-Ad.jpg',
    'Motion/MagicalMischief.mp4': 'motion-posters/MagicalMischief.jpg',
    'Motion/RAFAELMEDIODIA_FORMINMOTION.mp4': 'motion-posters/RAFAELMEDIODIA_FORMINMOTION.jpg',
    'Motion/Comp 3.mp4': 'motion-posters/Comp-3.jpg',
    'Motion/EXPIRATIONDATE-POST-GREEN.mp4': 'motion-posters/EXPIRATIONDATE-POST-GREEN.jpg',
    'Motion/Comp 2.mp4': 'motion-posters/Comp-2.jpg',
    'Motion/DingDongProductions.mp4': 'motion-posters/DingDongProductions.jpg',
    'Motion/newstar!studio.mp4': 'motion-posters/newstar-studio.jpg',
};

const motionVideos = [
    { src: 'MYCELIUM_TITLECARD.mp4', file: 'MYCELIUM_TITLECARD.mp4', tooltip: 'Mycelium Title Card', tooltipSubtitle: 'Film title for MYCELIUM, by Veronica Egas.' },
    { src: 'CHASINGSUNSETS.mp4', file: 'CHASINGSUNSETS.mp4', tooltip: 'Chasing Sunsets', tooltipSubtitle: 'Film title card for Chasing Sunsets, by Veronica Egas.' },
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
    if (typeof videoData === 'object' && videoData.src) return videoData.src;
    const file = getMotionVideoFile(videoData);
    return file.includes('/') ? file : `Motion/${file}`;
}

function getMotionPoster(src) {
    if (!src) return null;
    return motionPosters[src.split('#')[0]] || null;
}

function prefersHoverPreview() {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

let motionInitialized = false;
let motionArchiveTooltip = null;
let activeArchiveVideoLoads = 0;
const archiveVideoLoadQueue = [];
const MAX_ARCHIVE_VIDEO_LOADS = 1;

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
        initMotionFeatured();
        initMotionGallery();
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
                    if (r.bottom > 0 && r.top < window.innerHeight && !featuredVideo.getAttribute('data-src')) {
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
    initArchiveJumpNavActiveState();
    initMotionArchivePreviewVideos();

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

function initArchiveJumpNavActiveState() {
    const nav = document.querySelector('.archive-jump-nav');
    if (!nav || nav.dataset.ready === 'true') return;
    nav.dataset.ready = 'true';

    const links = Array.from(nav.querySelectorAll('.archive-jump-link[href^="#"]'));
    if (!links.length) return;

    const setActive = (activeLink) => {
        links.forEach((link) => {
            const active = link === activeLink;
            link.classList.toggle('archive-jump-link--active', active);
            link.setAttribute('aria-current', active ? 'true' : 'false');
        });
    };

    const hashLink = links.find((link) => link.hash && link.hash === window.location.hash);
    setActive(hashLink || links[0]);

    nav.addEventListener('click', (e) => {
        const link = e.target.closest('.archive-jump-link[href^="#"]');
        if (!link || !nav.contains(link)) return;
        setActive(link);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMotionOnPage);
} else {
    setupMotionOnPage();
}

let featuredVideo = null;

function bindArchivePreviewInteraction(video, options = {}) {
    const { heavy = false } = options;
    const host = video.closest('a, .motion-featured, .motion-video-item') || video;

    if (prefersHoverPreview()) {
        const start = () => playLazyArchiveVideo(video, { randomStart: false });
        host.addEventListener('pointerenter', start, { once: true });
        return;
    }

    // Touch: keep heavy masters as posters; only stream lighter clips near viewport.
    if (heavy || video.dataset.heavy === 'true') {
        return;
    }

    if (!('IntersectionObserver' in window)) {
        playLazyArchiveVideo(video, { randomStart: false });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                playLazyArchiveVideo(video, { randomStart: false });
            } else {
                video.pause();
            }
        });
    }, { rootMargin: '40px 0px', threshold: 0.15 });

    observer.observe(video);
}

function initMotionArchivePreviewVideos() {
    const videos = document.querySelectorAll('.motion-archive-project-media video[data-src]');
    if (!videos.length) return;

    videos.forEach((video) => {
        const src = video.getAttribute('data-src') || '';
        const poster = getMotionPoster(src);
        if (poster && !video.getAttribute('poster')) {
            video.setAttribute('poster', poster);
        }
        bindArchivePreviewInteraction(video, {
            heavy: video.dataset.heavy === 'true' || src.includes('American Dream'),
        });
    });
}

function initMotionFeatured() {
    const featuredContainer = document.getElementById('motionFeatured');
    if (!featuredContainer) return;

    const featuredSrc = 'RAFAELMEDIODIA_MOTIONREEL.mp4';
    const featuredPoster = getMotionPoster(featuredSrc);

    featuredVideo = document.createElement('video');
    featuredVideo.setAttribute('data-src', featuredSrc);
    if (featuredPoster) featuredVideo.setAttribute('poster', featuredPoster);
    featuredVideo.muted = true;
    featuredVideo.loop = true;
    featuredVideo.playsInline = true;
    featuredVideo.preload = 'none';
    featuredVideo.setAttribute('playsinline', '');
    featuredVideo.setAttribute('webkit-playsinline', '');
    featuredVideo.setAttribute('loop', '');
    featuredVideo.setAttribute('muted', '');
    featuredVideo.dataset.heavy = 'true';
    featuredVideo.className = 'motion-featured-video';
    featuredContainer.dataset.videoSrc = featuredSrc;
    featuredContainer.dataset.tooltip = 'Rafael Mediodia Motion Reel 2026!';
    featuredContainer.setAttribute('aria-label', 'Motion Reel');
    featuredContainer.setAttribute('role', 'button');
    featuredContainer.tabIndex = 0;

    featuredContainer.appendChild(featuredVideo);
    bindArchivePreviewInteraction(featuredVideo, { heavy: true });

    if (!motionArchiveTooltip) {
        motionArchiveTooltip = document.createElement('div');
        motionArchiveTooltip.className = 'project-tooltip';
        document.body.appendChild(motionArchiveTooltip);
    }

    if (!featuredContainer.closest('.motion-archive-card')) {
        const featuredCaption = document.createElement('div');
        featuredCaption.className = 'motion-featured-caption';
        featuredCaption.textContent = 'Rafael Mediodia Motion Reel 2026!';
        featuredContainer.insertAdjacentElement('afterend', featuredCaption);
    }

    featuredContainer.addEventListener('click', () => {
        openVideoZoom(featuredSrc);
    });

    featuredContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openVideoZoom(featuredSrc);
        }
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

function queueArchiveVideoLoad(vid, options) {
    if (vid.dataset.loadQueued === 'true') return;
    vid.dataset.loadQueued = 'true';
    archiveVideoLoadQueue.push({ vid, options });
    drainArchiveVideoLoadQueue();
}

function drainArchiveVideoLoadQueue() {
    while (activeArchiveVideoLoads < MAX_ARCHIVE_VIDEO_LOADS && archiveVideoLoadQueue.length) {
        const { vid, options } = archiveVideoLoadQueue.shift();
        delete vid.dataset.loadQueued;
        loadLazyArchiveVideo(vid, options);
    }
}

function loadLazyArchiveVideo(vid, options = {}) {
    const { prioritize = false, randomStart = true } = options;
    const lazySrc = vid.getAttribute('data-src');
    if (!lazySrc) {
        vid.play().catch(() => {});
        return;
    }

    if (vid.dataset.loading === 'true') return;
    vid.dataset.loading = 'true';
    activeArchiveVideoLoads += 1;
    let settled = false;
    const done = () => {
        if (settled) return;
        settled = true;
        delete vid.dataset.loading;
        activeArchiveVideoLoads = Math.max(0, activeArchiveVideoLoads - 1);
        drainArchiveVideoLoadQueue();
    };

    vid.src = lazySrc;
    vid.removeAttribute('data-src');
    vid.preload = prioritize ? 'auto' : 'metadata';
    vid.load();
    vid.addEventListener('loadedmetadata', () => {
        const duration = vid.duration;
        if (randomStart && duration > 3) {
            vid.currentTime = Math.random() * Math.max(0, duration - 3);
        }
        vid.play().catch(() => {});
        done();
    }, { once: true });
    vid.addEventListener('error', done, { once: true });
}

function playLazyArchiveVideo(vid, options = {}) {
    const { prioritize = false } = options;
    const panel = vid.closest('.archive-panel[data-panel="motion"]');
    if (panel && !panel.classList.contains('archive-panel--open')) return;

    const lazySrc = vid.getAttribute('data-src');
    if (lazySrc) {
        if (!prioritize && activeArchiveVideoLoads >= MAX_ARCHIVE_VIDEO_LOADS) {
            queueArchiveVideoLoad(vid, options);
            return;
        }
        loadLazyArchiveVideo(vid, options);
        return;
    }
    vid.play().catch(() => {});
}

function renderMotionTooltip(item) {
    const title = item.dataset.tooltip || 'More Motion';
    const subtitle = item.dataset.tooltipSubtitle || '';
    if (subtitle) {
        motionArchiveTooltip.classList.add('project-tooltip--multiline');
        motionArchiveTooltip.innerHTML = `<div class="project-tooltip-title">${title}</div><div class="project-tooltip-subtitle">${subtitle}</div>`;
    } else {
        motionArchiveTooltip.classList.remove('project-tooltip--multiline');
        motionArchiveTooltip.innerHTML = `<div class="project-tooltip-title">${title}</div>`;
    }
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

    const fragment = document.createDocumentFragment();

    motionVideos.forEach((videoData) => {
        const videoSrc = getMotionVideoSrc(videoData);
        const tooltipText = videoData.tooltip || 'More Motion';
        const poster = getMotionPoster(videoSrc);

        const videoContainer = document.createElement('div');
        videoContainer.className = 'motion-video-item';
        videoContainer.dataset.videoSrc = videoSrc;
        videoContainer.dataset.tooltip = tooltipText;
        videoContainer.setAttribute('role', 'button');
        videoContainer.setAttribute('aria-label', `Open ${tooltipText}`);
        videoContainer.tabIndex = 0;
        if (videoData.tooltipSubtitle) {
            videoContainer.dataset.tooltipSubtitle = videoData.tooltipSubtitle;
        }

        const video = document.createElement('video');
        video.setAttribute('data-src', videoSrc);
        if (poster) video.setAttribute('poster', poster);
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'none';
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');

        videoContainer.appendChild(video);
        fragment.appendChild(videoContainer);
        bindArchivePreviewInteraction(video, { heavy: true });
    });

    gallery.appendChild(fragment);

    gallery.addEventListener('mouseover', (e) => {
        const item = e.target.closest('.motion-video-item');
        if (!item || !gallery.contains(item)) return;
        renderMotionTooltip(item);
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

    gallery.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const item = e.target.closest('.motion-video-item');
        if (!item?.dataset.videoSrc) return;
        e.preventDefault();
        openVideoZoom(item.dataset.videoSrc);
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
