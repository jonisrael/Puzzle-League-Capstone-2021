import { updateLevelEvents } from "../../../puzzleleague";
import { audio } from "../../fileImports";
import { playAudio } from "../../functions/audioFunctions";
import { closeGame } from "../../functions/gameOverFunctions";
import { saveCurrentBoard } from "../../functions/recordGame";
import { generateOpeningBoard, startGame } from "../../functions/startGame";
import { debug, game, grid, preset, saveState, win } from "../../global";
import { createTutorialBoard } from "../tutorialBoards";
import { loadTutorialState } from "../tutorialEvents";
import {
  deselectAllBlocks,
  flipAllLightsOff,
  flipLightsOnCol,
  flipLightsOnRow,
  flipLightSwitch,
  makeBlockSelectable,
  tutorial,
} from "../tutorialScript";

export const tutorialBoard_4 = [
  [0, 3, "blue"],
  [0, 4, "yellow"],
  [0, 5, "cyan"],
  [0, 6, "blue"],
  [0, 7, "green"],
  [1, 4, "yellow"],
  [1, 5, "green"],
  [1, 6, "red"],
  [1, 7, "cyan"],
  [2, 3, "green"],
  [2, 4, "cyan"],
  [2, 5, "purple"],
  [2, 6, "green"],
  [2, 7, "yellow"],
  [3, 3, "red"],
  [3, 4, "yellow"],
  [3, 5, "blue"],
  [3, 6, "red"],
  [3, 7, "blue"],
  [4, 3, "blue"],
  [4, 4, "green"],
  [4, 5, "purple"],
  [4, 6, "blue"],
  [4, 7, "purple"],
  [5, 5, "yellow"],
  [5, 6, "green"],
  [5, 7, "yellow"],
];

export const tutorialMessages4 = [
  "CHAINS PART 2/2",
  "We are now going to set up a large chain of 4. Don't worry, we will do it slowly!",
  "First, create a match here. We can see that it will form a 2x chain.",
  "But we have more! Quickly, we can move this block here and get another match.",
  "3x chain! Keep going. Where do we move this block in order to finish the chain?",
  "4x!",
  "5x!",
  "Incredible! I can't believe it!",
  "Adding up the score, 30 + 130 + 230 + 330 + 430 = 1150 points. Wow!",
  "You can see that with each extra chain, a lot of extra points are added.",
  "And although this is a rare third method of scoring, notice we completely cleared the field.",
  "Doing that earned us 10,000 points!",
];

