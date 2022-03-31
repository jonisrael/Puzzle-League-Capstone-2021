import { closeGame } from "../../functions/gameOverFunctions";
import { startGame } from "../../functions/startGame";
import { game, win } from "../../global";

export function tutorialEventsAtState_3() {
  win.running = false;
  win.restartGame = true;
  game.mode = "arcade";
}
