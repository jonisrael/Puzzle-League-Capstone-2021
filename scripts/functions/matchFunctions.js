// Contains legalMatch, checkMatch, and updateScore

import {
  announcer,
  blockColor,
  blockType,
  PIECES,
  INTERACTIVE_PIECES,
  app,
  grid,
  game,
  win,
  preset,
  api,
  chainLogic,
  performance,
  randInt,
  debug
} from "../global";

import { playChainSFX, playAudio } from "./audioFunctions";

export function legalMatch(clearLocations) {
  if (clearLocations.length == 0) {
    return false;
  }

  let clearLocationsLength = clearLocations.length;

  for (let i = 0; i < clearLocationsLength; i++) {
    let c = clearLocations[i][0];
    let r = clearLocations[i][1];
    for (let j = 11; j > r; j--) {
      if (game.board[c][j].color == blockColor.VACANT) {
        return false; // If the block is falling, no match occurs.
      }
    }
  }
  game.grounded = false;
  return true;
}

export function checkMatch() {
  // Vertical Case, starting from top block
  let done = false;
  let checkAgain = false;
  let clearLocations = [];
  let clearLocationsString = "";
  let add1ToChain = false;
  while (!done && !checkAgain) {
    done = true;
    checkAgain = false;
    for (let c = 0; c < grid.COLS; c++) {
      // Check Vertical and afterwards, horizontal
      for (let r = 1; r < grid.ROWS - 1; r++) {
        if (
          game.board[c][r].color != blockColor.VACANT &&
          game.board[c][r].color == game.board[c][r - 1].color &&
          game.board[c][r].color == game.board[c][r + 1].color &&
          INTERACTIVE_PIECES.includes(game.board[c][r].type) &&
          INTERACTIVE_PIECES.includes(game.board[c][r - 1].type) &&
          INTERACTIVE_PIECES.includes(game.board[c][r + 1].type)
        ) {
          checkAgain = true;
          clearLocations.push([c, r - 1]);
          clearLocations.push([c, r]);
          clearLocations.push([c, r + 1]);
          // Check for four, five, and six clear
          if (
            r < 10 &&
            game.board[c][r].color == game.board[c][r + 2].color &&
            INTERACTIVE_PIECES.includes(game.board[c][r + 2].type)
          ) {
            clearLocations.push([c, r + 2]);
            if (
              r < 9 &&
              game.board[c][r].color == game.board[c][r + 3].color &&
              INTERACTIVE_PIECES.includes(game.board[c][r + 3].type)
            ) {
              clearLocations.push([c, r + 3]);
              if (
                r < 8 &&
                game.board[c][r].color == game.board[c][r + 4].color &&
                INTERACTIVE_PIECES.includes(game.board[c][r + 4].type)
              ) {
                clearLocations.push([c, r + 4]);
              }
            }
          }
          done = false;
        }
      }
    }

    for (let c = 1; c < grid.COLS - 1; c++) {
      // Check Horizontal
      for (let r = 0; r < grid.ROWS; r++) {
        if (
          game.board[c][r].color != blockColor.VACANT &&
          game.board[c][r].color == game.board[c - 1][r].color &&
          game.board[c][r].color == game.board[c + 1][r].color &&
          INTERACTIVE_PIECES.includes(game.board[c][r].type) &&
          INTERACTIVE_PIECES.includes(game.board[c - 1][r].type) &&
          INTERACTIVE_PIECES.includes(game.board[c + 1][r].type)
        ) {
          checkAgain = true;
          clearLocations.push([c - 1, r]);
          clearLocations.push([c, r]);
          clearLocations.push([c + 1, r]);
          if (
            c < 4 &&
            game.board[c][r].color == game.board[c + 2][r].color &&
            INTERACTIVE_PIECES.includes(game.board[c + 2][r].type)
          ) {
            clearLocations.push([c + 2, r]);
            if (
              c < 3 &&
              game.board[c][r].color == game.board[c + 3][r].color &&
              INTERACTIVE_PIECES.includes(game.board[c + 3][r].type)
            ) {
              clearLocations.push([c + 3, r]);
              if (
                c < 2 &&
                game.board[c][r].color == game.board[c + 4][r].color &&
                INTERACTIVE_PIECES.includes(game.board[c + 4][r].type)
              ) {
                clearLocations.push([c + 4, r]);
              }
            }
          }
          done = false;
        }
      }
    }

    //Remove Duplicates:
    clearLocations = Array.from(
      new Set(clearLocations.map(JSON.stringify)),
      JSON.parse
    );
    let clearLocationsLength = clearLocations.length;
    if (legalMatch(clearLocations)) {
      chainLogic.addToPrimaryChain = false;
      for (let i = 0; i < clearLocationsLength - 1; i++) {
        clearLocationsString += `[${clearLocations[i]}], `;
      }
      clearLocationsString += `[${clearLocations[clearLocationsLength - 1]}].`;
      if (game.currentChain == 0) {
        chainLogic.addToPrimaryChain = true;
        game.currentChain++;
        if (clearLocationsLength > 3) {
          playAudio(
            announcer.comboDialogue[randInt(announcer.comboDialogue.length)]
          );
        } else {
          playChainSFX();
        }
      } else {
        add1ToChain = false;
        for (let i = 0; i < clearLocationsLength; i++) {
          let x = clearLocations[i][0];
          let y = clearLocations[i][1];
          if (
            game.board[x][y].type == blockType.LANDING &&
            !game.board[x][y].touched
          ) {
            // need to add .touched?
            add1ToChain = true;
          }
        }
      }

      updateScore(clearLocationsLength, game.currentChain);
      if (add1ToChain) {
        chainLogic.addToPrimaryChain = true;
        game.currentChain++;
        playChainSFX(game.currentChain);
      }

      for (let i = 0; i < clearLocationsLength; i++) {
        let c = clearLocations[i][0];
        let r = clearLocations[i][1];
        game.board[c][r].type = blockType.CLEARING;
        game.board[c][r].timer = preset.clearValues[game.level];
        if (chainLogic.addToPrimaryChain) {
          game.board[c][r].availableForPrimaryChain = true;
          game.board[c][r].availableForSecondaryChain = false;
        } else {
          game.board[c][r].availableForSecondaryChain = true;
          game.board[c][r].availableForPrimaryChain = false;
        }
        // else (game.board[c][r].availableForSecondaryChain = true) // if new chain doesn't start
      }

      if (clearLocationsLength != 0) {
        game.combo = clearLocationsLength;
        if (game.combo > 3 || game.currentChain > 1) {
          game.raiseDelay = 6 * game.boardRiseSpeed;
        }
        if (game.rise == 0) game.rise = 2; // Failsafe to prevent extra raise
      }
    } else {
      done = true; // Needs to end if confirm clear fails
    }
  }
}

