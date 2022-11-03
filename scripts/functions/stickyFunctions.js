import { displayMessage } from "../..";
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
  outOfRange,
  SOLID_TYPES,
  debug,
  vacantBlockBelow,
} from "../global";
import { playAudio } from "./audioFunctions";
import { pause } from "./pauseFunctions";

// export const SelectedBlock = {
//   Actual: undefined,
//   Above: undefined,
//   Below: undefined,
//   L: undefined,
//   R: undefined,
//   pairsWith: ""
// };
const undefBlock =
  '{"name": "undefinedBlock", "x": -1, "y": -1, "color": "vacant", "type": "normal"}';
export let SelectedBlock = undefined;
// export let TouchOrders[0] = undefined;

export const TouchOrder = {
  active: false,
  target: [-1, -1],
  Main: undefined,
  KeySquare: {
    Highest: undefined,
    Lowest: undefined,
  },
  First: undefined,
  Second: undefined,
  Third: undefined,
  matches: [
    [-1, -1],
    [-1, -1],
    [-1, -1],
  ],
  pair: "",
  solidGroundArray: [],
};

export let TouchOrders = [];
for (let i = 0; i < 4; i++) {
  TouchOrders[i] = JSON.parse(JSON.stringify(TouchOrder));
}

export let match = [[], [], []];

// export function ThreeBlocksMatch() {
//   for (let i = 0; i < match[0].length; i++) {
//     if (match[i][0] === -1) return false;
//     for (let j = i + 1; j < match.length; j++) {
//       if (JSON.stringify(match[i]) === JSON.stringify(match[j])) {
//         return false;
//       }
//     }
//   }
//   return true;
// }

export function checkBufferedSwap(x, y) {
  const Square = game.board[x][y];
  const smartMatch = Square.smartMatch;
  // ? let FirstBlock = game.board[x][y];
  // ? let SecondBlock, ThirdBlock;
  if (y - 1 < 0 || y + 1 >= grid.ROWS) return false;
  if (
    game.board[x][y - 1].color === "vacant" &&
    game.board[x][y + 1].color === "vacant"
  ) {
    // there are two cases. First check if above solid block is a pair.
    let SecondBlock = findSolidBlockAbove(x, y - 1);
    if (SecondBlock === undefined) return false;
    smartMatch.secondCoord = [x, SecondBlock.y];
    // ? if (SecondBlock.x === -1) return false;
    // ? match[1] = [x, SecondBlock.y];
    if (Square.color === SecondBlock.color) {
      // smartMatch.secondCoord = [x, SecondBlock.y];
      // check directly one above for solid pair 1
      if (SecondBlock.y - 1 >= 0) {
        // playAudio(audio.announcer1);
        let ThirdBlock = game.board[x][SecondBlock.y - 1];
        if (ThirdBlock !== undefined && blockIsSolid(ThirdBlock)) {
          smartMatch.thirdCoord = [x, SecondBlock.y - 1];
          if (Square.color === ThirdBlock.color) {
            // ? ThirdBlock = game.board[x][SecondBlock.y - 1];
            // ? match[2] = [x, y - 1];
            return "Abv1 Abv2 |Main|";
          }
        }
      }
      // check below for solid pair
      if (SecondBlock.y + 1 < grid.ROWS) {
        let ThirdBlock = findSolidBlockBelow(x, ThirdBlock.y);
        if (ThirdBlock === undefined) return false;
        smartMatch.thirdCoord = [x, ThirdBlock.y];
        // playAudio(audio.announcer2);
        if (Square.color === ThirdBlock.color) {
          return "Abv1 |Main| Bel1";
        } else return false;
      }
    } else return false;
  } else return false;
}

