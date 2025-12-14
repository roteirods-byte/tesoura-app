// app/js/panels/controle_geral.js
window.TESOURA_PANELS = window.TESOURA_PANELS || {};

window.TESOURA_PANELS["controle_geral"] = {
  title: "Controle Geral",
  async init() {
    const el = document.querySelector('[data-panel="controle_geral"]');
    if (!el) return;
    el.innerHTML = `
      <div class="card">
        <h2 style="margin:0 0 6px 0; font-size:16px; color: var(--accent)">Controle Geral</h2>
        <p class="muted" style="margin:0 0 10px 0">Resumo de presenças por domingo, jogou 1º/2º tempo e indicadores.</p>
        <div class="kpi">
          <div class="box"><b id="controle_geral_status">OK</b><span>Status</span></div>
          <div class="box"><b id="controle_geral_hint">Próximo</b><span>Ação</span></div>
        </div>
        <hr />
        <div class="muted">Este painel será revisado e migrado para a nova estrutura (sem iframes).</div>
      </div>
    `;
  }
};