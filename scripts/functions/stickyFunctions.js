import { audio } from "../fileImports";
import {
  game,
  win,
  grid,
  touch,
  INTERACTIVE_TYPES,
  CLEARING_TYPES,
  blockIsSolid,
  blockVacantOrClearing
} from "../global";
import { playAudio } from "./audioFunctions";

const SelectedBlock = {
  Actual: undefined,
  Above: undefined,
  Below: undefined,
  OnLeft: undefined,
  OnRight: undefined
};

const KeySquare = {
  Actual: undefined,
  Above: { 1: undefined, 2: undefined },
  Below: { 1: undefined, 2: undefined },
  OnLeft: { 1: undefined, 2: undefined },
  OnRight: { 1: undefined, 2: undefined },
  EarliestAbove: undefined,
  EarliestBelow: undefined
};

export function stickyCheck(x, y) {
  if (x === 0 || x === grid.COLS - 1) return false;
  SelectedBlock.Actual = game.board[x][y];
  SelectedBlock.Above = y - 1 >= 0 ? game.board[x][y - 1] : undefined;
  SelectedBlock.Below = y + 1 < grid.ROWS ? game.board[x][y + 1] : undefined;
  SelectedBlock.OnLeft = x - 1 >= 0 ? game.board[x - 1][y] : undefined;
  SelectedBlock.OnRight = x + 1 < grid.COLS ? game.board[x + 1][y] : undefined;

  if (findKeySquareBelow(x, y)) {
    if (singleBlockSticksTheLanding(x, y)) return true;
    if (pairOfBlocksStickTheLanding(x, y)) return true;
    game.message = "Found key sq but no pairs";
  }
  if (findKeySquareAbove(x, y)) {
    if (aSandwichIsMade(x, y)) return true;
    game.message = "Found key sq but no pairs";
  }
  if (
    SelectedBlock.Below &&
    SelectedBlock.Below.color === SelectedBlock.Actual.color &&
    findKeySquareBelow(x, y + 1)
  ) {
    // playAudio(audio.announcerGo);
    if (topPairSticksTheLanding(x, y)) return true;
  }

  if (
    SelectedBlock.Above &&
    SelectedBlock.Above.color === SelectedBlock.Actual.color &&
    findKeySquareAbove(x, y - 1) &&
    bottomPairCatch(x, y)
  )
    playAudio(audio.announcerGo);

  if (
    SelectedBlock.Above &&
    SelectedBlock.Above.color === SelectedBlock.Actual.color &&
    findKeySquareAbove(x, y - 1) &&
    KeySquare.Above[1].color === SelectedBlock.Actual.color &&
    bottomPairCatch(x, y)
  ) {
    return true;
  }

  // add more checks here
}

function updateKeySquareObject(keyX, keyY) {
  KeySquare.Actual = game.board[keyX][keyY];
  KeySquare.Above[1] = keyY - 1 >= 0 ? findBlock(keyX, keyY - 1) : undefined;
  KeySquare.Above[2] = keyY - 2 >= 0 ? findBlock(keyX, keyY - 2) : undefined;
  KeySquare.Below[1] = keyY + 1 < 12 ? game.board[keyX][keyY + 1] : undefined;
  KeySquare.Below[2] = keyY + 2 < 12 ? game.board[keyX][keyY + 2] : undefined;
  KeySquare.OnLeft[1] = keyX - 1 >= 0 ? findBlock(keyX - 1, keyY) : undefined;
  KeySquare.OnLeft[2] = keyX - 2 >= 0 ? findBlock(keyX - 2, keyY) : undefined;
  KeySquare.OnRight[1] = keyX + 1 < 6 ? findBlock(keyX + 1, keyY) : undefined;
  KeySquare.OnRight[2] = keyX + 2 < 6 ? findBlock(keyX + 2, keyY) : undefined;
}

function findBlock(x, y) {
  // searches for an airborne block
  if (y === 0) return undefined;
  for (let i = x; i >= 0; i--) {
    if (!INTERACTIVE_TYPES.includes(game.board[i][y].type))
      return game.board[x][y]; // will be the initial vacant block
    if (
      game.board[i][y].color !== "vacant" &&
      INTERACTIVE_TYPES.includes(game.board[i][y].type)
    ) {
      return game.board[i][y]; // will be the block that is going to fall.
    }
  }
  return game.board[x][y]; // all blocks above are vacant, so return original vacant block
}

