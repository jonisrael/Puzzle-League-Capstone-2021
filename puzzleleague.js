/* Puzzle League/Tetris Attack Clone by Jonathan Israel!
    For more information on the game, check out https://tetris.fandom.com/wiki/Tetris_Attack.
    The game is most known as Pokemon Puzzle League, which was released 2000 on Nintendo 64),
    but it is actually a clone of Panel De Pon, a Super Nintendo Entertainment system
    game released in Japan in 1995.  There is another clone globally released in 1995 called Tetris
    Attack (It featured Yoshi!), but the game xs really nothing like Tetris other than a grid.
*/

import html from "html-literal";
import { displayMessage, render, router } from "./index";
import * as state from "./store";
import {
  sprite,
  audio,
  loadedSprites,
  audioKeys,
  audioSrcs,
} from "./scripts/fileImports";
import {
  legalMatch,
  checkMatch,
} from "./scripts/functions/matchAndScoreFunctions";
import {
  generateOpeningBoard,
  fixNextDarkStack,
  startGame,
  resetGameVariables,
} from "./scripts/functions/startGame";
import {
  checkBlockTargets,
  checkSwapTargets,
  trySwappingBlocks,
} from "./scripts/functions/swapBlock";
import {
  doGravity,
  areAllBlocksGrounded,
  isBlockAirborne,
} from "./scripts/functions/gravity";
import { submitResults } from "./scripts/functions/submitResults";
import { cpuAction } from "./scripts/computerPlayer/cpu";
import {
  action,
  actionHeld,
  actionUp,
  savedControls,
  playerAction,
} from "./scripts/controls";
import { pause, unpause } from "./scripts/functions/pauseFunctions";
import {
  playAnnouncer,
  playAudio,
  playChainSFX,
  playMusic,
} from "./scripts/functions/audioFunctions.js";
import {
  closeGame,
  isGameOver,
  gameOverBoard,
} from "./scripts/functions/gameOverFunctions";

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
  padInt,
  music,
  overtimeMusic,
  touch,
  CLEARING_TYPES,
  blockIsSolid,
  blockVacOrClearing,
  transferProperties,
  checkIfAudioLoaded,
  loadAudios,
  audioLoadedPercentage,
  lastIndex,
  objectOfAudios,
  essentialLoadedAudios,
  helpPlayer,
  detectInfiniteLoop,
  debugSquares,
  sound,
  updateFrameMods,
} from "./scripts/global.js";
import { updateMousePosition } from "./scripts/clickControls";
import {
  TouchOrder,
  TouchOrders,
  match,
} from "./scripts/functions/stickyFunctions";
import { updateGrid } from "./scripts/functions/updateGrid";
import { checkTime } from "./scripts/functions/timeEvents";
import {
  createTutorialBoard,
  loadTutorialState,
  runTutorialScript,
  startTutorial,
  tutorial,
  tutorialBoard,
} from "./scripts/tutorial/tutorialScript";
import { tutorialMessages } from "./scripts/tutorial/tutorialMessages";
import { doTrainingAction } from "./scripts/functions/trainingControls";
import { drawScoreEarnedMessage } from "./scripts/functions/drawCanvasShapesAndText";
// import {
//   analyzeBoard,
//   checkMatches,
//   drawSquare,
//   gravity,
//   increaseStackHeight,
//   resetBoardStateVars,
//   updateBoardState
// } from "./scripts/functions/experimentalFunctions";

if (localStorage.getItem("highScore") === null) {
  localStorage.setItem("highScore", "1000");
}

win.muteAnnouncer = document.getElementById("mute-announcer");
win.muteMusic = document.getElementById("mute-music");
win.muteSFX = document.getElementById("mute-sfx");

export function blockKeyOf(color, type, animationIndex = -1) {
  if (animationIndex === -1) {
    return `${color}_${type}`;
  } else {
    return `${color}_${type}_${animationIndex}`;
  }
}

export class Cursor {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    // param used to be ctx
    let pixelX = this.x * grid.SQ;
    let pixelY = this.y * grid.SQ - game.rise;
    // const CURSOR_IMAGE = new Image();
    // CURSOR_IMAGE.src = sprite.cursor;
    win.ctx.drawImage(loadedSprites[game.cursor_type], pixelX, pixelY);
  }
}
game.cursor = new Cursor(2, 6);

class Block {
  constructor(
    x,
    y,
    color = "vacant",
    type = "normal",
    timer = 0,
    message = "",
    msgTimer = 1,
    switchToFaceFrame = 0,
    switchToPoppedFrame = 0,
    airborne = false,
    touched = false,
    availForPrimaryChain = false,
    availForSecondaryChain = false,
    swapDirection = 0,
    lightTimer = 0,
    swapOrders = JSON.parse(JSON.stringify(TouchOrder)),
    targetX = undefined,
    smartMatch = {
      lowestKeyCoord: undefined,
      highestKeyCoord: undefined,
      secondCoord: undefined,
      thirdCoord: undefined,
      pair: undefined,
      clearLine: undefined,
      solidGroundArray: undefined,
    }
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type;
    this.timer = timer;
    this.message = message;
    this.msgTimer = msgTimer;
    this.switchToFaceFrame = switchToFaceFrame;
    this.switchToPoppedFrame = switchToPoppedFrame;
    this.airborne = airborne;
    this.touched = touched;
    this.availForPrimaryChain = availForPrimaryChain; // When disappear, chain ends
    this.availForSecondaryChain = availForSecondaryChain;
    this.swapDirection = swapDirection;
    this.lightTimer = lightTimer;
    this.swapOrders = swapOrders;
    this.targetX = targetX;
    this.smartMatch = smartMatch;
  }

  drawGridLines() {
    let filename = "grid_line";
    if (this.y === 0) filename = "grid_line_red";
    else if (this.lightTimer != 0) {
      filename = "light_up";
    } else if (this.y === game.cursor.y) {
      filename = "rowLight";
      filename +=
        this.x === 0 ? "Left" : this.x === grid.COLS - 1 ? "Right" : "Mid";
    }
    win.ctx.drawImage(
      loadedSprites[filename],
      grid.SQ * this.x,
      grid.SQ * this.y - game.rise
    );
  }

  drawSwappingBlocks() {
    let xOffset = (grid.SQ * (this.timer - 1)) / 4;
    win.ctx.drawImage(
      loadedSprites[`${this.color}_normal`],
      grid.SQ * this.x + xOffset * this.swapDirection,
      grid.SQ * this.y - game.rise
    );
  }

  drawHint() {
    if (!game.disableSwap && game.frameMod[60] < 30 && game.mode !== "cpu-play")
      win.ctx.drawImage(
        loadedSprites["light_up"],
        grid.SQ * this.x,
        grid.SQ * this.y - game.rise
      );
  }

