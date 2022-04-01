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
  removeFromOrderList,
  touch,
  touchInputs,
  win,
} from "./global";
import { nextDialogue, tutorial } from "./tutorial/tutorialScript";

export function updateMousePosition(canvas, e) {
  if (!touch.enabled || cpu.enabled) return;
  if (e.type[0] === "t" && !e.touches[0]) return false;
  let clientX = e.type[0] === "t" ? e.touches[0].clientX : e.clientX;
  let clientY = e.type[0] === "t" ? e.touches[0].clientY : e.clientY;
  const rect = canvas.getBoundingClientRect();
  const ratio = win.cvs.height / win.cvs.clientHeight;
  // 10px is currently the border size of the canvas.
  const pixelX = ratio * (clientX - rect.left - 10);
  const pixelY = ratio * (clientY - rect.top - 10) + game.rise;
  let x = Math.floor(pixelX / grid.SQ);
  let y = Math.floor(pixelY / grid.SQ);

  // Accept position only if inside game grid
  if (x >= 0 && x < grid.COLS && y >= 1 && y < grid.ROWS) {
    touch.mouse.x = x;
    touch.mouse.y = y;
    return true;
  }
  return false;
}

// export function moveBlockByDrag(x, y) {
//   if (!touch.enabled || cpu.enabled) return;
//   if (x >= 0 && x < 6 && y > 0 && y < 12) {
//     if (x < game.cursor.x) {
//       game.cursor.x = x;
//       game.swapPressed = true;
//     }
//     if (x > game.cursor.x) {
//       game.cursor.x = x;
//       game.swapPressed = "right";
//     }
//   }
// }

export function selectBlock(x, y) {
  // there are two functions to be checked before trying to move the block
  // if (touchInputs[game.frames] === undefined) {
  //   touchInputs[game.frames] = [x, y, "select", undefined];
  // }

  game.cursor.x = touch.mouse.x;
  game.cursor.y = touch.mouse.y;
  game.cursor_type = "legalCursorDown";
  let SquareClicked = game.board[x][y];
  // check if close range swap should happen

  // check if block is legally selectable
  if (
    SquareClicked.color !== "vacant" &&
    !SquareClicked.airborne &&
    (SquareClicked.type === "swapping" ||
      INTERACTIVE_TYPES.includes(SquareClicked.type))
  ) {
    if (game.mode === "tutorial" && !SquareClicked.tutorialSelectable) return;
    touch.thereIsABlockCurrentlySelected = true; // select the block
    touch.selectedBlock.x = x;
    touch.selectedBlock.y = y;
    // console.log("frame", game.frames, "select block", game.board[x][y]);
    return;
  }
}

export function moveBlockByRelease(x, y, targetX) {
  if (cpu.enabled) return;
  let Square = game.board[x][y];
  // touchInputs[game.frames] = [x, y, "release", targetX];
  if (Square.x === targetX) return;
  Square.targetX = targetX; // move to x--coordinate
  touch.moveOrderList.push([Square.targetX, Square.y]);
  // console.log(
  //   game.frames,
  //   touch.moveOrderList,
  //   "new order added:",
  //   touch.moveOrderList[0]
  // );
  touch.mouse.clicked = false;
  if (
    touch.mouse.y <= touch.selectedBlock.y + 20 &&
    touch.mouse.y >= touch.selectedBlock.y - 20 &&
    (targetX !== touch.selectedBlock.x ||
      touch.mouse.y !== touch.selectedBlock.y)
  ) {
    touch.moveOrderExists = true;
    // console.log(
    //   game.board[0][y].targetX !== 0 ? game.board[0][y].targetX : "0",
    //   game.board[1][y].targetX !== 1 ? game.board[1][y].targetX : "1",
    //   game.board[2][y].targetX !== 2 ? game.board[2][y].targetX : "2",
    //   game.board[3][y].targetX !== 3 ? game.board[3][y].targetX : "3",
    //   game.board[4][y].targetX !== 4 ? game.board[4][y].targetX : "4",
    //   game.board[5][y].targetX !== 5 ? game.board[5][y].targetX : "5"
    // );
    // game.swapPressed = true;
  }
  touch.thereIsABlockCurrentlySelected = false;

  // let dir = Square.targetX < x ? -1 : 1;
  // let arrowList = [];
  // let arrowMoveType = "Move";
  // for (let i = touch.selectedBlock.x; i !== TargetSquare.x; i += dir) {
  //   if (CLEARING_TYPES.includes(game.board[i][y].type)) {
  //     arrowMoveType = "Buffer";
  //   }
  //   arrowList.push(`${i},${y}`);
  // }
  // if (CLEARING_TYPES.includes(TargetSquare.type)) arrowMoveType = "Buffer";
  // if (touch.moveOrderExists)
  //   arrowList.push(`${TargetSquare.x},${TargetSquare.y}`);

  // // add to global list of arrows if there is a list of arrows
  // if (arrowList.length) {
  //   touch.arrowLists.push(arrowList);
  //   touch.arrowMoveTypes.push(arrowMoveType);
  // }
  // game.cursor.x = touch.mouse.x;
  // game.cursor.y = touch.mouse.y;
}

