import { audio, audioKeys, audioList, sprite } from "./fileImports";
import { displayMessage } from "..";
import { pause } from "./functions/pauseFunctions";
import { determineOSAndBrowser } from "./functions/determineOSBrowser";
import { touch } from "./clickControls";

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
    audio.announcerPerfect,
    audio.announcerWhatPower,
  ],
  mediumChainDialogue: [
    audio.announcerMovesLikeThat,
    audio.announcerWhereComeFrom,
    audio.announcerIncredibleTechnique,
  ],
  largeChainDialogue: [
    audio.announcerAnythingLike,
    audio.announcerComboIntense,
    audio.announcerIncredibleCantBelieve,
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
    // audio.announcerNotMuchTimeLeft,
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
    audio.announcerAnymoreIntenseThanThis,
    // audio.announcerBattleOfEndurance
  ],
  endgameDialogue: [
    audio.announcerDeservePraise,
    audio.announcerTraining,
    audio.announcerNeverForgetEvent,
    audio.announcerOnlyWordWorthy,
    audio.announcerWatchChampBask,
    audio.announcerIncredibleCantBelieve,
  ],
  openingIndexLastPicked: -1, // These are used to minimize repeat dialogues
  smallChainIndexLastPicked: -1,
  mediumChainIndexLastPicked: -1,
  largeChainIndexLastPicked: -1,
  bestChainIndexLastPicked: -1,
  timeTransitionIndexLastPicked: -1,
  comboIndexLastPicked: -1,
  hurryUpIndexLastPicked: -1,
  panicIndexLastPicked: -1,
  overtimeIndexLastPicked: -1,
  endgameIndexLastPicked: -1,
};

