/* Puzzle League/Tetris Attack Clone by Jonathan Israel!
    For more information on the game, check out https://tetris.fandom.com/wiki/Tetris_Attack.
    The game is most known as Pokemon Puzzle League, which was released 2000 on Nintendo 64),
    but it is actually a clone of Panel De Pon, a Super Nintendo Entertainment system
    game released in Japan in 1995.  There is another clone globally released in 1995 called Tetris
    Attack (It featured Yoshi!), but the game is really nothing like Tetris other than a grid.
*/

import html from "html-literal";
import { displayMessage, render, router } from "./index";
import * as state from "./store";
import { sprite, audio, audioList } from "./scripts/fileImports";
import {
  legalMatch,
  checkMatch
} from "./scripts/functions/matchAndScoreFunctions";
import {
  generateOpeningBoard,
  fixNextDarkStack,
  startGame
} from "./scripts/functions/startGame";
import { trySwappingBlocks } from "./scripts/functions/swapBlock";
import { doGravity, areAllBlocksGrounded } from "./scripts/functions/gravity";
import { submitResults } from "./scripts/functions/submitResults";
import { cpuAction } from "./scripts/computerPlayer/cpu";
import {
  action,
  actionHeld,
  actionUp,
  savedControls,
  playerAction
} from "./scripts/controls";
import { pause, unpause } from "./scripts/functions/pauseFunctions";
import {
  playAnnouncer,
  playAudio,
  playChainSFX,
  playMusic
} from "./scripts/functions/audioFunctions.js";
import {
  closeGame,
  isGameOver,
  gameOverBoard
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
  padInteger
} from "./scripts/global.js";
import {
  analyzeBoard,
  checkMatches,
  drawSquare,
  gravity,
  increaseStackHeight,
  resetBoardStateVars,
  updateBoardState
} from "./scripts/functions/experimentalFunctions";

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

class Cursor {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    // param used to be ctx
    let pixelX = this.x * grid.SQ;
    let pixelY = this.y * grid.SQ - game.rise;
    const CURSOR_IMAGE = new Image();
    CURSOR_IMAGE.src = sprite.cursor;
    CURSOR_IMAGE.onload = () => {
      win.ctx.drawImage(CURSOR_IMAGE, pixelX, pixelY);
    };
  }
}
game.cursor = new Cursor(2, 6);

class Block {
  constructor(
    x,
    y,
    color,
    type,
    timer = 0,
    switchToFaceFrame = 0,
    switchToPoppedFrame = 0,
    airborne = false,
    touched = false,
    availableForPrimaryChain = false,
    availableForSecondaryChain = false
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type;
    this.timer = timer;
    this.switchToFaceFrame = switchToFaceFrame;
    this.switchToPoppedFrame = switchToPoppedFrame;
    this.airborne = airborne;
    this.touched = touched;
    this.availableForPrimaryChain = availableForPrimaryChain; // When disappear, chain ends
    this.availableForSecondaryChain = availableForSecondaryChain;
  }

