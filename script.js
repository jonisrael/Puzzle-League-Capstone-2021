/* Puzzle League/Tetris Attack Clone by Jonathan Israel!
    For more information on the game, check out https://tetris.fandom.com/wiki/Tetris_Attack.
    The game is most known as Pokemon Puzzle League, which was released 2000 on Nintendo 64),
    but it is actually a clone of Panel De Pon, a Super Nintendo Entertainment system
    game released in Japan in 1995.  There is another clone globally released in 1995 called Tetris
    Attack (It featured Yoshi!), but the game is really nothing like Tetris other than a grid.
*/

const BLUE = "blue";
const CYAN = "cyan";
const GREEN = "green";
const PURPLE = "purple";
const RED = "red";
const YELLOW = "yellow";
const VACANT = "vacant";

const NORMAL = "normal";
const FACE = "face";
const DARK = "dark";
const DEAD = "dead";
const CLEARING = "clearing";
const LANDING = "landing";
const PANICKING = "panicking";

const img0 = "img0";
const img1 = "img1";
const img2 = "img2";
const img3 = "img3";

// Debug Sprites
import DEBUGW from "./assets/Extras/DebugSprites/debugW.png";
import DEBUGP from "./assets/Extras/DebugSprites/debugP.png";
import DEBUGO from "./assets/Extras/DebugSprites/debugO.png";
import DEBUGB from "./assets/Extras/DebugSprites/debugB.png";

import { blockURLs, CURSOR, imageKeys, imageList } from "./fileImports.js";

let database = [];
let data = [];
let dateTimeAPI = [];
let board = [];
let volume = 1; // YOU CAN REMOVE
// fetching our data from an API

fetch("assets/database.json")
  // parsing our response into JSON format
  .then(response => response.json())
  // "using" the formatted response in our script
  .then(json => data.push(json));

fetch("https://worldtimeapi.org/api/ip")
  // parsing our response into JSON format
  .then(response => response.json())
  // "using" the formatted response in our script
  .then(json => dateTimeAPI.push(json));

const PIECES = [CYAN, GREEN, PURPLE, RED, YELLOW, BLUE];
const TYPES = [NORMAL, CLEARING, FACE, LANDING, PANICKING, DARK, DEAD];
const SWAPPABLES = [NORMAL, LANDING, PANICKING];

const AUDIO = "assets/Audio/";

const MUSIC = ["popcorn.mp3"];
let music = new Audio(`assets/Audio/Music/${MUSIC[randInt(MUSIC.length)]}`);

const ANNOUNCER_COMBO_ARRAY = [
  "what a rush.wav",
  "fantastic combo.wav",
  "there it is.wav",
  "and there's the payoff.wav"
];
const ANNOUNCER_CHAIN_ARRAY = [
  "beautiful.wav",
  "incredible I can't believe it.wav",
  "you don't see moves like that everyday folks.wav",
  "where did that come from.wav",
  "i've never seen anything like this.wav",
  "i've never seen a combo that intense.wav",
  "we are never going to forget this event.wav",
  "unbelievable.wav"
];
const ANNOUNCER_TIME_TRANSITION = ["time marches on.wav"];
const ANNOUNCER_HURRY_UP = [
  "ten seconds to destiny.wav",
  "it all boils down to these last moments.wav"
];
const ANNOUNCER_PANIC = [
  "how much longer can this go on.wav",
  "i'm almost ready to call this one.wav",
  "this could be the end.wav"
];
const ANNOUNCER_OVERTIME = [
  "i hope you're ready.wav",
  "bring us home.wav",
  "looks like we can expect fireworks.wav"
];

const COLS = 6;
const ROWS = 12;
const TOTAL_SQUARES = COLS * ROWS;
const SQ = 32;
const MICRO_SQ = SQ / 16;

let clearDelaySetting = 60;
const speedValues = [60, 20, 15, 12, 10, 6, 4, 2, 2, 2, 1];
const clearValues = [60, 50, 45, 40, 35, 30, 25, 20, 20, 20, 15]; // iterate twice
const stallValues = [24, 12, 11, 10, 9, 8, 7, 6, 6, 6, 6];
const startingHangTime = 12; // Changeable
let called = false;
let level = 1;
let xSwap = 2;
let ySwap = 6;
let speedGameSetting = speedValues[level];
let clearGameSetting = clearValues[level];
let stallGameSetting = stallValues[level]; // Changeable
let mute = 0;
let pause = 0;
let raiseDelay = 0;
let columnsCurrentlyClearing = [];
let addToPrimaryChain = false; // used to start/continue a chainy
let gameTimeElapsed = "00:00";
let debugModeEnabled = 0;
let developerEnabled = 0;
if (localStorage.getItem("highScore") === null) {
  localStorage.setItem("highScore", "1000");
}
let highScore = parseInt(localStorage.getItem("highScore"));
let highScores = [1500, 1000, 800, 500, 300];
// const fs = require("fs")

let rise = 0; // Value between 0 and 15

// Load all images
let loadedImageEntries = {};
for (let i = 0; i < imageList.length; i++) {
  let img = new Image();
  img.src = imageList[i];
  loadedImageEntries[imageKeys[i]] = img;
}
console.log(loadedImageEntries);

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
  draw(ctx) {
    let pixelX = this.x * SQ;
    let pixelY = this.y * SQ - rise;
    const CURSOR_IMAGE = new Image();
    CURSOR_IMAGE.src = CURSOR;
    CURSOR_IMAGE.onload = () => {
      ctx.drawImage(CURSOR_IMAGE, pixelX, pixelY);
    };
  }
}

class Block {
  constructor(
    x,
    y,
    color,
    type,
    delay = 0,
    touched = false,
    availableForPrimaryChain = false,
    availableForSecondaryChain = false,
    imageName = "vacant_normal"
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type;
    this.delay = delay;
    this.touched = touched;
    this.availableForPrimaryChain = availableForPrimaryChain; // When disappear, chain ends
    this.availableForSecondaryChain = availableForSecondaryChain;
    this.imageName = imageName;
  }

