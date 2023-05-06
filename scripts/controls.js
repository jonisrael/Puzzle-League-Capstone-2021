import { audio } from "./fileImports";
import { win, game, cpu, debug, grid, perf, replay } from "./global";
import { cpuAction } from "./computerPlayer/cpu";
import { pause, unpause } from "./functions/pauseFunctions";
import { playAudio } from "./functions/audioFunctions";
import { displayMessage } from "..";
import { render } from "..";
import * as state from "../store";
import { nextDialogue, tutorial } from "./tutorial/tutorialScript";
import { tutorialMessages } from "./tutorial/tutorialMessages";
import { loadTutorialState } from "./tutorial/tutorialEvents";
import { touch } from "./clickControls";

export let action = {
  up: false,
  down: false,
  left: false,
  right: false,
  swap: false,
  raise: false,
  turn_clockwise: false,
  turn_cc: false,
  pause: false,
};

const actionKeys = Object.keys(action);
const actionValues = Object.values(action);

export const holdTime = JSON.parse(JSON.stringify(action));
export const pressed = JSON.parse(JSON.stringify(action));
export const heldFrames = JSON.parse(JSON.stringify(action));

export const defaultControls = {
  keyboard: {
    up: [38], // ArrowUp
    left: [37], //ArrowLeft
    down: [40], //ArrowDown
    right: [39], //ArrowRight
    swap: [83, 88], // s, x
    raise: [82, 90], // r, z
    turn_clockwise: [84, 67], // t, c
    turn_cc: [71, 86], // g, v
    pause: [112], // p
  },
  gamepad: {
    up: [12], // D-Pad Up
    left: [14], // D-Pad Left
    down: [13], // D-Pad Down
    right: [15], // D-Pad Right
    swap: [0, 1], // B, A
    raise: [5, 7], // L, R
    turn_clockwise: [2], // Y
    turn_cc: [3], // X
    pause: [8, 9], //+, -
  },
  timeCreated: Date.now(),
};

export const savedControls =
  JSON.parse(localStorage.getItem("controls")) ||
  JSON.parse(JSON.stringify(defaultControls));

checkIfControlsExist(savedControls);

export function setNewKeyboardControls() {
  let kb = { swap: [], raise: [], turn_clockwise: [], turn_cc: [] }; // add other inputs later
  for (let i = 0; i < document.querySelectorAll(".kb-controls").length; i++) {
    const el = document.querySelectorAll(".kb-controls")[i];
    let charCode = String.fromCharCode(el.value)
      .toUpperCase()
      .charCodeAt();
    if (el === document.querySelector("#left")) kb.left = [charCode];
    if (el === document.querySelector("#up")) kb.up = [charCode];
    if (el === document.querySelector("#down")) kb.down = [charCode];
    if (el === document.querySelector("#right")) kb.right = [charCode];
    if (el === document.querySelector("#swap-1")) kb.swap[0] = charCode;
    if (el === document.querySelector("#swap-2")) kb.swap[1] = charCode;
    if (el === document.querySelector("#raise-1")) kb.raise[0] = charCode;
    if (el === document.querySelector("#raise-2")) kb.raise[1] = charCode;
    if (el === document.querySelector("#turn-cc-1")) kb.turn_cc[0] = charCode;
    if (el === document.querySelector("#turn-cc-2")) kb.turn_cc[1] = charCode;
    if (el === document.querySelector("#turn-clockwise-1"))
      kb.turn_clockwise[0] = charCode;
    if (el === document.querySelector("#turn-clockwise-2"))
      kb.turn_clockwise[1] = charCode;
  }
  console.log("KB Controls:", kb, document.querySelectorAll(".kb-controls"));
  return kb;
}

export function setNewGamepadControls(swapInputs, raiseInputs) {
  const gameController = {
    up: [12], // D-Pad Up
    left: [14], // D-Pad Left
    down: [13], // D-Pad Down
    right: [15], // D-Pad Right
    swap: [0, 1],
    raise: [5, 7],
    turn_clockwise: [2], // Y
    turn_cc: [3], // X
    pause: [8],
  };
  for (let i = 0; i < swapInputs.length; i++) {
    if (swapInputs[i].selected) gameController.swap.push(i);
    if (raiseInputs[i].selected) gameController.raise.push(i);
  }
  return gameController;
}

