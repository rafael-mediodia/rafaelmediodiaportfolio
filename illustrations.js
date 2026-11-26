const illustrations = [
    { file: 'up and up.jpg', thumb: 'thumbs/up-and-up.jpg', w: 2778, h: 1940, tooltip: 'Up and Up', filters: ['still', '2d'], format: 'Still / 2D' },
    {
        file: 'bearlookingdown.png',
        thumb: 'thumbs/bearlookingdown.jpg',
        w: 1350,
        h: 1080,
        tooltip: 'Cookie The Bear',
        filters: ['still', '3d'],
        format: 'Still / 3D',
        frames: [
            { file: 'bearlookingdown.png', thumb: 'thumbs/bearlookingdown.jpg', label: 'Looking down' },
            { file: 'bearlookingforward.png', thumb: 'thumbs/bearlookingforward.jpg', label: 'Looking forward' },
            { file: 'bearzoomin.png', thumb: 'thumbs/bearzoomin.jpg', label: 'Close up' },
        ],
    },
    { file: 'The-Arrival_vector illustration.png', thumb: 'thumbs/The-Arrival.jpg', w: 1500, h: 1200, tooltip: 'The Arrival', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'Birt and Wirm.jpg', thumb: 'thumbs/Birt-and-Wirm.jpg', w: 2550, h: 3300, tooltip: 'Birt and Wirm', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'Robots Chatting_Vector.png', thumb: 'thumbs/Robots-Chatting-Vector.jpg', w: 8001, h: 4500, tooltip: 'Robots Chatting', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'City_Monster.jpg', thumb: 'thumbs/City_Monster.jpg', w: 3000, h: 2400, tooltip: 'City Monster', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'The_Stonecreature.jpg', thumb: 'thumbs/The_Stonecreature.jpg', w: 3000, h: 2400, tooltip: 'Stone Creature', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'celly and blobert.jpg', thumb: 'thumbs/celly-and-blobert.jpg', w: 2778, h: 1940, tooltip: 'Celly and Blobert', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'Exploration.jpg', thumb: 'thumbs/Exploration.jpg', w: 3000, h: 2400, tooltip: 'Exploration', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'smallwins_albumcover.jpg', thumb: 'thumbs/smallwins_albumcover.jpg', w: 1990, h: 2079, tooltip: 'Small Wins Album Cover', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'The Moon Makes The Way.jpg', thumb: 'thumbs/The-Moon-Makes-The-Way.jpg', w: 3000, h: 2400, tooltip: 'The Moon Makes The Way', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'Use_Your_Clues.jpg', thumb: 'thumbs/Use_Your_Clues.jpg', w: 3000, h: 2400, tooltip: 'Use Your Clues', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'Lelo and Pebs.jpg', thumb: 'thumbs/Lelo-and-Pebs.jpg', w: 3000, h: 2400, tooltip: 'Lelo and Pebs', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'Two_Peas_in_a_Pod.jpg', thumb: 'thumbs/Two_Peas_in_a_Pod.jpg', w: 2400, h: 3000, tooltip: 'Two Peas in a Pod', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'The Wizard Is That Way.jpg', thumb: 'thumbs/The-Wizard-Is-That-Way.jpg', w: 3000, h: 2400, tooltip: 'The Wizard Is That Way', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'hole_in_the_wall.jpg', thumb: 'thumbs/hole_in_the_wall.jpg', w: 2400, h: 3000, tooltip: 'Hole in the Wall', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'BrownPoliticalReview_Haronian.PNG', thumb: 'thumbs/BrownPoliticalReview_Haronian.jpg', w: 1080, h: 1350, tooltip: 'Brown Political Review Illustration', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'achat.mp4', thumb: 'thumbs/achat.jpg', w: 960, h: 540, tooltip: 'A Chat', filters: ['moving', '2d'], format: 'Moving / 2D', media: 'video' },
    { file: 'Friendly Creature Jaunt.jpg', thumb: 'thumbs/Friendly-Creature-Jaunt.jpg', w: 3000, h: 2400, tooltip: 'Friendly Creature Jaunt', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'rockplaydate.mp4', thumb: 'thumbs/rockplaydate.jpg', w: 960, h: 767, tooltip: 'Rock Playdate', filters: ['moving', '3d'], format: 'Moving / 3D', media: 'video' },
    { file: 'frogs.jpg', thumb: 'thumbs/frogs.jpg', w: 2100, h: 1500, tooltip: 'Frogs In The Bogs', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'Car3.png', thumb: 'thumbs/Car3.jpg', w: 2700, h: 2160, tooltip: 'Bumpy Road', filters: ['still', '2d', '3d'], format: 'Still / 2D + 3D' },
    { file: 'mockup.jpg', thumb: 'thumbs/mockup.jpg', w: 1800, h: 1500, tooltip: 'Mockup Editorial', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'Doggy Graduation.PNG', thumb: 'thumbs/Doggy-Graduation.jpg', w: 2550, h: 3300, tooltip: 'Doggy Graduation', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'theyrefloatingaround.mp4', thumb: 'thumbs/theyrefloatingaround.jpg', w: 960, h: 540, tooltip: "They're Floating Around", filters: ['moving', '2d'], format: 'Moving / 2D', media: 'video' },
    { file: 'WaitingROom.png', thumb: 'thumbs/WaitingROom.jpg', w: 1452, h: 1122, tooltip: 'Waiting Room', filters: ['still', '2d'], format: 'Still / 2D' },
    { file: 'IMG_7604.PNG', thumb: 'thumbs/IMG_7604.jpg', w: 3300, h: 5100, tooltip: 'Tudu Fish', filters: ['still', '2d'], format: 'Still / 2D' },
];