  draw(ctx) {
    let animationIndex = -1;
    let BLOCK_KEY = this.imageName;
    const DEBUGW_IMAGE = new Image();
    const DEBUGP_IMAGE = new Image();
    const DEBUGO_IMAGE = new Image();
    const DEBUGB_IMAGE = new Image();
    if (this.type == CLEARING) {
      if (gameSpeed == 1) {
        if ((frames % 4 >= 0 && frames % 4 < 2) || pause == 1) {
          animationIndex = 0;
        } else {
          animationIndex = 1;
        }
      } else {
        if (frames % 4 >= 0 && frames % 4 < 2) {
          animationIndex = 0;
        } else {
          animationIndex = 1;
        }
      }
    } else if (this.type == PANICKING) {
      if (frames % 18 >= 0 && frames % 18 < 3) {
        animationIndex = 0;
      } else if (
        (frames % 18 >= 3 && frames % 18 < 6) ||
        (frames % 18 >= 15 && frames % 18 < 18)
      ) {
        animationIndex = 1;
      } else if (
        (frames % 18 >= 6 && frames % 18 < 9) ||
        (frames % 18 >= 12 && frames % 18 < 15)
      ) {
        animationIndex = 2;
      } else {
        animationIndex = 3;
      }
    } else if (this.type == LANDING) {
      if (this.delay > 5 || this.delay < 0) {
        animationIndex = 0;
      } else if (this.delay > 2) {
        animationIndex = 1;
      } else {
        animationIndex = 2;
      }
    }
    let BLOCK_IMAGE = new Image();
    let urlKey = blockKeyOf(this.color, this.type, animationIndex);
    BLOCK_IMAGE.src = blockURLs[urlKey];
    BLOCK_IMAGE.onload = () => {
      ctx.drawImage(BLOCK_IMAGE, SQ * this.x, SQ * this.y - rise);
    };

    //Debug Visuals
    if (debugModeEnabled == 1) {
      if (this.availableForPrimaryChain && this.availableForSecondaryChain) {
        DEBUGB_IMAGE.src = DEBUGB;
        DEBUGB_IMAGE.onload = () => {
          ctx.drawImage(DEBUGB_IMAGE, SQ * this.x, SQ * this.y - rise);
        };
      } else if (this.availableForPrimaryChain) {
        DEBUGO_IMAGE.src = DEBUGO;
        DEBUGO_IMAGE.onload = () => {
          ctx.drawImage(DEBUGO_IMAGE, SQ * this.x, SQ * this.y - rise);
        };
      } else if (this.availableForSecondaryChain) {
        DEBUGP_IMAGE.src = DEBUGP;
        DEBUGP_IMAGE.onload = () => {
          ctx.drawImage(DEBUGP_IMAGE, SQ * this.x, SQ * this.y - rise);
        };
      } else if (this.delay > 0 && this.type == NORMAL) {
        DEBUGW_IMAGE.src = DEBUGW;
        DEBUGW_IMAGE.onload = () => {
          ctx.drawImage(DEBUGW_IMAGE, SQ * this.x, SQ * this.y - rise);
        };
      }
    }
  }
}

function randInt(max) {
  return Math.floor(Math.random() * max);
}

function playChainSFX(currentChain) {
  return;
  if (currentChain == 1) {
    return;
  }
  if (currentChain < 9) {
    mySound = new Audio(
      `assets/audio/Super Mario 64 Red Coin ${currentChain - 1}.wav`
    );
  } else {
    mySound = new Audio(`assets/audio/Super Mario 64 Red Coin 8.wav`);
  }
  mySound.volume = 0.1;
  mySound.play();
}

