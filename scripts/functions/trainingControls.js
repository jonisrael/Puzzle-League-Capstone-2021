import { updateLevelEvents } from "../../mainGame";
import { cpuAction } from "../computerPlayer/cpu";
import {
  cpu,
  debug,
  game,
  grid,
  helpPlayer,
  saveState,
  preset,
  win,
  touch,
} from "../global";
import { unpause } from "./pauseFunctions";

export function rewind(gameState) {
  game.seconds = game.pastSeconds;
  game.cursor.x = gameState.cursor.x;
  game.cursor.y = gameState.cursor.y;
  game.cursor_type = gameState.cursor_type;
  game.rise = gameState.rise;
  for (let x = 0; x < grid.COLS; x++) {
    for (let y = 0; y < grid.ROWS + 2; y++) {
      Object.keys(game.board[x][y]).forEach(
        (key) => (game.board[x][y][key] = gameState.board[x][y][key])
      );
      game.board[x][y].targetX = undefined;
    }
  }
}

export function doTrainingAction(number) {
  let num = JSON.parse(number);
  if (
    game.mode === "training" &&
    !win.mobile &&
    document.getElementsByClassName("training-buttons")[num - 1].disabled
  )
    return;
  if (num === 1) updateLevelEvents(game.level - 1);
  else if (num === 2) updateLevelEvents(game.level + 1);
  else if (num === 3) rewind(saveState.chainStart);
  else if (num === 4) rewind(saveState.lastMatch);
  else if (num === 5) {
    touch.moveOrderExists = false;
    rewind(saveState.lastSwap);
  } else if (num === 6) {
    helpPlayer.forceHint = (helpPlayer.forceHint + 1) % 2;
    helpPlayer.hintVisible = false;
    document.querySelector("#hint-button").innerHTML = `(${num}) Turn Hint ${
      helpPlayer.forceHint ? "Off" : "On"
    }`;
    helpPlayer.timer = helpPlayer.forceHint ? 0 : 120;
    if (helpPlayer.forceHint) {
      cpuAction({}, true);
      if (cpu.matchList.length > 0) {
        helpPlayer.hintVisible = true;
      }
    }
  } else if (num === 7) updateLevelEvents(0);
  else if (num === 8) {
    updateLevelEvents(7);
    game.raiseDelay = 60;
  } else if (num === 9) {
    updateLevelEvents(13);
    game.raiseDelay = 60;
  } else if (num === 10) {
    win.running = false;
  }

  if (num < 3) {
    win.levelDisplay.innerHTML = game.level;
    win.multiplierDisplay.innerHTML = preset.multValues[game.level];
  } else {
    if (game.paused && !debug.enabled) unpause();
  }
  updateTrainingButtons();
}

export function setUpTrainingMode(parentElement) {
  let trainingTitles = [
    "Adjust Speed",
    "Save States",
    "AI-Assist",
    "Quick Buttons",
  ];
  let trainingButtons = [
    ["Level -", "level-down-button"],
    ["Level +", "level-up-button"],

    ["Chain Start", "rewind-btn-chain"],
    ["Last Match", "rewind-btn-match"],
    ["Last Swap", "rewind-btn-swap"],

    ["Turn Hint On", "hint-button"],

    ["Practice Speed", "slow-button"],
    ["Overtime", "overtime-button"],
    ["Overtime++", "over-plus-button"],
    ["Main Menu", "main-menu-button"],
  ];
  for (let i = 0; i < trainingButtons.length; i++) {
    if (i === 0 || i === 2 || i === 5 || i === 6 || i === 9) {
      if (i !== 0) {
        let hr = document.createElement("hr");
        hr.className = "training-hrs";
        parentElement.appendChild(hr);
      }
      let title = document.createElement("p");
      title.className = "training-titles";
      if (i === 0) title.innerHTML = trainingTitles[0];
      if (i === 2) title.innerHTML = trainingTitles[1];
      if (i === 5) title.innerHTML = trainingTitles[2];
      if (i === 6) title.innerHTML = trainingTitles[3];

      parentElement.appendChild(title);
    }
    let btn = document.createElement("button");
    btn.innerHTML = `<span class="training-numbers">(${i + 1}) </span>${
      trainingButtons[i][0]
    }`;
    btn.setAttribute("id", trainingButtons[i][1]);
    btn.className = "default-button training-buttons";

    parentElement.appendChild(btn);

    btn.addEventListener("click", () => doTrainingAction(i + 1));
  } // end for loop
  updateTrainingButtons();
}

export function updateTrainingButtons() {
  if (game.mode !== "training") return;
  try {
    document.getElementById("rewind-btn-swap").disabled = !saveState.lastSwap
      .board;
    document.getElementById("rewind-btn-match").disabled = !saveState.lastMatch
      .board;
    document.getElementById("rewind-btn-chain").disabled = !saveState.chainStart
      .board;
    document.getElementById("level-down-button").disabled = game.level === 0;
    document.getElementById("slow-button").disabled = game.level === 0;
    document.getElementById("level-up-button").disabled =
      game.level === preset.speedValues.length - 1;
    document.getElementById("over-plus-button").disabled =
      game.level === preset.speedValues.length - 1;
    document.getElementById("overtime-button").disabled = game.level === 7;
  } catch (error) {
    0 === 0;
  }
}
