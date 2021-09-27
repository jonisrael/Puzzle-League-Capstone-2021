import { startGame } from "./beginGame";
import { game, performance, leaderboard } from "../global";

export function whyCannotPost(reason) {
  let container = document.getElementById("container");
  document.getElementById("home-page").appendChild(container);
  container.innerHTML =
    "<p>Unfortunately this score cannot be posted to the ranked leaderboards. ";
  if (reason == "debug") {
    container.innerHTML +=
      "This is because debug mode was activated. Debug mode is activated by pressing the `/~ key.</p>";
  }
  if (reason == "score") {
    container.innerHTML += `This is because your score is below the 50th leaderboard spot. Your score is ${game.score}, while the 50th leaderboard spot's score is ${leaderboard.minRankedScore}. Keep practicing and try again!</p>`;
  }
  if (reason == "slow") {
    container.innerHTML += `This is because the in-game clock time was at least five seconds behind the real clock time.  Your game ended after ${game.finalTime} in-game seconds, but the actual time of the game was ${performance.realTime}.</p><br />`;
    container.innerHTML += `
    <label" for="troubleshooting">
      Troubleshooting Performance Issues:
    </label>
    <ul id="troubleshooting">
      <li>
        Use Google Chrome (Best performance)
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
      If this message continues to pop up, unfortunately your hardware may not be fast enough to run the game at its full speed. This performance checker is only meant to minimize posting scores may have been easier to obtain due to I will periodically still be updating this game through 2022, and there is a chance that game efficiency and performance could improve. You can still play locally and try to beat your own scores!
    </p>
    `;
  }
  container.innerHTML += `
  <br />
  <br />
  <h2>Click This Button or Press Any Key to Continue</h2>
  `;
}
