import { audio } from "./fileImports";
import { win, game, cpu, debug, grid, perf } from "./global";
import { cpuAction } from "./computerPlayer/cpu";
import { pause, unpause } from "./functions/pauseFunctions";
import { playAudio } from "./functions/audioFunctions";
import { trySwappingBlocks } from "./functions/swapBlock";
import { displayMessage } from "..";
import { render } from "..";
import * as state from "../store";
import { nextDialogue, tutorial } from "./tutorial/tutorialScript";
import { tutorialMessages } from "./tutorial/tutorialMessages";

export const action = {
  up: 0,
  down: 0,
  left: 0,
  right: 0,
  swap: 0,
  raise: 0,
  pause: 0,
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

export function setNewControls(keyboardLayout, swapInputs, raiseInputs) {
  return {
    keyboard: getNewKeyboardControls(keyboardLayout),
    gamepad: getNewGamePadControls(swapInputs, raiseInputs),
  };
}

export function getNewKeyboardControls(formInput) {
  // set defaults
  const keyboard = {
    up: [38], // ArrowUp
    left: [37], //ArrowLeft
    down: [40], //ArrowDown
    right: [39], //ArrowRight
    swap: [83, 88], // s, x
    raise: [82, 90], // r, z
  };
  if (formInput.selectedIndex === 1) {
    keyboard.swap = [83, 90]; // s, z
    keyboard.raise = [82, 88]; // r, x
  }
  if (formInput.selectedIndex > 1) {
    keyboard.up = [87]; // w
    keyboard.left = [65]; // a
    keyboard.down = [83]; // s
    keyboard.right = [68]; // d
    if (formInput.selectedIndex === 2) {
      keyboard.swap = [75, 100]; // k, numpad4
      keyboard.raise = [76, 101]; // l, numpad5
    }
    if (formInput.selectedIndex === 3) {
      keyboard.swap = [76, 101]; // l, numpad5
      keyboard.raise = [75, 100]; // k, numpad4
    }
  }

  return keyboard;
}

export function getNewGamePadControls(swapInputs, raiseInputs) {
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
        controlsObject.timeCreated < 1637108341492 // time before latest release
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
      console.log("11/11/2021 patch to fix broken controls implemented");
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
  if (game.tutorialRunning) {
    if (Object.values(action).includes(true)) {
      input = tutorialBreakInputs(input);
      Object.keys(action).forEach((btn) => (action[btn] = false));
    } else if (win.gamepadPort !== false) {
      // check gamepad inputs
      input = playerInput(input);
    }
    // Object.keys(action).forEach((btn) => (action[btn] = false));
    if (Object.values(input).includes(true) && !input.pause) {
      return input;
    }
  }

  if (win.gamepadPort !== false) {
    input = playerInput(input);
  }

  if (!game.humanCanPlay && !debug.enabled) {
    Object.keys(action).forEach((btn) => (action[btn] = false));
  }

  // let inputsActive = Object.keys(action).filter(key => action[key] === true);
  // if (inputsActive.length) console.log(inputsActive, game.frames);
  if (cpu.enabled) {
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
  if (!game.tutorialRunning || (game.tutorialRunning && input.byCPU)) {
    if (input.up) {
      action.up = false;
      if (game.cursor.y > 1 || (game.cursor.y === 1 && game.rise === 0)) {
        game.cursor.y -= 1;
        cursorMoved = true;
      }
    } else if (input.down) {
      action.down = false;
      if (game.cursor.y < grid.ROWS - 1) {
        game.cursor.y += 1;
        cursorMoved = true;
      }
    } else if (input.left) {
      action.left = false;
      if (game.cursor.x > 0) {
        game.cursor.x -= 1;
        cursorMoved = true;
      }
    } else if (input.right) {
      action.right = false;
      if (game.cursor.x < grid.COLS - 2) {
        game.cursor.x += 1;
        cursorMoved = true;
      }
    } else if (input.swap && !game.over) {
      action.swap = false;

      game.cursor_type = input.byCPU ? "defaultCursor" : "defaultCursor";
      if (game.cursor.x === grid.COLS - 1) game.cursor.x -= 1;
      game.swapPressed = true;
      win.cvs.scrollIntoView({ block: "nearest" });
    }

    if (cursorMoved) {
      game.cursor_type = input.byCPU ? "defaultCursor" : "defaultCursor";
      if (game.cursor.x === grid.COLS - 1) game.cursor.x -= 1;
      win.cvs.scrollIntoView({ block: "nearest" });
      if (!win.appleProduct && (!cpu.enabled || game.tutorialRunning)) {
        playAudio(audio.moveCursor);
      }
    }

    // second input checker
    if (input.raise) {
      action.raise = false;
      game.raisePressed = true;
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

function playerInput(input) {
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
      game.tutorialRunning = false;
      document.getElementById("game-info-table").style.display = "inline";
      win.restartGame = true;
    }
    nextDialogue(tutorial.msgIndex);
    console.log("state is now", tutorial.state, input);
  } else if (input.raise) {
    console.log("raise was pressed", input);
    tutorial.state = tutorial.board.length - 1;
    game.tutorialRunning = false;
    document.getElementById("game-info-table").style.display = "inline";
    win.running = false;
    win.restartGame = true;
  }
  Object.keys(action).forEach((btn) => (action[btn] = false));
  return input;
}
