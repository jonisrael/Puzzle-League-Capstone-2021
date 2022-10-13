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

export const action = {
  up: false,
  down: false,
  left: false,
  right: false,
  swap: false,
  raise: false,
  pause: false,
};

export const holdTime = JSON.parse(JSON.stringify(action));
export const pressed = JSON.parse(JSON.stringify(action));
export const heldFrames = JSON.parse(JSON.stringify(action));

// export const holdTime = {
//   up: 0,
//   down: 0,
//   left: 0,
//   right: 0,
//   swap: 0,
//   raise: 0,
//   pause: 0
// };

// export const pressed = JSON.stringify

// export const heldFrames = {
//   up: 0,
//   down: 0,
//   left: 0,
//   right: 0,
//   swap: 0
// };

export const defaultControls = {
  keyboard: {
    up: [38], // ArrowUp
    left: [37], //ArrowLeft
    down: [40], //ArrowDown
    right: [39], //ArrowRight
    swap: [83, 88], // s, x
    raise: [82, 90], // r, z
  },
  gamepad: {
    up: [12], // D-Pad Up
    left: [14], // D-Pad Left
    down: [13], // D-Pad Down
    right: [15], // D-Pad Right
    swap: [0, 1], // B, A
    raise: [5, 7], // L, R
    pause: [8, 9], //+, -
  },
  timeCreated: Date.now(),
};

export const savedControls =
  JSON.parse(localStorage.getItem("controls")) ||
  JSON.parse(JSON.stringify(defaultControls));

checkIfControlsExist(savedControls);

export function setNewKeyboardControls() {
  let kb = { swap: [], raise: [] }; // add other inputs later
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
  }
  console.log("KB Controls:", kb, document.querySelectorAll(".kb-controls"));
  return kb;
}

// export function setNewKeyboardControlsOld(formInput) {
//   // set defaults
//   const keyboard = {
//     up: [38], // ArrowUp
//     left: [37], //ArrowLeft
//     down: [40], //ArrowDown
//     right: [39], //ArrowRight
//     swap: [83, 88], // s, x
//     raise: [82, 90], // r, z
//   };
//   if (formInput.selectedIndex === 1) {
//     keyboard.swap = [83, 90]; // s, z
//     keyboard.raise = [82, 88]; // r, x
//   }
//   if (formInput.selectedIndex > 1) {
//     keyboard.up = [87]; // w
//     keyboard.left = [65]; // a
//     keyboard.down = [83]; // s
//     keyboard.right = [68]; // d
//     if (formInput.selectedIndex === 2) {
//       keyboard.swap = [75, 100]; // k, numpad4
//       keyboard.raise = [76, 101]; // l, numpad5
//     }
//     if (formInput.selectedIndex === 3) {
//       keyboard.swap = [76, 101]; // l, numpad5
//       keyboard.raise = [75, 100]; // k, numpad4
//     }
//   }

//   return keyboard;
// }

