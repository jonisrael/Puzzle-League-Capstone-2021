import { startGame } from "./beginGame";
import { audio } from "../fileImports";
import { announcer, game, performance, leaderboard } from "../global";
import { submitResults, afterGame } from "./submitResults";
import { playMusic, playAnnouncer } from "./audioFunctions";

export function checkCanUserPost() {
  game.Music.loop = false;
  if (game.score == 0) {
    leaderboard.canPost = false;
    leaderboard.reason = "zero";
  } else if (game.score < leaderboard.minRankedScore) {
    leaderboard.canPost = false;
    leaderboard.reason = "get-good";
  }
  let container = document.getElementById("container");
  if (!leaderboard.canPost) {
    container.innerHTML = `<h2 style="color:red">Unfortunately this score cannot be posted to the ranked leaderboards.</h2>`;
    if (leaderboard.reason == "slow") {
      container.innerHTML += `<p>This is because the in-game clock time was at least five seconds behind the real clock time.  Your game ended after <strong>${game.finalTime} in-game seconds,</strong> <span style="color:red; font-weight:bold">but the actual real time of the game was ${performance.realTime} seconds.</span></p><br />`;
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
      playMusic(audio.resultsMusic, 0.2, 3);
      return;
    }

    if (leaderboard.reason == "debug") {
      container.innerHTML +=
        "<p>This is because debug mode was activated. Debug mode is activated by pressing the `/~ key.</p>";
      playMusic(audio.resultsMusic, 0.2, 3);
      return;
    }

    if (leaderboard.reason === "zero") {
      container.innerHTML += `<p>This is because you did not score any points!</p>`;
      playMusic(audio.resultsMusic, 0.2, 3);
      return;
    }

    if (leaderboard.reason === "get-good") {
      container.innerHTML += `<p>This is because your score is below the 50th leaderboard spot. Your score is ${game.score}, while "${leaderboard.minRankedName}'s" score on the leaderboard spot's is ${leaderboard.minRankedScore}. Keep practicing and try again!</p>`;
      playMusic(audio.resultsMusic, 0.2, 3);
      return;
    }
  }
  playAnnouncer(
    announcer.endgameDialogue,
    announcer.endgameIndexLastPicked,
    "endgame"
  );
  playMusic(audio.resultsMusic, 0.2);
  submitResults();
}
