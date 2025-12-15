// app/js/panels/presenca_escalacao.js
window.TESOURA_PANELS = window.TESOURA_PANELS || {};

window.TESOURA_PANELS["presenca_escalacao"] = {
  title: "Presença / Escalação",
  async init() {
    const root = document.querySelector('[data-panel="presenca_escalacao"]');
    if (!root) return;

    const supabase = window.getSupabase();

    // ---------- UI ----------
    root.innerHTML = `
      <div class="card" style="margin-bottom:12px">
        <div class="row" style="align-items:end; gap:12px; flex-wrap:wrap">
          <div class="field" style="min-width:220px; flex:1">
            <label>DATA DO JOGO</label>
            <input id="pe_data" type="date" />
          </div>

          <div class="field" style="min-width:180px">
            <label>&nbsp;</label>
            <button id="pe_carregar" class="btn">CARREGAR</button>
          </div>

          <div class="field" style="min-width:180px">
            <label>&nbsp;</label>
            <button id="pe_salvar" class="btn btn-green">SALVAR</button>
          </div>

          <div class="field" style="min-width:220px">
            <label>&nbsp;</label>
            <button id="pe_baixar" class="btn btn-blue">BAIXAR ARQUIVO (HTML)</button>
          </div>
        </div>

        <div class="muted" style="margin-top:8px">
          C = compareceu | F = faltou | 1 = jogou 1 tempo | 2 = jogou 2 tempos
        </div>
        <div id="pe_msg" class="muted" style="margin-top:8px"></div>
      </div>

      <div class="row" style="gap:12px; flex-wrap:wrap">
        <div class="card" style="flex:1; min-width:320px">
          <div class="row" style="justify-content:space-between; align-items:center">
            <h2 style="margin:0; font-size:16px; color:var(--accent)">Chegou agora</h2>
            <span id="pe_status_jogadores" class="muted"></span>
          </div>

          <div style="overflow:auto; margin-top:10px; max-height:340px">
            <table class="table">
              <thead>
                <tr>
                  <th style="width:70px">ID</th>
                  <th>APELIDO</th>
                  <th style="width:170px">CHEGOU</th>
                </tr>
              </thead>
              <tbody id="pe_tbody_jogadores"></tbody>
            </table>
          </div>

          <div class="muted" style="margin-top:8px">Total de jogadores: <b id="pe_total_jogadores">0</b></div>
        </div>

        <div class="card" style="flex:1.2; min-width:340px">
          <div class="row" style="justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap">
            <h2 style="margin:0; font-size:16px; color:var(--accent)">Lista de chegada (hoje)</h2>

            <div class="row" style="gap:8px; flex-wrap:wrap">
              <button id="pe_limpar_hoje" class="btn btn-orange">LIMPAR HOJE</button>
              <button id="pe_escalar_1" class="btn btn-green">ESCALAR 1º TEMPO</button>
            </div>
          </div>

          <div style="overflow:auto; margin-top:10px; max-height:340px">
            <table class="table">
              <thead>
                <tr>
                  <th style="width:60px">ID</th>
                  <th style="width:70px">ORDEM</th>
                  <th>APELIDO</th>
                  <th style="width:95px">HORA</th>
                  <th style="width:90px">OBS</th>
                  <th style="width:160px">NÃO VAI JOGAR</th>
                  <th style="width:120px">EXCLUIR</th>
                </tr>
              </thead>
              <tbody id="pe_tbody_presentes"></tbody>
            </table>
          </div>

          <div id="pe_status_presentes" class="muted" style="margin-top:8px"></div>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="row" style="justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap">
          <h2 style="margin:0; font-size:16px; color:var(--accent)">Escalação do jogo</h2>
          <div class="row" style="gap:8px; flex-wrap:wrap">
            <button id="pe_escalar_2" class="btn btn-green">ESCALAR 2º TEMPO</button>
            <button id="pe_limpar_esc" class="btn btn-orange">LIMPAR ESCALAÇÃO</button>
          </div>
        </div>

        <div class="row" style="gap:12px; margin-top:10px; flex-wrap:wrap">
          <div style="flex:1; min-width:300px">
            <div class="muted" style="margin-bottom:6px"><b>1º TEMPO</b> (botão SAÍU risca o nome)</div>
            <div class="row" style="gap:12px; flex-wrap:wrap">
              <div style="flex:1; min-width:240px">
                <div class="muted" style="margin-bottom:6px; color:#ffd54a"><b>AMARELO</b></div>
                <div style="overflow:auto; max-height:320px">
                  <table class="table">
                    <thead><tr><th style="width:60px">POS</th><th>APELIDO</th><th style="width:90px">SAIU</th></tr></thead>
                    <tbody id="pe_1_am"></tbody>
                  </table>
                </div>
              </div>
              <div style="flex:1; min-width:240px">
                <div class="muted" style="margin-bottom:6px; color:#66b2ff"><b>AZUL</b></div>
                <div style="overflow:auto; max-height:320px">
                  <table class="table">
                    <thead><tr><th style="width:60px">POS</th><th>APELIDO</th><th style="width:90px">SAIU</th></tr></thead>
                    <tbody id="pe_1_az"></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div style="flex:1; min-width:300px">
            <div class="muted" style="margin-bottom:6px"><b>2º TEMPO</b> (prioridade: quem não jogou)</div>
            <div class="row" style="gap:12px; flex-wrap:wrap">
              <div style="flex:1; min-width:240px">
                <div class="muted" style="margin-bottom:6px; color:#ffd54a"><b>AMARELO</b></div>
                <div style="overflow:auto; max-height:320px">
                  <table class="table">
                    <thead><tr><th style="width:60px">POS</th><th>APELIDO</th></tr></thead>
                    <tbody id="pe_2_am"></tbody>
                  </table>
                </div>
              </div>
              <div style="flex:1; min-width:240px">
                <div class="muted" style="margin-bottom:6px; color:#66b2ff"><b>AZUL</b></div>
                <div style="overflow:auto; max-height:320px">
                  <table class="table">
                    <thead><tr><th style="width:60px">POS</th><th>APELIDO</th></tr></thead>
                    <tbody id="pe_2_az"></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // ---------- helpers ----------
    const $ = (id) => root.querySelector(id);
    const msgEl = $("#pe_msg");

    function hojeIso() {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }

    function formatHora(d) {
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    }

    function downloadHtmlFile(filename, html) {
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    }

    // ---------- state ----------
    let dataJogoIso = hojeIso();
    let todosJogadores = [];
    let presentesHoje = []; // {id, apelido, horaChegada, naoVaiJogar, obs, saiu}
    let escala1 = { amarelo: [], azul: [] }; // {apelido, saiu}
    let escala2 = { amarelo: [], azul: [] }; // {apelido}

    // ---------- elements ----------
    const dataEl = $("#pe_data");
    const btCarregar = $("#pe_carregar");
    const btSalvar = $("#pe_salvar");
    const btBaixar = $("#pe_baixar");
    const btLimparHoje = $("#pe_limpar_hoje");
    const btEscalar1 = $("#pe_escalar_1");
    const btEscalar2 = $("#pe_escalar_2");
    const btLimparEsc = $("#pe_limpar_esc");

    const tbodyJogadores = $("#pe_tbody_jogadores");
    const totalJogadoresEl = $("#pe_total_jogadores");
    const statusJogadoresEl = $("#pe_status_jogadores");

    const tbodyPresentes = $("#pe_tbody_presentes");
    const statusPresentesEl = $("#pe_status_presentes");

    const t1am = $("#pe_1_am");
    const t1az = $("#pe_1_az");
    const t2am = $("#pe_2_am");
    const t2az = $("#pe_2_az");

    // ---------- core (portado do R5) ----------
    async function carregarBase() {
      try {
        msgEl.textContent = "";

        // 1) jogadores
        const { data: jogs, error: e1 } = await supabase
          .from("jogadores")
          .select("id, apelido")
          .eq("ativo", true)
          .order("apelido", { ascending: true });

        if (e1) throw e1;
        todosJogadores = (jogs || []).map((j) => ({ id: j.id, apelido: j.apelido }));

        totalJogadoresEl.textContent = String(todosJogadores.length);
        statusJogadoresEl.textContent = "Lista carregada.";

        // 2) presencas do dia (usamos a tabela escalacao/presencas como no R5)
        // R5 salva presenças “completas” (todos jogadores com presenca/faltoso).
        // Aqui vamos buscar escalação salva e derivar presentes + buscar presenças para marcar.
        // Primeiro: buscar escalação salva do dia
        const { data: esc, error: e2 } = await supabase
          .from("escalacao")
          .select("apelido, tempo, time")
          .eq("data_jogo", dataJogoIso);

        if (e2) throw e2;

        // buscar presencas para identificar quem compareceu
        const { data: pres, error: e3 } = await supabase
          .from("presencas")
          .select("apelido, presenca")
          .eq("data_jogo", dataJogoIso);

        if (e3) throw e3;

        const presSet = new Set((pres || []).filter((p) => p.presenca).map((p) => p.apelido));

        // montar presentesHoje apenas com os que compareceram (se já existir no banco)
        presentesHoje = [];
        (todosJogadores || []).forEach((j) => {
          if (presSet.has(j.apelido)) {
            presentesHoje.push({
              id: j.id,
              apelido: j.apelido,
              horaChegada: "00:00:00",
              naoVaiJogar: false,
              obs: "",
              saiu: false,
            });
          }
        });

        // reconstruir escalações (se houver)
        escala1 = { amarelo: [], azul: [] };
        escala2 = { amarelo: [], azul: [] };

        (esc || []).forEach((r) => {
          if (r.tempo === 1) {
            if (r.time === "AMARELO") escala1.amarelo.push({ apelido: r.apelido, saiu: false });
            if (r.time === "AZUL") escala1.azul.push({ apelido: r.apelido, saiu: false });
          }
          if (r.tempo === 2) {
            if (r.time === "AMARELO") escala2.amarelo.push({ apelido: r.apelido });
            if (r.time === "AZUL") escala2.azul.push({ apelido: r.apelido });
          }
        });

        renderJogadores();
        renderPresentes();
        renderEscalacoes();
      } catch (e) {
        console.error(e);
        alert("Erro ao carregar (veja F12 > Console).");
      }
    }

    function renderJogadores() {
      tbodyJogadores.innerHTML = "";
      (todosJogadores || []).forEach((j) => {
        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.textContent = j.id ?? "";
        tr.appendChild(tdId);

        const tdAp = document.createElement("td");
        tdAp.textContent = (j.apelido || "").toUpperCase();
        tr.appendChild(tdAp);

        const tdBtn = document.createElement("td");
        const bt = document.createElement("button");
        bt.textContent = "CHEGOU AGORA";
        bt.className = "btn btn-green";
        bt.onclick = () => marcarChegada(j);
        tdBtn.appendChild(bt);
        tr.appendChild(tdBtn);

        tbodyJogadores.appendChild(tr);
      });
    }

    function renderPresentes() {
      tbodyPresentes.innerHTML = "";

      presentesHoje.forEach((p, idx) => {
        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.textContent = p.id ?? "";
        tr.appendChild(tdId);

        const tdOrd = document.createElement("td");
        tdOrd.textContent = idx + 1;
        tr.appendChild(tdOrd);

        const tdAp = document.createElement("td");
        tdAp.textContent = (p.apelido || "").toUpperCase();
        if (p.saiu) tdAp.style.textDecoration = "line-through";
        tr.appendChild(tdAp);

        const tdHora = document.createElement("td");
        tdHora.textContent = p.horaChegada || "";
        tr.appendChild(tdHora);

        const tdObs = document.createElement("td");
        const inpObs = document.createElement("input");
        inpObs.type = "text";
        inpObs.value = p.obs || "";
        inpObs.placeholder = "1-P";
        inpObs.onchange = () => atualizarObs(p.apelido, inpObs.value);
        inpObs.style.width = "80px";
        tdObs.appendChild(inpObs);
        tr.appendChild(tdObs);

        const tdNao = document.createElement("td");
        const btNao = document.createElement("button");
        btNao.textContent = p.naoVaiJogar ? "VAI JOGAR" : "NÃO VAI JOGAR";
        btNao.className = "btn btn-blue";
        btNao.onclick = () => toggleNaoVaiJogar(p.apelido);
        tdNao.appendChild(btNao);
        tr.appendChild(tdNao);

        const tdExc = document.createElement("td");
        const btExc = document.createElement("button");
        btExc.textContent = "EXCLUIR";
        btExc.className = "btn btn-red";
        btExc.onclick = () => excluirPresente(p.apelido);
        tdExc.appendChild(btExc);
        tr.appendChild(tdExc);

        tbodyPresentes.appendChild(tr);
      });

      statusPresentesEl.textContent = presentesHoje.length
        ? "Lista carregada."
        : "Nenhum jogador cadastrado hoje.";
    }

    function renderEscalacoes() {
      // 1º tempo
      t1am.innerHTML = "";
      t1az.innerHTML = "";
      (escala1.amarelo || []).forEach((e, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${i + 1}</td>
          <td style="${e.saiu ? "text-decoration:line-through" : ""}">${(e.apelido || "").toUpperCase()}</td>
          <td><button class="btn btn-orange">SAIU</button></td>
        `;
        tr.querySelector("button").onclick = () => toggleSaiu(1, "AMARELO", e.apelido);
        t1am.appendChild(tr);
      });

      (escala1.azul || []).forEach((e, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${i + 1}</td>
          <td style="${e.saiu ? "text-decoration:line-through" : ""}">${(e.apelido || "").toUpperCase()}</td>
          <td><button class="btn btn-orange">SAIU</button></td>
        `;
        tr.querySelector("button").onclick = () => toggleSaiu(1, "AZUL", e.apelido);
        t1az.appendChild(tr);
      });

      // 2º tempo
      t2am.innerHTML = "";
      t2az.innerHTML = "";
      (escala2.amarelo || []).forEach((e, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${i + 1}</td><td>${(e.apelido || "").toUpperCase()}</td>`;
        t2am.appendChild(tr);
      });
      (escala2.azul || []).forEach((e, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${i + 1}</td><td>${(e.apelido || "").toUpperCase()}</td>`;
        t2az.appendChild(tr);
      });
    }

    function marcarChegada(j) {
      const apelido = j?.apelido;
      if (!apelido) return;

      if (presentesHoje.find((p) => p.apelido === apelido)) {
        alert("Este jogador já está na lista de presença hoje.");
        return;
      }

      const registro = {
        id: j.id,
        apelido,
        horaChegada: formatHora(new Date()),
        naoVaiJogar: false,
        obs: "",
        saiu: false,
      };

      presentesHoje.push(registro);
      renderPresentes();
    }

    function excluirPresente(apelido) {
      presentesHoje = presentesHoje.filter((p) => p.apelido !== apelido);
      renderPresentes();
    }

    function toggleNaoVaiJogar(apelido) {
      const p = presentesHoje.find((x) => x.apelido === apelido);
      if (!p) return;
      p.naoVaiJogar = !p.naoVaiJogar;
      renderPresentes();
    }

    function atualizarObs(apelido, valor) {
      const p = presentesHoje.find((x) => x.apelido === apelido);
      if (!p) return;
      p.obs = (valor || "").trim();
      renderPresentes();
    }

    function toggleSaiu(tempo, time, apelido) {
      if (tempo !== 1) return;
      const arr = time === "AMARELO" ? escala1.amarelo : escala1.azul;
      const e = (arr || []).find((x) => x.apelido === apelido);
      if (!e) return;
      e.saiu = !e.saiu;
      // também risca no “presentes”
      const p = presentesHoje.find((x) => x.apelido === apelido);
      if (p) p.saiu = e.saiu;
      renderPresentes();
      renderEscalacoes();
    }

    function balancearEmDoisTimes(lista) {
      const am = [];
      const az = [];
      lista.forEach((apelido, i) => (i % 2 === 0 ? am.push(apelido) : az.push(apelido)));
      return { amarelo: am, azul: az };
    }

    function escalarPrimeiroTempo() {
      const aptos = presentesHoje.filter((p) => !p.naoVaiJogar).map((p) => p.apelido);
      const { amarelo, azul } = balancearEmDoisTimes(aptos);
      escala1 = {
        amarelo: amarelo.map((a) => ({ apelido: a, saiu: false })),
        azul: azul.map((a) => ({ apelido: a, saiu: false })),
      };
      renderEscalacoes();
    }

    function escalarSegundoTempo() {
      // regra simples: quem NÃO saiu (ou quem não jogou) pode ter prioridade depois.
      // aqui: lista aptos sem “não vai jogar”, mantendo ordem de chegada
      const aptos = presentesHoje.filter((p) => !p.naoVaiJogar).map((p) => p.apelido);
      const { amarelo, azul } = balancearEmDoisTimes(aptos);
      escala2 = {
        amarelo: amarelo.map((a) => ({ apelido: a })),
        azul: azul.map((a) => ({ apelido: a })),
      };
      renderEscalacoes();
    }

    async function limparPresentesHoje() {
      if (!confirm("Limpar a lista de presença de HOJE (somente na tela)?")) return;
      presentesHoje = [];
      escala1 = { amarelo: [], azul: [] };
      escala2 = { amarelo: [], azul: [] };
      renderPresentes();
      renderEscalacoes();
    }

    async function limparEscalacoes() {
      if (!confirm("Limpar escalação (somente na tela)?")) return;
      escala1 = { amarelo: [], azul: [] };
      escala2 = { amarelo: [], azul: [] };
      renderEscalacoes();
    }

    async function salvarJogo() {
      try {
        msgEl.textContent = "";

        const dia = dataJogoIso;

        // 1) presenças: apaga do dia e insere novamente (modelo do R5)
        const { error: errDelPres } = await supabase.from("presencas").delete().eq("data_jogo", dia);
        if (errDelPres) throw errDelPres;

        const presentesSet = new Set(presentesHoje.map((p) => p.apelido));
        const presRows = (todosJogadores || []).map((j) => ({
          data_jogo: dia,
          apelido: j.apelido,
          presenca: presentesSet.has(j.apelido),
          faltoso: !presentesSet.has(j.apelido),
        }));

        if (presRows.length) {
          const { error: errInsPres } = await supabase.from("presencas").insert(presRows);
          if (errInsPres) throw errInsPres;
        }

        // 2) escalação: apaga do dia e insere
        const { error: errDelEsc } = await supabase.from("escalacao").delete().eq("data_jogo", dia);
        if (errDelEsc) throw errDelEsc;

        const escRows = [];
        (escala1.amarelo || []).forEach((e) => escRows.push({ data_jogo: dia, apelido: e.apelido, tempo: 1, time: "AMARELO" }));
        (escala1.azul || []).forEach((e) => escRows.push({ data_jogo: dia, apelido: e.apelido, tempo: 1, time: "AZUL" }));
        (escala2.amarelo || []).forEach((e) => escRows.push({ data_jogo: dia, apelido: e.apelido, tempo: 2, time: "AMARELO" }));
        (escala2.azul || []).forEach((e) => escRows.push({ data_jogo: dia, apelido: e.apelido, tempo: 2, time: "AZUL" }));

        if (escRows.length) {
          const { error: errInsEsc } = await supabase.from("escalacao").insert(escRows);
          if (errInsEsc) throw errInsEsc;
        }

        msgEl.textContent = "PÁGINA SALVA";
        alert("Página salva.");
      } catch (e) {
        console.error(e);
        alert("Erro ao salvar (veja F12 > Console).");
      }
    }

    function baixarArquivo() {
      const html = `
<!doctype html><html lang="pt-BR"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Tesoura - Presença/Escalação (${dataJogoIso})</title>
<style>
body{font-family:Arial; padding:16px}
h1{margin:0 0 12px 0}
table{border-collapse:collapse; width:100%; margin:10px 0}
th,td{border:1px solid #ccc; padding:6px; font-size:12px}
th{background:#f2f2f2}
.small{color:#666; font-size:12px}
</style></head><body>
<h1>Presença / Escalação</h1>
<div class="small">Data: ${dataJogoIso}</div>

<h2>Presentes</h2>
<table><thead><tr><th>#</th><th>Apelido</th><th>Hora</th><th>Obs</th><th>Não vai jogar</th></tr></thead><tbody>
${presentesHoje.map((p,i)=>`<tr><td>${i+1}</td><td>${(p.apelido||"").toUpperCase()}</td><td>${p.horaChegada||""}</td><td>${p.obs||""}</td><td>${p.naoVaiJogar?"SIM":"NÃO"}</td></tr>`).join("")}
</tbody></table>

<h2>Escalação 1º tempo</h2>
<table><thead><tr><th>Time</th><th>Pos</th><th>Apelido</th></tr></thead><tbody>
${(escala1.amarelo||[]).map((e,i)=>`<tr><td>AMARELO</td><td>${i+1}</td><td>${(e.apelido||"").toUpperCase()}</td></tr>`).join("")}
${(escala1.azul||[]).map((e,i)=>`<tr><td>AZUL</td><td>${i+1}</td><td>${(e.apelido||"").toUpperCase()}</td></tr>`).join("")}
</tbody></table>

<h2>Escalação 2º tempo</h2>
<table><thead><tr><th>Time</th><th>Pos</th><th>Apelido</th></tr></thead><tbody>
${(escala2.amarelo||[]).map((e,i)=>`<tr><td>AMARELO</td><td>${i+1}</td><td>${(e.apelido||"").toUpperCase()}</td></tr>`).join("")}
${(escala2.azul||[]).map((e,i)=>`<tr><td>AZUL</td><td>${i+1}</td><td>${(e.apelido||"").toUpperCase()}</td></tr>`).join("")}
</tbody></table>

</body></html>`;
      downloadHtmlFile(`tesoura_presenca_escalacao_${dataJogoIso}.html`, html);
    }

    // ---------- events ----------
    dataEl.value = dataJogoIso;

    btCarregar.onclick = async () => {
      dataJogoIso = dataEl.value || hojeIso();
      await carregarBase();
    };

    btSalvar.onclick = async () => {
      dataJogoIso = dataEl.value || hojeIso();
      await salvarJogo();
    };

    btLimparHoje.onclick = async () => limparPresentesHoje();
    btEscalar1.onclick = () => escalarPrimeiroTempo();
    btEscalar2.onclick = () => escalarSegundoTempo();
    btLimparEsc.onclick = async () => limparEscalacoes();
    btBaixar.onclick = () => baixarArquivo();

    // start
    await carregarBase();
  },
};
