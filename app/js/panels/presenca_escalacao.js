// app/js/panels/presenca_escalacao.js
// REVISAO: v5

window.TESOURA_PANELS = window.TESOURA_PANELS || {};

window.TESOURA_PANELS["presenca_escalacao"] = {
  title: "Presença / Escalação",

  async init() {
    const root = document.querySelector('[data-panel="presenca_escalacao"]');
    if (!root) return;

    // IMPORTANTÍSSIMO:
    // Para ficar 100% igual ao seu modelo (CHEGOU AGORA / 1º TEMPO / 2º TEMPO),
    // vamos carregar o arquivo “tesoura_presenca_escala_OFICIAL.html” dentro do painel.
    // Esse arquivo precisa estar na RAIZ do repo (mesmo nível do index.html).
    //
    // Se você preferir usar o R5 como modelo, troque o nome abaixo para:
    // "tesoura_presenca_escala_R5.html"
    const arquivoModelo = "tesoura_presenca_escala_OFICIAL.html";

    root.innerHTML = `
      <div class="card">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;">
          <div>
            <div class="card-title">Presença / Escalação</div>
            <div class="card-subtitle">Modelo oficial carregado dentro do painel (v5).</div>
          </div>
          <button class="btn btn-secondary" id="btnReloadPresenca">RECARREGAR</button>
        </div>

        <div style="margin-top:12px;border-radius:14px;overflow:hidden;border:1px solid rgba(255,127,39,0.25)">
          <iframe
            id="framePresenca"
            src="./${arquivoModelo}?v=5"
            style="width:100%;height:calc(100vh - 240px);border:0;background:#0b1220"
            loading="eager"
          ></iframe>
        </div>
      </div>
    `;

    const btn = root.querySelector("#btnReloadPresenca");
    const frame = root.querySelector("#framePresenca");
    btn.onclick = () => {
      frame.src = `./${arquivoModelo}?v=${Date.now()}`;
    };
  }
};
