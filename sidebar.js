function prefersTouchInteraction() {
    return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

function isMobileSidebar() {
    return window.matchMedia('(max-width: 768px)').matches;
}

/** Non-breaking space between words in a proper noun or title */
function nb(...parts) {
    return parts.join('\u00A0');
}

/** Edit this list to update awards & exhibitions in the expanded panel */
function getSidebarRecognition() {
    return [
        {
            title: `${nb('Albert', 'R.', 'Pontes', 'Award')}`,
            meta: `${nb('RISD', 'Graphic', 'Design')} Scholarship for academic achievement`,
        },
        {
            title: `${nb('RISD', 'Graphic', 'Design', 'Triennial')}`,
            meta: 'Featured work in the student-led exhibition. Participated in the marketing material of the triennial.',
        },
        {
            title: `${nb('RISD', 'Graphic', 'Design', 'Senior', 'Show')}`,
            meta: 'Featured work in the student-led exhibition. Participated in the marketing and motion.',
        },
        {
            title: "You're Talking a lot but You're Not Saying Anything",
            meta: `${nb('RISD', 'Graphic', 'Design')} exhibition at ${nb('Make', 'Do', 'Studios')}. Featured work: abcdefghijklmnopquintet`,
        },
        {
            title: `${nb('VISIONS', 'First', 'Annual', 'Art', 'Exhibition')}`,
            meta: `${nb('Public', 'Shop', '&', 'Gallery')} · ${nb('Brown', '&', 'RISD')} APIDA community showcase. Featured work: run-on`,
        },
    ];
}

function renderSpotlightList(items, linkClass) {
    if (!items.length) {
        return '<p class="info-spotlight-empty">Nothing listed yet.</p>';
    }

    return `<ul class="info-spotlight-list">${items
        .map((item) => {
            const meta = item.meta
                ? `<span class="info-spotlight-meta">${item.meta}</span>`
                : '';
            if (item.href) {
                return `<li class="info-spotlight-item">
                    <a href="${item.href}" class="${linkClass}">${item.title}</a>
                    ${meta}
                </li>`;
            }
            return `<li class="info-spotlight-item">
                <span class="info-spotlight-title">${item.title}</span>
                ${meta}
            </li>`;
        })
        .join('')}</ul>`;
}

function buildSidebarHTML(prefix) {
    const recognition = getSidebarRecognition();

    return `
        <button type="button" class="info-sidebar-toggle" aria-expanded="false" aria-controls="infoSidebarInner">
            <span class="info-sidebar-toggle-label">RAFAEL MEDIODIA</span>
        </button>
        <div class="info-sidebar-inner" id="infoSidebarInner">
            <div class="info-sidebar-primary">
                <div class="info-name-row">
                    <a href="${prefix}index.html" class="info-name-link">
                        <div class="info-name">RAFAEL MEDIODIA</div>
                    </a>
                    <span class="info-birth">(b.2004) ✧</span>
                </div>
                <div class="info-about">
                    is a Filipino-American designer, artist, illustrator, and filmmaker from Louisville, Kentucky. (◕‿◕)
                    <button type="button" class="info-read-more-btn" aria-expanded="false" aria-controls="infoBioMore">
                        <span class="info-read-more-label">read more</span>
                    </button>
                </div>
                <div class="info-bio-more" id="infoBioMore" aria-hidden="true">
                    <div class="info-about-extended">
                        <p>Rafael is pursuing his BFA in ${nb('Graphic', 'Design')} at the ${nb('Rhode', 'Island', 'School', 'of', 'Design')} with a focus on Computation, Culture, and Technology. He is driven by connection with others and the power of feeling.</p>
                        <p>Rafael enjoys the act of play in serious and unserious ways, systems that connect people together, and putting the motion in emotion and is willing to help out and connect by any means if that catches your fancy. Email me for any freelance inquiries/questions!</p>
                    </div>
                    <section class="info-recognition" aria-label="Awards and exhibitions">
                        <h2 class="info-section-label">Awards & Exhibitions</h2>
                        ${renderSpotlightList(recognition, 'info-spotlight-link')}
                    </section>
                </div>
                <div class="info-bio-footer">
                    <div class="info-current">
                        Designing @ <a href="https://bsrlive.com/" class="info-link" target="_blank">${nb('Brown', 'Student', 'Radio')}</a> ˚ ༘
                    </div>
                    <div class="info-previous">
                        Previously @ <a href="https://mediocre.rodeo" class="info-link" target="_blank">Mediocre</a>, <a href="https://visions-mag.squarespace.com/" class="info-link" target="_blank">VISIONS</a>
                    </div>
                    <div class="info-links">
                        <a href="mailto:rmediodi@risd.edu" class="info-link">EMAIL</a>
                        <a href="${prefix}RafaelMediodia-RESUME.pdf" class="info-link">RESUME</a>
                        <a href="https://www.linkedin.com/in/rafael-mediodia-067b9418b/" class="info-link" target="_blank">LINKEDIN</a>
                        <a href="https://www.instagram.com/middledays/" class="info-link" target="_blank">INSTAGRAM</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initSidebar() {
    const path = window.location.pathname;
    const isInSubdirectory =
        path.includes('/projects/') || path.split('/').filter(Boolean).length > 1;
    const prefix = isInSubdirectory ? '../' : '';

    const infoContainer = document.querySelector('.info-container');
    if (!infoContainer) return;

    infoContainer.innerHTML = buildSidebarHTML(prefix);
    initMobileSidebar(infoContainer);
    initKnowMore(infoContainer);
}

function setMobileSidebarOpen(container, open) {
    const toggle = container.querySelector('.info-sidebar-toggle');
    const inner = container.querySelector('.info-sidebar-inner');
    if (!toggle || !inner) return;

    container.classList.toggle('info-container--open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');

    if (isMobileSidebar()) {
        inner.hidden = !open;
    } else {
        inner.hidden = false;
    }

    if (open && prefersTouchInteraction()) {
        requestAnimationFrame(() => {
            container.scrollIntoView({ block: 'start', behavior: 'smooth' });
        });
    }
}

function scrollReadMoreIntoView(container) {
    if (!prefersTouchInteraction()) return;
    const btn = container.querySelector('.info-read-more-btn');
    if (!btn) return;
    requestAnimationFrame(() => {
        btn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
}

function initMobileSidebar(container) {
    const toggle = container.querySelector('.info-sidebar-toggle');
    const mq = window.matchMedia('(max-width: 768px)');

    const applyMode = () => {
        if (mq.matches) {
            container.classList.add('info-container--collapsible');
            if (!container.dataset.mobileToggled) {
                setMobileSidebarOpen(container, false);
            }
        } else {
            container.classList.remove('info-container--collapsible', 'info-container--open');
            container.querySelector('.info-sidebar-inner').hidden = false;
            toggle?.setAttribute('aria-expanded', 'true');
        }
    };

    toggle?.addEventListener('click', () => {
        const open = !container.classList.contains('info-container--open');
        container.dataset.mobileToggled = '1';
        setMobileSidebarOpen(container, open);
    });

    toggle?.addEventListener(
        'touchstart',
        () => toggle.classList.add('info-sidebar-toggle--pressed'),
        { passive: true }
    );
    toggle?.addEventListener('touchend', () => {
        toggle.classList.remove('info-sidebar-toggle--pressed');
    });
    toggle?.addEventListener('touchcancel', () => {
        toggle.classList.remove('info-sidebar-toggle--pressed');
    });

    mq.addEventListener('change', () => {
        container.dataset.mobileToggled = '';
        applyMode();
    });
    applyMode();
}

function setKnowMoreOpen(container, open) {
    const btn = container.querySelector('.info-read-more-btn');
    const bioMore = container.querySelector('#infoBioMore');
    const label = container.querySelector('.info-read-more-label');
    if (!btn || !bioMore) return;

    container.classList.toggle('info-container--more-open', open);
    document.body.classList.toggle('info-sidebar-more-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.classList.toggle('info-read-more-btn--open', open);
    bioMore.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (label) {
        label.textContent = open ? 'read less' : 'read more';
    }

    if (open) {
        scrollReadMoreIntoView(container);
    }
}

function initKnowMore(container) {
    const btn = container.querySelector('.info-read-more-btn');

    btn?.addEventListener('click', () => {
        const open = !container.classList.contains('info-container--more-open');
        setKnowMoreOpen(container, open);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && container.classList.contains('info-container--more-open')) {
            setKnowMoreOpen(container, false);
        }
    });

    document.addEventListener('click', (e) => {
        if (!container.classList.contains('info-container--more-open')) return;
        if (isMobileSidebar()) return;
        if (container.contains(e.target)) return;
        setKnowMoreOpen(container, false);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
});
