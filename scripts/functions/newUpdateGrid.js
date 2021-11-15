import {
  game,
  blockColor,
  blockType,
  grid,
  debug,
  INTERACTIVE_TYPES
} from "../global";

import { audio } from "../fileImports";

import { playAudio } from "./audioFunctions";

export function updateGrid(frameAdvance = false) {
  let possibleLandedLocations = [];
  let highestRowFound = false;
  Object.keys(game.boardStateExistence).forEach(
    el => (game.boardStateExistence[el] = false)
  );
  for (let y = grid.ROWS + 1; y >= 0; y--) {
    for (let x = 0; x < grid.COLS; x++) {
      // checkBoardStateOfCoordinate(x, y);
      if (!highestRowFound && game.board[x][y].color !== blockColor.VACANT) {
        game.highestRow = y;
        game.highestColIndex = x;
        highestRowFound = true;
      }
      // Check to see if a block is still legally in a landing animation
      if (game.board[x][y].type === blockType.LANDING) {
        for (let i = grid.ROWS - 1; i > y; i--) {
          if (game.board[x][i].color === blockColor.VACANT) {
            game.board[x][y].type = blockType.NORMAL;
            game.board[x][y].timer = 0;
            break;
            /* A blockColor.VACANT block below a "landed" block was detected,
                           so the animation will be cancelled. */
          }
        }
      }

      if (
        game.board[x][y].availableForPrimaryChain ||
        game.board[x][y].availableForSecondaryChain
      ) {
        if (
          game.board[x][y].color == blockColor.VACANT ||
          (game.board[x][y].type == blockType.LANDING &&
            game.board[x][y].timer > 8 &&
            game.board[x][y].timer < 11)
        ) {
          game.board[x][y].availableForPrimaryChain = false;
          game.board[x][y].availableForSecondaryChain = false;
        }
      }

      if (0 === 0 || !frameAdvance) {
        if (game.board[x][y].timer === -1) {
          game.board[x][y].timer = 0;
        } else if (game.board[x][y].timer > 0) {
          game.board[x][y].timer -= 1;
          game.boardRiseDisabled = true;
        }
        if (
          !debug.freeze &&
          (game.board[x][y].type === blockType.BLINKING ||
            game.board[x][y].type === blockType.FACE ||
            game.board[x][y].type === blockType.POPPED)
        ) {
          // console.log(x, y, game.board[x][y]);
          switch (game.board[x][y].timer) {
            case game.board[x][y].switchToPoppedFrame + 2:
              playAudio(audio.blockClear);
              break;
            case 0:
              game.board[x][y].color = blockColor.VACANT;
              game.board[x][y].type = blockType.NORMAL;
              // game.board[x][y].switchToFaceFrame = 0;
              // game.board[x][y].switchToPoppedFrame = 0;
              // console.log("do delay timer");
              if (
                y > 0 &&
                game.board[x][y - 1].color != blockColor.VACANT &&
                INTERACTIVE_TYPES.includes(game.board[x][y - 1].type)
              ) {
                // Give interactive pieces a slight delay timer
                // console.log("do delay timer");
                game.board[x][y - 1].timer = game.blockStallTime;
              }
              game.boardRiseDisabled = false;
              for (let i = y - 1; i > 0; i--) {
                // create chain available blocks above current
                // If clearing piece detected, break loop since no more chainable blocks.
                if (!INTERACTIVE_TYPES.includes(game.board[x][i].type)) break;
                if (game.board[x][y].availableForPrimaryChain) {
                  game.board[x][i].availableForPrimaryChain = true;
                } else if (game.board[x][y].availableForSecondaryChain)
                  game.board[x][i].availableForSecondaryChain = true;
              }
              break;
            case game.board[x][y].switchToFaceFrame:
              game.board[x][y].type = blockType.FACE;
              break;
            case game.board[x][y].switchToPoppedFrame:
              game.board[x][y].type = blockType.POPPED;
              // console.log("block popped");
              break;
          }
        }
      }
    }
  }
}

// function checkBlockState(x,y) {

// }

// function checkBoardStateOfCoordinate(x,y) {
//   if (game.boardStateExistence.clearing && !INTERACTIVE_TYPES.includes(game.board[x][y].type)) {
//     game.boardStateExistence.clearing = false;
//   }
//   if (isBlockAirborne) {

//   }
//   if (!INTERACTIVE_TYPES)
// }

// function isBlockAirborne(x,y) {
//   if (y === 11) return false;
//   for (let y = 0; y<)
// }

export function gravity(gameSpeed, x, y, possibleLandedLocations) {
  // automatically return if block not interactive, since gravity will not apply
  if (!INTERACTIVE_TYPES.includes(game.board[x][y].type))
    return possibleLandedLocations;
  let airborne = isAirborne(x, y);

  if (airborne) {
    game.board[x][y].airborne = true;
    game.boardRiseDisabled = true; // no raising when block is airborne
    // Cancel landing animation since airborne
    if (game.board[x][y].type === blockType.LANDING) {
      // turn into normal block with no stall time
      game.board[x][y].type === blockType.NORMAL;
      game.board[x][y].timer === 0;
    }
    if (
      game.board[x][y].timer === 0 &&
      game.board[x][y + 1].color === blockColor.VACANT
    ) {
      // make block fall by one, then add to possible landed locations
      transferToNextRow(x, y);
      possibleLandedLocations.push([x, y + 1]);
    }
  } else if (!airborne) {
    // if landing animation over, return to normal.
    game.board[x][y].airborne = false;
    // if landing animation is done
    if (
      game.board[x][y].type === blockType.LANDING &&
      game.board[x][y].timer === 0
    ) {
      game.board[x][y].type === blockType.NORMAL;
      game.board[x][y].touched === false;
      game.boardRiseDisabled = false;
    }
  }

  // check to see if we are at the end of the board.
  if (x === grid.COLS - 1 && y === 0) {
    for (let i = 0; i < possibleLandedLocations.length; i++) {
      let c = possibleLandedLocations[i][0];
      let r = possibleLandedLocations[i][1];
      if (
        game.board[c][r].color != blockColor.VACANT &&
        game.board[c][r + 1].color != blockColor.VACANT
      ) {
        game.board[c][r].type = blockType.LANDING;
        game.board[c][r].timer = 10; // 10 frames is length of landing animation
        //DEBUG
        if (debug.slowdown == 1) {
          game.board[c][r].timer = 120;
        }
      }
    }
  }
  if (debug.freeze == 1) {
    game.board[x][y + 1].timer += 1;
  } else if (debug.slowdown == 1) {
    game.board[x][y + 1].timer = 120;
  }
}

