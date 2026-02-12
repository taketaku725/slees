document.addEventListener("DOMContentLoaded", () => {
  const dangers = document.querySelectorAll(".danger-level");

  dangers.forEach(el => {
    const level = parseInt(el.dataset.level, 10);
    const max = 5;

    let stars = "";
    for (let i = 1; i <= max; i++) {
      stars += i <= level ? "★" : "☆";
    }

    el.textContent = stars;

    // レベルに応じたクラス付与
    el.classList.add(`level-${level}`);
  });
});
