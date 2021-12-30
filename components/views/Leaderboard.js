import html from "html-literal";

export default st => html`
  <section id="leaderboard-page">
    <h2 id="leaderboard-header">Score Leaderboard</h2>
    <p style="font-size:small">
      Note: If name has * before it, enough game slowdown was detected that
      could have given the player an advantage, and so these names are placed at
      the bottom of the leaderboard. For more information, see "Known Bugs".
    </p>
    <button class="refresh default-button" id="refresh-top">
      Refresh Leaderboard
    </button>
    <h2 style="color:black">Ranked</h2>
    <table id="ranked-table">
      <tr style="color:black">
        <th>RANK</th>
        <th>SCORE</th>
        <th>NAME</th>
        <th>SURVIVED</th>
        <th>BEST CHAIN</th>
        <th>BLOCKS CLEARED</th>
        <th>DATE</th>
        <th>TIME</th>
      </tr>
      <span id="ranked-scores-display">${st.markup}</span>
    </table>

    <button class="refresh default-button">
      Refresh Leaderboard
    </button>
  </section>
`;
