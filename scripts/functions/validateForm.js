export function validateForm(value, rankedData) {
  let regex = /^[a-z0-9]+$/i;
  let count = 0;
  if (!regex.test(value)) {
    return "name must be alphanumeric";
  }

  let names = [];
  names.forEach(name => {
    names.push(rankedData[name]);
  });

  for (let name of names) {
    if (value === name) {
      count++;
      if (count == 3) {
        return "there are too many of the same name on the leaderboard. You will need to overwrite the lowest score of this name. Continue?";
      }
    }
  }
}
