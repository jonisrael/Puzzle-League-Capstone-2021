import {
  game,
  grid,
  PIECES,
  INTERACTIVE_TYPES,
  cpu,
  blockColor,
} from "../global";

import { isAllowedToSwap } from "./cpu";

const default_hole_check_order = [2, 1, 3, 0, 4, 5];

const order = [
  [0, 1, 2, 3, 4],
  [1, 0, 2, 3, 4],
  [2, 1, 3, 0, 4],
  [3, 2, 4, 1, 0],
  [4, 3, 2, 1, 0],
  [4, 3, 2, 1, 0],
];

export function flattenStack() {
  if (game.tutorialRunning) return false;
  try {
    game.messagePriority = "Flattening the stack.";
    if (game.highestRow === 11) return false;

    // check to see if stack has no holes.
    let holeColumn = -1;
    for (let i = 0; i < default_hole_check_order.length; i++) {
      let potentialHoleColumn = default_hole_check_order[i];
      if (
        game.board[potentialHoleColumn][game.highestRow + 1].color ===
        blockColor.VACANT
      )
        holeColumn = potentialHoleColumn;
      cpu.holeDetectedAt = [holeColumn, game.highestRow + 1];
    }
    if (holeColumn === -1) {
      return false;
    }
    for (let i = 0; i < order[holeColumn].length; i++) {
      let leftBlockIndex =
        holeColumn < 5 ? order[holeColumn][i] : order[holeColumn - 1][i];
      let leftBlock = game.board[leftBlockIndex][game.highestRow];
      let rightBlock = game.board[leftBlockIndex + 1][game.highestRow];
      if (
        (leftBlock.x <= holeColumn &&
          INTERACTIVE_TYPES.includes(leftBlock.type) &&
          leftBlock.timer === 0 &&
          leftBlock.color !== blockColor.VACANT &&
          rightBlock.color === blockColor.VACANT) ||
        (leftBlock.x > holeColumn &&
          INTERACTIVE_TYPES.includes(rightBlock.type) &&
          rightBlock.timer === 0 &&
          leftBlock.color === blockColor.VACANT &&
          rightBlock.color !== blockColor.VACANT)
      ) {
        // for (let r = game.highestRow; r > 0; r--) {
        //   if (game.board[holeColumn][r].color != blockColor.VACANT) return false;
        // }
        cpu.destination = [holeColumn, game.highestRow];
        cpu.blockToSelect =
          leftBlock.x <= holeColumn
            ? [leftBlock.x, leftBlock.y]
            : [rightBlock.x, rightBlock.y];

        return isAllowedToSwap(leftBlockIndex, game.highestRow, true);
      }
    }
    return false;
  } catch (error) {
    console.log(`A bug occurred while running the flattenStack function:`);
    console.log(error, error.stack);
    console.log("No Parameters.");
    return false;
  }
}
