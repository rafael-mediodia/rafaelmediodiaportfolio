import {
  BRAND,
  profileUrl,
  assetUrl,
  displayColorForSurface,
  displayFrameForSurface,
} from "./data.js";

export function renderSidebarWeave(artists, currentSlug) {
  return artists
    .map((artist, index) => {
      const displayColor = displayColorForSurface(artist.color, BRAND.adobe, index);
      const displayFrame = displayFrameForSurface(artist, displayColor, BRAND.adobe);

      return `
        <a
          class="sidebar-tile${artist.slug === currentSlug ? " is-active" : ""}"
          href="${profileUrl(artist.slug)}"
          aria-label="${artist.name}"
          aria-current="${artist.slug === currentSlug ? "page" : "false"}"
          data-tip="${artist.name}"
          style="--tile-color: ${displayColor}; --tile-delay: ${index * 0.04}s"
        >
          <img class="sidebar-tile__img" src="${assetUrl(displayFrame)}" alt="" loading="lazy">
        </a>
      `;
    })
    .join("");
}
