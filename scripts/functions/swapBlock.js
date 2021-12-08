import {
  INTERACTIVE_TYPES,
  game,
  grid,
  blockColor,
  blockType,
  win,
  cpu,
  touch,
  hold_it,
  randInt,
  CLEARING_TYPES
} from "../global";
import { playAudio } from "./audioFunctions";
import { audio } from "../fileImports";
import { stickyCheck } from "./stickyFunctions";

export function trySwappingBlocks(x, y) {
  if (game.disableSwap || game.frames < 0 || x > grid.COLS - 2 || game.over) {
    return;
  }

  let legalSwap = true;

  // Make sure both blocks aren't blockColor.VACANT
  if (
    game.board[x][y].color == blockColor.VACANT &&
    game.board[x + 1][y].color == blockColor.VACANT
  ) {
    legalSwap = false;
    // game.message = "Swap Failed: Both Squares Empty";
    // game.messageChangeDelay = 60;
  }

  // Check if blocks are clearing
  if (
    !INTERACTIVE_TYPES.includes(game.board[x][y].type) ||
    !INTERACTIVE_TYPES.includes(game.board[x + 1][y].type)
  ) {
    legalSwap = false;
    // game.message = "Swap Failed: Clearing Block";
    // game.messageChangeDelay = 60;
  }

  // Do not swap if not on a clearing block and a vacant block is detected.
  if (y < 11) {
    for (let j = y; j < grid.ROWS; j++) {
      if (
        (game.board[x][y].color != blockColor.VACANT &&
          INTERACTIVE_TYPES.includes(game.board[x][y].type) &&
          INTERACTIVE_TYPES.includes(game.board[x][y + 1].type) &&
          game.board[x][j].color === blockColor.VACANT) ||
        (game.board[x + 1][y].color !== blockColor.VACANT &&
          INTERACTIVE_TYPES.includes(game.board[x + 1][y].type) &&
          INTERACTIVE_TYPES.includes(game.board[x + 1][y + 1].type) &&
          game.board[x + 1][j].color === blockColor.VACANT)
      ) {
        legalSwap = false;
        // game.message = "Swap Failed: Airborne Block";
        // game.messageChangeDelay = 90;
        break;
      }
    }
  }
  // if (y < 11) {
  //   // Do not swap if not on a clearing block and a vacant block is detected.
  //   for (let j = y; j < grid.ROWS; j++) {
  //     if (
  //       (game.board[x][y].color != blockColor.VACANT &&
  //         INTERACTIVE_TYPES.includes(game.board[x][y].type) &&
  //         INTERACTIVE_TYPES.includes(game.board[x][y + 1].type) &&
  //         game.board[x][j].color === blockColor.VACANT) ||
  //       (game.board[x + 1][y].color !== blockColor.VACANT &&
  //         INTERACTIVE_TYPES.includes(game.board[x + 1][y].type) &&
  //         INTERACTIVE_TYPES.includes(game.board[x + 1][y + 1].type) &&
  //         game.board[x + 1][j].color === blockColor.VACANT)
  //     ) {
  //       legalSwap = false;
  //       game.message = "Swap Failed: Airborne Block";
  //       game.messageChangeDelay = 90;
  //       break;
  //     }
  //   }
  // }
  // Do not swap if a falling block is one unit ABOVE the cursor
  if (y > 0) {
    if (
      (INTERACTIVE_TYPES.includes(game.board[x][y - 1].type) &&
        game.board[x][y - 1].color != blockColor.VACANT &&
        game.board[x][y].color == blockColor.VACANT) ||
      (INTERACTIVE_TYPES.includes(game.board[x + 1][y - 1].type) &&
        game.board[x + 1][y - 1].color != blockColor.VACANT &&
        game.board[x + 1][y].color == blockColor.VACANT)
    ) {
      legalSwap = false;
      // game.message = "Swap Failed: Below an Airborne Block";
      // game.messageChangeDelay = 90;
    }
  }

  // FOR FUTURE UPDATE
  // Do not swap if a falling block is one unit BELOW the cursor (rare)
  // if (y > 0) {
  //     if (INTERACTIVE_TYPES.includes(game.board[x][y].type) &&
  //         game.board[x+1][y].color == blockColor.VACANT &&
  //         game.board[x+1][y+1].color != blockColor.VACANT &&
  //         game.board[x+1][y+1].timer>0) {legalSwap = false; console.log("right here!") }
  //     else if (INTERACTIVE_TYPES.includes(game.board[x+1][y].type) &&
  //         game.board[x][y].color == blockColor.VACANT &&
  //         game.board[x][y+1].color != blockColor.VACANT &&
  //         game.board[x][y+1].timer>0) {legalSwap = false; console.log("right here!") }
  // }

  if (legalSwap) {
    if (touch.enabled && touch.moveToTarget) {
      touch.selectedBlock.x = touch.selectedBlock.x === x ? x + 1 : x;
      game.cursor.x = touch.selectedBlock.x;
      game.cursor.y = touch.selectedBlock.y;
    }
    cpu.swapSuccess = true;
    playAudio(audio.select);
    swapProperties(game.board[x][y], game.board[x + 1][y]);
    // if landing, shorten timer to end the landing animation next frame.
    game.board[x][y].timer = 5;
    game.board[x + 1][y].timer = 5;
    game.board[x][y].type = blockType.SWAPPING;
    game.board[x][y].swapDirection = 1;
    game.board[x + 1][y].type = blockType.SWAPPING;
    game.board[x + 1][y].swapDirection = -1;
    // game.board[x][y].availableForPrimaryChain = false;
    // game.board[x + 1][y].availableForPrimaryChain = false;
    // game.board[x][y].availableForSecondaryChain = false;
    // game.board[x + 1][y].availableForSecondaryChain = false;
    game.board[x][y].touched = true;
    game.board[x + 1][y].touched = true;

    // if (y < 11) {
    //   //Check to see if block is about to fall
    //   // Check left block after swap
    //   if (
    //     game.board[x][y].color != blockColor.VACANT &&
    //     game.board[x][y + 1].color == blockColor.VACANT
    //   ) {
    //     game.board[x][y].timer = game.blockStallTime; // Default 12 frames
    //     game.board[x][y].touched = true; // used for properly counting chains
    //     game.board[x][y].availableForSecondaryChain = false; // Don't allow the block to be used for chains
    //     game.board[x][y].availableForPrimaryChain = false;
    //   }
    //   // Check right block after swap
    //   if (
    //     game.board[x + 1][y].color != blockColor.VACANT &&
    //     game.board[x + 1][y + 1].color == blockColor.VACANT
    //   ) {
    //     game.board[x + 1][y].touched = true; // used for properly counting chains
    //     game.board[x][y].availableForPrimaryChain = false; // Don't allow it to be used for chains
    //     game.board[x][y].availableForSecondaryChain = false;
    //   }
    // }

    if (y > 0) {
      // Check to see if there are blocks above a vacant block
      // Check left column
      if (
        game.board[x][y].color == blockColor.VACANT &&
        game.board[x][y - 1].color != blockColor.VACANT &&
        INTERACTIVE_TYPES.includes(game.board[x][y - 1].type)
      ) {
        game.board[x][y - 1].type = blockType.NORMAL;
        game.board[x][y - 1].timer = game.blockStallTime + 4;
        for (let j = y - 1; j >= 0; j--) {
          game.board[x][j].touched = true;
          game.board[x][y].availableForPrimaryChain = false;
          game.board[x][y].availableForSecondaryChain = false;
          if (
            game.board[x][j].color === "vacant" ||
            !INTERACTIVE_TYPES.includes(game.board[x][j])
          )
            break;
        }
      }
      // Check right column
      if (
        game.board[x + 1][y].color == blockColor.VACANT &&
        game.board[x + 1][y - 1].color != blockColor.VACANT &&
        INTERACTIVE_TYPES.includes(game.board[x + 1][y - 1].type)
      ) {
        game.board[x + 1][y - 1].type = blockType.NORMAL;
        game.board[x + 1][y - 1].timer = game.blockStallTime; // Default 12 frames
        for (let j = y - 1; j >= 0; j--) {
          game.board[x + 1][j].touched = true;
          game.board[x + 1][y].availableForPrimaryChain = false;
          game.board[x + 1][y].availableForSecondaryChain = false;
          if (
            game.board[x + 1][j].color === "vacant" ||
            !INTERACTIVE_TYPES.includes(game.board[x + 1][j])
          )
            break;
        }
      }
    } // end y > 0 condition

    if (touch.enabled && touch.moveToTarget) {
      touch.moveToTarget = !stickyCheck(
        touch.selectedBlock.x,
        touch.selectedBlock.y
      );
      if (game.cursor_type !== "cursor" && !touch.moveToTarget) {
        playAudio(hold_it[randInt(hold_it.length)], 0.3);
        game.message = "Sticky activated";
      }
    }
  } else if (!legalSwap) {
    if (
      touch.enabled &&
      touch.moveToTarget &&
      game.board[x][y].type !== "swapping" &&
      game.board[x + 1][y].type !== "swapping"
    ) {
      // stop trying to swap since illegal swap has been made
      console.log(
        "frame",
        game.frames,
        "stopping swap due to illegal move",
        game.board[x][y],
        game.board[x + 1][y]
      );
      touch.moveToTarget = false;
      game.swapPressed = false;
    }
    win.mainInfoDisplay.style.color = "purple";
    cpu.swapSuccess = false;
    // console.log("swap failed at", x, y, game.frames);
    playAudio(audio.selectionFailed);
    // else {
    //   playAudio(audio.selectionFailed);
    // }
  }
}

function swapProperties(FirstBlock, SecondBlock) {
  // Transfer everything except x and y coordinates
  let tempProperties = [
    FirstBlock.color,
    FirstBlock.type,
    FirstBlock.timer,
    FirstBlock.touched,
    FirstBlock.availableForPrimaryChain,
    FirstBlock.availableForSecondaryChain
  ];
  FirstBlock.color = SecondBlock.color;
  SecondBlock.color = tempProperties[0];

  FirstBlock.type = SecondBlock.type;
  SecondBlock.type = tempProperties[1];

  FirstBlock.timer = SecondBlock.timer;
  SecondBlock.timer = tempProperties[2];

  FirstBlock.touched = SecondBlock.touched;
  SecondBlock.touched = tempProperties[3];

  FirstBlock.availableForPrimaryChain = SecondBlock.availableForPrimaryChain;
  SecondBlock.availableForPrimaryChain = tempProperties[4];

  FirstBlock.availableForSecondaryChain =
    SecondBlock.availableForSecondaryChain;
  SecondBlock.availableForPrimaryChain = tempProperties[5];
}
