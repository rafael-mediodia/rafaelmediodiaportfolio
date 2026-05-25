const TYPEFACES_BASE = 'Typefaces';
const TYPEFACE_EMAIL = 'rmediodi@risd.edu';

const typefaces = [
    {
        id: 'istorya',
        name: 'Istorya',
        stack: 'sans-serif',
        description:
            "Istorya is Ilonggo for “story.” A textface designed for holding children's book stories. Created from a study of ATF Garamond and Century Schoolbook.",
    },
    {
        id: 'clayletter',
        name: 'Clayletter',
        stack: 'sans-serif',
        description: 'Clayletter is a display typeface constructed from real clayforms.',
    },
    {
        id: 'suburb',
        name: 'Suburb',
        stack: 'monospace',
        variableFont: true,
        listScale: true,
        testerDefaultSize: 64,
        titleAxisAnimation: true,
        variationFallback: [{ tag: 'wdth', min: 400, max: 900, default: 400 }],
        axisLabels: { wdth: 'House' },
        variationStates: [
            { label: 'wdth 400', coords: { wdth: 400 } },
            { label: 'wdth 500', coords: { wdth: 500 } },
            { label: 'wdth 900', coords: { wdth: 900 } },
        ],
        description:
            'Suburb is a pixel typeface whose units are drawn as houses rather than pixels, with their proportions shifting along a variable House axis.',
    },
    {
        id: 'pearface',
        name: 'PearFace',
        stack: 'sans-serif',
        description:
            'PearFace is a funky display typeface drawn from the outlines of a pear.',
    },
    {
        id: 'rough-pixel',
        name: 'Rough Pixel',
        stack: 'monospace',
        description:
            'Rough Pixel is a typeface born from curiosity about combining digital and analog marks with pixels.',
    },
    {
        id: 'sketchface',
        name: 'Sketchface',
        stack: 'sans-serif',
        description:
            'Sketchface is a set of glyphs designed for building texture and drawings.',
    },
    {
        id: 'warp-woven',
        name: 'Warp Woven',
        stack: 'sans-serif',
        description:
            'Warp Woven is a typeface created from an odd array of lines that form a grid.',
    },
];

const glyphCache = new Map();
let opentypePromise = null;
let activeId = null;

function typefaceFontUrl(face) {
    return `${TYPEFACES_BASE}/${face.id}/${face.fontFile || 'font.woff2'}`;
}

function typefaceFamily(face) {
    const stack = face.stack || 'sans-serif';
    return `'${face.name.replace(/'/g, "\\'")}', ${stack}`;
}

async function waitForTypeface(face) {
    const family = typefaceFamily(face);
    try {
        await Promise.all(
            ['32px', '48px'].map((size) =>
                document.fonts.load(`${size} ${family}`).catch(() => {})
            )
        );
        await document.fonts.ready;
    } catch (_) {
        /* fonts API unavailable */
    }
}

function injectTypefaceFonts() {
    const existing = document.getElementById('typeface-font-styles');
    if (existing) existing.remove();

    const rules = typefaces
        .map((face) => {
            const family = face.name.replace(/'/g, "\\'");
            const url = typefaceFontUrl(face);
            const stretch = face.variableFont ? 'font-stretch:40% 90%;' : '';
            return `@font-face{font-family:'${family}';src:url('${url}') format('woff2');font-weight:normal;font-style:normal;${stretch}font-display:swap;}`;
        })
        .join('');

    const style = document.createElement('style');
    style.id = 'typeface-font-styles';
    style.textContent = rules;
    document.head.appendChild(style);
}

function loadOpentype() {
    if (window.opentype) return Promise.resolve(window.opentype);
    if (opentypePromise) return opentypePromise;

    opentypePromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'vendor/opentype.min.js';
        script.async = true;
        script.onload = () => resolve(window.opentype);
        script.onerror = () => reject(new Error('Failed to load opentype.js'));
        document.head.appendChild(script);
    });

    return opentypePromise;
}

