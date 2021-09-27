import { startGame } from "./beginGame";
import { audio } from "../fileImports";
import { announcer, game, performance, leaderboard } from "../global";
import { submitResults } from "./submitResults";
import { playMusic, playAnnouncer } from "./audioFunctions";

export function checkCanUserPost() {
  let container = document.getElementById("container");
  document.getElementById("home-page").appendChild(container);
  container.innerHTML =
    "<p>Unfortunately this score cannot be posted to the ranked leaderboards. ";
  if (leaderboard.reason == "debug") {
    container.innerHTML +=
      "This is because debug mode was activated. Debug mode is activated by pressing the `/~ key.</p>";
  } else if (leaderboard.reason == "slow") {
    container.innerHTML += `This is because the in-game clock time was at least five seconds behind the real clock time.  Your game ended after <strong>${game.finalTime} in-game seconds,</strong> <span style="color:red; font-weight:bold">but the actual real time of the game was ${performance.realTime} seconds.</span></p><br />`;
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
      If this message continues to pop up, unfortunately your hardware may not be fast enough to run the game at its full speed. This performance checker is meant to stop leaderboard scores that may have been easier to obtain due to a slower-running game. I will periodically still be updating this game through 2022, and there is a chance that game efficiency and performance could improve. And of course, you can still play locally and try to beat your own scores!
    </p>
    `;
  } else if (game.score == 0) {
    container.innerHTML += `This is because you did not score any points!`;
  } else if (game.score <= leaderboard.minRankedScore) {
    container.innerHTML += `This is because your score is below the 50th leaderboard spot. Your score is ${game.score}, while ${leaderboard.minRankedName}'s score on the leaderboard spot's is ${leaderboard.minRankedScore}. Keep practicing and try again!</p>`;
  } else {
    container.innerHTML = "";
    playAnnouncer(
      announcer.endgameDialogue,
      announcer.endgameIndexLastPicked,
      "endgame"
    );
    playMusic(audio.resultsMusic, 0.2);
    submitResults();
    return;
  }
  playMusic(audio.resultsMusic, 0.2, 3);
  container.innerHTML += `
  <br />
  <br />
  <h2>Click This Button or Press Any Key to Continue</h2>
  `;
}