export function checkIfControlsExist(controls) {
  // localStorage.removeItem("controls"); // USE ONLY FOR TESTING
  let storedControls = localStorage.getItem("controls");
  let controlsObject = JSON.parse(storedControls);
  console.log(controlsObject);
  const defaultControls = {
    keyboard: {
      up: [38], // ArrowUp
      left: [37], //ArrowLeft
      down: [40], //ArrowDown
      right: [39], //ArrowRight
      swap: [83, 88], // x,s
      raise: [82, 90], // z, r
      turn_clockwise: [71, 86], // t, c
      turn_cc: [84, 67], // g, v
      pause: [112], // g, v
    },
    gamepad: {
      up: [12], // D-Pad Up
      left: [14], // D-Pad Left
      down: [13], // D-Pad Down
      right: [15], // D-Pad Right
      swap: [0, 1], // B, A
      raise: [4, 5], // L, R
      turn_clockwise: [2], // Y
      turn_cc: [3], // X
      pause: [8, 9], // +, -
    },
    timeCreated: Date.now(),
  };
  if (localStorage.getItem("controls")) {
    // patch to fix broken controls 11/9/2021
    // patch to fix broken controls 04/2/2023
    try {
      if (
        !controlsObject.timeCreated ||
        controlsObject.timeCreated < 1683399187852 || // time before latest release (May 6,2023)
        !controlsObject.keyboard ||
        !controlsObject.gamepad
      ) {
        localStorage.setItem("controls", JSON.stringify(defaultControls));
        console.log("Controls invalid or missing, do April 2023 patch to fix.");
        return defaultControls;
      } else {
        console.log("Game Controls object is valid and up to date!");
        return JSON.parse(storedControls);
      }
    } catch (error) {
      localStorage.setItem("controls", JSON.stringify(defaultControls));
      console.log("Caught Undefined Error! Replacing broken controls...");
      console.log("07/03/2022 patch to fix broken controls implemented");
      return defaultControls;
    }
  }
  // otherwise, set controls to default and return the object
  console.log("need new controls");
  JSON.parse(localStorage.getItem("controls")) || defaultControls;
  localStorage.setItem("controls", JSON.stringify(defaultControls));
  return defaultControls;
}

console.log(savedControls.gamepad);

