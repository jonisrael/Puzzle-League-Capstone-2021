import {
  INTERACTIVE_TYPES,
  game,
  grid,
  PIECES,
  blockColor,
  blockType,
  win,
  cpu
} from "../global";
import { playAudio } from "./audioFunctions";
import { audio } from "../fileImports";

export function trySwappingBlocks(x, y) {
  if (game.disableSwap || game.frames < 0) {
    return;
  }

  let legalSwap = true;

  // Make sure both blocks aren't blockColor.VACANT
  if (
    game.board[x][y].color == blockColor.VACANT &&
    game.board[x + 1][y].color == blockColor.VACANT
  ) {
    legalSwap = false;
    game.message = "Swap Failed: Both Squares Empty";
    game.messageChangeDelay = 90;
  }

  // Check if blocks are clearing
  if (
    !INTERACTIVE_TYPES.includes(game.board[x][y].type) ||
    !INTERACTIVE_TYPES.includes(game.board[x + 1][y].type) ||
    game.board[x][y].color === blockColor.SEMI_VACANT ||
    game.board[x + 1][y].color === blockColor.SEMI_VACANT
  ) {
    legalSwap = false;
    game.message = "Swap Failed: Clearing Block";
    game.messageChangeDelay = 90;
  }

  // Do not swap if not on a clearing block and a vacant block is detected.
  if (y < 11) {
    for (let j = y; j < grid.ROWS; j++) {
      if (
        (PIECES.includes(game.board[x][y].color) &&
          INTERACTIVE_TYPES.includes(game.board[x][y].type) &&
          INTERACTIVE_TYPES.includes(game.board[x][y + 1].type) &&
          game.board[x][j].color === blockColor.VACANT) ||
        (PIECES.includes(game.board[x + 1][y].color) &&
          INTERACTIVE_TYPES.includes(game.board[x + 1][y].type) &&
          INTERACTIVE_TYPES.includes(game.board[x + 1][y + 1].type) &&
          game.board[x + 1][j].color === blockColor.VACANT)
      ) {
        legalSwap = false;
        game.message = "Swap Failed: Airborne Block";
        game.messageChangeDelay = 90;
        break;
      }
    }
  }
  // Do not swap if a falling block is one unit ABOVE the cursor
  if (y > 0) {
    if (
      (INTERACTIVE_TYPES.includes(game.board[x][y - 1].type) &&
        PIECES.includes(game.board[x][y - 1].color) &&
        game.board[x][y].color == blockColor.VACANT) ||
      (INTERACTIVE_TYPES.includes(game.board[x + 1][y - 1].type) &&
        PIECES.includes(game.board[x + 1][y - 1].color) &&
        game.board[x + 1][y].color == blockColor.VACANT)
    ) {
      legalSwap = false;
      game.message = "Swap Failed: Below an Airborne Block";
      game.messageChangeDelay = 90;
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
    cpu.swapSuccess = true;
    playAudio(audio.select);
    swapProperties(game.board[x][y], game.board[x + 1][y]);
    // if landing, shorten timer to end the landing animation next frame.
    if (game.board[x][y].timer > 1) game.board[x][y].timer = 0;
    if (game.board[x + 1][y].timer > 1) game.board[x][y].timer = 0;
    game.board[x][y].type = blockType.NORMAL;
    game.board[x + 1][y].type = blockType.NORMAL;
    game.board[x][y].availableForPrimaryChain = false;
    game.board[x + 1][y].availableForSecondaryChain = false;

    if (y < 11) {
      //Check to see if block is about to fall
      // Check left block after swap
      if (
        PIECES.includes(game.board[x][y].color) &&
        game.board[x][y + 1].color == blockColor.VACANT
      ) {
        game.board[x][y].timer = game.blockStallTime; // Default 12 frames
        game.board[x][y].touched = true; // used for properly counting chains
        game.board[x][y].availableForSecondaryChain = false; // Don't allow the block to be used for chains
        game.board[x][y].availableForPrimaryChain = false;
      }
      // Check right block after swap
      if (
        PIECES.includes(game.board[x + 1][y].color) &&
        game.board[x + 1][y + 1].color == blockColor.VACANT
      ) {
        game.board[x + 1][y].timer = game.blockStallTime; // Default 12 frames
        game.board[x + 1][y].touched = true; // used for properly counting chains
        game.board[x][y].availableForPrimaryChain = false; // Don't allow it to be used for chains
        game.board[x][y].availableForSecondaryChain = false;
      }
    }

    if (y > 0) {
      // Check to see if there are blocks above a vacant block
      // Check left column
      if (
        game.board[x][y].color == blockColor.VACANT &&
        PIECES.includes(game.board[x][y - 1].color) &&
        INTERACTIVE_TYPES.includes(game.board[x][y - 1].type)
      ) {
        game.board[x][y - 1].type = blockType.NORMAL;
        game.board[x][y - 1].timer = game.blockStallTime;
        for (let i = y - 1; i >= 0; i--) {
          game.board[x][i].touched = true;
          game.board[x][y].availableForPrimaryChain = false;
          game.board[x][y].availableForSecondaryChain = false;
        }
      }
      // Check right column
      if (
        game.board[x + 1][y].color == blockColor.VACANT &&
        PIECES.includes(game.board[x + 1][y - 1].color) &&
        INTERACTIVE_TYPES.includes(game.board[x + 1][y - 1].type)
      ) {
        game.board[x + 1][y - 1].type = blockType.NORMAL;
        game.board[x + 1][y - 1].timer = game.blockStallTime; // Default 12 frames
        for (let i = y - 1; i >= 0; i--) {
          game.board[x + 1][i].touched = true;
          game.board[x + 1][y].availableForPrimaryChain = false;
          game.board[x + 1][y].availableForSecondaryChain = false;
        }
      }
    }
  } else {
    win.mainInfoDisplay.style.color = "purple";
    cpu.swapSuccess = false;
    // console.log("swap failed at", x, y, game.frames);
    if (!cpu.enabled) playAudio(audio.selectionFailed);
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