function extractTimeToIndex(dateTimeAPI) {
  if (dateTimeAPI.length == 0) {
    return console.log("JSON not fetched yet");
  }
  let index = 0;
  let time = dateTimeAPI[0].datetime;
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

function playSFX(file, volume = 0.1) {
  return;
  mySound = new Audio(`assets/Audio/${file}`);
  mySound.volume = volume;
  mySound.play();
}

function playMusic(file, volume = 0.2, mute = 0) {
  return;
  music.play();
  music.loop = true;
  music.playbackRate = 1.0;
  music.currentTime = 0;
  music.volume = volume;
  if (mute == 1) {
    music.volume = 0;
  } else {
    music.volume = 0.2;
  }
  mute = (mute + 1) % 2;
}

function fixNextDarkStack(board) {
  let aboveAdjacent = true;
  let leftRightAdjacent = true;
  let tempPIECES = PIECES.slice();
  while (aboveAdjacent || leftRightAdjacent) {
    aboveAdjacent = leftRightAdjacent = false;
    for (let c = 0; c < COLS; c++) {
      tempPIECES = PIECES.slice();
      tempPIECES.splice(tempPIECES.indexOf(board[c][12].color), 1);
      if (board[c][13].color == board[c][12].color) {
        aboveAdjacent = true;
      }
      if (c == 0) {
        if (board[c][13].color == board[c + 1][13].color) {
          leftRightAdjacent = true;
        }
      } else if (c > 0 && c < 5) {
        if (
          board[c - 1][13].color == board[c][13].color &&
          board[c][13].color == board[c + 1][13].color
        ) {
          leftRightAdjacent = true;
        }
      } else if (c == 5) {
        if (board[c - 1][13].color == board[c][13].color) {
          leftRightAdjacent = true;
        }
      }

      if (aboveAdjacent || leftRightAdjacent) {
        board[c][13].color = PIECES[randInt(PIECES.length)];
      }
    }
  }
}

function makeOpeningBoard(index) {
  console.log(`Board Index Selected: ${index}`);
  mute = 0;
  playMusic(mute);
  cursor.x = 2;
  cursor.y = 6;
  disableRaise = false;
  level = 1;
  speedGameSetting = speedValues[level];
  clearGameSetting = clearValues[level];
  stallGameSetting = stallValues[level];
  frames = minutes = seconds = 0;
  score = 0;
  pause = 0;
  gameOver = false;
  board = [];
  for (let c = 0; c < COLS; c++) {
    board.push([]);
    for (let r = 0; r < ROWS + 2; r++) {
      let block = new Block(
        c,
        r,
        database[index][c][r].color,
        database[index][c][r].type
      );
      board[c].push(block);
      block.draw(ctx);
    }
  }
  return board;
}

function generateOpeningBoard() {
  cursor.x = 2;
  cursor.y = 6;

  mute = 0;
  playMusic(mute);
  board = [];
  disableRaise = false;
  level = 1;
  speedGameSetting = speedValues[level];
  clearGameSetting = clearValues[level];
  stallGameSetting = stallValues[level];
  frames = minutes = seconds = 0;
  score = 0;
  pause = 0;
  gameOver = false;
  for (let c = 0; c < COLS; c++) {
    board.push([]);
    for (let r = 0; r < ROWS + 2; r++) {
      let block = new Block(c, r, VACANT, NORMAL, 0);
      board[c].push(block);
      if (r > 11) {
        board[c][r].color = PIECES[randInt(PIECES.length)];
        board[c][r].type = DARK;
      }
      block.draw(ctx);
    }
  }

  for (let i = 0; i < 30; i++) {
    // Generate 30 random blocks on bottom 6 rows.
    while (true) {
      let x = randInt(COLS);
      let y = randInt(ROWS / 2) + 6;
      if (board[x][y].color == VACANT) {
        board[x][y].color = PIECES[randInt(PIECES.length)];
        break;
      }
    }
  }

  for (let c = 0; c < COLS; c++) {
    // Drop all blocks to bottom
    let currentBlocks = []; // Temporary
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[c][r].color != VACANT) {
        currentBlocks.unshift(board[c][r].color);
      }
    }
    while (currentBlocks.length < 12) {
      currentBlocks.unshift(VACANT);
    }

    for (let r = 0; r < currentBlocks.length; r++) {
      board[c][r].color = currentBlocks[r];
    }
  }

  for (let x = 0; x < COLS; x++) {
    // Correct Duplicates so blocks of same color cannot be adjacent
    for (let y = 0; y < ROWS; y++) {
      if (board[x][y].color != VACANT) {
        let topBlock = VACANT;
        let rightBlock = VACANT;
        let bottomBlock = VACANT;
        let leftBlock = VACANT;
        if (y != 0) {
          topBlock = board[x][y - 1].color;
        }
        if (x != 5) {
          rightBlock = board[x + 1][y].color;
        }
        if (y != 11) {
          bottomBlock = board[x][y + 1].color;
        }
        if (x != 0) {
          leftBlock = board[x - 1][y].color;
        }

        while (true) {
          if (
            board[x][y].color != topBlock &&
            board[x][y].color != rightBlock &&
            board[x][y].color != bottomBlock &&
            board[x][y].color != leftBlock
          ) {
            break;
          }
          board[x][y].color = PIECES[randInt(PIECES.length)];
        }
      }
      board[x][y].draw(ctx);
    }
  }

  for (let x = 0; x < COLS; x++) {
    // Initial Dark Stacks
    board[x][12].color = PIECES[randInt(PIECES.length)];
    board[x][13].color = PIECES[randInt(PIECES.length)];
    if (x > 0) {
      while (board[x][12].color == board[x - 1][12].color) {
        board[x][12].color = PIECES[randInt(PIECES.length)];
      }
      while (board[x][13].color == board[x - 1][13].color) {
        board[x][13].color = PIECES[randInt(PIECES.length)];
      }
    }
  }
  fixNextDarkStack(board);
  return board;
}

function updateGrid(board, debugFrameAdvance = false) {
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS + 2; y++) {
      // Check to see if a block is still legally in a landing animation
      if (board[x][y].type == LANDING) {
        for (let i = ROWS - 1; i > y; i--) {
          if (board[x][i].color == VACANT) {
            board[x][y].type = NORMAL;
            board[x][y].delay = 0;
            break;
            /* A vacant block below a "landed" block was detected,
                           so the animation will be cancelled. */
          }
        }
      }

      if (
        board[x][y].availableForPrimaryChain ||
        board[x][y].availableForSecondaryChain
      ) {
        if (
          board[x][y].color == VACANT ||
          (board[x][y].type == LANDING &&
            board[x][y].delay > 8 &&
            board[x][y].delay < 11)
        ) {
          board[x][y].availableForPrimaryChain = false;
          board[x][y].availableForSecondaryChain = false;
        }
      }

      if (!debugFrameAdvance) {
        if (board[x][y].delay > 0 && pause == 0) {
          board[x][y].delay -= 1 * gameSpeed;
          disableRaise = true;
        } else if (board[x][y].delay == 0) {
          if (board[x][y].type == CLEARING) {
            board[x][y].type = FACE;
            board[x][y].delay = clearValues[level];
          } else if (board[x][y].type == FACE) {
            board[x][y].color = VACANT;
            board[x][y].type = NORMAL;
            if (y > 0 && board[x][y - 1].color != VACANT) {
              board[x][y - 1].delay = stallGameSetting;
            }
            disableRaise = false;
            for (let i = 0; i <= y; i++) {
              // create chain available blocks above current
              if (board[x][y].availableForPrimaryChain) {
                board[x][i].availableForPrimaryChain = true;
              } else if (board[x][y].availableForSecondaryChain)
                board[x][i].availableForSecondaryChain = true;
            }
          }
        }

        if (board[x][y].delay == -1) {
          board[x][y].delay = 0;
        }
      } else {
        if (board[x][y].delay > 0) {
          board[x][y].delay -= 1;
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
    FirstBlock.delay,
    FirstBlock.touched,
    FirstBlock.availableForPrimaryChain,
    FirstBlock.availableForSecondaryChain
  ];
  FirstBlock.color = SecondBlock.color;
  SecondBlock.color = tempProperties[0];
  FirstBlock.type = SecondBlock.type;
  SecondBlock.type = tempProperties[1];
  FirstBlock.delay = SecondBlock.delay;
  SecondBlock.delay = tempProperties[2];
  FirstBlock.touched = SecondBlock.touched;
  SecondBlock.touched = tempProperties[3];
  FirstBlock.availableForPrimaryChain = SecondBlock.availableForPrimaryChain;
  SecondBlock.availableForPrimaryChain = tempProperties[4];
  FirstBlock.availableForSecondaryChain =
    SecondBlock.availableForSecondaryChain;
  SecondBlock.availableForPrimaryChain = tempProperties[5];
}

function drawGrid(board) {
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS + 1; y++) {
      board[x][y].draw(ctx);
    }
  }
  if (!gameOver) {
    cursor.draw(ctx);
  }
}