export function stickyCheck(x, y) {
  if (game.board[x][y].targetX === undefined) return false;
  if (game.board[x][y].airborne) return false;
  if (outOfRange(x, y)) return false;
  if (!blockIsSolid(game.board[x][y])) return false;

  const Square = game.board[x][y];
  const smartMatch = Square.smartMatch;
  Object.keys(smartMatch).forEach((key) => (smartMatch[key] = undefined));
  // ? match[0] = [x, y];
  // ? match[1] = [-1, -1];
  // ? match[2] = [-1, -1];

  // ? SelectedBlock = game.board[x][y];

  // if ((result = checkBufferedSwap(x, y))) {
  //   return !!result;
  // }

  if ((result = checkIfFallingBlockMatches(Square))) {
    // if (debug.enabled) playAudio(audio.chain9);
    return !!result;
  }

  let [clearLine, lowKey, highKey] = findClearLine(Square);

  let dir;
  if (!clearLine || highKey[1] - 1 < 0) return false;
  let KeySquareLowest = game.board[lowKey[0]][lowKey[1]];
  let KeySquareHighest = game.board[highKey[0]][highKey[1]];
  smartMatch.clearLine = clearLine;
  smartMatch.lowestKeyCoord = [KeySquareLowest.x, KeySquareLowest.y];
  smartMatch.highestKeyCoord = [KeySquareHighest.x, KeySquareHighest.y];

  let result = "";
  let MainBlock;
  let FirstBlock, SecondBlock, ThirdBlock;
  let pair;
  switch (clearLine[0]) {
    case "a":
      if (
        isSolidPair(Square, game.board[x][y - 1]) &&
        (0 === 0 || containsSolidBlockPairOnRow(Square, highKey[1] - 1))
      ) {
        smartMatch.secondCoord = [x, y - 1];
        // result = "TPair Main |A|";
        result = checkAboveMatch(Square, true);
      } else if (
        isSolidPair(Square, game.board[x][y + 1]) &&
        (0 === 0 || containsSolidBlockPairOnRow(Square, highKey[1] - 1))
      ) {
        smartMatch.secondCoord = [x, y + 1];
        // result = "Main BPair |A|";
        result = checkAboveMatch(Square, true);
      } else {
        result = checkAboveMatch(Square, false);
      }
      if (debug.enabled && result) playAudio(audio.announcer1);
      break;
    case "s":
      dir = clearLine === "sideL" ? -1 : 1;
      MainBlock = Math.abs(KeySquareLowest.x - Square.x === dir)
        ? game.board[Square.x][Square.y]
        : game.board[Square.x + dir][Square.y];
      if (MainBlock.x !== Square.x) {
        if (!isSolidPair(MainBlock, Square)) break;
        // match[0] = [MainBlock.x, MainBlock.y];
      }

      if (
        MainBlock.x - dir >= 0 &&
        MainBlock.x - dir < grid.COLS &&
        isSolidPair(Square, game.board[MainBlock.x - dir][y])
      ) {
        // pair is left, but clear line is right
        smartMatch.secondCoord = [MainBlock.x - dir, y];
        result = checkSideMatch(Square, true, dir);
      } else {
        // pair is right, but clear line is left
        result = checkSideMatch(Square, false, dir);
      }
      if (debug.enabled && result) playAudio(audio.announcer2);
      break;
    case "b":
      MainBlock = game.board[x][y];
      if (y > grid.ROWS - 2) break; // must be at minimum third row from bottom
      result = checkBelowMatch(MainBlock);
      break;
  }
  if (debug.enabled && result) console.log(game.frames, result);
  return !!result; // send true if not falsy value
}

