// app_v2/js/auth.js
(function () {
  function normalizePin(s){ return String(s||"").trim(); }

  function loadState(){
    try{ return JSON.parse(localStorage.getItem("TESOURA_AUTH")||"{}"); }catch(e){ return {}; }
  }
  function saveState(st){
    localStorage.setItem("TESOURA_AUTH", JSON.stringify(st||{}));
  }

  function getAllowedPins(mode){
    const cf = window.TESOURA_CONFIG || {};
    const pins = (cf.PINS && cf.PINS[mode]) ? cf.PINS[mode] : [];
    return Array.isArray(pins) ? pins : [];
  }

  function promptLogin(){
    const pin = normalizePin(prompt("Digite a senha:"));
    if(!pin) return null;

    // diretoria primeiro
    if(getAllowedPins("diretoria").includes(pin)) return { mode:"diretoria", pin };
    if(getAllowedPins("jogadores").includes(pin)) return { mode:"jogadores", pin };

    alert("Senha inválida.");
    return null;
  }

  function ensureLogin(){
    let st = loadState();
    if(st && st.mode && st.pin){
      // valida
      if(getAllowedPins(st.mode).includes(st.pin)) return st;
    }
    const ok = promptLogin();
    if(ok){ saveState(ok); return ok; }
    // se cancelou, trava na tela
    document.body.innerHTML = "";
    throw new Error("not authenticated");
  }

  function logout(){
    localStorage.removeItem("TESOURA_AUTH");
    location.href = location.pathname + location.search;
  }

  const st = ensureLogin();

  window.TESOURA_AUTH = {
    getMode: ()=> st.mode,
    getPin: ()=> st.pin,
    logout
  };
})();
