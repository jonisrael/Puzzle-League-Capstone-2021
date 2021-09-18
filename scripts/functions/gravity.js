import {
  blockColor,
  blockType,
  grid,
  game,
  INTERACTIVE_PIECES,
  debug
} from "../global";

export function doGravity() {
  let possibleLandedLocations = [];
  let c;
  let r;

  for (let c = 0; c < grid.COLS; c++) {
    if (
      game.board[c][11].type == blockType.LANDING &&
      game.board[c][11].timer == 0
    ) {
      game.board[c][11].type = blockType.NORMAL;
      game.disableRaise = false;
    }

    for (let r = grid.ROWS - 1; r >= 0; r--) {
      if (
        game.board[c][r].type == blockType.LANDING &&
        game.board[c][r + 1].color == blockColor.VACANT
      ) {
        game.board[c][r].type = blockType.NORMAL;
        game.board[c][r].timer = 0;
      }

      if (
        game.board[c][r].type == blockType.LANDING &&
        game.board[c][r].timer == 0
      ) {
        game.board[c][r].type = blockType.NORMAL;
        game.board[c][r].touched = false;
        game.disableRaise = false;
      }

      if (
        game.board[c][r].color != blockColor.VACANT &&
        game.board[c][r + 1].color == blockColor.VACANT &&
        INTERACTIVE_PIECES.includes(game.board[c][r].type)
      ) {
        // if normal block, fall one unit
        game.disableRaise = false;
        // When a block is ready to fall
        if (game.board[c][r].timer == 0) {
          game.board[c][r + 1].color = game.board[c][r].color;
          game.board[c][r + 1].type = game.board[c][r].type;
          game.board[c][r + 1].touched = game.board[c][r].touched;
          game.board[c][r + 1].availableForSecondaryChain =
            game.board[c][r].availableForSecondaryChain;
          game.board[c][r + 1].availableForPrimaryChain =
            game.board[c][r].availableForPrimaryChain;
          game.board[c][r].color = blockColor.VACANT;
          game.board[c][r].touched = false;
          possibleLandedLocations.push([c, r + 1]);

          //Debug
          if (debug.freeze == 1) {
            game.board[c][r + 1].timer += 1;
          } else if (debug.slowdown == 1) {
            game.board[c][r + 1].timer = 120;
          }

          // Make sure all blocks above falling block have same timer
        }
      }
    }
    for (let i = 0; i < possibleLandedLocations.length; i++) {
      let x = possibleLandedLocations[i][0];
      let y = possibleLandedLocations[i][1];
      if (
        game.board[x][y].color != blockColor.VACANT &&
        game.board[x][y + 1].color != blockColor.VACANT
      ) {
        game.board[x][y].type = blockType.LANDING;
        game.board[x][y].timer = 10; // 10 frames is length of landing animation
        //DEBUG
        if (debug.slowdown == 1) {
          game.board[x][y].timer = 120;
        }
      }
    }
  }
}

export function areAllBlocksGrounded() {
  // check below all blocks, except for final row.
  for (let c = 0; c < grid.COLS; c++) {
    for (let r = 0; r < grid.ROWS - 1; r++) {
      if (
        game.board[c][r].color != blockColor.VACANT &&
        game.board[c][r + 1].color == blockColor.VACANT
      ) {
        return false;
      }
      if (game.board[c][r].type == blockType.LANDING) return false;
    }
    // dont forget to check bottom row
    if (game.board[c][grid.ROWS - 1].type == blockType.LANDING) return false;
  }
  // all blocks are grounded, so make sure there are no blocks touched
  // make sure chainables are gone if
  for (let c = 0; c < grid.COLS; c++) {
    for (let r = 0; r < grid.ROWS; r++) {
      game.board[c][r].touched = false;
    }
  }
  return true;
}
