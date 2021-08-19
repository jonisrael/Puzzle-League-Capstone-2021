/* Puzzle League/Tetris Attack Clone by Jonathan Israel!
    For more information on the game, check out https://tetris.fandom.com/wiki/Tetris_Attack.
    The game is most known as Pokemon Puzzle League, which was released 2000 on Nintendo 64),
    but it is actually a clone of Panel De Pon, a Super Nintendo Entertainment system
    game released in Japan in 1995.  There is another clone globally released in 1995 called Tetris
    Attack (It featured Yoshi!), but the game is really nothing like Tetris other than a grid.
*/
import { sprite, audio } from "./scripts/fileImports";

import {
  announcer,
  blockColor,
  blockType,
  PIECES,
  INTERACTIVE_PIECES,
  app,
  grid,
  game,
  preset,
  api,
  chainLogic,
  performance,
  debug
} from "./scripts/global.js";

let statDisplay = document.getElementById("all-stats");
let scoreDisplay = document.querySelector("#score");
let chainDisplay = document.querySelector("#chain");
let timeDisplay = document.querySelector("#time");
let levelDisplay = document.querySelector("#game.level");
let highScoreDisplay = document.querySelector("#high-score");
// console.log(highScoreDisplay);

// fetching our api.data from an API

fetch("https://worldtimeapi.org/api/ip")
  // parsing our response into JSON format
  .then(response => response.json())
  // "using" the formatted response in our script
  .then(json => api.dateTimeAPI.push(json));
console.log(api.dateTimeAPI);
if (localStorage.getItem("highScore") === null) {
  localStorage.setItem("highScore", "1000");
}

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
      app.ctx.drawImage(CURSOR_IMAGE, pixelX, pixelY);
    };
  }
}
let cursor = new Cursor(2, 6);

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
      if ((game.frames % 4 >= 0 && game.frames % 4 < 2) || game.pause == 1) {
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
      app.ctx.drawImage(
        BLOCK_IMAGE,
        grid.SQ * this.x,
        grid.SQ * this.y - game.rise
      );
    };

    //Debug Visuals
    if (debug.enabled == 1) {
      if (this.availableForPrimaryChain && this.availableForSecondaryChain) {
        DEBUGB_IMAGE.src = sprite.debugBrown;
        DEBUGB_IMAGE.onload = () => {
          app.ctx.drawImage(
            DEBUGB_IMAGE,
            grid.SQ * this.x,
            grid.SQ * this.y - game.rise
          );
        };
      } else if (this.availableForPrimaryChain) {
        DEBUGO_IMAGE.src = sprite.debugOrange;
        DEBUGO_IMAGE.onload = () => {
          app.ctx.drawImage(
            DEBUGO_IMAGE,
            grid.SQ * this.x,
            grid.SQ * this.y - game.rise
          );
        };
      } else if (this.availableForSecondaryChain) {
        DEBUGP_IMAGE.src = sprite.debugPink;
        DEBUGP_IMAGE.onload = () => {
          app.ctx.drawImage(
            DEBUGP_IMAGE,
            grid.SQ * this.x,
            grid.SQ * this.y - game.rise
          );
        };
      } else if (this.timer > 0 && this.type == blockType.NORMAL) {
        DEBUGW_IMAGE.src = sprite.debugWhite;
        DEBUGW_IMAGE.onload = () => {
          app.ctx.drawImage(
            DEBUGW_IMAGE,
            grid.SQ * this.x,
            grid.SQ * this.y - game.rise
          );
        };
      }
    }
  }
}

function randInt(max) {
  return Math.floor(Math.random() * max);
}

function playChainSFX(currentChain) {
  let Sound = new Audio();
  if (currentChain == 1) {
    return;
  }
  if (currentChain < 9) {
    Sound.src = audio[`chain${currentChain}`];
  } else {
    Sound.src = audio.chain9;
  }
  Sound.volume = 0.05;
  Sound.play();
}

function timeSinceGameStarted(gameStart) {
  return Math.floor((Date.now() - gameStart) / 1000);
}

