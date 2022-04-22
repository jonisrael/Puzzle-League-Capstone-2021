import { game } from "../global";
import { startTutorial, tutorial } from "../tutorial/tutorialScript";
import { startGame } from "./startGame";

export const menus = {
  timeControl: {
    question: "What time control would you like to play?",
    buttonFunction: `setTimeControl`,
    buttons: [
      {
        text: "2 minutes (20 sec per level)",
        bgImage: "linear-gradient(to bottom right, gold, yellow);",
      },
      { text: "5 minutes (50 sec per level)", disabled: true },
      { text: "8 minutes (80 sec per level)", disabled: true },
      {
        text: "I want to learn how to play first!",
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
      { text: "Arcade Mode Rules (Beginner)", disabled: true },
      { text: "Maximizing Your Score (Intermediate)" },
      { text: "Survival Techniques (Intermediate, AI Assist)", disabled: true },
      { text: "Can You Solve the Chain Challenge? (Advanced)" },
      { text: "Touch Screen Only Special Techniques", notAButton: true },
      { text: "Buffering Swaps (Intermediate)", disabled: true },
      { text: "Using Multiple Move Orders (Advanced)", disabled: true },
      { text: "Using The Smart Match System (Advanced)", disabled: true },
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
  if (option === 1) game.timeControl = 2;
  if (option === 2) game.timeControl = 6;
  if (option === 3) game.timeControl = 9;
  if (option === 4) middleMenuSetup("selectTutorial");
  if (option < 4) startGame();
}

export function middleMenuSetup(key) {
  let container = document.getElementById("container");
  container.innerHTML = "";
  let menu = menus[key]; // is an object containing "question" and "buttons"
  let question = document.createElement("h1");
  question.setAttribute("id", "menu-question");
  question.innerHTML = menu.question;
  container.appendChild(question);
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
      btnElement.addEventListener("click", (e) => {
        console.log(`clicked button ${option}`);
        if (key === "timeControl") setTimeControl(option);
        if (key === "selectTutorial") selectTutorial(option);
      });
      buttonDiv.appendChild(btnElement);
    }
  }
  if (key.description) {
    let description = document.createElement("p");
    description.innerHTML = key.description;
    description.setAttribute("id", "menu-description");
    container.appendChild(description);
  }
}
