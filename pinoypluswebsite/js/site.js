import { isInCreativesDir } from "./data.js";
import { mountFooter, mountSiteDisclaimer } from "./site-chrome.js";
import { initWeaveNav } from "./weave-nav.js";

/* Full weave mark (+ cross + bar), excluding wordmark — from pinoy-plus-logo viewBox */
const LOGO_MARK_LEFT = (100.15 - 85) / 1835;
const LOGO_MARK_WIDTH = (957.71 - 100.15) / 1835;

function siteRootPrefix() {
  return isInCreativesDir() ? "../" : "";
}

function logoAsset(file) {
  return `${siteRootPrefix()}assets/${file}`;
}

function usesLightLogo() {
  return (
    document.body.classList.contains("page-home") ||
    document.body.classList.contains("page-tapestry")
  );
}

function homeHref() {
  return `${siteRootPrefix()}index.html`;
}

function mountLogoIntro() {
  if (document.getElementById("logoIntro")) return;

  const light = usesLightLogo();
  const fullLogo = light ? "pinoy-plus-logo-light.svg" : "pinoy-plus-logo.svg";

  const intro = document.createElement("a");
  intro.href = homeHref();
  intro.className = "logo-intro";
  intro.id = "logoIntro";
  intro.setAttribute("aria-label", "Pinoy Plus home");
  intro.innerHTML = `
    <span class="logo-intro__clip">
      <img class="logo-intro__img" src="${logoAsset(fullLogo)}" alt="">
    </span>
  `;

  document.body.insertBefore(intro, document.body.firstChild);
}

const LOGO_INTRO_CROP_DELAY_MS = 1100;
const LOGO_INTRO_CROP_DUR_MS = 1000;

function settleCreativeLogo(intro) {
  if (!document.body.classList.contains("page-creative")) return;
  intro.classList.add("logo-intro--settled");
}

function initLogoIntro() {
  mountLogoIntro();

  const intro = document.getElementById("logoIntro");
  const clip = intro?.querySelector(".logo-intro__clip");
  const img = intro?.querySelector(".logo-intro__img");
  if (!intro || !clip || !img) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const setupCrop = () => {
    const fullWidth = img.offsetWidth;
    if (!fullWidth) return;

    const markWidth = Math.max(Math.round(fullWidth * LOGO_MARK_WIDTH), 12);
    const panX = Math.round(fullWidth * LOGO_MARK_LEFT);

    intro.style.setProperty("--logo-intro-full-w", `${fullWidth}px`);
    intro.style.setProperty("--logo-intro-bar-w", `${markWidth}px`);
    intro.style.setProperty("--logo-intro-pan-x", `-${panX}px`);

    if (reducedMotion) {
      settleCreativeLogo(intro);
      return;
    }

    window.setTimeout(
      () => settleCreativeLogo(intro),
      LOGO_INTRO_CROP_DELAY_MS + LOGO_INTRO_CROP_DUR_MS,
    );
  };

  if (img.complete) setupCrop();
  else img.addEventListener("load", setupCrop, { once: true });
}

export function initSite() {
  mountSiteDisclaimer();
  initWeaveNav();
  initLogoIntro();
  mountFooter();
}