function extractTimeToIndex() {
  if (api.dateTimeAPI.length == 0) {
    return console.log("JSON not fetched yet");
  }
  let index = 0;
  let time = api.dateTimeAPI[0].datetime;
  let hour;
  let minute;
  console.log(time);
  let hourStr = `${time[11]}${time[12]}}`;
  if (hourStr[0] === "0") {
    hour = parseInt(hourStr[1]); // if first char is "0", only parse 2nd char
  } else {
    hour = parseInt(hourStr);
  }
  let minStr = `${time[14]}${[time[15]]}`;
  if (minStr[0] === "0") {
    minute = parseInt(minStr[1]); // if first char is "0", only parse 2nd char
  } else {
    minute = parseInt(minStr);
  }

  index = hour * 60 + minute;
  console.log(hour, minute, index);
  return index;
}

function playAudio(file, volume = 0.1) {
  let Sound = new Audio();
  try {
    Sound.volume = volume;
    Sound.pause = true;
    Sound.currentTime = 0;
    Sound.src = file;
    Sound.play();
  } catch (error) {
    console.log(`Audio play failed. File: ${file}`);
  }
}

function playMusic(file, volume = 0.1, mute = 0) {
  game.Music.pause = true;
  game.Music.src = file;
  game.Music.play();
  game.Music.loop = true;
  game.Music.playbackRate = 1.0;
  game.Music.volume = volume;
  if (mute == 1) {
    game.Music.volume = 0;
  } else {
    game.Music.volume = 0.1;
  }
  mute = (mute + 1) % 2;
}

function fixNextDarkStack() {
  let aboveAdjacent = true;
  let leftRightAdjacent = true;
  let tempPIECES = PIECES.slice();
  while (aboveAdjacent || leftRightAdjacent) {
    aboveAdjacent = leftRightAdjacent = false;
    for (let c = 0; c < grid.COLS; c++) {
      tempPIECES = PIECES.slice();
      tempPIECES.splice(tempPIECES.indexOf(game.board[c][12].color), 1);
      if (game.board[c][13].color == game.board[c][12].color) {
        aboveAdjacent = true;
      }
      if (c == 0) {
        if (game.board[c][13].color == game.board[c + 1][13].color) {
          leftRightAdjacent = true;
        }
      } else if (c > 0 && c < 5) {
        if (
          game.board[c - 1][13].color == game.board[c][13].color &&
          game.board[c][13].color == game.board[c + 1][13].color
        ) {
          leftRightAdjacent = true;
        }
      } else if (c == 5) {
        if (game.board[c - 1][13].color == game.board[c][13].color) {
          leftRightAdjacent = true;
        }
      }

      if (aboveAdjacent || leftRightAdjacent) {
        game.board[c][13].color = PIECES[randInt(PIECES.length)];
      }
    }
  }
}

function makeOpeningBoard(index) {
  console.log(`Board Index Selected: ${index}`);
  game.mute = 0;
  game.Music.currentTime = 0;
  game.Music.volume = 0.2;
  game.Music.play();
  cursor.x = 2;
  cursor.y = 6;
  game.disableRaise = false;
  game.level = 1;
  game.boardRiseSpeed = preset.speedValues[game.level];
  game.blockClearTime = preset.clearValues[game.level];
  game.blockStallTime = preset.stallValues[game.level];
  game.frames = game.minutes = game.seconds = 0;
  game.score = 0;
  game.pause = 0;
  game.over = false;
  game.board = [];
  for (let c = 0; c < grid.COLS; c++) {
    game.board.push([]);
    for (let r = 0; r < grid.ROWS + 2; r++) {
      let block = new Block(
        c,
        r,
        DATABASE[index][c][r].color,
        DATABASE[index][c][r].type
      );
      game.board[c].push(block);
      block.draw();
    }
  }
  return game.board;
}

