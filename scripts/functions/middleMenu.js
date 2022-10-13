import { render } from "../..";
import * as state from "../../store";
import { cpu, game, win } from "../global";
import { startTutorial, tutorial } from "../tutorial/tutorialScript";
import { startGame } from "./startGame";
import { defineTimeEvents } from "./timeEvents";

export const menus = {
  firstGameTutorialQuestion: {
    question: {
      text:
        "I noticed this is your first time playing. Would you like to learn how to play with a quick tutorial?",
    },

    buttonFunction: `firstGameTutorialQuestion`,
    buttons: [
      {
        text: "Yes, teach me the basics!",
        bgImage: "none",
        bgColor: "yellow",
        fontSize: "x-large",
      },
      {
        text: "No, let's play!",
        fontSize: "x-large",
      },
    ],
  },

  timeControl: {
    question: {
      text: "What time control would you like to play?",
    },
    buttonFunction: `setTimeControl`,
    buttons: [
      {
        text: "Blitz (2 minutes)",
        bgImage: "linear-gradient(to bottom right, gold, yellow);",
      },
      {
        text: "Standard (5 minutes, No Leaderboard)",
        lockedText: "Standard",
      },
      { text: "Marathon (10 minutes, No Leaderboard)", lockedText: "Marathon" },
      {
        text: "Teach me how to play first!",
        bgImage: "revert",
        bgColor: "orange",
      },
    ],
    description:
      `All arcade games have "overtime", which occurs at the end of the ` +
      "time control starting at level 6. The game speed will " +
      "double every minute, but the score you gain is much larger and you get " +
      `bonus points for every score.<br /> <br />A leaderboard currently only exists for "Blitz" game mode.`,
  },

  selectTutorial: {
    question: {
      text: "What tutorial do you want to try?",
    },
    buttonFunction: `selectTutorials`,
    buttons: [
      { text: "Controls & Basics of Scoring" },
      { text: "Arcade Mode Rules (COMING SOON)", disabled: true },
      { text: "Maximizing Your Score (Intermediate)" },
      { text: "Survival Techniques (COMING SOON)", disabled: true },
      { text: "Can You Solve the Chain Challenge? (Advanced)" },
      { text: "Touch Screen Only Special Techniques", notAButton: true },
      { text: "Buffering Swaps (COMING SOON)", disabled: true },
      { text: "Using Multiple Move Orders (COMING SOON)", disabled: true },
      { text: "Using The Smart Match System (COMING SOON)", disabled: true },
    ],
    description:
      "These tutorials are interactive, but designed for touch screen. " +
      "You can use a keyboard or controller, but not all tips will apply. " +
      "Not all tutorials are currently available!",
  },

  nextTutorial: {
    question: {
      text: "Would you like to play the game, or go to the next tutorial?",
    },
    buttonFunction: "nextTutorial",
  },

  setAISpeed: {
    question: { text: "How Fast Should the AI Cursor Speed Be?" },
    buttonFunction: `setAISpeed`,
    buttons: [
      { text: `30 actions per second` },
      { text: `20 actions per second` },
      { text: `10 actions per second` },
      { text: `4 actions per second` },
      { text: `2 actions per second` },
    ],
  },
};
menus.nextTutorial.buttons = [
  { text: "I believe in myself, let's play!", fontSize: "2.5rem" },
].concat(JSON.parse(JSON.stringify(menus.selectTutorial.buttons)));

function selectTutorial(option) {
  game.mode === "tutorial";
  if (option === 1) tutorial.state = 1;
  if (option === 3) tutorial.state = 3;
  tutorial.chainChallenge = option === 5;
  startGame();
}

function nextTutorial(option, nextTutorialState) {
  document.getElementById("button_1").style.fontSize = "2.5rem";
  if (option === 1) {
    game.mode = "arcade";
    middleMenuSetup("timeControl");
    if (win.gamesCompleted === 0) {
      win.restartGame = true;
      document.getElementById("button_1").click();
    }
  } else {
    game.mode === "tutorial";
    win.restartGame = true;
    tutorial.state = nextTutorialState;
    startGame();
  }
}

function setTimeControl(option) {
  if (option === 1) defineTimeEvents(2);
  if (option === 2) defineTimeEvents(5);
  if (option === 3) defineTimeEvents(10);
  if (option === 4) {
    render(state.Home);
    if (document.getElementById("tutorial-mode"))
      document.getElementById("tutorial-mode").click();
  }
  if (option < 4) startGame();
}

