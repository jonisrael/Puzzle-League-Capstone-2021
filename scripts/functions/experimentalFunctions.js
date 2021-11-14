import {
  announcer,
  blockColor,
  blockType,
  PIECES,
  INTERACTIVE_TYPES,
  win,
  grid,
  game,
  preset,
  api,
  cpu,
  perf,
  debug,
  randInt,
  leaderboard,
  loadedAudios,
  padInteger
} from "./scripts/global.js";

export const currentFrame = {
  matches: [],
  highestRow: 12
};
export const resetFrame = JSON.parse(JSON.stringify(currentFrame));

export const VacantSquare = {
  x: 0,
  y: 0,
  color: "vacant",
  type: "normal",
  timer: 0,
  switchToFaceFrame: 0,
  switchToPoppedFrame: 0,
  touched: false,
  airborne: false,
  availableForPrimaryChain: false,
  availableForSecondaryChain: false
};

export function resetBoardStateVars() {
  Object.keys(currentFrame).forEach(
    key => (currentFrame[key] = resetFrame[key])
  );
  return;
}

export function gravity(gameSpeed, c, r) {
  // Do not do function if any of these conditions apply
  if (r === grid.ROWS - 1) return; // on bottom row
  if (game.board[c][r].color === blockColor.VACANT) return; // block is vacant
  if (!INTERACTIVE_TYPES.includes(game.board[c][r].type)) return; // block non-interactive

  let Square = game.board[c][r];
  let SquareBelow = game.board[c][r + 1];
  let vacant = blockColor.VACANT; // is the string "vacant"

  // First, determine if a block is airborne and not in stall mode
  if (Square.airborne && Square.timer === 0 && SquareBelow.color === vacant) {
    // make it fall one unit
    transferProperties("transferTo", [c + 1, r], [c, r]);
    transferProperties("makeVacant", [c, r], []);
    // now determine if block just landed
    if (r + 2 > grid.ROWS || game.board[c][r + 2].color !== vacant) {
      // modify the below square and making it a landing animation
      SquareBelow.type === blockType.LANDING;
      SquareBelow.timer = 10;
      if (debug.slowdown) SquareBelow.timer = 120; // for debug
      // ADD gameSpeed 2 clause
    }
  }

  // Determine if block needs to be called airborne.
  // It must not already be airborne and there must not be a clearing block directly below it.
  if (!Square.airborne && INTERACTIVE_TYPES.includes(SquareBelow.type)) {
    for (let j = r + 1; j < grid.ROWS; j++) {
      if (game.board[c][j].color === vacant) {
        // call it an airborne normal block and let it stall before falling
        Square.airborne = true;
        Square.type = blockType.NORMAL;
        Square.timer = game.blockStallTime;
        break;
      }
    }
  }

  // debug to add stall time
  if (debug.freeze == 1) {
    game.board[c][r + 1].timer += 1;
  } else if (debug.slowdown == 1) {
    game.board[c][r + 1].timer = 120;
  }
}

export function transferProperties(type, [colTo, rowTo], [colFrom, rowFrom]) {
  const toSquare = Object.keys(game.board[colTo][rowTo]);
  const fromSquare = Object.keys(game.board[colFrom][rowFrom]);

  if (type === "makeVacant") {
    toSquare.forEach(prop => (toSquare[prop] = VacantSquare[prop]));
  }

  if (type === "transferTo") {
    toSquare.forEach(prop => (toSquare[prop] = fromSquare[prop]));
  }

  if (type === "swapBetween") {
    let tempSquare = Object.keys(JSON.parse(JSON.stringify(toSquare)));
    toSquare.forEach(prop => (toSquare[prop] = fromSquare[prop]));
    fromSquare.forEach(prop => (fromSquare[prop] = tempSquare[prop]));
    game.board[colFrom][colTo].x = colTo; // fix x coord
    game.board[colFrom][colTo].y = rowTo; // fix y coord
  }

  // fix change in coordinates
  game.board[colTo][rowTo].x = colTo; // fix x coord
  game.board[colTo][rowTo].y = rowTo; // fix y coord
}

