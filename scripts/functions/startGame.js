/* eslint-disable no-constant-condition */
import {
  PIECES,
  randInt,
  game,
  perf,
  win,
  debug,
  preset,
  grid,
  blockColor,
  blockType,
  api,
  newGame,
  leaderboard,
  cpu,
  helpPlayer,
  detectInfiniteLoop,
  saveState,
  randomPiece,
  gameStart,
  replay,
  getRow,
  bestScores,
} from "../global";
import html from "html-literal";
import * as state from "../../store";
import { playMusic } from "./audioFunctions";
import { audio, loadedAudios } from "../fileImports";
import {
  displayMessage,
  getLeaderboardData,
  getLeaderbogardData,
  getWorldTimeAPI,
  render,
} from "../../index";
import { Cursor, gameLoop, newBlock, updateLevelEvents } from "../../mainGame";
import { pause, unpause } from "./pauseFunctions";
import { action } from "../controls";
import { createClickListeners, touch } from "../clickControls";
import {
  createTutorialBoard,
  loadTutorialState,
  nextDialogue,
  startTutorial,
  tutorial,
  tutorialBoard,
} from "../tutorial/tutorialScript";
import { createHeadsUpDisplay } from "./setUpViewport";
import { showNotification } from "./showNotification";
import { createBoard, previous, saveCurrentBoard } from "./playbackGame";
// import { newBlock2, mainGameLoop } from "./experimentalFunctions";

export function startGame(selectedGameSpeed = 1) {
  // Object.keys(game).forEach(key => (game[key] = newGame[key]));
  leaderboard.reason = "";
  getWorldTimeAPI();
  getLeaderboardData();
  win.running = true;
  win.gameLoopCompleted = true;
  win.gamepadPort = false;
  for (let i = 0; i < 4; i++) {
    if (navigator.getGamepads()[i]) {
      win.gamepadPort = i;
      break;
    }
  }
  console.log("Game Speed:", selectedGameSpeed);
  console.log(`Gamepad Port Connected:`, win.gamepadPort);
  // console.log(Object.keys(newGame));
  // Object.keys(game).forEach(key => {
  //   console.log(`Key: ${key}, gameVal ${game[key]} is now ${newGame[key]}`);
  //   game[key] = newGame[key];
  // });
  // console.log(game);
  resetGameVariables();
  helpPlayer.timer = 600;
  helpPlayer.hintVisible = false;
  touch.moveOrderExists = false;
  cpu.enabled = cpu.control = game.mode === "cpu-play";
  game.humanCanPlay = game.mode !== "cpu-play";
  cpu.showInfo = false;
  document.getElementById("container").innerHTML = "";
  createHeadsUpDisplay(window.innerWidth <= 870); // should be 768
  win.cvs = document.getElementById("canvas");
  win.ctx = win.cvs.getContext("2d");
  if (game.mode !== "arcade" && game.mode !== "cpu-play") {
    game.frames = -76;
    if (game.mode === "training") updateLevelEvents(0);
  } else {
    updateLevelEvents(1);
    localStorage.setItem("unlock", "true"); // unlock other options after 1 play
  }
  win.timeDisplay.innerHTML = "00:00";
  win.scoreDisplay.innerHTML = "00000";
  win.levelDisplay.innerHTML = "1";
  win.multiplierDisplay.innerHTML = "1.00x";
  touch.thereIsABlockCurrentlySelected = false;
  touch.moveOrderExists = false;
  game.tutorialRunning = false;
  // document.getElementById("game-info-table").style.display = "inline";
  if (!game.playRecording) {
    console.log("reset replay arrays");
    Object.keys(replay).forEach((arr) => (replay[arr].length = 0));
  }

  Object.keys(saveState).forEach((stateType) => (saveState[stateType] = {}));

  // Set up game loop
  leaderboard.canPost = true;
  debug.enabled = false;
  debug.show = false;
  perf.gameSpeed = selectedGameSpeed;
  perf.drawDivisor = 1;
  perf.fpsInterval = (1000 * perf.gameSpeed) / 60;
  perf.then = Date.now();
  perf.gameStartTime = perf.then;
  perf.sumOfPauseTimes = 0;
  perf.realTimeDiff = 0;
  if (!win.restartGame) {
    if (win.appleProduct) {
      showNotification("appleWarning");
    } else {
      showNotification("soundStatement");
    }
  }

  if (game.mode === "tutorial") {
    game.tutorialRunning = true;
    game.disableRaise = true;
    game.cursor_type = "illegalCursorUp";
    grid.COLS = 6;
    grid.ROWS = 8;
    win.cvs.height = grid.SQ * grid.ROWS;
    startTutorial(tutorial.state);
  } else {
    grid.COLS = 6;
    grid.ROWS = 12;
    win.cvs.height = grid.SQ * grid.ROWS;
    generateOpeningBoard(42, 8);
    game.startingBoard = saveCurrentBoard(game.board, true);
  }
  window.scrollTo(0, 0);
  requestAnimationFrame(gameLoop);
}

