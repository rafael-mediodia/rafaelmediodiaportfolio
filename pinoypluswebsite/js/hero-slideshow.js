import { artistHeroMedia, profileUrl } from "./data.js";
import { shuffleArray } from "./utils.js";

function setSlideMedia(entry, artist, workIndex = 0) {
  const { src, type } = artistHeroMedia(artist, workIndex);
  entry.slide.innerHTML = "";

  if (type === "video") {
    const video = document.createElement("video");
    video.className = "hero-slideshow__video";
    video.src = src;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    entry.slide.append(video);
    entry.mediaEl = video;
    return;
  }

  const img = document.createElement("img");
  img.className = "hero-slideshow__image";
  img.src = src;
  img.alt = artist.name;
  entry.slide.append(img);
  entry.mediaEl = img;
}

function syncSlidePlayback(slides, activeIndex) {
  slides.forEach((entry, index) => {
    const isActive = index === activeIndex;
    entry.slide.classList.toggle("is-active", isActive);

    if (entry.mediaEl?.tagName === "VIDEO") {
      if (isActive) {
        entry.mediaEl.play().catch(() => {});
      } else {
        entry.mediaEl.pause();
        entry.mediaEl.currentTime = 0;
      }
    }
  });
}

export function initHeroSlideshow(artists, { intervalMs = 5500, workIntervalMs = 2400 } = {}) {
  const container = document.getElementById("heroSlideshow");
  const overlay = document.querySelector(".hero-media-overlay");
  const caption = document.getElementById("heroCaption");
  const captionName = caption?.querySelector(".hero-caption__name");
  const captionMeta = caption?.querySelector(".hero-caption__meta");
  if (!container || !artists.length) return null;

  const roster = shuffleArray(artists);
  let activeIndex = 0;
  let slideTimer;
  let workTimer;
  let paused = false;
  let hoverArtist = null;
  let hoverWorkIndex = 0;

  const slides = roster.map((artist) => {
    const slide = document.createElement("div");
    slide.className = "hero-slideshow__slide";
    slide.dataset.slug = artist.slug;

    const entry = { slide, mediaEl: null, artist };
    setSlideMedia(entry, artist, 0);
    container.append(slide);
    return entry;
  });

  function setCaption(artist, workTitle) {
    if (!caption || !captionName || !captionMeta) return;
    captionName.textContent = artist.name;
    captionMeta.textContent = workTitle
      ? `${artist.discipline} · ${workTitle}`
      : artist.discipline;
    caption.href = profileUrl(artist.slug);
    caption.setAttribute("aria-label", `View ${artist.name}'s profile`);
    caption.classList.add("is-visible");
  }

  function setAccent(artist) {
    overlay?.style.setProperty("--artist-accent", artist.color);
  }

  function setActiveSlide(index) {
    activeIndex = ((index % slides.length) + slides.length) % slides.length;
    const entry = slides[activeIndex];

    if (!hoverArtist) {
      setSlideMedia(entry, entry.artist, 0);
      setCaption(entry.artist, entry.artist.works?.[0]?.title);
      setAccent(entry.artist);
    }

    syncSlidePlayback(slides, activeIndex);
  }

  function clearWorkTimer() {
    window.clearInterval(workTimer);
    workTimer = null;
  }

  function clearSlideTimer() {
    window.clearInterval(slideTimer);
    slideTimer = null;
  }

  function startSlideTimer() {
    clearSlideTimer();
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    slideTimer = window.setInterval(() => {
      setActiveSlide(activeIndex + 1);
    }, intervalMs);
  }

  function cycleHoverWorks(artist) {
    clearWorkTimer();
    const works = artist.works?.length ? artist.works : [{ title: null }];
    hoverWorkIndex = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const showWork = () => {
      const work = works[hoverWorkIndex % works.length];
      const entry = slides.find((item) => item.artist.slug === artist.slug);
      if (entry) {
        setSlideMedia(entry, artist, hoverWorkIndex % works.length);
        syncSlidePlayback(slides, slides.indexOf(entry));
        setCaption(artist, work?.title);
      }
      hoverWorkIndex += 1;
    };

    showWork();
    if (works.length > 1 && !reducedMotion) {
      workTimer = window.setInterval(showWork, workIntervalMs);
    }
  }

  function showArtist(artist) {
    const index = slides.findIndex((entry) => entry.artist.slug === artist.slug);
    if (index < 0) return;
    activeIndex = index;
    syncSlidePlayback(slides, activeIndex);
  }

  function highlightArtist(artist) {
    hoverArtist = artist;
    paused = true;
    clearSlideTimer();
    showArtist(artist);
    setAccent(artist);
    cycleHoverWorks(artist);
    caption?.classList.add("is-hover");
  }

  function clearHighlight() {
    hoverArtist = null;
    paused = false;
    clearWorkTimer();
    caption?.classList.remove("is-hover");
    setActiveSlide(activeIndex);
    startSlideTimer();
  }

  setActiveSlide(0);
  startSlideTimer();

  return {
    highlightArtist,
    clearHighlight,
    getRoster: () => roster,
  };
}