function generateOpeningBoard() {
  cursor.x = 2;
  cursor.y = 6;

  game.mute = 0;
  game.Music.currentTime = 0;
  game.Music.volume = 0.2;
  game.Music.play();
  game.board = [];
  game.disableRaise = false;
  game.level = 1;
  game.frames = game.minutes = game.seconds = 0;
  game.score = 0;
  game.pause = 0;
  game.over = false;
  for (let c = 0; c < grid.COLS; c++) {
    game.board.push([]);
    for (let r = 0; r < grid.ROWS + 2; r++) {
      let block = new Block(c, r, blockColor.VACANT, blockType.NORMAL, 0);
      game.board[c].push(block);
      if (r > 11) {
        game.board[c][r].color = PIECES[randInt(PIECES.length)];
        game.board[c][r].type = blockType.DARK;
      }
      block.draw();
    }
  }

  for (let i = 0; i < 30; i++) {
    // Generate 30 random blocks on bottom 6 grid.ROWS.
    while (true) {
      let x = randInt(grid.COLS);
      let y = randInt(grid.ROWS / 2) + 6;
      if (game.board[x][y].color == blockColor.VACANT) {
        game.board[x][y].color = PIECES[randInt(PIECES.length)];
        break;
      }
    }
  }

  for (let c = 0; c < grid.COLS; c++) {
    // Drop all blocks to bottom
    let currentBlocks = []; // Temporary
    for (let r = grid.ROWS - 1; r >= 0; r--) {
      if (game.board[c][r].color != blockColor.VACANT) {
        currentBlocks.unshift(game.board[c][r].color);
      }
    }
    while (currentBlocks.length < 12) {
      currentBlocks.unshift(blockColor.VACANT);
    }

    for (let r = 0; r < currentBlocks.length; r++) {
      game.board[c][r].color = currentBlocks[r];
    }
  }

  for (let x = 0; x < grid.COLS; x++) {
    // Correct Duplicates so blocks of same color cannot be adjacent
    for (let y = 0; y < grid.ROWS; y++) {
      if (game.board[x][y].color != blockColor.VACANT) {
        let topBlock = blockColor.VACANT;
        let rightBlock = blockColor.VACANT;
        let bottomBlock = blockColor.VACANT;
        let leftBlock = blockColor.VACANT;
        if (y != 0) {
          topBlock = game.board[x][y - 1].color;
        }
        if (x != 5) {
          rightBlock = game.board[x + 1][y].color;
        }
        if (y != 11) {
          bottomBlock = game.board[x][y + 1].color;
        }
        if (x != 0) {
          leftBlock = game.board[x - 1][y].color;
        }

        while (true) {
          if (
            game.board[x][y].color != topBlock &&
            game.board[x][y].color != rightBlock &&
            game.board[x][y].color != bottomBlock &&
            game.board[x][y].color != leftBlock
          ) {
            break;
          }
          game.board[x][y].color = PIECES[randInt(PIECES.length)];
        }
      }
      game.board[x][y].draw();
    }
  }

  for (let x = 0; x < grid.COLS; x++) {
    // Initial Dark Stacks
    game.board[x][12].color = PIECES[randInt(PIECES.length)];
    game.board[x][13].color = PIECES[randInt(PIECES.length)];
    if (x > 0) {
      while (game.board[x][12].color == game.board[x - 1][12].color) {
        game.board[x][12].color = PIECES[randInt(PIECES.length)];
      }
      while (game.board[x][13].color == game.board[x - 1][13].color) {
        game.board[x][13].color = PIECES[randInt(PIECES.length)];
      }
    }
  }
  fixNextDarkStack();
  return game.board;
}