export function resetGameVariables2() {
  let gameKeys = Object.keys(game);
  gameKeys.forEach((key) => {
    if (typeof key === "object") {
      game[key] = JSON.parse(JSON.stringify(gameStart[key]));
    } else {
      game[key] = gameStart[key];
    }
  });
}

export function resetGameVariables() {
  game.rise = 0;
  game.panicIndex = 1;
  game.board = [];
  game.clearingSets.coord.length = 0;
  game.clearingSets.scores.length = 0;
  game.linesRaised = 0;
  game.humanCanPlay = true;
  game.mute = 0;
  game.volume = 1;
  game.level = 1;
  game.highestRow = 11;
  game.boardRiseSpeed = preset.speedValues[game.level];
  game.blockClearTime = preset.clearValues[game.level];
  game.blockBlinkTime = preset.blinkValues[1];
  game.blockInitialFaceTime = preset.faceValues[1];
  game.blockPopMultiplier = preset.popMultiplier[1];
  game.blockStallTime = preset.stallValues[game.level];
  game.raiseDelay = 0;
  game.frames = -182;
  game.seconds = 0;
  game.minutes = 0;
  game.countdownMinutes = game.timeControl;
  game.countdownSeconds = 0;
  game.score = 0;
  game.paused = false;
  game.scoreMultiplier = 1;
  game.chainScoreAdded = 0;
  game.currentChain = 0;
  game.combo = 0;
  game.lastChain = 0;
  game.largestChain = 0;
  game.largestChainScore = 0;
  game.largestCombo = 0;
  game.totalClears = 0;
  game.message = "Loading...(If >5 sec, try refreshing page)";
  game.defaultMessage = "";
  game.over = false; //gameOver
  game.pauseStack = false;
  game.addToPrimaryChain = false; // used to start/continue a chain
  game.readyForNewRow = false;
  game.boardRiseDisabled = false;
  game.disableSwap = false;
  game.disableRaise = false;
  game.currentlyQuickRaising = false;
  game.raisePressed = false;
  game.data = {};
  game.log = [];
  if (game.timeControl === 2) game.timeControlName = "Blitz";
  if (game.timeControl === 5) game.timeControlName = "Standard";
  if (game.timeControl === 10) game.timeControlName = "Marathon";
  game.highScoresList = bestScores[game.timeControlName];
}

export function fixNextDarkStack() {
  for (let c = 0; c < grid.COLS; c++) {
    let [aboveAdjacent, leftRightAdjacent] = ["", ""];
    let loopCounter = 0;

    do {
      loopCounter++;
      if (detectInfiniteLoop("fixNextDarkStack", loopCounter)) break;
      aboveAdjacent = leftRightAdjacent = "";
      let desiredColor = game.board[c][grid.ROWS + 1].color;
      if (game.board[c][grid.ROWS].color === desiredColor) {
        aboveAdjacent = `Dark Color Match Above at col ${c}, ${desiredColor}`;
      }
      if (
        c - 1 >= 0 &&
        game.board[c - 1][grid.ROWS + 1].color === desiredColor
      ) {
        if (
          c - 2 >= 0 &&
          game.board[c - 2][grid.ROWS + 1].color === desiredColor
        ) {
          leftRightAdjacent = `Dark Match is Left 2 from ${c}, ${desiredColor}`;
        } else if (
          c + 1 < grid.COLS &&
          game.board[c + 1][grid.ROWS - 1].color === desiredColor
        ) {
          leftRightAdjacent = `Dark Match is Centered at ${c}, ${desiredColor}`;
        }
      } else if (
        c + 1 < grid.COLS &&
        game.board[c + 1][grid.ROWS + 1].color === desiredColor &&
        c + 2 < grid.COLS &&
        game.board[c + 2][grid.ROWS + 1].color === desiredColor
      ) {
        leftRightAdjacent = `Dark Match is Right 2 from ${c}, ${desiredColor}`;
      }
      if (aboveAdjacent || leftRightAdjacent) {
        game.board[c][grid.ROWS + 1].color = randomPiece(game.level);
      }
    } while (aboveAdjacent || leftRightAdjacent);
  } // end for loop
}