function glyphSortKey(char) {
    if (/[A-Z]/.test(char)) return [0, char.codePointAt(0)];
    if (/[a-z]/.test(char)) return [1, char.codePointAt(0)];
    if (/[0-9]/.test(char)) return [2, char.codePointAt(0)];
    if (/\s/.test(char)) return [3, 0];
    return [4, char.codePointAt(0)];
}

function sortGlyphChars(chars) {
    return [...chars].sort((a, b) => {
        const [ga, ca] = glyphSortKey(a);
        const [gb, cb] = glyphSortKey(b);
        return ga !== gb ? ga - gb : ca - cb;
    });
}

function isNotdefGlyph(glyph) {
    const name = glyph?.name || '';
    return name === '.notdef' || name === '.null';
}

function hasGlyphInFont(map, cp) {
    const gid = map[cp] ?? map[String(cp)];
    return gid && gid !== 0 && gid !== '0' && gid !== '.notdef';
}

function glyphHasOutline(font, char) {
    if (char === ' ') return hasGlyphInFont(font.tables?.cmap?.glyphIndexMap, 0x20);

    const glyph = font.charToGlyph(char);
    if (!glyph?.path?.commands?.length) return false;

    return glyph.path.commands.some((cmd) => {
        if (cmd.type === 'Z') return false;
        return (
            cmd.x !== undefined ||
            cmd.y !== undefined ||
            cmd.x1 !== undefined ||
            cmd.y1 !== undefined
        );
    });
}

function extractCharsFromFont(font) {
    const map = font.tables?.cmap?.glyphIndexMap;
    if (!map) return [];

    const seen = new Set();
    const chars = [];

    Object.keys(map).forEach((key) => {
        const gid = map[key];
        if (gid === 0 || gid === '0' || gid === '.notdef') return;

        const cp = Number(key);
        if (!Number.isFinite(cp) || cp < 0x20 || cp > 0x7e) return;

        const char = String.fromCodePoint(cp);
        if (seen.has(char)) return;

        const glyph = font.charToGlyph(char);
        if (!glyph || isNotdefGlyph(glyph)) return;
        if (!glyphHasOutline(font, char)) return;

        seen.add(char);
        chars.push(char);
    });

    return finalizeCharset(chars, map);
}

function finalizeCharset(chars, cmap) {
    const list = [...chars];
    if (!list.includes(' ') && (!cmap || hasGlyphInFont(cmap, 0x20))) {
        list.push(' ');
    }
    return sortGlyphChars(list);
}

async function loadCharsetFromJson(face) {
    try {
        const res = await fetch(`${TYPEFACES_BASE}/${face.id}/charset.json`, {
            cache: 'no-cache',
        });
        if (!res.ok) return null;

        const data = await res.json();
        if (!Array.isArray(data.chars) || !data.chars.length) return null;

        const chars = finalizeCharset([...new Set(data.chars)]);
        return {
            chars,
            allowed: new Set(chars),
            axes: face.variationFallback || [],
            instances: [],
        };
    } catch (_) {
        return null;
    }
}

function getVariableAxes(font) {
    const fvar = font.tables?.fvar;
    if (!fvar?.axes?.length) return [];

    return fvar.axes.map((axis) => ({
        tag: axis.tag,
        min: axis.minValue,
        max: axis.maxValue,
        default: axis.defaultValue,
    }));
}

function getVariableInstances(font) {
    const fvar = font.tables?.fvar;
    if (!fvar?.instances?.length || !fvar?.axes?.length) return [];

    return fvar.instances.map((instance) => {
        const coords = {};
        const raw = instance.coordinates;
        if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
            Object.assign(coords, raw);
        } else {
            fvar.axes.forEach((axis, i) => {
                coords[axis.tag] = raw[i];
            });
        }
        const rawName =
            instance.name?.en ||
            instance.name?.['en-US'] ||
            Object.values(instance.name || {})[0] ||
            '';
        const name =
            rawName && rawName !== 'Instance' ? rawName : formatStateLabel(coords);
        return { name, coords };
    });
}

