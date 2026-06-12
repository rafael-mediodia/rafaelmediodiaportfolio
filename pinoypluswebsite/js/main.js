import { creatives } from "./data.js";
import { pickRandomArtists, renderCrossArtists } from "./home-cross.js";
import { initHeroSlideshow } from "./hero-slideshow.js";
import { initSite } from "./site.js";

const crossGrid = document.getElementById("crossGrid");
const featured = pickRandomArtists(creatives, 4);

const slideshow = initHeroSlideshow(creatives);

renderCrossArtists(crossGrid, featured, {
  onHighlight: (artist) => slideshow?.highlightArtist(artist),
  onUnhighlight: () => slideshow?.clearHighlight(),
});

initSite();