export function generateOpeningBoard(blockNumber = 40, stackSize = 6) {
  if (game.timeControl !== 2) [blockNumber, stackSize] = [32, 6];
  game.cursor = new Cursor(2, 6);
  game.cursor.x = 2;
  game.cursor.y = 6;
  let block;
  game.board.length = 0;
  let loopCounter = 0;
  for (let c = 0; c < grid.COLS; c++) {
    game.board.push([]);
    for (let r = 0; r < grid.ROWS + 2; r++) {
      block = newBlock(c, r);
      game.board[c].push(block);
      if (r >= grid.ROWS) {
        game.board[c][r].color = randomPiece(game.level);
        game.board[c][r].type = blockType.DARK;
      }
      block.draw();
    }
  }

  if (blockNumber === 0) return; // keep board empty

  console.log("begin openboard1");
  for (let i = 0; i < blockNumber; i++) {
    // Generate 42 random blocks on bottom 6 grid.ROWS.
    while (true) {
      loopCounter += 1;
      if (detectInfiniteLoop("generateOpeningBoard1", loopCounter)) break;
      let x = randInt(grid.COLS);
      let y = randInt(stackSize);
      if (game.board[x][y].color === blockColor.VACANT) {
        game.board[x][y].color = randomPiece(game.level);
        break;
      }
    }
  }

  for (let c = 0; c < grid.COLS; c++) {
    // Drop all blocks to bottom
    let currentBlocks = []; // Temporary
    for (let r = grid.ROWS - 1; r >= 0; r--) {
      if (game.board[c][r].color != blockColor.VACANT) {
        currentBlocks.unshift(game.board[c][r].color);
      }
    }
    while (currentBlocks.length < grid.ROWS) {
      loopCounter++;
      if (detectInfiniteLoop("generateOpeningBoard2", loopCounter)) break;
      currentBlocks.unshift(blockColor.VACANT);
    }

    for (let r = 0; r < currentBlocks.length; r++) {
      game.board[c][r].color = currentBlocks[r];
    }
  }

  for (let x = 0; x < grid.COLS; x++) {
    // Correct Duplicates so blocks of same color cannot be adjacent
    for (let y = 0; y < grid.ROWS; y++) {
      if (game.board[x][y].color != blockColor.VACANT) {
        let topBlock = blockColor.VACANT;
        let rightBlock = blockColor.VACANT;
        let bottomBlock = blockColor.VACANT;
        let leftBlock = blockColor.VACANT;
        if (y != 0) {
          topBlock = game.board[x][y - 1].color;
        }
        if (x != grid.COLS - 1) {
          rightBlock = game.board[x + 1][y].color;
        }
        if (y != grid.ROWS - 1) {
          bottomBlock = game.board[x][y + 1].color;
        }
        if (x != 0) {
          leftBlock = game.board[x - 1][y].color;
        }

        loopCounter = 0;
        while (true) {
          loopCounter += 1;
          if (detectInfiniteLoop("generateOpeningBoard2", loopCounter)) break;
          if (
            game.board[x][y].color != topBlock &&
            game.board[x][y].color != rightBlock &&
            game.board[x][y].color != bottomBlock &&
            game.board[x][y].color != leftBlock
          ) {
            // console.log(`Color of ${x}, ${y}:`, game.board[x][y].color);
            break;
          }
          game.board[x][y].color = randomPiece(game.level);
        }
      }
      game.board[x][y].draw();
    }
  }

  for (let x = 0; x < grid.COLS; x++) {
    // Initial Dark Stacks
    game.board[x][grid.ROWS].color = randomPiece(game.level);
    game.board[x][grid.ROWS + 1].color = randomPiece(game.level);
    loopCounter = 0;
    if (x > 0) {
      loopCounter = 0;
      while (
        game.board[x][grid.ROWS].color == game.board[x - 1][grid.ROWS].color
      ) {
        loopCounter++;
        if (detectInfiniteLoop("generateOpeningBoard3", loopCounter)) break;
        game.board[x][grid.ROWS].color = randomPiece(game.level);
      }
      loopCounter = 0;
      while (
        game.board[x][grid.ROWS + 1].color ==
        game.board[x - 1][grid.ROWS + 1].color
      ) {
        loopCounter++;
        if (detectInfiniteLoop("generateOpeningBoard3", loopCounter)) break;
        game.board[x][grid.ROWS + 1].color = randomPiece(game.level);
      }
    }
  }
  fixNextDarkStack(); // make sure new stacks follow rules

  for (let c = 0; c < grid.COLS; c++) {
    replay.initialBoard.push([]);
    for (let r = 0; r < grid.ROWS + 2; r++) {
      if (game.playRecording)
        game.board[c][r].color = replay.initialBoard[c][r];
      else {
        replay.initialBoard[c][r] = game.board[c][r].color;
      }
    }
  }
  if (!game.playRecording)
    replay.darkStacks = [getRow(grid.ROWS), getRow(grid.ROWS + 1)];
}
