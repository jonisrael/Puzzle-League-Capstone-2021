import { updateLevelEvents } from "../../../mainGame";
import { pause } from "../../functions/pauseFunctions";
import { saveCurrentBoard } from "../../functions/playbackGame";
import { generateOpeningBoard } from "../../functions/startGame";
import { CLEARING_TYPES, debug, game, grid, touch, win } from "../../global";
import { createTutorialBoard } from "../tutorialBoards";
import {
  allBlocksAreSelectable,
  deselectAllBlocks,
  tutorial,
} from "../tutorialScript";

// action timer definitions:
// action.timer === -2 means the board is currently waiting for a clear to occur.
// action.timer === -3 means the board is waiting for clear to end.
// action.timer > 0 means the board is waiting, and at 0, it will restart.

export function chainChallengeEvents() {
  game.boardRiseSpeed = -2;
  let action = game.board[0][grid.ROWS]; // off screen hidden block used for reference
  // constant search:
  if (game.largestChain > 0 && game.currentChain === 0 && action.timer === -2) {
    game.message =
      game.frames % 240 < 120
        ? `Largest Chain: ${game.largestChain}x.`
        : "Can you make a 9 chain to clear the board?";
  }
  if (game.currentChain === 9) {
    game.message = "Congratulations, you beat the Chain Puzzle!";
    action.timer = 120;
  }

  if (action.timer === 0) {
    // start challenge
    game.playRecording ? updateLevelEvents(1) : updateLevelEvents(0);
    document.getElementById("pause-button").innerHTML = "Pause/Retry";
    if (game.largestChain === 0)
      game.message =
        "Chain Puzzle! Can you clear the whole board in one chain?";
    game.currentChain = 0;
    game.lastChain = 0;
    game.frames = 0;
    action.timer = -2;
    for (let x = 0; x < grid.COLS; x++) {
      for (let y = 0; y < grid.ROWS; y++) {
        game.board[x][y].type = "normal";
        game.board[x][y].timer = 0;
      }
    }
    createTutorialBoard(tutorial.board[4], true);
    allBlocksAreSelectable(true);
    if (tutorial.failCount > 0) {
      pause(false, game.message, false, true); // does not stop music and hides restart
    }
  } // end actionTimer === 0
  if (action.timer === -2 && game.currentChain > 0) {
    action.timer = -3;
  }

  if (action.timer === -3 && game.lastChain > 0) {
    // action timer is set to -3 upon ending chain in endChain() function
    deselectAllBlocks();
    touch.moveOrderExists = false;
    action.timer = 30;
    tutorial.failCount++;
    tutorial.movesMade = 0;
    game.message = `${game.lastChain}x achieved. `;
    if (game.lastChain < 3) game.message += `Try again!`;
    else if (game.lastChain < 5) game.message += `Good! Can you get to 5?`;
    else if (game.lastChain < 7) game.message += `Excellent! Can you get 7?`;
    else if (game.lastChain < 9) game.message += `Very close! Can you get 9?`;
    else game.message = "Congratulations, you beat the Chain Puzzle!";
  }

  // if (game.boardHasSwappingBlock && countTheMove()) {
  //   tutorial.movesMade++;
  //   console.log("moves made:", tutorial.movesMade);
  // }

  // if (tutorial.hintLevel > 0) checkChainChallengeHints();

  if (game.largestChain === 9 && action.timer < 2) {
    win.running = false;
  }
}

function checkChainChallengeHints() {
  if (tutorial.movesMade === 0) {
    game.board[4][6].helpX = 3;
  }
}

function countTheMove() {
  for (let x = 0; x < grid.COLS; x++) {
    for (let y = 0; y < grid.ROWS; y++) {
      if (game.board[x][y].timer === 1 && game.board[x][y].swapDirectionX) {
        // count a block that is swapping as 1
        return [x, y];
      }
    }
  }
  return false;
}