function findKeySquareBelow(x, y) {
  touch.keySquare.x = 5;
  touch.keySquare.y = 1;
  // A key square is the lowest block during a clear just Above the floor or an interactive block
  if (y + 1 >= grid.ROWS) return false;
  if (!CLEARING_TYPES.includes(game.board[x][y + 1].type)) return false;
  KeySquare.Actual = game.board[x][y + 1];
  touch.keySquare.x = x;
  touch.keySquare.y = y + 1;
  for (let j = y + 2; j < grid.ROWS; j++) {
    KeySquare.Actual = game.board[x][j - 1];
    touch.keySquare.x = x;
    touch.keySquare.y = j - 1;
    if (INTERACTIVE_TYPES.includes(game.board[x][j].type)) {
      break;
    }
  }
  updateKeySquareObject(touch.keySquare.x, touch.keySquare.y);
  // playAudio(audio.announcerThereItIs);
  return true;
}

function findKeySquareAbove(x, y) {
  touch.keySquare.x = 5;
  touch.keySquare.y = 1;
  // Return false if near ceiling or the first block above is not clearing or vacant
  if (y - 1 <= 0 || blockVacantOrClearing(x, y - 1)) return false;
  for (let j = y - 1; j >= 0; j--) {
    if (CLEARING_TYPES.includes(game.board[x][j].type)) {
      // playAudio(audio.announcerPayoff);
      KeySquare.Actual = game.board[x][j].type;
      touch.keySquare.x = x;
      touch.keySquare.y = j;
      updateKeySquareObject(touch.keySquare.x, touch.keySquare.y);
      return true;
    }
  }
  return false;
}

//
function singleBlockSticksTheLanding(x, y) {
  // playAudio(audio.announcerGo);
  console.log(SelectedBlock.Actual);
  console.log(KeySquare);
  // check bottom first, is easiest
  if (
    KeySquare.Below[2] &&
    SelectedBlock.Actual.color === KeySquare.Below[1].color &&
    INTERACTIVE_TYPES.includes(KeySquare.Below[1].type) &&
    SelectedBlock.Actual.color === KeySquare.Below[2].color &&
    INTERACTIVE_TYPES.includes(KeySquare.Below[2].type)
  ) {
    console.log("sticky true, two", SelectedBlock.Actual.color, "found Below.");
    return true;
  }

  // bottom failed, now check left 2, left 1 right 1, and right 2

  // check left 2
  if (
    KeySquare.OnLeft["2"] &&
    SelectedBlock.Actual.color === KeySquare.OnLeft[1].color &&
    INTERACTIVE_TYPES.includes(KeySquare.OnLeft[1].type) &&
    SelectedBlock.Actual.color === KeySquare.OnLeft[2].color &&
    INTERACTIVE_TYPES.includes(KeySquare.OnLeft[2].type)
  ) {
    console.log("sticky true, two", SelectedBlock.Actual.color, "found left.");
    return true;
  }

  // check right 2
  if (
    KeySquare.OnRight[2] &&
    SelectedBlock.Actual.color === KeySquare.OnRight[1].color &&
    INTERACTIVE_TYPES.includes(KeySquare.OnRight[1].type) &&
    SelectedBlock.Actual.color === KeySquare.OnRight[2].color &&
    INTERACTIVE_TYPES.includes(KeySquare.OnRight[2].type)
  ) {
    console.log("sticky true, two", SelectedBlock.Actual.color, "found right.");
    return true;
  }

  // check left 1 right 1
  if (
    KeySquare.OnLeft[1] &&
    KeySquare.OnRight[1] &&
    SelectedBlock.Actual.color === KeySquare.OnRight[1].color &&
    INTERACTIVE_TYPES.includes(KeySquare.OnRight[1].type) &&
    SelectedBlock.Actual.color === KeySquare.OnLeft[1].color &&
    INTERACTIVE_TYPES.includes(KeySquare.OnLeft[1].type)
  ) {
    console.log(
      "sticky true, ",
      SelectedBlock.Actual.color,
      "found left & right."
    );
    return true;
  }

  console.log("sticky color", SelectedBlock.Actual.color, "false");
  return false;
}

