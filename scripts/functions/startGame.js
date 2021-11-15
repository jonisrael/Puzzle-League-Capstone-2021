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
  loadedAudios,
  loadAllAudios,
  cpu
} from "../global";
import * as state from "../../store";
import { playMusic } from "./audioFunctions";
import { audio, audioList } from "../fileImports";
import { getLeaderboardData, getWorldTimeAPI, render } from "../../index";
import { gameLoop, newBlock, puzzleLeagueLoop } from "../../puzzleleague";
import { unpause } from "./pauseFunctions";
import { bestScores } from "./updateBestScores";
import { newBlock2 } from "./experimentalFunctions";

export function startGame(selectedGameSpeed, version = 1) {
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
  console.log(`Gamepad Port Connected:`, win.gamepadPort);
  resetGameVariables();
  document.getElementById("container").innerHTML = "Loading...";
  createHeadsUpDisplay();
  game.board = generateOpeningBoard();
  playMusic(audio.popcornMusic);
  if (loadedAudios.length == 0) loadAllAudios();
  // Set up game loop
  leaderboard.canPost = true;
  debug.enabled = false;
  debug.show = false;
  cpu.enabled = cpu.control = game.mode === "cpu-play";
  cpu.showInfo = false;
  perf.gameSpeed = selectedGameSpeed;
  perf.fpsInterval = (1000 * selectedGameSpeed) / 60;
  perf.then = Date.now();
  perf.gameStartTime = perf.then;
  perf.sumOfPauseTimes = 0;
  perf.diffFromRealTime = 0;
  if (version === 1) {
    requestAnimationFrame(gameLoop);
  }

  if (version === 2) {
    requestAnimationFrame(puzzleLeagueLoop);
  }
}

function createHeadsUpDisplay() {
  let container = document.getElementById("container");
  container.innerHTML = ""; // Empties the home page
  win.fpsDisplay = document.createElement("p");
  win.fpsDisplay.setAttribute("id", "fps-display");
  win.fpsDisplay.style.color = "black";
  container.appendChild(win.fpsDisplay);

  win.mainInfoDisplay = document.createElement("h2");
  win.mainInfoDisplay.setAttribute("id", "main-info");
  win.mainInfoDisplay.innerHTML = "Loading...";
  container.appendChild(win.mainInfoDisplay);

  let gameContainer = document.createElement("div");
  gameContainer.setAttribute("id", "game-container");
  container.appendChild(gameContainer);

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
  // create rightHudElements
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

  let controls = document.createElement("div");
  controls.setAttribute("id", "controls");
  if (game.mode !== "cpu-play") {
    preset.controlsDefaultMessage = `
      <ul style="font-size:large;">
      <li>Press Arrow keys to <strong>MOVE</strong> the Rectangle Cursor</li>
      <li>Press S or X to <strong>SWAP</strong> blocks at the Cursor</li>
      <li>Press R or Z to <strong>RAISE</strong> the stack one row.</li>
      <li>Press ESC or P to <strong>PAUSE</strong> the game.</li>
      <li>Press ~ to access <strong>Debug Mode</strong> (disables score posting)</li>
      </ul>
      <br />`;
  } else {
    preset.controlsDefaultMessage = `
      <ul style="font-size:large;">
      <li>Press S to <strong>Show/Hide</strong> Visual AI Information</li>
      <li>Press K to <strong>KO the AI</strong></li>
      <li>Press M to set the <strong>game level to the highest setting</strong></li>
      <li>Press N to <strong>lower the game level by 1</strong>
      <li>Press ESC or P to <strong>PAUSE</strong> the game.</li>
      </ul>
      <br />`;
  }
  controls.innerHTML = preset.controlsDefaultMessage;
  win.controlsDisplay = controls;

  rightHudElements.appendChild(controls);

  let bestScoresDisplay = document.createElement("table");
  bestScoresDisplay.setAttribute("id", "best-scores-table");
  let bestScoresString = `
  <tr>
    <th>Rank</th>
    <th>Best Scores</th>
  </tr>`;

  for (let i = 0; i < bestScores.length; i++) {
    bestScoresString += `
    <tr>
      <td>
      #${i + 1}
      </td>
      <td>
        ${bestScores[i]}
      </td>
    </tr>
    `;
  }
  bestScoresString += `</table>`;
  bestScoresDisplay.innerHTML = bestScoresString;
  if (game.mode !== "cpu-play") rightHudElements.appendChild(bestScoresDisplay);

  // Make Canvas, then append it to home page
  win.makeCanvas = document.createElement(`canvas`);
  win.makeCanvas.setAttribute("id", "canvas");
  win.makeCanvas.setAttribute("width", "192");
  win.makeCanvas.setAttribute("height", "384");
  column2.appendChild(win.makeCanvas);
  win.highScoreDisplay = document.createElement("h3");
  win.highScoreDisplay.setAttribute("id", "high-score-display");
  column3.appendChild(win.highScoreDisplay);
  win.cvs = document.getElementById("canvas");
  win.ctx = win.cvs.getContext("2d");

  // Add invisible "Resume play" button, to be visible when game is paused
  let resumeButton = document.createElement("button");
  resumeButton.setAttribute("id", "resume-button");
  resumeButton.className = "pause-buttons default-button";
  resumeButton.style.display = "none";
  resumeButton.innerHTML = "<u>C</u>ontinue";
  column2.appendChild(resumeButton);
  resumeButton.addEventListener("click", event => {
    unpause();
  });

  // Add invisible "Main Menu" button, to be visible when game is paused
  let restartButton = document.createElement("button");
  restartButton.setAttribute("id", "restart-button");
  restartButton.className = "pause-buttons default-button";
  restartButton.style.display = "none";
  restartButton.innerHTML = "<u>R</u>estart";
  column2.appendChild(restartButton);
  restartButton.addEventListener("click", event => {
    win.running = false;
    win.restartGame = true;
  });

  let mainMenuButton = document.createElement("button");
  mainMenuButton.setAttribute("id", "menu-button");
  mainMenuButton.className = "pause-buttons default-button";
  mainMenuButton.style.display = "none";
  mainMenuButton.innerHTML = "<u>M</u>enu";
  column2.appendChild(mainMenuButton);
  mainMenuButton.addEventListener("click", event => {
    win.running = false;
    render(state.Home);
  });
}