export function updateGridState(c, r, frameAdvance = false) {
  if (0 === 0 || !frameAdvance) {
    if (game.board[c][r].timer > 0) game.board[c][r].timer -= perf.gameSpeed;
    if (game.board[c][r].timer === -1) game.board[c][r].timer = 0;
  }
  // if on new row and non-vacant block is found, it is now the highest row.
  if (r < game.highestRow && game.board[c][r].color !== blockColor.VACANT) {
    game.highestRow = r;
    game.highestColIndex = c;
  }

  return;
}

export function checkMatches(c, r) {
  // Do cases where the function will end immediately
  // does not apply if block is vacant, clearing, airborne, or in stall-then-fall.
  if (game.board[c][r].color === blockColor.VACANT) return;
  if (game.board[c][r].airborne) return;
  if (!blockIsInteractive(c, r)) return;

  // begin function
  const Square = game.board[c][r];
  let horizontalMatchLocations = findHorizontalMatches(c, r);
  let verticalMatchLocations = findVerticalMatches(c, r);
  let matchLocations = horizontalMatchLocations.concat(verticalMatchLocations);
  if (horizontalMatchLocations.length && verticalMatchLocations.length) {
    matchLocations.shift(); // remove duplicate [c,r]
  }
  return matchLocations;
}

function findHorizontalMatches(c, r) {
  let Square = game.board[c][r];
  let horizontalMatchLocations = [[c, r]];
  for (let x = c + 1; x < grid.COLS - 1; x++) {
    if (game.board[x][r].color !== Square.color) break;
    if (!blockIsInteractive(x, r)) break;
    horizontalMatchLocations.push([x, r]);
  }
  for (let x = c - 1; x >= 0; x--) {
    if (game.board[x][r].color !== Square.color) break;
    if (!blockIsInteractive(x, r)) break;
    horizontalMatchLocations.push([x, r]);
  }
  // require at least 3
  if (horizontalMatchLocations.length < 3) horizontalMatchLocations.length = 0;
  return horizontalMatchLocations;
}

function findVerticalMatches(c, r) {
  let Square = game.board[c][r];
  let verticalMatchLocations = [[c, r]];
  for (let y = r + 1; y < grid.ROWS - 1; y++) {
    if (game.board[c][y].color !== Square.color) break;
    if (!blockIsInteractive(c, y)) break;
    verticalMatchLocations.push([c, y]);
  }
  for (let y = r - 1; y >= 0; y--) {
    if (game.board[c][y].color !== Square.color) break;
    if (!blockIsInteractive(c, y)) break;
    verticalMatchLocations.push([c, y]);
  }
  // require at least 3
  if (verticalMatchLocations.length < 3) verticalMatchLocations.length = 0;
  return verticalMatchLocations;
}

function blockIsInteractive(c, r) {
  const Square = game.board[c][r];
  if (!INTERACTIVE_TYPES.includes(Square.type)) return false;
  if (Square.timer !== 0 && Square.type !== blockColor.LANDING) return false;
  return true;
}

export function blockPhysics(c, r) {
  return;
}

function assignClearTimers(matchLocations, blinkTime, initialFaceTime) {
  // console.log("old", `${matchLocations}`);
  matchLocations.sort(function(a, b) {
    return a[0] - b[0];
  });
  // console.log("new", `${matchLocations}`);
  const totalPopTime = game.blockPopMultiplier * (matchLocations.length - 1);
  for (let i = 0; i < matchLocations.length; i++) {
    let extraFaceTime = game.blockPopMultiplier * i;
    let c = matchLocations[i][0];
    let r = matchLocations[i][1];

    game.board[c][r].type = blockType.BLINKING;
    game.board[c][r].timer = blinkTime + initialFaceTime + totalPopTime;
    game.board[c][r].switchToFaceFrame = initialFaceTime + totalPopTime;
    game.board[c][r].switchToPoppedFrame = totalPopTime - extraFaceTime;
    if (game.addToPrimaryChain) {
      game.board[c][r].availableForPrimaryChain = true;
      game.board[c][r].availableForSecondaryChain = false;
    } else {
      game.board[c][r].availableForPrimaryChain = false;
      game.board[c][r].availableForSecondaryChain = true;
    }
  }
}
