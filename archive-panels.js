const archivePanelBoot = new Map();
const panelScriptPromises = new Map();

function prefersTouchInteraction() {
    return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

function initTouchUi() {
    if (prefersTouchInteraction()) {
        document.body.classList.add('touch-ui');
    }
}

function scrollArchivePanelIntoView(panel) {
    if (!prefersTouchInteraction() || !panel) return;
    requestAnimationFrame(() => {
        const toggle = panel.querySelector('.archive-panel-toggle');
        (toggle || panel).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
}

const PANEL_SCRIPTS = {
    motion: 'motion.js',
    illustrations: 'illustrations.js',
};

window.registerArchivePanelBoot = (panelId, fn) => {
    archivePanelBoot.set(panelId, fn);
};

function scheduleIdle(fn) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(fn, { timeout: 200 });
    } else {
        setTimeout(fn, 16);
    }
}

function loadPanelScript(panelId) {
    const src = PANEL_SCRIPTS[panelId];
    if (!src) return Promise.resolve();
    if (!panelScriptPromises.has(src)) {
        panelScriptPromises.set(
            src,
            new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            })
        );
    }
    return panelScriptPromises.get(src);
}

function schedulePanelBoot(panelId) {
    requestAnimationFrame(() => {
        scheduleIdle(async () => {
            try {
                await loadPanelScript(panelId);
                archivePanelBoot.get(panelId)?.();
            } catch (err) {
                console.error(`Failed to load ${panelId} panel`, err);
            }
        });
    });
}

function pausePanelMedia(panel) {
    panel?.querySelectorAll('video').forEach((v) => {
        v.pause();
    });
}

function setPanelOpen(panel, open) {
    const toggle = panel.querySelector('.archive-panel-toggle');
    panel.classList.toggle('archive-panel--open', open);
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) pausePanelMedia(panel);
}

function closeOtherArchivePanels(exceptPanel) {
    document.querySelectorAll('.archive-panel').forEach((panel) => {
        if (panel !== exceptPanel) {
            setPanelOpen(panel, false);
        }
    });
}

function closeAllArchivePanels() {
    document.querySelectorAll('.archive-panel').forEach((panel) => {
        setPanelOpen(panel, false);
    });
}

function openArchivePanel(panelId) {
    const panel = document.querySelector(`.archive-panel[data-panel="${panelId}"]`);
    if (!panel) return;

    const wasOpen = panel.classList.contains('archive-panel--open');

    if (wasOpen) {
        setPanelOpen(panel, false);
        history.replaceState(null, '', window.location.pathname);
        return;
    }

    closeOtherArchivePanels(panel);
    setPanelOpen(panel, true);
    scrollArchivePanelIntoView(panel);
    history.replaceState(null, '', `#${panelId}`);
    document.dispatchEvent(
        new CustomEvent('archive-panel-open', { detail: panelId })
    );

    if (panelId === 'typefaces') {
        return;
    }

    if (panelId === 'writing') {
        archivePanelBoot.get(panelId)?.();
        return;
    }

    schedulePanelBoot(panelId);
}

window.openArchivePanel = openArchivePanel;
window.closeAllArchivePanels = closeAllArchivePanels;

function initArchivePanels() {
    const wrap = document.getElementById('archivePanels');
    if (!wrap) return;

    initTouchUi();

    wrap.addEventListener('click', (e) => {
        const toggle = e.target.closest('.archive-panel-toggle');
        if (!toggle || !wrap.contains(toggle)) return;

        e.preventDefault();
        const panel = toggle.closest('.archive-panel');
        const panelId = panel?.getAttribute('data-panel');
        if (!panelId) return;

        openArchivePanel(panelId);
    });

    wrap.addEventListener(
        'touchstart',
        (e) => {
            const toggle = e.target.closest('.archive-panel-toggle');
            if (toggle && wrap.contains(toggle)) {
                toggle.classList.add('archive-panel-toggle--pressed');
            }
        },
        { passive: true }
    );

    wrap.addEventListener('touchend', (e) => {
        wrap.querySelectorAll('.archive-panel-toggle--pressed').forEach((el) => {
            el.classList.remove('archive-panel-toggle--pressed');
        });
    });

    wrap.addEventListener('touchcancel', () => {
        wrap.querySelectorAll('.archive-panel-toggle--pressed').forEach((el) => {
            el.classList.remove('archive-panel-toggle--pressed');
        });
    });

    const hash = window.location.hash.replace('#', '');
    if (hash && document.querySelector(`.archive-panel[data-panel="${hash}"]`)) {
        requestAnimationFrame(() => openArchivePanel(hash));
    }
}

document.addEventListener('DOMContentLoaded', initArchivePanels);
