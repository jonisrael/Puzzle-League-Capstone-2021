import { updateLevelEvents } from "../../../puzzleleague";
import { audio } from "../../fileImports";
import { playAudio } from "../../functions/audioFunctions";
import { saveCurrentBoard } from "../../functions/recordGame";
import { generateOpeningBoard } from "../../functions/startGame";
import { CLEARING_TYPES, game, grid } from "../../global";
import { createTutorialBoard } from "../tutorialBoards";
import { loadTutorialState } from "../tutorialEvents";
import { tutorialMessages } from "../tutorialMessages";
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

const messageList = [
  "Can you make a Clear 10 within 5 moves?", // 0
  "Out of moves! Try again!",
  "Clear too small, you must clear 10 at the same time!",
  "You can enable a hint to help solve this puzzle.",
  "Fantastic! You have now mastered how to create large matches!",
];

export function tutorialEventsAtState_2() {
  if (game.board[0][grid.ROWS].timer === 0) {
    // set tutorial starting point
    console.log("tutorial start point established");
    tutorial.savedBoard = saveCurrentBoard(game.board);
    game.board[0][grid.ROWS].timer = -2;
    tutorial.msgIndex = 0;
    tutorial.movesMade = 0;
    tutorial.failCount = 0;
    let advanceButton = document.getElementById("pause-button");
    advanceButton.disabled = true;
    updateLevelEvents(3);
  }
  let advanceButton = document.getElementById("pause-button");
  game.humanCanPlay = tutorial.msgIndex >= 0;

  // check if swap occurred
  if (game.boardHasSwappingBlock && countTheMove()) {
    tutorial.movesMade++;
    console.log("moves made:", tutorial.movesMade);
  }

  // failure case 1: out of moves
  if (
    tutorial.movesMade === 5 &&
    !game.boardIsClearing &&
    game.board[1][grid.ROWS].timer === 0
  ) {
    // 5th move made and no clear is occurring
    deselectAllBlocks();
    game.board[1][grid.ROWS].timer = 60;
    tutorial.msgIndex = 1; // msg: out of moves
  }

  if (game.boardIsClearing) {
    // success
    if (
      CLEARING_TYPES.includes(game.board[2][grid.ROWS - 5].type) &&
      CLEARING_TYPES.includes(game.board[2][grid.ROWS - 1].type) &&
      CLEARING_TYPES.includes(game.board[3][grid.ROWS - 5].type) &&
      CLEARING_TYPES.includes(game.board[3][grid.ROWS - 1].type)
    ) {
      if (game.board[2][grid.ROWS - 5].timer === 171) {
        playAudio(audio.announcerFantasticCombo);
        tutorial.msgIndex = tutorialMessages[2].length - 1;
        deselectAllBlocks();
      }
      if (game.board[3][grid.ROWS - 1].timer === 2) {
        tutorial.state++;
        tutorial.msgIndex = 0;
        loadTutorialState(tutorial.state, 0);
      }
    } else if (game.board[1][grid.ROWS].timer === 0) {
      // failure case 2
      deselectAllBlocks();
      game.board[1][grid.ROWS].timer = 150;
      tutorial.msgIndex = 2; // msg: clear too small
    }
  }

  // execute success
  if (game.board[2][grid.ROWS].timer === 2) {
    tutorial.state++;
    tutorial.movesMade = 0;
    tutorial.failCount = 0;
    updateLevelEvents(6);
    loadTutorialState(tutorial.state, 0);
  }

  //execute failure
  if (game.board[1][grid.ROWS].timer === 2) {
    game.board = generateOpeningBoard(0, 0);
    game.board = createTutorialBoard(tutorial.savedBoard, true);
  }
}

function countTheMove() {
  for (let x = 0; x < grid.COLS; x++) {
    for (let y = 0; y < grid.ROWS; y++) {
      if (game.board[x][y].timer === 2 && game.board[x][y].swapDirection) {
        // count a block that is swapping as 1
        return [x, y];
      }
    }
  }
  return false;
}
