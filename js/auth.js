// app/js/auth.js
(function () {
  function getBaseRoot() {
    // /tesoura-app/ (GitHub Pages project)
    const parts = (location.pathname || "/").split("/").filter(Boolean);
    return "/" + (parts[0] || "") + "/";
  }

  function getCfg() {
    return window.TESOURA_CONFIG || {};
  }

  function normalizePin(s) {
    return String(s || "").trim();
  }

  function getAllowedPins(mode) {
    const cfg = getCfg();

    // Se você quiser controlar tudo por config.js, use:
    // window.TESOURA_CONFIG.PINS = { diretoria:[...], jogadores:[...] }
    if (cfg.PINS && cfg.PINS[mode] && Array.isArray(cfg.PINS[mode])) {
      return cfg.PINS[mode].map(normalizePin);
    }

    // fallback seguro (pra não travar se config.js falhar)
    if (mode === "diretoria") {
      return ["1baidec", "2thiago", "3love", "4le", "5titi", "TESOURA2026"].map(normalizePin);
    }
    if (mode === "jogadores") {
      return ["TESOURA2026"].map(normalizePin);
    }

    // fallback final
    if (cfg.APP_PIN) return [normalizePin(cfg.APP_PIN)];
    return [];
  }

  function validatePin(mode, pin) {
    const p = normalizePin(pin);
    const allowed = getAllowedPins(mode);
    return allowed.includes(p);
  }

  function applyLogoutIfRequested() {
    const url = new URL(location.href);
    if (url.searchParams.get("logout") === "1") {
      try {
        localStorage.removeItem("TESOURA_MODE");
        localStorage.removeItem("TESOURA_LOGIN_AT");
      } catch (e) {}
      url.searchParams.delete("logout");
      history.replaceState({}, "", url.toString());
    }
  }

  window.TESOURA_AUTH = {
    getBaseRoot,
    validatePin,
    applyLogoutIfRequested,
  };
})();
