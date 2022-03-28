import { cpuAction } from "../computerPlayer/cpu";
import { findVerticalMatches } from "../computerPlayer/findVerticalMatches";
import { audio } from "../fileImports";
import {
  blockIsSolid,
  blockVacOrClearing,
  CLEARING_TYPES,
  debug,
  game,
  grid,
  helpPlayer,
  INTERACTIVE_TYPES,
  perf,
  preset,
  removeFromOrderList,
  touch,
  win,
} from "../global";
import { playAudio } from "./audioFunctions";
import { isBlockAirborne } from "./gravity";
import { trySwappingBlocks } from "./swapBlock";

export function updateGrid(frameAdvance = false) {
  game.panicking = game.highestRow <= game.panicIndex;
  game.boardIsClearing = false;
  game.boardHasTargets = false;
  game.boardHasAirborneBlock = false;
  game.boardHasSwappingBlock = false;
  // touch.moveOrderExists = false;
  let highestRowFound = false;
  // game.pauseStack = false;
  game.highestCols = [];
  if (game.drawScoreTimeout > 0) game.drawScoreTimeout--;
  if (touch.doubleClickTimer > 0) {
    touch.doubleClickTimer -= 1;
    if (touch.doubleClickTimer === 0) touch.doubleClickCounter = 0;
  }
  if (!game.tutorialRunning && !game.currentChain) game.boardRiseRestarter++; // Failsafe to restart stack rise
  for (let y = 0; y < grid.ROWS + 2; y++) {
    for (let x = 0; x < grid.COLS; x++) {
      let Square = game.board[x][y];
      Square.airborne = isBlockAirborne(Square);
      if (Square.airborne) {
        game.boardHasAirborneBlock = true;
        // game.currentlyQuickRaising = false;
        game.boardRiseSpeed = preset.speedValues[game.level];
      }
      if (Square.targetX !== undefined) {
        if (Square.targetX === Square.x) {
          removeFromOrderList(Square);
        } else {
          game.boardHasTargets = true;
        }
      }
      if (Square.type === "swapping") game.boardHasSwappingBlock = true;
      if (!Square.airborne && Square.type !== "landing") {
        game.availForPrimaryChain = false;
        game.availForSecondaryChain = false;
        Square.touched = false;
      }
      if (Square.color === "vacant") {
        Square.availForPrimaryChain = false;
        Square.availForSecondaryChain = false;
        Square.touched = false;
        Square.targetX = undefined;
        Square.timer = 0;
        Square.lightTimer = 0;
      }
      if (!highestRowFound && Square.color !== "vacant") {
        game.highestRow = y;
        highestRowFound = true;
      }
      if (highestRowFound && Square.color !== "vacant") {
        if (game.highestRow === y) game.highestCols.push(x);
      }
      // Check to see if a block is still legally in a landing animation
      if (Square.type === "landing") {
        // game.pauseStack = true;
        if (Square.timer < 8) {
          Square.addToPrimaryChain = false;
          Square.addToSecondaryChain = false;
          Square.touched = false;
        }
        for (let j = grid.ROWS - 1; j > y; j--) {
          if (game.board[x][j].color === "vacant") {
            Square.type = "normal";
            Square.addToPrimaryChain = false;
            Square.addToSecondaryChain = false;
            Square.touched = false;
            Square.airborne = true;
            Square.timer = 0;
            break;
            /* A "vacant" block below a "landed" block was detected,
                           so the animation will be cancelled. */
          }
        }
      }

      if (Square.availForPrimaryChain || Square.availForSecondaryChain) {
        if (
          Square.color == "vacant" ||
          (Square.type == "landing" && Square.timer < 9)
        ) {
          Square.availForPrimaryChain = false;
          Square.availForSecondaryChain = false;
        }
      }
      if (Square.timer === -1) {
        Square.timer = 0;
      } else if (Square.timer > 0) {
        Square.timer -= 1;
        if (Square.type !== "swapping") {
          Square.swapDirection = 0;
          // game.selfRaiseDisabled = true;
        }
      }

      if (Square.lightTimer > 0) Square.lightTimer -= 1;
      if (Square.scoreDisplayTimer > 0) Square.scoreDisplayTimer--;

      if (Square.type === "stalling" && Square.timer === 0) {
        Square.type = "normal";
      }

      if (Square.type === "swapping" && Square.timer === 0) {
        Square.type = "normal";
        Square.swapDirection = 0;
        if (Square.airborne) {
          Square.type = "stalling";
          if (Square.targetX !== undefined) {
            removeFromOrderList(game.board[Square.targetX][Square.y]);
          }
          Square.timer = game.blockStallTime;
          Square.touched = true;
          Square.availForPrimaryChain = false;
          Square.availForSecondaryChain = false;
        }
        if (Square.color === "vacant") {
          for (let j = Square.y - 1; j >= 0; j--) {
            let nextAboveSquare = game.board[Square.x][j];
            nextAboveSquare.touched = true;
            nextAboveSquare.availForPrimaryChain = false;
            nextAboveSquare.availForSecondaryChain = false;
            if (!INTERACTIVE_TYPES.includes(nextAboveSquare.type)) break;
          }
        }
      } else if (
        !debug.freeze &&
        (Square.type === "blinking" ||
          Square.type === "face" ||
          Square.type === "popped")
      ) {
        Square.targetX = Square.previewX = undefined;
        Square.lightTimer = 0;
        // game.pauseStack = true;
        // game.selfRaiseDisabled = true;
        // console.log(x, y, Square);
        switch (Square.timer) {
          case Square.switchToPoppedFrame + 2:
            if (!win.appleProduct) playAudio(audio.blockClear);
            game.score += Math.round(game.scoreMultiplier * 10);
            game.chainScoreAdded += Math.round(game.scoreMultiplier * 10);
            break;
          case 0:
            // make square vacant
            Square.color = "vacant";
            Square.type = "normal";
            for (let i = 0; i < game.clearingSets.coord.length; i++) {
              let setLeader = game.clearingSets.coord[i];
              if (setLeader === JSON.stringify([Square.x, Square.y])) {
                game.clearingSets.coord.splice(i, 1);
                game.clearingSets.scores.splice(i, 1);
              }
            }
            if (
              y > 0 &&
              game.board[x][y - 1].color != "vacant" &&
              INTERACTIVE_TYPES.includes(game.board[x][y - 1].type)
            ) {
              // Give interactive pieces a slight delay timer
              // console.log("do delay timer");
              for (let j = y - 1; j >= 0; j--) {
                if (!blockVacOrClearing(game.board[x][j])) {
                  game.board[x][j].timer = game.blockStallTime + 4;
                  game.board[x][j].type = "stalling";
                } else break;
              }
            }
            // game.selfRaiseDisabled = false;
            for (let j = y - 1; j >= 0; j--) {
              // create chain available blocks above current
              // If clearing piece detected, break loop since no more chainable blocks.
              // if (game.board[x][j].type === "stalling") OLD CODE
              if (blockIsSolid(game.board[x][j])) {
                if (Square.availForPrimaryChain) {
                  game.board[x][j].availForPrimaryChain = true;
                  game.board[x][j].touched = false;
                } else if (Square.availForSecondaryChain) {
                  game.board[x][j].availForSecondaryChain = true;
                  game.board[x][j].touched = false;
                }
              } else break; // stop iterating since this clearing block shields the other blocks
            }
            break;
          case Square.switchToFaceFrame:
            Square.type = "face";
            break;
          case Square.switchToPoppedFrame:
            Square.type = "popped";
            break;
        }
        if (CLEARING_TYPES.includes(Square.type)) game.boardIsClearing = true;
      }

      if (game.panicking && game.highestCols.includes(x)) {
        if (Square.type === "normal") Square.type = "panicking";
      } else {
        if (Square.type === "panicking") Square.type = "normal";
      }
    } // end x
  } // end y
  touch.disableAllMoveOrders = false;
  game.pauseStack = checkIfStackShouldPause();
}

function checkIfStackShouldPause() {
  let reasonsToPause = "";
  if (game.boardHasAirborneBlock) reasonsToPause += "airborne, ";
  if (game.boardIsClearing) reasonsToPause += "clearing, ";
  // if (game.raiseDelay) reasonsToPause += `raise delay at ${game.raiseDelay}, `;
  if (debug.enabled && reasonsToPause) console.log(game.frames, reasonsToPause);
  if (debug.enabled && game.raiseDelay > 0 && !reasonsToPause)
    console.log(game.frames, "raise delay at", game.raiseDelay);
  return !!reasonsToPause;
}
