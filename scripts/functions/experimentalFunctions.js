import {
  announcer,
  blockColor,
  blockType,
  PIECES,
  INTERACTIVE_TYPES,
  win,
  grid,
  game,
  preset,
  api,
  cpu,
  perf,
  debug,
  randInt,
  leaderboard,
  loadedAudios,
  padInteger
} from "./../global";

import * as state from "../../store";
import { audio, sprite } from "../fileImports.js";
import { playAudio, playAnnouncer } from "./audioFunctions.js";
import {
  blockKeyOf,
  checkTime,
  drawGrid,
  endChain,
  makeNewRow,
  updateLevelEvents
} from "../../puzzleleague.js";
import { closeGame, gameOverBoard } from "./gameOverFunctions.js";
import { startGame } from "./startGame.js";
import { action, playerAction } from "../controls.js";
import { render } from "../../index.js";
import { pause } from "./pauseFunctions.js";
import html from "html-literal";

class Block2 {
  constructor(
    x,
    y,
    color,
    type,
    timer = 0,
    switchToFaceFrame = 0,
    switchToPoppedFrame = 0,
    airborne = false,
    touched = false,
    availableForPrimaryChain = false,
    availableForSecondaryChain = false
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type;
    this.timer = timer;
    this.switchToFaceFrame = switchToFaceFrame;
    this.switchToPoppedFrame = switchToPoppedFrame;
    this.airborne = airborne;
    this.touched = touched;
    this.availableForPrimaryChain = availableForPrimaryChain; // When disappear, chain ends
    this.availableForSecondaryChain = availableForSecondaryChain;
  }

  draw(urlKey) {
    let BLOCK_IMAGE = new Image();
    BLOCK_IMAGE.src = sprite[urlKey];
    BLOCK_IMAGE.onload = () => {
      win.ctx.drawImage(
        BLOCK_IMAGE,
        grid.SQ * this.x,
        grid.SQ * this.y - game.rise
      );
    };
  }
  debugDraw(urlKey) {
    return;
  }

  aiDraw(urlKey) {
    return;
  }
}

export function newBlock2(c, r) {
  let block = new Block2(c, r, blockColor.VACANT, blockType.NORMAL);
  return block;
}

export const currentBoardState = {
  matchLocations: [],
  primaryChainLocations: [],
  secondaryChainLocations: [],
  aBlockIsClearing: false,
  aBlockIsInLandingAnimation: false,
  aBlockIsAirborne: false,
  aBlockIsPanicking: false,
  primaryChainExists: false,
  secondaryChainExists: false,
  chainIsActive: false,
  highestRow: 12
};
export const resetFrame = JSON.parse(JSON.stringify(currentBoardState));

export const VacantSquare = {
  x: 0,
  y: 0,
  color: "vacant",
  type: "normal",
  timer: 0,
  switchToFaceFrame: 0,
  switchToPoppedFrame: 0,
  touched: false,
  airborne: false,
  availableForPrimaryChain: false,
  availableForSecondaryChain: false
};

export function resetBoardStateVars() {
  Object.keys(currentBoardState).forEach(
    key => (currentBoardState[key] = resetFrame[key])
  );
  return;
}

