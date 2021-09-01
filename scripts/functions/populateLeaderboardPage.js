import axios from "axios";
import { api } from "../global";

export function populateLeaderboardPage() {
  let leaderboardPage = document.getElementById("leaderboard-page");
  let container = document.createElement("div");
  leaderboardPage.appendChild(container);
  let scoreListDisplay = document.createElement("h2");
  scoreListDisplay.setAttribute("id", "score-list-display");
  scoreListDisplay.innerHTML = "Fetching Leaderboards...";
  leaderboardPage.appendChild(scoreListDisplay);
  console.log("Fetching Leaderboards...");
  axios
    .get("https://puzzle-league-blitz.herokuapp.com/games")
    .then(response => {
      let sortedData = response.data.sort((a, b) =>
        parseInt(a.score) < parseInt(b.score) ? 1 : -1
      );
      console.log(response.data);
      console.log("Leaderboard Fetch Successful!");
      // container.innerHTML = JSON.stringify(sortedData);
      scoreListDisplay.innerHTML =
        "<pre>|        NAME       |  SCORE  |  ALIVE |           DATE          |<br></pre>";
      ("<pre>|  LONGESTNAMEAVAI  |  00000   |  09:59 |  12/31/2021 07:28 P.M.  |<br></pre>");
      for (let entry of sortedData) {
        let displayedEntry = "";
        let score = entry.score;
        if (parseInt(score) > 99999) score = "99999";
        while (score.length < 5) {
          score = "0" + score;
        }
        let name = entry.name;
        while (name.length < 15) {
          if (name.length % 2 == 0) {
            name += " ";
          } else {
            name = " " + name;
          }
        }
        displayedEntry += `|  ${name}  |  ${score}  |  ${entry.duration}  |  ${entry.month}/${entry.day}/${entry.year} ${entry.hour}:${entry.minute} ${entry.meridian}  |<br>`;
        console.log(score);
        scoreListDisplay.innerHTML += displayedEntry;
      }
      scoreListDisplay.innerHTML = `<pre>${scoreListDisplay.innerHTML}</pre>`;
      console.log(scoreListDisplay.innerHTML);
    })
    .catch(error => {
      console.log("Leaderboard Fetch failed", error);
      return error;
    });
}