export function playerAction() {
  action.byCPU = false;
  if (game.tutorialRunning && (!game.humanCanPlay || debug.enabled)) {
    if (actionValues.includes(true)) {
      tutorialBreakInputs(action);
      actionKeys.forEach((btn) => (action[btn] = false));
    } else if (win.gamepadPort !== false) {
      // check gamepad inputs
      gamepadInput();
    }

    if (Object.values(action).includes(true) && !action.pause) {
      return action;
    }
  }

  if (win.gamepadPort !== false) {
    gamepadInput();
  }

  if (!game.humanCanPlay && !debug.enabled) {
    actionKeys.forEach((btn) => (action[btn] = false));
  }

  // let inputsActive = actionKeys.filter(key => action[key] === true);
  // if (inputsActive.length) console.log(inputsActive, game.frames);
  if (cpu.enabled) {
    if (game.board[game.cursor.x][game.cursor.y].type === "swapping") return;
    if (Object.values(action).includes(true) && !action.byCPU) {
      cpu.control = 0;
      console.log("player action detected, cpu control off.");
    }
    try {
      if (!game.paused) {
        action = cpuAction(action);
        // console.log(game.frames, Object.values(action));
        action.byCPU = Object.values(action).includes(true);
      }
    } catch (error) {
      if (!debug.enabled)
        displayMessage(
          "AI Bot has encountered an error and needs to be disabled. Press F12 to access the developer console for more information. You can pause and restart the game to relaunch the AI."
        );
      console.log(`${error}`);
      console.log(`Line number: ${error.stack}`);
      console.log(cpu);
      console.log(game);
      console.log(`Disabling AI...`);
      cpu.enabled = 0;
      cpu.control = 0;
      game.messagePriority = "";
      debug.enabled = 1;
      pause(false, "aiCrash");
    }
  }

  if (debug.advanceOneFrame) {
    pause();
    debug.advanceOneFrame = false;
  }

  // first action checker, "else if" is required for priority, so case does not work.
  let cursorMoved = false;
  let cursorMoveSuccess = false;
  if (!game.paused || debug.enabled) {
    if (action.up && (holdTime.up === 0 || holdTime.up > 11)) {
      game.cursor.y -= 1;
      cursorMoved = true;
      action.up = false;
      // if (!game.playRecording) replay.digitalInputs.push([game.frames, "up"]);
    } else if (action.down && (holdTime.down === 0 || holdTime.down > 11)) {
      game.cursor.y += 1;
      cursorMoved = true;
      action.down = false;
      // if (!game.playRecording) replay.digitalInputs.push([game.frames, "up"]);
    } else if (action.left && (holdTime.left === 0 || holdTime.left > 11)) {
      // if (!game.playRecording) replay.digitalInputs.push([game.frames, "left"]);
      game.cursor.x -= 1;
      cursorMoved = true;
      action.left = false;
    } else if (action.right && (holdTime.right === 0 || holdTime.right > 11)) {
      game.cursor.x += 1;
      cursorMoved = true;
      action.right = false;
      // if (!game.playRecording)
      // replay.digitalInputs.push([game.frames, "right"]);
    } else if (action.swap && holdTime.swap === 0 && !game.over) {
      action.swap = false;
      game.swapPressed = true;
      if (
        game.mode === "tutorial" &&
        !game.board[game.cursor.x][game.cursor.y].tutorialSelectable &&
        !game.board[game.cursor.x + 1][game.cursor.y].tutorialSelectable &&
        !action.byCPU
      ) {
        console.log("cursor is not swappable here");
        game.swapPressed = false;
      }

      if (action.byCPU)
        cpu.showFakeCursorPosition = cpu.targetX === game.cursor.x;
    }

    if (cursorMoved) {
      game.cursor_type = "defaultCursor";
      touch.enabled = false;
      if (
        game.cursor.x >= grid.COLS ||
        (game.cursor.x === grid.COLS - 1 && game.cursor.orientation === "R")
      ) {
        game.cursor.x -= 1;
        cursorMoved = false;
      } //
      else if (
        game.cursor.y >= grid.ROWS ||
        (game.cursor.y === grid.ROWS - 1 && game.cursor.orientation === "D")
      ) {
        game.cursor.y -= 1;
        cursorMoved = false;
      } //
      else if (
        game.cursor.x < 0 ||
        (game.cursor.x === 0 && game.cursor.orientation === "L")
      ) {
        game.cursor.x += 1;
        cursorMoved = false;
      } //
      else if (
        game.cursor.y < 0 ||
        (game.cursor.y === 0 && game.rise !== 0) ||
        (game.cursor.y === 1 && game.cursor.orientation === "U")
      ) {
        game.cursor.y += 1;
        cursorMoved = false;
      } //

      if (
        cursorMoved &&
        !win.appleProduct &&
        (!cpu.enabled || game.tutorialRunning)
      ) {
        playAudio(audio.moveCursor);
      }
    }

    // second action checker
    if (action.raise) {
      action.raise = false;
      if (!game.playRecording)
        replay.digitalInputs.push([game.frames, "raise"]);
      if (!game.tutorialRunning) game.raisePressed = true;
      win.cvs.scrollIntoView({ block: "nearest" });
    }
    let successfulTurn = false; // used to determine if sfx should be played
    if (action.turn_clockwise || action.turn_cc) {
      action.turn_clockwise = action.turn_cc = false;
      game.cursor_type = "defaultCursor";
      if (
        game.cursor.orientation === "R" &&
        game.cursor.y < grid.ROWS - 1 &&
        !game.tutorialRunning
      ) {
        game.cursor.orientation = "D";
        successfulTurn = true;
      } //
      else if (
        game.cursor.orientation === "D" &&
        game.cursor.x < grid.COLS - 1
      ) {
        game.cursor.orientation = "R";
        successfulTurn = true;
      }
    }
    // if (action.turn_clockwise) {
    //   game.cursor_type = "defaultCursor";
    //   // turn clockwise, but will not face upwards
    //   action.turn_clockwise = false;
    //   action.turn_cc = false; // if both turns active, will only turn clockwise

    //   if (game.cursor.orientation === "R" && game.cursor.y < grid.ROWS - 1) {
    //     game.cursor.orientation = "D";
    //     successfulTurn = true;
    //   } //
    //   else if (game.cursor.orientation === "D" && game.cursor.x > 0) {
    //     game.cursor.orientation = "L";
    //     successfulTurn = true;
    //   } //
    //   else if (game.cursor.orientation === "L" && game.cursor.y > 1) {
    //     game.cursor.orientation = "U";
    //     successfulTurn = true;
    //   } //
    //   else if (
    //     game.cursor.orientation === "U" &&
    //     game.cursor.x < grid.COLS - 1
    //   ) {
    //     game.cursor.orientation = "R";
    //     successfulTurn = true;
    //   }
    // }
    // if (action.turn_cc) {
    //   game.cursor_type = "defaultCursor";
    //   // turn counter-clockwise
    //   action.turn_cc = false;
    //   if (game.cursor.orientation === "R" && game.cursor.y > 1) {
    //     game.cursor.orientation = "U";
    //     successfulTurn = true;
    //   } //
    //   else if (game.cursor.orientation === "U" && game.cursor.x > 0) {
    //     game.cursor.orientation = "L";
    //     successfulTurn = true;
    //   } //
    //   else if (
    //     game.cursor.orientation === "L" &&
    //     game.cursor.y < grid.ROWS - 1
    //   ) {
    //     game.cursor.orientation = "D";
    //     successfulTurn = true;
    //   } //
    //   else if (
    //     game.cursor.orientation === "D" &&
    //     game.cursor.x < grid.COLS - 1
    //   ) {
    //     game.cursor.orientation = "R";
    //     successfulTurn = true;
    //   }
    // }

    if (
      successfulTurn &&
      !win.appleProduct &&
      (!cpu.enabled || game.tutorialRunning)
    ) {
      playAudio(audio.moveCursor);
    }
  }

  // check pause
  if (action.pause) {
    action.pause = false;
    game.paused ? unpause() : pause();
  }

  action.up ? (holdTime.up += perf.gameSpeed) : (holdTime.up = 0);
  action.left ? (holdTime.left += perf.gameSpeed) : (holdTime.left = 0);
  action.down ? (holdTime.down += perf.gameSpeed) : (holdTime.down = 0);
  action.right ? (holdTime.right += perf.gameSpeed) : (holdTime.right = 0);
  action.swap ? (holdTime.swap += perf.gameSpeed) : (holdTime.swap = 0);
  action.raise ? (holdTime.raise += perf.gameSpeed) : (holdTime.raise = 0);
  action.pause ? (holdTime.pause += perf.gameSpeed) : (holdTime.pause = 0);
  action.turn_clockwise
    ? (holdTime.turn_clockwise += perf.gameSpeed)
    : (holdTime.turn_clockwise = 0);
  action.turn_cc
    ? (holdTime.turn_cc += perf.gameSpeed)
    : (holdTime.turn_cc = 0);

  actionKeys.forEach((key) => {
    if (action[key]) holdTime[key] += perf.gameSpeed;
    else holdTime[key] = 0;
    action[key] = false;
  });

  // NOT REMOVED
  // reset all keys
  // actionKeys.forEach((key) => (action[key] = false));
}