export function analyzeBoard() {
  assignClearTimers(currentBoardState.matchLocations);
  game.boardRiseDisabled =
    currentBoardState.aBlockIsAirborne ||
    currentBoardState.aBlockIsClearing ||
    currentBoardState.aBlockIsInLandingAnimation;
  if (!currentBoardState.primaryChainLocations.length) {
    // time to end chain. First see if there are secondary chains
    endChain(currentBoardState.secondaryChainExists); // old function
  }
  game.panicking = game.highestRow <= game.panicIndex;

  // If game is in panic state and less than a second of raise delay, adjust blocks
  if (game.panicking && game.raiseDelay < 60) {
    for (let c = 0; c < grid.COLS - 1; c++) {
      for (let r = 0; r <= game.panicIndex; r++) {
        // check if blocks on this column needs to panic
        if (
          game.board[c][r].color !== blockColor.VACANT &&
          INTERACTIVE_TYPES.includes(game.board[c][r])
        ) {
          // make all blocks directly below panic
          for (let j = r; j < grid.ROWS - 1; j++) {
            // if next square is vacant or non-interactive, the rest of blocks do not panic.
            if (game.board[c][j].color === blockColor.VACANT) break;
            if (!INTERACTIVE_TYPES.includes(game.board[c][j].type)) break;

            if (game.board[c][j].type === blockType.NORMAL)
              game.board[c][j].type = blockType.PANICKING;
          }
        }
      }
    }
  } else {
    // correct board so no blocks are in panic animation
    if (currentBoardState.aBlockIsPanicking) {
      for (let c = 0; c < grid.COLS - 1; c++) {
        for (let r = 0; r <= game.panicIndex; r++) {
          if (game.board[c][r].type === blockType.PANICKING)
            game.board[c][r].type = blockType.NORMAL;
        }
      }
    }
  }

  // check for game over
  if (game.highestRow === 0 && game.rise > 0 && !game.boardRiseDisabled) {
    // theoretical game over
    playAudio(audio.topout);
    console.log(game.log);
    if (!debug.enabled && game.mode !== "training") {
      // if not in debug or training, game is actually over.
      game.over = true;
      game.Music.volume = 0;
      game.finalTime = (game.frames / 60).toFixed(1);
      game.frames = 0;
      gameOverBoard();
      drawGrid();
    } else {
      // do not kill player in debug or training
      game.score = 0;
      game.cursor.y += 8;
      if (game.cursor.y >= grid.ROWS) game.cursor.y = 8;
      for (let x = 0; x < grid.COLS; x++) {
        for (let y = grid.ROWS - 1; y > 3; y--) {
          game.board[x][y].color = blockColor.VACANT;
          game.board[x][y].type = blockType.NORMAL;
        }
      }
    }
  }
}

export function updateBoardState(c, r) {
  let Square = game.board[c][r];
  if (Square.airborne) currentBoardState.aBlockIsAirborne = true;
  if (Square.type === blockType.PANICKING)
    currentBoardState.aBlockIsPanicking = true;
  if (Square.type === blockType.LANDING)
    currentBoardState.aBlockIsInLandingAnimation = true;
  if (!INTERACTIVE_TYPES.includes(Square.type))
    currentBoardState.aBlockIsClearing = true;
  if (Square.availableForPrimaryChain)
    currentBoardState.primaryChainExists = true;
  if (Square.availableForSecondaryChain)
    currentBoardState.secondaryChainExists = true;

  // if on new row and non-vacant block is found, it is now the highest row.
  if (r < game.highestRow && Square.color !== blockColor.VACANT) {
    game.highestRow = r;
    game.highestColIndex = c;
  }

  // if

  drawSquare(Square);
}

export function drawSquare(Square) {
  let animationIndex = -1;
  // if (Square.type === blockType.PANICKING) {
  //   let panicSpeedDivisor = 18;
  //   let animationModSelected = game.frames % panicSpeedDivisor;
  //   let sectionSize = panicSpeedDivisor / 6;
  // }
  switch (Square.type) {
    case blockType.BLINKING:
      // select which part of the animation should be used (based off global timer)
      if ((game.frames % 4 >= 0 && game.frames % 4 < 2) || debug.freeze == 1) {
        animationIndex = 0;
      } else {
        animationIndex = 1;
      }
      break;
    case blockType.LANDING:
      // select which part of the animation should be used (based off self-timer)
      if (Square.timer > 5 || Square.timer < 0) animationIndex = 0;
      else if (Square.timer > 2) animationIndex = 1;
      else animationIndex = 2;
      break;
    case blockType.PANICKING:
      if (game.highestRow === 0) animationIndex = 0;
      // simulate block being crushed
      else if (game.frames % 18 >= 0 && game.frames % 18 < 3)
        animationIndex = 0;
      else if (
        (game.frames % 18 >= 3 && game.frames % 18 < 6) ||
        (game.frames % 18 >= 15 && game.frames % 18 < 18)
      )
        animationIndex = 1;
      else if (
        (game.frames % 18 >= 6 && game.frames % 18 < 9) ||
        (game.frames % 18 >= 12 && game.frames % 18 < 15)
      ) {
        animationIndex = 2;
      } else {
        animationIndex = 3;
      }
      break;
  }
  let urlKey = blockKeyOf(Square.color, Square.type, animationIndex);
  console.log(urlKey);
  Square.draw(urlKey);
  // if (debug.show) drawDebugInfo(c,r)
}

export function drawDebugInfo(c, r) {
  return;
}

