import { saveCurrentBoard } from "../functions/recordGame";
import { generateOpeningBoard, startGame } from "../functions/startGame";
import { game, grid, win } from "../global";
import { createTutorialBoard, tutorialBoards } from "./tutorialBoards";
import {
  deselectAllBlocks,
  flipAllLightsOff,
  flipLightOnBlocksWithNegativeTimer,
  flipLightsOnCol,
  flipLightsOnRow,
  flipLightSwitch,
  makeBlockSelectable,
  tutorial,
} from "./tutorialScript";

import { tutorialEventsAtState_0 } from "./states/state0";
import { tutorialEventsAtState_1 } from "./states/state1";
import { updateLevelEvents } from "../../puzzleleague";
import { tutorialEventsAtState_2 } from "./states/state2";
import { tutorialEventsAtState_3 } from "./states/state3";

export function checkTutorialEvents(state) {
  if (state >= tutorialBoards.length) {
    win.running = false;
    win.restartGame = true;
    game.mode = "arcade";
    return;
  }
  if (state === 0) tutorialEventsAtState_0();
  if (state === 1) tutorialEventsAtState_1();
  if (state === 2) tutorialEventsAtState_2();
  if (state === 3) tutorialEventsAtState_3();
  // tutorialEventsAtState_0();
  // console.log(state, `tutorialEventsAtState_${state}()`);
  // eval(`tutorialEventsAtState_${state}()`);
}

export function loadTutorialState(state, index = 0, allSelectable = false) {
  tutorial.state = state;
  tutorial.msgIndex = index;
  if (tutorial.state == tutorial.board.length) {
    tutorial.state = tutorial.board.length - 1;
    console.log("tutorial complete");
    game.humanCanPlay = true;
    document.getElementById("game-info-table").style.display = "inline";
    win.running = false;
    win.restartGame = true;
    game.tutorialRunning = false;
    game.mode = "arcade";
    console.log("restarting game");
    return;
  }
  game.board = generateOpeningBoard(0, 0); // empty board
  console.log(tutorialBoards[state], tutorial.state, allSelectable);
  game.board = createTutorialBoard(tutorial.board[state], allSelectable);
  game.frames = game.score = game.minutes = game.seconds = 0;

  if (state === 0) {
    game.cursor.y = -1;
    updateLevelEvents(1);
  }

  // if (state == tutorial.board.length - 1) {
  //   updateLevelEvents(1);
  //   game.board = generateOpeningBoard();
  // } else if (state == 1) {
  //   game.boardRiseSpeed = -2;
  //   generateOpeningBoard(24, 4);
  // } else {
  //   game.boardRiseSpeed = -2;
  //   [game.cursor.x, game.cursor.y] = tutorialCursors[state];
  //   game.board = createTutorialBoard(tutorial.board[state]);
  // }
}
