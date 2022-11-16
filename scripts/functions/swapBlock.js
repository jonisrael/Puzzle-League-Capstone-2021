import {
  INTERACTIVE_TYPES,
  game,
  grid,
  debug,
  blockColor,
  blockType,
  win,
  cpu,
  hold_it,
  randInt,
  CLEARING_TYPES,
  blockIsSolid,
  transferProperties,
  saveSttransferPropate,
  saveState,
  removeFromOrderList,
  preset,
  funcTimestamps,
} from "../global";
import { playAudio } from "./audioFunctions";
import { audio } from "../fileImports";
import { TouchOrders, match, pair, stickyCheck } from "./stickyFunctions";
import { pause } from "./pauseFunctions";
import { isBlockAirborne } from "./gravity";
import { updateTrainingButtons } from "./trainingControls";
import { touch } from "../clickControls";

export function trySwappingBlocks(x, y, rightSwap = true, swapType = "h") {
  funcTimestamps.swapBlock.begin = Date.now();
  if (
    game.disableSwap ||
    game.frames < 0 ||
    game.over ||
    (swapType === "h" && x + 2 > grid.COLS) ||
    (swapType === "v" && y + 2 > grid.ROWS)
  ) {
    // if (game.frames >= 0) {
    //   removeFromOrderList(game.board[x][y]);
    //   if (x + 1 < grid.COLS) removeFromOrderList(game.board[x + 1][y]);
    // }
    return;
  }

  const FirstBlock = game.board[x][y];
  const SecondBlock =
    swapType === "h" ? game.board[x + 1][y] : game.board[x][y + 1];
  let legalSwap = true;
  let legalSwapFailReason = "";

  if (swapType === "h") {
    const LeftBlock = FirstBlock;
    const RightBlock = SecondBlock;

    LeftBlock.swapDirectionY = RightBlock.swapDirectionY = 0;
    // Make sure both blocks aren't blockColor.VACANT
    if (
      LeftBlock.color == blockColor.VACANT &&
      RightBlock.color == blockColor.VACANT
    ) {
      legalSwapFailReason = "both blocks vacant";
      // game.message = "Swap Failed: Both Squares Empty";
      // game.messageChangeDelay = 60;
    }

    // Check if blocks are clearing
    if (
      !INTERACTIVE_TYPES.includes(LeftBlock.type) ||
      !INTERACTIVE_TYPES.includes(RightBlock.type)
    ) {
      legalSwapFailReason = "non-interactive block";
      // game.message = "Swap Failed: Clearing Block";
      // game.messageChangeDelay = 60;
    }

    // do not swap if a block has a fall timer
    // if (
    //   (LeftBlock.timer !== 0 && INTERACTIVE_TYPES.includes(LeftBlock.type)) ||
    //   (RightBlock.timer !== 0 && INTERACTIVE_TYPES.includes(RightBlock.type))
    // ) {
    //   legalSwapFailReason = "block has a busy timer on it";
    // }

    if (LeftBlock.type === "stalling" || RightBlock.type === "stalling") {
      legalSwapFailReason = "block is stalling";
    }

    if (y < 11) {
      // Do not swap if not on a clearing block and a vacant block is detected.
      for (let j = y; j < grid.ROWS; j++) {
        if (
          (LeftBlock.color != blockColor.VACANT &&
            INTERACTIVE_TYPES.includes(LeftBlock.type) &&
            INTERACTIVE_TYPES.includes(game.board[x][y + 1].type) &&
            game.board[x][j].color === blockColor.VACANT) ||
          (RightBlock.color !== blockColor.VACANT &&
            INTERACTIVE_TYPES.includes(RightBlock.type) &&
            INTERACTIVE_TYPES.includes(game.board[x + 1][y + 1].type) &&
            game.board[x + 1][j].color === blockColor.VACANT)
        ) {
          legalSwapFailReason = "airborne block";
          // game.message = "Swap Failed: Airborne Block";
          // game.messageChangeDelay = 90;
          break;
        }
      }
    }
    // Do not swap if a falling block is one unit ABOVE the cursor
    if (y > 0) {
      if (
        (blockIsSolid(game.board[x][y - 1]) &&
          game.board[x][y - 1].color != blockColor.VACANT &&
          LeftBlock.color == blockColor.VACANT) ||
        (blockIsSolid(game.board[x + 1][y - 1]) &&
          game.board[x + 1][y - 1].color != blockColor.VACANT &&
          RightBlock.color == blockColor.VACANT)
      ) {
        legalSwapFailReason = "below stalling block";
        // game.message = "Swap Failed: Below an Airborne Block";
        // game.messageChangeDelay = 90;
      }
    }
  }
  if (swapType === "v") {
    const TopBlock = FirstBlock;
    const BottomBlock = SecondBlock;
    TopBlock.swapDirectionX = BottomBlock.swapDirectionX = 0;

    // Make sure both blocks aren't blockColor.VACANT
    if (TopBlock.color === "vacant" || BottomBlock.color === "vacant") {
      legalSwapFailReason = "vertical swap fail, a block is vacant";
    }

    // Check if blocks are clearing
    if (
      !INTERACTIVE_TYPES.includes(TopBlock.type) ||
      !INTERACTIVE_TYPES.includes(BottomBlock.type)
    ) {
      legalSwapFailReason = "vertical swap fail, non-interactive block";
      // game.message = "Swap Failed: Clearing Block";
      // game.messageChangeDelay = 60;
    }

    // do not swap if a block has a fall timer
    // if (
    //   (LeftBlock.timer !== 0 && INTERACTIVE_TYPES.includes(LeftBlock.type)) ||
    //   (RightBlock.timer !== 0 && INTERACTIVE_TYPES.includes(RightBlock.type))
    // ) {
    //   legalSwapFailReason = "block has a busy timer on it";
    // }

    if (TopBlock.type === "stalling")
      legalSwapFailReason = "top block is stalling";
    if (BottomBlock.type === "stalling")
      legalSwapFailReason = "bottom block is stalling";

    if (TopBlock.airborne) legalSwapFailReason = "top block is airborne";
    if (BottomBlock.airborne) legalSwapFailReason = "bottom block is airborne";

    // UNCOMMENT EVENTUALLY
    // if (y < 11) {
    //   // Do not swap if not on a clearing block and a vacant block is detected.
    //   for (let j = y; j < grid.ROWS; j++) {
    //     if (
    //       (LeftBlock.color != blockColor.VACANT &&
    //         INTERACTIVE_TYPES.includes(LeftBlock.type) &&
    //         INTERACTIVE_TYPES.includes(game.board[x][y + 1].type) &&
    //         game.board[x][j].color === blockColor.VACANT) ||
    //       (RightBlock.color !== blockColor.VACANT &&
    //         INTERACTIVE_TYPES.includes(RightBlock.type) &&
    //         INTERACTIVE_TYPES.includes(game.board[x + 1][y + 1].type) &&
    //         game.board[x + 1][j].color === blockColor.VACANT)
    //     ) {
    //       legalSwapFailReason = "airborne block";
    //       // game.message = "Swap Failed: Airborne Block";
    //       // game.messageChangeDelay = 90;
    //       break;
    //     }
    //   }
    // }
    // // Do not swap if a falling block is one unit ABOVE the cursor
    // if (y > 0) {
    //   if (
    //     (blockIsSolid(game.board[x][y - 1]) &&
    //       game.board[x][y - 1].color != blockColor.VACANT &&
    //       LeftBlock.color == blockColor.VACANT) ||
    //     (blockIsSolid(game.board[x + 1][y - 1]) &&
    //       game.board[x + 1][y - 1].color != blockColor.VACANT &&
    //       RightBlock.color == blockColor.VACANT)
    //   ) {
    //     legalSwapFailReason = "below stalling block";
    //     // game.message = "Swap Failed: Below an Airborne Block";
    //     // game.messageChangeDelay = 90;
    //   }
    // }
  }

  legalSwap = !legalSwapFailReason;
  // if (!legalSwap && debug.enabled)
  //   console.log(game.frames, "swap fail:", legalSwapFailReason);

  if (legalSwap) {
    if (game.mode === "training" && !win.mobile) {
      if (game.currentChain === 0) {
        saveState.lastSwap = JSON.parse(JSON.stringify(game));
        updateTrainingButtons();
      }
    }
    if (touch.enabled && touch.moveOrderExists && game.cursor_type[0] !== "d") {
      if (swapType === "h") {
        touch.selectedBlock.x = touch.selectedBlock.x === x ? x + 1 : x;
        touch.selectedBlock.y = y;
      } else {
        touch.selectedBlock.x = x;
        touch.selectedBlock.y = touch.selectedBlock.y === y ? y + 1 : y;
      }
      game.cursor.x = touch.selectedBlock.x;
      game.cursor.y = touch.selectedBlock.y;
    }
    cpu.swapSuccess = true;
    playAudio(audio.select);
    transferProperties(FirstBlock, SecondBlock, "between");
    // if landing, switch to swapping animation
    FirstBlock.timer = SecondBlock.timer = game.swapTimer;
    if (game.mode !== "tutorial")
      FirstBlock.lightTimer = SecondBlock.lightTimer = 0;
    FirstBlock.type = SecondBlock.type = blockType.SWAPPING;
    FirstBlock.airborne = isBlockAirborne(FirstBlock);
    SecondBlock.airborne = isBlockAirborne(SecondBlock);
    swapType === "h"
      ? (FirstBlock.swapDirectionX = 1)
      : (FirstBlock.swapDirectionY = 1);
    swapType === "h"
      ? (SecondBlock.swapDirectionX = -1)
      : (SecondBlock.swapDirectionY = -1);
    FirstBlock.touched = SecondBlock.touched = true;
    FirstBlock.availForPrimaryChain = SecondBlock.availForPrimaryChain = false;
    FirstBlock.availForSecondaryChain = SecondBlock.availForSecondaryChain = false;
    if (cpu.control && cpu.inputType === "touch") {
      if (game.cursor.x === FirstBlock.x) game.cursor.x = SecondBlock.x;
      else if (game.cursor.x === SecondBlock.x) game.cursor.x = FirstBlock.x;
      if (game.boardHasSwappingBlock) game.cursor_type = "movingCursor";
      else game.cursor_type = "legalCursorUp";
    }

    // if (y < 11) {
    //   //Check to see if block is about to fall
    //   // Check left block after swap
    //   if (
    //     LeftBlock.color != blockColor.VACANT &&
    //     game.board[x][y + 1].color == blockColor.VACANT
    //   ) {
    //     LeftBlock.timer = game.blockStallTime; // Default 12 frames
    //     LeftBlock.touched = true; // used for properly counting chains
    //     LeftBlock.availForSecondaryChain = false; // Don't allow the block to be used for chains
    //     LeftBlock.availForPrimaryChain = false;
    //   }
    //   // Check right block after swap
    //   if (
    //     RightBlock.color != blockColor.VACANT &&
    //     game.board[x + 1][y + 1].color == blockColor.VACANT
    //   ) {
    //     RightBlock.touched = true; // used for properly counting chains
    //     LeftBlock.availForPrimaryChain = false; // Don't allow it to be used for chains
    //     LeftBlock.availForSecondaryChain = false;
    //   }
    // }

    if (y > 0) {
      // Check to see if there are blocks above a vacant block
      // Check left column
      if (
        FirstBlock.color == blockColor.VACANT &&
        game.board[x][y - 1].color != blockColor.VACANT &&
        INTERACTIVE_TYPES.includes(game.board[x][y - 1].type)
      ) {
        game.board[x][y - 1].type = blockType.NORMAL;
        game.board[x][y - 1].timer = game.blockStallTime + game.swapTimer;
        for (let j = y - 1; j >= 0; j--) {
          game.board[x][j].touched = true;
          FirstBlock.availForPrimaryChain = false;
          FirstBlock.availForSecondaryChain = false;
          if (
            game.board[x][j].color === "vacant" ||
            !INTERACTIVE_TYPES.includes(game.board[x][j])
          )
            break;
        }
      }
      // Check right column
      if (
        SecondBlock.color == blockColor.VACANT &&
        game.board[x + 1][y - 1].color != blockColor.VACANT &&
        INTERACTIVE_TYPES.includes(game.board[x + 1][y - 1].type)
      ) {
        game.board[x + 1][y - 1].type = blockType.NORMAL;
        game.board[x + 1][y - 1].timer = game.blockStallTime + game.swapTimer; // Default 12 frames
        for (let j = y - 1; j >= 0; j--) {
          game.board[x + 1][j].touched = true;
          SecondBlock.availForPrimaryChain = false;
          SecondBlock.availForSecondaryChain = false;
          if (
            game.board[x + 1][j].color === "vacant" ||
            !INTERACTIVE_TYPES.includes(game.board[x + 1][j])
          )
            break;
        }
      }
    } // end y > 0 condition
    if (game.currentChain) {
      try {
        let c = rightSwap ? x + 1 : x;
        if (debug.enabled) console.log(game.frames, "checking sticky,", c, y);
        let stickyResult = stickyCheck(c, y);
        if (stickyResult) {
          if (game.stickyJingleAllowed) {
            playAudio(audio.smartMatch); // to combat audio spam
            game.stickyJingleAllowed = false;
          } else {
            game.stickyJingleAllowed = true; // reset it
          }
          if (debug.enabled)
            console.log(
              game.frames,
              c,
              y,
              "Smart Match stops order",
              stickyResult
            );
          let [xToRemove, yToRemove] =
            game.board[c][y].swapType === "h"
              ? [game.board[c][y].targetCoord, y]
              : [x, game.board[c][y].targetCoord];
          removeFromOrderList(game.board[xToRemove][yToRemove]);
          game.board[c][y].targetCoord = undefined;
          game.board[c][y].lightTimer = 65;
          let [x2, y2] = game.board[c][y].smartMatch.secondCoord;
          game.board[x2][y2].lightTimer = 65;
          let [x3, y3] = game.board[c][y].smartMatch.thirdCoord;
          game.board[x3][y3].lightTimer = 65;
        }
      } catch (error) {
        playAudio(audio.selectionFailed);
        // debug.enabled = true;
        // debug.show = true;
        console.error(error, error.stack);
        if (debug.enabled) {
          pause("Pause -- Check Console For Error");
        }
      }

      // stickyCheck(game.cursor.x, game.cursor.y);
      // stickyCheck(game.cursor.x + 1, game.cursor.y);
    }
  } else if (!legalSwap) {
    // if (game.cursor_type[0] === "d") {
    //   removeFromOrderList(game.board[x][y]);
    // } else if
    if (
      !legalSwapFailReason.includes("non-interactive block") &&
      !legalSwapFailReason.includes("airborne block")
    ) {
      touch.moveOrderExists = false;
      game.swapPressed = false;
      if (FirstBlock.targetCoord !== undefined) {
        let [xToRemove, yToRemove] =
          FirstBlock.swapType === "h"
            ? [FirstBlock.targetCoord, y]
            : [x, FirstBlock.targetCoord];
        removeFromOrderList(game.board[xToRemove][yToRemove]);
        FirstBlock.targetCoord = undefined;
        if (debug.enabled)
          console.log(
            game.frames,
            [FirstBlock.x, FirstBlock.y],
            "remove from order list, reason:",
            legalSwapFailReason
          );
      }
      if (SecondBlock.targetCoord !== undefined) {
        let [xToRemove, yToRemove] =
          SecondBlock.swapType === "h"
            ? [SecondBlock.targetCoord, y]
            : [x, SecondBlock.targetCoord];
        removeFromOrderList(game.board[xToRemove][yToRemove]);
        SecondBlock.targetCoord = undefined;
        if (debug.enabled)
          console.log(
            game.frames,
            [SecondBlock.x, SecondBlock.y],
            "remove from order list, reason:",
            legalSwapFailReason
          );
      }
    }
    win.mainInfoDisplay.style.color = "purple";
    cpu.swapSuccess = false;
    // console.log("swap failed at", x, y, game.frames);
    if (!game.cursor_type[0] === "d") playAudio(audio.selectionFailed);
    // else {
    //   playAudio(audio.selectionFailed);
    // }
  }
}

