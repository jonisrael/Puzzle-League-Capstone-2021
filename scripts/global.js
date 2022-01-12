import { audio, audioKeys, audioList, sprite } from "./fileImports";
import { checkIfControlsExist, setNewControls } from "./controls";

// checkIfControlsExist(savedControls);

// export let savedControls = {};
// export let savedControls = JSON.parse(JSON.stringify(defaultControls));

export const announcer = {
  openingDialogue: [
    audio.announcerAreYouReady,
    audio.announcerLetsGetStarted,
    audio.announcerReady,
  ],
  comboDialogue: [
    audio.announcerBeautiful,
    audio.announcerFantasticCombo,
    audio.announcerThereItIs,
    audio.announcerPayoff,
    audio.announcerClear,
    audio.announcerNowsYourChance,
  ],
  smallChainDialogue: [
    audio.announcerBeautiful,
    audio.announcerWhatARush,
    audio.announcerInvincible,
    audio.announcerIncredibleCantBelieve,
  ],
  mediumChainDialogue: [
    audio.announcerMovesLikeThat,
    audio.announcerWhereComeFrom,
    audio.announcerWhatPower,
  ],
  largeChainDialogue: [
    audio.announcerAnythingLike,
    audio.announcerComboIntense,
    audio.announcerPerfect,
  ],
  bestChainDialogue: [
    audio.announcerUnbelievable,
    audio.announcerDecisiveStrength,
    audio.announcerNoDoubt,
    // audio.announcerMakeNoMistake,
  ],
  timeTransitionDialogue: [
    audio.announcerTimeMarchesOn,
    audio.announcerLetsKeepItUp,
    audio.announcerPickUpPace,
  ],
  hurryUpDialogue: [
    audio.announcerTenSeconds,
    audio.announcerAllBoilsDown,
    audio.announcerNotMuchTimeLeft,
  ],
  panicDialogue: [
    audio.announcerHowMuchLonger,
    audio.announcerIsItTheEnd,
    audio.announcerCallThisOne,
    audio.announcerFatLadySing,
    // audio.announcerItAintOver
  ],
  overtimeDialogue: [
    audio.announcerBringUsHome,
    audio.announcerIHopeReady,
    audio.announcerFireworks,
    audio.announcerLetsGetStarted,
    audio.announcerBraceYourself,
    // audio.announcerBattleOfEndurance
  ],
  endgameDialogue: [
    audio.announcerDeservePraise,
    audio.announcerTraining,
    audio.announcerNeverForgetEvent,
    audio.announcerOnlyWordWorthy,
    audio.announcerWatchChampBask,
  ],
  openingIndexLastPicked: -1, // These are used to minimize repeat dialogues
  smallChainIndexLastPicked: -1,
  mediumChainIndexLastPicked: -1,
  largeChainIndexLastPicked: -1,
  bestChainIndexLastPicked: -1,
  timeTransitionIndexLastPicked: -1,
  hurryUpIndexLastPicked: -1,
  panicIndexLastPicked: -1,
  overtimeIndexLastPicked: -1,
  endgameIndexLastPicked: -1,
};

export const hold_it = [
  audio.holdIt1,
  audio.holdIt2,
  audio.holdIt3,
  audio.holdIt4,
];

export const blockColor = {
  RED: "red",
  CYAN: "cyan",
  GREEN: "green",
  PURPLE: "purple",
  BLUE: "blue",
  YELLOW: "yellow",
  VACANT: "vacant",
};

export const blockType = {
  NORMAL: "normal",
  PANICKING: "panicking",
  LANDING: "landing",
  STALLING: "stalling",
  SWAPPING: "swapping",
  POPPED: "popped",
  FACE: "face",
  DARK: "dark",
  DEAD: "dead",
  BLINKING: "blinking",
};

export const PIECES = [
  blockColor.CYAN,
  blockColor.GREEN,
  blockColor.PURPLE,
  blockColor.RED,
  blockColor.YELLOW,
  blockColor.BLUE,
];

export const INTERACTIVE_TYPES = [
  blockType.NORMAL,
  blockType.LANDING,
  blockType.PANICKING,
  // blockType.SWAPPING,
];

