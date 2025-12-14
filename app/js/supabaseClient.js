// app/js/supabaseClient.js
function getSupabase() {
  const cfg = window.TESOURA_CONFIG;
  if (!cfg?.SUPABASE_URL || !cfg?.SUPABASE_KEY) {
    throw new Error("Config do Supabase ausente em app/js/config.js");
  }
  if (!window.supabase) {
    throw new Error("supabase-js não carregou (ver script CDN no index.html).");
  }
  if (!window.__TESOURA_SUPABASE__) {
    window.__TESOURA_SUPABASE__ = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY);
  }
  return window.__TESOURA_SUPABASE__;
}
window.getSupabase = getSupabase;