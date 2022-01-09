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
} from "../global";
import html from "html-literal";
import * as state from "../../store";
import { playMusic } from "./audioFunctions";
import { audio, audioList, loadedAudios } from "../fileImports";
import { getLeaderboardData, getWorldTimeAPI, render } from "../../index";
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
// import { newBlock2, puzzleLeagueLoop } from "./experimentalFunctions";

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
  console.log("Game Speed:", selectedGameSpeed, "| Version: ", version);
  console.log(`Gamepad Port Connected:`, win.gamepadPort);
  // console.log(Object.keys(newGame));
  // Object.keys(game).forEach(key => {
  //   console.log(`Key: ${key}, gameVal ${game[key]} is now ${newGame[key]}`);
  //   game[key] = newGame[key];
  // });
  // console.log(game);
  resetGameVariables();
  if (game.mode === "training") game.frames = -76;
  cpu.enabled = cpu.control = game.mode === "cpu-play";
  cpu.showInfo = false;
  document.getElementById("container").innerHTML = "Loading...";
  createHeadsUpDisplay();
  win.timeDisplay.innerHTML = "00:00";
  win.scoreDisplay.innerHTML = "00000";
  win.levelDisplay.innerHTML = "1";
  win.multiplierDisplay.innerHTML = "1.00x";
  touch.thereIsABlockCurrentlySelected = false;
  touch.moveOrderExists = false;
  touch.arrowList.length = 0;
  game.board = generateOpeningBoard(version);
  // Set up game loop
  leaderboard.canPost = true;
  debug.enabled = false;
  debug.show = false;
  perf.gameSpeed = selectedGameSpeed;
  perf.fpsInterval = (1000 * selectedGameSpeed) / 60;
  perf.then = Date.now();
  perf.gameStartTime = perf.then;
  perf.sumOfPauseTimes = 0;
  perf.diffFromRealTime = 0;
  win.version = version;
  if (version === 1) {
    requestAnimationFrame(gameLoop);
  }
}

function createHeadsUpDisplay() {
  let container = document.getElementById("container");
  container.innerHTML = ""; // Empties the home page
  // if (document.getElementById("home-page")) {
  //   document.getElementById("home-page").onmousedown = false;
  //   document.getElementById("home-page").onselectstart = false;
  // }

  let headerRow = document.createElement("tr");
  let infoRow = document.createElement("tr");
  win.timeHeader = document.createElement("th");
  win.scoreHeader = document.createElement("th");
  win.levelHeader = document.createElement("th");
  win.multiplierHeader = document.createElement("th");
  win.statDisplay = document.createElement("td"); // only used for debug
  win.scoreDisplay = document.createElement("td");
  win.timeDisplay = document.createElement("td");
  win.levelDisplay = document.createElement("td");
  win.multiplierDisplay = document.createElement("td");
  win.chainDisplay = document.createElement("td");

  // set HUD element IDs
  win.statDisplay.setAttribute("id", "all-stats");
  win.scoreDisplay.setAttribute("id", "score");
  win.timeDisplay.setAttribute("id", "time");
  win.levelDisplay.setAttribute("id", "level");

  let appContainer = document.createElement("div");
  appContainer.setAttribute("id", "app-container");
  container.appendChild(appContainer);

  win.fpsDisplay = document.createElement("p");
  win.fpsDisplay.setAttribute("id", "fps-display");
  win.fpsDisplay.style.color = "black";
  appContainer.appendChild(win.fpsDisplay);

  win.mainInfoDisplay = document.createElement("h2");
  win.mainInfoDisplay.setAttribute("id", "main-info");
  win.mainInfoDisplay.innerHTML = "Loading...";
  appContainer.appendChild(win.mainInfoDisplay);

  let topSection = document.createElement("div");
  topSection.setAttribute("id", "top-section");
  appContainer.appendChild(topSection);

  win.gameInfoTable = document.createElement("table");
  win.gameInfoTable.setAttribute("id", "game-info");
  win.gameInfoTable.appendChild(headerRow);
  topSection.appendChild(win.gameInfoTable);
  headerRow.appendChild(win.timeHeader);
  headerRow.appendChild(win.scoreHeader);
  headerRow.appendChild(win.levelHeader);
  headerRow.appendChild(win.multiplierHeader);
  win.gameInfoTable.appendChild(infoRow);
  infoRow.appendChild(win.timeDisplay);
  infoRow.appendChild(win.scoreDisplay);
  infoRow.appendChild(win.levelDisplay);
  infoRow.appendChild(win.multiplierDisplay);
  // win.gameInfoTable.innerHTML = `
  //   <tr style="color:black">
  //     <th>${win.timeHeader.innerHTML}</th>
  //     <th>${win.scoreHeader.innerHTML}</th>
  //     <th>${win.levelHeader.innerHTML}</th>
  //   </tr>
  //   <tr>
  //     <td>${win.timeDisplay.innerHTML}</td>
  //     <td>${win.scoreDisplay.innerHTML}</td>
  //     <td>${win.levelDisplay.innerHTML}</td>
  //   </tr>
  // `;

  let gameContainer = document.createElement("div");
  gameContainer.setAttribute("id", "game-container");
  appContainer.appendChild(gameContainer);

  let column1 = document.createElement("div");
  column1.setAttribute("id", "column1");
  gameContainer.append(column1);
  let column2 = document.createElement("div");
  column2.setAttribute("id", "column2");
  gameContainer.append(column2);
  let column3 = document.createElement("div");
  column3.setAttribute("id", "column3");
  gameContainer.append(column3);

  win.scoreHeader.innerHTML = "SCORE";
  win.scoreHeader.style.color = "black";
  win.timeHeader.innerHTML = "TIME";
  win.timeHeader.style.color = "black";
  win.levelHeader.innerHTML = "LEVEL";
  win.levelHeader.style.color = "black";
  win.multiplierHeader.innerHTML = "SCORE MULTIPLIER";
  win.multiplierHeader.style.color = "black";

  // append HUD elements

  // leftHudElements.appendChild(win.statDisplay);
  // leftHudElements.appendChild(win.scoreHeader);
  // leftHudElements.appendChild(win.scoreDisplay);
  // leftHudElements.appendChild(win.timeHeader);
  // leftHudElements.appendChild(win.timeDisplay);
  // leftHudElements.appendChild(win.levelHeader);
  // leftHudElements.appendChild(win.levelDisplay);

  let controls = document.createElement("div");
  controls.style.display = "none";
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

  column3.appendChild(controls);
  // setUpQuickStatDisplay(column1);
  if (game.mode === "arcade") {
    setUpBestScoreDisplay(column3);
  } else if (game.mode === "training") {
    setUpTrainingMode(column3);
  }

  // Make Canvas, then append it to home page
  win.canvas = document.createElement(`canvas`);
  win.canvas.setAttribute("id", "canvas");
  win.canvas.setAttribute("width", "192");
  win.canvas.setAttribute("height", "384");
  column2.appendChild(win.canvas);
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
  resumeButton.addEventListener("click", (event) => {
    unpause();
  });

  // Add invisible "Main Menu" button, to be visible when game is paused
  let restartButton = document.createElement("button");
  restartButton.setAttribute("id", "restart-button");
  restartButton.className = "pause-buttons default-button";
  restartButton.style.display = "none";
  restartButton.innerHTML = "<u>R</u>estart";
  column2.appendChild(restartButton);
  restartButton.addEventListener("click", (event) => {
    win.running = false;
    win.restartGame = true;
  });

  let mainMenuButton = document.createElement("button");
  mainMenuButton.setAttribute("id", "menu-button");
  mainMenuButton.className = "pause-buttons default-button";
  mainMenuButton.style.display = "none";
  mainMenuButton.innerHTML = "<u>M</u>enu";
  column2.appendChild(mainMenuButton);
  mainMenuButton.addEventListener("click", (event) => {
    win.running = false;
    render(state.Home);
  });

  let pauseButton = document.createElement("button");
  pauseButton.setAttribute("id", "pause-button");
  pauseButton.className = "pause-buttons default-button";
  pauseButton.innerHTML = "Pause";
  appContainer.append(pauseButton);
  pauseButton.addEventListener("click", (event) => {
    pause();
  });

  createClickListeners();
}

