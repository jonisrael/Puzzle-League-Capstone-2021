export function populateLeaderboardPage(sortedData) {
  let leaderboardInfo = "";
  console.log(sortedData);
  for (let entry of sortedData) {
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
    leaderboardInfo += `|  ${name}  |  ${score}  |  ${entry.duration}  |  ${entry.largestChain}  |  ${entry.totalClears}  |  ${entry.month}/${entry.day}/${entry.year} ${entry.hour}:${entry.minute} ${entry.meridian}  |<br>`;
  }
  console.log(leaderboardInfo);
  return leaderboardInfo;
}
