import { game, grid, blockColor, PIECES, INTERACTIVE_PIECES } from "../global";

export function cpuAction(input) {
  let targetX;
  let targetY;
  let swap = false;
  let coordinates = false;
  for (let i = 0; i < PIECES.length; i++) {
    coordinates = findHorizontalRedThrees(i);
    if (coordinates) {
      console.log(coordinates);
      break;
    }
  }
  if (coordinates) {
    console.log("ready to swap");
    targetX = coordinates[0];
    targetY = coordinates[1];
    swap = coordinates[2];
    console.log(targetX, targetY);
  } else {
    // return to center of board
    console.log("no match spotted");
    targetX = 2;
    targetY = 6;
  }
  if (game.cursor.y < targetY) input.down = true;
  else if (game.cursor.y > targetY) input.up = true;
  else if (game.cursor.x > targetX) input.left = true;
  else if (game.cursor.x < targetX) input.right = true;
  else if (swap) input.swap = true; // reached target

  return input;
}

function findHorizontalRedThrees(index) {
  let matchLocations = [];
  for (let r = 0; r < grid.ROWS; r++) {
    matchLocations = [];
    for (let c = grid.COLS - 1; c >= 0; c--) {
      if (
        game.board[c][r].color === PIECES[index] &&
        INTERACTIVE_PIECES.includes(game.board[c][r].type)
      ) {
        matchLocations.push([c, r]);
      }
    }
    if (matchLocations.length > 2) {
      // begin swap sequence
      console.log(`swapping ${PIECES[index]}`);
      return startSwapping(matchLocations);
    }
  }
  return false;
}

function startSwapping(matchLocations) {
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
//         INTERACTIVE_PIECES.includes(game.board[c][r].type) &&
//         game.board[c + 1][r].color !== blockColor.RED &&
//         INTERACTIVE_PIECES.includes(game.board[c + 1][r].type)
//       ) {
//         redX = c;
//         redY = r;
//         return [redX, redY];
//       }
//     }
//   }
//   return false;
// }
