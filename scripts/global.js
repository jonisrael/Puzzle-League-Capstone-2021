import { audio, audioList } from "./fileImports";

export const announcer = {
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

export const blockColor = {
  BLUE: "blue",
  CYAN: "cyan",
  GREEN: "green",
  PURPLE: "purple",
  RED: "red",
  YELLOW: "yellow",
  VACANT: "vacant"
};

export const blockType = {
  NORMAL: "normal",
  FACE: "face",
  DARK: "dark",
  DEAD: "dead",
  CLEARING: "clearing",
  LANDING: "landing",
  PANICKING: "panicking"
};

export const PIECES = [
  blockColor.CYAN,
  blockColor.GREEN,
  blockColor.PURPLE,
  blockColor.RED,
  blockColor.YELLOW,
  blockColor.BLUE
];

export const INTERACTIVE_TYPES = [
  blockType.NORMAL,
  blockType.LANDING,
  blockType.PANICKING
];

export const grid = {
  COLS: 6,
  ROWS: 12,
  SQ: 32
};

// Old values  00, 00, 20, 40, 60,80,100,120,08,09,10
// speedValues: [40, 20, 15, 12, 10,  6,   4, 2,  2,  2, 1],
// clearValues: [60, 50, 45, 40, 35, 30, 25, 20, 16, 12, 8], // iterate twice
// stallValues: [16, 12, 11, 10,  9,  8,  7,  6,  5,  4, 6]

export const preset = {
  //            00, 00, 20, 40, 60,80,100,120,08,09,10
  speedValues: [60, 48, 34, 20, 12, 8, 6, 2, 2, 2, 1],
  clearValues: [60, 60, 54, 48, 42, 36, 30, 24, 20, 16, 12],
  stallValues: [30, 20, 18, 16, 14, 14, 14, 12, 12, 12, 10]
};

let HIGH_SCORE = parseInt(localStorage.getItem("highScore"));
let gameMusic = new Audio();

export const win = {
  patchNotesShown: false,
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
  muteSFX: document.getElementById("mute-sfx"),
  audioLoaded: false,
  controls: "arrow"
};

export const game = {
  // use let instead of export const to revert to resetGameVar
  mode: "arcade",
  cursor: null,
  rise: 0,
  board: [],
  mute: 0,
  volume: 1,
  level: 1,
  boardRiseSpeed: preset.speedValues[1],
  blockClearTime: preset.clearValues[1],
  blockStallTime: preset.stallValues[1],
  raiseDelay: 0,
  frames: -180,
  finalTime: 0,
  seconds: 0,
  minutes: 0,
  timeString: "",
  score: 0,
  scoreUpdate: 0,
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
  defaultMessage: "Welcome to Puzzle League!",
  messagePriority: "",
  messageChangeDelay: 90,
  highScore: HIGH_SCORE,
  disableRaise: false,
  disableSwap: false,
  quickRaise: false,
  raisePressed: false,
  readyForNewRow: false,
  highestRow: 0,
  highestColIndex: 0,
  Music: gameMusic,
  data: {},
  log: []
};

export const action = {
  up: false,
  down: false,
  left: false,
  right: false,
  swap: false,
  quickRaise: false,
  pause: false
};

export const api = {
  data: {
    month: "",
    day: "",
    year: "",
    hour: "",
    minute: "",
    meridian: ""
  }
};

export const chainLogic = {
  addToPrimaryChain: false // used to start/continue a chain
};

export const performance = {
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

export const debug = {
  enabled: 0,
  slowdown: 0,
  freeze: 0,
  show: 0,
  frameAdvance: false
};

export const cpu = {
  enabled: 0,
  control: 0,
  up: false,
  down: false,
  left: false,
  right: false,
  swap: false,
  quickRaise: false,
  pause: false,
  targetX: 0,
  targetY: 0,
  holeDetectedAt: [0, 0],
  matchList: [],
  transferToRight: 0
};

export const leaderboard = {
  data: [],
  canPost: true,
  userPostedName: "",
  userPostedScore: "",
  reason: ""
};

export const loadedAudios = [];

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
  parseInt(localStorage.getItem("bestScore5") || 100)
];

export function randInt(max) {
  return Math.floor(Math.random() * max);
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