export function updateScore(clearLocationsLength, currentChain) {
  let blockBonus = clearLocationsLength * 10;
  let comboBonus = 0;
  let chainBonus = 0;

  if (clearLocationsLength == 3) {
    comboBonus = 0;
  } else if (clearLocationsLength < 6) {
    comboBonus = blockBonus - 20;
  } else if (clearLocationsLength < 10) {
    comboBonus = blockBonus - 10;
  } else if (clearLocationsLength == 10) {
    comboBonus = blockBonus;
  } else {
    comboBonus = 200 + 5 * (blockBonus - 100);
  }

  if (currentChain == 1) {
    chainBonus = 0;
  } else if (currentChain == 2) {
    chainBonus = 50;
  } else if (currentChain == 3) {
    chainBonus = 80;
  } else if (currentChain == 4) {
    chainBonus = 150;
  } else if (currentChain <= 6) {
    chainBonus = 300 + 100 * (currentChain - 5);
  } else if (currentChain <= 11) {
    chainBonus = 500 + 200 * (currentChain - 7);
  } else {
    chainBonus = 1500 + 300 * (currentChain - 12);
  }

  let addToScore = blockBonus + comboBonus + chainBonus;
  if (game.level < 7) {
    game.scoreMultiplier = 1 + (game.level - 1) / 10;
  } else {
    game.scoreMultiplier = 2 + (game.level - 7) / 5;
  }
  game.score += game.scoreMultiplier * addToScore;
  console.log(`+${game.scoreMultiplier * addToScore} | Score: ${game.score}`);
  console.log(
    `Current Time: ${game.minutes}:${game.seconds} | Current fps: ${performance.fps}`
  );
  if (game.score > game.highScore) {
    game.highScore = game.score;
    win.highScoreDisplay.style.color = "gold";
  }
}
