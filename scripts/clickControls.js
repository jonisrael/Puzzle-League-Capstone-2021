import {
  blockIsSolid,
  CLEARING_TYPES,
  cpu,
  debug,
  game,
  grid,
  INTERACTIVE_TYPES,
  removeFromOrderList,
  replay,
  touch,
  touchInputs,
  win,
} from "./global";
import { nextDialogue, tutorial } from "./tutorial/tutorialScript";

export function updateMousePosition(canvas, e) {
  if (!touch.enabled || cpu.control || game.playRecording) return;
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
//   if (!touch.enabled || cpu.control) return;
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
  if (cpu.control) return;
  let Square = game.board[x][y];
  if (Square.x === targetX) return;
  Square.targetX = targetX; // move to x--coordinate
  touch.moveOrderList.push([Square.targetX, Square.y]);
  touch.mouse.clicked = false;
  if (
    touch.mouse.y <= touch.selectedBlock.y + 20 &&
    touch.mouse.y >= touch.selectedBlock.y - 20 &&
    (targetX !== touch.selectedBlock.x ||
      touch.mouse.y !== touch.selectedBlock.y)
  ) {
    touch.moveOrderExists = true;
  }
  touch.thereIsABlockCurrentlySelected = false;
}

export function moveBlockByReleaseNew(x, y, targetX, targetY = y) {
  if (cpu.control) return;
  let Square = game.board[x][y];
  if (Square.x === targetX && Square.y === targetY) return;
  Square.targetX = targetX; // move to x--coordinate
  Square.targetY = targetY; // move to y--coordinate
  touch.moveOrderList.push([Square.targetX, Square.targetY]);
  touch.mouse.clicked = false;
  if (
    touch.mouse.y <= touch.selectedBlock.y + 20 &&
    touch.mouse.y >= touch.selectedBlock.y - 20 &&
    targetX !== touch.selectedBlock.x &&
    targetY !== touch.selectedBlock.y
  ) {
    touch.moveOrderExists = true;
  }
  touch.thereIsABlockCurrentlySelected = false;
}

export function doMouseDown(e, virtualX, virtualY) {
  if (!game.humanCanPlay || !touch.enabled || cpu.control) {
    if (game.mode === "tutorial" && !game.paused) {
      nextDialogue(tutorial.msgIndex);
    }
    return;
  }

  if (!touch.enabled || cpu.control) return;
  touch.moveOrderExists = false;
  touch.mouse.clicked = true;
  if (!game.disableRaise) {
    touch.multiClickCounter++;
    touch.multiClickTimer += 20;
  } else {
    touch.multiClickCounter = 0;
    touch.multiClickTimer = 0;
  }
  if (virtualX !== undefined) {
    touch.mouse.x = virtualX;
    touch.mouse.y = virtualY;
  } else if (!updateMousePosition(win.cvs, e)) {
    return; // ran updateMouse function, click was out of bounds
  }
  if (!virtualX && !updateMousePosition(win.cvs, e)) {
    return;
  }
  if (virtualX) {
    touch.mouse.x = virtualX;
    touch.mouse.y = virtualY;
  }
  if (
    touch.multiClickCounter >= 2 &&
    Math.abs(touch.mouse.x - game.cursor.x) < 2 &&
    Math.abs(touch.mouse.y - game.cursor.y) < 2
  ) {
    if (touch.multiClickCounter === 3) {
      console.log(
        "Multi Click clicked 3 times. current timer:",
        touch.multiClickTimer
      );
      touch.multiClickCounter = 0;
      for (let x = 0; x < grid.COLS; x++) {
        for (let y = 0; y < grid.ROWS; y++) {
          removeFromOrderList(game.board[x][y]);
        }
      }
    }

    if (
      !game.disableRaise &&
      game.board[game.cursor.x][game.cursor.y].color === "vacant"
    ) {
      if (game.highestRow > 1) {
        game.raisePressed = true;
      } else {
        game.flashDangerColumns = 50;
      }
    }
  }
  if (touch.multiClickTimer > 31) touch.multiClickTimer = 31;
  if (touch.multiClickTimer === 0) touch.multiClickTimer = 31;
  selectBlock(touch.mouse.x, touch.mouse.y);
  if (!game.paused && !game.playRecording)
    replay.mouseInputs.push([game.frames, true, touch.mouse.x, touch.mouse.y]);
}

