import {
  game,
  grid,
  blockColor,
  PIECES,
  INTERACTIVE_TYPES,
  cpu,
  win
} from "../global";
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
  // if (game.frames % 6 < 3) return input;
  let targetX;
  let targetY;
  let swap = false;
  let coordinates = false;
  let dir =
    game.highestColIndex < 3 ? [0, grid.COLS - 1, 1] : [grid.COLS - 1, 0, -1];

  if (game.highestRow < 11) coordinates = flattenStack();

  if (!coordinates && (game.highestRow < 8 || game.currentChain > 0)) {
    for (let row = 0; row < grid.ROWS; row++) {
      coordinates = findHorizontalMatches(row);
      if (coordinates) break;
      coordinates = findVerticalMatches(11 - row, dir);
      if (coordinates) break;
    }
  }

  // If no matches detected, look for ways to flatten the stack.
  if (!coordinates) coordinates = flattenStack();

  if (coordinates) {
    targetX = coordinates[0];
    targetY = coordinates[1];
    swap = coordinates[2];
  } else {
    // idle, return to center of board
    game.messagePriority = "Idle, raising stack...";
    targetX = 2;
    targetY = 6 + Math.floor(game.highestRow / 2);
    if (cpu.control && game.highestRow > 6) input.quickRaise = true;
  }

  if (cpu.control) {
    if (game.cursor.y < targetY) input.down = true;
    else if (game.cursor.y > targetY) input.up = true;
    else if (game.cursor.x > targetX) input.left = true;
    else if (game.cursor.x < targetX) input.right = true;
    else if (swap) input.swap = true; // reached target
  }

  cpu.targetX = targetX;
  cpu.targetY = targetY;
  cpu.swap = swap;
  return input;
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
