import { leaderboard } from "../global";
import * as state from "../../store";

export function populateLeaderboard() {
  let markup = "";
  let nameMatchIndexes = [];
  console.log(`userPostedName: ${leaderboard.userPostedName}`);
  for (let rank = 0; rank < leaderboard.data.length; rank++) {
    if (leaderboard.data[rank].score >= 999999)
      leaderboard.data[rank].score = "999999";
    let entry = leaderboard.data[rank];
    if (leaderboard.data[rank].name == leaderboard.userPostedName)
      nameMatchIndexes.push(rank);
    markup += `
      ${
        nameMatchIndexes.includes(rank)
          ? "<tr style='background-color: yellow; color:red';>"
          : "<tr>"
      }
        <td>
          ${rank + 1}
        </td>
        <td>
          ${entry.score}
        </td>
        <td>
          ${entry.name}
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
          ${entry.hour}:${entry.minute} ${entry.meridian}
        </td>
      </tr>
    `;
  }
  return markup;
}
