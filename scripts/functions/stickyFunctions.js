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
  SOLID_TYPES
} from "../global";
import { playAudio } from "./audioFunctions";
import { pause } from "./pauseFunctions";

let undefBlock =
  '{"name": "undefinedBlock", "x": -1, "y": -1, "color": "vacant", "type": "normal"}';

// export const SelectedBlock = {
//   Actual: JSON.parse(undefBlock),
//   Above: JSON.parse(undefBlock),
//   Below: JSON.parse(undefBlock),
//   L: JSON.parse(undefBlock),
//   R: JSON.parse(undefBlock),
//   pairsWith: ""
// };

export let SelectedBlock = JSON.parse(undefBlock);
// export let KeySquare = JSON.parse(undefBlock);

export const KeySquare = {
  Main: JSON.parse(undefBlock),
  Highest: JSON.parse(undefBlock),
  Lowest: JSON.parse(undefBlock),
  SpecialBlock: JSON.parse(undefBlock),
  First: JSON.parse(undefBlock),
  Second: JSON.parse(undefBlock),
  Third: JSON.parse(undefBlock),
  pairType: "",
  solidGroundArray: []
};

export let match = [[], [], []];

export function ThreeBlocksMatch() {
  for (let i = 0; i < match.length; i++) {
    if (match[i][0] === -1) return false;
    for (let j = i + 1; j < match.length; j++) {
      if (JSON.stringify(match[i]) === JSON.stringify(match[j])) {
        // pause("Pause -- A duplicate match occurred");
        return false;
      }
    }
  }
  return true;
}

export function checkBufferedSwap(x, y) {
  let FirstBlock = game.board[x][y];
  let SecondBlock, ThirdBlock;
  if (y - 1 < 0 || y + 1 >= grid.ROWS) return false;
  if (
    game.board[x][y - 1].color === "vacant" &&
    game.board[x][y + 1].color === "vacant"
  ) {
    // there are two cases. First check if above solid block is a pair.
    SecondBlock = findSolidBlockAbove(x, y - 1);
    if (SecondBlock.x === -1) return false;
    match[1] = [x, SecondBlock.y];
    playAudio(audio.announcerGo);
    if (FirstBlock.color === SecondBlock.color) {
      // check directly one above for solid pair 1
      if (SecondBlock.y - 1 >= 0) {
        playAudio(audio.announcer1);
        ThirdBlock = game.board[x][SecondBlock.y - 1];
        if (blockIsSolid(ThirdBlock)) {
          if (FirstBlock.color === ThirdBlock.color) {
            ThirdBlock = game.board[x][SecondBlock.y - 1];
            match[2] = [x, y - 1];
            return "Abv1 Abv2 |Main|";
          }
        }
      }
      if (SecondBlock.y + 1 < grid.ROWS) {
        ThirdBlock = findSolidBlockBelow(x, ThirdBlock.y);
        if (ThirdBlock.x === -1) return false;
        playAudio(audio.announcer2);
        if (FirstBlock.color === ThirdBlock.color) {
          match[2] = [x, ThirdBlock.y];
          return "Abv1 |Main| Bel1";
        } else return false;
      }
    } else return false;
  } else return false;
}

