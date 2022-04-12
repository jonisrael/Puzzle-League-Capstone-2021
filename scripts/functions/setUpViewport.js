import { render } from "../..";
import { checkIfHelpPlayer, updateLevelEvents } from "../../puzzleleague";
import * as state from "../../store";
import { createClickListeners } from "../clickControls";
import { cpuAction } from "../computerPlayer/cpu";
import {
  bestScores,
  cpu,
  debug,
  game,
  grid,
  helpPlayer,
  leaderboard,
  perf,
  preset,
  win,
} from "../global";
import { nextDialogue, tutorial } from "../tutorial/tutorialScript";
import { pause, unpause } from "./pauseFunctions";
import { doTrainingAction, setUpTrainingMode } from "./trainingControls";

export function createHeadsUpDisplay(mobile = false) {
  win.mobile = mobile;
  console.log(mobile ? "Mobile" : "Desktop", "Display Selected");
  mobile ? createMobileDisplay() : createDesktopDisplay();
}

function setUpBestScoreDisplay(column) {
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
  if (game.mode === "arcade") column.appendChild(bestScoresDisplay);
}

function createDesktopDisplay() {
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
  win.mainInfoDisplay.setAttribute("id", `main-info`);
  win.mainInfoDisplay.innerHTML = "Loading...";
  appContainer.appendChild(win.mainInfoDisplay);

  let topSection = document.createElement("div");
  topSection.setAttribute("id", "top-section");
  appContainer.appendChild(topSection);

  win.gameInfoTable = document.createElement("table");
  win.gameInfoTable.setAttribute("id", "game-info-table");
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
  column1.setAttribute("class", "column1");
  gameContainer.append(column1);
  let column2 = document.createElement("div");
  column2.setAttribute("class", "column2");
  gameContainer.append(column2);
  let column3 = document.createElement("div");
  column3.setAttribute("class", "column3");
  gameContainer.append(column3);

  win.scoreHeader.innerHTML = "SCORE";
  win.scoreHeader.style.color = "black";
  win.timeHeader.innerHTML = "TME";
  win.timeHeader.style.color = "black";
  win.levelHeader.innerHTML = "LVL";
  win.levelHeader.style.color = "black";
  win.multiplierHeader.innerHTML = "MULT";
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

  column1.appendChild(controls);

  // Make Canvas, then append it to home page
  // document.getElementById("page-body").style.maxWidth = "none";
  // document.getElementById("page-body").style.maxHeight = "95vh";
  win.cvs = document.createElement(`canvas`);
  win.cvs.setAttribute("id", "canvas");
  win.cvs.setAttribute("width", `${grid.COLS * grid.SQ}`);
  win.cvs.setAttribute("height", `${grid.ROWS * grid.SQ}`);
  column2.appendChild(win.cvs);
  win.highScoreDisplay = document.createElement("h3");
  win.highScoreDisplay.setAttribute("id", "high-score-display");
  column1.appendChild(win.highScoreDisplay);

  // Add invisible "Resume play" button, to be visible when game is paused
  // let resumeButton = document.createElement("button");
  // resumeButton.setAttribute("id", "resume-button");
  // resumeButton.className = "default-button pause-buttons";
  // resumeButton.style.display = "none";
  // resumeButton.innerHTML = "<u>C</u>ontinue";
  // column2.appendChild(resumeButton);
  // resumeButton.addEventListener("click", (event) => {
  //   unpause();
  // });

  // // Add invisible "Main Menu" button, to be visible when game is paused
  // let restartButton = document.createElement("button");
  // restartButton.setAttribute("id", "restart-button");
  // restartButton.className = "default-button pause-buttons";
  // restartButton.style.display = "none";
  // restartButton.innerHTML = "<u>R</u>estart";
  // column2.appendChild(restartButton);
  // restartButton.addEventListener("click", (event) => {
  //   win.running = false;
  //   win.restartGame = true;
  // });

  // let mainMenuButton = document.createElement("button");
  // mainMenuButton.setAttribute("id", "menu-button");
  // mainMenuButton.className = "default-button pause-buttons";
  // mainMenuButton.style.display = "none";
  // mainMenuButton.innerHTML = "<u>M</u>enu";
  // column2.appendChild(mainMenuButton);
  // mainMenuButton.addEventListener("click", (event) => {
  //   win.running = false;
  //   render(state.Home);
  // });

  let pauseButton = document.createElement("button");
  pauseButton.setAttribute("id", "pause-button");
  pauseButton.className = "default-button pause-buttons";
  pauseButton.innerHTML = "Pause";
  column1.append(pauseButton);
  if (game.mode === "tutorial") pauseButton.innerHTML = "Advance";
  pauseButton.addEventListener("click", (event) => {
    game.tutorialRunning && !tutorial.chainChallenge
      ? nextDialogue(tutorial.msgIndex)
      : game.paused
      ? unpause()
      : pause();
  });

  column1.append(win.gameInfoTable);

  // setUpQuickStatDisplay(column1);
  if (game.mode === "arcade") {
    setUpBestScoreDisplay(column3);
    // setUpGameLogDisplay(column3);
  } else if (game.mode === "training") {
    setUpTrainingMode(column3);
  }

  createClickListeners();
}

