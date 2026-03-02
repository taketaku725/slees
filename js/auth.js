const AUTH_VERSION = "v1"; // パス変更時に変更する
const PASSWORD_HASH = "ここにさっき生成したハッシュ";
const EXPIRATION_DAYS = 30;

function showLockScreen() {
  document.body.innerHTML = `
    <div style="
      height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#000;
      color:#fff;
      flex-direction:column;
      font-family:sans-serif;
    ">
      <h2>Enter Password</h2>
      <input type="password" id="pw" style="padding:8px;margin:10px;">
      <button id="submit">Unlock</button>
      <p id="error" style="color:red;"></p>
    </div>
  `;

  document.getElementById("submit").onclick = async () => {
    const input = document.getElementById("pw").value;
    const hash = await sha256(input);

    if (hash === PASSWORD_HASH) {
      localStorage.setItem("slees_auth", JSON.stringify({
        version: AUTH_VERSION,
        timestamp: Date.now()
      }));
      location.reload();
    } else {
      document.getElementById("error").textContent = "Incorrect password";
    }
  };
}

async function sha256(str){
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str)
  );
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2,"0"))
    .join("");
}

function checkAuth() {
  const saved = localStorage.getItem("slees_auth");
  if (!saved) return false;

  try {
    const data = JSON.parse(saved);
    if (data.version !== AUTH_VERSION) return false;

    const age = Date.now() - data.timestamp;
    if (age > EXPIRATION_DAYS * 24 * 60 * 60 * 1000) return false;

    return true;
  } catch {
    return false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuth()) {
    showLockScreen();
  }
});
