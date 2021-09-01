import axios from "axios";
import { api } from "../global";

export function populateLeaderboards() {
  let leaderboardPage = document.getElementById("leaderboard-page");
  leaderboardPage.innerHTML = "Fetching Leaderboards...";
  console.log("Fetching Leaderboards...");
  axios
    .get("https://puzzle-league-blitz.herokuapp.com/games")
    .then(response => {
      console.log(response.data);
      console.log("Leaderboard Fetch Successful!");
      leaderboardPage.innerHTML = JSON.stringify(response.data);
    })
    .catch(error => {
      console.log("Leaderboard Fetch failed", error);
      return error;
    });
}