export const arbiter = {
  overtime: audio.arbiterOvertime,
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
  YELLOW: "yellow",
  BLUE: "blue",
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

// old speed values
// speedValues:    [120,  48, 34, 20, 12,  8,  6,  2,  2,  2,  1],
// clearValues:    [200, 100, 88, 76, 68, 56, 42, 36, 28, 20, 16],
// blinkValues:    [120,  60, 54, 48, 42, 36, 28, 24, 16, 12,  8],
// faceValues:     [80,  40, 34, 28, 26, 20, 16, 12, 12,  8,   8],
// popMultiplier:  [20, 10, 10, 10,  8,  8,  8,  6,  6,   6,   6],
// stallValues:    [20, 20, 18, 16, 14, 14, 14, 12, 12,  12,  12],
// multValues: [1, 1, 1.25, 1.5, 2, 2.25, 2.5, 3, 3.25, 3.5, 4],
// controlsDefaultMessage: "",

// export const preset5Levels = {
//   //            00, 00, 30, 60, 90,120,150,180,210,240,270
//   // old speed values
//   speedValues: [120, 58, 46, 34, 22, 10, 4, 4, 2, 2, 1],
//   clearValues: [180, 100, 90, 80, 70, 60, 50, 40, 30, 20, 16],
//   blinkValues: [110, 60, 54, 48, 42, 36, 30, 24, 18, 12, 8],
//   faceValues: [70, 40, 36, 32, 28, 24, 20, 16, 12, 8, 8],
//   popMultiplier: [16, 10, 10, 10, 8, 8, 6, 6, 6, 6, 6],
//   stallValues: [20, 20, 18, 16, 14, 14, 12, 12, 10, 10, 8],
//   multValues: [1, 1, 1.15, 1.3, 1.45, 1.6, 2, 2.25, 2.5, 2.75, 3],
// };

// Clear Values Until 10-13-2022
// clearValues: [200, 100, 90, 80, 70, 60, 50, 40, 36, 32, 28, 24, 20, 20],
// blinkValues: [120, 60, 54, 48, 42, 36, 30, 24, 22, 20, 18, 16, 14, 14],
// faceValues: [80, 40, 36, 32, 28, 24, 20, 16, 14, 12, 10, 8, 6, 6],

// Clear Values Until 10-14-2022
// clearValues: [200, 120, 108, 96, 84, 72, 60, 40, 36, 32, 30, 24, 20, 20],
// blinkValues: [120, 72, 64, 58, 50, 44, 36, 24, 22, 20, 18, 14, 12, 12],
// faceValues: [80, 48, 44, 38, 34, 28, 24, 16, 14, 12, 12, 10, 8, 8],

export const preset = {
  //            00, 00, 30, 60, 90,120,150,180,210,240,270
  speedValues: [120, 48, 36, 24, 12, 8, 6, 2, 2, 2, 2, 2, 2, 1],
  clearValues: [200, 120, 108, 96, 84, 72, 60, 40, 36, 32, 30, 24, 20, 20],
  blinkValues: [120, 72, 64, 58, 50, 44, 36, 24, 22, 20, 18, 14, 12, 12],
  faceValues: [80, 48, 44, 38, 34, 28, 24, 16, 14, 12, 12, 10, 8, 8],
  popMultiplier: [20, 12, 12, 12, 10, 10, 10, 8, 8, 8, 6, 6, 6, 6],
  stallValues: [20, 14, 14, 14, 12, 12, 12, 10, 10, 10, 10, 10, 10, 8],
  multValues: [1, 1, 1.15, 1.3, 1.45, 1.6, 1.75, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 3],
};

for (let i = 0; i < preset.clearValues.length; i++) {
  preset.blinkValues[i] = Math.floor(0.6 * preset.clearValues[i]);
  if (preset.blinkValues[i] % 2 === 1) preset.blinkValues[i]++;
  preset.faceValues[i] = preset.clearValues[i] - preset.blinkValues[i];
}
console.log("preset:", preset);

if (!localStorage.getItem("games-completed"))
  localStorage.setItem("games-completed", "0");

let HIGH_SCORE = parseInt(localStorage.getItem("highScore"));
let gameMusic = new Audio();
let gameAnnVoice = new Audio();
let gameSFX = [new Audio(), new Audio(), new Audio()];

export const win = {
  pageOpenedAt: Date.now(),
  patchNotesShown: false,
  focused: true,
  tutorialPlayedOnce: false,
  gamepadPort: false,
  goToMenu: "",
  view: "Home",
  viewChanged: false,
  version: 1,
  running: false,
  restartGame: false,
  canvas: null,
  borderColor: "burlywood",
  cvs: null,
  ctx: null,
  raiseDelayBar: null,
  gameLogDisplay: null,
  mainInfoDisplay: null,
  gameInfoTable: null,
  fpsDisplay: null,
  statDisplay: null,
  scoreHeader: null,
  scoreDisplay: null,
  topSection: null,
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
  loopCounter: 0,
  gameLoopCompleted: true,
  browser: "Unknown",
  os: "Unknown",
  mobile: false,
  appleProduct: false,
  gamesCompleted: JSON.parse(localStorage.getItem("games-completed")),
};

export const replay = {
  initialBoard: [],
  darkStacks: [],
  digitalInputs: [],
  mouseInputs: [],
};

determineOSAndBrowser(navigator.userAgent);

export const music = [
  audio.popcornMusic,
  audio.trainingMusic,
  audio.sorBarSong,
  // audio.popcornExtendedMusic,
  // audio.ryuMusic,
  // audio.lipMusic,
  audio.physicsMusic,
  // audio.cub3dMusic,
  audio.collapsedRegMusic,
  // audio.scatmanMusic,
  audio.rashidMusic,
  audio.hugoMusic,
];

export const overtimeMusic = [
  audio.strikersMusic,
  audio.grimMusic,
  audio.edgeworthMusic,
  audio.collapsedOTMusic,
  audio.expresswaySong,
  audio.wreckingBallSong,
  // audio.gioMusic,
  // audio.surgeMusic
];

export const resultsMusic = [audio.results1Music, audio.results2Music];

export let sound = {
  Music: ["", gameMusic],
  AnnVoice: ["", gameAnnVoice],
  SFX0: ["", gameSFX[0]],
  SFX1: ["", gameSFX[1]],
  SFX2: ["", gameSFX[2]],
  SFX3: ["", gameSFX[2]],
};

export const bestScores = {
  Blitz: [
    parseInt(localStorage.getItem("bestScore1")),
    parseInt(localStorage.getItem("bestScore2")),
    parseInt(localStorage.getItem("bestScore3")),
    parseInt(localStorage.getItem("bestScore4")),
    parseInt(localStorage.getItem("bestScore5")),
  ],
  Standard: [
    parseInt(localStorage.getItem("bestScore1_Standard")),
    parseInt(localStorage.getItem("bestScore2_Standard")),
    parseInt(localStorage.getItem("bestScore3_Standard")),
    parseInt(localStorage.getItem("bestScore4_Standard")),
    parseInt(localStorage.getItem("bestScore5_Standard")),
  ],
  Marathon: [
    parseInt(localStorage.getItem("bestScore1_Marathon")),
    parseInt(localStorage.getItem("bestScore2_Marathon")),
    parseInt(localStorage.getItem("bestScore3_Marathon")),
    parseInt(localStorage.getItem("bestScore4_Marathon")),
    parseInt(localStorage.getItem("bestScore5_Marathon")),
  ],
};
// export const channels = [
//   sound.Music,
//   sound.AnnVoice,
//   sound.SFX0[1],
//   sound.SFX1[1],
//   sound.SFX2[1],
//   sound.SFX3[1],
// ];

// for (let i = 0; i < channels.length; i++) {
//   channels[i].gain.value = 0;
// }

export let game = {
  // use let instead of export const to revert to resetGameVar
  mode: "arcade",
  controller: null,
  cursor: { x: 2, y: 6 },
  cursor_type: "legalCursorDown",
  humanCanPlay: true,
  swapTimer: 5,
  rise: 0,
  board: [],
  mute: 0,
  volume: 1,
  level: 1,
  timeControl: 2,
  timeControlName: "Blitz",
  highScoresList: bestScores.Blitz,
  playRecording: false,
  boardRiseSpeed: preset.speedValues[1],
  blockClearTime: preset.clearValues[1],
  blockBlinkTime: preset.blinkValues[1],
  blockPopMultiplier: preset.popMultiplier[1],
  blockInitialFaceTime: preset.faceValues[1],
  blockStallTime: preset.stallValues[1],
  blockSelectedXCHANGE: 2,
  blockSelectedYCHANGE: 6,
  boardRiseRestarter: 0,
  deathTimer: 100,
  raiseDelay: 0,
  raiseCap: 180,
  frames: -180,
  finalTime: 0,
  seconds: 0,
  minutes: 0,
  countdownSeconds: 0,
  countdownMinutes: 0,
  pastSeconds: 0,
  timeString: "0:00",
  score: 0,
  scoreEarned: 0,
  scoreMultiplier: 1,
  chainScoreAdded: 0,
  clearingSets: {
    coord: [],
    scores: [],
  },
  previousChainScore: 0,
  drawScoreTimeout: 0,
  currentChain: 0,
  combo: 0,
  linesRaised: 0,
  lastChain: 0,
  previousChain: 0,
  largestChain: 0,
  speedUpTimers: false,
  largestChainScore: 0,
  largestCombo: 0,
  totalClears: 0,
  paused: false,
  over: false, //gameOver
  pauseStack: false,
  addToPrimaryChain: false, // used to start/continue a chain
  message: "",
  defaultMessage: "Welcome to Blockle!",
  messagePriority: "",
  messageChangeDelay: 90,
  highScore: HIGH_SCORE,
  boardRiseDisabled: false,
  disableSwap: false,
  disableRaise: false,
  currentlyQuickRaising: false,
  flashDangerColumns: false, // 10-2-22 used to warn player not to kill self
  swapPressed: false,
  raisePressed: false,
  readyForNewRow: false,
  highestRow: 11,
  highestCols: [0, 1, 2, 3, 4, 5],
  nextBlockIdNum: 1,
  frameMod: {},
  panicIndex: 1,
  panicAnimate: {},
  Music: gameMusic,
  SFX0: gameSFX[0],
  SFX1: gameSFX[1],
  SFX2: gameSFX[2],
  data: {},
  log: [],
  panicking: false,
  version: 1,
  boardHasClearingBlock: false,
  boardHasAirborneBlock: false,
  boardHasSwappingBlock: false,
  boardHasStallingBlock: false,
  boardHasLandingBlock: false,
  boardHasTargets: true,
  VacantBlock: {},
  tutorialRunning: false,
  stickyJingleAllowed: true,
  holdItSoundAllowed: true,
};

export const helpPlayer = {
  timer: 300,
  forceHint: 0,
  hintVisible: false,
};

export const lastIndex = {
  music: -1,
  overtimeMusic: -1,
};

export const touchInputs = {};

export const newGame = JSON.parse(JSON.stringify(game));

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
  unrankedReason: "",
  gameSpeed: 1,
  fps: 0,
  prev: 0,
  secondsPerLoop: 1,
  startingLoopTime: 0,
  slowdownTracker: 0,
  drawsPerSecond: 60, // not used yet
  drawDivisor: 1,
  realTime: 0,
  gameStartTime: 0,
  pauseStartTime: 0,
  pauseTimeout: 0,
  sumOfPauseTimes: 0,
  fpsInterval: 1000 / 60,
  frameTarget: 60,
  frameTargetTimeStart: 0,
  frameTargetTimeEnd: 0,
  then: 0,
  now: 0,
  delta: 0,
  realTimeDiff: 0,
  lostFocusTimeStamp: 0,
};

