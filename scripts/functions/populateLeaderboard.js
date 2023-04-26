import { leaderboard } from "../global";
import * as state from "../../store";

export function populateLeaderboard() {
  let markup = "";
  let nameMatchIndexes = [];
  let fullMatchIndex = -1;
  console.log(`userPostedName: ${leaderboard.userPostedName}`);
  for (let rank = 0; rank < leaderboard.data.length; rank++) {
    if (leaderboard.data[rank].score >= 999999)
      leaderboard.data[rank].score = "999999";
    let entry = leaderboard.data[rank];
    if (
      leaderboard.data[rank].name == leaderboard.userPostedName ||
      leaderboard.data[rank].name == localStorage.username
    ) {
      nameMatchIndexes.push(rank);
      if (leaderboard.data[rank].score == leaderboard.userPostedScore)
        fullMatchIndex = rank;
    }
    if (leaderboard.data[rank].name === "[EMPTY]") break;
    markup += `
      <tr style='
      ${
        nameMatchIndexes.includes(rank)
          ? " font-weight: bold; background-color: yellow;"
          : ""
      }
      ${fullMatchIndex == rank ? " background-color: yellow; color:black" : ""}
      '${fullMatchIndex == rank ? "id='user-post'" : ""}>
        <td>
          ${rank + 1}
        </td>
        <td>
          ${entry.name}
        </td>
        <td>
          ${entry.score}
        </td>
        <td>
          ${entry.duration}
        </td>
        <td>
          ${entry.largestChain}
        </td>
        <td>
          ${entry.totalClears}
        </td>
        <td>
        ${entry.month}/${entry.day}/${entry.year.slice(2.4)}
        </td>
        <td>
          ${entry.playType}
        </td>
      </tr>
    `;
  }
  return markup;
}
