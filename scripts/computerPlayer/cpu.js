import {
  game,
  grid,
  blockColor,
  PIECES,
  INTERACTIVE_TYPES,
  cpu,
  win,
  randInt
} from "../global";
import { sprite } from "../fileImports";
import { findHorizontalMatches } from "./findHorizontalMatches";
import { findVerticalMatches } from "./findVerticalMatches";
import { flattenStack } from "./flattenStack";

// hole check order, prioritizing center
const default_hole_check_order = [2, 1, 3, 0, 4, 5];

// block check order, closest to hole

// const direction = [
//   [1, 2, 3, 4, 5],
//   [-1, 1, 2, 3, 4],
//   [-1, 1, -2, 2]

// ]

// order closest to index, prioritizing center
const order = [
  [0, 1, 2, 3, 4],
  [1, 0, 2, 3, 4],
  [2, 1, 3, 0, 4],
  [3, 2, 4, 1, 0],
  [4, 3, 2, 1, 0],
  [4, 3, 2, 1, 0]
];

// order closest to index, prioritizing edge
const reverseOrder = [
  [0, 1, 2, 3, 4],
  [1, 0, 4, 3, 2]
];

const direction = [
  [1, 1, 1, 1, 1], // 0
  [0, 2, 3, 4, 5], // 1
  [1, 3, 0, 4, 5], // 2
  [4, 2, 5, 1, 0], // 3
  [5, 3, 2, 1, 0], // 4
  [4, 3, 2, 1, 0] // 5
];

export function cpuAction(input) {
  win.mainInfoDisplay.style.color = "green";
  // if (game.frames % 4 < 2) return input;
  let stackMinimum = 4;
  let targetX;
  let targetY;
  let swapAtTarget = false;
  let stackSize = 12 - game.highestRow;
  let coordinates = false;
  let dir =
    game.highestCols[0] < 3 ? [0, grid.COLS - 1, 1] : [grid.COLS - 1, 0, -1];

  // if (game.highestRow < 5 && game.boardRiseSpeed < 6)
  //   coordinates = flattenStack();

  if (cpu.randomInputCounter > 0 && game.frames > 0) {
    return randomAction(input);
  }

  if (game.boardRiseSpeed === 1) stackMinimum = 4;
  else if (game.boardRiseSpeed < 4 && game.frames > 9600) stackMinimum = 5;
  else if (game.boardRiseSpeed < 4) stackMinimum = 8;
  else stackMinimum = 11;

  if (!coordinates) {
    if (stackSize >= stackMinimum || game.currentChain > 0) {
      for (let row = 0; row < grid.ROWS; row++) {
        coordinates = findHorizontalMatches(row);
        if (coordinates) {
          cpu.targetColor = sprite.debugGreen;
          break;
        }
        coordinates = findVerticalMatches(10 - row, dir);
        if (coordinates) {
          cpu.targetColor = sprite.debugRed;
          break;
        }
      }
    }
  }

  // If no matches detected, look for ways to flatten the stack.
  if (!coordinates) {
    // console.log("attempting to flatten stack");
    coordinates = flattenStack();
    if (coordinates) cpu.targetColor = sprite.debugGreen;
  }

  if (coordinates) {
    targetX = coordinates[0];
    targetY = coordinates[1];
    swapAtTarget = coordinates[2];
    try {
      if (
        targetX < grid.COLS - 1 &&
        (game.board[targetX][targetY].color ===
          game.board[targetX + 1][targetY].color ||
          !INTERACTIVE_TYPES.includes(game.board[targetX][targetY].type) ||
          !INTERACTIVE_TYPES.includes(game.board[targetX + 1][targetY].type) ||
          (targetY !== grid.COLS - 1 &&
            (game.board[targetX][targetY + 1].color === blockColor.VACANT ||
              game.board[targetX + 1][targetY + 1].color ===
                blockColor.VACANT)))
      ) {
        // console.log("abnormality detected, flatten stack");
        coordinates = flattenStack();
        if (coordinates) cpu.targetColor = sprite.debugGreen;
      }
    } catch (error) {
      console.log(`Error: ${error} at lines ${error.stack}`);
      coordinates = flattenStack();
      if (coordinates) cpu.targetColor = sprite.debugGreen;
    }
  } else {
    // idle, return to center of board
    game.messagePriority = `Idle, raising stack size to ${stackMinimum}`;
    coordinates = flattenStack();
    targetX = 2;
    targetY = 6 + Math.floor(game.highestRow / 2);
    swapAtTarget = false;
    if (cpu.control && stackSize < 11 && !game.currentChain) input.raise = true;
  }

  if (cpu.control) {
    if (game.cursor.y < targetY) input.down = true;
    else if (game.cursor.y > targetY) input.up = true;
    else if (game.cursor.x > targetX) input.left = true;
    else if (game.cursor.x < targetX) input.right = true;
    else if (swapAtTarget && !game.disableSwap) input.swap = true; // reached target
  }

  cpu.targetX = targetX;
  cpu.targetY = targetY;

  // prevents out of index exception, does NOT solve algorithm problem
  if (targetX > grid.COLS - 2) targetX = grid.COLS - 2;

  // if (cpu.targetX === cpu.prevTargetX && cpu.targetY === cpu.prevTargetY) {
  //   console.log
  // }

  if (input.swap && cpu.alreadySwapped) {
    // console.log("start random inputs", input, game.frames);
    cpu.randomInputCounter = 6;
    cpu.alreadySwapped = false;
  }

  if (input.swap && cpu.randomInputCounter === 0) cpu.alreadySwapped = true;
  else if (input.up || input.down || input.left || input.right)
    cpu.alreadySwapped = false;

  // if (
  //   swapAtTarget &&
  //   cpu.lastActionWasSwap &&
  //   cpu.prevTargetX === cpu.targetX &&
  //   cpu.prevTargetY === cpu.targetY &&
  //   !cpu.randomInputCounter
  // ) {
  //   console.log("random input at", cpu.targetX, cpu.targetY, game.frames);
  //   cpu.randomInputCounter = 6;
  // cpu.lastActionWasSwap = false;
  // }
  // if (
  //   INTERACTIVE_TYPES.includes(game.board[targetX][targetY].type) &&
  //   INTERACTIVE_TYPES.includes(game.board[targetX + 1][targetY].type) &&
  //   game.board[targetX][targetY].color !== blockColor.VACANT &&
  //   game.board[targetX + 1][targetY].color !== blockColor.VACANT &&
  //   INTERACTIVE_TYPES.includes(game.board[targetX + 1][targetY].type) &&
  //   input.swap &&
  //   cpu.lastActionWasSwap &&
  //   cpu.randomInputCounter === 0
  // )
  //   cpu.randomInputCounter = 10;
  // if (input.swap) {
  //   if (targetX === prevTargetX && targetY === prevTargetY)
  //     cpu.prevTargetX = targetX;
  //   cpu.prevTargetY = targetY;
  // }
  // cpu.lastActionWasSwap = input.swap ? true : false;
  // if (input.raise && stackSize > 9) input.raise = false;
  cpu.prevTargetX = cpu.targetX;
  cpu.prevTargetY = cpu.targetY;

  return input;
}

