import {
  blockType,
  cpu,
  detectInfiniteLoop,
  game,
  grid,
  PIECES,
  randInt,
  randomPiece,
  sound,
  touch,
  win,
} from "../global";
import { newBlock, updateLevelEvents } from "../../puzzleleague";
import { fixNextDarkStack, generateOpeningBoard } from "../functions/startGame";
import { createTutorialBoard, tutorialBoards } from "./tutorialBoards";
import { tutorialMessages } from "./tutorialMessages";
import { loadTutorialState, tutorialInputs } from "./tutorialEvents";
import { audio } from "../fileImports";
import { moveBlockByRelease, selectBlock } from "../clickControls";
import { playMusic } from "../functions/audioFunctions";

// ROWS
const COLS = 6;
const ROWS = 12;
// export const tutorialBoards = [];
// export const tutorialInputs = [];

const tutorialCursors = [
  [2, 6],
  [2, 6],
  [2, 6],
  [1, ROWS - 1],
  [0, ROWS - 4],
  [2, ROWS - 2],
  [2, ROWS - 2],
];

export const tutorial = {
  board: tutorialBoards,
  savedBoard: [],
  savedIndex: 0,
  inputs: tutorialInputs,
  msgIndex: 0,
  cursor: tutorialCursors,
  state: 0,
  movesMade: 0,
  failCount: 0,
};

console.log(tutorial);

export function nextDialogue(index) {
  console.log(
    "index",
    tutorial.msgIndex,
    "state",
    tutorial.state,
    "indexes",
    tutorialMessages[tutorial.state].length,
    "states",
    tutorialMessages.length
  );

  if (index < tutorialMessages[tutorial.state].length - 1) {
    console.log("go to next text box");
    tutorial.msgIndex++;
    game.message = tutorialMessages[tutorial.state][tutorial.msgIndex];
    console.log(tutorial.msgIndex, game.message);
  } else {
    console.log("new state");
    tutorial.state++;
    loadTutorialState(tutorial.state, tutorial.msgIndex, true);
  }
}

export function runTutorialScript(input, frame, state) {
  let thisFrameInput = tutorial.inputs[state][frame];
  // console.log(
  //   frame,
  //   Object.keys(tutorial.inputs[state]).pop(),
  //   frame == Object.keys(tutorial.inputs[state]).pop()
  // );
  if (thisFrameInput !== undefined) {
    input[thisFrameInput] = true;
  }
  if (frame == Object.keys(tutorial.inputs[state]).pop()) {
    // updateLevelEvents(1);
    console.log(game.frames, "script complete");
    loadTutorialState(state, tutorial.msgIndex);
    // cpu.control = true;
  }
  return input;
}

export function startTutorial() {
  win.cvs.style.height = "50vh";
  game.board = [];
  playMusic(audio.trainingMusic, 0.2);
  // sound.Music[1].src = audio.trainingMusic;
  // sound.Music[1].volume = 0.2;
  // sound.Music[1].play();
  // game.tutorialRunning = true;
  // game.humanCanPlay = false;
  updateLevelEvents(3);
  document.getElementById("game-info-table").style.display = "none";
  document.getElementById("main-info").style = "font-size: 2rem;";
  loadTutorialState(0, 0);
  // loadTutorialState(tutorial.state, tutorial.msgIndex);
}

export function playScript(touchInput) {
  if (touchInput === undefined) return;
  let [x, y, name, targetX] = touchInput;
  if (name === "move") {
    moveBlockByRelease(x, y, targetX);
  }
  if (name === "premove") {
    game.board[touch.selectedBlock.x][touch.selectedBlock.y].previewX = targetX;
  }
  if (name === "select") {
    selectBlock(x, y);
  }
  if (name === "raise") {
    game.raisePressed = true;
  }
}

export function flipLightsOnCol(x, y_values, type) {
  y_values.forEach((y) => flipLightSwitch(x, y, type));
}

export function flipLightsOnRow(x_values, y, type) {
  x_values.forEach((x) => flipLightSwitch(x, y, type));
}

export function flipLightOnBlocksWithNegativeTimer(blink = false) {
  for (let x = 0; x < grid.COLS; x++) {
    for (let y = 0; y < grid.ROWS; y++) {
      if (game.board[x][y].timer < 0) {
        flipLightSwitch(x, y, "on", blink);
        game.board[x][y].timer = 0;
      }
    }
  }
}

export function flipAllLightsOff() {
  for (let x = 0; x < grid.COLS; x++) {
    for (let y = 0; y < grid.ROWS; y++) {
      game.board[x][y].lightTimer = 0; // turn off
      game.board[x][y].lightBlink = false;
    }
  }
}

export function flipLightSwitch(x, y, type, blink = false) {
  if (type === "on") {
    game.board[x][y].lightTimer = -2; // turn on indefinitely
    game.board[x][y].lightBlink = blink;
  } else {
    game.board[x][y].lightTimer = 0; // turn off
    game.board[x][y].lightBlink = false;
  }
}

export function makeBlockSelectable(x, y, helpX) {
  if (helpX !== undefined) {
    game.board[x][y].tutorialSelectable = true;
    game.board[x][y].helpX = helpX;
  } else {
    game.board[x][y].tutorialSelectable = false;
    game.board[x][y].helpX = undefined;
  }
}

export function deselectAllBlocks() {
  for (let x = 0; x < grid.COLS; x++) {
    for (let y = 0; y < grid.ROWS; y++) {
      game.board[x][y].tutorialSelectable = false;
      game.board[x][y].helpX = undefined;
    }
  }
}

// export function startTutorial2(startingBoard) {
//   // game.board = [];
//   tutorial.state = game.frames = tutorial.msgIndex = 0;
//   // game.board = createTutorialBoard(tutorial.board[tutorial.state]);
//   sound.Music[1].src = audio.trainingMusic;
//   sound.Music[1].play();
//   game.tutorialRunning = true;
//   game.humanCanPlay = false;
//   updateLevelEvents(3);
//   game.boardRiseSpeed = -2;
//   cpu.enabled = true;
//   cpu.control = true;
//   [game.cursor.x, game.cursor.y] = [2, 6];
//   document.getElementById("game-info-table").style.display = "none";
//   document.getElementById("main-info").style = "font-size: 2rem;";
//   createTutorialBoard(startingBoard);
//   // loadTutorialState(tutorial.state, tutorial.msgIndex);
// }
