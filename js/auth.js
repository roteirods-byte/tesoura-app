/* TESOURA - auth simples (PIN local). Seguro o suficiente para o seu uso (não é login de servidor). */
(function(){
  const KEY = 'TESOURA_SESSION_V1';

  function nowISO(){ try{ return new Date().toISOString(); }catch(e){ return '' } }

  function setSession(role){
    const obj = { ok:true, role: role||'jogador', ts: nowISO() };
    try{ localStorage.setItem(KEY, JSON.stringify(obj)); }catch(e){}
    return obj;
  }

  function getSession(){
    try{ return JSON.parse(localStorage.getItem(KEY)||'null'); }catch(e){ return null; }
  }

  function clearSession(){
    try{ localStorage.removeItem(KEY); }catch(e){}
  }

  function hasSession(){
    const s = getSession();
    return !!(s && s.ok);
  }

  function role(){
    const s = getSession();
    return (s && s.role) ? s.role : null;
  }

  function goLogin(nextUrl){
    const base = (location.pathname.split('/').slice(0,-1).join('/') || '/')
      .replace(/\/[^\/]*$/,'/');
    const next = encodeURIComponent(nextUrl || location.href);
    location.href = base + 'index.html?next=' + next;
  }

  function guardOrRedirect(){
    if(!hasSession()) goLogin(location.href);
  }

  function logout(){
    clearSession();
    try{
      if('serviceWorker' in navigator){
        navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister())).catch(()=>{});
      }
    }catch(e){}
    goLogin(location.origin + location.pathname.replace(/\/[^\/]*$/,'/') + 'index.html');
  }

  window.TESOURA_AUTH = { setSession, getSession, clearSession, hasSession, role, goLogin, guardOrRedirect, logout };
})();
