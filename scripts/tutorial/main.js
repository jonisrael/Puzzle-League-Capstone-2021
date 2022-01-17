import { blockType, cpu, game, PIECES, randInt } from "../global";
import { newBlock, updateLevelEvents } from "../../puzzleleague";
import { fixNextDarkStack } from "../functions/startGame";
import { tutorialBoards } from "./tutorialBoards";
import { tutorialInputs } from "./tutorialInputs";

const COLS = 6;
const ROWS = 12;

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
