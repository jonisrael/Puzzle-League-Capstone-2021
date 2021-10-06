import { startGame } from "./startGame";
import { audio } from "../fileImports";
import {
  announcer,
  game,
  performance,
  leaderboard,
  api,
  padInteger
} from "../global";
import { submitResults, afterGame } from "./submitResults";
import { playMusic, playAnnouncer } from "./audioFunctions";
import { displayError } from "../..";

export function checkCanUserPost() {
  game.Music.loop = false;
  if (!api.data.month) {
    displayError(
      "Unable to get data from WorldTimeAPI. Using Local Time instead"
    );
    let date = new Date();
    api.data.month = padInteger(Date.getMonth(), 2);
    api.data.day = padInteger(Date.getDay(), 2);
    api.data.year = Date.getYear();
    api.data.hour = Date.getHour();
    api.data.minute = padInteger(Date.getHour(), 2);
    api.data.meridian = "A.M.";
    if (api.data.hour == 12) {
      api.data.meridian = "P.M.";
    }
    if (api.data.hour === 0) {
      api.data.hour = "12";
    }
    if (api.data.hour > 12) {
      api.data.hour =
        api.data.hour - 12 < 10
          ? `0${api.data.hour - 12}`
          : `${api.data.hour - 12}`;
      `${api.data.hour - 12}`;
      api.data.meridian = "P.M.";
    }
  }
  if (leaderboard.data.length == 0) {
    leaderboard.canPost = false;
    leaderboard.reason = "no-leaderboard";
  } else if (game.score == 0) {
    leaderboard.canPost = false;
    leaderboard.reason = "zero";
  } else if (
    game.score <= leaderboard.data[leaderboard.data.length - 1].score
  ) {
    leaderboard.canPost = false;
    leaderboard.reason = "get-good";
  }
  let container = document.getElementById("container");
  if (!leaderboard.canPost) {
    container.innerHTML += `<h2 style="color:red">Unfortunately this score cannot be posted to the ranked leaderboards.</h2>`;
    if (leaderboard.reason == "slow") {
      container.innerHTML += `<p>This is because the in-game clock time was at least five seconds behind the real clock time.  Your game ended after <strong>${game.finalTime} in-game seconds,</strong> <span style="color:red; font-weight:bold">but the actual real time of the game was ${performance.realTime} seconds.</span></p><br />`;
      container.innerHTML += `
      <label" for="troubleshooting" style="font-size:large">
        Troubleshooting Performance Issues:
      </label>
      <ul id="troubleshooting">
        <li>
          Use Microsoft Edge (Sadly, I'm serious)
        </li>
        <li>
          Do NOT use Firefox (It murders this game)
        </li>
        <li>
          Close all other applications and tabs
        </li>
        <li>
          If on laptop, make sure it is plugged in
        </li>
        <li>
          Restart computer
        </li>
      </ul>
      <br />
      <p>
        If this message continues to pop up, unfortunately your hardware may not be fast enough to run the game at its full speed. This performance checker is meant to stop leaderboard scores that may have been easier to obtain due to a slower-running game. I will periodically still be updating this game through 2022, and it is likely that game efficiency and performance will improve. And of course, you can still play locally and try to beat your own best scores!
      </p>
      `;
      return false;
    }

    if (leaderboard.reason == "debug") {
      container.innerHTML +=
        "<p>This is because debug mode was activated. Debug mode is activated by pressing the `/~ key.</p>";
      return false;
    }

    if (leaderboard.reason === "zero") {
      container.innerHTML += `<p>This is because you did not score any points!</p>`;
      return false;
    }

    if (leaderboard.reason === "no-worldtime") {
      container.innerHTML = `<p>This is because WorldTimeAPI cannot be accessed.</p>`;
      return false;
    }

    if (leaderboard.reason === "no-leaderboard") {
      container.innerHTML = `<p>This is because the heroku server cannot be accessed.</p>`;
      return false;
    }

    if (leaderboard.reason === "get-good") {
      container.innerHTML += `<p>This is because your score is less than or equal to the last leaderboard spot. Depending on popularity, leaderboard size may increase. Your score is ${
        game.score
      }, while the <strong>#${
        leaderboard.data.length
      } spot on the leaderboard is "${
        leaderboard.data[leaderboard.data.length - 1].name
      }" with a score of ${
        leaderboard.data[leaderboard.data.length - 1].score
      }.</strong> Keep practicing and try again!</p>`;
      return false;
    }
  }
  submitResults();
  return true;
}
