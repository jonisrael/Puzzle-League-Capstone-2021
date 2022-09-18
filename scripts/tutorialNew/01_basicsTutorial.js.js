import { game, grid, win } from "../global";
import { tutorial } from "./tutorialScript";

import * as tutorialFunction from "./tutorialScript";

let phase1BoardColors = [];
let phase2BoardColors = [
  [0, 3, "cyan"],
  [0, 4, "cyan"],
  [0, 5, "green"],
  [0, 6, "red", -2], // starting block
  [0, 7, "cyan"],
  [1, 2, "cyan"],
  [1, 3, "cyan"],
  [1, 4, "green"],
  [1, 5, "red", -2],
  [1, 6, "purple"],
  [1, 7, "red", -2],
  [2, 7, "yellow"],
  [4, 2, "purple"],
  [4, 3, "red"],
  [4, 4, "purple"],
  [4, 5, "red"],
  [4, 6, "purple"],
  [4, 7, "yellow"],
  [5, 3, "red"],
  [5, 4, "purple"],
  [5, 5, "red"],
  [5, 6, "yellow"],
  [5, 7, "yellow"],
];

let phase3BoardColors = [
  [2, 3, "green"],
  [2, 4, "purple"],
  [2, 5, "green"],
  [2, 6, "purple"],
  [2, 7, "green"],
  [3, 3, "purple"],
  [3, 4, "green"],
  [3, 5, "purple"],
  [3, 6, "green"],
  [3, 7, "purple"],
];

let tutorialBoard = {
  skip: "ZERO INDEX PLACEHOLDER",
};

let text = {};

function advanceState(newMessage, newType) {
  tutorial.message = newMessage;
  tutorial.type = newType;
  tutorial.advanceState = false;
}

function runEvents() {
  if (tutorial.phase === 1) eventsPhase1();
  else if (tutorial.phase === 2) eventsPhase2();
  // else if (tutorial.phase === 3) eventsPhase3();
}

function eventsPhase1() {
  if (tutorial.message === "") {
    tutorial.message = "Welcome, and thank you for trying my game!";
    tutorialFunction.createTutorialBoard(phase1BoardColors);
  }
  if (tutorial.advanceState) {
    let newMessage;
    tutorial.advanceState = false;
    if (tutorial.message.includes("Welcome")) {
      newMessage = "In this tutorial, we will learn how to move the cursor!";
    }
    if (tutorial.message.includes("we will learn how to")) {
      newMessage =
        "There are two different control styles -- Touch Controls and Keyboard.";
    }
    if (tutorial.message.includes("There are two different")) {
      if (win.mobile) {
        newMessage =
          "You are on a mobile device, so we will only go over Touch Controls.";
      } else {
        newMessage =
          "This game supports both, but there are more features with Touch Controls.";
      }
    }

    if (tutorial.message.includes("Touch Controls.")) {
      newMessage = "Let's get started!";
    }

    if (tutorial.message.includes("Let's get started")) {
      tutorial.phase = 2;
      newMessage = "";
    }
    tutorial.message = newMessage;
  }
}

function eventsPhase2() {
  let advanceButton = document.getElementById("pause-button");
  game.humanCanPlay = tutorial.type === "control";
  if (tutorial.message === "") {
    tutorial.message = "BASICS <br>(Click To Continue)";
    tutorialFunction.createTutorialBoard(phase2BoardColors, false);
  }
  if (tutorial.advanceState) {
    let newMessage = "";
    tutorial.advanceState = false;

    if (tutorial.message.includes("BASICS")) {
      newMessage =
        "To play, swap blocks horizontally left or right. Blocks will fall vertically.";
    }
    if (tutorial.message.includes("To play,")) {
      newMessage =
        "Match 3 of the same color to gain points. This is called a set.";
    }

    if (tutorial.message.includes("Match 3 of the")) {
      newMessage =
        "Go ahead and try it! Select a block by touching it, and hold your finger on it.";
      [game.cursor.x, game.cursor.y] = [grid.COLS / 2 - 1, grid.ROWS / 2 - 1];
      tutorialFunction.flipLightOnBlocksWithNegativeTimer(false);
      tutorialFunction.makeBlockSelectable(0, grid.ROWS - 2, 1);
    }

    if (tutorial.message.includes("Go ahead")) {
      // DO A THING TO GET THE ADVANCE STATE
      newMessage =
        "Good! Now drag the block over here and let go of the screen to move it";
    }
    if (tutorial.message.includes("Good! Now drag the block")) {
      newMessage = "The reds clear, and you gained some points! (10 per block)";
    }
    tutorial.message = newMessage;
    return "go to next text box";
  }

  if (tutorial.message.includes("Go ahead")) {
    if (game.cursor.x === 0 && game.cursor.y === grid.ROWS - 2) {
      tutorial.advanceState = true;
    }
  }
  if (tutorial.message.includes("Good! Now drag the block")) {
    if (game.board[1][grid.ROWS - 2].type === "BLINKING") {
      tutorial.advanceState = true;
    }
  }
}

