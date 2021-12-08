import { action } from "./controls";
import { debug, game, grid, INTERACTIVE_TYPES, touch, win } from "./global";

export function updateMousePosition(canvas, event, click) {
  if (!touch.enabled) return;

  const rect = canvas.getBoundingClientRect();
  const pixelX = event.clientX - rect.left - 10;
  const pixelY = event.clientY - rect.top - 10 + game.rise;
  let x = Math.floor(pixelX / grid.SQ);
  let y = Math.floor(pixelY / grid.SQ);
  // Accept position only if inside game grid
  if (x >= 0 && x < grid.COLS && y >= 1 && y < grid.ROWS) {
    touch.mouse.x = x;
    touch.mouse.y = y;
    return true;
  }
  // else the mouse is outside the grid
  // touch.thereIsABlockCurrentlySelected = false;
  // touch.continueSwapping = false;
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
    game.swapPressed = true;
    // console.log("block target:", game.board[touch.target.x][touch.target.y]);
  }
  touch.thereIsABlockCurrentlySelected = false;
  // game.cursor.x = touch.mouse.x;
  // game.cursor.y = touch.mouse.y;
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

export function createClickListeners() {
  win.canvas.addEventListener("mousedown", function(e) {
    if (!debug.show) return;
    if (!touch.enabled) return;
    touch.mouse.clicked = true;
    game.cursor_type = "single_cursor";
    if (!updateMousePosition(win.canvas, e)) {
      // click was outside the borders of the canvas
      touch.thereIsABlockCurrentlySelected = false;
      touch.moveToTarget = false;
      return;
    }
    game.cursor.x = touch.mouse.x;
    game.cursor.y = touch.mouse.y;
    selectBlock();
  });

  win.canvas.addEventListener("mousemove", function(e) {
    if (!debug.show) return;
    if (!touch.enabled) return;
    // if (!updateMousePosition(win.canvas, e)) return;
    updateMousePosition(win.canvas, e);
    // if (!touch.thereIsABlockCurrentlySelected && !touch.moveToTarget)
    //   selectBlock();
    // if (
    //   touch.mouse.x !== touch.selectedBlock.x &&
    //   touch.thereIsABlockCurrentlySelected
    // ) {
    //   // update visible cursor & target
    //   touch.target.x = touch.visibleCursor.x = touch.mouse.x;
    //   touch.target.y = touch.visibleCursor.y = touch.mouse.y;
    //   moveBlockByDrag(touch.selectedBlock.x, touch.selectedBlock.y);
    // }
  });

  document.addEventListener("mouseup", function(e) {
    if (!debug.show) return;
    if (!touch.enabled || game.frames < 0) return;
    touch.mouse.clicked = false;
    updateMousePosition(win.canvas, e);
    if (touch.thereIsABlockCurrentlySelected && !touch.moveToTarget)
      moveBlockByRelease();
  });

  win.canvas.addEventListener("contextmenu", function(e) {
    if (!debug.show) return;
    if (!touch.enabled) return;
    e.preventDefault();
    if (game.frames > 0) game.raisePressed = true;
  });
}

// export function selectBlockWithClick(x, y) {
//   if (x >= 0 && x < 6 && y > 0 && y < 12) {
//     if (!touch.down) {
//       touch.blockSelectedXCHANGE = x;
//       touch.blockSelectedYCHANGE = y;
//     }
//     game.cursor.x = x;
//     game.cursor.y = y;
//     game.cursor_type = "single_cursor";
//   }
// }

// // function logButtons(e) {
// //   console.log(`${e.buttons} (${e.type})`); // log.nodeValue= `${e.buttons} (${e.type})`;
// // }

// export function findBlockInfoByPosition(x, y) {
//   let pixelX = x - 10;
//   let pixelY = y - 10 + game.rise;
//   let blockXInt = Math.floor(pixelX / grid.SQ);
//   let blockYInt = Math.floor(pixelY / grid.SQ);
//   // change touch click coordinates
//   if (!touch.down) {
//     touch.lastClickedXCHANGE = blockXInt;
//     touch.lastClickedYCHANGE = blockYInt;
//   }

//   let newPosition = "";
//   // console.log(blockXInt, blockYInt, game.rise, pixelX, pixelY);
//   // console.log(Math.floor(pixelX), Math.floor(pixelY));
//   if (
//     blockXInt >= 0 &&
//     blockXInt <= grid.COLS - 1 &&
//     blockYInt > 0 &&
//     blockYInt <= grid.ROWS - 1
//   ) {
//     if (blockXInt < game.cursor.x && !touch.down) newPosition = "left";
//     if (blockXInt > game.cursor.x && !touch.down) newPosition = "right";
//     if (blockYInt < game.cursor.y) newPosition = "up";
//     if (blockYInt > game.cursor.y) newPosition = "down";
//     if (newPosition) {
//       game.cursor.x = blockXInt;
//       game.cursor.y = blockYInt;
//     }

//     game.cursor_type = "single_cursor";
//     if (newPosition) {
//       console.log(
//         newPosition,
//         "Clicked Coordinate:",
//         blockXInt,
//         blockYInt,
//         game.board[blockXInt][blockYInt],
//         `FRAME ${game.frames}\n`,
//         "Pixel:",
//         pixelX,
//         pixelY
//       );
//     }
//     if (newPosition === "left" && touch.down) {
//       game.swapPressed = true;
//     }
//     if (newPosition === "right" && touch.down) {
//       game.swapPressed = "right";
//     }
//   }
// }