function checkBelowMatch(Square) {
  let smartMatch = Square.smartMatch;
  let [x, y] = [Square.x, Square.y];
  let lowKeyX = smartMatch.lowestKeyCoord[0];
  let lowKeyY = smartMatch.lowestKeyCoord[1];
  let result = "";
  let ThirdBlock;

  let [SecondBlock, pair] = determinePair(Square, "vertical");
  // do vertical pair cases
  if (pair === "B") {
    smartMatch.secondCoord = [SecondBlock.x, SecondBlock.y];
    if (CLEARING_TYPES.includes(game.board[x][y + 2].type)) {
      ThirdBlock = findSolidBlockBelow(x, y + 2);
      if (isSolidPair(Square, ThirdBlock)) {
        smartMatch.thirdCoord = [ThirdBlock.x, ThirdBlock.y];
        smartMatch.pair = pair;
        return "Main + BPair |B| Bot1";
      }
    }
  } else if (pair === "A") {
    smartMatch.secondCoord = [SecondBlock.x, SecondBlock.y];
    ThirdBlock = findSolidBlockBelow(lowKeyX, lowKeyY);
    if (isSolidPair(Square, ThirdBlock)) {
      smartMatch.thirdCoord = [ThirdBlock.x, ThirdBlock.y];
      smartMatch.pair = pair;
      return "TPair + Main |B| Bot1";
    }
  }

  // stop looking if block below is solid
  if (!blockVacOrClearing(game.board[Square.x][Square.y + 1])) return "";

  [SecondBlock, pair] = determinePair(Square, "horizontal");

  // We are looking to find if the pair's lowest keyY square are equal.
  if (pair && lowKeyY === findClearLine(SecondBlock, true)[1][1]) {
    // findClearLine(SecondBlock, true)[1][1] represents the lowKeyY of SecondBlock
    smartMatch.secondCoord = [SecondBlock.x, SecondBlock.y];
    let dir = pair == "L" ? -1 : 1;
    if (x + 2 * dir >= 0 && x + 2 * dir < grid.COLS) {
      ThirdBlock = game.board[x + 2 * dir][lowKeyY];
      if (isSolidPair(Square, ThirdBlock)) {
        smartMatch.thirdCoord = [ThirdBlock.x, ThirdBlock.y];
        smartMatch.pair = pair;
        return pair == "L" ? "LPair + Main |B| Lef1" : "Main + RPair |B| Rgt1";
      }
    }

    if (x - 1 * dir >= 0 && x - 1 * dir < grid.COLS) {
      ThirdBlock = game.board[x - 1 * dir][lowKeyY];
      if (isSolidPair(Square, ThirdBlock)) {
        smartMatch.thirdCoord = [ThirdBlock.x, ThirdBlock.y];
        smartMatch.pair = pair;
        return pair == "L" ? "LPair + Main |B| Rgt1" : "Main + RPair |B| Lef1";
      }
    }
  }

  smartMatch.pair = pair; // pair is empty

  // do tasks that involve no pairs. low key is very important

  // do vertical one. Second block must be at minimum on second row
  if (lowKeyY < grid.ROWS - 2) {
    SecondBlock = findSolidBlockBelow(lowKeyX, lowKeyY);
    if (isSolidPair(Square, SecondBlock)) {
      smartMatch.secondCoord = [SecondBlock.x, SecondBlock.y];
      ThirdBlock = game.board[SecondBlock.x][SecondBlock.y + 1];
      if (isSolidPair(Square, ThirdBlock)) {
        smartMatch.thirdCoord = [ThirdBlock.x, ThirdBlock.y];
        return "Main |B| Bot1 Bot2";
      }
    }
  }

  // now do horizontal, which has 3 cases.
  let solidGroundArray = checkSolidGround(lowKeyX, lowKeyY);
  if (solidGroundArray.includes(-1) && solidGroundArray.includes(1)) {
    SecondBlock = game.board[lowKeyX - 1][lowKeyY];
    ThirdBlock = game.board[lowKeyX + 1][lowKeyY];
    if (isSolidPair(Square, SecondBlock) && isSolidPair(Square, ThirdBlock)) {
      smartMatch.secondCoord = [SecondBlock.x, SecondBlock.y];
      smartMatch.thirdCoord = [ThirdBlock.x, ThirdBlock.y];
      return "Main |B| Lef1 Rgt1";
    }
  }

  if (solidGroundArray.includes(-1) && solidGroundArray.includes(-2)) {
    SecondBlock = game.board[lowKeyX - 1][lowKeyY];
    ThirdBlock = game.board[lowKeyX - 2][lowKeyY];
    if (isSolidPair(Square, SecondBlock) && isSolidPair(Square, ThirdBlock)) {
      smartMatch.secondCoord = [SecondBlock.x, SecondBlock.y];
      smartMatch.thirdCoord = [ThirdBlock.x, ThirdBlock.y];
      return "Main |B| Lef1 Lef2";
    }
  }

  if (solidGroundArray.includes(1) && solidGroundArray.includes(2)) {
    SecondBlock = game.board[lowKeyX + 1][lowKeyY];
    ThirdBlock = game.board[lowKeyX + 2][lowKeyY];
    if (isSolidPair(Square, SecondBlock) && isSolidPair(Square, ThirdBlock)) {
      smartMatch.secondCoord = [SecondBlock.x, SecondBlock.y];
      smartMatch.thirdCoord = [ThirdBlock.x, ThirdBlock.y];
      return "Main |B| Rgt1 Rgt2";
    }
  }

  return result;
}

