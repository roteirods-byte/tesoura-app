// app/js/panels/presenca_escalacao.js
window.TESOURA_PANELS = window.TESOURA_PANELS || {};

window.TESOURA_PANELS["presenca_escalacao"] = {
  title: "Presença / Escalação",
  async init() {
    const root = document.querySelector('[data-panel="presenca_escalacao"]');
    if (!root) return;

    // ===== SUPABASE (pega do app; se não achar, tenta montar via config) =====
    function getSupabase() {
      // padrões comuns no seu app
      if (window.sb) return window.sb;
      if (window.supabaseClient) return window.supabaseClient;

      // fallback (se existir config)
      const cfg = window.TESOURA_CONFIG || window.CONFIG || {};
      const url = cfg.SUPABASE_URL || cfg.supabaseUrl || cfg.url;
      const key = cfg.SUPABASE_KEY || cfg.supabaseKey || cfg.key;
      if (window.supabase && url && key) return window.supabase.createClient(url, key);

      throw new Error("Supabase client não encontrado (sb/supabaseClient/config).");
    }

    const supabase = getSupabase();

    // ====== HTML + CSS (IGUAL AO OFICIAL) ======
    root.innerHTML = `
      <div class="tesoura-presenca">
        <style>
          .tesoura-presenca{margin:0;padding:0;font-family:Arial,sans-serif;color:#f9fafb}
          .tesoura-presenca .container{max-width:1400px;margin:0 auto;padding:16px}
          .tesoura-presenca h2{margin:8px 0;color:#f97316;text-transform:uppercase}
          .tesoura-presenca .painel{background:#020617;border-radius:10px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,.45);margin-bottom:16px;font-size:13px}
          .tesoura-presenca .linhas-topo{display:flex;gap:16px;margin-bottom:16px}
          .tesoura-presenca .col-50{flex:1;min-width:0}
          .tesoura-presenca button{padding:10px 14px;border-radius:8px;border:none;cursor:pointer;font-weight:bold;text-transform:uppercase;font-size:12px;min-width:160px;height:44px}
          .tesoura-presenca .btn-primario{background:#22c55e;color:#022c22}
          .tesoura-presenca .btn-secundario{background:#0ea5e9;color:#0f172a}
          .tesoura-presenca .btn-perigo{background:#ef4444;color:#f9fafb}
          .tesoura-presenca .btn-neutro{background:#f97316;color:#0f172a}
          .tesoura-presenca .btn-chegou{background:#10b981;color:#022c22;min-width:160px}
          .tesoura-presenca .btn-sair{background:#f97316;color:#0f172a;min-width:90px;height:34px;border-radius:6px;font-size:11px}
          .tesoura-presenca .btn-nao-joga{background:#64748b;color:#e5e7eb;min-width:160px}
          .tesoura-presenca .btn-excluir{background:#ef4444;color:#f9fafb;min-width:120px}
          .tesoura-presenca table{width:100%;border-collapse:collapse;margin-top:10px;background:#020617;font-size:11px}
          .tesoura-presenca th,.tesoura-presenca td{border:1px solid #334155;padding:5px 6px;text-align:center;text-transform:uppercase;white-space:nowrap}
          .tesoura-presenca th{background:#111827;color:#f97316;position:sticky;top:0;z-index:1}
          .tesoura-presenca tr:nth-child(even){background:#0b1120}
          .tesoura-presenca tr:nth-child(odd){background:#020617}
          .tesoura-presenca .status-info{font-size:12px;margin-top:6px;color:#cbd5e1}
          .tesoura-presenca .painel-scroll{overflow-y:auto;max-height:360px;border-radius:8px}
          .tesoura-presenca .riscado{text-decoration:line-through;opacity:.55}
          .tesoura-presenca .obs-pago{color:#22c55e;font-weight:bold}
          .tesoura-presenca .obs-inad{color:#ef4444;font-weight:bold}
          .tesoura-presenca .grid-escalacao{display:flex;gap:16px;margin-top:12px}
          .tesoura-presenca .col-escalacao{flex:1;min-width:0}
          .tesoura-presenca .totais{font-weight:bold;text-align:right;margin-top:6px;font-size:12px;color:#cbd5e1}
          .tesoura-presenca .msg-salvar{font-size:13px;font-weight:bold;color:#22c55e;margin:6px 0 0;text-align:right;min-height:18px}
          .tesoura-presenca .legenda{font-size:11px;margin-top:10px;color:#cbd5e1}
          .tesoura-presenca .t-amarelo{color:#facc15;font-weight:bold}
          .tesoura-presenca .t-azul{color:#38bdf8;font-weight:bold}
        </style>

        <div class="container">

          <div class="painel" style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; justify-content:space-between;">
            <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
              <div style="color:#f97316;font-weight:bold;text-transform:uppercase;">Data do jogo:</div>
              <input id="data-jogo" type="date" style="height:44px;border-radius:8px;border:1px solid #334155;background:#0b1120;color:#f9fafb;padding:0 10px;" />
              <button id="btn-carregar" class="btn-secundario">Carregar</button>
              <button id="btn-salvar" class="btn-neutro">Salvar</button>
              <button id="btn-baixar" class="btn-secundario">Baixar arquivo (HTML)</button>
            </div>
            <div id="msg-topo" class="status-info"></div>
          </div>

          <div class="linhas-topo">
            <div class="col-50">
              <div class="painel">
                <h2>Jogadores (todos)</h2>
                <div class="status-info">Clique em <b>CHEGOU AGORA</b> quando o jogador chegar.</div>
                <div id="status-jogadores" class="status-info"></div>

                <div class="painel-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th style="width:70px">ID</th>
                        <th>APELIDO</th>
                        <th style="width:170px">CHEGOU AGORA</th>
                      </tr>
                    </thead>
                    <tbody id="tbody-jogadores-todos"></tbody>
                  </table>
                </div>

                <div id="status-total-jogadores" class="status-info"></div>
              </div>
            </div>

            <div class="col-50">
              <div class="painel">
                <h2>Presença hoje</h2>

                <div style="display:flex; justify-content:space-between; gap:12px; align-items:center;">
                  <div id="info-presentes" class="status-info"></div>
                  <div id="info-data-jogo" class="status-info"></div>
                </div>

                <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
                  <button id="btn-limpar-presentes" class="btn-perigo">Limpar hoje</button>
                  <button id="btn-escalar-1t" class="btn-primario">Escalar 1º tempo</button>
                </div>

                <div id="status-presentes" class="status-info"></div>

                <div class="painel-scroll" style="max-height:360px;">
                  <table>
                    <thead>
                      <tr>
                        <th style="width:70px">ORDEM</th>
                        <th>APELIDO</th>
                        <th style="width:120px">HORA</th>
                        <th style="width:200px">OBS</th>
                        <th style="width:160px">NÃO VAI JOGAR</th>
                        <th style="width:120px">EXCLUIR</th>
                      </tr>
                    </thead>
                    <tbody id="tbody-presentes"></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div class="painel">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
              <h2 style="margin:0;">Escalação do jogo</h2>
              <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                <div id="msg-salvar" class="msg-salvar"></div>
                <button id="btn-escalar-2t" class="btn-primario">Escalar 2º tempo</button>
              </div>
            </div>

            <div class="grid-escalacao">
              <div class="col-escalacao">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div class="t-amarelo" style="font-size:13px;">1º TEMPO</div>
                  <div class="status-info">Botão <b>SAIU</b> risca o nome.</div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th style="width:70px">ID</th>
                      <th style="width:60px">POS</th>
                      <th class="t-amarelo">AMARELO</th>
                      <th style="width:90px">SAIU</th>
                      <th class="t-azul">AZUL</th>
                      <th style="width:90px">SAIU</th>
                    </tr>
                  </thead>
                  <tbody id="tbody-1t"></tbody>
                </table>
                <div class="totais" id="totais-1t">TOTAL PONTOS: 0 x 0</div>
              </div>

              <div class="col-escalacao">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div class="t-amarelo" style="font-size:13px;">2º TEMPO</div>
                  <div class="status-info">Prioridade: quem não jogou.</div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th style="width:70px">ID</th>
                      <th style="width:60px">POS</th>
                      <th class="t-amarelo">AMARELO</th>
                      <th class="t-azul">AZUL</th>
                    </tr>
                  </thead>
                  <tbody id="tbody-2t"></tbody>
                </table>
                <div class="totais" id="totais-2t">TOTAL PONTOS: 0 x 0</div>
              </div>
            </div>

            <div class="legenda">
              <b>OBS:</b>
              C (compareceu e não jogou) | 1 (jogou 1º) | 2 (jogou 2º) | 1-2 (jogou os dois) |
              <span class="obs-pago">P (verde) pagou</span> |
              <span class="obs-inad">P (vermelho) não pagou</span>
            </div>
          </div>

        </div>
      </div>
    `;

    // ====== ELEMENTOS ======
    const dataJogoEl = root.querySelector("#data-jogo");
    const btnCarregar = root.querySelector("#btn-carregar");
    const btnSalvar = root.querySelector("#btn-salvar");
    const btnBaixar = root.querySelector("#btn-baixar");
    const msgTopo = root.querySelector("#msg-topo");

    const statusJogadores = root.querySelector("#status-jogadores");
    const statusTotalJogadores = root.querySelector("#status-total-jogadores");

    const infoPresentes = root.querySelector("#info-presentes");
    const infoDataJogo = root.querySelector("#info-data-jogo");
    const statusPresentes = root.querySelector("#status-presentes");

    const tbodyJogadoresTodos = root.querySelector("#tbody-jogadores-todos");
    const tbodyPresentes = root.querySelector("#tbody-presentes");

    const tbody1T = root.querySelector("#tbody-1t");
    const tbody2T = root.querySelector("#tbody-2t");
    const totais1TEl = root.querySelector("#totais-1t");
    const totais2TEl = root.querySelector("#totais-2t");
    const btnLimparPresentes = root.querySelector("#btn-limpar-presentes");
    const btnEscalar1T = root.querySelector("#btn-escalar-1t");
    const btnEscalar2T = root.querySelector("#btn-escalar-2t");
    const msgSalvarEl = root.querySelector("#msg-salvar");

    // ====== ESTADO ======
    let dataJogoIso = "";
    let todosJogadores = [];
    let presentesHoje = [];
    let mapaMensal = {}; // apelido -> {pago:boolean, status:string}
    let escala1 = { amarelo: [], azul: [], saiu: new Set() };
    let escala2 = { amarelo: [], azul: [] };

    // ====== HELPERS ======
    function hojeISO() {
      const d = new Date();
      const a = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dia = String(d.getDate()).padStart(2, "0");
      return `${a}-${m}-${dia}`;
    }

    function horaAgora() {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    }

    function anoMes(iso) {
      const [a, m] = iso.split("-").map((x) => parseInt(x, 10));
      return { ano: a, mes: m };
    }

    function limparEscalacoes() {
      escala1 = { amarelo: [], azul: [], saiu: new Set() };
      escala2 = { amarelo: [], azul: [] };
      msgSalvarEl.textContent = "";
    }

    function calcularTotalPontos(lista) {
      return lista.reduce((acc, it) => acc + (Number(it.pontos || 0) || 0), 0);
    }

    function obsMensal(apelido) {
      const m = mapaMensal[apelido];
      if (!m) return "";
      // “P” verde pagou / “P” vermelho não pagou (igual legenda)
      if (m.pago) return `<span class="obs-pago">P</span>`;
      return `<span class="obs-inad">P</span>`;
    }

    // ====== RENDER ======
    function renderJogadoresTodos() {
      tbodyJogadoresTodos.innerHTML = "";
      todosJogadores.forEach((j) => {
        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.textContent = j.id ?? "";
        tr.appendChild(tdId);

        const tdAp = document.createElement("td");
        tdAp.textContent = (j.apelido || "").toUpperCase();
        tr.appendChild(tdAp);

        const tdBtn = document.createElement("td");
        const btn = document.createElement("button");
        btn.className = "btn-chegou";
        btn.textContent = "CHEGOU AGORA";
        btn.onclick = () => marcarChegou(j);
        tdBtn.appendChild(btn);
        tr.appendChild(tdBtn);

        tbodyJogadoresTodos.appendChild(tr);
      });

      statusTotalJogadores.textContent = `TOTAL DE JOGADORES: ${todosJogadores.length}`;
    }

    function atualizarInfoPresentes() {
      infoPresentes.textContent = `PRESENTES HOJE: ${presentesHoje.length}`;
      infoDataJogo.textContent = dataJogoIso ? `DATA DO JOGO: ${dataJogoIso.split("-").reverse().join("/")}` : "";
    }

    function renderPresentes() {
      tbodyPresentes.innerHTML = "";

      presentesHoje.forEach((p, idx) => {
        const tr = document.createElement("tr");
        if (p.naoJoga) tr.classList.add("riscado");

        const tdOrdem = document.createElement("td");
        tdOrdem.textContent = String(idx + 1);
        tr.appendChild(tdOrdem);

        const tdAp = document.createElement("td");
        tdAp.textContent = (p.apelido || "").toUpperCase();
        tr.appendChild(tdAp);

        const tdHora = document.createElement("td");
        tdHora.textContent = p.hora || "";
        tr.appendChild(tdHora);

        const tdObs = document.createElement("td");
        tdObs.innerHTML = `${obsMensal(p.apelido)} ${p.obs || ""}`.trim();
        tr.appendChild(tdObs);

        const tdNao = document.createElement("td");
        const btnNao = document.createElement("button");
        btnNao.className = "btn-nao-joga";
        btnNao.textContent = p.naoJoga ? "VAI JOGAR" : "NÃO VAI JOGAR";
        btnNao.onclick = () => {
          p.naoJoga = !p.naoJoga;
          renderPresentes();
        };
        tdNao.appendChild(btnNao);
        tr.appendChild(tdNao);

        const tdEx = document.createElement("td");
        const btnEx = document.createElement("button");
        btnEx.className = "btn-excluir";
        btnEx.textContent = "EXCLUIR";
        btnEx.onclick = () => {
          presentesHoje = presentesHoje.filter((x) => x.apelido !== p.apelido);
          // se excluir, também tira das escalações
          limparEscalacoes();
          atualizarInfoPresentes();
          renderPresentes();
          renderEscalacoes();
        };
        tdEx.appendChild(btnEx);
        tr.appendChild(tdEx);

        tbodyPresentes.appendChild(tr);
      });

      statusPresentes.textContent = presentesHoje.length ? "Ordem real de chegada (use para escalar)." : "Nenhum jogador cadastrado hoje.";
    }

    function renderEscalacoes() {
      // 1T
      tbody1T.innerHTML = "";
      for (let i = 0; i < 10; i++) {
        const a = escala1.amarelo[i] || null;
        const b = escala1.azul[i] || null;

        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.textContent = a?.id ?? b?.id ?? "";
        tr.appendChild(tdId);

        const tdPos = document.createElement("td");
        tdPos.textContent = String(i + 1);
        tr.appendChild(tdPos);

        const tdAm = document.createElement("td");
        tdAm.textContent = a ? a.apelido.toUpperCase() : "";
        tdAm.className = a ? "t-amarelo" : "";
        if (a && escala1.saiu.has(`A:${a.apelido}`)) tdAm.classList.add("riscado");
        tr.appendChild(tdAm);

        const tdSaiuA = document.createElement("td");
        const btnSaiuA = document.createElement("button");
        btnSaiuA.className = "btn-sair";
        btnSaiuA.textContent = "SAIU";
        btnSaiuA.onclick = () => {
          if (!a) return;
          const k = `A:${a.apelido}`;
          if (escala1.saiu.has(k)) escala1.saiu.delete(k);
          else escala1.saiu.add(k);
          renderEscalacoes();
        };
        tdSaiuA.appendChild(btnSaiuA);
        tr.appendChild(tdSaiuA);

        const tdAz = document.createElement("td");
        tdAz.textContent = b ? b.apelido.toUpperCase() : "";
        tdAz.className = b ? "t-azul" : "";
        if (b && escala1.saiu.has(`B:${b.apelido}`)) tdAz.classList.add("riscado");
        tr.appendChild(tdAz);

        const tdSaiuB = document.createElement("td");
        const btnSaiuB = document.createElement("button");
        btnSaiuB.className = "btn-sair";
        btnSaiuB.textContent = "SAIU";
        btnSaiuB.onclick = () => {
          if (!b) return;
          const k = `B:${b.apelido}`;
          if (escala1.saiu.has(k)) escala1.saiu.delete(k);
          else escala1.saiu.add(k);
          renderEscalacoes();
        };
        tdSaiuB.appendChild(btnSaiuB);
        tr.appendChild(tdSaiuB);

        tbody1T.appendChild(tr);
      }

      // 2T
      tbody2T.innerHTML = "";
      for (let i = 0; i < 10; i++) {
        const a = escala2.amarelo[i] || null;
        const b = escala2.azul[i] || null;

        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.textContent = a?.id ?? b?.id ?? "";
        tr.appendChild(tdId);

        const tdPos = document.createElement("td");
        tdPos.textContent = String(i + 1);
        tr.appendChild(tdPos);

        const tdAm = document.createElement("td");
        tdAm.textContent = a ? a.apelido.toUpperCase() : "";
        tdAm.className = a ? "t-amarelo" : "";
        tr.appendChild(tdAm);

        const tdAz = document.createElement("td");
        tdAz.textContent = b ? b.apelido.toUpperCase() : "";
        tdAz.className = b ? "t-azul" : "";
        tr.appendChild(tdAz);

        tbody2T.appendChild(tr);
      }

      const totalAm1 = calcularTotalPontos(escala1.amarelo);
      const totalAz1 = calcularTotalPontos(escala1.azul);
      totais1TEl.textContent = `TOTAL PONTOS: ${totalAm1} x ${totalAz1}`;

      const totalAm2 = calcularTotalPontos(escala2.amarelo);
      const totalAz2 = calcularTotalPontos(escala2.azul);
      totais2TEl.textContent = `TOTAL PONTOS: ${totalAm2} x ${totalAz2}`;
    }

    // ====== AÇÕES ======
    function marcarChegou(j) {
      // não duplica
      if (presentesHoje.some((x) => x.apelido === j.apelido)) return;

      presentesHoje.push({
        id: j.id,
        apelido: j.apelido,
        pontos: j.pontos_totais ?? j.pontos ?? 0,
        hora: horaAgora(),
        obs: "",
        naoJoga: false,
      });

      msgSalvarEl.textContent = "";
      atualizarInfoPresentes();
      renderPresentes();
    }

    async function carregarMensalidadesDoMes(diaIso) {
      const { ano, mes } = anoMes(diaIso);

      const { data, error } = await supabase
        .from("mensalidades")
        .select("apelido, pago, status")
        .eq("ano", ano)
        .eq("mes", mes);

      if (error) {
        console.error(error);
        mapaMensal = {};
        return;
      }

      const mp = {};
      (data || []).forEach((m) => {
        mp[m.apelido] = { pago: !!m.pago, status: m.status || "" };
      });
      mapaMensal = mp;
    }

    async function carregarBase() {
      msgTopo.textContent = "CARREGANDO...";
      statusJogadores.textContent = "";

      dataJogoIso = dataJogoEl.value || hojeISO();
      dataJogoEl.value = dataJogoIso;

      // jogadores
      const { data: jog, error: errJog } = await supabase
        .from("jogadores")
        .select("*")
        .order("apelido", { ascending: true });

      if (errJog) {
        console.error(errJog);
        msgTopo.textContent = "ERRO AO CARREGAR JOGADORES.";
        return;
      }

      todosJogadores = (jog || []).filter((x) => (x.apelido || "").trim().length > 0);

      // mensal do mês da data
      await carregarMensalidadesDoMes(dataJogoIso);

      // reseta presença/escalacao (igual painel do projeto)
      presentesHoje = [];
      limparEscalacoes();

      renderJogadoresTodos();
      atualizarInfoPresentes();
      renderPresentes();
      renderEscalacoes();

      msgTopo.textContent = "BASE CARREGADA.";
      statusJogadores.textContent = "Jogadores carregados.";
    }

    function limparPresentesHoje() {
      if (!confirm("Limpar toda a presença de hoje?")) return;
      presentesHoje = [];
      limparEscalacoes();
      atualizarInfoPresentes();
      renderPresentes();
      renderEscalacoes();
    }

    function escalarPrimeiroTempo() {
      if (presentesHoje.length < 2) {
        alert("Poucos presentes para escalar.");
        return;
      }

      // pega 20 primeiros (ordem real)
      const lista = presentesHoje.filter((p) => !p.naoJoga).slice(0, 20);

      // alterna A/B
      const amarelo = [];
      const azul = [];
      lista.forEach((p, idx) => {
        const item = { id: p.id, apelido: p.apelido, pontos: p.pontos };
        if (idx % 2 === 0) amarelo.push(item);
        else azul.push(item);
      });

      escala1.amarelo = amarelo;
      escala1.azul = azul;
      escala1.saiu = new Set();

      // 2T limpa até gerar
      escala2.amarelo = [];
      escala2.azul = [];

      msgSalvarEl.textContent = "";
      renderEscalacoes();
    }

    function escalarSegundoTempo() {
      // prioridade: quem não jogou (fora dos 20 do 1T) + quem não “saiu”
      const jogou1T = new Set([
        ...escala1.amarelo.map((x) => x.apelido),
        ...escala1.azul.map((x) => x.apelido),
      ]);

      const saiu1T = new Set();
      escala1.saiu.forEach((k) => {
        const apelido = k.split(":")[1];
        saiu1T.add(apelido);
      });

      const candidatos = presentesHoje
        .filter((p) => !p.naoJoga)
        .map((p) => ({ id: p.id, apelido: p.apelido, pontos: p.pontos }))
        .sort((a, b) => a.apelido.localeCompare(b.apelido));

      // quem não jogou vem primeiro, depois quem saiu, depois o resto
      candidatos.sort((a, b) => {
        const aNao = jogou1T.has(a.apelido) ? 1 : 0;
        const bNao = jogou1T.has(b.apelido) ? 1 : 0;
        if (aNao !== bNao) return aNao - bNao;

        const aSaiu = saiu1T.has(a.apelido) ? 0 : 1;
        const bSaiu = saiu1T.has(b.apelido) ? 0 : 1;
        if (aSaiu !== bSaiu) return aSaiu - bSaiu;

        return a.apelido.localeCompare(b.apelido);
      });

      const top20 = candidatos.slice(0, 20);
      const amarelo = [];
      const azul = [];
      top20.forEach((p, idx) => {
        if (idx % 2 === 0) amarelo.push(p);
        else azul.push(p);
      });

      escala2.amarelo = amarelo;
      escala2.azul = azul;

      msgSalvarEl.textContent = "";
      renderEscalacoes();
    }

    // ===== SALVAR (IGUAL AO OFICIAL: apaga do dia e insere) =====
    async function salvarJogo() {
      if (!dataJogoIso) {
        alert("Base não carregada.");
        return;
      }

      try {
        msgTopo.textContent = "SALVANDO...";
        msgSalvarEl.textContent = "";

        const dia = dataJogoIso;

        // 1) presenças: apaga do dia e insere novamente
        const { error: errDelPres } = await supabase.from("presencas").delete().eq("data_jogo", dia);
        if (errDelPres) {
          console.error(errDelPres);
          alert("Erro ao limpar presenças do dia.");
          return;
        }

        const presentesSet = new Set(presentesHoje.map((p) => p.apelido));
        const presRows = todosJogadores.map((j) => ({
          data_jogo: dia,
          apelido: j.apelido,
          presenca: presentesSet.has(j.apelido),
          faltoso: !presentesSet.has(j.apelido),
        }));

        if (presRows.length) {
          const { error: errInsPres } = await supabase.from("presencas").insert(presRows);
          if (errInsPres) {
            console.error(errInsPres);
            alert("Erro ao salvar presenças.");
            return;
          }
        }

        // 2) escalação: apaga do dia e insere
        const { error: errDelEsc } = await supabase.from("escalacao").delete().eq("data_jogo", dia);
        if (errDelEsc) {
          console.error(errDelEsc);
          alert("Erro ao limpar escalação.");
          return;
        }

        const escRows = [];
        escala1.amarelo.forEach((e) => escRows.push({ data_jogo: dia, apelido: e.apelido, tempo: 1, time: "AMARELO" }));
        escala1.azul.forEach((e) => escRows.push({ data_jogo: dia, apelido: e.apelido, tempo: 1, time: "AZUL" }));
        escala2.amarelo.forEach((e) => escRows.push({ data_jogo: dia, apelido: e.apelido, tempo: 2, time: "AMARELO" }));
        escala2.azul.forEach((e) => escRows.push({ data_jogo: dia, apelido: e.apelido, tempo: 2, time: "AZUL" }));

        if (escRows.length) {
          const { error: errInsEsc } = await supabase.from("escalacao").insert(escRows);
          if (errInsEsc) {
            console.error(errInsEsc);
            alert("Erro ao salvar escalação.");
            return;
          }
        }

        msgSalvarEl.textContent = "PÁGINA SALVA";
        msgTopo.textContent = "SALVO.";
        alert("Página salva.");
      } catch (e) {
        console.error(e);
        alert("Erro ao salvar (veja F12 > Console).");
        msgTopo.textContent = "ERRO.";
      }
    }

    // ===== BAIXAR HTML (arquivo para impressão) =====
    function baixarArquivoHTML() {
      const titulo = `TESOURA - PRESENÇA_E_ESCALACAO - ${dataJogoIso || hojeISO()}`;
      const html = `
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${titulo}</title>
</head>
<body>
${root.querySelector(".tesoura-presenca")?.innerHTML || ""}
</body>
</html>`.trim();

      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${titulo}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }

    // ====== EVENTOS ======
    btnCarregar.addEventListener("click", carregarBase);
    btnSalvar.addEventListener("click", salvarJogo);
    btnBaixar.addEventListener("click", baixarArquivoHTML);
    btnLimparPresentes.addEventListener("click", limparPresentesHoje);
    btnEscalar1T.addEventListener("click", escalarPrimeiroTempo);
    btnEscalar2T.addEventListener("click", escalarSegundoTempo);

    // init
    dataJogoEl.value = hojeISO();
    await carregarBase();
  },
};
