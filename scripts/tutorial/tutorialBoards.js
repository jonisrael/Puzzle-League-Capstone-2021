import { blockType, cpu, game, PIECES, randInt, randomPiece } from "../global";
import { newBlock, updateLevelEvents } from "../../puzzleleague";
import { fixNextDarkStack, generateOpeningBoard } from "../functions/startGame";
import { tutorialBoard, tutorialInputs } from "./tutorialScript";
const COLS = 6;
const ROWS = 8;

export const tutorialBoards = [
  [
    [0, 3, "cyan"],
    [0, 4, "cyan"],
    [0, 5, "green"],
    [0, 6, "red", -2], // starting block
    [0, 7, "cyan"],
    [1, 2, "cyan"],
    [1, 3, "cyan"],
    [1, 4, "green"],
    [1, 5, "red", -2],
    [1, 6, "purple"],
    [1, 7, "red", -2],
    [2, 7, "yellow"],
    [4, 2, "purple"],
    [4, 3, "red"],
    [4, 4, "purple"],
    [4, 5, "red"],
    [4, 6, "purple"],
    [4, 7, "yellow"],
    [5, 3, "red"],
    [5, 4, "purple"],
    [5, 5, "red"],
    [5, 6, "yellow"],
    [5, 7, "yellow"],
  ],
  [
    [2, 7, "purple"],
    [2, 8, "red"],
    [2, 9, "purple"],
    [2, 10, "red"],
    [2, 11, "purple"],
    [3, 7, "red"],
    [3, 8, "purple"],
    [3, 9, "red"],
    [3, 10, "purple"],
    [3, 11, "red"],
  ],
  [
    [0, 6, "cyan", true, 2],
    [0, 7, "green"],
    [1, 7, "yellow"],
    [2, 7, "green"],
    [3, 4, "red"],
    [3, 5, "red"],
    [3, 6, "cyan"],
    [3, 7, "red"],
    [4, 6, "cyan"],
    [4, 7, "purple"],
    [5, 7, "purple"],
  ],
  [],
  [],
  [],
  [],
];

export function runTutorialScript(input, frame) {
  let thisFrameInput = tutorialInputs[frame];
  if (thisFrameInput !== undefined) {
    input[thisFrameInput] = true;
  }
  if (frame == Object.keys(tutorialInputs).pop()) {
    updateLevelEvents(1);
    cpu.control = true;
  }
  return input;
}

export function createTutorialBoard(colorLocations) {
  let block;
  for (let c = 0; c < COLS; c++) {
    game.board.push([]);
    for (let r = 0; r < ROWS + 2; r++) {
      block = newBlock(c, r);
      block.tutorialSelectable = false;
      game.board[c].push(block);
      game.board[c][r].tutorialSelectable = false;
      if (r > ROWS - 1) {
        game.board[c][r].color = randomPiece(game.level);
        game.board[c][r].type = blockType.DARK;
      } else {
        colorLocations.forEach((arr) => {
          let [locX, locY, definedColor, timer] = arr;
          if (c == locX && r == locY) {
            game.board[c][r].color = definedColor;
            // if (definedColor === "unmatchable") {
            //   // prevent color from being unmatchable
            //   definedColor = `unmatchable${locX}${locY}`;
            // }
            if (timer !== undefined) game.board[c][r].timer = timer;
          }
        });
      }
      block.draw();
    }
  }
  game.board = fixNextDarkStack(game.board);
  return game.board;
}

// flatten stack board
// [
//   [0, 1, "purple"],
//   [0, 2, "blue"],
//   [0, 3, "yellow"],
//   [0, 4, "green"],
//   [0, 5, "red"],
//   [0, 6, "blue"],
//   [0, 7, "yellow"],
//   [0, 8, "red"],
//   [0, 9, "purple"],
//   [0, 10, "green"],
//   [0, 11, "cyan"],
//   [1, 10, "cyan"],
//   [1, 11, "red"],
//   [3, 11, "blue"],
//   [4, 10, "yellow"],
//   [4, 11, "green"],
//   [5, 10, "cyan"],
//   [5, 11, "yellow"],
// ];
