// app/js/panels/gols.js
window.TESOURA_PANELS = window.TESOURA_PANELS || {};

window.TESOURA_PANELS["gols"] = {
  title: "Gols",
  async init() {
    const el = document.querySelector('[data-panel="gols"]');
    if (!el) return;
    el.innerHTML = `
      <div class="card">
        <h2 style="margin:0 0 6px 0; font-size:16px; color: var(--accent)">Gols</h2>
        <p class="muted" style="margin:0 0 10px 0">Registrar gols do dia e mostrar artilharia.</p>
        <div class="kpi">
          <div class="box"><b id="gols_status">OK</b><span>Status</span></div>
          <div class="box"><b id="gols_hint">Próximo</b><span>Ação</span></div>
        </div>
        <hr />
        <div class="muted">Este painel será revisado e migrado para a nova estrutura (sem iframes).</div>
      </div>
    `;
  }
};