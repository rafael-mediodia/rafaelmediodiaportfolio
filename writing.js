/**
 * Add your writing here. Each entry appears in the Writing archive panel.
 *
 * href: full URL or site path (e.g. writing/my-essay.html)
 * external: true opens in a new tab (default for http links)
 */
const writings = [
    {
        id: 'words-on-making-my-mark',
        title: 'Words on Making My Mark',
        year: '2026',
        venue: 'Essay',
        excerpt: 'Writing from my thesis. The Mark and The Assembly.',
        href: 'writing/words-on-making-my-mark.html',
        external: false,
    },
    {
        id: 'little-bits-of-odd',
        title: 'Little Bits of Odd',
        venue: 'Fiction',
        excerpt:
            'Stories around the Greater Tree — landing, rides, reunions, and goodbyes.',
        href: 'writing/little-bits-of-odd.html',
        external: false,
    },
    {
        id: 'parts-of-a-whole',
        title: 'Parts Of A Whole',
        venue: 'Fiction',
        excerpt:
            'A broken mug, a blue house, and a monster with a twig.',
        href: 'writing/parts-of-a-whole.html',
        external: false,
    },
];

let writingInitialized = false;

function isExternalHref(href) {
    return /^https?:\/\//i.test(href);
}

function renderWritingList(container) {
    if (!writings.length) {
        container.innerHTML =
            '<p class="archive-panel-placeholder">Add pieces in <code>writing.js</code> — title, year, excerpt, and link.</p>';
        return;
    }

    const list = document.createElement('ul');
    list.className = 'writing-list';

    writings.forEach((piece) => {
        const item = document.createElement('li');
        item.className = 'writing-item';

        const link = document.createElement('a');
        link.className = 'writing-link';
        link.href = piece.href;
        const external = piece.external ?? isExternalHref(piece.href);
        if (external) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }

        const title = document.createElement('span');
        title.className = 'writing-title';
        title.textContent = piece.title;

        const metaParts = [piece.year, piece.venue].filter(Boolean);
        link.appendChild(title);
        if (metaParts.length) {
            const meta = document.createElement('span');
            meta.className = 'writing-meta';
            meta.textContent = metaParts.join(' · ');
            link.appendChild(meta);
        }
        if (piece.excerpt) {
            const excerpt = document.createElement('span');
            excerpt.className = 'writing-excerpt';
            excerpt.textContent = piece.excerpt;
            link.appendChild(excerpt);
        }

        item.appendChild(link);
        list.appendChild(item);
    });

    container.innerHTML = '';
    container.appendChild(list);
}

function bootWriting() {
    const list = document.getElementById('writingList');
    if (!list || writingInitialized) return;
    writingInitialized = true;
    renderWritingList(list);
}

function setupWritingOnPage() {
    if (!document.getElementById('writingList')) return;

    if (document.getElementById('archivePanels')) {
        if (typeof registerArchivePanelBoot === 'function') {
            registerArchivePanelBoot('writing', bootWriting);
        }
        if (document.querySelector('.archive-panel[data-panel="writing"]')?.classList.contains('archive-panel--open')) {
            bootWriting();
        }
    } else {
        bootWriting();
    }
}

document.addEventListener('DOMContentLoaded', setupWritingOnPage);
