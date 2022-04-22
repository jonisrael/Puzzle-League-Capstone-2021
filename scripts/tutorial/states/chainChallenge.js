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
  if (action.timer === 0) {
    if (game.largestChain === 9) {
      action.timer = 360;
    }
    document.getElementById("pause-button").innerHTML = "Pause/Retry";
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
  }
  if (action.timer === -2 && game.lastChain === 0) {
    console.log("chain has started");
    action.timer = -3;
  }

  if (action.timer === -3 && game.lastChain > 0) {
    // action timer is set to -3 upon ending chain in endChain() function
    deselectAllBlocks();
    touch.moveOrderExists = false;
    action.timer = 90;
    console.log("chain has ended, chain:", game.lastChain);
  }

  if (game.largestChain === 9 && action.timer < 2) {
    action.timer === 300;
  }

  if (game.largestChain === 9 && action.timer === 180) {
    win.running = false;
  }
}
