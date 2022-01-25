import {
  blockColor,
  blockType,
  grid,
  game,
  INTERACTIVE_TYPES,
  debug,
  touch,
  transferProperties,
  CLEARING_TYPES,
  helpPlayer,
} from "../global";

import { checkMatch } from "./matchAndScoreFunctions";
import { updateGrid } from "./updateGrid";
import { isChainActive } from "../../puzzleleague";
import { SelectedBlock } from "./stickyFunctions";

export function doGravity(gameSpeed) {
  let possibleLandedLocations = [];

  for (let c = 0; c < grid.COLS; c++) {
    if (
      game.board[c][grid.ROWS - 1].type == blockType.LANDING &&
      game.board[c][grid.ROWS - 1].timer == 0
    ) {
      game.board[c][grid.ROWS - 1].type = blockType.NORMAL;
      game.boardRiseDisabled = false;
    }

    //
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
        game.boardRiseDisabled = false;
      }

      if (
        game.board[c][r].color != blockColor.VACANT &&
        game.board[c][r + 1].color == blockColor.VACANT &&
        INTERACTIVE_TYPES.includes(game.board[c][r].type)
      ) {
        // if normal block, fall one unit
        game.boardRiseDisabled = false;
        game.pauseStack = true;
        // When a block is ready to fall
        if (game.board[c][r].timer == 0) {
          if (
            touch.moveOrderExists &&
            SelectedBlock.x === c &&
            SelectedBlock.y === r
          ) {
            game.cursor.y += 1;
            touch.target.y += 1;
          }
          transferProperties(game.board[c][r], game.board[c][r + 1], "to");
          helpPlayer.done = false;
          game.board[c][r + 1].airborne = true;
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
  }
  // now check to see if a block has landed
  for (let i = 0; i < possibleLandedLocations.length; i++) {
    let x = possibleLandedLocations[i][0];
    let y = possibleLandedLocations[i][1];
    if (
      game.board[x][y].color != blockColor.VACANT &&
      game.board[x][y + 1].color != blockColor.VACANT
    ) {
      game.board[x][y].type = blockType.LANDING;
      game.board[x][y].airborne = false;
      game.board[x][y].timer = 11; // 10 frames is length of landing animation
      //DEBUG
      if (debug.slowdown == 1) {
        game.board[x][y].timer = 120;
      }
    }
  }
  // if double speed, will need to check function twice
  if (gameSpeed == 2) {
    doGravity(1);
    checkMatch();
    updateGrid();
    isChainActive();
  }
}

export function areAllBlocksGrounded() {
  // check below all blocks, except for final row.
  for (let c = 0; c < grid.COLS; c++) {
    for (let r = 0; r < grid.ROWS - 1; r++) {
      // If there is a vacant block below, a block is NOT grounded.
      if (
        game.board[c][r].color != blockColor.VACANT &&
        game.board[c][r + 1].color == blockColor.VACANT
      ) {
        return false;
      }
      // for the first two frames of landing, blocks are NOT grounded.
      if (
        game.board[c][r].type == blockType.LANDING &&
        game.board[c][r].color != blockColor.VACANT &&
        game.board[c][r + 1].color != blockColor.VACANT &&
        game.board[c][r].timer > 9
      )
        return false;
      // If a block is clearing, not every piece is grounded.
      if (!INTERACTIVE_TYPES.includes(game.board[c][r].type)) return false;
    }
    // dont forget to check bottom row
    if (
      (game.board[c][grid.ROWS - 1].type == blockType.LANDING &&
        game.board[c][grid.ROWS - 1].timer < 9) ||
      !INTERACTIVE_TYPES.includes(game.board[c][grid.ROWS - 1].type)
    )
      return false;
  }
  // all blocks are grounded, so make sure there are no blocks touched
  // make sure chainables are gone if
  for (let c = 0; c < grid.COLS; c++) {
    for (let r = 0; r < grid.ROWS; r++) {
      game.board[c][r].touched = false;
    }
  }
  game.boardRiseDisabled = false;
  return true;
}

export function isBlockAirborne(Square) {
  let c = Square.x;
  let r = Square.y;
  if (r >= grid.ROWS - 1) return false; // not airborne since on bottom row
  // if non-interactive block is directly below block, it is not airborne.
  if (!INTERACTIVE_TYPES.includes(game.board[c][r + 1].type)) return false;
  if (Square.color === blockColor.VACANT) return false;

  // check if there is a vacant block below -- if so it is airborne
  for (let j = r + 1; j < grid.ROWS; j++) {
    if (game.board[c][j].color === "vacant") {
      for (let k = j - 1; k >= 0; k--) {
        if (CLEARING_TYPES.includes(game.board[c][k].type)) break;
        if (game.board[c][k].color !== "vacant")
          game.board[c][k].airborne = true;
      }
      return true;
    }
  }
  return false;
}