export function setNewGamepadControls(swapInputs, raiseInputs) {
  const gameController = {
    up: [12], // D-Pad Up
    left: [14], // D-Pad Left
    down: [13], // D-Pad Down
    right: [15], // D-Pad Right
    swap: [0, 1],
    raise: [5, 7],
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
    },
    gamepad: {
      up: [12], // D-Pad Up
      left: [14], // D-Pad Left
      down: [13], // D-Pad Down
      right: [15], // D-Pad Right
      swap: [0, 1], // B, A
      raise: [4, 5], // L, R
      pause: [8, 9], // +, -
    },
    timeCreated: Date.now(),
  };
  if (localStorage.getItem("controls")) {
    // patch to fix broken controls 11/9/2021
    try {
      if (
        !controlsObject.timeCreated ||
        controlsObject.timeCreated < 1656865863014 || // time before latest release (July 3)
        !controlsObject.keyboard ||
        !controlsObject.gamepad
      ) {
        localStorage.setItem("controls", JSON.stringify(defaultControls));
        console.log("Controls invalid, do 11/16/2021 patch to fix.");
        return defaultControls;
      } else {
        console.log("controls are valid:");
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

export function playerAction(input) {
  input.byCPU = false;
  if (game.tutorialRunning && (!game.humanCanPlay || debug.enabled)) {
    if (Object.values(action).includes(true)) {
      input = tutorialBreakInputs(input);
      Object.keys(action).forEach((btn) => (action[btn] = false));
    } else if (win.gamepadPort !== false) {
      // check gamepad inputs
      input = gamepadInput(input);
    }
    // Object.keys(action).forEach((btn) => (action[btn] = false));
    if (Object.values(input).includes(true) && !input.pause) {
      return input;
    }
  }

  if (win.gamepadPort !== false) {
    input = gamepadInput(input);
  }

  if (!game.humanCanPlay && !debug.enabled) {
    Object.keys(action).forEach((btn) => (action[btn] = false));
  }

  // let inputsActive = Object.keys(action).filter(key => action[key] === true);
  // if (inputsActive.length) console.log(inputsActive, game.frames);
  if (cpu.enabled) {
    if (game.board[game.cursor.x][game.cursor.y].type === "swapping") return;
    if (Object.values(input).includes(true) && !input.byCPU) {
      cpu.control = 0;
      console.log("player input detected, cpu control off.");
    }
    try {
      if (!game.paused) {
        input = cpuAction(input);
        // console.log(game.frames, Object.values(input));
        input.byCPU = Object.values(input).includes(true);
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

  // first input checker, "else if" is required for priority, so case does not work.
  let cursorMoved = false;
  if (!game.paused || debug.enabled) {
    if (input.up) {
      action.up = false;
      if (!game.playRecording) replay.digitalInputs.push([game.frames, "up"]);
      if (game.cursor.y > 1 || (game.cursor.y === 1 && game.rise === 0)) {
        game.cursor.y -= 1;
        cursorMoved = true;
      }
    } else if (input.down) {
      action.down = false;
      if (!game.playRecording) replay.digitalInputs.push([game.frames, "up"]);
      if (game.cursor.y < grid.ROWS - 1) {
        game.cursor.y += 1;
        cursorMoved = true;
      }
    } else if (input.left) {
      action.left = false;
      if (!game.playRecording) replay.digitalInputs.push([game.frames, "left"]);
      if (game.cursor.x > 0) {
        game.cursor.x -= 1;
        cursorMoved = true;
      }
    } else if (input.right) {
      action.right = false;
      if (!game.playRecording)
        replay.digitalInputs.push([game.frames, "right"]);
      if (game.cursor.x < grid.COLS - 2) {
        game.cursor.x += 1;
        cursorMoved = true;
      }
    } else if (input.swap && !game.over) {
      if (!game.playRecording) replay.digitalInputs.push([game.frames, "swap"]);
      action.swap = false;
      // game.cursor_type = input.byCPU ? "defaultCursor" : "defaultCursor";
      if (game.cursor.x === grid.COLS - 1) game.cursor.x -= 1;
      game.swapPressed = true;
      if (
        game.mode === "tutorial" &&
        !game.board[game.cursor.x][game.cursor.y].tutorialSelectable &&
        !game.board[game.cursor.x + 1][game.cursor.y].tutorialSelectable &&
        !input.byCPU
      ) {
        console.log("cursor is not swappable here");
        game.swapPressed = false;
      }

      if (input.byCPU)
        cpu.showFakeCursorPosition = cpu.targetX === game.cursor.x;
    }

    if (cursorMoved) {
      game.cursor_type = "defaultCursor";
      // if (!input.byCPU) {
      //   game.cursor_type = "defaultCursor";
      // }
      // game.cursor_type = input.byCPU ? "defaultCursor" : "defaultCursor";
      if (game.cursor.x === grid.COLS - 1) game.cursor.x -= 1;
      if (!win.appleProduct && (!cpu.enabled || game.tutorialRunning)) {
        playAudio(audio.moveCursor);
      }
    }

    // second input checker
    if (input.raise) {
      action.raise = false;
      if (!game.playRecording)
        replay.digitalInputs.push([game.frames, "raise"]);
      if (!game.tutorialRunning) game.raisePressed = true;
      win.cvs.scrollIntoView({ block: "nearest" });
    }
  }

  // check pause
  if (input.pause) {
    action.pause = false;
    game.paused ? unpause() : pause();
  }

  // Object.keys(action).forEach((btn) => (action[btn] = false));

  // NOT REMOVED
  // reset all keys
  // Object.keys(action).forEach(key => {
  //   action[key] = false;
  // });
}

function gamepadInput(input) {
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

  if (!game.paused) {
    // accept input if initially pressed or key is held over 200ms
    if (action.up && (holdTime.up === 0 || holdTime.up >= 12)) {
      input.up = true;
    } else if (action.left && (holdTime.left === 0 || holdTime.left >= 12)) {
      input.left = true;
    } else if (action.down && (holdTime.down === 0 || holdTime.down >= 12)) {
      input.down = true;
    } else if (action.right && (holdTime.right === 0 || holdTime.right >= 12)) {
      input.right = true;
    } else if (action.swap && holdTime.swap === 0) {
      input.swap = true;
    }
    // separate input
    if (action.raise && (holdTime.raise === 0 || holdTime.raise >= 12)) {
      input.raise = true;
    } else if (action.pause && holdTime.pause === 0) {
      input.pause = true;
    }
  } else if (game.paused) {
    if (action.pause && holdTime.pause === 0) {
      input.pause = true;
    } else if (action.raise && holdTime.raise === 0) {
      playAudio(audio.select);
      win.running = false;
      win.restartGame = true;
    }
    //  else if (holdTime.pause >= 60) {
    //   playAudio(audio.select);
    //   win.running = false;
    //   render(state.Home);
    // }
  }

  action.up ? (holdTime.up += perf.gameSpeed) : (holdTime.up = 0);
  action.left ? (holdTime.left += perf.gameSpeed) : (holdTime.left = 0);
  action.down ? (holdTime.down += perf.gameSpeed) : (holdTime.down = 0);
  action.right ? (holdTime.right += perf.gameSpeed) : (holdTime.right = 0);
  action.swap ? (holdTime.swap += perf.gameSpeed) : (holdTime.swap = 0);
  action.raise ? (holdTime.raise += perf.gameSpeed) : (holdTime.raise = 0);
  action.pause ? (holdTime.pause += perf.gameSpeed) : (holdTime.pause = 0);

  // Object.keys(action).forEach((btn) => (action[btn] = false));
  if (game.tutorialRunning && action.swap && holdTime.swap > 1) {
    input.swap = false;
  }
  return input;
}

function pollGamepadInputs(gamepad) {
  let buttonList = gamepad.buttons;
  let buttonsPressed = [];
  for (let i = 0; i < buttonList.length; i++) {
    if (buttonList[i].pressed) {
      buttonsPressed.push(i);
    }
  }

  // if (buttonsPressed.length) console.log(buttonsPressed, game.frames);
  for (let index = 0; index < buttonsPressed.length; index++) {
    let button = buttonsPressed[index];
    action.raise = savedControls.gamepad.raise.includes(button);
    action.up = savedControls.gamepad.up.includes(button);
    action.down = savedControls.gamepad.down.includes(button);
    action.left = savedControls.gamepad.left.includes(button);
    action.right = savedControls.gamepad.right.includes(button);
    action.swap = savedControls.gamepad.swap.includes(button);
    action.pause = savedControls.gamepad.pause.includes(button);
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

function tutorialBreakInputs(input) {
  if (input.swap) {
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
    console.log("state is now", tutorial.state, input);
  } else if (input.raise && debug.enabled) {
    console.log("raise was pressed", input);
    loadTutorialState(tutorial.state + 1, 0, true);
    // tutorial.state = tutorial.board.length - 1;
    // game.tutorialRunning = false;
    // document.getElementById("game-info-table").style.display = "inline";
    // win.running = false;
    // win.restartGame = true;
  }
  Object.keys(action).forEach((btn) => (action[btn] = false));
  return input;
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
    document.getElementById("raise-2").value
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

  console.log(`${kb.swap[0]}`);
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

  console.log(`${kb.swap[0] + 32}`, document.getElementById("swap-1").value);
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
