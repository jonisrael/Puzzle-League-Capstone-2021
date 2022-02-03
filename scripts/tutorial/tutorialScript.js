import {
  blockType,
  cpu,
  detectInfiniteLoop,
  game,
  PIECES,
  randInt,
  sound,
  win,
} from "../global";
import { newBlock, updateLevelEvents } from "../../puzzleleague";
import { fixNextDarkStack, generateOpeningBoard } from "../functions/startGame";
import { tutorialBoards } from "./tutorialBoards";
import { tutorialMessages } from "./tutorialMessages";
import { tutorialInputs } from "./tutorialInputs";
import { audio } from "../fileImports";

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
  inputs: tutorialInputs,
  msgIndex: 0,
  cursor: tutorialCursors,
  state: 0,
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
  } else {
    console.log("new state");
    tutorial.state++;
    tutorial.msgIndex = 0;
    loadTutorialState(tutorial.state, tutorial.msgIndex);
  }
}

export function loadTutorialState(state, index = 0) {
  game.frames = game.score = game.minutes = game.seconds = 0;

  tutorial.state = state;
  tutorial.msgIndex = index;
  if (state == tutorial.board.length) {
    tutorial.state = tutorial.board.length - 1;
    console.log("tutorial complete");
    game.tutorialRunning = false;
    game.humanCanPlay = true;
    document.getElementById("game-info").style.display = "inline";
    win.running = false;
    win.restartGame = true;
    return;
  }

  if (state == tutorial.board.length - 1) {
    updateLevelEvents(1);
    game.board = generateOpeningBoard();
  } else if (state == 1) {
    game.boardRiseSpeed = -2;
    generateOpeningBoard(24, 4);
  } else {
    game.boardRiseSpeed = -2;
    [game.cursor.x, game.cursor.y] = tutorialCursors[state];
    game.board = createTutorialBoard(tutorial.board[state]);
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
  game.board = [];
  tutorial.state = game.frames = tutorial.msgIndex = 0;
  // game.board = createTutorialBoard(tutorial.board[tutorial.state]);
  sound.Music[1].src = audio.trainingMusic;
  sound.Music[1].play();
  game.tutorialRunning = true;
  game.humanCanPlay = false;
  updateLevelEvents(3);
  game.boardRiseSpeed = -2;
  cpu.enabled = true;
  cpu.control = true;
  [game.cursor.x, game.cursor.y] = [2, 6];
  document.getElementById("game-info").style.display = "none";
  document.getElementById("main-info").style = "font-size: 2rem;";
  loadTutorialState(tutorial.state, tutorial.msgIndex);
}

export function createTutorialBoard(colorLocations) {
  let block;
  let board = [];
  board.length = 0;
  for (let c = 0; c < COLS; c++) {
    board.push([]);
    for (let r = 0; r < ROWS + 2; r++) {
      block = newBlock(c, r);
      board[c].push(block);
      if (r > ROWS - 1) {
        board[c][r].color = PIECES[randInt(PIECES.length)];
        board[c][r].type = blockType.DARK;
      } else {
        colorLocations.forEach((arr) => {
          let [locX, locY, definedColor] = arr;
          if (c == locX && r == locY) {
            board[c][r].color = definedColor;
          }
        });
      }
      block.draw();
    }
  }
  for (let x = 0; x < COLS; x++) {
    // Initial Dark Stacks
    board[x][grid.ROWS].color = PIECES[randInt(PIECES.length)];
    board[x][grid.ROWS + 1].color = PIECES[randInt(PIECES.length)];
    if (x > 0) {
      win.loopCounter = 0;
      while (board[x][grid.ROWS].color == board[x - 1][grid.ROWS].color) {
        win.loopCounter++;
        if (detectInfiniteLoop("createTutorialBoard1", win.loopCounter)) break;
        board[x][grid.ROWS].color = PIECES[randInt(PIECES.length)];
      }
      win.loopCounter = 0;
      while (
        board[x][grid.ROWS + 1].color == board[x - 1][grid.ROWS + 1].color
      ) {
        win.loopCounter++;
        if (detectInfiniteLoop("createTutorialBoard2", win.loopCounter)) break;
        board[x][grid.ROWS + 1].color = PIECES[randInt(PIECES.length)];
      }
    }
  }
  board = fixNextDarkStack(board);
  return board;
}
