// Contains legalMatch, checkMatch, and updateScore

import {
  announcer,
  hold_it,
  blockColor,
  blockType,
  INTERACTIVE_TYPES,
  grid,
  game,
  debug,
  win,
  preset,
  randInt
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
          INTERACTIVE_TYPES.includes(game.board[c][r].type) &&
          INTERACTIVE_TYPES.includes(game.board[c][r - 1].type) &&
          INTERACTIVE_TYPES.includes(game.board[c][r + 1].type)
        ) {
          checkAgain = true;
          clearLocations.push([c, r - 1]);
          clearLocations.push([c, r]);
          clearLocations.push([c, r + 1]);
          // Check for four, five, and six clear
          if (
            r < 10 &&
            game.board[c][r].color == game.board[c][r + 2].color &&
            INTERACTIVE_TYPES.includes(game.board[c][r + 2].type)
          ) {
            clearLocations.push([c, r + 2]);
            if (
              r < 9 &&
              game.board[c][r].color == game.board[c][r + 3].color &&
              INTERACTIVE_TYPES.includes(game.board[c][r + 3].type)
            ) {
              clearLocations.push([c, r + 3]);
              if (
                r < 8 &&
                game.board[c][r].color == game.board[c][r + 4].color &&
                INTERACTIVE_TYPES.includes(game.board[c][r + 4].type)
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
          INTERACTIVE_TYPES.includes(game.board[c][r].type) &&
          INTERACTIVE_TYPES.includes(game.board[c - 1][r].type) &&
          INTERACTIVE_TYPES.includes(game.board[c + 1][r].type)
        ) {
          checkAgain = true;
          clearLocations.push([c - 1, r]);
          clearLocations.push([c, r]);
          clearLocations.push([c + 1, r]);
          if (
            c < 4 &&
            game.board[c][r].color == game.board[c + 2][r].color &&
            INTERACTIVE_TYPES.includes(game.board[c + 2][r].type)
          ) {
            clearLocations.push([c + 2, r]);
            if (
              c < 3 &&
              game.board[c][r].color == game.board[c + 3][r].color &&
              INTERACTIVE_TYPES.includes(game.board[c + 3][r].type)
            ) {
              clearLocations.push([c + 3, r]);
              if (
                c < 2 &&
                game.board[c][r].color == game.board[c + 4][r].color &&
                INTERACTIVE_TYPES.includes(game.board[c + 4][r].type)
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

    // now determine chain
    if (legalMatch(clearLocations)) {
      game.addToPrimaryChain = false;
      for (let i = 0; i < clearLocationsLength - 1; i++) {
        clearLocationsString += `[${clearLocations[i]}], `;
      }
      clearLocationsString += `[${clearLocations[clearLocationsLength - 1]}].`;
      if (game.currentChain == 0) {
        game.chainScoreAdded = 0;
        game.addToPrimaryChain = true;
        game.currentChain++;
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

      if (add1ToChain) {
        game.addToPrimaryChain = true;
        game.currentChain++;
        playChainSFX(game.currentChain);
      } else if (clearLocationsLength > 3 && !win.muteAnnouncer.checked) {
        // make sure that "hold it! is not playing instead"
        if (
          game.highestRow !== 1 ||
          game.raiseDelay > 0 ||
          (game.highestRow !== 2 && game.level > 6)
        )
          playAudio(
            announcer.comboDialogue[randInt(announcer.comboDialogue.length)]
          );
      }
      updateScore(clearLocationsLength, game.currentChain);
      win.mainInfoDisplay.style.color = "red";
      game.message = `${game.currentChain} chain!`;
      game.messageChangeDelay = 90;

      // now to assign timers and initiate clear animation
      assignClearTimers(
        clearLocations,
        game.blockBlinkTime,
        game.blockInitialFaceTime
      );

      if (clearLocationsLength != 0) {
        game.combo = clearLocationsLength;
        game.totalClears += game.combo;
        if (game.combo > game.largestCombo) game.largestCombo = game.combo;

        // if stack is very high, determine when to say "hold it!"
        if (game.highestRow === 1 || (game.highestRow < 4 && game.level > 5)) {
          if (
            game.level > 6 &&
            !game.boardRiseDisabled &&
            game.currentChain < 2
          ) {
            // always say hold it in overtime
            playAudio(hold_it[randInt(hold_it.length)], 0.3);
          } else if (
            game.raiseDelay === 0 &&
            game.level < 7 &&
            (game.currentChain > 1 || game.combo > 3)
          ) {
            playAudio(hold_it[randInt(hold_it.length)], 0.3);
          }
        }
        if (game.combo > 3 || game.currentChain > 1) {
          let potentialRaiseDelay =
            6 * game.boardRiseSpeed +
            30 * (game.currentChain - 1) +
            10 * (game.combo - 4);
          if (potentialRaiseDelay > game.raiseDelay)
            game.raiseDelay = potentialRaiseDelay;
          if (debug.enabled) {
            console.log(
              `New Raise Delay = ${game.raiseDelay} = 6 * (${game.boardRiseSpeed}) + 6 * (${game.currentChain} - 1)))`
            );
          }
        }
        if (game.rise == 0) game.rise = 2; // Failsafe to prevent extra raise
      }
    } else {
      done = true; // Needs to end if confirm clear fails
    }
  }
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
    // console.log(c, r, "assigned to:", game.board[c][r]);
    // console.log(
    //   "blink time",
    //   blinkTime,
    //   "initial face time",
    //   initialFaceTime,
    //   "total pop time",
    //   totalPopTime,
    //   "extra face time",
    //   extraFaceTime
    // );
    if (game.addToPrimaryChain) {
      game.board[c][r].availableForPrimaryChain = true;
      game.board[c][r].availableForSecondaryChain = false;
    } else {
      game.board[c][r].availableForPrimaryChain = false;
      game.board[c][r].availableForSecondaryChain = true;
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
    game.scoreMultiplier = 1 + 0.15 * (game.level - 1);
  } else {
    game.scoreMultiplier = 2 + 0.25 * (game.level - 7);
  }
  game.scoreUpdate = Math.round(game.scoreMultiplier * addToScore);
  game.chainScoreAdded += game.scoreUpdate;
  game.score += game.scoreUpdate;
  let loggedScore = `Time: ${game.timeString}, Earned = ${game.scoreUpdate}, Total: ${game.score} || ${game.currentChain}x chain, ${clearLocationsLength} combo`;
  game.log.push(loggedScore);
}
