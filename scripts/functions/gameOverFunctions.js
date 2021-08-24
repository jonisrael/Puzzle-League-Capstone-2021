import {
  announcer,
  blockColor,
  blockType,
  PIECES,
  INTERACTIVE_PIECES,
  app,
  grid,
  game,
  preset,
  api,
  chainLogic,
  performance,
  debug
} from "../global";

import { audio } from "../fileImports";

import { playAudio } from "./audioFunctions";

export function isGameOver(scoreOfThisGame) {
  for (let c = 0; c < grid.COLS; c++) {
    if (game.board[c][0].color != blockColor.VACANT) {
      game.Music.volume = 0;
      endGame();
      return true;
    }
  }
  return false;
}

export function gameOverBoard() {
  // don't continue function if all pieces are already switched to blockType.DEAD type
  if (game.board[5][11].type == blockType.DEAD) {
    return;
  }
  if (game.frames == 1) {
    playAudio(audio.announcerKO, 0.2);
    game.Music.src = audio.resultsMusic;
  }
  if (game.frames == 4) {
    playAudio(audio.topout);
  }
  game.disableRaise = true;
  let deathRow = Math.floor(game.frames / 2);
  for (let i = 0; i < grid.COLS; i++) {
    if (game.board[i][deathRow].color != blockColor.VACANT) {
      game.board[i][deathRow].type = blockType.DEAD;
    }
  }
}

function endGame() {
  console.log("Game over!");
  console.log(`Score: ${game.score}`);
  console.log(`High Score: ${game.highScore}`);
  // enter new high scores
  let pastHighScore = localStorage.getItem("highScore");
  if (game.score > parseInt(pastHighScore)) {
    console.log("new high score!");
    localStorage.setItem("highScore", `${game.score}`);
  }
  game.highScore = parseInt(localStorage.getItem("highScore"));
  sendData("Anon", game.score, game.minutes, game.seconds);
}

function sendData(name = "Anon", score, minutes, seconds) {
  if (seconds < 10) seconds = `0${seconds}`;
  else seconds = `${seconds}`;
  let duration = `${minutes}:${seconds}`;
  let data = {
    name: name,
    score: score,
    duration: duration
  };
  console.log(data);
  return data;
}
