import { startGame } from "./beginGame";
import { game, api, performance, leaderboard } from "../global";
import { render, sendData } from "../../index";
import * as state from "../../store";
import { checkCanUserPost } from "./checkCanUserPost";
import { updateBestScores } from "./updateBestScores";

export function afterGame() {
  let duration = "";
  if (game.seconds < 10) duration = `${game.minutes}:0${game.seconds}`;
  else duration = `${game.minutes}:${game.seconds}`;
  let homePage = document.getElementById("home-page");
  let container = document.getElementById("container");
  container.innerHTML = "";
  homePage.appendChild(container);

  let div1 = document.createElement("div");
  container.appendChild(div1);

  let gameOver = document.createElement("h2");
  gameOver.setAttribute("id", "game-over");
  gameOver.className = "postgame-info";
  gameOver.innerHTML = "Game Over!";
  div1.appendChild(gameOver);

  let scoreMessage = document.createElement("h2");
  scoreMessage.setAttribute = ("id", "score-message");
  scoreMessage.className = "postgame-info";
  scoreMessage.style.color = "red";
  scoreMessage.innerHTML = `Final Score: ${game.score}`;
  scoreMessage.style.color = leaderboard.canPost ? "blue" : "red";
  div1.appendChild(scoreMessage);

  let durationMessage = document.createElement("h2");
  durationMessage.setAttribute = ("id", "duration-message");
  durationMessage.className = "postgame-info";
  durationMessage.innerHTML = `Duration Survived: ${duration}`;
  div1.appendChild(durationMessage);

  let dateMessage = document.createElement("h2");
  dateMessage.setAttribute = ("id", "date-message");
  dateMessage.className = "postgame-info";
  dateMessage.innerHTML = `Date: ${api.data.month}/${api.data.day}/${api.data.year}`;
  div1.appendChild(dateMessage);

  let timeMessage = document.createElement("h2");
  timeMessage.setAttribute = ("id", "time-message");
  timeMessage.className = "postgame-info";
  timeMessage.innerHTML = `Game Begin At: ${api.data.hour}:${api.data.minute} ${api.data.meridian}`;
  div1.appendChild(timeMessage);

  checkCanUserPost();
  updateBestScores(game.score);

  let div2 = document.createElement("div");
  container.appendChild(div2);
  let restartGame = document.createElement("button");
  restartGame.setAttribute("id", "restart-arcade");
  restartGame.className = "default-button";
  restartGame.innerHTML = leaderboard.canPost
    ? "Restart Game Without Posting Scores"
    : "Play Again";
  div2.appendChild(restartGame);

  restartGame.addEventListener("click", event => {
    startGame(performance.gameSpeed);
  });
}

export function submitResults() {
  let finalScore = game.score;
  let duration = "";
  if (game.seconds < 10) duration = `${game.minutes}:0${game.seconds}`;
  else duration = `${game.minutes}:${game.seconds}`;
  let container = document.getElementById("container");
  let form = document.createElement("form");
  form.setAttribute("id", "form");
  form.setAttribute("method", "POST");
  form.setAttribute("action", "");
  container.appendChild(form);

  let nameLabel = document.createElement("label");
  nameLabel.setAttribute("for", "player-name");
  nameLabel.setAttribute("id", "enter-name");
  nameLabel.innerHTML = "Enter a name to be associated with the score: ";
  form.append(nameLabel);

  let nameInput = document.createElement("input");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("name", "player-name");
  nameInput.setAttribute("id", "player-name");
  nameInput.setAttribute("maxlength", "15");
  nameInput.setAttribute("placeholder", "Anonymous");
  form.appendChild(nameInput);

  let submitForm = document.createElement("input");
  submitForm.setAttribute("id", "submit-name");
  submitForm.setAttribute("type", "submit");
  submitForm.setAttribute("name", "submit-name");
  submitForm.setAttribute(
    "value",
    `Submit Name${leaderboard.canPost ? " " : " (Unranked)"}`
  );
  submitForm.style.color = leaderboard.canPost ? "black" : "red";
  submitForm.className = "default-button";
  form.appendChild(submitForm);

  document.querySelector("form").addEventListener("submit", event => {
    event.preventDefault();
    if (nameInput.value === "") nameInput.value = "Anonymous";
    if (!leaderboard.canPost) {
      if (nameInput.value.length == 15) {
        nameInput.value = nameInput.value.slice(0, 14);
      }
      nameInput.value = `*${nameInput.value}`;
    }

    let requestData = {
      name: nameInput.value,
      score: finalScore,
      duration: duration,
      largestChain: game.largestChain,
      totalClears: game.totalClears,
      month: api.data.month,
      day: api.data.day,
      year: api.data.year,
      hour: api.data.hour,
      minute: api.data.minute,
      meridian: api.data.meridian,
      ranked: leaderboard.canPost
    };

    console.log(requestData);
    sendData(requestData);
    game.Music.volume = 0;
    render(state.Leaderboard);
    return;
  });
}

export function extractTimeFromAPI(dateTimeString) {
  console.log(dateTimeString);

  let hourStr = `${dateTimeString[11]}${dateTimeString[12]}`;
  let minStr = `${dateTimeString[14]}${[dateTimeString[15]]}`;
  let monthStr = `${dateTimeString[5]}${dateTimeString[6]}`;
  let dayStr = `${dateTimeString[8]}${dateTimeString[9]}`;
  let yearStr = `${dateTimeString.slice(0, 4)}`;

  let hour = hourStr[0] === "0" ? parseInt(hourStr[1]) : parseInt(hourStr);
  console.log(hour);
  let meridian = "A.M.";
  if (hour === 12) {
    meridian = "P.M.";
  }
  if (hour === 0) {
    hourStr = "12";
  }
  if (hour > 12) {
    hourStr = hour - 12 < 10 ? `0${hour - 12}` : `${hour - 12}`;
    `${hour - 12}`;
    meridian = "P.M.";
  }
  return {
    month: monthStr,
    day: dayStr,
    year: yearStr,
    hour: hourStr,
    minute: minStr,
    meridian: meridian
  };
}