function isAirborne(x, y) {
  // if block directly below is in clearing, block is proven grounded.
  if (
    y === 11 ||
    !INTERACTIVE_TYPES.includes(game.board[x][y + 1].type) ||
    game.board[x][y].color === blockColor.VACANT
  )
    return false;
  for (let j = y + 1; j < grid.ROWS - 1; j++) {
    // if a vacant block is detected somewhere below the block, block is airborne.
    if (game.board[x][j].color === blockColor.VACANT) return true;
  }
  return false;
}

function transferToNextRow(x, y) {
  game.board[x][y].color = blockColor.VACANT;
  game.board[x][y + 1].color = game.board[x][y].color;

  // now transfer properties
  game.board[x][y + 1].type = game.board[x][y].type;
  game.board[x][y + 1].touched = game.board[x][y].touched;
  game.board[x][y + 1].availableForSecondaryChain =
    game.board[x][y].availableForSecondaryChain;
  game.board[x][y + 1].availableForPrimaryChain =
    game.board[x][y].availableForPrimaryChain;

  // reset all properties of original block
  game.board[x][y].availableForPrimaryChain = false;
  game.board[x][y].availableForPrimaryChain = false;
  game.board[x][y].touched = false;
}

/////
/////
//////
// check if block is done with landing animation
// if (
//   game.board[x][y].type === blockType.LANDING &&
//   game.board[x][y].timer === 0
// ) {
//   if (y === 11) {
//     game.board[x][11].type = blockType.NORMAL;
//     game.boardRiseDisabled = false;
//   } else {
//     game.board[x][y].touched = false;
//     game.boardRiseDisabled = false;
//   }
// }

// // old code
// for (let x = 0; x < grid.COLS; x++) {
//   if (
//     game.board[x][11].type == blockType.LANDING &&
//     game.board[x][11].timer == 0
//   ) {
//     game.board[x][11].type = blockType.NORMAL;
//     game.boardRiseDisabled = false;
//   }
//   for (let y = grid.ROWS - 1; y >= 0; y--) {
//     if (
//       game.board[x][y].type == blockType.LANDING &&
//       game.board[x][y + 1].color == blockColor.VACANT
//     ) {
//       game.board[x][y].type = blockType.NORMAL;
//       game.board[x][y].timer = 0;
//     }

//     if (
//       game.board[x][y].type == blockType.LANDING &&
//       game.board[x][y].timer == 0
//     ) {
//       game.board[x][y].type = blockType.NORMAL;
//       game.board[x][y].touched = false;
//       game.boardRiseDisabled = false;
//     }

//     if (
//       game.board[x][y].color != blockColor.VACANT &&
//       game.board[x][y + 1].color == blockColor.VACANT &&
//       INTERACTIVE_TYPES.includes(game.board[x][y].type)
//     ) {
//       // if normal block, fall one unit
//       game.boardRiseDisabled = false;
//       // When a block is ready to fall
//       if (game.board[x][y].timer == 0) {
//         game.board[x][y + 1].color = game.board[x][y].color;
//         game.board[x][y + 1].type = game.board[x][y].type;
//         game.board[x][y + 1].touched = game.board[x][y].touched;
//         game.board[x][y + 1].availableForSecondaryChain =
//           game.board[x][y].availableForSecondaryChain;
//         game.board[x][y + 1].availableForPrimaryChain =
//           game.board[x][y].availableForPrimaryChain;
//         game.board[x][y].color = blockColor.VACANT;
//         game.board[x][y].touched = false;
//         possibleLandedLocations.push([x, y + 1]);

//         //Debug
//         if (debug.freeze == 1) {
//           game.board[x][y + 1].timer += 1;
//         } else if (debug.slowdown == 1) {
//           game.board[x][y + 1].timer = 120;
//         }

//         // Make sure all blocks above falling block have same timer
//       }
//     }
//   }
//   for (let i = 0; i < possibleLandedLocations.length; i++) {
//     let x = possibleLandedLocations[i][0];
//     let y = possibleLandedLocations[i][1];
//     if (
//       game.board[x][y].color != blockColor.VACANT &&
//       game.board[x][y + 1].color != blockColor.VACANT
//     ) {
//       game.board[x][y].type = blockType.LANDING;
//       game.board[x][y].timer = 10; // 10 frames is length of landing animation
//       //DEBUG
//       if (debug.slowdown == 1) {
//         game.board[x][y].timer = 120;
//       }
//     }
//   }
// }
// //   // if double speed, will need to check function twice
// //   if (gameSpeed == 2) {
// //     doGravity(1);
// //     checkMatch();
// //     updateGrid();
// //     isChainActive();
// //   }
// // }