let illustrationsInitialized = false;
let illustrationsImageObserver = null;
let illustrationsArchiveTooltip = null;
const illustrationLoadQueue = [];
let illustrationLoadsActive = 0;
const MAX_ILLUSTRATION_LOADS = 6;

let currentImageIndex = 0;
let currentFrameIndex = 0;
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
    const pageItems = [];

    illustrations.forEach((imageData, index) => {
        const fullSrc = encodeIllustrationPath(illustrationsBase, imageData.file);
        const thumbSrc = encodeIllustrationPath(illustrationsBase, imageData.thumb || imageData.file);
        const isVideo = imageData.media === 'video';
        const isMoving = (imageData.filters || []).includes('moving');
        const filters = imageData.filters || ['still'];
        const title = imageData.tooltip || 'Illustration';
        const viewCount = imageData.frames?.length || 0;

        const imageContainer = document.createElement('button');
        imageContainer.type = 'button';
        imageContainer.className = 'illustration-item';
        imageContainer.dataset.mediaSrc = fullSrc;
        imageContainer.dataset.mediaType = isVideo ? 'video' : 'image';
        imageContainer.dataset.tooltip = title;
        imageContainer.dataset.format = imageData.format || 'Illustration';
        imageContainer.dataset.filters = filters.join(' ');
        imageContainer.dataset.index = String(index);
        imageContainer.setAttribute('aria-label', viewCount > 1 ? `View ${title}, ${viewCount} views` : `View ${title}`);

        const mediaEl = document.createElement('img');
        mediaEl.setAttribute('data-src', thumbSrc);
        mediaEl.alt = title;
        mediaEl.width = imageData.w || 4;
        mediaEl.height = imageData.h || 3;
        mediaEl.decoding = 'async';
        mediaEl.draggable = false;

        const mediaWrap = document.createElement('span');
        mediaWrap.className = 'illustration-item-media';
        mediaWrap.appendChild(mediaEl);

        const caption = document.createElement('div');
        caption.className = 'illustration-item-caption';
        caption.innerHTML = `
            <span class="illustration-item-title">${title}</span>
        `;

        if (isMoving) {
            const badge = document.createElement('span');
            badge.className = 'illustration-item-badge';
            badge.textContent = isVideo ? 'Video' : 'Motion';
            mediaWrap.appendChild(badge);
        }

        imageContainer.append(mediaWrap, caption);

        if (isPageGallery) {
            pageItems.push(imageContainer);
        } else {
            fragment.appendChild(imageContainer);
        }
        illustrationsImageObserver.observe(mediaEl);
    });

    if (isPageGallery) {
        placeIllustrationColumns(gallery, pageItems);
    } else {
        gallery.appendChild(fragment);
    }
    initIllustrationReshuffle(gallery);
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

