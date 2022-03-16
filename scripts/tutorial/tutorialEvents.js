import { game, grid, win } from "../global";
import {
  deselectAllBlocks,
  flipAllLightsOff,
  flipLightsOnCol,
  flipLightsOnRow,
  flipLightSwitch,
  loadTutorialState,
  makeBlockSelectable,
} from "./tutorialScript";

export function checkTutorialEvents(state) {
  if (state === 1) {
    win.running = false;
    location.reload();
    return;
  }
  eval(`tutorialEventsAtState_${state}()`);
}

export function tutorialEventsAtState_0() {
  if (
    game.board[1][grid.ROWS - 1].timer === 90 &&
    game.board[1][grid.ROWS - 1].color === "red"
  ) {
    // move red to create 3 match
    flipLightsOnRow([2, 4, 5], grid.ROWS - 1, "on");
    flipLightSwitch(5, grid.ROWS - 2, "on");
    makeBlockSelectable(5, grid.ROWS - 2, 3);
  }
  if (
    game.board[5][grid.ROWS - 1].timer === 48 &&
    game.board[5][grid.ROWS - 1].color === "yellow"
  ) {
    // move yellow to create 4 match, then select cyan block
    flipLightsOnCol(0, [grid.ROWS - 1, grid.ROWS - 4, grid.ROWS - 5], "on");
    flipLightsOnCol(1, [grid.ROWS - 2, grid.ROWS - 3], "on");
    makeBlockSelectable(1, grid.ROWS - 2, 0); // select cyan block
  }
  if (
    game.board[0][grid.ROWS - 2].timer === 1 &&
    game.board[0][grid.ROWS - 2].type === "swapping" &&
    game.board[0][grid.ROWS - 2].color === "cyan"
  ) {
    // select other cyan block, then create 5.
    makeBlockSelectable(0, grid.ROWS - 2); // deselect
    makeBlockSelectable(1, grid.ROWS - 3, 0); // select cyan make 5
  }
  if (game.board[0][grid.ROWS - 1].timer === 90) {
    flipAllLightsOff();
    flipLightsOnCol(4, [7, 6, 5, 4], "on");
    flipLightsOnCol(5, [7, 6, 5, 4], "on");
    makeBlockSelectable(4, grid.ROWS - 1, 5);
    makeBlockSelectable(4, grid.ROWS - 4, 5);
  }
  if (
    game.board[5][grid.ROWS - 1].color === "red" &&
    game.board[5][grid.ROWS - 1].type === "swapping" &&
    game.board[5][grid.ROWS - 1].timer === 1
  ) {
    flipAllLightsOff();
    deselectAllBlocks();
    flipLightsOnRow([4, 5], grid.ROWS - 3, "on");
    makeBlockSelectable(5, grid.ROWS - 3, 4);
  }
  if (
    game.board[5][grid.ROWS - 4].color === "purple" &&
    game.board[5][grid.ROWS - 4].type === "swapping" &&
    game.board[5][grid.ROWS - 4].timer === 1
  ) {
    flipAllLightsOff();
    deselectAllBlocks();
    flipLightsOnRow([4, 5], grid.ROWS - 2, "on");
    makeBlockSelectable(5, grid.ROWS - 2, 4);
  }

  // failure cases
  if (
    (game.board[2][grid.ROWS - 1].color === "cyan" &&
      game.board[2][grid.ROWS - 1].type === "normal") ||
    (game.board[3][grid.ROWS - 1].color === "red" &&
      game.board[3][grid.ROWS - 1].timer === 2) ||
    (game.board[3][grid.ROWS - 1].color === "purple" &&
      game.board[3][grid.ROWS - 1].timer === 2)
  ) {
    loadTutorialState(0, 0);
  }
}
