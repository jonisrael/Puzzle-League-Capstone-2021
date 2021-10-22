import {
  blockColor,
  blockType,
  grid,
  announcer,
  game,
  win,
  debug,
  leaderboard,
  api,
  cpu
} from "../global";

import { audio } from "../fileImports";
import { submitResults, afterGame } from "./submitResults";

import * as state from "../../store";
import { playAudio, playMusic } from "./audioFunctions";
import { displayError, render, router, getLeaderboardData } from "../..";

export function closeGame(gameFinished) {
  win.running = false;
  console.log("game finished:", gameFinished);
  if (!gameFinished) game.Music.volume = 0;
  console.log("closeGame called");
  win.running = false;
  if (gameFinished) {
    afterGame();
  }
  win.cvs = null;
  win.ctx = null;
  win.makeCanvas.remove();
}

export function isGameOver() {
  for (let c = 0; c < grid.COLS; c++) {
    if (game.highestRow === 0) {
      // if debug, do not game over.
      if (debug.enabled || game.mode === "training") {
        game.score = 0;
        game.cursor.y += 8;
        if (game.cursor.y >= grid.ROWS) game.cursor.y = 8;
        for (let x = 0; x < grid.COLS; x++) {
          for (let y = grid.ROWS - 1; y > 3; y--) {
            game.board[x][y].color = blockColor.VACANT;
            game.board[x][y].type = blockType.NORMAL;
          }
        }
        playAudio(audio.topout);
        console.log(game.log);
        return false;
      }
      game.Music.volume = 0;
      endGame();
      return true;
    }
  }
  return false;
}

export function gameOverBoard() {
  // don't continue function if all pieces are already switched to blockType.DEAD type
  if (game.board[5][11].type == blockType.DEAD) return;
  if (game.frames == 2) {
    getLeaderboardData();
    if (!win.muteAnnouncer.checked) playAudio(audio.announcerKO, 0.2);
    game.Music.src = audio.resultsMusic;
    game.messagePriority = "Game Over!";
    game.message = "Game Over!";
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
  if (game.score > parseInt(pastHighScore) && !cpu.enabled) {
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
