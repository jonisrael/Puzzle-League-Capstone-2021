import {
  game,
  grid,
  PIECES,
  INTERACTIVE_TYPES,
  cpu,
  blockColor
} from "../global";

import { sprite } from "../fileImports";

export function findHorizontalMatches(r) {
  game.messagePriority = "Found a horizontal match...";
  let matchLocations = [];
  for (let i = 0; i < PIECES.length; i++) {
    matchLocations = [];
    for (let c = grid.COLS - 1; c >= 0; c--) {
      if (
        game.board[c][r].color === PIECES[i] &&
        INTERACTIVE_TYPES.includes(game.board[c][r].type) &&
        game.board[c][r].timer === 0
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
  let centerX = matchLocations[1][0];
  let leftX = matchLocations[2][0];
  let y = matchLocations[0][1];

  // check which clear is closer
  if (centerX - leftX < rightX - centerX || 0 === 0) {
    if (centerX + 1 !== rightX) {
      if (checkForObstacle(centerX, rightX, y)) return false;
      else {
        cpu.targetColor = sprite.debugGreen;
        return [centerX, y, true];
      }
    }
    if (leftX + 1 !== centerX) {
      if (checkForObstacle(leftX, centerX, y)) return false;
      else {
        cpu.targetColor = sprite.debugGreen;
        return [leftX, y, true];
      }
    }
  }

  // Otherwise, desired pair has been made
}

export function checkForObstacle(x1, x2, y) {
  // first check for non-interactive blocks
  if (x2 >= grid.COLS || x1 >= grid.COLS) {
    console.log(`Somehow, x1 = ${x1} and x2 = ${x2}`);
    return true;
  }

  for (let c = x1; c < x2; c++) {
    if (!INTERACTIVE_TYPES.includes(game.board[c][y].type)) {
      // console.log(`non-interactable block at [${c},${y}]`);
      return true;
    }
  }
  if (y !== grid.ROWS - 1) {
    for (let c = x1; c <= x2; c++) {
      if (game.board[c][y + 1].color === blockColor.VACANT) {
        // console.log(`hole detected at [${c},${y + 1}]`);
        return true;
      }
    }
  }
  // no obstacle found.
  return false;
}