function checkAboveMatch(Square, single = false) {
  let smartMatch = Square.smartMatch;
  let [keyX, keyY] = [
    smartMatch.highestKeyCoord[0],
    smartMatch.highestKeyCoord[1],
  ];
  let AboveBlock_1 = findSolidBlockAbove(keyX, keyY);
  if (!AboveBlock_1) return false;
  if (isSolidPair(Square, AboveBlock_1) || chainableBlockPairAbove(Square)) {
    if (single) {
      smartMatch.thirdCoord = [AboveBlock_1.x, AboveBlock_1.y];
      // cancel sticky if a three is already ready to chain
      if (Square.color === game.board[Square.x][Square.y - 1].color) {
        if (
          isSolidPair(Square, game.board[AboveBlock_1.x][AboveBlock_1.y - 1])
        ) {
          return false;
        }
      }
      return "Pair |A| Abv1";
    }
    smartMatch.secondCoord = [AboveBlock_1.x, AboveBlock_1.y];
    let AboveBlock_2 = findSolidBlockAbove(AboveBlock_1.x, AboveBlock_1.y - 1);
    if (isSolidPair(Square, AboveBlock_2)) {
      smartMatch.thirdCoord = [AboveBlock_2.x, AboveBlock_2.y];
      return "Single |A| Abv1 Abv2";
    }
  }
  return false;
}

function checkSideMatch(Square, single = false, dir) {
  let smartMatch = Square.smartMatch;
  let [highKeyX, highKeyY] = [
    smartMatch.highestKeyCoord[0],
    smartMatch.highestKeyCoord[1],
  ];
  let [lowKeyX, lowKeyY] = [
    smartMatch.lowestKeyCoord[0],
    smartMatch.lowestKeyCoord[1],
  ];
  let MainBlock = Math.abs(lowKeyX - Square.x === dir)
    ? game.board[Square.x][Square.y]
    : game.board[Square.x + dir][Square.y];
  // make sure that the lowest key square is on same level as selected block
  // playAudio(audio.announcerReady);
  if (MainBlock.y !== lowKeyY) return false;
  if (highKeyX < 0 || highKeyX >= grid.COLS) return false;
  let SideBlock_1 = findSolidBlockAbove(highKeyX, highKeyY);
  if (!SideBlock_1) return false;
  if (
    isSolidPair(MainBlock, SideBlock_1) ||
    chainableBlockPairAbove(SideBlock_1)
  ) {
    if (single) {
      smartMatch.thirdCoord = [SideBlock_1.x, SideBlock_1.y];
      // If swapping with same block and already paired, cancel redundant sticky
      // if (MainBlock.x === Square.x) return false;
      // if (MainBlock.x !== Square.x && MainBlock.swapDirectionX === -dir)
      //   return false;
      let s = dir === -1 ? "L" : "R";
      let t = dir === -1 ? "R" : "L";
      return `${t}Pair |${s}| Abv${s}1`;
    }
    smartMatch.secondCoord = [SideBlock_1.x, SideBlock_1.y];
    if (SideBlock_1.x + dir < 0 || SideBlock_1.x + dir >= grid.COLS)
      return false;
    // the y level needs to be the same as the original block
    let SideBlock_2 = findSolidBlockAbove(SideBlock_1.x + dir, lowKeyY);
    if (!SideBlock_2) return false;
    if (isSolidPair(MainBlock, SideBlock_2)) {
      smartMatch.thirdCoord = [SideBlock_2.x, SideBlock_2.y];
      let s = dir === -1 ? "L" : "R";
      return `Main |${s}| Abv${s}1 + ${s}2`;
    }
  }
  return false;
}

function findSolidBlockAbove(x, y, stopAtClearing = false) {
  if (outOfRange(x, y)) return undefined;

  // checks at and above the defined y height
  for (let j = y; j >= 0; j--) {
    if (blockIsSolid(game.board[x][j])) return game.board[x][j];
    if (stopAtClearing && CLEARING_TYPES.includes(game.board[x][j])) {
      return undefined;
    }
  }
  return undefined;
}

