import { blockType, cpu, game, PIECES, randInt } from "../global";
import { newBlock, updateLevelEvents } from "../../puzzleleague";
import { fixNextDarkStack, generateOpeningBoard } from "../functions/startGame";
import { tutorialBoard, tutorialInputs } from "./tutorialScript";
const COLS = 6;
const ROWS = 12;

// const smallBoard = generateOpeningBoard(24, 4);

const openingBoard = [
  [0, ROWS - 1, "cyan"],
  [0, ROWS - 2, "cyan"],
  [0, ROWS - 3, "red"],
  [0, ROWS - 4, "green"],
  [0, ROWS - 5, "red"],

  [1, ROWS - 1, "yellow"],
  [1, ROWS - 2, "purple"],
  [1, ROWS - 3, "purple"],

  [2, ROWS - 1, "purple"],
  [2, ROWS - 2, "green"],
  [2, ROWS - 3, "red"],
  [2, ROWS - 4, "cyan"],
  [2, ROWS - 5, "cyan"],
  [2, ROWS - 6, "yellow"],

  [3, ROWS - 1, "purple"],
  [3, ROWS - 2, "green"],
  [3, ROWS - 3, "red"],
  [3, ROWS - 4, "purple"],

  [4, ROWS - 1, "yellow"],
  [4, ROWS - 2, "purple"],
];

export const tutorialBoards = [
  [],
  // smallBoard,
  openingBoard,
  [
    [0, ROWS - 1, "cyan"],
    [0, ROWS - 2, "cyan"],
    [0, ROWS - 3, "red"],
    [0, ROWS - 4, "green"],
    [0, ROWS - 5, "red"],

    [2, ROWS - 1, "yellow"],
    [2, ROWS - 2, "green"],
    [2, ROWS - 3, "red"],
    [2, ROWS - 4, "cyan"],
    [2, ROWS - 5, "cyan"],
    [2, ROWS - 6, "yellow"],

    [3, ROWS - 1, "purple"],
    [3, ROWS - 2, "green"],
    [3, ROWS - 3, "red"],
    [3, ROWS - 4, "purple"],

    [4, ROWS - 1, "yellow"],
    [4, ROWS - 2, "purple"],
  ],

  [
    [0, ROWS - 1, "cyan"],
    [0, ROWS - 2, "cyan"],
    [0, ROWS - 3, "red"],
    [1, ROWS - 1, "green"],
    [1, ROWS - 2, "red"],

    [2, ROWS - 1, "yellow"],
    [2, ROWS - 2, "green"],
    [2, ROWS - 3, "red"],
    [2, ROWS - 4, "cyan"],
    [2, ROWS - 5, "cyan"],
    [2, ROWS - 6, "yellow"],

    [3, ROWS - 1, "purple"],
    [3, ROWS - 2, "green"],
    [3, ROWS - 3, "red"],
    [3, ROWS - 4, "purple"],

    [4, ROWS - 1, "yellow"],
    [4, ROWS - 2, "purple"],
  ],

  [[0, ROWS - 1, "red"]],
  [[0, ROWS - 1, "red"]],
];

const tasdfutorialInputs = [
  {
    100: "down",
    115: "down",
    130: "left",
    145: "down",
    160: "down",
    175: "down",
    190: "swap", // wait 120 frames for clear
  },
  {
    340: "left",
    350: "up",
    360: "up",
    370: "up",
    380: "swap", // failed clear 1
    425: "swap", // failed clear 2
  },
  {
    470: "down", // may set the level to 0 here for chain
    490: "swap", // clear1
    520: "down",
    530: "swap", // aligning block
    540: "right",
    550: "swap", // aligning block
    560: "down",
    570: "left",
    580: "swap",
    590: "right",
    600: "swap",
    660: "right",
    675: "right",
    690: "swap",
    780: "left",
    790: "up",
    800: "swap",
  },
  {
    960: "down",
    990: "raise",
    1020: "raise",
    1040: "raise",
    1060: "raise",
    1080: "raise",
    1100: "raise",
  },
];

const tuttorialInputs = {
  100: "down",
  115: "down",
  130: "left",
  145: "down",
  160: "down",
  175: "down",
  190: "swap", // wait 120 frames for clear

  340: "left",
  350: "up",
  360: "up",
  370: "up",
  380: "swap", // failed clear 1
  425: "swap", // failed clear 2

  470: "down", // may set the level to 0 here for chain
  490: "swap", // clear1
  520: "down",
  530: "swap", // aligning block
  540: "right",
  550: "swap", // aligning block
  560: "down",
  570: "left",
  580: "swap",
  590: "right",
  600: "swap",
  660: "right",
  675: "right",
  690: "swap",
  780: "left",
  790: "up",
  800: "swap",

  960: "down",
  990: "raise",
  1020: "raise",
  1040: "raise",
  1060: "raise",
  1080: "raise",
  1100: "raise",
};

const moveScript = {
  "80": [2, ROWS - 5],
  "90": [2, ROWS - 4],
  "100": [1, ROWS - 4],
  "112": [1, ROWS - 3],
  "124": [1, ROWS - 2],
  "136": [1, ROWS - 1],
  // swap occurs frame 160, wait 90 frames (clear1)

  "250": [0, ROWS - 1],
  "262": [0, ROWS - 2],
  "274": [0, ROWS - 3],
  "286": [0, ROWS - 4],
  // swap occurs frame 310, wait 60 for fail 1 explanation
  x: [0, ROWS - 3],

  // swap occurs
  // wait
  // swap occurs (clear1)

  // x: [0, ROWS - 2],
  // // quick swap occurs, goto location
  // x: [1, ROWS - 2],
  // // quick swap occurs, hit location
  // x: [1, ROWS - 1],
  // x: [0, ROWS - 1],
  // // quick swap occurs, goto location
  // x: [1, ROWS - 1],
  // // quick swap occurs, hit location
  // // chain2 occurs

  // x: [2, ROWS - 1],
  // x: [3, ROWS - 1],
  // // swap occurs, wait for chain3
  // //chain3 occurs
  // x: [2, ROWS - 1],
  // x: [2, ROWS - 2],
  // // final swap makes the chain4.
};

const swapScript = {};

export function runTutorialScript(input, frame) {
  let thisFrameInput = tutorialInputs[frame];
  if (thisFrameInput !== undefined) {
    input[thisFrameInput] = true;
  }
  if (frame == Object.keys(tutorialInputs).pop()) {
    updateLevelEvents(1);
    cpu.control = true;
  }
  return input;
}

export function createTutorialBoard(colorLocations) {
  let block;
  for (let c = 0; c < COLS; c++) {
    game.board.push([]);
    for (let r = 0; r < ROWS + 2; r++) {
      block = newBlock(c, r);
      game.board[c].push(block);
      if (r > ROWS - 1) {
        game.board[c][r].color = PIECES[randInt(PIECES.length)];
        game.board[c][r].type = blockType.DARK;
      } else {
        colorLocations.forEach((arr) => {
          let [locX, locY, definedColor] = arr;
          if (c == locX && r == locY) {
            game.board[c][r].color = definedColor;
          }
        });
      }
      block.draw();
    }
  }
  fixNextDarkStack();
  return game.board;
}
