import { audio } from "../fileImports";
import {
  game,
  win,
  grid,
  touch,
  INTERACTIVE_TYPES,
  CLEARING_TYPES,
  blockIsSolid,
  blockVacOrClearing,
  outOfRange
} from "../global";
import { playAudio } from "./audioFunctions";

let undefBlock =
  '{"name": "undefinedBlock", "x": -1, "y": -1, "color": "vacant", "type": "normal"}';

export const SelectedBlock = {
  Actual: JSON.parse(undefBlock),
  Above: JSON.parse(undefBlock),
  Below: JSON.parse(undefBlock),
  OnLeft: JSON.parse(undefBlock),
  OnRight: JSON.parse(undefBlock),
  pairsWith: ""
};

export const KeySquare = {
  Actual: JSON.parse(undefBlock),
  Above: { 1: JSON.parse(undefBlock), 2: JSON.parse(undefBlock) },
  Below: { 1: JSON.parse(undefBlock), 2: JSON.parse(undefBlock) },
  OnLeft: { 1: JSON.parse(undefBlock), 2: JSON.parse(undefBlock) },
  OnRight: { 1: JSON.parse(undefBlock), 2: JSON.parse(undefBlock) },
  EarliestAbove: JSON.parse(undefBlock),
  EarliestBelow: JSON.parse(undefBlock)
};

export let pair = [[], [], []];

export function stickyCheck(x, y) {
  if (outOfRange(x, y)) return false;
  pair[0] = [x, y];
  pair[1] = [-1, -1];
  pair[2] = [-1, -1];
  SelectedBlock.Actual = game.board[x][y];
  SelectedBlock.Above =
    y - 1 >= 0 ? game.board[x][y - 1] : JSON.parse(undefBlock);
  SelectedBlock.Below =
    y + 1 < grid.ROWS ? game.board[x][y + 1] : JSON.parse(undefBlock);
  SelectedBlock.OnLeft =
    x - 1 >= 0 ? game.board[x - 1][y] : JSON.parse(undefBlock);
  SelectedBlock.OnRight =
    x + 1 < grid.COLS ? game.board[x + 1][y] : JSON.parse(undefBlock);
  let result;

  console.log(game.frames, "color pair is", SelectedBlock.Actual.color);

  let omit = [];
  // while (SelectedBlock.pairsWith !== "NONE") {
  SelectedBlock.pairsWith = determinePair(omit);
  switch (SelectedBlock.pairsWith) {
    case "left": {
      if (findTouchOrderside(x, y, "l") && stickySide(x - 1, y, "l", 1)) {
        result = `"Left |L| LPair + Main"`;
      }
      break;
    }
    case "right": {
      if (findTouchOrderside(x, y, "r") && stickySide(x + 1, y, "r", 1)) {
        result = "Main RPair |R| Right";
      }
      break;
    }
    case "above": {
      if (findKeySquareBelow(x, y) && stickyFloor(x, y, 1)) {
        result = "TPair + Main |B| Bottom";
        playAudio(audio.announcer4);
      } else if (findKeySquareAbove(x, y - 1) && stickyCeil(x, y - 1, 1)) {
        result = "Top |A| TPair + Main";
      }
      break;
    }
    case "below": {
      if (findKeySquareBelow(x, y + 1) && stickyFloor(x, y + 1, 1)) {
        result = "Top |B| TPair + Main";
      } else if (findKeySquareAbove(x, y) && stickyCeil(x, y, 1)) {
        result = "Top  |A| Main + BPair";
      }

      break;
    }
    case "NONE": {
      if (findTouchOrderside(x, y, "l") && stickySide(x, y, "l")) {
        result = "Main + BPair |L| Bottom";
      } else if (findTouchOrderside(x, y, "r") && stickySide(x, y, "r")) {
        result = "Top  |R| Main + BPair";
      }
      if (findKeySquareBelow(x, y) && stickyFloor(x, y)) {
        result = "check floor";
      } else if (findKeySquareAbove(x, y) && stickyCeil(x, y)) {
        result = "check ceiling";
      }
      break;
    }
  }
  // } // end while

  if (result) console.log(game.frames, result);
  // if (!game.boardIsClearing) {
  //   touch.keySquare.x = 5;
  //   touch.keySquare.y = 1;
  // }
  return !!result;
}

