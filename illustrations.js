const illustrations = [
    { file: 'sleepy.jpg', tooltip: 'Sleepy', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'achat.mp4', tooltip: 'A Chat', filters: ['moving', '2d'], format: 'Moving / 2D', media: 'video' },
    { file: 'brown-student-radio-news.jpg', tooltip: 'Brown Student Radio News', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'audreyhobert-animation.gif', tooltip: 'Audrey Hobert', filters: ['moving', '2d', 'lettering'], format: 'Moving / Lettering' },
    { file: 'frogs.jpg', tooltip: 'Frogs In The Bogs', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'rockplaydate.mp4', tooltip: 'Rock Playdate', filters: ['moving', '3d'], format: 'Moving / 3D', media: 'video' },
    { file: 'mockup.jpg', tooltip: 'Mockup Editorial', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'i-hope-spring-arrives.jpg', tooltip: 'I Hope Spring Arrives', filters: ['still', 'lettering'], format: 'Still / Lettering' },
    { file: 'Car3.png', tooltip: 'Bumpy Road', filters: ['still', '2d', '3d'], format: 'Still / 2D + 3D' },
    { file: 'boattowns.jpg', tooltip: 'Boat Towns', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'theyrefloatingaround.mp4', tooltip: "They're Floating Around", filters: ['moving', '2d'], format: 'Moving / 2D', media: 'video' },
    { file: 'Haronian_RafaelMediodia1.png', tooltip: 'Brown Political Review Illustration', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'bearlookingdown.png', tooltip: 'Cookie The Bear', filters: ['still', '3d'], format: 'Still / 3D' },
    { file: 'joyful_flight.jpg', tooltip: 'Joyful Flight', filters: ['still', '2d', 'lettering'], format: 'Still / Lettering' },
    { file: 'mountain_and_tree_and_car_friends.jpg', tooltip: 'Mountain Friends', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'beabadoobee-animationgif.gif', tooltip: 'Beabadoobee', filters: ['moving', '2d', 'lettering'], format: 'Moving / Lettering' },
    { file: 'sleepy_car.jpg', tooltip: 'Sleepy Car', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'um-hello.jpg', tooltip: 'Um... Hello', filters: ['still', '2d', 'lettering'], format: 'Still / Lettering' },
    { file: 'ThePitt_NoahWyle.png', tooltip: 'Noah Wyle in The Pitt', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'house_assets.jpg', tooltip: 'House Assets', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'mmms-on-my-mind.gif', tooltip: 'MMMs On My Mind', filters: ['moving', '2d', 'lettering'], format: 'Moving / 2D' },
    { file: 'looking-down.jpg', tooltip: 'Looking Down', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'bearlookingforward.png', tooltip: 'Cookie The Bear', filters: ['still', '3d'], format: 'Still / 3D' },
    { file: 'WaitingROom.png', tooltip: 'Waiting Room', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'lion_around.jpg', tooltip: 'Lion Around', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'hearts2hearts_animation.gif', tooltip: 'Hearts2Hearts', filters: ['moving', '2d', 'lettering'], format: 'Moving / Lettering' },
    { file: 'astronaut_forest jpg.jpg', tooltip: 'Space Park', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'robots-chat.jpg', tooltip: 'Robots Chat', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'Haronian_RafaelMediodia2.png', tooltip: 'Brown Political Review Spot Illustration', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'village_lad.jpg', tooltip: 'Village Lad', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'Self-Portrait.png', tooltip: 'Self Portrait', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'rock-and-snail.jpg', tooltip: 'Rock and Snail', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'beetle3.jpg', tooltip: 'Toy Dung Beetle', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'IMG_7604.PNG', tooltip: 'Tudu Fish', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'bearzoomin.png', tooltip: 'Cookie The Bear', filters: ['still', '3d'], format: 'Still / 3D' },
    { file: 'looking-inward.jpg', tooltip: 'Looking Inward', filters: ['still', '2d'], format: 'Still / 2D' }
];

const illustrationFilters = [
    { id: 'all', label: 'All' },
    { id: 'still', label: 'Still' },
    { id: 'moving', label: 'Moving' },
    { id: '2d', label: '2D' },
    { id: '3d', label: '3D' },
    { id: 'lettering', label: 'Lettering' },
];

let illustrationsInitialized = false;
let illustrationsImageObserver = null;
let illustrationsArchiveTooltip = null;
const illustrationLoadQueue = [];
let illustrationLoadsActive = 0;
const MAX_ILLUSTRATION_LOADS = 2;

function scheduleIllustrationWork(fn) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(fn, { timeout: 250 });
    } else {
        setTimeout(fn, 16);
    }
}