function gamepadInput() {
  if (win.gamepadPort !== false) {
    try {
      pollGamepadInputs(navigator.getGamepads()[win.gamepadPort]);
    } catch (error) {
      console.log("gamepad disconnected");
      console.log(error, error.stack);
      displayMessage(
        "Gamepad Error: Gamepad has either been disconnected or an exception has occurred. Press F12 and view the console for more information."
      );
      win.gamepadPort = false;
    }
  }

  // if (!game.paused) {
  //   // accept action if initially pressed or key is held over 200ms
  //   if (action.up && (holdTime.up === 0 || holdTime.up >= 12)) {
  //     action.up = true;
  //   } else if (action.left && (holdTime.left === 0 || holdTime.left >= 12)) {
  //     action.left = true;
  //   } else if (action.down && (holdTime.down === 0 || holdTime.down >= 12)) {
  //     action.down = true;
  //   } else if (action.right && (holdTime.right === 0 || holdTime.right >= 12)) {
  //     action.right = true;
  //   } else if (action.swap && holdTime.swap === 0) {
  //     action.swap = true;
  //   }
  //   // separate action
  //   if (action.raise && (holdTime.raise === 0 || holdTime.raise >= 12)) {
  //     action.raise = true;
  //   } else if (action.pause && holdTime.pause === 0) {
  //     action.pause = true;
  //   }
  // } else if (game.paused) {
  //   if (action.pause && holdTime.pause === 0) {
  //     action.pause = true;
  //   } else if (action.raise && holdTime.raise === 0) {
  //     playAudio(audio.select);
  //     win.running = false;
  //     win.restartGame = true;
  //   }
  //   //  else if (holdTime.pause >= 60) {
  //   //   playAudio(audio.select);
  //   //   win.running = false;
  //   //   render(state.Home);
  //   // }
  // }

  // for (let key of actionKeys) {
  //   if (action[key]) holdTime[key] += perf.gameSpeed;
  //   else holdTime[key] = 0;
  // }

  // // action.up ? (holdTime.up += perf.gameSpeed) : (holdTime.up = 0);
  // // action.left ? (holdTime.left += perf.gameSpeed) : (holdTime.left = 0);
  // // action.down ? (holdTime.down += perf.gameSpeed) : (holdTime.down = 0);
  // // action.right ? (holdTime.right += perf.gameSpeed) : (holdTime.right = 0);
  // // action.swap ? (holdTime.swap += perf.gameSpeed) : (holdTime.swap = 0);
  // // action.raise ? (holdTime.raise += perf.gameSpeed) : (holdTime.raise = 0);
  // // action.pause ? (holdTime.pause += perf.gameSpeed) : (holdTime.pause = 0);

  // // actionKeys.forEach((btn) => (action[btn] = false));
  // if (game.tutorialRunning && action.swap && holdTime.swap > 1) {
  //   action.swap = false;
  // }
  // return action;
}

