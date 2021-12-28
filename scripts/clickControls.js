import { action } from "./controls";
import { SelectedBlock } from "./functions/stickyFunctions";
import {
  blockIsSolid,
  CLEARING_TYPES,
  debug,
  game,
  grid,
  INTERACTIVE_TYPES,
  touch,
  win
} from "./global";

export function updateMousePosition(canvas, event, click) {
  if (!touch.enabled) return;

  const rect = canvas.getBoundingClientRect();
  const ratio = win.canvas.width / win.canvas.clientWidth;
  const pixelX = ratio * (event.clientX - rect.left - 10);
  const pixelY = ratio * (event.clientY - rect.top - 10 + game.rise);
  let x = Math.floor(pixelX / grid.SQ);
  let y = Math.floor(pixelY / grid.SQ);
  // Accept position only if inside game grid
  if (x >= 0 && x < grid.COLS && y >= 1 && y < grid.ROWS) {
    touch.mouse.x = x;
    touch.mouse.y = y;
    if (touch.mouse.clicked && game.frames) {
      game.cursor_type = blockIsSolid(game.board[x][y])
        ? "legalSelectionCursor"
        : "illegalSelectionCursor";
    }
    return true;
  }
  return false;
}

export function moveBlockByDrag(x, y) {
  if (x >= 0 && x < 6 && y > 0 && y < 12) {
    if (x < game.cursor.x) {
      game.cursor.x = x;
      game.swapPressed = true;
    }
    if (x > game.cursor.x) {
      game.cursor.x = x;
      game.swapPressed = "right";
    }
  }
}

export function selectBlock() {
  // there are two functions to be checked before trying to move the block
  let x = touch.mouse.x;
  let y = touch.mouse.y;
  let SquareClicked = game.board[x][y];

  // check if block is legally selectable
  if (
    SquareClicked.color !== "vacant" &&
    !SquareClicked.airborne &&
    (SquareClicked.type === "swapping" ||
      INTERACTIVE_TYPES.includes(SquareClicked.type))
  ) {
    touch.thereIsABlockCurrentlySelected = true; // select the block
    touch.selectedBlock.x = x;
    touch.selectedBlock.y = y;
    touch.mouseStart.x = x;
    touch.mouseStart.y = y;
    // console.log("frame", game.frames, "select block", game.board[x][y]);
    return;
  }
}

export function moveBlockByRelease() {
  if (
    touch.mouse.y <= touch.selectedBlock.y + 10 &&
    touch.mouse.y >= touch.selectedBlock.y - 10 &&
    (touch.mouse.x !== touch.selectedBlock.x ||
      touch.mouse.y !== touch.selectedBlock.y)
  ) {
    touch.target.x = touch.mouse.x; // move to x--coordinate
    touch.target.y = touch.selectedBlock.y; // remains on same row
    touch.moveToTarget = true;
    if (game.currentChain === 0) debug.updateGameState = true;
    game.swapPressed = true;
  }
  touch.thereIsABlockCurrentlySelected = false;

  let dir = touch.target.x < touch.selectedBlock.x ? -1 : 1;

  for (let i = touch.selectedBlock.x; i !== touch.target.x; i += dir) {
    console.log(game.board[i][touch.selectedBlock.y]);
    if (CLEARING_TYPES.includes(game.board[i][touch.selectedBlock.y].type)) {
      touch.target.x = i;
      touch.target.y = touch.selectedBlock.y;
      break;
    }
    touch.arrowList.push(`${i},${touch.selectedBlock.y}`);
  }
  if (touch.arrowList)
    touch.arrowList.push(`${touch.target.x},${touch.target.y}`);
  // game.cursor.x = touch.mouse.x;
  // game.cursor.y = touch.mouse.y;
}

export function createClickListeners() {
  win.canvas.addEventListener("mousedown", function(e) {
    if (!touch.enabled) return;
    touch.moveToTarget = false;
    touch.mouse.clicked = true;
    if (!updateMousePosition(win.canvas, e)) {
      // click was outside the borders of the canvas
      touch.thereIsABlockCurrentlySelected = false;
      touch.moveToTarget = false;
      return;
    }
    console.log(game.cursor, touch.mouse);
    game.cursor.x = touch.mouse.x;
    game.cursor.y = touch.mouse.y;
    if (game.frames >= 0) selectBlock();
  });

  win.canvas.addEventListener("touchdown", function(e) {
    if (!touch.enabled) return;
    touch.moveToTarget = false;
    touch.mouse.clicked = true;
    if (!updateMousePosition(win.canvas, e)) {
      // click was outside the borders of the canvas
      touch.thereIsABlockCurrentlySelected = false;
      touch.moveToTarget = false;
      return;
    }
    console.log(game.cursor, touch.mouse);
    game.cursor.x = touch.mouse.x;
    game.cursor.y = touch.mouse.y;
    if (game.frames >= 0) selectBlock();
  });

  win.canvas.addEventListener("mousemove", function(e) {
    if (!touch.enabled) return;
    // if (!updateMousePosition(win.canvas, e)) return;
    updateMousePosition(win.canvas, e);
    if (touch.mouse.clicked && !touch.thereIsABlockCurrentlySelected) {
      game.cursor.x = touch.mouse.x;
      game.cursor.y = touch.mouse.y;
      selectBlock();
    }
  });

  win.canvas.addEventListener("touchmove", function(e) {
    if (!touch.enabled) return;
    // if (!updateMousePosition(win.canvas, e)) return;
    updateMousePosition(win.canvas, e);
    if (touch.mouse.clicked && !touch.thereIsABlockCurrentlySelected) {
      game.cursor.x = touch.mouse.x;
      game.cursor.y = touch.mouse.y;
      selectBlock();
    }
  });

  document.addEventListener("mouseup", function(e) {
    if (!touch.enabled || game.frames < 0) return;
    touch.mouse.clicked = false;
    updateMousePosition(win.canvas, e);
    if (touch.thereIsABlockCurrentlySelected && !touch.moveToTarget)
      moveBlockByRelease();
  });

  document.addEventListener("touchend", function(e) {
    if (!touch.enabled || game.frames < 0) return;
    touch.mouse.clicked = false;
    updateMousePosition(win.canvas, e);
    if (touch.thereIsABlockCurrentlySelected && !touch.moveToTarget)
      moveBlockByRelease();
  });

  win.canvas.addEventListener("contextmenu", function(e) {
    if (!touch.enabled) return;
    e.preventDefault();
    if (game.frames > 0) game.raisePressed = true;
  });
}

function moveBlockByClick() {
  // Now try to move block, but not if too vertically far away from selectedBlock y
  if (
    touch.mouse.y > touch.selectedBlock.y + 2 ||
    touch.mouse.y < touch.selectedBlock.y - 2
  ) {
    game.cursor.x = touch.mouse.x;
    game.cursor.y = touch.mouse.y;
    return; // changed cursor, but no swap done.
  }
  touch.target.x = touch.mouse.x; // move based on x coordinate
  touch.target.y = touch.selectedBlock.y; // moved based on the row of the block
  touch.moveToTarget = true; // now, do continuous swapping function.
}