  drawArrows(move = "Move") {
    if (this.targetX === undefined || game.over) return;
    let filename;
    let inc = this.targetX < this.x ? -1 : 1;
    let dir = this.targetX < this.x ? "Left" : "Right";
    let bufferDetected = false;
    win.loopCounter = 0;
    for (let i = this.x; true; i += inc) {
      win.loopCounter++;
      if (detectInfiniteLoop("drawArrows", win.loopCounter)) break;
      if (
        !bufferDetected &&
        CLEARING_TYPES.includes(game.board[i][this.y].type)
      ) {
        bufferDetected = true;
        move = "Buffer"; // change to buffer arrow
        i = this.x; // repaint earlier arrows to be pink
      }
      if (i === this.x) {
        filename = `arrow${dir}${move}Start`;
      } else if (i === this.targetX) {
        filename = `arrow${dir}${move}End`;
      } else {
        filename = `arrowMid${move}`;
      }

      {
        win.ctx.drawImage(
          loadedSprites[filename],
          grid.SQ * i,
          grid.SQ * this.y - game.rise
        );
      }

      if (i === this.targetX) break;
    }
  }

  drawBlockMessage() {
    drawScoreEarnedMessage(
      `+${game.scoreEarned}`,
      this.x,
      this.y,
      grid.SQ,
      game.rise
    );
  }

  drawDebugDots() {
    //Debug Visuals
    if (
      this.timer > 0 ||
      (this.x == 0 && this.y == 1 && game.currentChain < 1)
    ) {
      win.ctx.drawImage(
        loadedSprites["debugWhite"],
        grid.SQ * this.x,
        grid.SQ * this.y - game.rise
      );
    }
    if (this.x == 0 && this.y == 1 && game.currentChain == 1) {
      win.ctx.drawImage(
        loadedSprites["debugWhite"],
        grid.SQ * this.x,
        grid.SQ * this.y - game.rise
      );
    }
    if (this.touched) {
      win.ctx.drawImage(
        loadedSprites["debugBlue"],
        grid.SQ * this.x,
        grid.SQ * this.y - game.rise
      );
    }
    if (this.availForPrimaryChain) {
      win.ctx.drawImage(
        loadedSprites["debugOrange"],
        grid.SQ * this.x,
        grid.SQ * this.y - game.rise
      );
    }
    if (
      this.availForSecondaryChain ||
      (this.x == 0 && this.y == 1 && game.currentChain > 1)
    ) {
      win.ctx.drawImage(
        loadedSprites["debugPink"],
        grid.SQ * this.x + 12,
        grid.SQ * this.y - game.rise + 12,
        8,
        8
      );
    }

    if (this.targetX !== undefined) {
      win.ctx.drawImage(
        loadedSprites["debugBlue"],
        grid.SQ * this.x,
        grid.SQ * this.y - game.rise
      );
      win.ctx.drawImage(
        loadedSprites["debugRed"],
        grid.SQ * this.targetX,
        grid.SQ * this.y - game.rise
      );
    }

    if (game.cursor_type[0] !== "d") {
      // if (
      //   this.x === touch.target.x &&
      //   this.y === touch.target.y &&
      //   touch.moveOrderExists
      // ) {
      //   win.ctx.drawImage(
      //     loadedSprites["debugRed"],
      //     grid.SQ * this.x,
      //     grid.SQ * this.y - game.rise
      //   );
      // }

      if (
        touch.thereIsABlockCurrentlySelected &&
        this.x === touch.selectedBlock.x &&
        this.y === touch.selectedBlock.y
      ) {
        win.ctx.drawImage(
          loadedSprites["debugGreen"],
          grid.SQ * this.x,
          grid.SQ * this.y - game.rise
        );
      }

      if (
        game.currentChain > 0 &&
        this.smartMatch.highestKeyCoord &&
        this.x === this.smartMatch.highestKeyCoord[0] &&
        this.y === this.smartMatch.highestKeyCoord[1]
      ) {
        win.ctx.drawImage(
          loadedSprites["debugGreen"],
          grid.SQ * this.x,
          grid.SQ * this.y - game.rise
        );
      }

      if (
        game.currentChain > 0 &&
        this.smartMatch.lowestKeyCoord &&
        this.x === this.smartMatch.lowestKeyCoord[0] &&
        this.y === this.smartMatch.lowestKeyCoord[1]
      ) {
        win.ctx.drawImage(
          loadedSprites["debugMagenta"],
          grid.SQ * this.x,
          grid.SQ * this.y - game.rise
        );
      }
    }
  }

  // AI Visuals
  drawAILogic() {
    if (
      (this.x === cpu.targetX && this.y === cpu.targetY) ||
      (this.x === cpu.targetX + 1 && this.y === cpu.targetY)
    ) {
      win.ctx.drawImage(
        loadedSprites["debugRed"],
        grid.SQ * this.x,
        grid.SQ * this.y - game.rise
      );
    }
    if (this.x === cpu.holeDetectedAt[0] && this.y === cpu.holeDetectedAt[1]) {
      win.ctx.drawImage(
        loadedSprites["debugYellow"],
        grid.SQ * this.x,
        grid.SQ * this.y - game.rise
      );
    }
    if (cpu.matchStrings.includes([this.x, this.y].join())) {
      win.ctx.drawImage(
        loadedSprites["debugBlue"],
        grid.SQ * this.x,
        grid.SQ * this.y - game.rise
      );
    }
  }

  draw() {
    let animationIndex = -1;
    switch (this.type) {
      case blockType.BLINKING:
        if (
          (game.frameMod[4] >= 0 && game.frameMod[4] < 2) ||
          debug.freeze == 1
        ) {
          animationIndex = 0;
        } else {
          animationIndex = 1;
        }
        break;
      case blockType.PANICKING:
        if (game.highestRow === 0 || this.y === 0) {
          animationIndex = 0;
        } else if (game.frameMod[18] >= 0 && game.frameMod[18] < 3) {
          animationIndex = 0;
        } else if (
          (game.frameMod[18] >= 3 && game.frameMod[18] < 6) ||
          (game.frameMod[18] >= 15 && game.frameMod[18] < 18)
        ) {
          animationIndex = 1;
        } else if (
          (game.frameMod[18] >= 6 && game.frameMod[18] < 9) ||
          (game.frameMod[18] >= 12 && game.frameMod[18] < 15)
        ) {
          animationIndex = 2;
        } else {
          animationIndex = 3;
        }
        break;
      case blockType.LANDING:
        if (this.timer > 5 || this.timer < 0) {
          animationIndex = 0;
        } else if (this.timer > 2) {
          animationIndex = 1;
        } else {
          animationIndex = 2;
        }
        break;
    }

    let urlKey = blockKeyOf(this.color, this.type, animationIndex);
    if ((this.type === "landing" && this.timer > 9) || this.type === "stalling")
      urlKey = `${this.color}_normal`;
    if (this.y === 0 && blockIsSolid(this))
      urlKey = `${this.color}_panicking_0`;
    if (this.type === "swapping") urlKey = `vacant_normal`;
    win.ctx.drawImage(
      loadedSprites[urlKey],
      grid.SQ * this.x,
      grid.SQ * this.y - game.rise
    );

    // if (this.type === blockType.SWAPPING) {
    // let xOffset = (grid.SQ * this.swapDirection*(1 - this.timer)) / 4;
    //   win.ctx.drawImage(
    //     loadedSprites[`${this.color}_normal`],
    //     grid.SQ * this.x + xOffset,
    //     grid.SQ * this.y - game.rise
    //   );
    // }
    // old and inefficient
    // let BLOCK_IMAGE = new Image();
    // BLOCK_IMAGE.src = sprite[urlKey];
    // BLOCK_IMAGE.onload = () => {
    //   win.ctx.drawImage(
    //     BLOCK_IMAGE,
    //     grid.SQ * this.x,
    //     grid.SQ * this.y - game.rise
    //   );
    // };
  } // end draw()
}

