// Contains legalMatch, checkMatch, and updateScore

import {
  announcer,
  hold_it,
  blockColor,
  blockType,
  grid,
  game,
  debug,
  win,
  preset,
  randInt,
  cpu,
  helpPlayer,
  detectInfiniteLoop,
  saveState,
  padInt,
  touch,
  removeFromOrderList,
} from "../global";

import { playChainSFX, playAudio, playAnnouncer } from "./audioFunctions";

function squareIsMatchable(c, r) {
  let Square = game.board[c][r];
  return (
    (Square.type === "normal" && Square.timer === 0) ||
    (Square.type === "panicking" && Square.timer === 0) ||
    (Square.type === "landing" && Square.timer < 10) ||
    (Square.type === "swapping" && Square.timer === 1)
  );
}

export function legalMatch(clearLocations) {
  if (clearLocations.length === 0) {
    return false;
  }

  let blocksCleared = clearLocations.length;

  for (let i = 0; i < blocksCleared; i++) {
    let c = clearLocations[i][0];
    let r = clearLocations[i][1];
    for (let j = grid.ROWS - 1; j > r; j--) {
      if (game.board[c][j].color == blockColor.VACANT) {
        return false; // If the block is falling, no match occurs.
      }
    }
  }
  game.pauseStack = true;
  return true;
}