function pollGamepadInputs(gamepad) {
  let buttonList = gamepad.buttons;
  let buttonsPressed = [];
  for (let i = 0; i < buttonList.length; i++) {
    if (buttonList[i].pressed) {
      buttonsPressed.push(i);
    }
  }

  if (buttonsPressed.length > 0) console.log(Object.values(buttonsPressed));

  // if (buttonsPressed.length) console.log(buttonsPressed, game.frames);
  for (let index = 0; index < buttonsPressed.length; index++) {
    let button = buttonsPressed[index];
    for (let key of actionKeys) {
      action[key] = savedControls.gamepad[key].includes(button);
      if (action[key]) holdTime[key] += perf.gameSpeed;
      else holdTime[key] = 0;
    }
    // if (savedControls.gamepad.up.includes(button)) {
    //   action.up = true;
    //   holdTime.up += perf.gameSpeed;
    // } else holdTime.up = 0;
    // action.raise = savedControls.gamepad.raise.includes(button);
    // action.up = savedControls.gamepad.up.includes(button);
    // action.down = savedControls.gamepad.down.includes(button);
    // action.left = savedControls.gamepad.left.includes(button);
    // action.right = savedControls.gamepad.right.includes(button);
    // action.swap = savedControls.gamepad.swap.includes(button);
    // action.pause = savedControls.gamepad.pause.includes(button);
  }

  let leftStickX = gamepad.axes[0];
  let leftStickY = gamepad.axes[1];
  let rightStickX = gamepad.axes[2];
  let rightStickY = gamepad.axes[3];

  if (leftStickY < -0.2 || rightStickY < -0.2) action.up = true;
  else if (leftStickY > 0.2 || rightStickY > 0.2) action.down = true;
  else if (leftStickX < -0.2 || rightStickX < -0.2) action.left = true;
  else if (leftStickX > 0.2 || rightStickX > 0.2) action.right = true;
}

function tutorialBreakInputs() {
  if (action.swap) {
    console.log(tutorial.state);
    if (
      tutorial.state == tutorial.board.length - 1 &&
      tutorial.msgIndex == tutorialMessages.length - 1
    ) {
      // game.tutorialRunning = false;
      document.getElementById("game-info-table").style.display = "inline";
      win.restartGame = true;
    }
    nextDialogue(tutorial.msgIndex);
    console.log("state is now", tutorial.state, action);
  } else if (action.raise && debug.enabled) {
    console.log("raise was pressed", action);
    loadTutorialState(tutorial.state + 1, 0, true);
    // tutorial.state = tutorial.board.length - 1;
    // game.tutorialRunning = false;
    // document.getElementById("game-info-table").style.display = "inline";
    // win.running = false;
    // win.restartGame = true;
  }
  actionKeys.forEach((btn) => (action[btn] = false));
}