export const SOLID_TYPES = [
  "normal",
  "landing",
  "panicking",
  "swapping",
  "stalling",
];

export const CLEARING_TYPES = ["blinking", "face", "popped"];

export const grid = {
  COLS: 6,
  ROWS: 12,
  SQ: 32,
};

// Old values  00, 00, 20, 40, 60,80,100,120,08,09,10
// speedValues: [40, 20, 15, 12, 10,  6,   4, 2,  2,  2, 1],
// clearValues: [60, 50, 45, 40, 35, 30, 25, 20, 16, 12, 8], // iterate twice
// stallValues: [16, 12, 11, 10,  9,  8,  7,  6,  5,  4, 6]

//  clearValues: [60, 60, 54, 48, 42, 36, 30, 24, 20, 16, 12],

export const preset = {
  //            00, 00, 30, 60, 90,120,150,180,210,240,270
  // old speed values
  speedValues: [59, 48, 34, 20, 12, 8, 6, 2, 2, 2, 1],
  clearValues: [200, 100, 88, 76, 68, 56, 42, 36, 28, 20, 16],
  blinkValues: [120, 60, 54, 48, 42, 36, 28, 24, 16, 12, 8],
  scoreMultValues: [1, 1, 1.25, 1.5, 2, 2.25, 2.5, 3, 3.25, 3.5, 4],
  faceValues: [80, 40, 34, 28, 26, 20, 16, 12, 12, 8, 8],
  popMultiplier: [20, 10, 10, 10, 8, 8, 8, 6, 6, 6, 6],
  stallValues: [20, 20, 18, 16, 14, 14, 14, 12, 12, 12, 12],
  controlsDefaultMessage: "",
};

let HIGH_SCORE = parseInt(localStorage.getItem("highScore"));
let gameMusic = new Audio();

export const win = {
  pageOpenedAt: Date.now(),
  patchNotesShown: false,
  gamepadPort: false,
  view: "Home",
  viewChanged: false,
  version: 1,
  running: false,
  restartGame: false,
  canvas: null,
  cvs: null,
  ctx: null,
  mainInfoDisplay: null,
  gameInfoTable: null,
  fpsDisplay: null,
  statDisplay: null,
  scoreHeader: null,
  scoreDisplay: null,
  multiplierHeader: null,
  multiplierDisplay: null,
  chainDisplay: null,
  timeHeader: null,
  timeDisplay: null,
  levelHeader: null,
  levelDisplay: null,
  highScoreDisplay: null,
  controlsDisplay: "",
  gameOverMessage: null,
  form: null,
  leaderboardInfo: "Fetching Leaderboards...",
  muteAnnouncer: document.getElementById("mute-announcer"),
  muteMusic: document.getElementById("mute-music"),
  muteSFX: document.getElementById("mute-sfx"),
  audioLoaded: false,
};

export const music = [
  audio.popcornMusic,
  // audio.popcornExtendedMusic,
  audio.ryuMusic,
  audio.lipMusic,
  audio.physicsMusic,
  audio.cub3dMusic,
  // audio.scatmanMusic,
  // audio.rashidMusic,
  // audio.hugoMusic,
];

export const touch = {
  enabled: true,
  disableAllMoveOrders: false,
  thereIsABlockCurrentlySelected: false,
  mouse: {
    clicked: false,
    x: 2, // actual mouse loc, updates while mouse is down
    y: 6, // actual mouse loc, updates while mouse is down
  },
  mouseStart: { x: 2, y: 6 },
  selectedBlock: { x: 2, y: 6 }, // starts at click location until swap or drop},
  moveOrderExists: false,
  moveOrderList: [],
  arrowList: [],
  target: { x: 2, y: 6 }, // swap until target is reached
  keySquare: { x: 2, y: 6 },
  swapOrderPrepared: false,
  doubleClickCounter: 0,
  doubleClickTimer: 0,
};

export const overtimeMusic = [
  audio.strikersMusic,
  audio.grimMusic,
  audio.edgeworthMusic,
  // audio.gioMusic,
  // audio.surgeMusic
];

export const resultsMusic = [audio.results1Music, audio.results2Music];