function isChainActive(board) {
  // if (grounded) { // failsafe to end chain
  //     for (let c=0; c<COLS; c++) {
  //         for (let r=0; r<ROWS; r++) {
  //             board[c][r].availableForPrimaryChain = false
  //             board[c][r].availableForSecondaryChain = false
  //         }
  //     }
  // }
  let potentialSecondarySuccessor = false;
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      if (board[x][y].availableForPrimaryChain) {
        return true;
      } else if (board[x][y].availableForSecondaryChain) {
        potentialSecondarySuccessor = true;
      }
    }
  }
  // Test failed, so ending chain.
  lastChain = chain;
  if (chain >= 8) {
    playSFX("fanfare4.wav");
  } else if (chain >= 6) {
    playSFX("fanfare3.wav");
  } else if (chain >= 4) {
    playSFX("fanfare2.wav");
  } else if (chain >= 2) {
    playSFX("fanfare1.wav");
  }
  if (chain > 7) {
    playSFX(`Announcer/${ANNOUNCER_CHAIN_ARRAY[7]}`), (volume = 0.3);
  } else if (chain > 1) {
    playSFX(`Announcer/${ANNOUNCER_CHAIN_ARRAY[chain - 2]}`), (volume = 0.3);
  }
  if (chain > highestChain) {
    highestChain = chain;
  }
  chain = 0;
  combo = 0;
  if (potentialSecondarySuccessor) {
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        if (board[x][y].availableForSecondaryChain) {
          board[x][y].availableForPrimaryChain = true;
          board[x][y].availableForSecondaryChain = false;
        }
      }
    }
  }
  return false;
}

function trySwappingBlocks(board, xSwap, ySwap) {
  let x = xSwap;
  let y = ySwap;
  if (disableSwap) {
    return;
  }

  let swap = true;

  // Make sure both blocks aren't vacant
  if (board[x][y].color == VACANT && board[x + 1][y].color == VACANT) {
    swap = false;
  }

  // Check if blocks are clearing
  if (
    !SWAPPABLES.includes(board[x][y].type) ||
    !SWAPPABLES.includes(board[x + 1][y].type)
  ) {
    swap = false;
  }

  // Do not swap if ANY block below is falling                                                                                                                                                                  `alling
  if (y < 11) {
    if (SWAPPABLES.includes(board[x][y].type) && board[x][y].color != VACANT) {
      for (let j = y; j < ROWS; j++) {
        if (board[x][j].color == VACANT) {
          swap = false;
          break;
        }
      }
    }
    if (
      SWAPPABLES.includes(board[x + 1][y].type) &&
      board[x + 1][y].color != VACANT
    ) {
      for (let j = y; j < ROWS; j++) {
        if (board[x + 1][j].color == VACANT) {
          swap = false;
          break;
        }
      }
    }
  }
  // Do not swap if a falling block is less than two units ABOVE the cursor
  if (y > 0) {
    if (
      SWAPPABLES.includes(board[x][y - 1].type) &&
      board[x][y - 1].color != VACANT &&
      board[x][y].color == VACANT
    ) {
      swap = false;
    } else if (
      SWAPPABLES.includes(board[x + 1][y - 1].type) &&
      board[x + 1][y - 1].color != VACANT &&
      board[x + 1][y].color == VACANT
    ) {
      swap = false;
    }
  }

  // Do not swap if a falling block is less than two units BELOW the cursor (rare)
  // if (y > 0) {
  //     if (SWAPPABLES.includes(board[x][y].type) &&
  //         board[x+1][y].color == VACANT &&
  //         board[x+1][y+1].color != VACANT &&
  //         board[x+1][y+1].delay>0) {swap = false; console.log("right here!") }
  //     else if (SWAPPABLES.includes(board[x+1][y].type) &&
  //         board[x][y].color == VACANT &&
  //         board[x][y+1].color != VACANT &&
  //         board[x][y+1].delay>0) {swap = false; console.log("right here!") }
  // }

  if (swap) {
    playSFX("SwapBlocks.wav");
    swapProperties(board[x][y], board[x + 1][y]);
    board[x][y].delay = 0;
    board[x + 1][y].delay = 0;
    board[x][y].type = NORMAL;
    board[x + 1][y].type = NORMAL;
    board[x][y].availableForPrimaryChain = false;
    board[x][y].availableForPrimaryChain = false;
    board[x + 1][y].availableForSecondaryChain = false;
    board[x + 1][y].availableForSecondaryChain = false;

    if (y < 11) {
      //Check to see if block is about to fall
      // Check left block after swap
      if (board[x][y].color != VACANT && board[x][y + 1].color == VACANT) {
        board[x][y].delay = stallGameSetting; // Default 12 frames
        board[x][y].touched = true; // used for properly counting chains
        board[x][y].availableForSecondaryChain = false; // Don't allow the block to be used for chains
        board[x][y].availableForPrimaryChain = false;
      }
      // Check right block after swap
      if (
        board[x + 1][y].color != VACANT &&
        board[x + 1][y + 1].color == VACANT
      ) {
        board[x + 1][y].delay = stallGameSetting; // Default 12 frames
        board[x + 1][y].touched = true; // used for properly counting chains
        board[x][y].availableForPrimaryChain = false; // Don't allow it to be used for chains
        board[x][y].availableForSecondaryChain = false;
      }
    }

    if (y > 0) {
      // Check to see if there are blocks above a vacant block
      // Check left column
      if (
        board[x][y].color == VACANT &&
        board[x][y - 1].color != VACANT &&
        SWAPPABLES.includes(board[x][y - 1].type)
      ) {
        board[x][y - 1].type = NORMAL;
        board[x][y - 1].delay = stallGameSetting;
        for (let i = y - 1; i >= 0; i--) {
          board[x][i].touched = true;
          board[x][y].availableForPrimaryChain = false;
          board[x][y].availableForSecondaryChain = false;
        }
      }
      // Check right column
      if (
        board[x + 1][y].color == VACANT &&
        board[x + 1][y - 1].color != VACANT &&
        SWAPPABLES.includes(board[x + 1][y - 1].type)
      ) {
        board[x + 1][y - 1].type = NORMAL;
        board[x + 1][y - 1].delay = stallGameSetting; // Default 12 frames
        for (let i = y - 1; i >= 0; i--) {
          board[x + 1][i].touched = true;
          board[x + 1][y].availableForPrimaryChain = false;
          board[x + 1][y].availableForSecondaryChain = false;
        }
      }
    }
  } else {
    playSFX("Swap Failed.wav");
  }
}