export function preselectControls() {
  checkIfControlsExist();
  let kb = JSON.parse(localStorage.getItem("controls")).keyboard;
  console.log(
    kb,
    "list of elements:",
    document.getElementById("left").value,
    document.getElementById("up").value,
    document.getElementById("right").value,
    document.getElementById("down").value,
    document.getElementById("swap-1").value,
    document.getElementById("swap-2").value,
    document.getElementById("raise-1").value,
    document.getElementById("raise-2").value,
    document.getElementById("turn-cc-1").value,
    document.getElementById("turn-cc-2").value,
    document.getElementById("turn-clockwise-1").value,
    document.getElementById("turn-clockwise-2").value
  );
  console.log(kb);
  document.getElementById("left").value = String.fromCharCode(kb.left[0])
    .toUpperCase()
    .charCodeAt();
  document.getElementById("up").value = String.fromCharCode(kb.up[0])
    .toUpperCase()
    .charCodeAt();
  document.getElementById("right").value = String.fromCharCode(kb.right[0])
    .toUpperCase()
    .charCodeAt();
  document.getElementById("down").value = String.fromCharCode(kb.down[0])
    .toUpperCase()
    .charCodeAt();
  document.getElementById("swap-1").value = String.fromCharCode(kb.swap[0])
    .toUpperCase()
    .charCodeAt();
  document.getElementById("swap-2").value = String.fromCharCode(kb.swap[1])
    .toUpperCase()
    .charCodeAt();
  document.getElementById("raise-1").value = String.fromCharCode(kb.raise[0])
    .toUpperCase()
    .charCodeAt();
  document.getElementById("raise-2").value = String.fromCharCode(kb.raise[1])
    .toUpperCase()
    .charCodeAt();
  document.getElementById("turn-clockwise-1").value = String.fromCharCode(
    kb.turn_clockwise[0]
  )
    .toUpperCase()
    .charCodeAt();
  document.getElementById("turn-clockwise-2").value = String.fromCharCode(
    kb.turn_clockwise[1]
  )
    .toUpperCase()
    .charCodeAt();
  document.getElementById("turn-cc-1").value = String.fromCharCode(
    kb.turn_cc[0]
  )
    .toUpperCase()
    .charCodeAt();
  document.getElementById("turn-cc-2").value = String.fromCharCode(
    kb.turn_cc[1]
  )
    .toUpperCase()
    .charCodeAt();

  console.log(
    "list of elements:",
    document.getElementById("left").value,
    document.getElementById("up").value,
    document.getElementById("right").value,
    document.getElementById("down").value,
    document.getElementById("swap-1").value,
    document.getElementById("swap-2").value,
    document.getElementById("raise-1").value,
    document.getElementById("raise-2").value
  );
}

export function setUpASCIIOptions(selector) {
  const selectElement = document.querySelector(selector);
  console.log("Setting up controls options");
  let kb = JSON.parse(localStorage.getItem("controls")).keyboard;
  for (let charCode = 32; charCode <= 90; charCode++) {
    let key = String.fromCharCode(charCode).toUpperCase();
    if (charCode === 32) key = "Space";
    if (charCode === 37) key = "Left";
    if (charCode === 38) key = "Up";
    if (charCode === 39) key = "Right";
    if (charCode === 40) key = "Down";
    if (
      charCode === 32 ||
      (charCode >= 37 && charCode <= 40) ||
      (charCode >= 65 && charCode <= 122)
    ) {
      let option = document.createElement("option");
      option.value = charCode;
      option.innerHTML = key;
      if (charCode >= 97) {
        option.value = charCode;
        option.innerHTML = key;
      }
      if (charCode === 32) option.innerHTML = "Space";

      selectElement.appendChild(option);
    }
  }
}

export function saveControls() {
  savedControls.keyboard = setNewKeyboardControls();
  savedControls.gamepad = setNewGamepadControls(
    document.getElementById("gamepad-swap"),
    document.getElementById("gamepad-raise")
  );
  console.log("new saved controls:", savedControls);
  localStorage.setItem("controls", JSON.stringify(savedControls));
}