export function stickyCheck(x, y) {
  if (outOfRange(x, y)) return false;
  if (!blockIsSolid(game.board[x][y])) return false;
  match[0] = [x, y];
  match[1] = [-1, -1];
  match[2] = [-1, -1];

  SelectedBlock = game.board[x][y];

  if ((result = checkBufferedSwap(x, y))) {
    playAudio(audio.announcerThereItIs);
    return !!result;
  }
  if (
    (result = checkIfFallingBlockMatches(SelectedBlock)) &&
    ThreeBlocksMatch()
  ) {
    console.log(game.frames, `results2:`, result, `${match}`);
    return !!result;
  }
  let [clearLine, lowKey, highKey] = findClearLine(x, y);
  // console.log("clear line info:", clearLine, lowKey, highKey);
  let dir;
  if (!clearLine) return false;
  KeySquare.Lowest = game.board[lowKey[0]][lowKey[1]];
  if (highKey[1] - 1 < 0) return false;
  KeySquare.Highest = game.board[highKey[0]][highKey[1]];

  let result = "";
  let MainBlock, NextBlock;
  let type;
  switch (clearLine[0]) {
    case "a":
      if (
        isSolidPair(SelectedBlock, game.board[x][y - 1]) &&
        (0 === 0 || containsSolidBlockPairOnRow(SelectedBlock, highKey[1] - 1))
      ) {
        match[1] = [x, y - 1];
        // result = "TPair Main |A|";
        result = checkAboveMatch(true);
      } else if (
        isSolidPair(SelectedBlock, game.board[x][y + 1]) &&
        (0 === 0 || containsSolidBlockPairOnRow(SelectedBlock, highKey[1] - 1))
      ) {
        match[1] = [x, y + 1];
        // result = "Main BPair |A|";
        result = checkAboveMatch(true);
      } else {
        result = checkAboveMatch(false);
      }
      break;
    case "s":
      dir = clearLine === "sideL" ? -1 : 1;
      MainBlock = Math.abs(KeySquare.Lowest.x - SelectedBlock.x === dir)
        ? game.board[SelectedBlock.x][SelectedBlock.y]
        : game.board[SelectedBlock.x + dir][SelectedBlock.y];
      if (MainBlock.x !== SelectedBlock.x) {
        if (!isSolidPair(MainBlock, SelectedBlock)) break;
        match[0] = [MainBlock.x, MainBlock.y];
      }
      if (
        MainBlock.x - dir >= 0 &&
        MainBlock.x - dir < grid.COLS &&
        isSolidPair(SelectedBlock, game.board[MainBlock.x - dir][y])
      ) {
        // pair is left, but clear line is right
        match[1] = [MainBlock.x - dir, y];
        result = checkSideMatch(true, dir);
      } else {
        // pair is right, but clear line is left
        result = checkSideMatch(false, dir);
      }
      break;
    case "b":
      if (y + 2 >= grid.ROWS) break;
      // playAudio(audio.announcerGo);
      [NextBlock, type] = checkPairWithFirstNonVacantBlock(SelectedBlock);
      if (type) match[1] = [NextBlock.x, NextBlock.y];
      MainBlock = type === "BPair" ? NextBlock : SelectedBlock;
      result = checkBelowMatch(MainBlock, type);
      break;
  }
  console.log(game.frames, `results1:`, result, `${match}`);
  if (match[0][0] === -1 || match[1][0] === -1 || match[2][0] === -1) {
    console.log("fake match detected");
    result = false;
  }
  return !!result; // send true if not falsy value
}

