import {
  blockColor,
  blockType,
  grid,
  announcer,
  game,
  win,
  debug,
  leaderboard
} from "../global";

export const bestScores = [
  parseInt(localStorage.getItem("bestScore1") || 500),
  parseInt(localStorage.getItem("bestScore2") || 400),
  parseInt(localStorage.getItem("bestScore3") || 300),
  parseInt(localStorage.getItem("bestScore4") || 200),
  parseInt(localStorage.getItem("bestScore5") || 100)
];

export function updateBestScores(score) {
  console.log(bestScores);
  let rank = 6;
  let confirmUpdate = true;
  if (score > bestScores[0]) rank = 1;
  else if (score > bestScores[1]) rank = 2;
  else if (score > bestScores[2]) rank = 3;
  else if (score > bestScores[3]) rank = 4;
  else if (score > bestScores[4]) rank = 5;

  if (leaderboard.reason === "debug") return false;

  if (rank < 6) {
    if (leaderboard.reason === "slow") {
      confirmUpdate = confirm(
        `Your score is #${rank} on your personal best score list, but your game is unranked due to slowdown.\nThis score may be inflated, do you still want to add this score?`
      );
    }
    if (confirmUpdate) {
      if (leaderboard.canPost && rank < 5) {
        bestScores.splice(rank, 0, score);
        bestScores.pop();
      }
    }
  }
  localStorage.setItem("bestScore1", bestScores[0]);
  localStorage.setItem("bestScore2", bestScores[1]);
  localStorage.setItem("bestScore3", bestScores[2]);
  localStorage.setItem("bestScore4", bestScores[3]);
  localStorage.setItem("bestScore5", bestScores[4]);
}