async function loadGlyphSet(face) {
    if (glyphCache.has(face.id)) return glyphCache.get(face.id);

    injectTypefaceFonts();
    await waitForTypeface(face);

    let data = await loadCharsetFromJson(face);

    if (!data) {
        let chars = [];
        let axes = face.variationFallback || [];
        let instances = [];

        try {
            const ot = await loadOpentype();
            const font = await ot.load(typefaceFontUrl(face));
            chars = extractCharsFromFont(font);
            axes = getVariableAxes(font);
            instances = getVariableInstances(font);
            if (!axes.length && face.variationFallback?.length) {
                axes = face.variationFallback;
            }
        } catch (_) {
            chars = [];
        }

        data = {
            chars,
            allowed: new Set(chars),
            axes,
            instances,
        };
    } else if (face.variableFont) {
        try {
            const ot = await loadOpentype();
            const font = await ot.load(typefaceFontUrl(face));
            let axes = getVariableAxes(font);
            const instances = getVariableInstances(font);
            if (!axes.length && face.variationFallback?.length) {
                axes = face.variationFallback;
            }
            data.axes = axes;
            data.instances = instances;
        } catch (_) {
            /* keep json defaults */
        }
    }

    glyphCache.set(face.id, data);
    return data;
}

const AXIS_LABELS = {
    wdth: 'Width',
    wght: 'Weight',
    opsz: 'Optical size',
};

function buildVariationSettings(coords) {
    return Object.entries(coords)
        .map(([tag, value]) => `'${tag}' ${value}`)
        .join(', ');
}

function getVariationAxes(face, charset) {
    const axes = charset.axes?.length ? charset.axes : face.variationFallback;
    if (!axes?.length) return [];

    return axes.map((axis) => ({
        tag: axis.tag,
        label: face.axisLabels?.[axis.tag] || AXIS_LABELS[axis.tag] || axis.tag,
        min: axis.min,
        max: axis.max,
        default: axis.default ?? axis.min,
    }));
}

function defaultVariationCoords(axes) {
    return Object.fromEntries(axes.map((axis) => [axis.tag, axis.default]));
}

function formatStateLabel(coords, fallbackName) {
    if (fallbackName) return fallbackName;
    return Object.entries(coords)
        .map(([tag, value]) => `${tag} ${value}`)
        .join(' · ');
}

function getVariationStates(face, charset) {
    if (charset.instances?.length >= 2) {
        return charset.instances.map((instance) => ({
            label: formatStateLabel(instance.coords, instance.name),
            settings: buildVariationSettings(instance.coords),
        }));
    }

    if (face.variationStates?.length) {
        return face.variationStates.map((state) => ({
            label: state.label,
            settings: buildVariationSettings(state.coords),
        }));
    }

    const axes = charset.axes?.length ? charset.axes : face.variationFallback;
    if (!axes?.length) return [];

    return axes.flatMap((axis) => [
        {
            label: `${axis.tag} ${axis.min}`,
            settings: `'${axis.tag}' ${axis.min}`,
        },
        {
            label: `${axis.tag} ${axis.default ?? Math.round((axis.min + axis.max) / 2)}`,
            settings: `'${axis.tag}' ${axis.default ?? Math.round((axis.min + axis.max) / 2)}`,
        },
        {
            label: `${axis.tag} ${axis.max}`,
            settings: `'${axis.tag}' ${axis.max}`,
        },
    ]);
}

function renderGlyphCells(chars) {
    return chars
        .map((c) => `<span class="typeface-glyph">${c === ' ' ? '\u00b7' : c}</span>`)
        .join('');
}

function renderVariableStates(container, face, charset) {
    const family = typefaceFamily(face);
    const scaleClass = face.listScale ? ' typeface-glyphs-grid--scaled' : '';
    const states = getVariationStates(face, charset);

    if (!charset.chars.length) {
        container.innerHTML =
            '<p class="typeface-glyphs-loading">No characters in this font.</p>';
        return;
    }

    if (!states.length) {
        renderGlyphGrid(container, face, charset);
        return;
    }

    container.innerHTML = states
        .map(
            (state) => `
        <div class="typeface-state">
            <div class="typeface-state-track">${state.label}</div>
            <div class="typeface-glyphs-grid${scaleClass}" style="font-family:${family};font-variation-settings:${state.settings}">${renderGlyphCells(charset.chars)}</div>
        </div>`
        )
        .join('');
}

