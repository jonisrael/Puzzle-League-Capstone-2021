import { game, grid, blockColor, INTERACTIVE_PIECES } from "../global";

export function cpuAction(input) {
  // if (findFirstRed(input)) {
  //   console.log("impossible");
  // } else {
  //   input = idle(input);
  // }
  findFirstRed(input);
  return input;
}

function idle(input) {
  if (game.cursor.y < 6) input.down = true;
  else if (game.cursor.y > 6) input.up = true;
  else if (game.cursor.x > 2) input.left = true;
  else if (game.cursor.x < 2) input.right = true;
  return input;
}

function findFirstRed(input) {
  let redX = false;
  let redY = false;
  let done = false;
  for (let c = 0; c < grid.COLS; c++) {
    if (done) break;
    for (let r = 0; r < grid.ROWS; r++) {
      if (
        game.board[c][r].color === blockColor.RED &&
        INTERACTIVE_PIECES.includes(game.board[c][r].type)
      ) {
        redX = c;
        redY = r;
        console.log(c, r);
        done = true;
        break;
      }
    }
  }
  if (redX && redY) {
    if (game.cursor.y < redY) input.down = true;
    else if (game.cursor.y > redY) input.up = true;
    else if (game.cursor.x > redX) input.left = true;
    else if (game.cursor.x < redX) input.right = true;
  }
  return input;
}
