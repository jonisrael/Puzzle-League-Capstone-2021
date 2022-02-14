import { game, PIECES } from "../global";

export function spawnSquare(number) {
  let index = JSON.parse(number) - 1;
  if (index >= 0 && index < PIECES.length) {
    const Square = game.board[game.cursor.x][game.cursor.y];
    const pieceColorSelected = PIECES[index];
    if (Square.color === pieceColorSelected) {
      Square.color = "vacant";
    } else {
      Square.color = pieceColorSelected;
    }
  }
}