function updateGrid(debugFrameAdvance = false) {
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

      if (!debugFrameAdvance) {
        if (game.board[x][y].timer > 0 && game.pause == 0) {
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

function swapProperties(FirstBlock, SecondBlock) {
  // Transfer everything except x and y coordinates
  let tempProperties = [
    FirstBlock.color,
    FirstBlock.type,
    FirstBlock.timer,
    FirstBlock.touched,
    FirstBlock.availableForPrimaryChain,
    FirstBlock.availableForSecondaryChain
  ];
  FirstBlock.color = SecondBlock.color;
  SecondBlock.color = tempProperties[0];
  FirstBlock.type = SecondBlock.type;
  SecondBlock.type = tempProperties[1];
  FirstBlock.timer = SecondBlock.timer;
  SecondBlock.timer = tempProperties[2];
  FirstBlock.touched = SecondBlock.touched;
  SecondBlock.touched = tempProperties[3];
  FirstBlock.availableForPrimaryChain = SecondBlock.availableForPrimaryChain;
  SecondBlock.availableForPrimaryChain = tempProperties[4];
  FirstBlock.availableForSecondaryChain =
    SecondBlock.availableForSecondaryChain;
  SecondBlock.availableForPrimaryChain = tempProperties[5];
}

function drawGrid() {
  for (let x = 0; x < grid.COLS; x++) {
    for (let y = 0; y < grid.ROWS + 1; y++) {
      game.board[x][y].draw();
    }
  }
  if (!game.over) {
    cursor.draw();
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
    playAudio(audio.fanfare4);
    playAudio(audio.announcerUnbelievable);
  } else if (game.currentChain >= 6) {
    playAudio(audio.fanfare3);
    playAudio(
      announcer.highChainDialogue[
        game.frames % announcer.highChainDialogue.length
      ]
    );
  } else if (game.currentChain >= 4) {
    playAudio(audio.fanfare2);
    playAudio(
      announcer.mediumChainDialogue[
        game.frames % announcer.mediumChainDialogue.length
      ]
    );
  } else if (game.currentChain >= 2) {
    playAudio(audio.fanfare1);
    playAudio(
      announcer.smallChainDialogue[
        game.frames % announcer.smallChainDialogue.length
      ]
    );
  }
  if (game.currentChain > 1) console.log(`${game.currentChain} chain!`);
  if (game.currentChain > game.highestChain)
    game.highestChain = game.currentChain;
  game.currentChain = 0;
  game.combo = 0;
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

function trySwappingBlocks() {
  let x = cursor.x; // This locks in x where the swap was initiated
  let y = cursor.y; // This locks in y where the swap was initiated
  if (game.disableSwap) {
    return;
  }

  let swap = true;

  // Make sure both blocks aren't blockColor.VACANT
  if (
    game.board[x][y].color == blockColor.VACANT &&
    game.board[x + 1][y].color == blockColor.VACANT
  ) {
    swap = false;
  }

  // Check if blocks are clearing
  if (
    !INTERACTIVE_PIECES.includes(game.board[x][y].type) ||
    !INTERACTIVE_PIECES.includes(game.board[x + 1][y].type)
  ) {
    swap = false;
  }

  // Do not swap if ANY block below is falling
  if (y < 11) {
    if (
      INTERACTIVE_PIECES.includes(game.board[x][y].type) &&
      game.board[x][y].color != blockColor.VACANT
    ) {
      for (let j = y; j < grid.ROWS; j++) {
        if (game.board[x][j].color == blockColor.VACANT) {
          swap = false;
          break;
        }
      }
    }
    if (
      INTERACTIVE_PIECES.includes(game.board[x + 1][y].type) &&
      game.board[x + 1][y].color != blockColor.VACANT
    ) {
      for (let j = y; j < grid.ROWS; j++) {
        if (game.board[x + 1][j].color == blockColor.VACANT) {
          swap = false;
          break;
        }
      }
    }
  }
  // Do not swap if a falling block is less than two units ABOVE the cursor
  if (y > 0) {
    if (
      INTERACTIVE_PIECES.includes(game.board[x][y - 1].type) &&
      game.board[x][y - 1].color != blockColor.VACANT &&
      game.board[x][y].color == blockColor.VACANT
    ) {
      swap = false;
    } else if (
      INTERACTIVE_PIECES.includes(game.board[x + 1][y - 1].type) &&
      game.board[x + 1][y - 1].color != blockColor.VACANT &&
      game.board[x + 1][y].color == blockColor.VACANT
    ) {
      swap = false;
    }
  }

  // WILL WORK ON THIS LATER
  // Do not swap if a falling block is less than two units BELOW the cursor (rare)
  // if (y > 0) {
  //     if (INTERACTIVE_PIECES.includes(game.board[x][y].type) &&
  //         game.board[x+1][y].color == blockColor.VACANT &&
  //         game.board[x+1][y+1].color != blockColor.VACANT &&
  //         game.board[x+1][y+1].timer>0) {swap = false; console.log("right here!") }
  //     else if (INTERACTIVE_PIECES.includes(game.board[x+1][y].type) &&
  //         game.board[x][y].color == blockColor.VACANT &&
  //         game.board[x][y+1].color != blockColor.VACANT &&
  //         game.board[x][y+1].timer>0) {swap = false; console.log("right here!") }
  // }

  if (swap) {
    playAudio(audio.swapSuccess);
    swapProperties(game.board[x][y], game.board[x + 1][y]);
    game.board[x][y].timer = 0;
    game.board[x + 1][y].timer = 0;
    game.board[x][y].type = blockType.NORMAL;
    game.board[x + 1][y].type = blockType.NORMAL;
    game.board[x][y].availableForPrimaryChain = false;
    game.board[x][y].availableForPrimaryChain = false;
    game.board[x + 1][y].availableForSecondaryChain = false;
    game.board[x + 1][y].availableForSecondaryChain = false;

    if (y < 11) {
      //Check to see if block is about to fall
      // Check left block after swap
      if (
        game.board[x][y].color != blockColor.VACANT &&
        game.board[x][y + 1].color == blockColor.VACANT
      ) {
        game.board[x][y].timer = game.blockStallTime; // Default 12 frames
        game.board[x][y].touched = true; // used for properly counting chains
        game.board[x][y].availableForSecondaryChain = false; // Don't allow the block to be used for chains
        game.board[x][y].availableForPrimaryChain = false;
      }
      // Check right block after swap
      if (
        game.board[x + 1][y].color != blockColor.VACANT &&
        game.board[x + 1][y + 1].color == blockColor.VACANT
      ) {
        game.board[x + 1][y].timer = game.blockStallTime; // Default 12 frames
        game.board[x + 1][y].touched = true; // used for properly counting chains
        game.board[x][y].availableForPrimaryChain = false; // Don't allow it to be used for chains
        game.board[x][y].availableForSecondaryChain = false;
      }
    }

    if (y > 0) {
      // Check to see if there are blocks above a blockColor.VACANT block
      // Check left column
      if (
        game.board[x][y].color == blockColor.VACANT &&
        game.board[x][y - 1].color != blockColor.VACANT &&
        INTERACTIVE_PIECES.includes(game.board[x][y - 1].type)
      ) {
        game.board[x][y - 1].type = blockType.NORMAL;
        game.board[x][y - 1].timer = game.blockStallTime;
        for (let i = y - 1; i >= 0; i--) {
          game.board[x][i].touched = true;
          game.board[x][y].availableForPrimaryChain = false;
          game.board[x][y].availableForSecondaryChain = false;
        }
      }
      // Check right column
      if (
        game.board[x + 1][y].color == blockColor.VACANT &&
        game.board[x + 1][y - 1].color != blockColor.VACANT &&
        INTERACTIVE_PIECES.includes(game.board[x + 1][y - 1].type)
      ) {
        game.board[x + 1][y - 1].type = blockType.NORMAL;
        game.board[x + 1][y - 1].timer = game.blockStallTime; // Default 12 frames
        for (let i = y - 1; i >= 0; i--) {
          game.board[x + 1][i].touched = true;
          game.board[x + 1][y].availableForPrimaryChain = false;
          game.board[x + 1][y].availableForSecondaryChain = false;
        }
      }
    }
  } else {
    playAudio(audio.swapFailed);
  }
}

function doGravity() {
  let falling = false;
  let possibleLandedLocations = [];
  let c;
  let r;

  for (let c = 0; c < grid.COLS; c++) {
    if (
      game.board[c][11].type == blockType.LANDING &&
      game.board[c][11].timer == 0
    ) {
      game.board[c][11].type = blockType.NORMAL;
      game.disableRaise = false;
    }

    for (let r = grid.ROWS - 1; r >= 0; r--) {
      if (
        game.board[c][r].type == blockType.LANDING &&
        game.board[c][r + 1].color == blockColor.VACANT
      ) {
        game.board[c][r].type = blockType.NORMAL;
        game.board[c][r].timer = 0;
      }

      if (
        game.board[c][r].type == blockType.LANDING &&
        game.board[c][r].timer == 0
      ) {
        game.board[c][r].type = blockType.NORMAL;
        game.board[c][r].touched = false;
        game.disableRaise = false;
      }

      if (
        game.board[c][r].color != blockColor.VACANT &&
        game.board[c][r + 1].color == blockColor.VACANT &&
        INTERACTIVE_PIECES.includes(game.board[c][r].type)
      ) {
        // fall one unit
        falling = true;
        game.disableRaise = false;
        // When a block is ready to fall
        if (game.board[c][r].timer == 0) {
          game.board[c][r + 1].color = game.board[c][r].color;
          game.board[c][r + 1].type = game.board[c][r].type;
          game.board[c][r + 1].touched = game.board[c][r].touched;
          game.board[c][r + 1].availableForSecondaryChain =
            game.board[c][r].availableForSecondaryChain;
          game.board[c][r + 1].availableForPrimaryChain =
            game.board[c][r].availableForPrimaryChain;
          game.board[c][r].color = blockColor.VACANT;
          game.board[c][r].touched = false;
          possibleLandedLocations.push([c, r + 1]);

          //Debug
          if (game.pause == 1) {
            game.board[c][r + 1].timer += 1;
          } else if (debug.enabled == 1) {
            game.board[c][r + 1].timer = 120;
          }

          // Make sure all blocks above falling block have same timer
        }
      }
    }
    for (let i = 0; i < possibleLandedLocations.length; i++) {
      let x = possibleLandedLocations[i][0];
      let y = possibleLandedLocations[i][1];
      if (
        game.board[x][y].color != blockColor.VACANT &&
        game.board[x][y + 1].color != blockColor.VACANT
      ) {
        game.board[x][y].type = blockType.LANDING;
        game.board[x][y].timer = 10;
        //DEBUG
        if (debug.enabled == 1) {
          game.board[x][y].timer = 120;
        }
      }
    }
  }

  if (!falling) {
    c = 0;
    r = 0;
    for (let c = 0; c < grid.COLS; c++) {
      for (let r = 0; r < grid.ROWS; r++) {
        game.board[c][r].touched = false;
      }
    }
  }

  return !falling;
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
    if (game.board[c][1].color != blockColor.VACANT) {
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
  return panic;
}

function legalMatch(clearLocations) {
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

function checkMatch() {
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
          playChainSFX(game.currentChain);
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
          if (game.rise == 0) {
            game.rise = 2; // Failsafe to prevent extra raise
          }
        }
      }
    } else {
      done = true; // Needs to end if confirm clear fails
    }
  }
}

function isGameOver(scoreOfThisGame) {
  for (let c = 0; c < grid.COLS; c++) {
    if (game.board[c][0].color != blockColor.VACANT) {
      game.Music.volume = 0;
      console.log("Game over!");
      console.log(`Score: ${game.score}`);
      console.log(`High Score: ${game.highScore}`);
      // enter new high scores
      let pastHighScore = localStorage.getItem("highScore");
      if (scoreOfThisGame > parseInt(pastHighScore)) {
        console.log("new high score!");
        localStorage.setItem("highScore", `${scoreOfThisGame}`);
      }
      game.highScore = parseInt(localStorage.getItem("highScore"));
      return true;
    }
  }
  return false;
}

function raiseStack() {
  if (game.disableRaise || game.pause == 1) {
    return false;
  } else if (game.raiseDelay > 0) {
    game.raiseDelay -= 1 * performance.gameSpeed;
    if (game.raiseDelay < 0) {
      game.raiseDelay = 0;
    }
    return false;
  }

  if (cursor.y > 1) {
    cursor.y -= 1;
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
          playAudio(
            announcer.panicDialogue[randInt(announcer.panicDialogue.length)]
          );
          break;
        }
      }
    }
  }

  return true;
}

