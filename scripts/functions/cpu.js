import { game, grid, blockColor, INTERACTIVE_PIECES } from "../global";

export function cpuAction(input) {
  let cpuInput = false;
  let targetX;
  let targetY;
  let swap = false;
  let coordinates = findHorizontalRedThrees();
  if (coordinates) {
    targetX = coordinates[0];
    targetY = coordinates[1];
    swap = coordinates[2];
    console.log(targetX, targetY);
  } else {
    // return to center of board
    console.log("no red spotted");
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

function findHorizontalRedThrees() {
  let redLocations = [];
  for (let r = 0; r < grid.ROWS; r++) {
    redLocations = [];
    for (let c = grid.COLS - 1; c >= 0; c--) {
      if (
        game.board[c][r].color === blockColor.RED &&
        INTERACTIVE_PIECES.includes(game.board[c][r].type)
      ) {
        redLocations.push([c, r]);
      }
    }
    if (redLocations.length > 2) {
      // begin swap sequence
      return startSwapping(redLocations);
    }
  }
  return false;
}

function startSwapping(redLocations) {
  let rightX = redLocations[0][0];
  let rightY = redLocations[0][1];
  let centerX = redLocations[1][0];
  let centerY = redLocations[1][1];
  let leftX = redLocations[2][0];
  let leftY = redLocations[2][1];

  if (centerX + 1 !== rightX) return [centerX, centerY, true];
  if (leftX + 1 !== centerX) return [leftX, leftY, true];
}

function placeRedsToRight() {
  let redX = false;
  let redY = false;
  for (let r = 0; r < grid.ROWS; r++) {
    for (let c = grid.COLS - 2; c >= 0; c--) {
      if (
        game.board[c][r].color === blockColor.RED &&
        INTERACTIVE_PIECES.includes(game.board[c][r].type) &&
        game.board[c + 1][r].color !== blockColor.RED &&
        INTERACTIVE_PIECES.includes(game.board[c + 1][r].type)
      ) {
        redX = c;
        redY = r;
        return [redX, redY];
      }
    }
  }
  return false;
}