function randomAction(input) {
  win.mainInfoDisplay.style.color = "red";
  game.messagePriority = `AI swapped again at same location, do random ${cpu.randomInputCounter} inputs`;
  let arr = ["down", "up", "left", "right", "swap", "swap"];

  let selection = randInt(6);
  if (selection > 3 && !ableToSwap(game.cursor.x, game.cursor.y)) {
    selection = randInt(4);
  }
  cpu.randomInputCounter--;
  // console.log(
  //   `random number selected is ${selection}, counter at ${cpu.randomInputCounter}`
  // );
  input[arr[selection]] = true;
  // cpu.targetX = game.cursor.x;
  // cpu.targetY = game.cursor.y;
  cpu.targetColor = sprite.debugWhite;
  return input;
}

export function ableToSwap(x, y, swapAtTarget) {
  // temp fixes
  if (x > grid.COLS - 1) return false; // crash occurred at this line
  if (x < 0) return false;

  let SquareLeft = game.board[x][y];
  let SquareRight = game.board[x + 1][y];
  if (SquareLeft.color === "vacant" && SquareRight.color === "vacant")
    return false;
  if (!INTERACTIVE_TYPES.includes(SquareLeft.type)) return false;
  if (!INTERACTIVE_TYPES.includes(SquareRight.type)) return false;
  if (SquareLeft.timer !== 0 && SquareLeft.type !== "landing") return false;
  if (SquareRight.timer !== 0 && SquareRight.type !== "landing") return false;

  // Cannot swap directly below a block
  if (y > 0) {
    if (
      SquareLeft.color === blockColor.VACANT &&
      game.board[x][y - 1].color !== blockColor.VACANT
    )
      return false;
    if (
      SquareRight.color === blockColor.VACANT &&
      game.board[x + 1][y - 1].color !== blockColor.VACANT
    )
      return false;
  }

  return [x, y, swapAtTarget]; // all tests have passed
}

