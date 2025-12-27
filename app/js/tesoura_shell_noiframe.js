// app/js/tesoura_shell_noiframe.js
(function () {
  const mount = document.getElementById("tesoura-shell-mount");
  if (!mount) return;

  // Garante ui.css (abas/topo padrão)
  const isLegacy = location.pathname.includes("/legacy/");
  const uiHref = isLegacy ? "../app/css/ui.css" : "app/css/ui.css";
  const hasUi = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .some(l => (l.getAttribute("href") || "").includes("app/css/ui.css"));
  if (!hasUi) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = uiHref;
    document.head.appendChild(link);
  }

  // BUILD
  const sp = new URLSearchParams(location.search);
  const BUILD = sp.get("logout") || sp.get("build") || localStorage.getItem("TESOURA_BUILD") || "noiframe_v1";

  // MODO
  const modo =
    localStorage.getItem("TESOURA_MODO_LABEL") ||
    localStorage.getItem("TESOURA_MODO") ||
    localStorage.getItem("TESOURA_ROLE") ||
    "Jogadores (visual)";

  // Mapeamento de páginas (legacy)
  const PAGES = [
    { key: "jogadores",  label: "JOGADORES",           file: "tesoura_jogadores_teste.html" },
    { key: "presenca",   label: "PRESENÇA / ESCALAÇÃO",file: "tesoura_presenca_escala_R5_v8.html" },
    { key: "controle",   label: "CONTROLE GERAL",      file: "tesoura_controle_geral_teste.html" },
    { key: "mensalidade",label: "MENSALIDADE",         file: "tesoura_mensalidade_R4.html" },
    { key: "caixa",      label: "CAIXA",               file: "tesoura_caixa_teste.html" },
    { key: "gols",       label: "GOLS",                file: "tesoura_gols_teste.html" },
    { key: "banco",      label: "BANCO DE DADOS",      file: "tesoura_banco_dados_teste.html" },
  ];

  // Página atual
  const bodyPage = (document.body.getAttribute("data-page") || "").toLowerCase();
  const fileNow = (location.pathname.split("/").pop() || "").toLowerCase();
  let currentKey = bodyPage;
  if (!currentKey) {
    if (fileNow.includes("jogadores")) currentKey = "jogadores";
    else if (fileNow.includes("presenca")) currentKey = "presenca";
    else if (fileNow.includes("controle")) currentKey = "controle";
    else if (fileNow.includes("mensalidade")) currentKey = "mensalidade";
    else if (fileNow.includes("caixa")) currentKey = "caixa";
    else if (fileNow.includes("gols")) currentKey = "gols";
    else if (fileNow.includes("banco")) currentKey = "banco";
  }

  // Helper: monta URL mantendo querystring
  function linkTo(file) {
    const url = new URL(location.href);
    if (isLegacy) {
      url.pathname = url.pathname.replace(/\/legacy\/[^/]*$/, "/legacy/" + file);
    } else {
      url.pathname = url.pathname.replace(/\/[^/]*$/, "/" + file);
    }
    // mantém logout/build existentes (não mexe)
    return url.toString();
  }

  // UI do topo + abas
  const top = document.createElement("div");
  top.innerHTML = `
    <div class="topbar">
      <div class="app-title">TESOURA — CONTROLE DO FUTEBOL</div>
      <div class="topbar-right">
        <span class="pill">Modo: ${escapeHtml(modo)}</span>
        <span class="pill">BUILD: ${escapeHtml(BUILD)}</span>
        <button class="btn-sair" id="btnSairShell" type="button">SAIR</button>
      </div>
    </div>

    <div class="tabs">
      ${PAGES.map(p => `
        <a class="tab ${p.key === currentKey ? "active" : ""}" href="${linkTo(p.file)}">
          ${escapeHtml(p.label)}
        </a>
      `).join("")}
    </div>
  `;

  mount.appendChild(top);

  // SAIR (não trava nada)
  const btn = document.getElementById("btnSairShell");
  if (btn) {
    btn.addEventListener("click", () => {
      try {
        // limpa só chaves do app (seguro)
        const keys = Object.keys(localStorage);
        keys.forEach(k => {
          if (k.startsWith("TESOURA_")) localStorage.removeItem(k);
        });
      } catch (e) {}

      // volta para a home do GitHub Pages do app
      const base = location.pathname.includes("/tesoura-app/")
        ? location.pathname.split("/tesoura-app/")[0] + "/tesoura-app/"
        : "/";

      location.href = base + "?logout=" + encodeURIComponent(BUILD);
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