  draw() {
    let animationIndex = -1;
    const DEBUG_TARGET_IMAGE = new Image();
    const DEBUG_HOLE_IMAGE = new Image();
    const DEBUG_MATCH_IMAGE = new Image();
    const DEBUGW_IMAGE = new Image();
    const DEBUGP_IMAGE = new Image();
    const DEBUGO_IMAGE = new Image();
    const DEBUGB_IMAGE = new Image();
    const DEBUGR_IMAGE = new Image();
    const DEBUGM_IMAGE = new Image();
    // const DEBUGT_IMAGE = new Image();
    // const DEBUGC_IMAGE = new Image();
    // const DEBUGV_IMAGE = new Image();
    // const DEBUGY_IMAGE = new Image();
    if (this.type == blockType.BLINKING) {
      if ((game.frames % 4 >= 0 && game.frames % 4 < 2) || debug.freeze == 1) {
        animationIndex = 0;
      } else {
        animationIndex = 1;
      }
    } else if (this.type == blockType.PANICKING) {
      if (game.highestRow === 0) {
        animationIndex = 0;
      } else if (game.frames % 18 >= 0 && game.frames % 18 < 3) {
        animationIndex = 0;
      } else if (
        (game.frames % 18 >= 3 && game.frames % 18 < 6) ||
        (game.frames % 18 >= 15 && game.frames % 18 < 18)
      ) {
        animationIndex = 1;
      } else if (
        (game.frames % 18 >= 6 && game.frames % 18 < 9) ||
        (game.frames % 18 >= 12 && game.frames % 18 < 15)
      ) {
        animationIndex = 2;
      } else {
        animationIndex = 3;
      }
    } else if (this.type == blockType.LANDING) {
      if (this.timer > 5 || this.timer < 0) {
        animationIndex = 0;
      } else if (this.timer > 2) {
        animationIndex = 1;
      } else {
        animationIndex = 2;
      }
    }
    let BLOCK_IMAGE = new Image();
    let urlKey = blockKeyOf(this.color, this.type, animationIndex);
    BLOCK_IMAGE.src = sprite[urlKey];
    BLOCK_IMAGE.onload = () => {
      win.ctx.drawImage(
        BLOCK_IMAGE,
        grid.SQ * this.x,
        grid.SQ * this.y - game.rise
      );
    };

    // AI Visuals
    if (cpu.showInfo) {
      DEBUG_TARGET_IMAGE.src = cpu.targetColor;
      DEBUG_HOLE_IMAGE.src = sprite.debugYellow;
      DEBUG_MATCH_IMAGE.src = sprite.debugMagenta;

      if (
        (this.x === cpu.targetX && this.y === cpu.targetY) ||
        (this.x === cpu.targetX + 1 && this.y === cpu.targetY)
      ) {
        DEBUG_TARGET_IMAGE.onload = () => {
          win.ctx.drawImage(
            DEBUG_TARGET_IMAGE,
            grid.SQ * this.x,
            grid.SQ * this.y - game.rise
          );
        };
      }
      if (
        this.x === cpu.holeDetectedAt[0] &&
        this.y === cpu.holeDetectedAt[1] &&
        cpu.targetColor === sprite.debugGreen
      ) {
        DEBUG_HOLE_IMAGE.onload = () => {
          win.ctx.drawImage(
            DEBUG_HOLE_IMAGE,
            grid.SQ * this.x,
            grid.SQ * this.y - game.rise
          );
        };
      }
      if (
        cpu.matchList.includes([this.x, this.y].join()) &&
        (cpu.targetColor === sprite.debugRed ||
          cpu.targetColor === sprite.debugGreen)
      ) {
        DEBUG_MATCH_IMAGE.onload = () => {
          win.ctx.drawImage(
            DEBUG_MATCH_IMAGE,
            grid.SQ * this.x,
            grid.SQ * this.y - game.rise
          );
        };
      }
    }

    //Debug Visuals
    if (debug.show == 1) {
      if (
        cpu.enabled &&
        cpu.matchList.length > 2 &&
        cpu.matchList.includes([this.x, this.y].join())
      ) {
        DEBUGM_IMAGE.src = sprite.debugMagenta;
        DEBUGM_IMAGE.onload = () => {
          win.ctx.drawImage(
            DEBUGM_IMAGE,
            grid.SQ * this.x,
            grid.SQ * this.y - game.rise
          );
        };
      } else if (this.x == 0 && this.y == 1 && game.currentChain == 1) {
        DEBUGW_IMAGE.src = sprite.debugWhite;
        DEBUGW_IMAGE.onload = () => {
          win.ctx.drawImage(
            DEBUGW_IMAGE,
            grid.SQ * this.x,
            grid.SQ * this.y - game.rise
          );
        };
      } else if (this.availableForPrimaryChain) {
        DEBUGO_IMAGE.src = sprite.debugOrange;
        DEBUGO_IMAGE.onload = () => {
          win.ctx.drawImage(
            DEBUGO_IMAGE,
            grid.SQ * this.x,
            grid.SQ * this.y - game.rise
          );
        };
      } else if (
        this.availableForSecondaryChain ||
        (this.x == 0 && this.y == 1 && game.currentChain > 1)
      ) {
        DEBUGP_IMAGE.src = sprite.debugPink;
        DEBUGP_IMAGE.onload = () => {
          win.ctx.drawImage(
            DEBUGP_IMAGE,
            grid.SQ * this.x,
            grid.SQ * this.y - game.rise
          );
        };
      } else if (
        (this.timer > 0 && this.type == blockType.NORMAL) ||
        (this.x == 0 && this.y == 1 && game.currentChain < 1)
      ) {
        DEBUGB_IMAGE.src = sprite.debugBrown;
        DEBUGB_IMAGE.onload = () => {
          win.ctx.drawImage(
            DEBUGB_IMAGE,
            grid.SQ * this.x,
            grid.SQ * this.y - game.rise
          );
        };
      }
    }
  }
}

export function newBlock(c, r) {
  let block = new Block(c, r, blockColor.VACANT, blockType.NORMAL, 0);
  return block;
}