function findClearLine(x, y) {
  let keySquare = [];
  let highestClearSquare = [];
  let clearLine = "";

  // check above (Must be at least 2 rows from top)
  if (y >= 1) {
    // if first square is vacant, that will be the key square.
    let useOriginalSquare = game.board[x][y].color === "vacant";
    for (let j = y - 1; j >= 0; j--) {
      if (blockIsSolid(game.board[x][j])) {
        break; // end loop since solid block is before clear
      }
      if (CLEARING_TYPES.includes(game.board[x][j].type)) {
        keySquare = useOriginalSquare ? [x, y] : [x, j];
        clearLine = "a";
        if (j === 0) {
          highestClearSquare = [x, j];
          return [clearLine, keySquare, highestClearSquare];
        }
        // now find the highest clearing square
        for (let k = j - 1; k >= 0; k--) {
          if (!CLEARING_TYPES.includes(game.board[x][k].type)) {
            highestClearSquare = [x, k - 1];
            return [clearLine, keySquare, highestClearSquare];
          }
        }
      }
    }
  }

  // check below
  if (y < grid.ROWS - 1) {
    let clearFound = false;
    for (let j = y + 1; j < grid.ROWS; j++) {
      if (CLEARING_TYPES.includes(game.board[x][j])) {
        clearLine = "b";
        highestClearSquare = [x][j];
        clearFound = true;
        // determine bottom of clear zone
        if (j === grid.ROWS - 1) {
          keySquare = [x][j];
          return [clearLine, keySquare, highestClearSquare];
        }
        for (let k = j + 1; k <= grid.ROWS - 2; k++) {
          if (game.board[x][k].color !== "vacant") {
            keySquare = [x][k - 1];
            return [clearLine, keySquare, highestClearSquare];
          }
        }
        // we have k at bottom of grid, so key square is on bottom row
        keySquare = [x][grid.ROWS - 1];
        return [clearLine, keySquare, highestClearSquare];
      }
    }
  }

  // check both sides.
  for (let dir = -1; dir <= 1; dir += 2) {
    // One-time While loop used for quick breakage
    while (true) {
      // end loop if out of x range, block is solid, or block below is vacant
      if (x + dir < 0 || x + dir >= grid.COLS) break;
      if (y !== grid.ROWS - 1 && game.board[x + dir][y + 1].color === "vacant")
        break;
      if (blockIsSolid(game.board[x + dir][y])) break;
      keySquare = [x + dir, y]; // it is obvious key square is directly next to clearing side
      if (x + dir >= 0 && x + dir < grid.COLS) {
        if (CLEARING_TYPES.includes(game.board[x + dir][y])) {
          clearLine = dir === -1 ? "l" : "r";
          if (y - 1 < 0) highestClearSquare = [x + dir, 0];
          else {
            for (let j = y - 1; j >= 0; j--) {
              if (!CLEARING_TYPES.includes(game.board[x + dir][y])) {
                highestClearSquare = [x + dir, j - 1];
              }
            }
          }
          return [clearLine, keySquare, highestClearSquare];
        } // end clearing condition
      } // end main condition
      break;
    } // end while
  }

  return false;
}

function updateKeySquareObject(keyX, keyY) {
  if (outOfRange(keyX, keyY)) return;
  KeySquare.Actual = game.board[keyX][keyY];
  KeySquare.Above[1] =
    keyY - 1 >= 0 ? findBlock(keyX, keyY - 1) : JSON.parse(undefBlock);
  KeySquare.Above[2] =
    KeySquare.Above[1].y - 1 >= 0
      ? findBlock(keyX, KeySquare.Above[1].y - 1)
      : JSON.parse(undefBlock);
  KeySquare.Below[1] =
    keyY + 1 < 12 ? game.board[keyX][keyY + 1] : JSON.parse(undefBlock);
  KeySquare.Below[2] =
    keyY + 2 < 12 ? game.board[keyX][keyY + 2] : JSON.parse(undefBlock);
  KeySquare.OnLeft[1] =
    keyX - 1 >= 0 ? findBlock(keyX - 1, keyY) : JSON.parse(undefBlock);
  KeySquare.OnLeft[2] =
    keyX - 2 >= 0 ? findBlock(keyX - 2, keyY) : JSON.parse(undefBlock);
  KeySquare.OnRight[1] =
    keyX + 1 < 6 ? findBlock(keyX + 1, keyY) : JSON.parse(undefBlock);
  KeySquare.OnRight[2] =
    keyX + 2 < 6 ? findBlock(keyX + 2, keyY) : JSON.parse(undefBlock);
  if (!outOfRange(keyX, keyY)) {
    touch.keySquare.x = keyX;
    touch.keySquare.y = keyY;
  }
}

