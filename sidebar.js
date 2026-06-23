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

/** Typefaces used for per-letter name hover (matches Typefaces/ folder) */
const NAME_TYPEFACES = [
    { id: 'istorya', name: 'Istorya', stack: 'sans-serif' },
    { id: 'clayletter', name: 'Clayletter', stack: 'sans-serif' },
    {
        id: 'suburb',
        name: 'Suburb',
        stack: 'monospace',
        variableFont: true,
        variation: '"wdth" 650',
    },
    { id: 'pearface', name: 'PearFace', stack: 'sans-serif' },
    { id: 'rough-pixel', name: 'Rough Pixel', stack: 'monospace' },
    { id: 'sketchface', name: 'Sketchface', stack: 'sans-serif' },
    { id: 'warp-woven', name: 'Warp Woven', stack: 'sans-serif' },
];

function nameTypefaceFamily(face) {
    return `'${face.name.replace(/'/g, "\\'")}', ${face.stack}`;
}

function injectNameTypefaceFonts(prefix) {
    if (document.getElementById('sidebar-name-typeface-fonts')) return;

    const rules = NAME_TYPEFACES.map((face) => {
        const family = face.name.replace(/'/g, "\\'");
        const url = `${prefix}Typefaces/${face.id}/font.woff2`;
        const stretch = face.variableFont ? 'font-stretch:40% 90%;' : '';
        return `@font-face{font-family:'${family}';src:url('${url}') format('woff2');font-weight:normal;font-style:normal;${stretch}font-display:swap;}`;
    }).join('');

    const style = document.createElement('style');
    style.id = 'sidebar-name-typeface-fonts';
    style.textContent = rules;
    document.head.appendChild(style);
}

function initNameTypefaceHover(container, prefix) {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const link = container.querySelector('.info-name-link');
    const nameEl = container.querySelector('.info-name');
    if (!link || !nameEl) return;

    const nameText = nameEl.textContent.trim();
    if (!nameText) return;

    link.setAttribute('aria-label', nameText);
    wrapNameLetters(nameEl, nameText);

    let fontsInjected = false;

    function ensureFonts() {
        if (fontsInjected) return;
        fontsInjected = true;
        injectNameTypefaceFonts(prefix);
        NAME_TYPEFACES.forEach((face) => {
            document.fonts?.load?.(`12px ${nameTypefaceFamily(face)}`).catch(() => {});
        });
    }

    function pickRandomFace(currentId) {
        if (NAME_TYPEFACES.length <= 1) return NAME_TYPEFACES[0];
        let face;
        do {
            face = NAME_TYPEFACES[(Math.random() * NAME_TYPEFACES.length) | 0];
        } while (face.id === currentId);
        return face;
    }

    function applyLetterFace(letter) {
        const face = pickRandomFace(letter.dataset.faceId);
        letter.style.fontFamily = nameTypefaceFamily(face);
        letter.style.fontVariationSettings = face.variation || '';
        letter.classList.add('info-name-letter--active');
        letter.dataset.faceId = face.id;
    }

    function resetLetter(letter) {
        letter.style.fontFamily = '';
        letter.style.fontVariationSettings = '';
        letter.classList.remove('info-name-letter--active');
        delete letter.dataset.faceId;
    }

    nameEl.addEventListener(
        'mouseover',
        (e) => {
            const letter = e.target.closest('.info-name-letter');
            if (!letter || !nameEl.contains(letter)) return;
            if (letter.contains(e.relatedTarget)) return;
            ensureFonts();
            applyLetterFace(letter);
        },
        { passive: true }
    );

    nameEl.addEventListener(
        'mouseout',
        (e) => {
            const letter = e.target.closest('.info-name-letter');
            if (!letter || !nameEl.contains(letter)) return;
            if (letter.contains(e.relatedTarget)) return;
            resetLetter(letter);
        },
        { passive: true }
    );

    link.addEventListener('mouseleave', () => {
        nameEl.querySelectorAll('.info-name-letter--active').forEach(resetLetter);
    });
}

function wrapNameLetters(nameEl, text) {
    nameEl.textContent = '';
    nameEl.setAttribute('aria-hidden', 'true');

    for (const char of text) {
        if (char === ' ') {
            const space = document.createElement('span');
            space.className = 'info-name-space';
            space.textContent = '\u00A0';
            space.setAttribute('aria-hidden', 'true');
            nameEl.appendChild(space);
            continue;
        }

        const letter = document.createElement('span');
        letter.className = 'info-name-letter';
        letter.textContent = char;
        letter.setAttribute('aria-hidden', 'true');
        nameEl.appendChild(letter);
    }
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
                    <figure class="info-portrait">
                        <img src="${prefix}ItsMe.jpg" alt="Rafael Mediodia in the studio" width="608" height="1080" loading="lazy" decoding="async">
                    </figure>
                    <div class="info-about-extended">
                        <p>Rafael is pursuing his BFA in graphic design at the Rhode Island School of Design, with a focus on Computation, Culture, and Technology. He is driven by connection with others and the power of feeling.</p>
                        <p>Rafael enjoys the act of play in serious and unserious ways, systems that connect people together, and putting the motion in emotion.</p>
                        <p>He is willing to help out and connect by any means if that catches your fancy. <a href="mailto:rafaelmediodiawork@gmail.com" class="info-link">Email me</a> for any freelance inquiries or questions.</p>
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
                        <a href="mailto:rafaelmediodiawork@gmail.com" class="info-link">EMAIL</a>
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
    initNameTypefaceHover(infoContainer, prefix);
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
    initRandomAccentHovers();
});

