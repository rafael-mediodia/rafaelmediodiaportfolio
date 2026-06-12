import { creatives, profileUrl } from "./data.js";
import { renderWeaveChain, watchWeaveChain } from "./tapestry.js";
import { initTapestryApply } from "./tapestry-apply.js";
import { initSite } from "./site.js";

const legacyArtist = new URLSearchParams(window.location.search).get("artist");
if (legacyArtist) {
  window.location.replace(profileUrl(legacyArtist));
}

const tapestryEl = document.getElementById("tapestry");
tapestryEl.innerHTML = renderWeaveChain(creatives);

const weaveChain = tapestryEl.querySelector(".weave-chain");
watchWeaveChain(weaveChain);
initTapestryApply();

initSite();
