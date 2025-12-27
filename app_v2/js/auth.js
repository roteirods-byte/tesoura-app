// app_v2/js/auth.js
(function () {
  function normalizePin(s){ return String(s||"").trim(); }
  function getCfg(){ return window.TESOURA_CONFIG || {}; }

  function getAllowedPins(mode){
    const cfg = getCfg();
    if (cfg.PINS && cfg.PINS[mode] && Array.isArray(cfg.PINS[mode])) {
      return cfg.PINS[mode].map(normalizePin);
    }
    return [];
  }

  function validatePin(mode, pin){
    const p = normalizePin(pin);
    const allowed = getAllowedPins(mode);
    return allowed.includes(p);
  }

  window.TESOURA_AUTH = { validatePin };
})();
