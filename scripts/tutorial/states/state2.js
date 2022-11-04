import { updateLevelEvents } from "../../../mainGame";
import { audio } from "../../fileImports";
import { playAudio } from "../../functions/audioFunctions";
import { saveCurrentBoard } from "../../functions/playbackGame";
import { generateOpeningBoard } from "../../functions/startGame";
import { CLEARING_TYPES, game, grid, win } from "../../global";
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
  setValuesOfAllBlocksProperties,
  tutorial,
} from "../tutorialScript";

const messageList = [
  "Can you make a Clear 10 within 3 moves?", // 0
  "Out of moves! Try again!",
  "Clear too small, you must clear 10 at the same time!",
  "You can enable a hint to help solve this puzzle.",
  "Fantastic! You have now mastered how to create large matches!",
  "Here is a hint -- start with swapping these here.",
  "Next-- swap these blocks here.",
  "Finally, finish the swap here!",
];

export function tutorialEventsAtState_2() {
  game.boardRiseSpeed = -2;
  if (game.board[0][grid.ROWS].timer === 0) {
    // set tutorial starting point
    console.log("tutorial start point established");
    tutorial.savedBoard = saveCurrentBoard(game.board);
    game.board[0][grid.ROWS].timer = -2;
    tutorial.msgIndex = 0;
    tutorial.movesMade = 0;
    let advanceButton = document.getElementById("pause-button");
    advanceButton.disabled = true;
    updateLevelEvents(5);
  }
  let advanceButton = document.getElementById("pause-button");
  game.humanCanPlay = tutorial.msgIndex >= 0;

  // check if swap occurred
  if (game.boardHasSwappingBlock && countTheMove()) {
    tutorial.movesMade++;
    console.log("moves made:", tutorial.movesMade);
  }

  if (game.boardHasClearingBlock) {
    console.log("Board has clearing block ", game.board[2][7].timer);

    // success
    if (
      CLEARING_TYPES.includes(game.board[2][3].type) &&
      CLEARING_TYPES.includes(game.board[2][7].type) &&
      CLEARING_TYPES.includes(game.board[3][3].type) &&
      CLEARING_TYPES.includes(game.board[3][7].type)
    ) {
      if (game.board[2][7].timer === 158) {
        playAudio(audio.announcerFantasticCombo);
        tutorial.msgIndex = 4;
        deselectAllBlocks();
      } else if (game.board[2][7].timer === 2) {
        // success begins
        game.board[2][grid.ROWS].timer = 60;
        tutorial.movesMade = 4; // lazy fix
        // loadTutorialState(tutorial.state, 0);
      }
    } else if (game.board[1][grid.ROWS].timer === 0) {
      // failure case 2 -- clear too small
      deselectAllBlocks();
      game.board[1][grid.ROWS].timer = 150;
      tutorial.msgIndex = 2; // msg: clear too small
    }
  } else if (
    tutorial.movesMade === 3 &&
    game.board[1][grid.ROWS].timer === 0 &&
    !game.boardHasClearingBlock &&
    !game.boardHasSwappingBlock
  ) {
    // failure case 1: out of moves
    // 3rd move made and no clear is occurring
    deselectAllBlocks();
    game.board[1][grid.ROWS].timer = 60;
    tutorial.msgIndex = 1; // msg: out of moves
  }

  // execute success
  if (game.board[2][grid.ROWS].timer === 2) {
    tutorial.state++;
    tutorial.msgIndex = 0;
    tutorial.movesMade = 0;
    tutorial.failCount = 0;
    updateLevelEvents(6);
    win.running = false;
    win.goToMenu = `nextTutorial_${tutorial.state}`;
    // loadTutorialState(tutorial.state, 0);
  }

  //execute failure
  if (game.board[1][grid.ROWS].timer === 2) {
    tutorial.failCount++;
    tutorial.movesMade = 0;
    if (tutorial.failCount === 2) tutorial.hintLevel = 1;
    else if (tutorial.failCount > 2) tutorial.hintLevel = 2;
    generateOpeningBoard(0, 0);
    createTutorialBoard(tutorial.savedBoard, true);
  }

  // execute hints if fail count at 2 or more
  if (tutorial.hintLevel > 0 && !game.boardHasSwappingBlock) {
    if (tutorial.movesMade === 0) {
      game.board[2][3].helpX = 3;
      tutorial.msgIndex = 7;
    } else if (tutorial.movesMade === 1) {
      if (game.board[2][3].color === "purple" && tutorial.hintLevel === 2) {
        game.board[3][7].helpX = 2;
        game.board[2][3].helpX = undefined;
        tutorial.msgIndex = 8;
      } else {
        tutorial.msgIndex = 0;
        tutorial.hintLevel = 0;
        setValuesOfAllBlocksProperties("helpX", undefined);
        console.log(game.frames, game.board[2][3], "turning off hint");
      }
    } else if (tutorial.movesMade === 2) {
      if (game.board[2][7].color === "purple" && tutorial.hintLevel === 2) {
        game.board[2][5].helpX = 3;
        tutorial.msgIndex = 9;
        game.board[3][7].helpX = undefined;
      } else {
        tutorial.msgIndex = 0;
        tutorial.hintLevel = 0;
        setValuesOfAllBlocksProperties("helpX", undefined);
        console.log(game.frames, game.board[2][3], "turning off hint");
      }
    }
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