function findBlock(x, y) {
  // searches for an airborne block
  if (y === 0) return JSON.parse(undefBlock);
  if (x < 0 || x >= grid.COLS) return JSON.parse(undefBlock);
  if (blockIsSolid(game.board[x][y])) return game.board[x][y];
  let firstVacantFound = false;
  for (let j = y - 1; j >= 0; j--) {
    if (blockIsSolid(game.board[x][j])) {
      return game.board[x][j]; // found the falling solid block
    }
    if (firstVacantFound && CLEARING_TYPES.includes(game.board[x][j].type))
      return game.board[x][y]; //
    if (game.board[x][j].color === "vacant") firstVacantFound = true;
  }
  return JSON.parse(undefBlock); // all blocks above are vacant, so return original vacant block
}

function findKeySquareBelow(x, y) {
  try {
    if (!game.board[x][y]) return false;
    // touch.keySquare.x = 5;
    // touch.keySquare.y = 1;
    // A key square is the lowest block during a clear just Above the floor or an interactive block
    if (y + 1 >= grid.ROWS) return false;
    // playAudio(audio.announcer5);
    if (!CLEARING_TYPES.includes(game.board[x][y + 1].type)) return false;
    playAudio(audio.announcerGo);
    KeySquare.Actual = game.board[x][y + 1];
    // touch.keySquare.x = x;
    // touch.keySquare.y = y + 1;
    for (let j = y + 2; j < grid.ROWS; j++) {
      KeySquare.Actual = game.board[x][j - 1];
      // touch.keySquare.x = x;
      // touch.keySquare.y = j - 1;
      if (INTERACTIVE_TYPES.includes(game.board[x][j].type)) {
        break;
      }
      if (j === grid.ROWS - 1) KeySquare.Actual = game.board[x][j];
    }
    updateKeySquareObject(KeySquare.Actual.x, KeySquare.Actual.y);
    // playAudio(audio.announcerThereItIs);
    return true;
  } catch (e) {
    console.error(`findKeySquareBelow(${x}, ${y}) crashed.`, e, e.stack);
  }
}

function findKeySquareAbove(x, y) {
  try {
    // touch.keySquare.x = 5;
    // touch.keySquare.y = 1;
    // Return false if near ceiling or the first block above is not clearing or vacant
    if (!blockVacOrClearing(game.board[x][y - 1])) return false;
    playAudio(audio.announcerGo);
    for (let j = y - 1; j >= 1; j--) {
      if (CLEARING_TYPES.includes(game.board[x][j].type)) {
        // playAudio(audio.announcerPayoff);
        KeySquare.Actual = game.board[x][j];
        // touch.keySquare.x = x;
        // touch.keySquare.y = j;
        updateKeySquareObject(KeySquare.Actual.x, KeySquare.Actual.y);
        return true;
      }
    }
    return false;
  } catch (e) {
    playAudio(audio.announcerFireworks);
    console.log(
      `findKeySquareAbove(${x}, ${y}) crashed. Reason:`,
      e,
      e.stack,
      KeySquare
    );
  }
}

