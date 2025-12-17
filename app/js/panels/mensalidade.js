// app/js/panels/mensalidade.js
window.TESOURA_PANELS = window.TESOURA_PANELS || {};

window.TESOURA_PANELS["mensalidade"] = {
  title: "Mensalidade",
  async init() {
    const el = document.querySelector('[data-panel="mensalidade"]');
    if (!el) return;
    el.innerHTML = `
      <div class="card">
        <h2 style="margin:0 0 6px 0; font-size:16px; color: var(--accent)">Mensalidade</h2>
        <p class="muted" style="margin:0 0 10px 0">Marcar pago, definir valor automático (70/80) e lançar no Caixa.</p>
        <div class="kpi">
          <div class="box"><b id="mensalidade_status">OK</b><span>Status</span></div>
          <div class="box"><b id="mensalidade_hint">Próximo</b><span>Ação</span></div>
        </div>
        <hr />
        <div class="muted">Este painel será revisado e migrado para a nova estrutura (sem iframes).</div>
      </div>
    `;
  }
};