import { render } from "../..";
import * as state from "../../store";
import { game, win } from "../global";
import { startTutorial, tutorial } from "../tutorial/tutorialScript";
import { startGame } from "./startGame";
import { defineTimeEvents } from "./timeEvents";

export const menus = {
  timeControl: {
    question: "What time control would you like to play?",
    buttonFunction: `setTimeControl`,
    buttons: [
      { text: "Blitz (2 minutes)", lockedText: "Blitz" },
      {
        text: "Standard (5 minutes)",
        bgImage: "linear-gradient(to bottom right, gold, yellow);",
      },
      { text: "Marathon (10 minutes)", lockedText: "Marathon" },
      {
        text: "Teach me how to play first!",
        bgImage: "revert",
        bgColor: "orange",
      },
    ],
    description:
      `All arcade games have "overtime", which occurs at the end of the ` +
      "time control starting at level 7. The game speed will " +
      "double every minute, but the score you gain is much larger and you get " +
      "bonus points for every score.",
  },
  selectTutorial: {
    question: "What tutorial do you want to try?",
    buttonFunction: `setTimeControl`,
    buttons: [
      { text: "Controls & Basics of Scoring (Beginner, AI Assist)" },
      { text: "Arcade Mode Rules (COMING SOON)", disabled: true },
      { text: "Maximizing Your Score (Intermediate) (Coming" },
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
};

function selectTutorial(option) {
  game.mode === "tutorial";
  if (option === 1) tutorial.state = 1;
  if (option === 3) tutorial.state = 3;
  tutorial.chainChallenge = option === 5;
  startGame();
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

export function middleMenuSetup(key) {
  win.goToMenu = "";
  let menu = menus[key]; // is an object containing "question" and "buttons"
  window.scrollTo(0, document.body.scrollHeight / 4);
  console.log("Middle Menu Object:", menu);
  let container = document.getElementById("container");
  container.innerHTML = "";
  let question = document.createElement("h1");
  question.setAttribute("id", "menu-question");
  question.innerHTML = menu.question;
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
      if (btn.disabled) btnElement.disabled = true;
      if (btn.lockedText) {
        btnElement.disabled = !localStorage.getItem("unlock");
        if (btnElement.disabled)
          btnElement.innerHTML = `${btn.lockedText} (Unlocks After Playing One Game)`;
      }

      btnElement.addEventListener("click", (e) => {
        console.log(`clicked button ${option}`);
        if (key === "timeControl") setTimeControl(option);
        if (key === "selectTutorial") selectTutorial(option);
      });
      buttonDiv.appendChild(btnElement);
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
}