function findTouchOrderside(x, y, side) {
  try {
    let dir = side === "l" ? -1 : 1;
    if (outOfRange(x + dir, y)) return false;
    if (!blockVacOrClearing(game.board[x + dir][y])) return false;
    playAudio(audio.announcerClear);
    for (let j = y; j >= 1; j--) {
      if (CLEARING_TYPES.includes(game.board[x + dir][j].type)) {
        if (
          j === grid.ROWS - 1 ||
          !blockVacOrClearing(game.board[x + dir][j + 1])
        ) {
          KeySquare.Actual = game.board[x + dir][y]; // key square confirmed
          updateKeySquareObject(KeySquare.Actual.x, KeySquare.Actual.y);
          return true;
        }
      }
    }
    return false;
  } catch (e) {
    console.error(
      `findTouchOrderside(${x}, ${y}, ${side}) crashed.`,
      e,
      e.stack,
      KeySquare
    );
  }
}

//
function stickyFloor(c, r, single = false) {
  if (outOfRange(c, r)) return false;
  single ? playAudio(audio.announcer1) : playAudio(audio.announcerGo);
  const MainBlock = game.board[c][r];
  // look for left pair
  const leftPair = isSolidPair(MainBlock, KeySquare.OnLeft[1]);
  if (leftPair) {
    if (single) {
      pair[2] = [KeySquare.OnLeft[1].x, KeySquare.OnLeft[1].y];
      return true;
    }
    if (isSolidPair(MainBlock, KeySquare.OnLeft[2])) {
      pair[1] = [KeySquare.OnLeft[1].x, KeySquare.OnLeft[1].y];
      pair[2] = [KeySquare.OnLeft[2].x, KeySquare.OnLeft[2].y];
      return true;
    }
  }
  // look for right pair
  const rightPair = isSolidPair(MainBlock, KeySquare.OnRight[1]);
  if (rightPair) {
    if (single) {
      pair[2] = [KeySquare.OnRight[1].x, KeySquare.OnRight[1].y];
      return true;
    }
    if (isSolidPair(MainBlock, KeySquare.OnRight[2])) {
      pair[1] = [KeySquare.OnRight[1].x, KeySquare.OnRight[1].y];
      pair[2] = [KeySquare.OnRight[2].x, KeySquare.OnRight[2].y];
      return true;
    }
  }
  // check if a left and right pair was made earlier
  if (leftPair && rightPair) {
    pair[1] = [KeySquare.OnLeft[1].x, KeySquare.OnLeft[1].y];
    pair[2] = [KeySquare.OnRight[1].x, KeySquare.OnRight[1].y];
    return true;
  }
  // check below pair
  const belowPair = isSolidPair(MainBlock, KeySquare.Below[1]);
  if (belowPair) {
    if (single) {
      pair[2] = [KeySquare.Below[1].x, KeySquare.Below[1].y];
      return true;
    }
    if (isSolidPair(MainBlock, KeySquare.Below[2])) {
      pair[1] = [KeySquare.Below[1].x, KeySquare.Below[1].y];
      pair[2] = [KeySquare.Below[2].x, KeySquare.Below[2].y];
      return true;
    }
  }
  return false;
}

function stickyCeil(c, r, single = false) {
  const MainBlock = game.board[c][r];
  // check bottom pair
  if (isSolidPair(MainBlock, KeySquare.Above[1])) {
    if (single) {
      pair[2] = [KeySquare.Above[1].x, KeySquare.Above[1].y];
      return true;
    }
    pair[1] = [KeySquare.Above[1].x, KeySquare.Above[1].y];
    if (isSolidPair(MainBlock, KeySquare.Above[2])) {
      pair[2] = [KeySquare.Above[2].x, KeySquare.Above[2].y];
      return true;
    }
  }

  // // check left pair
  // if (isSolidPair(MainBlock, KeySquare.OnLeft[1])) {
  //   if (single) {
  //     pair[2] = [KeySquare.OnLeft[1].x, KeySquare.OnLeft[1].y];
  //     return true;
  //   }
  //   pair[1] = [KeySquare.OnLeft[1].x, KeySquare.OnLeft[1].y];
  //   if (isSolidPair(MainBlock, KeySquare.OnLeft[2])) {
  //     pair[2] = [KeySquare.OnLeft[2].x, KeySquare.OnLeft[2].y];
  //     return true;
  //   }
  // }

  // // check right pair
  // if (isSolidPair(MainBlock, KeySquare.OnRight[1])) {
  //   if (single) {
  //     pair[2] = [KeySquare.OnRight[1].x, KeySquare.OnRight[1].y];
  //     return true;
  //   }
  //   pair[1] = [KeySquare.OnRight[1].x, KeySquare.OnRight[1].y];
  //   if (isSolidPair(MainBlock, KeySquare.OnRight[2])) {
  //     pair[2] = [KeySquare.OnRight[2].x, KeySquare.OnRight[2].y];
  //     return true;
  //   }
  // }

  return false;
}