export let game = {
  // use let instead of export const to revert to resetGameVar
  mode: "arcade",
  controller: null,
  cursor: null,
  cursor_type: "defaultCursor",
  rise: 0,
  board: [],
  mute: 0,
  volume: 1,
  level: 1,
  boardRiseSpeed: preset.speedValues[1],
  blockClearTime: preset.clearValues[1],
  blockBlinkTime: preset.blinkValues[1],
  blockPopMultiplier: preset.popMultiplier[1],
  blockInitialFaceTime: preset.faceValues[1],
  blockStallTime: preset.stallValues[1],
  blockSelectedXCHANGE: 2,
  blockSelectedYCHANGE: 6,
  boardRiseRestarter: 0,
  raiseDelay: 0,
  frames: -180,
  finalTime: 0,
  seconds: 0,
  minutes: 0,
  timeString: "0:00",
  score: 0,
  scoreUpdate: 0,
  scoreMultiplier: 1,
  chainScoreAdded: 0,
  currentChain: 0,
  combo: 0,
  lastChain: 0,
  largestChain: 0,
  largestChainScore: 0,
  largestCombo: 0,
  totalClears: 0,
  paused: false,
  over: false, //gameOver
  pauseStack: false,
  addToPrimaryChain: false, // used to start/continue a chain
  message: "",
  defaultMessage: "Welcome to Puzzle League!",
  messagePriority: "",
  messageChangeDelay: 90,
  highScore: HIGH_SCORE,
  boardRiseDisabled: false,
  disableSwap: false,
  currentlyQuickRaising: false,
  swapPressed: false,
  raisePressed: false,
  readyForNewRow: false,
  highestRow: 11,
  highestCols: [0, 1, 2, 3, 4, 5],
  panicIndex: 1,
  panicSpeedDivisor: 1,
  Music: gameMusic,
  data: {},
  log: [],
  panicking: false,
  version: 1,
  boardIsClearing: false,
  boardHasAirborneBlock: false,
  boardHasSwappingBlock: false,
  VacantBlock: {},
};

export const lastIndex = {
  music: -1,
  overtimeMusic: -1,
};

// export const newGame = JSON.parse(JSON.stringify(game));

export const api = {
  data: {
    month: "",
    day: "",
    year: "",
    hour: "",
    minute: "",
    meridian: "",
  },
};

export const perf = {
  canPostToLeaderboard: false,
  unrankedReason: "",
  gameSpeed: 1,
  fps: 0,
  prev: 0,
  secondsPerLoop: 1,
  slowdownTracker: 0,
  drawsPerSecond: 60, // not used yet
  drawDivisor: 1,
  realTime: 0,
  gameStartTime: 0,
  pauseStartTime: 0,
  sumOfPauseTimes: 0,
  fpsInterval: 1000 / 60,
  then: 0,
  now: 0,
  delta: 0,
  diffFromRealTime: 0,
};

export const debug = {
  enabled: 0,
  slowdown: 0,
  freeze: 0,
  show: 0,
  updateGameState: false,
  advanceOneFrame: false,
  pastGameState: {},
};

export const cpu = {
  enabled: 0,
  control: 0,
  showInfo: 0,
  up: false,
  down: false,
  left: false,
  right: false,
  swap: false,
  swapSuccess: false,
  quickRaise: false,
  pause: false,
  prevTargetX: 5,
  prevTargetY: 5,
  targetX: 0,
  targetY: 0,
  targetColor: sprite.debugRed,
  userChangedSpeed: 0,
  holeDetectedAt: [0, 0],
  matchList: [],
  transferToRight: 0,
  randomInputCounter: 0,
  prevSwapX: 0,
  prevSwapY: 0,
  alreadySwapped: false,
};

export const leaderboard = {
  data: [],
  canPost: true,
  userPostedName: "",
  userPostedScore: "",
  reason: "",
};

export let updateGameState = false;

export const loadedAudios = [];
export const objectOfAudios = {};
export const essentialAudios = [];

export let audioLoadedPercentage = 0;

// Preload all audios, then play them at zero volume.
export function checkIfAudioLoaded(lengthDesired) {
  let preloadedAudios = 0;
  for (let audioObj of loadedAudios) {
    if (audioObj.readyState == 4) {
      preloadedAudios++;
      audioLoadedPercentage = Math.floor(
        (100 * preloadedAudios) / lengthDesired
      );
    }
  }
  if (audioLoadedPercentage === 100) {
    return true;
  }
  return false;
}