game.VacantBlock = new Block(-2, -2);

export function newBlock(c, r, vacant = false) {
  let block = new Block(c, r);
  return block;
}

export function checkIfHelpPlayer() {
  if (helpPlayer.forceHint) helpPlayer.timer = 0;
  if (
    ((game.score < 500 && !game.mode === "tutorial") || helpPlayer.forceHint) &&
    game.frames > 0 &&
    game.frames < 7200 &&
    !game.disableSwap &&
    game.currentChain === 0 &&
    !game.tutorialRunning &&
    helpPlayer.timer > 0
  ) {
    helpPlayer.timer--;
  } else if (helpPlayer.timer === 0) {
    if (!helpPlayer.done) {
      cpu.matchList.length = 0;
      cpu.matchStrings.length = 0;
      if (game.currentChain === 0) cpuAction({}, true);
      if (cpu.matchList.length > 0) {
        helpPlayer.done = true;
      }
    } else if (helpPlayer.done && game.currentChain > 0) {
      helpPlayer.done = false;
    }
  }
}

export function drawGrid() {
  if (game.frames % perf.drawDivisor === 1) return;
  let blocksAreSwapping = false; // to be placed on top of drawn grid
  let messageAlreadyDrawn = false;
  let firstBlinkingSquare;
  for (let x = 0; x < grid.COLS; x++) {
    for (let y = 0; y < grid.ROWS + 2; y++) {
      let Square = game.board[x][y];
      Square.draw();
      if (Square.swapDirection) blocksAreSwapping = true;
      if (!messageAlreadyDrawn && Square.type === "blinking") {
        firstBlinkingSquare = [x, y];
        messageAlreadyDrawn = true;
      }

      Square.drawGridLines();

      // if (game.cursor_type[0] !== "d") {
      //   Square.drawGridLines();
      // }

      if (
        (helpPlayer.timer === 0 || (cpu.enabled && !game.tutorialRunning)) &&
        cpu.matchStrings.includes([x, y].join())
      ) {
        Square.drawHint();
      }
    }
  }
  if (blocksAreSwapping) {
    for (let x = grid.COLS - 1; x >= 0; x--) {
      for (let y = 0; y < grid.ROWS + 1; y++) {
        let Square = game.board[x][y];
        if (Square.swapDirection && Square.timer > 0)
          Square.drawSwappingBlocks();
      }
    }
  }

  if (game.cursor_type[0] !== "d" || debug.show || cpu.showInfo) {
    for (let x = grid.COLS - 1; x >= 0; x--) {
      for (let y = 0; y < grid.ROWS + 1; y++) {
        let Square = game.board[x][y];
        if (game.cursor_type[0] !== "d") Square.drawArrows();
        if (cpu.showInfo) Square.drawAILogic();
        if (debug.show) Square.drawDebugDots();
      }
    }
  }

  if (!game.over) {
    if (game.cursor_type[0] !== "d") {
      if (touch.moveOrderExists) game.cursor_type = "movingCursor";
      else if (blockIsSolid(game.board[game.cursor.x][game.cursor.y])) {
        game.cursor_type = touch.mouse.clicked
          ? "legalCursorDown"
          : "legalCursorUp";
      } else {
        game.cursor_type = touch.mouse.clicked
          ? "illegalCursorDown"
          : "illegalCursorUp";
      }
    }
    game.cursor.draw();
  }

  if (firstBlinkingSquare) {
    let [x, y] = firstBlinkingSquare;
    game.board[x][y].lightTimer = 30;
    game.board[x][y].drawBlockMessage();
  }
}

export function isChainActive() {
  let potentialSecondarySuccessor = false;
  for (let x = 0; x < grid.COLS; x++) {
    for (let y = 0; y < grid.ROWS; y++) {
      if (game.board[x][y].availForPrimaryChain) {
        return true;
      } else if (game.board[x][y].availForSecondaryChain) {
        potentialSecondarySuccessor = true;
      }
    }
  }
  // Test failed, so ending chain. Proceed with new code.
  endChain(potentialSecondarySuccessor);
  return false;
}

export function endChain(potentialSecondarySuccessor) {
  if (game.currentChain == 0) return;
  game.boardRiseRestarter = 0;
  if (debug.enabled) console.log("board raise delay granted:", game.raiseDelay);
  game.lastChain = game.currentChain;
  helpPlayer.timer = helpPlayer.timer <= 120 ? 120 : 600;
  helpPlayer.done = false;
  cpu.matchList.length = 0;
  cpu.matchStrings.length = 0;
  if (game.currentChain > 8) {
    playAudio(audio.fanfare5, 0.25);
    playAnnouncer(
      announcer.bestChainDialogue,
      announcer.bestChainIndexLastPicked,
      "largeChain"
    );
  } else if (game.currentChain > 6) {
    playAudio(audio.fanfare4);
    playAnnouncer(
      announcer.largeChainDialogue,
      announcer.largeChainIndexLastPicked,
      "largeChain"
    );
  } else if (game.currentChain > 4) {
    playAudio(audio.fanfare3);
    playAnnouncer(
      announcer.largeChainDialogue,
      announcer.largeChainIndexLastPicked,
      "largeChain"
    );
  } else if (game.currentChain > 3) {
    playAudio(audio.fanfare2);
    playAnnouncer(
      announcer.mediumChainDialogue,
      announcer.mediumChainIndexLastPicked,
      "mediumChain"
    );
  } else if (game.currentChain > 1) {
    playAudio(audio.fanfare1);
    playAnnouncer(
      announcer.smallChainDialogue,
      announcer.smallChainIndexLastPicked,
      "smallChain"
    );
  }
  if (game.currentChain > 1) {
    game.message = `${game.currentChain}x chain added ${game.chainScoreAdded} score.`;
    game.messageChangeDelay = 90;
  } else if (game.currentChain == 1) {
    game.message = `Combo added ${game.chainScoreAdded} to score.`;
  }
  if (game.currentChain > game.largestChain) {
    game.largestChain = game.currentChain;
  }

  if (game.chainScoreAdded > game.largestChainScore) {
    game.largestChainScore = game.chainScoreAdded;
  }
  // if another chain is currently clearing, chain is 1. Otherwise, chain is 0.
  game.currentChain = potentialSecondarySuccessor ? 1 : 0;
  game.combo = 0;
  // If a potential secondary successor is detected, run this loop...
  if (potentialSecondarySuccessor) {
    for (let x = 0; x < grid.COLS; x++) {
      for (let y = 0; y < grid.ROWS; y++) {
        if (game.board[x][y].availForSecondaryChain) {
          game.board[x][y].availForPrimaryChain = true;
          game.board[x][y].availForSecondaryChain = false;
        }
      }
    }
  }
}

