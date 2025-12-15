// app/js/panels/presenca_escalacao.js
// REV: 5
// Painel PRESENÇA / ESCALAÇÃO
// Modelo: 1º tempo / 2º tempo + CHEGOU AGORA (igual ao projeto original)

window.TESOURA_PANELS = window.TESOURA_PANELS || {};

window.TESOURA_PANELS["presenca_escalacao"] = {
  title: "Presença / Escalação",

  async init() {
    const root = document.querySelector('[data-panel="presenca_escalacao"]');
    if (!root) return;

    root.innerHTML = `
      <div class="card">
        <h2 class="panel-title">TESOURA - PRESENÇA E ESCALAÇÃO</h2>
        <div class="muted">Jogadores carregados.</div>
      </div>

      <div class="grid-2">
        <!-- JOGADORES (TODOS) -->
        <div class="card">
          <h3>JOGADORES (TODOS)</h3>
          <p class="muted">Clique em <b>CHEGOU AGORA</b> quando o jogador entrar em campo.</p>

          <div class="row space-between">
            <span id="totalJogadores">TOTAL DE JOGADORES: 0</span>
            <button class="btn btn-secondary" id="recarregarJogadores">RECARREGAR LISTA</button>
          </div>

          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>APELIDO</th>
                  <th>AÇÃO</th>
                </tr>
              </thead>
              <tbody id="listaJogadores"></tbody>
            </table>
          </div>
        </div>

        <!-- PRESENTES HOJE -->
        <div class="card">
          <h3>PRESENTES HOJE</h3>
          <p class="muted">Ordem real de chegada para usar na escalação (corte 6:20).</p>

          <div class="row space-between">
            <button class="btn btn-danger" id="limparHoje">LIMPAR PRESENÇAS DE HOJE</button>
            <button class="btn btn-primary" id="escalarPrimeiroTempo">ESCALAR 1º TEMPO</button>
          </div>

          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>ORDEM</th>
                  <th>APELIDO</th>
                  <th>HORA</th>
                  <th>OBS</th>
                  <th>EXCLUIR</th>
                </tr>
              </thead>
              <tbody id="listaPresentes"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ESCALAÇÃO -->
      <div class="card">
        <h3>ESCALAÇÃO DO JOGO</h3>

        <div class="grid-2">
          <!-- 1º TEMPO -->
          <div>
            <h4>1º TEMPO</h4>
            <table class="table">
              <thead>
                <tr>
                  <th>POS</th>
                  <th class="team-yellow">AMARELO</th>
                  <th>SAIU</th>
                  <th class="team-blue">AZUL</th>
                  <th>SAIU</th>
                </tr>
              </thead>
              <tbody id="escala1tempo"></tbody>
            </table>
          </div>

          <!-- 2º TEMPO -->
          <div>
            <div class="row space-between">
              <h4>2º TEMPO</h4>
              <div>
                <button class="btn btn-secondary" id="escalarSegundoTempo">ESCALAR 2º TEMPO</button>
                <button class="btn btn-primary" id="salvarFechar">SALVAR (FECHAR JOGO)</button>
              </div>
            </div>

            <table class="table">
              <thead>
                <tr>
                  <th>POS</th>
                  <th class="team-yellow">AMARELO</th>
                  <th class="team-blue">AZUL</th>
                </tr>
              </thead>
              <tbody id="escala2tempo"></tbody>
            </table>

            <div class="legend">
              <b>Legenda (controle geral):</b><br>
              C = compareceu e NÃO jogou<br>
              F = faltou<br>
              1 = jogou só 1º tempo<br>
              2 = jogou só 2º tempo<br>
              1-2 = jogou os dois tempos<br>
              P (azul) = mensalidade paga | P (vermelho) = NÃO paga
            </div>
          </div>
        </div>
      </div>
    `;

    // ==== AQUI entram as funções ====
    // OBS: lógica mantida simples agora; depois conectamos 100% ao Supabase

    this.carregarJogadores();
  },

  async carregarJogadores() {
    const tbody = document.getElementById("listaJogadores");
    if (!tbody) return;

    // MOCK TEMPORÁRIO (substituir por Supabase)
    const jogadores = window.TESOURA_CACHE_JOGADORES || [];

    document.getElementById("totalJogadores").innerText =
      "TOTAL DE JOGADORES: " + jogadores.length;

    tbody.innerHTML = "";
    jogadores.forEach(j => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${j.apelido}</td>
        <td>
          <button class="btn btn-success btn-small">CHEGOU AGORA</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
};
