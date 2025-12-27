/* TESOURA - Auth local (PIN no navegador)
   - Funciona no GitHub Pages (base /<repo>/)
   - Evita erro de BASE undefined
*/
(function(){
  const KEY = 'TESOURA_SESSION_V2';

  function getBaseRoot(){
    // GitHub Pages: /<repo>/...
    // Local/servidor... fallback: /
    try{
      const parts = (location.pathname||'/').split('/').filter(Boolean);
      if(parts.length >= 1) return '/' + parts[0] + '/';
      return '/';
    }catch(e){ return '/'; }
  }

  const BASE = getBaseRoot();
  window.TESOURA_BASE = BASE;

  function nowISO(){ try{ return new Date().toISOString(); }catch(e){ return '' } }
  function setSession(role){
    const obj = { ok:true, role: role||'jogadores', ts: nowISO() };
    try{ localStorage.setItem(KEY, JSON.stringify(obj)); }catch(e){}
    return obj;
  }
  function getSession(){ try{ return JSON.parse(localStorage.getItem(KEY)||'null'); }catch(e){ return null; } }
  function clearSession(){ try{ localStorage.removeItem(KEY); }catch(e){} }
  function hasSession(){ const s=getSession(); return !!(s && s.ok); }
  function role(){ const s=getSession(); return (s && s.role) ? s.role : null; }

  function goLogin(nextUrl){
    const next = encodeURIComponent(nextUrl || (location.href||''));
    location.href = BASE + 'index.html?next=' + next;
  }

  function guardOrRedirect(){
    if(!hasSession()) goLogin(location.href);
  }

  function logout(){
    clearSession();
    // evita cache do SW (se existir)
    try{
      if('serviceWorker' in navigator){
        navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister())).catch(()=>{});
      }
    }catch(e){}
    location.href = BASE + 'index.html?logout=1';
  }

  window.TESOURA_AUTH = { BASE, setSession, getSession, clearSession, hasSession, role, goLogin, guardOrRedirect, logout };
})();