function doGravity(board) {
  let falling = false;
  let possibleLandedLocations = [];
  let c;
  let r;

  for (let c = 0; c < COLS; c++) {
    if (board[c][11].type == LANDING && board[c][11].delay == 0) {
      board[c][11].type = NORMAL;
      disableRaise = false;
    }

    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[c][r].type == LANDING && board[c][r + 1].color == VACANT) {
        board[c][r].type = NORMAL;
        board[c][r].delay = 0;
      }

      if (board[c][r].type == LANDING && board[c][r].delay == 0) {
        board[c][r].type = NORMAL;
        board[c][r].touched = false;
        disableRaise = false;
      }

      if (
        board[c][r].color != VACANT &&
        board[c][r + 1].color == VACANT &&
        SWAPPABLES.includes(board[c][r].type)
      ) {
        // fall one unit
        falling = true;
        disableRaise = false;
        // When a block is ready to fall
        if (board[c][r].delay == 0) {
          board[c][r + 1].color = board[c][r].color;
          board[c][r + 1].type = board[c][r].type;
          board[c][r + 1].touched = board[c][r].touched;
          board[c][r + 1].availableForSecondaryChain =
            board[c][r].availableForSecondaryChain;
          board[c][r + 1].availableForPrimaryChain =
            board[c][r].availableForPrimaryChain;
          board[c][r].color = VACANT;
          board[c][r].touched = false;
          possibleLandedLocations.push([c, r + 1]);

          //Debug
          if (pause == 1) {
            board[c][r + 1].delay += 1;
          } else if (developerEnabled == 1) {
            board[c][r + 1].delay = 120;
          }

          // Make sure all blocks above falling block have same delay
        }
      }
    }
    for (let i = 0; i < possibleLandedLocations.length; i++) {
      let x = possibleLandedLocations[i][0];
      let y = possibleLandedLocations[i][1];
      if (board[x][y].color != VACANT && board[x][y + 1].color != VACANT) {
        board[x][y].type = LANDING;
        board[x][y].delay = 10;
        //DEBUG
        if (developerEnabled == 1) {
          board[x][y].delay = 120;
        }
      }
    }
  }

  if (!falling) {
    c = 0;
    r = 0;
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        board[c][r].touched = false;
      }
    }
  }

  return !falling;
}

function checkClearing(board) {
  let clearingColumns = [];
  for (let c = 0; c < COLS; c++) {
    clearingColumns[c] = false;
    for (let r = 0; r < ROWS; r++) {
      if (!SWAPPABLES.includes(board[c][r].type)) {
        clearingColumns[c] = true;
        break;
      }
    }
  }
  return clearingColumns;
}

function doPanic(board) {
  let panic = false;
  for (let c = 0; c < COLS; c++) {
    if (board[c][1].color != VACANT) {
      for (let r = 0; r < ROWS; r++) {
        if (board[c][r].type == NORMAL) {
          board[c][r].type = PANICKING;
          panic = true;
        }
      }
    } else {
      for (let r = 0; r < ROWS; r++) {
        if (board[c][r].type == PANICKING) {
          board[c][r].type = NORMAL;
        }
      }
    }
  }
  return panic;
}

function legalMatch(board, clearLocations) {
  if (clearLocations.length == 0) {
    return false;
  }

  let clearLocationsLength = clearLocations.length;

  for (let i = 0; i < clearLocationsLength; i++) {
    let c = clearLocations[i][0];
    let r = clearLocations[i][1];
    for (let j = 11; j > r; j--) {
      if (board[c][j].color == VACANT) {
        return false; // If the block is falling, no match occurs.
      }
    }
  }
  grounded = false;
  return true;
}

