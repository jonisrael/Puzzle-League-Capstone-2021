import { closeGame } from "../../functions/gameOverFunctions";
import { startGame } from "../../functions/startGame";
import { game, grid, win } from "../../global";
import { tutorialMessages } from "../tutorialMessages";
import { tutorial } from "../tutorialScript";

export function tutorialEventsAtState_2() {
  game.humanCanPlay = false;
  if (game.board[1][grid.ROWS].timer === 0) {
    console.log("set timer to 300");
    game.frames = 0;
    game.board[0][grid.ROWS].timer = 180;
    game.board[1][grid.ROWS].timer = -2;
  }
  let msgLength = tutorialMessages[2][0].length;
  tutorialMessages[2][0] = tutorialMessages[2][0].slice(0, msgLength - 1);
  tutorialMessages[2][0] += ` ${1 +
    Math.floor(game.board[0][grid.ROWS].timer / 60)}`;

  if (game.board[0][grid.ROWS].timer === 0) {
    win.running = false;
    win.restartGame = true;
    closeGame(false);
    game.mode = "arcade";
    startGame(1);
  }
}
