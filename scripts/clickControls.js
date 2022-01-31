import { action } from "./controls";
import { SelectedBlock } from "./functions/stickyFunctions";
import { trySwappingBlocks } from "./functions/swapBlock";
import {
  blockIsSolid,
  CLEARING_TYPES,
  cpu,
  debug,
  game,
  grid,
  INTERACTIVE_TYPES,
  touch,
  win,
} from "./global";

export function updateMousePosition(canvas, e) {
  if (!touch.enabled || cpu.enabled) return;
  if (e.type[0] === "t" && !e.touches[0]) return false;
  let clientX = e.type[0] === "t" ? e.touches[0].clientX : e.clientX;
  let clientY = e.type[0] === "t" ? e.touches[0].clientY : e.clientY;
  const rect = canvas.getBoundingClientRect();
  const ratio = win.canvas.width / win.canvas.clientWidth;
  // 10px is currently the border size of the canvas.
  const pixelX = ratio * (clientX - rect.left - 10);
  const pixelY = ratio * (clientY - rect.top - 10 + game.rise);
  let x = Math.floor(pixelX / grid.SQ);
  let y = Math.floor(pixelY / grid.SQ);
  // Accept position only if inside game grid
  if (x >= 0 && x < grid.COLS && y >= 1 && y < grid.ROWS) {
    touch.mouse.x = x;
    touch.mouse.y = y;
    if (touch.mouse.clicked) {
      game.cursor_type = blockIsSolid(game.board[x][y])
        ? "legalSelectionCursor"
        : "illegalSelectionCursor";
    }
    return true;
  }
  return false;
}

export function moveBlockByDrag(x, y) {
  if (!touch.enabled || cpu.enabled) return;
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
  // check if close range swap should happen

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
  if (cpu.enabled) return;
  if (
    touch.mouse.y <= touch.selectedBlock.y + 20 &&
    touch.mouse.y >= touch.selectedBlock.y - 20 &&
    (touch.mouse.x !== touch.selectedBlock.x ||
      touch.mouse.y !== touch.selectedBlock.y)
  ) {
    touch.target.x = touch.mouse.x; // move to x--coordinate
    touch.target.y = touch.selectedBlock.y; // remains on same row
    touch.moveOrderExists = true;
    game.swapPressed = true;
  }
  touch.thereIsABlockCurrentlySelected = false;

  let dir = touch.target.x < touch.selectedBlock.x ? -1 : 1;
  touch.moveType = "Move";
  for (let i = touch.selectedBlock.x; i !== touch.target.x; i += dir) {
    if (CLEARING_TYPES.includes(game.board[i][touch.selectedBlock.y].type)) {
      touch.moveType = "Buffer";
      // touch.target.x = i;
      // touch.target.y = touch.selectedBlock.y;
      // break;
    }
    touch.arrowList.push(`${i},${touch.selectedBlock.y}`);
  }
  if (CLEARING_TYPES.includes(game.board[touch.target.x][touch.target.y].type))
    touch.moveType = "Buffer";
  if (touch.arrowList)
    touch.arrowList.push(`${touch.target.x},${touch.target.y}`);
  // game.cursor.x = touch.mouse.x;
  // game.cursor.y = touch.mouse.y;
}

function doMouseDown(e) {
  if (!touch.enabled || cpu.enabled) return;
  touch.moveOrderExists = false;
  touch.mouse.clicked = true;
  if (!updateMousePosition(win.canvas, e)) {
    // click was outside the borders of the canvas
    touch.thereIsABlockCurrentlySelected = false;
    touch.moveOrderExists = false;
    return;
  }
  if (game.board[game.cursor.x][game.cursor.y].color === "vacant") {
    if (
      touch.doubleClickCounter === 1 &&
      Math.abs(touch.mouse.x - game.cursor.x) < 2 &&
      Math.abs(touch.mouse.y - game.cursor.y) < 2
    ) {
      if (game.highestRow > 1) {
        game.raisePressed = true;
        touch.doubleClickCounter = 0;
        touch.doubleClickTimer += 20;

        if (touch.doubleClickTimer > 31) touch.doubleClickTimer = 31;
      }
    }
    if (touch.doubleClickTimer === 0) touch.doubleClickTimer = 31;
    touch.doubleClickCounter++;
  }
  console.log("game cursor", game.cursor, "mouse", touch.mouse);
  touch.lastCursorPos.x = game.cursor.x;
  touch.lastCursorPos.y = game.cursor.y;
  game.cursor.x = touch.mouse.x;
  game.cursor.y = touch.mouse.y;

  if (game.frames >= 0) selectBlock();
}

function doMouseMove(e) {
  if (!touch.enabled) return;
  // if (!updateMousePosition(win.canvas, e)) return;
  updateMousePosition(win.canvas, e);
  if (touch.mouse.clicked && !touch.thereIsABlockCurrentlySelected) {
    game.cursor.x = touch.mouse.x;
    game.cursor.y = touch.mouse.y;
    selectBlock();
  }
}

function doMouseUp(e) {
  if (!touch.enabled) return;
  touch.mouse.clicked = false;
  updateMousePosition(win.canvas, e);
  if (touch.thereIsABlockCurrentlySelected && !touch.moveOrderExists) {
    moveBlockByRelease();
  }

  // if (
  //   touch.lastCursorPos.y == game.cursor.y &&
  //   Math.abs(game.cursor.x - touch.lastCursorPos.x) == 1
  // ) {
  //   if (game.cursor.x - touch.lastCursorPos.x == 1) {
  //     trySwappingBlocks(touch.lastCursorPos.x, touch.lastCursorPos.y);
  //   } else if (game.cursor.x - touch.lastCursorPos.x == -1) {
  //     trySwappingBlocks(game.cursor.x, game.cursor.y);
  //   }
  // } else {
  //   moveBlockByRelease();
  // }
}

export function createClickListeners() {
  win.canvas.addEventListener("mousedown", function(e) {
    doMouseDown(e);
  });

  win.canvas.addEventListener("touchstart", function(e) {
    e.preventDefault();
    doMouseDown(e);
  });

  win.canvas.addEventListener("mousemove", function(e) {
    doMouseMove(e);
  });

  win.canvas.addEventListener("touchmove", function(e) {
    e.preventDefault();
    doMouseMove(e);
  });

  document.addEventListener("mouseup", function(e) {
    doMouseUp(e);
  });

  win.canvas.addEventListener("touchend", function(e) {
    e.preventDefault();
    doMouseUp(e);
  });

  win.canvas.addEventListener("contextmenu", function(e) {
    if (!touch.enabled) return;
    e.preventDefault();
    if (game.frames > 0) game.raisePressed = true;
  });
}

// function moveBlockByClick() {
//   // Now try to move block, but not if too vertically far away from selectedBlock y
//   if (
//     touch.mouse.y > touch.selectedBlock.y + 2 ||
//     touch.mouse.y < touch.selectedBlock.y - 2
//   ) {
//     game.cursor.x = touch.mouse.x;
//     game.cursor.y = touch.mouse.y;
//     return; // changed cursor, but no swap done.
//   }
//   touch.target.x = touch.mouse.x; // move based on x coordinate
//   touch.target.y = touch.selectedBlock.y; // moved based on the row of the block
//   touch.moveOrderExists = true; // now, do continuous swapping function.
// }
