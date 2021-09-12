/* eslint-disable no-constant-condition */
import {
  PIECES,
  randInt,
  game,
  win,
  preset,
  grid,
  blockColor,
  blockType,
  api
} from "../global";
import { playMusic } from "./audioFunctions";
import { audio } from "../fileImports";
import { getWorldTimeAPI } from "../../index";
import { gameLoop, newBlock } from "../../puzzleleague";

export function startGame() {
  api.data = getWorldTimeAPI();
  win.running = true;
  resetGameVariables();
  createHeadsUpDisplay();
  game.board = generateOpeningBoard();
  playMusic(audio.popcornMusic);
  setTimeout(gameLoop(), 1000 / 60);
}

function createHeadsUpDisplay() {
  let container = document.getElementById("container");
  container.innerHTML = "";
  win.fpsDisplay = document.createElement("p");
  win.fpsDisplay.setAttribute("id", "fps-display");
  container.append(win.fpsDisplay);

  win.mainInfoDisplay = document.createElement("h2");
  win.mainInfoDisplay.setAttribute("id", "main-info");
  win.mainInfoDisplay.innerHTML = "hello";
  container.append(win.mainInfoDisplay);

  let gameContainer = document.createElement("div");
  gameContainer.setAttribute("id", "game-container");
  container.append(gameContainer);

  let column1 = document.createElement("div");
  column1.setAttribute("id", "column1");
  gameContainer.append(column1);
  let column2 = document.createElement("div");
  column2.setAttribute("id", "column2");
  gameContainer.append(column2);
  let column3 = document.createElement("div");
  column3.setAttribute("id", "column3");
  gameContainer.append(column3);

  // create leftHudElements
  let leftHudElements = document.createElement("div");
  leftHudElements.setAttribute("id", "left-hud-elements");
  column1.append(leftHudElements);
  let rightHudElements = document.createElement("div");
  rightHudElements.setAttribute("id", "right-hud-elements");
  column3.append(rightHudElements);
  // create HUD elements
  win.statDisplay = document.createElement("h2");
  win.chainDisplay = document.createElement("h2");
  win.scoreHeader = document.createElement("h2");
  win.scoreDisplay = document.createElement("h2");
  win.timeHeader = document.createElement("h2");
  win.timeDisplay = document.createElement("h2");
  win.levelHeader = document.createElement("h2");
  win.levelDisplay = document.createElement("h2");

  win.scoreHeader.innerHTML = "SCORE";
  win.scoreHeader.style.color = "blue";
  win.timeHeader.innerHTML = "TIME";
  win.timeHeader.style.color = "blue";
  win.levelHeader.innerHTML = "LEVEL";
  win.levelHeader.style.color = "blue";

  // set HUD element IDs
  win.statDisplay.setAttribute("id", "all-stats");
  win.scoreDisplay.setAttribute("id", "score");
  win.timeDisplay.setAttribute("id", "time");
  win.levelDisplay.setAttribute("id", "level");
  // append HUD elements

  leftHudElements.appendChild(win.statDisplay);
  leftHudElements.appendChild(win.scoreHeader);
  leftHudElements.appendChild(win.scoreDisplay);
  leftHudElements.appendChild(win.timeHeader);
  leftHudElements.appendChild(win.timeDisplay);
  leftHudElements.appendChild(win.levelHeader);
  leftHudElements.appendChild(win.levelDisplay);

  // Make Canvas, then append it to home page
  win.makeCanvas = document.createElement(`canvas`);
  win.makeCanvas.setAttribute("id", "canvas");
  win.makeCanvas.setAttribute("width", "192");
  win.makeCanvas.setAttribute("height", "384");
  column2.appendChild(win.makeCanvas);
  win.highScoreDisplay = document.createElement("h3");
  win.highScoreDisplay.setAttribute("id", "high-score-display");
  container.appendChild(win.highScoreDisplay);
  win.cvs = document.getElementById("canvas");
  win.ctx = win.cvs.getContext("2d");
}