function checkBelowMatch(MainBlock, pairType) {
  let [x, y] = [MainBlock.x, MainBlock.y];
  let result = "";

  let SolidBlockBelow_1 = findSolidBlockBelow(x, y);
  let SolidBlockBelow_2;

  if (pairType === "BPair" || pairType === "TPair") {
    if (isSolidPair(MainBlock, SolidBlockBelow_1)) {
      match[2] = [x, SolidBlockBelow_1.y];
      result =
        pairType === "BPair" ? "Main + BPair |B| Bot" : "TPair + Main |B| Bot";
    }
    // if a solid block exists between main block, no need to check any more cases.
    else if (pairType === "BPair") return false;
  }

  KeySquare.solidGroundArray = checkSolidGround(
    KeySquare.Lowest.x,
    KeySquare.Lowest.y
  );
  if (!KeySquare.solidGroundArray) return false;
  console.log(game.frames, "Solid ground array:", KeySquare.solidGroundArray);
  let ThirdBlock;

  while (true) {
    if (pairType === "LPair" && KeySquare.solidGroundArray.includes(-2)) {
      // playAudio(audio.announcer1);
      ThirdBlock = findSolidBlockAbove(x - 2, KeySquare.Lowest.y);
      if (isSolidPair(MainBlock, ThirdBlock)) {
        match[2] = [x - 2, ThirdBlock.y];
        result = "LPair + Main |B| Lef2";
        break;
      }
    }
    if (pairType === "LPair" && KeySquare.solidGroundArray.includes(1)) {
      playAudio(audio.announcer2);
      ThirdBlock = findSolidBlockAbove(x + 1, KeySquare.Lowest.y);
      if (isSolidPair(MainBlock, ThirdBlock)) {
        match[2] = [x + 1, ThirdBlock.y];
        result = "LPair + Main |B| Rgt1";
        break;
      }
    }
    if (pairType === "RPair" && KeySquare.solidGroundArray.includes(-1)) {
      playAudio(audio.announcer3);
      ThirdBlock = findSolidBlockAbove(x - 1, KeySquare.Lowest.y);
      if (isSolidPair(MainBlock, ThirdBlock)) {
        match[2] = [x - 1, ThirdBlock.y];
        result = "Main + RPair |B| Lef1";
        break;
      }
    }
    if (pairType === "RPair" && KeySquare.solidGroundArray.includes(2)) {
      playAudio(audio.announcer4);
      ThirdBlock = findSolidBlockAbove(x + 2, KeySquare.Lowest.y);
      if (isSolidPair(MainBlock, ThirdBlock)) {
        match[2] = [x + 2, ThirdBlock.y];
        result = "Main + RPair |B| Rgt2";
        break;
      }
    }

    // Now check no pair versions
    let SecondBlock, ThirdBlock;

    // First check below
    if (KeySquare.Lowest.y + 1 < grid.ROWS) {
      SecondBlock = game.board[x][KeySquare.Lowest.y + 1];
      if (isSolidPair(MainBlock, SecondBlock)) {
        match[1] = [SecondBlock.x, SecondBlock.y];
        ThirdBlock = findSolidBlockBelow(SecondBlock.x, SecondBlock.y);
        if (ThirdBlock.x !== -1 && isSolidPair(MainBlock, ThirdBlock)) {
          match[2] = [ThirdBlock.x, ThirdBlock.y];
          result = "Main |B| Bel1 Bel2";
          playAudio(audio.announcer1);
          break;
        }
      }
    }

    // then check left and right 2
    let [leftIsSolidPair, rightIsSolidPair] = [false, false];
    for (let dir = -1; dir < 2; dir += 2) {
      console.log("for loop dir:", dir);
      if (KeySquare.solidGroundArray.includes(dir)) {
        SecondBlock = game.board[x + dir][KeySquare.Lowest.y];
        if (SecondBlock.x !== -1 && isSolidPair(MainBlock, SecondBlock)) {
          match[1] = [SecondBlock.x, SecondBlock.y];
          dir === -1 ? (leftIsSolidPair = true) : (rightIsSolidPair = true);
          if (KeySquare.solidGroundArray.includes(2 * dir)) {
            ThirdBlock = game.board[x + 2 * dir][KeySquare.Lowest.y];
            if (ThirdBlock.x !== -1 && isSolidPair(MainBlock, ThirdBlock)) {
              match[2] = [ThirdBlock.x, ThirdBlock.y];
              result = `Main |B| ${dir === -1 ? "Lef1 + Lef2" : "Rgt1 + Rgt2"}`;
              playAudio(audio.announcer2);
              break;
            }
          }
        }
      }
    }
    console.log(leftIsSolidPair, rightIsSolidPair);
    // then check left 1 right 1
    if (leftIsSolidPair && rightIsSolidPair) {
      SecondBlock = game.board[x - 1][KeySquare.Lowest.y];
      match[1] = [SecondBlock.x, SecondBlock.y];
      ThirdBlock = game.board[x + 1][KeySquare.Lowest.y];
      match[2] = [ThirdBlock.x, ThirdBlock.y];
      playAudio(audio.announcer3);
      result = "Main |B| Lef1 + Rgt1";
      break;
    }
    break;
  }
  if (result) KeySquare.pairType = pairType;
  return result;
}

