import {
  game,
  grid,
  PIECES,
  INTERACTIVE_TYPES,
  cpu,
  blockColor
} from "../global";

const default_hole_check_order = [2, 1, 3, 0, 4, 5];

const order = [
  [0, 1, 2, 3, 4],
  [1, 0, 2, 3, 4],
  [2, 1, 3, 0, 4],
  [3, 2, 4, 1, 0],
  [4, 3, 2, 1, 0],
  [4, 3, 2, 1, 0]
];

export function flattenStack() {
  game.messagePriority = "Flattening the stack.";
  if (game.highestRow === 11) return false;

  // check to see if stack has no holes.
  let holeIndex = -1;
  for (let i = 0; i < default_hole_check_order.length; i++) {
    let potentialHoleIndex = default_hole_check_order[i];
    if (
      game.board[potentialHoleIndex][game.highestRow + 1].color ===
      blockColor.VACANT
    )
      holeIndex = potentialHoleIndex;
    cpu.holeDetectedAt = [holeIndex, game.highestRow + 1];
  }
  if (holeIndex === -1) return false;
  for (let i = 0; i < order[holeIndex].length; i++) {
    let leftBlockIndex =
      holeIndex < 5 ? order[holeIndex][i] : order[holeIndex - 1][i];
    let rightBlockIndex = leftBlockIndex + 1;
    let leftBlock = game.board[leftBlockIndex][game.highestRow];
    let rightBlock = game.board[rightBlockIndex][game.highestRow];
    if (
      (leftBlockIndex < holeIndex &&
        INTERACTIVE_TYPES.includes(leftBlock.type) &&
        leftBlock.timer === 0 &&
        leftBlock.color !== blockColor.VACANT &&
        rightBlock.color === blockColor.VACANT) ||
      (leftBlockIndex >= holeIndex &&
        INTERACTIVE_TYPES.includes(rightBlock.type) &&
        rightBlock.timer === 0 &&
        leftBlock.color === blockColor.VACANT &&
        rightBlock.color !== blockColor.VACANT)
    ) {
      // for (let r = game.highestRow; r > 0; r--) {
      //   if (game.board[holeIndex][r].color != blockColor.VACANT) return false;
      // }
      return [leftBlockIndex, game.highestRow, true];
    }
  }
  return false;
}
