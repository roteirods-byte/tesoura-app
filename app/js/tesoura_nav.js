/* TESOURA NAV (no-iframe) - v1 */
(function () {
  "use strict";

  const SESSION_KEY = "TESOURA_SESSION_V1";
  const LS_MODO = "TESOURA_MODO";
  const LS_PERFIL = "TESOURA_PERFIL";
  const LS_BUILD = "TESOURA_BUILD";

  const TABS = [
    { id: "jogadores", label: "JOGADORES", file: "tesoura_jogadores_teste.html" },
    { id: "presenca", label: "PRESENÇA / ESCALAÇÃO", file: "tesoura_presenca_escala_R5_v8.html" },
    { id: "controle", label: "CONTROLE GERAL", file: "tesoura_controle_geral_teste.html" },
    { id: "mensalidade", label: "MENSALIDADE", file: "tesoura_mensalidade_R4.html" },
    { id: "caixa", label: "CAIXA", file: "tesoura_caixa_teste.html" },
    { id: "gols", label: "GOLS", file: "tesoura_gols_teste.html" },
    { id: "banco", label: "BANCO DE DADOS", file: "tesoura_banco_dados_teste.html" },
  ];

  function qp(name) {
    try {
      return new URL(location.href).searchParams.get(name) || "";
    } catch (_) {
      return "";
    }
  }

  function getBuild() {
    const b = qp("build") || qp("logout") || localStorage.getItem(LS_BUILD) || "";
    if (b) localStorage.setItem(LS_BUILD, b);
    return b;
  }

  function isLogged() {
    // sessão em sessionStorage (mesma aba). Modo/perfil ficam em localStorage.
    return !!sessionStorage.getItem(SESSION_KEY);
  }

  function gotoIndexLogout() {
    const b = getBuild();
    const url = new URL("../index.html", location.href);
    if (b) url.searchParams.set("logout", b);
    location.href = url.toString();
  }

  function doLogout() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (_) {}
    try { localStorage.removeItem(LS_MODO); } catch (_) {}
    try { localStorage.removeItem(LS_PERFIL); } catch (_) {}
    // (build guardado pode ficar)
    gotoIndexLogout();
  }

  function currentFile() {
    const p = location.pathname.split("/").pop() || "";
    return p.toLowerCase();
  }

  function ensureCss() {
    if (document.getElementById("TESOURA_NAV_STYLE")) return;
    const s = document.createElement("style");
    s.id = "TESOURA_NAV_STYLE";
    s.textContent = `
      .tesoura-topbar{position:sticky;top:0;z-index:9999;background:#0b1220;border-bottom:1px solid rgba(255,255,255,.08)}
      .tesoura-topbar .row{max-width:1400px;margin:0 auto;display:flex;align-items:center;gap:14px;padding:10px 14px}
      .tesoura-brand{color:#ff8a1f;font-weight:900;letter-spacing:.5px}
      .tesoura-tabs{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-left:auto;margin-right:auto;justify-content:center}
      .tesoura-tab{color:#e7eefc;text-decoration:none;font-weight:800;font-size:13px;padding:8px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.10);background:rgba(0,0,0,.15)}
      .tesoura-tab.active{outline:2px solid rgba(255,138,31,.35);border-color:rgba(255,138,31,.7)}
      .tesoura-right{display:flex;align-items:center;gap:10px;margin-left:auto}
      .tesoura-pill{color:#e7eefc;font-weight:800;font-size:12px;padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.10);background:rgba(0,0,0,.20)}
      .tesoura-sair{background:#ff3b30;color:#fff;border:none;border-radius:10px;padding:8px 12px;font-weight:900;cursor:pointer}
      .tesoura-sair:active{transform:translateY(1px)}
      @media (max-width: 900px){ .tesoura-tabs{margin-left:0;margin-right:0} }
    `;
    document.head.appendChild(s);
  }

  function renderNav() {
    ensureCss();

    const host = document.getElementById("tesouraNav");
    if (!host) return;

    const b = getBuild();
    const modo = localStorage.getItem(LS_MODO) || "";
    const perfil = localStorage.getItem(LS_PERFIL) || "";
    const modoTxt = modo ? `Modo: ${modo}` : (perfil ? `Modo: ${perfil}` : "Modo: -");
    const buildTxt = b ? `BUILD: ${b}` : "BUILD: -";

    const fileNow = currentFile();

    const tabsHtml = TABS.map(t => {
      const url = new URL(t.file, location.href);
      if (b) url.searchParams.set("build", b);
      const active = (t.file.toLowerCase() === fileNow) ? "active" : "";
      return `<a class="tesoura-tab ${active}" href="${url.toString()}">${t.label}</a>`;
    }).join("");

    host.innerHTML = `
      <div class="tesoura-topbar">
        <div class="row">
          <div class="tesoura-brand">TESOURA — CONTROLE DO FUTEBOL</div>
          <nav class="tesoura-tabs">${tabsHtml}</nav>
          <div class="tesoura-right">
            <div class="tesoura-pill">${modoTxt}</div>
            <div class="tesoura-pill">${buildTxt}</div>
            <button class="tesoura-sair" id="tesouraSairBtn" type="button">SAIR</button>
          </div>
        </div>
      </div>
    `;

    const btn = document.getElementById("tesouraSairBtn");
    if (btn) btn.addEventListener("click", doLogout);
  }

  function boot() {
    // Se abriu um painel direto, exige login.
    if (!isLogged()) {
      gotoIndexLogout();
      return;
    }
    renderNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
