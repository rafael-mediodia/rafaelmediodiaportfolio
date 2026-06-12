import { isInCreativesDir } from "./data.js";

const SITE_DISCLAIMER_BODY =
  "This is a hypothetical project. It is not a real organization and is not affiliated with or endorsed by any official Pinoy Plus organization.";

const SITE_DISCLAIMER_HOPE =
  "But I hope that one day it can be more fully realized.";

const DISCLAIMER_DISMISS_KEY = "pinoyplus-disclaimer-dismissed";

export function mountSiteDisclaimer() {
  if (document.querySelector(".site-disclaimer")) return;
  if (sessionStorage.getItem(DISCLAIMER_DISMISS_KEY)) return;

  const disclaimer = document.createElement("div");
  disclaimer.className = "site-disclaimer";
  disclaimer.setAttribute("role", "dialog");
  disclaimer.setAttribute("aria-modal", "true");
  disclaimer.setAttribute("aria-labelledby", "siteDisclaimerTitle");
  disclaimer.innerHTML = `
    <button type="button" class="site-disclaimer__backdrop" aria-label="Close disclaimer"></button>
    <div class="site-disclaimer__dialog">
      <h2 class="site-disclaimer__title" id="siteDisclaimerTitle">Hypothetical project</h2>
      <div class="site-disclaimer__body">
        <p class="site-disclaimer__text">${SITE_DISCLAIMER_BODY}</p>
        <p class="site-disclaimer__hope">${SITE_DISCLAIMER_HOPE}</p>
      </div>
      <div class="site-disclaimer__actions">
        <button type="button" class="site-disclaimer__dismiss">OK</button>
      </div>
    </div>
  `;

  document.body.appendChild(disclaimer);
  document.body.classList.add("site-disclaimer-open");

  const backdrop = disclaimer.querySelector(".site-disclaimer__backdrop");
  const dismissBtn = disclaimer.querySelector(".site-disclaimer__dismiss");

  function dismiss() {
    sessionStorage.setItem(DISCLAIMER_DISMISS_KEY, "1");
    disclaimer.remove();
    document.body.classList.remove("site-disclaimer-open");
  }

  backdrop.addEventListener("click", dismiss);
  dismissBtn.addEventListener("click", dismiss);

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") dismiss();
    },
    { once: true },
  );

  requestAnimationFrame(() => dismissBtn.focus());
}

function rootPrefix() {
  return isInCreativesDir() ? "../" : "";
}

function shouldMountFooter() {
  return (
    !document.body.classList.contains("page-home") &&
    !document.body.classList.contains("page-tapestry")
  );
}

export function mountFooter() {
  if (!shouldMountFooter() || document.querySelector(".site-footer")) return;

  const prefix = rootPrefix();
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <nav class="site-footer__nav" aria-label="Footer">
      <a href="${prefix}profiles.html">Creatives</a>
      <a href="${prefix}festival.html">Festival</a>
      <a href="${prefix}gatherings.html">Gatherings</a>
      <a href="${prefix}scholarships.html">Scholarships</a>
    </nav>
    <p>Pinoy Plus is a community project for Filipino art and design. <strong>Likha Pilipino — sama-sama.</strong></p>
    <div class="footer-mark" aria-hidden="true">
      <img src="${prefix}assets/logo-mark.svg" alt="">
    </div>
  `;

  document.body.appendChild(footer);
}