export function gravity(gameSpeed, c, r) {
  // Do not do function if any of these conditions apply
  if (r === grid.ROWS - 1) return; // on bottom row
  if (game.board[c][r].color === blockColor.VACANT) return; // block is vacant
  if (!INTERACTIVE_TYPES.includes(game.board[c][r].type)) return; // block non-interactive

  let Square = game.board[c][r];
  let SquareBelow = game.board[c][r + 1];
  let vacant = blockColor.VACANT; // is the string "vacant"

  // First, determine if a block is airborne and not in stall mode
  if (Square.airborne && Square.timer === 0 && SquareBelow.color === vacant) {
    // make it fall one unit
    transferProperties([c + 1, r], "to", [c, r]);
    transferProperties([c, r], "makeVacant", []);
    // now determine if block just landed
    if (r + 2 > grid.ROWS || game.board[c][r + 2].color !== vacant) {
      // modify the below square and making it a landing animation
      SquareBelow.type === blockType.LANDING;
      SquareBelow.timer = 10;
      if (debug.slowdown) SquareBelow.timer = 120; // for debug
      // ADD gameSpeed 2 clause
    }
  }

  // Determine if block needs to be called airborne.
  // It must not already be airborne and there must not be a clearing block directly below it.
  if (!Square.airborne && INTERACTIVE_TYPES.includes(SquareBelow.type)) {
    for (let j = r + 1; j < grid.ROWS; j++) {
      if (game.board[c][j].color === vacant) {
        // reverse the other way
        for (let k = j - 1; k >= 0; k--) {
          // make all consecutive blocks have stall time
          if (game.board[c][k].color === blockColor.VACANT) break;
          if (!INTERACTIVE_TYPES.includes(game.board[c][k].type)) break;
          if (game.board[c][k].timer !== 0) break; // if block is already hanging
          game.board[c][k].airborne = true;
          game.board[c][k].type = blockType.NORMAL;
          game.board[c][k].timer = game.blockStallTime;
        }
        break;
      }
    }
  }
  // debug to add stall time
  if (debug.freeze == 1) {
    game.board[c][r + 1].timer += 1;
  } else if (debug.slowdown == 1) {
    game.board[c][r + 1].timer = 120;
  }
}

export function transferProperties([colTo, rowTo], type, [colFrom, rowFrom]) {
  const toSquare = Object.keys(game.board[colTo][rowTo]);
  const fromSquare = Object.keys(game.board[colFrom][rowFrom]);

  if (type === "makeVacant") {
    toSquare.forEach(prop => (toSquare[prop] = VacantSquare[prop]));
  }

  if (type === "to") {
    toSquare.forEach(prop => (toSquare[prop] = fromSquare[prop]));
  }

  if (type === "between") {
    let tempSquare = Object.keys(JSON.parse(JSON.stringify(toSquare)));
    toSquare.forEach(prop => (toSquare[prop] = fromSquare[prop]));
    fromSquare.forEach(prop => (fromSquare[prop] = tempSquare[prop]));
    game.board[colFrom][colTo].x = colTo; // fix x coord
    game.board[colFrom][colTo].y = rowTo; // fix y coord
  }

  // fix change in coordinates
  game.board[colTo][rowTo].x = colTo; // fix x coord
  game.board[colTo][rowTo].y = rowTo; // fix y coord
}

export function advanceBlockTimer(c, r, frameAdvance = false) {
  const Square = game.board[c][r];
  if (0 === 0 || !frameAdvance) {
    if (game.board[c][r].timer > 0) game.board[c][r].timer -= perf.gameSpeed;
    if (game.board[c][r].timer === -1) game.board[c][r].timer = 0;
  }

  // If a block is in landing animation but also airborne, cancel animation.
  if (Square.type === blockType.LANDING && Square.airborne) {
    Square.type = blockType.NORMAL;
    Square.timer = 0;
  }

  // after being in landing animation for a bit, remove ability to be chainable.
  if (Square.type === "landing" && Square.timer > 8 && Square.timer < 11) {
    Square.availableForPrimaryChain = false;
    Square.availableForSecondaryChain = false;
  }

  if (Square.availableForPrimaryChain || Square.availableForSecondaryChain) {
    if (Square.color === "vacant") {
      Square.availableForPrimaryChain = false;
      Square.availableForSecondaryChain = false;
    }
  }

  if (!INTERACTIVE_TYPES.includes(Square.type) && !debug.freeze) {
    if (Square.timer === Square.switchToPoppedFrame + 2)
      playAudio(audio.blockClear);
    else if (Square.timer === 0) {
      // block is now turning vacant
      Square.color = blockColor.VACANT;
      Square.type = blockType.NORMAL;
      // make all blocks above it chainable
      for (let j = r - 1; j >= 0; j--) {
        if (INTERACTIVE_TYPES.includes(game.board[c][r].type)) {
          if (game.board[c][r].availableForPrimaryChain) {
            game.board[c][j].availableForPrimaryChain = true;
          } else if (game.board[c][r].availableForSecondaryChain)
            game.board[c][j].availableForSecondaryChain = true;
        } else {
          // break; // used to break loop if not interactive?
        }
      }
    }
  }

  return;
}