export const funcTimestamps = {
  drawGrid: {},
  swapBlock: {},
  checkMatch: {},
  updateGrid: {},
  gravity: {},
  createNewRow: {},
  isChainActive: {},
};

export const funcTimestampList = Object.values(funcTimestamps);

funcTimestampList.forEach((funcTimestamp) => {
  funcTimestamp.begin = 0;
  funcTimestamp.end = 0;
  funcTimestamp.lastFrameCompletionSpeed = 0;
  funcTimestamp.fastestFrame = {
    completionSpeed: 1000000,
    theFrame: -1000,
  };
  funcTimestamp.slowestFrame = {
    completionSpeed: 0,
    theFrame: -1000,
  };
});

export const debug = {
  enabled: 0,
  clickCounter: 0,
  slowdown: 0,
  freeze: 0,
  show: 0,
  updateGameState: false,
  advanceOneFrame: false,
};

export const saveState = {
  chainStart: {},
  lastMatch: {},
  lastSwap: {},
  selfSave: {},
};

export const cpu = {
  enabled: 0,
  control: 0,
  cursorSpeedDivisor: 2,
  showInfo: 0,
  showFakeCursorPosition: false,
  up: false,
  down: false,
  left: false,
  right: false,
  swap: false,
  inputType: "digital",
  swapSuccess: false,
  pause: false,
  prevTargetX: 5,
  prevTargetY: 5,
  targetCoord: 0,
  targetY: 0,
  directionToMove: 1,
  destination: [],
  blockToSelect: [],
  targetColor: sprite.debugRed,
  userChangedSpeed: 0,
  holeDetectedAt: [0, 0],
  matchList: [],
  matchStrings: [],
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
export const essentialLoadedAudios = [];

export let audioLoadedPercentage = 0;

// Preload all audios, then play them at zero volume.
export function checkIfAudioLoaded(audioFileList) {
  let preloadedAudios = 0;
  for (let i = 0; i < loadedAudios.length; i++) {
    let audioObj = loadedAudios[i];
    if (audioObj.readyState == 4 && i < audioFileList.length) {
      preloadedAudios++;
      audioLoadedPercentage = Math.floor(
        (100 * preloadedAudios) / audioFileList.length
      );
    }
  }
  if (audioLoadedPercentage === 100) {
    return true;
  }
  return false;
}

export function loadAudios(numOfEssentialAudioFiles) {
  // let [indexStart, indexEnd] = [0, audioList.length];
  for (let i = 0; i < audioList.length; i++) {
    let sfx = new Audio();
    sfx.src = audioList[i];
    sfx.preload = "auto";
    loadedAudios.push(sfx);
    if (i < numOfEssentialAudioFiles) essentialLoadedAudios.push(sfx);
    objectOfAudios[audioList[i]] = sfx;
  }
}

// currently 32 essential game audio
// loadAudios(32)
loadAudios(audioList.length);

for (let i = 1; i <= 5; i++) {
  if (localStorage.getItem(`bestScore${i}`) == null) {
    console.log(`creating item for bestScore ${i}`);
  }
}

if (localStorage.getItem(`username`) == null) {
  localStorage.setItem("username", "Enter Name Here");
}

export function changeAllBlockProperties(propertiesObj, excludeDark = true) {
  let properties = Object.keys(propertiesObj);
  let values = Object.values(propertiesObj);
  let stoppingPoint = excludeDark ? grid.ROWS : grid.ROWS + 2;
  for (let x = 0; x < grid.COLS; x++) {
    for (let y = 0; y < stoppingPoint; y++) {
      for (let i = 0; i < properties.length; i++) {
        let [property, value] = [properties[i], values[i]];
        game.board[x][y][property] = value;
      }
    }
  }
}

export function randInt(
  max,
  firstElementSkewed = false,
  ignoreIndex = -1,
  title = ""
) {
  // if (debug.enabled) console.log(max, firstElementSkewed, ignoreIndex, title);
  let done = false;
  let randomIndexSelected = -2;
  win.loopCounter = 0;
  while (!done) {
    win.loopCounter++;
    if (detectInfiniteLoop("randInt", win.loopCounter)) break;
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
  } // end while

  if (title) lastIndex[title] = randomIndexSelected;
  // if (debug.enabled && title === "music")
  //   console.log("random music ind selected: ", randomIndexSelected);
  return randomIndexSelected;
}

export function updateFrameMods(frameCount) {
  game.frameMod[2] = frameCount % 2;
  game.frameMod[3] = frameCount % 3;
  game.frameMod[4] = frameCount % 4;
  game.frameMod[6] = frameCount % 6;
  game.frameMod[12] = frameCount % 12;
  game.frameMod[18] = frameCount % 18;
  game.frameMod[20] = frameCount % 20;
  game.frameMod[30] = frameCount % 30;
  game.frameMod[40] = frameCount % 40;
  game.frameMod[60] = frameCount % 60;
  game.frameMod[180] = frameCount % 180;
}

export function getRow(row, colorsOnly = true) {
  let arr = [];
  for (let c = 0; c < grid.COLS; c++) {
    if (colorsOnly) arr.push(game.board[c][row].color);
    else arr.push(game.board[c][row]);
  }
  return arr;
}

export function padInt(integer, digits = 2) {
  // default pad 2 digits, with a single 0 in front (02)
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
  if (Square === undefined) return false;
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

export function detectInfiniteLoop(functionName, loopCounter) {
  if (loopCounter > 2000) {
    displayMessage(`Infinite loop in ${functionName} detected. Closing Game.`);
    console.log(`Infinite loop in ${functionName} detected`);
    debug.enabled = true;
    pause();
    win.running = false;
    return true;
  }
  return false;
}

export function vacantBlockBelow(Square) {
  for (let j = Square.y + 1; j < grid.ROWS - 1; j++) {
    if (game.board[Square.x][j].color === "vacant") {
      return true;
    }
  }
  return false;
}

export function spawnSquare(digit) {
  let Square = game.board[game.cursor.x][game.cursor.y];
  Square.tutorialSelectable = true;
  if (digit < PIECES.length) Square.color = PIECES[digit];
  // else if (digit == PIECES.length)
  //   Square.color = `unmatchable${Square.x}${Square.y}`;
  else if (digit == 8 && game.mode === "tutorial") {
    game.board[0][grid.ROWS].timer = 30;
  } else if (digit == 9 && game.mode === "tutorial") {
    console.log("give fire");
    game.board[1][grid.ROWS].timer = 30;
  } else Square.color = "vacant";
}

export function transferProperties(FirstBlock, SecondBlock, type) {
  // do not transfer x, y, or targetCoord
  let FirstKeys = Object.keys(FirstBlock).splice(2); // dont change x, y, num
  let SecondKeys = Object.keys(SecondBlock).splice(2); // dont change x y, num
  let TempBlock;

  if (type === "between") {
    TempBlock = JSON.parse(JSON.stringify(SecondBlock));
  }

  // always transfer 1st block to second block
  // SecondKeys.forEach((key) => (SecondBlock[key] = FirstBlock[key]));
  for (let i = 0; i < SecondKeys.length; i++) {
    let key = SecondKeys[i];
    SecondBlock[key] = FirstBlock[key];
  }
  if (type === "to") {
    // FirstKeys.forEach((key) => (FirstBlock[key] = game.VacantBlock[key]));
    for (let i = 0; i < FirstKeys.length; i++) {
      let key = FirstKeys[i];
      FirstBlock[key] = game.VacantBlock[key];
    }
  } else if (type === "between") {
    // FirstKeys.forEach((key) => (FirstBlock[key] = TempBlock[key]));
    for (let i = 0; i < FirstKeys.length; i++) {
      let key = FirstKeys[i];
      FirstBlock[key] = TempBlock[key];
    }
    if (
      (FirstBlock.swapType === "h" && FirstBlock.targetCoord > FirstBlock.x) ||
      (FirstBlock.swapType === "v" && FirstBlock.targetCoord > FirstBlock.y)
    ) {
      console.log("preventing infinite swap loop");
      FirstBlock.targetCoord = undefined;
    }
  }

  if (helpPlayer.timer === 0) {
    cpu.matchStrings.length = 0;
    for (let i = 0; i < cpu.matchList.length; i++) {
      cpu.matchStrings.push(`${cpu.matchList[i]}`);
      let [xHint, yHint] = cpu.matchList[i];
      if (FirstBlock.x === xHint && FirstBlock.y === yHint) {
        cpu.matchList[i] = [SecondBlock.x, SecondBlock.y];
        cpu.matchStrings[i] = `${cpu.matchList[i]}`;
      } else if (SecondBlock.x === xHint && FirstBlock.y === yHint) {
        cpu.matchList[i] = [FirstBlock.x, FirstBlock.y];
        cpu.matchStrings[i] = `${cpu.matchList[i]}`;
      }
    }
  }
}

export function removeFromOrderList(TargetSquare) {
  if (TargetSquare.swapType === "h") {
    for (let c = 0; c < grid.COLS; c++) {
      if (game.board[c][TargetSquare.y].targetCoord === TargetSquare.x) {
        game.board[c][TargetSquare.y].targetCoord = undefined;
        game.board[c][TargetSquare.y].swapType = "";
        break;
      }
    }
  } else if (TargetSquare.swapType === "v") {
    for (let r = 0; r < grid.ROWS; r++) {
      if (game.board[TargetSquare.x][r].targetCoord === TargetSquare.y) {
        game.board[TargetSquare.x][r].targetCoord = undefined;
        game.board[TargetSquare.x][r].swapType = "";
        break;
      }
    }
  }

  for (let i = 0; i < touch.moveOrderList.length; i++) {
    let order = touch.moveOrderList[i];
    if (TargetSquare.x === order[0] && TargetSquare.y === order[1]) {
      touch.moveOrderList.splice(i, 1);
      if (debug.enabled) {
        console.log(
          game.frames,
          TargetSquare.x,
          TargetSquare.y,
          "removed,",
          "Remaining order list: from order list",
          touch.moveOrderList
        );
      }
      break;
    }
  }
}

export function randomPiece(level) {
  // if (level < 3) return PIECES[randInt(PIECES.length - 1)];
  return PIECES[randInt(PIECES.length)];
}

export function updateFunctionMaxMinTimestamps() {
  funcTimestampList.forEach((funcObj) => {
    if (
      funcObj.lastFrameCompletionSpeed < funcObj.fastestFrame.completionSpeed
    ) {
      funcObj.fastestFrame.completionSpeed = funcObj.lastFrameCompletionSpeed;
      funcObj.fastestFrame.theFrame = game.frames;
    }
    if (
      funcObj.lastFrameCompletionSpeed > funcObj.slowestFrame.completionSpeed
    ) {
      funcObj.slowestFrame.completionSpeed = funcObj.lastFrameCompletionSpeed;
      funcObj.slowestFrame.theFrame = game.frames;
    }
  });
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
// SecondBlock.availForPrimaryChain = tempPropertiesgrid.COLS-1;

// 2 minute preset
// export const preset = {
//   //            00, 00, 20, 40, 60,80,100,120,08,09,10
//   speedValues: [59, 48, 34, 20, 12, 8, 6, 2, 2, 2, 1],
//   clearValues: [200, 100, 88, 76, 68, 56, 42, 36, 28, 20, 16],
//   blinkValues: [120, 60, 54, 48, 42, 36, 28, 24, 16, 12, 8],
//   multValues: [1, 1, 1.25, 1.5, 2, 2.25, 2.5, 3, 3.25, 3.5, 4],
//   faceValues: [80, 40, 34, 28, 26, 20, 16, 12, 12, 8, 8],
//   popMultiplier: [20, 10, 10, 10, 8, 8, 8, 6, 6, 6, 6],
//   stallValues: [20, 20, 18, 16, 14, 14, 14, 12, 12, 12, 12],
//   controlsDefaultMessage: "",
// };

// 3 minute preset
// speedValues: [59, 48, 24, 12, 10, 6, 4, 2, 2, 2, 1],
// clearValues: [200, 100, 88, 76, 68, 56, 42, 36, 28, 20, 16],
// blinkValues: [120, 60, 54, 48, 42, 36, 28, 24, 16, 12, 8],
// multValues: [1, 1, 1.25, 1.5, 2, 2.25, 2.5, 3, 3.25, 3.5, 4],
// faceValues: [80, 40, 34, 28, 26, 20, 16, 12, 12, 8, 8],
// popMultiplier: [20, 10, 10, 10, 8, 8, 8, 6, 6, 6, 6],
// stallValues: [20, 20, 18, 16, 14, 14, 14, 12, 12, 12, 12],
// controlsDefaultMessage: ""
