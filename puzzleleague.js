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
} from "./scripts/functions/startGame";
import { trySwappingBlocks } from "./scripts/functions/swapBlock";
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
  padInteger,
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
} from "./scripts/global.js";
import { updateMousePosition } from "./scripts/clickControls";
import {
  TouchOrder,
  TouchOrders,
  match,
  SelectedBlock,
} from "./scripts/functions/stickyFunctions";
import { updateGrid } from "./scripts/functions/updateGrid";
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
    switchToFaceFrame = 0,
    switchToPoppedFrame = 0,
    airborne = false,
    touched = false,
    availForPrimaryChain = false,
    availForSecondaryChain = false,
    swapDirection = 0,
    lightTimer = 0,
    swapOrders = JSON.parse(JSON.stringify(TouchOrder))
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
    this.availForPrimaryChain = availForPrimaryChain; // When disappear, chain ends
    this.availForSecondaryChain = availForSecondaryChain;
    this.swapDirection = swapDirection;
    this.lightTimer = lightTimer;
    this.swapOrders = swapOrders;
  }

  drawGridLines() {
    let filename = "grid_line";
    if (this.y === 0) filename = "grid_line_red";
    else if (this.lightTimer > 0) {
      // filename = "light_up";
      if (this.x === match[0][0] && this.y === match[0][1])
        filename = "light_up";
      if (this.x === match[1][0] && this.y === match[1][1])
        filename = "light_up";
      if (this.x === match[2][0] && this.y === match[2][1])
        filename = "light_up";
    }
    win.ctx.drawImage(
      loadedSprites[filename],
      grid.SQ * this.x,
      grid.SQ * this.y - game.rise
    );
  }
  // drawGridLines() {
  //   let filename = "grid_line";
  //   if (this.y === 0) filename = "grid_line_red";
  //   if (this.x === TouchOrders[0].KeySquare.First.x && this.y === TouchOrders[0].KeySquare.First.y)
  //     filename = "light_up";
  //   if (this.x === TouchOrders[0].KeySquare.Second.x && this.y === TouchOrders[0].KeySquare.Second.y)
  //     filename = "light_up";
  //   if (this.x === TouchOrders[0].KeySquare.Third.x && this.y === TouchOrders[0].KeySquare.Third.y)
  //     filename = "light_up";

  //   win.ctx.drawImage(
  //     loadedSprites[filename],
  //     grid.SQ * this.x,
  //     grid.SQ * this.y - game.rise
  //   );
  // }

  drawSwappingBlocks() {
    let xOffset = (grid.SQ * (this.timer - 1)) / 4;
    win.ctx.drawImage(
      loadedSprites[`${this.color}_normal`],
      grid.SQ * this.x + xOffset * this.swapDirection,
      grid.SQ * this.y - game.rise
    );
  }

  drawArrows() {
    if (touch.target.x === -1 || touch.target.y === -1) {
      [touch.target.x, touch.target.y] = [game.cursor.x, game.cursor.y];
      touch.arrowList.length = 0;
      return;
    }
    let fileName = "";
    let move = touch.moveType;
    let coordinates = `${this.x},${this.y}`;
    if (touch.moveOrderExists) {
      let dir = touch.target.x < touch.mouseStart.x ? "Left" : "Right";
      if (touch.arrowList[0] === coordinates)
        fileName = `arrow${dir}${move}Start`;
      else if (touch.arrowList[touch.arrowList.length - 1] === coordinates)
        fileName = `arrow${dir}${move}End`;
      else if (touch.arrowList.includes(coordinates))
        fileName = `arrowMid${move}`;
      if (fileName) {
        {
          win.ctx.drawImage(
            loadedSprites[fileName],
            grid.SQ * this.x,
            grid.SQ * this.y - game.rise
          );
        }
      }
    } else touch.arrowList.length = 0;
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

    if (this.airborne) {
      win.ctx.drawImage(
        loadedSprites["debugRed"],
        grid.SQ * this.x,
        grid.SQ * this.y - game.rise
      );
    }

    if (game.cursor_type !== "defaultCursor") {
      if (
        this.x === touch.target.x &&
        this.y === touch.target.y &&
        touch.moveOrderExists
      ) {
        win.ctx.drawImage(
          loadedSprites["debugRed"],
          grid.SQ * this.x,
          grid.SQ * this.y - game.rise
        );
      }

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
        this.x === TouchOrders[0].KeySquare.Highest.x &&
        this.y === TouchOrders[0].KeySquare.Highest.y
      ) {
        win.ctx.drawImage(
          loadedSprites["debugGreen"],
          grid.SQ * this.x,
          grid.SQ * this.y - game.rise
        );
      }

      if (
        game.currentChain > 0 &&
        this.x === TouchOrders[0].KeySquare.Lowest.x &&
        this.y === TouchOrders[0].KeySquare.Lowest.y
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
    if (cpu.matchList.includes([this.x, this.y].join())) {
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
          (game.frames % 4 >= 0 && game.frames % 4 < 2) ||
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

export function newBlock(c, r) {
  let block = new Block(c, r);
  return block;
}

export function drawGrid() {
  let blocksAreSwapping = false; // to be placed on top of drawn grid
  for (let x = 0; x < grid.COLS; x++) {
    for (let y = 0; y < grid.ROWS + 1; y++) {
      let Square = game.board[x][y];
      Square.draw();
      if (Square.swapDirection) blocksAreSwapping = true;

      if (game.cursor_type !== "defaultCursor") {
        Square.drawGridLines();
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

  if (debug.show || cpu.showInfo) {
    for (let x = grid.COLS - 1; x >= 0; x--) {
      for (let y = 0; y < grid.ROWS + 1; y++) {
        let Square = game.board[x][y];
        if (cpu.showInfo) Square.drawAILogic();
        if (debug.show) Square.drawDebugDots();
      }
    }
  }

  if (game.cursor_type !== "defaultCursor") {
    try {
      for (let x = 0; x < grid.COLS; x++) {
        for (let y = 0; y < grid.ROWS + 1; y++) {
          let Square = game.board[x][y];
          if (game.cursor_type !== "defaultCursor") {
            if (blockVacOrClearing(game.board[game.cursor.x][game.cursor.y]))
              touch.moveOrderExists = false;
            if (!touch.moveOrderExists && touch.arrowList.length)
              touch.arrowList = [];
            Square.drawArrows();
          }
        }
      }
    } catch (error) {
      0 === 0;
    }
  }

  if (!game.over) {
    if (game.cursor_type !== "defaultCursor") {
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

export function createNewRow() {
  if (game.pauseStack || game.highestRow < 1) {
    return false;
  }

  if (game.boardRiseDisabled || debug.freeze == 1) {
    return false;
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
      transferProperties(game.board[c][r], game.board[c][r - 1], "to");
      // game.board[c][r - 1].color = game.board[c][r].color;
    }
    game.board[c][11].color = game.board[c][12].color;
    game.board[c][12].color = game.board[c][13].color;
    game.board[c][13].color = PIECES[randInt(PIECES.length)];
  }
  fixNextDarkStack();

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
  }

  return true;
}

// function checkBoardStates(c, r) {
//   if (game.board[c][r])
// }

export function checkTime() {
  win.muteMusic.checked && game.frames > 60
    ? (game.Music.volume = 0)
    : (game.Music.volume = 0.2);
  switch (game.frames) {
    case -180:
      game.Music.pause();
      if (win.restartGame) {
        game.frames = -62;
        break;
      }
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
    case -74:
      if (game.mode !== "training") break;
      game.messagePriority = "Training Stage...";
      if (!win.muteAnnouncer.checked)
        playAudio(audio.announcerTrainingStage, 0.2, true);
      break;
    case -60:
      if (game.mode === "training") break;
      game.Music.volume = 0;
      if (win.restartGame) {
        document
          .getElementById("home-page")
          .scrollIntoView({ behavior: "smooth", block: "end" });
        if (!win.muteAnnouncer.checked) {
          playAudio(audio.announcerReady, 0.2, true);
          game.messagePriority = "Ready...";
        }
      } else {
        if (!win.muteAnnouncer.checked) playAudio(audio.announcer1, 0.2, true);
        game.messagePriority = "1...";
      }

      win.restartGame = false;
      break;
    case 0:
      game.messagePriority = "Go!";
      if (!win.muteAnnouncer.checked) playAudio(audio.announcerGo, 0.1, true);

      break;
    case 60:
      if (!debug.enabled)
        playMusic(music[randInt(music.length, true, lastIndex.music, "music")]);
      game.messagePriority = "";
      game.defaultMessage = "X to swap Z to lift the stack!";
      game.message = game.defaultMessage;

      break;
    case 6600:
      if (game.mode === "training") break;
      game.messagePriority = "10 seconds before overtime!";
      playAnnouncer(
        announcer.hurryUpDialogue,
        announcer.hurryUpIndexLastPicked,
        "hurryUp"
      );
      break;
    case 6700:
      if (game.mode === "training") break;
      game.messagePriority = "";
      break;
    case 6900:
      if (game.mode === "training") break;
      game.messagePriority = "5 seconds before overtime...";
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer5, 0.2, true);
      break;
    case 6960:
      if (game.mode === "training") break;
      game.messagePriority = "4 seconds before overtime...";
      game.defaultMessage = game.message;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer4, 0.2, true);
      break;
    case 7020:
      if (game.mode === "training") break;
      game.messagePriority = "3 seconds before overtime...";
      game.defaultMessage = game.message;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer3, 0.2, true);
      break;
    case 7080:
      if (game.mode === "training") break;
      game.messagePriority = "2 seconds before overtime...";
      game.defaultMessage = game.message;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer2, 0.2, true);
      break;
    case 7140:
      if (game.mode === "training") break;
      game.messagePriority = "1 second before overtime...";
      game.defaultMessage = game.message;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer1, 0.2, true);
      break;
    case 7200:
      if (game.mode === "training") break;
      game.messagePriority = "Overtime, I hope you're ready...";
      game.defaultMessage = game.message;
      playAnnouncer(
        announcer.overtimeDialogue,
        announcer.overtimeIndexLastPicked,
        "overtime"
      );
      break;
    case 7320:
      if (game.mode === "training") break;
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
  }
  if (document.getElementById("arcade-button")) {
    if ((event.keyCode == 32 || event.keyCode == 13) && win.patchNotesShown) {
      // space or enter

      document.getElementById("arcade-button").remove();
      document.getElementById("training-mode").remove();
      document.getElementById("watch-ai-play-button").remove();
      game.mode = "arcade";
      startGame(1);
    } else if (event.keyCode === 84 && win.patchNotesShown) {
      // t
      document.getElementById("arcade-button").remove();
      document.getElementById("training-mode").remove();
      document.getElementById("watch-ai-play-button").remove();
      game.mode = "training";
      startGame(1);
    } else if (event.keyCode === 66 && win.patchNotesShown) {
      // b
      document.getElementById("arcade-button").remove();
      document.getElementById("training-mode").remove();
      document.getElementById("watch-ai-play-button").remove();
      game.mode = "cpu-play";
      startGame(1);
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
    if (event.keyCode === 70 && debug.enabled) if (!game.paused) pause();
  }
  if (game.paused) {
    if (event.keyCode === 70 && debug.enabled) {
      // f
      debug.advanceOneFrame = true;
      unpause();
    }
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
      // console.log(state.Home.view);
      // console.log(router);
      render(state.Home);
      // router.navigate("/Home");
    }
  }
  // Game Controls
  if (win.running && !game.over) {
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
      if (event.keyCode == 77 || event.keycode === 187) {
        //m
        if (0 === 0 || game.level + 1 < preset.speedValues.length) {
          game.level++;
          updateLevelEvents(game.level);
          if (game.level === 7) {
            playMusic(overtimeMusic[randInt(overtimeMusic.length)]);
          }
        }
      } else if (event.keyCode == 78 || event.keycode === 189) {
        //n
        if (game.level - 1 > -1) {
          game.level--;
          updateLevelEvents(game.level);
          if (game.level === 6) {
            playMusic(
              music[randInt(music.length, true, lastIndex.music, "music")]
            );
          }
        }
      }

      if (debug.enabled == 1) {
        if (event.keyCode === 188)
          // ,

          console.log(touch, TouchOrders[0].KeySquare, match, objectOfAudios);
        if (event.keyCode === 89) {
          // y
          console.log(game, debug);
          game.seconds = pastSeconds;
          game.cursor.x = debug.pastGameState.cursor.x;
          game.cursor.y = debug.pastGameState.cursor.y;
          game.cursor_type = debug.pastGameState.cursor_type;
          game.rise = debug.pastGameState.rise;
          for (let x = 0; x < grid.COLS; x++) {
            for (let y = 0; y < grid.ROWS + 2; y++) {
              Object.keys(game.board[x][y]).forEach(
                (key) =>
                  (game.board[x][y][key] = debug.pastGameState.board[x][y][key])
              );
            }
          }
        } else if (event.keyCode == 79) {
          // o
          console.log("Show debug info number:", debug.show);
          debug.show = (debug.show + 1) % 2;
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

          // Debug codes
        } else if (event.keyCode == 67 && debug.freeze == 1) {
          // c
          updateGrid(true);
        }
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
  if (game.level > preset.speedValues.length - 1) {
    game.level--;
    return;
  }
  if (game.level < 0) {
    game.level++;
    return;
  }
  if (level > 10) {
    game.boardRiseSpeed = 10 - level;
    level = 10;
  } else game.boardRiseSpeed = preset.speedValues[level];
  game.scoreMultiplier = preset.scoreMultValues[level];
  game.blockClearTime = preset.clearValues[level];
  game.blockBlinkTime = preset.blinkValues[level];
  game.blockInitialFaceTime = preset.faceValues[level];
  game.blockStallTime = preset.stallValues[level];
  game.blockPopMultiplier = preset.popMultiplier[level];
  game.panicIndex =
    game.level < 4 ? 1 : game.level < 7 ? 2 : game.level < 10 ? 3 : 5;
}

// GAME HERE
let cnt;
let pastSeconds = 0;
export function gameLoop() {
  cnt++;
  if (win.running && !game.paused && !debug.show) {
    document.getElementById("header").style.display = "none";
    document.getElementById("nav-bar").style.display = "none";
    document.getElementById("footer").style.display = "none";
    document.getElementById("pause-button").style.display = "block";
  } else {
    document.getElementById("header").style.display = "block";
    document.getElementById("nav-bar").style.display = "flex";
    document.getElementById("footer").style.display = "block";
    // if (document.getElementById("pause-button"))
    //   document.getElementById("pause-button").style.display = "none";
  }
  if (!win.running || win.view !== "Home") {
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
      win.audioLoaded = checkIfAudioLoaded(essentialLoadedAudios);
      win.mainInfoDisplay.innerHTML = `Loading -- ${audioLoadedPercentage}%`;
      if (win.audioLoaded) {
        console.log(
          `Essential audio loaded, time since game start is ${runtime} ms`
        );
        win.audioLoaded = "essential";
      }
    }

    if (win.audioLoaded === "essential") {
      if (checkIfAudioLoaded(loadedAudios)) {
        win.audioLoaded = "complete";
        console.log(`All audio loaded, time since game start is ${runtime} ms`);
      }
    }

    if (game.paused) {
      playerAction(action);
      if (debug.enabled)
        win.mainInfoDisplay.innerHTML = `Pause -- Frame ${game.frames}`;
    }

    // Big Game Loop
    if (!game.paused && win.audioLoaded) {
      game.frames += 1 * perf.gameSpeed;
      game.boardRiseRestarter += 1 * perf.gameSpeed; // Failsafe to restart stack rise
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
          )
            win.running = false;
        }
      }

      checkTime();

      if (game.frames > 0 && game.frames % 60 == 0 && !game.over) {
        game.seconds++;
        if (debug.enabled && game.seconds % 5 === 1) {
          pastSeconds = game.seconds;
        }

        if (game.Music.currentTime >= game.Music.duration) {
          playMusic(
            music[randInt(music.length, true, lastIndex.music, "music")]
          );
          console.log("Track ended, now playing", game.Music.src);
        }

        cnt = 0; // game loop counter
        if (game.mode !== "training") {
          game.defaultMessage = `Level ${game.level} | 0:${padInteger(
            20 - (game.seconds % 20),
            2
          )} remaining`;
        }
        // overtime bonuses
        if (!cpu.enabled && game.minutes == 3) {
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
          console.log("Game Log Size:", game.log.length);
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
        game.frames % 1200 == 0 &&
        game.mode !== "training" &&
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
          if (game.frames !== 7200 && game.frames !== 10800)
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
            }, avg loops per sec: ${cnt}`
          );
        }

        if (game.level + 1 < preset.speedValues.length && game.frames > 0) {
          game.level++;
          if (game.level === 7) {
            playMusic(overtimeMusic[randInt(overtimeMusic.length)]);
          }
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

      if (!game.boardRiseSpeed)
        game.boardRiseSpeed = preset.speedValues[game.level];

      if (game.frames % game.boardRiseSpeed == 0) {
        if (game.boardRiseRestarter >= 300) {
          game.boardRiseRestarter = 0;
          console.log(game.frames, "board rise timeout, restarting it");
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
          createNewRow();
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
          game.swapPressed = false;
          trySwappingBlocks(game.cursor.x, game.cursor.y);
        } else {
          // for (let order in touch.moveOrderList) {
          //   let [c, r] = [order[0], order[1]];
          //   if (game.board[c][r].x < game.board[c][r].target.x) {
          //     trySwappingBlocks(c, r);
          //   } else if (game.board[c][r].x > game.board[c][r].target.x) {
          //     trySwappingBlocks(c - 1, r);
          //   } else {
          //     game.board[c][r].swapOrders.active = false;
          //   }
          // }
          // game.swapPressed = false;
          if (touch.selectedBlock.x < touch.target.x) {
            trySwappingBlocks(touch.selectedBlock.x, touch.selectedBlock.y);
          } else if (touch.selectedBlock.x > touch.target.x) {
            trySwappingBlocks(touch.selectedBlock.x - 1, touch.selectedBlock.y);
          } else {
            game.swapPressed = false;
            touch.moveOrderExists = false; // block has reached target
            // if (debug.enabled)
            //   console.log("frame", game.frames, "target reached.");
          }
        }
      }

      if (game.frames > 0 && game.frames % 60 == 0 && !game.over) {
        perf.diffFromRealTime = Math.abs(
          perf.realTime - perf.sumOfPauseTimes - game.frames / 60
        );
        if (perf.diffFromRealTime >= 15 && game.mode !== "cpu-play") {
          leaderboard.canPost = false;
          leaderboard.reason = "slow";
          perf.unrankedReason = `leaderboard posting disabled, behind real clock by
          ${perf.diffFromRealTime.toFixed(1)} seconds`;
          win.fpsDisplay.style.color = "black";
        }
        //  else if (perf.diffFromRealTime >= 3) {
        //   perf.unrankedReason = `warning, game is running slowly, behind real clock by
        //   ${perf.diffFromRealTime.toFixed(1)} seconds`;
        //   win.fpsDisplay.style.color = "black";
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
          game.seconds} sec<br />Real Time: ${perf.realTime.toFixed(1)} sec`;
        win.levelDisplay.innerHTML = `[${game.cursor.x}, ${game.cursor.y}]<br>
        Score Multiplier: ${game.scoreMultiplier}<br>
        Highest Row: ${game.highestRow}`;
      } else {
        win.timeDisplay.innerHTML = game.timeString;
        win.levelDisplay.innerHTML = `${game.level}`;
      }
      win.scoreDisplay.innerHTML = scoreString;
      win.multiplierDisplay.innerHTML = `${game.scoreMultiplier.toFixed(2)}x`;

      if (debug.advanceOneFrame) {
        win.fpsDisplay.innerHTML = "";
      } else
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