//
//
//
//
//
//
//
//
//
//
// function moveBlockToDestination(blockIndex, destinationIndex, mustBeVacant = false) {
//   let blockX = blockIndex[0]
//   let blockY = blockIndex[1]
//   let destinationX = destinationIndex[0]
//   let destinationY = destinationIndex[1]
//   if (blockX < destinationX &&
//     INTERACTIVE_TYPES.includes(game[blockX])) {
//     if gam]
//   }
// }

// for (let i = 0; i < holes.length; i++) {
//   // check order: 2, 3, 1, 4, 0
//   for (let j = 0; j < order[hole].length; j++) {
//     let checkBlockIndex = order[hole][j];
//     let leftblock = game.board[checkBlockIndex][]
//     console.log(checkBlockIndex, holeIndex);
//     let c = checkBlockIndex; // for clarity
//     if (
//       (checkBlockIndex < holeIndex &&
//         INTERACTIVE_TYPES.includes(game.board[c][game.highestRow].type) &&
//         game.board[c][game.highestRow].color !== blockColor.VACANT &&
//         game.board[c + 1][game.highestRow].color === blockColor.VACANT) ||
//       (checkBlockIndex > holeIndex &&
//         INTERACTIVE_TYPES.includes(game.board[c + 1][game.highestRow].type) &&
//         game.board[c][game.highestRow].color === blockColor.VACANT &&
//         game.board[c + 1][game.highestRow].color !== blockColor.VACANT)
//     ) {
//       return [c, game.highestRow, true];
//     }
//   }
// }
//   return false;
// }

// function findVerticalMatches(r) {
//   if (r < 2 || r === grid.ROWS - 1) return false;
//   let possibleMatchLocations = [];
//   let topRowIndex = r - 1;
//   let middleRowIndex = r;
//   let bottomRowIndex = r + 1;

//   for (let i = 0; i < PIECES.length; i++) {
//     let desiredColor = PIECES[i];
//     let desiredIndex;
//     for (let c = 0; c < grid.COLS; c++) {
//       if (
//         game.board[c][middleRowIndex].color === desiredColor &&
//         INTERACTIVE_TYPES.includes(game.board[c][middleRowIndex].type)
//       ) {
//         desiredIndex = [c, r];
//       }
//     }
//     for (let y = r - 1; y <= r + 1; y++) {
//       let matchPossible = false;
//       for (let x = 0; x < grid.COLS; x++) {
//         if (
//           game.board[x][y].color === desiredColor &&
//           INTERACTIVE_TYPES.includes(game.board[x][y].type)
//         ) {
//           game.board[x][y].color ===
//           matchPossible = true;
//         }
//       }
//       if (!matchPossible) break; // no match for this row
//     }
//   }

//   let rowList = [];
//   rowList.push(createRowObject(r - 1, r, r + 1));

//   if (rowList) {

//   }
// }

// function findVerticalMatches(index) {
//   let desiredColor = PIECES[index];
//   let matchLocations = [];
//   let existsOnAboveRow = false;
//   for (let r = grid.ROWS - 1; r > 2; r--) {
//     if (!existsOnAboveRow) {
//       matchLocations = [];
//       existsOnAboveRow = true;
//     }
//     for (let c = grid.COLS - 1; c >= 0; c--) {
//       if (
//         game.board[c][r].color === PIECES[index] &&
//         INTERACTIVE_TYPES.includes(game.board[c][r].type)
//       ) {
//         // checkAboveRow(matchLocations);
//         matchLocations.push([c, r]);
//         if (
//           game.board[c][r].color === PIECES[index] &&
//           INTERACTIVE_TYPES.includes(game.board[c][r].type)
//         ) {
//           matchLocations.push([c, r - 1]);
//         }
//       }
//     }
//   }
// }

// function placeRedsToRight() {
//   let redX = false;
//   let redY = false;
//   for (let r = 0; r < grid.ROWS; r++) {
//     for (let c = grid.COLS - 2; c >= 0; c--) {
//       if (
//         game.board[c][r].color === blockColor.RED &&
//         INTERACTIVE_TYPES.includes(game.board[c][r].type) &&
//         game.board[c + 1][r].color !== blockColor.RED &&
//         INTERACTIVE_TYPES.includes(game.board[c + 1][r].type)
//       ) {
//         redX = c;
//         redY = r;
//         return [redX, redY];
//       }
//     }
//   }
//   return false;
// }