export function checkMatches(c, r) {
  // Do cases where the function will end immediately
  // does not apply if block is vacant, clearing, airborne, or in stall-then-fall.
  if (game.board[c][r].color === blockColor.VACANT) return;
  if (game.board[c][r].airborne) return;
  if (!blockIsInteractive(c, r)) return;

  // begin function
  let horizontalMatches = findHorizontalMatches(c, r);
  let verticalMatches = findVerticalMatches(c, r);
  if (horizontalMatches.length && verticalMatches.length) {
    horizontalMatches.shift(); // remove duplicate [c,r]
  }
  currentBoardState.matchLocations.concat(
    horizontalMatches.concat(verticalMatches)
  );
}

export function findHorizontalMatches(c, r) {
  let Square = game.board[c][r];
  let horizontalMatchLocations = [[c, r]];
  for (let x = c + 1; x < grid.COLS - 1; x++) {
    if (game.board[x][r].color !== Square.color) break;
    if (!blockIsInteractive(x, r)) break;
    game.board[x][r].type === blockType.BLINKING;
    horizontalMatchLocations.push([x, r]);
  }
  for (let x = c - 1; x >= 0; x--) {
    if (game.board[x][r].color !== Square.color) break;
    if (!blockIsInteractive(x, r)) break;
    horizontalMatchLocations.push([x, r]);
  }
  // require at least 3
  if (horizontalMatchLocations.length < 3) horizontalMatchLocations.length = 0;
  else {
    horizontalMatchLocations.forEach(
      coord => game.board[coord[0]][coord[1]].type === blockType.BLINKING
    );
  }
  return horizontalMatchLocations;
}

export function findVerticalMatches(c, r) {
  let Square = game.board[c][r];
  let verticalMatchLocations = [[c, r]];
  for (let y = r + 1; y < grid.ROWS - 1; y++) {
    if (game.board[c][y].color !== Square.color) break;
    if (!blockIsInteractive(c, y)) break;
    verticalMatchLocations.push([c, y]);
  }
  for (let y = r - 1; y >= 0; y--) {
    if (game.board[c][y].color !== Square.color) break;
    if (!blockIsInteractive(c, y)) break;
    verticalMatchLocations.push([c, y]);
  }
  // require at least 3
  if (verticalMatchLocations.length < 3) verticalMatchLocations.length = 0;
  return verticalMatchLocations;
}

export function blockIsInteractive(c, r) {
  const Square = game.board[c][r];
  if (!INTERACTIVE_TYPES.includes(Square.type)) return false;
  if (Square.timer !== 0 && Square.type !== blockColor.LANDING) return false;
  return true;
}

export function blockPhysics(c, r) {
  return;
}

export function assignClearTimers(matchLocations, blinkTime, initialFaceTime) {
  // console.log("old", `${matchLocations}`);
  matchLocations.sort(function(a, b) {
    return a[0] - b[0];
  });
  // console.log("new", `${matchLocations}`);
  const totalPopTime = game.blockPopMultiplier * (matchLocations.length - 1);
  for (let i = 0; i < matchLocations.length; i++) {
    let extraFaceTime = game.blockPopMultiplier * i;
    let c = matchLocations[i][0];
    let r = matchLocations[i][1];

    game.board[c][r].type = blockType.BLINKING;
    game.board[c][r].timer = blinkTime + initialFaceTime + totalPopTime;
    game.board[c][r].switchToFaceFrame = initialFaceTime + totalPopTime;
    game.board[c][r].switchToPoppedFrame = totalPopTime - extraFaceTime;
    if (game.addToPrimaryChain) {
      game.board[c][r].availableForPrimaryChain = true;
      game.board[c][r].availableForSecondaryChain = false;
    } else {
      game.board[c][r].availableForPrimaryChain = false;
      game.board[c][r].availableForSecondaryChain = true;
    }
  }
}

