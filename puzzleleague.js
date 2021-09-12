/* Puzzle League/Tetris Attack Clone by Jonathan Israel!
    For more information on the game, check out https://tetris.fandom.com/wiki/Tetris_Attack.
    The game is most known as Pokemon Puzzle League, which was released 2000 on Nintendo 64),
    but it is actually a clone of Panel De Pon, a Super Nintendo Entertainment system
    game released in Japan in 1995.  There is another clone globally released in 1995 called Tetris
    Attack (It featured Yoshi!), but the game is really nothing like Tetris other than a grid.
*/

import { sprite, audio } from "./scripts/fileImports";
import {
  legalMatch,
  checkMatch
} from "./scripts/functions/matchAndScoreFunctions";
import {
  generateOpeningBoard,
  fixNextDarkStack,
  resetGameVariables
} from "./scripts/functions/beginGame";
import { trySwappingBlocks } from "./scripts/functions/swapBlock";
import { doGravity } from "./scripts/functions/gravity";
import { submitResults } from "./scripts/functions/submitResults";
import {
  playAnnouncer,
  playAudio,
  playChainSFX,
  playMusic
} from "./scripts/functions/audioFunctions.js";
import {
  isGameOver,
  gameOverBoard
} from "./scripts/functions/gameOverFunctions";

import {
  announcer,
  blockColor,
  blockType,
  PIECES,
  INTERACTIVE_PIECES,
  win,
  grid,
  game,
  preset,
  api,
  chainLogic,
  performance,
  debug,
  randInt
} from "./scripts/global.js";

// console.log(highScoreDisplay);

if (localStorage.getItem("highScore") === null) {
  localStorage.setItem("highScore", "1000");
}
if (localStorage.getItem("mute-announcer") === null) {
  localStorage.setItem("mute-announcer", false);
}
if (localStorage.getItem("mute-music") === null) {
  localStorage.setItem("mute-music", false);
}
if (localStorage.getItem("mute-sfx") === null) {
  localStorage.setItem("mute-sfx", false);
}

win.muteAnnouncer = document.getElementById("mute-announcer");
win.muteMusic = document.getElementById("mute-music");
win.muteSFX = document.getElementById("mute-sfx");

