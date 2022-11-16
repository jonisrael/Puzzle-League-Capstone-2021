import {
  game,
  grid,
  PIECES,
  INTERACTIVE_TYPES,
  cpu,
  blockColor,
  blockType,
} from "../global";

import { sprite } from "../fileImports";

import { isAllowedToSwap } from "./cpu";

export function findHorizontalMatches(r) {
  try {
    if (game.mode === "cpu-play")
      game.messagePriority = "Found a horizontal match...";
    let matchLocations = [];
    for (let i = 0; i < PIECES.length; i++) {
      matchLocations = [];
      cpu.matchList.length = cpu.matchStrings.length = 0;
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
        for (let i = 0; i < matchLocations.length; i++) {
          let coord = matchLocations[i];
          cpu.matchList.push(coord);
          cpu.matchStrings.push(`${coord}`);
        }
        // matchLocations.forEach((coord) => {
        //   cpu.matchList.push(coord);
        //   cpu.matchStrings.push(`${coord}`);
        // });
        // begin swap sequence
        return startHorizontalSwapping(matchLocations);
      }
    }
    return false;
  } catch (error) {
    // console.log(`A bug occurred while finding a horizontal match:`);
    // console.log(error, error.stack);
    // console.log("Parameters || row", r);
    return false;
  }
}

function startHorizontalSwapping(matchLocations) {
  try {
    let rightX = matchLocations[0][0];
    let centerX = matchLocations[1][0];
    let leftX = matchLocations[2][0];
    let y = matchLocations[0][1];

    // check which clear is closer

    if (centerX + 1 !== rightX) {
      if (checkForObstacle(centerX, rightX, y)) return false;
      else {
        cpu.targetColor = sprite.debugGreen;
        cpu.blockToSelect = [rightX, y];
        cpu.destination = [centerX + 1, y];
        return isAllowedToSwap(centerX, y, true);
      }
    }
    if (centerX - 1 !== leftX) {
      if (checkForObstacle(leftX, centerX, y)) return false;
      else {
        cpu.targetColor = sprite.debugGreen;
        cpu.blockToSelect = [leftX, y];
        cpu.destination = [centerX - 1, y];
        return isAllowedToSwap(leftX, y, true);
      }
    }

    // Otherwise, desired pair has been made
  } catch (error) {
    console.log(`A bug occurred while running horizontal swap function:`);
    console.log(error, error.stack);
    console.log("Parameters || matchLocations:", matchLocations);
    return false;
  }
}

export function checkForObstacle(x1, x2, y) {
  try {
    // first check for non-interactive blocks
    if (x2 >= grid.COLS || x1 >= grid.COLS) {
      // console.log(`Somehow, x1 = ${x1} and x2 = ${x2}`);
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
  } catch (error) {
    console.log(`A bug occurred while running the checkForObstacle function:`);
    console.log(error, error.stack);
    console.log("Parameters || leftX:", x1, "rightX", x2, "Y", y);
    return true; // say that there is an obstacle
  }
}