function initIllustrationReshuffle(gallery) {
    const reshuffleBtn = document.getElementById('illustrationReshuffleBtn');
    if (!reshuffleBtn || reshuffleBtn.dataset.ready === 'true') return;
    reshuffleBtn.dataset.ready = 'true';

    reshuffleBtn.addEventListener('click', () => {
        const items = Array.from(gallery.querySelectorAll('.illustration-item'));
        for (let i = items.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        if (gallery.querySelector('.illustration-column')) {
            placeIllustrationColumns(gallery, items);
        } else {
            items.forEach((item) => gallery.appendChild(item));
        }
    });
}

const illustrationTabColors = [
    'var(--accent-sky)',
    'var(--accent-green)',
    'var(--accent-yellow)',
    'var(--accent-orange)',
];

function placeIllustrationColumns(gallery, items) {
    let columns = Array.from(gallery.querySelectorAll(':scope > .illustration-column'));
    if (columns.length !== 2) {
        gallery.replaceChildren();
        columns = [0, 1].map(() => {
            const column = document.createElement('div');
            column.className = 'illustration-column';
            gallery.appendChild(column);
            return column;
        });
    }

    columns.forEach((column) => column.replaceChildren());
    items.forEach((item, index) => {
        item.style.setProperty('--nav-color', illustrationTabColors[index % illustrationTabColors.length]);
        columns[index % 2].appendChild(item);
    });
}

function illustrationFrames(item) {
    return item?.frames?.length > 1 ? item.frames : null;
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
    renderZoomFrames(null);
    currentFrameIndex = 0;
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
    const frame = illustrationFrames(media)?.[currentFrameIndex];
    if (titleEl) titleEl.textContent = media?.tooltip || 'Illustration';
    if (metaEl) metaEl.textContent = frame?.label || '';
    if (counterEl) {
        counterEl.textContent = imageZoomArray.length
            ? `${currentImageIndex + 1} / ${imageZoomArray.length}`
            : '';
    }
}

function renderZoomFrames(item) {
    const strip = document.getElementById('imageZoomFrames');
    const modal = document.getElementById('imageZoomModal');
    const frames = illustrationFrames(item);
    if (!strip) return;

    modal?.classList.toggle('has-frames', Boolean(frames));
    if (!frames) {
        strip.hidden = true;
        strip.replaceChildren();
        strip.removeAttribute('aria-label');
        return;
    }

    const gallery = document.getElementById('illustrationsGallery');
    const base = gallery?.dataset.base || 'Illustrations';
    strip.hidden = false;
    strip.setAttribute('aria-label', `${item.tooltip || 'Illustration'} views`);
    strip.replaceChildren();

    frames.forEach((frame, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'image-zoom-frame';
        if (index === currentFrameIndex) button.classList.add('is-active');
        button.setAttribute('aria-label', frame.label || `View ${index + 1}`);
        button.setAttribute('aria-pressed', index === currentFrameIndex ? 'true' : 'false');

        const thumb = document.createElement('img');
        thumb.src = encodeIllustrationPath(base, frame.thumb || frame.file);
        thumb.alt = '';
        thumb.draggable = false;
        button.appendChild(thumb);

        button.addEventListener('click', (event) => {
            event.stopPropagation();
            selectIllustrationFrame(index);
        });
        strip.appendChild(button);
    });
}

function showZoomMedia(imageSrc, mediaType, current) {
    const modal = document.getElementById('imageZoomModal');
    const img = document.getElementById('zoomedImage');
    const video = document.getElementById('zoomedIllustrationVideo');
    if (!modal || !img || !video) return;

    const isVideo = mediaType === 'video' || current?.media === 'video';
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
        return;
    }

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
    if (img.complete && img.naturalWidth > 0) markReady();
}

function selectIllustrationFrame(index) {
    const item = imageZoomArray[currentImageIndex];
    const frames = illustrationFrames(item);
    const frame = frames?.[index];
    if (!frame || index === currentFrameIndex) return;

    currentFrameIndex = index;
    document.querySelectorAll('.image-zoom-frame').forEach((button, i) => {
        const active = i === index;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    updateZoomMeta(item);

    const gallery = document.getElementById('illustrationsGallery');
    const base = gallery?.dataset.base || 'Illustrations';
    showZoomMedia(encodeIllustrationPath(base, frame.file), 'image', item);
}

function openImageZoom(imageSrc, mediaType = 'image') {
    const modal = document.getElementById('imageZoomModal');
    const img = document.getElementById('zoomedImage');
    const video = document.getElementById('zoomedIllustrationVideo');
    if (!modal || !img || !video) return;

    const gallery = document.getElementById('illustrationsGallery');
    const illustrationsBase = gallery?.dataset.base || 'Illustrations';
    imageZoomArray = getVisibleIllustrations(gallery);
    const imageFile = decodeURIComponent(imageSrc.split('/').pop());
    currentImageIndex = imageZoomArray.findIndex((i) => i.file === imageFile);
    if (currentImageIndex === -1) {
        imageZoomArray = illustrations.slice();
        currentImageIndex = illustrations.findIndex((i) => i.file === imageFile);
    }
    if (currentImageIndex === -1) currentImageIndex = 0;

    const current = imageZoomArray[currentImageIndex];
    const frames = illustrationFrames(current);
    currentFrameIndex = 0;
    if (frames) {
        const match = frames.findIndex((frame) => frame.file === imageFile);
        if (match >= 0) currentFrameIndex = match;
    }

    updateZoomMeta(current);
    renderZoomFrames(current);

    const frameFile = frames?.[currentFrameIndex]?.file;
    const srcToShow = frameFile
        ? encodeIllustrationPath(illustrationsBase, frameFile)
        : imageSrc;
    showZoomMedia(srcToShow, mediaType, current);

    document.body.style.overflow = 'hidden';
    modal.style.display = 'flex';
    modal.classList.add('active');
    document.addEventListener('keydown', handleImageKeydown);
}
