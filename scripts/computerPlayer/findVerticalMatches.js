import { game, grid, PIECES, INTERACTIVE_TYPES, cpu } from "../global";
import { ableToSwap } from "./cpu";
import { sprite } from "../fileImports";
import { checkForObstacle } from "./findHorizontalMatches";

export function findVerticalMatches(middleRowIndex, dir) {
  try {
    if (middleRowIndex < 2) return false;
    let start = dir[0];
    let end = dir[1];
    let direction = dir[2];
    game.messagePriority = "Found a vertical match...";
    let matchLocations = [];
    for (let i = 0; i < PIECES.length; i++) {
      let desiredColor = PIECES[i];
      // console.log(desiredColor);
      matchLocations = [];
      cpu.matchList = [];
      for (let r = middleRowIndex + 1; r >= middleRowIndex - 1; r--) {
        let c = start;
        while (c !== end) {
          if (
            game.board[c][r].color === desiredColor &&
            INTERACTIVE_TYPES.includes(game.board[c][r].type)
          ) {
            matchLocations.push([c, r]);
            cpu.matchList.push(`${[c, r]}`);
            break; // go look at next row
          }
          start < end ? c++ : c--;
        }
      }
      if (matchLocations.length > 2) {
        // console.log(desiredColor, cpu.matchList);
        cpu.targetColor = sprite.debugRed;
        return startVerticalSwapping(matchLocations);
      }
    }
    return false;
  } catch (error) {
    console.log(`A bug occurred running the findVerticalMatches function:`);
    console.log(error, error.stack);
    console.log("Parameters || midRowInd:", middleRowIndex, "dirArray", dir);
    return false;
  }
}

function startVerticalSwapping(matchLocations) {
  try {
    let inputArr = false;

    let topX = matchLocations[2][0];
    let topY = matchLocations[2][1];
    let centerX = matchLocations[1][0]; // destinationX
    let centerY = matchLocations[1][1]; // destinationY
    let bottomX = matchLocations[0][0];
    let bottomY = matchLocations[0][1];

    if (topX < centerX) inputArr = [topX, topY, true];
    else if (topX > centerX) inputArr = [topX - 1, topY, true];
    else {
      // since bottomX == centerX, now check topX
      if (bottomX < centerX) inputArr = [bottomX, bottomY, true];
      else if (bottomX > centerX) inputArr = [bottomX - 1, bottomY, true];
    }

    // otherwise, desired match has been made.
    if (
      inputArr &&
      game.board[inputArr[0]][inputArr[1]].color ===
        game.board[inputArr[0] + 1][inputArr[1]].color
    ) {
      let x = inputArr[0];
      let y = inputArr[1];
      // console.log(`failsafe1 at [${x},${y}]`);
      inputArr = [x + 1, y, true];
    }

    if (checkForObstacle(inputArr[0], inputArr[0] + 1, inputArr[1]))
      return false;
    return ableToSwap(inputArr[0], inputArr[1], true);
  } catch (error) {
    console.log(`A bug occurred running the startVerticalSwapping function:`);
    console.log(error, error.stack);
    console.log("Parameters || matchLocations:", matchLocations);
    return false;
  }
}
