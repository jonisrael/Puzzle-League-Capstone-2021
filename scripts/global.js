import { audio, audioList } from "./fileImports";

const announcer = {
  openingDialogue: [
    audio.announcerAreYouReady,
    audio.announcerLetsGetStarted,
    audio.announcerReady
  ],
  comboDialogue: [
    audio.announcerBeautiful,
    audio.announcerFantasticCombo,
    audio.announcerThereItIs,
    audio.announcerPayoff,
    audio.announcerClear,
    audio.announcerNowsYourChance
  ],
  smallChainDialogue: [
    audio.announcerBeautiful,
    audio.announcerWhatARush,
    audio.announcerIncredibleCantBelieve
  ],
  mediumChainDialogue: [
    audio.announcerMovesLikeThat,
    audio.announcerWhereComeFrom
  ],
  largeChainDialogue: [
    audio.announcerAnythingLike,
    audio.announcerComboIntense,
    audio.announcerPerfect
  ],
  timeTransitionDialogue: [
    audio.announcerTimeMarchesOn,
    audio.announcerLetsKeepItUp,
    audio.announcerPickUpPace
  ],
  hurryUpDialogue: [
    audio.announcerTenSeconds,
    audio.announcerAllBoilsDown,
    audio.announcerNotMuchTimeLeft
  ],
  panicDialogue: [
    audio.announcerHowMuchLonger,
    audio.announcerIsItTheEnd,
    audio.announcerCallThisOne,
    audio.announcerFatLadySing,
    audio.announcerItAintOver
  ],
  overtimeDialogue: [
    audio.announcerBringUsHome,
    audio.announcerIHopeReady,
    audio.announcerBattleOfEndurance
  ],
  endgameDialogue: [
    audio.announcerDeservePraise,
    audio.announcerTraining,
    audio.announcerNeverForgetEvent,
    audio.announcerOnlyWordWorthy,
    audio.announcerWatchChampBask
  ],
  openingIndexLastPicked: -1, // These are used to minimize repeat dialogues
  smallChainIndexLastPicked: -1,
  mediumChainIndexLastPicked: -1,
  largeChainIndexLastPicked: -1,
  timeTransitionIndexLastPicked: -1,
  hurryUpIndexLastPicked: -1,
  panicIndexLastPicked: -1,
  overtimeIndexLastPicked: -1,
  endgameIndexLastPicked: -1
};

const blockColor = {
  BLUE: "blue",
  CYAN: "cyan",
  GREEN: "green",
  PURPLE: "purple",
  RED: "red",
  YELLOW: "yellow",
  VACANT: "vacant"
};

const blockType = {
  NORMAL: "normal",
  FACE: "face",
  DARK: "dark",
  DEAD: "dead",
  CLEARING: "clearing",
  LANDING: "landing",
  PANICKING: "panicking"
};

const PIECES = [
  blockColor.CYAN,
  blockColor.GREEN,
  blockColor.PURPLE,
  blockColor.RED,
  blockColor.YELLOW,
  blockColor.BLUE
];

const INTERACTIVE_PIECES = [
  blockType.NORMAL,
  blockType.LANDING,
  blockType.PANICKING
];

const grid = {
  COLS: 6,
  ROWS: 12,
  SQ: 32
};

// Old values  00, 00, 20, 40, 60,80,100,120,08,09,10
// speedValues: [40, 20, 15, 12, 10,  6,   4, 2,  2,  2, 1],
// clearValues: [60, 50, 45, 40, 35, 30, 25, 20, 16, 12, 8], // iterate twice
// stallValues: [16, 12, 11, 10,  9,  8,  7,  6,  5,  4, 6]

const preset = {
  //            00, 00, 20, 40, 60,80,100,120,08,09,10
  speedValues: [60, 48, 34, 20, 12, 8, 6, 2, 2, 2, 1],
  clearValues: [60, 60, 54, 48, 42, 36, 30, 24, 20, 16],
  stallValues: [30, 20, 18, 16, 14, 14, 14, 12, 12, 12]
};

if (localStorage.getItem("highScore") === null) {
  localStorage.setItem("highScore", "1000");
}
let HIGH_SCORE = parseInt(localStorage.getItem("highScore"));
let gameMusic = new Audio();

const win = {
  view: "Home",
  viewChanged: false,
  running: false,
  restartGame: false,
  makeCanvas: null,
  cvs: null,
  ctx: null,
  mainInfoDisplay: null,
  fpsDisplay: null,
  statDisplay: null,
  scoreHeader: null,
  scoreDisplay: null,
  chainDisplay: null,
  timeHeader: null,
  timeDisplay: null,
  levelHeader: null,
  levelDisplay: null,
  highScoreDisplay: null,
  gameOverMessage: null,
  form: null,
  leaderboardInfo: "Fetching Leaderboards...",
  muteAnnouncer: document.getElementById("mute-announcer"),
  muteMusic: document.getElementById("mute-music"),
  muteSFX: document.getElementById("mute-sfx")
};

const game = {
  // use let instead of const to revert to resetGameVar
  mode: "arcade",
  cursor: null,
  rise: 0,
  board: [],
  mute: 0,
  volume: 1,
  level: 1,
  boardRiseSpeed: preset.speedValues,
  blockClearTime: preset.clearValues,
  blockStallTime: preset.stallValues,
  raiseDelay: 0,
  frames: -180,
  finalTime: 0,
  seconds: 0,
  minutes: 0,
  score: 0,
  scoreMultiplier: 1,
  chainScoreAdded: 0,
  currentChain: 0,
  combo: 0,
  lastChain: 0,
  largestChain: 0,
  largestCombo: 0,
  totalClears: 0,
  paused: false,
  over: false, //gameOver
  grounded: true,
  addToPrimaryChain: false, // used to start/continue a chain
  message: "",
  defaultMessage: "",
  messageChangeDelay: 90,
  highScore: HIGH_SCORE,
  disableRaise: false,
  disableSwap: false,
  quickRaise: false,
  raisePressed: false,
  readyForNewRow: false,
  Music: gameMusic,
  data: {}
};

const action = {
  up: false,
  down: false,
  left: false,
  right: false,
  swap: false,
  quickRaise: false,
  pause: false
};

const api = {
  data: "",
  serverLeaderboardData: []
};

const chainLogic = {
  addToPrimaryChain: false // used to start/continue a chain
};

const performance = {
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
  diffFromRealTime: 0
};

const debug = {
  enabled: 0,
  slowdown: 0,
  freeze: 0,
  show: 0,
  frameAdvance: false
};

const leaderboard = {
  rankedSize: 0,
  unrankedSize: 0,
  minRankedScore: 0,
  topRankedList: [],
  minUnrankedScore: 0
};

const loadedAudios = [];

// Preload all audios, then play them at zero volume.
export function loadAllAudios() {
  for (let i = 0; i < audioList.length; i++) {
    let audio = new Audio();
    audio.src = audioList[i];
    audio.volume = 0;
    audio.play();
    loadedAudios[i] = audio;
  }
}

export function randInt(max) {
  return Math.floor(Math.random() * max);
}

// a
// a
// a

export {
  announcer,
  blockColor,
  blockType,
  PIECES,
  INTERACTIVE_PIECES,
  win,
  grid,
  game,
  action,
  preset,
  api,
  chainLogic,
  performance,
  loadedAudios,
  debug,
  leaderboard
};
