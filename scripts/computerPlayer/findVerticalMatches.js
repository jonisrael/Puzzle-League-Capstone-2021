import { game, grid, PIECES, INTERACTIVE_TYPES, cpu } from "../global";

export function findVerticalMatches(bottomRowIndex, dir) {
  if (bottomRowIndex - 2 < 3) return false;
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
    for (let r = bottomRowIndex; r >= bottomRowIndex - 2; r--) {
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
      return startVerticalSwapping(matchLocations);
    }
  }
  return false;
}

function startVerticalSwapping(matchLocations) {
  let inputArr = false;

  let topX = matchLocations[2][0];
  let topY = matchLocations[2][1];
  let centerX = matchLocations[1][0]; // destinationX
  let centerY = matchLocations[1][1]; // destinationY
  let bottomX = matchLocations[0][0];
  let bottomY = matchLocations[0][1];

  if (centerX < bottomX) inputArr = [centerX, centerY, true];
  else if (centerX > bottomX) inputArr = [centerX - 1, centerY, true];
  else {
    // since centerX == bottomX, now check topX
    if (topX < centerX && topX < centerX) inputArr = [topX, topY, true];
    else if (topX > centerX) inputArr = [topX - 1, topY, true];
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

  // if (inputArr) {
  //   let x = inputArr[0];
  //   let y = inputArr[1];
  //   if (x > 6) console.log(`x is somehow ${x}`);
  //   if (y > 11) console.log(`y is somehow ${y}`);
  //   if (
  //     game.board[x][y].color === game.board[x + 1][y].color ||
  //     !INTERACTIVE_TYPES.includes(game.board[x][y].type) ||
  //     !INTERACTIVE_TYPES.includes(game.board[x + 1][y].type)
  //   ) {
  //     // console.log(`failsafe2 at [${x},${y}]`);
  //     return false;
  //   }
  // }

  return inputArr;
}
