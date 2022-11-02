import { audio } from "../../fileImports";
import { playAudio } from "../../functions/audioFunctions";
import { closeGame } from "../../functions/gameOverFunctions";
import { startGame } from "../../functions/startGame";
import { game, grid, win } from "../../global";
import { tutorialMessages } from "../tutorialMessages";
import {
  flipAllLightsOff,
  flipLightOnBlocksWithNegativeTimer,
  flipLightsOnCol,
  flipLightsOnRow,
  makeBlockSelectable,
  tutorial,
} from "../tutorialScript";

// action 1-3 are messages
// action 4 is to clear the cyan blocks
// action 5 occurs as cyan blocks are clearing
// action 6 has the blocks indefinitely stall
// action 7 has same text box, but blocks will fall
// action 8 will have "2x" display.
// action 9 will be a compliment

export function tutorialEventsAtState_3() {
  const rows = grid.ROWS;
  game.boardRiseSpeed = -2;

  let action = game.board[0][rows]; // off screen hidden block used for reference
  if (action.timer === 0) {
    game.humanCanPlay = false;
    document.getElementById("pause-button").disabled = false;
    action.timer = -tutorial.msgIndex;
  }

  if (game.board[3][rows - 2].type === "blinking" && action.timer === -6) {
    // clear has just started
    tutorial.msgIndex++;
  }
  if (tutorial.msgIndex === 7 && game.board[3][rows - 3].type === "stalling") {
    // pause until user clicks
    flipLightsOnCol(3, [rows - 1, rows - 3, rows - 4], "on", false);
    // game.humanCanPlay = false;
    // document.getElementById("pause-button").disabled = false;
    tutorial.msgIndex++;
  }
  if (tutorial.msgIndex === 8) {
    // blocks indefinitely stall until user clicks next
    game.board[3][rows - 3].timer = 60;
    game.board[3][rows - 4].timer = 60;
    game.board[3][rows - 1].timer = 60;
    tutorial.msgIndex++; // used to skip msgIndex #8
  }

  if (tutorial.msgIndex === 9 && game.currentChain === 2) {
    tutorial.msgIndex++;
  }

  if (tutorial.msgIndex === 10 && game.currentChain === 0) {
    // chain has ended
    game.humanCanPlay = false;
    document.getElementById("pause-button").disabled = false;
    playAudio(audio.announcerPerfect);
    tutorial.msgIndex++;
  }

  if (action.timer !== -tutorial.msgIndex) {
    action.timer = -tutorial.msgIndex;
    console.log("load next board state:", tutorial.msgIndex);
    // the following switch script occurs when the next message occurs.
    switch (tutorial.msgIndex) {
      case 4:
        flipLightsOnCol(3, [rows - 1, rows - 3, rows - 4], "on", true);
        break;
      case 5:
        flipAllLightsOff();
        flipLightsOnRow([0, 3, 4], rows - 2, "on", true);
        break;
      case 6:
        game.humanCanPlay = true;
        document.getElementById("pause-button").disabled = true;
        game.board[0][rows].timer = -6;
        flipAllLightsOff();
        flipLightsOnRow([0, 3, 4], rows - 2, "on", false);
        makeBlockSelectable(0, rows - 2, 2);
        break;
      case 9:
        game.humanCanPlay = true;
        break;
    }
  }

  // game.humanCanPlay = false;
  // if (game.board[1][grid.ROWS].timer === 0) {
  //   console.log("set timer to 300");
  //   game.frames = 0;
  //   game.board[0][grid.ROWS].timer = 180;
  //   game.board[1][grid.ROWS].timer = -2;
  // }
  // let msgLength = tutorialMessages[2][0].length;
  // tutorialMessages[2][0] = tutorialMessages[2][0].slice(0, msgLength - 1);
  // tutorialMessages[2][0] += ` ${1 +
  //   Math.floor(game.board[0][grid.ROWS].timer / 60)}`;
  // if (game.board[0][grid.ROWS].timer === 0) {
  //   win.running = false;
  //   win.restartGame = true;
  //   closeGame(false);
  //   game.mode = "arcade";
  //   startGame(1);
  // }
}