function doMouseMove(e, virtual = false) {
  if (!game.humanCanPlay) return;
  if (!touch.enabled) return;
  if (!virtual) updateMousePosition(win.cvs, e);
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

export function doMouseUp(e, virtualX, virtualY) {
  if (!game.humanCanPlay) return;
  if (!touch.enabled) return;
  touch.mouse.clicked = false;
  // virtualX used by replays and AI
  virtualX === undefined
    ? updateMousePosition(win.cvs, e)
    : ([touch.mouse.x, touch.mouse.y] = [virtualX, virtualY]);
  if (debug.enabled && game.paused) {
    console.log(game.board[touch.mouse.x][touch.mouse.y]);
    if (game.mode === "tutorial") {
      console.log("action:", game.board[0][grid.ROWS].timer);
    }
  }

  if (touch.thereIsABlockCurrentlySelected && !touch.moveOrderExists) {
    const SelectedBlock =
      game.board[touch.selectedBlock.x][touch.selectedBlock.y];
    moveBlockByRelease(
      SelectedBlock.x,
      SelectedBlock.y,
      touch.mouse.x,
      touch.mouse.y
    );
    SelectedBlock.previewX = undefined;
  }
  touch.thereIsABlockCurrentlySelected = false;
  if (!game.paused && !game.playRecording)
    replay.mouseInputs.push([game.frames, false, touch.mouse.x, touch.mouse.y]);
}

export function updateCPUMouse(x, y, destinationX) {
  let BlockSelectedByCPU = game.board[x][y];
  let type = "move";
  if (!touch.mouse.clicked) type === "down";
  else if (touch.mouse.clicked && x === destinationX) {
    type === "up";
  }

  if (debug.enabled) console.log("selected block", x, y);
  console.log("click type:", type, x, y, destinationX);
  if (type === "down") {
    touch.mouse.clicked = true;
    touch.mouse.x = x;
    touch.mouse.y = y;
    selectBlock(BlockSelectedByCPU.x, BlockSelectedByCPU.y);
  }
  if (type === "move" && touch.mouse.clicked) {
    game.board[x][y].previewX = destinationX;
    touch.mouse.x = destinationX;
    touch.mouse.y = y;
  }
  if (type === "up") {
    touch.mouse.clicked = false;
    if (touch.thereIsABlockCurrentlySelected && !touch.moveOrderExists) {
      moveBlockByRelease(x, y, destinationX);
      BlockSelectedByCPU.previewX = undefined;
      touch.mouse.x = destinationX;
      touch.mouse.y = y;
    }
    touch.thereIsABlockCurrentlySelected = false;
  }
}

export function doCpuTouchInputs(x, y, destinationX, destinationY, dir) {
  if (touch.moveOrderExists) return;
  let BlockSelectedByCPU = game.board[x][y];
  game.cursor.x = touch.mouse.x = x;
  game.cursor.y = touch.mouse.y = y;
  cpu.directionToMove = dir;
  if (!touch.mouse.clicked) {
    touch.mouse.clicked = true;
    selectBlock(x, y);
    console.log(game.frames, "cpu mouse down");
    return;
  }
  if (BlockSelectedByCPU.previewX === undefined) {
    console.log(game.frames, "cpu time to move", touch.mouse.x, touch.mouse.y);
    BlockSelectedByCPU.previewX = BlockSelectedByCPU.x + cpu.directionToMove;
    touch.mouse.x = BlockSelectedByCPU.previewX;
    touch.mouse.y = BlockSelectedByCPU.y;
    return;
  }
  if (BlockSelectedByCPU.previewX !== destinationX) {
    BlockSelectedByCPU.previewX += cpu.directionToMove;
    touch.mouse.x = BlockSelectedByCPU.previewX;
    touch.mouse.y = BlockSelectedByCPU.y;
    console.log(game.frames, "cpu still moving", touch.mouse.x, touch.mouse.y);
    return;
  } else if (BlockSelectedByCPU.previewX === destinationX) {
    console.log(game.frames, "cpu mouse up");
    BlockSelectedByCPU.targetX = BlockSelectedByCPU.previewX;
    BlockSelectedByCPU.previewX = undefined;
    moveBlockByRelease(
      BlockSelectedByCPU.x,
      BlockSelectedByCPU.y,
      BlockSelectedByCPU.previewX
    );
    BlockSelectedByCPU.previewX = undefined;
    touch.mouse.x = BlockSelectedByCPU.targetX;
    touch.mouse.y = BlockSelectedByCPU.y;
  }
}

export function createClickListeners() {
  win.cvs.addEventListener("mousedown", function(e) {
    if (game.playRecording) return;
    doMouseDown(e);
  });

  win.cvs.addEventListener("touchstart", function(e) {
    if (game.playRecording) return;
    e.preventDefault();
    doMouseDown(e);
  });

  win.cvs.addEventListener("mousemove", function(e) {
    if (game.playRecording) return;
    doMouseMove(e);
  });

  win.cvs.addEventListener("touchmove", function(e) {
    if (game.playRecording) return;
    e.preventDefault();
    doMouseMove(e);
  });

  document.addEventListener("mouseup", function(e) {
    if (game.playRecording) return;
    doMouseUp(e);
  });

  win.cvs.addEventListener("touchend", function(e) {
    if (game.playRecording) return;
    e.preventDefault();
    doMouseUp(e);
  });

  win.cvs.addEventListener("contextmenu", function(e) {
    if (game.playRecording) return;
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
