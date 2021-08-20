import { audio } from "./fileImports";

const announcer = {
  comboDialogue: [
    audio.announcerBeautiful,
    audio.announcerFantasticCombo,
    audio.announcerThereItIs,
    audio.announcerPayoff,
    audio.announcerClear
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
  highChainDialogue: [
    audio.announcerAnythingLike,
    audio.announcerComboIntense,
    audio.announcerNeverForgetEvent
  ],
  timeTransitionDialogue: [
    audio.announcerTimeMarchesOn
    // audio.announcerAllBetsOff
  ],
  hurryUpDialogue: [audio.announcerTenSeconds, audio.announcerAllBoilsDown],
  panicDialogue: [
    audio.announcerHowMuchLonger,
    audio.announcerIsItTheEnd,
    audio.announcerCallThisOne,
    //audio.announcerFatLady
    audio.announcerItAintOver
  ],
  overtimeDialogue: [
    audio.announcerBringUsHome,
    audio.announcerIHopeReady
    // audio.announcerWorldHoldingBreath,
  ],
  newHighScore: [
    audio.announcerDeservePraise,
    audio.announcerTraining
    // audio.announcerOnlyWordWorthy
  ]
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

const win = {
  running: false,
  makeCanvas: null,
  cvs: null,
  ctx: null
};

const grid = {
  COLS: 6,
  ROWS: 12,
  SQ: 32
};

const preset = {
  speedValues: [60, 20, 15, 12, 10, 6, 4, 2, 2, 2, 1],
  clearValues: [60, 50, 45, 40, 35, 30, 25, 20, 16, 12, 8], // iterate twice
  stallValues: [24, 12, 11, 10, 9, 8, 7, 6, 5, 4, 6]
};

if (localStorage.getItem("highScore") === null) {
  localStorage.setItem("highScore", "1000");
}
let HIGH_SCORE = parseInt(localStorage.getItem("highScore"));
let gameMusic = new Audio();

const game = {
  rise: 0,
  board: [],
  mute: 0,
  volume: 1,
  level: 1,
  boardRiseSpeed: preset.speedValues,
  blockClearTime: preset.clearValues,
  blockStallTime: preset.stallValues,
  pause: 0,
  raiseDelay: 0,
  frames: 0,
  seconds: 0,
  minutes: 0,
  score: 0,
  scoreMultiplier: 1,
  currentChain: 0,
  combo: 0,
  lastChain: 0,
  highestChain: 0,
  over: false, //gameOver
  grounded: true,
  addToPrimaryChain: false, // used to start/continue a chain
  highScore: HIGH_SCORE,
  disableRaise: false,
  disableSwap: false,
  quickRaise: false,
  raisePressed: false,
  Music: gameMusic
};

const api = {
  database: [],
  data: [],
  dateTimeAPI: []
};

const chainLogic = {
  addToPrimaryChain: false // used to start/continue a chain
};

const performance = {
  gameSpeedDoubled: false,
  gameSpeed: 1,
  fps: 0,
  prev: 0,
  secondsPerLoop: 1,
  slowdownTracker: 0,
  drawsPerSecond: 60, // not used yet
  drawDivisor: 1
};

const debug = {
  enabled: 0
};

function randInt(max) {
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
  preset,
  api,
  chainLogic,
  performance,
  randInt,
  debug
};