export function swapBlocks(c, r) {
  if (game.disableSwap || game.frames < 0) return;

  const SquareLeft = game.board[c][r];
  const SquareRight = game.board[c + 1][r];

  let swapSuccess = true;
  if (SquareLeft.color === "vacant" && SquareRight.color === "vacant")
    swapSuccess = false;
  else if (SquareLeft.airborne && SquareRight.airborne) swapSuccess = false;
  else if (!blockIsInteractive(c, r)) swapSuccess = false;
  else if (!blockIsInteractive(c + 1, r)) swapSuccess = false;
  else if (r > 0) {
    // Cannot Swap if a block is stalling above a vacant block
    if (
      game.board[c][r - 1].timer !== 0 &&
      SquareLeft.color === blockColor.VACANT
    )
      swapSuccess = false;
    else if (
      game.board[c + 1][r - 1].timer !== 0 &&
      SquareRight.color === blockColor.VACANT
    )
      swapSuccess = false;
  }
  if (!swapSuccess) {
    playAudio(audio.selectionFailed);
    return false;
  }
  playAudio(audio.select);
  transferProperties([c, r], "between", [c + 1, r]);
  consequencesOfSwapping(c, r);
}

export function consequencesOfSwapping(c, r) {
  // if landing, shorten timer to end the landing animation next frame
  let SquareLeft = game.board[c][r];
  let SquareRight = game.board[c][r + 1];
  SquareLeft.type = blockType.NORMAL;
  SquareLeft.timer = 0;
  SquareLeft.availableForPrimaryChain = false;
  SquareLeft.availableForSecondaryChain = false;
  SquareRight.type = blockType.NORMAL;
  SquareRight.timer = 0;
  SquareRight.availableForPrimaryChain = false;
  SquareRight.availableForSecondaryChain = false;

  // check if there are vacant blocks below the left or right block
  if (r < 11) {
    let SquareBelowLeft = game.board[c][r + 1];
    let SquareBelowRight = game.board[c + 1][r + 1];

    if (SquareLeft.color !== "vacant" && SquareBelowLeft.color === "vacant") {
      SquareLeft.timer = game.blockStallTime;
      SquareLeft.touched = true;
      SquareLeft.availableForPrimaryChain = false;
      SquareLeft.availableForSecondaryChain = false;
    }
    if (SquareRight.color !== "vacant" && SquareBelowRight.color === "vacant") {
      SquareRight.timer = game.blockStallTime;
      SquareRight.touched = true;
      SquareRight.availableForPrimaryChain = false;
      SquareRight.availableForSecondaryChain = false;
    }
  }

  // check if there are vacant blocks above a vacant left or right block
  if (r > 0) {
    if (SquareLeft.color === blockColor.VACANT) {
      for (let j = r - 1; j >= 0; j--) {
        if (game.board[c][j].color === blockColor.VACANT) break;
        if (!blockIsInteractive(c, j)) break;
        game.board[c][j].type = blockType.NORMAL;
        game.board[c][j].timer = game.blockStallTime;
        game.board[c][j].touched = true;
        game.board[c][j].availableForPrimaryChain = false;
        game.board[c][j].availableForSecondaryChain = false;
      }
    }
    if (SquareRight.color === blockColor.VACANT) {
      for (let j = r - 1; j >= 0; j--) {
        if (game.board[c + 1][j].color === blockColor.VACANT) break;
        if (!blockIsInteractive(c + 1, j)) break;
        game.board[c + 1][j].type = blockType.NORMAL;
        game.board[c + 1][j].timer = game.blockStallTime;
        game.board[c + 1][j].touched = true;
        game.board[c + 1][j].availableForPrimaryChain = false;
        game.board[c + 1][j].availableForSecondaryChain = false;
      }
    }
  }
}

export function increaseStackHeight() {
  if (game.frames < 0) return;
  if (debug.freeze) return;
  if (game.boardRiseDisabled) return;
  // Do not increase Stack Height
  if (game.boardRiseDisabled) return;
  if (game.frames % game.boardRiseSpeed !== 0) return;
  // Check if there is a raise delay before increasing height
  if (game.frames >= 28) game.readyForNewRow = true;

  if (game.raiseDelay === 0) {
    game.rise = (game.rise + 2) % 32;
    //if game run at 30fps, need to adjust for boardRiseSpeed 1
    if (game.rise !== 0 && perf.gameSpeed === 2) {
      if (game.currentlyQuickRaising || game.boardRiseSpeed === 1) {
        game.rise = (game.rise + 2) % 32;
      }
    }
  } else {
    game.raiseDelay -= game.boardRiseSpeed * perf.gameSpeed; // makes sense
    if (game.raiseDelay < 0) game.raiseDelay = 0;
  }

  // Now evaluate consequences
  if (game.rise === 0 && game.readyForNewRow) {
    game.readyForNewRow = false;
    makeNewRow();
  }
}

//
// MAIN LOOP
//
