function mountApplyDialog() {
  if (document.getElementById("tapestryApplyDialog")) return document.getElementById("tapestryApplyDialog");

  const dialog = document.createElement("dialog");
  dialog.id = "tapestryApplyDialog";
  dialog.className = "tapestry-apply";
  dialog.innerHTML = `
    <form class="tapestry-apply__form" method="dialog">
      <button type="button" class="tapestry-apply__close" aria-label="Close">×</button>
      <div class="tapestry-apply__panel" data-panel="form">
        <p class="tapestry-apply__eyebrow">Join the weave</p>
        <h2 class="tapestry-apply__title">Submit your work</h2>
        <p class="tapestry-apply__lead">Tell us a little about your practice and share a link to your work.</p>
        <div class="tapestry-apply__fields">
          <label class="tapestry-apply__field">
            <span>Name</span>
            <input type="text" name="name" autocomplete="name" required placeholder="Your name">
          </label>
          <label class="tapestry-apply__field">
            <span>Email</span>
            <input type="email" name="email" autocomplete="email" required placeholder="you@email.com">
          </label>
          <label class="tapestry-apply__field">
            <span>Discipline</span>
            <input type="text" name="discipline" required placeholder="Illustration, design, film…">
          </label>
          <label class="tapestry-apply__field">
            <span>Link to work</span>
            <input type="url" name="portfolio" placeholder="Portfolio or Instagram URL">
          </label>
          <label class="tapestry-apply__field tapestry-apply__field--full">
            <span>Why Pinoy Plus?</span>
            <textarea name="message" rows="3" placeholder="A few lines about what you're making."></textarea>
          </label>
        </div>
        <button type="submit" class="tapestry-apply__submit">Send submission</button>
      </div>
      <div class="tapestry-apply__panel tapestry-apply__panel--success" data-panel="success" hidden>
        <p class="tapestry-apply__eyebrow">Received</p>
        <h2 class="tapestry-apply__title">Thanks for weaving in.</h2>
        <p class="tapestry-apply__lead">Your submission is in — we'll follow up if there's a fit. Until then, keep making.</p>
        <button type="button" class="tapestry-apply__submit tapestry-apply__submit--ghost" data-close>Close</button>
      </div>
    </form>
  `;

  document.body.appendChild(dialog);
  return dialog;
}

function resetDialog(dialog) {
  const form = dialog.querySelector(".tapestry-apply__form");
  const formPanel = dialog.querySelector('[data-panel="form"]');
  const successPanel = dialog.querySelector('[data-panel="success"]');
  form?.reset();
  formPanel?.removeAttribute("hidden");
  successPanel?.setAttribute("hidden", "");
}

export function initTapestryApply() {
  const dialog = mountApplyDialog();
  const form = dialog.querySelector(".tapestry-apply__form");
  const formPanel = dialog.querySelector('[data-panel="form"]');
  const successPanel = dialog.querySelector('[data-panel="success"]');

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".weave-square--apply");
    if (!trigger) return;
    event.preventDefault();
    resetDialog(dialog);
    dialog.showModal();
  });

  dialog.querySelector(".tapestry-apply__close")?.addEventListener("click", () => {
    dialog.close();
  });

  dialog.querySelector("[data-close]")?.addEventListener("click", () => {
    dialog.close();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener("close", () => {
    resetDialog(dialog);
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    formPanel?.setAttribute("hidden", "");
    successPanel?.removeAttribute("hidden");
  });
}
