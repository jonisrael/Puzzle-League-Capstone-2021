import { game, leaderboard } from "../global";
import { displayMessage } from "../..";

export function validateForm(nameValue, score) {
  let identicalEntries = [];
  let overwrite = false;
  leaderboard.data.forEach((entry) => {
    if (nameValue === entry.name) {
      identicalEntries.push({
        name: entry.name,
        score: entry.score,
        date: `${entry.month}/${entry.day}/${entry.year}`,
        _id: entry._id,
      });
    }
  });
  console.log("identical entries", identicalEntries);
  let informIfLessThanLeaderboard = "";

  if (nameValue === "GiefKid-AI" && game.mode !== "cpu-play") {
    displayMessage(`The name "GiefKid-AI" is reserved`);
    return -1;
  }

  // if (passcode === "" || passcode === "1234") {
  //   overwrite = confirm(
  //     `Warning -- not setting a passcode will allow ANYONE to overwrite your scores. Continue?`
  //   );
  // }

  if (identicalEntries.length > 0) {
    let prevLeaderboardEntry = identicalEntries[0];
    if (score > prevLeaderboardEntry.score) {
      overwrite = confirm(
        `Replace your current score on the leaderboard of ${identicalEntries[0].score} with this one?`
      );
    } else {
      alert(
        `Cannot post this score because it is less than ${prevLeaderboardEntry.name}'s score of ${prevLeaderboardEntry.score}. Please enter either a different name or try again!`
      );
    }

    if (overwrite) {
      console.log(identicalEntries);
      console.log(prevLeaderboardEntry._id);
      for (let i = leaderboard.data.length - 1; i > -1; i--) {
        if (leaderboard.data[i].name === prevLeaderboardEntry.name) return i;
      }
      return -1;
    }
    return -1;
  }
  return leaderboard.data.length - 1;
}
