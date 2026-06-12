let modal = null;
let zoomImages = [];
let currentIndex = 0;

function ensureModal() {
  if (modal) return modal;

  modal = document.createElement("div");
  modal.className = "gallery-zoom";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.hidden = true;
  modal.innerHTML = `
    <button type="button" class="gallery-zoom__backdrop" aria-label="Close image"></button>
    <div class="gallery-zoom__stage">
      <button type="button" class="gallery-zoom__close" aria-label="Close image">×</button>
      <img class="gallery-zoom__image" alt="">
      <p class="gallery-zoom__caption" hidden></p>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".gallery-zoom__backdrop").addEventListener("click", closeGalleryZoom);
  modal.querySelector(".gallery-zoom__close").addEventListener("click", closeGalleryZoom);

  modal.querySelector(".gallery-zoom__stage").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeGalleryZoom();
  });

  return modal;
}

function handleKeydown(event) {
  if (event.key === "Escape") {
    closeGalleryZoom();
    return;
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showImage(currentIndex - 1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    showImage(currentIndex + 1);
  }
}

function showImage(index) {
  if (!modal || zoomImages.length === 0) return;

  currentIndex = (index + zoomImages.length) % zoomImages.length;
  const item = zoomImages[currentIndex];
  const img = modal.querySelector(".gallery-zoom__image");
  const caption = modal.querySelector(".gallery-zoom__caption");

  img.src = item.src;
  img.alt = item.alt;

  const title = item.title?.trim();
  if (title) {
    caption.textContent = title;
    caption.hidden = false;
  } else {
    caption.textContent = "";
    caption.hidden = true;
  }
}

export function openGalleryZoom(index = 0) {
  if (!zoomImages.length) return;

  const el = ensureModal();
  showImage(index);
  el.hidden = false;
  document.body.classList.add("gallery-zoom-open");
  document.addEventListener("keydown", handleKeydown);
}

export function closeGalleryZoom() {
  if (!modal) return;

  modal.hidden = true;
  document.body.classList.remove("gallery-zoom-open");
  document.removeEventListener("keydown", handleKeydown);

  const img = modal.querySelector(".gallery-zoom__image");
  if (img) img.removeAttribute("src");
}

export function initGalleryZoom(root) {
  if (!root) return;

  const works = [...root.querySelectorAll(".profile-work--image")];
  if (!works.length) return;

  zoomImages = works
    .map((work) => {
      const img = work.querySelector(".profile-work__image");
      if (!img?.src) return null;
      return {
        src: img.currentSrc || img.src,
        alt: img.alt || "",
        title: work.querySelector(".profile-work__title")?.textContent?.trim() || "",
      };
    })
    .filter(Boolean);

  works.forEach((work, index) => {
    const frame = work.querySelector(".profile-work__frame");
    if (!frame) return;

    frame.classList.add("profile-work__frame--zoomable");
    frame.addEventListener("click", () => openGalleryZoom(index));
  });
}