function drainIllustrationLoadQueue() {
    while (illustrationLoadsActive < MAX_ILLUSTRATION_LOADS && illustrationLoadQueue.length) {
        const media = illustrationLoadQueue.shift();
        const lazySrc = media.getAttribute('data-src');
        if (!lazySrc) continue;
        illustrationLoadsActive += 1;
        const done = () => {
            illustrationLoadsActive = Math.max(0, illustrationLoadsActive - 1);
            drainIllustrationLoadQueue();
        };
        const isVideo = media.tagName === 'VIDEO';
        media.addEventListener(isVideo ? 'loadedmetadata' : 'load', done, { once: true });
        media.addEventListener('error', done, { once: true });
        media.src = lazySrc;
        media.removeAttribute('data-src');
        if (isVideo) {
            media.load();
            media.play().catch(() => {});
        } else {
            illustrationsImageObserver?.unobserve(media);
        }
    }
}
let currentImageIndex = 0;
let imageZoomArray = [];
let imageZoomBound = false;

function bootIllustrations() {
    if (illustrationsInitialized || !document.getElementById('illustrationsGallery')) return;
    illustrationsInitialized = true;
    scheduleIllustrationWork(() => {
        if (document.getElementById('imageZoomModal')) {
            initImageZoom();
        }
        initIllustrationsGallery();
    });
}

function setupIllustrationsOnPage() {
    if (!document.getElementById('illustrationsGallery')) return;

    if (!document.getElementById('archivePanels') && document.getElementById('imageZoomModal')) {
        initImageZoom();
    }

    if (document.getElementById('archivePanels')) {
        if (typeof registerArchivePanelBoot === 'function') {
            registerArchivePanelBoot('illustrations', bootIllustrations);
        }
        if (document.querySelector('.archive-panel[data-panel="illustrations"]')?.classList.contains('archive-panel--open')) {
            bootIllustrations();
        }
    } else {
        bootIllustrations();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupIllustrationsOnPage);
} else {
    setupIllustrationsOnPage();
}

function initIllustrationsGallery() {
    const gallery = document.getElementById('illustrationsGallery');
    if (!gallery || gallery.dataset.ready === 'true') return;
    gallery.dataset.ready = 'true';
    const illustrationsBase = gallery.dataset.base || 'Illustrations';

    const panelInner = gallery.closest('.archive-panel-inner');
    const useFloatingTooltip = !!panelInner;

    if (useFloatingTooltip && !illustrationsArchiveTooltip) {
        illustrationsArchiveTooltip = document.createElement('div');
        illustrationsArchiveTooltip.className = 'project-tooltip';
        document.body.appendChild(illustrationsArchiveTooltip);
    }

    if (!illustrationsImageObserver) {
        illustrationsImageObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting && entry.target.tagName === 'VIDEO') {
                    entry.target.pause();
                    return;
                }
                if (!entry.isIntersecting) return;
                const media = entry.target;
                if (media.getAttribute('data-src')) {
                    illustrationLoadQueue.push(media);
                    return;
                }
                if (media.tagName === 'VIDEO') {
                    media.play().catch(() => {});
                }
            });
            drainIllustrationLoadQueue();
        }, { root: panelInner || null, rootMargin: '60px 0px', threshold: 0.05 });
    }

    const fragment = document.createDocumentFragment();
    initIllustrationFilters(gallery);

    illustrations.forEach((imageData) => {
        const imageFile = imageData.file;
        const src = `${illustrationsBase}/${imageFile}`;
        const isVideo = imageData.media === 'video';
        const filters = imageData.filters || ['still'];

        const imageContainer = document.createElement('div');
        imageContainer.className = 'illustration-item';
        imageContainer.dataset.mediaSrc = src;
        imageContainer.dataset.mediaType = isVideo ? 'video' : 'image';
        imageContainer.dataset.tooltip = imageData.tooltip || 'Illustration';
        imageContainer.dataset.filters = filters.join(' ');

        let mediaEl;
        if (isVideo) {
            mediaEl = document.createElement('video');
            mediaEl.setAttribute('data-src', src);
            mediaEl.muted = true;
            mediaEl.loop = true;
            mediaEl.playsInline = true;
            mediaEl.autoplay = false;
            mediaEl.preload = 'metadata';
            mediaEl.setAttribute('aria-label', imageContainer.dataset.tooltip);
        } else {
            mediaEl = document.createElement('img');
            mediaEl.setAttribute('data-src', src);
            mediaEl.alt = imageContainer.dataset.tooltip;
            mediaEl.loading = 'lazy';
            mediaEl.decoding = 'async';
        }

        const caption = document.createElement('div');
        caption.className = 'illustration-item-caption';
        caption.innerHTML = `
            <span class="illustration-item-title">${imageContainer.dataset.tooltip}</span>
            <span class="illustration-item-meta">${imageData.format || 'Illustration'}</span>
        `;

        imageContainer.append(mediaEl, caption);
        fragment.appendChild(imageContainer);
        illustrationsImageObserver.observe(mediaEl);
    });

    gallery.appendChild(fragment);

    if (useFloatingTooltip) {
        gallery.addEventListener('mouseover', (e) => {
            const item = e.target.closest('.illustration-item');
            if (!item || !gallery.contains(item)) return;
            illustrationsArchiveTooltip.innerHTML = `<div class="project-tooltip-title">${item.dataset.tooltip}</div>`;
            illustrationsArchiveTooltip.style.opacity = '1';
            illustrationsArchiveTooltip.style.left = `${e.clientX + 5}px`;
            illustrationsArchiveTooltip.style.top = `${e.clientY + 5}px`;
        });

        gallery.addEventListener('mousemove', (e) => {
            if (illustrationsArchiveTooltip.style.opacity !== '1') return;
            illustrationsArchiveTooltip.style.left = `${e.clientX + 5}px`;
            illustrationsArchiveTooltip.style.top = `${e.clientY + 5}px`;
        });

        gallery.addEventListener('mouseleave', () => {
            illustrationsArchiveTooltip.style.opacity = '0';
        });
    }

    gallery.addEventListener('click', (e) => {
        const item = e.target.closest('.illustration-item');
        if (item?.dataset.mediaSrc) {
            openImageZoom(item.dataset.mediaSrc, item.dataset.mediaType);
        }
    });
}

