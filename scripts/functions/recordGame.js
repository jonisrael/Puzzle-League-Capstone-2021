import { newBlock } from "../../puzzleleague";
import { blockType, game, grid, randomPiece, touch } from "../global";
import { tutorial } from "../tutorial/tutorialScript";
import { fixNextDarkStack } from "./startGame";

export const previous = {};
export const previousGameRecording = {};

export function recordTouchInput(frame, x, y, moveTo, type) {
  return [x, y, moveTo, type];
}

export function recordDigitalInput(frame, input) {
  return input;
}

export function playTouchInput(recordedGame, frame) {
  if (recordedGame[frame] === undefined) return;
  cpuClick(recordedGame[frame]);
}

export function playDigitalInput(recordedGame, frame, input) {
  if (recordedGame.frame === undefined) return input;
}

export function cpuClick(arr) {
  let [x, y, moveToX, type] = arr;
  touch.selectedBlock.x = x;
  touch.selectedBlock.y = y;
  if (type === "Preview") {
    game.board[x][y].previewX = moveToX;
  } else {
    game.board[x][y].targetX = moveToX;
  }
}

export function saveCurrentBoard(board, simple = true, flipped = false) {
  let currentBoard = [];
  if (simple) {
    for (let x = 0; x < grid.COLS; x++) {
      for (let y = 0; y < grid.ROWS; y++) {
        if (board[x][y].color !== "vacant") {
          let r = flipped ? grid.ROWS - y : y;
          currentBoard.push([x, r, board[x][y].color]);
        }
      }
    }
  } else {
    currentBoard = JSON.parse(JSON.stringify(board));
  }
  console.log("saving board and index", tutorial.msgIndex, currentBoard);
  return currentBoard;
}

export function createBoard(colorLocations, darkStackGiven) {
  let block;
  let board = [];
  for (let c = 0; c < grid.COLS; c++) {
    board.push([]);
    for (let r = 0; r < grid.ROWS + 2; r++) {
      block = newBlock(c, r);
      board[c].push(block);
      colorLocations.forEach((arr) => {
        let [locX, locY, definedColor] = arr;
        if (c == locX && r == locY) {
          board[c][r].color = definedColor;
        }
      });

      if (r >= grid.ROWS) {
        if (darkStackGiven) {
          if (r === grid.ROWS) board[c][r].color = darkStackGiven[0][c];
          if (r === grid.ROWS + 1) board[c][r].color = darkStackGiven[1][c];
        } else {
          board[c][r].color = randomPiece(game.level);
          board[c][r].type = blockType.DARK;
        }
      }

      block.draw();
    }
  }
  if (!darkStackGiven) board = fixNextDarkStack(board);
  console.log(board);
  return board;
}
