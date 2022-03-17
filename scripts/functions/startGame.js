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
  touch,
  helpPlayer,
  detectInfiniteLoop,
  saveState,
  randomPiece,
  gameStart,
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
import {
  Cursor,
  gameLoop,
  newBlock,
  updateLevelEvents,
} from "../../puzzleleague";
import { pause, unpause } from "./pauseFunctions";
import { bestScores } from "./updateBestScores";
import { action } from "../controls";
import { createClickListeners } from "../clickControls";
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
import { createBoard, previous, saveCurrentBoard } from "./recordGame";
// import { newBlock2, puzzleLeagueLoop } from "./experimentalFunctions";

export function startGame(selectedGameSpeed = 1) {
  // Object.keys(game).forEach(key => (game[key] = newGame[key]));
  leaderboard.reason = "";
  getWorldTimeAPI();
  getLeaderboardData();
  win.running = true;
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
  helpPlayer.done = false;
  touch.moveOrderExists = false;
  cpu.enabled = cpu.control = game.mode === "cpu-play";
  game.humanCanPlay = game.mode !== "cpu-play";
  cpu.showInfo = false;
  document.getElementById("container").innerHTML = "Loading...";
  createHeadsUpDisplay(window.innerWidth < 800);
  win.cvs = document.getElementById("canvas");
  win.ctx = win.cvs.getContext("2d");
  if (game.mode !== "arcade") {
    game.frames = -76;
    if (game.mode === "training") updateLevelEvents(0);
  }
  win.timeDisplay.innerHTML = "00:00";
  win.scoreDisplay.innerHTML = "00000";
  win.levelDisplay.innerHTML = "1";
  win.multiplierDisplay.innerHTML = "1.00x";
  touch.thereIsABlockCurrentlySelected = false;
  touch.moveOrderExists = false;
  touch.arrowLists.length = 0;
  game.tutorialRunning = false;
  // document.getElementById("game-info-table").style.display = "inline";
  if (game.mode === "tutorial") {
    game.tutorialRunning = true;
    game.disableRaise = true;
    game.cursor_type = "illegalCursorUp";
    grid.COLS = 6;
    grid.ROWS = 8;
    win.cvs.height = grid.SQ * grid.ROWS;
    document.getElementById("main-info-container").style.minHeight = "30vh";
    startTutorial();
  } else {
    grid.COLS = 6;
    grid.ROWS = 12;
    win.cvs.height = grid.SQ * grid.ROWS;
    game.board = generateOpeningBoard(42, 8);
    game.startingBoard = saveCurrentBoard(game.board, true);
  }
  window.scrollTo(0, 0);

  Object.keys(saveState).forEach((stateType) => (saveState[stateType] = {}));
  // if (!win.tutorialPlayedOnce && game.mode == "arcade") {
  //   win.tutorialPlayedOnce = true;g
  //   // game.board = generateOpeningBoard(40, 7);
  //   // game.board = generateOpeningBoard(30, 5);
  //   // startTutorial();
  // } else {
  //   // game.board = generateOpeningBoard(40, 7);
  //   // game.board = generateOpeningBoard(30, 5);
  // }
  // // game.board = createTutorialBoard(tutorialBoard);

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
  if (win.appleProduct) {
    showNotification("appleWarning");
  }
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
  game.frames = -186;
  game.seconds = 0;
  game.minutes = 0;
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
}

