export function setNewControls(keyboardLayout, swapInputs, raiseInputs) {
  return {
    keyboard: getNewKeyboardControls(keyboardLayout),
    gamepad: getNewGamePadControls(swapInputs, raiseInputs)
  };
}

export function getNewKeyboardControls(formInput) {
  // set defaults
  const keyboard = {
    up: [38], // ArrowUp
    left: [37], // ArrowLeft;
    down: [40], //ArrowDown;
    right: [39], //ArrowRight;
    swap: [83, 88], // s, x
    raise: [82, 90] // r, z
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
    swap: [],
    raise: []
  };
  for (let i = 0; i < swapInputs.length; i++) {
    if (swapInputs[i].selected) gameController.swap.push(i);
    if (raiseInputs[i].selected) gameController.raise.push(i);
  }
  return gameController;
}

export function checkIfControlsExist(controls) {
  if (controls) {
    console.log("controls are already set.", localStorage.getItem("controls"));
  }
  // otherwise, set controls to default and return the object
  console.log("need new controls");
  const defaultControls = {
    keyboard: {
      up: [38], // ArrowUp
      left: [37], //ArrowLeft
      down: [40], //ArrowDown
      right: [39], //ArrowRight
      swap: [83, 88], // x,s
      raise: [82, 90] // z, r
    },
    gamepad: {
      up: [12], // D-Pad Up
      left: [14], // D-Pad Left
      down: [13], // D-Pad Down
      right: [15], // D-Pad Right
      swap: [0, 1], // B, A
      raise: [4, 5] // L, R
    },
    timeCreated: Date.now()
  };

  // patch to fix broken controls 11/9/2021
  let storedControls =
    JSON.parse(localStorage.getItem("controls")) || defaultControls;
  if (
    !storedControls.timeCreated ||
    storedControls.timeCreated < 1636442413745 // time before latest release
  ) {
    localStorage.removeItem("controls");
    console.log("11/9/2021 patch to fix broken controls implemented");
  }
  localStorage.setItem("controls", JSON.stringify(defaultControls));
  return defaultControls;
}