function initIllustrationFilters(gallery) {
    const nav = document.getElementById('illustrationFilterNav');
    const reshuffleBtn = document.getElementById('illustrationReshuffleBtn');
    if (!nav || nav.dataset.ready === 'true') return;
    nav.dataset.ready = 'true';

    illustrationFilters.forEach((filter, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'illustration-filter-btn';
        if (index === 0) button.classList.add('illustration-filter-btn--active');
        button.dataset.filter = filter.id;
        button.textContent = filter.label;
        button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
        nav.appendChild(button);
    });

    nav.addEventListener('click', (e) => {
        const button = e.target.closest('.illustration-filter-btn');
        if (!button || !nav.contains(button)) return;
        const filter = button.dataset.filter;

        nav.querySelectorAll('.illustration-filter-btn').forEach((btn) => {
            const active = btn === button;
            btn.classList.toggle('illustration-filter-btn--active', active);
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        applyIllustrationFilter(gallery, filter);
    });

    reshuffleBtn?.addEventListener('click', () => {
        const items = Array.from(gallery.querySelectorAll('.illustration-item'));
        for (let i = items.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        items.forEach((item) => gallery.appendChild(item));
        const activeFilter = nav.querySelector('.illustration-filter-btn--active')?.dataset.filter || 'all';
        applyIllustrationFilter(gallery, activeFilter);
    });
}

function applyIllustrationFilter(gallery, filter) {
    if (filter === 'all') {
        delete gallery.dataset.activeFilter;
    } else {
        gallery.dataset.activeFilter = filter;
    }

    gallery.querySelectorAll('.illustration-item').forEach((item) => {
        const itemFilters = (item.dataset.filters || '').split(' ');
        const show = filter === 'all' || itemFilters.includes(filter);
        item.hidden = !show;
    });
}

function initImageZoom() {
    if (imageZoomBound) return;
    const modal = document.getElementById('imageZoomModal');
    const closeBtn = document.getElementById('imageZoomClose');
    const img = document.getElementById('zoomedImage');
    const video = document.getElementById('zoomedIllustrationVideo');
    if (!modal || !closeBtn || !img || !video) return;
    imageZoomBound = true;

    const closeModal = () => {
        video.pause();
        video.removeAttribute('src');
        video.load();
        img.removeAttribute('src');
        modal.style.display = 'none';
        modal.classList.remove('active');
        document.body.style.overflow = '';
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
        const img = document.getElementById('zoomedImage');
        const video = document.getElementById('zoomedIllustrationVideo');
        if (modal) {
            video?.pause();
            video?.removeAttribute('src');
            video?.load();
            img?.removeAttribute('src');
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
    const gallery = document.getElementById('illustrationsGallery');
    const illustrationsBase = gallery?.dataset.base || 'Illustrations';
    const media = imageZoomArray[currentImageIndex];
    openImageZoom(`${illustrationsBase}/${media.file}`, media.media === 'video' ? 'video' : 'image');
}

function openImageZoom(imageSrc, mediaType = 'image') {
    const modal = document.getElementById('imageZoomModal');
    const img = document.getElementById('zoomedImage');
    const video = document.getElementById('zoomedIllustrationVideo');
    if (!modal || !img || !video) return;

    imageZoomArray = illustrations;
    const imageFile = imageSrc.split('/').pop();
    currentImageIndex = illustrations.findIndex((i) => i.file === imageFile);
    if (currentImageIndex === -1) currentImageIndex = 0;

    const isVideo = mediaType === 'video' || illustrations[currentImageIndex]?.media === 'video';
    if (isVideo) {
        img.hidden = true;
        img.removeAttribute('src');
        video.hidden = false;
        video.src = imageSrc;
        video.load();
        video.play().catch(() => {});
    } else {
        video.pause();
        video.hidden = true;
        video.removeAttribute('src');
        video.load();
        img.hidden = false;
        img.src = imageSrc;
    }
    document.body.style.overflow = 'hidden';
    modal.style.display = 'flex';
    modal.classList.add('active');
    document.addEventListener('keydown', handleImageKeydown);
}