export function fixNextDarkStack(board) {
  for (let c = 0; c < grid.COLS; c++) {
    let [aboveAdjacent, leftRightAdjacent] = ["", ""];
    let loopCounter = 0;

    do {
      loopCounter++;
      if (detectInfiniteLoop("fixNextDarkStack", loopCounter)) break;
      aboveAdjacent = leftRightAdjacent = "";
      let desiredColor = board[c][grid.ROWS + 1].color;
      if (board[c][grid.ROWS].color === desiredColor) {
        aboveAdjacent = `Dark Color Match Above at col ${c}, ${desiredColor}`;
      }
      if (c - 1 >= 0 && board[c - 1][grid.ROWS + 1].color === desiredColor) {
        if (c - 2 >= 0 && board[c - 2][grid.ROWS + 1].color === desiredColor) {
          leftRightAdjacent = `Dark Match is Left 2 from ${c}, ${desiredColor}`;
        } else if (
          c + 1 < grid.COLS &&
          board[c + 1][grid.ROWS - 1].color === desiredColor
        ) {
          leftRightAdjacent = `Dark Match is Centered at ${c}, ${desiredColor}`;
        }
      } else if (
        c + 1 < grid.COLS &&
        board[c + 1][grid.ROWS + 1].color === desiredColor &&
        c + 2 < grid.COLS &&
        board[c + 2][grid.ROWS + 1].color === desiredColor
      ) {
        leftRightAdjacent = `Dark Match is Right 2 from ${c}, ${desiredColor}`;
      }
      if (aboveAdjacent || leftRightAdjacent) {
        board[c][grid.ROWS + 1].color = randomPiece(game.level);
      }
    } while (aboveAdjacent || leftRightAdjacent);
  } // end for loop

  return board;
  // while (aboveAdjacent || leftRightAdjacent) {
  //   for (let c = 0; c < grid.COLS; c++) {
  //     let desiredColor = board[c][grid.ROWS + 1].color;
  //     if (board[c][grid.ROWS].color === desiredColor) {
  //       aboveAdjacent === `Dark Color Match Above at col ${c} `;
  //     }
  //     if (c - 1 >= 0 && board[c - 1][grid.ROWS - 1].color === desiredColor) {
  //       if (c - 2 >= 0 && board[c - 2][grid.ROWS - 1].color === desiredColor) {
  //         leftRightAdjacent === `Dark Match is Left 2 from ${c}`;
  //       } else if (
  //         c + 1 < grid.COLS &&
  //         board[c + 1][grid.ROWS - 1].color === desiredColor
  //       ) {
  //         leftRightAdjacent === `Dark Match is Centered at ${c}`;
  //       }
  //     } else if (
  //       c + 1 < grid.COLS &&
  //       board[c + 1][grid.ROWS - 1].color === desiredColor &&
  //       c + 2 < grid.COLS &&
  //       board[c + 2][grid.ROWS - 1].color === desiredColor
  //     ) {
  //       leftRightAdjacent += `Dark Match is Right 2 from ${c}`;
  //     }
  //     if (aboveAdjacent || leftRightAdjacent) {
  //       board[c][grid.ROWS + 1].color = randomPiece(game.level);
  //     }
  //   }
  // }
  // for (let c = 0; c < grid.COLS; c++) {
  //   let desiredColor = board[c][grid.ROWS + 1].color;
  //   tempPIECES = PIECES.slice();
  //   tempPIECES.splice(tempPIECES.indexOf(board[c][grid.ROWS].color), 1);
  //   if (board[c][grid.ROWS + 1].color == board[c][grid.ROWS].color) {
  //     aboveAdjacent = `Dark Color Match Above at col ${c}`;
  //   }
  //   if (
  //     c == 0 &&
  //     board[c + 1][grid.ROWS + 1].color == desiredColor &&
  //     board[c + 2][grid.ROWS + 1].color == desiredColor
  //   ) {
  //     leftRightAdjacent = `Dark Color Match Right 2 from ${c}`;
  //   } else if (
  //     c == grid.COLS - 1 &&
  //     board[c - 1][grid.ROWS + 1].color === desiredColor &&
  //     board[c - 2][grid.ROWS + 1].color === desiredColor
  //   ) {
  //     leftRightAdjacent = `Same left 2 from col ${c}`;
  //   } else if (c > 0 && c < grid.COLS - 1) {
  //     if (
  //       board[c - 1][grid.ROWS + 1].color == board[c][grid.ROWS + 1].color &&
  //       board[c - 2][grid.ROWS + 1].color == board[c + 1][grid.ROWS + 1].color
  //     ) {
  //       leftRightAdjacent = true;
  //     }
  //   } else if (c == grid.COLS - 1) {
  //     if (
  //       board[c - 1][grid.ROWS + 1].color == board[c][grid.ROWS + 1].color &&
  //       board[c - 2][grid.ROWS + 1].color == board[c][grid.ROWS + 1].color
  //     ) {
  //       leftRightAdjacent = true;
  //     }
  //   }

  //   if (aboveAdjacent || leftRightAdjacent) {
  //     board[c][grid.ROWS + 1].color = randomPiece(game.level);
  //   }
  //   } // end for loop
  // } // end while loop
  // return board;
}