function renderGlyphGrid(container, face, charset) {
    const family = typefaceFamily(face);
    const scaleClass = face.listScale ? ' typeface-glyphs-grid--scaled' : '';
    const axes = getVariationAxes(face, charset);

    if (!charset.chars.length) {
        container.innerHTML =
            '<p class="typeface-glyphs-loading">No characters in this font.</p>';
        return;
    }

    if (face.variableFont && axes.length) {
        const settings = buildVariationSettings(defaultVariationCoords(axes));
        container.innerHTML = `<div class="typeface-glyphs-grid${scaleClass}" data-glyphs-live style="font-family:${family};font-variation-settings:${settings}">${renderGlyphCells(charset.chars)}</div>`;
        return;
    }

    if (face.variableFont && getVariationStates(face, charset).length >= 2) {
        renderVariableStates(container, face, charset);
        return;
    }

    container.innerHTML = `<div class="typeface-glyphs-grid${scaleClass}" style="font-family:${family}">${renderGlyphCells(charset.chars)}</div>`;
}

function setupAxisControls(container, axes, { onChange, idPrefix }) {
    if (!container) return null;

    container.innerHTML = '';
    if (!axes.length) {
        container.hidden = true;
        return null;
    }

    container.hidden = false;
    const coords = defaultVariationCoords(axes);
    const valueEls = {};

    const apply = () => {
        onChange({ ...coords });
    };

    axes.forEach((axis) => {
        const row = document.createElement('div');
        row.className = 'typeface-axis-row';

        const label = document.createElement('label');
        label.className = 'typeface-tester-label';
        const inputId = `${idPrefix}-${axis.tag}`;
        label.htmlFor = inputId;
        label.textContent = axis.label;

        const input = document.createElement('input');
        input.type = 'range';
        input.id = inputId;
        input.className = 'typeface-axis-range';
        input.min = String(axis.min);
        input.max = String(axis.max);
        input.step = axis.tag === 'wdth' ? '1' : 'any';
        input.value = String(coords[axis.tag]);
        input.setAttribute('aria-label', `${axis.label} axis`);

        const value = document.createElement('span');
        value.className = 'typeface-axis-value';
        value.textContent = String(coords[axis.tag]);
        valueEls[axis.tag] = value;

        input.addEventListener('input', () => {
            coords[axis.tag] = Number(input.value);
            value.textContent = String(coords[axis.tag]);
            apply();
        });

        row.append(label, input, value);
        container.appendChild(row);
    });

    apply();
    return {
        coords,
        setCoords: (next) => {
            axes.forEach((axis) => {
                if (next[axis.tag] == null) return;
                coords[axis.tag] = next[axis.tag];
                const input = container.querySelector(`#${idPrefix}-${axis.tag}`);
                if (input) input.value = String(coords[axis.tag]);
                if (valueEls[axis.tag]) valueEls[axis.tag].textContent = String(coords[axis.tag]);
            });
        },
    };
}

function setupTester(root, face, charset) {
    const display = root.querySelector('[data-tester-display]');
    const sizeInput = root.querySelector('[data-tester-size]');
    const axesWrap = root.querySelector('[data-tester-axes]');
    const setAxesWrap = root.querySelector('[data-set-axes]');
    const glyphsLive = root.querySelector('[data-glyphs-live]');
    if (!display) return;

    const family = typefaceFamily(face);
    const allowed = charset.allowed;
    const defaultSize =
        face.testerDefaultSize ?? (face.listScale ? 48 : 28);
    const axes = getVariationAxes(face, charset);

    const applyVariation = (coords) => {
        const settings = buildVariationSettings(coords);
        display.style.fontVariationSettings = settings;
        if (glyphsLive) glyphsLive.style.fontVariationSettings = settings;
    };

    display.textContent = '';
    display.style.fontFamily = family;
    display.style.fontSize = `${defaultSize}px`;
    display.classList.toggle('typeface-tester-display--scaled', !!face.listScale);

    if (sizeInput) {
        sizeInput.value = String(defaultSize);
        sizeInput.min = String(face.listScale ? 28 : 14);
        sizeInput.max = String(face.listScale ? 96 : 72);
        sizeInput.oninput = () => {
            display.style.fontSize = `${sizeInput.value}px`;
        };
    }

    display.addEventListener('input', () => {
        const filtered = filterToAllowed(display.textContent, allowed);
        if (filtered !== display.textContent) {
            display.textContent = filtered;
        }
    });

    if (face.variableFont && axes.length) {
        let setControl = null;
        const testerControl = setupAxisControls(axesWrap, axes, {
            idPrefix: `typeface-axis-${face.id}-tester`,
            onChange: (coords) => {
                applyVariation(coords);
                setControl?.setCoords(coords);
            },
        });
        setControl = setupAxisControls(setAxesWrap, axes, {
            idPrefix: `typeface-axis-${face.id}-set`,
            onChange: (coords) => {
                applyVariation(coords);
                testerControl?.setCoords(coords);
            },
        });
    } else {
        if (axesWrap) axesWrap.hidden = true;
        if (setAxesWrap) setAxesWrap.hidden = true;
        display.style.fontVariationSettings = '';
    }
}

