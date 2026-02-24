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

async function loadUpdates() {
  try {
    const res = await fetch("./data/updates.json");
    const updates = await res.json();

    const container = document.getElementById("update-box");
    if (!container) return;

    container.innerHTML = "";

    updates.forEach(u => {
      const p = document.createElement("p");
      p.textContent = `${u.date}  ${u.text}`;
      container.appendChild(p);
    });

  } catch (err) {
    console.error(err);
  }
}

async function loadDynamicGames() {
  try {
    const res = await fetch("./data/games.json");
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

async function loadCocktails() {
  try {
    const res = await fetch("./data/cocktails.json");
    const cocktails = await res.json();

    const container = document.getElementById("dynamic-cocktails");
    if (!container) return;

    container.innerHTML = "";

    cocktails
      .sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      )
      .forEach(c => {

        const card = document.createElement("div");
        card.className = "cocktail-card";

        const ingredientsList = c.ingredients
          .map(i => `<li>${i.name}：${i.amount}</li>`)
          .join("");

        const tasteTags = (c.taste || [])
          .map(t => `<span class="taste-tag">${t}</span>`)
          .join("");

        card.innerHTML = `
          <h3>${c.name}</h3>

          <div class="cocktail-meta">
            <p><span>ベース：</span>${c.base}</p>
            <p><span>グラス：</span>${c.glass}</p>
          </div>

          <div class="cocktail-ingredients">
            <h4>材料</h4>
            <ul>${ingredientsList}</ul>
          </div>

          <div class="cocktail-method">
            <h4>作り方</h4>
            <p>${(c.method || "").replace(/\n/g, "<br>")}</p>
          </div>

          <div class="cocktail-description">
            <p>${c.description || ""}</p>
          </div>

          <div class="cocktail-taste">
            ${tasteTags}
          </div>
        `;

        container.appendChild(card);
      });

  } catch (err) {
    console.error(err);
  }
}



document.addEventListener("DOMContentLoaded", () => {
  generateStars();
  loadDynamicGames();
  loadCocktails();
  loadUpdates();
});







