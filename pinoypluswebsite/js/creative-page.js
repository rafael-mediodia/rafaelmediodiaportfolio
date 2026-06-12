import {
  creatives,
  getArtistBySlug,
  getArtistIndex,
  profileUrl,
  galleryUrl,
  assetUrl,
  formatLocation,
  workImageUrl,
} from "./data.js";
import { renderSidebarWeave } from "./sidebar-weave.js";
import { initGalleryZoom } from "./gallery-zoom.js";
import { initSite } from "./site.js";

const ORIENTATION_CLASSES = ["wide", "landscape", "square", "portrait", "tall"];

function parseRatioHint(ratio) {
  if (!ratio) return null;
  if (Array.isArray(ratio) && ratio.length === 2) {
    return ratio.map(Number);
  }
  if (typeof ratio === "string" && ratio.includes("/")) {
    const [w, h] = ratio.split("/").map((part) => Number(part.trim()));
    return w > 0 && h > 0 ? [w, h] : null;
  }
  return null;
}

function classifyOrientation(width, height) {
  const ratio = width / height;
  if (ratio >= 1.85) return "wide";
  if (ratio >= 1.12) return "landscape";
  if (ratio >= 0.88) return "square";
  if (ratio >= 0.62) return "portrait";
  return "tall";
}

function applyWorkDimensions(workEl, width, height) {
  if (!width || !height) return;

  const orientation = classifyOrientation(width, height);
  workEl.style.setProperty("--work-ratio", `${width} / ${height}`);
  workEl.classList.remove(...ORIENTATION_CLASSES.map((name) => `profile-work--${name}`), "profile-work--ready");
  workEl.classList.add(`profile-work--${orientation}`, "profile-work--ready");
}

function bindWorkMedia(workEl, ratioHint) {
  const hinted = parseRatioHint(ratioHint);
  if (hinted) {
    applyWorkDimensions(workEl, hinted[0], hinted[1]);
  }

  const img = workEl.querySelector(".profile-work__image");
  const video = workEl.querySelector(".profile-work__video");

  if (img) {
    const applyFromImage = () => applyWorkDimensions(workEl, img.naturalWidth, img.naturalHeight);
    if (img.complete && img.naturalWidth) {
      applyFromImage();
    } else {
      img.addEventListener("load", applyFromImage, { once: true });
    }
  }

  if (video) {
    const applyFromVideo = () => applyWorkDimensions(workEl, video.videoWidth, video.videoHeight);
    if (video.readyState >= 1 && video.videoWidth) {
      applyFromVideo();
    } else {
      video.addEventListener("loadedmetadata", applyFromVideo, { once: true });
    }
  }
}

function renderWorkMarkup(work, artistName, index) {
  const src = assetUrl(workImageUrl(work));
  const isVideo = work.type === "video";
  const isFeatured = index === 0;
  const num = String(index + 1).padStart(2, "0");

  const media = isVideo
    ? `<video class="profile-work__video" src="${src}" controls playsinline preload="metadata" muted></video>`
    : `<img class="profile-work__image" src="${src}" alt="${work.title} by ${artistName}" loading="${isFeatured ? "eager" : "lazy"}">`;

  const ratioHint = work.ratio ? ` data-ratio-hint="${work.ratio}"` : "";

  return `
    <article class="profile-work ${isFeatured ? "profile-work--featured" : ""} ${isVideo ? "profile-work--video" : "profile-work--image"}" style="--work-i: ${index}"${ratioHint}>
      <div class="profile-work__frame">
        ${media}
        <div class="profile-work__caption">
          <span class="profile-work__index" aria-hidden="true">${num}</span>
          <h2 class="profile-work__title">${work.title}</h2>
        </div>
      </div>
    </article>
  `;
}

function renderContact(links) {
  const list = document.getElementById("creativeContact");
  if (!list) return;

  const entries = [
    { label: "Instagram", value: links?.ig },
    { label: "Web", value: links?.site },
    { label: "Email", value: links?.email },
  ].filter((entry) => entry.value);

  if (!entries.length) {
    list.remove();
    return;
  }

  list.innerHTML = entries
    .map(
      (entry) => `
        <li class="profile-contact__item">
          <span class="profile-contact__label">${entry.label}</span>
          <span class="profile-contact__value">${entry.value}</span>
        </li>
      `
    )
    .join("");
}

function initWorkShowcase(works) {
  works.forEach((work, index) => {
    bindWorkMedia(work, work.dataset.ratioHint || null);

    const video = work.querySelector(".profile-work__video");
    if (!video) return;

    work.addEventListener("mouseenter", () => {
      video.play().catch(() => {});
    });
    work.addEventListener("mouseleave", () => {
      video.pause();
      video.currentTime = 0;
    });
  });
}

const slug = document.body.dataset.slug;
const artist = getArtistBySlug(slug);

if (!artist) {
  window.location.replace(galleryUrl());
} else {
  document.title = `${artist.name} — Pinoy Plus`;

  const content = document.querySelector(".profiles-content");
  content?.style.setProperty("--profile-accent", artist.color);

  document.getElementById("creativeName").textContent = artist.name;

  const discipline = document.getElementById("creativeDiscipline");
  discipline.textContent = artist.discipline;
  discipline.style.color = artist.color;

  const location = document.getElementById("creativeLocation");
  const locationText = formatLocation(artist.locations);
  if (locationText) {
    location.textContent = locationText;
  } else {
    location.previousElementSibling?.remove();
    location.remove();
  }

  renderContact(artist.links);

  const worksEl = document.getElementById("creativeWorks");
  if (worksEl) {
    worksEl.className = "profile-works__showcase";
    worksEl.innerHTML = artist.works
      .map((work, index) => renderWorkMarkup(work, artist.name, index))
      .join("");
    initWorkShowcase([...worksEl.querySelectorAll(".profile-work")]);
    initGalleryZoom(worksEl);
  }

  const sidebar = document.getElementById("creativeSidebar");
  if (sidebar) {
    sidebar.innerHTML = renderSidebarWeave(creatives, slug);
  }

  const index = getArtistIndex(slug);
  const prev = creatives[(index - 1 + creatives.length) % creatives.length];
  const next = creatives[(index + 1) % creatives.length];
  document.getElementById("creativePrev").href = profileUrl(prev.slug);
  document.getElementById("creativeNext").href = profileUrl(next.slug);
}

initSite();