function findSolidBlockBelow(x, y, stopAtClearing = false) {
  if (outOfRange(x, y)) return undefined;
  for (let j = y + 1; j < grid.ROWS; j++) {
    if (blockIsSolid(game.board[x][j])) return game.board[x][j];
    if (stopAtClearing && CLEARING_TYPES.includes(game.board[x][j])) {
      return undefined;
    }
  }
  return undefined;
}

function findClearLine(Square, stopAfterCheckingBelow = false) {
  let [x, y] = [Square.x, Square.y];
  let lowestKeySquare = [];
  let highestClearSquare = [];
  let clearLine = "";

  // check below
  if (y < grid.ROWS - 1) {
    let clearFound = false;
    for (let j = y + 1; j < grid.ROWS; j++) {
      if (CLEARING_TYPES.includes(game.board[x][j].type)) {
        clearLine = "b";
        highestClearSquare = [x, j];
        clearFound = true;
        // determine B of clear zone
        if (j === grid.ROWS - 1) {
          lowestKeySquare = [x, j];
          return [clearLine, lowestKeySquare, highestClearSquare];
        }
        for (let k = j + 1; k < grid.ROWS; k++) {
          if (!blockVacOrClearing(game.board[x][k])) {
            lowestKeySquare = [x, k - 1];
            return [clearLine, lowestKeySquare, highestClearSquare];
          }
        }
        // we have k at B of grid, so key square is on B row
        lowestKeySquare = [x, grid.ROWS - 1];
        return [clearLine, lowestKeySquare, highestClearSquare];
      } else if (j - y == 2) break;
    }
  }

  if (stopAfterCheckingBelow) return [false, false, false];

  // check above (Must be at least 2 rows from A)
  if (y >= 1) {
    // if first square is vacant, that will be the key square.
    let useOriginalSquare = Square.color === "vacant";
    for (let j = y - 1; j >= 0; j--) {
      if (blockIsSolid(game.board[x][j])) {
        // end loop immediately if solid non-pair above is detected
        if (Square.color !== game.board[x][j].color) break;
      }
      if (CLEARING_TYPES.includes(game.board[x][j].type)) {
        lowestKeySquare = useOriginalSquare ? [x, y] : [x, j];
        clearLine = "a";
        if (j === 0) {
          highestClearSquare = [x, 0];
        }
        // now find the highest clearing square
        for (let k = j - 1; k >= 0; k--) {
          if (!CLEARING_TYPES.includes(game.board[x][k].type)) {
            highestClearSquare = [x, k + 1];
            return [clearLine, lowestKeySquare, highestClearSquare];
          }
        }
      }
    }
  }

  // check both sides, two squares.
  for (let dir = -1; dir <= 1; dir += dir === -1 ? 2 : 1) {
    // One-time While loop used for quick breakage
    while (true) {
      // end loop if out of x range, block is solid, or block below is vacant
      if (x + dir < 0 || x + dir >= grid.COLS) break;

      // if (blockIsSolid(game.board[x + dir][y])) break;
      for (let i = 1; i <= 2; i++) {
        if (
          (y === grid.ROWS - 1 ||
            !blockVacOrClearing(game.board[x + dir][y + 1])) &&
          x + i * dir >= 0 &&
          x + i * dir < grid.COLS
        ) {
          lowestKeySquare = [x + i * dir, y]; // key square is directly next to clearing side
          for (let j = y + 1; j < grid.ROWS; j++) {
            if (!blockVacOrClearing(game.board[x + i * dir][j])) {
              lowestKeySquare = [x + i * dir, j - 1];
              break;
            }
            if (j === grid.ROWS - 1)
              lowestKeySquare = [x + i * dir, grid.ROWS - 1];
          }
          if (CLEARING_TYPES.includes(game.board[x + i * dir][y].type)) {
            clearLine = dir === -1 ? "sideL" : "sideR"; // side left, side right
            if (y - 1 < 0) highestClearSquare = [x + i * dir, 0];
            else {
              highestClearSquare = [x + i * dir, y];
              for (let j = y - 1; j >= 0; j--) {
                if (!CLEARING_TYPES.includes(game.board[x + i * dir][j].type)) {
                  highestClearSquare = [x + i * dir, j + 1];
                  break;
                }
              }
            }
            return [clearLine, lowestKeySquare, highestClearSquare];
          } // end clearing condition
        } // end main condition
      } // end for loop

      break;
    } // end while
  }
  return [false, false, false];
}

