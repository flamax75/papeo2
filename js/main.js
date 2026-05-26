const toggle = document.querySelector("[data-sections-toggle]");
const nav = document.querySelector("[data-sections-nav]");
let installPromptEvent;

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
}

function createInstallCard() {
  if (isStandalone() || document.querySelector("[data-install-card]")) return;

  const card = document.createElement("aside");
  card.className = "install-card";
  card.setAttribute("data-install-card", "");
  card.setAttribute("aria-label", "Añadir carta a pantalla de inicio");
  card.innerHTML = `
    <div class="install-head">
      <img class="install-icon" src="img/logo.png" alt="">
      <div>
        <p class="install-title">Añadir la carta al móvil</p>
        <p class="install-text">Guárdala como app para abrirla desde la pantalla de inicio.</p>
      </div>
    </div>
    <ol class="install-steps">
      <li><strong>iPhone:</strong> Safari > Compartir > Añadir a pantalla de inicio.</li>
      <li><strong>Android:</strong> pulsa “Instalar app” o menú ⋮ > Añadir a pantalla de inicio.</li>
    </ol>
    <div class="install-actions">
      <button class="install-button" type="button" data-install-button disabled>Instalar app</button>
      <button class="install-close" type="button" data-install-close aria-label="Cerrar">×</button>
    </div>
  `;

  document.body.appendChild(card);
  updateInstallButton();

  card.querySelector("[data-install-close]").addEventListener("click", () => {
    card.hidden = true;
  });

  card.querySelector("[data-install-button]").addEventListener("click", async () => {
    if (!installPromptEvent) return;
    installPromptEvent.prompt();
    await installPromptEvent.userChoice;
    installPromptEvent = null;
    card.hidden = true;
  });
}

function updateInstallButton() {
  const button = document.querySelector("[data-install-button]");
  if (!button) return;
  button.disabled = !installPromptEvent;
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPromptEvent = event;
  updateInstallButton();
});

window.addEventListener("load", createInstallCard);