export function updateGrid(frameAdvance = false) {
  let highestRowFound = false;
  for (let y = 0; y < grid.ROWS + 2; y++) {
    for (let x = 0; x < grid.COLS; x++) {
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
                if (INTERACTIVE_TYPES.includes(game.board[x][i].type)) {
                  if (game.board[x][y].availableForPrimaryChain) {
                    game.board[x][i].availableForPrimaryChain = true;
                  } else if (game.board[x][y].availableForSecondaryChain)
                    game.board[x][i].availableForSecondaryChain = true;
                }
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
// }
//   if (game.board[x][y].timer === game.board[x][y].switchToFaceFrame) {
//     game.board[x][y].type = blockType.FACE;
//   }
//   if (game.board[x][y].timer ===)
//   //
//   if (game.board[x][y].popTime > 0) {
//     if (game.board[x][y].timer === game.blockInitialFaceTime) {
//       game.board[x][y].type = blockType.FACE;
//     } else if (game.board[x][y].timer === game.leftOverTime) {
//       game.board[x][y].timer -= 1;
//       game.boardRiseDisabled = true;
//     } else if (game.board[x][y].timer > 0) {
//       game.board[x][y].timer -= 1;
//       game.boardRiseDisabled = true;
//     } else if (game.board[x][y].timer === 0) {
//       game.board[x][y].type = blockType.POPPED;
//       game.board[x][y].timer = game.board[x][y].popTimer;
//       game.board[x][y].popTimer = 0;
//     }
//   } else if (
//     game.board[x][y].timer === game.board[x][y].leftoverTimer
//   ) {
//     game.board[x][y].type = blockType.POPPED;
//     game.board[x][y].leftoverTimer = 0;
//   } else if (game.board[x][y].timer > 0) {
//     game.board[x][y].timer -= 1;
//     game.boardRiseDisabled = true;
//   }
// }
//       }
//     }
//   }
// }

function decreaseTimers(x, y) {
  if (game.board[x][y].timer === -1) game.board[x][y].timer = 0;
  else if (game.board[x][y].timer > 0) game.board[x][y].timer -= 1;

  if (game.board[x][y].blinkTimer === -1) game.board[x][y].blinkTimer = 0;
  else if (game.board[x][y].blinkTimer > 0) game.board[x][y].blinkTimer -= 1;

  if (game.board[x][y].faceTimer === -1) game.board[x][y].faceTimer = 0;
  else if (game.board[x][y].faceTimer > 0) game.board[x][y].faceTimer -= 1;

  if (game.board[x][y].leftoverTimer === -1) game.board[x][y].leftoverTimer = 0;
  else if (game.board[x][y].leftoverTimer > 0)
    game.board[x][y].leftoverTimer -= 1;
}

export function drawGrid() {
  for (let x = 0; x < grid.COLS; x++) {
    for (let y = 0; y < grid.ROWS + 1; y++) {
      game.board[x][y].draw();
    }
  }
  if (!game.over) {
    game.cursor.draw();
  }
}

export function isChainActive() {
  let potentialSecondarySuccessor = false;
  for (let x = 0; x < grid.COLS; x++) {
    for (let y = 0; y < grid.ROWS; y++) {
      if (game.board[x][y].availableForPrimaryChain) {
        return true;
      } else if (game.board[x][y].availableForSecondaryChain) {
        potentialSecondarySuccessor = true;
      }
    }
  }
  // Test failed, so ending chain. Proceed with new code.
  endChain(potentialSecondarySuccessor);
  return false;
}

export function endChain(potentialSecondarySuccessor) {
  game.lastChain = game.currentChain;
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
    game.message = `${game.currentChain}x chain added ${game.chainScoreAdded} to your score.`;
    game.messageChangeDelay = 90;
  } else if (game.currentChain == 1) {
    game.message = `Combo added ${game.chainScoreAdded} to your score.`;
  }
  if (game.currentChain > game.largestChain)
    game.largestChain = game.currentChain;
  if (game.chainScoreAdded !== 0) {
    win.mainInfoDisplay.style.color = "blue";
  }
  // if another chain is currently clearing, chain is 1. Otherwise, chain is 0.
  game.currentChain = potentialSecondarySuccessor ? 1 : 0;
  game.combo = 0;
  // If a potential secondary successor is detected, run this loop...
  if (potentialSecondarySuccessor) {
    for (let x = 0; x < grid.COLS; x++) {
      for (let y = 0; y < grid.ROWS; y++) {
        if (game.board[x][y].availableForSecondaryChain) {
          game.board[x][y].availableForPrimaryChain = true;
          game.board[x][y].availableForSecondaryChain = false;
        }
      }
    }
  }
}

function doPanic() {
  let panic = false;
  let rowChecked = game.level < 7 ? 1 : game.level < 10 ? 3 : 4;
  for (let c = 0; c < grid.COLS; c++) {
    if (
      game.board[c][rowChecked].color != blockColor.VACANT &&
      game.raiseDelay < 60
    ) {
      for (let r = 0; r < grid.ROWS; r++) {
        if (game.board[c][r].type == blockType.NORMAL) {
          game.board[c][r].type = blockType.PANICKING;
          panic = true;
        }
      }
    } else {
      for (let r = 0; r < grid.ROWS; r++) {
        if (game.board[c][r].type == blockType.PANICKING) {
          game.board[c][r].type = blockType.NORMAL;
        }
      }
    }
  }
  if (panic) {
    game.message = "Danger! Watch your stack!";
    game.messageChangeDelay = 90;
    win.mainInfoDisplay.style.color = "red";
  }
  if (!panic && game.message === "Danger! Watch your stack") {
    game.message = game.defaultMessage;
  }
  return panic;
}

export function makeNewRow() {
  if (!game.grounded) {
    return false;
  }

  if (game.boardRiseDisabled || debug.freeze == 1) {
    return false;
  }

  if (game.cursor.y > 1) {
    game.cursor.y -= 1;
  }

  for (let c = 0; c < grid.COLS; c++) {
    for (let r = 1; r < grid.ROWS; r++) {
      // Raise all grid.ROWS, then delete bottom grid.ROWS.
      game.board[c][r - 1].color = game.board[c][r].color;
      game.board[c][r].color = blockColor.VACANT;
    }
    game.board[c][11].color = game.board[c][12].color;
    game.board[c][12].color = game.board[c][13].color;
    game.board[c][13].color = PIECES[randInt(PIECES.length)];
  }
  fixNextDarkStack();

  if (game.highestRow === 3) {
    playAnnouncer(
      announcer.panicDialogue,
      announcer.panicIndexLastPicked,
      "panic"
    );
  }
  return true;
}

// function checkBoardStates(c, r) {
//   if (game.board[c][r])
// }

export function checkTime() {
  win.muteMusic.checked ? (game.Music.volume = 0) : (game.Music.volume = 0.1);
  switch (game.frames) {
    case -180:
      game.Music.pause();
      debug.show = false;
      game.messagePriority = "3...";
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer3, 0.2, true);
      break;
    case -176:
      document
        .getElementById("home-page")
        .scrollIntoView({ behavior: "smooth", block: "end" });
      break;
    case -120:
      game.messagePriority = "2...";
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer2, 0.2, true);
      break;
    case -60:
      game.messagePriority = "1...";
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer1, 0.2, true);
      break;
    case 0:
      game.messagePriority = "Go!";
      if (!win.muteAnnouncer.checked) playAudio(audio.announcerGo, 0.1, true);

      break;
    case 60:
      if (game.message === "Go!") {
        playMusic(audio.popcornMusic);
        game.messagePriority = "";
        game.defaultMessage = "X to swap Z to lift the stack!";
        game.message = game.defaultMessage;
      }

      break;
    case 6600:
      game.messagePriority = "10 seconds before overtime!";
      playAnnouncer(
        announcer.hurryUpDialogue,
        announcer.hurryUpIndexLastPicked,
        "hurryUp"
      );
      break;
    case 6660:
      game.messagePriority = "";
      break;
    case 6900:
      game.messagePriority = "5 seconds before overtime...";
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer5, 0.2, true);
      break;
    case 6960:
      game.messagePriority = "4 seconds before overtime...";
      game.defaultMessage = game.message;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer4, 0.2, true);
      break;
    case 7020:
      game.messagePriority = "3 seconds before overtime...";
      game.defaultMessage = game.message;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer3, 0.2, true);
      break;
    case 7080:
      game.messagePriority = "2 seconds before overtime...";
      game.defaultMessage = game.message;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer2, 0.2, true);
      break;
    case 7140:
      game.messagePriority = "1 second before overtime...";
      game.defaultMessage = game.message;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer1, 0.2, true);
      break;
    case 7200:
      game.messagePriority = "Overtime, I hope you're ready...";
      game.defaultMessage = game.message;
      playAnnouncer(
        announcer.overtimeDialogue,
        announcer.overtimeIndexLastPicked,
        "overtime"
      );
      playMusic(audio.overtimeMusic, 0.2);
      break;
    case 7320:
      game.messagePriority = "";
  }
}

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