function isSolidPair(Square_1, Square_2) {
  return (
    Square_1 !== undefined &&
    Square_2 !== undefined &&
    !outOfRange(Square_1.x, Square_1.y) &&
    !outOfRange(Square_2.x, Square_2.y) &&
    Square_1.color === Square_2.color &&
    blockIsSolid(Square_1) &&
    blockIsSolid(Square_2)
  );
}

function checkPairWithFirstNonVacantBlock(Square) {
  if (!Square) return undefined;
  let [x, y] = [Square.x, Square.y];
  if (y !== grid.ROWS - 1) {
    for (let j = y + 1; j < grid.ROWS; j++) {
      if (game.board[x][j].color !== "vacant") {
        if (
          !isSolidPair(Square, game.board[x][j]) ||
          j >= smartMatch.highestKeyCoord[1]
        ) {
          break;
        } else {
          return [game.board[x][j], "BPair"];
        }
      }
    }
  }
  if (y !== 0) {
    for (let j = y - 1; j >= 0; j--) {
      if (game.board[x][j].color !== "vacant") {
        if (!isSolidPair(Square, game.board[x][j])) break;
        else return [game.board[x][j], "TPair"];
      }
    }
  }

  if (x !== 0 && isSolidPair(Square, game.board[x - 1][y])) {
    return [game.board[x - 1][y], "LPair"];
  }
  if (x !== grid.COLS - 1 && isSolidPair(Square, game.board[x + 1][y])) {
    return [game.board[x + 1][y], "RPair"];
  }
  return [undefined, ""];
}

function chainableBlockPairAbove(Square) {
  if (Square.y - 1 < 0) return false;
  let result = false;
  let [x, y] = [Square.x, Square.y];

  for (let j = y - 1; j >= 0; j--) {
    let PairBlock = game.board[x][j];
    if (PairBlock.availForPrimaryChain || PairBlock.availForSecondaryChain) {
      if (isSolidPair(Square, game.board[x][j])) result = true;
    }
  }
  return result;
}

function containsSolidBlockPairOnRow(Square, row) {
  if (row < 0 || row >= grid.ROWS) return false;
  for (let x = Square.x; x < grid.COLS; x++) {
    if (CLEARING_TYPES.includes(game.board[x][row].type)) break;
    if (Square.color === game.board[x][row].color) return [x, row];
  }
  for (let x = Square.x; x >= 0; x--) {
    if (CLEARING_TYPES.includes(game.board[x][row].type)) break;
    if (Square.color === game.board[x][row].color) return [x, row];
  }
  return false;
}

function checkSolidGround(keyX, keyY) {
  // this function tests if a clear line is on the same row as a solid

  let solidGroundCasesPassed = [0];
  if (
    keyX - 1 >= 0 &&
    (keyY === grid.ROWS - 1 || !game.board[keyX - 1][keyY + 1].airborne)
  ) {
    solidGroundCasesPassed.unshift(-1);
  }
  if (
    keyX + 1 < grid.COLS &&
    (keyY === grid.ROWS - 1 || !game.board[keyX + 1][keyY + 1].airborne)
  ) {
    solidGroundCasesPassed.push(1);
  }
  if (
    keyX - 2 >= 0 &&
    (keyY === grid.ROWS - 1 || !game.board[keyX - 2][keyY + 1].airborne)
  ) {
    solidGroundCasesPassed.unshift(-2);
  }
  if (
    keyX + 2 < grid.COLS &&
    (keyY === grid.ROWS - 1 || !game.board[keyX + 2][keyY + 1].airborne)
  ) {
    solidGroundCasesPassed.push(2);
  }
  return solidGroundCasesPassed;
}

