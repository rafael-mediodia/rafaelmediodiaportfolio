const illustrations = [
    { file: 'Lelo and Pebs.jpg', thumb: 'thumbs/Lelo-and-Pebs.jpg', w: 3000, h: 2400, tooltip: 'Lelo and Pebs', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'Two_Peas_in_a_Pod.jpg', thumb: 'thumbs/Two_Peas_in_a_Pod.jpg', w: 2400, h: 3000, tooltip: 'Two Peas in a Pod', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'hole_in_the_wall.jpg', thumb: 'thumbs/hole_in_the_wall.jpg', w: 2400, h: 3000, tooltip: 'Hole in the Wall', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'sleepy.jpg', thumb: 'thumbs/sleepy.jpg', w: 2388, h: 1668, tooltip: 'Sleepy', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'achat.mp4', thumb: 'thumbs/achat.jpg', w: 960, h: 540, tooltip: 'A Chat', filters: ['moving', '2d'], format: 'Moving / 2D', media: 'video' },
    { file: 'brown-student-radio-news.jpg', thumb: 'thumbs/brown-student-radio-news.jpg', w: 2400, h: 3000, tooltip: 'Brown Student Radio News', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'audreyhobert-animation.gif', thumb: 'thumbs/audreyhobert-animation.jpg', w: 2388, h: 1668, tooltip: 'Audrey Hobert', filters: ['moving', '2d', 'lettering'], format: 'Moving / Lettering' },
    { file: 'frogs.jpg', thumb: 'thumbs/frogs.jpg', w: 2100, h: 1500, tooltip: 'Frogs In The Bogs', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'rockplaydate.mp4', thumb: 'thumbs/rockplaydate.jpg', w: 960, h: 767, tooltip: 'Rock Playdate', filters: ['moving', '3d'], format: 'Moving / 3D', media: 'video' },
    { file: 'mockup.jpg', thumb: 'thumbs/mockup.jpg', w: 1800, h: 1500, tooltip: 'Mockup Editorial', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'i-hope-spring-arrives.jpg', thumb: 'thumbs/i-hope-spring-arrives.jpg', w: 2400, h: 3000, tooltip: 'I Hope Spring Arrives', filters: ['still', 'lettering'], format: 'Still / Lettering' },
    { file: 'Car3.png', thumb: 'thumbs/Car3.jpg', w: 2700, h: 2160, tooltip: 'Bumpy Road', filters: ['still', '2d', '3d'], format: 'Still / 2D + 3D' },
    { file: 'boattowns.jpg', thumb: 'thumbs/boattowns.jpg', w: 2388, h: 1668, tooltip: 'Boat Towns', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'theyrefloatingaround.mp4', thumb: 'thumbs/theyrefloatingaround.jpg', w: 960, h: 540, tooltip: "They're Floating Around", filters: ['moving', '2d'], format: 'Moving / 2D', media: 'video' },
    { file: 'Haronian_RafaelMediodia1.png', thumb: 'thumbs/Haronian_RafaelMediodia1.jpg', w: 2550, h: 3300, tooltip: 'Brown Political Review Illustration', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'bearlookingdown.png', thumb: 'thumbs/bearlookingdown.jpg', w: 1350, h: 1080, tooltip: 'Cookie The Bear', filters: ['still', '3d'], format: 'Still / 3D' },
    { file: 'joyful_flight.jpg', thumb: 'thumbs/joyful_flight.jpg', w: 2400, h: 3000, tooltip: 'Joyful Flight', filters: ['still', '2d', 'lettering'], format: 'Still / Lettering' },
    { file: 'mountain_and_tree_and_car_friends.jpg', thumb: 'thumbs/mountain_and_tree_and_car_friends.jpg', w: 4800, h: 6000, tooltip: 'Mountain Friends', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'beabadoobee-animationgif.gif', thumb: 'thumbs/beabadoobee-animationgif.jpg', w: 2041, h: 631, tooltip: 'Beabadoobee', filters: ['moving', '2d', 'lettering'], format: 'Moving / Lettering' },
    { file: 'sleepy_car.jpg', thumb: 'thumbs/sleepy_car.jpg', w: 2388, h: 1668, tooltip: 'Sleepy Car', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'um-hello.jpg', thumb: 'thumbs/um-hello.jpg', w: 1668, h: 2388, tooltip: 'Um... Hello', filters: ['still', '2d', 'lettering'], format: 'Still / Lettering' },
    { file: 'ThePitt_NoahWyle.png', thumb: 'thumbs/ThePitt_NoahWyle.jpg', w: 3000, h: 2400, tooltip: 'Noah Wyle in The Pitt', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'house_assets.jpg', thumb: 'thumbs/house_assets.jpg', w: 4868, h: 1714, tooltip: 'House Assets', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'mmms-on-my-mind.gif', thumb: 'thumbs/mmms-on-my-mind.jpg', w: 2400, h: 3000, tooltip: 'MMMs On My Mind', filters: ['moving', '2d', 'lettering'], format: 'Moving / 2D' },
    { file: 'looking-down.jpg', thumb: 'thumbs/looking-down.jpg', w: 2400, h: 3000, tooltip: 'Looking Down', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'bearlookingforward.png', thumb: 'thumbs/bearlookingforward.jpg', w: 1350, h: 1080, tooltip: 'Cookie The Bear', filters: ['still', '3d'], format: 'Still / 3D' },
    { file: 'WaitingROom.png', thumb: 'thumbs/WaitingROom.jpg', w: 1452, h: 1122, tooltip: 'Waiting Room', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'lion_around.jpg', thumb: 'thumbs/lion_around.jpg', w: 2388, h: 1668, tooltip: 'Lion Around', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'hearts2hearts_animation.gif', thumb: 'thumbs/hearts2hearts_animation.jpg', w: 2408, h: 767, tooltip: 'Hearts2Hearts', filters: ['moving', '2d', 'lettering'], format: 'Moving / Lettering' },
    { file: 'astronaut_forest jpg.jpg', thumb: 'thumbs/astronaut_forest-jpg.jpg', w: 4800, h: 6000, tooltip: 'Space Park', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'robots-chat.jpg', thumb: 'thumbs/robots-chat.jpg', w: 2400, h: 3000, tooltip: 'Robots Chat', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'Haronian_RafaelMediodia2.png', thumb: 'thumbs/Haronian_RafaelMediodia2.jpg', w: 1500, h: 600, tooltip: 'Brown Political Review Spot Illustration', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'village_lad.jpg', thumb: 'thumbs/village_lad.jpg', w: 2388, h: 1668, tooltip: 'Village Lad', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'Self-Portrait.png', thumb: 'thumbs/Self-Portrait.jpg', w: 2100, h: 1500, tooltip: 'Self Portrait', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'rock-and-snail.jpg', thumb: 'thumbs/rock-and-snail.jpg', w: 2388, h: 1668, tooltip: 'Rock and Snail', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'beetle3.jpg', thumb: 'thumbs/beetle3.jpg', w: 2100, h: 2100, tooltip: 'Toy Dung Beetle', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'IMG_7604.PNG', thumb: 'thumbs/IMG_7604.jpg', w: 3300, h: 5100, tooltip: 'Tudu Fish', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'bearzoomin.png', thumb: 'thumbs/bearzoomin.jpg', w: 1350, h: 1080, tooltip: 'Cookie The Bear', filters: ['still', '3d'], format: 'Still / 3D' },
    { file: 'looking-inward.jpg', thumb: 'thumbs/looking-inward.jpg', w: 2400, h: 3000, tooltip: 'Looking Inward', filters: ['still', '2d'], format: 'Still / 2D' }
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
const MAX_ILLUSTRATION_LOADS = 6;

let currentImageIndex = 0;
let imageZoomArray = [];
let imageZoomBound = false;

function scheduleIllustrationWork(fn) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(fn, { timeout: 250 });
    } else {
        setTimeout(fn, 16);
    }
}

