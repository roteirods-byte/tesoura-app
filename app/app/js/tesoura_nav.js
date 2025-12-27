/* TESOURA NAV (no-iframe)
   - Injeta o cabeçalho com abas em todas as páginas de painel.
   - Protege as páginas: se não estiver logado, redireciona para index.html.
   - Login/Logout via localStorage (compartilhado entre páginas e abas).
*/
(function(){
  "use strict";

  const AUTH_KEY = "TESOURA_AUTH"; // {ok:1, mode:"Diretoria"|"Jogadores (visual)", ts:number}
  const LS_BUILD = "TESOURA_BUILD";

  function qp(name){
    try{ return new URLSearchParams(location.search).get(name); }catch(e){ return null; }
  }

  function getBase(){
    const p = location.pathname;
    const marker = "/tesoura-app/";
    const i = p.indexOf(marker);
    if(i >= 0) return p.slice(0, i + marker.length);
    const parts = p.split("/"); parts.pop();
    return parts.join("/") + "/";
  }

  function getBuild(){
    const b = qp("build") || localStorage.getItem(LS_BUILD) || "";
    if(b) localStorage.setItem(LS_BUILD, b);
    return b;
  }

  function getAuth(){
    try{
      const raw = localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    }catch(e){ return null; }
  }

  function isLogged(){
    const a = getAuth();
    return !!(a && a.ok === 1 && a.mode);
  }

  function modeLabel(){
    const a = getAuth();
    return (a && a.mode) ? a.mode : "—";
  }

  function buildQS(){
    const b = getBuild();
    return b ? ("?build=" + encodeURIComponent(b)) : "";
  }

  function toIndexWithGoto(){
    const BASE = getBase();
    const bq = buildQS();
    const goto = encodeURIComponent(location.pathname + location.search);
    const glue = bq ? "&" : "?";
    location.replace(BASE + "index.html" + (bq || "") + glue + "goto=" + goto);
  }

  function doLogout(){
    const BASE = getBase();
    try{ localStorage.removeItem(AUTH_KEY); }catch(e){}
    location.replace(BASE + "index.html" + buildQS());
  }

  // Guard: se não estiver logado, volta para login.
  if(!isLogged()){
    toIndexWithGoto();
    return;
  }

  // Evita duplicar cabeçalho
  if(document.getElementById("TESOURA_NAV_ROOT")) return;

  const BASE = getBase();
  const bq = buildQS();

  const LINKS = [
    { key:"jogadores", label:"JOGADORES", href: BASE + "legacy/tesoura_jogadores_teste.html" + bq },
    { key:"presenca", label:"PRESENÇA / ESCALAÇÃO", href: BASE + "legacy/tesoura_presenca_escala_R5_v8.html" + bq },
    { key:"controle", label:"CONTROLE GERAL", href: BASE + "legacy/tesoura_controle_geral_teste.html" + bq },
    { key:"mensalidade", label:"MENSALIDADE", href: BASE + "legacy/tesoura_mensalidade_R4.html" + bq },
    { key:"caixa", label:"CAIXA", href: BASE + "legacy/tesoura_caixa_teste.html" + bq },
    { key:"gols", label:"GOLS", href: BASE + "legacy/tesoura_gols_teste.html" + bq },
    { key:"banco", label:"BANCO DE DADOS", href: BASE + "legacy/tesoura_banco_dados_teste.html" + bq },
  ];

  function inferActive(){
    const p = location.pathname.toLowerCase();
    if(p.includes("presenca")) return "presenca";
    if(p.includes("controle")) return "controle";
    if(p.includes("mensalidade")) return "mensalidade";
    if(p.includes("caixa")) return "caixa";
    if(p.includes("gols")) return "gols";
    if(p.includes("banco")) return "banco";
    return "jogadores";
  }

  const active = inferActive();

  const nav = document.createElement("div");
  nav.id = "TESOURA_NAV_ROOT";
  nav.innerHTML = `
    <style>
      .tesoura-topbar{position:sticky;top:0;z-index:9999;background:linear-gradient(180deg, rgba(5,10,24,0.98), rgba(5,10,24,0.92));border-bottom:1px solid rgba(255,140,0,0.35);backdrop-filter: blur(6px);}
      .tesoura-topbar .wrap{max-width:1400px;margin:0 auto;padding:14px 16px;display:flex;align-items:center;gap:14px;}
      .tesoura-brand{font-weight:800;letter-spacing:0.5px;color:#ff8c00;font-size:16px;white-space:nowrap;}
      .tesoura-tabs{display:flex;flex-wrap:wrap;gap:10px;align-items:center;}
      .tesoura-tab{display:inline-flex;align-items:center;justify-content:center;padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);color:#e8eefc;text-decoration:none;font-weight:700;font-size:13px;}
      .tesoura-tab:hover{background:rgba(255,255,255,0.08)}
      .tesoura-tab.active{border-color:rgba(255,140,0,0.55);box-shadow:0 0 0 2px rgba(255,140,0,0.15) inset;}
      .tesoura-right{margin-left:auto;display:flex;align-items:center;gap:10px;}
      .tesoura-badge{padding:8px 12px;border-radius:999px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);color:#e8eefc;font-weight:700;font-size:12px;white-space:nowrap;}
      .tesoura-sair{padding:8px 12px;border-radius:12px;border:1px solid rgba(255,80,80,0.35);background:rgba(255,80,80,0.18);color:#ffdada;font-weight:900;cursor:pointer;}
      .tesoura-sair:hover{background:rgba(255,80,80,0.26)}
      @media (max-width:900px){
        .tesoura-brand{display:none}
        .tesoura-right{width:100%;justify-content:space-between;margin-left:0}
      }
    </style>
    <div class="tesoura-topbar">
      <div class="wrap">
        <div class="tesoura-brand">TESOURA — CONTROLE DO FUTEBOL</div>
        <div class="tesoura-tabs" id="TESOURA_TABS"></div>
        <div class="tesoura-right">
          <div class="tesoura-badge" id="TESOURA_MODE_BADGE">Modo: ${modeLabel()}</div>
          <div class="tesoura-badge" id="TESOURA_BUILD_BADGE">BUILD: ${getBuild() || "—"}</div>
          <button class="tesoura-sair" id="TESOURA_SAIR_BTN" type="button">SAIR</button>
        </div>
      </div>
    </div>
  `;

  // insere no topo do body
  document.body.insertBefore(nav, document.body.firstChild);

  const tabs = document.getElementById("TESOURA_TABS");
  LINKS.forEach((it)=>{
    const a = document.createElement("a");
    a.className = "tesoura-tab" + (it.key === active ? " active" : "");
    a.href = it.href;
    a.textContent = it.label;
    tabs.appendChild(a);
  });

  const btn = document.getElementById("TESOURA_SAIR_BTN");
  btn.addEventListener("click", doLogout);
})();