function gameOverBoard() {
  // don't continue function if all pieces are already switched to blockType.DEAD type
  if (game.board[5][11].type == blockType.DEAD) {
    return;
  }
  if (game.frames == 1) {
    playAudio(audio.announcerKO, 0.2);
    game.Music.src = audio.popcornMusic;
  }
  if (game.frames == 4) {
    playAudio(audio.topout);
  }
  game.disableRaise = true;
  let deathRow = Math.floor(game.frames / 2);
  for (let i = 0; i < grid.COLS; i++) {
    if (game.board[i][deathRow].color != blockColor.VACANT) {
      game.board[i][deathRow].type = blockType.DEAD;
    }
  }
}

function updateScore(clearLocationsLength, currentChain) {
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
    highScoreDisplay.style.color = "gold";
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

function createCanvas() {
  app.makeCanvas = document.createElement(`canvas`);
  app.makeCanvas.setAttribute("id", "canvas");
  app.makeCanvas.setAttribute("width", "192");
  app.makeCanvas.setAttribute("height", "384");
  document.body.appendChild(app.makeCanvas);
  app.cvs = document.getElementById("canvas");
  app.ctx = app.cvs.getContext("2d");
  app.running = true;
  try {
    game.board = makeOpeningBoard(extractTimeToIndex());
    console.log("Fetch successful!");
  } catch (error) {
    console.log(
      `fetching api.database.json failed. Will randomly generate game.board instead`
    );
    game.board = generateOpeningBoard();
  }
  playMusic(audio.popcornMusic);
}
let count = 0;

let startButton = document.getElementById("click-to-play");
startButton.onclick = function() {
  if (!app.running) {
    startButton.remove();
    createCanvas();
    setTimeout(gameLoop(), 1000 / 60);
  }
};
// // document.addEventListener("mouseup", MOUSE_CONTROL);
// // function(MOUSE_CONTROL(event)) {
// //   if (!app.running)
// // }

document.addEventListener("keydown", KEYBOARD_CONTROL);
function KEYBOARD_CONTROL(event) {
  if (app.running) {
    if (event.keyCode == 27) {
      // escape
      app.makeCanvas = document.getElementById("canvas").remove();
      // document.getElementById("canvas-container").remove()
      app.running = false;
      app.cvs = null;
      app.ctx = null;
      // audioElements.Music.pause();
      // audioElements.Music.currentTime = 0;
    }
  } else {
    if (event.keyCode == 13) {
      // enter key
      console.log(api.dateTimeAPI);
      // createCanvas();
    } else if (event.keyCode == 191) {
      extractTimeToIndex();
    }
  }

  if (app.running & !game.over) {
    if (event.keyCode == 37) {
      if (cursor.x - 1 >= 0) {
        cursor.x -= 1;
        playAudio(audio.moveCursor);
      }
    } else if (event.keyCode == 38) {
      if (cursor.y - 1 >= 1) {
        cursor.y -= 1;
        playAudio(audio.moveCursor);
      }
    } else if (event.keyCode == 39) {
      if (cursor.x + 1 <= 4) {
        cursor.x += 1;
        playAudio(audio.moveCursor);
      }
    } else if (event.keyCode == 40) {
      if (cursor.y + 1 <= 11) {
        cursor.y += 1;
        playAudio(audio.moveCursor);
      }
    } else if (event.keyCode == 88 || event.keyCode == 83) {
      // x, s
      trySwappingBlocks(cursor.x, cursor.y);
    } else if (event.keyCode == 32 || event.keyCode == 90) {
      // space, z
      game.raisePressed = true; // run raise function on next frame
    } else if (event.keyCode == 192) {
      // tilda `~
      debug.enabled = (debug.enabled + 1) % 2;
      if (debug.enabled == 1) {
        console.log("debug ON");
        console.log(`fps: ${performance.fps}`);
        console.log(`Draw Divisor: ${performance.drawDivisor}`);
        console.log(`Time: ${game.minutes}, ${game.seconds}`);
      } else {
        console.log("debug OFF");
      }
    }
    if (debug.enabled == 1) {
      if (event.keyCode == 48) {
        // 0 (number)
        game.rise = 0;
        game.board = makeOpeningBoard(randInt(1440));
        game.disableRaise = false;
      } else if (event.keyCode == 80 || event.keyCode == 81) {
        // p, q
        game.pause = (game.pause + 1) % 2;
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
        if (game.pause == 1) {
          updateGrid((debugFrameAdvance = true));
        }
      } else if (event.keyCode == 84) {
        // t
        debug.enabled = (debug.enabled + 1) % 2;
        if (debug.enabled) {
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
  } else if (app.running && game.over) {
    if (event.keyCode >= 0 && game.frames >= 200) {
      //any key
      game.over = false;
      try {
        game.board = makeOpeningBoard();
      } catch (error) {
        console.log(
          `fetching api.database.json failed. Will randomly generate game.board instead`
        );
        game.board = generateOpeningBoard();
      }
    }
  }
}

function gameLoop(timestamp) {
  game.frames++;
  if (!app.running) {
    return;
  }
  if (game.frames == 2) {
    window.scrollTo(0, document.body.scrollHeight);
  }

  if (game.frames % 60 == 0 && !game.over) {
    game.seconds++;
  }
  if (game.seconds % 60 == 0 && game.seconds != 0) {
    game.minutes++;
    game.seconds = 0;
  }

  if (game.frames % game.boardRiseSpeed == 0) {
    if (!game.disableRaise && game.grounded && game.pause == 0) {
      if (game.raiseDelay > 0) {
        if (!checkClearing().includes(true)) {
          game.raiseDelay -= game.boardRiseSpeed * performance.gameSpeed;
        }
      } else {
        game.rise = (game.rise + 2) % 32;
      }
    }
    if (game.rise == 0 && !game.over) {
      raiseStack();
    }
  }

  if (game.frames == 6600 && !game.over) {
    playAudio(
      announcer.hurryUpDialogue[randInt(announcer.hurryUpDialogue.length)]
    );
  }
  if (
    game.frames % 1200 == 0 &&
    game.level < 10 &&
    game.level > 0 &&
    debug.enabled == 0 &&
    !game.over
  ) {
    // Speed the stack up every 30 seconds
    if (game.frames == 3600) {
      console.log(`Current Score: ${game.score}`);
      playAudio(
        announcer.timeTransitionDialogue[
          randInt(announcer.timeTransitionDialogue.length)
        ]
      );
    } else if (game.frames == 7200) {
      playAudio(
        announcer.overtimeDialogue[randInt(announcer.overtimeDialogue.length)]
      );
      playMusic(audio.overtimeMusic, 0.2);
    }

    game.level += 1;
    game.boardRiseSpeed = preset.speedValues[game.level];
    game.blockClearTime = preset.clearValues[game.level];
    game.blockStallTime = preset.stallValues[game.level];
  }

  if (game.quickRaise) {
    game.disableSwap = true;
    if (game.rise == 0) {
      game.disableSwap = false;
      game.quickRaise = false;
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
  if (game.frames % 12 == 0) {
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
    performance.fps =
      Math.floor(10 * 5 * (1 / performance.secondsPerLoop)) / 10;
    if (performance.fps < 40 && performance.gameSpeed == 1) {
      // If the game is running at below 0.9x speed, there's a problem.
      performance.slowdownTracker += 1; // for each frame, if there is low frame rate 2
      console.log(
        `${performance.slowdownTracker} times under 40 fps every 2 seconds (3 needed)`
      );
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
      performance.fps <= 40 &&
      performance.drawDivisor >= 2 &&
      performance.gameSpeed < 2
    ) {
      performance.gameSpeed = 2;
      console.log("game speed has now doubled");
    }
    if (performance.fps <= 55 && performance.drawDivisor < 2) {
      performance.drawDivisor += 1;
      console.log(
        `computer running slow, fps ${performance.fps}, draw divisor=${performance.drawDivisor}`
      );
    }
    if (performance.fps > 80) drawGrid();
    if (performance.fps > 120) {
      console.log(`computer running fast, fps ${performance.fps}`);

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
    scoreString = `00000${game.score}`;
  } else if (game.score < 100) {
    scoreString = `0000${game.score}`;
  } else if (game.score < 1000) {
    scoreString = `000${game.score}`;
  } else if (game.score < 10000) {
    scoreString = `00${game.score}`;
  } else if (game.score < 100000) {
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
  if (debug.enabled) {
    statDisplay.innerHTML = `fps: ${performance.fps} | Level: ${game.level} | Time: ${timeString} |
        Speed/Clear/Stall ${game.boardRiseSpeed}/${game.blockClearTime}/${game.blockStallTime}`;
  } else {
    statDisplay.innerHTML = `Level: ${game.level} | Time ${timeString}`;
    scoreDisplay.innerHTML = `Score: ${scoreString} | Multiplier: ${multiplierString}`;
  }

  if (game.currentChain > 0) {
    chainDisplay.innerHTML = `${game.currentChain}x chain!`;
    chainDisplay.style.color = "red";
  } else {
    chainDisplay.innerHTML = `Highest Chain: ${game.highestChain}`;
    chainDisplay.style.color = "blue";
  }

  highScoreDisplay.innerHTML = `High Score: ${game.highScore}`;
  requestAnimationFrame(gameLoop);
}

// game.board = generateOpeningBoard()
// setTimeout(gameLoop(),1000/60)