function checkIfFallingBlockMatches(MainBlock) {
  if (game.currentChain === 0) return false;
  let [x, y] = [MainBlock.x, MainBlock.y];
  let smartMatch = MainBlock.smartMatch;
  let [PairBlock, pair] = determinePair(MainBlock, "vertical");
  let FirstBlock, SecondBlock, ThirdBlock;
  let checkLeft1 = false;
  let checkLeft2 = false;
  let checkRight1 = false;
  let checkRight2 = false;
  let checkAbove = false;
  let result = "";

  if (
    (y - 1 >= 0 && game.board[x][y - 1].color === "vacant") ||
    (y - 2 >= 0 && game.board[x][y - 2].color === "vacant")
  )
    checkAbove = true;

  // check for match of falling block AND either pair or

  if (checkAbove) {
    // Main Block is the first square directly under vacant blocks
    FirstBlock = pair === "A" ? game.board[x][y - 1] : game.board[x][y];
    for (let j = FirstBlock.y - 1; j >= 0; j--) {
      if (blockIsSolid(game.board[x][j])) {
        if (FirstBlock.color === game.board[x][j].color) {
          if (pair) {
            ThirdBlock = game.board[x][j];
            smartMatch.thirdCoord = [x, j];
            return "single match above found vac";
          } else {
            SecondBlock = game.board[x][j];
            for (let k = SecondBlock.y - 1; k >= 0; k--) {
              smartMatch.secondCoord = [x, j];
              if (blockIsSolid(game.board[x][k])) {
                if (FirstBlock.color === game.board[x][k].color) {
                  ThirdBlock = game.board[x][k];
                  smartMatch.thirdCoord = [x, k];
                  return "double match above found vac";
                } else break; // solid block but not pair, end search
              }
            }
          }
        } else break; // block is solid but not a pair, so end search
      } // continue looking for solid block
    } // end for loop search for solid block
    smartMatch.secondCoord = smartMatch.thirdCoord = undefined;
  }

  // look for horizontal pairs
  [PairBlock, pair] = determinePair(MainBlock, "horizontal");

  if (
    x - 1 >= 0 &&
    game.board[x - 1][y].color === "vacant" &&
    !vacantBlockBelow(game.board[x - 1][y])
  ) {
    checkLeft1 = true;
  }
  if (
    x - 2 >= 0 &&
    game.board[x - 2][y].color == "vacant" &&
    pair == "L" &&
    !vacantBlockBelow(game.board[x - 2][y])
  ) {
    checkLeft2 = true;
  }

  if (
    x + 1 < grid.COLS &&
    game.board[x + 1][y].color === "vacant" &&
    !vacantBlockBelow(game.board[x + 1][y])
  ) {
    checkRight1 = true;
  }
  if (
    x + 2 < grid.COLS &&
    game.board[x + 2][y].color == "vacant" &&
    pair == "R" &&
    !vacantBlockBelow(game.board[x + 2][y])
  ) {
    checkRight2 = true;
  }

  if (checkLeft1) {
    FirstBlock = game.board[x][y];
    SecondBlock = findSolidBlockAbove(x - 1, y);
    if (isSolidPair(FirstBlock, SecondBlock)) {
      if (pair) {
        smartMatch.secondCoord = [SecondBlock.x, SecondBlock.y];
        ThirdBlock = game.board[x + 1][y];
        smartMatch.thirdCoord = [ThirdBlock.x, ThirdBlock.y];
        return "single match L1, pair block R1 vac";
      } else {
        smartMatch.secondCoord = [SecondBlock.x, SecondBlock.y];
        ThirdBlock = findSolidBlockAbove(x - 2, y);
        if (isSolidPair(FirstBlock, ThirdBlock)) {
          smartMatch.thirdCoord = [ThirdBlock.x, ThirdBlock.y];
          return "double match L1 L2 vac";
        }
      }
      // no three match has been found. Moving on.
    }
    smartMatch.secondCoord = smartMatch.thirdCoord = undefined;
  }
  if (checkLeft2) {
    // it has already been determined that pair is on left.
    FirstBlock = game.board[x][y];
    SecondBlock = game.board[x - 1][y];
    smartMatch.secondCoord = [x - 1, y];
    ThirdBlock = findSolidBlockAbove(x - 2, y - 1);
    if (isSolidPair(FirstBlock, ThirdBlock)) {
      smartMatch.thirdCoord = [x - 2, ThirdBlock.y];
      return "single match L2, pair block L1, vac";
    }
    smartMatch.secondCoord = smartMatch.thirdCoord = undefined;
  }

  if (checkRight1) {
    FirstBlock = game.board[x][y];
    SecondBlock = findSolidBlockAbove(x + 1, y);
    if (isSolidPair(FirstBlock, SecondBlock)) {
      if (pair) {
        smartMatch.secondCoord = [SecondBlock.x, SecondBlock.y];
        ThirdBlock = game.board[x - 1][y];
        smartMatch.thirdCoord = [ThirdBlock.x, ThirdBlock.y];
        return "single match R1, pair block L1, vac";
      } else {
        smartMatch.secondCoord = [SecondBlock.x, SecondBlock.y];
        ThirdBlock = findSolidBlockAbove(x + 2, y);
        if (isSolidPair(FirstBlock, ThirdBlock)) {
          smartMatch.thirdCoord = [ThirdBlock.x, ThirdBlock.y];
          return "double match R1 R2 vac";
        }
      }
      // no three match has been found. Moving on.
    }
    smartMatch.secondCoord = smartMatch.thirdCoord = undefined;
  }

  if (checkRight2) {
    // it has already been determined that a pair is on right.
    FirstBlock = game.board[x][y];
    SecondBlock = game.board[x + 1][y];
    smartMatch.secondCoord = [x + 1, y];
    ThirdBlock = findSolidBlockAbove(x + 2, y);
    if (isSolidPair(FirstBlock, ThirdBlock)) {
      smartMatch.thirdCoord = [x + 2, ThirdBlock.y];
      return "single match R2, pair block R1, vac";
    }
    smartMatch.secondCoord = smartMatch.thirdCoord = undefined;
  }
  // no vacant matches found
  return false;
}