function setTitleAxisAnimation(item, face, on) {
    if (!item || !face?.titleAxisAnimation) return;
    item.classList.toggle('typeface-item--title-anim', on);
    if (!on) item.style.fontVariationSettings = '';
}

function filterToAllowed(text, allowed) {
    return [...text].filter((c) => allowed.has(c)).join('');
}

const DETAIL_TABS = [
    { id: 'info', label: 'Info' },
    { id: 'set', label: 'Character set' },
    { id: 'tester', label: 'Type tester' },
];

function setupDetailTabs(detail, defaultTab = 'tester') {
    const nav = detail.querySelector('[data-detail-nav]');
    if (!nav || nav.dataset.bound) return;

    const buttons = [...nav.querySelectorAll('[data-detail-tab]')];
    const panels = [...detail.querySelectorAll('[data-detail-panel]')];

    const activate = (tabId) => {
        buttons.forEach((btn) => {
            const on = btn.dataset.detailTab === tabId;
            btn.classList.toggle('typeface-detail-nav-btn--active', on);
            btn.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        panels.forEach((panel) => {
            panel.hidden = panel.dataset.detailPanel !== tabId;
        });
    };

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => activate(btn.dataset.detailTab));
    });

    nav.dataset.bound = '1';
    activate(defaultTab);
}

function createDetailPanel(face) {
    const detail = document.createElement('div');
    detail.className = 'typeface-detail';
    detail.hidden = true;
    detail.dataset.typefaceId = face.id;

    const testerSizeDefault =
        face.testerDefaultSize ?? (face.listScale ? 48 : 28);
    const testerSizeMin = face.listScale ? 28 : 14;
    const testerSizeMax = face.listScale ? 96 : 72;

    const navButtons = DETAIL_TABS.map(
        (tab) =>
            `<button type="button" class="typeface-detail-nav-btn" role="tab" data-detail-tab="${tab.id}" aria-selected="false">${tab.label}</button>`
    ).join('');

    detail.innerHTML = `
        <nav class="typeface-detail-nav" role="tablist" data-detail-nav aria-label="${face.name} details">
            ${navButtons}
        </nav>
        <div class="typeface-detail-panels">
            <div class="typeface-detail-panel" role="tabpanel" data-detail-panel="set" hidden>
                <div class="typeface-tester-axes" data-set-axes hidden></div>
                <div class="typeface-glyphs" data-glyphs></div>
            </div>
            <div class="typeface-detail-panel typeface-detail-panel--tester" role="tabpanel" data-detail-panel="tester">
                <div class="typeface-tester">
                    <div
                        class="typeface-tester-display"
                        data-tester-display
                        contenteditable="true"
                        spellcheck="false"
                        role="textbox"
                        aria-label="Type tester"
                    ></div>
                    <div class="typeface-tester-size-bar">
                        <label class="typeface-tester-label" for="typeface-size-${face.id}">Size</label>
                        <input type="range" id="typeface-size-${face.id}" data-tester-size class="typeface-tester-size" min="${testerSizeMin}" max="${testerSizeMax}" value="${testerSizeDefault}" aria-label="Type size">
                    </div>
                    <div class="typeface-tester-axes" data-tester-axes hidden></div>
                </div>
            </div>
            <div class="typeface-detail-panel" role="tabpanel" data-detail-panel="info" hidden>
                <div class="typeface-description-wrap">
                    <p class="typeface-description" data-description></p>
                </div>
                <a href="#" class="typeface-usage-email" data-usage-email></a>
            </div>
        </div>
    `;

    setupDetailTabs(detail, 'tester');
    return detail;
}