function encodeIllustrationPath(base, relativePath) {
    return relativePath
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .reduce((path, segment) => `${path}/${segment}`, base.replace(/\/$/, ''));
}

function getVisibleIllustrations(gallery) {
    const filter = gallery?.dataset.activeFilter || 'all';
    if (filter === 'all') return illustrations.slice();
    return illustrations.filter((item) => (item.filters || []).includes(filter));
}

function updateIllustrationCount(gallery) {
    const countEl = document.getElementById('illustrationCount');
    if (!countEl || !gallery) return;
    const visible = gallery.querySelectorAll('.illustration-item:not([hidden])').length;
    const total = illustrations.length;
    countEl.textContent = visible === total
        ? `${total} works`
        : `${visible} of ${total}`;
}

function drainIllustrationLoadQueue() {
    while (illustrationLoadsActive < MAX_ILLUSTRATION_LOADS && illustrationLoadQueue.length) {
        const media = illustrationLoadQueue.shift();
        const lazySrc = media.getAttribute('data-src');
        if (!lazySrc || media.dataset.loadState === 'loading' || media.dataset.loadState === 'loaded') {
            continue;
        }

        media.dataset.loadState = 'loading';
        illustrationLoadsActive += 1;

        let settled = false;
        const finish = (ok) => {
            if (settled) return;
            settled = true;
            media.dataset.loadState = ok ? 'loaded' : 'error';
            if (ok) media.closest('.illustration-item')?.classList.add('is-loaded');
            illustrationLoadsActive = Math.max(0, illustrationLoadsActive - 1);
            illustrationsImageObserver?.unobserve(media);
            drainIllustrationLoadQueue();
        };

        media.addEventListener('load', () => finish(true), { once: true });
        media.addEventListener('error', () => finish(false), { once: true });

        media.src = lazySrc;
        media.removeAttribute('data-src');

        if (media.complete && media.naturalWidth > 0) {
            finish(true);
        }
    }
}

