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
  cpu,
  resultsMusic,
  randInt,
  perf,
  helpPlayer,
  sound,
} from "../global";

import { audio } from "../fileImports";
import { submitResults, afterGame } from "./submitResults";

import * as state from "../../store";
import { playAudio, playMusic } from "./audioFunctions";
import { displayMessage, render, router, getLeaderboardData } from "../..";

export function closeGame(gameFinished) {
  win.running = false;
  console.log("game finished:", gameFinished);
  if (!gameFinished) sound.Music[1].volume = 0;
  if (win.loopCounter > 999) {
    win.cvs = null;
    win.ctx = null;
    win.canvas.remove();
  }

  // if (document.getElementById("home-page")) {
  //   document.getElementById("home-page").onmousedown = true;
  //   document.getElementById("home-page").onselectstart = true;
  // }

  if (gameFinished && !cpu.enabled) {
    // if (cpu.enabled) {
    //   win.restartGame = true;
    //   return;
    // }
    location.reload();
    sound.Music[1].pause();
    sound.Music[1] = playMusic(resultsMusic[randInt(resultsMusic.length)]);
    sound.Music[0] = sound.Music[1].src;
    afterGame();
  }
}

export function isGameOver() {
  // if score > 1 million or 100 minutes have passed
  if (game.score >= 999999 || game.frames === 360000) return true;
  if (
    game.highestRow === 0 &&
    game.rise > 0 &&
    game.currentChain === 0 &&
    !game.boardIsClearing &&
    !game.boardHasSwappingBlock &&
    !game.boardRiseDisabled &&
    game.raiseDelay === 0
  ) {
    // if debug, do not game over.
    if (debug.enabled || game.mode === "training" || game.score < 100) {
      game.score = game.frames = game.minutes = game.seconds = game.currentChain = 0;
      if (game.mode === "arcade" && !debug.enabled) {
        win.restartGame = true;
        sound.Music[1].pause();
        game.frames = -66;
        game.rise = 0;
        game.totalClears = 0;
        helpPlayer.done = false;
        helpPlayer.timer = 0;
        game.cursor.x = Math.floor(grid.COLS / 2 - 1);
        game.cursor.y = Math.floor(grid.ROWS / 2);
      }

      game.raiseDelay = 60;
      game.cursor.y += 8;
      playAudio(audio.topout);
      console.log(game.log);
      game.log.length = 0;
      if (game.cursor.y >= grid.ROWS) game.cursor.y = 6;
      for (let x = 0; x < grid.COLS; x++) {
        for (let y = grid.ROWS - 1; y > 4; y--) {
          game.board[x][y].color = blockColor.VACANT;
          game.board[x][y].type = blockType.NORMAL;
        }
      }
      // for (let x = 0; x < grid.COLS; x++) {
      //   for (let y = 0; y < grid.ROWS; y++) {
      //     if (y === 0 && game.board[x][0].color === "vacant") {
      //       break;
      //     }
      //     game.board[x][y].color = blockColor.VACANT;
      //     game.board[x][y].type = blockType.NORMAL;
      //   }
      // }

      return false;
    }
    endGame();
    game.rise = 0;
    return true;
  }
  return false;
}

export function gameOverBoard() {
  // don't continue function if all pieces are already switched to blockType.DEAD type
  if (game.board[grid.COLS - 1][grid.ROWS - 1].type == blockType.DEAD) return;
  if (game.frames == 2) {
    if (!game.tutorialRunning) {
      getLeaderboardData();
    }
    if (!win.muteAnnouncer.checked) playAudio(audio.announcerKO, 0.2);
    game.messagePriority = "Game Over!";
    game.message = "Game Over!";
  }
  if (game.frames == 4) {
    playAudio(audio.topout);
  }
  game.boardRiseDisabled = true;
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
  console.log(`Real time:`, perf.realTime);
  console.log(`Game time:`, Math.round(game.frames / 60));
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
    duration: duration,
  };
  console.log(data);
  return data;
}