function stickySide(c, r, side, single = false) {
  if (outOfRange(c, r)) return false;
  let MainBlock = game.board[c][r];
  console.log(
    game.frames,
    "sticky side initiated,",
    c,
    r,
    side,
    single,
    MainBlock
  );
  let dir = side === "l" ? -1 : 1;
  if (outOfRange(c + dir, r)) return false;
  let SideSquare = game.board[c + dir][r];
  if (blockVacOrClearing(SideSquare)) return false;
  if (isSolidPair(MainBlock, KeySquare.Above[1])) {
    playAudio(audio.announcerGo);
    pair[1] = [KeySquare.Above[1].x, KeySquare.Above[1].y];
    if (single) return true;
    if (outOfRange(c + 2 * dir, r)) return false;
    if (dir === -1 && isSolidPair(MainBlock, KeySquare.OnLeft[1])) {
      pair[2] = [[KeySquare.OnLeft[1].x, KeySquare.OnLeft[1].y]];
      return true;
    }
    if (dir === 1 && isSolidPair(MainBlock, KeySquare.OnRight[1])) {
      pair[2] = [[KeySquare.OnRight[1].x, KeySquare.OnRight[1].y]];
      return true;
    }
  }
  console.log(
    "side stick failed. Key Square:",
    side === "l" ? KeySquare.OnLeft[1] : KeySquare.OnRight[1]
  );
  return false;
}

function determinePair(omit = []) {
  let x = SelectedBlock.Actual.x;
  let y = SelectedBlock.Actual.y;
  // try {
  //   console.log(
  //     game.frames,
  //     "center:",
  //     SelectedBlock.Actual.color,
  //     "above:",
  //     SelectedBlock.Above.color,
  //     "below:",
  //     SelectedBlock.Below.color,
  //     "left:",
  //     SelectedBlock.OnLeft.color,
  //     "right:",
  //     SelectedBlock.OnRight.color
  //   );
  // } catch (error) {
  //   console.log(game.frames, "cannot print because an edge was detected");
  // }

  if (
    !omit.includes("above") &&
    y - 1 >= 0 &&
    isSolidPair(SelectedBlock.Actual, SelectedBlock.Above)
  ) {
    pair[1] = [SelectedBlock.Above.x, SelectedBlock.Above.y];
    return "above";
  }

  if (
    !omit.includes("below") &&
    y + 1 < grid.ROWS &&
    isSolidPair(SelectedBlock.Actual, SelectedBlock.Below)
  ) {
    pair[1] = [SelectedBlock.Below.x, SelectedBlock.Below.y];
    return "below";
  }

  if (
    !omit.includes("left") &&
    x - 1 >= 0 &&
    isSolidPair(SelectedBlock.Actual, SelectedBlock.OnLeft)
  ) {
    pair[1] = [SelectedBlock.OnLeft.x, SelectedBlock.OnLeft.y];
    return "left";
  }
  if (
    !omit.includes("right") &&
    x + 1 < grid.COLS &&
    isSolidPair(SelectedBlock.Actual, SelectedBlock.OnRight)
  ) {
    pair[1] = [SelectedBlock.OnRight.x, SelectedBlock.OnRight.y];
    return "right";
  }
  return "NONE";
}

function isSolidPair(Square_1, Square_2) {
  // console.log(
  //   game.frames,
  //   "Pair of\n",
  //   Square_1,
  //   "\n",
  //   Square_2,
  //   "is ",
  //   Square_1.color === Square_2.color &&
  //     blockIsSolid(Square_1) &&
  //     blockIsSolid(Square_2)
  // );
  if (!Square_1 || !Square_2) return false;

  return (
    Square_1.color === Square_2.color &&
    blockIsSolid(Square_1) &&
    blockIsSolid(Square_2)
  );
}
