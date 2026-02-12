function generateStars() {
  document.querySelectorAll(".danger-level").forEach(el => {
    const level = parseInt(el.dataset.level, 10) || 1;
    const max = 5;

    let stars = "";
    for (let i = 1; i <= max; i++) {
      stars += i <= level ? "★" : "☆";
    }

    el.textContent = stars;
    el.classList.add(`level-${level}`);
  });
}

async function loadDynamicGames() {
  try {
    const res = await fetch("/data/games.json");
    const games = await res.json();

    const container = document.getElementById("dynamic-games");
    if (!container) return;

    container.innerHTML = "";

    games
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .forEach(d => {

        const dangerLevel = parseInt(d.danger, 10) || 1;

        const card = document.createElement("div");
        card.className = "game-card";

        card.innerHTML = `
          <h3>${d.title}</h3>
          <p style="color:#eaeaea; margin-top:-5px;">
            提案者：${d.author || "匿名"}
          </p>
          <div class="game-meta">
            <p><span>推奨人数：</span>${d.players}</p>
            <p><span>所要時間：</span>${d.time}</p>
            <p><span>必要なもの：</span>${d.items}</p>
            <p class="danger">
              <span>危険度：</span>
              <span class="danger-level" data-level="${dangerLevel}"></span>
            </p>
          </div>
          <div class="game-rule">
            <h4>ルール</h4>
            <p>${(d.rule || "").replace(/\n/g, "<br>")}</p>
          </div>
        `;

        container.appendChild(card);
      });

    generateStars();

  } catch (err) {
    console.error(err);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  generateStars();    // 固定カード用
  loadDynamicGames(); // 投稿カード用
});


