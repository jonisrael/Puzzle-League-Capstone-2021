import {
  blockColor,
  blockType,
  grid,
  announcer,
  game,
  win,
  debug,
  leaderboard,
  cpu,
  bestScores,
} from "../global";

// export let bestScores = [
//   parseInt(localStorage.getItem("bestScore1")),
//   parseInt(localStorage.getItem("bestScore2")),
//   parseInt(localStorage.getItem("bestScore3")),
//   parseInt(localStorage.getItem("bestScore4")),
//   parseInt(localStorage.getItem("bestScore5")),

//   parseInt(localStorage.getItem("bestScore1_Standard")),
//   parseInt(localStorage.getItem("bestScore2_Standard")),
//   parseInt(localStorage.getItem("bestScore3_Standard")),
//   parseInt(localStorage.getItem("bestScore4_Standard")),
//   parseInt(localStorage.getItem("bestScore5_Standard")),

//   parseInt(localStorage.getItem("bestScore1_Marathon")),
//   parseInt(localStorage.getItem("bestScore2_Marathon")),
//   parseInt(localStorage.getItem("bestScore3_Marathon")),
//   parseInt(localStorage.getItem("bestScore4_Marathon")),
//   parseInt(localStorage.getItem("bestScore5_Marathon")),
// ];

export function getBestScores(clearScores) {
  if (clearScores) localStorage.clear();
  for (let i = 1; i <= 5; i++) {
    let types = ["", "_Standard", "_Marathon"];
    let timeMultipliers = [2, 5, 10];
    let baseScores = [2500, 1500, 1000, 500, 250];
    for (let j = 0; j < 3; j++) {
      let type = types[j];
      let timeMultiplier = timeMultipliers[j];
      let baseScore = baseScores[i - 1] * timeMultiplier;
      if (localStorage.getItem(`bestScore${i}${type}`) == null) {
        localStorage.setItem(`bestScore${i}${type}`, `${baseScore}`);
      }
    }
  }
}
getBestScores(false);

export function updateBestScores(score) {
  let highScores;
  if (game.timeControl === 2) highScores = bestScores.Blitz;
  if (game.timeControl === 5) highScores = bestScores.Standard;
  if (game.timeControl === 10) highScores = bestScores.Marathon;
  let rank = 6;
  let confirmUpdate = true;
  console.log("Scores:", score, highScores);
  if (score > highScores[0]) rank = 1;
  else if (score > highScores[1]) rank = 2;
  else if (score > highScores[2]) rank = 3;
  else if (score > highScores[3]) rank = 4;
  else if (score > highScores[4]) rank = 5;

  if (leaderboard.reason === "debug" || cpu.enabled) rank = 6;

  if (rank < 6) {
    if (leaderboard.reason === "slow") {
      confirmUpdate = confirm(
        `Your score is #${rank} on your personal best score list, but your game is invalid for the leaderboards due to slowdown.\nDo you still want to add this score locally?`
      );
      if (confirmUpdate) confirmUpdate = confirm("Are you sure?");
    }
    if (confirmUpdate) {
      if (rank < 6) {
        highScores.splice(rank - 1, 0, score);
        highScores.pop();
        let highScoreType;
        if (game.timeControl === 2) highScoreType = "";
        if (game.timeControl === 5) highScoreType = "_Standard";
        if (game.timeControl === 10) highScoreType = "_Marathon";
        localStorage.setItem("bestScore1" + highScoreType, highScores[0]);
        localStorage.setItem("bestScore2" + highScoreType, highScores[1]);
        localStorage.setItem("bestScore3" + highScoreType, highScores[2]);
        localStorage.setItem("bestScore4" + highScoreType, highScores[3]);
        localStorage.setItem("bestScore5" + highScoreType, highScores[4]);
        highScores = [
          parseInt(localStorage.getItem("bestScore1" + highScoreType)),
          parseInt(localStorage.getItem("bestScore2" + highScoreType)),
          parseInt(localStorage.getItem("bestScore3" + highScoreType)),
          parseInt(localStorage.getItem("bestScore4" + highScoreType)),
          parseInt(localStorage.getItem("bestScore5" + highScoreType)),
        ];
      }
    }
  }
  return rank;
}
