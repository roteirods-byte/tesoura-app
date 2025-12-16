// app/js/app.js
async function initApp() {
  // PIN
  window.requirePinGate?.();

  // title
  const cfg = window.TESOURA_CONFIG || {};
  const titleEl = document.querySelector("#appTitle");
  if (titleEl) titleEl.textContent = cfg.APP_TITLE || "TESOURA";

  // tabs
  const tabs = Array.from(document.querySelectorAll("[data-tab]"));
  const sections = Array.from(document.querySelectorAll(".section"));

  function openTab(key) {
    tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === key));
    sections.forEach(s => s.classList.toggle("active", s.dataset.section === key));
    // init panel if exists
    const panel = window.TESOURA_PANELS?.[key];
    if (panel && !panel.__inited) {
      panel.__inited = true;
      panel.init().catch(err => console.error(err));
    }
    // url hash
    location.hash = key;
  }

  tabs.forEach(t => t.addEventListener("click", () => openTab(t.dataset.tab)));

  const start = (location.hash || "").replace("#","") || "jogadores";
  openTab(start);
}

window.addEventListener("DOMContentLoaded", initApp);