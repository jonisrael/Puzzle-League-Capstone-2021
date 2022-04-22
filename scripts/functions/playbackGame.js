import { newBlock } from "../../puzzleleague";
import { doMouseDown, doMouseUp } from "../clickControls";
import { action } from "../controls";
import { blockType, game, grid, randomPiece, replay, touch } from "../global";
import { tutorial } from "../tutorial/tutorialScript";
import { fixNextDarkStack } from "./startGame";

export const previous = {};
export const previousGameRecording = {};

export function playbackInputs() {
  playbackDigitalInputs();
  playbackMouseInputs();
}

function playbackMouseInputs() {
  replay.mouseInputs.forEach(([frame, mouseDown, x, y]) => {
    if (game.frames === frame) {
      // console.log("play mouse input", mouseDown, game.frames, x, y);
      mouseDown ? doMouseDown({}, x, y) : doMouseUp({}, x, y);
    }
  });
}

function playbackDigitalInputs() {
  replay.digitalInputs.forEach(([frame, input]) => {
    if (game.frames === frame) {
      // console.log("play digital input", input, game.frames);
      action[input] = true;
    }
  });
}

function cpuClick(arr) {
  let [x, y, moveToX, type] = arr;
  touch.selectedBlock.x = x;
  touch.selectedBlock.y = y;
  if (type === "Preview") {
    game.board[x][y].previewX = moveToX;
  } else {
    game.board[x][y].targetX = moveToX;
  }
}

export function saveCurrentBoard(
  board,
  simple = true,
  flipped = false,
  tutorial = false
) {
  let currentBoard = [];
  if (simple) {
    for (let x = 0; x < grid.COLS; x++) {
      for (let y = 0; y < grid.ROWS; y++) {
        if (board[x][y].color !== "vacant") {
          let r = flipped ? grid.ROWS - y : y;
          if (tutorial) r -= 4;
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
  game.board.length = 0;
  for (let c = 0; c < grid.COLS; c++) {
    game.board.push([]);
    for (let r = 0; r < grid.ROWS + 2; r++) {
      block = newBlock(c, r);
      game.board[c].push(block);
      colorLocations.forEach((arr) => {
        let [locX, locY, definedColor] = arr;
        if (c == locX && r == locY) {
          game.board[c][r].color = definedColor;
        }
      });

      if (r >= grid.ROWS) {
        if (darkStackGiven) {
          if (r === grid.ROWS) game.board[c][r].color = darkStackGiven[0][c];
          if (r === grid.ROWS + 1)
            game.board[c][r].color = darkStackGiven[1][c];
        } else {
          game.board[c][r].color = randomPiece(game.level);
          game.board[c][r].type = blockType.DARK;
        }
      }

      block.draw();
    }
  }
  if (!darkStackGiven) fixNextDarkStack();
  console.log(game.board);
}
