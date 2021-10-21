import { game, grid, PIECES, INTERACTIVE_TYPES, cpu } from "../global";

export function findHorizontalMatches(r) {
  game.messagePriority = "Found a horizontal match...";
  let matchLocations = [];
  for (let i = 0; i < PIECES.length; i++) {
    matchLocations = [];
    for (let c = grid.COLS - 1; c >= 0; c--) {
      if (
        game.board[c][r].color === PIECES[i] &&
        INTERACTIVE_TYPES.includes(game.board[c][r].type)
      ) {
        matchLocations.push([c, r]);
      }
    }
    if (matchLocations.length > 2) {
      // begin swap sequence
      return startHorizontalSwapping(matchLocations);
    }
  }
  return false;
}

function startHorizontalSwapping(matchLocations) {
  let rightX = matchLocations[0][0];
  let rightY = matchLocations[0][1];
  let centerX = matchLocations[1][0];
  let centerY = matchLocations[1][1];
  let leftX = matchLocations[2][0];
  let leftY = matchLocations[2][1];

  if (centerX + 1 !== rightX) return [centerX, centerY, true];
  if (leftX + 1 !== centerX) return [leftX, leftY, true];

  // Otherwise, desired pair has been made
}
