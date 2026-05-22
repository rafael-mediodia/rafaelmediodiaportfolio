const illustrations = [
    { file: 'frogs.jpg', tooltip: 'Frogs In The Bogs' },
    { file: 'mountain_and_tree_and_car_friends.jpg', tooltip: 'Mountain Friends' },
    { file: 'astronaut_forest jpg.jpg', tooltip: 'Space Park' },
    { file: 'beetle3.jpg', tooltip: 'Toy Dung Beetle' },
    { file: 'mockup.jpg', tooltip: 'Mockup Editorial' },
    { file: 'IMG_7604.PNG', tooltip: 'Tudu Fish' },
    { file: 'bearlookingdown.png', tooltip: 'Cookie The Bear' },
    { file: 'bearlookingforward.png', tooltip: 'Cookie The Bear' },
    { file: 'bearzoomin.png', tooltip: 'Cookie The Bear' },
    { file: 'Car3.png', tooltip: 'Bumpy Road' },
    { file: 'Haronian_RafaelMediodia1.png', tooltip: 'Brown Political Review Illustration' },
    { file: 'Haronian_RafaelMediodia2.png', tooltip: 'Brown Political Review Spot Illustration' },
    { file: 'Self-Portrait.png', tooltip: 'Self Portrait' },
    { file: 'ThePitt_NoahWyle.png', tooltip: 'Noah Wyle in The Pitt' },
    { file: 'WaitingROom.png', tooltip: 'Waiting Room' }
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
        const img = illustrationLoadQueue.shift();
        const lazySrc = img.getAttribute('data-src');
        if (!lazySrc) continue;
        illustrationLoadsActive += 1;
        const done = () => {
            illustrationLoadsActive = Math.max(0, illustrationLoadsActive - 1);
            drainIllustrationLoadQueue();
        };
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
        img.src = lazySrc;
        img.removeAttribute('data-src');
        illustrationsImageObserver?.unobserve(img);
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

    if (!illustrationsArchiveTooltip) {
        illustrationsArchiveTooltip = document.createElement('div');
        illustrationsArchiveTooltip.className = 'project-tooltip';
        document.body.appendChild(illustrationsArchiveTooltip);
    }

    const panelInner = gallery.closest('.archive-panel-inner');

    if (!illustrationsImageObserver) {
        illustrationsImageObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const img = entry.target;
                if (!img.getAttribute('data-src')) return;
                illustrationLoadQueue.push(img);
            });
            drainIllustrationLoadQueue();
        }, { root: panelInner || null, rootMargin: '60px 0px', threshold: 0.05 });
    }

    const fragment = document.createDocumentFragment();

    illustrations.forEach((imageData) => {
        const imageFile = imageData.file;
        const src = `Illustrations/${imageFile}`;

        const imageContainer = document.createElement('div');
        imageContainer.className = 'illustration-item';
        imageContainer.dataset.imageSrc = src;
        imageContainer.dataset.tooltip = imageData.tooltip || 'Illustration';

        const img = document.createElement('img');
        img.setAttribute('data-src', src);
        img.alt = imageContainer.dataset.tooltip;
        img.loading = 'lazy';
        img.decoding = 'async';

        imageContainer.appendChild(img);
        fragment.appendChild(imageContainer);
        illustrationsImageObserver.observe(img);
    });

    gallery.appendChild(fragment);

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

    gallery.addEventListener('click', (e) => {
        const item = e.target.closest('.illustration-item');
        if (item?.dataset.imageSrc) {
            openImageZoom(item.dataset.imageSrc);
        }
    });
}

function initImageZoom() {
    if (imageZoomBound) return;
    const modal = document.getElementById('imageZoomModal');
    const closeBtn = document.getElementById('imageZoomClose');
    const img = document.getElementById('zoomedImage');
    if (!modal || !closeBtn || !img) return;
    imageZoomBound = true;

    const closeModal = () => {
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
        if (modal) {
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
    const img = document.getElementById('zoomedImage');
    if (!img) return;

    const imageFile = imageZoomArray[currentImageIndex].file;
    img.src = `Illustrations/${imageFile}`;
}

function openImageZoom(imageSrc) {
    const modal = document.getElementById('imageZoomModal');
    const img = document.getElementById('zoomedImage');
    if (!modal || !img) return;

    imageZoomArray = illustrations;
    const imageFile = imageSrc.split('/').pop();
    currentImageIndex = illustrations.findIndex((i) => i.file === imageFile);
    if (currentImageIndex === -1) currentImageIndex = 0;

    img.src = imageSrc;
    document.body.style.overflow = 'hidden';
    modal.style.display = 'flex';
    modal.classList.add('active');
    document.addEventListener('keydown', handleImageKeydown);
}
