import { updateLevelEvents } from "../../../mainGame";
import { saveCurrentBoard } from "../../functions/playbackGame";
import { generateOpeningBoard } from "../../functions/startGame";
import { debug, game, grid, touch, win } from "../../global";
import { createTutorialBoard } from "../tutorialBoards";
import {
  allBlocksAreSelectable,
  deselectAllBlocks,
  tutorial,
} from "../tutorialScript";

export function chainChallengeEvents() {
  let action = game.board[0][grid.ROWS]; // off screen hidden block used for reference
  // constant search:
  if (game.largestChain > 0 && game.currentChain === 0 && action.timer === -2) {
    game.message =
      game.frames % 240 < 120
        ? `Largest Chain: ${game.largestChain}x.`
        : "Can you make a 9 chain to clear the board?";
  }

  if (game.currentChain === 8) {
    updateLevelEvents(7);
  }

  if (game.currentChain === 9) {
    game.message = "Congratulations, you beat the Chain Challenge!";
    action.timer = 120;
  }

  if (game.largestChain === 9 && action.timer === 0) {
    win.running = false;
  }
  if (action.timer === 0) {
    // start challenge
    game.playRecording ? updateLevelEvents(1) : updateLevelEvents(0);
    document.getElementById("pause-button").innerHTML = "Pause/Retry";
    if (game.largestChain === 0)
      game.message =
        "Chain Challenge! Can you clear the whole board in one chain?";
    game.currentChain = 0;
    game.lastChain = 0;
    game.frames = 62;
    action.timer = -2;
    for (let x = 0; x < grid.COLS; x++) {
      for (let y = 0; y < grid.ROWS; y++) {
        game.board[x][y].type = "normal";
        game.board[x][y].timer = 0;
      }
    }
    createTutorialBoard(tutorial.board[4], true);
    allBlocksAreSelectable(true);
  }
  if (action.timer === -2 && game.currentChain > 0) {
    console.log("chain has started");
    action.timer = -3;
  }

  if (action.timer === -3 && game.lastChain > 0) {
    // action timer is set to -3 upon ending chain in endChain() function
    deselectAllBlocks();
    updateLevelEvents(0);
    touch.moveOrderExists = false;
    action.timer = 180;
    game.message = `${game.lastChain}x achieved. `;
    if (game.lastChain < 3) game.message += `Try again!`;
    else if (game.lastChain < 5) game.message += `Good!`;
    else if (game.lastChain < 7) game.message += `Excellent!`;
    else if (game.lastChain < 9) game.message += `Very close!`;
    else {
      game.message = "Congratulations, you beat the Chain Challenge!";
      action.timer = 180;
    }
  }

  if (game.largestChain === 9 && action.timer < 2) {
    action.timer === 300;
  }
}
