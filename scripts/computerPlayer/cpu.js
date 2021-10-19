import {
  game,
  grid,
  blockColor,
  PIECES,
  INTERACTIVE_TYPES,
  cpu
} from "../global";

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
  // if (game.frames % 10 < 5) return input;
  let targetX;
  let targetY;
  let swap = false;
  let coordinates = false;
  for (let row = 0; row < grid.ROWS; row++) {
    coordinates = findHorizontalThrees(row);
    if (coordinates) break;
    // coordinates = findVerticalThrees(row);
    // if (coordinates) break;
  }

  // If no matches detected, look for ways to flatten the stack.
  if (!coordinates) coordinates = flattenStack();

  if (coordinates) {
    targetX = coordinates[0];
    targetY = coordinates[1];
    swap = coordinates[2];
  } else {
    // idle, return to center of board
    targetX = 2;
    targetY = 6 + Math.floor(game.highestRow / 2);
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
  return input;
}

function flattenStack() {
  if (game.highestRow === 11) return false;

  // check to see if stack has no holes.
  let holeIndex;
  for (let i = 0; i < default_hole_check_order.length; i++) {
    let potentialHoleIndex = default_hole_check_order[i];
    if (
      game.board[potentialHoleIndex][game.highestRow + 1].color ===
      blockColor.VACANT
    )
      holeIndex = potentialHoleIndex;
    cpu.holeDetectedAt = [holeIndex, game.highestRow + 1];
  }
  if (!holeIndex) return false;
  for (let i = 0; i < order[holeIndex].length; i++) {
    let leftBlockIndex =
      holeIndex < 5 ? order[holeIndex][i] : order[holeIndex - 1][i];
    let rightBlockIndex = leftBlockIndex + 1;
    let leftBlock = game.board[leftBlockIndex][game.highestRow];
    let rightBlock = game.board[rightBlockIndex][game.highestRow];
    if (
      (leftBlockIndex < holeIndex &&
        INTERACTIVE_TYPES.includes(leftBlock.type) &&
        leftBlock.color !== blockColor.VACANT &&
        rightBlock.color === blockColor.VACANT) ||
      (leftBlockIndex >= holeIndex &&
        INTERACTIVE_TYPES.includes(rightBlock.type) &&
        leftBlock.color === blockColor.VACANT &&
        rightBlock.color !== blockColor.VACANT)
    ) {
      return [leftBlockIndex, game.highestRow, true];
    }
  }

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
  return false;
}

function findVerticalThrees(r) {
  if (r < 2 || r === grid.ROWS - 1) return false;
  let possibleMatchLocations = [];
  let topRowIndex = r - 1;
  let middleRowIndex = r;
  let bottomRowIndex = r + 1;

  for (let i = 0; i < PIECES.length; i++) {
    let desiredColor = PIECES[i];
    let desiredIndex;
    for (let c = 0; c < grid.COLS; c++) {
      if (
        game.board[c][middleRowIndex].color === desiredColor &&
        INTERACTIVE_TYPES.includes(game.board[c][middleRowIndex].type)
      ) {
        desiredIndex = [c, r];
      }
    }
    for (let y = r - 1; y <= r + 1; y++) {
      let matchPossible = false;
      for (let x = 0; x < grid.COLS; x++) {
        if (
          game.board[x][y].color === desiredColor &&
          INTERACTIVE_TYPES.includes(game.board[x][y].type)
        ) {
          matchPossible = true;
        }
      }
    }
  }

  let rowList = [];
  rowList.push(createRowArray(r - 1));
  rowList.push(createRowArray(r));
  rowList.push(createRowArray(r + 1));

  if (rowList) {
  }
}

function createRowObject(r) {
  let rowArray = [];
  for (let c = 0; c < grid.COLS; c++) {
    rowArray[`${c}`];
  }
  return rowArray;
}

// function findVerticalThrees(index) {
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

function findHorizontalThrees(r) {
  let matchLocations = [];
  for (let i = 0; i < PIECES.length; i++) {
    matchLocations = [];
    for (let c = grid.COLS - 1; c >= 0; c--) {
      if (
        game.board[c][r].color === PIECES[i] &&
        INTERACTIVE_TYPES.includes(game.board[c][r].type)
      ) {
        matchLocations.push([c, r]);
      }
    }
    if (matchLocations.length > 2) {
      // begin swap sequence
      return startHorizontalSwapping(matchLocations);
    }
  }
  return false;
}

function startHorizontalSwapping(matchLocations) {
  let rightX = matchLocations[0][0];
  let rightY = matchLocations[0][1];
  let centerX = matchLocations[1][0];
  let centerY = matchLocations[1][1];
  let leftX = matchLocations[2][0];
  let leftY = matchLocations[2][1];

  if (centerX + 1 !== rightX) return [centerX, centerY, true];
  if (leftX + 1 !== centerX) return [leftX, leftY, true];
}

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
