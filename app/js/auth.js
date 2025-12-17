// app/js/auth.js
function requirePinGate() {
  const cfg = window.TESOURA_CONFIG;
  const saved = localStorage.getItem("TESOURA_PIN_OK");
  if (saved === "1") return;

  const overlay = document.createElement("div");
  overlay.className = "pin-overlay";
  overlay.innerHTML = `
    <div class="pin-box">
      <h2>Acesso</h2>
      <p>Digite o PIN para usar o aplicativo.</p>
      <div class="field">
        <label>PIN</label>
        <input id="pinInput" inputmode="numeric" placeholder="Ex: 123456" />
      </div>
      <div class="pin-actions" style="margin-top:12px">
        <button class="btn secondary" id="pinCancel">Fechar</button>
        <button class="btn accent" id="pinOk">Entrar</button>
      </div>
      <p class="muted" id="pinMsg" style="margin-top:10px"></p>
    </div>
  `;
  document.body.appendChild(overlay);

  const pinInput = overlay.querySelector("#pinInput");
  const msg = overlay.querySelector("#pinMsg");

  overlay.querySelector("#pinCancel").onclick = () => {
    msg.textContent = "PIN não informado.";
  };

  overlay.querySelector("#pinOk").onclick = () => {
    const pin = (pinInput.value || "").trim();
    if (pin === cfg.APP_PIN) {
      localStorage.setItem("TESOURA_PIN_OK", "1");
      overlay.remove();
      return;
    }
    msg.textContent = "PIN incorreto.";
    pinInput.focus();
    pinInput.select();
  };

  setTimeout(() => pinInput.focus(), 50);
}
window.requirePinGate = requirePinGate;