import {
  blockColor,
  blockType,
  grid,
  announcer,
  game,
  win,
  debug,
  leaderboard,
  cpu
} from "../global";

export let bestScores = [
  parseInt(localStorage.getItem("bestScore1")),
  parseInt(localStorage.getItem("bestScore2")),
  parseInt(localStorage.getItem("bestScore3")),
  parseInt(localStorage.getItem("bestScore4")),
  parseInt(localStorage.getItem("bestScore5"))
];
console.log(bestScores);

export function getBestScores(clearScores) {
  if (clearScores) localStorage.clear();
  for (let i = 1; i <= 5; i++) {
    if (localStorage.getItem(`bestScore${i}`) == null) {
      console.log(`creating item for bestScore${i}`);
      localStorage.setItem(`bestScore${i}`, `${1200 - i * 200}`);
    }
  }
}
getBestScores(false);

export function updateBestScores(score) {
  console.log(score);
  let rank = 6;
  let confirmUpdate = true;
  if (score > bestScores[0]) rank = 1;
  else if (score > bestScores[1]) rank = 2;
  else if (score > bestScores[2]) rank = 3;
  else if (score > bestScores[3]) rank = 4;
  else if (score > bestScores[4]) rank = 5;

  if (leaderboard.reason === "debug" || cpu.enabled) return 6;

  if (rank < 6) {
    if (leaderboard.reason === "slow") {
      confirmUpdate = confirm(
        `Your score is #${rank} on your personal best score list, but your game is invalid for the leaderboards due to slowdown.\nDo you still want to add this score locally?`
      );
      if (confirmUpdate) confirmUpdate = confirm("Are you sure?");
    }
    if (confirmUpdate) {
      if (leaderboard.canPost && rank < 6) {
        console.log("updating high scores...");
        bestScores.splice(rank - 1, 0, score);
        bestScores.pop();
        console.log(bestScores);
        localStorage.setItem("bestScore1", bestScores[0]);
        localStorage.setItem("bestScore2", bestScores[1]);
        localStorage.setItem("bestScore3", bestScores[2]);
        localStorage.setItem("bestScore4", bestScores[3]);
        localStorage.setItem("bestScore5", bestScores[4]);
        bestScores = [
          parseInt(localStorage.getItem("bestScore1")),
          parseInt(localStorage.getItem("bestScore2")),
          parseInt(localStorage.getItem("bestScore3")),
          parseInt(localStorage.getItem("bestScore4")),
          parseInt(localStorage.getItem("bestScore5"))
        ];
      }
    }
  }
  return rank;
}
