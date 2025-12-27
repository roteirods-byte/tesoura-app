(() => {
  const BUILD = "2025-12-27_noiframe_v1";

  function guessAppRoot(){
    // funciona no GitHub Pages (/tesoura-app/) e também em testes locais
    const p = location.pathname;
    const idx = p.indexOf("/tesoura-app/");
    if(idx >= 0) return p.slice(0, idx) + "/tesoura-app/";
    // fallback: pasta atual
    return p.replace(/\/[^\/]*$/, "/");
  }

  const APP_ROOT = guessAppRoot();

  const PAGES = {
    jogadores: "legacy/tesoura_jogadores_teste.html",
    presenca:  "legacy/tesoura_presenca_escala_R5_v8.html",
    controle:  "legacy/tesoura_controle_geral_teste.html",
    mensal:    "legacy/tesoura_mensalidade_R4.html",
    caixa:     "legacy/tesoura_caixa_teste.html",
    gols:      "legacy/tesoura_gols_teste.html",
    banco:     "legacy/tesoura_banco_dados_teste.html",
  };

  function getSession(){
    try{
      return JSON.parse(localStorage.getItem("TESOURA_SESSION_V3") || "{}");
    }catch(e){
      return {};
    }
  }

  function getModoLabel(){
    const s = getSession();
    const modo = (s.modo || s.mode || "").toString().trim();
    if(!modo) return "Jogadores (visual)";
    return modo;
  }

  function detectActive(){
    const p = location.pathname.toLowerCase();
    if(p.includes("jogadores")) return "jogadores";
    if(p.includes("presenca") || p.includes("escala")) return "presenca";
    if(p.includes("controle")) return "controle";
    if(p.includes("mensal")) return "mensal";
    if(p.includes("caixa")) return "caixa";
    if(p.includes("gols")) return "gols";
    if(p.includes("banco")) return "banco";
    return "jogadores";
  }

  function urlFor(key){
    const file = PAGES[key];
    const u = new URL(APP_ROOT + file, location.origin);
    u.searchParams.set("build", BUILD);
    u.searchParams.set("t", Date.now().toString()); // evita cache chato
    return u.toString();
  }

  function logout(){
    try{
      // limpa tudo que começar com TESOURA
      const keys = [];
      for(let i=0;i<localStorage.length;i++){
        const k = localStorage.key(i);
        if(k && k.startsWith("TESOURA")) keys.push(k);
      }
      keys.forEach(k => localStorage.removeItem(k));
    }catch(e){}

    // se existir supabase client na página, tenta sair sem quebrar
    try{
      if(window.supabaseClient && window.supabaseClient.auth && window.supabaseClient.auth.signOut){
        window.supabaseClient.auth.signOut().catch(()=>{});
      }
    }catch(e){}

    const back = new URL(APP_ROOT + "index.html", location.origin);
    back.searchParams.set("logout", Date.now().toString());
    location.href = back.toString();
  }

  function mountShell(){
    // evita duplicar
    if(document.getElementById("TESOURA_SHELL")) return;

    const anchor = document.getElementById("TESOURA_SHELL_ANCHOR");
    if(!anchor) return; // só ativa em páginas que você colocou o anchor

    const active = detectActive();

    const shell = document.createElement("div");
    shell.id = "TESOURA_SHELL";
    shell.innerHTML = `
      <div class="tesouraTopbar">
        <div class="tesouraBrand">TESOURA — CONTROLE DO FUTEBOL</div>
        <div class="tesouraRight">
          <span class="tesouraPill">Modo: <b>${getModoLabel()}</b></span>
          <span class="tesouraPill">BUILD: <b>${BUILD}</b></span>
          <button class="tesouraBtnDanger" id="TESOURA_SHELL_LOGOUT">SAIR</button>
        </div>
      </div>
      <div class="tesouraTabs">
        <a class="tesouraTab ${active==="jogadores"?"tesouraTabActive":""}" href="${urlFor("jogadores")}">JOGADORES</a>
        <a class="tesouraTab ${active==="presenca"?"tesouraTabActive":""}" href="${urlFor("presenca")}">PRESENÇA / ESCALAÇÃO</a>
        <a class="tesouraTab ${active==="controle"?"tesouraTabActive":""}" href="${urlFor("controle")}">CONTROLE GERAL</a>
        <a class="tesouraTab ${active==="mensal"?"tesouraTabActive":""}" href="${urlFor("mensal")}">MENSALIDADE</a>
        <a class="tesouraTab ${active==="caixa"?"tesouraTabActive":""}" href="${urlFor("caixa")}">CAIXA</a>
        <a class="tesouraTab ${active==="gols"?"tesouraTabActive":""}" href="${urlFor("gols")}">GOLS</a>
        <a class="tesouraTab ${active==="banco"?"tesouraTabActive":""}" href="${urlFor("banco")}">BANCO DE DADOS</a>
      </div>
    `;

    // coloca shell no topo do body
    document.body.insertBefore(shell, document.body.firstChild);

    // dá um “respiro” para não colar no conteúdo
    document.body.classList.add("tesouraPagePad");

    const btn = document.getElementById("TESOURA_SHELL_LOGOUT");
    if(btn) btn.addEventListener("click", logout);
  }

  // roda cedo e também no load, para garantir
  document.addEventListener("DOMContentLoaded", mountShell);
  window.addEventListener("load", mountShell);
})();