export function createNewRow(board) {
  if (game.pauseStack || game.highestRow < 1) {
    return board;
  }

  if (game.boardRiseDisabled || debug.freeze == 1) {
    return board;
  }

  if (game.cursor.y > 1) {
    game.cursor.y -= 1;
  }

  if (touch.enabled) {
    touch.mouse.y -= 1;
    touch.selectedBlock.y -= 1;
    touch.target.y -= 1;
  }

  for (let c = 0; c < grid.COLS; c++) {
    for (let r = 1; r < grid.ROWS; r++) {
      // Raise all grid.ROWS, then delete bottom grid.ROWS.
      transferProperties(board[c][r], board[c][r - 1], "to");
      // board[c][r - 1].color = board[c][r].color;
    }
    board[c][grid.ROWS - 1].color = board[c][grid.ROWS].color;
    board[c][grid.ROWS].color = board[c][grid.ROWS + 1].color;
    board[c][grid.ROWS + 1].color = PIECES[randInt(PIECES.length)];
  }
  board = fixNextDarkStack(board);

  if (game.highestRow === 3 && game.level > 3 && game.mode !== "training") {
    playAnnouncer(
      announcer.panicDialogue,
      announcer.panicIndexLastPicked,
      "panic"
    );
  }
  // score gained for new row passed
  if (game.mode !== "training") {
    game.score += Math.floor(game.scoreMultiplier * 10);
    game.log.push(
      `Time: ${game.timeString}, Line Bonus +${game.seconds}, Total: ${game.score}`
    );
  }

  return board;
}

function overtimeBorderColor(level) {
  let [hue, cnst] =
    level < 7 || (game.frames > 13800 && level < 13) ? [30, 20] : [0, 0];
  let mult =
    level < 7 ? 2 : level < 9 ? 3 : level < 11 ? 4 : level < 13 ? 5 : 6;
  // let mult = game.minutes < 3 ? 1 : 2;
  return `hsl(${hue}, ${cnst + 50 + 40 * Math.cos(mult * game.frames)}%, ${30 +
    20 * Math.cos(mult * game.frames)}%)`;

  // let decidedValue;
  // if (value < 5) decidedValue = 10 - 2 * value;
  // else if (value < 10) decidedValue = 2 * value - 10;
  // else decidedValue = 10;
  // return `hsl(0, ${10 + 8 * decidedValue}%, ${10 + 4 * decidedValue}%)`;
}

// function checkBoardStates(c, r) {
//   if (game.board[c][r])
// }

// prevent browser scroll from arrow keys
window.addEventListener(
  "keydown",
  function(e) {
    if (
      ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
        e.code
      ) > -1
    ) {
      e.preventDefault();
    }
  },
  false
);

// prevent app scroll
// document.addEventListener(
//   "wheel",
//   function(e) {
//     if (win.running && !debug.enabled) e.preventDefault();
//   },
//   { passive: false }
// );

document.addEventListener("keydown", TRAINING_CONTROL);
function TRAINING_CONTROL(event) {
  if (game.mode === "training" && !debug.enabled) {
    if (event.code.includes("Digit")) {
      doTrainingAction(event.code[5]);
    }
  }
}

// document.addEventListener("keydown", DEBUG_CONTROL);
// function DEBUG_CONTROL(event) {
//   if (debug.enabled) {
//     if (event.code.includes("Digit")) {
//       spawnSquare(event.code[5]);
//     }
//   }
// }

