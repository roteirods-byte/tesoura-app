// app/js/panels/jogadores.js
window.TESOURA_PANELS = window.TESOURA_PANELS || {};

window.TESOURA_PANELS["jogadores"] = {
  title: "Jogadores",
  async init() {
    const root = document.querySelector('[data-panel="jogadores"]');
    if (!root) return;

    root.innerHTML = `
      <div class="card">
        <h2 style="margin:0 0 10px 0; font-size:16px; color: var(--accent)">Cadastrar / Editar Jogador</h2>

        <div class="row" style="gap:12px">
          <div class="field" style="flex:1; min-width:140px">
            <label>NÚMERO DA CAMISA</label>
            <input id="j_camisa" type="number" inputmode="numeric" />
          </div>

          <div class="field" style="flex:2; min-width:220px">
            <label>NOME COMPLETO</label>
            <input id="j_nome" type="text" />
          </div>

          <div class="field" style="flex:1; min-width:160px">
            <label>APELIDO (ÚNICO)</label>
            <input id="j_apelido" type="text" />
          </div>

          <div class="field" style="flex:1; min-width:160px">
            <label>DATA DE NASCIMENTO</label>
            <input id="j_data_nasc" type="date" />
          </div>
        </div>

        <div class="row" style="gap:12px; margin-top:12px">
          <div class="field" style="flex:1; min-width:200px">
            <label>CELULAR (WHATSAPP)</label>
            <input id="j_celular" type="text" />
          </div>

          <div class="field" style="flex:1; min-width:140px">
            <label>POSIÇÃO (D/M/A)</label>
            <input id="j_posicao" type="text" maxlength="1" />
          </div>

          <div class="field" style="flex:1; min-width:140px">
            <label>HABILIDADE (1–5)</label>
            <input id="j_hab" type="number" min="1" max="5" inputmode="numeric" />
          </div>

          <div class="field" style="flex:1; min-width:160px">
            <label>VELOCIDADE (1–L,2–N,3–I)</label>
            <input id="j_vel" type="number" min="1" max="3" inputmode="numeric" />
          </div>

          <div class="field" style="flex:1; min-width:160px">
            <label>MOVIMENTAÇÃO (1–P,2–N,3–I)</label>
            <input id="j_mov" type="number" min="1" max="3" inputmode="numeric" />
          </div>

          <div class="field" style="flex:1; min-width:140px">
            <label>PONTOS (AUTO)</label>
            <input id="j_pontos" type="number" disabled />
          </div>
        </div>

        <div class="row" style="margin-top:12px">
          <button class="btn primary" id="j_btn_salvar">SALVAR</button>
          <button class="btn accent" id="j_btn_cancelar">CANCELAR EDIÇÃO</button>
          <button class="btn secondary" id="j_btn_baixar">BAIXAR ARQUIVO (HTML)</button>
        </div>

        <div id="j_status" class="muted" style="margin-top:10px; font-size:13px"></div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="row" style="align-items:center; justify-content:space-between">
          <div>
            <h2 style="margin:0; font-size:16px; color: var(--accent)">Lista de Jogadores</h2>
            <div class="muted" style="font-size:12px; margin-top:4px">
              Ordem alfabética por apelido. Idade calculada automática.
            </div>
          </div>
          <button class="btn secondary" id="j_btn_recarregar">RECARREGAR</button>
        </div>

        <div class="tablewrap" style="margin-top:12px">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>CAMISA</th>
                <th>APELIDO</th>
                <th>NOME</th>
                <th>DATA NASC.</th>
                <th>IDADE</th>
                <th>CELULAR</th>
                <th>POS</th>
                <th>HAB</th>
                <th>VEL</th>
                <th>MOV</th>
                <th>PONTOS</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody id="j_tbody"></tbody>
          </table>
        </div>
      </div>
    `;

    const supabase = window.getSupabase();

    const el = (id) => root.querySelector(id);

    const camisaInput = el("#j_camisa");
    const nomeInput = el("#j_nome");
    const apelidoInput = el("#j_apelido");
    const dataNascInput = el("#j_data_nasc");
    const celularInput = el("#j_celular");
    const posicaoInput = el("#j_posicao");
    const habInput = el("#j_hab");
    const velInput = el("#j_vel");
    const movInput = el("#j_mov");
    const pontosInput = el("#j_pontos");

    const tbody = el("#j_tbody");
    const statusEl = el("#j_status");

    const btnSalvar = el("#j_btn_salvar");
    const btnCancelar = el("#j_btn_cancelar");
    const btnRecarregar = el("#j_btn_recarregar");
    const btnBaixar = el("#j_btn_baixar");

    let editId = null;
    let cacheJogadores = [];

    function up(s) {
      return (s || "").toString().trim().toUpperCase();
    }

    function calcularIdade(dataISO) {
      if (!dataISO) return "";
      const hoje = new Date();
      const nasc = new Date(dataISO);
      let idade = hoje.getFullYear() - nasc.getFullYear();
      const m = hoje.getMonth() - nasc.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
      return idade;
    }

    function calcPontosAuto() {
      const hab = habInput.value ? parseInt(habInput.value, 10) : 0;
      const vel = velInput.value ? parseInt(velInput.value, 10) : 0;
      const mov = movInput.value ? parseInt(movInput.value, 10) : 0;
      const pontos = hab + vel + mov;
      pontosInput.value = pontos ? String(pontos) : "";
    }

    function setStatus(msg) {
      statusEl.textContent = msg || "";
    }

    function limparFormulario() {
      editId = null;
      camisaInput.value = "";
      nomeInput.value = "";
      apelidoInput.value = "";
      dataNascInput.value = "";
      celularInput.value = "";
      posicaoInput.value = "";
      habInput.value = "";
      velInput.value = "";
      movInput.value = "";
      pontosInput.value = "";
      setStatus("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function renderTabela(lista) {
      tbody.innerHTML = "";
      lista.forEach((j) => {
        const tr = document.createElement("tr");

        const td = (txt) => {
          const c = document.createElement("td");
          c.textContent = txt ?? "";
          return c;
        };

        tr.appendChild(td(j.id));
        tr.appendChild(td(j.camisa ?? ""));
        tr.appendChild(td(up(j.apelido)));
        tr.appendChild(td(up(j.nome)));
        tr.appendChild(td(j.data_nasc || ""));
        tr.appendChild(td(calcularIdade(j.data_nasc) || ""));
        tr.appendChild(td(j.celular || ""));
        tr.appendChild(td(up(j.posicao)));
        tr.appendChild(td(j.hab ?? ""));
        tr.appendChild(td(j.vel ?? ""));
        tr.appendChild(td(j.mov ?? ""));
        tr.appendChild(td(j.pontos ?? ""));

        const tdAcoes = document.createElement("td");
        tdAcoes.style.whiteSpace = "nowrap";

        const bEdit = document.createElement("button");
        bEdit.className = "btn accent";
        bEdit.style.padding = "8px 10px";
        bEdit.style.borderRadius = "12px";
        bEdit.textContent = "EDITAR";
        bEdit.onclick = () => editarJogador(j);

        const bDel = document.createElement("button");
        bDel.className = "btn danger";
        bDel.style.padding = "8px 10px";
        bDel.style.borderRadius = "12px";
        bDel.style.marginLeft = "8px";
        bDel.textContent = "EXCLUIR";
        bDel.onclick = () => excluirJogador(j.id);

        tdAcoes.appendChild(bEdit);
        tdAcoes.appendChild(bDel);
        tr.appendChild(tdAcoes);

        tbody.appendChild(tr);
      });

      setStatus(`TOTAL DE JOGADORES: ${lista.length}`);
    }

    async function carregarJogadores() {
      setStatus("CARREGANDO JOGADORES...");
      const { data, error } = await supabase
        .from("jogadores")
        .select("*")
        .order("apelido", { ascending: true });

      if (error) {
        console.error(error);
        setStatus("ERRO AO CARREGAR JOGADORES.");
        return;
      }

      cacheJogadores = data || [];
      renderTabela(cacheJogadores);
    }

    function editarJogador(j) {
      editId = j.id;
      camisaInput.value = j.camisa ?? "";
      nomeInput.value = j.nome ?? "";
      apelidoInput.value = j.apelido ?? "";
      dataNascInput.value = j.data_nasc || "";
      celularInput.value = j.celular || "";
      posicaoInput.value = j.posicao || "";
      habInput.value = j.hab ?? "";
      velInput.value = j.vel ?? "";
      movInput.value = j.mov ?? "";
      calcPontosAuto();
      setStatus(`EDITANDO JOGADOR ID ${j.id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function excluirJogador(id) {
      if (!confirm("CONFIRMAR EXCLUSÃO DEFINITIVA DO JOGADOR?")) return;

      const { error } = await supabase.from("jogadores").delete().eq("id", id);

      if (error) {
        console.error(error);
        setStatus("ERRO AO EXCLUIR JOGADOR: " + (error.message || ""));
        return;
      }

      setStatus("JOGADOR EXCLUÍDO COM SUCESSO.");
      await carregarJogadores();
    }

    async function salvarJogador() {
      const camisa = camisaInput.value ? parseInt(camisaInput.value, 10) : null;
      const nome = up(nomeInput.value);
      const apelido = up(apelidoInput.value);
      const data_nasc = dataNascInput.value || null;
      const celular = (celularInput.value || "").toString().trim();
      const posicao = up(posicaoInput.value).slice(0, 1);

      const hab = habInput.value ? parseInt(habInput.value, 10) : null;
      const vel = velInput.value ? parseInt(velInput.value, 10) : null;
      const mov = movInput.value ? parseInt(movInput.value, 10) : null;

      let pontos = null;
      if (hab !== null || vel !== null || mov !== null) {
        pontos = (hab || 0) + (vel || 0) + (mov || 0);
      }

      if (!apelido) {
        setStatus("INFORME PELO MENOS O APELIDO.");
        return;
      }

      const payload = {
        camisa,
        nome,
        apelido,
        data_nasc,
        celular,
        posicao,
        hab,
        vel,
        mov,
        pontos,
        ativo: true,
      };

      setStatus("SALVANDO...");
      let error;

      if (editId === null) {
        const resp = await supabase.from("jogadores").insert(payload);
        error = resp.error;
      } else {
        const resp = await supabase.from("jogadores").update(payload).eq("id", editId);
        error = resp.error;
      }

      if (error) {
        console.error(error);
        setStatus("ERRO AO SALVAR JOGADOR.");
        return;
      }

      setStatus("JOGADOR SALVO COM SUCESSO.");
      limparFormulario();
      await carregarJogadores();
    }

    function baixarArquivoHTML() {
      // Gera um arquivo HTML “imprimível/arquivável” do painel de jogadores (tabela completa)
      const hoje = new Date().toISOString().slice(0, 10);

      const rows = (cacheJogadores || []).map(j => `
        <tr>
          <td>${j.id ?? ""}</td>
          <td>${j.camisa ?? ""}</td>
          <td>${up(j.apelido)}</td>
          <td>${up(j.nome)}</td>
          <td>${j.data_nasc ?? ""}</td>
          <td>${calcularIdade(j.data_nasc) || ""}</td>
          <td>${j.celular ?? ""}</td>
          <td>${up(j.posicao)}</td>
          <td>${j.hab ?? ""}</td>
          <td>${j.vel ?? ""}</td>
          <td>${j.mov ?? ""}</td>
          <td>${j.pontos ?? ""}</td>
        </tr>
      `).join("");

      const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>TESOURA - JOGADORES (${hoje})</title>
<style>
  body{font-family:Arial,sans-serif;background:#0b1220;color:#e8eefc;margin:0;padding:16px}
  h1{margin:0 0 10px 0;color:#ff8a00;font-size:18px}
  .muted{color:#93a4c7;font-size:12px;margin-bottom:12px}
  table{width:100%;border-collapse:collapse;background:#0f1a2e}
  th,td{border:1px solid #1f2b46;padding:6px 8px;font-size:12px;text-align:left}
  th{background:#0c1426;color:#ff8a00;position:sticky;top:0}
</style>
</head>
<body>
  <h1>TESOURA - JOGADORES</h1>
  <div class="muted">Arquivo gerado em: ${hoje} • Ordem por apelido</div>
  <table>
    <thead>
      <tr>
        <th>ID</th><th>CAMISA</th><th>APELIDO</th><th>NOME</th><th>DATA NASC.</th><th>IDADE</th>
        <th>CELULAR</th><th>POS</th><th>HAB</th><th>VEL</th><th>MOV</th><th>PONTOS</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `tesoura_jogadores_${hoje}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    }

    // eventos
    habInput.addEventListener("input", calcPontosAuto);
    velInput.addEventListener("input", calcPontosAuto);
    movInput.addEventListener("input", calcPontosAuto);

    btnSalvar.addEventListener("click", salvarJogador);
    btnCancelar.addEventListener("click", limparFormulario);
    btnRecarregar.addEventListener("click", carregarJogadores);
    btnBaixar.addEventListener("click", baixarArquivoHTML);

    // start
    await carregarJogadores();
  },
};