export function loadAudios(essentialOnly) {
  let [indexStart, indexEnd] = essentialOnly ? [0, 16] : [16, audioKeys.length];
  // let [indexStart, indexEnd] = [0, audioList.length];
  for (let i = indexStart; i < indexEnd; i++) {
    let sfx = new Audio();
    sfx.src = audioList[i];
    sfx.preload = "auto";
    loadedAudios.push(sfx);
    if (essentialOnly) essentialAudios.push(sfx);
    objectOfAudios[audioKeys[i]] = sfx;
  }
}

loadAudios({ essentialOnly: true });

for (let i = 1; i <= 5; i++) {
  if (localStorage.getItem(`bestScore${i}`) == null) {
    console.log(`creating item for bestScore ${i}`);
  }
}

if (localStorage.getItem(`username`) == null) {
  localStorage.setItem("username", "Enter Name Here");
}

export const bestScores = [
  parseInt(localStorage.getItem("bestScore1") || 500),
  parseInt(localStorage.getItem("bestScore2") || 400),
  parseInt(localStorage.getItem("bestScore3") || 300),
  parseInt(localStorage.getItem("bestScore4") || 200),
  parseInt(localStorage.getItem("bestScore5") || 100),
];

export function randInt(
  max,
  firstElementSkewed = false,
  ignoreIndex = -1,
  title = ""
) {
  // if (debug.enabled) console.log(max, firstElementSkewed, ignoreIndex, title);
  let done = false;
  let randomIndexSelected = -2;
  while (!done) {
    done = true;
    randomIndexSelected = Math.floor(max * Math.random());
    if (ignoreIndex === randomIndexSelected) {
      done = false;
      if (debug.enabled) console.log("ignore index", ignoreIndex);
    }
    if (firstElementSkewed && ignoreIndex !== 0 && Math.random() < 0.25) {
      if (debug.enabled) console.log("first element reselected by skew");
      randomIndexSelected = 0;
    }
  }
  if (title) lastIndex[title] = randomIndexSelected;
  // if (debug.enabled && title === "music")
  //   console.log("random music ind selected: ", randomIndexSelected);
  return randomIndexSelected;
}

export function padInteger(integer, digits) {
  switch (digits) {
    case 2:
      return integer < 10 ? `0${integer}` : `${integer}`;
    case 3:
      if (integer < 10) return `00${integer}`;
      else if (integer < 100) return `0${integer}`;
      else return `${integer}`;
    case 4:
      if (integer < 10) return `000${integer}`;
      else if (integer < 100) return `00${integer}`;
      else if (integer < 1000) return `0${integer}`;
      else return `${integer}`;
    case 5:
      if (integer < 10) return `0000${integer}`;
      else if (integer < 100) return `000${integer}`;
      else if (integer < 1000) return `00${integer}`;
      else if (integer < 10000) return `0${integer}`;
      else return `${integer}`;
    case 6:
      if (integer < 10) return `00000${integer}`;
      else if (integer < 100) return `0000${integer}`;
      else if (integer < 1000) return `000${integer}`;
      else if (integer < 10000) return `00${integer}`;
      else if (integer < 10000) return `0${integer}`;
      else return `${integer}`;
  }
  return "Error: Can only pad digits 2-6";
}

export function blockIsSolid(Square, allowStallingType = true) {
  // returns true if block is not vacant and of interactive type
  if (!Square) return false;
  // let isStalling = allowStallingType ? Square.type === "stalling" : false;
  let result =
    Square.color !== "vacant" &&
    SOLID_TYPES.includes(game.board[Square.x][Square.y].type);
  return result;
}

export function blockVacOrClearing(Square) {
  if (!Square) return false;
  // if (Square.x )
  return (
    game.board[Square.x][Square.y].color === "vacant" ||
    CLEARING_TYPES.includes(game.board[Square.x][Square.y].type)
  );
}

