import {
  INTERACTIVE_PIECES,
  game,
  grid,
  blockColor,
  blockType,
  win
} from "../global";
import { playAudio } from "./audioFunctions";
import { audio } from "../fileImports";

export function trySwappingBlocks(x, y) {
  if (game.disableSwap) {
    return;
  }

  let swap = true;

  // Make sure both blocks aren't blockColor.VACANT
  if (
    game.board[x][y].color == blockColor.VACANT &&
    game.board[x + 1][y].color == blockColor.VACANT
  ) {
    swap = false;
    game.message = "Swap Failed: You cannot swap two empty squares!";
    game.messageChangeDelay = 90;
  }

  // Check if blocks are clearing
  if (
    !INTERACTIVE_PIECES.includes(game.board[x][y].type) ||
    !INTERACTIVE_PIECES.includes(game.board[x + 1][y].type)
  ) {
    swap = false;
    game.message = "Swap Failed: You cannot swap a clearing block!";
    game.messageChangeDelay = 90;
  }

  // Do not swap if ANY block below is falling
  if (y < 11) {
    if (
      INTERACTIVE_PIECES.includes(game.board[x][y].type) &&
      game.board[x][y].color != blockColor.VACANT
    ) {
      for (let j = y; j < grid.ROWS; j++) {
        if (game.board[x][j].color == blockColor.VACANT) {
          swap = false;
          game.message = "Swap Failed: You cannot swap a mid-air block!";
          game.messageChangeDelay = 90;
          break;
        }
      }
    }
    if (
      INTERACTIVE_PIECES.includes(game.board[x + 1][y].type) &&
      game.board[x + 1][y].color != blockColor.VACANT
    ) {
      for (let j = y; j < grid.ROWS; j++) {
        if (game.board[x + 1][j].color == blockColor.VACANT) {
          swap = false;
          game.message = "Swap Failed: You cannot swap a mid-air block!";
          game.messageChangeDelay = 90;
          break;
        }
      }
    }
  }
  // Do not swap if a falling block is less than two units ABOVE the cursor
  if (y > 0) {
    if (
      INTERACTIVE_PIECES.includes(game.board[x][y - 1].type) &&
      game.board[x][y - 1].color != blockColor.VACANT &&
      game.board[x][y].color == blockColor.VACANT
    ) {
      swap = false;
      game.message =
        "Swap Failed: You cannot swap one row below a mid-air block!";
      game.messageChangeDelay = 90;
    } else if (
      INTERACTIVE_PIECES.includes(game.board[x + 1][y - 1].type) &&
      game.board[x + 1][y - 1].color != blockColor.VACANT &&
      game.board[x + 1][y].color == blockColor.VACANT
    ) {
      swap = false;
      game.message =
        "Swap Failed: You cannot swap one row below a mid-air block!";
      game.messageChangeDelay = 90;
    }
  }

  // FOR FUTURE UPDATE
  // Do not swap if a falling block is less than two units BELOW the cursor (rare)
  // if (y > 0) {
  //     if (INTERACTIVE_PIECES.includes(game.board[x][y].type) &&
  //         game.board[x+1][y].color == blockColor.VACANT &&
  //         game.board[x+1][y+1].color != blockColor.VACANT &&
  //         game.board[x+1][y+1].timer>0) {swap = false; console.log("right here!") }
  //     else if (INTERACTIVE_PIECES.includes(game.board[x+1][y].type) &&
  //         game.board[x][y].color == blockColor.VACANT &&
  //         game.board[x][y+1].color != blockColor.VACANT &&
  //         game.board[x][y+1].timer>0) {swap = false; console.log("right here!") }
  // }

  if (swap) {
    playAudio(audio.swapSuccess);
    swapProperties(game.board[x][y], game.board[x + 1][y]);
    game.board[x][y].timer = 0;
    game.board[x + 1][y].timer = 0;
    game.board[x][y].type = blockType.NORMAL;
    game.board[x + 1][y].type = blockType.NORMAL;
    game.board[x][y].availableForPrimaryChain = false;
    game.board[x][y].availableForPrimaryChain = false;
    game.board[x + 1][y].availableForSecondaryChain = false;
    game.board[x + 1][y].availableForSecondaryChain = false;

    if (y < 11) {
      //Check to see if block is about to fall
      // Check left block after swap
      if (
        game.board[x][y].color != blockColor.VACANT &&
        game.board[x][y + 1].color == blockColor.VACANT
      ) {
        game.board[x][y].timer = game.blockStallTime; // Default 12 frames
        game.board[x][y].touched = true; // used for properly counting chains
        game.board[x][y].availableForSecondaryChain = false; // Don't allow the block to be used for chains
        game.board[x][y].availableForPrimaryChain = false;
      }
      // Check right block after swap
      if (
        game.board[x + 1][y].color != blockColor.VACANT &&
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
        game.board[x][y - 1].color != blockColor.VACANT &&
        INTERACTIVE_PIECES.includes(game.board[x][y - 1].type)
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
        game.board[x + 1][y - 1].color != blockColor.VACANT &&
        INTERACTIVE_PIECES.includes(game.board[x + 1][y - 1].type)
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
    playAudio(audio.swapFailed);
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