export function checkMatch() {
  // Vertical Case, starting from top block
  let done = false;
  let checkAgain = false;
  let clearLocations = [];
  let clearLocationsString = "";
  let add1ToChain = false;
  win.loopCounter = 0;
  while (!done && !checkAgain) {
    win.loopCounter++;
    if (detectInfiniteLoop("fixNextDarkStack", win.loopCounter)) break;
    done = true;
    checkAgain = false;
    for (let c = 0; c < grid.COLS; c++) {
      // Check Vertical and afterwards, horizontal
      for (let r = 1; r < grid.ROWS - 1; r++) {
        let Square = game.board[c][r];
        if (
          Square.color != blockColor.VACANT &&
          Square.color == game.board[c][r - 1].color &&
          Square.color == game.board[c][r + 1].color &&
          squareIsMatchable(c, r) &&
          squareIsMatchable(c, r - 1) &&
          squareIsMatchable(c, r + 1)
        ) {
          checkAgain = true;
          clearLocations.push([c, r - 1]);
          clearLocations.push([c, r]);
          clearLocations.push([c, r + 1]);
          // Check for four, five, and six clear
          if (
            r < grid.ROWS - 2 &&
            Square.color == game.board[c][r + 2].color &&
            squareIsMatchable(c, r + 2)
          ) {
            clearLocations.push([c, r + 2]);
            if (
              r < grid.ROWS - 3 &&
              Square.color == game.board[c][r + 3].color &&
              squareIsMatchable(c, r + 3)
            ) {
              clearLocations.push([c, r + 3]);
              if (
                r < grid.ROWS - 3 &&
                Square.color == game.board[c][r + 4].color &&
                squareIsMatchable(c, r + 4)
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
        let Square = game.board[c][r];
        if (
          Square.color != blockColor.VACANT &&
          Square.color == game.board[c - 1][r].color &&
          Square.color == game.board[c + 1][r].color &&
          squareIsMatchable(c, r) &&
          squareIsMatchable(c - 1, r) &&
          squareIsMatchable(c + 1, r)
        ) {
          checkAgain = true;
          clearLocations.push([c - 1, r]);
          clearLocations.push([c, r]);
          clearLocations.push([c + 1, r]);
          if (
            c < grid.COLS - 2 &&
            Square.color == game.board[c + 2][r].color &&
            squareIsMatchable(c + 2, r)
          ) {
            clearLocations.push([c + 2, r]);
            if (
              c < grid.COLS - 3 &&
              Square.color == game.board[c + 3][r].color &&
              squareIsMatchable(c + 3, r)
            ) {
              clearLocations.push([c + 3, r]);
              if (
                c < grid.COLS - 4 &&
                Square.color == game.board[c + 4][r].color &&
                squareIsMatchable(c + 4, r)
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
    let blocksCleared = clearLocations.length;

    // now determine chain
    if (legalMatch(clearLocations)) {
      game.boardRiseRestarter = 0; // restart failsafe timer
      helpPlayer.timer = helpPlayer.timer <= 120 ? 120 : 600;
      // helpPlayer.timer < 120
      //   ? (helpPlayer.timer = 120)
      //   : (helpPlayer.timer = 600);
      game.addToPrimaryChain = false;
      for (let i = 0; i < blocksCleared - 1; i++) {
        clearLocationsString += `[${clearLocations[i]}], `;
      }
      clearLocationsString += `[${clearLocations[blocksCleared - 1]}].`;
      if (game.currentChain == 0) {
        game.chainScoreAdded = 0;
        game.addToPrimaryChain = true;
        game.currentChain++;
        if (game.mode === "training") game.score = 0;
      } else {
        add1ToChain = false;
        for (let i = 0; i < blocksCleared; i++) {
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
      } else if (blocksCleared > 3 && !win.muteAnnouncer.checked) {
        // make sure that "hold it! is not playing instead"
        if (
          game.highestRow !== 1 ||
          game.raiseDelay > 0 ||
          (game.highestRow !== 2 && game.level > 6)
        )
          playAnnouncer(
            announcer.comboDialogue,
            announcer.comboIndexLastPicked,
            "combo",
            0.2,
            false
          );
      }
      updateScore(blocksCleared, game.currentChain, add1ToChain);
      win.mainInfoDisplay.style.color = "black";
      game.message = `${game.currentChain} chain!`;
      game.messageChangeDelay = 90;

      // now to assign timers and initiate clear animation
      assignClearTimers(
        clearLocations,
        game.blockBlinkTime,
        game.blockInitialFaceTime
      );

      if (blocksCleared != 0) {
        game.combo = blocksCleared;
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
            playAnnouncer(hold_it, -1, "holdIt", 0.3, false);
          }
          // else if (
          //   game.raiseDelay === 0 &&
          //   game.level < 7 &&
          //   (game.currentChain > 1 || game.combo > 3)
          // ) {
          //   playAnnouncer(hold_it, -1, "holdIt", 0.3, false);
          // }
        }
        if (game.combo > 3 || game.currentChain > 1) {
          let potentialRaiseDelay =
            6 * game.boardRiseSpeed +
            30 * (game.currentChain - 1) +
            10 * (game.combo - 4);
          if (potentialRaiseDelay > game.raiseDelay)
            game.raiseDelay = potentialRaiseDelay;
          if (game.raiseDelay < 12) game.raiseDelay = 12;
          if (game.raiseDelay > 180) game.raiseDelay = 180;
          if (game.level > 6 && game.raiseDelay > 60) game.raiseDelay = 60;
          if (debug.enabled) {
            console.log(
              `New Raise Delay = ${game.raiseDelay} = 6 * (${game.boardRiseSpeed}) + 6 * (${game.currentChain} - 1)))`
            );
          }
        }
        // if (game.rise == 0) game.rise = 2; // Failsafe to prevent extra raise
      } // end if blocksCleared !== 0
      if (game.mode === "training") {
        saveState.lastMatch = JSON.parse(JSON.stringify(game));
        if (game.currentChain === 1) {
          saveState.chainStart = JSON.parse(JSON.stringify(game));
        }
      }
    } else {
      done = true; // Needs to end if confirm clear fails
    }
  } // end while
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
    let Square = game.board[c][r];

    Square.type = blockType.BLINKING;
    if (Square.targetX !== undefined) {
      console.log(game.frames, c, r, "block became clearing");
      removeFromOrderList(game.board[Square.targetX][r]);
    }
    Square.timer = blinkTime + initialFaceTime + totalPopTime;
    Square.switchToFaceFrame = initialFaceTime + totalPopTime;
    Square.switchToPoppedFrame = totalPopTime - extraFaceTime;
    // console.log(c, r, "assigned to:", Square);
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
      Square.availForPrimaryChain = true;
      Square.availForSecondaryChain = false;
    } else {
      Square.availForPrimaryChain = false;
      Square.availForSecondaryChain = true;
    }
  }
}

export function updateScore(blocksCleared, currentChain, partOfChain) {
  let blockBonus = 10 * blocksCleared;
  let comboBonus = 0;
  let chainBonus = 0;
  let isChain = partOfChain && game.currentChain > 1;

  if (blocksCleared === 3) comboBonus = 0;
  else if (blocksCleared < 6) comboBonus = blockBonus - 20;
  else if (blocksCleared < 10) comboBonus = blockBonus - 10;
  else comboBonus = 10 * blocksCleared + 30 * (blocksCleared - 10);

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

  let addToScore = comboBonus + chainBonus;
  let scoreMult = game.scoreMultiplier;
  let matchString = `MATCH: ${padInt(blocksCleared)} Clear`;
  let bonusString = `ADD: `;
  if (isChain) {
    bonusString += `${scoreMult} * (${padInt(
      comboBonus,
      3
    )}) Chain & Clear Bonus`;
    matchString += `, Chain ${padInt(currentChain)}`;
  } else {
    bonusString += `${scoreMult} * (${padInt(comboBonus, 3)}) Clear Bonus`;
  }

  game.scoreUpdate = Math.round(addToScore * game.scoreMultiplier);
  game.chainScoreAdded += game.scoreUpdate;
  game.score += game.scoreUpdate;
  if (game.log.length < 500) {
    let loggedScore = [
      `TIME ${game.minutes}:${padInt(game.seconds)}
      `,
      `MATCH: ${padInt(blocksCleared)}${
        isChain ? ", Chain " + currentChain : ""
      }`,
      `CHAIN: ${padInt(currentChain)} || BONUS: ${chainBonus * scoreMult}`,
      `CLEAR: ${padInt(blocksCleared)} || BONUS: ${comboBonus * scoreMult}`,
      `TOTAL: ${padInt(game.scoreUpdate, 4)}`,
      `NEW SCORE: ${game.score}`,
      `--------------------`,
    ];
    // let loggedScore = `Time: ${game.timeString}, Earned = ${game.scoreUpdate}, Total: ${game.score} || ${game.currentChain}x chain, ${blocksCleared} combo`;
    game.log.push(loggedScore);
    // if (win.gameLogDisplay) {
    //   let div = document.createElement("div");
    //   div.className = "game-log-entry";
    //   game.log[game.log.length - 1].forEach((line) => {
    //     let p = document.createElement("p");
    //     p.className = "game-log-entry-text";
    //     p.innerHTML += line;
    //     div.appendChild(p);
    //   });
    //   win.gameLogDisplay.appendChild(div);

    //   win.gameLogDisplay.scrollTop = win.gameLogDisplay.scrollHeight;
    // }
  }
}