export function tutorialEventsAtState_4() {
  const rows = grid.ROWS;
  let action = game.board[0][rows]; // off screen hidden block used for reference
  if (action.timer === 0) {
    game.humanCanPlay = false;
    document.getElementById("pause-button").disabled = false;
    game.cursor.y = -1;
    game.board[2][grid.ROWS - 1].color = "blue";
    game.board[3][grid.ROWS - 1].color = "yellow";
  }
  if (debug.enabled) return;

  if (action.timer === -2) {
    if (game.board[2][5].color === "green") {
      if (game.board[4][5].timer === 0) {
        deselectAllBlocks();
        flipAllLightsOff();
        game.board[4][5].timer = 22; // short delay before next text box
      }
      if (game.board[4][5].timer === 2) {
        game.board[4][5].timer = 0;
        tutorial.msgIndex++;
      }
    }
  }

  if (action.timer === -3) {
    if (game.board[2][4].type === "face") tutorial.msgIndex++;
  }

  if (action.timer === -4) {
    if (
      game.board[2][4].color === "green" &&
      game.board[2][4].type === "blinking"
    )
      tutorial.msgIndex++;
  }

  if (action.timer === -5) {
    if (game.board[2][4].type === "face") tutorial.msgIndex++; // yellow clearing
  }

  if (action.timer === -6) {
    game.board[2][4].timer = 58;
    game.board[2][5].timer = 58;
    game.board[2][6].timer = 58;
    if (game.board[2][3].color === "red") {
      tutorial.msgIndex++;
      deselectAllBlocks();
    }
    if (game.board[5][4].color === "red") {
      game.board[5][4].color = "vacant";
      game.board[3][3].color = "red";
      game.board[4][3].color = "blue";
      makeBlockSelectable(3, 3, 2);
      flipLightSwitch(3, 3, "on", false);
    }
  }

  if (action.timer === -7) {
    if (game.board[2][grid.ROWS - 2].type === "blinking") tutorial.msgIndex++;
  }

  if (action.timer === -8) {
    if (game.board[2][grid.ROWS - 2].type === "face") tutorial.msgIndex++;
  }

  if (action.timer === -9) {
    game.board[1][grid.ROWS - 2].timer = 58;
    game.board[2][grid.ROWS - 2].timer = 58;
    game.board[3][grid.ROWS - 2].timer = 58;
    if (game.board[2][5].color === "blue") {
      tutorial.msgIndex++;
      deselectAllBlocks();
      flipAllLightsOff();
      flipLightSwitch(2, grid.ROWS - 3, "on", false);
      flipLightSwitch(3, grid.ROWS - 3, "on", false);
      flipLightSwitch(4, grid.ROWS - 2, "on", false);
    }
  }

  if (action.timer === -10 && game.board[4][6].type === "blinking") {
    tutorial.msgIndex++;
  }

  if (
    action.timer === -11 &&
    game.board[3][grid.ROWS - 2].color === "cyan" &&
    game.board[3][grid.ROWS - 2].type === "normal"
  ) {
    tutorial.msgIndex++;
    playAudio(audio.announcerIncredibleTechnique);
  }
  if (action.timer !== -tutorial.msgIndex && tutorial.msgIndex > 1) {
    action.timer = -tutorial.msgIndex;
    console.log("load next board state:", tutorial.msgIndex);
    tutorial.savedBoard = saveCurrentBoard(game.board);
    // the following switch script occurs when the next message occurs.
    switch (tutorial.msgIndex) {
      case 2:
        game.humanCanPlay = true;
        document.getElementById("pause-button").disabled = game.humanCanPlay;
        deselectAllBlocks();
        makeBlockSelectable(1, 5, 2); // allow green block to move
        flipLightsOnCol(2, [3, 6], "on", false);
        flipLightSwitch(1, 5, "on", false);
        game.cursor.x = 1;
        game.cursor.y = 5;
        saveState.selfSave = JSON.parse(JSON.stringify(game));
        updateLevelEvents(1);
        break;
      case 3:
        deselectAllBlocks();
        makeBlockSelectable(3, 4, 2); // allow yellow block to move
        flipLightsOnRow([0, 1, 3], 4, "on", false);
        game.cursor.x = 3;
        game.cursor.y = 4;
        updateLevelEvents(1);
        break;
      case 6:
        makeBlockSelectable(3, 3, 2); // allow red block to move
        flipLightSwitch(3, 3, "on", false);
        flipLightsOnRow([1, 3], grid.ROWS - 2, "on", false);
        saveState.selfSave = JSON.parse(JSON.stringify(game));
        break;
      case 9:
        makeBlockSelectable(0, 4, 2); // allow any blue block to move
        makeBlockSelectable(4, 3, 2); // allow any blue block to move
        makeBlockSelectable(5, 4, 2); // allow any blue block to move
        flipLightSwitch(0, 4, "on", false);
        flipLightSwitch(4, 3, "on", false);
        flipLightSwitch(5, 4, "on", false);
        flipLightSwitch(3, grid.ROWS - 3, "on", false);
        flipLightSwitch(4, grid.ROWS - 2, "on", false);
        flipLightsOnRow([1, 3], grid.ROWS - 2, "on", false);
        break;
      case 12:
        game.humanCanPlay = false;
        document.getElementById("pause-button").disabled = false;
    }
  }
}