function setAISpeed(option) {
  if (option === 1) cpu.cursorSpeedDivisor = 2;
  if (option === 2) cpu.cursorSpeedDivisor = 3;
  if (option === 3) cpu.cursorSpeedDivisor = 6;
  if (option === 4) cpu.cursorSpeedDivisor = 15;
  if (option === 5) cpu.cursorSpeedDivisor = 30;
  startGame();
}

function firstGameTutorialQuestion(option) {
  if (option === 1) {
    render(state.Home);
    if (document.getElementById("tutorial-mode")) {
      document.getElementById("tutorial-mode").click();
      document.getElementById("button_1").click(); // go to first tutorial
    }
  }
  if (option === 2) {
    game.mode = "arcade";
    middleMenuSetup("timeControl");
    if (win.gamesCompleted === 0) {
      // immediately skip to playing 2 minute game
      document.getElementById("button_1").click();
    }
  }
}

export function middleMenuSetup(key, nextTutorialIndex = undefined) {
  win.goToMenu = "";
  if (key.includes("nextTutorial")) {
    nextTutorialIndex = JSON.parse(key[key.length - 1]);
    tutorial.state = nextTutorialIndex;
    key = "nextTutorial";
  }
  let menu = menus[key]; // is an object containing "question" and "buttons"
  window.scrollTo(0, document.body.scrollHeight / 4);
  console.log("Middle Menu Object:", menu);
  let container = document.getElementById("container");
  container.innerHTML = "";
  let question = document.createElement("h1");
  question.setAttribute("id", "menu-question");
  question.innerHTML = menu.question.text;
  container.appendChild(question);
  if (menu.description) {
    let description = document.createElement("p");
    description.innerHTML = menu.description;
    description.setAttribute("id", "menu-description");
    container.appendChild(description);
  }
  let buttonDiv = document.createElement("div");
  buttonDiv.setAttribute("id", "start-options");
  container.appendChild(buttonDiv);
  for (let i = 0; i < menu.buttons.length; i++) {
    let option = i + 1;
    let btn = menu.buttons[i];
    if (btn.notAButton) {
      let element = document.createElement("h2");
      element.setAttribute("id", `description_${option}`);
      buttonDiv.appendChild(element);
    } else {
      let btnElement = document.createElement("button");
      btnElement.className = "default-button start-buttons";
      btnElement.setAttribute("id", `button_${option}`);
      btnElement.innerHTML = btn.text;
      if (btn.bgColor) btnElement.style.backgroundColor = btn.bgColor;
      if (btn.bgImage) btnElement.style.backgroundImage = btn.bgImage;
      if (btn.fontSize) btnElement.style.fontSize = btn.fontSize;
      if (btn.disabled) btnElement.disabled = true;
      if (btn.lockedText) {
        btnElement.disabled = win.gamesCompleted === 0;
        if (btnElement.disabled)
          btnElement.innerHTML = `${btn.lockedText} (Unlocks After Playing One Game)`;
      }

      btnElement.addEventListener("click", (e) => {
        console.log(`clicked button ${option}`);
        if (key.includes("timeControl")) {
          setTimeControl(option);
        }
        if (key.includes("selectTutorial")) {
          selectTutorial(option);
        }
        if (key.includes("firstGameTutorialQuestion")) {
          firstGameTutorialQuestion(option);
        }
        if (key.includes("nextTutorial")) {
          nextTutorial(option, nextTutorialIndex);
        }
        if (key.includes("setAISpeed")) {
          setAISpeed(option);
        }
      });
      if (
        nextTutorialIndex === undefined ||
        i === 0 ||
        i === nextTutorialIndex
      ) {
        buttonDiv.appendChild(btnElement);
      }
    }
    if (i === menu.buttons.length - 1) {
      buttonDiv.appendChild(document.createElement("hr"));
    }
  }

  let returnBtn = document.createElement("button");
  returnBtn.innerHTML = "Return to Main Menu";
  returnBtn.className = "default-button start-buttons";
  returnBtn.style.backgroundColor = "pink";
  returnBtn.style.backgroundImage = "revert";
  returnBtn.addEventListener("click", () => render(state.Home));
  buttonDiv.appendChild(returnBtn);
  // automatically click 2 minute time control if player hasn't played yet.
}