export function checkSwapTargets() {
  game.boardHasTargets = false;
  for (let c = 0; c < grid.COLS; c++) {
    for (let r = 0; r < grid.ROWS; r++) {
      const Square = game.board[c][r];
      if (Square.targetCoord !== undefined) {
        game.boardHasTargets = true;
        // console.log(
        //   game.frames,
        //   "Square at",
        //   c,
        //   r,
        //   "has a target at ",
        //   Square.targetCoord,
        // );
        if (
          (Square.swapType === "h" && Square.x < Square.targetCoord) ||
          (Square.swapType === "v" && Square.y < Square.targetCoord)
        ) {
          // console.log(
          //   game.frames,
          //   "swapping right",
          //   Square.x,
          //   Square.y,
          //   "target is",
          //   Square.targetCoord
          // );
          trySwappingBlocks(Square.x, Square.y, true, Square.swapType);
        } else if (
          Square.swapType === "h" &&
          c > 0 &&
          Square.x > Square.targetCoord
        ) {
          trySwappingBlocks(Square.x - 1, Square.y, false, "h");
        } else if (
          Square.swapType === "v" &&
          r > 0 &&
          Square.y > Square.targetCoord
        ) {
          trySwappingBlocks(Square.x, Square.y - 1, false, "v");
        }
      }
      // now check if block needs to reset target
    }
  }
  funcTimestamps.swapBlock.end = Date.now();
  funcTimestamps.swapBlock.thisGameFrameSpeed =
    funcTimestamps.swapBlock.end - funcTimestamps.swapBlock.begin;
}
