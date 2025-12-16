// app/js/panels/banco_dados.js
window.TESOURA_PANELS = window.TESOURA_PANELS || {};

window.TESOURA_PANELS["banco_dados"] = {
  title: "Banco de Dados (ADMIN)",
  async init() {
    const el = document.querySelector('[data-panel="banco_dados"]');
    if (!el) return;
    el.innerHTML = `
      <div class="card">
        <h2 style="margin:0 0 6px 0; font-size:16px; color: var(--accent)">Banco de Dados (ADMIN)</h2>
        <p class="muted" style="margin:0 0 10px 0">Gerenciar dados e direcionar para os outros painéis com segurança.</p>
        <div class="kpi">
          <div class="box"><b id="banco_dados_status">OK</b><span>Status</span></div>
          <div class="box"><b id="banco_dados_hint">Próximo</b><span>Ação</span></div>
        </div>
        <hr />
        <div class="muted">Este painel será revisado e migrado para a nova estrutura (sem iframes).</div>
      </div>
    `;
  }
};