export function resetGameVariables() {
  game.rise = 0;
  game.board = [];
  game.mute = 0;
  game.volume = 1;
  game.level = 1;
  game.boardRiseSpeed = preset.speedValues[game.level];
  game.blockClearTime = preset.clearValues[game.level];
  game.blockBlinkTime = preset.blinkValues[1];
  game.blockInitialFaceTime = preset.faceValues[1];
  game.blockPopMultiplier = preset.popMultiplier[1];
  game.blockStallTime = preset.stallValues[game.level];
  game.raiseDelay = 0;
  game.frames = loadedAudios.length == audioList.length ? -186 : -210;
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
  game.largestCombo = 0;
  game.totalClears = 0;
  game.message = "Loading...";
  game.defaultMessage = "";
  game.over = false; //gameOver
  game.grounded = true;
  game.addToPrimaryChain = false; // used to start/continue a chain
  game.readyForNewRow = false;
  game.boardRiseDisabled = false;
  game.disableSwap = false;
  game.currentlyQuickRaising = false;
  game.raisePressed = false;
  // game.Music = gameMusic;
  game.data = {};
  game.log = [];
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

export function generateOpeningBoard(version = 1) {
  game.cursor.x = 2;
  game.cursor.y = 6;
  let block;
  for (let c = 0; c < grid.COLS; c++) {
    game.board.push([]);
    for (let r = 0; r < grid.ROWS + 2; r++) {
      if (version === 1) block = newBlock(c, r);
      if (version === 2) block = newBlock2(c, r);
      game.board[c].push(block);
      if (r > 11) {
        game.board[c][r].color = PIECES[randInt(PIECES.length)];
        game.board[c][r].type = blockType.DARK;
      }
      if (version === 1) block.draw();
      if (version === 2) block.draw("vacant_normal");
      block.draw();
    }
  }

  for (let i = 0; i < 30; i++) {
    // Generate 30 random blocks on bottom 6 grid.ROWS.
    while (true) {
      let x = randInt(grid.COLS);
      let y = randInt(5);
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
