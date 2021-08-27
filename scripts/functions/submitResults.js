// import axios from "axios";
// import router from "../../server/routers/games";
import { game } from "../global";

export function submitResults() {
  let finalScore = game.score;
  let duration = "";
  if (game.seconds < 10) duration = `${game.minutes}:0${game.seconds}`;
  else duration = `${game.minutes}:${game.seconds}`;

  let homePage = document.getElementById("home-page");
  let form = document.createElement("form");
  form.setAttribute("id", "form");
  form.setAttribute("method", "POST");
  form.setAttribute("action", "");
  homePage.appendChild(form);

  let div1 = document.createElement("div");
  form.appendChild(div1);

  let gameOver = document.createElement("h2");
  gameOver.setAttribute("id", "game-over");
  gameOver.innerHTML = "Game Over!";
  div1.appendChild(gameOver);

  let scoreMessage = document.createElement("h2");
  scoreMessage.setAttribute = ("id", "score-message");
  scoreMessage.innerHTML = `Final Score: ${game.score}`;
  div1.appendChild(scoreMessage);

  let durationMessage = document.createElement("h2");
  durationMessage.setAttribute = ("id", "duration-message");
  durationMessage.innerHTML = `Duration Survived: ${duration}`;
  div1.appendChild(durationMessage);

  let div2 = document.createElement("div");
  form.appendChild(div2);

  let nameLabel = document.createElement("label");
  nameLabel.setAttribute("for", "player-name");
  nameLabel.innerHTML = "Enter your name: ";
  div2.append(nameLabel);

  let nameInput = document.createElement("input");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("name", "player-name");
  nameInput.setAttribute("id", "player-name");
  nameInput.setAttribute("required", "");
  div2.appendChild(nameInput);

  let submitForm = document.createElement("input");
  submitForm.setAttribute("type", "submit");
  submitForm.setAttribute("name", "submit");
  submitForm.setAttribute("value", "Submit Name");
  div2.appendChild(submitForm);

  document.querySelector("form").addEventListener("submit", event => {
    event.preventDefault();

    let gameData = {
      name: nameInput.value,
      score: finalScore,
      duration: duration
    };
    // convert HTML elements to Array
    console.log(gameData);
  });
}