function showEntryDetail(entry, face) {
    const item = entry.querySelector('.typeface-item');
    const detail = entry.querySelector('.typeface-detail');
    const glyphsEl = detail.querySelector('[data-glyphs]');
    const descEl = detail.querySelector('[data-description]');
    const emailEl = detail.querySelector('[data-usage-email]');
    if (!detail || !glyphsEl || !item) return;

    detail.hidden = false;

    if (descEl) {
        descEl.textContent = face.description?.trim() || '';
    }

    glyphsEl.innerHTML = '<p class="typeface-glyphs-loading">Loading characters…</p>';

    requestAnimationFrame(() => {
        const touchLike = window.matchMedia('(hover: none), (pointer: coarse)').matches;
        entry.scrollIntoView({
            block: touchLike ? 'start' : 'nearest',
            behavior: 'smooth',
        });
    });

    const subject = face.emailSubject || `${face.name} usage inquiry`;
    if (emailEl) {
        emailEl.href = `mailto:${TYPEFACE_EMAIL}?subject=${encodeURIComponent(subject)}`;
        emailEl.textContent = `If you are curious about using these typefaces, email me at ${TYPEFACE_EMAIL}`;
    }

    loadGlyphSet(face)
        .then((charset) => {
            if (activeId !== face.id) return;
            renderGlyphGrid(glyphsEl, face, charset);
            setupTester(detail, face, charset);
        })
        .catch(() => {
            if (activeId !== face.id) return;
            glyphsEl.innerHTML =
                '<p class="typeface-glyphs-loading">Could not load characters.</p>';
        });
}

function hideAllDetails(list) {
    list.querySelectorAll('.typeface-entry').forEach((entry) => {
        const item = entry.querySelector('.typeface-item');
        const face = typefaces.find((f) => f.id === item?.getAttribute('data-typeface-id'));
        setTitleAxisAnimation(item, face, false);
        const detail = entry.querySelector('.typeface-detail');
        if (detail) detail.hidden = true;
    });
}

function initTypefacesList() {
    const list = document.getElementById('typefacesList');
    if (!list) return;

    injectTypefaceFonts();
    loadOpentype().catch(() => {});

    document.addEventListener('archive-panel-open', (e) => {
        if (e.detail === 'typefaces') loadOpentype().catch(() => {});
    });

    const fragment = document.createDocumentFragment();

    typefaces.forEach((face) => {
        const entry = document.createElement('div');
        entry.className = 'typeface-entry';
        if (face.listScale) entry.classList.add('typeface-entry--scaled');

        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'typeface-item';
        if (face.listScale) item.classList.add('typeface-item--scaled');
        item.setAttribute('data-typeface-id', face.id);
        item.setAttribute('aria-expanded', 'false');
        item.style.fontFamily = typefaceFamily(face);
        item.textContent = face.name;

        const detail = createDetailPanel(face);

        item.addEventListener('click', () => {
            const isOpen = activeId === face.id;

            list.querySelectorAll('.typeface-item').forEach((el) => {
                el.classList.remove('typeface-item--open');
                el.setAttribute('aria-expanded', 'false');
            });
            hideAllDetails(list);

            if (isOpen) {
                activeId = null;
                return;
            }

            activeId = face.id;
            item.classList.add('typeface-item--open');
            item.setAttribute('aria-expanded', 'true');
            setTitleAxisAnimation(item, face, true);
            showEntryDetail(entry, face);
        });

        entry.appendChild(item);
        entry.appendChild(detail);
        fragment.appendChild(entry);
    });

    list.appendChild(fragment);
}

