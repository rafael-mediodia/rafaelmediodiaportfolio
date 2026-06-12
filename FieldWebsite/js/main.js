(function () {
  'use strict';

  const ARTISTS = [
    'audrey hobert',
    'grentperez',
    'orion sun',
    'mk gee',
    'dijon',
    'hemlocke springs',
    'clairo',
    'greer',
  ];

  const EXCLUSION_SELECTORS = [
    '.site-header',
    '.hero__intro',
    '.hero__headlines',
    '.hero__more',
    '.hero__indicators',
    '.notes-entry',
    '.notes-back',
    '.article-hero__content',
    '.article__sheet',
    '.entry-notice',
  ];

  function varyCase(name, pattern) {
    let letterIndex = 0;
    return name.split('').map((ch) => {
      if (ch === ' ') return ' ';
      if (!/[a-z]/i.test(ch)) return '';
      const useUpper = pattern === 'random'
        ? Math.random() > 0.45
        : (letterIndex + pattern) % 2 === 0;
      letterIndex += 1;
      return useUpper ? ch.toUpperCase() : ch.toLowerCase();
    }).join('');
  }

  function collectLetters(artists, targetCount) {
    const letters = [];
    const patterns = ['random', 0, 1, 2, 3];
    let round = 0;

    while (letters.length < targetCount) {
      for (const artist of artists) {
        const pattern = patterns[round % patterns.length];
        const varied = varyCase(artist, pattern);
        for (const ch of varied) {
          if (/[a-zA-Z]/.test(ch)) letters.push(ch);
        }
      }
      round += 1;
    }

    return letters.slice(0, targetCount);
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function getExclusionRects(container) {
    const containerRect = container.getBoundingClientRect();
    const scope = container.closest('.hero, .hero__slide, .notes-page__canvas, .article-hero') || container;
    const padding = 20;
    const rects = [];

    EXCLUSION_SELECTORS.forEach((selector) => {
      scope.querySelectorAll(selector).forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        rects.push({
          left: rect.left - containerRect.left - padding,
          top: rect.top - containerRect.top - padding,
          right: rect.right - containerRect.left + padding,
          bottom: rect.bottom - containerRect.top + padding,
        });
      });
    });

    return rects;
  }

  function overlapsText(rects, x, y, size) {
    const half = size * 0.55;
    const left = x - half;
    const top = y - half;
    const right = x + half;
    const bottom = y + half;

    return rects.some((rect) => (
      left < rect.right
      && right > rect.left
      && top < rect.bottom
      && bottom > rect.top
    ));
  }

  function isFarEnough(placed, x, y, minDistance) {
    return placed.every((point) => Math.hypot(point.x - x, point.y - y) >= minDistance);
  }

  const FLEURON_DENSITY = {
    normal: {
      minDistance: 86,
      relaxedDistance: 0,
      glyphSize: 32,
      sizeMin: 0.88,
      sizeMax: 1.12,
      extraRatio: 0,
    },
    high: {
      minDistance: 54,
      relaxedDistance: 32,
      glyphSize: 28,
      sizeMin: 0.68,
      sizeMax: 1.42,
      extraRatio: 0.4,
    },
  };

  function randomFleuronCoord(margin, span, bias, axis) {
    if (bias !== 'right' || axis !== 'x' || Math.random() <= 0.28) {
      return margin + Math.random() * span;
    }

    return margin + span * 0.38 + Math.random() * span * 0.62;
  }

  function createFleuronGlyph(ch, x, y, color, index, sizeRem = 2) {
    const el = document.createElement('span');
    const baseChar = ch.toLowerCase();
    const isFlower = ch === ch.toUpperCase() && /[a-z]/i.test(ch);

    el.className = 'fleuron-glyph';
    if (isFlower) el.classList.add('is-flower');
    if (sizeRem < 1.55) el.classList.add('is-small');
    if (sizeRem > 2.35) el.classList.add('is-large');
    el.setAttribute('aria-hidden', 'true');
    el.dataset.baseChar = baseChar;
    el.dataset.fleuronChar = ch;
    el.textContent = ch;
    el.style.color = color;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.fontSize = `${sizeRem}rem`;
    el.style.setProperty('--fleuron-enter', `${(index % 14) * 0.055}s`);
    el.style.setProperty('--fleuron-drift', `${-((index % 10) * 0.35)}s`);
    el.style.setProperty('--fleuron-sway-x', `${(index % 2 === 0 ? 1 : -1) * (3 + (index % 4))}px`);
    el.style.setProperty('--fleuron-sway-y', `${(index % 3 === 0 ? 1 : -1) * (4 + (index % 3))}px`);
    el.style.setProperty('--fleuron-sway-duration', `${4.8 + (index % 5) * 0.7}s`);

    return el;
  }

  function populateFleurons(container) {
    const color = container.dataset.fleuronsColor || container.dataset.fleurons || 'currentColor';
    const artists = (container.dataset.artists || ARTISTS.join(','))
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean);
    const densityKey = container.dataset.fleuronsDensity || 'normal';
    const density = FLEURON_DENSITY[densityKey] || FLEURON_DENSITY.normal;
    const bias = container.dataset.fleuronsBias || '';
    const baseCount = parseInt(container.dataset.fleuronsCount || '28', 10);
    const extraCount = Math.floor(baseCount * density.extraRatio);
    const letters = shuffle(collectLetters(artists, baseCount + extraCount));
    const containerRect = container.getBoundingClientRect();

    if (containerRect.width === 0 || containerRect.height === 0) return;

    const exclusionRects = getExclusionRects(container);
    const placed = [];
    const margin = density.glyphSize;
    const spanX = containerRect.width - margin * 2;
    const spanY = containerRect.height - margin * 2;
    let glyphIndex = 0;

    function tryPlace(ch, minDistance, hitSize, sizeMin, sizeMax, maxAttempts) {
      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const x = randomFleuronCoord(margin, spanX, bias, 'x');
        const y = randomFleuronCoord(margin, spanY, bias, 'y');

        if (overlapsText(exclusionRects, x, y, hitSize)) continue;
        if (!isFarEnough(placed, x, y, minDistance)) continue;

        const sizeRem = 2 * (sizeMin + Math.random() * (sizeMax - sizeMin));
        container.appendChild(createFleuronGlyph(ch, x, y, color, glyphIndex, sizeRem));
        placed.push({ x, y });
        glyphIndex += 1;
        return true;
      }

      return false;
    }

    letters.slice(0, baseCount).forEach((ch) => {
      tryPlace(ch, density.minDistance, density.glyphSize, density.sizeMin, density.sizeMax, 120);
    });

    if (density.relaxedDistance > 0) {
      letters.slice(baseCount).forEach((ch) => {
        tryPlace(
          ch,
          density.relaxedDistance,
          density.glyphSize * 0.82,
          density.sizeMin * 0.92,
          density.sizeMax * 0.95,
          90,
        );
      });
    }
  }

  function syncHeroAmbientFleurons(color) {
    const ambient = document.querySelector('.hero__ambient-fleurons');
    if (!ambient || !color) return;

    ambient.dataset.fleuronsColor = color;
    ambient.querySelectorAll('.fleuron-glyph').forEach((glyph) => {
      glyph.style.color = color;
    });
  }

  function flutterField(container, burstCount = 7) {
    if (!container) return;

    const glyphs = [...container.querySelectorAll('.fleuron-glyph')];
    if (!glyphs.length) return;

    shuffle(glyphs).slice(0, burstCount).forEach((glyph, i) => {
      window.setTimeout(() => {
        const base = glyph.dataset.baseChar;
        if (!base) return;

        glyph.classList.add('is-flutter', 'is-case-flip');
        glyph.textContent = Math.random() > 0.5 ? base.toUpperCase() : base;

        window.setTimeout(() => {
          glyph.classList.remove('is-flutter', 'is-case-flip');
          glyph.textContent = glyph.dataset.fleuronChar;
        }, 500);
      }, i * 55);
    });
  }

  function setActiveFleuronField(container) {
    document.querySelectorAll('.fleuron-field.is-active').forEach((field) => {
      if (field !== container) field.classList.remove('is-active');
    });
    container?.classList.add('is-active');
  }

  function bindFleuronPointer(container) {
    if (container.dataset.fleuronBound === 'true') return;

    const zone = container.closest('.hero, .hero__slide, .notes-page__canvas, .article-hero')
      || container.parentElement;
    if (!zone) return;

    container.dataset.fleuronBound = 'true';
    const radius = 130;

    function resetGlyphs(glyphs) {
      glyphs.forEach((glyph) => {
        glyph.classList.remove('is-near-pointer', 'is-case-flip');
        glyph.style.removeProperty('--fleuron-push-x');
        glyph.style.removeProperty('--fleuron-push-y');
        glyph.textContent = glyph.dataset.fleuronChar;
      });
    }

    zone.addEventListener('pointermove', (event) => {
      const rect = container.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const glyphs = [...container.querySelectorAll('.fleuron-glyph')];

      glyphs.forEach((glyph) => {
        const gx = parseFloat(glyph.style.left);
        const gy = parseFloat(glyph.style.top);
        const dist = Math.hypot(px - gx, py - gy);

        if (dist < radius) {
          const force = (1 - dist / radius) * 32;
          const angle = Math.atan2(gy - py, gx - px);
          glyph.style.setProperty('--fleuron-push-x', `${Math.cos(angle) * force}px`);
          glyph.style.setProperty('--fleuron-push-y', `${Math.sin(angle) * force}px`);
          glyph.classList.add('is-near-pointer');

          const base = glyph.dataset.baseChar;
          if (base && dist < radius * 0.42) {
            glyph.classList.add('is-case-flip');
            glyph.textContent = glyph.classList.contains('is-flower')
              ? base
              : base.toUpperCase();
          } else if (base) {
            glyph.classList.remove('is-case-flip');
            glyph.textContent = glyph.dataset.fleuronChar;
          }
        } else {
          glyph.classList.remove('is-near-pointer', 'is-case-flip');
          glyph.style.removeProperty('--fleuron-push-x');
          glyph.style.removeProperty('--fleuron-push-y');
          glyph.textContent = glyph.dataset.fleuronChar;
        }
      });
    });

    zone.addEventListener('pointerleave', () => {
      resetGlyphs([...container.querySelectorAll('.fleuron-glyph')]);
      container.classList.remove('is-active');
    });
  }

  function bindFleuronScroll(container) {
    if (container.dataset.fleuronScrollBound === 'true') return;

    const hero = container.closest('.article-hero');
    if (!hero) return;

    container.dataset.fleuronScrollBound = 'true';

    let ticking = false;

    function updateParallax() {
      const scrolled = window.scrollY;
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      const progress = Math.min(1, Math.max(0, scrolled / heroBottom));

      container.querySelectorAll('.fleuron-glyph').forEach((glyph, index) => {
        const drift = progress * (18 + (index % 4) * 6);
        const baseTop = parseFloat(glyph.dataset.baseTop || glyph.style.top);
        if (!glyph.dataset.baseTop) glyph.dataset.baseTop = String(baseTop);
        glyph.style.top = `${baseTop + drift}px`;
        glyph.style.opacity = String(1 - progress * 0.35);
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateParallax);
    }, { passive: true });
  }

  function bindFooterFleurons() {
    document.querySelectorAll('.article__footer-fleurons').forEach((footer) => {
      if (footer.dataset.fleuronFooterBound === 'true') return;
      footer.dataset.fleuronFooterBound = 'true';

      const base = footer.textContent.trim();
      let flip = false;

      footer.addEventListener('mouseenter', () => {
        footer.classList.add('is-animated');
        flip = !flip;
        footer.textContent = base.split('').map((ch, i) => {
          if (!/[a-z]/i.test(ch)) return ch;
          return (i + (flip ? 1 : 0)) % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase();
        }).join('');
      });

      footer.addEventListener('mouseleave', () => {
        footer.classList.remove('is-animated');
        footer.textContent = base;
      });
    });
  }

  function initFleurons() {
    document.querySelectorAll('.fleuron-field, [data-fleurons]').forEach((container) => {
      container.querySelectorAll('.fleuron-glyph').forEach((glyph) => glyph.remove());
      container.classList.remove('is-active');
      delete container.dataset.fleuronBound;
      delete container.dataset.fleuronScrollBound;
      populateFleurons(container);
      bindFleuronPointer(container);
      bindFleuronScroll(container);
    });

    bindFooterFleurons();
  }

  /* Hero carousel + article headline preview */
  const hero = document.querySelector('.hero');
  if (hero) {
    const slides = hero.querySelectorAll('.hero__slide');
    const dots = hero.querySelectorAll('.hero__dot');
    const headlines = hero.querySelectorAll('.hero__headline');
    const headlinesWrap = hero.querySelector('.hero__headlines');
    const intro = hero.querySelector('.hero__intro');
    const preview = hero.querySelector('.hero__article-preview');
    const previewVideo = hero.querySelector('.hero__article-preview-video');
    let activeHeadline = null;
    const themes = ['cream', 'magenta', 'mint'];
    const slideIntros = [
      headlines[0]?.dataset.articleIntro || '',
      headlines[1]?.dataset.articleIntro || '',
      headlines[2]?.dataset.articleIntro || '',
    ];
    let current = 0;
    let timer;
    let idleTimer;
    let isPreviewing = false;
    let isFleuronized = false;
    const IDLE_MS = 5000;
    const fleuronStaggerTimers = [];

    function wrapHeadlineLetters(headline) {
      if (headline.dataset.fleuronWrapped) return;

      const words = headline.textContent.trim().split(/\s+/).filter(Boolean);
      let letterIndex = 0;
      headline.textContent = '';

      words.forEach((word, wordIndex) => {
        if (wordIndex > 0) {
          const gap = document.createElement('span');
          gap.className = 'hero__headline-gap';
          gap.setAttribute('aria-hidden', 'true');
          headline.appendChild(gap);
        }

        const wordEl = document.createElement('span');
        wordEl.className = 'hero__headline-word';

        [...word].forEach((ch) => {
          const span = document.createElement('span');
          span.className = 'hero__headline-char';
          span.textContent = ch;
          span.dataset.baseChar = ch;
          if (/[a-z]/i.test(ch)) {
            span.dataset.letterIndex = String(letterIndex);
            letterIndex += 1;
          }
          wordEl.appendChild(span);
        });

        headline.appendChild(wordEl);
      });

      headline.dataset.fleuronWrapped = 'true';
    }

    function clearFleuronStagger() {
      fleuronStaggerTimers.forEach((id) => clearTimeout(id));
      fleuronStaggerTimers.length = 0;
    }

    function restoreHeadline(headline) {
      headline.querySelectorAll('.hero__headline-char').forEach((span) => {
        span.textContent = span.dataset.baseChar;
        span.classList.remove('is-fleuron');
      });
      headline.classList.remove('is-fleuronized');
    }

    function restoreAllHeadlines() {
      clearFleuronStagger();
      headlines.forEach(restoreHeadline);
      headlinesWrap?.classList.remove('is-fleuronized');
      isFleuronized = false;
    }

    function fleuronizeHeadline(headline, patternOffset) {
      const chars = [...headline.querySelectorAll('.hero__headline-char')];
      let delay = 0;

      chars.forEach((span) => {
        const ch = span.dataset.baseChar;
        if (!/[a-z]/i.test(ch)) return;

        const letterIndex = parseInt(span.dataset.letterIndex, 10);
        const useUpper = (letterIndex + patternOffset) % 2 === 0;
        const fleuronChar = useUpper ? ch.toUpperCase() : ch.toLowerCase();

        fleuronStaggerTimers.push(setTimeout(() => {
          span.textContent = fleuronChar;
          span.classList.add('is-fleuron');
        }, delay));

        delay += 32;
      });

      headline.classList.add('is-fleuronized');
    }

    function activeSlideFleuronField() {
      return slides[current]?.querySelector('.fleuron-field');
    }

    function fleuronizeAllHeadlines() {
      if (isPreviewing || isFleuronized) return;

      const field = document.getElementById('field');
      if (field) {
        const rect = field.getBoundingClientRect();
        if (rect.bottom < window.innerHeight * 0.35 || rect.top > window.innerHeight * 0.65) {
          scheduleIdleFleurons();
          return;
        }
      }

      headlines.forEach((headline, index) => {
        fleuronizeHeadline(headline, index);
      });
      headlinesWrap?.classList.add('is-fleuronized');
      isFleuronized = true;

      const fleuronField = activeSlideFleuronField();
      setActiveFleuronField(fleuronField);
      flutterField(fleuronField, 10);
      flutterField(hero.querySelector('.hero__ambient-fleurons'), 12);
    }

    function scheduleIdleFleurons() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(fleuronizeAllHeadlines, IDLE_MS);
    }

    function resetIdleFleurons() {
      restoreAllHeadlines();
      scheduleIdleFleurons();
    }

    function setHeroTheme(theme) {
      themes.forEach((name) => hero.classList.remove(`hero--theme-${name}`));
      hero.classList.add(`hero--theme-${theme}`);
    }

    function goTo(index) {
      if (isPreviewing) return;

      restoreAllHeadlines();

      slides[current].classList.remove('is-active');
      if (dots[current]) dots[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      if (dots[current]) dots[current].classList.add('is-active');

      const theme = slides[current].dataset.theme || 'cream';
      setHeroTheme(theme);

      if (intro && slideIntros[current]) {
        intro.innerHTML = slideIntros[current];
      }

      const fleuronField = activeSlideFleuronField();
      const fleuronColor = fleuronField?.dataset.fleuronsColor;
      setActiveFleuronField(fleuronField);
      syncHeroAmbientFleurons(fleuronColor);
      flutterField(fleuronField, 10);
      flutterField(hero.querySelector('.hero__ambient-fleurons'), 14);
      scheduleIdleFleurons();
    }

    function next() {
      goTo(current + 1);
    }

    function startAutoplay() {
      if (isPreviewing) return;
      clearInterval(timer);
      timer = setInterval(next, 7000);
    }

    function stopAutoplay() {
      clearInterval(timer);
    }

    function setPreviewMedia(headline) {
      const videoSrc = headline.dataset.articleVideo;
      const imageSrc = headline.dataset.articleImage;

      if (videoSrc && previewVideo) {
        previewVideo.src = videoSrc;
        previewVideo.classList.add('is-visible');
        if (preview) preview.style.backgroundImage = '';
        previewVideo.play().catch(() => {});
        return;
      }

      if (previewVideo) {
        previewVideo.pause();
        previewVideo.classList.remove('is-visible');
        previewVideo.removeAttribute('src');
        previewVideo.load();
      }

      if (preview && imageSrc) {
        preview.style.backgroundImage = `url('${imageSrc}')`;
      }
    }

    function clearPreviewMedia() {
      if (previewVideo) {
        previewVideo.pause();
        previewVideo.classList.remove('is-visible');
        previewVideo.removeAttribute('src');
        previewVideo.load();
      }

      if (preview) {
        preview.style.backgroundImage = '';
      }
    }

    function showArticlePreview(headline) {
      if (activeHeadline === headline) return;

      isPreviewing = true;
      activeHeadline = headline;
      stopAutoplay();
      clearTimeout(idleTimer);
      restoreAllHeadlines();

      headlines.forEach((link) => {
        link.classList.toggle('is-active-preview', link === headline);
      });
      headlinesWrap?.classList.add('has-active-headline');
      hero.classList.add('is-previewing');

      setPreviewMedia(headline);

      if (intro && headline.dataset.articleIntro) {
        intro.innerHTML = headline.dataset.articleIntro;
      }

      setHeroTheme(headline.dataset.articleTheme || 'cream');

      const fleuronField = activeSlideFleuronField();
      const fleuronColor = headline.dataset.articleFleurons || fleuronField?.dataset.fleuronsColor;
      setActiveFleuronField(fleuronField);
      syncHeroAmbientFleurons(fleuronColor);
      flutterField(fleuronField, 12);
      flutterField(hero.querySelector('.hero__ambient-fleurons'), 16);
    }

    function clearArticlePreview() {
      isPreviewing = false;
      activeHeadline = null;
      headlines.forEach((link) => link.classList.remove('is-active-preview'));
      headlinesWrap?.classList.remove('has-active-headline');
      hero.classList.remove('is-previewing');

      clearPreviewMedia();

      goTo(current);
      startAutoplay();
      scheduleIdleFleurons();
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearArticlePreview();
        goTo(i);
        startAutoplay();
      });
    });

    headlines.forEach((headline) => {
      headline.addEventListener('mouseenter', () => {
        showArticlePreview(headline);
      });

      headline.addEventListener('focus', () => {
        showArticlePreview(headline);
      });
    });

    headlines.forEach(wrapHeadlineLetters);

    hero.querySelector('.hero__more')?.addEventListener('click', clearArticlePreview);

    hero.addEventListener('pointermove', resetIdleFleurons);
    hero.addEventListener('pointerdown', resetIdleFleurons);
    hero.addEventListener('keydown', resetIdleFleurons);

    if (slides.length) {
      goTo(0);
      startAutoplay();
      scheduleIdleFleurons();
    }
  }

  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        initFleurons();
        const ambient = document.querySelector('.hero__ambient-fleurons');
        if (ambient) {
          window.setTimeout(() => flutterField(ambient, 18), 400);
        }
      });
    });
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initFleurons, 200);
  });

  /* Scroll chapters: field <-> field:notes */
  const fieldSection = document.getElementById('field');
  const notesSection = document.getElementById('notes');

  if (fieldSection && notesSection) {
    let scrollTimer;

    function scrollToSection(selector, direction) {
      const target = document.querySelector(selector);
      if (!target) return;

      document.body.classList.remove('is-scrolling-down', 'is-scrolling-up');
      if (direction === 'down') {
        document.body.classList.add('is-scrolling-down');
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', selector);

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        document.body.classList.remove('is-scrolling-down', 'is-scrolling-up');
      }, 900);
    }

    document.querySelectorAll('[data-scroll-to]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const target = link.dataset.scrollTo;
        if (!target || !target.startsWith('#')) return;

        event.preventDefault();
        const direction = target === '#notes' ? 'down' : 'up';
        scrollToSection(target, direction);
      });
    });

    const notesPage = document.querySelector('.notes-page');
    const notesFleuronField = document.querySelector('.notes-fleurons');
    let notesFleuronsPlayed = false;

    document.querySelectorAll('.notes-entry').forEach((entry) => {
      entry.addEventListener('mouseenter', () => {
        notesPage?.classList.add('is-fleuron-active');
        setActiveFleuronField(notesFleuronField);
        flutterField(notesFleuronField, 5);
      });

      entry.addEventListener('mouseleave', () => {
        notesPage?.classList.remove('is-fleuron-active');
        notesFleuronField?.classList.remove('is-active');
      });
    });

    const notesObserver = new IntersectionObserver(([entry]) => {
      const onNotes = entry.isIntersecting && entry.intersectionRatio > 0.35;
      document.body.classList.toggle('is-on-notes', onNotes);

      if (onNotes && !notesFleuronsPlayed) {
        notesFleuronsPlayed = true;
        setActiveFleuronField(notesFleuronField);
        flutterField(notesFleuronField, 14);
      }
    }, { threshold: [0, 0.35, 0.6] });

    notesObserver.observe(notesSection);

    if (location.hash === '#notes' || location.hash === '#field') {
      requestAnimationFrame(() => {
        document.querySelector(location.hash)?.scrollIntoView({ behavior: 'instant', block: 'start' });
        if (location.hash === '#notes') {
          document.body.classList.add('is-on-notes');
        }
      });
    }
  }

  /* First-visit hypothetical notice */
  const NOTICE_KEY = 'field-disclaimer-dismissed';

  function initEntryNotice() {
    if (sessionStorage.getItem(NOTICE_KEY)) return;

    const notice = document.createElement('div');
    notice.className = 'entry-notice';
    notice.id = 'entry-notice';
    notice.setAttribute('role', 'dialog');
    notice.setAttribute('aria-modal', 'true');
    notice.setAttribute('aria-labelledby', 'entry-notice-title');
    notice.innerHTML = `
      <div class="entry-notice__scrim" data-dismiss></div>
      <div class="entry-notice__card">
        <p class="entry-notice__glyph font-fleurons" aria-hidden="true">fIeLd</p>
        <h2 class="entry-notice__title font-herb" id="entry-notice-title">hypothetical project</h2>
        <p class="entry-notice__text">This is a hypothetical project. It is not a real organization and is not affiliated with or endorsed by any official field media outlet.</p>
        <p class="entry-notice__hope">But I hope that one day it can be more fully realized.</p>
        <button type="button" class="entry-notice__dismiss font-herb">(enter the field)</button>
      </div>
    `;

    document.body.appendChild(notice);
    document.body.classList.add('has-entry-notice');

    const glyphEl = notice.querySelector('.entry-notice__glyph');
    const glyphPatterns = ['fIeLd', 'FiElD', 'fielD', 'FIELD', 'field'];
    let glyphIndex = 0;
    let glyphTimer;

    function cycleNoticeGlyph() {
      if (!glyphEl) return;
      glyphEl.textContent = glyphPatterns[glyphIndex % glyphPatterns.length];
      glyphIndex += 1;
      glyphTimer = window.setTimeout(cycleNoticeGlyph, 900);
    }

    function dismiss() {
      window.clearTimeout(glyphTimer);
      notice.classList.add('is-closing');
      document.body.classList.remove('has-entry-notice');
      sessionStorage.setItem(NOTICE_KEY, '1');
      window.setTimeout(() => notice.remove(), 450);
    }

    notice.querySelector('.entry-notice__dismiss')?.addEventListener('click', dismiss);
    notice.querySelector('[data-dismiss]')?.addEventListener('click', dismiss);
    document.addEventListener('keydown', function onKey(event) {
      if (event.key !== 'Escape') return;
      dismiss();
      document.removeEventListener('keydown', onKey);
    });

    requestAnimationFrame(() => {
      notice.classList.add('is-visible');
      notice.querySelector('.entry-notice__dismiss')?.focus();
      cycleNoticeGlyph();
    });
  }

  initEntryNotice();

})();