function blockKeyOf(color, type, animationIndex = -1) {
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
    touched = false,
    availableForPrimaryChain = false,
    availableForSecondaryChain = false
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type;
    this.timer = timer;
    this.touched = touched;
    this.availableForPrimaryChain = availableForPrimaryChain; // When disappear, chain ends
    this.availableForSecondaryChain = availableForSecondaryChain;
  }

  draw() {
    let animationIndex = -1;
    const DEBUGW_IMAGE = new Image();
    const DEBUGP_IMAGE = new Image();
    const DEBUGO_IMAGE = new Image();
    const DEBUGB_IMAGE = new Image();
    if (this.type == blockType.CLEARING) {
      if ((game.frames % 4 >= 0 && game.frames % 4 < 2) || debug.pause == 1) {
        animationIndex = 0;
      } else {
        animationIndex = 1;
      }
    } else if (this.type == blockType.PANICKING) {
      if (game.frames % 18 >= 0 && game.frames % 18 < 3) {
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

    //Debug Visuals
    if (debug.show == 1) {
      if (this.availableForPrimaryChain && this.availableForSecondaryChain) {
        DEBUGB_IMAGE.src = sprite.debugBrown;
        DEBUGB_IMAGE.onload = () => {
          win.ctx.drawImage(
            DEBUGB_IMAGE,
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
      } else if (this.availableForSecondaryChain) {
        DEBUGP_IMAGE.src = sprite.debugPink;
        DEBUGP_IMAGE.onload = () => {
          win.ctx.drawImage(
            DEBUGP_IMAGE,
            grid.SQ * this.x,
            grid.SQ * this.y - game.rise
          );
        };
      } else if (this.timer > 0 && this.type == blockType.NORMAL) {
        DEBUGW_IMAGE.src = sprite.debugWhite;
        DEBUGW_IMAGE.onload = () => {
          win.ctx.drawImage(
            DEBUGW_IMAGE,
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

function timeSinceGameStarted(gameStart) {
  return Math.floor((Date.now() - gameStart) / 1000);
}

function updateGrid(frameAdvance = false) {
  for (let x = 0; x < grid.COLS; x++) {
    for (let y = 0; y < grid.ROWS + 2; y++) {
      // Check to see if a block is still legally in a landing animation
      if (game.board[x][y].type == blockType.LANDING) {
        for (let i = grid.ROWS - 1; i > y; i--) {
          if (game.board[x][i].color == blockColor.VACANT) {
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

      if (!frameAdvance) {
        if (game.board[x][y].timer > 0 && debug.pause == 0) {
          game.board[x][y].timer -= 1 * performance.gameSpeed;
          game.disableRaise = true;
        } else if (game.board[x][y].timer == 0) {
          if (game.board[x][y].type == blockType.CLEARING) {
            game.board[x][y].type = blockType.FACE;
            game.board[x][y].timer = preset.clearValues[game.level];
          } else if (game.board[x][y].type == blockType.FACE) {
            game.board[x][y].color = blockColor.VACANT;
            game.board[x][y].type = blockType.NORMAL;
            if (y > 0 && game.board[x][y - 1].color != blockColor.VACANT) {
              game.board[x][y - 1].timer = game.blockStallTime;
            }
            game.disableRaise = false;
            for (let i = 0; i <= y; i++) {
              // create chain available blocks above current
              if (game.board[x][y].availableForPrimaryChain) {
                game.board[x][i].availableForPrimaryChain = true;
              } else if (game.board[x][y].availableForSecondaryChain)
                game.board[x][i].availableForSecondaryChain = true;
            }
          }
        }

        if (game.board[x][y].timer == -1) {
          game.board[x][y].timer = 0;
        }
      } else {
        if (game.board[x][y].timer > 0) {
          game.board[x][y].timer -= 1;
        }
      }
    }
  }
}

function drawGrid() {
  for (let x = 0; x < grid.COLS; x++) {
    for (let y = 0; y < grid.ROWS + 1; y++) {
      game.board[x][y].draw();
    }
  }
  if (!game.over) {
    game.cursor.draw();
  }
}

function isChainActive() {
  // if (game.grounded) { // failsafe to end chain
  //     for (let c=0; c<grid.COLS; c++) {
  //         for (let r=0; r<grid.ROWS; r++) {
  //             game.board[c][r].availableForPrimaryChain = false
  //             game.board[c][r].availableForSecondaryChain = false
  //         }
  //     }
  // }
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
  // Test failed, so ending chain.
  game.lastChain = game.currentChain;
  if (game.currentChain > 8) {
    playAudio(audio.fanfare5, 0.25);
    if (!win.muteAnnouncer.checked) playAudio(audio.announcerUnbelievable);
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
  if (game.currentChain > 1) console.log(`${game.currentChain} chain!`);
  if (game.currentChain > game.largestChain)
    game.largestChain = game.currentChain;
  game.currentChain = 0;
  game.combo = 0;
  if (game.chainScoreAdded !== 0) {
    game.message = `Nice! Your previous chain added ${game.chainScoreAdded} to your score`;
    game.messageChangeDelay = 90;
    if (game.chainScoreAdded != 0)
      game.defaultMessage = `Previous chain score added: ${game.chainScoreAdded}`;
    win.mainInfoDisplay.style.color = "blue";
  }
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
  return false;
}

function checkClearing() {
  let clearingColumns = [];
  for (let c = 0; c < grid.COLS; c++) {
    clearingColumns[c] = false;
    for (let r = 0; r < grid.ROWS; r++) {
      if (!INTERACTIVE_PIECES.includes(game.board[c][r].type)) {
        clearingColumns[c] = true;
        break;
      }
    }
  }
  return clearingColumns;
}

function doPanic() {
  let panic = false;
  for (let c = 0; c < grid.COLS; c++) {
    if (game.board[c][1].color != blockColor.VACANT && game.raiseDelay == 0) {
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

function raiseStack() {
  if (game.disableRaise || debug.pause == 1) {
    return false;
  } else if (game.raiseDelay > 0) {
    game.raiseDelay -= 1 * performance.gameSpeed;
    if (game.raiseDelay < 0) {
      game.raiseDelay = 0;
    }
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
  }

  for (let c = 0; c < grid.COLS; c++) {
    game.board[c][11].color = game.board[c][12].color;
    game.board[c][12].color = game.board[c][13].color;
    game.board[c][13].color = PIECES[randInt(PIECES.length)];
  }
  fixNextDarkStack();

  for (let i = 0; i < 2; i++) {
    for (let c = 0; c < grid.COLS; c++) {
      if (i == 0) {
        if (
          game.board[c][0].color != blockColor.VACANT ||
          game.board[c][1].color != blockColor.VACANT
        ) {
          i = 1;
          break;
        }
      } else {
        if (game.board[c][2].color != blockColor.VACANT) {
          playAnnouncer(
            announcer.panicDialogue,
            announcer.panicIndexLastPicked,
            "panic"
          );
          break;
        }
      }
    }
  }

  return true;
}

function checkTime() {
  win.muteMusic.checked ? (game.Music.volume = 0) : (game.Music.volume = 0.1);
  if (win.muteAnnouncer.checked) return;
  switch (game.frames) {
    case -178:
      game.message = "3...";
      game.messageChangeDelay = 90;
      playAudio(audio.announcer3, (game.volume = 0.3));
      break;
    case -177:
      win.cvs.scrollIntoView({ block: "nearest" });
      break;
    case -120:
      game.message = "2...";
      game.messageChangeDelay = 90;
      playAudio(audio.announcer2, (game.volume = 0.3));
      break;
    case -60:
      game.message = "1...";
      game.messageChangeDelay = 90;
      playAudio(audio.announcer1, (game.volume = 0.3));
      break;
    case 0:
      game.message = "Go!";
      game.messageChangeDelay = 90;
      playAudio(audio.announcerGo);
      break;
    case 60:
      if (game.message === "Go!") {
        game.defaultMessage =
          "Arrow Keys to Move, X to swap, and Z to lift the stack";
        game.message = game.defaultMessage;
      }

      break;
    case 6600:
      game.message = "10 seconds before overtime!";
      game.messageChangeDelay = 400;
      playAnnouncer(
        announcer.hurryUpDialogue,
        announcer.hurryUpIndexLastPicked,
        "hurryUp"
      );
      break;
    case 6900:
      game.message = "5 seconds before overtime...";
      game.defaultMessage = game.message;
      game.messageChangeDelay = 90;
      playAudio(audio.announcer5, (game.volume = 0.3));
      break;
    case 6960:
      game.message = "4 seconds before overtime...";
      game.messageChangeDelay = 90;
      game.defaultMessage = game.message;
      playAudio(audio.announcer4, (game.volume = 0.3));
      break;
    case 7020:
      game.message = "3 seconds before overtime...";
      game.defaultMessage = game.message;
      game.messageChangeDelay = 90;
      playAudio(audio.announcer3, (game.volume = 0.3));
      break;
    case 7080:
      game.message = "2 seconds before overtime...";
      game.defaultMessage = game.message;
      playAudio(audio.announcer2, (game.volume = 0.3));
      game.messageChangeDelay = 90;
      break;
    case 7140:
      game.message = "1 second before overtime...";
      game.defaultMessage = game.message;
      game.messageChangeDelay = 90;
      playAudio(audio.announcer1, (game.volume = 0.3));
      break;
  }
}

function closeGame(view) {
  console.log("closeGame called");
  win.running = false;
  if (view === "Home") {
    playMusic(audio.resultsMusic, 0.2);
    game.Music.loop = false;
  } else {
    game.Music.volume = 0;
  }
  win.cvs = null;
  win.ctx = null;
  win.running = false;
  win.makeCanvas.remove();
  if (view === "Home") {
    playMusic(audio.resultsMusic, 0.2);
    game.Music.loop = false;
    submitResults();
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
  if (win.running & !game.over) {
    if (event.keyCode == 37) {
      // left
      if (game.cursor.x - 1 >= 0) {
        game.cursor.x -= 1;
        playAudio(audio.moveCursor);
      }
    } else if (event.keyCode == 38) {
      // up
      if (game.cursor.y - 1 >= 1) {
        game.cursor.y -= 1;
        playAudio(audio.moveCursor);
      }
    } else if (event.keyCode == 39) {
      // right
      if (game.cursor.x + 1 <= 4) {
        game.cursor.x += 1;
        playAudio(audio.moveCursor);
      }
    } else if (event.keyCode == 40) {
      // bottom
      if (game.cursor.y + 1 <= 11) {
        game.cursor.y += 1;
        playAudio(audio.moveCursor);
      }
    } else if (event.keyCode == 88 || event.keyCode == 83) {
      // x, s
      if (game.frames > 0) {
        trySwappingBlocks(game.cursor.x, game.cursor.y);
      }
    } else if (event.keyCode == 82 || event.keyCode == 90) {
      // r, z
      game.raisePressed = true; // run raise function on next frame
    } else if (event.keyCode == 192) {
      // tilda `~
      debug.enabled = (debug.enabled + 1) % 2;
      if (debug.enabled == 1) {
        debug.show = 1;
        game.boardRiseSpeed = preset.speedValues[0];
        game.blockClearTime = preset.clearValues[0];
        game.blockStallTime = preset.stallValues[0];
        console.log("debug ON");
        console.log(`fps: ${performance.fps}`);
        console.log(`Draw Divisor: ${performance.drawDivisor}`);
        console.log(`Time: ${game.minutes}, ${game.seconds}`);
      } else {
        game.boardRiseSpeed = preset.speedValues[game.level];
        game.blockClearTime = preset.clearValues[game.level];
        game.blockStallTime = preset.stallValues[game.level];
        console.log("debug OFF");
        debug.slowdown = 0;
        debug.pause = 0;
        debug.show = 0;
      }
    }
    if (debug.enabled == 1) {
      if (event.keyCode == 50) {
        // Number 2
        performance.gameSpeed =
          performance.gameSpeed == 1
            ? (performance.gameSpeed = 2)
            : (performance.gameSpeed = 1);
        console.log("Speed:", performance.gameSpeed);
      }
      if (event.keyCode == 27) {
        // escape
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
      if (event.keyCode == 48) {
        // 0 (number)
        game.rise = 0;
        game.board = generateOpeningBoard();
        game.disableRaise = false;
      } else if (event.keyCode == 80 || event.keyCode == 81) {
        // p, q
        debug.pause = (debug.pause + 1) % 2;
      } else if (event.keyCode == 77 && game.level < 10) {
        //+
        game.level += 1 * performance.gameSpeed;
        game.boardRiseSpeed = preset.speedValues[game.level];
        game.blockClearTime = preset.clearValues[game.level];
        game.blockStallTime = preset.stallValues[game.level];
      } else if (event.keyCode == 78 && game.level > 0) {
        //-
        game.level -= 1 * performance.gameSpeed;
        game.boardRiseSpeed = preset.speedValues[game.level];
        game.blockClearTime = preset.clearValues[game.level];
        game.blockStallTime = preset.stallValues[game.level];

        // Debug codes
      } else if (event.keyCode == 70) {
        // f
        if (debug.pause == 1) {
          updateGrid(true);
        }
      } else if (event.keyCode == 84) {
        // t
        debug.slowdown = (debug.slowdown + 1) % 2;
        if (debug.slowdown) {
          console.log("developer mode enabled");
          game.boardRiseSpeed = preset.speedValues[0];
          game.blockStallTime = 120;
          game.blockClearTime = 120;
        } else {
          console.log("developer mode disabled");
          game.boardRiseSpeed = preset.speedValues[game.level];
          game.blockClearTime = preset.clearValues[game.level];
          game.blockStallTime = preset.stallValues[game.level];
        }
      } else if (event.keyCode == 79) {
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
  } else if (win.running && game.over) {
    if (event.keyCode >= 0 && game.frames >= 200) {
      // press any key after game over
      playAnnouncer(
        announcer.endgameDialogue,
        announcer.endgameIndexLastPicked,
        "endgame"
      );
      win.running = false;
    }
  }
}

export function gameLoop(timestamp) {
  game.frames++;

  if (game.over && game.frames > 300 && api.data !== undefined) {
    playAnnouncer(
      announcer.endgameDialogue,
      announcer.endgameIndexLastPicked,
      "endgame"
    );
    closeGame(win.view);
    win.running = false;
    return;
  }

  if (!win.running || win.view !== "Home") {
    console.log("closing game", win.view);
    closeGame(win.view);
    win.running = false;
    return;
  }
  checkTime();

  if (game.frames > 0 && game.frames % 60 == 0 && !game.over) {
    game.seconds++;
    if (debug.enabled === 1) {
      game.seconds--;
      game.frames -= 60;
    }
  }
  if (game.seconds % 60 == 0 && game.seconds != 0) {
    game.minutes++;
    game.seconds = 0;
  }

  if (game.frames % game.boardRiseSpeed == 0) {
    if (!game.disableRaise && game.grounded && debug.pause == 0) {
      if (game.raiseDelay > 0) {
        if (!checkClearing().includes(true)) {
          game.raiseDelay -= game.boardRiseSpeed * performance.gameSpeed;
        }
      } else if (game.frames > 0) game.rise = (game.rise + 2) % 32;
    }
    if (game.rise == 0 && !game.over && game.frames > 0) {
      raiseStack();
    }
  }

  if (
    game.frames % 1200 == 0 &&
    game.level < 10 &&
    game.level > 0 &&
    debug.enabled === 0 &&
    !game.over
  ) {
    // Speed the stack up every 20 seconds

    if (game.frames == 7200) {
      game.message = "Overtime, I hope you're ready!";
      game.defaultMessage = game.message;
      game.messageChangeDelay = 300;
      playAnnouncer(
        announcer.overtimeDialogue,
        announcer.overtimeIndexLastPicked,
        "overtime"
      );
      playMusic(audio.overtimeMusic, 0.2);
    } else if (game.frames >= 1200) {
      game.message = `Level ${game.level + 1}, Game Speed has Increased...`;
      game.messageChangeDelay = 120;
      playAnnouncer(
        announcer.timeTransitionDialogue,
        announcer.timeTransitionIndexLastPicked,
        "timeTransition"
      );
    }

    if (game.frames > 0) game.level++;
    game.boardRiseSpeed = preset.speedValues[game.level];
    game.blockClearTime = preset.clearValues[game.level];
    game.blockStallTime = preset.stallValues[game.level];
  }

  if (game.quickRaise) {
    game.disableSwap = true;
    game.message = "Quick-Raise Initiated";
    game.messageChangeDelay = 1000;
    win.mainInfoDisplay.style.color = "blue";
    if (game.rise == 0) {
      game.disableSwap = false;
      game.quickRaise = false;
      game.message = "Quick-Raise Complete";
      game.messageChangeDelay = 90;
      win.mainInfoDisplay.style.color = "blue";
      game.raiseDelay = 0;
      game.boardRiseSpeed = Math.floor(
        preset.speedValues[game.level] / performance.gameSpeed
      );
    } else {
      game.boardRiseSpeed = 1;
    }
  }
  game.grounded = doGravity();
  updateGrid();
  checkMatch();
  isChainActive();
  if (game.frames % 6 == 0) {
    doPanic();
  }

  if (game.raisePressed) {
    game.raisePressed = false;
    if (!game.disableRaise) {
      game.quickRaise = true;
      game.raiseDelay = 0;
    }
  }

  if (!game.over && isGameOver(game.score)) {
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
  if (game.over && game.frames < 25) {
    gameOverBoard();
    drawGrid();
  }

  // Try and control a frame rate based
  // on computer performance by decreasing or increasing
  // the amount of times the game.board is drawn per second
  if (!game.over) {
    if (game.frames % performance.drawDivisor == 0) {
      drawGrid();
    }
    if (performance.fps >= 80) {
      drawGrid();
    }
  }

  if (game.frames % 5 == 0) {
    // fps counter
    performance.secondsPerLoop =
      Math.floor(100 * (timestamp / 1000 - performance.prev)) / 100;
    performance.fps = Math.floor(1 * 5 * (1 / performance.secondsPerLoop)) / 1;
    if (performance.fps < 40 && performance.gameSpeed == 1) {
      // If the game is running at below 0.9x speed, there's a problem.
      performance.slowdownTracker += 1; // for each frame, if there is low frame rate 2
      // console.log(
      //   `${performance.slowdownTracker} times under 40 fps every 2 seconds (3 needed)`
      // );
    }
    performance.prev = timestamp / 1000;
  }

  if (game.seconds % 2 == 0) {
    performance.slowdownTracker -= 1;
    if (performance.slowdownTracker < 0) performance.slowdownTracker = 0;
  } // Check # of frame rate drops every 600 frames
  if (performance.slowdownTracker > 2) {
    // If fps is below 50 fps for 2 seconds in the next 10, lower settings
    performance.slowdownTracker = 0;
    if (
      performance.fps <= 45 &&
      performance.drawDivisor >= 2 &&
      performance.gameSpeed < 2
    ) {
      performance.gameSpeed = 1;
      console.log("game speed has now doubled");
    }
    if (performance.fps <= 55 && performance.drawDivisor < 2) {
      performance.drawDivisor += 1;
      // console.log(
      //   `computer running slow, fps ${performance.fps}, draw divisor=${performance.drawDivisor}`
      // );
    }
    if (performance.fps > 80) drawGrid();
    if (performance.fps > 120) {
      // console.log(`computer running fast, fps ${performance.fps}`);

      drawGrid();
      if (performance.drawDivisor > 1) performance.drawDivisor -= 1;
    }
    if (performance.fps > 150) drawGrid();
    // } else if (performance.drawsPerSecond == 30) {
    //     performance.drawsPerSecond = 20
    // } else if (performance.drawsPerSecond == 20) {
    //     performance.drawsPerSecond = -1
    //     console.log("Performance of device is too low for accurate play.")
    // }
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
  let timeString = `${minutesString}:${secondsString}`;

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
  if (debug.show == 1) {
    win.statDisplay.innerHTML = `fps: ${performance.fps} | Level: ${game.level} | Time: ${timeString} |
        Speed/Clear/Stall ${game.boardRiseSpeed}/${game.blockClearTime}/${game.blockStallTime}`;
  }
  if (debug.show == 0) {
    win.statDisplay.innerHTML = ``;
    win.levelDisplay.innerHTML = `${game.level}`;
    win.timeDisplay.innerHTML = timeString;
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
    win.fpsDisplay.innerHTML = `${performance.fps} fps`;
    win.mainInfoDisplay.innerHTML = `${game.message}`;
    if (game.messageChangeDelay > 0) {
      game.messageChangeDelay -= 1 * performance.gameSpeed;
    }
    if (game.messageChangeDelay <= 0 && frames < 6600) {
      game.message = game.defaultMessage;
    }
  }

  if (game.currentChain > 0) {
    win.chainDisplay.innerHTML = `${game.currentChain}x chain!`;
    win.chainDisplay.style.color = "red";
  } else {
    win.chainDisplay.innerHTML = `Largest Chain: ${game.largestChain} | Total Blocks Cleared: ${game.totalClears}`;
    win.chainDisplay.style.color = "blue";
  }

  win.highScoreDisplay.innerHTML = `High Score: ${game.highScore}`;
  requestAnimationFrame(gameLoop);
}

// game.board = generateOpeningBoard()
// setTimeout(gameLoop(),1000/60)
