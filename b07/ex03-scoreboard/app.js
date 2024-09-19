function updateScore(team, points) {
    const scoreElement = document.querySelector(`.box-score.${team}`);
    let currentScore = parseInt(scoreElement.textContent);
    scoreElement.textContent = (currentScore + points)
      .toString()
      .padStart(2, "0");
  }
  
  document.querySelectorAll(".btn").forEach( button => {
    button.addEventListener("click", () => {
      const points = parseInt(button.textContent);
      const team = button.classList.contains("home") ? "home" : "away";
      updateScore(team, points);
    });
  });
  