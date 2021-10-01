export function validateForm(value, rankedData) {
  console.log("firing");
  let identicalEntries = [];
  let overwrite = false;
  rankedData.forEach(name => {
    if (value === name) {
      identicalEntries.push({
        score: rankedData.score,
        id: rankedData.id
      });
    }
  });
  if (identicalEntries.length > 3) {
    overwrite = confirm(
      `"${value}" is already on the leaderboard 3 times.\nYou will need to overwrite their lowest score of ${identicalEntries[2].score}in order to post this new one.\nContinue?`
    );
    if (overwrite) {
    }
  }

  for (let i in rankedData.names) {
    if (value === names[i]) {
      count++;
      if (count == 3) {
        return "there are too many of the same name on the leaderboard. You will need to overwrite the lowest score of this name, which is. Continue?";
      }
    }
  }
}
