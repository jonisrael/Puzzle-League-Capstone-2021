import { game, leaderboard } from "../global";
import { displayMessage } from "../..";

export function validateForm(nameValue, score, passcode) {
  let identicalEntries = [];
  let overwrite = false;
  leaderboard.data.forEach((entry) => {
    if (nameValue === entry.name) {
      identicalEntries.push({
        name: entry.name,
        score: entry.score,
        kc: entry.kc,
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

  if (passcode === "" || passcode === "1234") {
    overwrite = confirm(
      `Warning -- not setting a passcode will allow ANYONE to overwrite your scores. Continue?`
    );
  }

  if (identicalEntries.length > 0) {
    let prevLeaderboardEntry = identicalEntries[0];
    if (!prevLeaderboardEntry.passcode) prevLeaderboardEntry.passcode = "1234";
    if (passcode !== prevLeaderboardEntry.passcode) {
      alert(
        `Incorrect passcode. If you've lost your passcode, you can contact me for it or create a new name.`
      );
    } else if (score > prevLeaderboardEntry.score) {
      overwrite = confirm(
        `Your passcode is ${prevLeaderboardEntry.passcode}. You will use this passcode to overwrite your scores in the future if you improve it. \n
        Replace your current score on the leaderboard taken on ${identicalEntries[0].date} with this one?`
      );
    } else {
      overwrite = confirm(
        `WARNING -- This name is already on the leaderboard and currently has a better score of, ${prevLeaderboardEntry.score}. Do you still want to update this score? This is not recommended.`
      );
      if (overwrite) {
        overwrite = confirm(
          `Are you still sure you want to do this? This means that you will be updating your current better score on the leaderboard with this weaker one.`
        );
      }

      if (overwrite) {
        overwrite = confirm(
          `Please confirm one more time -- this action is irreversible!`
        );
      }
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