function pairOfBlocksStickTheLanding(x, y) {
  // playAudio(audio.announcerGo);
  let desiredColor = SelectedBlock.Actual.color;
  // see if a pair of blocks on top of each other will create pair on a single block below
  if (
    SelectedBlock.Above &&
    SelectedBlock.Above.color === desiredColor &&
    INTERACTIVE_TYPES.includes(SelectedBlock.Above.type) &&
    KeySquare.Below[1] &&
    KeySquare.Below[1].color === desiredColor &&
    INTERACTIVE_TYPES.includes(KeySquare.Below[1].type)
  ) {
    // playAudio(audio.announcer1);
    console.log("above pair of ", desiredColor, "makes match");
    return true;
  }

  // see if there is a potential horizontal pair on left
  if (
    SelectedBlock.OnLeft &&
    SelectedBlock.OnLeft.color === desiredColor &&
    INTERACTIVE_TYPES.includes(SelectedBlock.OnLeft.type)
  ) {
    if (
      (KeySquare.OnLeft[2] &&
        KeySquare.OnLeft[2].color === desiredColor &&
        INTERACTIVE_TYPES.includes(KeySquare.OnLeft[2].type)) ||
      (KeySquare.OnRight[1] &&
        KeySquare.OnRight[1].color === desiredColor &&
        INTERACTIVE_TYPES.includes(KeySquare.OnRight[1].type))
    ) {
      // playAudio(audio.announcer2);
      return true;
    }
    // see if there is a potential horizontal pair on left
  }

  if (
    SelectedBlock.OnRight &&
    SelectedBlock.OnRight.color === desiredColor &&
    INTERACTIVE_TYPES.includes(SelectedBlock.OnRight.type)
  ) {
    if (
      (KeySquare.OnRight[2] &&
        KeySquare.OnRight[2].color === desiredColor &&
        INTERACTIVE_TYPES.includes(KeySquare.OnRight[2].type)) ||
      (KeySquare.OnLeft[1] &&
        KeySquare.OnLeft[1].color === desiredColor &&
        INTERACTIVE_TYPES.includes(KeySquare.OnLeft[1].type))
    ) {
      // playAudio(audio.announcer3);
      return true;
    }
  }

  // see if there is a same color block below, and if so, see if key square.
  return false;
}

function aSandwichIsMade(x, y) {
  let desiredColor = SelectedBlock.Actual.color;
  let endOfClear = false;

  for (let j = KeySquare.Actual.y - 1; j >= 0; j--) {
    let CurrentSquare = game.board[x][j];
    if (endOfClear && CLEARING_TYPES.includes(CurrentSquare.type)) {
      return false;
    }
    if (!CLEARING_TYPES.includes(CurrentSquare.type)) endOfClear = true;

    if (blockIsSolid(x, j)) {
      if (CurrentSquare.color !== desiredColor) return false;
      if (
        y + 1 < grid.ROWS &&
        SelectedBlock.Below.color === desiredColor &&
        INTERACTIVE_TYPES.includes(SelectedBlock.Below.type)
      ) {
        playAudio(audio.announcer4);
        return true;
      }
      // case 2
      if (
        j - 1 >= 0 &&
        game.board[x][j - 1].color === desiredColor &&
        INTERACTIVE_TYPES.includes(game.board[x][j - 1].type)
      ) {
        playAudio(audio.announcer5);
        return true;
      }
    } else {
      return false;
    }
  }
}

function topPairSticksTheLanding(x, y) {
  let desiredColor = SelectedBlock.Actual.color;
  if (INTERACTIVE_TYPES.includes(SelectedBlock.Below.type)) {
    if (
      KeySquare.Below[1] &&
      KeySquare.Below[1].color === desiredColor &&
      INTERACTIVE_TYPES.includes(KeySquare.Below[1].type)
    ) {
      // playAudio(audio.announcer4);
      return true;
    }
  }
}

function bottomPairCatch(x, y) {
  let desiredColor = SelectedBlock.Actual.color;
  if (y + 1 >= grid.ROWS || blockVacantOrClearing(x, y - 1)) return false;

  let endOfClear = false;
  for (let j = KeySquare.Actual.y - 1; j >= 0; j--) {
    let CurrentSquare = game.board[x][j];
    if (endOfClear && CLEARING_TYPES.includes(CurrentSquare.type)) return false;
    if (!CLEARING_TYPES.includes(CurrentSquare.type)) endOfClear = true;
    if (blockIsSolid(x, j)) {
      if (CurrentSquare.color === desiredColor) playAudio(audio.announcer1);
      return CurrentSquare.color === desiredColor;
    }
  }
}