function doMouseDown(e) {
  if (!game.humanCanPlay || !touch.enabled || cpu.enabled) {
    if (game.mode === "tutorial" && !game.paused) {
      nextDialogue(tutorial.msgIndex);
    }
    return;
  }

  if (!touch.enabled || cpu.enabled) return;
  touch.moveOrderExists = false;
  touch.mouse.clicked = true;
  if (!game.disableRaise) {
    touch.doubleClickCounter++;
    touch.doubleClickTimer += 20;
  } else {
    touch.doubleClickCounter = 0;
    touch.doubleClickTimer = 0;
  }

  if (!updateMousePosition(win.cvs, e)) {
    // click was outside the borders of the canvas
    // touch.thereIsABlockCurrentlySelected = false;
    // touch.moveOrderExists = false;
    return;
  }
  if (
    touch.doubleClickCounter === 2 &&
    Math.abs(touch.mouse.x - game.cursor.x) < 2 &&
    Math.abs(touch.mouse.y - game.cursor.y) < 2
  ) {
    touch.doubleClickCounter = 0;
    if (touch.moveOrderList.length > 0) {
      // touch.moveOrderList.length = 0; // ! WILL CANCEL ALL ORDERS
      // let [tarX, y] = touch.moveOrderList.pop();
      // for (let i = 0; i < tarX; i++) {
      //   if (0 === 0 && game.board[i][y].targetX === tarX) {
      //     game.board[i][y].targetX = undefined;
      //     // if (debug.enabled)
      //     //   console.log("Remaining orders:", touch.moveOrderList);
      //     break;
      //   }
      // }
    }
    for (let x = 0; x < grid.COLS; x++) {
      for (let y = 0; y < grid.ROWS; y++) {
        removeFromOrderList(game.board[x][y]);
      }
    }

    if (
      !game.disableRaise &&
      game.board[game.cursor.x][game.cursor.y].color === "vacant" &&
      game.highestRow > 1
    ) {
      // touchInputs[game.frames] = [
      //   touch.mouse.x,
      //   touch.mouse.y,
      //   "raise",
      //   undefined,
      // ];
      game.raisePressed = true;
    }
    // else {
    //   touchInputs[game.frames] = [
    //     touch.mouse.x,
    //     touch.mouse.y,
    //     "cancelAll",
    //     undefined,
    //   ];
    // }
  }
  if (touch.doubleClickTimer > 31) touch.doubleClickTimer = 31;
  if (touch.doubleClickTimer === 0) touch.doubleClickTimer = 31;
  selectBlock(touch.mouse.x, touch.mouse.y);
}

function doMouseMove(e) {
  if (!game.humanCanPlay) return;
  if (!touch.enabled) return;
  // if (!updateMousePosition(win.cvs, e)) return;
  updateMousePosition(win.cvs, e);
  touch.mouseChangedX = false;
  if (touch.mouse.clicked) {
    if (touch.mouse.x !== touch.lastXMoused) {
      touch.mouseChangedX = true;
      touch.lastXMoused = touch.mouse.x;
    }
    if (!touch.thereIsABlockCurrentlySelected) {
      selectBlock(touch.mouse.x, touch.mouse.y);
    } else {
      const SelectedBlock =
        game.board[touch.selectedBlock.x][touch.selectedBlock.y];
      SelectedBlock.previewX = touch.mouse.x;
      // touchInputs[game.frames] = [
      //   SelectedBlock.x,
      //   SelectedBlock.y,
      //   "premove",
      //   SelectedBlock.previewX,
      // ];
    }
  }
}

function doMouseUp(e) {
  if (!game.humanCanPlay) return;
  if (!touch.enabled) return;
  touch.mouse.clicked = false;
  updateMousePosition(win.cvs, e);
  if (debug.enabled && game.paused) {
    console.log(game.board[touch.mouse.x][touch.mouse.y]);
    if (game.mode === "tutorial") {
      console.log("action:", game.board[0][grid.ROWS].timer);
    }
  }
  if (touch.thereIsABlockCurrentlySelected && !touch.moveOrderExists) {
    const SelectedBlock =
      game.board[touch.selectedBlock.x][touch.selectedBlock.y];
    moveBlockByRelease(SelectedBlock.x, SelectedBlock.y, touch.mouse.x);
    SelectedBlock.previewX = undefined;
  }
  touch.thereIsABlockCurrentlySelected = false;
}

export function createClickListeners() {
  win.cvs.addEventListener("mousedown", function(e) {
    doMouseDown(e);
  });

  win.cvs.addEventListener("touchstart", function(e) {
    e.preventDefault();
    doMouseDown(e);
  });

  win.cvs.addEventListener("mousemove", function(e) {
    doMouseMove(e);
  });

  win.cvs.addEventListener("touchmove", function(e) {
    e.preventDefault();
    doMouseMove(e);
  });

  document.addEventListener("mouseup", function(e) {
    doMouseUp(e);
  });

  win.cvs.addEventListener("touchend", function(e) {
    e.preventDefault();
    doMouseUp(e);
  });

  win.cvs.addEventListener("contextmenu", function(e) {
    if (!touch.enabled) return;
    e.preventDefault();
    // if (game.frames > 0) game.raisePressed = true;
    if (touch.moveOrderList.length > 0) {
      // console.log(
      //   game.frames,
      //   touch.moveOrderList,
      //   "interrupt touch move order",
      //   touch.moveOrderList[0]
      // );
      let [tarX, y] = touch.moveOrderList.pop();
      for (let i = 0; i < grid.COLS; i++) {
        if (game.board[i][y].targetX === tarX) {
          game.board[i][y].targetX = undefined;
          // console.log("Remaining orders:", touch.moveOrderList);
          break;
        }
      }
    }
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
//   Square.x = touch.mouse.x; // move based on x coordinate
//   Square.y = touch.selectedBlock.y; // moved based on the row of the block
//   touch.moveOrderExists = true; // now, do continuous swapping function.
// }
