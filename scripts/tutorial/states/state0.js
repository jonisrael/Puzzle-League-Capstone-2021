import { saveCurrentBoard } from "../../functions/playbackGame";
import { generateOpeningBoard } from "../../functions/startGame";
import { game, grid } from "../../global";
import { createTutorialBoard } from "../tutorialBoards";
import { loadTutorialState } from "../tutorialEvents";
import {
  deselectAllBlocks,
  flipAllLightsOff,
  flipLightOnBlocksWithNegativeTimer,
  flipLightsOnCol,
  flipLightsOnRow,
  flipLightSwitch,
  makeBlockSelectable,
  tutorial,
} from "../tutorialScript";

export function tutorialEventsAtState_0() {
  // let advanceButton = document.getElementById("pause-button");
  // game.humanCanPlay = tutorial.msgIndex > 2;
  // if (tutorial.msgIndex === 2 && game.cursor.x !== 0) {
  //   flipLightOnBlocksWithNegativeTimer(true);
  //   // flipLightSwitch(0, grid.ROWS - 2, "on", true, true);
  // }
  // if (tutorial.msgIndex === 3 && game.cursor.y === -1) {
  //   // user will now select blinking light
  //   flipAllLightsOff();
  //   flipLightSwitch(0, 6, "on", true);
  //   makeBlockSelectable(0, grid.ROWS - 2, 1);
  //   advanceButton.disabled = true;
  // }
  // if (tutorial.msgIndex === 3 && game.cursor.x === 0 && game.cursor.y === 6) {
  //   tutorial.msgIndex++;
  // }
  // // if (tutorial.msgIndex === 3 && game.board[1][grid.ROWS - 1].timer === -2) {
  // //   flipLightOnBlocksWithNegativeTimer();
  // //   tutorial.msgIndex++;
  // // }
  // if (tutorial.msgIndex === 4 && !game.board[0][grid.ROWS - 2].helpCoord) {
  //   // have user match now
  //   flipAllLightsOff();
  //   flipLightsOnCol(1, [5, 7], "on");
  //   flipLightSwitch(0, grid.ROWS - 2, "on");
  //   makeBlockSelectable(0, grid.ROWS - 2, 1);
  // }
  // if (
  //   game.board[1][grid.ROWS - 2].type === "swapping" &&
  //   game.board[1][grid.ROWS - 2].color === "red" &&
  //   game.board[1][grid.ROWS - 2].timer === 1
  // ) {
  //   // red match started
  //   tutorial.msgIndex++;
  //   flipLightSwitch(0, grid.ROWS - 2, "off");
  //   makeBlockSelectable(0, grid.ROWS - 2); // deselect
  // }
  // if (
  //   game.board[1][grid.ROWS - 1].timer === 2 &&
  //   game.board[1][grid.ROWS - 1].color === "red"
  // ) {
  //   // red match has finished
  //   tutorial.msgIndex++;
  //   flipLightsOnRow([2, 4, 5], grid.ROWS - 1, "on");
  //   flipLightSwitch(5, grid.ROWS - 2, "on");
  //   makeBlockSelectable(5, grid.ROWS - 2, 3);
  // }
  // if (
  //   game.board[5][grid.ROWS - 1].timer === 128 &&
  //   game.board[5][grid.ROWS - 1].color === "yellow"
  // ) {
  //   // just now cleared 4.
  //   tutorial.msgIndex++;
  // }
  // if (
  //   game.board[5][grid.ROWS - 1].type === "landing" &&
  //   game.board[5][grid.ROWS - 1].timer === 2
  // ) {
  //   // after 4 yellow match clearing, switch to new cyan block action.
  //   tutorial.msgIndex++;
  //   tutorial.savedIndex = tutorial.msgIndex;
  //   tutorial.savedBoard = saveCurrentBoard(game.board);
  //   flipLightsOnCol(0, [grid.ROWS - 1, grid.ROWS - 4, grid.ROWS - 5], "on");
  //   flipLightsOnCol(1, [grid.ROWS - 2, grid.ROWS - 3], "on");
  //   makeBlockSelectable(1, grid.ROWS - 2, 0); // select cyan block
  //   makeBlockSelectable(1, grid.ROWS - 3, 0); // select cyan block
  // }
  // if (
  //   game.board[0][grid.ROWS - 2].timer === 1 &&
  //   game.board[0][grid.ROWS - 2].type === "swapping" &&
  //   game.board[0][grid.ROWS - 2].color === "cyan"
  // ) {
  //   // select other cyan block, then create 5.
  //   makeBlockSelectable(0, grid.ROWS - 2); // deselect
  //   makeBlockSelectable(1, grid.ROWS - 3, 0); // select cyan make 5
  // }
  // if (game.board[0][grid.ROWS - 1].timer === 138) {
  //   // cyan just cleared
  //   tutorial.msgIndex++;
  //   tutorial.savedIndex = tutorial.msgIndex;
  //   tutorial.savedBoard = saveCurrentBoard(game.board);
  // }
  // if (game.board[0][grid.ROWS - 1].timer === 2) {
  //   // cyan about to disappear
  //   tutorial.msgIndex++;
  //   tutorial.savedIndex = tutorial.msgIndex;
  //   tutorial.savedBoard = saveCurrentBoard(game.board);
  //   // create 8 match
  //   flipAllLightsOff();
  //   flipLightsOnCol(4, [7, 6, 5, 4], "on");
  //   flipLightsOnCol(5, [7, 6, 5, 4], "on");
  //   makeBlockSelectable(4, grid.ROWS - 1, 5);
  //   makeBlockSelectable(4, grid.ROWS - 4, 5);
  //   makeBlockSelectable(5, grid.ROWS - 1, 4);
  //   makeBlockSelectable(5, grid.ROWS - 4, 4);
  // }
  // if (
  //   game.board[5][grid.ROWS - 1].color === "red" &&
  //   game.board[5][grid.ROWS - 1].type === "swapping" &&
  //   game.board[5][grid.ROWS - 1].timer === 1
  // ) {
  //   // swapping top red
  //   flipAllLightsOff();
  //   deselectAllBlocks();
  //   flipLightsOnRow([4, 5], grid.ROWS - 3, "on");
  //   makeBlockSelectable(5, grid.ROWS - 3, 4);
  //   makeBlockSelectable(4, grid.ROWS - 3, 5);
  // }
  // if (
  //   game.board[5][grid.ROWS - 4].color === "purple" &&
  //   game.board[5][grid.ROWS - 4].type === "swapping" &&
  //   game.board[5][grid.ROWS - 4].timer === 1
  // ) {
  //   // swapping bottom red
  //   flipAllLightsOff();
  //   deselectAllBlocks();
  //   flipLightsOnRow([4, 5], grid.ROWS - 2, "on");
  //   makeBlockSelectable(5, grid.ROWS - 2, 4);
  //   makeBlockSelectable(4, grid.ROWS - 2, 5);
  // }
  // if (game.board[5][grid.ROWS - 4].timer === 168) {
  //   // 8 blocks have just started clearing.
  //   tutorial.msgIndex++;
  // }
  // // failure cases
  // if (
  //   (game.board[2][grid.ROWS - 1].color === "cyan" &&
  //     game.board[2][grid.ROWS - 1].type === "normal") ||
  //   (game.board[3][grid.ROWS - 1].color === "red" &&
  //     game.board[3][grid.ROWS - 1].timer === 2) ||
  //   (game.board[3][grid.ROWS - 1].color === "purple" &&
  //     game.board[3][grid.ROWS - 1].timer === 2) ||
  //   (game.board[0][grid.ROWS - 3].type === "face" &&
  //     game.board[0][grid.ROWS - 2].type === "normal")
  // ) {
  //   // return to last save
  //   console.log("failure, reverting to last save");
  //   tutorial.msgIndex = tutorial.savedIndex - 1;
  //   game.board = generateOpeningBoard(0, 0);
  //   game.board = createTutorialBoard(tutorial.savedBoard);
  //   if (game.board[1][grid.ROWS - 2].color === "cyan") {
  //     // revert to the create 5 state
  //     game.board[5][grid.ROWS - 1].type = "landing";
  //     game.board[5][grid.ROWS - 1].timer = 4;
  //   }
  //   if (game.board[1][grid.ROWS - 3].color === "green") {
  //     for (let r = 5; r > 0; r--) {
  //       game.board[0][grid.ROWS - r].type = "popped";
  //       game.board[0][grid.ROWS - r].timer = 4;
  //     }
  //   }
  // }
  // // success case
  // if (
  //   game.board[5][grid.ROWS - 1].type === "face" &&
  //   game.board[5][grid.ROWS - 1].timer === 2 &&
  //   (game.board[5][grid.ROWS - 1].color === "red" ||
  //     game.board[5][grid.ROWS - 1].color === "purple")
  // ) {
  //   tutorial.msgIndex++;
  //   game.board[1][grid.ROWS - 1].timer = 60;
  // }
  // // transition
  // if (
  //   game.board[1][grid.ROWS - 1].timer === 2 &&
  //   game.board[1][grid.ROWS - 1].type === "normal"
  // ) {
  //   tutorial.state++;
  //   loadTutorialState(1, 0, true);
  // }
}
