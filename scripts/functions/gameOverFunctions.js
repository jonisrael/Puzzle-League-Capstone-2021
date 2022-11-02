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
  touch,
  preset,
} from "../global";

import { audio } from "../fileImports";
import { submitResults, afterGame } from "./submitResults";

import * as state from "../../store";
import { playAudio, playMusic } from "./audioFunctions";
import { displayMessage, render, router, getLeaderboardData } from "../..";

export function closeGame(gameFinished) {
  win.running = false;
  sound.Music[1].pause();
  console.log("game not aborted:", gameFinished);
  if (!gameFinished) {
    render(state.Home);
  }
  if (win.loopCounter > 999) {
    win.cvs = null;
    win.ctx = null;
    win.cvs.remove();
  }
  document.getElementById("header").style.display = "block";
  document.getElementById("nav-bar").style.display = "block";
  document.getElementById("footer").style.display = "block";

  // if (document.getElementById("home-page")) {
  //   document.getElementById("home-page").onmousedown = true;
  //   document.getElementById("home-page").onselectstart = true;
  // }

  if (gameFinished) {
    afterGame();
  }
}

export function isGameOver() {
  // if score > 1 million or 100 minutes have passed
  if (game.score >= 999999 || game.frames === 360000) return true;
  if (game.highestRow === 0) {
    game.rise = 0;
  } else {
    game.deathTimer = preset.faceValues[game.level];
  }
  if (
    game.highestRow === 0 &&
    game.currentChain === 0 &&
    !game.boardHasClearingBlock &&
    !game.boardHasSwappingBlock &&
    !game.pauseStack &&
    !game.boardHasAirborneBlock &&
    game.raiseDelay === 0
  ) {
    game.deathTimer -= perf.gameSpeed;
    if (game.deathTimer > 0) {
      return false;
    }
    // if debug, do not game over.
    if (debug.enabled || game.mode === "training" || game.score < 100) {
      game.score = game.currentChain = 0;
      if (
        (game.mode === "arcade" || game.mode === "cpu-play") &&
        !debug.enabled
      ) {
        game.frames = game.minutes = game.seconds = 0;
        win.restartGame = true;
        sound.Music[1].pause();
        game.frames = -66;
        game.rise = 0;
        game.totalClears = 0;
        helpPlayer.hintVisible = false;
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
        for (let y = grid.ROWS - 1; y >= 0; y--) {
          game.board[x][y].targetX = game.board[x][y].previewX = undefined;
          if (y > 4) {
            game.board[x][y].color = blockColor.VACANT;
            game.board[x][y].type = blockType.NORMAL;
          }
        }
      }
      touch.moveOrderList.length = 0;
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
    } else {
      endGame();
      game.rise = 0;
      return true;
    }
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
  game.pauseStack = true;
  game.rise = 0;
  let deathRow = Math.floor(game.frames / 2);
  for (let i = 0; i < grid.COLS; i++) {
    if (
      game.board[i][deathRow].color != blockColor.VACANT &&
      game.highestCols.includes(i)
    ) {
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
  win.gamesCompleted++;
  localStorage.setItem("games-completed", `${win.gamesCompleted}`);
  if (game.timeControl !== 2) {
    leaderboard.canPost = false;
    leaderboard.reason = "no-available-leaderboard";
  }
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