function checkAboveMatch(single = false) {
  let [keyX, keyY] = [KeySquare.Highest.x, KeySquare.Highest.y];
  let AboveBlock_1 = findSolidBlockAbove(keyX, keyY);
  if (!AboveBlock_1) return false;
  if (
    isSolidPair(SelectedBlock, AboveBlock_1) ||
    chainableBlockPairAbove(SelectedBlock)
  ) {
    if (single) {
      match[2] = [AboveBlock_1.x, AboveBlock_1.y];
      // cancel sticky if a three is already ready to chain
      if (
        SelectedBlock.color ===
        game.board[SelectedBlock.x][SelectedBlock.y - 1].color
      ) {
        if (
          isSolidPair(
            SelectedBlock,
            game.board[AboveBlock_1.x][AboveBlock_1.y - 1]
          )
        ) {
          return false;
        }
      }
      return "Pair |A| Abv1";
    }
    match[1] = [AboveBlock_1.x, AboveBlock_1.y];
    let AboveBlock_2 = findSolidBlockAbove(AboveBlock_1.x, AboveBlock_1.y - 1);
    if (isSolidPair(SelectedBlock, AboveBlock_2)) {
      match[2] = [AboveBlock_2.x, AboveBlock_2.y];
      return "Single |A| Abv1 Abv2";
    }
  }
  return false;
}

function checkSideMatch(single = false, dir) {
  let [highKeyX, highKeyY] = [KeySquare.Highest.x, KeySquare.Highest.y];
  let [lowKeyX, lowKeyY] = [KeySquare.Lowest.x, KeySquare.Lowest.y];
  let MainBlock = Math.abs(KeySquare.Lowest.x - SelectedBlock.x === dir)
    ? game.board[SelectedBlock.x][SelectedBlock.y]
    : game.board[SelectedBlock.x + dir][SelectedBlock.y];
  // make sure that the lowest key square is on same level as selected block
  if (MainBlock.y !== lowKeyY) return false;
  if (highKeyX + dir < 0 || highKeyX + dir >= grid.COLS) return false;
  let SideBlock_1 = findSolidBlockAbove(highKeyX, highKeyY);
  if (!SideBlock_1) return false;
  if (
    isSolidPair(MainBlock, SideBlock_1) ||
    chainableBlockPairAbove(SideBlock_1)
  ) {
    if (single) {
      match[2] = [SideBlock_1.x, SideBlock_1.y];
      // If swapping with same block and already paired, cancel redundant sticky
      // if (MainBlock.x === SelectedBlock.x) return false;
      // if (MainBlock.x !== SelectedBlock.x && MainBlock.swapDirection === -dir)
      //   return false;
      let s = dir === -1 ? "L" : "R";
      let t = dir === -1 ? "R" : "L";
      return `${t}Pair |${s}| Abv${s}1`;
    }
    match[1] = [SideBlock_1.x, SideBlock_1.y];
    if (SideBlock_1.x + dir < 0 || SideBlock_1.x + dir >= grid.COLS)
      return false;
    // the y level needs to be the same as the original block
    let SideBlock_2 = findSolidBlockAbove(SideBlock_1.x + dir, lowKeyY);
    if (!SideBlock_2) return false;
    if (isSolidPair(MainBlock, SideBlock_2)) {
      match[2] = [SideBlock_2.x, SideBlock_2.y];
      let s = dir === -1 ? "L" : "R";
      return `Main |${s}| Abv${s}1 + ${s}2`;
    }
  }
  return false;
}

function findSolidBlockAbove(x, y) {
  if (x === -1) return JSON.parse(undefBlock);
  // checks at and above the defined y height
  for (let j = y; j >= 0; j--) {
    if (blockIsSolid(game.board[x][j])) return game.board[x][j];
  }
  return JSON.parse(undefBlock);
}

function findSolidBlockBelow(x, y) {
  if (x === -1 || y + 1 >= grid.ROWS) return JSON.parse(undefBlock);
  for (let j = y + 1; j < grid.ROWS; j++) {
    if (blockIsSolid(game.board[x][j])) return game.board[x][j];
  }
  return JSON.parse(undefBlock);
}

