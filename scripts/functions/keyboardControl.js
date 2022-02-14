import { debug, game, grid } from "../global";

function rewind(gameState) {
  game.seconds = game.pastSeconds;
  game.cursor.x = gameState.cursor.x;
  game.cursor.y = gameState.cursor.y;
  game.cursor_type = gameState.cursor_type;
  game.rise = gameState.rise;
  for (let x = 0; x < grid.COLS; x++) {
    for (let y = 0; y < grid.ROWS + 2; y++) {
      Object.keys(game.board[x][y]).forEach(
        (key) => (game.board[x][y][key] = gameState.board[x][y][key])
      );
    }
  }
}