const TYPEFACE_THUMB_PALETTES = [
    { bg: '#fafafa', fg: '#000000' },
    { bg: '#1a1a1a', fg: '#f5f5f5' },
    { bg: '#7cb342', fg: '#0f1608' },
    { bg: '#e8d4b8', fg: '#2a1810' },
    { bg: '#1e4178', fg: '#eef3ff' },
    { bg: '#f3b5c7', fg: '#2a1020' },
    { bg: '#2d4a3e', fg: '#e8f5e9' },
    { bg: '#f0e04a', fg: '#1a1800' },
];

function buildTypefaceThumbSlides() {
    return typefaces.map((face, index) => {
        const palette = TYPEFACE_THUMB_PALETTES[index % TYPEFACE_THUMB_PALETTES.length];
        let fontVariationSettings = '';
        if (face.variableFont && face.id === 'suburb') {
            fontVariationSettings = '"wdth" 650';
        }
        return {
            label: face.name,
            family: typefaceFamily(face),
            bg: palette.bg,
            fg: palette.fg,
            fontVariationSettings,
            large: face.id === 'suburb',
        };
    });
}

function createTypefaceThumbSlide(slide) {
    const layer = document.createElement('div');
    layer.className = 'typeface-thumb-slide';
    layer.style.backgroundColor = slide.bg;

    const label = document.createElement('span');
    label.className = 'typeface-thumb-label';
    label.textContent = slide.label;
    label.style.fontFamily = slide.family;
    label.style.color = slide.fg;
    if (slide.fontVariationSettings) {
        label.style.fontVariationSettings = slide.fontVariationSettings;
    }
    if (slide.large) {
        label.classList.add('typeface-thumb-label--large');
    }

    layer.appendChild(label);
    return layer;
}

function initTypefaceGalleryThumb(thumb) {
    injectTypefaceFonts();
    const slides = buildTypefaceThumbSlides();
    if (!slides.length) return;

    thumb.classList.add('typeface-thumb');
    thumb.style.position = 'relative';

    const slideA = createTypefaceThumbSlide(slides[0]);
    const slideB = createTypefaceThumbSlide(slides[1] || slides[0]);
    slideA.style.opacity = '1';
    slideB.style.opacity = '0';
    slideB.style.pointerEvents = 'none';
    thumb.appendChild(slideA);
    thumb.appendChild(slideB);

    let index = 0;
    let active = slideA;
    let next = slideB;
    let cycleTimer = null;
    let isInitialized = false;

    function applySlide(layer, slide) {
        layer.style.backgroundColor = slide.bg;
        const label = layer.querySelector('.typeface-thumb-label');
        label.textContent = slide.label;
        label.style.fontFamily = slide.family;
        label.style.color = slide.fg;
        label.style.fontVariationSettings = slide.fontVariationSettings || '';
        label.classList.toggle('typeface-thumb-label--large', !!slide.large);
    }

    function switchSlide() {
        const nextIndex = (index + 1) % slides.length;
        const nextSlide = slides[nextIndex];
        applySlide(next, nextSlide);

        active.style.opacity = '0';
        next.style.opacity = '1';
        next.style.pointerEvents = 'none';
        active.style.pointerEvents = 'none';

        const temp = active;
        active = next;
        next = temp;
        index = nextIndex;
    }

    function startCycling() {
        if (cycleTimer) return;
        cycleTimer = window.setInterval(switchSlide, 3200);
    }

    function stopCycling() {
        if (!cycleTimer) return;
        window.clearInterval(cycleTimer);
        cycleTimer = null;
    }

    const thumbObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (!isInitialized) {
                        isInitialized = true;
                        slides.forEach((slide) => {
                            document.fonts?.load?.(`16px ${slide.family}`);
                        });
                    }
                    startCycling();
                } else {
                    stopCycling();
                }
            });
        },
        { rootMargin: '25px' }
    );

    thumbObserver.observe(thumb);
    window.addEventListener('beforeunload', stopCycling);
}

window.initTypefaceGalleryThumb = initTypefaceGalleryThumb;

document.addEventListener('DOMContentLoaded', initTypefacesList);