export function resetGameVariables() {
  game.rise = 0;
  game.board = [];
  game.mute = 0;
  game.volume = 1;
  game.level = 1;
  game.boardRiseSpeed = preset.speedValues;
  game.blockClearTime = preset.clearValues;
  game.blockStallTime = preset.stallValues;
  game.raiseDelay = 0;
  game.frames = -180;
  game.seconds = 0;
  game.minutes = 0;
  game.score = 0;
  game.scoreMultiplier = 1;
  game.chainScoreAdded = 0;
  game.currentChain = 0;
  game.combo = 0;
  game.lastChain = 0;
  game.largestChain = 0;
  game.largestCombo = 0;
  game.totalClears = 0;
  game.message = "";
  game.defaultMessage = "";
  game.over = false; //gameOver
  game.grounded = true;
  game.addToPrimaryChain = false; // used to start/continue a chain
  // game.highScore = HIGH_SCORE;
  game.disableRaise = false;
  game.disableSwap = false;
  game.quickRaise = false;
  game.raisePressed = false;
  // game.Music = gameMusic;
  game.data = {};
}

export function fixNextDarkStack() {
  let aboveAdjacent = true;
  let leftRightAdjacent = true;
  let tempPIECES = PIECES.slice();
  while (aboveAdjacent || leftRightAdjacent) {
    aboveAdjacent = leftRightAdjacent = false;
    for (let c = 0; c < grid.COLS; c++) {
      tempPIECES = PIECES.slice();
      tempPIECES.splice(tempPIECES.indexOf(game.board[c][12].color), 1);
      if (game.board[c][13].color == game.board[c][12].color) {
        aboveAdjacent = true;
      }
      if (c == 0) {
        if (game.board[c][13].color == game.board[c + 1][13].color) {
          leftRightAdjacent = true;
        }
      } else if (c > 0 && c < 5) {
        if (
          game.board[c - 1][13].color == game.board[c][13].color &&
          game.board[c][13].color == game.board[c + 1][13].color
        ) {
          leftRightAdjacent = true;
        }
      } else if (c == 5) {
        if (game.board[c - 1][13].color == game.board[c][13].color) {
          leftRightAdjacent = true;
        }
      }

      if (aboveAdjacent || leftRightAdjacent) {
        game.board[c][13].color = PIECES[randInt(PIECES.length)];
      }
    }
  }
}

export function generateOpeningBoard() {
  game.cursor.x = 2;
  game.cursor.y = 6;
  for (let c = 0; c < grid.COLS; c++) {
    game.board.push([]);
    for (let r = 0; r < grid.ROWS + 2; r++) {
      let block = newBlock(c, r);
      game.board[c].push(block);
      if (r > 11) {
        game.board[c][r].color = PIECES[randInt(PIECES.length)];
        game.board[c][r].type = blockType.DARK;
      }
      block.draw();
    }
  }

  for (let i = 0; i < 30; i++) {
    // Generate 30 random blocks on bottom 6 grid.ROWS.
    while (true) {
      let x = randInt(grid.COLS);
      let y = randInt(grid.ROWS / 2) + 6;
      if (game.board[x][y].color == blockColor.VACANT) {
        game.board[x][y].color = PIECES[randInt(PIECES.length)];
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
    while (currentBlocks.length < 12) {
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
        if (x != 5) {
          rightBlock = game.board[x + 1][y].color;
        }
        if (y != 11) {
          bottomBlock = game.board[x][y + 1].color;
        }
        if (x != 0) {
          leftBlock = game.board[x - 1][y].color;
        }

        while (true) {
          if (
            game.board[x][y].color != topBlock &&
            game.board[x][y].color != rightBlock &&
            game.board[x][y].color != bottomBlock &&
            game.board[x][y].color != leftBlock
          ) {
            break;
          }
          game.board[x][y].color = PIECES[randInt(PIECES.length)];
        }
      }
      game.board[x][y].draw();
    }
  }

  for (let x = 0; x < grid.COLS; x++) {
    // Initial Dark Stacks
    game.board[x][12].color = PIECES[randInt(PIECES.length)];
    game.board[x][13].color = PIECES[randInt(PIECES.length)];
    if (x > 0) {
      while (game.board[x][12].color == game.board[x - 1][12].color) {
        game.board[x][12].color = PIECES[randInt(PIECES.length)];
      }
      while (game.board[x][13].color == game.board[x - 1][13].color) {
        game.board[x][13].color = PIECES[randInt(PIECES.length)];
      }
    }
  }
  fixNextDarkStack();
  return game.board;
}
