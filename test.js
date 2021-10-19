import { blockColor, game, grid } from "./scripts/global";

if (y < 11) {
  for (let j = y; j < grid.ROWS; j++) {
    if (
      (game.board[x][y].color != blockColor.VACANT &&
        INTERACTIVE_TYPES.includes(game.board[x][y].type) &&
        INTERACTIVE_TYPES.includes(game.board[x][y + 1].type) &&
        game.board[x][j].color === blockColor.VACANT) ||
      (game.board[x + 1][y].color !== blockColor.VACANT &&
        INTERACTIVE_TYPES.includes(game.board[x + 1][y].type) &&
        INTERACTIVE_TYPES.includes(game.board[x + 1][y + 1].type) &&
        game.board[x + 1][j].color === blockColor.VACANT)
    ) {
      legalSwap = false;
      game.message = "Swap Failed: Airborne Block";
      game.messageChangeDelay = 90;
      break;
    }
  }
}