document.addEventListener("keydown", KEYBOARD_CONTROL);
function KEYBOARD_CONTROL(event) {
  // When on home page, before game start
  if (document.getElementById("patch-notes-overlay")) {
    if (event.keyCode < 200) {
      document.getElementById("patch-notes-overlay").remove();
      win.patchNotesShown = true;
    }
  } else if (document.getElementById("arcade-button")) {
    if ((event.keyCode == 32 || event.keyCode == 13) && win.patchNotesShown) {
      // space or enter
      document.getElementById("arcade-button").remove();
      document.getElementById("watch-ai-play-button").remove();
      game.mode = "arcade";
      startGame(2);
    } else if (event.keyCode === 87 && win.patchNotesShown) {
      // w for "wasd" controls
      game.controls = "wasd";
      document.getElementById("arcade-button").remove();
      document.getElementById("wasd-arcade-button").remove();
      document.getElementById("watch-ai-play-button").remove();
      game.mode = "arcade";
      startGame(2);
    } else if (event.keyCode === 66 && win.patchNotesShown) {
      document.getElementById("arcade-button").remove();
      document.getElementById("watch-ai-play-button").remove();
      game.mode = "cpu-play";
      startGame(2);
    }
  } else if (document.getElementById("watch-ai-play-button")) {
    if ((event.keyCode == 83 || event.keyCode == 84) && win.patchNotesShown) {
      // s or t
      // document.getElementById("arcade-button").remove();
      // document.getElementById("watch-ai-play-button").remove();
      // startGame(2);
    }
  }
  if (win.running && !!document.getElementById("canvas")) {
    // p or pause/break or esc
    if (event.keyCode == 80 || event.keyCode == 19 || event.keyCode == 27)
      game.paused ? unpause() : pause();
  }
  if (game.paused) {
    if (event.keyCode == 67) unpause(); // c
    if (event.keyCode == 82) {
      // r
      playAudio(audio.select);
      win.running = false;
      win.restartGame = true;
    }
    if (event.keyCode == 77) {
      // m
      playAudio(audio.select);
      win.running = false;
      console.log(state.Home.view);
      // console.log(router);
      render(state.Home);
      // router.navigate("/Home");
    }
  }
  // Game Controls
  if (win.running & !game.over && !game.paused) {
    if (game.mode !== "cpu-play" || debug.enabled) {
      if (savedControls.keyboard.up.includes(event.keyCode)) action.up = true;
      if (savedControls.keyboard.down.includes(event.keyCode))
        action.down = true;
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
      if (event.keyCode === 77) {
        // m
        game.level = preset.speedValues.length - 1;
        console.log("pressed");
        cpu.userChangedSpeed = true;
        updateLevelEvents(game.level);
      }
      if (event.keyCode === 78) {
        // n
        if (game.level > 0) game.level -= 1;
        cpu.userChangedSpeed = true;
        updateLevelEvents(game.level);
      }
    }

    if (event.keyCode == 192) {
      // tilda `~
      debug.enabled = (debug.enabled + 1) % 2;
      if (debug.enabled == 1) {
        debug.show = 1;
        leaderboard.canPost = false;
        leaderboard.reason = "debug";
        perf.unrankedReason = "debug mode was activated.";
        win.fpsDisplay.style.color = "red";
        // game.boardRiseSpeed = preset.speedValues[0];
        // game.blockClearTime = preset.clearValues[0];
        // game.blockStallTime = preset.stallValues[0];
        console.log("debug ON -- Score Posting Disabled");
        console.log(`Game Frame: ${game.frames}`);
        console.log(`-`);
        console.log(`Debug Controls:`);
        console.log("M -- Raise Game Level");
        console.log("N -- Lower Game Level");
        console.log("P -- Freeze/Unfreeze Block Event Delay Timers");
        console.log("F -- Advance All Block Event Delay Timers by 1 frame");
        console.log("T -- Enable/Disable Block Timer Slowdown");
        console.log("O -- Enable/Disable Chainable Block Visuals (Default ON)");
        console.log("K -- Kill Game");
        console.log("Shift -- Empty Game Board");
        console.log(game);

        console.log("-");
        console.log("Chainable Block Info Guide:");
        console.log("Brown/White/Pink -- Chain = 0/1/2+");
      } else {
        updateLevelEvents(game.level);
        console.log("debug OFF");
        debug.slowdown = 0;
        debug.freeze = 0;
        if (game.mode === "cpu-play") cpu.enabled = cpu.control = true;
        // debug.show = 0;
      }
    }

    if (debug.enabled == 1) {
      if (event.keyCode === 66) {
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
      }
      if (event.keyCode == 70 || event.keyCode == 81) {
        // f, q
        debug.freeze = (debug.freeze + 1) % 2;
      } else if (
        event.keyCode == 77 &&
        game.level < preset.speedValues.length
      ) {
        //m
        if (game.level + 1 < preset.speedValues.length) {
          game.level++;
          updateLevelEvents(game.level);
        }
      } else if (event.keyCode == 78 && game.level > 0) {
        //n
        if (game.level - 1 > -1) {
          game.level--;
          updateLevelEvents(game.level);
        }

        // Debug codes
      } else if (event.keyCode == 67 && debug.freeze == 1) {
        // c
        updateGrid(true);
      } else if (event.keyCode == 84) {
        // t
        debug.slowdown = (debug.slowdown + 1) % 2;
        if (debug.slowdown) {
          console.log("slowdown mode enabled");
          console.log(
            "In slowdown mode, block clear, block gravity, and block stall timers are set to 2 seconds."
          );
          game.boardRiseSpeed = preset.speedValues[0];
          game.blockStallTime = 120;
          game.blockClearTime = 120;
        } else {
          console.log("slowdown mode disabled");
          updateLevelEvents(game.level);
        }
      } else if (event.keyCode == 79) {
        // o
        debug.show = (debug.show + 1) % 2;
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

export function updateLevelEvents(level) {
  game.boardRiseSpeed = preset.speedValues[game.level];
  game.blockClearTime = preset.clearValues[game.level];
  game.blockBlinkTime = preset.blinkValues[game.level];
  game.blockInitialFaceTime = preset.faceValues[game.level];
  game.blockStallTime = preset.stallValues[game.level];
  game.blockPopMultiplier = preset.popMultiplier[game.level];
}

export function gameLoop() {
  // if (win.running) {
  //   document.getElementById("header").style.display = "none";
  //   document.getElementById("nav-bar").style.display = "none";
  //   document.getElementById("footer").style.display = "none";
  // } else {
  //   document.getElementById("header").style.display = "block";
  //   document.getElementById("nav-bar").style.display = "flex";
  //   document.getElementById("footer").style.display = "block";
  // }
  if (!win.audioLoaded) {
    if (audioList.length == loadedAudios.length) win.audioLoaded = true;
  }
  if (!win.running || win.view !== "Home") {
    closeGame(game.over);
    if (win.restartGame) {
      win.restartGame = false;
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

    if (game.paused) playerAction(action);

    if (!game.paused && win.audioLoaded) {
      game.frames += 1 * perf.gameSpeed;

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
          )
            win.running = false;
        }
      }

      checkTime();

      if (game.frames > 0 && game.frames % 60 == 0 && !game.over) {
        game.seconds++;
        game.defaultMessage = `Level ${game.level} | 0:${padInteger(
          20 - (game.seconds % 20),
          2
        )} remaining`;
        // overtime bonuses
        if (game.minutes == 2) {
          game.score += game.seconds;
          game.log.push(
            `Time: ${game.timeString}, Overtime Bonus +${game.seconds}, Total: ${game.score}`
          );
          console.log(game.log[game.log.length - 1]);
        } else if (game.minutes > 3) {
          game.score += 60;
          game.log.push(
            `Time: ${game.timeString}, Overtime Bonus +60, Total: ${game.score}`
          );
          console.log(game.log[game.log.length - 1]);
        }

        if (debug.enabled === 1) {
          game.seconds--;
          game.frames -= 60;
        }
      }
      if (game.seconds % 60 == 0 && game.seconds != 0) {
        game.minutes++;
        game.seconds = 0;
      }

      if (
        game.frames % 1200 == 0 &&
        game.level < preset.speedValues.length &&
        game.level > 0 &&
        !debug.enabled &&
        !game.over
      ) {
        // Speed the stack up every 20 seconds

        if (game.frames >= 1200) {
          game.message = `Level ${game.level + 1}, game speed has increased...`;
          game.defaultMessage = game.message;
          game.messageChangeDelay = 120;
          playAnnouncer(
            announcer.timeTransitionDialogue,
            announcer.timeTransitionIndexLastPicked,
            "timeTransition"
          );
          console.log(
            `gameTime = ${game.frames / 60}, realTime = ${
              perf.realTime
            }, pauseTime = ${perf.sumOfPauseTimes}, timeDifference = ${
              perf.diffFromRealTime
            }`
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
        win.mainInfoDisplay.style.color = "blue";
        if (game.rise == 0) {
          game.disableSwap = false;
          game.currentlyQuickRaising = false;
          game.message = "Quick-Raise Complete";
          game.messageChangeDelay = 90;
          win.mainInfoDisplay.style.color = "blue";
          game.raiseDelay = 0;
          game.boardRiseSpeed = preset.speedValues[game.level];
        } else {
          game.boardRiseSpeed = 1;
        }
      }
      game.grounded = areAllBlocksGrounded();
      playerAction(action);
      doGravity(perf.gameSpeed); // may need to run twice
      checkMatch();
      updateGrid();
      isChainActive();
      if (game.frames % 6 == 0) {
        doPanic();
      }
      if (game.frames % game.boardRiseSpeed == 0) {
        if (!game.boardRiseDisabled && game.grounded && debug.freeze == 0) {
          if (game.raiseDelay > 0) {
            game.raiseDelay -= game.boardRiseSpeed * perf.gameSpeed;
            if (game.raiseDelay < 0) {
              game.raiseDelay = 0;
            }
          } else if (game.frames > 0 && game.grounded) {
            game.rise = (game.rise + 2) % 32;
            if (perf.gameSpeed == 2 && game.rise != 0) {
              if (game.currentlyQuickRaising || game.boardRiseSpeed === 1) {
                game.rise = (game.rise + 2) % 32;
              }
            }
          }
        }
        if (game.highestRow === 0 && game.currentChain > 0 && game.grounded) {
          console.log("not dead yet! Go back!");
          game.rise = 30;
        }
        if (game.rise >= 28) game.readyForNewRow = true;
        if (
          game.readyForNewRow &&
          game.rise == 0 &&
          !game.over &&
          game.frames > 0
        ) {
          makeNewRow();
          game.readyForNewRow = false;
        }
      }

      if (game.raisePressed) {
        game.raisePressed = false;
        if (!game.boardRiseDisabled) {
          if (!cpu.enabled || (cpu.enabled && game.highestRow > 1)) {
            if (game.rise == 0) game.rise = 2;
            game.currentlyQuickRaising = true;
            game.raiseDelay = 0;
          }
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

      // Try and control a frame rate based
      // on computer performance by decreasing or increasing
      // the amount of times the game.board is drawn per second
      drawGrid();
      // if (!game.over) {
      //   if (game.frames % perf.drawDivisor == 0) {
      //     drawGrid();
      //   }
      // }
      if (game.frames > 0 && game.frames % 60 == 0 && !game.over) {
        perf.diffFromRealTime = Math.abs(
          perf.realTime - perf.sumOfPauseTimes - game.frames / 60
        );
        if (perf.diffFromRealTime >= 6 && game.mode !== "cpu-play") {
          leaderboard.canPost = false;
          leaderboard.reason = "slow";
          perf.unrankedReason = `leaderboard posting disabled, behind real clock by
          ${perf.diffFromRealTime.toFixed(1)} seconds`;
          win.fpsDisplay.style.color = "red";
        }
        //  else if (perf.diffFromRealTime >= 3) {
        //   perf.unrankedReason = `warning, game is running slowly, behind real clock by
        //   ${perf.diffFromRealTime.toFixed(1)} seconds`;
        //   win.fpsDisplay.style.color = "blue";
        // }
      }
      if (game.frames % 5 == 0) {
        // fps counter
        perf.secondsPerLoop =
          Math.round(100 * (runtime / 1000 - perf.prev)) / 100;
        perf.fps = Math.round(1 * 5 * (1 / perf.secondsPerLoop)) / 1;
        perf.prev = runtime / 1000;
      }
      let minutesString = "";
      let secondsString = "";
      let scoreString = "";
      let multiplierString = "";
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
      if (debug.enabled == 1) {
        win.statDisplay.innerHTML = `Speed/Clear/Stall <br/> ${game.boardRiseSpeed}/${game.blockClearTime}/${game.blockStallTime}`;
      } else {
        win.statDisplay.innerHTML = ``;
        win.timeDisplay.innerHTML = game.timeString;
      }
      if (debug.show) {
        win.timeDisplay.innerHTML = `Game Time: ${60 * game.minutes +
          game.seconds} seconds<br />Real Time: ${perf.realTime} seconds`;
        win.levelDisplay.innerHTML = `[${game.cursor.x}, ${game.cursor.y}]<br>
        Stack size: ${12 - game.highestRow}<br>
        Highest Row: ${game.highestRow}`;
      } else {
        win.timeDisplay.innerHTML = game.timeString;
        win.levelDisplay.innerHTML = `${game.level}`;
      }

      if (game.frames > 60) {
        if (game.frames % 1200 >= 1020) {
          win.timeDisplay.style.color = "red";
        } else {
          if (win.timeDisplay.style.color !== "black") {
            win.timeDisplay.style.color = "black";
          }
        }
        if (game.frames % 1200 < 60) {
          win.levelDisplay.style.color = "red";
        } else {
          if (win.levelDisplay.style.color !== "black") {
            win.levelDisplay.style.color = "black";
          }
        }

        if (game.currentChain > 0) {
          win.scoreDisplay.style.color = "red";
        } else {
          if (win.scoreDisplay.style.color !== "black") {
            win.scoreDisplay.style.color = "black";
          }
        }
      }
      win.scoreDisplay.innerHTML = scoreString;
      win.fpsDisplay.innerHTML = `${perf.fps} fps${
        leaderboard.canPost ? "" : ` unranked -- ${perf.unrankedReason}`
      }`;
      if (game.over) {
        win.fpsDisplay.innerHTML = `Real Game Clock Time: ${perf.realTime -
          perf.sumOfPauseTimes} seconds`;
      }
      win.mainInfoDisplay.innerHTML = `${game.message}`;
      if (game.messageChangeDelay > 0) {
        game.messageChangeDelay -= 1 * perf.gameSpeed;
      }
      if (game.messageChangeDelay == 0) {
        game.message = game.defaultMessage;
      }
      if (game.messagePriority) game.message = game.messagePriority;

      // win.highScoreDisplay.innerHTML = `High Score:<br>${game.highScore}`;
      if (!document.hasFocus() && !debug.enabled && !cpu.enabled) {
        pause(true);
      }

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
                <strong>Red</strong>: AI Target, function is
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
                <strong>Blue</strong>: If nothing to do, will return to center
                of stack and raise stack to a limit defined based on game level.
              </li>
            </ul>
          `;
        } else {
          win.controlsDisplay.innerHTML = preset.controlsDefaultMessage;
        }
      }
    }
    // outside pause loop
  }
  // update realtime variables
  perf.then = perf.now - (perf.delta % perf.fpsInterval);
}

//////
/////////

//////////////

export function puzzleLeagueLoop() {
  if (!win.running || win.view !== "Home") {
    closeGame(game.over);
    if (win.restartGame) {
      win.restartGame = false;
      startGame(perf.gameSpeed, 2);
    }
    return;
  }
  requestAnimationFrame(puzzleLeagueLoop);
  perf.now = Date.now();
  perf.delta = perf.now - perf.then;
  let runtime;
  let readyForNextGameFrame = perf.delta > perf.fpsInterval;
  if (readyForNextGameFrame) {
    // when countdown ends, begin game
    if (game.frames === 0) {
      perf.gameStartTime = Date.now();
      perf.sumOfPauseTimes = 0;
    }
    if (!game.over) {
      runtime = Date.now() - perf.gameStartTime;
      perf.realTime =
        game.frames >= 0 ? Math.round(perf.realTime / 100 / 10) : 0;
    }

    if (game.paused) playerAction(action);
    else {
      game.frames += 1 * perf.gameSpeed;
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
          )
            win.running = false;
        }
      }

      checkTime();

      if (game.frames % 60 === 0 && game.frames > 0 && !game.over) {
        game.seconds++;
        game.defaultMessage = `Level ${game.level} | 0:${padInteger(
          20 - (game.seconds % 20),
          2
        )} remaining`;
        // overtime bonuses
        if (game.minutes == 2) {
          game.score += game.seconds;
          game.log.push(
            `Time: ${game.timeString}, Overtime Bonus +${game.seconds}, Total: ${game.score}`
          );
          console.log(game.log[game.log.length - 1]);
        } else if (game.minutes > 3) {
          game.score += 60;
          game.log.push(
            `Time: ${game.timeString}, Overtime Bonus +60, Total: ${game.score}`
          );
          console.log(game.log[game.log.length - 1]);
        }

        if (debug.enabled === 1) {
          game.seconds--;
          game.frames -= 60;
        }

        if (game.seconds % 60 === 0 && game.seconds !== 0) {
          game.minutes++;
          game.seconds = 0;
        }

        if (
          game.frames % 1200 == 0 &&
          game.level < preset.speedValues.length &&
          game.level > 0 &&
          !debug.enabled
        ) {
          // Speed the stack up every 20 seconds

          if (game.frames >= 1200) {
            game.message = `Level ${game.level +
              1}, game speed has increased...`;
            game.defaultMessage = game.message;
            game.messageChangeDelay = 120;
            playAnnouncer(
              announcer.timeTransitionDialogue,
              announcer.timeTransitionIndexLastPicked,
              "timeTransition"
            );
            console.log(
              `gameTime = ${game.frames / 60}, realTime = ${
                perf.realTime
              }, pauseTime = ${perf.sumOfPauseTimes}, timeDifference = ${
                perf.diffFromRealTime
              }`
            );
          }

          if (game.level + 1 < preset.speedValues.length && game.frames > 0) {
            game.level++;
            updateLevelEvents(game.level);
          }

          console.log(runtime);
          resetBoardStateVars();
          // Game Logic
          playerAction(action);
          for (let c = 0; c < grid.COLS; c++) {
            for (let r = grid.ROWS - 1; r >= 0; r--) {
              gravity(perf.gameSpeed, c, r);
              checkMatches(c, r);
              updateBoardState(c, r);
              drawSquare(c, r);
            }
          }
          console.log(runtime);
          game.cursor.draw();
          analyzeBoard();
          increaseStackHeight();

          if (game.over && game.frames < 25) {
            gameOverBoard();
            drawGrid();
          }

          if (game.raisePressed) {
            game.raisePressed = false;
            if (!game.boardRiseDisabled) {
              if (!cpu.enabled || (cpu.enabled && game.highestRow > 1)) {
                if (game.rise == 0) game.rise = 2;
                game.currentlyQuickRaising = true;
                game.raiseDelay = 0;
              }
            }
          }

          if (game.currentlyQuickRaising) {
            game.disableSwap = true;
            game.message = "Quick-Raise Initiated";
            game.messageChangeDelay = 1000;
            win.mainInfoDisplay.style.color = "blue";
            if (game.rise === 0) {
              game.boardRiseSpeed = preset.speedValues[game.level];
              game.disableSwap = false;
              game.currentlyQuickRaising = false;
              game.message = "Quick-Raise Complete";
              game.messageChangeDelay = 90;
              win.mainInfoDisplay.style.color = "blue";
              game.raiseDelay = 0;
            } else {
              game.boardRiseSpeed = 1;
            }
          }
        }
      }
      if (game.frames % 5 == 0) {
        // fps counter
        perf.secondsPerLoop =
          Math.round(100 * (runtime / 1000 - perf.prev)) / 100;
        perf.fps = Math.round(1 * 5 * (1 / perf.secondsPerLoop)) / 1;
        perf.prev = runtime / 1000;
      }
      let minutesString = "";
      let secondsString = "";
      let scoreString = "";
      let multiplierString = "";
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
      if (debug.enabled == 1) {
        win.statDisplay.innerHTML = `Speed/Clear/Stall <br/> ${game.boardRiseSpeed}/${game.blockClearTime}/${game.blockStallTime}`;
      } else {
        win.statDisplay.innerHTML = ``;
        win.timeDisplay.innerHTML = game.timeString;
      }
      if (debug.show) {
        win.timeDisplay.innerHTML = `Game Time: ${60 * game.minutes +
          game.seconds} seconds<br />Real Time: ${perf.realTime} seconds`;
        win.levelDisplay.innerHTML = `[${game.cursor.x}, ${game.cursor.y}]<br>
        Stack size: ${12 - game.highestRow}<br>
        Highest Row: ${game.highestRow}`;
      } else {
        win.timeDisplay.innerHTML = game.timeString;
        win.levelDisplay.innerHTML = `${game.level}`;
      }

      if (game.frames > 60) {
        if (game.frames % 1200 >= 1020) {
          win.timeDisplay.style.color = "red";
        } else {
          if (win.timeDisplay.style.color !== "black") {
            win.timeDisplay.style.color = "black";
          }
        }
        if (game.frames % 1200 < 60) {
          win.levelDisplay.style.color = "red";
        } else {
          if (win.levelDisplay.style.color !== "black") {
            win.levelDisplay.style.color = "black";
          }
        }

        if (game.currentChain > 0) {
          win.scoreDisplay.style.color = "red";
        } else {
          if (win.scoreDisplay.style.color !== "black") {
            win.scoreDisplay.style.color = "black";
          }
        }
      }
      win.scoreDisplay.innerHTML = scoreString;
      win.fpsDisplay.innerHTML = `${perf.fps} fps${
        leaderboard.canPost ? "" : ` unranked -- ${perf.unrankedReason}`
      }`;
      if (game.over) {
        win.fpsDisplay.innerHTML = `Real Game Clock Time: ${perf.realTime -
          perf.sumOfPauseTimes} seconds`;
      }
      win.mainInfoDisplay.innerHTML = `${game.message}`;
      if (game.messageChangeDelay > 0) {
        game.messageChangeDelay -= 1 * perf.gameSpeed;
      }
      if (game.messageChangeDelay == 0) {
        game.message = game.defaultMessage;
      }
      if (game.messagePriority) game.message = game.messagePriority;

      // win.highScoreDisplay.innerHTML = `High Score:<br>${game.highScore}`;
      if (!document.hasFocus() && !debug.enabled && !cpu.enabled) {
        pause(true);
      }

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
                <strong>Red</strong>: AI Target, function is
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
                <strong>Blue</strong>: If nothing to do, will return to center
                of stack and raise stack to a limit defined based on game level.
              </li>
            </ul>
          `;
        } else {
          win.controlsDisplay.innerHTML = preset.controlsDefaultMessage;
        }
      }
    } // end game not paused
  } // end ready for next frame
  // update realtime variables
  perf.then = perf.now - (perf.delta % perf.fpsInterval);
}