document.addEventListener("keydown", KEYBOARD_CONTROL);
function KEYBOARD_CONTROL(event) {
  // When on home page, before game start
  if (document.getElementById("patch-notes-overlay")) {
    if (event.keyCode < 200) {
      document.getElementById("patch-notes-overlay").remove();
      win.patchNotesShown = true;
    }
  }
  if (document.getElementById("arcade-button")) {
    if ((event.keyCode == 32 || event.keyCode == 13) && win.patchNotesShown) {
      // space or enter

      document.getElementById("arcade-button").remove();
      document.getElementById("training-mode").remove();
      document.getElementById("ai-plays-button").remove();
      game.mode = "arcade";
      startGame(1);
    } else if (event.keyCode === 84 && win.patchNotesShown) {
      // t
      document.getElementById("arcade-button").remove();
      document.getElementById("training-mode").remove();
      document.getElementById("ai-plays-button").remove();
      game.mode = "training";
      startGame(1);
    } else if (event.keyCode === 66 && win.patchNotesShown) {
      // b
      document.getElementById("arcade-button").remove();
      document.getElementById("training-mode").remove();
      document.getElementById("ai-plays-button").remove();
      game.mode = "cpu-play";
      startGame(1);
    }
  } else if (document.getElementById("ai-plays-button")) {
    if ((event.keyCode == 83 || event.keyCode == 84) && win.patchNotesShown) {
      // s or t
      // document.getElementById("arcade-button").remove();
      // document.getElementById("ai-plays-button").remove();
      // startGame(2);
    }
  }
  if (win.running && !!document.getElementById("canvas")) {
    // p or pause/break or esc
    if (event.keyCode == 80 || event.keyCode == 19 || event.keyCode == 27)
      game.paused ? unpause() : pause();
    if (event.keyCode === 70 && debug.enabled) if (!game.paused) pause();
  }
  if (game.paused) {
    if (event.keyCode === 70 && debug.enabled) {
      // f
      debug.advanceOneFrame = true;
      unpause();
    }
    if (event.keyCode == 67) unpause(); // c

    if (event.keyCode == 82 && !debug.enabled) {
      // r
      playAudio(audio.select);
      win.running = false;
      win.restartGame = true;
    }
    if (event.keyCode == 77 && !debug.enabled) {
      // m
      playAudio(audio.select);
      win.running = false;
      // console.log(state.Home.view);
      // console.log(router);
      render(state.Home);
      // router.navigate("/Home");
    }
  }
  // Game Controls
  if (win.running && (!game.over || game.tutorialRunning)) {
    if (game.mode !== "cpu-play" || debug.enabled) {
      if (savedControls.keyboard.up.includes(event.keyCode)) action.up = true;
      if (savedControls.keyboard.down.includes(event.keyCode)) {
        action.down = true;
      }

      if (savedControls.keyboard.left.includes(event.keyCode))
        action.left = true; // left arrow
      if (savedControls.keyboard.right.includes(event.keyCode))
        action.right = true; // right arrow
      if (savedControls.keyboard.swap.includes(event.keyCode))
        action.swap = true; // s or x
      if (savedControls.keyboard.raise.includes(event.keyCode))
        action.raise = true; // r or z
    }

    if (game.mode === "cpu-play" && !debug.enabled) {
      if (event.keyCode === 83) {
        cpu.showInfo = (cpu.showInfo + 1) % 2;
      }
      if (event.keyCode === 75) {
        // k
        game.finalTime = (game.frames / 60).toFixed(1);
        game.frames = 0;
        game.over = true;
        // for (let c = 0; c < grid.COLS; c++) {
        //   for (let r = 0; r < grid.ROWS; r++) {
        //     game.board[c][r].type = blockType.LANDING;
        //     game.board[c][r].timer = -2;
        //   }
        // }
        leaderboard.reason = "unofficial-cpu-game";
        gameOverBoard();
        drawGrid();
      }
    }

    if (event.keyCode == 192) {
      // tilda `~
      debug.enabled = (debug.enabled + 1) % 2;
      if (debug.enabled == 1) {
        if (game.frames < 0) {
          game.frames = -2;
          playMusic(
            music[randInt(music.length, true, lastIndex.music, "music")]
          );
        }
        debug.show = 1;
        // helpPlayer.timer = 10;
        leaderboard.canPost = false;
        leaderboard.reason = "debug";
        perf.unrankedReason = "debug mode was activated.";
        win.fpsDisplay.style.color = "black";
        console.log("debug ON -- Score Posting Disabled");
      } else {
        updateLevelEvents(game.level);
        console.log("debug OFF");
        debug.slowdown = 0;
        debug.freeze = 0;
        if (game.mode === "cpu-play") cpu.enabled = cpu.control = true;
        // debug.show = 0;
      }
    }

    if (debug.enabled || game.mode === "training") {
      if (event.keyCode === 187) {
        // +
        if (0 === 0 || game.level + 1 < preset.speedValues.length) {
          game.level++;
          updateLevelEvents(game.level);
        }
      } else if (event.keyCode === 189) {
        // -
        if (game.level - 1 > -1) {
          game.level--;
          updateLevelEvents(game.level);
        }
      } else if (event.keyCode === 89) {
        // y
      }
      // else if (event.keyCode === 77) {
      //   // m
      //   game.frames += 60;
      //   game.seconds++;
      //   if (game.seconds > 60) {
      //     game.minutes++;
      //     game.seconds -= 60;
      //   }
      // } else if (event.keyCode === 78) {
      //   // -
      //   game.frames -= 60;
      //   game.seconds--;
      //   if (game.seconds < 0) {
      //     game.minutes--;
      //     game.seconds += 60;
      //   }
      // }

      if (debug.enabled == 1) {
        if (event.keyCode === 188)
          // ,
          console.log(touch.moveOrderList);
        if (event.keyCode === 73) {
          // i   starts the tutorial
          startTutorial();
          debug.enabled = false;
          debug.show = false;
        } else if (event.keyCode == 79) {
          // o
          win.appleProduct = (win.appleProduct + 1) % 2;
          console.log("Show debug info number:", debug.show);
          debug.show = (debug.show + 1) % 2;
        } else if (event.keyCode === 66) {
          // b
          cpu.enabled = (cpu.enabled + 1) % 2;
          cpu.control = (cpu.control + 1) % 2;
          console.log(`Computer AI: ${cpu.enabled ? "On" : "Off"}`);
          if (cpu.enabled === 0) cpu.control = 0;
        }
        if (event.keyCode == 75) {
          // k
          game.finalTime = (game.frames / 60).toFixed(1);
          game.frames = 0;
          game.over = true;
          for (let c = 0; c < grid.COLS; c++) {
            for (let r = 0; r < grid.ROWS; r++) {
              game.board[c][r].type = blockType.LANDING;
              game.board[c][r].timer = -2;
            }
          }
          gameOverBoard();
          drawGrid();
        } else if (event.keyCode == 16) {
          // LShift to empty game.board
          for (let i = 0; i < grid.COLS; i++) {
            for (let j = 0; j < grid.ROWS; j++) {
              game.board[i][j].color = blockColor.VACANT;
              game.board[i][j].type = blockType.NORMAL;
            }
          }
        }
      }
    }
  }
}

export function updateLevelEvents(level) {
  game.level = level;
  if (game.level > preset.speedValues.length - 1) {
    game.level--;
    return;
  }
  if (game.level < 0) {
    game.level++;
    return;
  }

  if (level > preset.speedValues.length - 1) {
    game.boardRiseSpeed = preset.speedValues.length - 1 - level;
    level = preset.speedValues.length - 1;
  } else game.boardRiseSpeed = preset.speedValues[level];
  game.scoreMultiplier = preset.multValues[level];
  game.blockClearTime = preset.clearValues[level];
  game.blockBlinkTime = preset.blinkValues[level];
  game.blockInitialFaceTime = preset.faceValues[level];
  game.blockStallTime = preset.stallValues[level];
  game.blockPopMultiplier = preset.popMultiplier[level];
  game.panicIndex =
    game.level < 4 ? 1 : game.level < 7 ? 2 : game.level < 13 ? 3 : 5;
  if (game.level < 7 && overtimeMusic.includes(sound.Music[0])) {
    playMusic(music[randInt(music.length, true)]);
  } else if (game.level >= 7 && music.includes(sound.Music[0])) {
    playMusic(overtimeMusic[randInt(overtimeMusic.length)]);
  }
}