function queueIllustrationMedia(media) {
    if (!media?.getAttribute('data-src')) return;
    if (media.dataset.loadQueued === 'true') return;
    media.dataset.loadQueued = 'true';
    illustrationLoadQueue.push(media);
    drainIllustrationLoadQueue();
}

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
    const isPageGallery = gallery.classList.contains('illustrations-gallery--page');

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
                if (!entry.isIntersecting) return;
                queueIllustrationMedia(entry.target);
            });
            drainIllustrationLoadQueue();
        }, { root: panelInner || null, rootMargin: '200px 0px', threshold: 0.01 });
    }

    const fragment = document.createDocumentFragment();
    initIllustrationFilters(gallery);

    illustrations.forEach((imageData, index) => {
        const fullSrc = encodeIllustrationPath(illustrationsBase, imageData.file);
        const thumbSrc = encodeIllustrationPath(illustrationsBase, imageData.thumb || imageData.file);
        const isVideo = imageData.media === 'video';
        const isMoving = (imageData.filters || []).includes('moving');
        const filters = imageData.filters || ['still'];
        const title = imageData.tooltip || 'Illustration';

        const imageContainer = document.createElement('button');
        imageContainer.type = 'button';
        imageContainer.className = 'illustration-item';
        imageContainer.dataset.mediaSrc = fullSrc;
        imageContainer.dataset.mediaType = isVideo ? 'video' : 'image';
        imageContainer.dataset.tooltip = title;
        imageContainer.dataset.format = imageData.format || 'Illustration';
        imageContainer.dataset.filters = filters.join(' ');
        imageContainer.dataset.index = String(index);
        imageContainer.setAttribute('aria-label', `View ${title}`);

        const mediaEl = document.createElement('img');
        mediaEl.setAttribute('data-src', thumbSrc);
        mediaEl.alt = title;
        mediaEl.width = imageData.w || 4;
        mediaEl.height = imageData.h || 3;
        mediaEl.decoding = 'async';
        mediaEl.draggable = false;

        const caption = document.createElement('div');
        caption.className = 'illustration-item-caption';
        caption.innerHTML = `
            <span class="illustration-item-title">${title}</span>
            <span class="illustration-item-meta">${imageData.format || 'Illustration'}</span>
        `;

        imageContainer.append(mediaEl, caption);

        if (isMoving) {
            const badge = document.createElement('span');
            badge.className = 'illustration-item-badge';
            badge.textContent = isVideo ? 'Video' : 'Motion';
            imageContainer.appendChild(badge);
        }

        fragment.appendChild(imageContainer);
        illustrationsImageObserver.observe(mediaEl);
    });

    gallery.appendChild(fragment);
    updateIllustrationCount(gallery);

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

    if (isPageGallery) {
        // Prefetch first screen of thumbs immediately
        gallery.querySelectorAll('.illustration-item img[data-src]').forEach((img, i) => {
            if (i < 8) queueIllustrationMedia(img);
        });
    }
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
        if (show) {
            const media = item.querySelector('img[data-src]');
            if (media) queueIllustrationMedia(media);
        }
    });

    updateIllustrationCount(gallery);
}