function determinePair(Square, type) {
  let [x, y] = [Square.x, Square.y];
  let smartMatch = Square.smartMatch;
  let PairBlock;
  let pair = "";
  if (type === "vertical") {
    if (y - 1 >= 0 && isSolidPair(Square, (PairBlock = game.board[x][y - 1]))) {
      smartMatch.secondCoord = [x, PairBlock.y];
      return [PairBlock, "A"];
    }

    if (
      y + 1 < grid.ROWS &&
      isSolidPair(Square, (PairBlock = game.board[x][y + 1]))
    ) {
      smartMatch.secondCoord = [x, PairBlock.y];
      return [PairBlock, "B"];
    }
  } else {
    if (
      x - 1 >= 0 &&
      !game.board[x - 1][y].airborne &&
      isSolidPair(Square, (PairBlock = game.board[x - 1][y])) &&
      !vacantBlockBelow(PairBlock)
    ) {
      smartMatch.secondCoord = [x, PairBlock.y];
      return [PairBlock, "L"];
    }
    if (
      x + 1 < grid.COLS &&
      !game.board[x + 1][y].airborne &&
      isSolidPair(Square, (PairBlock = game.board[x + 1][y])) &&
      !vacantBlockBelow(PairBlock)
    ) {
      smartMatch.secondCoord = [x, PairBlock.y];
      return [PairBlock, "R"];
    }
  }

  return [undefined, ""];
}

function checkChainableBlockAbove(x, y) {
  let ResultingSquare = undefBlock;
  for (let j = y - 1; j >= 0; j--) {
    let NextSquare = game.board[x][j];
    if (
      NextSquare.availForPrimaryChain ||
      (NextSquare.availForSecondaryChain && !NextSquare.touched)
    ) {
      ResultingSquare = NextSquare;
      break;
    }
  }
  return ResultingSquare;
}

function firstVacantOrClearingBlockAbove(x, y) {
  if (y - 1 < 0) return undefined;
  if (!blockVacOrClearing(game.board[x][y - 1])) return undefined;
  for (let j = y - 1; j >= 0; j--) {
    if (blockVacOrClearing(game.board[x][j])) return game.board[x][j];
  }
  return undefined;
}

function lastVacantOrClearingBlockAbove(FirstClearBlock) {
  let x = FirstClearBlock.x;
  for (let j = FirstClearBlock.y - 1; j >= 0; j--) {
    if (
      game.board[x][j].color !== "vacant" &&
      !CLEARING_TYPES.includes(game.board[x][j].type)
    ) {
      return game.board[x][j + 1];
    }
  }
  return undefined;
}