export function resetGameVariables() {
  game.rise = 0;
  game.panicIndex = 1;
  game.board = [];
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
  game.message = "Loading...";
  game.defaultMessage = "";
  game.over = false; //gameOver
  game.pauseStack = false;
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
      game.board[c].push(block);
      if (r >= grid.ROWS) {
        game.board[c][r].color = PIECES[randInt(PIECES.length)];
        game.board[c][r].type = blockType.DARK;
      }
      if (version === 1) block.draw();
      block.draw();
    }
  }

  for (let i = 0; i < 40; i++) {
    // Generate 42 random blocks on bottom 6 grid.ROWS.
    while (true) {
      let x = randInt(grid.COLS);
      let y = randInt(7);
      if (game.board[x][y].color === blockColor.VACANT) {
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
            // console.log(`Color of ${x}, ${y}:`, game.board[x][y].color);
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

function setUpBestScoreDisplay(column3) {
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
  if (game.mode === "arcade") column3.appendChild(bestScoresDisplay);
}

function setUpTrainingMode(column3) {
  console.log("setting up training mode");
  let levelUp = document.createElement("button");
  levelUp.setAttribute("id", "level-up-button");
  levelUp.className = "default-button level-button";
  levelUp.innerHTML = "Level + (M)";
  column3.appendChild(levelUp);
  let levelDown = document.createElement("button");
  levelDown.setAttribute("id", "level-up-button");
  levelDown.className = "default-button level-button";
  levelDown.innerHTML = "Level - (N)";
  column3.appendChild(levelDown);

  levelUp.addEventListener("click", () => {
    game.level++;
    updateLevelEvents(game.level);
  });
  levelDown.addEventListener("click", () => {
    game.level--;
    updateLevelEvents(game.level);
  });
}

export function createTutorialBoard(squareColors) {
  let block;
  for (let c = 0; c < grid.COLS; c++) {
    game.board.push([]);
    for (let r = 0; r < grid.ROWS + 2; r++) {
      block = newBlock(c, r);
      game.board[c].push(block);
      if (r > grid.ROWS - 1) {
        game.board[c][r].color = PIECES[randInt(PIECES.length)];
        game.board[c][r].type = blockType.DARK;
      }
      block.draw();
    }

    for (let coordStr of Object.keys(squareColors)) {
      let c = JSON.parse(coordStr)[0];
      let r = JSON.parse(coordStr)[1];
      game.board[c][r].color = squareColors[coordStr];
    }
  }
}
