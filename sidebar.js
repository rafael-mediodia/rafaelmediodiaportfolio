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

function buildSidebarHTML(prefix, currentPath = window.location.pathname) {
    const recognition = getSidebarRecognition();
    const isIllustrationPage = currentPath.includes('/illustration/');
    const isTypefacesPage = currentPath.includes('typefaces.html');
    const isArchivePage = currentPath.includes('motion.html');
    const designCurrent = isIllustrationPage || isTypefacesPage || isArchivePage ? '' : ' info-portfolio-link--active';
    const illustrationCurrent = isIllustrationPage ? ' info-portfolio-link--active' : '';
    const typefacesCurrent = isTypefacesPage ? ' info-portfolio-link--active' : '';
    const archiveCurrent = isArchivePage ? ' info-portfolio-link--active' : '';
    const designAria = isIllustrationPage || isTypefacesPage || isArchivePage ? '' : ' aria-current="page"';
    const illustrationAria = isIllustrationPage ? ' aria-current="page"' : '';
    const typefacesAria = isTypefacesPage ? ' aria-current="page"' : '';
    const archiveAria = isArchivePage ? ' aria-current="page"' : '';
    const motionReelLink = isIllustrationPage
        ? ''
        : `<a href="${prefix}RAFAELMEDIODIA_MOTIONREEL.mp4" class="info-link" download>MOTION REEL</a>`;
    return `
        <div class="info-about-paper">
            <nav class="info-portfolio-switch" aria-label="Portfolio switcher">
                <a href="${prefix}index.html" class="info-portfolio-link${designCurrent}"${designAria}>Design</a>
                <a href="${prefix}illustration/" class="info-portfolio-link${illustrationCurrent}"${illustrationAria}>Illustration</a>
                <a href="${prefix}typefaces.html" class="info-portfolio-link${typefacesCurrent}"${typefacesAria}>Typefaces</a>
                <a href="${prefix}motion.html" class="info-portfolio-link${archiveCurrent}"${archiveAria}>Archive</a>
                <button type="button" class="info-sidebar-toggle" aria-expanded="false" aria-controls="infoSidebarInner">
                    <span class="info-sidebar-toggle-label">Rafael Mediodia</span>
                </button>
            </nav>
            <a href="${prefix}index.html" class="info-name-link">
                <div class="info-name">RAFAEL MEDIODIA</div>
                <span class="info-birth">(b.2004) ✧</span>
            </a>
            <div class="info-sidebar-inner" id="infoSidebarInner">
                <div class="info-sidebar-primary">
                    <div class="info-about">
                        is a Filipino-American designer, artist, illustrator, and filmmaker from ${nb('Louisville,', 'Kentucky')}. (◕‿◕)
                        <button type="button" class="info-read-more-btn" aria-expanded="false" aria-controls="infoBioMore">
                            <span class="info-read-more-label">read more</span>
                        </button>
                    </div>
                    <div class="info-bio-more" id="infoBioMore" aria-hidden="true">
                        <figure class="info-portrait">
                            <img src="${prefix}ItsMe.jpg" alt="Rafael Mediodia in the studio" width="618" height="900" loading="lazy" decoding="async">
                        </figure>
                        <div class="info-about-extended">
                            <p>He enjoys the power and magic of iteration to lead to a polished product. Rafael holds a BFA from RISD in Graphic Design with a focus on Computation, Culture, and Technology. He loves video games, KPop, stationery, and his dog, Lila.</p>
                            <p>Rafael would love to get to know you and chat about your potential projects. <a href="mailto:rafaelmediodiawork@gmail.com" class="info-link">Email him</a> for any freelance inquiries or questions.</p>
                        </div>
                        <section class="info-recognition" aria-label="Awards and exhibitions">
                            <h2 class="info-section-label">Awards & Exhibitions</h2>
                            ${renderSpotlightList(recognition, 'info-spotlight-link')}
                        </section>
                    </div>
                    <div class="info-bio-footer">
                        <div class="info-current">
                            Designing @ TBD ˚ ༘
                        </div>
                        <div class="info-previous">
                            Previously @ <a href="https://bsrlive.com/" class="info-link" target="_blank">${nb('Brown', 'Student', 'Radio')}</a>, <a href="https://mediocre.rodeo" class="info-link" target="_blank">Mediocre</a>, <a href="https://visions-mag.squarespace.com/" class="info-link" target="_blank">VISIONS</a>
                        </div>
                        <div class="info-links">
                            <a href="mailto:rafaelmediodiawork@gmail.com" class="info-link">EMAIL</a>
                            <a href="${prefix}RafaelMediodia-RESUME.pdf" class="info-link">RESUME</a>
                            ${motionReelLink}
                            <a href="https://www.linkedin.com/in/rafael-mediodia-067b9418b/" class="info-link" target="_blank">LINKEDIN</a>
                            <a href="https://www.instagram.com/middledays/" class="info-link" target="_blank">INSTAGRAM</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initSidebar() {
    const path = window.location.pathname;
    const isInSubdirectory =
        path.includes('/projects/') ||
        path.includes('/illustration/') ||
        path.split('/').filter(Boolean).length > 1;
    const prefix = isInSubdirectory ? '../' : '';

    const infoContainer = document.querySelector('.info-container');
    if (!infoContainer) return;

    infoContainer.innerHTML = buildSidebarHTML(prefix, path);
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

    if (!open) {
        setKnowMoreOpen(container, false);
    }

    if (open && prefersTouchInteraction() && !document.body.classList.contains('home-page')) {
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

    container.querySelectorAll('.info-portfolio-link').forEach((link) => {
        link.addEventListener('click', () => {
            if (container.classList.contains('info-container--open')) {
                setMobileSidebarOpen(container, false);
            }
        });
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

    document.addEventListener('click', (e) => {
        if (!mq.matches) return;
        if (!container.classList.contains('info-container--open')) return;
        if (container.contains(e.target)) return;
        setMobileSidebarOpen(container, false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (!mq.matches) return;
        if (!container.classList.contains('info-container--open')) return;
        setMobileSidebarOpen(container, false);
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

function layoutFolderTabs(nav, bottomNav) {
    if (!nav || !bottomNav) return;
    while (bottomNav.firstChild) nav.appendChild(bottomNav.firstChild);
    if (window.matchMedia('(max-width: 768px)').matches) {
        bottomNav.hidden = true;
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
}

function initFileFolder(config) {
    const folder = config.folder;
    if (!folder) return;

    const pages = Array.from(folder.querySelectorAll(config.pageSelector || '.file-page'));
    const nav = document.getElementById(config.navId);
    const bottomNav = document.getElementById(config.bottomNavId);
    const linkSelector = config.linkSelector || '.design-jump-link';
    const currentClass = config.currentClass || 'file-page--current';
    const passedClass = config.passedClass || 'file-page--passed';
    const popClass = config.popClass || 'file-page--pop';
    const mode = config.mode || 'pages';
    const wheelMode = config.wheelMode === undefined ? 'edge' : config.wheelMode;
    const bodyClass = config.bodyClass;
    const onShow = config.onShow;
    const onTab = config.onTab;
    const stage = folder.closest('.gallery-container') || folder;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (mode === 'pages' && !pages.length) return;

    let index = 0;
    let locked = false;
    let wheelDelta = 0;
    let wheelReset = 0;
    let touchX = 0;
    let touchY = 0;
    let layingOutTabs = false;

    const getLinks = () => Array.from(folder.querySelectorAll(linkSelector));

    const linkMatchesPage = (link, page) => {
        if (config.matchLink) return config.matchLink(link, page);
        if (link.hash && page?.id) return link.hash === `#${page.id}`;
        if (link.dataset.filter) {
            return link.dataset.filter === (page?.dataset.filter || page?.id);
        }
        return false;
    };

    const placeTabs = (activeIndex) => {
        const page = pages[activeIndex];
        const activeLink = config.activeLink
            ? config.activeLink(getLinks(), page, activeIndex)
            : null;
        getLinks().forEach((link) => {
            const active = activeLink ? link === activeLink : Boolean(page && linkMatchesPage(link, page));
            link.classList.toggle('design-jump-link--active', active);
            if (active) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    const relayoutTabs = () => {
        if (layingOutTabs) return;
        layingOutTabs = true;
        layoutFolderTabs(nav, bottomNav);
        window.requestAnimationFrame(() => {
            layingOutTabs = false;
        });
    };

    const isTypingTarget = (el) => {
        if (!el) return false;
        const tag = el.tagName;
        if (tag && /INPUT|TEXTAREA|SELECT/.test(tag)) return true;
        if (el.isContentEditable) return true;
        return Boolean(el.closest?.('[contenteditable="true"]'));
    };

    const zoomOpen = () => {
        const image = document.getElementById('imageZoomModal');
        const video = document.getElementById('videoZoomModal');
        if (image && (image.classList.contains('active') || image.style.display === 'flex')) return true;
        if (video && (video.classList.contains('active') || video.style.display === 'flex')) return true;
        return false;
    };

    const nestedCanScroll = (start, page, deltaY) => {
        let node = start;
        while (node && node !== page && node !== folder && node !== document.body) {
            if (node.nodeType === 1) {
                const style = getComputedStyle(node);
                const oy = style.overflowY;
                if ((oy === 'auto' || oy === 'scroll') && node.scrollHeight > node.clientHeight + 1) {
                    if (deltaY > 0 && node.scrollTop < node.scrollHeight - node.clientHeight - 1) return true;
                    if (deltaY < 0 && node.scrollTop > 1) return true;
                }
            }
            node = node.parentElement;
        }
        return false;
    };

    const pageCanScroll = (page, deltaY) => {
        if (page) {
            const max = page.scrollHeight - page.clientHeight;
            if (max > 1) {
                if (deltaY > 0 && page.scrollTop < max - 1) return true;
                if (deltaY < 0 && page.scrollTop > 1) return true;
            }
        }
        const doc = document.scrollingElement || document.documentElement;
        const docMax = doc.scrollHeight - window.innerHeight;
        if (docMax > 1) {
            if (deltaY > 0) return doc.scrollTop < docMax - 1;
            if (deltaY < 0) return doc.scrollTop > 1;
        }
        return false;
    };

    const show = (next) => {
        if (mode !== 'pages' || !pages.length) {
            placeTabs(next || 0);
            relayoutTabs();
            return;
        }
        index = Math.max(0, Math.min(pages.length - 1, next));
        wheelDelta = 0;
        pages.forEach((page, i) => {
            const current = i === index;
            page.classList.remove(popClass);
            page.classList.toggle(currentClass, current);
            page.classList.toggle(passedClass, !current);
            page.setAttribute('aria-hidden', current ? 'false' : 'true');
            page.querySelectorAll('video').forEach((video) => {
                if (current && video.src && !video.getAttribute('data-src')) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
            if (current && !reduceMotion) {
                void page.offsetWidth;
                page.classList.add(popClass);
            }
        });
        relayoutTabs();
        placeTabs(index);
        const currentPage = pages[index];
        if (currentPage) {
            currentPage.scrollTop = 0;
            onShow?.(currentPage, index);
        }
        const id = currentPage?.id;
        if (id && window.location.hash !== `#${id}`) {
            history.replaceState(null, '', `#${id}`);
        }
    };

    const flip = (dir) => {
        if (mode !== 'pages' || locked) return;
        const next = index + dir;
        if (next < 0 || next >= pages.length) return;
        locked = true;
        show(next);
        window.setTimeout(() => {
            locked = false;
        }, 180);
    };

    const activateLink = (link) => {
        if (mode === 'tabs') {
            getLinks().forEach((item) => {
                const active = item === link;
                item.classList.toggle('design-jump-link--active', active);
                if (active) item.setAttribute('aria-current', 'true');
                else item.removeAttribute('aria-current');
            });
            relayoutTabs();
            onTab?.(link);
            if (link.hash && window.location.hash !== link.hash) {
                history.replaceState(null, '', link.hash);
            }
            return;
        }
        const next = pages.findIndex((page) => linkMatchesPage(link, page));
        if (next < 0) return;
        if (next === index) return;
        show(next);
    };

    if (wheelMode) {
        stage.addEventListener(
            'wheel',
            (e) => {
                if (mode !== 'pages') return;
                if (e.target.closest('.design-jump-nav') && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                    return;
                }
                if (isTypingTarget(e.target) || zoomOpen()) return;
                const primary = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
                const page = pages[index];
                if (wheelMode === 'edge') {
                    if (nestedCanScroll(e.target, page, primary)) return;
                    if (pageCanScroll(page, primary)) return;
                }
                e.preventDefault();
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
    }

    if (mode === 'pages') {
        folder.addEventListener(
            'touchmove',
            (e) => {
                if (e.target.closest('.design-jump-nav')) return;
                const page = pages[index];
                const dy = touchY - (e.touches[0]?.clientY || touchY);
                if (nestedCanScroll(e.target, page, dy) || pageCanScroll(page, dy)) return;
                e.preventDefault();
            },
            { passive: false }
        );
        folder.addEventListener(
            'touchstart',
            (e) => {
                if (!e.touches[0]) return;
                touchX = e.touches[0].clientX;
                touchY = e.touches[0].clientY;
            },
            { passive: true }
        );
        folder.addEventListener(
            'touchend',
            (e) => {
                if (e.target.closest('.design-jump-nav')) return;
                const touch = e.changedTouches[0];
                if (!touch) return;
                const dx = touchX - touch.clientX;
                const dy = touchY - touch.clientY;
                if (Math.max(Math.abs(dx), Math.abs(dy)) < 36) return;
                const page = pages[index];
                const primary = Math.abs(dy) >= Math.abs(dx) ? dy : dx;
                if (nestedCanScroll(e.target, page, primary) || pageCanScroll(page, primary)) return;
                const dir = Math.abs(dy) >= Math.abs(dx) ? (dy > 0 ? 1 : -1) : (dx > 0 ? 1 : -1);
                flip(dir);
            },
            { passive: true }
        );
    }

    stage.addEventListener('click', (e) => {
        const link = e.target.closest(`${linkSelector}`);
        if (!link || !stage.contains(link)) return;
        if (link.hash || link.dataset.filter) {
            e.preventDefault();
            e.stopPropagation();
            activateLink(link);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (bodyClass && !document.body.classList.contains(bodyClass)) return;
        if (isTypingTarget(e.target) || zoomOpen()) return;
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            if (mode === 'pages') flip(1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            if (mode === 'pages') flip(-1);
        }
    });

    const refit = () => {
        relayoutTabs();
        placeTabs(index);
    };
    window.addEventListener('resize', refit);
    if (typeof ResizeObserver === 'function') {
        const observer = new ResizeObserver(() => {
            if (!layingOutTabs) refit();
        });
        observer.observe(stage);
        observer.observe(folder);
    }

    if (mode === 'tabs') {
        const links = getLinks();
        const hashLink = links.find((link) => link.hash && link.hash === window.location.hash);
        const startLink = hashLink || links[0];
        if (startLink) activateLink(startLink);
        else relayoutTabs();
        return;
    }

    const startId = window.location.hash.slice(1);
    const start = pages.findIndex((page) => page.id === startId);
    show(start >= 0 ? start : 0);
}

function wrapProjectFilePaper() {
    if (document.body.classList.contains('writing-page')) return;
    const panel = document.querySelector('.project-text-panel');
    if (!panel || panel.querySelector('.project-about-paper')) return;
    if (!document.querySelector('.project-images-panel')) return;

    const paper = document.createElement('div');
    paper.className = 'project-about-paper';
    const back = panel.querySelector('.project-back-link');
    Array.from(panel.children).forEach((child) => {
        if (child !== back) paper.appendChild(child);
    });
    panel.appendChild(paper);
}

document.addEventListener('DOMContentLoaded', () => {
    wrapProjectFilePaper();
    initSidebar();
    initRandomAccentHovers();
});

/** Accent hover — cycle while hovering, choose randomly on click. */
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
        { selector: '.info-read-more-btn', mode: 'text' },
        { selector: '.info-about-extended .info-link', mode: 'text' },
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
        { selector: '.motion-archive-download', mode: 'text' },
        { selector: '.motion-archive-card-title a', mode: 'text' },
        { selector: '.motion-archive-project-thumb', mode: 'border' },
        { selector: '.project-blurb a', mode: 'text' },
        { selector: '.project-text a', mode: 'text' },
        { selector: '.writing-chapter a', mode: 'text' },
    ];

    const ROOT_SELECTOR = TARGETS.map((config) => config.selector).join(', ');
    const ACCENT_MODES = ['text', 'name', 'spotlight', 'pill', 'border', 'button'];

    let activeEl = null;
    let activeMode = null;
    let cycleTimer = null;
    let accentIndex = 0;

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

    function nextAccent() {
        const accent = ACCENT_POOL[accentIndex % ACCENT_POOL.length];
        accentIndex += 1;
        return accent;
    }

    function applyAccent(el, mode, accentConfig) {
        const { accent, soft } = accentConfig;
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

    function stopAccentCycle() {
        if (cycleTimer) {
            clearInterval(cycleTimer);
            cycleTimer = null;
        }
    }

    function startAccentCycle() {
        stopAccentCycle();
        if (!activeEl || !activeMode) return;
        cycleTimer = setInterval(() => {
            if (!activeEl || !activeMode) {
                stopAccentCycle();
                return;
            }
            applyAccent(activeEl, activeMode, nextAccent());
        }, 1200);
    }

    function clearAccent(el) {
        stopAccentCycle();
        el.classList.remove(
            'has-accent-hover',
            'accent-hover--text',
            'accent-hover--name',
            'accent-hover--spotlight',
            'accent-hover--pill',
            'accent-hover--border',
            'accent-hover--button'
        );
        el.style.removeProperty('--accent-hover');
        el.style.removeProperty('--accent-hover-soft');
    }

    function setActive(next, mode) {
        if (activeEl && activeEl !== next) clearAccent(activeEl);
        activeEl = next;
        activeMode = mode;
        if (activeEl) {
            accentIndex = 0;
            applyAccent(activeEl, activeMode, nextAccent());
            startAccentCycle();
        }
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
            activeMode = null;
        },
        { passive: true }
    );

    document.addEventListener(
        'click',
        (e) => {
            const hit = resolveTarget(e.target);
            if (!hit) return;
            stopAccentCycle();
            activeEl = hit.el;
            activeMode = hit.mode;
            applyAccent(activeEl, activeMode, pickAccent());
        },
        { passive: true }
    );
}