// GAME HERE
let cnt;
export function gameLoop() {
  cnt++;
  if (win.running && !game.paused && !debug.show) {
    document.getElementById("header").style.display = "none";
    document.getElementById("nav-bar").style.display = "none";
    document.getElementById("footer").style.display = "none";
    // document.getElementById("pause-button").style.display = "flex";
  }
  // else {
  // document.getElementById("header").style.display = "flex";
  // document.getElementById("nav-bar").style.display = "flex";
  // document.getElementById("footer").style.display = "flex";
  // if (!debug.enabled && document.getElementById("pause-button"))
  //   document.getElementById("pause-button").style.display = "none";
  // }
  if (!win.running || win.view !== "Home") {
    // document.getElementById("page-body").style.maxHeight = "none";
    // document.getElementById("page-body").style.maxWidth = "95vh";
    closeGame(game.over);
    if (win.restartGame) {
      startGame(perf.gameSpeed);
    }
    return;
  }
  requestAnimationFrame(gameLoop);
  perf.now = Date.now();
  perf.delta = perf.now - perf.then;
  let runtime;
  if (perf.delta > perf.fpsInterval) {
    if (game.frames == 0) {
      perf.gameStartTime = Date.now();
      perf.sumOfPauseTimes = 0;
    }
    if (!game.over) {
      runtime = Date.now() - perf.gameStartTime;
      if (!game.over) perf.realTime = runtime;
      game.frames >= 0
        ? (perf.realTime = Math.round(perf.realTime / 100) / 10)
        : (perf.realTime = 0);
    }

    if (!win.audioLoaded) {
      win.audioLoaded = "complete";
      // win.audioLoaded = checkIfAudioLoaded(essentialLoadedAudios);
      // win.mainInfoDisplay.innerHTML = `Loading -- ${audioLoadedPercentage}%`;
      // if (win.audioLoaded) {
      //   console.log(`Essential audio loaded in ${runtime} ms`);
      //   win.audioLoaded = "essential";
      //   displayMessage(`Essential audio loaded in ${runtime} ms`, 0, 0, 21000);
      // }
    }

    if (win.audioLoaded === "essential" || win.audioLoaded === "waiting") {
      if (checkIfAudioLoaded(loadedAudios)) {
        console.log(`All audio loaded in ${runtime} ms`);
        win.audioLoaded = "complete";
        displayMessage(`All audio loaded in ${runtime} ms`, 0, 0, 3000);
      } else if (win.audioLoaded !== "waiting" && runtime > 20000) {
        win.audioLoaded = "waiting";
        displayMessage(
          "Some audio is still loading. Sound may not play accurately.",
          true,
          false,
          5000
        );
      }
    }

    if (game.paused) {
      playerAction(action);
      if (debug.enabled)
        win.mainInfoDisplay.innerHTML = `Pause -- Frame ${game.frames}`;
      if (!document.hasFocus() && !debug.enabled) {
        if (win.focused) {
          perf.lostFocusTimeStamp = Date.now();
          win.focused = false;
        } else {
          if (Date.now() - perf.lostFocusTimeStamp >= 600000) {
            win.running = false;
            render(state.Home);
          }
        }
      } else {
        win.focused = true;
      }
    }

    // Big Game Loop
    if (!game.paused && win.audioLoaded) {
      game.frames += 1 * perf.gameSpeed;
      updateFrameMods(game.frames);
      if (
        game.tutorialRunning &&
        tutorial.state == tutorial.cursor.length - 1 &&
        game.frameMod[60] == 0 &&
        game.frames < 9600 &&
        !game.over
      ) {
        game.frames += 1140;
        game.seconds += 19;
      }
      // if (touch.down) {
      // }

      if (game.over) {
        let number;
        if (game.frames > 300) {
          number = Math.floor((300 - game.frames) / 60);
          game.messagePriority = `Fetching leaderboard info...timeout in ${number}`;
        } else if (game.frames > 120) {
          game.messagePriority = `Checking ability to post scores..`;
        }
        if (game.frames > 180) {
          if (leaderboard.reason === "unofficial-cpu-game") {
            render(state.Home);
          }
          if (
            leaderboard.reason[0] === "n" ||
            (api.data !== undefined && leaderboard.data.length > 0) ||
            game.frames === 600
          ) {
            win.running = false;
          }
        }
        if (game.tutorialRunning && game.frames > 150) {
          tutorial.state = tutorial.board.length - 1;
          resetGameVariables();
          game.tutorialRunning = true;
          game.over = false;
          loadTutorialState(tutorial.state, tutorial.msgIndex);
        }
      }

      checkTime(game.frames <= 7200);

      if (game.frames > 0 && game.frameMod[60] === 0 && !game.over) {
        game.seconds++;
        if (game.frames < 7200 && game.seconds % 5 === 0) {
          if (!debug.enabled) debug.clickCounter = 0;
          let colorRatio = (120 - 60 * game.minutes - game.seconds) / 1.2;
          win.cvs.style.borderColor = `hsl(34, ${20 + 0.8 * colorRatio}%, ${20 +
            0.5 * colorRatio}%)`;
        }
        if (debug.enabled && game.seconds % 5 === 1) {
          game.pastSeconds = game.seconds;
        }

        if (sound.Music[1].currentTime >= sound.Music[1].duration) {
          if (game.level < 7) {
            playMusic(music[randInt(music.length, true)]);
          } else {
            playMusic(overtimeMusic[randInt(overtimeMusic.length, true)]);
          }

          console.log("Track ended, now playing", sound.Music[0]);
        }

        cnt = 0; // game loop counter
        if (game.mode !== "training") {
          game.defaultMessage = `Level ${game.level} | 0:${padInt(
            20 - (game.seconds % 20),
            2
          )} remaining`;
        }
        // overtime bonuses
        if (game.minutes > 2 && game.mode !== "training") {
          game.score += game.minutes < 4 ? 25 : 100;
          game.log.push(
            `Time: ${game.timeString}, Overtime Bonus +${game.seconds}, Total: ${game.score}`
          );
          console.log(game.log[game.log.length - 1]);
        }

        if (debug.enabled === 1) {
          // game.seconds--;
          game.frames -= 60;
        }
      }
      if (game.seconds % 60 == 0 && game.seconds != 0) {
        game.minutes++;
        game.seconds = 0;
      }

      if (
        game.frameMod[1200] === 0 &&
        game.mode !== "training" &&
        game.level < preset.speedValues.length &&
        game.level > 0 &&
        !debug.enabled &&
        !game.over
      ) {
        // Speed the stack up every 20 seconds

        if (game.frames >= 1200) {
          game.message = `Level ${game.level + 1}, game speed increases...`;
          game.defaultMessage = game.message;
          game.messageChangeDelay = 120;
          if (
            (!game.tutorialRunning ||
              (game.tutorialRunning && game.frameMod[2400] == 0)) &&
            game.frames !== 7200 &&
            game.frames !== 14400 &&
            (game.frames <= 7200 || game.frameMod[2400] === 0)
          )
            playAnnouncer(
              announcer.timeTransitionDialogue,
              announcer.timeTransitionIndexLastPicked,
              "timeTransition"
            );
          console.log(
            `gameTime = ${game.frames / 60}, realTime = ${
              perf.realTime
            }, pauseTime = ${perf.sumOfPauseTimes}, timeDifference = ${
              perf.realTimeDiff
            }, avg loops per sec: ${cnt}`
          );
        }

        if (game.level + 1 < preset.speedValues.length && game.frames > 0) {
          game.level++;
          updateLevelEvents(game.level);
        }
      }

      if (game.currentlyQuickRaising) {
        game.disableSwap = true;
        game.message = "Quick-Raise Initiated";
        game.messageChangeDelay = 1000;
        win.mainInfoDisplay.style.color = "black";
        if (game.rise == 0) {
          game.disableSwap = false;
          game.currentlyQuickRaising = false;
          game.message = "Quick-Raise Complete";
          game.messageChangeDelay = 90;
          win.mainInfoDisplay.style.color = "black";
          game.raiseDelay = 0;
          game.boardRiseSpeed = preset.speedValues[game.level];
        } else {
          game.boardRiseSpeed = 1;
        }
      }
      // game.pauseStack = areAllBlocksGrounded();
      doGravity(perf.gameSpeed); // may need to run twice
      checkMatch();
      updateGrid();
      isChainActive();

      checkIfHelpPlayer();

      if (!game.boardRiseSpeed)
        game.boardRiseSpeed = preset.speedValues[game.level];

      if (game.frames % game.boardRiseSpeed == 0 && game.boardRiseSpeed > 0) {
        if (
          game.boardRiseRestarter >= 180 ||
          (game.boardRiseRestarter >= 60 && game.frames >= 7200)
        ) {
          if (debug.enabled)
            console.log("restarting rise, delay remaining:", game.raiseDelay);
          game.boardRiseRestarter = 0;
          game.boardRiseDisabled = false;
          game.pauseStack = false;
        }
        if (!game.boardRiseDisabled && !game.pauseStack && debug.freeze == 0) {
          if (game.raiseDelay > 0) {
            if (game.raiseDelay > 300) game.raiseDelay = 300;
            game.raiseDelay -= game.boardRiseSpeed * perf.gameSpeed;
            if (game.raiseDelay < 0) {
              game.raiseDelay = 0;
            }
          } else if (
            game.frames > 0 &&
            !game.pauseStack &&
            !game.boardHasAirborneBlock
          ) {
            game.rise = (game.rise + 2) % 32;
            if (game.cursor.y === 0 && game.rise !== 0) game.cursor.y += 1;
            game.boardRiseRestarter = 0; // restart failsafe timer
            if (perf.gameSpeed == 2 && game.rise != 0) {
              if (game.currentlyQuickRaising || game.boardRiseSpeed === 1) {
                game.rise = (game.rise + 2) % 32;
              }
            }
          }
        }
        if (game.rise >= 28) game.readyForNewRow = true;
        if (
          game.readyForNewRow &&
          game.rise == 0 &&
          !game.over &&
          game.frames > 0 &&
          game.highestRow > 0
        ) {
          game.board = createNewRow(game.board);
          game.readyForNewRow = false;
        }
      }

      if (!game.over && isGameOver(game.score)) {
        game.finalTime = (game.frames / 60).toFixed(1);
        game.frames = 0;
        game.over = true;
        gameOverBoard();
        drawGrid();
      }
      if (game.over && game.frames < 25) {
        gameOverBoard();
        drawGrid();
      }

      drawGrid();

      playerAction(action);

      if (game.raisePressed) {
        if (game.frames < -2) game.frames = -2;
        else game.raisePressed = false;
        if (!game.boardRiseDisabled) {
          if (!cpu.enabled || (cpu.enabled && game.highestRow > 1)) {
            if (game.rise == 0) game.rise = 2;
            game.currentlyQuickRaising = true;
            game.raiseDelay = 0;
          }
        }
      }
      if (game.swapPressed) {
        if (!touch.enabled || !touch.moveOrderExists) {
          trySwappingBlocks(game.cursor.x, game.cursor.y);
          game.swapPressed = false;
        }
        // else {
        //   // for (let order in touch.moveOrderList) {
        //   //   let [c, r] = [order[0], order[1]];
        //   //   if (game.board[c][r].x < game.board[c][r].target.x) {
        //   //     trySwappingBlocks(c, r);
        //   //   } else if (game.board[c][r].x > game.board[c][r].target.x) {
        //   //     trySwappingBlocks(c - 1, r);
        //   //   } else {
        //   //     game.board[c][r].swapOrders.active = false;
        //   //   }
        //   // }
        //   // game.swapPressed = false;
        //   if (touch.selectedBlock.x < touch.target.x) {
        //     trySwappingBlocks(touch.selectedBlock.x, touch.selectedBlock.y);
        //   } else if (touch.selectedBlock.x > touch.target.x) {
        //     trySwappingBlocks(touch.selectedBlock.x - 1, touch.selectedBlock.y);
        //   } else {
        //     game.swapPressed = false;
        //     touch.moveOrderExists = false; // block has reached target
        //     // if (debug.enabled)
        //     //   console.log("frame", game.frames, "target reached.");
        //   }
        // }
      } else if (game.boardHasTargets) {
        checkSwapTargets();
      } // end game.swapPressed being true

      if (game.frames > 0 && !game.over) {
        if (helpPlayer.done && cpu.matchList.length) {
          let colorToMatch =
            game.board[cpu.matchList[0][0]][cpu.matchList[0][1]].color;
          if (colorToMatch === "vacant") {
            helpPlayer.done = false;
            console.log("color detected as vacant, redo cpuMatch");
          }
          cpu.matchList.forEach((coord) => {
            let [x, y] = coord;
            if (game.board[x][y].color !== colorToMatch) {
              helpPlayer.done = false;
              console.log("colors are not matching, redo cpuMatch");
            }
          });
          if (!helpPlayer.done) {
            cpu.matchList.length = cpu.matchStrings.length = 0;
            console.log("needed to correct cpuMatch");
          }
        }
        perf.realTimeDiff = Math.abs(
          perf.realTime - perf.sumOfPauseTimes - game.frames / 60
        );
        if (
          perf.realTimeDiff >= 3 &&
          perf.gameSpeed !== 2 &&
          game.mode !== "cpu-play" &&
          !leaderboard.reason
        ) {
          // switch to 30fps game since running slow
          if (game.frameMod[2] === 1) game.frames += 1; // make sure frame count is even
          perf.gameSpeed = 2;
          perf.fpsInterval = (1000 * perf.gameSpeed) / 60;
        }
        if (
          perf.realTimeDiff >= 15 &&
          game.mode !== "cpu-play" &&
          !leaderboard.reason
        ) {
          leaderboard.canPost = false;
          leaderboard.reason = "slow";
          perf.unrankedReason = `leaderboard posting disabled, behind real clock by
          ${perf.realTimeDiff.toFixed(1)} seconds`;
          win.fpsDisplay.style.color = "black";
        }
        //  else if (perf.realTimeDiff >= 3) {
        //   perf.unrankedReason = `warning, game is running slowly, behind real clock by
        //   ${perf.realTimeDiff.toFixed(1)} seconds`;
        //   win.fpsDisplay.style.color = "black";
        // }
      }
      if (game.frameMod[6] == 0) {
        // fps counter updates 10 times per second
        perf.secondsPerLoop =
          Math.round(100 * (runtime / 1000 - perf.prev)) / 100;
        perf.fps = Math.round(
          (1 * 6 * (1 / perf.secondsPerLoop)) / perf.gameSpeed
        );
        perf.prev = runtime / 1000;
      }
      if (perf.fps === 27) perf.fps = 30; // corrections
      if (perf.fps === 55) perf.fps = 60; // corrections
      let minutesString = "";
      let secondsString = "";
      let scoreString = "";
      let multiplierString = "";
      if (game.mode === "training") {
        if (game.minutes < 10) {
          minutesString = `0${game.minutes}`;
        } else {
          minutesString = `${game.minutes}`;
        }
        if (game.seconds < 10) {
          secondsString = `0${game.seconds}`;
        } else {
          secondsString = `${game.seconds}`;
        }
      } else {
        if (game.seconds === 0) {
          minutesString = `0${2 - game.minutes}`;
        } else if (game.minutes < 2) {
          minutesString = `0${1 - game.minutes}`;
        } else if (game.minutes < 10) {
          minutesString = `0${game.minutes - 2}`;
        } else {
          minutesString = `${game.minutes - 2}`;
        }
        if (game.minutes < 2) {
          if (game.seconds === 0) {
            secondsString = "00";
          } else if (game.seconds > 50) {
            secondsString = `0${60 - game.seconds}`;
          } else {
            secondsString = `${60 - game.seconds}`;
          }
        } else {
          if (game.seconds < 10) {
            secondsString = `0${game.seconds}`;
          } else {
            secondsString = `${game.seconds}`;
          }
        }
      }

      game.timeString = `${minutesString}:${secondsString}`;

      if (game.score < 10) {
        scoreString = `0000${game.score}`;
      } else if (game.score < 100) {
        scoreString = `000${game.score}`;
      } else if (game.score < 1000) {
        scoreString = `00${game.score}`;
      } else if (game.score < 10000) {
        scoreString = `0${game.score}`;
      } else {
        scoreString = `${game.score}`;
      }

      if (game.scoreMultiplier == 1) {
        multiplierString = "1.0x";
      } else if (game.scoreMultiplier == 2) {
        multiplierString = "2.0x";
      } else {
        multiplierString = `${game.scoreMultiplier}x`;
      }

      // `hsl(0, ${50 +
      //   40 * Math.cos(2 * Math.pi * percentOfSecond)}%, ${30 +
      //   20 * Math.cos(2 * Math.pi * percentOfSecond)}%)`
      if (game.level >= 6 && game.frameMod[6] === 0 && !game.over)
        if (game.level > 6 || game.frames > 6600) {
          win.cvs.style.borderColor = overtimeBorderColor(game.level);
        }

      if (game.over) win.cvs.style.borderColor = "red";
      if (debug.enabled == 1) {
        // ${45 + 25 * Math.sin(game.frames)}
        // 60 + 40 * Math.sin(game.frames)

        win.statDisplay.innerHTML = `Speed/Clear/Stall <br/> ${game.boardRiseSpeed}/${game.blockClearTime}/${game.blockStallTime}`;
      } else {
        win.statDisplay.innerHTML = ``;
        win.timeDisplay.innerHTML = game.timeString;
      }
      if (debug.show) {
        win.timeDisplay.innerHTML = `Game Time: ${60 * game.minutes +
          game.seconds} sec<br />Real Time: ${perf.realTime.toFixed(1)} sec`;
        win.levelDisplay.innerHTML = `[${game.cursor.x}, ${game.cursor.y}]<br>
        Score Multiplier: ${game.scoreMultiplier}<br>
        Highest Row: ${game.highestRow}`;
      } else {
        win.timeDisplay.innerHTML = game.timeString;
        win.levelDisplay.innerHTML = `${game.level > 0 ? game.level : "PR"}`;
      }
      win.scoreDisplay.innerHTML = scoreString;
      win.multiplierDisplay.innerHTML = `${game.scoreMultiplier.toFixed(2)}x`;

      win.fpsDisplay.innerHTML = `${perf.fps} fps${
        leaderboard.canPost ? "" : ` unranked -- ${perf.unrankedReason}`
      }`;
      if (game.over) {
        win.fpsDisplay.innerHTML = `Real Time: ${perf.realTime -
          perf.sumOfPauseTimes} sec, Game Time ${60 * game.minutes +
          game.seconds} sec`;
      }
      win.mainInfoDisplay.innerHTML = `${game.message}`;
      if (game.tutorialRunning) {
        win.mainInfoDisplay.innerHTML =
          tutorialMessages[tutorial.state][tutorial.msgIndex];
      } else {
        if (game.messageChangeDelay > 0) {
          game.messageChangeDelay -= 1 * perf.gameSpeed;
        }
        if (game.messageChangeDelay == 0) {
          game.message = game.defaultMessage;
        }
        if (game.messagePriority) game.message = game.messagePriority;
      }

      // win.highScoreDisplay.innerHTML = `High Score:<br>${game.highScore}`;
      if (!document.hasFocus() && !debug.enabled && !cpu.enabled) {
        pause(true);
        win.focused = false;
        perf.lostFocusTimeStamp = Date.now();
      } else {
        win.focused = true;
      }

      // document.getElementById("pause-button").innerHTML = game.tutorialRunning
      //   ? `Next ${tutorial.state + 1}/${tutorial.board.length}`
      //   : "Pause";

      if (debug.enabled) {
        win.controlsDisplay.innerHTML = html`
          <label
            >"Timers" are used for game events such as animations and how long a
            block stalls before falling.</label
          >
          <ul style="font-size: large;">
            <li>Brown: Block has a timer greater than 0</li>
            <li>
              Orange: Block has the ability to be added to the primary chain if
              it lands onto a match. Disappears after a block land and fails to
              chain. The current chain count ends when all orange circles have
              disappeared.
            </li>
            <li>
              Pink: Secondary Chainable Blocks. They are triggered if orange
              circles already exist. Similar to orange, as they will increase
              the current chain count if you match with them, but the chain
              count does not wait for pink circles to still exist. If all orange
              circles disappear, the chain count ends and all pink circles will
              turn orange and act as a new chain.
            </li>
            <li>Top Left Brown: Chain count is 0</li>
            <li>Top Left White: Chain count is 1</li>
            <li>Top Left Pink: Chain count is >1</li>
          </ul>
        `;
      } else if (game.mode === "cpu-play") {
        if (cpu.showInfo) {
          win.controlsDisplay.innerHTML = html`
            <ul>
              <li>
                <strong>black</strong>: AI Target, function is
                findVerticalMatches.
              </li>
              <li>
                <strong>Green</strong>: AI Target, function is
                findHorizontalMatches
              </li>
              <li>
                <strong>Magenta</strong>: During match functions, blocks that
                the AI wants to match together.
              </li>
              <li>
                <strong>Yellow</strong>: AI Target, function is flattenStack
              </li>
              <li>
                <strong>Tan</strong>: While flattening stack, this is the hole
                the AI is trying to fill.
              </li>
              <li>
                <strong>Violet</strong>: When showing, the AI is doing random
                inputs. Triggered when the AI attempts to do the same swap twice
                at the same coordinates, the AI will do 10 random inputs to try
                and alter the board to fix itself from getting stuck.
              </li>

              <li>
                <strong>black</strong>: If nothing to do, will return to center
                of stack and raise stack to a limit defined based on game level.
              </li>
            </ul>
          `;
        } else {
          win.controlsDisplay.innerHTML = preset.controlsDefaultMessage;
        }
      }
    }
    // outside unpause loop
  }
  // update realtime variables
  perf.then = perf.now - (perf.delta % perf.fpsInterval);
}