function checkMatch(board) {
  // Vertical Case, starting from top block
  let done = false;
  let checkAgain = false;
  let clearLocations = [];
  let clearLocationsString = "";
  let add1ToChain = false;
  while (!done && !checkAgain) {
    done = true;
    checkAgain = false;
    for (let c = 0; c < COLS; c++) {
      // Check Vertical and afterwards, horizontal
      for (let r = 1; r < ROWS - 1; r++) {
        if (
          board[c][r].color != VACANT &&
          board[c][r].color == board[c][r - 1].color &&
          board[c][r].color == board[c][r + 1].color &&
          SWAPPABLES.includes(board[c][r].type) &&
          SWAPPABLES.includes(board[c][r - 1].type) &&
          SWAPPABLES.includes(board[c][r + 1].type)
        ) {
          checkAgain = true;
          clearLocations.push([c, r - 1]);
          clearLocations.push([c, r]);
          clearLocations.push([c, r + 1]);
          // Check for four, five, and six clear
          if (
            r < 10 &&
            board[c][r].color == board[c][r + 2].color &&
            SWAPPABLES.includes(board[c][r + 2].type)
          ) {
            clearLocations.push([c, r + 2]);
            if (
              r < 9 &&
              board[c][r].color == board[c][r + 3].color &&
              SWAPPABLES.includes(board[c][r + 3].type)
            ) {
              clearLocations.push([c, r + 3]);
              if (
                r < 8 &&
                board[c][r].color == board[c][r + 4].color &&
                SWAPPABLES.includes(board[c][r + 4].type)
              ) {
                clearLocations.push([c, r + 4]);
              }
            }
          }
          done = false;
        }
      }
    }

    for (let c = 1; c < COLS - 1; c++) {
      // Check Horizontal
      for (let r = 0; r < ROWS; r++) {
        if (
          board[c][r].color != VACANT &&
          board[c][r].color == board[c - 1][r].color &&
          board[c][r].color == board[c + 1][r].color &&
          SWAPPABLES.includes(board[c][r].type) &&
          SWAPPABLES.includes(board[c - 1][r].type) &&
          SWAPPABLES.includes(board[c + 1][r].type)
        ) {
          checkAgain = true;
          clearLocations.push([c - 1, r]);
          clearLocations.push([c, r]);
          clearLocations.push([c + 1, r]);
          if (
            c < 4 &&
            board[c][r].color == board[c + 2][r].color &&
            SWAPPABLES.includes(board[c + 2][r].type)
          ) {
            clearLocations.push([c + 2, r]);
            if (
              c < 3 &&
              board[c][r].color == board[c + 3][r].color &&
              SWAPPABLES.includes(board[c + 3][r].type)
            ) {
              clearLocations.push([c + 3, r]);
              if (
                c < 2 &&
                board[c][r].color == board[c + 4][r].color &&
                SWAPPABLES.includes(board[c + 4][r].type)
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
    if (legalMatch(board, clearLocations)) {
      addToPrimaryChain = false;
      for (let i = 0; i < clearLocationsLength - 1; i++) {
        clearLocationsString += `[${clearLocations[i]}], `;
      }
      clearLocationsString += `[${clearLocations[clearLocationsLength - 1]}].`;
      if (chain == 0) {
        addToPrimaryChain = true;
        chain++;
        if (clearLocationsLength > 3) {
          playSFX(
            `Announcer/${
              ANNOUNCER_COMBO_ARRAY[randInt(ANNOUNCER_COMBO_ARRAY.length)]
            }`
          );
        } else {
          // playChainSFX(chain)
          // playSFX((`Announcer/${ANNOUNCER_CHAIN_ARRAY[Math.floor(Math.random() * ANNOUNCER_CHAIN_ARRAY.length)]}`))
        }
      } else {
        add1ToChain = false;
        for (let i = 0; i < clearLocationsLength; i++) {
          let x = clearLocations[i][0];
          let y = clearLocations[i][1];
          if (board[x][y].type == LANDING && !board[x][y].touched) {
            // need to add .touched?
            add1ToChain = true;
          }
        }
      }

      updateScore(clearLocationsLength, chain);
      if (add1ToChain) {
        addToPrimaryChain = true;
        chain++;
        playChainSFX(chain);
        // playSFX(`Announcer/${ANNOUNCER_CHAIN_ARRAY[Math.floor(Math.random() * ANNOUNCER_CHAIN_ARRAY.length)]}`)
      }

      for (let i = 0; i < clearLocationsLength; i++) {
        let c = clearLocations[i][0];
        let r = clearLocations[i][1];
        board[c][r].type = CLEARING;
        board[c][r].delay = clearValues[level];
        if (addToPrimaryChain) {
          board[c][r].availableForPrimaryChain = true;
          board[c][r].availableForSecondaryChain = false;
        } else {
          board[c][r].availableForSecondaryChain = true;
          board[c][r].availableForPrimaryChain = false;
        }
        // else (board[c][r].availableForSecondaryChain = true) // if new chain doesn't start
      }

      if (clearLocationsLength != 0) {
        combo = clearLocationsLength;
        if (combo > 3 || chain > 1) {
          raiseDelay = 6 * speedGameSetting;
          if (rise == 0) {
            rise = 2; // Failsafe to prevent extra raise
          }
        }
      }
    } else {
      done = true; // Needs to end if confirm clear fails
    }
  }
}

function isGameOver(board, scoreOfThisGame) {
  for (let c = 0; c < COLS; c++) {
    if (board[c][0].color != VACANT) {
      // enter new high scores
      let pastHighScore = localStorage.getItem("highScore");
      if (scoreOfThisGame > parseInt(pastHighScore)) {
        console.log("new high score!");
        localStorage.setItem("highScore", `${scoreOfThisGame}`);
      }
      if (scoreOfThisGame > highScores[4]) {
        highScores.pop();
        if (scoreOfThisGame > highScores[0]) {
          highScores.splice(0, 0, scoreOfThisGame);
        } else if (scoreOfThisGame > highScores[1]) {
          highScores.splice(1, 0, scoreOfThisGame);
        } else if (scoreOfThisGame > highScores[2]) {
          highScores.splice(2, 0, scoreOfThisGame);
        } else if (scoreOfThisGame > highScores[3]) {
          highScores.splice(3, 0, scoreOfThisGame);
        } else {
          highScores.splice(4, 0, scoreOfThisGame);
        }
      }
      highScore = parseInt(localStorage.getItem("highScore"));
      return true;
    }
  }
  return false;
}

function raiseStack(board) {
  if (disableRaise || pause == 1) {
    return false;
  } else if (raiseDelay > 0) {
    raiseDelay -= 1 * gameSpeed;
    if (raiseDelay < 0) {
      raiseDelay = 0;
    }
    return false;
  }

  if (cursor.y > 1) {
    cursor.y -= 1;
  }

  for (let c = 0; c < COLS; c++) {
    for (let r = 1; r < ROWS; r++) {
      // Raise all rows, then delete bottom rows.
      board[c][r - 1].color = board[c][r].color;
      board[c][r].color = VACANT;
    }
  }

  for (let c = 0; c < COLS; c++) {
    board[c][11].color = board[c][12].color;
    board[c][12].color = board[c][13].color;
    board[c][13].color = PIECES[randInt(PIECES.length)];
  }
  fixNextDarkStack(board);

  for (let i = 0; i < 2; i++) {
    for (let c = 0; c < COLS; c++) {
      if (i == 0) {
        if (board[c][0].color != VACANT || board[c][1].color != VACANT) {
          i = 1;
          break;
        }
      } else {
        if (board[c][2].color != VACANT) {
          playSFX(
            `Announcer/${ANNOUNCER_PANIC[randInt(ANNOUNCER_PANIC.length)]}`
          );
          break;
        }
      }
    }
  }

  return true;
}

function gameOverBoard(board) {
  // don't continue function if all pieces are already switched to DEAD type
  if (board[5][11].type == DEAD) {
    return;
  }
  if (frames == 1) {
    music.pause();
    music.currentTime = 0;
    playSFX("topout.wav");
  }
  disableRaise = true;
  let deathRow = Math.floor(frames / 2);
  for (let i = 0; i < COLS; i++) {
    if (board[i][deathRow].color != VACANT) {
      board[i][deathRow].type = DEAD;
    }
  }
}

let totalAddToScore = 0;
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
  if (level < 7) {
    scoreMultiplier = 1 + level / 10;
  } else {
    scoreMultiplier = 2 + (level - 7) / 5;
  }
  score += scoreMultiplier * addToScore;
  totalAddToScore += scoreMultiplier;
  if (score > highScore) {
    highScore = score;
    // highScoreDisplay.style.color = "gold";
  }
}

let cursor = new Cursor(2, 6);
let disableRaise = false;
let disableSwap = false;
let quickRaise = false;
let swapPressed = false;
let raisePressed = false;

// Prevent browser scroll from arrow keys
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

let running = false;
let canvasContainer = document.getElementById("canvas-container");
let newCanvas;
let cvs;
let ctx;

// const playButton = document.querySelector("#click-to-play");
// button.addEventListener("onmouseup", MouseEvent);

// // function MOUSE(event) {
// //   if (event.cli)
// // }

document.addEventListener("keydown", CONTROL);
function CONTROL(event) {
  if (running) {
    if (event.keyCode == 27) {
      // escape
      newCanvas = document.getElementById("canvas").remove();
      // document.getElementById("canvas-container").remove()
      running = false;
      cvs = null;
      ctx = null;
      music.pause();
      music.currentTime = 0;
    }
  } else {
    if (event.keyCode == 13 && dateTimeAPI.length != 0) {
      // enter
      console.log(dateTimeAPI);
      database = data[0];
      newCanvas = document.createElement(`canvas`);
      newCanvas.setAttribute("id", "canvas");
      newCanvas.setAttribute("width", "192");
      newCanvas.setAttribute("height", "384");
      document.body.appendChild(newCanvas);
      cvs = document.getElementById("canvas");
      ctx = cvs.getContext("2d");
      running = true;
      try {
        board = makeOpeningBoard(extractTimeToIndex);
      } catch (error) {
        console.log(
          `fetching database.json failed. Will randomly generate board instead`
        );
        board = generateOpeningBoard();
      }
      setTimeout(gameLoop(), 1000 / 60);
    } else if (event.keyCode == 191) {
      extractTimeToIndex(dateTimeAPI);
    }
  }

  if (running & !gameOver) {
    if (event.keyCode == 37) {
      if (cursor.x - 1 >= 0) {
        cursor.x -= 1;
        playSFX("MoveCursor.wav", (volume = 0.1));
      }
    } else if (event.keyCode == 38) {
      if (cursor.y - 1 >= 1) {
        cursor.y -= 1;
        playSFX("MoveCursor.wav", (volume = 0.1));
      }
    } else if (event.keyCode == 39) {
      if (cursor.x + 1 <= 4) {
        cursor.x += 1;
        playSFX("MoveCursor.wav", (volume = 0.1));
      }
    } else if (event.keyCode == 40) {
      if (cursor.y + 1 <= 11) {
        cursor.y += 1;
        playSFX("MoveCursor.wav", (volume = 0.1));
      }
    } else if (event.keyCode == 88 || event.keyCode == 83) {
      // x, s
      xSwap = cursor.x;
      ySwap = cursor.y;
      swapPressed = true;
    } else if (event.keyCode == 32 || event.keyCode == 90) {
      // space, z
      raisePressed = true; // run raise function on next frame
    } else if (event.keyCode == 192) {
      // tilda `~
      debugModeEnabled = (debugModeEnabled + 1) % 2;
      if (debugModeEnabled == 1) {
        console.log("debug ON");
      } else {
        console.log("debug OFF");
      }
    }
    if (debugModeEnabled == 1) {
      if (event.keyCode == 48) {
        // 0 (number)
        rise = 0;
        board = makeOpeningBoard(randInt(1440));
        disableRaise = false;
      } else if (event.keyCode == 80 || event.keyCode == 81) {
        // p, q
        pause = (pause + 1) % 2;
      } else if (event.keyCode == 77 && level < 10) {
        //+
        level += 1 * gameSpeed;
        speedGameSetting = speedValues[level];
        clearGameSetting = clearValues[level];
        stallGameSetting = stallValues[level];
      } else if (event.keyCode == 78 && level > 0) {
        //-
        level -= 1 * gameSpeed;
        speedGameSetting = speedValues[level];
        clearGameSetting = clearValues[level];
        stallGameSetting = stallValues[level];

        // Debug codes
      } else if (event.keyCode == 70) {
        // f
        if (pause == 1) {
          updateGrid(board, (debugFrameAdvance = true));
        }
      } else if (event.keyCode == 84) {
        // t
        developerEnabled = (developerEnabled + 1) % 2;
        if (developerEnabled) {
          console.log("developer mode enabled");
          speedGameSetting = speedValues[0];
          stallGameSetting = 120;
          clearGameSetting = 120;
        } else {
          console.log("developer mode disabled");
          speedGameSetting = speedValues[level];
          clearGameSetting = clearValues[level];
          stallGameSetting = stallValues[level];
        }
      } else if (event.keyCode == 16) {
        // LShift to empty board
        for (let i = 0; i < COLS; i++) {
          for (let j = 0; j < ROWS; j++) {
            board[i][j].color = VACANT;
            board[i][j].type = NORMAL;
          }
        }
      }
    }
  } else if (running && gameOver) {
    if (event.keyCode >= 0 && frames >= 200) {
      //any key
      gameOver = false;
      board = makeOpeningBoard(randInt(1440));
    }
  }
}

let commentary = ``;
let lastTime = 0;
let frames = 0;
let fps = 0;
let prev = 0;
let secondsPerLoop;
let prevFrame = frames - 1;
let seconds = 0;
let minutes = 0;
let gameOver = false;
let clearing = false;
let grounded = true;
let score = 0;
let scoreMultiplier = 1;
let chain = 0;
let combo = 0;
let gameSpeed = 1;
let lastChain = 0;
let highestChain = 0;
let computerPerformanceTracker = 0;
let drawsPerSecond = 60;
let performanceConstant = 1;
let statDisplay = document.querySelector("#all-stats");
let scoreDisplay = document.querySelector("#score");
let chainDisplay = document.querySelector("#chain");
let timeDisplay = document.querySelector("#time");
let levelDisplay = document.querySelector("#level");
let highScoreDisplay = document.querySelector("#high-score");
function gameLoop(timestamp) {
  frames++;
  if (!running) {
    return;
  }
  if (frames == 2) {
    window.scrollTo(0, document.body.scrollHeight);
  }

  if (frames % 60 == 0 && !gameOver) {
    seconds++;
  }
  if (seconds % 60 == 0 && seconds != 0) {
    minutes++;
    seconds = 0;
  }

  if (frames % speedGameSetting == 0) {
    if (!disableRaise && grounded && pause == 0) {
      if (raiseDelay > 0) {
        if (!checkClearing(board).includes(true)) {
          raiseDelay -= speedGameSetting * gameSpeed;
        }
      } else {
        rise = (rise + 2) % 32;
      }
    }
    if (rise == 0 && !gameOver) {
      raiseStack(board);
    }
  }

  if (frames == 6600 && !gameOver) {
    playSFX(`Announcer/ten seconds to destiny.wav`);
  }
  if (
    frames % 1200 == 0 &&
    level < 10 &&
    level > 0 &&
    developerEnabled == 0 &&
    !gameOver
  ) {
    // Speed the stack up every 30 seconds
    if (frames == 3600) {
      playSFX(`Announcer/time marches on.wav`);
    } else if (frames >= 7200) {
      playSFX(
        `Announcer/${ANNOUNCER_OVERTIME[randInt(ANNOUNCER_OVERTIME.length)]}`
      );
    }

    level += 1 * gameSpeed;
    music.playbackRate += 0.05;
    speedGameSetting = speedValues[level];
    clearGameSetting = clearValues[level];
    stallGameSetting = stallValues[level];
  }

  if (quickRaise) {
    disableSwap = true;
    if (rise == 0) {
      disableSwap = false;
      quickRaise = false;
      raiseDelay = 0;
      speedGameSetting = Math.floor(speedValues[level] / gameSpeed);
    } else {
      speedGameSetting = 1;
    }
  }
  grounded = doGravity(board);
  updateGrid(board);
  checkMatch(board);
  isChainActive(board);
  if (frames % 12 == 0) {
    doPanic(board);
  }

  if (swapPressed) {
    trySwappingBlocks(board, xSwap, ySwap);
    swapPressed = false;
  }

  if (raisePressed) {
    raisePressed = false;
    if (!disableRaise) {
      quickRaise = true;
      raiseDelay = 0;
    }
  }

  if (!gameOver && isGameOver(board, score)) {
    frames = 0;
    gameOver = true;
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        board[c][r].type = LANDING;
        board[c][r].delay = -2;
      }
    }
    gameOverBoard(board);
    drawGrid(board);
  }
  if (gameOver && frames < 25) {
    gameOverBoard(board);
    drawGrid(board);
  }

  // Try and control a frame rate that is too fast
  if (!gameOver) {
    if (fps <= 50) {
      if (frames % 2 == 0) {
        drawGrid(board);
      }
    } else if (fps <= 90) {
      drawGrid(board);
    } else {
      drawGrid(board);
      drawGrid(board);
    }
  }

  if (frames % 5 == 0) {
    // fps counter
    secondsPerLoop = Math.floor(100 * (timestamp / 1000 - prev)) / 100;
    fps = Math.floor(10 * 5 * (1 / secondsPerLoop)) / 10;
    if (fps < 40) {
      // If the game is running at below 0.9x speed, there's a problem.
      computerPerformanceTracker += 1; // for each frame, if there is low frame rate 2
      // console.log("Number of slow frames counted every quarter second:",computerPerformanceTracker)
      // console.log(computerPerformanceTracker)
    } else if (fps > 90) {
      // If the game is running too fast
      gameSpeed = 1;
    } else if (fps > 70) {
      gameSpeed = 1;
    } else {
      gameSpeed = 1;
      // console.log("high frame rate,", fps, "|","seconds", seconds)
    }
    prev = timestamp / 1000;
  }

  if (seconds % 5 == 0) {
    computerPerformanceTracker = 0;
  } // Check # of frame rate drops every 600 frames
  if (computerPerformanceTracker > 10) {
    // If fps is below 50fps for 2 seconds in the next 10, lower settings
    computerPerformanceTracker = 0;
    console.log("computer running slow");
    if (drawsPerSecond == 30) {
      gameSpeed = 1; // Game is running very slow, double the speed of everything!
      console.log("Game speed has changed");
    }
    drawsPerSecond = 30;
    // } else if (drawsPerSecond == 30) {
    //     drawsPerSecond = 20
    // } else if (drawsPerSecond == 20) {
    //     drawsPerSecond = -1
    //     console.log("Performance of device is too low for accurate play.")
    // }
  }
  let minutesString = "";
  let secondsString = "";
  let scoreString = "";
  let multiplierString = "";
  if (minutes < 10) {
    minutesString = `0${minutes}`;
  } else {
    minutesString = `${minutes}`;
  }
  if (seconds < 10) {
    secondsString = `0${seconds}`;
  } else {
    secondsString = `${seconds}`;
  }
  let timeString = `${minutesString}:${secondsString}`;

  if (score < 10) {
    scoreString = `00000${score}`;
  } else if (score < 100) {
    scoreString = `0000${score}`;
  } else if (score < 1000) {
    scoreString = `000${score}`;
  } else if (score < 10000) {
    scoreString = `00${score}`;
  } else if (score < 100000) {
    scoreString = `0${score}`;
  } else {
    scoreString = `${score}`;
  }

  if (scoreMultiplier == 1) {
    multiplierString = "1.0x";
  } else if (scoreMultiplier == 2) {
    multiplierString = "2.0x";
  } else {
    multiplierString = `${scoreMultiplier}x`;
  }
  // if (debugModeEnabled) {
  //   statDisplay.innerHTML = `FPS: ${fps} | Level: ${level} | Time: ${timeString} |
  //       Speed/Clear/Stall ${speedGameSetting}/${clearGameSetting}/${stallGameSetting}`;
  // } else {
  //   statDisplay.innerHTML = `Level: ${level} | Time ${timeString}`;
  //   scoreDisplay.innerHTML = `Score: ${scoreString} | Multiplier: ${multiplierString}`;
  // }

  // if (chain > 0) {
  //   chainDisplay.innerHTML = `${chain}x chain!`;
  //   chainDisplay.style.color = "red";
  // } else {
  //   chainDisplay.innerHTML = `Highest Chain: ${highestChain}`;
  //   chainDisplay.style.color = "blue";
  // }

  // highScoreDisplay.innerHTML = `High Score: ${highScore}`;
  requestAnimationFrame(gameLoop);
}

// board = generateOpeningBoard()
// setTimeout(gameLoop(),1000/60)
