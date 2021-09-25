import { startGame } from "./beginGame";
import { game, api, performance } from "../global";
import { render, sendData } from "../../index";
import * as state from "../../store";
import { performanceNotifier } from "./performanceNotifier";

export function submitResults() {
  let finalScore = game.score;
  let duration = "";
  if (game.seconds < 10) duration = `${game.minutes}:0${game.seconds}`;
  else duration = `${game.minutes}:${game.seconds}`;

  let homePage = document.getElementById("home-page");
  let container = document.getElementById("container");
  container.innerHTML = "";
  homePage.appendChild(container);

  let messageAboutPosting = document.createElement("div");
  container.appendChild(messageAboutPosting);
  messageAboutPosting.style.display = performance.canPostToLeaderboard
    ? "none"
    : "static";
  messageAboutPosting.innerHTML = `<p>Unfortunately this score cannot be posted to the ranked leaderboards. This is because either debug mode was activated <strong>or</strong> the in-game clock was over five seconds behind a real clock. The real time of the game was <strong>${
    performance.realTime
  } seconds</strong> while the in-game timer was <strong>${
    game.finalTime
  } seconds</strong>, which is a difference of <span style="color:red; font-weight:bold">${Math.abs(
    performance.realTime - game.finalTime
  ).toFixed(1)} seconds</span>.</p><hr>`;

  let form = document.createElement("form");
  form.setAttribute("id", "form");
  form.setAttribute("method", "POST");
  form.setAttribute("action", "");
  container.appendChild(form);

  let div1 = document.createElement("div");
  form.appendChild(div1);

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
  scoreMessage.style.color = performance.canPostToLeaderboard ? "blue" : "red";
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

  console.log(api.data);

  let div2 = document.createElement("div");
  form.appendChild(div2);

  let nameLabel = document.createElement("label");
  nameLabel.setAttribute("for", "player-name");
  nameLabel.setAttribute("id", "enter-name");
  nameLabel.innerHTML = "Enter a name to be associated with the score: ";
  div2.append(nameLabel);

  let nameInput = document.createElement("input");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("name", "player-name");
  nameInput.setAttribute("id", "player-name");
  nameInput.setAttribute("maxlength", "15");
  nameInput.setAttribute("placeholder", "Anonymous");
  div2.appendChild(nameInput);

  let submitForm = document.createElement("input");
  submitForm.setAttribute("id", "submit-name");
  submitForm.setAttribute("type", "submit");
  submitForm.setAttribute("name", "submit-name");
  submitForm.setAttribute(
    "value",
    `Submit Name${performance.canPostToLeaderboard ? " " : " (Unranked)"}`
  );
  submitForm.style.color = performance.canPostToLeaderboard ? "black" : "red";
  submitForm.className = "default-button";
  div2.appendChild(submitForm);

  let div3 = document.createElement("div");
  container.appendChild(div3);
  let restartGame = document.createElement("button");
  restartGame.setAttribute("id", "restart-game");
  restartGame.className = "default-button";
  restartGame.innerHTML = "Restart Game Without Posting Scores";
  div3.appendChild(restartGame);

  document.querySelector("form").addEventListener("submit", event => {
    event.preventDefault();
    if (nameInput.value === "") nameInput.value = "Anonymous";
    if (!performance.canPostToLeaderboard) {
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
      ranked: performance.canPostToLeaderboard
    };

    console.log(requestData);
    sendData(requestData);
    game.Music.volume = 0;
    render(state.Home);
  });

  document.querySelector("#restart-game").addEventListener("click", event => {
    startGame(performance.gameSpeed);
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