function closeImageZoom() {
    const modal = document.getElementById('imageZoomModal');
    const img = document.getElementById('zoomedImage');
    const video = document.getElementById('zoomedIllustrationVideo');
    if (!modal) return;

    video?.pause();
    video?.removeAttribute('src');
    video?.load();
    img?.removeAttribute('src');
    modal.style.display = 'none';
    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleImageKeydown);
}

function initImageZoom() {
    if (imageZoomBound) return;
    const modal = document.getElementById('imageZoomModal');
    const closeBtn = document.getElementById('imageZoomClose');
    const img = document.getElementById('zoomedImage');
    const video = document.getElementById('zoomedIllustrationVideo');
    const prevBtn = document.getElementById('imageZoomPrev');
    const nextBtn = document.getElementById('imageZoomNext');
    if (!modal || !closeBtn || !img || !video) return;
    imageZoomBound = true;

    closeBtn.addEventListener('click', closeImageZoom);
    prevBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateImage(-1);
    });
    nextBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateImage(1);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeImageZoom();
        }
    });
}

function handleImageKeydown(e) {
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateImage(-1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateImage(1);
    } else if (e.key === 'Escape') {
        closeImageZoom();
    }
}

function navigateImage(direction) {
    if (imageZoomArray.length === 0) return;

    currentImageIndex = (currentImageIndex + direction + imageZoomArray.length) % imageZoomArray.length;
    const gallery = document.getElementById('illustrationsGallery');
    const illustrationsBase = gallery?.dataset.base || 'Illustrations';
    const media = imageZoomArray[currentImageIndex];
    openImageZoom(
        encodeIllustrationPath(illustrationsBase, media.file),
        media.media === 'video' ? 'video' : 'image'
    );
}

function updateZoomMeta(media) {
    const titleEl = document.getElementById('imageZoomTitle');
    const metaEl = document.getElementById('imageZoomMeta');
    const counterEl = document.getElementById('imageZoomCounter');
    if (titleEl) titleEl.textContent = media?.tooltip || 'Illustration';
    if (metaEl) metaEl.textContent = media?.format || '';
    if (counterEl) {
        counterEl.textContent = imageZoomArray.length
            ? `${currentImageIndex + 1} / ${imageZoomArray.length}`
            : '';
    }
}

function openImageZoom(imageSrc, mediaType = 'image') {
    const modal = document.getElementById('imageZoomModal');
    const img = document.getElementById('zoomedImage');
    const video = document.getElementById('zoomedIllustrationVideo');
    if (!modal || !img || !video) return;

    const gallery = document.getElementById('illustrationsGallery');
    imageZoomArray = getVisibleIllustrations(gallery);
    const imageFile = decodeURIComponent(imageSrc.split('/').pop());
    currentImageIndex = imageZoomArray.findIndex((i) => i.file === imageFile);
    if (currentImageIndex === -1) {
        imageZoomArray = illustrations.slice();
        currentImageIndex = illustrations.findIndex((i) => i.file === imageFile);
    }
    if (currentImageIndex === -1) currentImageIndex = 0;

    const current = imageZoomArray[currentImageIndex];
    const isVideo = mediaType === 'video' || current?.media === 'video';
    updateZoomMeta(current);

    modal.classList.add('is-loading');

    if (isVideo) {
        img.hidden = true;
        img.removeAttribute('src');
        video.hidden = false;
        video.src = imageSrc;
        video.load();
        const markReady = () => modal.classList.remove('is-loading');
        video.addEventListener('loadeddata', markReady, { once: true });
        video.addEventListener('error', markReady, { once: true });
        video.play().catch(() => {});
    } else {
        video.pause();
        video.hidden = true;
        video.removeAttribute('src');
        video.load();
        img.hidden = false;
        const markReady = () => modal.classList.remove('is-loading');
        img.addEventListener('load', markReady, { once: true });
        img.addEventListener('error', markReady, { once: true });
        img.alt = current?.tooltip || 'Illustration';
        img.src = imageSrc;
        if (img.complete) markReady();
    }

    document.body.style.overflow = 'hidden';
    modal.style.display = 'flex';
    modal.classList.add('active');
    document.addEventListener('keydown', handleImageKeydown);
}
