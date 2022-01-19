import { blockType, cpu, game, PIECES, randInt, win } from "../global";
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
  [-2, -6],
  [2, 6],
  [1, ROWS - 1],
  [0, ROWS - 4],
  [2, ROWS - 2],
  [2, ROWS - 2],
];

export const tutorial = {
  board: tutorialBoards,
  inputs: tutorialInputs,
  message: tutorialMessages,
  cursor: tutorialCursors,
  state: 0,
};

console.log(tutorial);

export function loadTutorialState(state, frame = 0) {
  game.frames = game.score = game.minutes = game.seconds = 0;

  tutorial.state = state;
  if (state == tutorial.board.length) {
    tutorial.state = tutorial.board.length - 1;
    game.tutorialRunning = false;
    win.running = false;
    win.restartGame = true;
    return;
  }

  if (state == tutorial.board.length - 1) {
    updateLevelEvents(1);
    game.board = generateOpeningBoard();
  } else {
    game.cursor.visible = state !== 0;
    [game.cursor.x, game.cursor.y] = tutorialCursors[state];
    createTutorialBoard(tutorial.board[state]);
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
    loadTutorialState(state);
    // cpu.control = true;
  }
  return input;
}

export function startTutorial() {
  game.board = [];
  tutorial.state = game.frames = 0;
  // game.board = createTutorialBoard(tutorial.board[tutorial.state]);
  game.Music.src = audio.trainingMusic;
  game.Music.play();
  game.tutorialRunning = true;
  updateLevelEvents(3);
  game.boardRiseSpeed = 1000;
  cpu.enabled = true;
  cpu.control = true;
  [game.cursor.x, game.cursor.y] = [2, 6];
  loadTutorialState(tutorial.state, game.frames);
}

export function createTutorialBoard(colorLocations) {
  let block;
  console.log(game.frames, "creating tutorial board,", tutorial.state);
  game.board.length = 0;
  for (let c = 0; c < COLS; c++) {
    game.board.push([]);
    for (let r = 0; r < ROWS + 2; r++) {
      block = newBlock(c, r);
      game.board[c].push(block);
      if (r > ROWS - 1) {
        game.board[c][r].color = PIECES[randInt(PIECES.length)];
        game.board[c][r].type = blockType.DARK;
      } else {
        colorLocations.forEach((arr) => {
          let [locX, locY, definedColor] = arr;
          if (c == locX && r == locY) {
            game.board[c][r].color = definedColor;
          }
        });
      }
      block.draw();
    }
  }
  for (let x = 0; x < COLS; x++) {
    // Initial Dark Stacks
    game.board[x][12].color = PIECES[randInt(PIECES.length)];
    game.board[x][13].color = PIECES[randInt(PIECES.length)];
    if (x > 0) {
      while (game.board[x][12].color == game.board[x - 1][12].color) {
        game.board[x][12].color = PIECES[randInt(PIECES.length)];
      }
      while (game.board[x][13].color == game.board[x - 1][13].color) {
        game.board[x][13].color = PIECES[randInt(PIECES.length)];
      }
    }
  }
  fixNextDarkStack();
  return game.board;
}
