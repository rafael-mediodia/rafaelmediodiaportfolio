import { isInCreativesDir } from "./data.js";
import { SITE_NAV } from "./nav.js";

function navHref(href) {
  return isInCreativesDir() ? `../${href}` : href;
}

function homeHref() {
  return isInCreativesDir() ? "../index.html" : "index.html";
}

export function renderWeaveNav() {
  const tiles = SITE_NAV.map((item, index) => `
      <a
        class="weave-nav__tile"
        href="${navHref(item.href)}"
        data-nav="${item.id}"
        style="
          --tile-bg: ${item.color};
          --tile-text: ${item.textOn};
          --tile-delay: ${index * 0.07}s;
        "
      >
        <span class="weave-nav__label">${item.shortLabel ?? item.label}</span>
      </a>
    `).join("");

  return `<div class="weave-nav__chain">${tiles}</div>`;
}

export function initWeaveNav() {
  const nav = document.getElementById("weaveNav");
  const toggle = document.querySelector(".menu-toggle");
  const menuWrap = document.querySelector(".site-header__end");
  if (!nav || !toggle || !menuWrap) return;

  nav.innerHTML = renderWeaveNav();

  const logo = document.querySelector(".logo");
  if (logo && !logo.getAttribute("href")?.includes("index")) {
    logo.setAttribute("href", homeHref());
  }

  const current = document.body.dataset.page;
  nav.querySelectorAll(".weave-nav__tile").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === current);
  });

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    nav.setAttribute("aria-hidden", "true");
  };

  const open = () => {
    toggle.setAttribute("aria-expanded", "true");
    nav.classList.add("is-open");
    nav.setAttribute("aria-hidden", "false");
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) close();
    else open();
  });

  nav.querySelectorAll(".weave-nav__tile").forEach((link) => {
    link.addEventListener("click", close);
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (!menuWrap.contains(event.target)) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) close();
  });
}
