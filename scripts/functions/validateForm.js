import axios from "axios";
import * as state from "../../store";
import { deleteEntry } from "../../index";
import { leaderboard } from "../global";
import { displayError } from "../../puzzleleague";

export function validateForm(value, score) {
  console.log("firing value", value);
  let identicalEntries = [];
  let overwrite = false;
  leaderboard.data.forEach(entry => {
    if (value === entry.name) {
      identicalEntries.push({
        score: entry.score,
        _id: entry._id
      });
    }
  });
  console.log("identical entries", identicalEntries);
  let informIfLessThanLeaderboard = "";
  if (identicalEntries.length > 3) {
    if (score < identicalEntries[2].score)
      informIfLessThanLeaderboard =
        "This score is also lower than all of your other scores. ";
    overwrite = confirm(
      `This name is already on the leaderboard 3 times. You will need to overwrite the lowest score. ${informIfLessThanLeaderboard}Continue?`
    );
    if (overwrite) {
      console.log(identicalEntries[2]);
      console.log(identicalEntries[2]._id);
      if (
        identicalEntries[2]._id !==
        leaderboard.data[leaderboard.data.length - 1]._id
      )
        deleteEntry(identicalEntries[2]._id);
      return true;
    }
    return false;
  }
  return true;
}
