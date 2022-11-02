import { sprite } from "../fileImports";
import { pause } from "../functions/pauseFunctions";
import { blockIsSolid, cpu, game, grid } from "../global";

export function tryToAvoidDeath() {
  // stuck bug occurs more often on right, so gonna prioritize right over left
  for (let c = grid.COLS - 1; c >= 0; c--) {
    if (game.highestCols.includes(c)) {
      // check from bottom to top for a way to flatten stack
      for (let r = grid.ROWS - 1; r >= 2; r--) {
        // stack will flatten if the left or right block is vacant.
        // if this is not the case, go to the next row.
        if (blockIsSolid(game.board[c][r])) {
          if (c >= 1 && game.board[c - 1][r].color === "vacant") {
            if (game.mode === "cpu-play") {
              game.messagePriority = `Avoid losing! Flattening ${
                c < grid.COLS / 2 ? "left" : "right"
              } tower.`;
            }
            cpu.targetColor = sprite.debugPink;
            cpu.blockToSelect = [c - 1, r];
            cpu.destination = [c - 1, r];
            return [c - 1, r, true];
          }
          if (c <= grid.COLS - 2 && game.board[c + 1][r].color === "vacant") {
            if (game.mode === "cpu-play") {
              game.messagePriority = `Avoid losing! Flattening tower on the ${
                c < grid.COLS / 2 ? "left" : "right"
              }.`;
            }
            cpu.targetColor = sprite.debugPink;
            cpu.blockToSelect = [c, r];
            cpu.destination = [c, r];
            return [c, r, true];
          }
        }
      }
    }
  }
  return false;
}