[
  "BASICS <br>(Click To Continue)",
  "To play, swap blocks horizontally left or right. Blocks will fall vertically.", // 1
  "Match 3 of the same color to gain points. This is called a set.", // 2
  "Go ahead and try it! Select a block by touching it, and hold your finger on it.", // 3
  "Good! Now drag the block over here and let go of the screen to move it", // 4
  "Now they are clearing, and you gained 30 points!", // 5
  "Try clearing 4 at once by moving this block.",
  "Beautiful! 60 points!",
  "Now see if you can create a 5 set. But which cyan block should you move first?",
  "There it is! 90 points!",
  "Can you figure out how to create a clear 8?",
  "And there's the payoff! Look at all those points! Now for a challenge...",
];

///
///
function old() {
  let advanceButton = document.getElementById("pause-button");
  game.humanCanPlay = tutorial.msgIndex > 2;
  advanceButton.disabled = game.humanCanPlay;
  if (tutorial.msgIndex === 2 && game.cursor.x !== 0) {
    [game.cursor.x, game.cursor.y] = [grid.COLS / 2 - 1, grid.ROWS / 2 - 1];
    flipLightOnBlocksWithNegativeTimer(false);
    makeBlockSelectable(0, grid.ROWS - 2, 1);
    // flipLightSwitch(0, grid.ROWS - 2, "on", true, true);
  }
  if (tutorial.msgIndex === 3 && game.cursor.y === -1) {
    // user will now select blinking light
    flipAllLightsOff();
    flipLightSwitch(0, 6, "on", true);
    makeBlockSelectable(0, grid.ROWS - 2, 1);
  }
  if (tutorial.msgIndex === 3 && game.cursor.x === 0 && game.cursor.y === 6) {
    tutorial.msgIndex++;
    advanceButton.disabled = game.humanCanPlay;
  }
  // if (tutorial.msgIndex === 3 && game.board[1][grid.ROWS - 1].timer === -2) {
  //   flipLightOnBlocksWithNegativeTimer();
  //   tutorial.msgIndex++;
  // }
  if (tutorial.msgIndex === 4 && !game.board[0][grid.ROWS - 2].helpX) {
    // have user match now
    flipAllLightsOff();
    flipLightsOnCol(1, [5, 7], "on", false);
    flipLightSwitch(0, grid.ROWS - 2, "on", false);
    makeBlockSelectable(0, grid.ROWS - 2, 1);
  }
  if (
    game.board[1][grid.ROWS - 2].type === "swapping" &&
    game.board[1][grid.ROWS - 2].color === "red" &&
    game.board[1][grid.ROWS - 2].timer === 1
  ) {
    // red match started
    tutorial.msgIndex++;
    flipLightSwitch(0, grid.ROWS - 2, "off", false);
    makeBlockSelectable(0, grid.ROWS - 2); // deselect
  }
  if (
    game.board[1][grid.ROWS - 1].timer === 2 &&
    game.board[1][grid.ROWS - 1].color === "red"
  ) {
    // red match has finished
    tutorial.msgIndex++;
    flipLightsOnRow([2, 4, 5], grid.ROWS - 1, "on", false);
    flipLightSwitch(5, grid.ROWS - 2, "on", false);
    makeBlockSelectable(5, grid.ROWS - 2, 3);
  }
  if (
    game.board[5][grid.ROWS - 1].timer === 108 &&
    game.board[5][grid.ROWS - 1].color === "yellow"
  ) {
    // yellow match started
    playAudio(audio.announcerBeautiful);
    tutorial.msgIndex++;
  }
  if (
    game.board[5][grid.ROWS - 1].type === "landing" &&
    game.board[5][grid.ROWS - 1].timer === 3
  ) {
    // after 4 yellow match clearing, switch to new cyan block action.
    tutorial.msgIndex++;
    tutorial.savedIndex = tutorial.msgIndex;
    tutorial.savedBoard = saveCurrentBoard(game.board);
    flipLightsOnCol(
      0,
      [grid.ROWS - 1, grid.ROWS - 4, grid.ROWS - 5],
      "on",
      false
    );
    flipLightsOnCol(1, [grid.ROWS - 2, grid.ROWS - 3], "on", false);
    makeBlockSelectable(1, grid.ROWS - 2, 0); // select cyan block
    makeBlockSelectable(1, grid.ROWS - 3, 0); // select cyan block
  }
  if (
    game.board[0][grid.ROWS - 2].timer === 3 &&
    game.board[0][grid.ROWS - 2].type === "swapping" &&
    game.board[0][grid.ROWS - 2].color === "cyan"
  ) {
    // select other cyan block, then create 5.
    makeBlockSelectable(0, grid.ROWS - 2); // deselect
    makeBlockSelectable(1, grid.ROWS - 3, 0); // select cyan make 5
  }
  if (game.board[0][grid.ROWS - 1].timer === 118) {
    // cyan match created
    tutorial.msgIndex++;
    tutorial.savedIndex = tutorial.msgIndex;
    tutorial.savedBoard = saveCurrentBoard(game.board);
    playAudio(audio.announcerThereItIs);
  }
  if (game.board[0][grid.ROWS - 1].timer === 2) {
    // cyan about to disappear
    tutorial.msgIndex++;
    tutorial.savedIndex = tutorial.msgIndex;
    tutorial.savedBoard = saveCurrentBoard(game.board);
    // create 8 match
    flipAllLightsOff();
    flipLightsOnCol(4, [7, 6, 5, 4], "on", false);
    flipLightsOnCol(5, [7, 6, 5, 4], "on", false);
    makeBlockSelectable(4, grid.ROWS - 1, 5, false);
    makeBlockSelectable(4, grid.ROWS - 4, 5, false);
    makeBlockSelectable(5, grid.ROWS - 1, 4);
    makeBlockSelectable(5, grid.ROWS - 4, 4);
  }
  if (
    game.board[5][grid.ROWS - 1].color === "red" &&
    game.board[5][grid.ROWS - 1].type === "swapping" &&
    game.board[5][grid.ROWS - 1].timer === 1
  ) {
    // swapping top red
    flipAllLightsOff();
    deselectAllBlocks();
    flipLightsOnRow([4, 5], grid.ROWS - 3, "on", false);
    makeBlockSelectable(5, grid.ROWS - 3, 4);
    makeBlockSelectable(4, grid.ROWS - 3, 5, false);
  }
  if (
    game.board[5][grid.ROWS - 4].color === "purple" &&
    game.board[5][grid.ROWS - 4].type === "swapping" &&
    game.board[5][grid.ROWS - 4].timer === 1
  ) {
    // swapping bottom red
    flipAllLightsOff();
    deselectAllBlocks();
    flipLightsOnRow([4, 5], grid.ROWS - 2, "on", false);
    makeBlockSelectable(5, grid.ROWS - 2, 4);
    makeBlockSelectable(4, grid.ROWS - 2, 5);
  }
  if (game.board[5][grid.ROWS - 4].timer === 148) {
    // 8 blocks have just started clearing.
    playAudio(audio.announcerPayoff);
    tutorial.msgIndex++;
  }

  // failure cases
  if (
    (game.board[2][grid.ROWS - 1].color === "cyan" &&
      game.board[2][grid.ROWS - 1].type === "normal") ||
    (game.board[3][grid.ROWS - 1].color === "red" &&
      game.board[3][grid.ROWS - 1].timer === 2) ||
    (game.board[3][grid.ROWS - 1].color === "purple" &&
      game.board[3][grid.ROWS - 1].timer === 2) ||
    (game.board[0][grid.ROWS - 3].type === "face" &&
      game.board[0][grid.ROWS - 2].type === "normal")
  ) {
    // return to last save
    console.log("failure, reverting to last save");
    tutorial.msgIndex = tutorial.savedIndex - 1;
    generateOpeningBoard(0, 0);
    createTutorialBoard(tutorial.savedBoard);
    if (game.board[1][grid.ROWS - 2].color === "cyan") {
      // revert to the create 5 state
      game.board[5][grid.ROWS - 1].type = "landing";
      game.board[5][grid.ROWS - 1].timer = 4;
    }
    if (game.board[1][grid.ROWS - 3].color === "green") {
      for (let r = 5; r > 0; r--) {
        game.board[0][grid.ROWS - r].type = "popped";
        game.board[0][grid.ROWS - r].timer = 4;
      }
    }
  }

  // success case
  if (
    game.board[5][grid.ROWS - 1].type === "face" &&
    game.board[5][grid.ROWS - 1].timer === 2 &&
    (game.board[5][grid.ROWS - 1].color === "red" ||
      game.board[5][grid.ROWS - 1].color === "purple")
  ) {
    // tutorial.msgIndex++;
    game.board[1][grid.ROWS - 1].timer = 60;
  }

  // transition
  if (
    game.board[1][grid.ROWS - 1].timer === 2 &&
    game.board[1][grid.ROWS - 1].type === "normal"
  ) {
    tutorial.state++;
    // tutorial.state = 3; // remove after tutorial state 2 is finished
    loadTutorialState(tutorial.state, 0, true);
  }
}