export function findStallingOrFallingBlockAbove(x, y) {
  if (
    INTERACTIVE_TYPES.includes(game.board[x][y - 1]) &&
    game.board[x][y - 1] !== "vacant"
  )
    return false;
  for (let j = y - 2; j >= 0; j--) {
    if (
      INTERACTIVE_TYPES.includes(
        game.board[x][j] || game.board[x][j].type === "stalling"
      )
    ) {
      return [x, j];
    }
  }
}

export function outOfRange(x, y) {
  return x < 0 || x >= grid.COLS || y < 0 || y >= grid.ROWS;
}

export function vacantBlockBelow(Square) {
  for (let j = Square.y + 1; j < grid.ROWS - 1; j++) {
    if (game.board[Square.x][j].color === "vacant") {
      return true;
    }
  }
  return false;
}

export function transferProperties(FirstBlock, SecondBlock, type) {
  let FirstKeys = Object.keys(FirstBlock).splice(2);
  let SecondKeys = Object.keys(SecondBlock).splice(2);
  let TempBlock = JSON.parse(JSON.stringify(SecondBlock));

  SecondKeys.forEach((key) => (SecondBlock[key] = FirstBlock[key]));
  if (type === "between") {
    FirstKeys.forEach((key) => (FirstBlock[key] = TempBlock[key]));
  } else if (type === "to") {
    FirstKeys.forEach((key) => (FirstBlock[key] = game.VacantBlock[key]));
  }

  // // Transfer everything except x and y coordinates
  // let tempProperties = [
  //   FirstBlock.color,
  //   FirstBlock.type,
  //   FirstBlock.timer,
  //   FirstBlock.touched,
  //   FirstBlock.availForPrimaryChain,
  //   FirstBlock.availForSecondaryChain
  // ];
  // FirstBlock.color = SecondBlock.color;
  // SecondBlock.color = tempProperties[0];

  // FirstBlock.type = SecondBlock.type;
  // SecondBlock.type = tempProperties[1];

  // FirstBlock.timer = SecondBlock.timer;
  // SecondBlock.timer = tempProperties[2];

  // FirstBlock.touched = SecondBlock.touched;
  // SecondBlock.touched = tempProperties[3];

  // FirstBlock.availForPrimaryChain = SecondBlock.availForPrimaryChain;
  // SecondBlock.availForPrimaryChain = tempProperties[4];

  // FirstBlock.availForSecondaryChain =
  //   SecondBlock.availForSecondaryChain;
  // SecondBlock.availForPrimaryChain = tempProperties[5];
}

// 2 minute preset
// export const preset = {
//   //            00, 00, 20, 40, 60,80,100,120,08,09,10
//   speedValues: [59, 48, 34, 20, 12, 8, 6, 2, 2, 2, 1],
//   clearValues: [200, 100, 88, 76, 68, 56, 42, 36, 28, 20, 16],
//   blinkValues: [120, 60, 54, 48, 42, 36, 28, 24, 16, 12, 8],
//   scoreMultValues: [1, 1, 1.25, 1.5, 2, 2.25, 2.5, 3, 3.25, 3.5, 4],
//   faceValues: [80, 40, 34, 28, 26, 20, 16, 12, 12, 8, 8],
//   popMultiplier: [20, 10, 10, 10, 8, 8, 8, 6, 6, 6, 6],
//   stallValues: [20, 20, 18, 16, 14, 14, 14, 12, 12, 12, 12],
//   controlsDefaultMessage: "",
// };

// 3 minute preset
// speedValues: [59, 48, 24, 12, 10, 6, 4, 2, 2, 2, 1],
// clearValues: [200, 100, 88, 76, 68, 56, 42, 36, 28, 20, 16],
// blinkValues: [120, 60, 54, 48, 42, 36, 28, 24, 16, 12, 8],
// scoreMultValues: [1, 1, 1.25, 1.5, 2, 2.25, 2.5, 3, 3.25, 3.5, 4],
// faceValues: [80, 40, 34, 28, 26, 20, 16, 12, 12, 8, 8],
// popMultiplier: [20, 10, 10, 10, 8, 8, 8, 6, 6, 6, 6],
// stallValues: [20, 20, 18, 16, 14, 14, 14, 12, 12, 12, 12],
// controlsDefaultMessage: ""
