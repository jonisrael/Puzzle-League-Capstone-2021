import { leaderboard } from "../global";

export function validateForm(value, score) {
  let identicalEntries = [];
  let overwrite = false;
  leaderboard.data.forEach(entry => {
    if (value === entry.name) {
      identicalEntries.push({
        name: entry.name,
        score: entry.score,
        _id: entry._id
      });
    }
  });
  console.log("identical entries", identicalEntries);
  let informIfLessThanLeaderboard = "";
  if (identicalEntries.length > 2) {
    if (score < identicalEntries[2].score)
      informIfLessThanLeaderboard =
        "This score is also lower than all of your other scores. ";
    overwrite = confirm(
      `This name is already on the leaderboard 3 times. You will need to overwrite the lowest score. ${informIfLessThanLeaderboard}Continue?`
    );
    if (overwrite) {
      console.log(identicalEntries);
      console.log(identicalEntries[2]._id);
      for (let i = leaderboard.data.length - 1; i > -1; i--) {
        if (leaderboard.data[i].name === identicalEntries[2].name) return i;
      }
      return -1;
    }
    return -1;
  }
  return leaderboard.data.length - 1;
}
