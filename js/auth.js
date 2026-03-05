const AUTH_VERSION = "v1"; // パス変更時に変更する
const PASSWORD_HASH = "7d602bede2310b19d50bc59320ed396906fbcbc1229c4a8bfa1a09751f9419b5";
const EXPIRATION_DAYS = 30;

function showLockScreen() {
  document.body.innerHTML = `
    <div style="
      height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      background: radial-gradient(circle at 20% 0%, #2a0035 0%, #0a0a0a 50%);
      color:#fff;
      flex-direction:column;
      font-family:'Orbitron','Noto Sans JP',sans-serif;
    ">
      <h2 style="
        margin-bottom:20px;
        color:#ff003c;
        text-shadow:0 0 10px #ff003c88;
      ">
        SLEES
      </h2>

      <div style="position:relative; display:flex; align-items:center;">
        <input 
          type="password"
          id="pw"
          placeholder="Enter Password"
          style="
            padding:10px 14px;
            background:#111;
            border:1px solid #a100ff55;
            border-radius:8px;
            color:#fff;
            outline:none;
            text-align:center;
          "
        >

        <button id="togglePw"
          style="
            margin-left:8px;
            padding:6px 10px;
            background:#222;
            border:1px solid #a100ff55;
            color:#ccc;
            border-radius:6px;
            cursor:pointer;
          "
        >
          👁
        </button>
      </div>

      <button id="submit"
        style="
          margin-top:15px;
          padding:8px 18px;
          background:#a100ff;
          border:none;
          border-radius:8px;
          color:#000;
          cursor:pointer;
        "
      >
        Unlock
      </button>

      <p id="error" style="color:#ff003c;margin-top:15px;"></p>
    </div>
  `;

  const input = document.getElementById("pw");
  const button = document.getElementById("submit");
  const toggle = document.getElementById("togglePw");

  async function attemptUnlock() {
    const hash = await sha256(input.value);

    if (hash === PASSWORD_HASH) {
      localStorage.setItem("slees_auth", JSON.stringify({
        version: AUTH_VERSION,
        timestamp: Date.now()
      }));
      location.reload();
    } else {
      document.getElementById("error").textContent = "Incorrect password";
      input.value = "";
    }
  }

  button.onclick = attemptUnlock;

  input.addEventListener("keydown", function(e){
    if (e.key === "Enter") {
      attemptUnlock();
    }
  });

  toggle.onclick = () => {
    if (input.type === "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  };

  input.focus();
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