function findClearLine(x, y) {
  let keySquare = [];
  let highestClearSquare = [];
  let clearLine = "";

  // check above (Must be at least 2 rows from A)
  if (y >= 1) {
    // if first square is vacant, that will be the key square.
    let useOriginalSquare = game.board[x][y].color === "vacant";
    for (let j = y - 1; j >= 0; j--) {
      if (blockIsSolid(game.board[x][j])) {
        if (SelectedBlock.color !== game.board[x][j].color) break;
      }
      if (CLEARING_TYPES.includes(game.board[x][j].type)) {
        keySquare = useOriginalSquare ? [x, y] : [x, j];
        clearLine = "a";
        if (j === 0) {
          highestClearSquare = [x, 0];
        }
        // now find the highest clearing square
        for (let k = j - 1; k >= 0; k--) {
          if (!CLEARING_TYPES.includes(game.board[x][k].type)) {
            highestClearSquare = [x, k + 1];
            return [clearLine, keySquare, highestClearSquare];
          }
        }
      }
    }
  }

  // check below
  if (y < grid.ROWS - 1) {
    let firstClearingSquare;
    let clearFound = false;
    for (let j = y + 1; j < grid.ROWS; j++) {
      if (CLEARING_TYPES.includes(game.board[x][j].type)) {
        clearLine = "b";
        highestClearSquare = [x, j];
        clearFound = true;
        // determine B of clear zone
        if (j === grid.ROWS - 1) {
          keySquare = [x, j];
          return [clearLine, keySquare, highestClearSquare];
        }
        for (let k = j + 1; k < grid.ROWS; k++) {
          if (!blockVacOrClearing(game.board[x][k])) {
            keySquare = [x, k - 1];
            return [clearLine, keySquare, highestClearSquare];
          }
        }
        // we have k at B of grid, so key square is on B row
        keySquare = [x, grid.ROWS - 1];
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

      // if (blockIsSolid(game.board[x + dir][y])) break;
      for (let i = 1; i <= 2; i++) {
        if (
          (y === grid.ROWS - 1 ||
            !blockVacOrClearing(game.board[x + dir][y + 1])) &&
          x + i * dir >= 0 &&
          x + i * dir < grid.COLS
        ) {
          keySquare = [x + i * dir, y]; // key square is directly next to clearing side
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
            return [clearLine, keySquare, highestClearSquare];
          } // end clearing condition
        } // end main condition
      } // end for loop

      break;
    } // end while
  }
  return [false, false, false];
}

function isSolidPair(Square_1, Square_2) {
  if (!Square_1 || !Square_2) return false;
  if (Square_1.x === -1 || Square_2.x === -1) return false;

  return (
    Square_1.color === Square_2.color &&
    blockIsSolid(Square_1) &&
    blockIsSolid(Square_2)
  );
}

