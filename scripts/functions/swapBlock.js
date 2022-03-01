import {
  INTERACTIVE_TYPES,
  game,
  grid,
  debug,
  blockColor,
  blockType,
  win,
  cpu,
  touch,
  hold_it,
  randInt,
  CLEARING_TYPES,
  blockIsSolid,
  transferProperties,
  saveSttransferPropate,
  saveState,
  removeFromOrderList,
} from "../global";
import { playAudio } from "./audioFunctions";
import { audio } from "../fileImports";
import { TouchOrders, match, pair, stickyCheck } from "./stickyFunctions";
import { pause } from "./pauseFunctions";
import { isBlockAirborne } from "./gravity";
import { updateTrainingButtons } from "./trainingControls";

export function trySwappingBlocks(x, y, rightSwap = true) {
  if (game.disableSwap || game.frames < 0 || x + 2 > grid.COLS || game.over) {
    if (game.frames >= 0) {
      removeFromOrderList(game.board[x][y]);
      if (x + 1 < grid.COLS) removeFromOrderList(game.board[x + 1][y]);
    }
    return;
  }

  const LeftBlock = game.board[x][y];
  const RightBlock = game.board[x + 1][y];
  let legalSwap = true;
  let legalSwapFailReason = "";

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
    legalSwapFailReason = "a block is not interactive";
    // game.message = "Swap Failed: Clearing Block";
    // game.messageChangeDelay = 60;
  }

  // Do not swap if not on a clearing block and a vacant block is detected.
  if (y < 11) {
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
        legalSwapFailReason = "a block is airborne";
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
      legalSwapFailReason = "block below an airborne stalling block";
      // game.message = "Swap Failed: Below an Airborne Block";
      // game.messageChangeDelay = 90;
    }
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
    if (touch.enabled && touch.moveOrderExists) {
      touch.selectedBlock.x = touch.selectedBlock.x === x ? x + 1 : x;
      game.cursor.x = touch.selectedBlock.x;
      game.cursor.y = touch.selectedBlock.y;
      // if (touch.arrowLists.length) touch.arrowLists.shift();
    }
    cpu.swapSuccess = true;
    playAudio(audio.select);
    transferProperties(LeftBlock, RightBlock, "between");
    // if landing, shorten timer to end the landing animation next frame.
    LeftBlock.timer = RightBlock.timer = 5;
    LeftBlock.lightTimer = RightBlock.lightTimer = 0;
    LeftBlock.type = RightBlock.type = blockType.SWAPPING;
    LeftBlock.airborne = isBlockAirborne(LeftBlock);
    RightBlock.airborne = isBlockAirborne(RightBlock);
    LeftBlock.swapDirection = 1;
    RightBlock.swapDirection = -1;
    LeftBlock.touched = RightBlock.touched = true;
    LeftBlock.availForPrimaryChain = RightBlock.availForPrimaryChain = false;
    LeftBlock.availForSecondaryChain = RightBlock.availForSecondaryChain = false;

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
        LeftBlock.color == blockColor.VACANT &&
        game.board[x][y - 1].color != blockColor.VACANT &&
        INTERACTIVE_TYPES.includes(game.board[x][y - 1].type)
      ) {
        game.board[x][y - 1].type = blockType.NORMAL;
        game.board[x][y - 1].timer = game.blockStallTime + 5;
        for (let j = y - 1; j >= 0; j--) {
          game.board[x][j].touched = true;
          LeftBlock.availForPrimaryChain = false;
          LeftBlock.availForSecondaryChain = false;
          if (
            game.board[x][j].color === "vacant" ||
            !INTERACTIVE_TYPES.includes(game.board[x][j])
          )
            break;
        }
      }
      // Check right column
      if (
        RightBlock.color == blockColor.VACANT &&
        game.board[x + 1][y - 1].color != blockColor.VACANT &&
        INTERACTIVE_TYPES.includes(game.board[x + 1][y - 1].type)
      ) {
        game.board[x + 1][y - 1].type = blockType.NORMAL;
        game.board[x + 1][y - 1].timer = game.blockStallTime + 5; // Default 12 frames
        for (let j = y - 1; j >= 0; j--) {
          game.board[x + 1][j].touched = true;
          RightBlock.availForPrimaryChain = false;
          RightBlock.availForSecondaryChain = false;
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
        if (stickyCheck(c, y)) {
          playAudio(audio.smartMatch);
          removeFromOrderList(game.board[c][y]);
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
    if (game.cursor_type[0] === "d") {
      removeFromOrderList(game.board[x][y]);
    } else if (
      game.cursor_type[0] !== "d" &&
      touch.enabled &&
      touch.moveOrderExists &&
      LeftBlock.type !== "swapping" &&
      RightBlock.type !== "swapping" &&
      !CLEARING_TYPES.includes(LeftBlock.type) &&
      !CLEARING_TYPES.includes(RightBlock.type)
    ) {
      // stop trying to swap since illegal swap has been made
      // console.log(
      //   "frame",
      //   game.frames,
      //   "stopping swap due to illegal move",
      //   LeftBlock,
      //   RightBlock
      // );
      touch.moveOrderExists = false;
      game.swapPressed = false;
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
      if (Square.targetX !== undefined) {
        game.boardHasTargets = true;
        // console.log(
        //   game.frames,
        //   "Square at",
        //   c,
        //   r,
        //   "has a target at ",
        //   Square.targetX,
        // );
        if (Square.x < Square.targetX) {
          // console.log(
          //   game.frames,
          //   "swapping right",
          //   Square.x,
          //   Square.y,
          //   "target is",
          //   Square.targetX
          // );
          trySwappingBlocks(Square.x, Square.y);
        } else if (c > 0 && Square.x > Square.targetX) {
          const LeftSquare = game.board[c - 1][r];
          trySwappingBlocks(Square.x - 1, Square.y, false);
        }
      }
      // now check if block needs to reset target
      if (Square.type === "stalling" || CLEARING_TYPES.includes(Square.type)) {
        removeFromOrderList(Square);
      }
    }
  }
}
