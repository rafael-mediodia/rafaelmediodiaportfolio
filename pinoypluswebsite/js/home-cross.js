import { profileUrl, assetUrl } from "./data.js";
import { firstName, pickRandom } from "./utils.js";

const POSITIONS = ["top", "left", "right", "bottom"];

export function pickRandomArtists(artists, count = 4) {
  return pickRandom(artists, count);
}

export function renderCrossArtists(container, artists, { onHighlight, onUnhighlight } = {}) {
  if (!container) return;

  container.querySelectorAll(".cross-block--artist").forEach((node) => node.remove());

  POSITIONS.forEach((position, index) => {
    const artist = artists[index];
    if (!artist) return;

    const link = document.createElement("a");
    link.className = `cross-block cross-block--artist cross-block--${position}`;
    link.href = profileUrl(artist.slug);
    link.dataset.slug = artist.slug;
    link.setAttribute("aria-label", `${artist.name} — view profile`);
    link.style.setProperty("--artist-color", artist.color);
    link.style.setProperty("--artist-text", artist.textOn);

    const photo = document.createElement("img");
    photo.className = "cross-block__photo";
    photo.src = assetUrl(artist.frame);
    photo.alt = "";

    const name = document.createElement("span");
    name.className = "cross-block__name";
    name.textContent = firstName(artist.name);

    link.append(photo, name);
    container.appendChild(link);

    const highlight = () => {
      container.querySelectorAll(".cross-block--artist").forEach((block) => {
        block.classList.toggle("is-highlighted", block === link);
      });
      onHighlight?.(artist);
    };

    const unhighlight = () => {
      container.querySelectorAll(".cross-block--artist.is-highlighted").forEach((block) => {
        block.classList.remove("is-highlighted");
      });
      onUnhighlight?.(artist);
    };

    link.addEventListener("mouseenter", highlight);
    link.addEventListener("mouseleave", unhighlight);
    link.addEventListener("focus", highlight);
    link.addEventListener("blur", unhighlight);
  });
}