export function generateOpeningBoard(blockNumber = 40, stackSize = 7) {
  game.cursor = new Cursor(2, 6);
  game.cursor.x = 2;
  game.cursor.y = 6;
  let block;
  let board = [];
  let loopCounter = 0;
  for (let c = 0; c < grid.COLS; c++) {
    board.push([]);
    for (let r = 0; r < grid.ROWS + 2; r++) {
      block = newBlock(c, r);
      board[c].push(block);
      if (r >= grid.ROWS) {
        board[c][r].color = randomPiece(game.level);
        board[c][r].type = blockType.DARK;
      }
      block.draw();
    }
  }
  board = fixNextDarkStack(board); // make sure new stacks follow rules

  if (blockNumber === 0) return board; // keep board empty

  console.log("begin openboard1");
  for (let i = 0; i < blockNumber; i++) {
    // Generate 42 random blocks on bottom 6 grid.ROWS.
    while (true) {
      loopCounter += 1;
      if (detectInfiniteLoop("generateOpeningBoard1", loopCounter)) break;
      let x = randInt(grid.COLS);
      let y = randInt(stackSize);
      if (board[x][y].color === blockColor.VACANT) {
        board[x][y].color = randomPiece(game.level);
        break;
      }
    }
  }

  for (let c = 0; c < grid.COLS; c++) {
    // Drop all blocks to bottom
    let currentBlocks = []; // Temporary
    for (let r = grid.ROWS - 1; r >= 0; r--) {
      if (board[c][r].color != blockColor.VACANT) {
        currentBlocks.unshift(board[c][r].color);
      }
    }
    while (currentBlocks.length < grid.ROWS) {
      loopCounter++;
      if (detectInfiniteLoop("generateOpeningBoard2", loopCounter)) break;
      currentBlocks.unshift(blockColor.VACANT);
    }

    for (let r = 0; r < currentBlocks.length; r++) {
      board[c][r].color = currentBlocks[r];
    }
  }

  for (let x = 0; x < grid.COLS; x++) {
    // Correct Duplicates so blocks of same color cannot be adjacent
    for (let y = 0; y < grid.ROWS; y++) {
      if (board[x][y].color != blockColor.VACANT) {
        let topBlock = blockColor.VACANT;
        let rightBlock = blockColor.VACANT;
        let bottomBlock = blockColor.VACANT;
        let leftBlock = blockColor.VACANT;
        if (y != 0) {
          topBlock = board[x][y - 1].color;
        }
        if (x != grid.COLS - 1) {
          rightBlock = board[x + 1][y].color;
        }
        if (y != grid.ROWS - 1) {
          bottomBlock = board[x][y + 1].color;
        }
        if (x != 0) {
          leftBlock = board[x - 1][y].color;
        }

        loopCounter = 0;
        while (true) {
          loopCounter += 1;
          if (detectInfiniteLoop("generateOpeningBoard2", loopCounter)) break;
          if (
            board[x][y].color != topBlock &&
            board[x][y].color != rightBlock &&
            board[x][y].color != bottomBlock &&
            board[x][y].color != leftBlock
          ) {
            // console.log(`Color of ${x}, ${y}:`, board[x][y].color);
            break;
          }
          board[x][y].color = randomPiece(game.level);
        }
      }
      board[x][y].draw();
    }
  }

  for (let x = 0; x < grid.COLS; x++) {
    // Initial Dark Stacks
    board[x][grid.ROWS].color = randomPiece(game.level);
    board[x][grid.ROWS + 1].color = randomPiece(game.level);
    loopCounter = 0;
    if (x > 0) {
      loopCounter = 0;
      while (board[x][grid.ROWS].color == board[x - 1][grid.ROWS].color) {
        loopCounter++;
        if (detectInfiniteLoop("generateOpeningBoard3", loopCounter)) break;
        board[x][grid.ROWS].color = randomPiece(game.level);
      }
      loopCounter = 0;
      while (
        board[x][grid.ROWS + 1].color == board[x - 1][grid.ROWS + 1].color
      ) {
        loopCounter++;
        if (detectInfiniteLoop("generateOpeningBoard3", loopCounter)) break;
        board[x][grid.ROWS + 1].color = randomPiece(game.level);
      }
    }
  }
  return board;
}