function checkPairWithFirstNonVacantBlock(Square) {
  if (!Square) return JSON.parse(undefBlock);
  let [x, y] = [Square.x, Square.y];
  if (y !== grid.ROWS - 1) {
    for (let j = y + 1; j < grid.ROWS; j++) {
      if (game.board[x][j].color !== "vacant") {
        if (
          !isSolidPair(Square, game.board[x][j]) ||
          j >= KeySquare.Highest.y
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
  return [JSON.parse(undefBlock), ""];
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
  console.log(row);
  if (row < 0 || row >= grid.ROWS) return false;
  for (let x = Square.x; x < grid.COLS; x++) {
    console.log(game.board[x][row].color);
    if (CLEARING_TYPES.includes(game.board[x][row].type)) break;
    if (Square.color === game.board[x][row].color) return [x, row];
  }
  for (let x = Square.x; x >= 0; x--) {
    console.log(game.board[x][row].color);
    if (CLEARING_TYPES.includes(game.board[x][row].type)) break;
    if (Square.color === game.board[x][row].color) return [x, row];
  }
  return false;
}

function checkSolidGround(keyX, keyY) {
  // this function tests if a clear line is on the same row as a solid

  let solidGroundCasesPassed = [0];
  // console.log(
  //   "x:",
  //   keyX,
  //   "y:",
  //   keyY,
  //   game.board[keyX][keyY],
  //   blockVacOrClearing(game.board[keyX - 2][keyY]),
  //   blockVacOrClearing(game.board[keyX - 1][keyY]),
  //   blockVacOrClearing(game.board[keyX][keyY]),
  //   blockVacOrClearing(game.board[keyX + 1][keyY]),
  //   blockVacOrClearing(game.board[keyX + 2][keyY])
  // );
  if (keyX - 1 >= 0 && blockVacOrClearing(game.board[keyX - 1][keyY])) {
    solidGroundCasesPassed.unshift(-1);
  }
  if (keyX + 1 < grid.COLS && blockVacOrClearing(game.board[keyX + 1][keyY])) {
    solidGroundCasesPassed.push(1);
  }
  if (keyX - 2 >= 0 && blockVacOrClearing(game.board[keyX - 2][keyY])) {
    solidGroundCasesPassed.unshift(-2);
  }
  if (keyX + 2 < grid.COLS && blockVacOrClearing(game.board[keyX + 2][keyY])) {
    solidGroundCasesPassed.push(2);
  }

  console.log("ground cases passed:", solidGroundCasesPassed);
  return solidGroundCasesPassed;
}

function checkIfFallingBlockMatches(MainBlock) {
  if (game.currentChain === 0) return false;
  let x = MainBlock.x;
  let y = MainBlock.y;
  let [PairBlock, pair] = determinePair(MainBlock);
  let FirstBlock, SecondBlock, ThirdBlock;
  let checkLeft = false;
  let checkRight = false;
  let checkAbove = false;
  let result = "";

  // check above
  // if (PairBlock.y - 1 >= 0) {
  //   if (pair === "A") {[FirstBlock, SecondBlock] = [PairBlock, MainBlock] }

  //   let vacancyFound = false;
  //   if (FirstBlock.color === ThirdBlock.color)
  //     for (let j = SecondBlock.y - 1; j >= 0; j--) {
  //       let ThirdBlock = game.board[x][j];
  //       if (vacancyFound) {
  //         if (blockIsSolid(ThirdBlock)) {
  //           if (MainBlock.color === ThirdBlock.color) {
  //             result = "Main";
  //           }
  //         }
  //       }
  //       if (blockVacOrClearing(ThirdBlock)) vacancyFound = true;
  //     }
  // }

  if (
    (y - 1 >= 0 && game.board[x][y - 1].color === "vacant") ||
    (y - 2 >= 0 && game.board[x][y - 2].color === "vacant")
  )
    checkAbove = true;
  if (
    (x - 1 >= 0 && game.board[x - 1][y].color === "vacant") ||
    (x - 2 >= 0 && game.board[x - 2][y].color === "vacant")
  )
    checkLeft = true;
  if (
    (x + 1 < grid.COLS && game.board[x + 1][y].color === "vacant") ||
    (x + 2 < grid.COLS && game.board[x + 2][y].color === "vacant")
  )
    checkRight = true;

  if (checkAbove) {
    // Main Block is the first square directly under vacant blocks
    MainBlock = pair === "A" ? game.board[x][y - 1] : game.board[x][y];
    for (let j = MainBlock.y - 1; j >= 0; j--) {
      if (blockIsSolid(game.board[x][j])) {
        if (MainBlock.color === game.board[x][j].color) {
          if (pair) {
            ThirdBlock = game.board[x][j];
            match[2] = [x, j];
            return "single match above found";
          } else {
            SecondBlock = game.board[x][j];
            for (let k = SecondBlock.y - 1; k >= 0; k--) {
              match[1] = [x, j];
              if (blockIsSolid(game.board[x][k])) {
                if (MainBlock.color === game.board[x][k].color) {
                  ThirdBlock = game.board[x][k];
                  match[2] = [x, k];
                  return "double match above found";
                } else break; // solid block but not pair, end search
              }
            }
          }
        } else break; // block is solid but not a pair, so end search
      }
    }
  }

  if (!result && checkLeft) {
    // Main Block is the first square directly under vacant blocks
    MainBlock = pair === "left" ? game.board[x - 1][y] : game.board[x][y];
    let PairBlock = findSolidBlockAbove(MainBlock.x, MainBlock.y);
    if (isSolidPair(MainBlock, PairBlock)) {
      if (pair) {
        match[2] = [PairBlock.x, PairBlock.y];
        result = "single block left found";
      }
    }

    for (let j = MainBlock.y - 1; j >= 0; j--) {
      if (blockIsSolid(game.board[MainBlock.x - 1][j])) {
        if (MainBlock.color === game.board[MainBlock.x - 1][j].color) {
          if (pair) {
            match[2] = [MainBlock.x - 1, j];
            return "single block left found";
          } else if (
            MainBlock.x - 2 >= 0 &&
            isSolidPair(MainBlock, game.board[MainBlock.x - 2][j])
          ) {
            match[2] = [MainBlock.x - 2, j];
            return "double block left found";
          } else break; // third block does not match
        } else break; // first solid block is not pair
      }
    }
  }

  if (checkRight) {
    // Main Block is the first square directly under vacant blocks
    MainBlock = pair === "right" ? game.board[x + 1][y] : game.board[x][y];
    for (let j = MainBlock.y - 1; j >= 0; j--) {
      if (isSolidPair(MainBlock, game.board[MainBlock.x][j])) {
        if (!pair) {
          match[2] = [MainBlock.x, j];
          return "single block right found";
        } else if (
          MainBlock.x + 2 < grid.COLS &&
          isSolidPair(MainBlock, game.board[MainBlock.x + 2][j])
        ) {
          match[1] = [MainBlock.x, j];
          match[2] = [MainBlock.x + 2, j];
          return "double block right found";
        } else break;
      }
      if (CLEARING_TYPES.includes(game.board[x][j])) break;
    }
  }
  return false;
}

function determinePair(Square) {
  console.log(Square);
  let x = Square.x,
    y = Square.y;
  let PairBlock;
  if (y - 1 >= 0 && isSolidPair(Square, (PairBlock = game.board[x][y - 1]))) {
    match[1] = [x, PairBlock.y];
    return [PairBlock, "A"];
  }

  if (
    y + 1 < grid.ROWS &&
    isSolidPair(Square, (PairBlock = game.board[x][y + 1]))
  ) {
    match[1] = [x, PairBlock.y];
    return [PairBlock, "B"];
  }

  if (
    x - 1 >= 0 &&
    !game.board[x - 1][y].airborne &&
    isSolidPair(Square, (PairBlock = game.board[x - 1][y]))
  ) {
    match[1] = [x, PairBlock.y];
    return [PairBlock, "L"];
  }
  if (
    x + 1 < grid.COLS &&
    !game.board[x + 1][y].airborne &&
    isSolidPair(Square, (PairBlock = game.board[x + 1][y]))
  ) {
    match[1] = [x, PairBlock.y];
    return [PairBlock, "R"];
  }
  return [JSON.parse(undefBlock), ""];
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
  console.log("First Chainable Detected (A):", ResultingSquare);
  return ResultingSquare;
}

function firstVacantOrClearingBlockAbove(x, y) {
  if (y - 1 < 0) return JSON.parse(undefBlock);
  if (!blockVacOrClearing(game.board[x][y - 1])) return JSON.parse(undefBlock);
  for (let j = y - 1; j >= 0; j--) {
    if (blockVacOrClearing(game.board[x][j])) return game.board[x][j];
  }
  return JSON.parse(undefBlock);
}

function lastVacantOrClearingBlockAbove(FirstClearBlock) {
  console.log(FirstClearBlock);
  let x = FirstClearBlock.x;
  for (let j = FirstClearBlock.y - 1; j >= 0; j--) {
    console.log(game.frames, "testing", game.board[x][j]);
    if (
      game.board[x][j].color !== "vacant" &&
      !CLEARING_TYPES.includes(game.board[x][j].type)
    ) {
      return game.board[x][j + 1];
    }
  }
  return JSON.parse(undefBlock);
}