function createMobileDisplay() {
  game.cursor_type = "illegalCursorUp";
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

  let mainInfoContainer = document.createElement("div");
  mainInfoContainer.setAttribute("id", "main-info-container");
  appContainer.appendChild(mainInfoContainer);

  win.mainInfoDisplay = document.createElement("h2");
  win.mainInfoDisplay.setAttribute("id", "main-info");
  win.mainInfoDisplay.innerHTML = "Loading...";
  mainInfoContainer.appendChild(win.mainInfoDisplay);

  let topSection = document.createElement("div");
  topSection.setAttribute("id", "top-section");
  appContainer.appendChild(topSection);

  win.gameInfoTable = document.createElement("table");
  win.gameInfoTable.setAttribute("id", "game-info-table");
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

  win.scoreHeader.innerHTML = "SCORE";
  win.scoreHeader.style.color = "black";
  win.timeHeader.innerHTML = "TME";
  win.timeHeader.style.color = "black";
  win.levelHeader.innerHTML = "LVL";
  win.levelHeader.style.color = "black";
  win.multiplierHeader.innerHTML = "MULT";
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

  gameContainer.appendChild(controls);
  win.cvs = document.createElement(`canvas`);
  win.cvs.setAttribute("id", "canvas");
  win.cvs.setAttribute("width", `${grid.COLS * grid.SQ}`);
  win.cvs.setAttribute("height", `${grid.ROWS * grid.SQ}`);
  gameContainer.appendChild(win.cvs);
  win.highScoreDisplay = document.createElement("h3");
  win.highScoreDisplay.setAttribute("id", "high-score-display");
  // column1.appendChild(win.highScoreDisplay);

  // // Add invisible "Resume play" button, to be visible when game is paused
  // let resumeButton = document.createElement("button");
  // resumeButton.setAttribute("id", "resume-button");
  // resumeButton.className = "default-button pause-buttons";
  // resumeButton.style.display = "none";
  // resumeButton.innerHTML = "<u>C</u>ontinue";
  // gameContainer.appendChild(resumeButton);
  // resumeButton.addEventListener("click", (event) => {
  //   unpause();
  // });

  // // Add invisible "Main Menu" button, to be visible when game is paused
  // let restartButton = document.createElement("button");
  // restartButton.setAttribute("id", "restart-button");
  // restartButton.className = "default-button pause-buttons";
  // restartButton.style.display = "none";
  // restartButton.innerHTML = "<u>R</u>estart";
  // gameContainer.appendChild(restartButton);
  // restartButton.addEventListener("click", (event) => {
  //   win.running = false;
  //   win.restartGame = true;
  // });

  // let mainMenuButton = document.createElement("button");
  // mainMenuButton.setAttribute("id", "menu-button");
  // mainMenuButton.className = "default-button pause-buttons";
  // mainMenuButton.style.display = "none";
  // mainMenuButton.innerHTML = "<u>M</u>enu";
  // gameContainer.appendChild(mainMenuButton);
  // mainMenuButton.addEventListener("click", (event) => {
  //   win.running = false;
  //   render(state.Home);
  // });

  let pauseButton = document.createElement("button");
  pauseButton.setAttribute("id", "pause-button");
  pauseButton.className = "default-button";
  if (game.mode === "training") {
    pauseButton.innerHTML = "Training Features";
    pauseButton.style.fontSize = "0.8rem";
  } else if (game.mode === "tutorial") {
    pauseButton.innerHTML = "Advance";
  } else {
    pauseButton.innerHTML = "Pause";
  }

  pauseButton.addEventListener("click", (event) => {
    game.tutorialRunning && !tutorial.chainChallenge
      ? nextDialogue(tutorial.msgIndex)
      : game.paused
      ? unpause()
      : pause();
  });

  document
    .getElementById("game-info-table")
    .addEventListener("click", (event) => {
      debug.clickCounter++;
      if (debug.clickCounter === 5) {
        debug.enabled = 1;
        debug.show = 1;
        // helpPlayer.timer = 10;
        leaderboard.canPost = false;
        leaderboard.reason = "debug";
        perf.unrankedReason = "debug mode was activated.";
        win.fpsDisplay.style.color = "black";
        console.log("debug ON -- Score Posting Disabled");
      } else if (debug.clickCounter === 8) {
        debug.show = 0;
      } else if (debug.clickCounter === 10) {
        debug.enabled = 0;
        debug.clickCounter = 0;
        updateLevelEvents(game.level);
        console.log("debug OFF");
        debug.slowdown = 0;
        debug.freeze = 0;
        if (game.mode === "cpu-play") cpu.enabled = cpu.control = true;
      }
    });

  // column1.append(win.gameInfoTable);

  // setUpQuickStatDisplay(column1);
  // if (game.mode === "arcade") {
  //   setUpBestScoreDisplay(gameContainer);
  // } else if (game.mode === "training") {
  //   setUpTrainingMode(gameContainer);
  // }
  if (game.mode === "tutorial") {
    topSection.append(pauseButton);
    pauseButton.innerHTML = "Advance";
  } else {
    topSection.append(pauseButton);
  }
  createClickListeners();
}

function setUpGameLogDisplay(parentElement) {
  win.gameLogDisplay = document.createElement("div");
  win.gameLogDisplay.setAttribute("id", "game-log-box");
  parentElement.appendChild(win.gameLogDisplay);
}