/** Random accent on hover — one delegated listener pair, no per-element handlers */
function initRandomAccentHovers() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ACCENT_POOL = [
        { accent: 'var(--accent-yellow)', soft: 'var(--accent-yellow-soft)' },
        { accent: 'var(--accent-green)', soft: 'var(--accent-green-soft)' },
        { accent: 'var(--accent-sky)', soft: 'var(--accent-sky-soft)' },
        { accent: 'var(--accent-orange)', soft: 'var(--accent-orange-soft)' },
    ];

    const TARGETS = [
        { selector: '.info-name-link', mode: 'name' },
        { selector: '.info-spotlight-item', mode: 'spotlight' },
        { selector: '.info-read-more-btn', mode: 'text' },
        { selector: '.info-bio-footer .info-link', mode: 'text' },
        { selector: '.info-current .info-link', mode: 'text' },
        { selector: '.info-previous .info-link', mode: 'text' },
        { selector: '.project-back-link', mode: 'text' },
        { selector: '.writing-link', mode: 'text' },
        { selector: '.typeface-item', mode: 'text' },
        {
            selector: '.typeface-detail-nav-btn',
            mode: 'pill',
            skip: (el) => el.classList.contains('typeface-detail-nav-btn--active'),
        },
        { selector: '.typeface-usage-email', mode: 'text' },
        { selector: '.gallery .project-thumb', mode: 'border' },
        { selector: '.illustrations-gallery .illustration-item', mode: 'border' },
        { selector: '.motion-gallery .motion-video-item', mode: 'text' },
        { selector: '.project-blurb a', mode: 'text' },
        { selector: '.project-text a', mode: 'text' },
        { selector: '.writing-chapter a', mode: 'text' },
    ];

    const ROOT_SELECTOR = TARGETS.map((config) => config.selector).join(', ');
    const ACCENT_MODES = ['text', 'name', 'spotlight', 'pill', 'border'];

    let activeEl = null;

    function resolveTarget(from) {
        if (!(from instanceof Element)) return null;
        const el = from.closest(ROOT_SELECTOR);
        if (!el) return null;
        for (let i = 0; i < TARGETS.length; i += 1) {
            const config = TARGETS[i];
            if (el.matches(config.selector) && !config.skip?.(el)) {
                return { el, mode: config.mode };
            }
        }
        return null;
    }

    function pickAccent() {
        return ACCENT_POOL[(Math.random() * ACCENT_POOL.length) | 0];
    }

    function applyAccent(el, mode) {
        const { accent, soft } = pickAccent();
        el.style.setProperty('--accent-hover', accent);
        el.style.setProperty('--accent-hover-soft', soft);
        if (!el.classList.contains('has-accent-hover')) {
            el.classList.add('has-accent-hover', `accent-hover--${mode}`);
            return;
        }
        for (let i = 0; i < ACCENT_MODES.length; i += 1) {
            const m = ACCENT_MODES[i];
            if (m !== mode) el.classList.remove(`accent-hover--${m}`);
        }
        el.classList.add(`accent-hover--${mode}`);
    }

    function clearAccent(el) {
        el.classList.remove(
            'has-accent-hover',
            'accent-hover--text',
            'accent-hover--name',
            'accent-hover--spotlight',
            'accent-hover--pill',
            'accent-hover--border'
        );
        el.style.removeProperty('--accent-hover');
        el.style.removeProperty('--accent-hover-soft');
    }

    function setActive(next, mode) {
        if (activeEl && activeEl !== next) clearAccent(activeEl);
        activeEl = next;
        if (activeEl) applyAccent(activeEl, mode);
    }

    document.addEventListener(
        'mouseover',
        (e) => {
            const hit = resolveTarget(e.target);
            if (!hit) return;
            if (hit.el.contains(e.relatedTarget)) return;
            setActive(hit.el, hit.mode);
        },
        { passive: true }
    );

    document.addEventListener(
        'mouseout',
        (e) => {
            if (!activeEl) return;
            if (!activeEl.contains(e.target) && e.target !== activeEl) return;
            if (activeEl.contains(e.relatedTarget)) return;
            clearAccent(activeEl);
            activeEl = null;
        },
        { passive: true }
    );
}
